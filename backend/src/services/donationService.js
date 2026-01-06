const Donation = require('../models/Donation');
const Pickup = require('../models/Pickup');
const User = require('../models/User');
const NGO = require('../models/NGO');
const CSRCampaign = require('../models/CSRCampaign');
const { DONATION_STATUS } = require('../config/constants');
const { generateReceiptId } = require('../utils/helpers');

// Process donation from pickup
const processDonation = async (pickupId) => {
  const pickup = await Pickup.findById(pickupId)
    .populate('selectedNGO')
    .populate('userId');

  if (!pickup) {
    throw new Error('Pickup not found');
  }

  if (pickup.status !== 'collected') {
    throw new Error('Pickup must be collected before processing donation');
  }

  const amount = pickup.totalActualValue || pickup.totalEstimatedValue;

  // Check for active CSR campaigns
  let csrMatchAmount = 0;
  const activeCampaigns = await CSRCampaign.find({
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
    $or: [
      { targetNGOs: { $size: 0 } },
      { targetNGOs: pickup.selectedNGO._id },
    ],
  });

  if (activeCampaigns.length > 0) {
    const campaign = activeCampaigns[0]; // Use first matching campaign
    const potentialMatch = amount * (campaign.matchingRatio - 1);
    
    if (campaign.maxMatchAmount) {
      const remainingMatch = campaign.maxMatchAmount - campaign.totalMatched;
      csrMatchAmount = Math.min(potentialMatch, remainingMatch);
    } else {
      csrMatchAmount = potentialMatch;
    }

    // Update campaign
    campaign.totalRaised += amount;
    campaign.totalMatched += csrMatchAmount;
    await campaign.save();
  }

  const totalAmount = amount + csrMatchAmount;

  // Create donation
  const donation = await Donation.create({
    pickupId,
    userId: pickup.userId._id,
    ngoId: pickup.selectedNGO._id,
    amount,
    csrMatchAmount,
    totalAmount,
    receiptId: generateReceiptId(),
    status: DONATION_STATUS.PROCESSED,
    transactionDate: new Date(),
  });

  // Update user stats
  await User.findByIdAndUpdate(pickup.userId._id, {
    $inc: {
      totalDonatedAmount: totalAmount,
    },
  });

  // Update NGO stats
  await NGO.findByIdAndUpdate(pickup.selectedNGO._id, {
    $inc: {
      totalDonationsReceived: totalAmount,
      totalPickups: 1,
    },
  });

  return donation;
};

// Get user donations
const getUserDonations = async (userId) => {
  return await Donation.find({ userId })
    .populate('pickupId', 'pickupDate materials totalWeight')
    .populate('ngoId', 'name logo category')
    .sort({ createdAt: -1 });
};

// Get donation by ID
const getDonationById = async (donationId, userId = null) => {
  const query = { _id: donationId };
  if (userId) {
    query.userId = userId;
  }
  return await Donation.findOne(query)
    .populate('pickupId')
    .populate('ngoId')
    .populate('userId', 'name email');
};

// Get donation receipt
const getDonationReceipt = async (receiptId, userId = null) => {
  const query = { receiptId };
  if (userId) {
    query.userId = userId;
  }
  return await Donation.findOne(query)
    .populate('pickupId')
    .populate('ngoId')
    .populate('userId', 'name email phone');
};

// Get NGO donations
const getNGODonations = async (ngoId) => {
  return await Donation.find({ ngoId })
    .populate('userId', 'name')
    .populate('pickupId', 'pickupDate')
    .sort({ createdAt: -1 });
};

module.exports = {
  processDonation,
  getUserDonations,
  getDonationById,
  getDonationReceipt,
  getNGODonations,
};

