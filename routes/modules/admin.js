const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')


router.get('/products', adminController.getProducts)
router.get('/', (req, res) => {
    res.redirect('/admin/products')
})


module.exports = router