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

// API Routes
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/tickets', require('./routes/ticketRoutes'))
app.use('/api/notes', require('./routes/noteRoutes'))
app.use('/api/analytics', require('./routes/analyticsRoutes'))

// Serve static files from React build (if it exists)
const buildPath = path.join(__dirname, '../frontend/build')
const indexPath = path.join(buildPath, 'index.html')

try {
  // Check if build directory exists
  const fs = require('fs')
  if (fs.existsSync(buildPath)) {
    app.use(express.static(buildPath))
    
    // Catch all handler: send back React's index.html file for any non-API routes
    app.get('*', (req, res) => {
      // Skip API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' })
      }
      
      // For all other routes, serve the React app
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error serving React app:', err)
          res.status(404).json({ error: 'React app not found' })
        }
      })
    })
  } else {
    console.log('Frontend build not found, serving API only')
    app.get('*', (req, res) => {
      res.status(404).json({ 
        error: 'Frontend not built yet', 
        message: 'Please build the frontend first' 
      })
    })
  }
} catch (error) {
  console.error('Error setting up static files:', error)
}

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
