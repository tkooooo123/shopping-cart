const db = require('../models')
const { Cart, Order, OrderItem } = db
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
          
            return res.redirect('/')
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = orderController