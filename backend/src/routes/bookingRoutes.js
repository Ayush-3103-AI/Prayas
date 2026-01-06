const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Create booking (User only)
router.post('/', authenticate, bookingController.createBooking);

// Get booking by ID
router.get('/:id', authenticate, bookingController.getBookingById);

// Get all bookings (Admin only)
router.get('/', authenticate, authorize('admin'), bookingController.getAllBookings);

// Update booking status (Admin only)
router.put('/:id/status', authenticate, authorize('admin'), bookingController.updateBookingStatus);

module.exports = router;



