const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const colors = require('colors');
const User = require('./models/userModal');
const Request = require('./models/requestModal');
const Transaction = require('./models/transactionModal');
const connectDB = require('./config/db');

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error('FAILED TO LOAD ENVIRONMENT VARIABLES');
  throw new Error('ENVIRONMENT CONFIGURATION FAILED');
}

// Connect to DB
try {
  connectDB();
} catch (err) {
  console.error('DATABASE CONNECTION FAILED');
  throw new Error('FAILED TO CONNECT TO DATABASE');
}

// Read users.json
let users;
try {
  users = JSON.parse(
    fs.readFileSync(`${path.resolve()}/data/users.json`, 'utf-8')
  );
} catch (err) {
  console.error('FAILED TO READ USERS.JSON FILE');
  throw new Error('COULD NOT PARSE USERS DATA');
}

// Import Data Function
const importData = async () => {
  try {
    await User.deleteMany();
    await User.insertMany(users);
    console.log('DATA IMPORTED SUCCESSFULLY!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error('FAILED TO IMPORT DATA:'.red.inverse, error.message.toUpperCase());
    process.exit(1);
  }
};

// Destroy Data Function
const destroyData = async () => {
  try {
    await Request.deleteMany();
    await Transaction.deleteMany();
    console.log('DATA DESTROYED SUCCESSFULLY!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error('FAILED TO DESTROY DATA:'.red.inverse, error.message.toUpperCase());
    process.exit(1);
  }
};

// Determine which function to run
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
