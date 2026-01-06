const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');

// Public routes
router.get('/global', leaderboardController.getGlobalLeaderboard);
router.get('/community', leaderboardController.getCommunityLeaderboard);
router.get('/weekly', leaderboardController.getWeeklyLeaderboard);
router.get('/monthly', leaderboardController.getMonthlyLeaderboard);
router.get('/user/:id', leaderboardController.getUserRank);

module.exports = router;

