const { body } = require('express-validator');

// User registration validation
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid phone number'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// User login validation
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Pickup validation
const validatePickup = [
  body('pickupDate')
    .notEmpty()
    .withMessage('Pickup date is required')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('timeSlot')
    .notEmpty()
    .withMessage('Time slot is required')
    .isIn(['9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM'])
    .withMessage('Invalid time slot'),
  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),
  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('address.pincode')
    .trim()
    .notEmpty()
    .withMessage('Pincode is required'),
  body('materials')
    .isArray({ min: 1 })
    .withMessage('At least one material is required'),
  body('materials.*.type')
    .isIn(['paper', 'plastic', 'metal', 'glass', 'electronics', 'mixed'])
    .withMessage('Invalid material type'),
  body('materials.*.estimatedWeight')
    .isFloat({ min: 0 })
    .withMessage('Estimated weight must be a positive number'),
  body('selectedNGO')
    .notEmpty()
    .withMessage('NGO selection is required')
    .isMongoId()
    .withMessage('Invalid NGO ID'),
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePickup,
};

