const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Admin = require('../models/Admin');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. No token provided.' 
      });
    }

    // Handle both "Bearer token" and just "token" formats
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.replace('Bearer ', '') 
      : authHeader;

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ 
        success: false,
        error: 'Access denied. Invalid token format.' 
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          error: 'Token expired. Please log in again.' 
        });
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid token. Please log in again.' 
        });
      }
      throw jwtError;
    }

    const role = decoded.role || 'user';
    const userId = decoded.id || decoded._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token. User ID not found.' 
      });
    }

    let user;
    try {
      if (role === 'user') {
        user = await User.findById(userId).select('-password');
      } else if (role === 'agent') {
        user = await Agent.findById(userId).select('-password');
      } else if (role === 'admin') {
        user = await Admin.findById(userId).select('-password');
      } else {
        return res.status(401).json({ 
          success: false,
          error: 'Invalid user role in token.' 
        });
      }
    } catch (dbError) {
      console.error('Database error during authentication:', dbError);
      return res.status(500).json({ 
        success: false,
        error: 'Database error during authentication.' 
      });
    }

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid token. User not found.' 
      });
    }

    // Check if account is active (only if isActive field exists)
    if (user.isActive !== undefined && user.isActive === false) {
      return res.status(401).json({ 
        success: false,
        error: 'Account is deactivated.' 
      });
    }

    // Attach user to request
    req.user = user;
    req.user.role = role;
    req.user._id = user._id;
    req.user.id = user._id;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
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

