const productService = require('../../services/productService')
const productController = {
    getProducts: (req, res, next) => {
        productService.getProducts(req, res, (data) => {
            return res.json(data)
        }, (error) => {
            next(error)
        })
    },
    getProduct: (req, res, next) => {
        productService.getProduct(req, res, (data) => {
            return res.json(data)
        }, (error) => {
            next (error)
        })
    }
}
module.exports = productController