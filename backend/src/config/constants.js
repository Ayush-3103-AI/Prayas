// Material rates (₹/kg)
const MATERIAL_RATES = {
  paper: 8,
  plastic: 12,
  metal: 25,
  glass: 5,
  electronics: 40,
  mixed: 6,
};

// CO2 saved per kg of material (kg CO2 per kg)
const CO2_FACTORS = {
  paper: 0.9,
  plastic: 1.5,
  metal: 2.0,
  glass: 0.3,
  electronics: 3.0,
  mixed: 1.0,
};

// Impact score weights
const IMPACT_SCORE_WEIGHTS = {
  pickup: 10,
  weight: 2,
  donation: 0.5,
  co2: 5,
};

// User roles
const ROLES = {
  USER: 'user',
  AGENT: 'agent',
  ADMIN: 'admin',
  NGO: 'ngo',
  CSR_ADMIN: 'csr_admin',
};

// Pickup status
const PICKUP_STATUS = {
  SCHEDULED: 'scheduled',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in-progress',
  COLLECTED: 'collected',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Donation status
const DONATION_STATUS = {
  PENDING: 'pending',
  PROCESSED: 'processed',
  TRANSFERRED: 'transferred',
  FAILED: 'failed',
};

// NGO categories
const NGO_CATEGORIES = [
  'education',
  'healthcare',
  'environment',
  'animal-welfare',
  'poverty-alleviation',
  'other',
];

// Badge tiers
const BADGE_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

// Time slots
const TIME_SLOTS = [
  '9AM-12PM',
  '12PM-3PM',
  '3PM-6PM',
  '6PM-9PM',
];

module.exports = {
  MATERIAL_RATES,
  CO2_FACTORS,
  IMPACT_SCORE_WEIGHTS,
  ROLES,
  PICKUP_STATUS,
  DONATION_STATUS,
  NGO_CATEGORIES,
  BADGE_TIERS,
  TIME_SLOTS,
};

