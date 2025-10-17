import mongoose from 'mongoose';

const truckRouteSchema = new mongoose.Schema({
  routeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  truck: {
    truckId: { type: String, required: true },
    capacity: { type: Number, required: true }, // in kg
    fuelType: { type: String, enum: ['diesel', 'electric', 'hybrid'], default: 'diesel' }
  },
  path: [{
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    order: { type: Number, required: true },
    binId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bin' },
    estimatedTime: Number, // minutes to reach this point
    actualTime: Number, // actual time taken
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'skipped'], 
      default: 'pending' 
    }
  }],
  scheduledDate: { type: Date, required: true },
  startTime: Date,
  endTime: Date,
  estimatedDuration: { type: Number, required: true }, // in minutes
  actualDuration: Number, // actual duration in minutes
  estimatedDistance: { type: Number, required: true }, // in km
  actualDistance: Number, // actual distance in km
  fuelConsumption: Number, // in liters
  wasteCollected: { type: Number, default: 0 }, // in kg
  status: { 
    type: String, 
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'], 
    default: 'scheduled' 
  },
  weather: {
    temperature: Number,
    condition: { type: String, enum: ['sunny', 'cloudy', 'rainy', 'stormy'] }
  },
  notes: String,
  isOptimized: { type: Boolean, default: false },
  optimizationScore: Number, // efficiency score from optimization algorithm
  previousRouteId: { type: mongoose.Schema.Types.ObjectId, ref: 'TruckRoute' } // reference to original route if this is optimized
}, { timestamps: true });

export default mongoose.model('TruckRoute', truckRouteSchema);
