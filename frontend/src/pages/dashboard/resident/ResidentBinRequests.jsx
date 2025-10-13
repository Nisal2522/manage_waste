import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Fab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Info as InfoIcon,
  Warning as WarningIcon
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

  // Form state
  const [formData, setFormData] = useState({
    selectedBins: [], // Array of {binType, quantity, capacity} objects
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

  // Load requests on component mount
  useEffect(() => {
    loadRequests();
  }, []);

  // Auto-populate form with user data when user is available
  useEffect(() => {
    if (user && !openDialog) {
      setFormData(prevFormData => ({
        ...prevFormData,
        contactPhone: user?.phone || user?.contactPhone || prevFormData.contactPhone,
        contactEmail: user?.email || user?.contactEmail || prevFormData.contactEmail,
        address: user?.address?.full || user?.address?.street || user?.address || prevFormData.address
      }));
    }
  }, [user, openDialog]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      if (!user?.id) {
        showSnackbar('User not found', 'error');
        return;
      }
      
      const response = await getBinRequestsByUser(user.id);
      setRequests(response.data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      // Fallback to mock data if API is not available
      const mockRequests = [
        {
          id: 1,
          selectedBins: [
            { binType: 'general', quantity: 2, capacity: '120L' }
          ],
          specialInstructions: 'Please place near the gate',
          contactPhone: '+94 77 123 4567',
          contactEmail: user?.email || 'user@example.com',
          address: '123 Main Street, Colombo 03',
          status: 'pending',
          requestDate: '2024-01-10',
          adminNotes: ''
        }
      ];
      setRequests(mockRequests);
      showSnackbar('Using offline data - API not available', 'warning');
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
        selectedBins: request.selectedBins || [{ 
          binType: request.binType, 
          quantity: request.quantity,
          capacity: request.capacity || '120L'
        }],
        specialInstructions: request.specialInstructions,
        contactPhone: request.contactPhone,
        contactEmail: request.contactEmail,
        address: request.address
      });
    } else {
      setEditingRequest(null);
      setFormData({
        selectedBins: [],
        specialInstructions: '',
        contactPhone: user?.phone || user?.contactPhone || '',
        contactEmail: user?.email || user?.contactEmail || '',
        address: user?.address?.full || user?.address?.street || user?.address || ''
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
      setLoading(true);
      
      // Validate form
      if (formData.selectedBins.length === 0) {
        showSnackbar('Please select at least one bin type', 'error');
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

      // Prepare request data for API
      const requestData = {
        selectedBins: formData.selectedBins,
        specialInstructions: formData.specialInstructions,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        address: formData.address,
        userId: user.id
      };

      if (editingRequest) {
        // Update existing request
        const requestId = editingRequest.id || editingRequest._id;
        if (!requestId) {
          throw new Error('Request ID not found');
        }
        const response = await updateBinRequest(requestId, requestData);
        setRequests(requests.map(req => (req.id || req._id) === requestId ? response.data : req));
        showSnackbar('Request updated successfully', 'success');
      } else {
        // Create new request
        const response = await createBinRequest(requestData);
        setRequests([response.data, ...requests]);
        showSnackbar('Request submitted successfully', 'success');
      }

      handleCloseDialog();
    } catch (error) {
      console.error('Error submitting request:', error);
      showSnackbar('Error submitting request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        setLoading(true);
        await deleteBinRequest(requestId);
        setRequests(requests.filter(req => (req.id || req._id) !== requestId));
        showSnackbar('Request deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting request:', error);
        showSnackbar('Error deleting request', 'error');
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
          
          {requests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#6b7280', mb: 2 }}>
                No requests found
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af', mb: 3 }}>
                Submit your first bin request to get started
              </Typography>
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
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: '#f8fafc' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Bin Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Quantity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Preferred Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Request Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((request, index) => (
                    <TableRow key={request.id || request._id || index} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, component: 'div' }}>
                          {request.selectedBins ? 
                            request.selectedBins.map(bin => getBinTypeLabel(bin.binType)).join(', ') :
                            getBinTypeLabel(request.binType)
                          }
                        </Typography>
                        {request.specialInstructions && (
                          <Typography variant="caption" sx={{ color: '#6b7280', component: 'div' }}>
                            {request.specialInstructions}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" component="div">
                          {request.selectedBins ? 
                            request.selectedBins.reduce((total, bin) => total + bin.quantity, 0) :
                            request.quantity
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" component="div">
                          {request.requestDate ? 
                            new Date(request.requestDate).toLocaleDateString() :
                            'N/A'
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(request.status)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" component="div">
                          {new Date(request.requestDate).toLocaleDateString()}
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
                                  onClick={() => handleDeleteRequest(request.id || request._id)}
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
          {editingRequest ? 'Edit Bin Request' : 'New Bin Request'}
        </DialogTitle>
        <DialogContent>
          {/* Progress Indicator */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: formData.selectedBins.length > 0 ? '#10b981' : '#e5e7eb',
                mr: 1 
              }} />
              <Typography variant="body2" sx={{ color: formData.selectedBins.length > 0 ? '#10b981' : '#6b7280' }}>
                Select Bin Types ({formData.selectedBins.length} selected)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: formData.selectedBins.length > 0 ? '#10b981' : '#e5e7eb',
                mr: 1 
              }} />
              <Typography variant="body2" sx={{ color: formData.selectedBins.length > 0 ? '#10b981' : '#6b7280' }}>
                Set Quantities
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: formData.address ? '#10b981' : '#e5e7eb',
                mr: 1 
              }} />
              <Typography variant="body2" sx={{ color: formData.address ? '#10b981' : '#6b7280' }}>
                Contact & Address
              </Typography>
            </Box>
          </Box>

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
                            // Remove from selection
                            setFormData({
                              ...formData,
                              selectedBins: formData.selectedBins.filter(bin => bin.binType !== type.value)
                            });
                          } else {
                            // Add to selection with default quantity 1 and default capacity
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
                      <Grid item xs={12} sm={6} md={4} key={selectedBin.binType}>
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
                                   label="Qty"
                                   type="number"
                                   value={selectedBin.quantity}
                                   onChange={(e) => {
                                     const newSelectedBins = [...formData.selectedBins];
                                     newSelectedBins[index].quantity = parseInt(e.target.value) || 1;
                                     setFormData({ ...formData, selectedBins: newSelectedBins });
                                   }}
                                   inputProps={{ min: 1, max: 10 }}
                                   size="small"
                                   helperText="Max 10"
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
                                   helperText="10-500L"
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
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={handleInputChange('contactPhone')}
                placeholder="+94 77 123 4567"
                helperText={user?.phone ? "Phone fetched from your profile" : "Enter your contact phone number"}
                InputProps={{
                  startAdornment: user?.phone ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    </Box>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange('contactEmail')}
                helperText={user?.email ? "Email fetched from your profile" : "Enter your contact email"}
                InputProps={{
                  startAdornment: user?.email ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    </Box>
                  ) : null
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                multiline
                rows={2}
                required
                helperText={user?.address ? "Address fetched from your profile" : "Please enter your delivery address"}
                InputProps={{
                  startAdornment: user?.address ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                      <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                    </Box>
                  ) : null
                }}
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
                helperText="Optional: Provide specific placement instructions, access requirements, or special handling needs"
              />
            </Grid>

            {/* Information Card */}
            <Grid item xs={12}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '1px solid #0ea5e9',
                borderRadius: 2
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <InfoIcon sx={{ color: '#0ea5e9', mt: 0.5 }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#0c4a6e', mb: 1 }}>
                        Request Process Information
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Review Time: 1-2 business days"
                            primaryTypographyProps={{ variant: 'body2', color: '#0c4a6e', component: 'span' }}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Delivery: 3-5 business days after approval"
                            primaryTypographyProps={{ variant: 'body2', color: '#0c4a6e', component: 'span' }}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <CheckCircleIcon sx={{ color: '#10b981', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Free bins: General, Recyclable, Organic"
                            primaryTypographyProps={{ variant: 'body2', color: '#0c4a6e', component: 'span' }}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <WarningIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Paid bins: Hazardous (Rs. 500/month), Medical (Rs. 800/month)"
                            primaryTypographyProps={{ variant: 'body2', color: '#0c4a6e', component: 'span' }}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #10b981, #059669)',
              '&:hover': {
                background: 'linear-gradient(45deg, #059669, #047857)',
              }
            }}
          >
            {loading ? 'Saving...' : (editingRequest ? 'Update Request' : 'Submit Request')}
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
