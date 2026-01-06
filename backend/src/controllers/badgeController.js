const Badge = require('../models/Badge');
const User = require('../models/User');

// @desc    Get all badges
// @route   GET /api/badges
// @access  Public
const getBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find().sort({ tier: 1, 'criteria.threshold': 1 });

    res.status(200).json({
      success: true,
      count: badges.length,
      data: badges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user badges
// @route   GET /api/badges/user/:userId
// @access  Public
const getUserBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate('badges.badgeId');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      count: user.badges.length,
      data: user.badges,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBadges,
  getUserBadges,
};

