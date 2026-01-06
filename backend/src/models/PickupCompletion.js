const mongoose = require('mongoose');

const pickupCompletionSchema = new mongoose.Schema(
  {
    pickupId: {
      type: String,
      unique: true,
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking ID is required'],
    },
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agent',
      required: [true, 'Agent ID is required'],
    },
    actualWeight: {
      type: Number,
      min: 0,
    },
    wasteCondition: {
      type: String,
      enum: ['EXCELLENT', 'GOOD', 'FAIR'],
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    photoUrls: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['Started', 'In Progress', 'Completed', 'Failed'],
      default: 'Started',
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Generate pickup ID before saving
pickupCompletionSchema.pre('save', async function (next) {
  if (!this.pickupId) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const count = await mongoose.model('PickupCompletion').countDocuments({
      createdAt: {
        $gte: new Date(year, date.getMonth(), date.getDate()),
        $lt: new Date(year, date.getMonth(), date.getDate() + 1),
      },
    });
    const sequence = String(count + 1).padStart(4, '0');
    this.pickupId = `PK-${year}${month}${day}-${sequence}`;
  }
  next();
});

// Index for faster queries
pickupCompletionSchema.index({ bookingId: 1 });
pickupCompletionSchema.index({ agentId: 1, status: 1 });

module.exports = mongoose.model('PickupCompletion', pickupCompletionSchema);



