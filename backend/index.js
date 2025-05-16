const dotenv = require('dotenv');
const path = require('path');
const express = require('express');
const colors = require('colors');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const fileUpload = require('express-fileupload');

// Load environment variables
const result = dotenv.config();
if (result.error) {
  console.error('FAILED TO LOAD .ENV FILE:', result.error);
  throw new Error('ENVIRONMENT CONFIGURATION ERROR - FAILED TO LOAD .ENV FILE');
}

// Connect to the database
try {
  connectDB();
} catch (error) {
  console.error('DATABASE CONNECTION ERROR:', error.message);
  throw new Error('FAILED TO CONNECT TO DATABASE');
}

const app = express();

app.use(cors());
app.options('*', cors()); // Enable CORS for all routes

// Enable file uploads
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Middleware for parsing JSON and form data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/', require('./routes/transactionRoutes'));
app.use('/api/', require('./routes/requestRoutes'));
app.use('/api/', require('./routes/uploadRoutes'));

// Error Handler Middleware
app.use(errorHandler);

// Root endpoint
app.get('/', (req, res) => {
  res.send('RUNNING.');
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () =>
  console.log(
    `SERVER RUNNING ON PORT: http://localhost:${PORT} AT ${new Date().toLocaleString(
      'en-US'
    )}`
  )
);
