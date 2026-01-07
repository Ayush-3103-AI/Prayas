const Booking = require('../models/Booking');
const User = require('../models/User');
const Agent = require('../models/Agent');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (User)
const createBooking = async (req, res) => {
  try {
    const { address, wasteType, weight, preferredDate, preferredTime, ngoPartner } = req.body;
    
    // Extract user ID from authenticated user
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      console.error('User ID not found in request:', {
        user: req.user,
        userId: req.user?._id || req.user?.id,
      });
      return res.status(401).json({
        success: false,
        error: 'User authentication failed. Please log in again.',
      });
    }

    console.log('Creating booking for user:', userId);

    // Validate required fields
    if (!address || !wasteType || !weight || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: address, wasteType, weight, preferredDate, preferredTime',
      });
    }

    // Validate preferredTime enum
    const validTimes = ['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM'];
    if (!validTimes.includes(preferredTime)) {
      return res.status(400).json({
        success: false,
        error: `Invalid preferredTime. Must be one of: ${validTimes.join(', ')}`,
      });
    }

    const booking = await Booking.create({
      userId,
      address,
      wasteType,
      weight: parseFloat(weight),
      preferredDate: new Date(preferredDate),
      preferredTime,
      ngoPartner: ngoPartner || null,
      status: 'Pending',
    });

    // Populate user data for response
    await booking.populate('userId', 'name email');

    console.log(`✅ Booking created: ${booking.bookingId} for user ${userId}`);

    res.status(201).json({
      success: true,
      data: {
        booking: {
          _id: booking._id,
          bookingId: booking.bookingId,
          userId: booking.userId,
          address: booking.address,
          wasteType: booking.wasteType,
          weight: booking.weight,
          preferredDate: booking.preferredDate,
          preferredTime: booking.preferredTime,
          ngoPartner: booking.ngoPartner,
          status: booking.status,
          agentId: booking.agentId,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    let errorMessage = 'Failed to create booking';
    
    if (error.name === 'ValidationError') {
      errorMessage = `Booking validation failed: ${Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`).join(', ')}`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(400).json({
      success: false,
      error: errorMessage,
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('agentId', 'name agentId');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch booking',
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/users/:id/bookings
// @access  Private (User)
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    const bookings = await Booking.find({ userId })
      .populate('agentId', 'name agentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch bookings',
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings?status=Pending
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('agentId', 'name agentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { bookings },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch bookings',
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, agentId } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    booking.status = status;
    if (agentId) {
      booking.agentId = agentId;
      // Add booking to agent's assigned pickups
      await Agent.findByIdAndUpdate(agentId, {
        $addToSet: { assignedPickups: booking._id },
      });
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update booking',
    });
  }
};

// @desc    Update booking status (Agent)
// @route   PATCH /api/bookings/:id/status
// @access  Private (Agent) - Can only update their own assigned bookings
const updateBookingStatusByAgent = async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;
    const agentId = req.user._id || req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Verify agent is assigned to this booking
    if (booking.agentId && booking.agentId.toString() !== agentId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not assigned to this booking',
      });
    }

    // Validate status transitions for agents
    const validStatuses = ['Assigned', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Allowed: ${validStatuses.join(', ')}`,
      });
    }

    booking.status = status;
    
    // If completing, set completion timestamp
    if (status === 'Completed') {
      booking.completedAt = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to update booking',
    });
  }
};

module.exports = {
  createBooking,
  getBookingById,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  updateBookingStatusByAgent,
};

