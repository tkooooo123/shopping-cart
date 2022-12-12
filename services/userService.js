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
                    message:"所有欄位不可為空!"
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
            if(!bcrypt.compareSync(password, user.password)) {
                return cb({
                    status: "error",
                    statusCode: "401",
                    message: "密碼輸入錯誤!"
                })
            }
            const payload = { id: user.id}
            const token = jwt.sign(payload, process.env.JWT_SECRET) 
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
            if (!name || !email || !password || !confirmPassword) {
                req.flash('error_messages', '所有欄位不可為空!')
                return cb({
                    status: "error",
                    statusCode: "400",
                    message:"所有欄位不可為空!"
                })
                
            }
            
            const user = await User.findOne({ where: { email } })

            if (user) {
                req.flash('error_messages', 'Email已重複註冊!')
                return cb({
                    status: "error",
                    statusCode: "401",
                    message:"Email已重複註冊!"
                })
            }
            if (password !== confirmPassword) {
                req.flash('error_messages', '密碼不相符!')
                return cb({
                    status: "error",
                    statusCode: "401",
                    message:"密碼不相符!"
                })
            }


            await User.create({
                name,
                email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            })
            

            return cb({
                status: "success",
                statusCode: "200",
                message: "已成功註冊!",
    
            })
        } catch (error) {
            console.log(error)
            return next(error)
        }

    }

}

module.exports = userService