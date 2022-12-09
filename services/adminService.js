const db = require('../models')
const { Product, Category, Order } = db
const { localFileHandler } = require('../helpers/file-helpers')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const adminController = {
    getProducts: async (req, res, cb) => {
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
            //paginator
            const DEFAULT_LIMIT = 10
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const endIndex = offset +limit
            const total = products.length


            return cb({
                products: products.slice(offset, endIndex),
                categories,
                categoryId,
                pagination: getPagination(limit, page, total)
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
            if(!product) {
                return cb({
                    status: "error",
                    message: "The product does not exist!"
                })
            }

            return cb({
                product
            })
        } catch (error) {
            console.log(error)
        }
    },
    addProduct: async (req, res, cb) => {
        try {
            const categories = await Category.findAll({
                raw: true
            })

            return cb({
                categories
            })

        } catch (error) {
            console.log(error)
        }
    },
    postProduct: async (req, res, cb) => {
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
            return cb()
        } catch (error) {
            console.log(error)
        }
    },
    editProduct: async (req, res, cb) => {
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

            return cb({
                product,
                categories
            })
        } catch (error) {
            console.log(error)
        }
    },
    putProduct: async (req, res, cb) => {
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
           
            return cb()

        } catch (error) {
            console.log(error)
        }
    },
    deleteProduct: async(req, res, cb) => {
        try {
            const product = await Product.findByPk(req.params.id)
            await product.destroy()

            return cb()

        } catch (error) {
            console.log(error)
        }
    },
    getCategories: async(req, res, cb) => {
        try {
            const categories = await Category.findAll({
                nest: true,
                raw: true
            })
            return cb({ categories })
        } catch (error) {
            console.log(error)
        }
    },
    addCategory: async(req, res, cb) => {
        try {
            const { name } = req.body
            const category= await Category.findOne({
                where: { name }
            })

            if (!name) {
                req.flash("error_messages", "此欄位不得為空!")
                return res.redirect('back')
            }
            if(category){
                req.flash("error_messages", "此分類名稱已存在!")
            }

            await Category.create({
                name
            })

            return cb()
        } catch (error) {
            console.log(error)
            
        }
    },
    editCategory: async(req, res, cb) => {
        try {
            const categories = await Category.findAll({
                nest: true,
                raw: true
            })
            const category = await Category.findByPk(req.params.id,{
                raw: true
            })
            return cb({ 
                categories,
                category })
        } catch (error) {
            console.log(error)
        }

    },
    putCategory: async(req, res, cb) => {
        try {
            const { name } = req.body
            const data = await Category.findOne({
                where: { name }
            })
            if (!name) {
                req.flash("error_messages", "此欄位不得為空!")
                return res.redirect('back')
            }
            if (data) {
                req.flash("error_messages", "此分類名稱已存在!")
            }
            const category = await Category.findByPk(req.params.id)
            await category.update({
                name
            })
            return cb()
        } catch (error) {
            console.log(error)
        }
    },
    deleteCategory: async(req, res, cb) => {
        try {
            const category = await Category.findByPk(req.params.id)
            await category.destroy()
            return cb()
        } catch (error) {
            console.log(error)
        }
    },
    getOrders: async(req, res, cb) => {
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

            //add paginator
            const DEFAULT_LIMIT = 10
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const endIndex = offset +limit
            const total = orders.length

            return cb({ 
                orders: orders.slice(offset, endIndex),
                payment,
                shipment,
                pagination: getPagination(limit, page, total)
             })
        } catch (error) {
            console.log(error)
        }
    },
    editOrder: async(req, res, cb) => {
        try {
            const order = await Order.findByPk(req.params.id, {
                include: 'orderProducts',
            })
            let totalPrice = 0
            
            await order.orderProducts.forEach(e => {
                totalPrice += e.price * e.OrderItem.quantity
              })

            return cb({
                order: order.toJSON(),
                totalPrice
            })
        } catch (error) {
            console.log(error)
        }
    },
    putOrder: async(req, res, cb) => {
        try {
            const { payment, shipment } = req.body
            const order = await Order.findByPk(req.params.id)
            await order.update({
                payment_status: payment,
                shipping_status: shipment
            })
            return cb()
        } catch (error) {
            console.log(error)
        }
    },
    cancelOrder: async(req, res, cb) => {
        try {
            const order = await Order.findByPk(req.params.id)
            await order.update({
                payment_status: -1,
                shipping_status: -1
            })
            return cb()
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = adminController