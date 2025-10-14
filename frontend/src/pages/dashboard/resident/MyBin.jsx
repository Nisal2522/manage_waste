import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  LocationOn,
  Thermostat,
  Opacity
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getBinRequestsByUser, createBin, getBinsByUser } from '../../../utils/api.jsx';

const MyBins = () => {
  const { user } = useAuth();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [requests, setRequests] = useState([]);
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdBinsFromRequests, setCreatedBinsFromRequests] = useState(new Set());

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

  // Load approved requests and existing bins
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      loadApprovedRequests();
      loadUserBins();
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

  const handleOpenCreateModal = (request, binType, requestIndex, binIndex, quantityIndex) => {
    setSelectedRequest({ request, binType, requestIndex, binIndex, quantityIndex });
    // Pre-fill form with request data
    setBinFormData({
      binId: `BIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      owner: user?.name || '',
      deviceType: 'QR Code',
      deviceId: `QR-${Date.now()}`,
      binType: binType || 'General Waste',
      capacity: getCapacityFromBinType(binType),
      longitude: '79.8612',
      latitude: '6.9271',
      address: request.address || ''
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
    setBinFormData({
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
        temperature: Math.floor(Math.random() * 10) + 20, // Random temp between 20-30°C
        humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80%
        lastCollection: new Date().toISOString(),
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
        <Grid item xs={12} sm={6} md={4} key={`bin-${bin._id || bin.id || index}`}>
          <BinCard bin={bin} />
        </Grid>
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
                <Grid item xs={12} sm={6} md={4} key={`request-${creationKey}`}>
                  <CreateBinCard 
                    request={request}
                    binType={binType}
                    onCreate={() => handleOpenCreateModal(request, binType, requestIndex, binIndex, quantityIndex)}
                  />
                </Grid>
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

    return (
      <Card sx={{ 
        border: '1px solid #e5e7eb',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Bin ID and Type */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                {bin.binId}
              </Typography>
              <Chip 
                label={getBinTypeLabel(bin.binType)} 
                size="small"
                sx={{ 
                  backgroundColor: getBinTypeColor(bin.binType),
                  color: 'white',
                  fontWeight: 600,
                  mt: 0.5
                }}
              />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: getFillLevelColor(fillLevel) }}>
              {fillLevel}% Full
            </Typography>
          </Box>

          {/* Fill Level */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#6b7280' }}>
              Fill Level
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={fillLevel} 
                sx={{ 
                  flexGrow: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#f3f4f6',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getFillLevelColor(fillLevel),
                    borderRadius: 4
                  }
                }}
              />
              <Typography variant="body2" sx={{ fontWeight: 700, color: getFillLevelColor(fillLevel), minWidth: 40 }}>
                {fillLevel}%
              </Typography>
            </Box>
          </Box>

          {/* Capacity */}
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#6b7280' }}>
            Capacity:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 3, color: '#1f2937' }}>
            {currentFill} / {capacity} liters
          </Typography>

          {/* Temperature and Humidity */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Thermostat sx={{ color: '#ef4444', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {bin.temperature || 26}°C
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Opacity sx={{ color: '#3b82f6', fontSize: 20 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {bin.humidity || 70}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* Address */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3 }}>
            <LocationOn sx={{ color: '#6b7280', fontSize: 20, mt: 0.25 }} />
            <Typography variant="body2" sx={{ color: '#6b7280', lineHeight: 1.4 }}>
              {bin.address || '234/D, Siriniwasa Mawatha, Mulleriyawa North, Mulleriyawa New Town'}
            </Typography>
          </Box>

          {/* Collection Info */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#6b7280' }}>
                Last Collection:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1f2937' }}>
                {bin.lastCollection ? new Date(bin.lastCollection).toLocaleDateString() : 'Never'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#6b7280' }}>
                Next Collection:
              </Typography>
              <Typography variant="body2" sx={{ color: '#1f2937' }}>
                {bin.nextCollection ? new Date(bin.nextCollection).toLocaleDateString() : '10/12/2025'}
              </Typography>
            </Grid>
          </Grid>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              size="small"
              sx={{ 
                flex: 1,
                borderColor: '#10b981',
                color: '#10b981',
                '&:hover': {
                  borderColor: '#059669',
                  backgroundColor: 'rgba(16, 185, 129, 0.04)'
                }
              }}
            >
              Request Collection
            </Button>
            <Button 
              variant="contained" 
              size="small"
              sx={{ 
                flex: 1,
                backgroundColor: '#10b981',
                '&:hover': {
                  backgroundColor: '#059669'
                }
              }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Create Bin Card Component for approved requests
  const CreateBinCard = ({ request, binType, onCreate }) => {
    return (
      <Card sx={{ 
        border: '2px dashed #d1d5db',
        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        borderRadius: 2,
        boxShadow: 'none'
      }}>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <CheckCircleIcon sx={{ color: '#10b981', fontSize: 48, mb: 2 }} />
          
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
            Ready to Create
          </Typography>
          
          <Chip 
            label={binType} 
            size="small"
            sx={{ 
              backgroundColor: getBinTypeColor(binType),
              color: 'white',
              fontWeight: 600,
              mb: 2
            }}
          />
          
          <Typography variant="body2" sx={{ color: '#6b7280', mb: 3 }}>
            Your bin request has been approved. Click below to create your waste bin.
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
            sx={{
              background: 'linear-gradient(45deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669, #047857)',
              }
            }}
          >
            Create Bin
          </Button>
        </CardContent>
      </Card>
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
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
            My Waste Bins
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Monitor and manage your waste bins
          </Typography>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Total Bins
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#1f2937' }}>
          {bins.length + pendingCreationCount}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6b7280' }}>
          {bins.length} active bins • {pendingCreationCount} pending creation
        </Typography>
      </Box>

      {/* Bins Grid */}
      <Grid container spacing={3}>
        {getBinCards()}
      </Grid>

      {/* Create Bin Modal */}
      <Dialog open={openCreateModal} onClose={handleCloseCreateModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600, textAlign: 'center' }}>
            Create New Waste Bin
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {/* Bin ID */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
              Bin ID
            </Typography>
            <TextField
              fullWidth
              value={binFormData.binId}
              onChange={handleBinFormChange('binId')}
              placeholder="e.g., BIN-001"
              size="small"
              sx={{ mb: 3 }}
            />

            {/* Owner */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
              Owner
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel>Select Owner</InputLabel>
              <Select
                value={binFormData.owner}
                label="Select Owner"
                onChange={handleBinFormChange('owner')}
              >
                <MenuItem value={user?.name || ''}>{user?.name || 'Current User'}</MenuItem>
              </Select>
            </FormControl>

            {/* Device Type */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
              Device Type
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel>Device Type</InputLabel>
              <Select
                value={binFormData.deviceType}
                label="Device Type"
                onChange={handleBinFormChange('deviceType')}
              >
                <MenuItem value="QR Code">QR Code</MenuItem>
                <MenuItem value="RFID">RFID</MenuItem>
                <MenuItem value="NFC">NFC</MenuItem>
              </Select>
            </FormControl>

            {/* Device ID */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
              Device ID
            </Typography>
            <TextField
              fullWidth
              value={binFormData.deviceId}
              onChange={handleBinFormChange('deviceId')}
              placeholder="e.g., RFID-001"
              size="small"
              sx={{ mb: 3 }}
            />

            {/* Bin Type */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
              Bin Type
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 3 }}>
              <InputLabel>Bin Type</InputLabel>
              <Select
                value={binFormData.binType}
                label="Bin Type"
                onChange={handleBinFormChange('binType')}
              >
                <MenuItem value="General Waste">General Waste</MenuItem>
                <MenuItem value="Recyclable Waste">Recyclable Waste</MenuItem>
                <MenuItem value="Organic Waste">Organic Waste</MenuItem>
                <MenuItem value="Hazardous Waste">Hazardous Waste</MenuItem>
                <MenuItem value="Medical Waste">Medical Waste</MenuItem>
              </Select>
            </FormControl>

            {/* Capacity */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
              Capacity
            </Typography>
            <TextField
              fullWidth
              type="number"
              value={binFormData.capacity}
              onChange={handleBinFormChange('capacity')}
              placeholder="120"
              size="small"
              sx={{ mb: 3 }}
              inputProps={{ min: 1 }}
            />

            {/* Location Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: '#1f2937' }}>
                Location
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#6b7280' }}>
                    Longitude
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={binFormData.longitude}
                    onChange={handleBinFormChange('longitude')}
                    placeholder="79.8612"
                    size="small"
                    inputProps={{ step: "0.0001" }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1, color: '#6b7280' }}>
                    Latitude
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={binFormData.latitude}
                    onChange={handleBinFormChange('latitude')}
                    placeholder="6.9271"
                    size="small"
                    inputProps={{ step: "0.0001" }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Address */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#1f2937' }}>
              Address
            </Typography>
            <TextField
              fullWidth
              value={binFormData.address}
              onChange={handleBinFormChange('address')}
              placeholder="Street address, City, District"
              multiline
              rows={2}
              size="small"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
          <Button 
            onClick={handleCloseCreateModal} 
            color="inherit" 
            disabled={submitting}
            sx={{ 
              mr: 2,
              minWidth: 100
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateBin}
            variant="contained"
            disabled={submitting}
            sx={{
              background: 'linear-gradient(45deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669, #047857)',
              },
              minWidth: 120
            }}
          >
            {submitting ? <CircularProgress size={24} /> : 'Create Bin'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyBins;