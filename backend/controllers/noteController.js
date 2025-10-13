const asyncHandler = require('express-async-handler')
const Note = require('../models/noteModel')
const Ticket = require('../models/ticketModel')
const User = require('../models/userModel')
const emailService = require('../services/emailService')

// @desc    Get notes for a ticket
// @route   GET /api/tickets/:ticketId/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Get ticket
    const ticket = await Ticket.findById(req.params.ticketId)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    const notes = await Note.find({ ticket: req.params.ticketId })
        .populate('user', 'name email isAdmin')

    res.status(200).json(notes)
})

// @desc    Create ticket note
// @route   POST /api/tickets/:ticketId/notes
// @access  Private
const addNote = asyncHandler(async (req, res) => {
    const { text } = req.body

    // Validation
    if (!text) {
        res.status(400)
        throw new Error('Please add some text')
    }

    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    // Get ticket
    const ticket = await Ticket.findById(req.params.ticketId)

    if (!ticket) {
        res.status(404)
        throw new Error('Ticket not found')
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    const note = await Note.create({
        text,
        user: req.user.id,
        ticket: req.params.ticketId,
        isStaff: user.isAdmin
    })

    // Populate the note
    const populatedNote = await Note.findById(note._id)
        .populate('user', 'name email isAdmin')

    // Send email notification to ticket owner (if note is from staff)
    if (user.isAdmin && ticket.user.toString() !== req.user.id) {
        const ticketOwner = await User.findById(ticket.user)
        if (ticketOwner) {
            await emailService.sendNewNoteNotification(
                ticket, 
                ticketOwner, 
                populatedNote, 
                user.name
            )
        }
    }

    res.status(201).json(populatedNote)
})

// @desc    Delete note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
    // Get user using the id in JWT
    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    const note = await Note.findById(req.params.id)

    if (!note) {
        res.status(404)
        throw new Error('Note not found')
    }

    // Check if user owns the note or is admin
    if (note.user.toString() !== req.user.id && !user.isAdmin) {
        res.status(401)
        throw new Error('Not Authorized')
    }

    await note.deleteOne()

    res.status(200).json({ success: true })
})

module.exports = {
    getNotes,
    addNote,
    deleteNote
}
