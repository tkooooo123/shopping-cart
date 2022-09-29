const db = require('../models')
const { Product, Category } = db
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const productController = {
    getProducts: async(req, res) => {
        try {
            const categoryId = Number(req.query.categoryId) || ''
            const products = await Product.findAll({
                include: Category ,
                where: {
                    ...categoryId ? { categoryId } : {}
                },
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
            const endIndex = offset +limit
            const total = products.length

            return res.render('products',{ 
                products: products.slice(offset, endIndex),
                categories,
                categoryId,
                pagination: getPagination(limit, page, total)
             })
        } catch (error) {
            console.log(error)
        }
    },
    getProduct: async(req, res) => {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: Category,
                nest: true,
                raw: true
            })
            let quantity = ''
            quantity = await Array.from({ length: product.quantity}).map((v, i) => ( i + 1))
            
            return res.render('product', {  
                product,
                quantity
            })

        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = productController