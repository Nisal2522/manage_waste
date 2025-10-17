# Real Data Integration Setup Guide

## Environment Setup

### 1. Backend Environment Variables
Create `.env` file in `backend/` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waste_management

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Analytics Configuration
ANALYTICS_ENABLED=true
ROUTE_OPTIMIZATION_ENABLED=true
SIMULATION_ENABLED=true

# Export Configuration
EXPORT_ENABLED=true
MAX_EXPORT_SIZE=50MB

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 2. Frontend Environment Variables
Create `.env` file in `frontend/` directory:

```env
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0

# Analytics Configuration
REACT_APP_ANALYTICS_ENABLED=true
REACT_APP_ROUTE_OPTIMIZATION_ENABLED=true
REACT_APP_SIMULATION_ENABLED=true

# Export Configuration
REACT_APP_EXPORT_ENABLED=true
REACT_APP_MAX_EXPORT_SIZE=50MB
```

## Database Setup

### 1. MongoDB Setup
```bash
# Install MongoDB
# Windows: Download from https://www.mongodb.com/try/download/community
# Linux: sudo apt-get install mongodb
# macOS: brew install mongodb-community

# Start MongoDB service
mongod

# Create database
mongo
use waste_management
```

### 2. Sample Data Insertion
```javascript
// Insert sample collections
db.collections.insertMany([
  {
    bin: ObjectId(),
    staff: ObjectId(),
    resident: ObjectId(),
    collectionTime: new Date(),
    wasteType: 'organic',
    weight: 15.5,
    status: 'completed',
    qrScanned: true
  },
  {
    bin: ObjectId(),
    staff: ObjectId(),
    resident: ObjectId(),
    collectionTime: new Date(),
    wasteType: 'plastic',
    weight: 8.2,
    status: 'completed',
    qrScanned: true
  }
]);

// Insert sample invoices
db.invoices.insertMany([
  {
    invoiceNumber: 'INV-001',
    resident: ObjectId(),
    collection: ObjectId(),
    amount: 45.50,
    wasteType: 'organic',
    weight: 15.5,
    ratePerKg: 2.5,
    status: 'paid',
    totalAmount: 45.50
  }
]);

// Insert sample truck routes
db.truckroutes.insertMany([
  {
    routeId: 'RT-001',
    name: 'North Zone Route',
    driver: ObjectId(),
    truck: {
      truckId: 'TR-001',
      capacity: 1000,
      fuelType: 'diesel'
    },
    path: [
      { lat: 6.9271, lng: 79.8612, order: 1 },
      { lat: 6.9281, lng: 79.8622, order: 2 }
    ],
    estimatedDistance: 45.2,
    estimatedDuration: 180,
    status: 'active'
  }
]);
```

## API Testing

### 1. Test Analytics Endpoints
```bash
# Test operational analytics
curl -X GET "http://localhost:5000/api/analytics/operational" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test financial analytics
curl -X GET "http://localhost:5000/api/analytics/financial" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test route optimization
curl -X POST "http://localhost:5000/api/analytics/routes/optimize" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"routes": [{"id": "RT-001", "distance": 45.2, "time": 180}]}'
```

### 2. Frontend Testing
```bash
# Start frontend
cd frontend
npm start

# Navigate to analytics dashboard
http://localhost:3000/admin/analytics
```

## Data Flow Verification

### 1. Check Database Connection
```javascript
// In backend server.js
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});
```

### 2. Verify API Responses
```javascript
// Check analytics controller
const getOperationalAnalytics = async (req, res) => {
  try {
    const wasteByZone = await Collection.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'bins',
          localField: 'bin',
          foreignField: '_id',
          as: 'binData'
        }
      },
      // ... aggregation pipeline
    ]);
    
    res.json({
      success: true,
      data: {
        wasteByZone,
        collectionEfficiency,
        systemUptime,
        activeRoutes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operational analytics',
      error: error.message
    });
  }
};
```

### 3. Frontend Data Fetching
```javascript
// In AdminAnalyticsDashboard.jsx
const fetchAnalyticsData = async (type, filters = {}) => {
  try {
    setLoading(true);
    setError(null);
    
    let response;
    switch (type) {
      case 'operational':
        response = await getOperationalAnalytics(filters);
        break;
      case 'financial':
        response = await getFinancialAnalytics(filters);
        break;
      case 'sustainability':
        response = await getSustainabilityAnalytics(filters);
        break;
    }
    
    if (response.success) {
      setAnalyticsData(prev => ({
        ...prev,
        [type]: response.data
      }));
    }
  } catch (err) {
    setError(err.message || 'Failed to fetch analytics data');
  } finally {
    setLoading(false);
  }
};
```

## Troubleshooting

### 1. Common Issues
- **CORS Error**: Check CORS_ORIGIN in backend .env
- **Database Connection**: Verify MongoDB is running
- **Authentication**: Ensure JWT token is valid
- **API Endpoints**: Check if analytics routes are registered

### 2. Debug Steps
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify database queries in MongoDB
4. Test API endpoints with Postman/curl

### 3. Performance Optimization
- Add database indexes for faster queries
- Implement caching for frequently accessed data
- Use pagination for large datasets
- Optimize aggregation pipelines

## Production Deployment

### 1. Environment Variables
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/waste_management
JWT_SECRET=production_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

### 2. Security Considerations
- Use strong JWT secrets
- Enable HTTPS
- Implement rate limiting
- Add input validation
- Use environment-specific configurations

This setup ensures real data flows from MongoDB through the backend API to the frontend analytics dashboard.
