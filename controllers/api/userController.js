const userService = require('../../services/userService')
const db = require('../../models')
const { User } = db
const userController = {
    signIn: (req, res) => {
        userService.signIn(req, res, data => {
            return res.json(data)
        })

    },
    signUp: (req, res) => {
        userService.signUp(req, res, data => {
            return res.json(data)
        })

    },
    getCurrentUser: async(req, res) => {
        try {
         const userId = req.user.id
     
         const currentUser = await User.findByPk(userId)
         return res.json({ currentUser })
        } catch (error) {
         console.log(error)
        }
     }

}

module.exports = userController