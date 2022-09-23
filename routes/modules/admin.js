const express = require('express')
const { editProduct } = require('../../controllers/admin-controller')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')


router.get('/products', adminController.getProducts)
router.get('/product/add', adminController.addProduct)
router.get('/product/:id', adminController.getProduct)
router.post('/product', upload.single('image'), adminController.postProduct)
router.delete('/product/:id/delete', adminController.deleteProduct)
router.get('/product/:id/edit', adminController.editProduct)
router.put('/product/:id', upload.single('image'), adminController.putProduct)


router.get('/', (req, res) => {
    res.redirect('/admin/products')
})


module.exports = router