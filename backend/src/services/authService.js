const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Agent = require('../models/Agent');
const Admin = require('../models/Admin');

// Generate JWT token
const generateToken = (userId, role = 'user') => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Register user
const registerUser = async (userData) => {
  const { name, email, address, password } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone: '', // Phone removed per requirements
    address,
    password,
    role: 'user',
  });

  const token = generateToken(user._id, 'user');

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
    },
    token,
  };
};

// Login user
const loginUser = async (email, password) => {
  // Find user and include password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user._id, 'user');

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: 'user',
    },
    token,
  };
};

// Login agent
const loginAgent = async (agentId, password) => {
  // Find agent and include password
  const agent = await Agent.findOne({ agentId }).select('+password');
  if (!agent) {
    throw new Error('Invalid agent ID or password');
  }

  // Check password
  const isMatch = await agent.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid agent ID or password');
  }

  if (!agent.isActive) {
    throw new Error('Agent account is deactivated');
  }

  const token = generateToken(agent._id, 'agent');

  return {
    agent: {
      id: agent._id,
      name: agent.name,
      agentId: agent.agentId,
      role: 'agent',
    },
    token,
  };
};

// Login admin
const loginAdmin = async (adminId, password) => {
  // Find admin and include password
  const admin = await Admin.findOne({ adminId }).select('+password');
  if (!admin) {
    throw new Error('Invalid admin ID or password');
  }

  // Check password
  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid admin ID or password');
  }

  if (!admin.isActive) {
    throw new Error('Admin account is deactivated');
  }

  const token = generateToken(admin._id, 'admin');

  return {
    admin: {
      id: admin._id,
      adminId: admin.adminId,
      role: 'admin',
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
  loginAgent,
  loginAdmin,
  generateToken,
};

