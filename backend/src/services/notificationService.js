const whatsappService = require('./whatsappService');

// Send pickup scheduled notification
const sendPickupScheduled = async (user, pickup) => {
  const message = `✅ Pickup Scheduled!\n\nDate: ${new Date(pickup.pickupDate).toLocaleDateString()}\nTime: ${pickup.timeSlot}\nAddress: ${pickup.address.street}, ${pickup.address.city}\n\nWe'll notify you when an agent is assigned.`;
  
  await whatsappService.sendMessage(user.phone, message);
};

// Send agent assigned notification
const sendAgentAssigned = async (user, agent, pickup) => {
  const userMessage = `👷 Agent Assigned!\n\nAgent: ${agent.name}\nPhone: ${agent.phone}\n\nYour pickup is scheduled for ${new Date(pickup.pickupDate).toLocaleDateString()} at ${pickup.timeSlot}.`;
  const agentMessage = `📦 New Pickup Assigned!\n\nUser: ${user.name}\nPhone: ${user.phone}\nDate: ${new Date(pickup.pickupDate).toLocaleDateString()}\nTime: ${pickup.timeSlot}\nAddress: ${pickup.address.street}, ${pickup.address.city}`;
  
  await whatsappService.sendMessage(user.phone, userMessage);
  await whatsappService.sendMessage(agent.phone, agentMessage);
};

// Send pickup reminder
const sendPickupReminder = async (user, pickup) => {
  const message = `⏰ Reminder: Your pickup is scheduled in 1 hour!\n\nTime: ${pickup.timeSlot}\nAddress: ${pickup.address.street}, ${pickup.address.city}\n\nPlease keep your recyclables ready.`;
  
  await whatsappService.sendMessage(user.phone, message);
};

// Send collection complete notification
const sendCollectionComplete = async (user, pickup, donation) => {
  const message = `🎉 Collection Complete!\n\nWeight: ${pickup.totalWeight} kg\nDonation Amount: ₹${donation.totalAmount}\nNGO: ${donation.ngoId.name}\nReceipt ID: ${donation.receiptId}\n\nThank you for recycling! 🌱`;
  
  await whatsappService.sendMessage(user.phone, message);
};

// Send badge earned notification
const sendBadgeEarned = async (user, badge) => {
  const message = `🏆 Badge Earned!\n\nCongratulations! You've earned the "${badge.name}" badge!\n\n${badge.description}\n\nKeep up the great work! 🌟`;
  
  await whatsappService.sendMessage(user.phone, message);
};

module.exports = {
  sendPickupScheduled,
  sendAgentAssigned,
  sendPickupReminder,
  sendCollectionComplete,
  sendBadgeEarned,
};

