const db = require('../models')
const { Product, Category } = db
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { Op } = require('sequelize')
const productService = {
    getProducts: async (req, res, cb) => {
        try {
            let whereQuery = {}
            let keyword = req.query.keyword 
            let categoryId
            if (keyword) {
                keyword = req.query.keyword.trim()
                whereQuery.name = { [Op.like]: '%' + keyword + '%' }
            }
            if (req.query.categoryId) {
                categoryId = Number(req.query.categoryId)
                whereQuery.categoryId = categoryId || null
            }

            const products = await Product.findAll({
                include: Category,
                where: {
                    [Op.and]: [
                        {
                            is_enabled: true
                        },  
                            whereQuery             
                    ]
                },
                order: [['createdAt', 'DESC']],
                nest: true,
                raw: true
            })
            const categories = await Category.findAll({
                raw: true
            })
        
            //paginator
            const DEFAULT_LIMIT = 12
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const endIndex = offset + limit
            const total = products.length
            const arr = products.map((product) => {
                const item = {
                 ...product,
                 imagesUrl: JSON.parse(product.imagesUrl)
                }
                return item
             })

            return cb( {
                products: arr.slice(offset, endIndex),
                categories,
                categoryId,
                pagination: getPagination(limit, page, total),
                keyword,
                totalProducts: arr
            })
        } catch (error) {
            console.log(error)
        }
    },
    getProduct: async (req, res, cb) => {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: Category,
                nest: true,
                raw: true
            })
            let quantity = ''
            quantity = await Array.from({ length: product.quantity }).map((v, i) => (i + 1))

            return cb({
                product: {
                    ...product,
                    imagesUrl: JSON.parse(product.imagesUrl)
                },
                quantity
            })

        } catch (error) {
            console.log(error)
        }
    },
  

}

module.exports = productService