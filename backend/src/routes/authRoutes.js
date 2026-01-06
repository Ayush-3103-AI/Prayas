const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

// User authentication
router.post('/user-register', authController.userRegister);
router.post('/user-login', authController.userLogin);

// Agent authentication
router.post('/agent-login', authController.agentLogin);

// Admin authentication
router.post('/admin-login', authController.adminLogin);

// Common routes
router.post('/logout', authController.logout);
router.get('/verify', authenticate, authController.verify);

module.exports = router;

