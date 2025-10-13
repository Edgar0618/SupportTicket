const asyncHandler = require('express-async-handler')
const Ticket = require('../models/ticketModel')
const User = require('../models/userModel')
const AIService = require('../services/aiService')
const upload = require('../middleware/uploadMiddleware')
const emailService = require('../services/emailService')

// @desc    Get user tickets with search and filtering
// @route   GET /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Build filter object
    const filter = { user: req.user.id }
    
    // Search functionality
    if (req.query.search) {
        filter.$or = [
            { subject: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } }
        ]
    }

    // Filter by status
    if (req.query.status) {
        filter.status = req.query.status
    }

    // Filter by priority
    if (req.query.priority) {
        filter.priority = req.query.priority
    }

    // Filter by category
    if (req.query.category) {
        filter.category = req.query.category
    }

    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
        filter.createdAt = {}
        if (req.query.startDate) {
            filter.createdAt.$gte = new Date(req.query.startDate)
        }
        if (req.query.endDate) {
            filter.createdAt.$lte = new Date(req.query.endDate)
        }
    }

    // Sorting
    let sortBy = { createdAt: -1 } // Default sort
    if (req.query.sortBy) {
        const sortField = req.query.sortBy
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
        sortBy = { [sortField]: sortOrder }
    }

    // Pagination
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Get tickets with filters
    const tickets = await Ticket.find(filter)
        .populate('assignedTo', 'name email')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)

    // Get total count for pagination
    const totalTickets = await Ticket.countDocuments(filter)

    res.status(200).json({
        tickets,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalTickets / limit),
            totalTickets,
            hasNextPage: page < Math.ceil(totalTickets / limit),
            hasPrevPage: page > 1
        }
    })
})

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.id)
        .populate('assignedTo', 'name email')
        .populate('user', 'name email')

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    // Check if user owns the ticket or is admin
    if (ticket.user._id.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    res.status(200).json(ticket)
})

// @desc    Create new ticket with AI recommendations
// @route   POST /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
    const { subject, description, category, priority } = req.body

    // Validation
    if (!subject || !description) {
        res.status(400)
        throw new Error('Please add a subject and description')
    }

    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Get AI-powered recommendations
    const aiAnalysis = await AIService.getSolutionRecommendations(description, subject, category)
    
    // Find similar existing tickets
    const existingTickets = await Ticket.find({ 
        status: { $ne: 'closed' },
        user: { $ne: req.user.id } // Exclude user's own tickets
    }).select('subject description')
    
    const similarTickets = await AIService.findSimilarTickets(description, existingTickets)

    // Create ticket with AI data
    const ticket = await Ticket.create({
        subject,
        description,
        user: req.user.id,
        category: category || aiAnalysis.category,
        priority: priority || aiAnalysis.priority,
        // AI-powered fields
        aiCategory: aiAnalysis.category,
        aiConfidence: aiAnalysis.confidence,
        aiPriority: aiAnalysis.priority,
        aiPriorityScore: aiAnalysis.priorityScore,
        aiRecommendations: aiAnalysis.recommendations,
        similarTickets: similarTickets.map(st => ({
            ticketId: st.ticket._id,
            similarity: st.similarity,
            matchingWords: st.matchingWords
        }))
    })

    // Populate the created ticket
    const populatedTicket = await Ticket.findById(ticket._id)
        .populate('user', 'name email')
        .populate('assignedTo', 'name email')

    // Send email notification
    await emailService.sendTicketCreatedNotification(populatedTicket, user)

    res.status(201).json(populatedTicket)
})

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    // If description or subject changed, regenerate AI recommendations
    let updatedTicketData = { ...req.body }
    
    if (req.body.description || req.body.subject) {
        const newDescription = req.body.description || ticket.description
        const newSubject = req.body.subject || ticket.subject
        
        const aiAnalysis = await AIService.getSolutionRecommendations(
            newDescription, 
            newSubject, 
            req.body.category || ticket.category
        )
        
        updatedTicketData = {
            ...updatedTicketData,
            aiCategory: aiAnalysis.category,
            aiConfidence: aiAnalysis.confidence,
            aiPriority: aiAnalysis.priority,
            aiPriorityScore: aiAnalysis.priorityScore,
            aiRecommendations: aiAnalysis.recommendations
        }
    }

    // Set closedAt if status is being changed to closed
    if (req.body.status === 'closed' && ticket.status !== 'closed') {
        updatedTicketData.closedAt = new Date()
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id, 
        updatedTicketData, 
        { new: true }
    ).populate('user', 'name email').populate('assignedTo', 'name email')

    // Send email notification if status changed
    if (req.body.status && req.body.status !== ticket.status) {
        await emailService.sendTicketUpdateNotification(
            updatedTicket, 
            updatedTicket.user, 
            `Status changed to ${req.body.status}`
        )
    }

    // Send email notification if assigned to someone
    if (req.body.assignedTo && req.body.assignedTo !== ticket.assignedTo?.toString()) {
        const assignedUser = await User.findById(req.body.assignedTo)
        if (assignedUser) {
            await emailService.sendTicketAssignmentNotification(
                updatedTicket, 
                updatedTicket.user, 
                assignedUser
            )
        }
    }

    res.status(200).json(updatedTicket)
})

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    await ticket.deleteOne()

    res.status(200).json({ success: true })
})

// @desc    Get AI recommendations for existing ticket
// @route   GET /api/tickets/:id/ai-recommendations
// @access  Private
const getAIRecommendations = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    // Check if user owns the ticket or is admin
    const user = await User.findById(req.user.id)
    if (ticket.user.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    // Regenerate AI recommendations
    const aiAnalysis = await AIService.getSolutionRecommendations(
        ticket.description, 
        ticket.subject, 
        ticket.category
    )

    // Find similar tickets
    const existingTickets = await Ticket.find({ 
        status: { $ne: 'closed' },
        user: { $ne: req.user.id },
        _id: { $ne: ticket._id }
    }).select('subject description')
    
    const similarTickets = await AIService.findSimilarTickets(ticket.description, existingTickets)

    res.status(200).json({
        recommendations: aiAnalysis.recommendations,
        category: aiAnalysis.category,
        confidence: aiAnalysis.confidence,
        priority: aiAnalysis.priority,
        priorityScore: aiAnalysis.priorityScore,
        similarTickets: similarTickets.map(st => ({
            ticketId: st.ticket._id,
            subject: st.ticket.subject,
            similarity: st.similarity,
            matchingWords: st.matchingWords
        }))
    })
})

// @desc    Get all tickets with advanced filtering (Admin only)
// @route   GET /api/tickets/admin/all
// @access  Private/Admin
const getAllTickets = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if (!user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized - Admin access required')
    }

    // Build filter object
    const filter = {}
    
    // Search functionality
    if (req.query.search) {
        filter.$or = [
            { subject: { $regex: req.query.search, $options: 'i' } },
            { description: { $regex: req.query.search, $options: 'i' } }
        ]
    }

    // Filter by status
    if (req.query.status) {
        filter.status = req.query.status
    }

    // Filter by priority
    if (req.query.priority) {
        filter.priority = req.query.priority
    }

    // Filter by category
    if (req.query.category) {
        filter.category = req.query.category
    }

    // Filter by assigned user
    if (req.query.assignedTo) {
        filter.assignedTo = req.query.assignedTo
    }

    // Filter by ticket creator
    if (req.query.user) {
        filter.user = req.query.user
    }

    // Date range filtering
    if (req.query.startDate || req.query.endDate) {
        filter.createdAt = {}
        if (req.query.startDate) {
            filter.createdAt.$gte = new Date(req.query.startDate)
        }
        if (req.query.endDate) {
            filter.createdAt.$lte = new Date(req.query.endDate)
        }
    }

    // Sorting
    let sortBy = { createdAt: -1 } // Default sort
    if (req.query.sortBy) {
        const sortField = req.query.sortBy
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
        sortBy = { [sortField]: sortOrder }
    }

    // Pagination
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit

    // Get tickets with filters
    const tickets = await Ticket.find(filter)
        .populate('user', 'name email')
        .populate('assignedTo', 'name email')
        .sort(sortBy)
        .skip(skip)
        .limit(limit)

    // Get total count for pagination
    const totalTickets = await Ticket.countDocuments(filter)

    res.status(200).json({
        tickets,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalTickets / limit),
            totalTickets,
            hasNextPage: page < Math.ceil(totalTickets / limit),
            hasPrevPage: page > 1
        }
    })
})

// @desc    Upload file to ticket
// @route   POST /api/tickets/:id/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    // Handle file upload using multer
    upload.array('files', 5)(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' })
        }

        try {
            // Add files to ticket (Cloudinary format)
            const newAttachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                path: file.path,
                url: file.secure_url,
                publicId: file.public_id,
                size: file.size,
                mimetype: file.mimetype
            }))

            ticket.attachments.push(...newAttachments)
            await ticket.save()

            res.status(200).json({
                message: 'Files uploaded successfully',
                attachments: newAttachments
            })
        } catch (error) {
            res.status(500).json({ error: 'Error saving files' })
        }
    })
})

// @desc    Delete file from ticket
// @route   DELETE /api/tickets/:id/attachments/:attachmentId
// @access  Private
const deleteFile = asyncHandler(async (req, res) => {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const ticket = await Ticket.findById(req.params.id)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    const attachment = ticket.attachments.id(req.params.attachmentId)

    if (!attachment) {
        res.status(404)
        throw new Error('Attachment not found')
    }

    // Remove attachment from array
    ticket.attachments.pull(req.params.attachmentId)
    await ticket.save()

    res.status(200).json({ success: true, message: 'File deleted successfully' })
})

module.exports = {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    getAIRecommendations,
    getAllTickets,
    uploadFile,
    deleteFile
}
