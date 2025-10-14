const nodemailer = require('nodemailer')

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        })
    }

    // Send ticket creation notification
    async sendTicketCreatedNotification(ticket, user) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('Email not configured - skipping notification')
            return
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `Support Ticket Created - #${ticket._id}`,
            html: `
                <h2>Your Support Ticket Has Been Created</h2>
                <p>Hello ${user.name},</p>
                <p>Your support ticket has been successfully created with the following details:</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Ticket Details:</h3>
                    <p><strong>Ticket ID:</strong> #${ticket._id}</p>
                    <p><strong>Subject:</strong> ${ticket.subject}</p>
                    <p><strong>Category:</strong> ${ticket.category}</p>
                    <p><strong>Priority:</strong> ${ticket.priority}</p>
                    <p><strong>Status:</strong> ${ticket.status}</p>
                    <p><strong>Created:</strong> ${new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                
                <p>You can track your ticket status by logging into your account.</p>
                
                <p>Best regards,<br>Support Team</p>
            `
        }

        try {
            await this.transporter.sendMail(mailOptions)
            console.log('Ticket creation notification sent successfully')
        } catch (error) {
            console.error('Error sending email:', error)
        }
    }

    // Send ticket update notification
    async sendTicketUpdateNotification(ticket, user, updateType) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('Email not configured - skipping notification')
            return
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `Support Ticket Updated - #${ticket._id}`,
            html: `
                <h2>Your Support Ticket Has Been Updated</h2>
                <p>Hello ${user.name},</p>
                <p>Your support ticket has been updated:</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Ticket Details:</h3>
                    <p><strong>Ticket ID:</strong> #${ticket._id}</p>
                    <p><strong>Subject:</strong> ${ticket.subject}</p>
                    <p><strong>Status:</strong> ${ticket.status}</p>
                    <p><strong>Priority:</strong> ${ticket.priority}</p>
                    <p><strong>Last Updated:</strong> ${new Date(ticket.updatedAt).toLocaleString()}</p>
                </div>
                
                <p><strong>Update Type:</strong> ${updateType}</p>
                
                <p>You can view the full details by logging into your account.</p>
                
                <p>Best regards,<br>Support Team</p>
            `
        }

        try {
            await this.transporter.sendMail(mailOptions)
            console.log('Ticket update notification sent successfully')
        } catch (error) {
            console.error('Error sending email:', error)
        }
    }

    // Send new note notification
    async sendNewNoteNotification(ticket, user, note, noteAuthor) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('Email not configured - skipping notification')
            return
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `New Note Added to Ticket - #${ticket._id}`,
            html: `
                <h2>New Note Added to Your Support Ticket</h2>
                <p>Hello ${user.name},</p>
                <p>A new note has been added to your support ticket:</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Ticket Details:</h3>
                    <p><strong>Ticket ID:</strong> #${ticket._id}</p>
                    <p><strong>Subject:</strong> ${ticket.subject}</p>
                    <p><strong>Status:</strong> ${ticket.status}</p>
                </div>
                
                <div style="background-color: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h4>New Note from ${noteAuthor}:</h4>
                    <p>${note.text}</p>
                    <p><small>Added: ${new Date(note.createdAt).toLocaleString()}</small></p>
                </div>
                
                <p>You can view the full conversation by logging into your account.</p>
                
                <p>Best regards,<br>Support Team</p>
            `
        }

        try {
            await this.transporter.sendMail(mailOptions)
            console.log('New note notification sent successfully')
        } catch (error) {
            console.error('Error sending email:', error)
        }
    }

    // Send ticket assignment notification
    async sendTicketAssignmentNotification(ticket, user, assignedTo) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('Email not configured - skipping notification')
            return
        }

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: `Support Ticket Assigned - #${ticket._id}`,
            html: `
                <h2>Your Support Ticket Has Been Assigned</h2>
                <p>Hello ${user.name},</p>
                <p>Your support ticket has been assigned to a support agent:</p>
                
                <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3>Ticket Details:</h3>
                    <p><strong>Ticket ID:</strong> #${ticket._id}</p>
                    <p><strong>Subject:</strong> ${ticket.subject}</p>
                    <p><strong>Assigned To:</strong> ${assignedTo.name}</p>
                    <p><strong>Status:</strong> ${ticket.status}</p>
                </div>
                
                <p>Your ticket is now being handled by our support team. You'll receive updates as we work on resolving your issue.</p>
                
                <p>Best regards,<br>Support Team</p>
            `
        }

        try {
            await this.transporter.sendMail(mailOptions)
            console.log('Ticket assignment notification sent successfully')
        } catch (error) {
            console.error('Error sending email:', error)
        }
    }
}

module.exports = new EmailService()
