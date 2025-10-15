import express from 'express';
import {
  getBinRequests,
  getBinRequestById,
  createBinRequest,
  updateBinRequest,
  deleteBinRequest,
  updateBinRequestStatus,
  getBinRequestsByUser,
  getBinRequestsByStatus
} from '../controllers/binRequestController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; // Fixed middleware import

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// @route   GET /api/bin-requests
// @desc    Get all bin requests (with filtering)
// @access  Private
router.get('/', getBinRequests);

// @route   GET /api/bin-requests/user/:userId
// @desc    Get bin requests by user ID
// @access  Private
router.get('/user/:userId', getBinRequestsByUser);

// @route   GET /api/bin-requests/status/:status
// @desc    Get bin requests by status
// @access  Private (Admin/Staff only)
router.get('/status/:status', getBinRequestsByStatus);

// @route   GET /api/bin-requests/:id
// @desc    Get single bin request by ID
// @access  Private
router.get('/:id', getBinRequestById);

// @route   POST /api/bin-requests
// @desc    Create new bin request
// @access  Private
router.post('/', createBinRequest);

// @route   PUT /api/bin-requests/:id
// @desc    Update bin request
// @access  Private
router.put('/:id', updateBinRequest);

// @route   PATCH /api/bin-requests/:id/status
// @desc    Update bin request status (admin only)
// @access  Private (Admin/Staff only)
router.patch('/:id/status', updateBinRequestStatus);

// @route   DELETE /api/bin-requests/:id
// @desc    Delete bin request
// @access  Private
router.delete('/:id', deleteBinRequest);

export default router;