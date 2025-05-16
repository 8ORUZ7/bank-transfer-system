const asyncHandler = require('express-async-handler');
const cloudinary = require('../utils/cloudinary');
const User = require('../models/userModal');

// @desc    Upload user image
// @route   POST /api/upload/:id
// @access  Private
const uploadImage = asyncHandler(async (req, res) => {
  const { photo } = req.body;

  if (!photo) {
    res.status(400);
    throw new Error('PHOTO IS REQUIRED');
  }

  try {
    const uploadedImage = await cloudinary.uploader.upload(photo, {
      folder: 'profile',
      upload_preset: 'my_media',
      use_filename: true,
    });

    const { secure_url } = uploadedImage;

    if (!secure_url) {
      res.status(500);
      throw new Error('UPLOAD FAILED');
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { image: secure_url },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404);
      throw new Error('USER NOT FOUND');
    }

    res.status(201).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('INTERNAL SERVER ERROR');
  }
});

module.exports = uploadImage;
