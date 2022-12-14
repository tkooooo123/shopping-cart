const db = require('../models')
const cartService = require('../services/cartService')
const cartController = {
    getCarts: (req, res) => {
        cartService.getCarts(req, res, data => {
            return res.render('carts', data)
        })
    },
    postCart: (req, res) => {
        cartService.postCart(req, res, data => {
            req.flash('success_messages', data['message'])
            return res.redirect('back')
        })
    },
    checkoutCart: (req, res) => {
        cartService.checkoutCart(req, res, data => {
            return res.render('cart-checkout', data)
        })
    },
    addCartItem: (req, res) => {
        cartService.addCartItem(req, res, data => {
            return res.redirect('back')
        })
    },
    subCartItem: (req, res) => {
        cartService.subCartItem(req, res, data => {
            return res.redirect('back')
        })
    },
    deleteCartItem: (req, res) => {
        cartService.deleteCartItem(req, res, data => {
            return res.redirect('back')
        })
    }    
}

module.exports = cartController