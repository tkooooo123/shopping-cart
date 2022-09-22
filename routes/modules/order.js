const express = require('express')
const router = express.Router()
const orderController = require('../../controllers/order-controller')

router.get('/', orderController.getOrder)
router.post('/', orderController.postOrder)
router.put('/:id/cancel', orderController.cancelOrder)

module.exports = router