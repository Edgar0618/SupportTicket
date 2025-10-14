const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        console.log('MONGO_URI from env:', process.env.MONGO_URI ? 'SET' : 'NOT SET')
        console.log('MONGO_URI value:', process.env.MONGO_URI)
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected to host: ${conn.connection.host}`.cyan.underline);
        console.log(`Using database name: ${conn.connection.name}`.magenta.bold);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline)
        console.log(`Using database: ${conn.connection.name}`.magenta.bold)  // <-- THIS is the new line to add
    } catch (error) {
        console.log(`Error: ${error.message}`.red.underline.bold)
        process.exit(1)
    }
}

module.exports = connectDB