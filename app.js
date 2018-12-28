require('dotenv').config()

const express = require('express')
const mongoose = require('./db/mongoose')
const cookieParser = require('cookie-parser')
const helmet = require('helmet')
const methodOverride = require('method-override')

const app = express()
const port = process.env.PORT

const userRoutes = require('./routes/user-routes')

app.set('view engine', 'ejs')

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(userRoutes)

app.use((req, res, next) => {
  res.status(404).send('Sorry, we cannot find that!')
})

app.use((err, req, res, next) => {
  res.status(500).send(err.message)
})

app.listen(port)

module.exports = app
