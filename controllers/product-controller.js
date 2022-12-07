const db = require('../models')
const { Product, Category } = db
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Op } = require('sequelize')
const productService = require('../services/productService')
const productController = {
    getProducts:  (req, res) => {
        productService.getProducts(req, res, (data) => {
            return res.render('products',(data))
        })
    },
    getProduct: async (req, res) => {
       productService.getProduct(req, res, (data) => {
        return res.render('product', data)
       })
    }

}

module.exports = productController