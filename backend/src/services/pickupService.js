const Pickup = require('../models/Pickup');
const { calculateMaterialValue, calculateCO2Saved } = require('../utils/helpers');
const { PICKUP_STATUS } = require('../config/constants');

// Schedule pickup
const schedulePickup = async (pickupData) => {
  const pickup = await Pickup.create(pickupData);
  return pickup;
};

// Get user pickups
const getUserPickups = async (userId, status = null) => {
  const query = { userId };
  if (status) {
    query.status = status;
  }
  return await Pickup.find(query)
    .populate('selectedNGO', 'name logo category')
    .populate('agentId', 'name phone')
    .sort({ createdAt: -1 });
};

// Get pickup by ID
const getPickupById = async (pickupId, userId = null) => {
  const query = { _id: pickupId };
  if (userId) {
    query.userId = userId;
  }
  return await Pickup.findOne(query)
    .populate('selectedNGO', 'name logo category')
    .populate('agentId', 'name phone')
    .populate('userId', 'name email phone');
};

// Update pickup status
const updatePickupStatus = async (pickupId, status, agentId = null) => {
  const updateData = { status };
  
  if (status === PICKUP_STATUS.ASSIGNED && agentId) {
    updateData.agentId = agentId;
    updateData.assignedAt = new Date();
  } else if (status === PICKUP_STATUS.COLLECTED) {
    updateData.collectedAt = new Date();
  } else if (status === PICKUP_STATUS.COMPLETED) {
    updateData.completedAt = new Date();
  }

  return await Pickup.findByIdAndUpdate(pickupId, updateData, { new: true });
};

// Update pickup with actual weights
const updatePickupWeights = async (pickupId, materials) => {
  const { MATERIAL_RATES } = require('../config/constants');
  
  // Calculate actual values
  const updatedMaterials = materials.map((material) => {
    const rate = MATERIAL_RATES[material.type] || 0;
    return {
      ...material,
      value: material.actualWeight * rate,
    };
  });

  const totalActualValue = updatedMaterials.reduce((sum, m) => sum + m.value, 0);
  const totalWeight = updatedMaterials.reduce((sum, m) => sum + m.actualWeight, 0);

  return await Pickup.findByIdAndUpdate(
    pickupId,
    {
      materials: updatedMaterials,
      totalActualValue,
      totalWeight,
    },
    { new: true }
  );
};

// Get agent assigned pickups
const getAgentPickups = async (agentId, status = null) => {
  const query = { agentId };
  if (status) {
    query.status = status;
  }
  return await Pickup.find(query)
    .populate('userId', 'name phone address')
    .populate('selectedNGO', 'name logo')
    .sort({ pickupDate: 1 });
};

// Cancel pickup
const cancelPickup = async (pickupId, userId) => {
  const pickup = await Pickup.findOne({ _id: pickupId, userId });
  if (!pickup) {
    throw new Error('Pickup not found');
  }

  if (pickup.status === PICKUP_STATUS.COMPLETED) {
    throw new Error('Cannot cancel completed pickup');
  }

  pickup.status = PICKUP_STATUS.CANCELLED;
  await pickup.save();
  return pickup;
};

module.exports = {
  schedulePickup,
  getUserPickups,
  getPickupById,
  updatePickupStatus,
  updatePickupWeights,
  getAgentPickups,
  cancelPickup,
};

