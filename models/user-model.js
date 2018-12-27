const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const saltingRounds = 10

const hashPassword = require('../middleware/hash-password')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    minlength: 8,
    maxlength: 100,
    validate: {
      validator: validator.isEmail,
      message: `{VALUE} is not a valid email address.`
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 100
  },
  admin: {
    type: Boolean,
    required: false,
    default: false
  }
})

hashPassword(userSchema)

const User = mongoose.model('User', userSchema)

module.exports = User
