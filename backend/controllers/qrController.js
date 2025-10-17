import QRCode from 'qrcode';
import Bin from '../models/Bin.js';

// @desc    Generate QR code for bin
// @route   POST /api/qr/generate
// @access  Private
export const generateQRCode = async (req, res) => {
  try {
    console.log('🎯 generateQRCode controller called');
    console.log('📦 Request body:', req.body);
    
    const { binId, binType, userId } = req.body;
    
    console.log('🔍 Extracted data:', { binId, binType, userId });
    
    if (!binId) {
      console.log('❌ Bin ID is missing');
      return res.status(400).json({
        success: false,
        message: 'Bin ID is required'
      });
    }

    // Find the bin
    console.log('🔍 Searching for bin with ID:', binId);
    const bin = await Bin.findOne({ binId }).populate('userId', 'name email');
    
    console.log('📦 Found bin:', bin ? 'Yes' : 'No');
    
    if (!bin) {
      console.log('❌ Bin not found in database');
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    // Create collection URL that will auto-submit collection
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const collectionUrl = `${baseUrl}/staff/collect?binId=${binId}&autoSubmit=true`;
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(collectionUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Update bin with QR code data
    bin.qrCode = qrCodeDataURL;
    await bin.save();

    res.json({
      success: true,
      data: {
        binId: bin.binId,
        qrCode: qrCodeDataURL,
        collectionUrl: collectionUrl,
        bin: {
          id: bin._id,
          binId: bin.binId,
          binType: bin.binType,
          capacity: bin.capacity,
          currentFill: bin.currentFill,
          address: bin.address,
          userId: bin.userId
        }
      }
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating QR code',
      error: error.message
    });
  }
};

// @desc    Validate QR code
// @route   POST /api/qr/validate
// @access  Private
export const validateQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;
    
    if (!qrData) {
      return res.status(400).json({
        success: false,
        message: 'QR data is required'
      });
    }

    // Check if it's a collection URL
    if (qrData.includes('/staff/collect?binId=')) {
      const url = new URL(qrData);
      const binId = url.searchParams.get('binId');
      const autoSubmit = url.searchParams.get('autoSubmit');
      
      if (binId) {
        const bin = await Bin.findOne({ binId }).populate('userId', 'name email');
        
        if (bin) {
          return res.json({
            success: true,
            data: {
              bin: bin,
              autoSubmit: autoSubmit === 'true',
              collectionUrl: qrData
            }
          });
        }
      }
    }

    // If not a collection URL, treat as regular bin ID
    const bin = await Bin.findOne({ binId: qrData }).populate('userId', 'name email');
    
    if (bin) {
      return res.json({
        success: true,
        data: {
          bin: bin,
          autoSubmit: false
        }
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Invalid QR code or bin not found'
    });

  } catch (error) {
    console.error('Error validating QR code:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating QR code',
      error: error.message
    });
  }
};
