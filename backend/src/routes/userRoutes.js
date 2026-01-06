const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// Profile routes
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.get('/dashboard', authenticate, userController.getDashboard);
router.get('/impact-stats', authenticate, userController.getImpactStats);
router.get('/badges', authenticate, userController.getBadges);
router.put('/change-password', authenticate, userController.changePassword);

// User by ID routes
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUserById);
router.get('/:id/bookings', authenticate, userController.getUserBookings);
router.get('/:id/impact', authenticate, userController.getUserImpact);

module.exports = router;

