const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'NAME IS REQUIRED'],
    },
    email: {
      type: String,
      required: [true, 'EMAIL IS REQUIRED'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'PHONE NUMBER IS REQUIRED'],
    },
    password: {
      type: String,
      required: [true, 'PASSWORD IS REQUIRED'],
      min: [6, 'PASSWORD MUST BE AT LEAST 6 CHARACTERS'],
      max: [12, 'PASSWORD MUST BE AT MOST 12 CHARACTERS'],
    },
    identificationType: {
      type: String,
      required: [true, 'IDENTIFICATION TYPE IS REQUIRED'],
      enum: {
        values: ['driver license', 'passport', 'national ID'],
        message: 'IDENTIFICATION TYPE MUST BE DRIVER LICENSE, PASSPORT, OR NATIONAL ID',
      },
    },
    identificationNumber: {
      type: String,
      required: [true, 'IDENTIFICATION NUMBER IS REQUIRED'],
      min: [6, 'IDENTIFICATION NUMBER MUST BE AT LEAST 6 CHARACTERS'],
      max: [12, 'IDENTIFICATION NUMBER MUST BE AT MOST 12 CHARACTERS'],
      unique: true,
    },
    balance: {
      type: Number,
      default: 1000,
    },
    moneySend: {
      type: Number,
      default: 0,
    },
    moneyReceived: {
      type: Number,
      default: 0,
    },
    requestReceived: {
      type: Number,
      default: 0,
    },
    transactionLimit: {
      type: Number,
      default: 5000,
    },
    address: {
      type: String,
      required: [true, 'ADDRESS IS REQUIRED'],
    },
    image: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
