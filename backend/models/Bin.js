import mongoose from 'mongoose';

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  owner: { type: String, required: true },
  deviceType: { type: String, default: 'QR Code' },
  deviceId: { type: String, required: true },
  binType: { type: String, required: true },
  capacity: { type: Number, required: true },
  currentFill: { type: Number, default: 0 },
  longitude: { type: Number, required: true },
  latitude: { type: Number, required: true },
  address: { type: String, default: '' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  temperature: { type: Number, default: 25 },
  humidity: { type: Number, default: 60 },
  lastCollection: { type: Date, default: Date.now },
  nextCollection: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'maintenance'], 
    default: 'active' 
  },
  qrCode: String
}, { timestamps: true });

export default mongoose.model('Bin', binSchema);
