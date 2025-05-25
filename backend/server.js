const express = require('express');
const dotenv = require('dotenv').config();
const {errorHandler} = require('./middleware/errorMIddleware')
const asyncHandler = require('express-async-handler')
const PORT = process.env.PORT || 4000;

const app = express();

// middleware necessary to populate req.body properly in express routes
// allow us to send raw JSON 
// handling incoming request data/ json payloads (data inside)
app.use(express.json())
// handles form submissions
// parses incoming requests with URL-encoded payloads
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Support Desk API' });
})

// Routes
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler)

app.use(asyncHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
