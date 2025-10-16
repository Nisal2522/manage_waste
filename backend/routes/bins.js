import express from 'express';
import {
  getBins,
  getBinById,
  createBin,
  updateBin,
  deleteBin,
  getBinsByUser,
  updateBinStatus,
  updateBinFillLevel
} from '../controllers/binController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Test route without auth to verify routing works
router.get('/test', (req, res) => {
  res.json({ message: 'Bins route is working', timestamp: new Date().toISOString() });
});

// Apply auth middleware to all routes
router.use(authenticateToken());

// @route   GET /api/bins
// @desc    Get all bins (with filtering)
// @access  Private
router.get('/', getBins);

// @route   GET /api/bins/user/:userId
// @desc    Get bins by user ID
// @access  Private
router.get('/user/:userId', getBinsByUser);

// @route   POST /api/bins
// @desc    Create new bin
// @access  Private
router.post('/', createBin);

// @route   PATCH /api/bins/:id/status
// @desc    Update bin status
// @access  Private
router.patch('/:id/status', updateBinStatus);

// @route   PATCH /api/bins/:id/fill-level
// @desc    Update bin fill level
// @access  Private
router.patch('/:id/fill-level', updateBinFillLevel);

// @route   GET /api/bins/:id
// @desc    Get single bin by ID
// @access  Private
router.get('/:id', getBinById);

// @route   PUT /api/bins/:id
// @desc    Update bin
// @access  Private
router.put('/:id', updateBin);

// @route   DELETE /api/bins/:id
// @desc    Delete bin
// @access  Private
router.delete('/:id', deleteBin);

export default router;
