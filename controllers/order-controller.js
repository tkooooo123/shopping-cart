const db = require('../models')
const { Cart, Order, OrderItem, CartItem } = db
const { Op } = require('sequelize') 
const orderController = {
    postOrder: async(req, res) => {
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
            const items = Array.from({ length: carts.length}).map((d, i) => (
                OrderItem.create({
                    orderId: order.id,
                    productId: carts[i].cartProducts.id,
                    quantity:carts[i].cartProducts.CartItem.quantity,
                    price: carts[i].cartProducts.price
                })
            ))
            Promise.all(items)

            //clear cartItems in cart
            await carts.map(async(cart) => {
                const cartItem = await CartItem.findByPk(cart.cartProducts.CartItem.id)
                 cartItem.destroy()
            })
            
            console.log(carts[0].cartProducts.CartItem.id)
          
            return res.redirect('/orders')
        } catch (error) {
            console.log(error)
        }
    },
    getOrder: async(req, res) =>{
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
    cancelOrder: async(req, res) => {
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
    }

}

module.exports = orderController