const db = require('../models')
const { Product, Category } = db
const adminController = {
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
        return res.render('admin/products',{ 
            products,
            categories,
            categoryId
         })
    } catch (error) {
        console.log(error)
    }
},
getProduct: async(req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            raw: true
        })

        return res.render('admin/product', {
            product
        })
    } catch (error) {
        console.log(error)
    }
}

}


module.exports = adminController