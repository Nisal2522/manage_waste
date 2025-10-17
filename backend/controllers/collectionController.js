import Collection from '../models/Collection.js';
import Bin from '../models/Bin.js';
import User from '../models/User.js';

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

    res.json({
      success: true,
      data: collections,
      count: collections.length
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
    const { bin, staff, resident, wasteType, weight, status, qrScanned } = req.body;

    // Validate required fields
    if (!bin || !staff || !resident || !wasteType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: bin, staff, resident, wasteType'
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
      wasteType,
      weight,
      status: status || 'scheduled',
      qrScanned: qrScanned || false
    });

    await collection.save();

    // Populate the created collection
    const populatedCollection = await Collection.findById(collection._id)
      .populate('bin', 'binId binType location address capacity currentFill')
      .populate('staff', 'name email role')
      .populate('resident', 'name email');

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

    // Parse QR data (assuming it contains bin ID)
    const binId = qrData;
    const bin = await Bin.findById(binId);

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    res.json({
      success: true,
      data: {
        bin: bin,
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
