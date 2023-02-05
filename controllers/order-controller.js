const orderService = require('../services/orderService')
const orderController = {
    postOrder:  (req, res) => {
       orderService.postOrder(req, res, data => {
        console.log(data)
        return res.redirect(`/orders/${data.order.id}/payment`)
       })
    },
    getOrder: (req, res) => {
        orderService.getOrder(req, res, data => {
            return res.render('orders', data)
        })
    },
    cancelOrder: (req, res) => {
        orderService.cancelOrder(req, res, data => {
            return res.redirect('back')
        })
    },
    getPayment:  (req, res) => {
       orderService.getPayment(req, res, data => {
        return res.render('payment', data)
       })
    },
    newebpayCallback:  (req, res) => {
        orderService.newebpayCallback(req, res, data => {
            if(data.status !== 'success') {
                req.flash('error_messages', data.message)
            } else {
                req.flash('success_messages', data.message)
            }
            return res.redirect(`${process.env.returnURL}`)
        })
    }
}

module.exports = orderController