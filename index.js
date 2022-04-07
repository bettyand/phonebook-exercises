//configure express
const express = require('express')
const app = express()
app.use(express.json())

//configure morgan
const morgan = require('morgan')
morgan.token('postData', function (req) {
    if (req.method === 'POST') { 
        return JSON.stringify(req.body) 
    } else {
        return null
    }
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))

//configure port
const PORT = 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//set initial data
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

//get requests
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/info', (request, response) => {
    const entries = persons.length
    const now = new Date()
    response.send(`Phonebook has info for ${entries} people <br> ${now}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) { response.json(person) } else { response.status(404).end() }
})

//delete request
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

//create ID generator
//// It would make more sense to use this:
//// const generateId = () => {
////     const maxId = persons.length > 0
////         ? Math.max(...persons.map(n => n.id))
////         : 0
////     return maxId + 1
//// }
//// but the assignment says to use this:
const generateId = () => Math.floor(Math.random() * 69420);

//post request
app.post('/api/persons', (request, response) => {
    const body = request.body

    //error checking
    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'empty request'
        })
    } else if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    } else for (let i = 0; i < persons.length; i++) {
        if (body.name === persons[i].name) {
            return response.status(409).json({
                error: 'name must be unique'
            })
        }
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})
