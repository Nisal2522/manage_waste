const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: [{
    lat: Number,
    lng: Number,
    order: Number
  }],
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bin' }],
  estimatedTime: Number, // in minutes
  distance: Number, // in km
  status: { 
    type: String, 
    enum: ['active', 'inactive'], 
    default: 'active' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Route', routeSchema);
