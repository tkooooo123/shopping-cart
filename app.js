const express = require('express')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const bcrypt = require('bcryptjs')
const routes = require('./routes')
const app = express()

const PORT = process.env.PORT 
const SESSION_SECRET = process.env.SESSION_SECRET

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize()) 
app.use(passport.session())
app.use(flash()) 
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')  
  res.locals.error_messages = req.flash('error_messages')  
  next()
})

app.use(routes)


app.listen(PORT, () => {
    console.log(`App is running onhttp://localhost:${PORT}`)
})