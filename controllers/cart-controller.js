const db = require('../models')
const { Cart, CartItem, Product } = db
const { Op } = require("sequelize")
const cartController = {
    getCarts: async (req, res) => {
        try {
            let carts = {}
            if (req.user) {
                const userCarts = await Cart.findAll({
                    include: 'cartProducts',
                    where: { [Op.or]: [{ userId: req.user.id || null }, { id: req.session.cartId || null }] },
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
            console.log(carts)
            console.log(req.session.cartId)


            let totalPrice = carts.length > 0 ? carts.map(d =>
                d.cartProducts.price * d.cartProducts.CartItem.quantity)
                .reduce((a, b) => a + b) : 0

            return res.render('carts', {
                carts,
                totalPrice
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

            if(!req.user) {
                req.session.cartId = cart.id //save cartId in session
            }
            
            return res.redirect('back')
        } catch (error) {
            console.log(error)
        }
    },
    checkoutCart: async (req, res) => {
        try {
            let carts = {}
            if (req.user) {
                const userCarts = await Cart.findAll({
                    include: 'cartProducts',
                    where: { [Op.or]: [{ userId: req.user.id }, { id: req.session.cartId || null }] },
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

            let totalPrice = carts.length > 0 ? carts.map(d =>
                d.cartProducts.price * d.cartProducts.CartItem.quantity)
                .reduce((a, b) => a + b) : 0

            return res.render('cart-checkout', {
                carts,
                totalPrice,
            })
        } catch (error) {
            console.log(error)
        }
    },
    addCartItem: async (req, res) => {
        try {
            const cartItem = await CartItem.findByPk(req.params.id)
            const product = await Product.findByPk(cartItem.productId)
            if(product.quantity > cartItem.quantity) {
                await cartItem.update({
                    quantity: cartItem.quantity + 1
                })
            }
            return res.redirect('back')
        } catch (error) {
            console.log(error)
        }
    },
    subCartItem: async (req, res) => {
        try {
            const cartItem = await CartItem.findByPk(req.params.id)
            if (cartItem.quantity > 1) {
                await cartItem.update({
                    quantity: cartItem.quantity - 1
                })
            }
            return res.redirect('back')
        } catch (error) {
            console.log(error)
        }
    },
    deleteCartItem: async (req, res) => {
        try {
            const cartItem = await CartItem.findByPk(req.params.id)
            const cartId = cartItem.cartId
            await cartItem.destroy()

            const cart = await Cart.findByPk(cartId, {
                include: 'cartProducts',

            })

            if (cart.cartProducts.length === 0) {
                await cart.destroy()
            }
      
            return res.redirect('back')
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = cartController