import Bin from '../models/Bin.js';
import User from '../models/User.js';

// @desc    Create a new bin
// @route   POST /api/bins
// @access  Private
export const createBin = async (req, res) => {
  try {
    console.log('📝 Creating bin for user:', req.user.userId);
    console.log('Request body:', req.body);
    
    const { 
      binId, 
      owner, 
      deviceType, 
      deviceId, 
      binType, 
      capacity, 
      longitude, 
      latitude, 
      address,
      temperature,
      humidity,
      lastCollection,
      nextCollection
    } = req.body;
    
    // Validate required fields
    if (!binId || !binType || !capacity || !longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Bin ID, type, capacity, and coordinates are required'
      });
    }

    // Check if bin ID already exists
    const existingBin = await Bin.findOne({ binId });
    if (existingBin) {
      return res.status(400).json({
        success: false,
        message: 'Bin ID already exists'
      });
    }

    // Create the bin
    const bin = new Bin({
      binId,
      owner: owner || req.user.userId,
      deviceType: deviceType || 'QR Code',
      deviceId: deviceId || `QR-${Date.now()}`,
      binType,
      capacity: parseInt(capacity),
      currentFill: 0, // Start with empty bin
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      address: address || '',
      userId: req.user.userId,
      temperature: temperature || Math.floor(Math.random() * 10) + 20,
      humidity: humidity || Math.floor(Math.random() * 30) + 50,
      lastCollection: lastCollection || new Date().toISOString(),
      nextCollection: nextCollection || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active'
    });

    const savedBin = await bin.save();
    
    // Populate user details
    await savedBin.populate('userId', 'name email phone');

    console.log('✅ Bin created successfully:', savedBin._id);

    res.status(201).json({
      success: true,
      message: 'Bin created successfully',
      data: savedBin
    });
  } catch (error) {
    console.error('❌ Error creating bin:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating bin',
      error: error.message
    });
  }
};

// @desc    Get all bins
// @route   GET /api/bins
// @access  Private
export const getBins = async (req, res) => {
  try {
    console.log('📋 Getting bins for user:', req.user.userId, 'Role:', req.user.role);
    
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // If user is not admin, only show their own bins
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      query.userId = req.user.userId;
    }
    
    // Filter by status if provided
    if (status && ['active', 'inactive', 'maintenance'].includes(status)) {
      query.status = status;
    }

    const bins = await Bin.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Bin.countDocuments(query);

    res.json({
      success: true,
      data: bins,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('❌ Error getting bins:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting bins',
      error: error.message
    });
  }
};

// @desc    Get bin by ID
// @route   GET /api/bins/:id
// @access  Private
export const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id).populate('userId', 'name email phone');
    
    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Check if user can access this bin
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && bin.userId._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this bin'
      });
    }

    res.json({
      success: true,
      data: bin
    });
  } catch (error) {
    console.error('❌ Error getting bin:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting bin',
      error: error.message
    });
  }
};

// @desc    Get bins by user
// @route   GET /api/bins/user/:userId
// @access  Private
export const getBinsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('👤 Getting bins for user ID:', userId);
    console.log('Authenticated user ID:', req.user.userId, 'Role:', req.user.role);
    
    // Check if user can access these bins
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && req.user.userId !== userId) {
      console.log('🚫 Access denied: User cannot access these bins');
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access these bins'
      });
    }

    const bins = await Bin.find({ userId })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    console.log('✅ Found bins:', bins.length);

    res.json({
      success: true,
      data: bins
    });
  } catch (error) {
    console.error('❌ Error getting bins by user:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting bins by user',
      error: error.message
    });
  }
};

// @desc    Update bin
// @route   PUT /api/bins/:id
// @access  Private
export const updateBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    
    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Check if user can update this bin
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && bin.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this bin'
      });
    }

    const updatedBin = await Bin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone');

    res.json({
      success: true,
      message: 'Bin updated successfully',
      data: updatedBin
    });
  } catch (error) {
    console.error('❌ Error updating bin:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bin',
      error: error.message
    });
  }
};

// @desc    Update bin status
// @route   PATCH /api/bins/:id/status
// @access  Private
export const updateBinStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'inactive', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, inactive, or maintenance'
      });
    }

    const bin = await Bin.findById(req.params.id);
    
    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Check if user can update this bin
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && bin.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this bin'
      });
    }

    bin.status = status;
    const updatedBin = await bin.save();

    res.json({
      success: true,
      message: 'Bin status updated successfully',
      data: updatedBin
    });
  } catch (error) {
    console.error('❌ Error updating bin status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bin status',
      error: error.message
    });
  }
};

// @desc    Delete bin
// @route   DELETE /api/bins/:id
// @access  Private
export const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findById(req.params.id);
    
    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Check if user can delete this bin
    if (req.user.role !== 'admin' && req.user.role !== 'staff' && bin.userId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this bin'
      });
    }

    await Bin.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Bin deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting bin:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting bin',
      error: error.message
    });
  }
};
