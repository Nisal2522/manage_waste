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
  Email as EmailIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext.jsx';

const ResidentBinRequests = () => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    binType: '',
    quantity: 1,
    preferredDate: '',
    specialInstructions: '',
    contactPhone: '',
    contactEmail: '',
    address: ''
  });

  // Bin types available
  const binTypes = [
    { value: 'general', label: 'General Waste Bin', description: 'For household waste' },
    { value: 'recyclable', label: 'Recyclable Bin', description: 'For paper, plastic, metal' },
    { value: 'organic', label: 'Organic Bin', description: 'For food scraps, garden waste' },
    { value: 'hazardous', label: 'Hazardous Waste Bin', description: 'For batteries, chemicals' },
    { value: 'medical', label: 'Medical Waste Bin', description: 'For medical waste' }
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

  const loadRequests = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      const mockRequests = [
        {
          id: 1,
          binType: 'general',
          quantity: 2,
          preferredDate: '2024-01-15',
          specialInstructions: 'Please place near the gate',
          contactPhone: '+94 77 123 4567',
          contactEmail: user?.email || 'user@example.com',
          address: '123 Main Street, Colombo 03',
          status: 'pending',
          requestDate: '2024-01-10',
          adminNotes: ''
        },
        {
          id: 2,
          binType: 'recyclable',
          quantity: 1,
          preferredDate: '2024-01-20',
          specialInstructions: 'For paper and plastic recycling',
          contactPhone: '+94 77 123 4567',
          contactEmail: user?.email || 'user@example.com',
          address: '123 Main Street, Colombo 03',
          status: 'approved',
          requestDate: '2024-01-08',
          adminNotes: 'Approved for delivery on requested date'
        }
      ];
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
      showSnackbar('Error loading requests', 'error');
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
        binType: request.binType,
        quantity: request.quantity,
        preferredDate: request.preferredDate,
        specialInstructions: request.specialInstructions,
        contactPhone: request.contactPhone,
        contactEmail: request.contactEmail,
        address: request.address
      });
    } else {
      setEditingRequest(null);
      setFormData({
        binType: '',
        quantity: 1,
        preferredDate: '',
        specialInstructions: '',
        contactPhone: user?.phone || '',
        contactEmail: user?.email || '',
        address: user?.address?.full || ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRequest(null);
    setFormData({
      binType: '',
      quantity: 1,
      preferredDate: '',
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
      if (!formData.binType || !formData.preferredDate) {
        showSnackbar('Please fill in all required fields', 'error');
        return;
      }

      // Simulate API call
      const newRequest = {
        id: editingRequest ? editingRequest.id : Date.now(),
        ...formData,
        status: 'pending',
        requestDate: new Date().toISOString().split('T')[0],
        adminNotes: ''
      };

      if (editingRequest) {
        // Update existing request
        setRequests(requests.map(req => req.id === editingRequest.id ? newRequest : req));
        showSnackbar('Request updated successfully', 'success');
      } else {
        // Add new request
        setRequests([newRequest, ...requests]);
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

  const handleDeleteRequest = (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setRequests(requests.filter(req => req.id !== requestId));
      showSnackbar('Request deleted successfully', 'success');
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
                  {requests.map((request) => (
                    <TableRow key={request.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {getBinTypeLabel(request.binType)}
                          </Typography>
                          {request.specialInstructions && (
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              {request.specialInstructions}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(request.preferredDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {getStatusChip(request.status)}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
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
                                  onClick={() => handleDeleteRequest(request.id)}
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
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingRequest ? 'Edit Bin Request' : 'New Bin Request'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Bin Type</InputLabel>
                <Select
                  value={formData.binType}
                  onChange={handleInputChange('binType')}
                  label="Bin Type"
                >
                  {binTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {type.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6b7280' }}>
                          {type.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange('quantity')}
                inputProps={{ min: 1, max: 10 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preferred Delivery Date"
                type="date"
                value={formData.preferredDate}
                onChange={handleInputChange('preferredDate')}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.contactPhone}
                onChange={handleInputChange('contactPhone')}
                placeholder="+94 77 123 4567"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange('contactEmail')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                multiline
                rows={2}
                required
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
