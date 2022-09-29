const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
    signInPage: (req, res) => {
        res.render('signin')

    },
    signIn: (req, res) => {
        if (req.user.role === 'admin') return res.redirect('/admin')
        req.flash('success_messages', '成功登入！')
        return res.redirect('/')

    },
    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/signin')

    },
    signUpPage: (req, res) => {
        res.render('signup')
    },
    signUp: async (req, res, next) => {
        try {
            const { name, email, password, confirmPassword } = req.body
            if (!name || !email || !password || !confirmPassword) {
                req.flash('error_messages', '所有欄位不可為空!')
                return res.status(400).redirect('back')
            }
            const user = await User.findOne({ where: { email } })

            if (user) {
                req.flash('error_messages', 'Email已重複註冊!')
                return res.status(400).redirect('back')
            }
            if (password !== confirmPassword) {
                req.flash('error_messages', '密碼不相符!')
                return res.status(400).redirect('back')
            }


            await User.create({
                name,
                email,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            })

            return res.redirect('/signin')
        } catch (error) {
            console.log(error)
            return next(error)
        }

    }

}

module.exports = userController