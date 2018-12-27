const bcrypt = require('bcrypt')

const saltingRounds = 10

const hashPassword = (userSchema) => {

  userSchema.pre('save', function(next) {
    const user = this

    if (user.isModified('password')) {
      bcrypt.hash(user.password, saltingRounds, (err, hash) => {
        if (err) {
          next(err)
        } else {
          user.password = hash
          next()
        }
      })
    } else {
      next()
    }
  })
}

module.exports = hashPassword
