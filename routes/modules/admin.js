const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')


router.get('/products', adminController.getProducts)
router.get('/product/add', adminController.addProduct)
router.get('/product/:id', adminController.getProduct)
router.post('/product', upload.single('image'), adminController.postProduct)


router.get('/', (req, res) => {
    res.redirect('/admin/products')
})


module.exports = router