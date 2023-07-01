const express = require('express')
const morgan = require('morgan')
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


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/info', (request, response) => {
  const numberOfPersons = persons.length
  const currentTime = new Date()
  response.send(`
    <p>The phonebook contains ${numberOfPersons} entries.</p>
    <p>Time of the reuquest: ${currentTime}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
}) 

app.get('/api/persons/:id', (request, response) => {
  const person = persons.find(person => person.id === Number(request.params.id))
  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
}) 

app.delete('/api/persons/:id', (request, response) => {
  persons = persons.filter(person => person.id !== Number(request.params.id))
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!body.name || body.name.trim() === "" || !body.number || body.number.trim() === "") {
    return response.status(400).json({error: "The name and the number fields are required."})
  }
  if(persons.find(person => person.name === body.name)) {
    return response.status(400).json({error: `${body.name} is already in the phonebook.`})
  }
  let id = Math.floor(Math.random() * 1000000)
  if (persons.find(person => person.id === id)) {
    return response.status(400).json({error: `Generated person id ${id} is already in the phonebook. Unlucky.`})
  }
  const person = {
    id: id,
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)