const pickupService = require('../services/pickupService');
const donationService = require('../services/donationService');
const leaderboardService = require('../services/leaderboardService');
const notificationService = require('../services/notificationService');
const badgeService = require('../services/badgeService');
const User = require('../models/User');
const { PICKUP_STATUS } = require('../config/constants');

// @desc    Schedule pickup
// @route   POST /api/pickups
// @access  Private (User)
const schedulePickup = async (req, res, next) => {
  try {
    const pickupData = {
      ...req.body,
      userId: req.user._id,
    };

    const pickup = await pickupService.schedulePickup(pickupData);

    // Send notification
    await notificationService.sendPickupScheduled(req.user, pickup);

    res.status(201).json({
      success: true,
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user pickups
// @route   GET /api/pickups
// @access  Private (User)
const getUserPickups = async (req, res, next) => {
  try {
    const { status } = req.query;
    const pickups = await pickupService.getUserPickups(req.user._id, status);

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pickup by ID
// @route   GET /api/pickups/:id
// @access  Private
const getPickupById = async (req, res, next) => {
  try {
    const pickup = await pickupService.getPickupById(req.params.id, req.user._id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        error: 'Pickup not found',
      });
    }

    res.status(200).json({
      success: true,
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pickup status
// @route   PATCH /api/pickups/:id/status
// @access  Private (Agent/Admin)
const updatePickupStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const pickup = await pickupService.getPickupById(id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        error: 'Pickup not found',
      });
    }

    // If assigning agent
    if (status === PICKUP_STATUS.ASSIGNED) {
      const agentId = req.body.agentId || req.user._id;
      const updatedPickup = await pickupService.updatePickupStatus(id, status, agentId);

      // Send notifications
      const user = await User.findById(pickup.userId);
      const agent = await User.findById(agentId);
      await notificationService.sendAgentAssigned(user, agent, updatedPickup);

      return res.status(200).json({
        success: true,
        data: updatedPickup,
      });
    }

    // If collecting pickup
    if (status === PICKUP_STATUS.COLLECTED) {
      const { materials } = req.body;
      
      if (materials) {
        await pickupService.updatePickupWeights(id, materials);
      }

      const updatedPickup = await pickupService.updatePickupStatus(id, status);
      return res.status(200).json({
        success: true,
        data: updatedPickup,
      });
    }

    // If completing pickup
    if (status === PICKUP_STATUS.COMPLETED) {
      const updatedPickup = await pickupService.updatePickupStatus(id, status);

      // Process donation
      const donation = await donationService.processDonation(id);

      // Update user stats
      const user = await User.findById(pickup.userId);
      user.totalPickups += 1;
      user.totalRecycledKg += updatedPickup.totalWeight || 0;
      
      // Calculate and update CO2 saved
      const { CO2_FACTORS } = require('../config/constants');
      const co2Saved = updatedPickup.materials.reduce((sum, material) => {
        const factor = CO2_FACTORS[material.type] || 0;
        const weight = material.actualWeight || material.estimatedWeight || 0;
        return sum + (weight * factor);
      }, 0);
      user.totalCO2Saved += co2Saved;
      
      await user.save();

      // Update leaderboard
      await leaderboardService.updateUserLeaderboard(pickup.userId);

      // Check and award badges
      const awardedBadges = await badgeService.checkAndAwardBadges(pickup.userId);

      // Send notification
      await notificationService.sendCollectionComplete(user, updatedPickup, donation);

      return res.status(200).json({
        success: true,
        data: {
          pickup: updatedPickup,
          donation,
          awardedBadges: awardedBadges.length > 0 ? awardedBadges : undefined,
        },
      });
    }

    const updatedPickup = await pickupService.updatePickupStatus(id, status);

    res.status(200).json({
      success: true,
      data: updatedPickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel pickup
// @route   DELETE /api/pickups/:id
// @access  Private (User)
const cancelPickup = async (req, res, next) => {
  try {
    const pickup = await pickupService.cancelPickup(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pickup history
// @route   GET /api/pickups/history
// @access  Private (User)
const getPickupHistory = async (req, res, next) => {
  try {
    const pickups = await pickupService.getUserPickups(req.user._id);

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get agent assigned pickups
// @route   GET /api/pickups/agent/assigned
// @access  Private (Agent)
const getAgentPickups = async (req, res, next) => {
  try {
    const { status } = req.query;
    const pickups = await pickupService.getAgentPickups(req.user._id, status);

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  schedulePickup,
  getUserPickups,
  getPickupById,
  updatePickupStatus,
  cancelPickup,
  getPickupHistory,
  getAgentPickups,
};

