const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
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
    amount: {
      type: Number,
      required: [true, 'AMOUNT IS REQUIRED'],
    },
    description: {
      type: String,
      required: [true, 'DESCRIPTION IS REQUIRED'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: {
        values: ['pending', 'accepted', 'cancel'],
        message: 'STATUS MUST BE EITHER PENDING, ACCEPTED, OR CANCEL',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Request', requestSchema);
