const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// IMPORTANT: Order matters! More specific routes must come first
// Get all bookings (Admin only) - must come before /:id route
router.get('/', authenticate, authorize('admin'), bookingController.getAllBookings);

// Create booking (User only) - any authenticated user can create
router.post('/', authenticate, bookingController.createBooking);

// Get booking by ID - any authenticated user can view their own booking
router.get('/:id', authenticate, bookingController.getBookingById);

// Update booking status (Admin only)
router.put('/:id/status', authenticate, authorize('admin'), bookingController.updateBookingStatus);

// Update booking status (Agent) - must come before PUT route to avoid conflicts
router.patch('/:id/status', authenticate, authorize('agent'), bookingController.updateBookingStatusByAgent);

module.exports = router;



