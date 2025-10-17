import express from 'express';
import { getUsers, getUserById, updateUser, deleteUser, getUserStats } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all users (with pagination and filtering)
router.get('/', getUsers);

// Get user statistics
router.get('/stats', getUserStats);

// Get user by ID
router.get('/:id', getUserById);

// Update user
router.put('/:id', updateUser);

// Delete user
router.delete('/:id', deleteUser);

export default router;

