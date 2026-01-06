const User = require('../models/User');
const Badge = require('../models/Badge');
const notificationService = require('./notificationService');

// Check and award badges for a user
const checkAndAwardBadges = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return [];

  // Get all available badges
  const badges = await Badge.find();
  const awardedBadges = [];

  for (const badge of badges) {
    // Check if user already has this badge
    const hasBadge = user.badges.some(
      (userBadge) => userBadge.badgeId.toString() === badge._id.toString()
    );

    if (hasBadge) continue;

    // Check if user meets badge criteria
    let meetsCriteria = false;

    switch (badge.criteria.type) {
      case 'pickups':
        meetsCriteria = user.totalPickups >= badge.criteria.threshold;
        break;

      case 'weight':
        meetsCriteria = user.totalRecycledKg >= badge.criteria.threshold;
        break;

      case 'donations':
        meetsCriteria = user.totalDonatedAmount >= badge.criteria.threshold;
        break;

      case 'co2':
        meetsCriteria = user.totalCO2Saved >= badge.criteria.threshold;
        break;

      case 'streak':
        // Implement streak logic if needed
        // For now, skip streak badges
        break;

      default:
        break;
    }

    if (meetsCriteria) {
      // Award badge
      user.badges.push({
        badgeId: badge._id,
        earnedAt: new Date(),
      });

      await user.save();

      // Send notification
      await notificationService.sendBadgeEarned(user, badge);

      awardedBadges.push(badge);
    }
  }

  return awardedBadges;
};

module.exports = {
  checkAndAwardBadges,
};

