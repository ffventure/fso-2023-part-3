require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const cors = require('cors')
const app = express()

morgan.token('person', function postPerson(req, res){
  if (req.method === "POST") {
    const showBody = req.body
    return JSON.stringify(showBody)
  }
  else {
    return ""
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === "CastError") {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())
app.use(errorHandler)

app.get('/api/info', (request, response) => {
  Person.estimatedDocumentCount().then(count => {
    const numberOfPersons = count
    const currentTime = new Date()
    response.send(`
      <p>The phonebook contains ${numberOfPersons} entries.</p>
      <p>Time of the reuquest: ${currentTime}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
}) 

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      const foundPerson = {
        name: person.name,
        number: person.number,
        id: person._id
      }
      response.json(foundPerson)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
}) 

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(person => {
    response.status(204).end()
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if(!body.name || body.name.trim() === "" || !body.number || body.number.trim() === "") {
    return response.status(400).json({error: "The name and the number fields are required."})
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = ({
    name: request.body.name,
    number: request.body.number
  })
  console.log(request.params.id)
  Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true}).then().catch(error => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)