const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, 'AMOUNT IS REQUIRED'],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'SENDER IS REQUIRED'],
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'RECEIVER IS REQUIRED'],
      ref: 'User',
    },
    transactionType: {
      type: String,
      required: [true, 'TRANSACTION TYPE IS REQUIRED'],
      default: 'payment',
      enum: {
        values: ['payment', 'transfer', 'deposit', 'refund'],
        message: 'TRANSACTION TYPE MUST BE PAYMENT, TRANSFER, DEPOSIT, OR REFUND',
      },
    },
    transactionId: {
      type: String,
    },
    reference: {
      type: String,
      required: [true, 'REFERENCE IS REQUIRED'],
      enum: {
        values: ['transaction ID', 'payment reference'],
        message: 'REFERENCE MUST BE TRANSACTION ID OR PAYMENT REFERENCE',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
