const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const connectDB = async () => {
  try {
    const conn = await mongoose.connect("mongodb+srv://luxuryxeus:5UhgxvsZxdgIgy5b@bank-transfer-system.jasdt3c.mongodb.net/bank-system")

    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.log(`Error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
