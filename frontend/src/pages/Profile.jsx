import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Fade,
  Zoom,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Business,
  Security,
  AccessTime,
  Edit,
  Save,
  Cancel,
  CheckCircle,
  Warning,
  Visibility,
  VisibilityOff,
  Lock,
  Verified,
  Star,
  Badge,
  Home,
  Work,
  ContactPhone,
  LocationCity,
  CalendarToday,
  Update,
  Shield
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile } from '../utils/api';

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Debug logging
  console.log('Profile - user data:', user);
  console.log('Profile - user name:', user?.name);
  console.log('Profile - user email:', user?.email);
  console.log('Profile - user role:', user?.role);

  useEffect(() => {
    if (user) {
      setEditedUser({ ...user });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Only allow editing name and phone, not email
      const updateData = {
        name: editedUser.name,
        phone: editedUser.phone,
        address: editedUser.address
      };
      
      const updatedUser = await updateProfile(updateData);
      updateUser(updatedUser);
      setIsEditing(false);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbar({ open: true, message: 'Failed to update profile. Please try again.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'staff': return '#3b82f6';
      case 'resident': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (isActive) => {
    return isActive ? '#10b981' : '#ef4444';
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Shield sx={{ fontSize: 64, color: '#6b7280', mb: 2 }} />
          <Typography variant="h4" sx={{ color: '#1f2937', mb: 2 }}>
            Access Required
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please log in to view your profile
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
      py: 4,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Enhanced Background Effects */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 0
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
            filter: 'blur(40px)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
            filter: 'blur(30px)',
            animation: 'float 8s ease-in-out infinite reverse'
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Modern Header */}
        <Fade in timeout={600}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            mb: 4, 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 300 }}>
                <Zoom in timeout={800}>
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    mr: 3,
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)',
                    border: '4px solid rgba(255, 255, 255, 0.8)'
                  }}>
                    {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </Avatar>
                </Zoom>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}>
                    {isEditing ? (
                      <TextField
                        value={editedUser.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        variant="standard"
                        fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Person /></InputAdornment>
                        }}
                        sx={{ 
                          '& .MuiInput-underline:before': { borderBottomColor: '#10b981' },
                          '& .MuiInput-underline:after': { borderBottomColor: '#10b981' }
                        }}
                      />
                    ) : (
                      user.name
                    )}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 1, fontSize: 18 }} />
                    {user.email}
                    <Lock sx={{ ml: 1, fontSize: 16, color: '#6b7280' }} />
                    <Typography variant="caption" sx={{ ml: 1, color: '#6b7280' }}>
                      (Protected)
                    </Typography>
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip 
                      icon={<Badge />}
                      label={user.role?.toUpperCase()} 
                      sx={{ 
                        background: getRoleColor(user.role),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    <Chip 
                      icon={user.isActive ? <CheckCircle /> : <Warning />}
                      label={user.isActive ? 'Active' : 'Inactive'} 
                      sx={{ 
                        background: getStatusColor(user.isActive),
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    {user.lastLogin && (
                      <Chip 
                        icon={<AccessTime />}
                        label={`Last login: ${new Date(user.lastLogin).toLocaleDateString()}`}
                        variant="outlined"
                        sx={{ borderColor: '#10b981', color: '#10b981' }}
                      />
                    )}
                  </Stack>
                </Box>
              </Box>
              <Box>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={handleEdit}
                    size="large"
                    sx={{
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #059669, #047857)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      color="error"
                      size="large"
                      sx={{ borderRadius: 3 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                      onClick={handleSave}
                      disabled={loading}
                      size="large"
                      sx={{
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #059669, #047857)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(16, 185, 129, 0.4)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Stack>
                )}
              </Box>
            </Box>
          </Paper>
        </Fade>

        <Grid container spacing={4}>
          {/* Personal Information */}
          <Grid item xs={12} lg={6}>
            <Fade in timeout={800}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Person sx={{ mr: 2, color: '#10b981', fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                        Personal Information
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    {/* Email - Read Only */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#6b7280', fontWeight: 600 }}>
                        Email Address
                      </Typography>
                      <TextField
                        value={user.email}
                        disabled
                        fullWidth
                        InputProps={{
                          startAdornment: <InputAdornment position="start"><Email sx={{ color: '#6b7280' }} /></InputAdornment>,
                          endAdornment: <InputAdornment position="end"><Lock sx={{ color: '#6b7280' }} /></InputAdornment>
                        }}
                        sx={{
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: '#6b7280',
                            backgroundColor: '#f9fafb'
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ color: '#6b7280', mt: 0.5, display: 'block' }}>
                        Email cannot be changed for security reasons
                      </Typography>
                    </Box>
                    
                    {/* Phone - Editable */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: '#6b7280', fontWeight: 600 }}>
                        Phone Number
                      </Typography>
                      {isEditing ? (
                        <TextField
                          value={editedUser.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#10b981' }} /></InputAdornment>
                          }}
                          sx={{
                            '& .MuiInput-underline:before': { borderBottomColor: '#10b981' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#10b981' }
                          }}
                        />
                      ) : (
                        <TextField
                          value={user.phone || 'Not provided'}
                          disabled
                          fullWidth
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><Phone sx={{ color: '#6b7280' }} /></InputAdornment>
                          }}
                          sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                              WebkitTextFillColor: user.phone ? '#1f2937' : '#6b7280',
                              backgroundColor: '#f9fafb'
                            }
                          }}
                        />
                      )}
                    </Box>

                    {/* Address - Editable */}
                    {user.address && (
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, color: '#6b7280', fontWeight: 600 }}>
                          Address
                        </Typography>
                        {isEditing ? (
                          <Stack spacing={2}>
                            <TextField
                              value={editedUser.address?.street || ''}
                              onChange={(e) => handleAddressChange('street', e.target.value)}
                              placeholder="Street Address"
                              fullWidth
                              InputProps={{
                                startAdornment: <InputAdornment position="start"><Home sx={{ color: '#10b981' }} /></InputAdornment>
                              }}
                              sx={{
                                '& .MuiInput-underline:before': { borderBottomColor: '#10b981' },
                                '& .MuiInput-underline:after': { borderBottomColor: '#10b981' }
                              }}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <TextField
                                value={editedUser.address?.city || ''}
                                onChange={(e) => handleAddressChange('city', e.target.value)}
                                placeholder="City"
                                fullWidth
                                InputProps={{
                                  startAdornment: <InputAdornment position="start"><LocationCity sx={{ color: '#10b981' }} /></InputAdornment>
                                }}
                                sx={{
                                  '& .MuiInput-underline:before': { borderBottomColor: '#10b981' },
                                  '& .MuiInput-underline:after': { borderBottomColor: '#10b981' }
                                }}
                              />
                              <TextField
                                value={editedUser.address?.district || ''}
                                onChange={(e) => handleAddressChange('district', e.target.value)}
                                placeholder="District"
                                fullWidth
                                InputProps={{
                                  startAdornment: <InputAdornment position="start"><LocationOn sx={{ color: '#10b981' }} /></InputAdornment>
                                }}
                                sx={{
                                  '& .MuiInput-underline:before': { borderBottomColor: '#10b981' },
                                  '& .MuiInput-underline:after': { borderBottomColor: '#10b981' }
                                }}
                              />
                            </Box>
                          </Stack>
                        ) : (
                          <TextField
                            value={`${user.address.street || ''}, ${user.address.city || ''}, ${user.address.district || ''}`}
                            disabled
                            fullWidth
                            multiline
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><LocationOn sx={{ color: '#6b7280' }} /></InputAdornment>
                            }}
                            sx={{
                              '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: '#1f2937',
                                backgroundColor: '#f9fafb'
                              }
                            }}
                          />
                        )}
                      </Box>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Account Information */}
          <Grid item xs={12} lg={6}>
            <Fade in timeout={1000}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Security sx={{ mr: 2, color: '#10b981', fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                        Account Information
                      </Typography>
                    </Box>
                  }
                  sx={{ 
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Business sx={{ mr: 2, color: '#6b7280', fontSize: 24 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                            Role
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600 }}>
                            {user.role?.toUpperCase()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        label={user.role} 
                        sx={{ 
                          background: getRoleColor(user.role),
                          color: 'white',
                          fontWeight: 600,
                          px: 2
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ mr: 2, color: getStatusColor(user.isActive), fontSize: 24 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                            Status
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#1f2937', fontWeight: 600 }}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        icon={user.isActive ? <CheckCircle /> : <Warning />}
                        label={user.isActive ? 'Active' : 'Inactive'} 
                        sx={{ 
                          background: getStatusColor(user.isActive),
                          color: 'white',
                          fontWeight: 600,
                          px: 2
                        }}
                      />
                    </Box>

                    {user.lastLogin && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ mr: 2, color: '#6b7280', fontSize: 24 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                            Last Login
                          </Typography>
                          <Typography variant="body1" sx={{ color: '#1f2937' }}>
                            {new Date(user.lastLogin).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ mr: 2, color: '#6b7280', fontSize: 24 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 600 }}>
                          Member Since
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#1f2937' }}>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Work Information */}
          {(user.assignedRoute || user.binDevice || user.qrCode) && (
            <Grid item xs={12}>
              <Fade in timeout={1200}>
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden'
                }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Work sx={{ mr: 2, color: '#10b981', fontSize: 28 }} />
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937' }}>
                          Work Information
                        </Typography>
                      </Box>
                    }
                    sx={{ 
                      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {user.assignedRoute && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Paper sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: 3,
                            border: '1px solid rgba(0, 0, 0, 0.05)'
                          }}>
                            <LocationOn sx={{ fontSize: 40, color: '#10b981', mb: 1 }} />
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                              Assigned Route
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                              {user.assignedRoute}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                      
                      {user.binDevice && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Paper sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: 3,
                            border: '1px solid rgba(0, 0, 0, 0.05)'
                          }}>
                            <Business sx={{ fontSize: 40, color: '#3b82f6', mb: 1 }} />
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                              Bin Device
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937' }}>
                              {user.binDevice}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                      
                      {user.qrCode && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Paper sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderRadius: 3,
                            border: '1px solid rgba(0, 0, 0, 0.05)'
                          }}>
                            <Verified sx={{ fontSize: 40, color: '#f59e0b', mb: 1 }} />
                            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                              QR Code
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              fontFamily: 'monospace',
                              backgroundColor: '#f3f4f6',
                              padding: '8px 12px',
                              borderRadius: 2,
                              wordBreak: 'break-all',
                              color: '#1f2937',
                              fontWeight: 600
                            }}>
                              {user.qrCode}
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          )}
        </Grid>

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </Box>
  );
};

export default Profile;
