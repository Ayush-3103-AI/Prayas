const mongoose = require('mongoose');
const { NGO_CATEGORIES } = require('../config/constants');

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'NGO name is required'],
      trim: true,
    },
    description: String,
    logo: String,
    category: {
      type: String,
      enum: NGO_CATEGORIES,
      required: [true, 'Category is required'],
    },
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    contact: {
      email: String,
      phone: String,
      website: String,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      ifscCode: String,
      bankName: String,
    },
    totalDonationsReceived: {
      type: Number,
      default: 0,
    },
    totalPickups: {
      type: Number,
      default: 0,
    },
    impactStories: [
      {
        title: String,
        description: String,
        image: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('NGO', ngoSchema);

