const express = require('express')
const router = express.Router()
const passport = require('../config/passport') 
const userController = require('../controllers/user-controller')
const products = require('./modules/prooduct')
const { generalErrorHandler } = require('../middleware/error-handler') 
router.get('/', (req, res) => {
  res.render('index')
})
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signin', userController.signInPage)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)

router.use('/products', products)
router.use('/', generalErrorHandler)
module.exports = router