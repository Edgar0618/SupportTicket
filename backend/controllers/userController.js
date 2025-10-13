const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../models/userModel')

// @des     Register a new user
// @route   /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body

    // Validation
    // 400 client error
    // 200 is OK
    if(!name || !email || !password) {
        res.status(400)
        throw new Error("Please include all fields")
    }

    // Find if user already exists
    const userExists = await User.findOne({email})


    if(userExists) {
        res.status(400) // client error
        throw new Error('User already exists')
    }

    // Hash Password
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create User 
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })
    
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new error('Invalid user data')
    }
    
   // res.send('Register Route')
})

// @des     Login a new user
// @route   /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    // Validation
    if(!email || !password) {
        res.status(400)
        throw new Error("Please include all fields")
    }

    // Check for user
    const user = await User.findOne({email})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})

// @des     Get current user
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        isAdmin: req.user.isAdmin
    }

    res.status(200).json(user)
})

// @desc    Get all users (Admin only)
// @route   GET /api/users/admin/all
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password')
    res.status(200).json(users)
})

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/admin/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    
    res.status(200).json(user)
})

// @desc    Update user (Admin only)
// @route   PUT /api/users/admin/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).select('-password')
    
    res.status(200).json(updatedUser)
})

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/admin/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    
    if (!user) {
        res.status(404)
        throw new Error('User not found')
    }
    
    await user.deleteOne()
    res.status(200).json({ success: true, message: 'User deleted successfully' })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

//Always have to export these functions
module.exports = {
    registerUser,
    loginUser,
    getMe,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}
