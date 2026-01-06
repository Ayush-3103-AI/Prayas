const mongoose = require('mongoose');
const { PICKUP_STATUS, TIME_SLOTS } = require('../config/constants');

const pickupSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
      enum: TIME_SLOTS,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    materials: [
      {
        type: {
          type: String,
          required: true,
          enum: ['paper', 'plastic', 'metal', 'glass', 'electronics', 'mixed'],
        },
        estimatedWeight: {
          type: Number,
          required: true,
          min: 0,
        },
        actualWeight: {
          type: Number,
          min: 0,
        },
        value: {
          type: Number,
          default: 0,
        },
      },
    ],
    selectedNGO: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NGO',
      required: [true, 'NGO selection is required'],
    },
    status: {
      type: String,
      enum: Object.values(PICKUP_STATUS),
      default: PICKUP_STATUS.SCHEDULED,
    },
    notes: String,
    images: [String], // Agent uploads after collection
    totalEstimatedValue: {
      type: Number,
      default: 0,
    },
    totalActualValue: {
      type: Number,
      default: 0,
    },
    totalWeight: {
      type: Number,
      default: 0,
    },
    assignedAt: Date,
    collectedAt: Date,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Calculate total estimated value before saving
pickupSchema.pre('save', function (next) {
  if (this.materials && this.materials.length > 0) {
    const { MATERIAL_RATES } = require('../config/constants');
    this.totalEstimatedValue = this.materials.reduce((sum, material) => {
      return sum + (material.estimatedWeight * (MATERIAL_RATES[material.type] || 0));
    }, 0);
    this.totalWeight = this.materials.reduce((sum, material) => {
      return sum + (material.estimatedWeight || 0);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('Pickup', pickupSchema);

