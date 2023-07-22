const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})
app.use(morgan('tiny', {
    skip: function (req, res) { return req.method === 'POST' }
  }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content', {
    skip: function (req, res) { return req.method !== 'POST' }
  }))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//Pagina raiz del server
app.get('/', (req, res) => {
    res.send('<h1>Phonebook application</h1>')
})

//Metodo para devolver informacion de la agenda
app.get('/info', (req, res) => {
    res.send(
        `<p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>`
    )
})

//Metodo para obtener todas las personas de la agenda
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//Metodo para obtener una persona de la agenda
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        res.json(person)
    }else{
        res.status(404).end()
    }
})

//Metodo para eliminar una persona de la agenda
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

//Metodo para añadir una nueva persona a la agenda
app.post('/api/persons/', (req, res) => {
    const id = Math.floor(Math.random() * 200)
    const body = req.body

    if(!body.name || !body.number){
        return res.status(400).json({
            error: "Name or number missing"
        })
    }
    if(persons.filter(person => person.name === body.name).length !== 0){
        return res.status(400).json({
            error: "Name must be unique"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: id,
    }
    persons = persons.concat(person)
    res.json(person)
})