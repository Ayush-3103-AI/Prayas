const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Register agent
router.post('/register', agentController.registerAgent);

// File upload endpoint for pickup evidence
router.post('/pickups/:id/upload-evidence', authenticate, authorize('agent'), upload.single('file'), agentController.uploadPickupEvidence);

// Complete pickup (must be before /:id routes to avoid route conflicts)
router.post('/pickups/:id/complete', authenticate, authorize('agent'), agentController.completePickup);

// Get agent dashboard
router.get('/:id/dashboard', authenticate, authorize('agent'), agentController.getAgentDashboard);

// Get agent pickups
router.get('/:id/pickups', authenticate, authorize('agent'), agentController.getAgentPickups);

// Accept/Assign booking to agent
router.post('/:id/accept-booking/:bookingId', authenticate, authorize('agent'), agentController.acceptBooking);

module.exports = router;

