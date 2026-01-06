const { MATERIAL_RATES, CO2_FACTORS, IMPACT_SCORE_WEIGHTS } = require('../config/constants');

// Calculate material value
const calculateMaterialValue = (materials) => {
  return materials.reduce((sum, material) => {
    const rate = MATERIAL_RATES[material.type] || 0;
    const weight = material.actualWeight || material.estimatedWeight || 0;
    return sum + (weight * rate);
  }, 0);
};

// Calculate CO2 saved
const calculateCO2Saved = (materials) => {
  return materials.reduce((sum, material) => {
    const factor = CO2_FACTORS[material.type] || 0;
    const weight = material.actualWeight || material.estimatedWeight || 0;
    return sum + (weight * factor);
  }, 0);
};

// Calculate impact score
const calculateImpactScore = (metrics) => {
  const { totalPickups, totalWeight, totalDonations, totalCO2Saved } = metrics;
  
  return (
    (totalPickups * IMPACT_SCORE_WEIGHTS.pickup) +
    (totalWeight * IMPACT_SCORE_WEIGHTS.weight) +
    (totalDonations * IMPACT_SCORE_WEIGHTS.donation) +
    (totalCO2Saved * IMPACT_SCORE_WEIGHTS.co2)
  );
};

// Generate receipt ID
const generateReceiptId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `PRY-${timestamp}-${random}`;
};

// Get period dates
const getPeriodDates = (period) => {
  const now = new Date();
  let periodStart, periodEnd;

  switch (period) {
    case 'weekly':
      periodStart = new Date(now);
      periodStart.setDate(now.getDate() - now.getDay());
      periodStart.setHours(0, 0, 0, 0);
      periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + 7);
      break;
    case 'monthly':
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      break;
    case 'yearly':
      periodStart = new Date(now.getFullYear(), 0, 1);
      periodEnd = new Date(now.getFullYear() + 1, 0, 1);
      break;
    case 'all-time':
      periodStart = new Date(0);
      periodEnd = new Date();
      break;
    default:
      periodStart = new Date(0);
      periodEnd = new Date();
  }

  return { periodStart, periodEnd };
};

module.exports = {
  calculateMaterialValue,
  calculateCO2Saved,
  calculateImpactScore,
  generateReceiptId,
  getPeriodDates,
};

