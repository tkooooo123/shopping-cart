const adminService = require('../../services/adminService')
const adminController = {
    getProducts: (req, res) => {
        adminService.getProducts(req, res, data => {
            return res.json(data)
        })
    },
    getProduct: (req, res) => {
        adminService.getProduct(req, res, data => {
            return res.json(data)
        })
    },
    addProduct: (req, res) => {
        adminService.addProduct(req, res, data => {
            return res.json(data)
        })
    },
    postProduct: (req, res) => {
        adminService.postProduct(req, res, data => {
            return res.json(data)
        })
    },
    editProduct: (req, res) => {
        adminService.editProduct(req, res, data => {
            return res.json(data)
        })
    },
    putProduct: (req, res) => {
        adminService.putProduct(req, res, data => {
            return res.json(data)
        })
    },
    deleteProduct: (req, res) => {
        adminService.deleteProduct(req, res, data => {
            if(data.statusCode === 500) {
                res.status(500).json(data)
            }
            return res.json(data)
        })
    },
    getCategories: (req, res) => {
        adminService.getCategories(req, res, data => {
            return res.json(data)
        })
    },
    addCategory: (req, res) => {
        adminService.addCategory(req, res, data => {

            return res.json(data)
        })
    },
    editCategory: (req, res) => {
        adminService.editCategory(req, res, data => {
            return res.json(data)
        })

    },
    putCategory: (req, res) => {
        adminService.putCategory(req, res, data => {
            return res.json(data)
        })
    },
    deleteCategory: (req, res) => {
        adminService.deleteCategory(req, res, data => {
            return res.json(data)
        })
    },
    getOrders: (req, res) => {
        adminService.getOrders(req, res, data => {
            return res.json(data)
        })
    },
    editOrder: (req, res) => {
        adminService.editOrder(req, res, data => {
            return res.json(data)
        })
    },
    putOrder: (req, res) => {
        adminService.putOrder(req, res, data => {
            return res.json(data)
        })
    },
    cancelOrder: (req, res) => {
        adminService.cancelOrder(req, res, data => {
            return res.json(data)
        })
    },
    deleteOrder: (req, res) => {
        adminService.deleteOrder(req, res, data => {
            if(data.statusCode === 500) {
                res.status(500).json(data)
            }
            return res.json(data)
        })
    },
    uploadImgs: (req, res) => {
        adminService.uploadImgs(req, res, data => {
            
            return res.json(data)
        })
    },
}


module.exports = adminController