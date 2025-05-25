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

    res.send('Register Route')
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
