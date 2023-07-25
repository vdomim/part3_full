const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv').config()
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))

morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})
app.use(morgan('tiny', {
    skip: function (req, res) { return req.method === 'POST' }
  }))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content', {
    skip: function (req, res) { return req.method !== 'POST' }
  }))

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
    Person.find({}).then(persons => {
        res.json(persons)
    }) 
})

//Metodo para obtener una persona de la agenda
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        if(person){
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})

//Metodo para eliminar una persona de la agenda
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

//Metodo para añadir una nueva persona a la agenda
app.post('/api/persons/', (req, res) => {
    const body = req.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ 
        error: 'content missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})