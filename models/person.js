const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => /^[0-9]{2,3}-[0-9]+$/.test(v),
      message: (props) => `${props.value} is not valid.`,
    },
    required: true,
  },
})

module.exports = mongoose.model('Person', personSchema)
