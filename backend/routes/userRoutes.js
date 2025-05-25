const express = require('express')
const router = express.Router()

//WHAT THIS DOES: IMPORTS FUNCTIONS FROM FILE ONE DIRECTORY UP 
// the .. means outside of the routes
const {registerUser, loginUser} = require('../controllers/userController')

// router.post('/', (req, res) => {
//     res.send('Register Route')
// })

// router.post('/login', (req, res) => {
//     res.send('Login Route')
// })

//WE ARE GOING TO MAKE IT SIMPLER BY REPLACING THE LOGIC AND CLEANING IT UP WITH OUR NEW FUNCTIONS

router.post('/', registerUser)

router.post('/login', loginUser)

module.exports = router

// Always cleaner to have a controller function
