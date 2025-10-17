import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  createInvoiceFromCollection,
  updateInvoiceStatus,
  deleteInvoice,
  getResidentInvoices
} from '../controllers/invoiceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken());

// GET /api/invoices - Get all invoices
router.get('/', getInvoices);

// GET /api/invoices/:id - Get invoice by ID
router.get('/:id', getInvoiceById);

// GET /api/invoices/resident/:residentId - Get invoices for a resident
router.get('/resident/:residentId', getResidentInvoices);

// POST /api/invoices - Create invoice from collection
router.post('/', createInvoiceFromCollection);

// PATCH /api/invoices/:id/status - Update invoice status
router.patch('/:id/status', updateInvoiceStatus);

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', deleteInvoice);

export default router;
