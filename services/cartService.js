const db = require('../models')
const { Cart, CartItem, Product, Category } = db
const { Op } = require("sequelize")
const category = require('../models/category')
const cartService = {
    getCarts: async (req, res, cb) => {
        try {
 
            let carts = {}
         
            if (req.user) {
                const userCarts = await Cart.findAll({
                    include: { model: Product , as: "cartProducts" , include: Category },
                    where: { userId: req.user.id  },
                    nest: true,
                    raw: true
                })
                carts = userCarts
            } else {
                const userCarts = await Cart.findAll({
                    include: 'cartProducts',
                    where: { id: req.query.cartId || null },
                    nest: true,
                    raw: true
                })
                carts = userCarts
            }
            let totalPrice = carts.length > 0 ? carts.map(d =>
                d.cartProducts.price * d.cartProducts.CartItem.quantity)
                .reduce((a, b) => a + b) : 0
            return cb({
                carts,
                totalPrice,

            })
        } catch (error) {
            console.log(error)
        }
    },
    postCart: async (req, res, cb) => {
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

            let getCartId = ''
            if(!req.user) {
                req.session.cartId = cart.id //save cartId in session
                getCartId = cart.id
                
            }
            return cb({
                status: 'success',
                message: '已加入購物車!',
                cart,
                getCartId
            })
            //return res.redirect('back')
        } catch (error) {
            console.log(error)
        }
    },
    checkoutCart: async (req, res, cb) => {
        try {
            if (!req.user) {
                req.flash('error_messages', '使用者尚未登入，請先登入!')
                return res.status(401).redirect('/signin')
            }
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
            if(carts.length === 0) {
                req.flash('error_messages', '購物車是空的，請先新增商品!')
                return res.status(400).redirect('back')
            }

            let totalPrice = carts.length > 0 ? carts.map(d =>
                d.cartProducts.price * d.cartProducts.CartItem.quantity)
                .reduce((a, b) => a + b) : 0

            return cb({
                carts,
                totalPrice,
            })
        } catch (error) {
            console.log(error)
        }
    },
    addCartItem: async (req, res, cb) => {
        try {
            const cartItem = await CartItem.findByPk(req.params.id)
            const product = await Product.findByPk(cartItem.productId)
            if(product.quantity > cartItem.quantity) {
                await cartItem.update({
                    quantity: cartItem.quantity + 1
                })
            }
            return cb({
                status: "success",
                message: "The cartItem's quantity was successfully added!"
            })
        } catch (error) {
            console.log(error)
        }
    },
    subCartItem: async (req, res, cb) => {
        try {
            const cartItem = await CartItem.findByPk(req.params.id)
            if (cartItem.quantity > 1) {
                await cartItem.update({
                    quantity: cartItem.quantity - 1
                })
            }
            return cb ({
                status: "success",
                message: "The cartItem's quantity was successfully reduced!"
            })
        } catch (error) {
            console.log(error)
        }
    },
    updateCartItem: async (req, res, cb) => {
        try {
            const cartItem = await CartItem.findByPk(req.params.id)
           
                await cartItem.update({
                    quantity: req.body.quantity
                })
            
            return cb ({
                status: "success",
                message: "The cartItem's quantity was successfully reduced!"
            })
        } catch (error) {
            console.log(error)
        }
    },
    deleteCartItem: async (req, res, cb) => {
        try {
            const cartItem = await CartItem.findByPk(req.params.id)
            if(!cartItem) {
                return cb({
                    status: "error",
                    statusCode: "500",
                    message:"找不到此項商品"
                })
            }
            const cartId = cartItem.cartId
            await cartItem.destroy()

            const cart = await Cart.findByPk(cartId, {
                include: 'cartProducts',

            })

            if (cart.cartProducts.length === 0) {
                await cart.destroy()
            }
      
            return cb({
                cart,
                status: "success",
                message: "已刪除商品!"
            })
        } catch (error) {
            console.log(error)
        }
    },
    deleteCart: async (req, res, cb) => {
        try {
            const cart = await Cart.findByPk(req.params.id);
            if(!cart) {
                return cb({
                    status: "error",
                    statusCode: "500",
                    message:"購物車不存在"
                })
            }
            await cart.destroy()
            return cb({
                status: "success",
                message: "已刪除所有商品"
            })
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = cartService