# 🚀 Vercel Deployment Guide

## Environment Variables Setup

### Required Environment Variables for Vercel:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://edgarguerrero591:*****@edgarcluster.klcioho.mongodb.net/SUPPORTDESK?retryWrites=true&w=majority&appName=EdgarCluster

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for CORS and email links)
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Deployment Steps:

### 1. Push to GitHub
```bash
git add .
git commit -m "Final commit: Complete responsive design and styling"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Vercel will auto-detect the configuration from `vercel.json`

### 3. Configure Environment Variables
1. In Vercel dashboard, go to your project
2. Go to Settings → Environment Variables
3. Add all the environment variables listed above
4. **IMPORTANT**: Use your MongoDB connection string
5. Generate a secure JWT_SECRET (32+ characters)

### 4. Cloudinary Setup (for file uploads)
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Get your Cloud Name, API Key, and API Secret
4. Add these to Vercel environment variables

### 5. Email Setup (Optional)
1. Use Gmail with App Password
2. Or use SendGrid, Mailgun, etc.
3. Add email credentials to Vercel

## 🎯 Your App Features:

✅ **Complete MERN Stack Support Desk**
✅ **Smart Bot Automation** (keyword-based categorization & suggestions)
✅ **JWT Authentication** with role-based access
✅ **File Upload** with Cloudinary integration
✅ **Email Notifications** for ticket updates
✅ **Admin Dashboard** with analytics and user management
✅ **Responsive Design** with dark theme (black/grey/white + orange accents)
✅ **Mobile Optimized** with touch-friendly interface
✅ **Advanced Search & Filtering**
✅ **Real-time Ticket Management**

## 🔗 After Deployment:

Your app will be available at: `https://your-app-name.vercel.app`

### Default Admin Account:
- Create a user account first
- Then manually update in MongoDB to set `isAdmin: true`

### Testing:
1. Register a new user
2. Create support tickets
3. Test smart bot suggestions
4. Upload files
5. Test admin features (if admin user)

## 📱 Mobile Features:
- Responsive sidebar that collapses on mobile
- Touch-friendly buttons and forms
- Mobile-optimized tables and cards
- Floating action button for quick ticket creation
- Swipe-friendly navigation

Your Support Desk is now production-ready! 🎉
