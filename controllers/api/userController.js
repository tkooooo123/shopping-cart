const userService = require('../../services/userService')
const db = require('../../models')
const { User } = db
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userController = {
    signIn: (req, res) => {
        userService.signIn(req, res, data => {
            if (data.statusCode === '401') {
                return res.status(401).json(data)
            } else if(data.statusCode === '400') {
                return  res.status(400).json(data)
            } else {
                return  res.status(200).json(data)
            }
            
        })

    },
    signUp: (req, res) => {
        userService.signUp(req, res, data => {
            if (data.statusCode === 401) {
                return res.status(401).json(data)
            }
            return res.json(data)
        })

    },
    getCurrentUser: async (req, res) => {
        try {
            const userId = req.user.id

            const currentUser = await User.findByPk(userId)
            return res.json({ currentUser })
        } catch (error) {
            console.log(error)
        }
    },
    postFbSignIn: async (req, res) => {
        try {
            const { name, email } = req.body
            const user = await User.findOne({
                where: { email }
            })
            if (!user) {
                const randomPassword = Math.random().toString(36).slice(-8)
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(randomPassword, salt)
                await User.create({
                    name,
                    email,
                    password: hash
                })
            }
            const payload = { id: user.id }
            const token = jwt.sign(payload, process.env.JWT_SECRET)
            return res.json({ user, token })
        } catch (error) {
            console.log(error)
        }
    },
    editProfile: (req, res) => {
       userService.editProfile(req, res, data => {
        if(data.statusCode === 401) {
            return res.status(401).json(data)
        }
        return res.json(data)
       })
    }


}

module.exports = userController