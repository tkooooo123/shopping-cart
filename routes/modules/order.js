const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

router.get('/', orderController.getOrder)
router.post('/', orderController.postOrder)

module.exports = router