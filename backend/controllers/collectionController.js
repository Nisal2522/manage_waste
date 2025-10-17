import Collection from '../models/Collection.js';
import Bin from '../models/Bin.js';
import User from '../models/User.js';
import Invoice from '../models/Invoice.js';

// Get all collections
export const getCollections = async (req, res) => {
  try {
    const { status, wasteType, date, staff, resident } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (wasteType) filter.wasteType = wasteType;
    if (staff) filter.staff = staff;
    if (resident) filter.resident = resident;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.collectionTime = { $gte: startDate, $lt: endDate };
    }

    const collections = await Collection.find(filter)
      .populate('bin', 'binId binType location address capacity currentFill')
      .populate('staff', 'name email role')
      .populate('resident', 'name email')
      .sort({ collectionTime: -1 });

    // For each collection, check if an invoice exists
    const collectionsWithInvoice = await Promise.all(
      collections.map(async (collection) => {
        const invoice = await Invoice.findOne({ collection: collection._id })
          .select('invoiceNumber status totalAmount paidDate');
        
        return {
          ...collection.toObject(),
          invoice: invoice || null
        };
      })
    );

    res.json({
      success: true,
      data: collectionsWithInvoice,
      count: collectionsWithInvoice.length
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collections',
      error: error.message
    });
  }
};

// Get collection by ID
export const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id)
      .populate('bin', 'binId binType location address capacity currentFill')
      .populate('staff', 'name email role')
      .populate('resident', 'name email');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: collection
    });
  } catch (error) {
    console.error('Error fetching collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collection',
      error: error.message
    });
  }
};

// Create new collection
export const createCollection = async (req, res) => {
  try {
    console.log('📝 Collection creation request received');
    console.log('Request body:', req.body);
    console.log('User from auth:', req.user);
    
    const { bin, staff, resident, weight, isCollected } = req.body;

    // Validate required fields
    if (!bin || !staff || !resident || weight === undefined || isCollected === undefined) {
      console.log('❌ Missing required fields:', { bin: !!bin, staff: !!staff, resident: !!resident, weight, isCollected });
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bin, staff, resident, weight, isCollected'
      });
    }

    // Validate weight
    if (isNaN(weight) || weight < 0) {
      return res.status(400).json({
        success: false,
        message: 'Weight must be a valid positive number'
      });
    }

    // Check if bin exists
    const binExists = await Bin.findById(bin);
    if (!binExists) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Check if staff exists
    const staffExists = await User.findById(staff);
    if (!staffExists) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Check if resident exists
    const residentExists = await User.findById(resident);
    if (!residentExists) {
      return res.status(404).json({
        success: false,
        message: 'Resident not found'
      });
    }

    const collection = new Collection({
      bin,
      staff,
      resident,
      weight,
      isCollected
    });

    await collection.save();
    console.log('✅ Collection saved to database:', collection._id);

    // Reset bin fill level to 0% after successful collection
    if (isCollected) {
      await Bin.findByIdAndUpdate(bin, { 
        currentFill: 0,
        lastCollection: new Date()
      });
      console.log('✅ Bin fill level reset to 0%');
    }

    // Populate the created collection
    const populatedCollection = await Collection.findById(collection._id)
      .populate('bin', 'binId binType location address capacity currentFill')
      .populate('staff', 'name email role')
      .populate('resident', 'name email');

    console.log('✅ Collection created successfully:', populatedCollection._id);
    res.status(201).json({
      success: true,
      data: populatedCollection,
      message: 'Collection created successfully'
    });
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating collection',
      error: error.message
    });
  }
};

// Update collection
export const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const collection = await Collection.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('bin', 'binId binType location address capacity currentFill')
      .populate('staff', 'name email role')
      .populate('resident', 'name email');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      data: collection,
      message: 'Collection updated successfully'
    });
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating collection',
      error: error.message
    });
  }
};

// Delete collection
export const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting collection',
      error: error.message
    });
  }
};

// Get collections by date
export const getCollectionsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const collections = await Collection.find({
      collectionTime: { $gte: startDate, $lt: endDate }
    })
      .populate('bin', 'binId binType location address capacity currentFill')
      .populate('staff', 'name email role')
      .populate('resident', 'name email')
      .sort({ collectionTime: -1 });

    res.json({
      success: true,
      data: collections,
      count: collections.length
    });
  } catch (error) {
    console.error('Error fetching collections by date:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching collections by date',
      error: error.message
    });
  }
};

// Scan QR code for collection
export const scanQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }

    let binId = null;
    let bin = null;

    // Handle different QR data formats
    if (qrData.startsWith('http')) {
      // Extract bin ID from URL (e.g., http://localhost:3000/bin/64f8a1b2c3d4e5f6a7b8c9d0)
      const urlParts = qrData.split('/');
      binId = urlParts[urlParts.length - 1];
    } else {
      try {
        // Try to parse as JSON
        const qrJson = JSON.parse(qrData);
        if (qrJson.binId) {
          binId = qrJson.binId;
        } else if (qrJson.url) {
          // Extract bin ID from JSON URL
          const urlParts = qrJson.url.split('/');
          binId = urlParts[urlParts.length - 1];
        }
      } catch (jsonError) {
        // If not JSON, treat as direct bin ID
        binId = qrData;
      }
    }

    if (!binId) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract bin ID from QR data'
      });
    }

    // Try to find bin by ID first
    bin = await Bin.findById(binId);
    
    // If not found by ID, try to find by binId field
    if (!bin) {
      bin = await Bin.findOne({ binId: binId });
    }

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Populate the bin with user information
    const populatedBin = await Bin.findById(bin._id).populate('userId', 'name email');

    res.json({
      success: true,
      data: {
        bin: populatedBin,
        message: 'QR code scanned successfully'
      }
    });
  } catch (error) {
    console.error('Error scanning QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Error scanning QR code',
      error: error.message
    });
  }
};
