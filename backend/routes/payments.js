import express from 'express';
import {
  createCheckoutSession,
  handleStripeWebhook,
  verifyPaymentSession,
  confirmManualPayment,
  getPaymentHistory
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Stripe webhook - NO AUTH (Stripe needs to call this)
// Must be defined BEFORE express.json() middleware is applied
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

// Apply authentication to all other routes
router.use(authenticateToken());

// POST /api/payments/create-checkout-session - Create Stripe checkout session
router.post('/create-checkout-session', createCheckoutSession);

// GET /api/payments/verify/:sessionId - Verify payment session
router.get('/verify/:sessionId', verifyPaymentSession);

// POST /api/payments/confirm-manual - Confirm manual payment (admin only)
router.post('/confirm-manual', confirmManualPayment);

// GET /api/payments/history - Get payment history for current user
router.get('/history', getPaymentHistory);

export default router;
