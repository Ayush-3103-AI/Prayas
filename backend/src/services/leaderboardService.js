const Leaderboard = require('../models/Leaderboard');
const User = require('../models/User');
const Pickup = require('../models/Pickup');
const { calculateImpactScore, getPeriodDates } = require('../utils/helpers');

// Update leaderboard for a user
const updateUserLeaderboard = async (userId, period = 'all-time') => {
  const { periodStart, periodEnd } = getPeriodDates(period);

  // Get user's stats for the period
  const pickups = await Pickup.find({
    userId,
    status: 'completed',
    completedAt: {
      $gte: periodStart,
      $lt: periodEnd,
    },
  });

  const metrics = {
    totalPickups: pickups.length,
    totalWeight: pickups.reduce((sum, p) => sum + (p.totalWeight || 0), 0),
    totalDonations: 0, // Will be calculated from donations
    totalCO2Saved: pickups.reduce((sum, p) => {
      const { CO2_FACTORS } = require('../config/constants');
      return sum + p.materials.reduce((s, m) => {
        const factor = CO2_FACTORS[m.type] || 0;
        return s + ((m.actualWeight || m.estimatedWeight || 0) * factor);
      }, 0);
    }, 0),
  };

  // Get donations for period
  const Donation = require('../models/Donation');
  const donations = await Donation.find({
    userId,
    createdAt: {
      $gte: periodStart,
      $lt: periodEnd,
    },
  });
  metrics.totalDonations = donations.reduce((sum, d) => sum + d.totalAmount, 0);

  metrics.impactScore = calculateImpactScore(metrics);

  // Get user's city for community leaderboard
  const user = await User.findById(userId);
  const community = user?.address?.city || 'Unknown';

  // Update or create leaderboard entry
  let leaderboard = await Leaderboard.findOne({ userId, period });
  
  const previousRank = leaderboard?.rank || null;

  if (leaderboard) {
    leaderboard.metrics = metrics;
    leaderboard.periodStart = periodStart;
    leaderboard.periodEnd = periodEnd;
    leaderboard.community = community;
    await leaderboard.save();
  } else {
    leaderboard = await Leaderboard.create({
      userId,
      period,
      periodStart,
      periodEnd,
      metrics,
      community,
    });
  }

  // Recalculate ranks for the period
  await recalculateRanks(period);

  return leaderboard;
};

// Recalculate ranks for a period
const recalculateRanks = async (period) => {
  const leaderboards = await Leaderboard.find({ period })
    .sort({ 'metrics.impactScore': -1 });

  for (let i = 0; i < leaderboards.length; i++) {
    leaderboards[i].previousRank = leaderboards[i].rank;
    leaderboards[i].rank = i + 1;
    await leaderboards[i].save();
  }
};

// Get leaderboard
const getLeaderboard = async (period = 'all-time', community = null, limit = 100) => {
  const query = { period };
  if (community) {
    query.community = community;
  }

  return await Leaderboard.find(query)
    .populate('userId', 'name profileImage totalRecycledKg totalDonatedAmount')
    .sort({ 'metrics.impactScore': -1 })
    .limit(limit);
};

// Get user rank
const getUserRank = async (userId, period = 'all-time') => {
  const leaderboard = await Leaderboard.findOne({ userId, period })
    .populate('userId', 'name profileImage');
  
  if (!leaderboard) {
    // Create entry if doesn't exist
    return await updateUserLeaderboard(userId, period);
  }

  return leaderboard;
};

module.exports = {
  updateUserLeaderboard,
  recalculateRanks,
  getLeaderboard,
  getUserRank,
};

