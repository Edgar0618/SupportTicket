const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')

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
            email: user.email
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
    res.send('Login Route')
})

//Always have to export these functions
module.exports = {
    registerUser,
    loginUser
}
