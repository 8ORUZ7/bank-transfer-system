const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModal');

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('NOT AUTHORIZED, INVALID TOKEN');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('NOT AUTHORIZED, NO TOKEN');
  }
});

// Middleware to check admin access
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  } else {
    res.status(401);
    throw new Error('NOT AUTHORIZED AS AN ADMIN');
  }
};

module.exports = { protect, admin };
