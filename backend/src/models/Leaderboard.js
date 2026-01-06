const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    period: {
      type: String,
      required: true,
      enum: ['weekly', 'monthly', 'yearly', 'all-time'],
    },
    periodStart: Date,
    periodEnd: Date,
    metrics: {
      totalPickups: {
        type: Number,
        default: 0,
      },
      totalWeight: {
        type: Number,
        default: 0,
      },
      totalDonations: {
        type: Number,
        default: 0,
      },
      totalCO2Saved: {
        type: Number,
        default: 0,
      },
      impactScore: {
        type: Number,
        default: 0,
      },
    },
    rank: Number,
    previousRank: Number,
    community: String, // City or locality
  },
  {
    timestamps: true,
  }
);

// Index for efficient leaderboard queries
leaderboardSchema.index({ period: 1, impactScore: -1 });
leaderboardSchema.index({ userId: 1, period: 1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);

