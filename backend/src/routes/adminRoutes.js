const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

// User Management
router.get('/users', authenticate, authorize(ROLES.ADMIN), adminController.getUsers);
router.get('/users/:id', authenticate, authorize(ROLES.ADMIN), adminController.getUserById);
router.put('/users/:id', authenticate, authorize(ROLES.ADMIN), adminController.updateUser);
router.delete('/users/:id', authenticate, authorize(ROLES.ADMIN), adminController.deleteUser);
router.patch(
  '/users/:id/status',
  authenticate,
  authorize(ROLES.ADMIN),
  adminController.updateUserStatus
);

// Agent Management
router.get('/agents', authenticate, authorize(ROLES.ADMIN), adminController.getAgents);
router.post('/agents/verify', authenticate, authorize(ROLES.ADMIN), adminController.verifyAgent);

// Pickup Management
router.get('/pickups', authenticate, authorize(ROLES.ADMIN), adminController.getAllPickups);
router.get(
  '/pickups/pending',
  authenticate,
  authorize(ROLES.ADMIN),
  adminController.getPendingPickups
);
router.post(
  '/pickups/:id/assign',
  authenticate,
  authorize(ROLES.ADMIN),
  adminController.assignPickup
);

// NGO Management
router.get('/ngos', authenticate, authorize(ROLES.ADMIN), adminController.getAllNGOs);
router.patch('/ngos/:id/verify', authenticate, authorize(ROLES.ADMIN), adminController.verifyNGO);

// Dashboard
router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboard);

// Pickup Management (Bookings)
router.get('/pickups', authenticate, authorize('admin'), adminController.getAdminPickups);

// Agent Management
router.get('/agents', authenticate, authorize('admin'), adminController.getAdminAgents);

// Assign agent to booking
router.post('/assign', authenticate, authorize('admin'), adminController.assignAgent);

// Generate report
router.get('/report', authenticate, authorize('admin'), adminController.generateReport);

// Statistics
router.get(
  '/stats/overview',
  authenticate,
  authorize(ROLES.ADMIN),
  adminController.getOverviewStats
);

// CSR Campaigns
router.get(
  '/csr/campaigns',
  authenticate,
  authorize(ROLES.ADMIN),
  adminController.getCSRCampaigns
);
router.post(
  '/csr/campaigns',
  authenticate,
  authorize(ROLES.ADMIN),
  adminController.createCSRCampaign
);
router.put(
  '/csr/campaigns/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  adminController.updateCSRCampaign
);
router.delete(
  '/csr/campaigns/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  adminController.deleteCSRCampaign
);

module.exports = router;

