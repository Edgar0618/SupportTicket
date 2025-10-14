const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const path = require('path')
const {errorHandler} = require('./middleware/errorMIddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 4000

// Connect to database
connectDB()

const app = express()

// middleware necessary to populate req.body properly in express routes
// allow us to send raw JSON 
// handling incoming request data/ json payloads (data inside)
app.use(express.json())
// handles form submissions
// parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({extended: false}))

// Enable CORS for frontend
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

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')))

// API Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))
app.use('/api/notes', require('./routes/noteRoutes'))
app.use('/api/analytics', require('./routes/analyticsRoutes'))

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
