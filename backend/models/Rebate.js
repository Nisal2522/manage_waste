import mongoose from 'mongoose';

const rebateSchema = new mongoose.Schema({
  rebateNumber: { type: String, required: true, unique: true },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
  wasteType: { 
    type: String, 
    enum: ['organic', 'plastic', 'paper', 'glass', 'mixed'],
    required: true 
  },
  weight: { type: Number, required: true },
  rebateRate: { type: Number, required: true }, // Rate per kg for recycling
  amount: { type: Number, required: true },
  recyclingCategory: {
    type: String,
    enum: ['high_value', 'medium_value', 'low_value'],
    required: true
  },
  processingDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'paid', 'rejected'], 
    default: 'pending' 
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedDate: Date,
  paymentDate: Date,
  notes: String
}, { timestamps: true });

export default mongoose.model('Rebate', rebateSchema);
