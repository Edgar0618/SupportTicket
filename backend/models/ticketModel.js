const mongoose = require('mongoose')

const ticketSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        trim: true
    },
    status: {
        type: String,
        required: true,
        enum: ['new', 'open', 'closed'],
        default: 'new'
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        required: true,
        enum: ['Bug Report', 'Feature Request', 'Performance', 'Authentication', 'General', 'Other'],
        default: 'General'
    },
    // AI-powered fields
    aiCategory: {
        type: String,
        default: 'General'
    },
    aiConfidence: {
        type: Number,
        default: 0
    },
    aiPriority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    aiPriorityScore: {
        type: Number,
        default: 0
    },
    aiRecommendations: [{
        type: String
    }],
    similarTickets: [{
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        },
        similarity: Number,
        matchingWords: [String]
    }],
    // Traditional fields
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    solution: {
        type: String,
        default: ''
    },
    closedAt: {
        type: Date,
        default: null
    },
    attachments: [{
        filename: String,
        originalName: String,
        path: String,
        url: String,
        publicId: String,
        size: Number,
        mimetype: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
})

// Index for better performance on common queries
ticketSchema.index({ user: 1, status: 1 })
ticketSchema.index({ category: 1, priority: 1 })
ticketSchema.index({ status: 1, createdAt: -1 })

module.exports = mongoose.model('Ticket', ticketSchema)
