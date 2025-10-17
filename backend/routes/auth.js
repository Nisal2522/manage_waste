import express from 'express';
import { register, login, me, updateProfilePhoto } from '../controllers/AuthController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);

// Protected routes (authentication required)
router.get('/me', authenticateToken, me);
router.get('/profile', authenticateToken, me);
router.put('/profile/photo', authenticateToken, updateProfilePhoto);

export default router;