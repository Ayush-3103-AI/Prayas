const leaderboardService = require('../services/leaderboardService');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard/global
// @access  Public
const getGlobalLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all-time', limit = 100 } = req.query;
    const leaderboard = await leaderboardService.getLeaderboard(period, null, parseInt(limit));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get community leaderboard
// @route   GET /api/leaderboard/community
// @access  Public
const getCommunityLeaderboard = async (req, res, next) => {
  try {
    const { period = 'all-time', community, limit = 100 } = req.query;

    if (!community) {
      return res.status(400).json({
        success: false,
        error: 'Community parameter is required',
      });
    }

    const leaderboard = await leaderboardService.getLeaderboard(period, community, parseInt(limit));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get weekly leaderboard
// @route   GET /api/leaderboard/weekly
// @access  Public
const getWeeklyLeaderboard = async (req, res, next) => {
  try {
    const { community, limit = 100 } = req.query;
    const leaderboard = await leaderboardService.getLeaderboard('weekly', community, parseInt(limit));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get monthly leaderboard
// @route   GET /api/leaderboard/monthly
// @access  Public
const getMonthlyLeaderboard = async (req, res, next) => {
  try {
    const { community, limit = 100 } = req.query;
    const leaderboard = await leaderboardService.getLeaderboard('monthly', community, parseInt(limit));

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user rank
// @route   GET /api/leaderboard/user/:id
// @access  Public
const getUserRank = async (req, res, next) => {
  try {
    const { period = 'all-time' } = req.query;
    const leaderboard = await leaderboardService.getUserRank(req.params.id, period);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGlobalLeaderboard,
  getCommunityLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getUserRank,
};

