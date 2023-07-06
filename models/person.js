const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: String
})

module.exports = mongoose.model('Person', personSchema)