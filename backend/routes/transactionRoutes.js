const express = require('express');
const {
  transferAmount,
  getTransactions,
  deposit,
  verifyReceiver,
  getMoneySendTransactions,
  getMoneyReceiveTransactions,
} = require('../controllers/transactionController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/transfer
// @desc    Transfer money to another user
router.post('/transfer', transferAmount);
// @route   POST /api/deposit
// @desc    Deposit money to user's account
router.post('/deposit', deposit);

// @route   POST /api/verify-receiver
// @desc    Verify receiver by ID or email
router.post('/verify-receiver', protect, verifyReceiver);

// @route   GET /api/get_money_send
// @desc    Get transactions where user sent money
router.get('/get_money_send', protect, getMoneySendTransactions);

// @route   GET /api/get_money_receive
// @desc    Get transactions where user received money
router.get('/get_money_receive', protect, getMoneyReceiveTransactions);

// @route   GET /api/get_transactions/:id
// @desc    Get all transactions of a specific user
router.get('/get_transactions/:id', protect, getTransactions);

module.exports = router;
