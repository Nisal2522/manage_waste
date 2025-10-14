import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  RequestPage,
  Add,
  Edit,
  Visibility,
  CheckCircle,
  Refresh,
  FilterList,
  Search,
  Pending,
  LocationOn,
  Close,
  Save
} from '@mui/icons-material';

const AdminBinRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch bin requests from API
  const fetchBinRequests = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      
      const apiUrl = `http://localhost:5000/api/bin-requests?page=${page}&limit=10`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check the server configuration.');
        } else {
          throw new Error('Server returned an unexpected response. Please try again.');
        }
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        setRequests(data.data || []);
        setPagination(data.pagination || {
          current: 1,
          pages: 1,
          total: 0
        });
      } else {
        throw new Error(data.message || 'Failed to fetch bin requests');
      }
    } catch (err) {
      console.error('Error fetching bin requests:', err);
      setError(err.message);
      showSnackbar(err.message, 'error');
      
      // Set empty data on error
      setRequests([]);
      setPagination({
        current: 1,
        pages: 1,
        total: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Open detailed view modal in view mode
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setAdminNotes(request.adminNotes || '');
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Open modal in edit mode
  const handleEditRequest = (request) => {
    setSelectedRequest(request);
    setStatus(request.status);
    setAdminNotes(request.adminNotes || '');
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Switch to edit mode
  const handleSwitchToEdit = () => {
    setIsEditMode(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setIsEditMode(false);
    setStatus('');
    setAdminNotes('');
  };

  // Update request status using the correct endpoint
  const handleUpdateRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Use the correct status update endpoint
      const response = await fetch(`http://localhost:5000/api/bin-requests/${selectedRequest._id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: status,
          adminNotes: adminNotes
        })
      });

      // Check if response is HTML (error page)
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        throw new Error('Server returned an unexpected response');
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success) {
        showSnackbar('Request status updated successfully!', 'success');
        // Refresh the requests list
        fetchBinRequests();
        handleCloseModal();
      } else {
        throw new Error(data.message || 'Failed to update request status');
      }
    } catch (err) {
      console.error('Error updating request status:', err);
      showSnackbar(err.message, 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRefresh = () => {
    fetchBinRequests(pagination.current);
  };

  const handleRetryWithRealData = () => {
    setError('');
    fetchBinRequests();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getBinTypesSummary = (selectedBins) => {
    if (!selectedBins || selectedBins.length === 0) return 'No bins selected';
    
    const types = selectedBins.map(bin => 
      `${bin.quantity}x ${bin.binType} (${bin.capacity})`
    );
    return types.join(', ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetchBinRequests();
  }, []);

  if (loading && requests.length === 0) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        backgroundColor: '#f8fafc',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary">
          Loading bin requests...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 4, 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(45deg, #10b981, #059669)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1
              }}>
                Bin Requests
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and manage waste bin installation requests from residents.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  borderColor: '#10b981',
                  color: '#10b981',
                  '&:hover': {
                    borderColor: '#059669',
                    backgroundColor: 'rgba(16, 185, 129, 0.04)'
                  }
                }}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
              {error && (
                <Button 
                  variant="contained" 
                  onClick={handleRetryWithRealData}
                  sx={{ 
                    background: 'linear-gradient(45deg, #3b82f6, #2563eb)',
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none'
                  }}
                >
                  Retry
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetryWithRealData}>
                RETRY
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#10b981', mr: 2 }}>
                    <RequestPage />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {pagination.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Requests
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#f59e0b', mr: 2 }}>
                    <Pending />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {requests.filter(r => r.status === 'pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                      {requests.filter(r => r.status === 'approved').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Approved
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: '#ef4444', mr: 2 }}>
                    <RequestPage />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                      {requests.filter(r => r.status === 'rejected').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rejected
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Requests Table */}
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <CardHeader
            title={`Bin Requests (${pagination.total} total)`}
            subheader="Real data from database"
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton>
                  <Search />
                </IconButton>
                <IconButton>
                  <FilterList />
                </IconButton>
              </Box>
            }
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Request ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Resident</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Bin Types</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Request Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No bin requests found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request._id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          #{request._id?.slice(-6).toUpperCase() || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {request.userId?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.userId?.email || 'No email'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.contactPhone || 'No phone'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {request.contactEmail || 'No email'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ mr: 1, color: '#6b7280', fontSize: 16 }} />
                          <Typography variant="body2">
                            {request.address || 'No address'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={getBinTypesSummary(request.selectedBins)}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
                            {getBinTypesSummary(request.selectedBins)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(request.status)} 
                          size="small" 
                          color={getStatusColor(request.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {request.requestDate ? formatDate(request.requestDate) : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small"
                              onClick={() => handleViewDetails(request)}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Request">
                            <IconButton 
                              size="small"
                              onClick={() => handleEditRequest(request)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Detailed View/Edit Modal */}
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" component="h2">
                {isEditMode ? 'Edit Bin Request' : 'Bin Request Details'}
              </Typography>
              <IconButton onClick={handleCloseModal}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedRequest && (
              <Box sx={{ mt: 2 }}>
                {/* Request Information */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Resident Information
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Name" 
                          secondary={selectedRequest.userId?.name || 'Unknown User'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Email" 
                          secondary={selectedRequest.userId?.email || 'No email'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Contact Phone" 
                          secondary={selectedRequest.contactPhone || 'No phone'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Contact Email" 
                          secondary={selectedRequest.contactEmail || 'No email'}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Request Details
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="Request ID" 
                          secondary={`#${selectedRequest._id?.slice(-6).toUpperCase() || 'N/A'}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Request Date" 
                          secondary={formatDate(selectedRequest.requestDate)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="Current Status" 
                          secondary={
                            <Chip 
                              label={getStatusText(selectedRequest.status)} 
                              size="small" 
                              color={getStatusColor(selectedRequest.status)}
                            />
                          }
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Address
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn sx={{ mr: 1, color: '#6b7280' }} />
                      <Typography variant="body1">
                        {selectedRequest.address || 'No address'}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Selected Bins
                    </Typography>
                    <List dense>
                      {selectedRequest.selectedBins?.map((bin, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={`${bin.binType.charAt(0).toUpperCase() + bin.binType.slice(1)} Bin`}
                            secondary={`Quantity: ${bin.quantity} | Capacity: ${bin.capacity}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>

                  {selectedRequest.specialInstructions && (
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Special Instructions
                      </Typography>
                      <Typography variant="body1" sx={{ p: 1, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                        {selectedRequest.specialInstructions}
                      </Typography>
                    </Grid>
                  )}

                  {/* Admin Actions Section - Only show in edit mode */}
                  {isEditMode && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Admin Actions
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            select
                            fullWidth
                            label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            variant="outlined"
                            size="small"
                          >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="approved">Approved</MenuItem>
                            <MenuItem value="rejected">Rejected</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Admin Notes"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            variant="outlined"
                            placeholder="Add any notes or comments about this request..."
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: 'flex-end' }}>
            {!isEditMode ? (
              // View Mode Buttons
              <>
                <Button 
                  onClick={handleCloseModal}
                  variant="outlined"
                  sx={{ mr: 2 }}
                >
                  Close
                </Button>
                <Button 
                  onClick={handleSwitchToEdit}
                  variant="contained"
                  startIcon={<Edit />}
                >
                  Edit Request
                </Button>
              </>
            ) : (
              // Edit Mode Buttons
              <>
                <Button 
                  onClick={handleCloseModal}
                  variant="outlined"
                  sx={{ mr: 2 }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateRequest}
                  variant="contained"
                  startIcon={<Save />}
                  disabled={!status}
                >
                  Update Request
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminBinRequests;