const User = require('../models/User');
const Booking = require('../models/Booking');
const Pickup = require('../models/Pickup');
const Donation = require('../models/Donation');
const Badge = require('../models/Badge');
const { calculateImpactScore } = require('../utils/helpers');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('preferredNGO', 'name logo')
      .populate('badges.badgeId', 'name icon tier');

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'address', 'profileImage', 'preferredNGO'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        error: 'Invalid updates',
      });
    }

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Get recent pickups
    const recentPickups = await Pickup.find({ userId: req.user._id })
      .populate('selectedNGO', 'name logo')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get recent donations
    const recentDonations = await Donation.find({ userId: req.user._id })
      .populate('ngoId', 'name logo')
      .sort({ createdAt: -1 })
      .limit(5);

    // Calculate impact score
    const impactScore = calculateImpactScore({
      totalPickups: user.totalPickups,
      totalWeight: user.totalRecycledKg,
      totalDonations: user.totalDonatedAmount,
      totalCO2Saved: user.totalCO2Saved,
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          totalPickups: user.totalPickups,
          totalRecycledKg: user.totalRecycledKg,
          totalDonatedAmount: user.totalDonatedAmount,
          totalCO2Saved: user.totalCO2Saved,
          impactScore,
        },
        recentPickups,
        recentDonations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user impact stats
// @route   GET /api/users/impact-stats
// @access  Private
const getImpactStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const impactScore = calculateImpactScore({
      totalPickups: user.totalPickups,
      totalWeight: user.totalRecycledKg,
      totalDonations: user.totalDonatedAmount,
      totalCO2Saved: user.totalCO2Saved,
    });

    res.status(200).json({
      success: true,
      data: {
        totalPickups: user.totalPickups,
        totalRecycledKg: user.totalRecycledKg,
        totalDonatedAmount: user.totalDonatedAmount,
        totalCO2Saved: user.totalCO2Saved,
        impactScore,
        badges: user.badges.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user badges
// @route   GET /api/users/badges
// @access  Private
const getBadges = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('badges.badgeId');
    
    res.status(200).json({
      success: true,
      data: user.badges,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required',
      });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          totalWasteRecycled: user.totalWasteRecycled || 0,
          totalDonations: user.totalDonations || 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch user',
    });
  }
};

// @desc    Update user by ID
// @route   PUT /api/users/:id
// @access  Private
const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, address } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, address },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update user',
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/users/:id/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    const bookings = await Booking.find({ userId })
      .populate('agentId', 'name agentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch bookings',
    });
  }
};

// @desc    Get user impact
// @route   GET /api/users/:id/impact
// @access  Private
const getUserImpact = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Get active pickups
    const activePickups = await Booking.countDocuments({
      userId,
      status: { $in: ['Pending', 'Assigned', 'In Progress'] },
    });

    res.status(200).json({
      success: true,
      data: {
        totalWaste: user.totalWasteRecycled || 0,
        totalDonations: user.totalDonations || 0,
        activePickups,
        badges: [],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch impact data',
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  getImpactStats,
  getBadges,
  changePassword,
  getUserById,
  updateUserById,
  getUserBookings,
  getUserImpact,
};

