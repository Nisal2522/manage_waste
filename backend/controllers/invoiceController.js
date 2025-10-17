import Invoice from '../models/Invoice.js';
import Collection from '../models/Collection.js';
import User from '../models/User.js';

// Generate unique invoice number
const generateInvoiceNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Find the last invoice for this month
  const lastInvoice = await Invoice.findOne({
    invoiceNumber: new RegExp(`^INV-${year}${month}`)
  }).sort({ createdAt: -1 });

  let sequence = 1;
  if (lastInvoice) {
    const lastSequence = parseInt(lastInvoice.invoiceNumber.split('-')[2]);
    sequence = lastSequence + 1;
  }

  return `INV-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    const { status, resident, startDate, endDate } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (resident) filter.resident = resident;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(filter)
      .populate('resident', 'name email phone address')
      .populate({
        path: 'collection',
        populate: [
          { path: 'bin', select: 'binId binType location' },
          { path: 'staff', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: invoices,
      count: invoices.length
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoices',
      error: error.message
    });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('resident', 'name email phone address')
      .populate({
        path: 'collection',
        populate: [
          { path: 'bin', select: 'binId binType location address' },
          { path: 'staff', select: 'name email' }
        ]
      });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice',
      error: error.message
    });
  }
};

// Create invoice from collection
export const createInvoiceFromCollection = async (req, res) => {
  try {
    console.log('📄 Creating invoice from collection');
    console.log('Request body:', req.body);

    const { collectionId, ratePerKg, discount, tax, dueDate, notes } = req.body;

    // Validate required fields
    if (!collectionId || !ratePerKg) {
      return res.status(400).json({
        success: false,
        message: 'Collection ID and rate per kg are required'
      });
    }

    // Get collection details
    const collection = await Collection.findById(collectionId)
      .populate('resident', 'name email phone address')
      .populate('bin', 'binId binType location');

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Check if invoice already exists for this collection
    const existingInvoice = await Invoice.findOne({ collection: collectionId });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: 'Invoice already exists for this collection',
        data: existingInvoice
      });
    }

    // Calculate amounts
    const weight = collection.weight;
    const amount = weight * ratePerKg;
    const discountAmount = discount || 0;
    const taxAmount = tax || 0;
    const totalAmount = amount - discountAmount + taxAmount;

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Set billing period (month of collection)
    const collectionDate = new Date(collection.collectionTime);
    const billingPeriod = {
      startDate: new Date(collectionDate.getFullYear(), collectionDate.getMonth(), 1),
      endDate: new Date(collectionDate.getFullYear(), collectionDate.getMonth() + 1, 0)
    };

    // Set due date (30 days from now if not provided)
    const calculatedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Determine waste type from bin type - normalize to enum values
    const normalizeWasteType = (binType) => {
      if (!binType) return 'mixed';
      const type = binType.toLowerCase();
      
      // Map various bin type names to enum values
      if (type.includes('organic')) return 'organic';
      if (type.includes('plastic')) return 'plastic';
      if (type.includes('paper')) return 'paper';
      if (type.includes('glass')) return 'glass';
      
      return 'mixed';
    };
    
    const wasteType = normalizeWasteType(collection.bin?.binType);

    // Create invoice
    const invoice = new Invoice({
      invoiceNumber,
      resident: collection.resident._id,
      collection: collectionId,
      amount,
      wasteType,
      weight,
      ratePerKg,
      billingPeriod,
      status: 'pending',
      dueDate: calculatedDueDate,
      discount: discountAmount,
      tax: taxAmount,
      totalAmount,
      notes: notes || `Invoice for waste collection on ${collectionDate.toLocaleDateString()}`
    });

    await invoice.save();
    console.log('✅ Invoice created:', invoice.invoiceNumber);

    // Populate invoice before sending response
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('resident', 'name email phone address')
      .populate({
        path: 'collection',
        populate: [
          { path: 'bin', select: 'binId binType location' },
          { path: 'staff', select: 'name email' }
        ]
      });

    res.status(201).json({
      success: true,
      data: populatedInvoice,
      message: 'Invoice created successfully'
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating invoice',
      error: error.message
    });
  }
};

// Update invoice status
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { status, paymentMethod, paidDate } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const updateData = { status };
    
    if (status === 'paid') {
      updateData.paidDate = paidDate || new Date();
      if (paymentMethod) updateData.paymentMethod = paymentMethod;
    }

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('resident', 'name email phone address')
      .populate({
        path: 'collection',
        populate: [
          { path: 'bin', select: 'binId binType location' },
          { path: 'staff', select: 'name email' }
        ]
      });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice,
      message: 'Invoice status updated successfully'
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating invoice',
      error: error.message
    });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting invoice',
      error: error.message
    });
  }
};

// Get invoices for a specific resident
export const getResidentInvoices = async (req, res) => {
  try {
    const residentId = req.params.residentId;

    const invoices = await Invoice.find({ resident: residentId })
      .populate('resident', 'name email phone address')
      .populate({
        path: 'collection',
        populate: [
          { path: 'bin', select: 'binId binType location' },
          { path: 'staff', select: 'name email' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: invoices,
      count: invoices.length
    });
  } catch (error) {
    console.error('Error fetching resident invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching invoices',
      error: error.message
    });
  }
};
