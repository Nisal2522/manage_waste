import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  bin: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin', required: true },
  staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  isCollected: { type: Boolean, required: true, default: false },
  collectionTime: { type: Date, default: Date.now }
}, { 
  timestamps: true,
  suppressReservedKeysWarning: true 
});

export default mongoose.model('Collection', collectionSchema);
