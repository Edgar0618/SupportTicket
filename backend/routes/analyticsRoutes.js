const express = require('express')
const router = express.Router()

const {
    getDashboardAnalytics,
    getTicketAnalytics,
    getUserAnalytics
} = require('../controllers/analyticsController')

// Import middleware
const { protect } = require('../middleware/authMiddleware')
const { admin } = require('../middleware/adminMiddleware')

// Apply authentication and admin middleware to all routes
router.use(protect)
router.use(admin)

// Analytics routes
router.route('/dashboard')
    .get(getDashboardAnalytics)

router.route('/tickets')
    .get(getTicketAnalytics)

router.route('/users')
    .get(getUserAnalytics)

module.exports = router
