const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'staff', 'resident'], 
    required: true 
  },
  address: {
    street: String,
    city: String,
    district: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  phone: String,
  assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  binDevice: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' },
  qrCode: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
