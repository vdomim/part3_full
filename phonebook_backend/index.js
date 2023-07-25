const express = require('express')
const morgan = require('morgan')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
	console.log('Method:', request.method)
	console.log('Path:  ', request.path)
	console.log('Body:  ', request.body)
	console.log('---')
	next()
}

const errorHandler = (error, request, response, next) => {

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError'){
		return response.status(400).json({ error: error.message } )
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
	skip: function (req) { return req.method === 'POST' }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content', {
	skip: function (req) { return req.method !== 'POST' }
}))

//Pagina raiz del server
app.get('/', (res) => {
	res.send('<h1>Phonebook application</h1>')
})

//Metodo para devolver informacion de la agenda
app.get('/info', (req, res) => {
	Person.find({}).then(persons => {
		res.send(
			`<p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>`
		)
	})
})

//Metodo para obtener todas las personas de la agenda
app.get('/api/persons', (req, res, next) => {
	Person.find({}).then(persons => {
		res.json(persons)
	})
		.catch(error => next(error))
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
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

//Metodo para añadir una nueva persona a la agenda
app.post('/api/persons/', (req, res, next) => {
	const body = req.body

	if (body.name === undefined || body.number === undefined) {
		return res.status(400).json({ 
			error: 'content missing' 
		})
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		console.log('Post ' +savedPerson)
		res.json(savedPerson)
	})
		.catch(error => {
			console.log('Post' +error)
			next(error)
		})
})

app.put('/api/persons/:id', (req, res, next) => {
	const body = req.body

	const person = {
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(req.params.id, person, { new: true })
		.then(updatedPerson => {
			res.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})