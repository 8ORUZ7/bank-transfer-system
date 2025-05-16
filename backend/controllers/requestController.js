const asyncHandler = require('express-async-handler')
const Request = require('../models/requestModal')
const Transaction = require('../models/transactionModal')
const User = require('../models/userModal')
const crypto = require('crypto')

// @desc    send request to another user
// @route   POST /api/request
// @access  Private
const requestAmount = asyncHandler(async (req, res) => {
  const { receiver, amount, description } = req.body

  if (!receiver || !amount || !description) {
    res.status(400)
    throw new Error('PLEASE INCLUDE ALL FIELDS')
  }

  const moneyreceiver = await User.findById(receiver)

  if (!moneyreceiver || req.user._id.toString() === receiver) {
    res.status(400)
    throw new Error('REQUEST NOT SENT')
  }

  const request = new Request({
    sender: req.user._id,
    receiver,
    amount,
    description,
  })

  await request.save()

  await User.findByIdAndUpdate(
    receiver,
    { $inc: { requestReceived: 1 } },
    { new: true }
  )

  res.status(201).json(request)
})

// @desc    get all request for a user
// @route   POST /api/get-request
// @access  Private
const getAllRequest = asyncHandler(async (req, res) => {
  const requests = await Request.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  })
    .populate('sender')
    .populate('receiver')
    .sort({ createdAt: -1 })

  if (!requests || requests.length === 0) {
    res.status(404)
    throw new Error('NO REQUESTS FOUND')
  }

  res.status(200).json(requests)
})

// @desc    get sent requests
// @route   GET /api/request/sent
// @access  Private
const getRequestSendTransaction = asyncHandler(async (req, res) => {
  const requests = await Request.find({ sender: req.user._id })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'sender', select: 'name image' },
      { path: 'receiver', select: 'name image' },
    ])

  if (!requests || requests.length === 0) {
    res.status(400)
    throw new Error('NO REQUESTS SENT')
  }

  res.status(200).json(requests)
})

// @desc    get received requests
// @route   GET /api/request/received
// @access  Private
const getRequestReceivedTransaction = asyncHandler(async (req, res) => {
  const requests = await Request.find({ receiver: req.user._id })
    .sort({ createdAt: -1 })
    .populate([
      { path: 'sender', select: 'name image' },
      { path: 'receiver', select: 'name image' },
    ])

  if (!requests || requests.length === 0) {
    res.status(400)
    throw new Error('NO REQUESTS RECEIVED')
  }

  res.status(200).json(requests)
})

// @desc    update request status
// @route   POST /api/update-request-status
// @access  Private
const updateRequestStats = asyncHandler(async (req, res) => {
  const { _id, sender, receiver, amount, transactionType, reference, status } =
    req.body

  if (!status || !_id || !sender || !receiver || !amount || !transactionType || !reference) {
    res.status(400)
    throw new Error('MISSING REQUIRED FIELDS')
  }

  if (status === 'accepted') {
    const transaction = await Transaction.create({
      sender,
      receiver,
      amount,
      transactionType,
      transactionId: crypto.randomBytes(5).toString('hex'),
      reference,
    })

    await User.findByIdAndUpdate(sender, {
      $inc: { balance: -amount },
    })

    await User.findByIdAndUpdate(receiver, {
      $inc: { balance: amount },
    })

    await Request.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    )

    res.status(201).json(transaction)
  } else {
    await Request.findByIdAndUpdate(
      _id,
      { status },
      { new: true }
    )

    res.status(200).json({ message: 'REQUEST STATUS UPDATED' })
  }
})

module.exports = {
  requestAmount,
  getAllRequest,
  updateRequestStats,
  getRequestSendTransaction,
  getRequestReceivedTransaction,
}
