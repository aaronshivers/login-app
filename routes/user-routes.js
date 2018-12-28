const express =  require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user-model')
const validatePassword = require('../middleware/validate-password')
const createToken = require('../middleware/create-token')
const authenticateUser = require('../middleware/authenticate-user')
const authenticateAdmin = require('../middleware/authenticate-admin')

const cookieExpiration = { expires: new Date(Date.now() + 86400000) }

// GET /
router.get('/', (req, res) => {
  res.render('home')
})

// POST /users
router.post('/users', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const newUser = { email, password }
  const user = new User(newUser)

  if (validatePassword(newUser.password)) {
    user.save().then((user) => {
      createToken(user).then((token) => {
        res.cookie('token', token, cookieExpiration).status(201).redirect(`/profile`)
      }).catch(err => res.status(500).send(err.message))
    }).catch(err => res.status(400).send(err.message))
  } else {
    res.status(400).send('Password must contain 8-100 characters, with at least one lowercase letter, one uppercase letter, one number, and one special character.')
  }
})

// GET /users
router.get('/users', authenticateAdmin, (req, res) => {
  User.find().then((users) => {
    if (users.length === 0) {
      res.status(404).send('Sorry, the database must be empty.')
    } else {
      res.render('users', { users })
    }
  })
})

// GET /users/:id
router.get('/users/:id/view', authenticateUser, (req, res) => {
  const { id } = req.params

  User.findById(id).then((user) => {
    if (user) {
      res.render('view', { user })
    } else {
      res.status(404).send('Sorry, that user id is not in our database.')
    }
  })
})

// DELETE /users/:id
router.delete('/users/:id', authenticateUser, (req, res) => {
  const { id } = req.params

  User.findByIdAndDelete(id).then((user) => {
    if (user) {
      res.send(user)
    } else {
      res.status(404).send('Sorry, that user Id was not found in our database.')
    }
  })
})

// GET /users/:id/edit
router.get('/users/:id/edit', authenticateUser, (req, res) => {
  const { id } = req.params

  User.findById(id).then((user) => {
    res.render('edit', { user })
  })
})

// PATCH /users/:id
router.patch('/users/:id', authenticateUser, (req, res) => {
  const { id } = req.params
  const email = req.body.email
  const password = req.body.password
  const updatedUser = { email, password }
  const options = { new: true, runValidators: true }
  const saltRounds = 10
  
  if (validatePassword(password)) {
    bcrypt.hash(password, saltRounds).then((hash) => {

      User.findByIdAndUpdate(id, { email, password: hash }, options).then((user) => {
        if (user) {
          res.status(201).redirect(`/users/${ id }/view`)
        } else {
          res.status(404).send('Sorry, that user Id was not found in our database.')
        }
      }).catch(err => res.status(400).send(err.message))
    })
  } else {
    res.status(400).send('Password must contain 8-100 characters, with at least one lowercase letter, one uppercase letter, one number, and one special character.')
  }
})

// GET /profile
router.get('/profile', authenticateUser, (req, res) => {
  const token = req.cookies.token
  const secret = process.env.JWT_SECRET
  const decoded = jwt.verify(token, secret)
  const { _id } = decoded

  User.findById(_id).then((user) => {
    if (user) {
      res.render('profile', { user })
    } else {
      res.status(404).send('Sorry, that user id is not in our database.')
    }
  })
})
// GET /login
router.get('/login', (req, res) => {
  res.render('login')
})

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body

  User.findOne({ email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, hash) => {
        if (hash) {
          createToken(user).then((token) => {
            res.cookie('token', token, cookieExpiration).status(200).redirect(`/profile`)
          })
        } else {
          res.status(401).send('Please check your login credentials, and try again.')
        }
      })
    } else {
      res.status(404).send('Sorry, we could not find that user in our database.')
    }
  }).catch(err => res.status(401).send('Please check your login credentials, and try again.'))
})

// GET /admin
router.get('/admin', authenticateAdmin, (req, res) => {
  res.render('admin')
})

// GET /signup
router.get('/signup', (req, res) => {
  res.render('signup')
})

// GET /logout
router.get('/logout', authenticateUser, (req, res) => {
  res.clearCookie('token').redirect(`/`)
})

module.exports = router
