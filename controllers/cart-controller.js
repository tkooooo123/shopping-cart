const db = require('../models')
const { Cart, CartItem } = db
const cartController = {
    getCarts: async(req, res) => {
        try {
            const carts = await Cart.findAll({
                include: 'cartProducts',
                where: { UserId: req.user.id },
                nest: true, 
                raw: true
            })
            console.log(carts)
            return res.render('carts',{
                carts
            })
        } catch (error) {
            console.log(error)
        }

    }
}

module.exports = cartController