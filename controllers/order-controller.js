const db = require('../models')
const { Cart, Order, OrderItem, CartItem, Payment, User, Product } = db
const { Op } = require('sequelize')
const { getData, decryptedData } = require('../utils/payment')
const { orderConfirmMail, paymentConfirmMail } = require('../utils/mail')
const orderController = {
    postOrder: async (req, res) => {
        try {

            const carts = await Cart.findAll({
                include: 'cartProducts',
                where: { [Op.or]: [{ userId: req.user.id }, { id: req.session.cartId || null }] },
                nest: true,
                raw: true
            })
            const order = await Order.create({
                UserId: req.user.id,
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                amount: req.body.amount,
                shipping_status: req.body.shipping_status,
                payment_status: req.body.payment_status
            })
            const items = Array.from({ length: carts.length }).map((d, i) => (
                OrderItem.create({
                    orderId: order.id,
                    productId: carts[i].cartProducts.id,
                    quantity: carts[i].cartProducts.CartItem.quantity,
                    price: carts[i].cartProducts.price
                })
            ))
            await Promise.all(items)
            //send order confirm mail
            await orderConfirmMail(order)
            
            //decrease the inventory of product while order generated
            const productMap = new Map()
            carts.forEach(product => {
                productMap.set(product.cartProducts.id, product.cartProducts.CartItem.quantity)
            })
            for (const [id, quantity] of productMap) {
                const product = await Product.findByPk(id)
                await product.update({
                    quantity: product.quantity - quantity
                })
            }

            //clear cartItems in cart
            await carts.map(async (cart) => {
                const cartItem = await CartItem.findByPk(cart.cartProducts.CartItem.id)
                const cartId = cartItem.cartId
                await cartItem.destroy()

                //destroy cart
                const itemCart = await Cart.findByPk(cartId, {
                    include: 'cartProducts'
                })
                if (itemCart.cartProducts.length === 0) {
                    await itemCart.destroy()
                }
            })
            
            return res.redirect(`/orders/${order.id}/payment`)
        } catch (error) {
            console.log(error)
        }
    },
    getOrder: async (req, res) => {
        try {
            let [orders] = await Promise.all([
                Order.findAll({
                    where: { userId: req.user.id },
                    include: 'orderProducts',

                })

            ])
            orders = orders.map(order => {
                order = order.get({ plain: true })
                return {
                    id: order.id,
                    amount: order.amount,
                    name: order.name,
                    phone: order.phone,
                    address: order.address,
                    payment_status: order.payment_status,
                    shipping_status: order.shipping_status,
                    orderProducts: order.orderProducts
                }
            })
            return res.render('orders', {
                orders
            })
        } catch (error) {
            console.log(error)
        }
    },
    cancelOrder: async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id)
            await order.update({
                payment_status: '-1',
                shipping_status: '-1'
            })
            return res.redirect('back')
        } catch (error) {
            console.log(error)
        }
    },
    getPayment: async (req, res) => {
        try {
            const order = await Order.findByPk(req.params.id)
            const tradeInfo = getData(order.amount, 'Product', req.user.email)
            await order.update({
                sn: tradeInfo.MerchantOrderNo
            })
            console.log(tradeInfo)
            return res.render('payment', {
                order: order.toJSON(),
                tradeInfo
            })
        } catch (error) {
            console.log(error)
        }
    },
    newebpayCallback: async (req, res) => {
        try {
            const data = JSON.parse(decryptedData(req.body.TradeInfo))
            const sn = data.Result.MerchantOrderNo
            const order = await Order.findOne({
                where: { sn },
                include: User
            })

            await order.update({
                payment_status: 1
            })

            await Payment.findOrCreate({
                where: { params: sn },
                defaults: {
                    orderId: order.id,
                    payment_method: data.Result.PaymentType,
                    paid_at: data.Status === 'SUCCESS' ? Date.now() : null,
                    params: sn
                }
            })

            //send payment completed mail 
            await paymentConfirmMail(order)

            return res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = orderController