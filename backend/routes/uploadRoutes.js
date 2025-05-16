const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');

let uploadImage;
try {
  uploadImage = require('../controllers/uploadController');
  if (typeof uploadImage !== 'function') {
    throw new Error('UPLOAD CONTROLLER FUNCTION NOT FOUND');
  }
} catch (error) {
  console.error('FAILED TO LOAD UPLOAD CONTROLLER:', error.message);
  uploadImage = (req, res) => {
    res.status(500).json({ message: 'UPLOAD CONTROLLER ERROR - INTERNAL SERVER ERROR' });
  };
}

const router = express.Router();

// @route   POST /api/upload/:id
// @desc    Upload an image
// @access  Public (adjust middleware as needed)
router.post('/upload/:id', uploadImage);

module.exports = router;
