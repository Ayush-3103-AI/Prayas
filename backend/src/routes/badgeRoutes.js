const express = require('express');
const router = express.Router();
const badgeController = require('../controllers/badgeController');

// Public routes
router.get('/', badgeController.getBadges);
router.get('/user/:userId', badgeController.getUserBadges);

module.exports = router;

