const User = require('../models/User');
const Pickup = require('../models/Pickup');
const Booking = require('../models/Booking');
const Agent = require('../models/Agent');
const NGO = require('../models/NGO');
const Donation = require('../models/Donation');
const CSRCampaign = require('../models/CSRCampaign');
const pickupService = require('../services/pickupService');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, isActive } = req.query;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin)
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Activate/Deactivate user
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all agents
// @route   GET /api/admin/agents
// @access  Private (Admin)
const getAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify agent
// @route   POST /api/admin/agents/verify
// @access  Private (Admin)
const verifyAgent = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    const agent = await User.findByIdAndUpdate(
      agentId,
      { 'agentDetails.verified': true },
      { new: true }
    ).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    res.status(200).json({
      success: true,
      data: agent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign pickup to agent
// @route   POST /api/admin/pickups/:id/assign
// @access  Private (Admin)
const assignPickup = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    const pickup = await pickupService.updatePickupStatus(req.params.id, 'assigned', agentId);

    res.status(200).json({
      success: true,
      data: pickup,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pickups
// @route   GET /api/admin/pickups
// @access  Private (Admin)
const getAllPickups = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    // Use Booking model instead of Pickup
    const Booking = require('../models/Booking');
    const pickups = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('agentId', 'name agentId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending pickups
// @route   GET /api/admin/pickups/pending
// @access  Private (Admin)
const getPendingPickups = async (req, res, next) => {
  try {
    const pickups = await Pickup.find({ status: 'scheduled' })
      .populate('userId', 'name email phone address')
      .populate('selectedNGO', 'name')
      .sort({ pickupDate: 1 });

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all NGOs (including unverified)
// @route   GET /api/admin/ngos
// @access  Private (Admin)
const getAllNGOs = async (req, res, next) => {
  try {
    const ngos = await NGO.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: ngos.length,
      data: ngos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify NGO
// @route   PATCH /api/admin/ngos/:id/verify
// @access  Private (Admin)
const verifyNGO = async (req, res, next) => {
  try {
    const ngo = await NGO.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );

    if (!ngo) {
      return res.status(404).json({
        success: false,
        error: 'NGO not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ngo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
const getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Count bookings for today
    const totalPickupsToday = await Booking.countDocuments({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Count completed bookings for today
    const completedToday = await Booking.countDocuments({
      status: 'Completed',
      updatedAt: { $gte: today, $lt: tomorrow },
    });

    // Count pending bookings
    const pendingAssignment = await Booking.countDocuments({
      status: 'Pending',
    });

    // Calculate total donations (assuming ₹10 per kg)
    const allBookings = await Booking.find({ status: 'Completed' });
    const totalDonations = allBookings.reduce((sum, booking) => {
      return sum + (booking.weight * 10);
    }, 0);

    // Get recent pickups (including completed ones)
    const recentPickups = await Booking.find()
      .populate('userId', 'name')
      .populate('agentId', 'name agentId')
      .sort({ updatedAt: -1 }) // Sort by updatedAt to show recently completed pickups first
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalPickupsToday,
        completedToday,
        pendingAssignment,
        totalDonations,
        recentPickups,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch dashboard data',
    });
  }
};

// @desc    Get all pickups (Admin)
// @route   GET /api/admin/pickups
// @access  Private (Admin)
const getAdminPickups = async (req, res) => {
  try {
    const { status, date } = req.query;
    const query = {};

    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    const pickups = await Booking.find(query)
      .populate('userId', 'name')
      .populate('agentId', 'name agentId')
      .sort({ createdAt: -1 });

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

// @desc    Get all agents (Admin)
// @route   GET /api/admin/agents
// @access  Private (Admin)
const getAdminAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const agentsWithStats = await Promise.all(
      agents.map(async (agent) => {
        const assignedCount = await Booking.countDocuments({
          agentId: agent._id,
          status: { $in: ['Assigned', 'In Progress'] },
        });
        const completedCount = agent.completedPickups || 0;

        return {
          agentId: agent.agentId,
          name: agent.name,
          email: agent.email,
          assignedCount,
          completedCount,
          totalWeight: agent.totalWeightCollected || 0,
          rating: agent.rating || 0,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: { agents: agentsWithStats },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch agents',
    });
  }
};

// @desc    Assign agent to booking
// @route   POST /api/admin/assign
// @access  Private (Admin)
const assignAgent = async (req, res) => {
  try {
    const { bookingId, agentId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    booking.agentId = agentId;
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
      error: error.message || 'Failed to assign agent',
    });
  }
};

// @desc    Generate report
// @route   GET /api/admin/report
// @access  Private (Admin)
const generateReport = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'name email')
      .populate('agentId', 'name agentId')
      .sort({ createdAt: -1 });

    // Calculate summary statistics
    const totalWaste = bookings.reduce((sum, b) => sum + (b.weight || 0), 0);
    const totalDonations = bookings.reduce((sum, b) => sum + ((b.weight || 0) * 10), 0);
    const completedCount = bookings.filter(b => b.status === 'Completed').length;
    const activeUsers = new Set(bookings.map(b => b.userId?._id?.toString()).filter(Boolean)).size;
    const activeAgents = new Set(bookings.map(b => b.agentId?._id?.toString()).filter(Boolean)).size;
    const ngos = new Set(bookings.map(b => b.ngoPartner).filter(Boolean)).size;

    const reportData = bookings.map((booking) => ({
      bookingId: booking.bookingId,
      userName: booking.userId?.name || 'N/A',
      userEmail: booking.userId?.email || 'N/A',
      address: booking.address,
      wasteType: booking.wasteType,
      weight: booking.weight,
      status: booking.status,
      pickupDate: booking.preferredDate,
      agentName: booking.agentId?.name || 'Not assigned',
      agentId: booking.agentId?.agentId || 'N/A',
      ngoPartner: booking.ngoPartner || 'N/A',
      donationAmount: (booking.weight || 0) * 10,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    if (format === 'csv') {
      // Add summary section at the top
      const summary = [
        'PRAYAS - URBAN RECYCLING PLATFORM REPORT',
        `Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
        `Report Period: ${startDate ? new Date(startDate).toLocaleDateString('en-IN') : 'All Time'} to ${endDate ? new Date(endDate).toLocaleDateString('en-IN') : 'Today'}`,
        '',
        'SUMMARY STATISTICS',
        `Total Waste Recycled,${totalWaste} kg`,
        `Total Donations,₹${totalDonations.toLocaleString('en-IN')}`,
        `Completed Pickups,${completedCount}`,
        `Active Users,${activeUsers}`,
        `Active Agents,${activeAgents}`,
        `Partner NGOs,${ngos}`,
        `Completion Rate,${bookings.length > 0 ? ((completedCount / bookings.length) * 100).toFixed(2) : 0}%`,
        '',
        'DETAILED PICKUP DATA',
        '',
      ];

      // Convert to CSV
      const headers = Object.keys(reportData[0] || {});
      const csv = [
        ...summary,
        headers.join(','),
        ...reportData.map((row) =>
          headers.map((header) => {
            const value = row[header];
            if (value instanceof Date) {
              return JSON.stringify(value.toISOString());
            }
            return JSON.stringify(value || '');
          }).join(',')
        ),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename=prayas-report-${new Date().toISOString().split('T')[0]}.csv`);
      return res.send(csv);
    }

    res.status(200).json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate report',
    });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats/overview
// @access  Private (Admin)
const getOverviewStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAgents = await Agent.countDocuments();
    const totalPickups = await Booking.countDocuments();
    const completedPickups = await Booking.countDocuments({ status: 'Completed' });
    const totalDonations = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    const totalNGOs = await NGO.countDocuments({ verified: true });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAgents,
        totalPickups,
        completedPickups,
        totalDonations: totalDonations[0]?.total || 0,
        totalNGOs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get CSR campaigns
// @route   GET /api/admin/csr/campaigns
// @access  Private (Admin)
const getCSRCampaigns = async (req, res, next) => {
  try {
    const campaigns = await CSRCampaign.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: campaigns.length,
      data: campaigns,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create CSR campaign
// @route   POST /api/admin/csr/campaigns
// @access  Private (Admin)
const createCSRCampaign = async (req, res, next) => {
  try {
    const campaign = await CSRCampaign.create(req.body);

    res.status(201).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update CSR campaign
// @route   PUT /api/admin/csr/campaigns/:id
// @access  Private (Admin)
const updateCSRCampaign = async (req, res, next) => {
  try {
    const campaign = await CSRCampaign.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    res.status(200).json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete CSR campaign
// @route   DELETE /api/admin/csr/campaigns/:id
// @access  Private (Admin)
const deleteCSRCampaign = async (req, res, next) => {
  try {
    const campaign = await CSRCampaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserStatus,
  getAgents,
  verifyAgent,
  assignPickup,
  getAllPickups,
  getPendingPickups,
  getAllNGOs,
  verifyNGO,
  getOverviewStats,
  getCSRCampaigns,
  createCSRCampaign,
  updateCSRCampaign,
  deleteCSRCampaign,
  getDashboard,
  getAdminPickups,
  getAdminAgents,
  assignAgent,
  generateReport,
};

