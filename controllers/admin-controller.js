const db = require('../models')
const { Product, Category } = db
const { localFileHandler } = require('../helpers/file-helpers')
const adminController = {
    getProducts: async (req, res) => {
        try {
            const categoryId = Number(req.query.categoryId) || ''
            const products = await Product.findAll({
                include: Category,
                where: {
                    ...categoryId ? { categoryId } : {}
                },
                nest: true,
                raw: true
            })
            const categories = await Category.findAll({
                raw: true
            })
            return res.render('admin/products', {
                products,
                categories,
                categoryId
            })
        } catch (error) {
            console.log(error)
        }
    },
    getProduct: async (req, res) => {
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
    },
    addProduct: async (req, res) => {
        try {
            const categories = await Category.findAll({
                raw: true
            })

            return res.render('admin/create-product', {
                categories
            })

        } catch (error) {
            console.log(error)
        }
    },
    postProduct: async (req, res) => {
        try {
            const { name, categoryId, image, description, quantity, price } = req.body
            const { file } = req
            const filePath = await localFileHandler(file)
            await Product.create({
                name,
                categoryId,
                image: filePath || null,
                description,
                quantity,
                price
            })
            return res.redirect('/admin/products')
        } catch (error) {
            console.log(error)
        }
    },
    editProduct: async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: Category,
                nest: true,
                raw: true
            })
            const categories = await Category.findAll({
                nest: true,
                raw: true
            })
            console.log(product)

            return res.render('admin/edit-product', {
                product,
                categories
            })
        } catch (error) {
            console.log(error)
        }
    },
    putProduct: async (req, res) => {
        try {
            const { name, categoryId, description, quantity, price } = req.body
            const { file } = req
            const filePath = await localFileHandler(file)
            const product = await Product.findByPk(req.params.id)
            console.log('asdasdada', product)
            console.log(req.body) 

                await product.update({
                    name,
                    categoryId,
                    image: filePath || product.image,
                    description,
                    quantity,
                    price
                })
           
            return res.redirect('/admin/products')

        } catch (error) {
            console.log(error)
        }
    },
    deleteProduct: async(req, res) => {
        try {
            const product = await Product.findByPk(req.params.id)
            await product.destroy()

            return res.redirect('/admin/products')

        } catch (error) {
            console.log(error)
        }
    },
    getCategories: async(req, res) => {
        try {
            const categories = await Category.findAll({
                nest: true,
                raw: true
            })
            return res.render('admin/categories', { categories })
        } catch (error) {
            console.log(error)
        }

    }
}


module.exports = adminController