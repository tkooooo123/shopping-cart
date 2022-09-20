const express = require('express')
const router = express.Router()
const cartController = require('../../controllers/cart-controller')
router.get('/', cartController.getCarts)

module.exports = router