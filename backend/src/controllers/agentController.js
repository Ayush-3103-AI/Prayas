const Agent = require('../models/Agent');
const Booking = require('../models/Booking');
const PickupCompletion = require('../models/PickupCompletion');
const User = require('../models/User');

// @desc    Register agent
// @route   POST /api/agents/register
// @access  Public
const registerAgent = async (req, res) => {
  try {
    const { name, email, agentId, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ $or: [{ email }, { agentId }] });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        error: 'Agent already exists with this email or agent ID',
      });
    }

    const agent = await Agent.create({
      name,
      email,
      agentId,
      password,
    });

    const token = require('../services/authService').generateToken(agent._id, 'agent');

    res.status(201).json({
      success: true,
      data: {
        agent: {
          id: agent._id,
          name: agent.name,
          agentId: agent.agentId,
          role: 'agent',
        },
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to register agent',
    });
  }
};

// @desc    Get agent dashboard
// @route   GET /api/agents/:id/dashboard
// @access  Private (Agent)
const getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await Agent.findById(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    // Get assigned bookings AND pending bookings (available for pickup)
    const assignedBookings = await Booking.find({
      $or: [
        { agentId: agent._id, status: { $in: ['Assigned', 'In Progress'] } },
        { status: 'Pending' }, // Show all pending bookings so agents can see available pickups
      ],
    })
      .populate('userId', 'name')
      .sort({ preferredDate: 1 });

    // Get completed pickups
    const completedPickups = await PickupCompletion.find({
      agentId: agent._id,
      status: 'Completed',
    });

    // Calculate stats
    const assignedCount = assignedBookings.length;
    const completedCount = agent.completedPickups || 0;
    const totalWeight = agent.totalWeightCollected || 0;
    const totalDonations = agent.totalDonationsGenerated || 0;

    // Format pickups for frontend
    const pickups = assignedBookings.map((booking) => {
      const user = booking.userId;
      const isAssigned = booking.agentId && booking.agentId.toString() === agent._id.toString();
      return {
        pickupId: booking.bookingId,
        bookingId: booking.bookingId,
        _id: booking._id,
        customerName: user?.name || 'Unknown',
        address: booking.address,
        wasteType: `${booking.wasteType} - ${booking.weight} kg`,
        date: booking.preferredDate.toLocaleDateString(),
        time: booking.preferredTime,
        status: booking.status === 'Pending' ? 'New' : booking.status === 'Assigned' ? 'New' : booking.status,
        ngoPartner: booking.ngoPartner || 'Not assigned',
        isAssigned: isAssigned,
        canAccept: booking.status === 'Pending' && !booking.agentId, // Can accept if pending and not assigned
      };
    });

    res.status(200).json({
      success: true,
      data: {
        assignedCount,
        completedCount,
        totalWeight,
        totalDonations,
        pickups,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch dashboard data',
    });
  }
};

// @desc    Get agent pickups
// @route   GET /api/agents/:id/pickups
// @access  Private (Agent)
const getAgentPickups = async (req, res) => {
  try {
    const agentId = req.params.id;
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    // Get assigned bookings AND pending bookings (available for pickup)
    const bookings = await Booking.find({
      $or: [
        { agentId: agent._id, status: { $in: ['Assigned', 'In Progress'] } },
        { status: 'Pending' }, // Show all pending bookings so agents can see available pickups
      ],
    })
      .populate('userId', 'name')
      .sort({ preferredDate: 1 });

    // Format pickups for frontend
    const pickups = bookings.map((booking) => {
      const user = booking.userId;
      const isAssigned = booking.agentId && booking.agentId.toString() === agent._id.toString();
      return {
        _id: booking._id,
        bookingId: booking.bookingId,
        customerName: user?.name || 'Unknown',
        address: booking.address,
        wasteType: `${booking.wasteType} - ${booking.weight} kg`,
        date: booking.preferredDate.toLocaleDateString(),
        time: booking.preferredTime,
        status: booking.status === 'Pending' ? 'New' : booking.status === 'Assigned' ? 'New' : booking.status,
        ngoPartner: booking.ngoPartner || 'Not assigned',
        isAssigned: isAssigned,
        canAccept: booking.status === 'Pending' && !booking.agentId,
      };
    });

    res.status(200).json({
      success: true,
      data: { pickups },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch pickups',
    });
  }
};

// @desc    Accept/Assign booking to agent
// @route   POST /api/agents/:id/accept-booking/:bookingId
// @access  Private (Agent)
const acceptBooking = async (req, res) => {
  try {
    const agentId = req.params.id;
    const bookingId = req.params.bookingId;
    
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    if (booking.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        error: 'Booking is not available for assignment',
      });
    }

    if (booking.agentId) {
      return res.status(400).json({
        success: false,
        error: 'Booking is already assigned to another agent',
      });
    }

    // Assign booking to agent
    booking.agentId = agent._id;
    booking.status = 'Assigned';
    await booking.save();

    // Add to agent's assigned pickups
    agent.assignedPickups.push(booking._id);
    await agent.save();

    res.status(200).json({
      success: true,
      data: { booking },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to accept booking',
    });
  }
};

// @desc    Upload pickup evidence file
// @route   POST /api/agents/pickups/:id/upload-evidence
// @access  Private (Agent)
const uploadPickupEvidence = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const bookingId = req.params.id;
    const agentId = req.user._id || req.user.id;

    // Find booking
    let booking = await Booking.findById(bookingId);
    if (!booking) {
      booking = await Booking.findOne({ bookingId: bookingId });
    }
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Verify the agent is assigned to this booking
    if (booking.agentId && booking.agentId.toString() !== agentId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not assigned to this booking',
      });
    }

    // Construct file URL (in production, this would be a CDN URL)
    const fileUrl = `/uploads/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrl}`;

    res.status(200).json({
      success: true,
      data: {
        fileUrl: fullUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to upload file',
    });
  }
};

// @desc    Complete pickup
// @route   POST /api/pickups/:id/complete
// @access  Private (Agent)
const completePickup = async (req, res) => {
  try {
    const { actualWeight, wasteCondition, notes, photoUrls, pickupId } = req.body;
    const bookingId = req.params.id || pickupId; // Use pickupId from body if params.id is missing
    const agentId = req.user._id || req.user.id;

    console.log('Completing pickup - bookingId:', bookingId, 'pickupId:', pickupId, 'agentId:', agentId);
    console.log('Waste condition received:', wasteCondition); // Should be EXCELLENT, GOOD, or FAIR

    // Try to find by _id first, then by bookingId string
    let booking = await Booking.findById(bookingId);
    if (!booking) {
      booking = await Booking.findOne({ bookingId: bookingId });
    }
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Verify the agent is assigned to this booking
    if (booking.agentId && booking.agentId.toString() !== agentId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'You are not assigned to this booking',
      });
    }

    // Create pickup completion record
    const pickup = await PickupCompletion.create({
      bookingId: booking._id,
      agentId,
      actualWeight,
      wasteCondition,
      notes,
      photoUrls: photoUrls || [],
      status: 'Completed',
      completedAt: new Date(),
    });

    // Update booking status
    booking.status = 'Completed';
    await booking.save();

    // Update agent stats
    const agent = await Agent.findById(agentId);
    agent.completedPickups = (agent.completedPickups || 0) + 1;
    agent.totalWeightCollected = (agent.totalWeightCollected || 0) + (actualWeight || 0);
    
    // Calculate donation (assuming ₹10 per kg)
    const donationAmount = (actualWeight || 0) * 10;
    agent.totalDonationsGenerated = (agent.totalDonationsGenerated || 0) + donationAmount;
    await agent.save();

    // Update user stats
    const user = await User.findById(booking.userId);
    if (user) {
      user.totalWasteRecycled = (user.totalWasteRecycled || 0) + (actualWeight || 0);
      user.totalDonations = (user.totalDonations || 0) + donationAmount;
      user.totalPickups = (user.totalPickups || 0) + 1;
      await user.save();
    }

    // Return updated stats for frontend
    const updatedAgent = await Agent.findById(agentId);
    
    res.status(200).json({
      success: true,
      data: {
        pickup,
        booking,
        stats: {
          completedCount: updatedAgent.completedPickups,
          totalWeight: updatedAgent.totalWeightCollected,
          totalDonations: updatedAgent.totalDonationsGenerated,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to complete pickup',
    });
  }
};

module.exports = {
  registerAgent,
  getAgentDashboard,
  getAgentPickups,
  acceptBooking,
  uploadPickupEvidence,
  completePickup,
};

