const express = require('express')
const app = express()
const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use(express.json())

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

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const entries = persons.length
    const now = new Date()
    response.send(`Phonebook has info for ${entries} people <br> ${now}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) { response.json(person) } else { response.status(404).end() }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


// It would make more sense to use this:
// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(n => n.id))
//         : 0
//     return maxId + 1
// }
// but the assignment says to use this:
const generateId = (maxId) => { Math.floor(Math.random() * maxId) }

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    for (let i = 0; i < persons.length; i++) {
        if (body.name === persons[i].name) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
    }

    const person = {
        id: generateId(69420),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})
