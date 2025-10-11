const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collectionTime: { type: Date, default: Date.now },
  wasteType: { 
    type: String, 
    enum: ['organic', 'plastic', 'paper', 'glass', 'mixed'],
    required: true 
  },
  weight: Number,
  status: { 
    type: String, 
    enum: ['scheduled', 'completed', 'missed'], 
    default: 'scheduled' 
  },
  qrScanned: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
