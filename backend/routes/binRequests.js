import express from 'express';
import BinRequest from '../models/BinRequest.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all bin requests (with filtering)
router.get('/', authenticateToken(), async (req, res) => {
  try {
    const { status, userId, page = 1, limit = 10 } = req.query;
    const query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by user if provided (for admin)
    if (userId) {
      query.userId = userId;
    }
    
    // If user is not admin, only show their own requests
    if (req.user.role !== 'admin' && !userId) {
      query.userId = req.user.userId;
    }
    
    const requests = await BinRequest.find(query)
      .populate('userId', 'name email phone')
      .sort({ requestDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await BinRequest.countDocuments(query);
    
    res.json({
      success: true,
      data: requests,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching bin requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bin requests',
      error: error.message
    });
  }
});

// Get bin requests by user
router.get('/user/:userId', authenticateToken(), async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const requests = await BinRequest.find({ userId })
      .populate('userId', 'name email phone')
      .sort({ requestDate: -1 });
    
    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching user bin requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user bin requests',
      error: error.message
    });
  }
});

// Get bin requests by status
router.get('/status/:status', authenticateToken(), async (req, res) => {
  try {
    const { status } = req.params;
    
    // Only admin can filter by status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const requests = await BinRequest.find({ status })
      .populate('userId', 'name email phone')
      .sort({ requestDate: -1 });
    
    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching bin requests by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bin requests by status',
      error: error.message
    });
  }
});

// Get single bin request
router.get('/:id', authenticateToken(), async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await BinRequest.findById(id)
      .populate('userId', 'name email phone');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Bin request not found'
      });
    }
    
    // Check if user can access this request
    if (req.user.role !== 'admin' && request.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching bin request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bin request',
      error: error.message
    });
  }
});

// Create new bin request
router.post('/', authenticateToken(), async (req, res) => {
  try {
    const {
      selectedBins,
      specialInstructions,
      contactPhone,
      contactEmail,
      address
    } = req.body;
    
    // Validate required fields
    if (!selectedBins || selectedBins.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one bin type must be selected'
      });
    }
    
    if (!contactPhone || !contactEmail || !address) {
      return res.status(400).json({
        success: false,
        message: 'Contact phone, email, and address are required'
      });
    }
    
    // Create new bin request
    const binRequest = new BinRequest({
      userId: req.user.userId,
      selectedBins,
      specialInstructions: specialInstructions || '',
      contactPhone,
      contactEmail,
      address
    });
    
    await binRequest.save();
    
    // Populate user data for response
    await binRequest.populate('userId', 'name email phone');
    
    res.status(201).json({
      success: true,
      message: 'Bin request created successfully',
      data: binRequest
    });
  } catch (error) {
    console.error('Error creating bin request:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating bin request',
      error: error.message
    });
  }
});

// Update bin request
router.put('/:id', authenticateToken(), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      selectedBins,
      specialInstructions,
      contactPhone,
      contactEmail,
      address
    } = req.body;
    
    const binRequest = await BinRequest.findById(id);
    
    if (!binRequest) {
      return res.status(404).json({
        success: false,
        message: 'Bin request not found'
      });
    }
    
    // Check if user can update this request
    if (req.user.role !== 'admin' && binRequest.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Only allow updates if status is pending
    if (binRequest.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update request that is not pending'
      });
    }
    
    // Update fields
    if (selectedBins) binRequest.selectedBins = selectedBins;
    if (specialInstructions !== undefined) binRequest.specialInstructions = specialInstructions;
    if (contactPhone) binRequest.contactPhone = contactPhone;
    if (contactEmail) binRequest.contactEmail = contactEmail;
    if (address) binRequest.address = address;
    
    await binRequest.save();
    await binRequest.populate('userId', 'name email phone');
    
    res.json({
      success: true,
      message: 'Bin request updated successfully',
      data: binRequest
    });
  } catch (error) {
    console.error('Error updating bin request:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bin request',
      error: error.message
    });
  }
});

// Update bin request status (admin only)
router.patch('/:id/status', authenticateToken(), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;
    
    // Only admin can update status
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    const binRequest = await BinRequest.findById(id);
    
    if (!binRequest) {
      return res.status(404).json({
        success: false,
        message: 'Bin request not found'
      });
    }
    
    binRequest.status = status;
    if (adminNotes) binRequest.adminNotes = adminNotes;
    
    await binRequest.save();
    await binRequest.populate('userId', 'name email phone');
    
    res.json({
      success: true,
      message: 'Bin request status updated successfully',
      data: binRequest
    });
  } catch (error) {
    console.error('Error updating bin request status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bin request status',
      error: error.message
    });
  }
});

// Delete bin request
router.delete('/:id', authenticateToken(), async (req, res) => {
  try {
    const { id } = req.params;
    
    const binRequest = await BinRequest.findById(id);
    
    if (!binRequest) {
      return res.status(404).json({
        success: false,
        message: 'Bin request not found'
      });
    }
    
    // Check if user can delete this request
    if (req.user.role !== 'admin' && binRequest.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Only allow deletion if status is pending
    if (binRequest.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete request that is not pending'
      });
    }
    
    await BinRequest.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Bin request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bin request:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bin request',
      error: error.message
    });
  }
});

export default router;
