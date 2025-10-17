import express from 'express';
import {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
  getCollectionsByDate,
  scanQRCode
} from '../controllers/collectionController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken());

// GET /api/collections - Get all collections
router.get('/', getCollections);

// GET /api/collections/:id - Get collection by ID
router.get('/:id', getCollectionById);

// POST /api/collections - Create new collection
router.post('/', createCollection);

// PUT /api/collections/:id - Update collection
router.put('/:id', updateCollection);

// DELETE /api/collections/:id - Delete collection
router.delete('/:id', deleteCollection);

// GET /api/collections/date/:date - Get collections by date
router.get('/date/:date', getCollectionsByDate);

// POST /api/collections/scan - Scan QR code
router.post('/scan', scanQRCode);

export default router;
