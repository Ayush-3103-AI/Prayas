const authService = require('../services/authService');

// @desc    Register user
// @route   POST /api/auth/user-register
// @access  Public
const userRegister = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/user-login
// @access  Public
const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
};

// @desc    Login agent
// @route   POST /api/auth/agent-login
// @access  Public
const agentLogin = async (req, res, next) => {
  try {
    const { agentId, password } = req.body;
    const { agent, token } = await authService.loginAgent(agentId, password);

    res.status(200).json({
      success: true,
      data: {
        agent,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res, next) => {
  try {
    const { adminId, password } = req.body;
    const { admin, token } = await authService.loginAdmin(adminId, password);

    res.status(200).json({
      success: true,
      data: {
        admin,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Logout failed',
    });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verify = async (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id || user.id,
          name: user.name,
          role: user.role || req.user.role,
        },
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message || 'Token verification failed',
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
  agentLogin,
  adminLogin,
  logout,
  verify,
};

