const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

router.get('/', authenticate, authorize(ROLES.USER), donationController.getUserDonations);
router.get('/history', authenticate, authorize(ROLES.USER), donationController.getDonationHistory);
router.get('/total', authenticate, authorize(ROLES.USER), donationController.getTotalDonations);
router.get('/:id', authenticate, donationController.getDonationById);
router.get('/receipt/:id', authenticate, donationController.getDonationReceipt);

// NGO routes
router.get(
  '/ngo/received',
  authenticate,
  authorize(ROLES.NGO),
  donationController.getNGODonations
);

module.exports = router;

