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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext.jsx';
import { 
  getBinRequestsByUser, 
  createBinRequest, 
  updateBinRequest, 
  deleteBinRequest 
} from '../../../utils/api.jsx';

const ResidentBinRequests = () => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    selectedBins: [],
    specialInstructions: '',
    contactPhone: '',
    contactEmail: '',
    address: ''
  });

  // Bin types available with enhanced information
  const binTypes = [
    { 
      value: 'general', 
      label: 'General Waste Bin', 
      description: 'For household waste',
      icon: '🗑️',
      color: '#6b7280',
      capacity: '120L'
    },
    { 
      value: 'recyclable', 
      label: 'Recyclable Bin', 
      description: 'For paper, plastic, metal',
      icon: '♻️',
      color: '#3b82f6',
      capacity: '80L'
    },
    { 
      value: 'organic', 
      label: 'Organic Bin', 
      description: 'For food scraps, garden waste',
      icon: '🌱',
      color: '#10b981',
      capacity: '60L'
    },
    { 
      value: 'hazardous', 
      label: 'Hazardous Waste Bin', 
      description: 'For batteries, chemicals',
      icon: '⚠️',
      color: '#ef4444',
      capacity: '40L'
    },
    { 
      value: 'medical', 
      label: 'Medical Waste Bin', 
      description: 'For medical waste',
      icon: '🏥',
      color: '#8b5cf6',
      capacity: '30L'
    }
  ];

  // Status options
  const statusOptions = {
    pending: { label: 'Pending', color: 'warning', icon: <PendingIcon /> },
    approved: { label: 'Approved', color: 'success', icon: <CheckCircleIcon /> },
    rejected: { label: 'Rejected', color: 'error', icon: <CancelIcon /> },
    completed: { label: 'Completed', color: 'info', icon: <CheckCircleIcon /> }
  };

  // Get user ID - handle both id and _id
  const getUserId = () => {
    return user?.id || user?._id;
  };

  // Debug user object
  // useEffect(() => {
  //   console.log('👤 User object from AuthContext:', user);
  //   console.log('🆔 User ID:', getUserId());
  //   console.log('🔑 Token from localStorage:', localStorage.getItem('token'));
  // }, [user]);

  // Load requests on component mount and when user changes
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      loadRequests();
    }
  }, [user]);

  // Auto-populate form with user data when user is available
  useEffect(() => {
    const userId = getUserId();
    if (user && !openDialog) {
      setFormData(prevFormData => ({
        ...prevFormData,
        contactPhone: user?.phone || user?.contactPhone || prevFormData.contactPhone,
        contactEmail: user?.email || user?.contactEmail || prevFormData.contactEmail,
        address: user?.address?.street ? `${user.address.street}, ${user.address.city}, ${user.address.district}` : prevFormData.address
      }));
    }
  }, [user, openDialog]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      if (!userId) {
        showSnackbar('User not found. Please log in again.', 'error');
        return;
      }
      
      console.log('🔍 Loading requests for user ID:', userId);
      const response = await getBinRequestsByUser(userId);
      console.log('📦 API Response:', response);
      
      if (response && response.success) {
        setRequests(response.data || []);
        console.log('✅ Requests loaded successfully:', response.data);
      } else {
        const errorMessage = response?.message || 'Failed to load requests';
        console.error('❌ Error loading requests:', errorMessage);
        showSnackbar(errorMessage, 'error');
        setRequests([]);
      }
    } catch (error) {
      console.error('💥 Error loading requests:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show more specific error message
      let errorMessage = 'Error loading requests. Please check your connection and try again.';
      if (error.response?.status === 403) {
        errorMessage = 'Access denied. You are not authorized to view these requests.';
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please log in again.';
      }
      
      showSnackbar(errorMessage, 'error');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (request = null) => {
    if (request) {
      setEditingRequest(request);
      setFormData({
        selectedBins: request.selectedBins || [],
        specialInstructions: request.specialInstructions || '',
        contactPhone: request.contactPhone || '',
        contactEmail: request.contactEmail || '',
        address: request.address || ''
      });
    } else {
      setEditingRequest(null);
      const userId = getUserId();
      setFormData({
        selectedBins: [],
        specialInstructions: '',
        contactPhone: user?.phone || user?.contactPhone || '',
        contactEmail: user?.email || user?.contactEmail || '',
        address: user?.address?.street ? `${user.address.street}, ${user.address.city}, ${user.address.district}` : ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRequest(null);
    setFormData({
      selectedBins: [],
      specialInstructions: '',
      contactPhone: '',
      contactEmail: '',
      address: ''
    });
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Validate form
      if (formData.selectedBins.length === 0) {
        showSnackbar('Please select at least one bin type', 'error');
        return;
      }

      // Validate required fields
      if (!formData.contactPhone || !formData.contactEmail || !formData.address) {
        showSnackbar('Please fill in all required contact information', 'error');
        return;
      }

      // Validate quantities and capacities
      const hasInvalidQuantity = formData.selectedBins.some(bin => bin.quantity < 1 || bin.quantity > 10);
      if (hasInvalidQuantity) {
        showSnackbar('Please enter valid quantities (1-10) for all selected bins', 'error');
        return;
      }

      const hasInvalidCapacity = formData.selectedBins.some(bin => {
        const capacity = parseInt(bin.capacity?.replace('L', '') || '0');
        return capacity < 10 || capacity > 500;
      });
      if (hasInvalidCapacity) {
        showSnackbar('Please enter valid capacities (10-500L) for all selected bins', 'error');
        return;
      }

      // Prepare request data for API - REMOVE userId from request data
      // The backend will use req.user.id from the authenticated token
      const requestData = {
        selectedBins: formData.selectedBins,
        specialInstructions: formData.specialInstructions,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        address: formData.address
        // userId is removed - backend will get it from auth token
      };

      console.log('🚀 Submitting request data:', requestData);

      let response;
      if (editingRequest) {
        // Update existing request
        const requestId = editingRequest._id || editingRequest.id;
        if (!requestId) {
          throw new Error('Request ID not found');
        }
        response = await updateBinRequest(requestId, requestData);
        console.log('📝 Update response:', response);
        
        if (response && response.success) {
          setRequests(requests.map(req => (req._id || req.id) === requestId ? response.data : req));
          showSnackbar('Request updated successfully', 'success');
        } else {
          throw new Error(response?.message || 'Failed to update request');
        }
      } else {
        // Create new request
        response = await createBinRequest(requestData);
        console.log('🆕 Create response:', response);
        
        if (response && response.success) {
          setRequests([response.data, ...requests]);
          showSnackbar('Request submitted successfully', 'success');
        } else {
          throw new Error(response?.message || 'Failed to create request');
        }
      }

      handleCloseDialog();
    } catch (error) {
      console.error('💥 Error submitting request:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show more specific error message
      let errorMessage = error.message || 'Error submitting request. Please try again.';
      if (error.response?.status === 403) {
        errorMessage = 'Access denied. You are not authorized to perform this action.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request data. Please check your inputs.';
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        setLoading(true);
        const response = await deleteBinRequest(requestId);
        console.log('🗑️ Delete response:', response);
        
        if (response && response.success) {
          setRequests(requests.filter(req => (req._id || req.id) !== requestId));
          showSnackbar('Request deleted successfully', 'success');
        } else {
          throw new Error(response?.message || 'Failed to delete request');
        }
      } catch (error) {
        console.error('💥 Error deleting request:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        let errorMessage = error.message || 'Error deleting request';
        if (error.response?.status === 403) {
          errorMessage = 'Access denied. You are not authorized to delete this request.';
        } else if (error.response?.status === 400) {
          errorMessage = error.response.data?.message || 'Cannot delete request that is not pending.';
        }
        
        showSnackbar(errorMessage, 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const getBinTypeLabel = (binType) => {
    const type = binTypes.find(t => t.value === binType);
    return type ? type.label : binType;
  };

  const getStatusChip = (status) => {
    const statusInfo = statusOptions[status] || statusOptions.pending;
    return (
      <Chip
        icon={statusInfo.icon}
        label={statusInfo.label}
        color={statusInfo.color}
        size="small"
        variant="outlined"
      />
    );
  };

  // Get user ID for display
  const userId = getUserId();

  // Debug information
  // console.log('🔍 Current state:', {
  //   userId,
  //   userObject: user,
  //   requestsCount: requests.length,
  //   loading,
  //   submitting,
  //   openDialog
  // });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>
            Bin Requests
          </Typography>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Request new waste bins for your property
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={!userId}
          sx={{
            background: 'linear-gradient(45deg, #10b981, #059669)',
            '&:hover': {
              background: 'linear-gradient(45deg, #059669, #047857)',
            },
            px: 3,
            py: 1.5,
            borderRadius: 2
          }}
        >
          New Request
        </Button>
      </Box>

      {/* Debug Info - Remove in production */}
      {/* <Card sx={{ mb: 2, bgcolor: '#fff3cd', border: '1px solid #ffeaa7' }}>
        <CardContent>
          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
            🔍 Debug: User ID: {userId || 'Not found'} | Role: {user?.role || 'Unknown'} | Requests: {requests.length} | Loading: {loading.toString()}
          </Typography>
          {!userId && (
            <Typography variant="caption" sx={{ color: '#dc3545', display: 'block', mt: 1 }}>
              ⚠️ User ID not found. Please check authentication.
            </Typography>
          )}
        </CardContent>
      </Card> */}

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                {requests.length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Total Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                {requests.filter(r => r.status === 'pending').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                {requests.filter(r => r.status === 'approved').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Approved
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
                {requests.filter(r => r.status === 'completed').length}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Requests Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Your Bin Requests
          </Typography>
          
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#6b7280' }}>
                Loading your requests...
              </Typography>
            </Box>
          ) : requests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#6b7280', mb: 2 }}>
                No requests found
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
                {userId ? 'Submit your first bin request to get started' : 'Please log in to view your requests'}
              </Typography>
              {userId && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #059669, #047857)',
                    }
                  }}
                >
                  Create Request
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Bin Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Request Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request, index) => (
                    <TableRow key={request._id || request.id || index} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, component: 'div' }}>
                          {request.selectedBins && request.selectedBins.length > 0 ? 
                            request.selectedBins.map((bin, idx) => (
                              <Box key={idx} sx={{ mb: 0.5 }}>
                                {getBinTypeLabel(bin.binType)} ({bin.quantity}x {bin.capacity})
                              </Box>
                            )) :
                            'No bins selected'
                          }
                        </Typography>
                        {request.specialInstructions && (
                          <Typography variant="caption" sx={{ color: '#6b7280', component: 'div', mt: 0.5 }}>
                            📝 {request.specialInstructions}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" component="div">
                          {request.selectedBins ? 
                            request.selectedBins.reduce((total, bin) => total + bin.quantity, 0) :
                            1
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(request.status)}
                        {request.adminNotes && (
                          <Tooltip title={request.adminNotes}>
                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 0.5 }}>
                              💬 Admin Note
                            </Typography>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" component="div">
                          {request.createdAt ? 
                            new Date(request.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) :
                            'N/A'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(request)}
                              sx={{ color: '#3b82f6' }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          {request.status === 'pending' && (
                            <>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDialog(request)}
                                  sx={{ color: '#f59e0b' }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteRequest(request._id || request.id)}
                                  sx={{ color: '#ef4444' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Request Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingRequest ? 'Edit Bin Request' : 'New Bin Request'}
            {!userId && (
              <Chip label="Not logged in" color="error" size="small" />
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                Select Bin Types (You can select multiple)
              </Typography>
              <Grid container spacing={2}>
                {binTypes.map((type) => {
                  const isSelected = formData.selectedBins.some(bin => bin.binType === type.value);
                  return (
                    <Grid item xs={12} sm={6} md={4} key={type.value}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          border: isSelected ? `2px solid ${type.color}` : '1px solid #e5e7eb',
                          background: isSelected ? `${type.color}10` : 'white',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }
                        }}
                        onClick={() => {
                          if (isSelected) {
                            setFormData({
                              ...formData,
                              selectedBins: formData.selectedBins.filter(bin => bin.binType !== type.value)
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedBins: [...formData.selectedBins, { 
                                binType: type.value, 
                                quantity: 1, 
                                capacity: type.capacity 
                              }]
                            });
                          }
                        }}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 2 }}>
                          <Typography variant="h4" sx={{ mb: 1 }}>
                            {type.icon}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: type.color }}>
                            {type.label}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280', mb: 1 }}>
                            {type.description}
                          </Typography>
                          {isSelected && (
                            <Chip 
                              label="Selected" 
                              size="small" 
                              sx={{ 
                                background: type.color, 
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>

            {/* Quantity Selection for Selected Bins */}
            {formData.selectedBins.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#1f2937' }}>
                  Set Quantities for Selected Bins
                </Typography>
                <Grid container spacing={2}>
                  {formData.selectedBins.map((selectedBin, index) => {
                    const binType = binTypes.find(type => type.value === selectedBin.binType);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={`${selectedBin.binType}-${index}`}>
                        <Card sx={{ 
                          border: `1px solid ${binType.color}30`,
                          background: `${binType.color}05`
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Typography variant="h5" sx={{ mr: 1 }}>
                                {binType.icon}
                              </Typography>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: binType.color }}>
                                  {binType.label}
                                </Typography>
                              </Box>
                            </Box>
                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="Quantity"
                                  type="number"
                                  value={selectedBin.quantity}
                                  onChange={(e) => {
                                    const newSelectedBins = [...formData.selectedBins];
                                    newSelectedBins[index].quantity = parseInt(e.target.value) || 1;
                                    setFormData({ ...formData, selectedBins: newSelectedBins });
                                  }}
                                  inputProps={{ min: 1, max: 10 }}
                                  size="small"
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  fullWidth
                                  label="Capacity (L)"
                                  type="number"
                                  value={selectedBin.capacity?.replace('L', '') || ''}
                                  onChange={(e) => {
                                    const newSelectedBins = [...formData.selectedBins];
                                    newSelectedBins[index].capacity = `${e.target.value}L`;
                                    setFormData({ ...formData, selectedBins: newSelectedBins });
                                  }}
                                  inputProps={{ min: 10, max: 500 }}
                                  size="small"
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone *"
                value={formData.contactPhone}
                onChange={handleInputChange('contactPhone')}
                placeholder="+94 77 123 4567"
                required
                error={!formData.contactPhone}
                helperText={!formData.contactPhone ? "Contact phone is required" : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email *"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange('contactEmail')}
                required
                error={!formData.contactEmail}
                helperText={!formData.contactEmail ? "Contact email is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address *"
                value={formData.address}
                onChange={handleInputChange('address')}
                multiline
                rows={2}
                required
                error={!formData.address}
                helperText={!formData.address ? "Delivery address is required" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Special Instructions"
                value={formData.specialInstructions}
                onChange={handleInputChange('specialInstructions')}
                multiline
                rows={3}
                placeholder="Any special requirements or instructions for bin placement..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting || formData.selectedBins.length === 0 || !userId}
            sx={{
              background: 'linear-gradient(45deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669, #047857)',
              }
            }}
          >
            {submitting ? <CircularProgress size={24} /> : (editingRequest ? 'Update Request' : 'Submit Request')}
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

export default ResidentBinRequests;