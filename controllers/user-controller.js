const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
    signInPage: (req, res) => {
        res.render('signin')

    },
    signIn: (req, res) => {
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
            if (!name || !email || !password || !confirmPassword) throw new Error("所有欄位不可為空!")
            const user = await User.findOne({ where: { email } })
            if (user) throw new Error("Email已重複註冊!")
            if (password !== confirmPassword) throw new Error("密碼不相符!")

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