import React, { useState, useEffect } from 'react';
import {
  MdAdd,
  MdCheckCircle,
  MdLocationOn,
  MdThermostat,
  MdOpacity,
  MdDelete,
  MdEdit,
  MdRecycling,
  MdSchedule,
  MdWarning,
  MdInfo,
  MdQrCode
} from 'react-icons/md';
import { FaEye } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getBinRequestsByUser, createBin, getBinsByUser, updateBinFillLevel, deleteBin } from '../../../utils/api.jsx';
import QRGenerator from '../../../components/common/QRGenerator';

const MyBins = () => {
  const { user } = useAuth();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openFillLevelModal, setOpenFillLevelModal] = useState(false);
  const [openBulkFillLevelModal, setOpenBulkFillLevelModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openQRModal, setOpenQRModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [qrBinData, setQrBinData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [requests, setRequests] = useState([]);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdBinsFromRequests, setCreatedBinsFromRequests] = useState(new Set());
  const [fillLevel, setFillLevel] = useState(0);
  const [bulkFillLevel, setBulkFillLevel] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [updatingBins, setUpdatingBins] = useState(new Set());

  // Form state for creating bin
  const [binFormData, setBinFormData] = useState({
    binId: '',
    owner: '',
    deviceType: 'QR Code',
    deviceId: '',
    binType: 'General Waste',
    capacity: '',
    longitude: '',
    latitude: '',
    address: ''
  });

  // Get user ID
  const getUserId = () => {
    return user?.id || user?._id;
  };

  // Get user's default location data
  const getUserLocationData = () => {
    return {
      longitude: user?.longitude || user?.location?.longitude || '',
      latitude: user?.latitude || user?.location?.latitude || '',
      address: user?.address || user?.location?.address || ''
    };
  };

  // Get current location using browser geolocation API
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    });
  };

  // Load approved requests and existing bins
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      loadApprovedRequests();
      loadUserBins();
    }
  }, [user]);

  // Initialize form data with user's location when user data is available
  useEffect(() => {
    if (user) {
      const userLocation = getUserLocationData();
      setBinFormData(prev => ({
        ...prev,
        owner: user?.name || '',
        longitude: userLocation.longitude,
        latitude: userLocation.latitude,
        address: userLocation.address
      }));
    }
  }, [user]);

  const loadApprovedRequests = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        showSnackbar('User not found. Please log in again.', 'error');
        return;
      }
      
      const response = await getBinRequestsByUser(userId);
      
      if (response && response.success) {
        // Filter only approved requests
        const approvedRequests = response.data.filter(req => req.status === 'approved');
        setRequests(approvedRequests);
      } else {
        const errorMessage = response?.message || 'Failed to load requests';
        showSnackbar(errorMessage, 'error');
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading approved requests:', error);
      showSnackbar('Error loading approved requests. Please try again.', 'error');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserBins = async () => {
    try {
      const userId = getUserId();
      if (!userId) return;

      const response = await getBinsByUser(userId);
      if (response && response.success) {
        setBins(response.data || []);
      }
    } catch (error) {
      console.error('Error loading user bins:', error);
      showSnackbar('Error loading your bins. Please try again.', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenFillLevelModal = (bin) => {
    setSelectedBin(bin);
    setFillLevel(bin.currentFill || 0);
    setOpenFillLevelModal(true);
  };

  const handleCloseFillLevelModal = () => {
    setOpenFillLevelModal(false);
    setSelectedBin(null);
    setFillLevel(0);
  };

  const handleOpenBulkFillLevelModal = () => {
    setOpenBulkFillLevelModal(true);
    setBulkFillLevel(0);
  };

  const handleCloseBulkFillLevelModal = () => {
    setOpenBulkFillLevelModal(false);
    setBulkFillLevel(0);
  };

  const handleOpenDeleteModal = (bin) => {
    setSelectedBin(bin);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setSelectedBin(null);
  };

  const handleOpenQRModal = (bin) => {
    setQrBinData(bin);
    setOpenQRModal(true);
  };

  const handleCloseQRModal = () => {
    setOpenQRModal(false);
    setQrBinData(null);
  };


  const handleUpdateFillLevel = async () => {
    try {
      setSubmitting(true);
      
      if (!selectedBin) {
        showSnackbar('No bin selected', 'error');
        return;
      }

      // Add bin to updating state
      setUpdatingBins(prev => new Set([...prev, selectedBin._id || selectedBin.id]));

      const response = await updateBinFillLevel(selectedBin._id || selectedBin.id, fillLevel);
      
      if (response && response.success) {
        showSnackbar('Fill level updated successfully!', 'success');
        
        // Update the bin in the local state
        setBins(prevBins => 
          prevBins.map(bin => 
            bin._id === selectedBin._id || bin.id === selectedBin.id
              ? { ...bin, currentFill: fillLevel }
              : bin
          )
        );
        
        console.log('✅ Fill level updated in state:', fillLevel);
        setRefreshKey(prev => prev + 1); // Force re-render
        
        // Remove bin from updating state
        setUpdatingBins(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedBin._id || selectedBin.id);
          return newSet;
        });
        
        // Reload bins from server to ensure we have the latest data
        setTimeout(() => {
          loadUserBins();
        }, 500);
        
        handleCloseFillLevelModal();
      } else {
        throw new Error(response?.message || 'Failed to update fill level');
      }
    } catch (error) {
      console.error('Error updating fill level:', error);
      showSnackbar(error.message || 'Error updating fill level. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpdateFillLevel = async () => {
    try {
      setSubmitting(true);
      
      if (bins.length === 0) {
        showSnackbar('No bins available to update', 'error');
        return;
      }

      // Add all bins to updating state
      const binIds = bins.map(bin => bin._id || bin.id);
      setUpdatingBins(prev => new Set([...prev, ...binIds]));

      // Update all bins with the same fill level
      const updatePromises = bins.map(bin => 
        updateBinFillLevel(bin._id || bin.id, bulkFillLevel)
      );

      const results = await Promise.all(updatePromises);
      
      // Check if all updates were successful
      const allSuccessful = results.every(result => result && result.success);
      
      if (allSuccessful) {
        showSnackbar(`Fill level updated to ${bulkFillLevel}% for all ${bins.length} bins!`, 'success');
        
        // Update all bins in the local state
        setBins(prevBins => 
          prevBins.map(bin => ({ ...bin, currentFill: bulkFillLevel }))
        );
        
        console.log('✅ Bulk fill level updated in state:', bulkFillLevel);
        setRefreshKey(prev => prev + 1); // Force re-render
        
        // Remove all bins from updating state
        setUpdatingBins(prev => {
          const newSet = new Set(prev);
          binIds.forEach(id => newSet.delete(id));
          return newSet;
        });
        
        // Reload bins from server to ensure we have the latest data
        setTimeout(() => {
          loadUserBins();
        }, 500);
        
        handleCloseBulkFillLevelModal();
      } else {
        throw new Error('Some updates failed');
      }
    } catch (error) {
      console.error('Error updating bulk fill level:', error);
      showSnackbar(error.message || 'Error updating fill levels. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBin = async () => {
    try {
      setSubmitting(true);
      
      if (!selectedBin) {
        showSnackbar('No bin selected for deletion', 'error');
        return;
      }

      const response = await deleteBin(selectedBin._id || selectedBin.id);
      
      if (response && response.success) {
        showSnackbar('Bin deleted successfully!', 'success');
        
        // Remove the bin from local state
        setBins(prevBins => 
          prevBins.filter(bin => (bin._id || bin.id) !== (selectedBin._id || selectedBin.id))
        );
        
        console.log('✅ Bin deleted from state:', selectedBin.binId);
        setRefreshKey(prev => prev + 1); // Force re-render
        
        // Reload bins from server to ensure we have the latest data
        setTimeout(() => {
          loadUserBins();
        }, 500);
        
        handleCloseDeleteModal();
      } else {
        throw new Error(response?.message || 'Failed to delete bin');
      }
    } catch (error) {
      console.error('Error deleting bin:', error);
      showSnackbar(error.message || 'Error deleting bin. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenCreateModal = (request, binType, requestIndex, binIndex, quantityIndex) => {
    setSelectedRequest({ request, binType, requestIndex, binIndex, quantityIndex });
    const userLocation = getUserLocationData();
    
    // Pre-fill form with request data or user's default location
    setBinFormData({
      binId: `BIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      owner: user?.name || '',
      deviceType: 'QR Code',
      deviceId: `QR-${Date.now()}`,
      binType: binType || 'General Waste',
      capacity: getCapacityFromBinType(binType),
      longitude: request.longitude || userLocation.longitude,
      latitude: request.latitude || userLocation.latitude,
      address: request.address || userLocation.address
    });
    setOpenCreateModal(true);
  };

  const getCapacityFromBinType = (binType) => {
    switch (binType?.toLowerCase()) {
      case 'general waste': return '120';
      case 'recyclable waste': return '80';
      case 'organic waste': return '60';
      case 'hazardous waste': return '40';
      case 'medical waste': return '30';
      default: return '120';
    }
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    setSelectedRequest(null);
    const userLocation = getUserLocationData();
    setBinFormData({
      binId: '',
      owner: user?.name || '',
      deviceType: 'QR Code',
      deviceId: '',
      binType: 'General Waste',
      capacity: '',
      longitude: userLocation.longitude,
      latitude: userLocation.latitude,
      address: userLocation.address
    });
  };

  const handleBinFormChange = (field) => (event) => {
    setBinFormData({
      ...binFormData,
      [field]: event.target.value
    });
  };

  const handleCreateBin = async () => {
    try {
      setSubmitting(true);
      
      // Validate required fields
      if (!binFormData.binId || !binFormData.capacity || !binFormData.longitude || !binFormData.latitude) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      const binData = {
        binId: binFormData.binId,
        owner: binFormData.owner,
        deviceType: binFormData.deviceType,
        deviceId: binFormData.deviceId,
        binType: binFormData.binType,
        capacity: parseInt(binFormData.capacity),
        currentFill: 0, // Start with empty bin
        longitude: parseFloat(binFormData.longitude),
        latitude: parseFloat(binFormData.latitude),
        address: binFormData.address,
        userId: getUserId(),
        temperature: null, // Will be set by sensors when available
        humidity: null, // Will be set by sensors when available
        lastCollection: null, // Will be set when first collection happens
        nextCollection: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      };

      console.log('Creating bin with data:', binData);

      const response = await createBin(binData);
      
      if (response && response.success) {
        showSnackbar('Bin created successfully!', 'success');
        
        // Mark this specific bin creation card as created
        if (selectedRequest) {
          const { requestIndex, binIndex, quantityIndex } = selectedRequest;
          const creationKey = `${requestIndex}-${binIndex}-${quantityIndex}`;
          setCreatedBinsFromRequests(prev => new Set([...prev, creationKey]));
        }
        
        handleCloseCreateModal();
        
        // Show QR code modal for the newly created bin
        if (response.data) {
          setQrBinData(response.data);
          setOpenQRModal(true);
        }
        
        // Reload bins to show the newly created one
        loadUserBins();
      } else {
        throw new Error(response?.message || 'Failed to create bin');
      }
    } catch (error) {
      console.error('Error creating bin:', error);
      showSnackbar(error.message || 'Error creating bin. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getBinTypeColor = (binType) => {
    switch (binType?.toLowerCase()) {
      case 'general waste': return '#6b7280';
      case 'recyclable waste': return '#3b82f6';
      case 'organic waste': return '#10b981';
      case 'hazardous waste': return '#ef4444';
      case 'medical waste': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getBinTypeLabel = (binType) => {
    const type = binType?.toLowerCase();
    if (type === 'general' || type === 'general waste') return 'General Waste';
    if (type === 'recyclable' || type === 'recyclable waste') return 'Recyclable Waste';
    if (type === 'organic' || type === 'organic waste') return 'Organic Waste';
    if (type === 'hazardous' || type === 'hazardous waste') return 'Hazardous Waste';
    if (type === 'medical' || type === 'medical waste') return 'Medical Waste';
    return binType || 'General Waste';
  };

  const getFillLevelColor = (fillLevel) => {
    if (fillLevel < 50) return '#10b981';
    if (fillLevel < 80) return '#f59e0b';
    return '#ef4444';
  };

  // Generate bin cards from approved requests (for creation) and existing bins
  const getBinCards = () => {
    const cards = [];

    // Add existing bins
    bins.forEach((bin, index) => {
      cards.push(
        <div key={`bin-${bin._id || bin.id || index}-${refreshKey}`}>
          <BinCard bin={bin} />
        </div>
      );
    });

    // Add creation cards from approved requests (only for bins not yet created)
    requests.forEach((request, requestIndex) => {
      if (request.selectedBins) {
        request.selectedBins.forEach((binRequest, binIndex) => {
          const binType = getBinTypeLabel(binRequest.binType);
          const quantity = binRequest.quantity || 1;
          
          // Create cards for each quantity that hasn't been created yet
          for (let quantityIndex = 0; quantityIndex < quantity; quantityIndex++) {
            const creationKey = `${requestIndex}-${binIndex}-${quantityIndex}`;
            
            // Only show creation card if this specific bin hasn't been created yet
            if (!createdBinsFromRequests.has(creationKey)) {
              cards.push(
                <div key={`request-${creationKey}`}>
                  <CreateBinCard 
                    request={request}
                    binType={binType}
                    onCreate={() => handleOpenCreateModal(request, binType, requestIndex, binIndex, quantityIndex)}
                  />
                </div>
              );
            }
          }
        });
      }
    });

    return cards;
  };

  // Bin Card Component for existing bins
  const BinCard = ({ bin }) => {
    const fillLevel = bin.currentFill || 0;
    const capacity = bin.capacity || 100;
    const currentFill = Math.round((fillLevel / 100) * capacity);
    const isUpdating = updatingBins.has(bin._id || bin.id);
    
    // Debug logging
    console.log(`🔍 BinCard render for ${bin.binId}: fillLevel=${fillLevel}%, isUpdating=${isUpdating}`);

    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300/50 overflow-hidden relative">
        {isUpdating && (
          <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
            <div className="bg-white rounded-lg p-4 shadow-lg flex items-center space-x-3">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-600 font-medium">Updating...</span>
            </div>
          </div>
        )}
        <div className="p-6">
          {/* Bin ID and Type */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {bin.binId}
              </h3>
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: getBinTypeColor(bin.binType) }}
              >
                {getBinTypeLabel(bin.binType)}
              </span>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${fillLevel < 50 ? 'text-green-600' : fillLevel < 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                {fillLevel}%
              </div>
              <div className="text-sm text-gray-500">Full</div>
            </div>
          </div>

          {/* Fill Level Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Fill Level</span>
              <span className={`text-sm font-bold ${fillLevel < 50 ? 'text-green-600' : fillLevel < 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                {fillLevel}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: `${fillLevel}%`,
                  backgroundColor: getFillLevelColor(fillLevel)
                }}
              ></div>
            </div>
          </div>

          {/* Capacity */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Capacity</div>
            <div className="text-lg font-semibold text-gray-800">
            {currentFill} / {capacity} liters
            </div>
          </div>

          {/* Temperature and Humidity */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <MdThermostat className="text-red-500 text-xl" />
              <div>
                <div className="text-sm font-medium text-gray-800">
                    {bin.temperature ? `${bin.temperature}°C` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Temperature</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MdOpacity className="text-blue-500 text-xl" />
              <div>
                <div className="text-sm font-medium text-gray-800">
                    {bin.humidity ? `${bin.humidity}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">Humidity</div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start space-x-2 mb-4">
            <MdLocationOn className="text-gray-500 text-xl mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-600 leading-relaxed">
              {bin.address || 'Address not specified'}
            </div>
          </div>

          {/* Collection Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Last Collection</div>
              <div className="text-sm text-gray-800">
                {bin.lastCollection ? new Date(bin.lastCollection).toLocaleDateString() : 'Never'}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-500 mb-1">Next Collection</div>
              <div className="text-sm text-gray-800">
                {bin.nextCollection ? new Date(bin.nextCollection).toLocaleDateString() : 'Not scheduled'}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center space-x-2 bg-green-50 text-green-700 py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium border border-green-200">
                <MdSchedule className="text-lg" />
                <span>Request Collection</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                <FaEye className="text-lg" />
                <span>View Details</span>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handleOpenQRModal(bin)}
                className="flex items-center justify-center space-x-2 bg-purple-50 text-purple-700 py-2 px-3 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium border border-purple-200"
              >
                <MdQrCode className="text-lg" />
                <span>QR Code</span>
              </button>
              <button 
                onClick={() => handleOpenFillLevelModal(bin)}
                className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
              >
                <MdEdit className="text-lg" />
                <span>Mark Fill Level</span>
              </button>
              <button 
                onClick={() => handleOpenDeleteModal(bin)}
                className="flex items-center justify-center space-x-2 bg-red-50 text-red-700 py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium border border-red-200"
              >
                <MdDelete className="text-lg" />
                <span>Delete Bin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Create Bin Card Component for approved requests
  const CreateBinCard = ({ request, binType, onCreate }) => {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-dashed border-green-300 rounded-2xl p-6 text-center hover:border-green-400 transition-all duration-300">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MdCheckCircle className="text-green-600 text-3xl" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
            Ready to Create
        </h3>
        
        <span 
          className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white mb-4"
          style={{ backgroundColor: getBinTypeColor(binType) }}
        >
          {binType}
        </span>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
            Your bin request has been approved. Click below to create your waste bin.
        </p>

        <button
            onClick={onCreate}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium"
        >
          <MdAdd className="text-xl" />
          <span>Create Bin</span>
        </button>
      </div>
    );
  };

  const totalBins = bins.length + requests.reduce((total, request) => {
    return total + (request.selectedBins?.reduce((sum, bin) => sum + (bin.quantity || 1), 0) || 0);
  }, 0);

  const pendingCreationCount = requests.reduce((total, request, requestIndex) => {
    if (request.selectedBins) {
      return total + request.selectedBins.reduce((sum, binRequest, binIndex) => {
        const quantity = binRequest.quantity || 1;
        let createdCount = 0;
        
        // Count how many of this specific bin type have been created
        for (let quantityIndex = 0; quantityIndex < quantity; quantityIndex++) {
          const creationKey = `${requestIndex}-${binIndex}-${quantityIndex}`;
          if (createdBinsFromRequests.has(creationKey)) {
            createdCount++;
          }
        }
        
        return sum + (quantity - createdCount);
      }, 0);
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-r from-emerald-200/30 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-15 w-36 h-36 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
      {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
            My Waste Bins
              </h1>
              <p className="text-gray-600 text-lg">
                Monitor and manage your waste bins with real-time data
              </p>
            </div>
            {bins.length > 0 && (
              <button
                onClick={handleOpenBulkFillLevelModal}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                <MdEdit className="text-xl" />
                <span>Set Fill Level for All Bins</span>
              </button>
            )}
          </div>
        </div>

      {/* Stats Section */}
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Total Bins</h2>
              <div className="text-5xl font-bold text-gray-800 mb-2">
          {bins.length + pendingCreationCount}
              </div>
              <p className="text-gray-600">
          {bins.length} active bins • {pendingCreationCount} pending creation
              </p>
            </div>
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
              <MdRecycling className="text-white text-3xl" />
            </div>
          </div>
        </div>

      {/* Bins Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {getBinCards()}
        </div>

      {/* Create Bin Modal */}
      {openCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
            Create New Waste Bin
              </h2>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
            {/* Bin ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bin ID
                </label>
                <input
                  type="text"
              value={binFormData.binId}
              onChange={handleBinFormChange('binId')}
              placeholder="e.g., BIN-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
              </div>

            {/* Owner */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
              Owner
                </label>
                <select
                value={binFormData.owner}
                onChange={handleBinFormChange('owner')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value={user?.name || ''}>{user?.name || 'Current User'}</option>
                </select>
              </div>

            {/* Device Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
              Device Type
                </label>
                <select
                value={binFormData.deviceType}
                onChange={handleBinFormChange('deviceType')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="QR Code">QR Code</option>
                  <option value="RFID">RFID</option>
                  <option value="NFC">NFC</option>
                </select>
              </div>

            {/* Device ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
              Device ID
                </label>
                <input
                  type="text"
              value={binFormData.deviceId}
              onChange={handleBinFormChange('deviceId')}
              placeholder="e.g., RFID-001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
              </div>

            {/* Bin Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bin Type
                </label>
                <select
                value={binFormData.binType}
                onChange={handleBinFormChange('binType')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="General Waste">General Waste</option>
                  <option value="Recyclable Waste">Recyclable Waste</option>
                  <option value="Organic Waste">Organic Waste</option>
                  <option value="Hazardous Waste">Hazardous Waste</option>
                  <option value="Medical Waste">Medical Waste</option>
                </select>
              </div>

            {/* Capacity */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity (liters)
                </label>
                <input
              type="number"
              value={binFormData.capacity}
              onChange={handleBinFormChange('capacity')}
              placeholder="120"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
              </div>

            {/* Location Section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const location = await getCurrentLocation();
                        setBinFormData(prev => ({
                          ...prev,
                          latitude: location.latitude.toString(),
                          longitude: location.longitude.toString()
                        }));
                        showSnackbar('Current location detected successfully!', 'success');
                      } catch (error) {
                        console.error('Error getting location:', error);
                        showSnackbar('Could not get current location. Please enter manually.', 'error');
                      }
                    }}
                    className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium border border-blue-200"
                  >
                    <MdLocationOn className="text-lg" />
                    <span>Get Current Location</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                    Longitude
                    </label>
                    <input
                    type="number"
                      step="0.0001"
                    value={binFormData.longitude}
                    onChange={handleBinFormChange('longitude')}
                    placeholder="Enter longitude (e.g., 79.8612)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                    Latitude
                    </label>
                    <input
                    type="number"
                      step="0.0001"
                    value={binFormData.latitude}
                    onChange={handleBinFormChange('latitude')}
                    placeholder="Enter latitude (e.g., 6.9271)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

            {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
                </label>
                <textarea
              value={binFormData.address}
              onChange={handleBinFormChange('address')}
              placeholder="Street address, City, District"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex justify-center space-x-4">
              <button
            onClick={handleCloseCreateModal} 
            disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
              </button>
              <button
            onClick={handleCreateBin}
            disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <MdAdd className="text-xl" />
                    <span>Create Bin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fill Level Modal */}
      {openFillLevelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Update Fill Level
              </h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedBin && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Bin Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Bin ID:</span>
                      <span className="text-sm text-gray-800">{selectedBin.binId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Type:</span>
                      <span className="text-sm text-gray-800">{getBinTypeLabel(selectedBin.binType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Current Fill Level:</span>
                      <span className="text-sm text-gray-800">{selectedBin.currentFill || 0}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">New Fill Level</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Select fill level percentage (0-100%)
                  </label>
                  <input
                    type="number"
                    value={fillLevel}
                    onChange={(e) => setFillLevel(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    placeholder="Enter fill level (0-100)"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                {/* Visual Fill Level Slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Current Selection: {fillLevel}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${fillLevel}%`,
                          backgroundColor: getFillLevelColor(fillLevel)
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-bold min-w-[40px] ${fillLevel < 50 ? 'text-green-600' : fillLevel < 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {fillLevel}%
                    </span>
                  </div>
                </div>

                {/* Quick Fill Level Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[0, 25, 50, 75, 100].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFillLevel(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        fillLevel === level
                          ? 'text-white shadow-md'
                          : 'border-2 hover:bg-opacity-10'
                      }`}
                      style={{
                        backgroundColor: fillLevel === level ? getFillLevelColor(level) : 'transparent',
                        borderColor: getFillLevelColor(level),
                        color: fillLevel === level ? 'white' : getFillLevelColor(level),
                      }}
                    >
                      {level}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Fill Level Status */}
              <div 
                className="p-4 rounded-lg border-2"
                style={{
                  backgroundColor: getFillLevelColor(fillLevel) + '10',
                  borderColor: getFillLevelColor(fillLevel) + '30'
                }}
              >
                <p className={`text-sm font-semibold ${fillLevel < 50 ? 'text-green-600' : fillLevel < 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {fillLevel < 50 ? '🟢 Bin is not full - Good condition' : 
                   fillLevel < 80 ? '🟡 Bin is getting full - Consider collection soon' : 
                   '🔴 Bin is full - Collection needed urgently'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex justify-center space-x-4">
              <button
                onClick={handleCloseFillLevelModal}
                disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateFillLevel}
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <MdEdit className="text-xl" />
                    <span>Update Fill Level</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Fill Level Modal */}
      {openBulkFillLevelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Set Fill Level for All Bins
              </h2>
              <p className="text-gray-600 text-center mt-2">
                This will update the fill level for all {bins.length} bins
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Fill Level for All Bins</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Select fill level percentage (0-100%)
                  </label>
                  <input
                    type="number"
                    value={bulkFillLevel}
                    onChange={(e) => setBulkFillLevel(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    placeholder="Enter fill level (0-100)"
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                {/* Visual Fill Level Slider */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Current Selection: {bulkFillLevel}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${bulkFillLevel}%`,
                          backgroundColor: getFillLevelColor(bulkFillLevel)
                        }}
                      ></div>
                    </div>
                    <span className={`text-sm font-bold min-w-[40px] ${bulkFillLevel < 50 ? 'text-green-600' : bulkFillLevel < 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {bulkFillLevel}%
                    </span>
                  </div>
                </div>

                {/* Quick Fill Level Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {[0, 25, 50, 75, 100].map((level) => (
                    <button
                      key={level}
                      onClick={() => setBulkFillLevel(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        bulkFillLevel === level
                          ? 'text-white shadow-md'
                          : 'border-2 hover:bg-opacity-10'
                      }`}
                      style={{
                        backgroundColor: bulkFillLevel === level ? getFillLevelColor(level) : 'transparent',
                        borderColor: getFillLevelColor(level),
                        color: bulkFillLevel === level ? 'white' : getFillLevelColor(level),
                      }}
                    >
                      {level}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Bin List Preview */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Bins to be updated:</h4>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {bins.map((bin, index) => (
                    <div key={bin._id || bin.id || index} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">{bin.binId}</span>
                      <span className="text-sm text-gray-500">{getBinTypeLabel(bin.binType)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fill Level Status */}
              <div 
                className="p-4 rounded-lg border-2"
                style={{
                  backgroundColor: getFillLevelColor(bulkFillLevel) + '10',
                  borderColor: getFillLevelColor(bulkFillLevel) + '30'
                }}
              >
                <p className={`text-sm font-semibold ${bulkFillLevel < 50 ? 'text-green-600' : bulkFillLevel < 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {bulkFillLevel < 50 ? '🟢 All bins will be set to not full - Good condition' : 
                   bulkFillLevel < 80 ? '🟡 All bins will be set to getting full - Consider collection soon' : 
                   '🔴 All bins will be set to full - Collection needed urgently'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex justify-center space-x-4">
              <button
                onClick={handleCloseBulkFillLevelModal}
                disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkUpdateFillLevel}
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating All Bins...</span>
                  </>
                ) : (
                  <>
                    <MdEdit className="text-xl" />
                    <span>Update All Bins</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {openDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 text-center">
                Delete Bin
              </h2>
              <p className="text-gray-600 text-center mt-2">
                Are you sure you want to delete this bin? This action cannot be undone.
              </p>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedBin && (
                <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-200">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">Bin Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-red-600">Bin ID:</span>
                      <span className="text-sm text-red-800 font-semibold">{selectedBin.binId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-red-600">Type:</span>
                      <span className="text-sm text-red-800">{getBinTypeLabel(selectedBin.binType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-red-600">Location:</span>
                      <span className="text-sm text-red-800">{selectedBin.address || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <MdWarning className="text-yellow-600 text-xl mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">Warning</h4>
                    <p className="text-sm text-yellow-700">
                      Deleting this bin will permanently remove all associated data including:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 list-disc list-inside space-y-1">
                      <li>Fill level history</li>
                      <li>Collection records</li>
                      <li>Sensor data</li>
                      <li>Location information</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex justify-center space-x-4">
              <button
                onClick={handleCloseDeleteModal}
                disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBin}
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <MdDelete className="text-xl" />
                    <span>Delete Bin</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <QRGenerator
        isOpen={openQRModal}
        onClose={handleCloseQRModal}
        binData={qrBinData}
        getBinTypeLabel={getBinTypeLabel}
      />

      {/* Snackbar */}
      {snackbar.open && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <div className={`p-4 rounded-lg shadow-lg border-l-4 ${
            snackbar.severity === 'success' 
              ? 'bg-green-50 border-green-500 text-green-800' 
              : snackbar.severity === 'error'
              ? 'bg-red-50 border-red-500 text-red-800'
              : 'bg-blue-50 border-blue-500 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  snackbar.severity === 'success' 
                    ? 'bg-green-500' 
                    : snackbar.severity === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}></div>
                <span className="text-sm font-medium">{snackbar.message}</span>
              </div>
              <button
                onClick={handleCloseSnackbar}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MyBins;