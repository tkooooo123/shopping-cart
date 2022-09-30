const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
// set up Passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  async (req, email, password, cb) => {
    try {
      const { email } = req.body
      const user = await User.findOne({ where: { email } })
      if(!user) {
        return cb(
          null,
          false,
          req.flash('error_messages', '輸入的Email尚未註冊!')
        )
      }
      if(!bcrypt.compareSync(password, user.password)) {
        return cb(
          null,
          false,
          req.flash('error_messages', '密碼輸入錯誤!')
        )
      }
      return cb(null, user)
    } catch (error) {
      console.log(error)
    }
  }
))
// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})
module.exports = passport