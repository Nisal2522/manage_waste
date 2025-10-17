import express from 'express';
import {
  getTestOperationalAnalytics,
  getTestFinancialAnalytics,
  getTestSustainabilityAnalytics
} from '../controllers/testAnalyticsController.js';

const router = express.Router();

// Test analytics endpoints (no auth required for testing)
router.get('/operational', getTestOperationalAnalytics);
router.get('/financial', getTestFinancialAnalytics);
router.get('/sustainability', getTestSustainabilityAnalytics);

export default router;
