const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/userModal');
const crypto = require('crypto');

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    password,
    address,
    identificationType,
    balance,
    moneyReceived,
    moneySend,
    requestReceived,
  } = req.body;

  if (!name || !email || !password || !phone || !address || !identificationType) {
    res.status(400);
    throw new Error('PLEASE ADD ALL FIELDS');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('USER ALREADY EXISTS');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    address,
    identificationType,
    balance,
    moneySend,
    moneyReceived,
    requestReceived,
    password: hashedPassword,
    identificationNumber: crypto.randomBytes(6).toString('hex'),
    isAdmin: false,
    isVerified: true,
  });

  if (!user) {
    res.status(400);
    throw new Error('INVALID USER DATA');
  }

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    address: user.address,
    balance: user.balance,
    moneySend: user.moneySend,
    moneyReceived: user.moneyReceived,
    requestReceived: user.requestReceived,
    identificationType: user.identificationType,
    identificationNumber: user.identificationNumber,
    isAdmin: user.isAdmin,
    isVerified: user.isVerified,
    token: generateToken(user._id),
  });
});

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    const userObj = user.toObject();
    delete userObj.password;
    res.status(200).json({ ...userObj, token: generateToken(user._id) });
  } else {
    res.status(401);
    throw new Error('INVALID CREDENTIALS');
  }
});

// @desc    Get current user
// @route   GET /api/users/curent_user
// @access  Protected
const currentUser = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(user);
});

// @desc    Get all users (excluding current)
// @route   GET /api/users/get_users
// @access  Protected
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  const filteredUsers = users.filter(
    (user) => user._id.toString() !== req.user._id.toString()
  );

  if (!filteredUsers.length) {
    res.status(404);
    throw new Error('NO OTHER USERS FOUND');
  }

  res.status(200).json(filteredUsers);
});

// @desc    Verify user
// @route   PATCH /api/users/verify/:id
// @access  Protected
const verify = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isVerified: req.body.isVerified },
    { new: true }
  );

  if (!user) {
    res.status(404);
    throw new Error('USER NOT FOUND');
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    isVerified: user.isVerified,
  });
});

// @desc    Get uploaded image
// @route   GET /api/users/get_image
// @access  Protected
const getImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user || !user.image) {
    res.status(404);
    throw new Error('NO USER IMAGE FOUND');
  }

  res.status(201).json(user.image);
});

module.exports = {
  register,
  login,
  currentUser,
  getUsers,
  verify,
  getImage,
};
