const adminService = require('../services/adminService')
const adminController = {
    getProducts: (req, res) => {
        adminService.getProducts(req, res, data => {
            return res.render('admin/products', data)
        })
    },
    getProduct: (req, res) => {
        adminService.getProduct(req, res, data => {
            return res.render('admin/product', data)
        })
    },
    addProduct: (req, res) => {
        adminService.addProduct(req, res, data => {
            return res.render('admin/create-product', data)
        })
    },
    postProduct: (req, res) => {
        adminService.postProduct(req, res, data => {
            return res.redirect('/admin/products')
        })
    },
    editProduct: (req, res) => {
        adminService.editProduct(req, res, data => {
            return res.render('admin/edit-product', data)
        })
    },
    putProduct: (req, res) => {
        adminService.putProduct(req, res, data => {
            return res.redirect('/admin/products')
        })
    },
    deleteProduct: (req, res) => {
        adminService.deleteProduct(req, res, data => {
            return res.redirect('/admin/products')
        })
    },
    getCategories: (req, res) => {
        adminService.getCategories(req, res, data => {
            return res.render('admin/categories', data)
        })
    },
    addCategory: (req, res) => {
        adminService.addCategory(req, res, data => {

            return res.redirect('/admin/categories')
        })
    },
    editCategory: (req, res) => {
        adminService.editCategory(req, res, data => {
            return res.render('admin/categories', data)
        })

    },
    putCategory: (req, res) => {
        adminService.putCategory(req, res, data => {
            return res.redirect('/admin/categories')
        })
    },
    deleteCategory: (req, res) => {
        adminService.deleteCategory(req, res, data => {
            return res.redirect('/admin/categories')
        })
    },
    getOrders: (req, res) => {
        adminService.getOrders(req, res, data => {
            return res.render('admin/orders', data)
        })
    },
    editOrder: (req, res) => {
        adminService.editOrder(req, res, data => {
            return res.render('admin/edit-order', data)
        })
    },
    putOrder: (req, res) => {
        adminService.putOrder(req, res, data => {
            return res.redirect('/admin/orders')
        })
    },
    cancelOrder: (req, res) => {
        adminService.cancelOrder(req, res, data => {
            return res.redirect('back')
        })
    }
}


module.exports = adminController