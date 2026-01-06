const mongoose = require('mongoose');
const { BADGE_TIERS } = require('../config/constants');

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Badge description is required'],
    },
    icon: {
      type: String,
      required: [true, 'Badge icon is required'],
    },
    criteria: {
      type: {
        type: String,
        required: true,
        enum: ['pickups', 'weight', 'donations', 'streak', 'co2'],
      },
      threshold: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    tier: {
      type: String,
      enum: Object.values(BADGE_TIERS),
      required: [true, 'Badge tier is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Badge', badgeSchema);

