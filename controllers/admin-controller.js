const db = require('../models')
const { Product, Category, Order } = db
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
    },
    addCategory: async(req, res, next) => {
        try {
            const { name } = req.body
            const category= await Category.findOne({
                where: { name }
            })
            if(category) throw new Error("此分類名稱已存在!")

            await Category.create({
                name
            })

            return res.redirect('/admin/categories')
        } catch (error) {
            console.log(error)
            return next(error)
        }
    },
    editCategory: async(req, res) => {
        try {
            const categories = await Category.findAll({
                nest: true,
                raw: true
            })
            const category = await Category.findByPk(req.params.id,{
                raw: true
            })
            return res.render('admin/categories', { 
                categories,
                category })
        } catch (error) {
            console.log(error)
        }

    },
    putCategory: async(req, res, next) => {
        try {
            const { name } = req.body
            const data = await Category.findOne({
                where: { name }
            })
            if (data) throw new Error("此分類名稱已存在!")
            const category = await Category.findByPk(req.params.id)
            await category.update({
                name
            })
            return res.redirect('/admin/categories')
        } catch (error) {
            console.log(error)
            next(error)
        }
    },
    deleteCategory: async(req, res) => {
        try {
            const category = await Category.findByPk(req.params.id)
            await category.destroy()
            return res.redirect('/admin/categories')
        } catch (error) {
            console.log(error)
        }
    },
    getOrders: async(req, res) => {
        try {
            const { payment , shipment } = req.query  
            let filter = {}
            if(payment && payment !== 'all') {
                filter = {
                    payment_status: payment
                }
            }
            if(shipment && shipment !== 'all') {
                filter = {
                    shipping_status: shipment
                }
            }

            const orders = await Order.findAll({
                where: filter,
                nest: true,
                raw: true
            })

            return res.render('admin/orders', { 
                orders,
                payment,
                shipment
             })
        } catch (error) {
            console.log(error)
        }
    },
    editOrder: async(req, res) => {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: 'orderProducts',
            })
            let totalPrice = 0
            
            await order.orderProducts.forEach(e => {
                totalPrice += e.price * e.OrderItem.quantity
              })

            console.log(order.toJSON())
            return res.render('admin/edit-order', {
                order: order.toJSON(),
                totalPrice
            })
        } catch (error) {
            console.log(error)
        }
    },
    putOrder: async(req, res) => {
        try {
            const { payment, shipment } = req.body
            const order = await Order.findByPk(req.params.id)
            await order.update({
                payment_status: payment,
                shipping_status: shipment
            })
            return res.redirect('/admin/orders')
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = adminController