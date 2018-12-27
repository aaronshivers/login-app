const mongoose = require('mongoose')

const username = process.env.MONGO_USER
const password = process.env.MONGO_PASS
const encodedpass = encodeURIComponent(password)
const server = process.env.MONGO_SERVER
const collection = process.env.MONGO_COLLECTION
const url = `mongodb://${username}:${encodedpass}@${server}/${collection}`

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose.connect(url)

module.exports = mongoose
