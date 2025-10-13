const asyncHandler = require('express-async-handler')
const Ticket = require('../models/ticketModel')
const User = require('../models/userModel')
const Note = require('../models/noteModel')

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if (!user.isAdmin) {
        res.status(403)
        throw new Error('Not authorized as admin')
    }

    // Get date range (default to last 30 days)
    const days = parseInt(req.query.days) || 30
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Total tickets
    const totalTickets = await Ticket.countDocuments()
    
    // Tickets by status
    const ticketsByStatus = await Ticket.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ])

    // Tickets by priority
    const ticketsByPriority = await Ticket.aggregate([
        {
            $group: {
                _id: '$priority',
                count: { $sum: 1 }
            }
        }
    ])

    // Tickets by category
    const ticketsByCategory = await Ticket.aggregate([
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 }
            }
        }
    ])

    // Tickets created over time (last 30 days)
    const ticketsOverTime = await Ticket.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
        }
    ])

    // Average resolution time
    const resolvedTickets = await Ticket.find({
        status: 'closed',
        closedAt: { $exists: true }
    })

    const avgResolutionTime = resolvedTickets.length > 0 
        ? resolvedTickets.reduce((sum, ticket) => {
            const resolutionTime = ticket.closedAt - ticket.createdAt
            return sum + resolutionTime
        }, 0) / resolvedTickets.length
        : 0

    // Top users by ticket count
    const topUsers = await Ticket.aggregate([
        {
            $group: {
                _id: '$user',
                ticketCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $unwind: '$userInfo'
        },
        {
            $project: {
                _id: 1,
                name: '$userInfo.name',
                email: '$userInfo.email',
                ticketCount: 1
            }
        },
        {
            $sort: { ticketCount: -1 }
        },
        {
            $limit: 10
        }
    ])

    // Response time analytics (tickets with notes)
    const ticketsWithNotes = await Ticket.aggregate([
        {
            $lookup: {
                from: 'notes',
                localField: '_id',
                foreignField: 'ticket',
                as: 'notes'
            }
        },
        {
            $match: {
                'notes.0': { $exists: true }
            }
        },
        {
            $project: {
                firstNoteTime: { $min: '$notes.createdAt' },
                createdAt: 1
            }
        }
    ])

    const avgResponseTime = ticketsWithNotes.length > 0
        ? ticketsWithNotes.reduce((sum, ticket) => {
            const responseTime = ticket.firstNoteTime - ticket.createdAt
            return sum + responseTime
        }, 0) / ticketsWithNotes.length
        : 0

    // Recent activity
    const recentTickets = await Ticket.find({})
        .populate('user', 'name email')
        .sort({ updatedAt: -1 })
        .limit(10)

    const recentNotes = await Note.find({})
        .populate('user', 'name email')
        .populate('ticket', 'subject')
        .sort({ createdAt: -1 })
        .limit(10)

    res.status(200).json({
        overview: {
            totalTickets,
            openTickets: ticketsByStatus.find(t => t._id === 'open')?.count || 0,
            closedTickets: ticketsByStatus.find(t => t._id === 'closed')?.count || 0,
            newTickets: ticketsByStatus.find(t => t._id === 'new')?.count || 0
        },
        charts: {
            ticketsByStatus,
            ticketsByPriority,
            ticketsByCategory,
            ticketsOverTime
        },
        metrics: {
            avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60 * 24)), // Convert to days
            avgResponseTime: Math.round(avgResponseTime / (1000 * 60)), // Convert to minutes
            totalUsers: await User.countDocuments(),
            resolvedTickets: resolvedTickets.length
        },
        topUsers,
        recentActivity: {
            recentTickets,
            recentNotes
        }
    })
})

// @desc    Get ticket analytics
// @route   GET /api/analytics/tickets
// @access  Private/Admin
const getTicketAnalytics = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if (!user.isAdmin) {
        res.status(403)
        throw new Error('Not authorized as admin')
    }

    const { startDate, endDate, category, status, priority } = req.query

    // Build filter object
    const filter = {}
    
    if (startDate || endDate) {
        filter.createdAt = {}
        if (startDate) filter.createdAt.$gte = new Date(startDate)
        if (endDate) filter.createdAt.$lte = new Date(endDate)
    }
    
    if (category) filter.category = category
    if (status) filter.status = status
    if (priority) filter.priority = priority

    // Get tickets with filter
    const tickets = await Ticket.find(filter)
        .populate('user', 'name email')
        .populate('assignedTo', 'name email')
        .sort({ createdAt: -1 })

    // Analytics
    const totalTickets = tickets.length
    const avgResolutionTime = tickets
        .filter(t => t.status === 'closed' && t.closedAt)
        .reduce((sum, ticket) => {
            const resolutionTime = ticket.closedAt - ticket.createdAt
            return sum + resolutionTime
        }, 0) / tickets.filter(t => t.status === 'closed' && t.closedAt).length || 0

    const categoryBreakdown = tickets.reduce((acc, ticket) => {
        acc[ticket.category] = (acc[ticket.category] || 0) + 1
        return acc
    }, {})

    const statusBreakdown = tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1
        return acc
    }, {})

    const priorityBreakdown = tickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1
        return acc
    }, {})

    res.status(200).json({
        totalTickets,
        avgResolutionTime: Math.round(avgResolutionTime / (1000 * 60 * 60 * 24)), // Convert to days
        categoryBreakdown,
        statusBreakdown,
        priorityBreakdown,
        tickets
    })
})

// @desc    Get user analytics
// @route   GET /api/analytics/users
// @access  Private/Admin
const getUserAnalytics = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)

    if (!user.isAdmin) {
        res.status(403)
        throw new Error('Not authorized as admin')
    }

    // Total users
    const totalUsers = await User.countDocuments()
    const adminUsers = await User.countDocuments({ isAdmin: true })
    const regularUsers = totalUsers - adminUsers

    // Users with tickets
    const usersWithTickets = await Ticket.distinct('user')
    const usersWithoutTickets = totalUsers - usersWithTickets.length

    // Top users by activity
    const userActivity = await Ticket.aggregate([
        {
            $group: {
                _id: '$user',
                ticketCount: { $sum: 1 },
                lastActivity: { $max: '$updatedAt' }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userInfo'
            }
        },
        {
            $unwind: '$userInfo'
        },
        {
            $project: {
                _id: 1,
                name: '$userInfo.name',
                email: '$userInfo.email',
                isAdmin: '$userInfo.isAdmin',
                ticketCount: 1,
                lastActivity: 1,
                createdAt: '$userInfo.createdAt'
            }
        },
        {
            $sort: { ticketCount: -1 }
        }
    ])

    // Recent user registrations
    const recentUsers = await User.find({})
        .select('name email isAdmin createdAt')
        .sort({ createdAt: -1 })
        .limit(10)

    res.status(200).json({
        overview: {
            totalUsers,
            adminUsers,
            regularUsers,
            usersWithTickets: usersWithTickets.length,
            usersWithoutTickets
        },
        userActivity,
        recentUsers
    })
})

module.exports = {
    getDashboardAnalytics,
    getTicketAnalytics,
    getUserAnalytics
}
