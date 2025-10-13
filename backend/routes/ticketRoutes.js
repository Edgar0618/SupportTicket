const express = require('express')
const router = express.Router()

const {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    getAIRecommendations,
    getAllTickets,
    uploadFile,
    deleteFile
} = require('../controllers/ticketController')

const {
    getNotes,
    addNote
} = require('../controllers/noteController')

// Import auth middleware
const { protect } = require('../middleware/authMiddleware')
const { admin } = require('../middleware/adminMiddleware')

// Apply authentication to all routes
router.use(protect)

// Regular user routes
router.route('/')
    .get(getTickets)
    .post(createTicket)

router.route('/:id')
    .get(getTicket)
    .put(updateTicket)
    .delete(deleteTicket)

router.route('/:id/ai-recommendations')
    .get(getAIRecommendations)

// Notes routes
router.route('/:ticketId/notes')
    .get(getNotes)
    .post(addNote)

// File upload routes
router.route('/:id/upload')
    .post(uploadFile)

router.route('/:id/attachments/:attachmentId')
    .delete(deleteFile)

// Admin routes
router.route('/admin/all')
    .get(admin, getAllTickets)

module.exports = router
