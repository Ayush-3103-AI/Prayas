const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      unique: true,
      required: [true, 'Admin ID is required'],
      trim: true,
      uppercase: true,
      match: [/^AD-\d{5}$/, 'Admin ID must be in format AD-XXXXX'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
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
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Generate admin ID before saving (only if not provided)
adminSchema.pre('save', async function (next) {
  if (!this.adminId) {
    try {
      const count = await mongoose.model('Admin').countDocuments();
      this.adminId = `AD-${String(count + 1).padStart(5, '0')}`;
    } catch (error) {
      // If model doesn't exist yet, use default
      this.adminId = `AD-00001`;
    }
  }
  next();
});

module.exports = mongoose.model('Admin', adminSchema);

