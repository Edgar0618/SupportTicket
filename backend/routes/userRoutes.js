const express = require('express')
const router = express.Router()

//WHAT THIS DOES: IMPORTS FUNCTIONS FROM FILE ONE DIRECTORY UP 
// the .. means outside of the routes
const {registerUser, loginUser, getMe, getAllUsers, getUserById, updateUser, deleteUser} = require('../controllers/userController')
const {protect} = require('../middleware/authMiddleware')
const {admin} = require('../middleware/adminMiddleware')

// router.post('/', (req, res) => {
//     res.send('Register Route')
// })

// router.post('/login', (req, res) => {
//     res.send('Login Route')
// })

//WE ARE GOING TO MAKE IT SIMPLER BY REPLACING THE LOGIC AND CLEANING IT UP WITH OUR NEW FUNCTIONS

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)

// Admin routes
router.route('/admin/all')
    .get(protect, admin, getAllUsers)

router.route('/admin/:id')
    .get(protect, admin, getUserById)
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser)

module.exports = router

// Always cleaner to have a controller function
