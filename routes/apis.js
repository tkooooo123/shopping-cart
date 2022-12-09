const express = require('express')
const router = express.Router()
const productController = require('../controllers/api/productController')
const cartController = require('../controllers/api/cartController')
const orderController = require('../controllers/api/orderController')
const adminController = require('../controllers/api/adminController')
const upload = require('../middleware/multer')

router.get('/products', productController.getProducts)
router.get('/products/:id', productController.getProduct)
router.get('/carts', cartController.getCarts)
router.post('/carts', cartController.postCart)
router.get('/carts/checkout', cartController.checkoutCart)
router.post('/carts/cartItem/:id/add', cartController.addCartItem)
router.post('/carts/cartItem/:id/sub', cartController.subCartItem)
router.delete('/carts/cartItem/:id/delete', cartController.deleteCartItem)
router.get('/orders', orderController.getOrder)
router.post('/orders', orderController.postOrder)
router.put('/orders/:id/cancel', orderController.cancelOrder)
router.get('/orders/:id/payment', orderController.getPayment)

router.get('/admin/products', adminController.getProducts)
router.get('/admin/product/add', adminController.addProduct)
router.get('/admin/product/:id', adminController.getProduct)
router.post('/admin/product', upload.single('image'), adminController.postProduct)
router.delete('/admin/product/:id/delete', adminController.deleteProduct)
router.get('/admin/product/:id/edit', adminController.editProduct)
router.put('/admin/product/:id', upload.single('image'), adminController.putProduct)
router.get('/admin/categories', adminController.getCategories)
router.post('/admin/category', adminController.addCategory)
router.get('/admin/categories/:id', adminController.editCategory)
router.put('/admin/categories/:id', adminController.putCategory)
router.delete('/admin/categories/:id', adminController.deleteCategory)
router.get('/admin/orders', adminController.getOrders)
router.get('/admin/orders/:id', adminController.editOrder)
router.put('/admin/orders/:id', adminController.putOrder)
router.put('/admin/orders/:id/cancel', adminController.cancelOrder)

module.exports = router