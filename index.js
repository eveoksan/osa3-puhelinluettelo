const { res } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

/*
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
*/

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
//app.use(requestLogger)


morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))


let persons = [
  {
    "name": "Arto Hellas",
    "number": "948396146",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Phonebook</h1>')
})

app.get('/info', (req, res) => {
  const currentDate = new Date()
  res.send(`<h2>Phonebook has info for ${persons.length} people</h2> <h2>${currentDate}</h2>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(note => note.id === id)

    if (person) {
      res.json(person)
    } else {
      console.log("article not  found, so 404");
      res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name) {
      return res.status(400).json({ 
        error: 'name is missing' 
      })
    }

    if(!body.number) {
      return res.status(400).json({ 
        error: 'number is missing' 
      })
    }

    if(persons.find(person => person.name === body.name)) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    }

    const person = {
      name: body.name,
      id: generateId(),
      number: body.number
    }
    
    persons.concat(person)
    res.json(person)
})

const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

  
/*
const unknownEndpoint = (request, response) => {
  console.log("tässä häiriö")
  response.status(404).send({ error: 'unknown endpoint' })
}
 app.use(unknownEndpoint)
*/

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})