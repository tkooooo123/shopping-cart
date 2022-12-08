const express = require('express')
const router = express.Router()
const productController = require('../controllers/api/productController')
const cartController = require('../controllers/api/cartController')

router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)
router.get('/carts', cartController.getCarts)
router.post('/carts', cartController.postCart)
router.get('/carts/checkout', cartController.checkoutCart)
router.post('/carts/cartItem/:id/add', cartController.addCartItem)
router.post('/carts/cartItem/:id/sub', cartController.subCartItem)
router.delete('/carts/cartItem/:id/delete', cartController.deleteCartItem)

module.exports = router