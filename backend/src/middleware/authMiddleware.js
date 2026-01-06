const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Admin = require('../models/Admin');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const role = decoded.role || 'user';

    let user;
    if (role === 'user') {
      user = await User.findById(decoded.id).select('-password');
    } else if (role === 'agent') {
      user = await Agent.findById(decoded.id).select('-password');
    } else if (role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token. User not found.' 
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({ 
        success: false,
        error: 'Account is deactivated.' 
      });
    }

    req.user = user;
    req.user.role = role;
    
    // Ensure role is accessible
    if (!req.user.role) {
      req.user.role = role;
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token expired.' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'Authentication failed.' 
    });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required.' 
      });
    }

    const userRole = req.user.role || (req.user.constructor.modelName === 'Agent' ? 'agent' : req.user.constructor.modelName === 'Admin' ? 'admin' : 'user');
    
    if (!roles.includes(userRole)) {
      console.error('Authorization failed:', {
        userRole,
        requiredRoles: roles,
        userId: req.user._id,
        userModel: req.user.constructor.modelName,
      });
      return res.status(403).json({ 
        success: false,
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};

