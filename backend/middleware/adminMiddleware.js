const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// Middleware to check if user is admin
const admin = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.status(401)
        throw new Error('Not authorized')
    }

    if (!req.user.isAdmin) {
        res.status(403)
        throw new Error('Not authorized as admin')
    }

    next()
})

module.exports = { admin }
