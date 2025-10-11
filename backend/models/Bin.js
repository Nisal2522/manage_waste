const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  address: {
    street: String,
    city: String,
    district: String
  },
  capacity: { type: Number, required: true },
  currentLevel: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance'], 
    default: 'active' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  qrCode: String,
  lastCollected: Date
}, { timestamps: true });

module.exports = mongoose.model('Bin', binSchema);
