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

    // Generate QR code URL
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const qrUrl = `${baseUrl}/staff/qr-collection?binId=${binId}`;
    
    // Also store the QR code data for reference
    const qrData = {
      binId,
      binType,
      owner: owner || req.user.userId,
      address: address || '',
      coordinates: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude)
      },
      capacity: parseInt(capacity),
      deviceType: deviceType || 'QR Code',
      deviceId: deviceId || `QR-${Date.now()}`,
      url: qrUrl
    };

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
      status: 'active',
      qrCode: {
        data: qrUrl, // Store the URL as the QR code data
        metadata: JSON.stringify(qrData), // Store full data as metadata
        generatedAt: new Date(),
        isActive: true
      }
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

// @desc    Update bin fill level
// @route   PATCH /api/bins/:id/fill-level
// @access  Private
export const updateBinFillLevel = async (req, res) => {
  try {
    const { fillLevel } = req.body;
    
    // Validate fill level
    if (fillLevel === undefined || fillLevel === null) {
      return res.status(400).json({
        success: false,
        message: 'Fill level is required'
      });
    }

    if (fillLevel < 0 || fillLevel > 100) {
      return res.status(400).json({
        success: false,
        message: 'Fill level must be between 0 and 100'
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

    console.log(`📊 Updating fill level for bin ${bin.binId} from ${bin.currentFill}% to ${fillLevel}%`);

    bin.currentFill = fillLevel;
    const updatedBin = await bin.save();

    console.log(`✅ Fill level updated successfully for bin ${bin.binId}`);

    res.json({
      success: true,
      message: 'Bin fill level updated successfully',
      data: updatedBin
    });
  } catch (error) {
    console.error('❌ Error updating bin fill level:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating bin fill level',
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

// @desc    Get bin by QR code
// @route   GET /api/bins/qr/:qrCode
// @access  Private (Staff only)
export const getBinByQRCode = async (req, res) => {
  try {
    const { qrCode } = req.params;
    
    console.log('🔍 Searching for bin with QR code:', qrCode);
    
    // Try to find bin by binId first (most common case)
    let bin = await Bin.findOne({ binId: qrCode }).populate('userId', 'name email phone');
    
    // If not found by binId, try to parse QR code data
    if (!bin) {
      try {
        const qrData = JSON.parse(qrCode);
        if (qrData.binId) {
          bin = await Bin.findOne({ binId: qrData.binId }).populate('userId', 'name email phone');
        }
      } catch (parseError) {
        console.log('QR code is not JSON format, treating as binId');
      }
    }
    
    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found with the provided QR code'
      });
    }

    // Check if user is staff or admin
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: 'Only staff members can scan QR codes'
      });
    }

    console.log('✅ Bin found:', bin.binId);

    res.json({
      success: true,
      message: 'Bin found successfully',
      data: bin
    });
  } catch (error) {
    console.error('❌ Error getting bin by QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting bin by QR code',
      error: error.message
    });
  }
};

// @desc    Mark bin as collected
// @route   POST /api/bins/collect
// @access  Private (Staff only)
export const markBinAsCollected = async (req, res) => {
  try {
    const { binId, binQRCode, wasteType, weight, notes, collectionTime, staffId, residentId } = req.body;
    
    console.log('📦 Marking bin as collected - Request body:', req.body);
    console.log('📦 User info:', { userId: req.user.userId, role: req.user.role });
    
    // Validate required fields
    if (!binId || !wasteType) {
      console.log('❌ Missing required fields:', { binId, wasteType, weight, staffId });
      return res.status(400).json({
        success: false,
        message: 'Bin ID and waste type are required'
      });
    }

    // Check if user is staff or admin
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      console.log('❌ Unauthorized user role:', req.user.role);
      return res.status(403).json({
        success: false,
        message: 'Only staff members can mark bins as collected'
      });
    }

    // Find the bin
    const bin = await Bin.findById(binId).populate('userId', 'name email phone');
    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Create collection record
    const Collection = (await import('../models/Collection.js')).default;
    
    // Use the authenticated user's ID as staff ID
    const staffObjectId = req.user.userId; // Use the authenticated user's ID
    const residentObjectId = residentId || bin.userId._id;
    
    console.log('Creating collection record with:', {
      bin: binId,
      staff: staffObjectId,
      resident: residentObjectId,
      wasteType,
      weight: weight ? parseFloat(weight) : null
    });
    
    const collection = new Collection({
      bin: binId,
      staff: staffObjectId,
      resident: residentObjectId,
      collectionTime: collectionTime || new Date(),
      wasteType,
      weight: weight ? parseFloat(weight) : null,
      status: 'completed',
      qrScanned: true,
      notes: notes || ''
    });

    try {
      await collection.save();
      console.log('✅ Collection record saved successfully');
    } catch (collectionError) {
      console.error('❌ Error saving collection record:', collectionError);
      throw new Error(`Failed to save collection record: ${collectionError.message}`);
    }

    // Update bin fill level to 0 and collection dates
    bin.currentFill = 0;
    bin.lastCollection = new Date(collectionTime || new Date());
    bin.nextCollection = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    
    try {
      await bin.save();
      console.log('✅ Bin updated successfully');
    } catch (binError) {
      console.error('❌ Error updating bin:', binError);
      throw new Error(`Failed to update bin: ${binError.message}`);
    }

    console.log('✅ Bin marked as collected successfully:', bin.binId);

    res.json({
      success: true,
      message: 'Bin marked as collected successfully',
      data: {
        bin: bin,
        collection: collection
      }
    });
  } catch (error) {
    console.error('❌ Error marking bin as collected:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking bin as collected',
      error: error.message
    });
  }
};
