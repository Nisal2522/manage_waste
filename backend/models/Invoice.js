import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection', required: true },
  amount: { type: Number, required: true },
  wasteType: { 
    type: String, 
    enum: ['organic', 'plastic', 'paper', 'glass', 'mixed'],
    required: true 
  },
  weight: { type: Number, required: true },
  ratePerKg: { type: Number, required: true },
  billingPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'overdue', 'cancelled'], 
    default: 'pending' 
  },
  dueDate: { type: Date, required: true },
  paidDate: Date,
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'bank_transfer', 'mobile_payment'] 
  },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  notes: String
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
