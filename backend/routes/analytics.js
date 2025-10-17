import express from 'express';
import {
  getOperationalAnalytics,
  getFinancialAnalytics,
  getSustainabilityAnalytics,
  getRouteOptimization,
  optimizeRoutes,
  applyOptimizedRoutes,
  runSimulation,
  getDistrictAnalysis,
  getDistrictAnalysisByUser,
  getBinsAnalysis,
  exportReport
} from '../controllers/analyticsController.js';
import { authMiddleware, authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test endpoints (no auth required)
router.get('/test/operational', async (req, res) => {
  try {
    const mockData = {
      wasteByZone: [
        { zone: 'North Zone', waste: 45.2, percentage: 28, color: '#3b82f6' },
        { zone: 'East Zone', waste: 38.7, percentage: 24, color: '#10b981' },
        { zone: 'South Zone', waste: 42.1, percentage: 26, color: '#f59e0b' },
        { zone: 'West Zone', waste: 35.8, percentage: 22, color: '#ef4444' }
      ],
      collectionEfficiency: 92.5,
      averageResponseTime: 1.2,
      systemUptime: 99.8,
      activeRoutes: 12,
      totalCollections: 2847,
      completedCollections: 2634
    };
    res.json({ success: true, data: mockData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/test/financial', async (req, res) => {
  try {
    const mockData = {
      totalRevenue: 125000,
      costRecovery: 78.5,
      averageInvoice: 45.2,
      outstandingPayments: 12500,
      rebateAmount: 8500,
      operationalCosts: 95000
    };
    res.json({ success: true, data: mockData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/test/sustainability', async (req, res) => {
  try {
    const mockData = {
      recyclingRate: 68.5,
      wasteReduction: 15.2,
      carbonFootprint: 245.8,
      energyEfficiency: 87.3,
      circularEconomyScore: 82.1
    };
    res.json({ success: true, data: mockData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/test/bins', async (req, res) => {
  try {
    // Mock data for testing
    const mockData = {
      summary: {
        totalBins: 25,
        binsNeedingCollection: 3,
        avgFill: 45.2,
        avgCapacity: 120.5,
        avgTemperature: 25.8,
        avgHumidity: 60.2
      },
      binsByStatus: [
        { _id: 'active', count: 22 },
        { _id: 'inactive', count: 2 },
        { _id: 'maintenance', count: 1 }
      ],
      binsByType: [
        { _id: 'General Waste', count: 15, avgFill: 48.5, avgCapacity: 100 },
        { _id: 'Recyclable', count: 8, avgFill: 35.2, avgCapacity: 80 },
        { _id: 'Organic', count: 2, avgFill: 65.8, avgCapacity: 150 }
      ],
      fillLevelDistribution: [
        { _id: 'Very Low (0-20%)', count: 5 },
        { _id: 'Low (20-40%)', count: 8 },
        { _id: 'Medium (40-60%)', count: 7 },
        { _id: 'High (60-80%)', count: 3 },
        { _id: 'Very High (80-100%)', count: 2 }
      ],
      binsByDistrict: [
        { _id: 'North District', totalBins: 8, avgFill: 52.3, avgCapacity: 110, highFillBins: 1, lowFillBins: 2 },
        { _id: 'South District', totalBins: 7, avgFill: 38.7, avgCapacity: 95, highFillBins: 0, lowFillBins: 3 },
        { _id: 'East District', totalBins: 6, avgFill: 45.1, avgCapacity: 105, highFillBins: 1, lowFillBins: 1 },
        { _id: 'West District', totalBins: 4, avgFill: 58.9, avgCapacity: 120, highFillBins: 1, lowFillBins: 0 }
      ],
      recentBins: [
        { binId: 'BIN001', binType: 'General Waste', currentFill: 45, capacity: 100, address: '123 Main St, North District', status: 'active', createdAt: new Date() },
        { binId: 'BIN002', binType: 'Recyclable', currentFill: 25, capacity: 80, address: '456 Oak Ave, South District', status: 'active', createdAt: new Date() },
        { binId: 'BIN003', binType: 'Organic', currentFill: 75, capacity: 150, address: '789 Pine Rd, East District', status: 'active', createdAt: new Date() }
      ]
    };
    
    res.json({ success: true, data: mockData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/test/districts', async (req, res) => {
  try {
    // Mock data for testing
    const mockData = {
      districts: [
        { district: 'North District', avgFill: 52.3, totalBins: 8, highFillBins: 1, lowFillBins: 2 },
        { district: 'South District', avgFill: 38.7, totalBins: 7, highFillBins: 0, lowFillBins: 3 },
        { district: 'East District', avgFill: 45.1, totalBins: 6, highFillBins: 1, lowFillBins: 1 },
        { district: 'West District', avgFill: 58.9, totalBins: 4, highFillBins: 1, lowFillBins: 0 }
      ],
      totalDistricts: 4,
      totalBins: 25
    };
    
    res.json({ success: true, data: mockData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/test/real-bins', async (req, res) => {
  try {
    const { getBinsAnalysis } = await import('../controllers/analyticsController.js');
    await getBinsAnalysis(req, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Apply authentication middleware to all other routes
router.use(authenticateToken());

// Analytics endpoints
router.get('/operational', getOperationalAnalytics);
router.get('/financial', getFinancialAnalytics);
router.get('/sustainability', getSustainabilityAnalytics);

// District analysis endpoints
router.get('/districts', getDistrictAnalysis);
router.get('/districts/user/:userId', getDistrictAnalysisByUser);

// Bins analysis endpoint
router.get('/bins', getBinsAnalysis);

// Route optimization endpoints
router.get('/routes', getRouteOptimization);
router.post('/routes/optimize', optimizeRoutes);
router.post('/routes/apply', applyOptimizedRoutes);

// Simulation endpoints
router.post('/simulation', runSimulation);

// Export endpoints
router.get('/export', exportReport);

export default router;
