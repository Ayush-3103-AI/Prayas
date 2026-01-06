const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../config/constants');

// Public routes
router.get('/', ngoController.getNGOs);
router.get('/categories', ngoController.getNGOCategories);
router.get('/:id', ngoController.getNGOById);
router.get('/:id/impact', ngoController.getNGOImpact);
router.post('/register', ngoController.registerNGO);

module.exports = router;

