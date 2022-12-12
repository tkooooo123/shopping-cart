const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userService = require('../services/userService')
const userController = {
    signInPage: (req, res) => {
        res.render('signin')
    },
    signIn: (req, res) => {
        req.flash('success_messages', '登入成功！')
        if (req.user.role === 'admin') return res.redirect('/admin/products')
        return res.redirect('/products')
    },
    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/signin')
    },
    signUpPage: (req, res) => {
        res.render('signup')
    },
    signUp: (req, res) => {
      userService.signUp(req, res, data => {
        if(data.status === 'error') {
            return res.redirect('back')
        }
        req.flash('success_messages','已成功註冊，請登入!')
        return res.redirect('/signin')
      })
    }
}

module.exports = userController