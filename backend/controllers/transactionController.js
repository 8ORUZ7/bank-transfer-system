const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/userModal');
const Transaction = require('../models/transactionModal');

// === Utility Functions ===

const findVerifiedUserByAccountNumber = async (accountNumber) => {
  const user = await User.findOne({ accountNumber });
  if (!user || !user.isVerified) return null;
  return user;
};

const validateTransactionFields = ({ amount, sender, receiver, transactionType, reference }) => {
  return (
    amount && !isNaN(amount) && amount > 0 &&
    sender?.trim() &&
    receiver?.trim() &&
    transactionType?.trim() &&
    reference?.trim()
  );
};

const createTransaction = async (data, session) => {
  return await Transaction.create([{ ...data }], { session });
};

const updateUserBalance = async (userId, update, session) => {
  return await User.findByIdAndUpdate(userId, update, { session });
};

const populateTransaction = async (query) => {
  return query
    .sort({ createdAt: -1 })
    .populate([
      { path: 'sender', select: 'name image' },
      { path: 'receiver', select: 'name image' }
    ]);
};

// === Controllers ===

// @desc Transfer money
// @route POST /api/transfer
// @access Private
const transferAmount = asyncHandler(async (req, res) => {
  const { amount, sender, receiver, transactionType, reference } = req.body;

  if (!validateTransactionFields(req.body)) {
    res.status(400);
    throw new Error('All fields are required and must be valid.');
  }

  const senderUser = await findVerifiedUserByAccountNumber(sender);
  const receiverUser = await findVerifiedUserByAccountNumber(receiver);

  if (!senderUser || !receiverUser ) {
    res.status(400);
    throw new Error('Sender must be logged in and both users must be verified.');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transactionData = {
      amount,
      sender: senderUser._id,
      receiver: receiverUser._id,
      transactionType,
      reference,
      transactionId: crypto.randomBytes(5).toString('hex'),
      status: 'success'
    };

    const [transaction] = await createTransaction(transactionData, session);

    await updateUserBalance(senderUser._id, { $inc: { balance: -amount, moneySend: 1 } }, session);
    await updateUserBalance(receiverUser._id, { $inc: { balance: amount, moneyReceived: 1 } }, session);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(transaction);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500);
    throw new Error('Transaction failed. ' + err.message);
  }
});

// @desc Verify receiver
// @route POST /api/verify-receiver
// @access Private
const verifyReceiver = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.receiver);
  if (!user) {
    res.status(404);
    throw new Error('Receiver not found');
  }
  res.status(200).json(user);
});

// @desc Get all transactions for a user
// @route GET /api/all_transaction/:id
// @access Private
const getTransactions = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transactions = await populateTransaction(
    Transaction.find({ $or: [{ sender: id }, { receiver: id }] })
  );

  if (!transactions.length) {
    res.status(404);
    throw new Error('No transactions found.');
  }

  res.status(200).json(transactions);
});

// @desc Get sent transactions
// @route GET /api/transactions/sent
// @access Private
const getMoneySendTransactions = asyncHandler(async (req, res) => {
  const transactions = await populateTransaction(
    Transaction.find({ sender: req.user._id })
  );

  if (!transactions.length) {
    res.status(404);
    throw new Error('No sent transactions found.');
  }

  res.status(200).json(transactions);
});

// @desc Get received transactions
// @route GET /api/transactions/received
// @access Private
const getMoneyReceiveTransactions = asyncHandler(async (req, res) => {
  const transactions = await populateTransaction(
    Transaction.find({ receiver: req.user._id })
  );

  if (!transactions.length) {
    res.status(404);
    throw new Error('No received transactions found.');
  }

  res.status(200).json(transactions);
});

// @desc Deposit money
// @route POST /api/deposit
// @access Private
const deposit = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Please enter a valid amount.');
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transactionData = {
      sender: user._id,
      receiver: user._id,
      amount,
      transactionType: 'deposit',
      transactionId: crypto.randomBytes(5).toString('hex'),
      reference: 'self deposit',
      status: 'success'
    };

    const [depositTx] = await createTransaction(transactionData, session);

    await updateUserBalance(user._id, { $inc: { balance: amount } }, session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: `$${amount} deposited`, transaction: depositTx });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(500);
    throw new Error('Deposit failed. ' + err.message);
  }
});

module.exports = {
  transferAmount,
  verifyReceiver,
  getTransactions,
  getMoneySendTransactions,
  getMoneyReceiveTransactions,
  deposit,
};
