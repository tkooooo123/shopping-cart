const cartService = require('../../services/cartService')
const cartController = {
    getCarts: (req, res) => {
        cartService.getCarts(req, res, data => {
            return res.json(data)
        })
    },
    postCart: (req, res) => {
        cartService.postCart(req, res, data => {
            return res.json(data)
        })
    },
    checkoutCart: (req, res) => {
        cartService.checkoutCart(req, res, data => {
            return res.json(data)
        })
    },
    addCartItem: (req, res) => {
        cartService.addCartItem(req, res, data => {
            return res.json(data)
        })
    },
    subCartItem: (req, res) => {
        cartService.subCartItem(req, res, data => {
            return res.json(data)
        })
    },
    deleteCartItem: (req, res) => {
        cartService.deleteCartItem(req, res, data => {
            return res.json(data)
        })
    }    
}

module.exports = cartController