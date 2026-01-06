const express = require('express');
const router = express.Router();
const pickupController = require('../controllers/pickupController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { validatePickup } = require('../utils/validators');
const validate = require('../middleware/validation');
const { ROLES } = require('../config/constants');

router.post(
  '/',
  authenticate,
  authorize(ROLES.USER),
  validatePickup,
  validate,
  pickupController.schedulePickup
);

router.get('/', authenticate, authorize(ROLES.USER), pickupController.getUserPickups);
router.get('/history', authenticate, authorize(ROLES.USER), pickupController.getPickupHistory);
router.get('/:id', authenticate, pickupController.getPickupById);
router.delete('/:id', authenticate, authorize(ROLES.USER), pickupController.cancelPickup);

// Agent routes
router.get(
  '/agent/assigned',
  authenticate,
  authorize(ROLES.AGENT),
  pickupController.getAgentPickups
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(ROLES.AGENT, ROLES.ADMIN),
  pickupController.updatePickupStatus
);

module.exports = router;

