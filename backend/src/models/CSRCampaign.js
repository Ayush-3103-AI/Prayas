const mongoose = require('mongoose');

const csrCampaignSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    campaignName: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
    },
    description: String,
    logo: String,
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    matchingRatio: {
      type: Number,
      required: [true, 'Matching ratio is required'],
      min: 1,
    },
    maxMatchAmount: Number,
    targetNGOs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
      },
    ],
    totalRaised: {
      type: Number,
      default: 0,
    },
    totalMatched: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CSRCampaign', csrCampaignSchema);

