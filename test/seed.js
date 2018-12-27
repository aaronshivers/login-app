const { ObjectId } = require('mongodb')

const User = require('../models/user-model')
const createToken = require('../middleware/create-token')

const users = [{
  _id: new ObjectId(),
  email: 'user0@example.com', // always saved to database
  password: 'Pass01234!',
  admin: true 
}, {
  _id: new ObjectId(),
  email: 'user1@example.com', // always saved to database
  password: 'Pass11234!' 
}, {
  _id: new ObjectId(),
  email: 'user2@example.com', // used for testing duplicate entries
  password: 'Pass21234!' 
}, {
  _id: new ObjectId(),
  email: 'user3!example.com', // invalid email
  password: 'Pass31234!' 
}, {
  _id: new ObjectId(),
  email: 'user4@example.com',
  password: 'pass41234' // invalid password
}]

const populateUsers = (done) => {
  User.deleteMany().then(() => {
    const user0 = new User(users[0]).save()
    const user1 = new User(users[1]).save()

    return Promise.all([user0, user1])
  }).then(() => done())
}

const tokens = []

createToken(users[0]).then((token) => {
  tokens.push(token)
})

createToken(users[1]).then((token) => {
  tokens.push(token)
})

module.exports = {
  users,
  populateUsers,
  tokens
}