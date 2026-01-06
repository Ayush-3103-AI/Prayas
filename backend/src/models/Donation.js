const mongoose = require('mongoose');
const { DONATION_STATUS } = require('../config/constants');

const donationSchema = new mongoose.Schema(
  {
    pickupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pickup',
      required: [true, 'Pickup ID is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: [true, 'NGO ID is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: 0,
    },
    csrMatchAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: 0,
    },
    receiptId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(DONATION_STATUS),
      default: DONATION_STATUS.PENDING,
    },
    transactionDate: Date,
  },
  {
    timestamps: true,
  }
);

// Generate receipt ID before saving
donationSchema.pre('save', async function (next) {
  if (!this.receiptId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    this.receiptId = `PRY-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Donation', donationSchema);

