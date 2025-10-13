import BinRequest from '../models/BinRequest.js';
import User from '../models/User.js';

// @desc    Create a new bin request
// @route   POST /api/bin-requests
// @access  Private
export const createBinRequest = async (req, res) => {
  try {
    const { selectedBins, specialInstructions, contactPhone, contactEmail, address } = req.body;
    
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

    // Create the bin request
    const binRequest = new BinRequest({
      userId: req.user.id,
      selectedBins,
      specialInstructions,
      contactPhone,
      contactEmail,
      address
    });

    const savedRequest = await binRequest.save();
    
    // Populate user details
    await savedRequest.populate('userId', 'name email');

    res.status(201).json({
      success: true,
      data: savedRequest
    });
  } catch (error) {
    console.error('Error creating bin request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all bin requests
// @route   GET /api/bin-requests
// @access  Private (Admin/Staff only)
export const getBinRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const requests = await BinRequest.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
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
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get bin request by ID
// @route   GET /api/bin-requests/:id
// @access  Private
export const getBinRequestById = async (req, res) => {
  try {
    const request = await BinRequest.findById(req.params.id)
      .populate('userId', 'name email');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Bin request not found'
      });
    }

    // Check if user can access this request
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && request.userId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request'
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
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update bin request
// @route   PUT /api/bin-requests/:id
// @access  Private
export const updateBinRequest = async (req, res) => {
  try {
    const { selectedBins, specialInstructions, contactPhone, contactEmail, address } = req.body;
    
    const request = await BinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Bin request not found'
      });
    }

    // Check if user can update this request
    if (request.userId.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this request'
      });
    }

    // Update fields
    if (selectedBins) request.selectedBins = selectedBins;
    if (specialInstructions !== undefined) request.specialInstructions = specialInstructions;
    if (contactPhone) request.contactPhone = contactPhone;
    if (contactEmail) request.contactEmail = contactEmail;
    if (address) request.address = address;

    const updatedRequest = await request.save();
    await updatedRequest.populate('userId', 'name email');

    res.json({
      success: true,
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating bin request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete bin request
// @route   DELETE /api/bin-requests/:id
// @access  Private
export const deleteBinRequest = async (req, res) => {
  try {
    const request = await BinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Bin request not found'
      });
    }

    // Check if user can delete this request
    if (request.userId.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this request'
      });
    }

    await BinRequest.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bin request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bin request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update bin request status
// @route   PATCH /api/bin-requests/:id/status
// @access  Private (Admin/Staff only)
export const updateBinRequestStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, completed'
      });
    }

    const request = await BinRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Bin request not found'
      });
    }

    request.status = status;
    if (adminNotes) request.adminNotes = adminNotes;

    const updatedRequest = await request.save();
    await updatedRequest.populate('userId', 'name email');

    res.json({
      success: true,
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating bin request status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get bin requests by user
// @route   GET /api/bin-requests/user/:userId
// @access  Private
export const getBinRequestsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user can access these requests
    if (req.user.id !== userId && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these requests'
      });
    }

    const requests = await BinRequest.find({ userId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching user bin requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get bin requests by status
// @route   GET /api/bin-requests/status/:status
// @access  Private (Admin/Staff only)
export const getBinRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    
    if (!['pending', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, completed'
      });
    }

    const requests = await BinRequest.find({ status })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching bin requests by status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
