const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const agentSchema = new mongoose.Schema(
  {
    agentId: {
      type: String,
      unique: true,
      required: [true, 'Agent ID is required'],
      trim: true,
      uppercase: true,
      match: [/^AG-\d{5}$/, 'Agent ID must be in format AG-XXXXX'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: false, // Phone number removed per requirements
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    assignedPickups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
      },
    ],
    completedPickups: {
      type: Number,
      default: 0,
    },
    totalWeightCollected: {
      type: Number,
      default: 0,
    },
    totalDonationsGenerated: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
agentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
agentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
agentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Generate agent ID before saving (only if not provided)
agentSchema.pre('save', async function (next) {
  if (!this.agentId) {
    try {
      const count = await mongoose.model('Agent').countDocuments();
      this.agentId = `AG-${String(count + 1).padStart(5, '0')}`;
    } catch (error) {
      // If model doesn't exist yet, use default
      this.agentId = `AG-00001`;
    }
  }
  next();
});

module.exports = mongoose.model('Agent', agentSchema);

