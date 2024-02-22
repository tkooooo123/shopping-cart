const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const jwt = require('jsonwebtoken')
const userService = {
    signIn: async (req, res, cb) => {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                req.flash('error_messages', '所有欄位不可為空!')
                return cb({
                    status: "error",
                    statusCode: "400",
                    message: "所有欄位不可為空!"
                })

            }
            const user = await User.findOne({ where: { email: email } })
            if (!user) {
                return cb({
                    status: "error",
                    statusCode: "401",
                    message: "輸入的Email尚未註冊!"
                })
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return cb({
                    status: "error",
                    statusCode: "401",
                    message: "密碼輸入錯誤!"
                })
            }
            const payload = { id: user.id }
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' })
            return cb({
                status: "success",
                statusCode: 200,
                message: "登入成功!",
                token: token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            console.log(error)
        }
    },

    signUp: async (req, res, cb, next) => {
        try {
            const { name, email, password, confirmPassword } = req.body
            console.log( 'test',name, email, password, confirmPassword)
            if (!name || !email || !password || !confirmPassword) {
                return cb({
                    status: "error",
                    statusCode: 401,
                    message: "所有欄位不可為空!"
                })

            }

            const user = await User.findOne({ where: { email } })
            console.log('user111')

            if (user) {
                return cb({
                    status: "error",
                    statusCode: 401,
                    message: "Email已重複註冊!"
                })
            }
            console.log('user222')
            if (password !== confirmPassword) {
                return cb({
                    status: "error",
                    statusCode: 401,
                    message: "密碼不相符!"
                })
            }


            await User.create({
                name,
                email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            })


            return cb({
                status: "success",
                statusCode: 200,
                message: "註冊成功!",

            })
        } catch (error) {
            console.log(error)
            return next(error)
        }

    },
    editProfile: async (req, res, cb) => {
        try {
            const { id } = req.params
            const { avatar, email, name, password, confirmPassword } = req.body
            console.log(id, avatar, name, email, password, confirmPassword)
            const isRegistered = await User.findOne({
                where: { email },
                nest: true,
                raw: true
            })

            if (isRegistered.id !== Number(id)) {
                return cb({
                    status: 'error',
                    statusCode: 401,
                    message: 'Email已重複註冊！'
                })
            }
            if (password !== confirmPassword) {
                return cb({
                    status: "error",
                    statusCode: 401,
                    message: "密碼不相符，請重新確認!"
                })
            }

            const user = await User.findByPk(id)
            console.log(user)

            await user.update({
                name,
                email,
                avatar,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            })


            return cb({
                message: '更新成功！'
            })
        } catch (error) {
            console.log(error)
        }
    }

}

module.exports = userService