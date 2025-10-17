import express from 'express';
import { generateQRCode, validateQRCode } from '../controllers/qrController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

console.log('🔧 QR routes loaded');

// @route   POST /api/qr/generate
// @desc    Generate QR code for bin
// @access  Private
router.post('/generate', authenticateToken(), (req, res, next) => {
  console.log('🎯 QR generate route hit');
  next();
}, generateQRCode);

// @route   POST /api/qr/validate
// @desc    Validate QR code
// @access  Private
router.post('/validate', authenticateToken(), validateQRCode);

export default router;
