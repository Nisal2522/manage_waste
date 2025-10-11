import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // hide by default
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
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true });

/* 🔒 Encrypt password before saving */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/* 🧠 Add custom method to compare password */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
