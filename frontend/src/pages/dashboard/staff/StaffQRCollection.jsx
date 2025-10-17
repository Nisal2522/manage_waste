import React, { useState, useEffect } from 'react';
import {
  MdQrCodeScanner,
  MdCheckCircle,
  MdLocationOn,
  MdPerson,
  MdRecycling,
  MdScale,
  MdSchedule,
  MdWarning,
  MdInfo,
  MdRefresh,
  MdSave,
  MdCancel,
  MdArrowBack
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useNavigate, useSearchParams } from 'react-router-dom';
import QRScanner from '../../../components/Common/QRScanner.jsx';
import { getBinByQRCode, markBinAsCollected, getBins } from '../../../utils/api.jsx';

const StaffQRCollection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedBin, setScannedBin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Collection form data
  const [collectionData, setCollectionData] = useState({
    wasteType: 'organic',
    weight: '',
    notes: '',
    collectionTime: new Date().toISOString().slice(0, 16) // Format for datetime-local input
  });

  const wasteTypes = [
    { value: 'organic', label: 'Organic Waste', color: '#10b981' },
    { value: 'plastic', label: 'Plastic Waste', color: '#3b82f6' },
    { value: 'paper', label: 'Paper Waste', color: '#f59e0b' },
    { value: 'glass', label: 'Glass Waste', color: '#8b5cf6' },
    { value: 'mixed', label: 'Mixed Waste', color: '#6b7280' },
    { value: 'medical waste', label: 'Medical Waste', color: '#ef4444' },
    { value: 'hazardous', label: 'Hazardous Waste', color: '#dc2626' },
    { value: 'electronic', label: 'Electronic Waste', color: '#7c3aed' },
    { value: 'construction', label: 'Construction Waste', color: '#92400e' }
  ];

  // Auto-load bin data if binId is provided in URL
  useEffect(() => {
    const binId = searchParams.get('binId');
    if (binId && !scannedBin) {
      loadBinByBinId(binId);
    }
  }, [searchParams, scannedBin]);

  const loadBinByBinId = async (binId) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Loading bin by binId:', binId);
      
      // Get all bins and find the one with matching binId
      const response = await getBins();
      
      if (response && response.success) {
        const bin = response.data.find(b => b.binId === binId);
        
        if (bin) {
          setScannedBin(bin);
          setSuccess('Bin loaded successfully from QR code!');
          
          // Pre-fill collection data with bin information
          setCollectionData(prev => ({
            ...prev,
            wasteType: bin.binType?.toLowerCase() || 'organic',
            collectionTime: new Date().toISOString().slice(0, 16)
          }));
        } else {
          throw new Error('Bin not found with the provided ID');
        }
      } else {
        throw new Error(response?.message || 'Failed to load bins');
      }
    } catch (error) {
      console.error('Error loading bin by binId:', error);
      setError(error.message || 'Failed to load bin. Please check the QR code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (qrData) => {
    setScannerOpen(false);
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('QR Code scanned:', qrData);
      
      // Check if QR code is a URL
      if (qrData.startsWith('http')) {
        // Extract binId from URL
        const url = new URL(qrData);
        const binId = url.searchParams.get('binId');
        
        if (binId) {
          // Load bin by binId
          await loadBinByBinId(binId);
          return;
        } else {
          throw new Error('Invalid QR code URL - no binId found');
        }
      } else {
        // Handle legacy QR codes (direct binId or JSON data)
        const response = await getBinByQRCode(qrData);
        
        if (response && response.success) {
          setScannedBin(response.data);
          setSuccess('Bin found successfully!');
          
          // Pre-fill collection data with bin information
          setCollectionData(prev => ({
            ...prev,
            wasteType: response.data.binType?.toLowerCase() || 'organic',
            collectionTime: new Date().toISOString().slice(0, 16)
          }));
        } else {
          throw new Error(response?.message || 'Bin not found');
        }
      }
    } catch (error) {
      console.error('Error processing QR code:', error);
      setError(error.message || 'Failed to process QR code. Please check the QR code and try again.');
      setScannedBin(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setCollectionData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleMarkAsCollected = async () => {
    if (!scannedBin) {
      setError('No bin selected for collection');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const collectionPayload = {
        binId: scannedBin._id,
        binQRCode: scannedBin.binId,
        wasteType: collectionData.wasteType,
        weight: collectionData.weight ? parseFloat(collectionData.weight) : null,
        notes: collectionData.notes,
        collectionTime: new Date(collectionData.collectionTime).toISOString(),
        residentId: scannedBin.userId?._id || scannedBin.userId,
        staffId: user._id
      };

      console.log('Submitting collection data:', collectionPayload);

      const response = await markBinAsCollected(collectionPayload);
      
      if (response && response.success) {
        setShowSuccessModal(true);
        setSuccess(null); // Clear the bin loaded success message
        
        // Reset form and scanned bin after showing success modal
        setTimeout(() => {
          setScannedBin(null);
          setCollectionData({
            wasteType: 'organic',
            weight: '',
            notes: '',
            collectionTime: new Date().toISOString().slice(0, 16)
          });
          setShowSuccessModal(false);
        }, 3000);
      } else {
        throw new Error(response?.message || 'Failed to mark bin as collected');
      }
    } catch (error) {
      console.error('Error marking bin as collected:', error);
      setError(error.message || 'Failed to mark bin as collected. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setScannedBin(null);
    setCollectionData({
      wasteType: 'organic',
      weight: '',
      notes: '',
      collectionTime: new Date().toISOString().slice(0, 16)
    });
    setError(null);
    setSuccess(null);
    setShowSuccessModal(false);
  };

  const getWasteTypeColor = (type) => {
    const wasteType = wasteTypes.find(wt => wt.value === type);
    return wasteType ? wasteType.color : '#6b7280';
  };

  const getWasteTypeLabel = (type) => {
    const wasteType = wasteTypes.find(wt => wt.value === type);
    return wasteType ? wasteType.label : 'Unknown';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-15 w-36 h-36 bg-gradient-to-r from-green-200/30 to-emerald-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard/staff')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <MdArrowBack className="text-xl" />
                <span className="font-medium">Back to Dashboard</span>
              </button>
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              QR Code Collection
            </h1>
            <p className="text-gray-600 text-lg">
              Scan QR codes to mark bins as collected and reset fill levels
            </p>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <MdWarning className="text-red-500 text-xl" />
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <MdCheckCircle className="text-green-500 text-xl" />
              <span className="text-green-800 font-medium">{success}</span>
            </div>
          </div>
        )}

        {/* URL Parameter Indicator */}
        {searchParams.get('binId') && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <MdInfo className="text-blue-500 text-xl" />
              <span className="text-blue-800 font-medium">
                Bin loaded from QR code URL: {searchParams.get('binId')}
              </span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Scanner Section */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdQrCodeScanner className="text-blue-600 text-3xl" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Scan Bin QR Code
              </h2>
              
              <p className="text-gray-600 mb-6">
                Use your device camera to scan the QR code on the waste bin
              </p>

              <button
                onClick={() => setScannerOpen(true)}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <MdQrCodeScanner className="text-xl" />
                    <span>Scan QR Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bin Information Section */}
          {scannedBin && (
            <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Bin Information
              </h2>
              
              <div className="space-y-4">
                {/* Bin ID */}
                <div className="flex items-center space-x-3">
                  <MdRecycling className="text-gray-500 text-xl" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Bin ID</div>
                    <div className="text-lg font-semibold text-gray-800">{scannedBin.binId}</div>
                  </div>
                </div>

                {/* Bin Type */}
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: getWasteTypeColor(scannedBin.binType?.toLowerCase()) }}
                  ></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Bin Type</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {getWasteTypeLabel(scannedBin.binType?.toLowerCase())}
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center space-x-3">
                  <MdPerson className="text-gray-500 text-xl" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Owner</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {scannedBin.userId?.name || 'Unknown'}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-3">
                  <MdLocationOn className="text-gray-500 text-xl" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Location</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {scannedBin.address || 'Address not specified'}
                    </div>
                  </div>
                </div>

                {/* Current Fill Level */}
                <div className="flex items-center space-x-3">
                  <MdScale className="text-gray-500 text-xl" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Current Fill Level</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {scannedBin.currentFill || 0}%
                    </div>
                  </div>
                </div>

                {/* Last Collection */}
                <div className="flex items-center space-x-3">
                  <MdSchedule className="text-gray-500 text-xl" />
                  <div>
                    <div className="text-sm font-medium text-gray-600">Last Collection</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {scannedBin.lastCollection 
                        ? new Date(scannedBin.lastCollection).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Collection Form */}
        {scannedBin && (
          <div className="mt-8 bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Collection Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Waste Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Waste Type
                </label>
                <select
                  value={collectionData.wasteType}
                  onChange={handleInputChange('wasteType')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {wasteTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={collectionData.weight}
                  onChange={handleInputChange('weight')}
                  placeholder="Enter weight in kg"
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Collection Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Collection Time
                </label>
                <input
                  type="datetime-local"
                  value={collectionData.collectionTime}
                  onChange={handleInputChange('collectionTime')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={collectionData.notes}
                  onChange={handleInputChange('notes')}
                  placeholder="Add any notes about the collection..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={handleReset}
                disabled={submitting}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MdRefresh className="text-xl" />
                <span>Reset</span>
              </button>
              
              <button
                onClick={handleMarkAsCollected}
                disabled={submitting}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Marking as Collected...</span>
                  </>
                ) : (
                  <>
                    <MdCheckCircle className="text-xl" />
                    <span>Mark as Collected</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <MdInfo className="text-blue-500 text-xl mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 mb-1">Important</h4>
                  <p className="text-sm text-blue-700">
                    Marking this bin as collected will reset its fill level to 0% and update the collection history. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MdCheckCircle className="text-green-600 text-4xl" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Collection Successful!
                </h3>
                
                <p className="text-gray-600 mb-6">
                  The bin has been marked as collected and the fill level has been reset to 0%.
                </p>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Redirecting back to scanner...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR Scanner Modal */}
        <QRScanner
          open={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onScan={handleQRScan}
          title="Scan Bin QR Code"
          description="Position the QR code on the waste bin within the frame to scan"
        />
      </div>
    </div>
  );
};

export default StaffQRCollection;
