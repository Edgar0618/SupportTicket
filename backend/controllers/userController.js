const registerUser = (req, res) => {
    res.send('Register Route')
}

const loginUser = (req, res) => {
    res.send('Login Route')
}

//Always have to export these

module.exports = {
    registerUser,
    loginUser
}