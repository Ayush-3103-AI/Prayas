const donationService = require('../services/donationService');

// @desc    Get user donations
// @route   GET /api/donations
// @access  Private (User)
const getUserDonations = async (req, res, next) => {
  try {
    const donations = await donationService.getUserDonations(req.user._id);

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Private
const getDonationById = async (req, res, next) => {
  try {
    const donation = await donationService.getDonationById(
      req.params.id,
      req.user.role === 'admin' ? null : req.user._id
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        error: 'Donation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation receipt
// @route   GET /api/donations/receipt/:id
// @access  Private
const getDonationReceipt = async (req, res, next) => {
  try {
    const donation = await donationService.getDonationReceipt(
      req.params.id,
      req.user.role === 'admin' ? null : req.user._id
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        error: 'Receipt not found',
      });
    }

    res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get donation history
// @route   GET /api/donations/history
// @access  Private (User)
const getDonationHistory = async (req, res, next) => {
  try {
    const donations = await donationService.getUserDonations(req.user._id);

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get total donations
// @route   GET /api/donations/total
// @access  Private (User)
const getTotalDonations = async (req, res, next) => {
  try {
    const donations = await donationService.getUserDonations(req.user._id);
    const total = donations.reduce((sum, d) => sum + d.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalAmount: total,
        count: donations.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get NGO donations
// @route   GET /api/donations/ngo/received
// @access  Private (NGO)
const getNGODonations = async (req, res, next) => {
  try {
    // For NGO role, get donations for their NGO
    // This would require linking User to NGO
    // For now, assuming NGO ID is stored in user profile
    const donations = await donationService.getNGODonations(req.user._id);

    res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserDonations,
  getDonationById,
  getDonationReceipt,
  getDonationHistory,
  getTotalDonations,
  getNGODonations,
};

