const db = require('../models')
const { Product, Category, Order, Article } = db
const { imgurFileHandler } = require('../helpers/file-helpers')
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
                order: [['id', 'DESC']],
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
            const endIndex = offset + limit
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
            if (!product) {
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
            const { name, categoryId, description, quantity, price, imagesUrl, content, is_enabled } = req.body
            const { file } = req
            const filePath = await imgurFileHandler(file)
            const imgs = JSON.parse(imagesUrl)
            const product = await Product.create({
                name,
                categoryId,
                image: filePath || null,
                description,
                content,
                quantity,
                price,
                imagesUrl: imgs,
                is_enabled
            })
            return cb({
                product,
                message: '產品新增成功！'
            })
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
            const { name, categoryId, description, quantity, price, imagesUrl, content, is_enabled } = req.body
            const { file } = req
            const filePath = await imgurFileHandler(file)
            const product = await Product.findByPk(req.params.id)

            const imgs = JSON.parse(imagesUrl)

            await product.update({
                name,
                categoryId,
                image: filePath || product.image,
                description,
                content,
                quantity,
                price,
                imagesUrl: imgs,
                is_enabled
            })
            return cb({
                product,
                message: '更新成功！'
            })

        } catch (error) {
            console.log(error)
        }
    },
    deleteProduct: async (req, res, cb) => {
        try {
            const product = await Product.findByPk(req.params.id)

            if (!product) {
                return cb({
                    status: "error",
                    message: "此產品不存在!",
                    statusCode: 500
                })
            }
            await product.destroy()

            return cb({
                status: "success",
                message: "產品已刪除!"
            })

        } catch (error) {
            console.log(error)
        }
    },
    getCategories: async (req, res, cb) => {
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
    addCategory: async (req, res, cb) => {
        try {
            const { name, image } = req.body

            const data = await Category.findOne({
                where: { name }
            })

            if(data) {
                return cb({
                    status: 'error',
                    statusCode: 500,
                    message: '分類名稱已重複！'
                })
            }
            if (!name) {
                req.flash("error_messages", "此欄位不得為空!")
                return res.redirect('back')
            }


            await Category.create({
                name,
                image
            })

            return cb({
                status: 'success',
                message: '分類新增成功！'
            })
        } catch (error) {
            console.log(error)

        }
    },
    editCategory: async (req, res, cb) => {
        try {
            const categories = await Category.findAll({
                nest: true,
                raw: true
            })
            const category = await Category.findByPk(req.params.id, {
                raw: true
            })
            return cb({
                categories,
                category
            })
        } catch (error) {
            console.log(error)
        }

    },
    putCategory: async (req, res, cb) => {
        try {
            const { name, image } = req.body
            const data = await Category.findOne({
                where: { name }
            })
            if (!name) {
                req.flash("error_messages", "此欄位不得為空!")
                return res.redirect('back')
            }
            if(data && data.id !== Number(req.params.id)) {
                return cb({
                    status: 'error',
                    statusCode: 500,
                    message: '分類名稱已重複！'
                })
            }

            const category = await Category.findByPk(req.params.id)
            await category.update({
                name,
                image
            })
            return cb({
                status: "success",
                message: "分類已更新!"
            })
        } catch (error) {
            console.log(error)
        }
    },
    deleteCategory: async (req, res, cb) => {
        try {
            const category = await Category.findByPk(req.params.id)
            await category.destroy()
            return cb({
                status: 'success',
                message: '刪除成功！'
            })
        } catch (error) {
            console.log(error)
        }
    },
    getOrders: async (req, res, cb) => {
        try {

            const { payment, shipment } = req.query
            let filter = {}
            if (payment && payment !== 'all') {
                filter = {
                    payment_status: payment
                }
            }
            if (shipment && shipment !== 'all') {
                filter = {
                    shipping_status: shipment
                }
            }

            let orders = await Order.findAll({
                where: filter,
                include: 'orderProducts',
                order: [['createdAt', 'DESC']],

            })

            await orders.forEach(order => {
                order.createdAt = order.createdAt.toLocaleDateString()

            })

            //add paginator
            const DEFAULT_LIMIT = 10
            const page = Number(req.query.page) || 1
            const limit = Number(req.query.limit) || DEFAULT_LIMIT
            const offset = getOffset(limit, page)
            const endIndex = offset + limit
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
    editOrder: async (req, res, cb) => {
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
    putOrder: async (req, res, cb) => {
        try {
            const { payment, shipment } = req.body
            const order = await Order.findByPk(req.params.id)
            await order.update({
                payment_status: payment,
                shipping_status: shipment
            })
            return cb({
                message: '訂單狀態已更新！'
            })
        } catch (error) {
            console.log(error)
        }
    },
    cancelOrder: async (req, res, cb) => {
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
    },
    deleteOrder: async (req, res, cb) => {
        try {
            const order = await Order.findByPk(req.params.id)
            if (!order) {
                return cb({
                    status: "error",
                    message: "此訂單不存在!",
                    statusCode: 500
                })
            }

            await order.destroy()

            return cb({
                status: "success",
                message: "訂單已刪除!"
            })
        } catch (error) {
            console.log(error)
        }
    },
    uploadImgs: async (req, res, cb) => {
        try {
            const { files } = req
            const arr = []
            for (let i = 0; i < files.length; i++) {
                const filePath = await imgurFileHandler(files[i])
                arr.push(filePath)

            }
            return cb({
                imagesUrl: arr,
            })
        } catch (error) {
            console.log(error);
        }
    },
    uploadImg: async (req, res, cb) => {
        try {
            const { file } = req
            const filePath = await imgurFileHandler(file)
            return cb({
                imageUrl: filePath
            })
        } catch (error) {
            console.log(error)
        }
    },
    postArticle: async(req, res, cb) => {
        try {
            const { title, author, image, tag, description, isPublic, content } = req.body
            await Article.create({
                title,
                author,
                image,
                tag: JSON.stringify(tag),
                description,
                isPublic,
                content
            })

            return cb({
                message: '文章新增成功！'
            })
        } catch (error) {
            console.log(error)
        }
    },
    getArticles: async(req, res, cb) => {
        try {
            const articles = await Article.findAll({
                nest: true,
                raw: true
            })
           
            const arr = articles.map((article => {
                item = {
                    ...article,
                    tag: JSON.parse(article.tag)
                }
                return item
            }))
            
            return cb({
                articles: arr
            })
        } catch (error) {
            console.log(error)
        }
    },
    deleteArticle: async(req, res, cb) => {
        try {
            const article = await Article.findByPk(req.params.id)
            await article.destroy()
            return cb({
                status: 'success',
                message: '刪除成功！'
            })
        } catch (error) {
            console.log(error)
        }
    },
    putArticle: async(req, res, cb) => {
        try {
            const { title, author, image, tag, description, isPublic, content } = req.body
            const article = await Article.findByPk(req.params.id)
            if(!article) {
                return cb({
                    statusCode: 500,
                    message: '無法取得文章資料！'
                })
            }
            await article.update({
                title,
                author,
                image,
                tag: JSON.stringify(tag),
                description,
                isPublic,
                content
            })
            return cb({
                message: " 更新成功！",
                article
            })
        } catch (error) {
            console.log(error)
        }
    }
}


module.exports = adminController