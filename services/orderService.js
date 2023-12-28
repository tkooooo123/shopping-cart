const db = require('../models')
const { Cart, Order, OrderItem, CartItem, Payment, User, Product } = db
const { Op } = require('sequelize')
const { getData, decryptedData } = require('../utils/payment')
const { orderConfirmMail, paymentConfirmMail } = require('../utils/mail')
const orderService = {
    postOrder: async (req, res, cb) => {
        try {
            const carts = await Cart.findAll({
                include: 'cartProducts',
                where: { [Op.or]: [{ userId: req.user.id }, { id: req.session.cartId || null }] },
                nest: true,
                raw: true
            })
            const osn = 'BA'+ Date.now()
            const order = await Order.create({
                
                UserId: req.user.id,
                name: req.body.name,
                address: req.body.address,
                phone: req.body.phone,
                amount: req.body.amount,
                shipping_status: req.body.shipping_status,
                payment_status: req.body.payment_status,
                email: req.body.email,
                message: req.body.message,
                osn
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
            // await orderConfirmMail(order)

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


            //destroy cart
            const itemCart = await Cart.findByPk(carts[0].id)
            await itemCart.destroy()


            return cb({ order: order.toJSON() })

        } catch (error) {
            console.log(error)
        }
    },
    getOrders: async (req, res, cb) => {
        try {
            if (!req.user) {
                req.flash('error_messages', '使用者尚未登入，請先登入!')
                return res.status(401).redirect('/signin')
            }
            let [orders] = await Promise.all([
                Order.findAll({
                    where: { userId: req.user.id },
                    include: 'orderProducts',
                    order: [['createdAt', 'DESC']]

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
                    email: order.email,
                    message: order.message,
                    payment_status: order.payment_status,
                    shipping_status: order.shipping_status,
                    orderProducts: order.orderProducts,
                    createdAt: order.createdAt.toLocaleDateString(),
                    osn: order.osn

                }
            })
            return cb({
                orders
            })
        } catch (error) {
            console.log(error)
        }
    },
    getOrder: async (req, res, cb) => {
        try {
            const order = await Order.findOne({
                where: { id: req.params.id },
                include: 'orderProducts'
            })

            return cb({
                order
            })
        } catch (error) {
            console.log(error)
        }
    },
    cancelOrder: async (req, res, cb) => {
        try {
            const order = await Order.findByPk(req.params.id)
            await order.update({
                payment_status: '-1',
                shipping_status: '-1'
            })
            return cb()
        } catch (error) {
            console.log(error)
        }
    },
    getPayment: async (req, res, cb) => {
        try {
            const order = await Order.findByPk(req.params.id)
            const tradeInfo = getData(order.amount, 'Product', req.user.email)
            await order.update({
                sn: tradeInfo.MerchantOrderNo
            })
            console.log(tradeInfo)
            return cb({
                order: order.toJSON(),
                tradeInfo
            })
        } catch (error) {
            console.log(error)
        }
    },
    newebpayCallback: async (req, res, cb) => {
        try {
            const data = JSON.parse(decryptedData(req.body.TradeInfo))
            const sn = data.Result.MerchantOrderNo
            const order = await Order.findOne({
                where: { sn },
                include: User
            })
            if (!order) {
                return cb({
                    status: "error",
                    message: "The order doesn't exist!"
                })
            }
            await Payment.findOrCreate({
                where: { params: sn },
                defaults: {
                    orderId: order.id,
                    payment_method: data.Result.PaymentType,
                    paid_at: data.Status === 'SUCCESS' ? Date.now() : null,
                    params: sn
                }
            })

            if (data.Status === 'SUCCESS') {
                await order.update({
                    payment_status: 1
                })
                //send payment completed mail 
                await paymentConfirmMail(order)

                return cb({
                    status: "success",
                    message: `Payment for order ${order.id} was completed!`
                })
            } else {
                return cb({
                    status: "error",
                    message: `Payment for order ${order.id} was failed, because ERROR[${data.Status}]: ${data.Message}`
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = orderService