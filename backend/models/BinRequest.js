import mongoose from 'mongoose';

const binRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  selectedBins: [{
    binType: {
      type: String,
      required: true,
      enum: ['general', 'recyclable', 'organic', 'hazardous', 'medical']
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    capacity: {
      type: String,
      required: true
    }
  }],
  specialInstructions: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field before saving
binRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const BinRequest = mongoose.model('BinRequest', binRequestSchema);

export default BinRequest;
