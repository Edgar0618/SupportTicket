const express = require('express')
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000

const app = express()

// Basic middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    if (req.method === 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})

// Simple routes without database
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Support Desk API is working!',
    status: 'success',
    features: [
      'User authentication',
      'Ticket management', 
      'Smart bot suggestions',
      'Admin dashboard'
    ]
  })
})

app.get('/api/test', (req, res) => {
  res.status(200).json({ 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  })
})

// Simple user routes (no database for now)
app.post('/api/users/register', (req, res) => {
  res.status(201).json({ 
    message: 'User registration endpoint working',
    note: 'Database connection disabled for testing'
  })
})

app.post('/api/users/login', (req, res) => {
  res.status(200).json({ 
    message: 'Login endpoint working',
    token: 'fake-jwt-token-for-testing'
  })
})

// Simple ticket routes (no database for now)
app.get('/api/tickets', (req, res) => {
  res.status(200).json({ 
    message: 'Tickets endpoint working',
    tickets: [
      { id: 1, subject: 'Test Ticket', status: 'open' }
    ]
  })
})

app.listen(PORT, () => console.log(`Simple server started on port ${PORT}`))
