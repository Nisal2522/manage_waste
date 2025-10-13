import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


// Import routes
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase payload size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For form data

// Add cache prevention headers for all responses
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waste_manage')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Routes
app.use('/api/auth', authRoutes);

// Notifications endpoint (accessible by all authenticated users)
app.get('/api/notifications', (req, res) => {
  res.json({
    success: true,
    data: {
      notifications: [],
      total: 0,
      unread: 0
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'running' });
});

// Start server with port conflict handling
const startServer = async (PORT) => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is in use, trying port ${PORT + 1}...`);
      startServer(PORT + 1);
    } else {
      console.error('Server startup error:', error);
      process.exit(1);
    }
  }
};

startServer(PORT);