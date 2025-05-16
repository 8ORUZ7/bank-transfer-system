const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables
const result = dotenv.config();

if (result.error) {
  console.error('FAILED TO LOAD .ENV FILE:', result.error);
  throw new Error('ENVIRONMENT CONFIGURATION ERROR - FAILED TO LOAD .ENV FILE');
}

// Validate required environment variables
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('CLOUDINARY CONFIGURATION ERROR - MISSING REQUIRED ENVIRONMENT VARIABLES');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
