const express = require('express')
const router = express.Router()

const {
    getNotes,
    addNote,
    deleteNote
} = require('../controllers/noteController')

// Import auth middleware
const { protect } = require('../middleware/authMiddleware')

// Apply authentication to all routes
router.use(protect)

// Note routes
router.route('/')
    .post(addNote)

router.route('/:id')
    .delete(deleteNote)

module.exports = router
