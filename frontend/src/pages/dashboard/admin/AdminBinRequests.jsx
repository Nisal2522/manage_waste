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
  ListItemText,
  alpha,
  useTheme
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
  Save,
  Person,
  Email,
  Phone,
  CalendarToday
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

  const theme = useTheme();

  // Modern color scheme
  const colors = {
    primary: '#10b981',
    primaryLight: '#34d399',
    primaryDark: '#059669',
    secondary: '#3b82f6',
    warning: '#f59e0b',
    error: '#ef4444',
    success: '#10b981',
    background: '#f8fafc',
    surface: '#ffffff',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb'
  };

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${colors.background} 0%, ${alpha(colors.primary, 0.05)} 100%)`,
        flexDirection: 'column',
        gap: 3
      }}>
        <CircularProgress 
          size={60} 
          thickness={4}
          sx={{ color: colors.primary }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: colors.textPrimary,
            fontWeight: 500
          }}
        >
          Loading bin requests...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: `linear-gradient(135deg, ${colors.background} 0%, ${alpha(colors.primary, 0.05)} 100%)`,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4, 
            background: `linear-gradient(135deg, ${colors.surface} 0%, ${alpha(colors.primary, 0.02)} 100%)`,
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: `1px solid ${alpha(colors.border, 0.3)}`,
            boxShadow: `0 8px 32px ${alpha(colors.primary, 0.1)}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
            }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography 
                variant="h3" 
                component="h1" 
                sx={{ 
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  letterSpacing: '-0.02em'
                }}
              >
                Bin Requests
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: colors.textSecondary,
                  fontWeight: 400,
                  maxWidth: '600px',
                  lineHeight: 1.6
                }}
              >
                Efficiently manage and review waste bin installation requests from residents with real-time updates and comprehensive insights.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{ 
                  borderRadius: 3,
                  textTransform: 'none',
                  borderColor: colors.primary,
                  color: colors.primary,
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  '&:hover': {
                    borderColor: colors.primaryDark,
                    backgroundColor: alpha(colors.primary, 0.04),
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 12px ${alpha(colors.primary, 0.2)}`
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </Button>
              {error && (
                <Button 
                  variant="contained" 
                  onClick={handleRetryWithRealData}
                  sx={{ 
                    background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%)`,
                    color: 'white',
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    py: 1,
                    boxShadow: `0 4px 14px ${alpha(colors.secondary, 0.3)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 6px 20px ${alpha(colors.primary, 0.4)}`
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Retry Connection
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        {error && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 4,
              borderRadius: 3,
              border: `1px solid ${alpha(colors.warning, 0.3)}`,
              background: `linear-gradient(135deg, ${alpha(colors.warning, 0.05)} 0%, ${alpha(colors.warning, 0.1)} 100%)`,
              '& .MuiAlert-message': {
                fontWeight: 500
              }
            }}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={handleRetryWithRealData}
                sx={{ 
                  fontWeight: 600,
                  borderRadius: 2
                }}
              >
                RETRY
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { 
              label: 'Total Requests', 
              value: pagination.total, 
              color: colors.primary, 
              icon: <RequestPage /> 
            },
            { 
              label: 'Pending', 
              value: requests.filter(r => r.status === 'pending').length, 
              color: colors.warning, 
              icon: <Pending /> 
            },
            { 
              label: 'Approved', 
              value: requests.filter(r => r.status === 'approved').length, 
              color: colors.success, 
              icon: <CheckCircle /> 
            },
            { 
              label: 'Rejected', 
              value: requests.filter(r => r.status === 'rejected').length, 
              color: colors.error, 
              icon: <RequestPage /> 
            }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Card 
                sx={{ 
                  background: `linear-gradient(135deg, ${colors.surface} 0%, ${alpha(stat.color, 0.05)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: `1px solid ${alpha(colors.border, 0.2)}`,
                  boxShadow: `0 4px 20px ${alpha(stat.color, 0.1)}`,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 30px ${alpha(stat.color, 0.2)}`
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${stat.color}, ${alpha(stat.color, 0.7)})`,
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          fontWeight: 700, 
                          color: stat.color,
                          mb: 1,
                          lineHeight: 1
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: colors.textSecondary,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: alpha(stat.color, 0.1),
                        color: stat.color,
                        width: 60,
                        height: 60,
                        boxShadow: `0 4px 12px ${alpha(stat.color, 0.2)}`
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Requests Table */}
        <Card 
          sx={{ 
            background: `linear-gradient(135deg, ${colors.surface} 0%, ${alpha(colors.primary, 0.02)} 100%)`,
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: `1px solid ${alpha(colors.border, 0.2)}`,
            boxShadow: `0 8px 32px ${alpha(colors.primary, 0.08)}`,
            overflow: 'hidden'
          }}
        >
          <CardHeader
            title={
              <Typography variant="h5" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                Recent Bin Requests
              </Typography>
            }
            subheader={
              <Typography variant="body2" sx={{ color: colors.textSecondary, mt: 0.5 }}>
                {pagination.total} total requests • Real-time database synchronization
              </Typography>
            }
            action={
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Search requests">
                  <IconButton
                    sx={{
                      color: colors.textSecondary,
                      '&:hover': {
                        color: colors.primary,
                        backgroundColor: alpha(colors.primary, 0.1)
                      }
                    }}
                  >
                    <Search />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Filter requests">
                  <IconButton
                    sx={{
                      color: colors.textSecondary,
                      '&:hover': {
                        color: colors.primary,
                        backgroundColor: alpha(colors.primary, 0.1)
                      }
                    }}
                  >
                    <FilterList />
                  </IconButton>
                </Tooltip>
              </Box>
            }
            sx={{
              borderBottom: `1px solid ${alpha(colors.border, 0.2)}`,
              background: `linear-gradient(135deg, ${alpha(colors.primary, 0.02)} 0%, ${alpha(colors.primary, 0.05)} 100%)`
            }}
          />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Request ID', 'Resident', 'Contact', 'Address', 'Bin Types', 'Status', 'Request Date', 'Actions'].map((header) => (
                    <TableCell 
                      key={header}
                      sx={{ 
                        fontWeight: 700, 
                        color: colors.textPrimary,
                        backgroundColor: alpha(colors.primary, 0.03),
                        borderBottom: `2px solid ${alpha(colors.primary, 0.2)}`,
                        py: 2
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <RequestPage sx={{ fontSize: 64, color: colors.textSecondary, mb: 2, opacity: 0.5 }} />
                        <Typography variant="h6" sx={{ color: colors.textSecondary, mb: 1 }}>
                          No bin requests found
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                          All requests are processed and up to date
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow 
                      key={request._id} 
                      hover
                      sx={{ 
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: alpha(colors.primary, 0.02),
                          transform: 'scale(1.002)'
                        }
                      }}
                    >
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                          #{request._id?.slice(-6).toUpperCase() || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32, 
                              bgcolor: alpha(colors.primary, 0.1),
                              color: colors.primary,
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}
                          >
                            {request.userId?.name?.charAt(0) || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.textPrimary }}>
                              {request.userId?.name || 'Unknown User'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              {request.userId?.email || 'No email'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Phone sx={{ fontSize: 16, color: colors.textSecondary }} />
                            {request.contactPhone || 'No phone'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.textSecondary, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Email sx={{ fontSize: 14 }} />
                            {request.contactEmail || 'No email'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOn sx={{ fontSize: 16, color: colors.textSecondary }} />
                          <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                            {request.address || 'No address'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={getBinTypesSummary(request.selectedBins)}>
                          <Typography variant="body2" noWrap sx={{ maxWidth: '200px', color: colors.textPrimary }}>
                            {getBinTypesSummary(request.selectedBins)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusText(request.status)} 
                          size="small" 
                          color={getStatusColor(request.status)}
                          sx={{ 
                            fontWeight: 600,
                            boxShadow: `0 2px 8px ${alpha(getStatusColor(request.status) === 'success' ? colors.success : 
                              getStatusColor(request.status) === 'warning' ? colors.warning : 
                              getStatusColor(request.status) === 'error' ? colors.error : colors.primary, 0.2)}`
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 14, color: colors.textSecondary }} />
                          <Typography variant="body2" sx={{ color: colors.textPrimary }}>
                            {request.requestDate ? formatDate(request.requestDate) : 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small"
                              onClick={() => handleViewDetails(request)}
                              sx={{
                                color: colors.textSecondary,
                                backgroundColor: alpha(colors.primary, 0.1),
                                '&:hover': {
                                  color: colors.primary,
                                  backgroundColor: alpha(colors.primary, 0.2),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Request">
                            <IconButton 
                              size="small"
                              onClick={() => handleEditRequest(request)}
                              sx={{
                                color: colors.textSecondary,
                                backgroundColor: alpha(colors.secondary, 0.1),
                                '&:hover': {
                                  color: colors.secondary,
                                  backgroundColor: alpha(colors.secondary, 0.2),
                                  transform: 'scale(1.1)'
                                },
                                transition: 'all 0.2s ease-in-out'
                              }}
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
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: `linear-gradient(135deg, ${colors.surface} 0%, ${alpha(colors.primary, 0.02)} 100%)`,
              backdropFilter: 'blur(20px)',
              boxShadow: `0 20px 60px ${alpha(colors.primary, 0.2)}`,
              border: `1px solid ${alpha(colors.border, 0.3)}`
            }
          }}
        >
          <DialogTitle
            sx={{
              background: `linear-gradient(135deg, ${alpha(colors.primary, 0.05)} 0%, ${alpha(colors.primary, 0.1)} 100%)`,
              borderBottom: `1px solid ${alpha(colors.border, 0.2)}`,
              py: 3
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: colors.textPrimary }}>
                {isEditMode ? 'Edit Bin Request' : 'Request Details'}
              </Typography>
              <IconButton 
                onClick={handleCloseModal}
                sx={{
                  color: colors.textSecondary,
                  '&:hover': {
                    color: colors.error,
                    backgroundColor: alpha(colors.error, 0.1),
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {selectedRequest && (
              <Box sx={{ p: 4 }}>
                {/* Request Information */}
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Card 
                      sx={{ 
                        background: `linear-gradient(135deg, ${alpha(colors.primary, 0.03)} 0%, ${alpha(colors.primary, 0.08)} 100%)`,
                        borderRadius: 3,
                        border: `1px solid ${alpha(colors.primary, 0.1)}`,
                        p: 3
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Person sx={{ color: colors.primary }} />
                        Resident Information
                      </Typography>
                      <List dense sx={{ '& .MuiListItem-root': { px: 0 } }}>
                        <ListItem>
                          <ListItemText 
                            primary="Full Name" 
                            secondary={selectedRequest.userId?.name || 'Unknown User'}
                            primaryTypographyProps={{ sx: { fontWeight: 600, color: colors.textPrimary, fontSize: '0.875rem' } }}
                            secondaryTypographyProps={{ sx: { color: colors.textSecondary } }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Email Address" 
                            secondary={selectedRequest.userId?.email || 'No email'}
                            primaryTypographyProps={{ sx: { fontWeight: 600, color: colors.textPrimary, fontSize: '0.875rem' } }}
                            secondaryTypographyProps={{ sx: { color: colors.textSecondary } }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Contact Phone" 
                            secondary={selectedRequest.contactPhone || 'No phone'}
                            primaryTypographyProps={{ sx: { fontWeight: 600, color: colors.textPrimary, fontSize: '0.875rem' } }}
                            secondaryTypographyProps={{ sx: { color: colors.textSecondary } }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Contact Email" 
                            secondary={selectedRequest.contactEmail || 'No email'}
                            primaryTypographyProps={{ sx: { fontWeight: 600, color: colors.textPrimary, fontSize: '0.875rem' } }}
                            secondaryTypographyProps={{ sx: { color: colors.textSecondary } }}
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Card 
                      sx={{ 
                        background: `linear-gradient(135deg, ${alpha(colors.secondary, 0.03)} 0%, ${alpha(colors.secondary, 0.08)} 100%)`,
                        borderRadius: 3,
                        border: `1px solid ${alpha(colors.secondary, 0.1)}`,
                        p: 3
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RequestPage sx={{ color: colors.secondary }} />
                        Request Details
                      </Typography>
                      <List dense sx={{ '& .MuiListItem-root': { px: 0 } }}>
                        <ListItem>
                          <ListItemText 
                            primary="Request ID" 
                            secondary={`#${selectedRequest._id?.slice(-6).toUpperCase() || 'N/A'}`}
                            primaryTypographyProps={{ sx: { fontWeight: 600, color: colors.textPrimary, fontSize: '0.875rem' } }}
                            secondaryTypographyProps={{ sx: { color: colors.textSecondary, fontFamily: 'monospace' } }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Request Date" 
                            secondary={formatDate(selectedRequest.requestDate)}
                            primaryTypographyProps={{ sx: { fontWeight: 600, color: colors.textPrimary, fontSize: '0.875rem' } }}
                            secondaryTypographyProps={{ sx: { color: colors.textSecondary } }}
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
                                sx={{ fontWeight: 600 }}
                              />
                            }
                            primaryTypographyProps={{ sx: { fontWeight: 600, color: colors.textPrimary, fontSize: '0.875rem' } }}
                          />
                        </ListItem>
                      </List>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        background: `linear-gradient(135deg, ${alpha(colors.warning, 0.03)} 0%, ${alpha(colors.warning, 0.08)} 100%)`,
                        borderRadius: 3,
                        border: `1px solid ${alpha(colors.warning, 0.1)}`,
                        p: 3
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ color: colors.warning }} />
                        Delivery Address
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 2, backgroundColor: alpha(colors.warning, 0.05), borderRadius: 2 }}>
                        <LocationOn sx={{ mr: 2, color: colors.warning }} />
                        <Typography variant="body1" sx={{ color: colors.textPrimary, fontWeight: 500 }}>
                          {selectedRequest.address || 'No address provided'}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card 
                      sx={{ 
                        background: `linear-gradient(135deg, ${alpha(colors.success, 0.03)} 0%, ${alpha(colors.success, 0.08)} 100%)`,
                        borderRadius: 3,
                        border: `1px solid ${alpha(colors.success, 0.1)}`,
                        p: 3
                      }}
                    >
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.textPrimary, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircle sx={{ color: colors.success }} />
                        Selected Bins
                      </Typography>
                      <List dense>
                        {selectedRequest.selectedBins?.map((bin, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemText 
                              primary={`${bin.binType.charAt(0).toUpperCase() + bin.binType.slice(1)} Waste Bin`}
                              secondary={`Quantity: ${bin.quantity} | Capacity: ${bin.capacity}`}
                              primaryTypographyProps={{ sx: { fontWeight: 600, color: colors.textPrimary } }}
                              secondaryTypographyProps={{ sx: { color: colors.textSecondary } }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Card>
                  </Grid>

                  {selectedRequest.specialInstructions && (
                    <Grid item xs={12}>
                      <Card 
                        sx={{ 
                          background: `linear-gradient(135deg, ${alpha(colors.primary, 0.03)} 0%, ${alpha(colors.primary, 0.08)} 100%)`,
                          borderRadius: 3,
                          border: `1px solid ${alpha(colors.primary, 0.1)}`,
                          p: 3
                        }}
                      >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.textPrimary }}>
                          Special Instructions
                        </Typography>
                        <Typography variant="body1" sx={{ p: 2, backgroundColor: alpha(colors.primary, 0.05), borderRadius: 2, color: colors.textPrimary, fontStyle: 'italic' }}>
                          {selectedRequest.specialInstructions}
                        </Typography>
                      </Card>
                    </Grid>
                  )}

                  {/* Admin Actions Section - Only show in edit mode */}
                  {isEditMode && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2, borderColor: alpha(colors.border, 0.3) }} />
                      <Card 
                        sx={{ 
                          background: `linear-gradient(135deg, ${alpha(colors.secondary, 0.05)} 0%, ${alpha(colors.secondary, 0.1)} 100%)`,
                          borderRadius: 3,
                          border: `1px solid ${alpha(colors.secondary, 0.2)}`,
                          p: 3
                        }}
                      >
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: colors.textPrimary }}>
                          Admin Actions
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              select
                              fullWidth
                              label="Request Status"
                              value={status}
                              onChange={(e) => setStatus(e.target.value)}
                              variant="outlined"
                              size="small"
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  backgroundColor: colors.surface,
                                  '&:hover fieldset': {
                                    borderColor: colors.primary,
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: colors.primary,
                                    boxShadow: `0 0 0 2px ${alpha(colors.primary, 0.2)}`
                                  }
                                }
                              }}
                            >
                              <MenuItem value="pending">Pending Review</MenuItem>
                              <MenuItem value="approved">Approved</MenuItem>
                              <MenuItem value="rejected">Rejected</MenuItem>
                              <MenuItem value="completed">Completed</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Administrative Notes"
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              variant="outlined"
                              placeholder="Add any internal notes, comments, or follow-up actions for this request..."
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                  backgroundColor: colors.surface,
                                  '&:hover fieldset': {
                                    borderColor: colors.primary,
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: colors.primary,
                                    boxShadow: `0 0 0 2px ${alpha(colors.primary, 0.2)}`
                                  }
                                }
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 2 }}>
            {!isEditMode ? (
              // View Mode Buttons
              <>
                <Button 
                  onClick={handleCloseModal}
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    borderColor: colors.border,
                    color: colors.textSecondary,
                    '&:hover': {
                      borderColor: colors.textSecondary,
                      backgroundColor: alpha(colors.textSecondary, 0.04)
                    }
                  }}
                >
                  Close
                </Button>
                <Button 
                  onClick={handleSwitchToEdit}
                  variant="contained"
                  startIcon={<Edit />}
                  sx={{ 
                    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`,
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    boxShadow: `0 4px 14px ${alpha(colors.primary, 0.3)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primary} 100%)`,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 6px 20px ${alpha(colors.primary, 0.4)}`
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
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
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    borderColor: colors.border,
                    color: colors.textSecondary,
                    '&:hover': {
                      borderColor: colors.textSecondary,
                      backgroundColor: alpha(colors.textSecondary, 0.04)
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateRequest}
                  variant="contained"
                  startIcon={<Save />}
                  disabled={!status}
                  sx={{ 
                    background: `linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%)`,
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    boxShadow: `0 4px 14px ${alpha(colors.success, 0.3)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.success} 100%)`,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 6px 20px ${alpha(colors.success, 0.4)}`
                    },
                    '&:disabled': {
                      background: colors.textSecondary,
                      boxShadow: 'none'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
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
            sx={{ 
              width: '100%',
              borderRadius: 2,
              fontWeight: 500,
              boxShadow: `0 4px 20px ${alpha(colors.primary, 0.2)}`
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminBinRequests;