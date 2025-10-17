import express from 'express';
import { getUserStats } from '../controllers/userStatsController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user statistics (Admin only)
router.get('/', authMiddleware, getUserStats);

export default router;
