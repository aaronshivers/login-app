const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token
  const secret = process.env.JWT_SECRET

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send(err.message)
      } else {
        next()
      }
    })
  } else {
    res.status(401).send('You must login to view this page.')
  }
}

module.exports = authenticateUser
