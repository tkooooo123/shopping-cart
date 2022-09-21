const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart-controller')
router.get('/', cartController.getCarts)
router.post('/', cartController.postCart)
router.get('/checkout', cartController.checkoutCart)
router.post('/cartItem/:id/add', cartController.addCartItem)

module.exports = router