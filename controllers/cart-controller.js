const db = require('../models')
const { Cart, CartItem } = db
const { Op } = require("sequelize")
const cartController = {
    getCarts: async (req, res) => {
        try {
            let carts = {}
            if (req.user) {
                const userCarts = await Cart.findAll({
                    include: 'cartProducts',
                    where: {[Op.or]: [{userId: req.user.id}, {id: req.session.cartId}] },
                    nest: true,
                    raw: true
                })
                carts = userCarts
            } else {
                const userCarts = await Cart.findAll({
                    include: 'cartProducts',
                    where: { id: req.session.cartId || null },
                    nest: true,
                    raw: true
                })
                carts = userCarts
            }
            return res.render('carts', {
                carts
            })
        } catch (error) {
            console.log(error)
        }
    },
    postCart: async (req, res) => {
        try {
            let cart = {}
            if (req.user) {
                const [userCart] = await Cart.findOrCreate({
                    where: { userId: req.user.id || 0 },

                })
                cart = userCart
            } else {
                const [userCart] = await Cart.findOrCreate({
                    where: {
                        id: req.session.cartId || 0
                    },
                    defaults: {
                        userId: 0
                    }

                })
                cart = userCart
            }

            const [cartItem] = await CartItem.findOrCreate({
                where: {
                    cartId: cart.id,
                    productId: req.body.productId
                },
                defaults: {
                    quantity: 0
                }
            })
            await cartItem.update({
                quantity: (cartItem.quantity) + Number(req.body.quantity)
            })
            console.log(req.user)
            req.session.cartId = cart.id //save cartId in session
            return res.redirect('back')
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = cartController