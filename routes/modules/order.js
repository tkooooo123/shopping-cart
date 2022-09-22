const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

router.get('/', orderController.getOrder)
router.post('/', orderController.postOrder)
router.put('/:id/cancel', orderController.cancelOrder)
router.get('/:id/payment', orderController.getPayment)

module.exports = router