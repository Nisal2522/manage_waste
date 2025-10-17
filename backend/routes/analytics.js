import express from 'express';
import {
  getOperationalAnalytics,
  getFinancialAnalytics,
  getSustainabilityAnalytics,
  getRouteOptimization,
  optimizeRoutes,
  applyOptimizedRoutes,
  runSimulation,
  exportReport
} from '../controllers/analyticsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

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

// Apply authentication middleware to all other routes
router.use(authMiddleware);

// Analytics endpoints
router.get('/operational', getOperationalAnalytics);
router.get('/financial', getFinancialAnalytics);
router.get('/sustainability', getSustainabilityAnalytics);

// Route optimization endpoints
router.get('/routes', getRouteOptimization);
router.post('/routes/optimize', optimizeRoutes);
router.post('/routes/apply', applyOptimizedRoutes);

// Simulation endpoints
router.post('/simulation', runSimulation);

// Export endpoints
router.get('/export', exportReport);

export default router;
