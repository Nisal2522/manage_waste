import React, { useState, useEffect } from 'react';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Link,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock, 
  Person, 
  Phone, 
  LocationOn,
  ArrowBack,
  Recycling,
  CheckCircle,
  Home,
  Business,
  ArrowForward,
  KeyboardArrowLeft
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { registerUser } from '../../utils/api.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'resident',
    phone: '',
    address: {
      street: '',
      city: '',
      district: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [stepErrors, setStepErrors] = useState({});
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  const { login, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Handle navigation after successful registration
  useEffect(() => {
    if (registerSuccess && user && isAuthenticated) {
      // Handle nested user structure
      const userRole = user?.user?.role || user?.role;
      console.log('Registration successful, navigating based on role:', userRole);
      switch (userRole) {
        case 'admin':
          navigate('/dashboard/admin');
          break;
        case 'staff':
          navigate('/dashboard/staff');
          break;
        case 'resident':
          navigate('/dashboard/resident');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [registerSuccess, user, isAuthenticated, navigate]);

  const steps = [
    { label: 'Personal Information', icon: <Person /> },
    { label: 'Address', icon: <LocationOn /> },
    { label: 'Security', icon: <Lock /> }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [addressField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateStep = (step) => {
    const errors = {};
    
    switch (step) {
      case 0: // Personal Information
        if (!formData.name.trim()) errors.name = 'Name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.role) errors.role = 'Role is required';
        break;
      case 1: // Address
        // Address fields are optional, so no validation needed
        break;
      case 2: // Security
        if (!formData.password) errors.password = 'Password is required';
        else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (!formData.confirmPassword) errors.confirmPassword = 'Confirm password is required';
        else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
        break;
      default:
        break;
    }
    
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };

  const handleStepClick = (step) => {
    if (step < activeStep || validateStep(step)) {
      setActiveStep(step);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRegisterSuccess(false);

    // Validate all steps before submission
    const allStepsValid = steps.every((_, index) => {
      const errors = {};
      switch (index) {
        case 0: // Personal Information
          if (!formData.name.trim()) errors.name = 'Name is required';
          if (!formData.email.trim()) errors.email = 'Email is required';
          else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
          if (!formData.role) errors.role = 'Role is required';
          break;
        case 1: // Address
          // Address fields are optional, so no validation needed
          break;
        case 2: // Security
          if (!formData.password) errors.password = 'Password is required';
          else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters';
          if (!formData.confirmPassword) errors.confirmPassword = 'Confirm password is required';
          else if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
          break;
        default:
          break;
      }
      return Object.keys(errors).length === 0;
    });

    if (!allStepsValid) {
      setError('Please complete all required fields before submitting');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await registerUser(formData);
      console.log('Registration response:', response); // Debug log
      
      // Check if response has the expected structure
      const userData = response.data || response;
      console.log('User data:', userData); // Debug log
      
      // Update auth context
      login(userData);
      
      // Set registration success flag to trigger navigation in useEffect
      setRegisterSuccess(true);
      
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      setError(err.response?.data?.message || 'Registration failed');
      setRegisterSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Personal Information
        return (
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!stepErrors.name}
                  helperText={stepErrors.name}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.light',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: 'success.main'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'success.main', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!stepErrors.email}
                  helperText={stepErrors.email}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.light',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: 'success.main'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'success.main', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" error={!!stepErrors.role}>
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'success.light',
                            borderWidth: 2
                          }
                        },
                        '&.Mui-focused': {
                          backgroundColor: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'success.main',
                            borderWidth: 2,
                            boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                          }
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        '&.Mui-focused': {
                          color: 'success.main'
                        }
                      }
                    }}
                  >
                    <MenuItem value="resident">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Home sx={{ fontSize: 20, color: 'success.main' }} />
                        <Typography sx={{ fontWeight: 500 }}>Resident</Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="staff">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Business sx={{ fontSize: 20, color: 'success.main' }} />
                        <Typography sx={{ fontWeight: 500 }}>Staff</Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                  {stepErrors.role && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                      {stepErrors.role}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.light',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: 'success.main'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: 'success.main', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1: // Address
        return (
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="street"
                  label="Street Address"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.light',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: 'success.main'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="city"
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.light',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: 'success.main'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="district"
                  label="District"
                  name="address.district"
                  value={formData.address.district}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.light',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: 'success.main'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2: // Security
        return (
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!stepErrors.password}
                  helperText={stepErrors.password}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.light',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: 'success.main'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'success.main', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ 
                            color: 'success.main',
                            '&:hover': {
                              backgroundColor: 'rgba(16, 185, 129, 0.1)'
                            }
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                  error={!!stepErrors.confirmPassword}
                  helperText={stepErrors.confirmPassword}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontSize: '1rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.light',
                          borderWidth: 2
                        }
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'success.main',
                          borderWidth: 2,
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.1)'
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      '&.Mui-focused': {
                        color: 'success.main'
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'success.main', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ 
                            color: 'success.main',
                            '&:hover': {
                              backgroundColor: 'rgba(16, 185, 129, 0.1)'
                            }
                          }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
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
            top: 0,
            left: '25%',
            width: 384,
            height: 384,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2))',
            filter: 'blur(60px)',
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '25%',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.2), rgba(29, 78, 216, 0.2))',
            filter: 'blur(60px)',
            animation: 'pulse 3s ease-in-out infinite 1s'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '25%',
            left: '33%',
            width: 288,
            height: 288,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(20, 184, 166, 0.2))',
            filter: 'blur(60px)',
            animation: 'pulse 3s ease-in-out infinite 2s'
          }}
        />
        
        {/* Floating Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            left: 80,
            width: 32,
            height: 32,
            background: 'linear-gradient(45deg, #10b981, #059669)',
            borderRadius: 2,
            transform: 'rotate(45deg)',
            opacity: 0.2,
            animation: 'bounce 2s ease-in-out infinite'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 160,
            right: 128,
            width: 24,
            height: 24,
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            opacity: 0.3,
            animation: 'bounce 2s ease-in-out infinite 0.5s'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 160,
            left: 64,
            width: 40,
            height: 40,
            background: 'linear-gradient(45deg, #10b981, #14b8a6)',
            borderRadius: 2,
            transform: 'rotate(12deg)',
            opacity: 0.25,
            animation: 'bounce 2s ease-in-out infinite 1s'
          }}
        />
      </Box>

      {/* Back Button */}
      <Button
        variant="outlined"
        onClick={() => navigate('/')}
        startIcon={<ArrowBack />}
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 32 },
          left: { xs: 16, sm: 32 },
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            transform: 'translateY(-2px)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        Back to Home
      </Button>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: { xs: 2, sm: 4, md: 8 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: { xs: 3, sm: 6, md: 8, lg: 12 },
          alignItems: { xs: 'flex-start', lg: 'stretch' },
          minHeight: { xs: 'auto', lg: '100vh' }
        }}>
          {/* Left Side - Welcome Content */}
          <Box sx={{ 
            order: { xs: 1, lg: 1 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { xs: 'flex-start', lg: 'center' },
            minHeight: { xs: 'auto', lg: '100vh' },
            mb: { xs: 2, lg: 0 }
          }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 1, lg: 8 }, mt: { xs: 2, lg: 0 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mb: { xs: 1, lg: 6 }
              }}>
                <Box
                  sx={{
                    width: { xs: 40, sm: 48, md: 56, lg: 80 },
                    height: { xs: 40, sm: 48, md: 56, lg: 80 },
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 20px rgba(16, 185, 129, 0.15)'
                  }}
                >
                  <Recycling sx={{ fontSize: { xs: 20, sm: 24, md: 28, lg: 40 }, color: 'white' }} />
                </Box>
              </Box>
              
              <Typography 
                variant="h1" 
                component="h1"
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.25rem', lg: '3.5rem' },
                  fontWeight: 'bold',
                  lineHeight: 1.2,
                  mb: { xs: 0.5, lg: 2 },
                  textAlign: 'center',
                  px: { xs: 1, sm: 0 }
                }}
              >
                Join{' '}
                <Box 
                  component="span"
                  sx={{
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  EcoSmart
                </Box>{' '}
                Today
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{
                  color: 'text.secondary',
                  mb: { xs: 1, lg: 8 },
                  lineHeight: 1.4,
                  maxWidth: { xs: '100%', lg: '500px' },
                  fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem', lg: '1.25rem' },
                  textAlign: 'center',
                  mx: 'auto',
                  px: { xs: 1, sm: 0 }
                }}
              >
                Create your EcoSmart WMS account and start managing waste efficiently with smart solutions
              </Typography>
              
              {/* Features List */}
              <Box sx={{ 
                display: { xs: 'none', lg: 'flex' },
                flexDirection: 'column', 
                gap: 4,
                maxWidth: { xs: '100%', lg: '400px' },
                mx: { xs: 'auto', lg: 0 }
              }}>
                {[
                  'Smart waste collection scheduling',
                  'Real-time environmental impact tracking',
                  'Advanced analytics and reporting tools',
                  'Community engagement features'
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: 'success.light',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CheckCircle sx={{ fontSize: 20, color: 'success.main' }} />
                    </Box>
                    <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Stats Cards - Left Side */}
            <Box sx={{ 
              display: { xs: 'none', sm: 'grid' },
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: { xs: 2, sm: 4 },
              mt: { xs: 4, lg: 6 },
              maxWidth: { xs: '100%', lg: 400 },
              mx: { xs: 'auto', lg: 0 }
            }}>
              {[
                { number: '10K+', label: 'Active Users', color: 'success.main' },
                { number: '95%', label: 'Satisfaction', color: 'info.main' }
              ].map((stat, index) => (
                <Card
                  key={index}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    p: 3,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: stat.color,
                      mb: 1,
                      fontSize: { xs: '1.5rem', sm: '2rem' }
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Right Side - Registration Form */}
          <Box sx={{ 
            order: { xs: 2, lg: 2 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { xs: 'flex-start', lg: 'center' },
            minHeight: { xs: 'auto', lg: '100vh' },
            mb: { xs: 4, lg: 0 }
          }}>
            <Box sx={{ 
              maxWidth: { xs: '100%', lg: 500 },
              mx: { xs: 'auto', lg: 0 },
              mr: { lg: 'auto' },
              width: '100%',
              px: { xs: 1, sm: 0 }
            }}>
              <Fade in timeout={800}>
                <Card
                  sx={{
                    boxShadow: { xs: '0 10px 25px rgba(0, 0, 0, 0.1)', sm: '0 20px 40px rgba(0, 0, 0, 0.12)', lg: '0 25px 50px rgba(0, 0, 0, 0.15)' },
                    border: 'none',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: { xs: 4, sm: 5, lg: 6 },
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: { xs: '0 15px 35px rgba(0, 0, 0, 0.15)', sm: '0 25px 50px rgba(0, 0, 0, 0.18)' }
                    }
                  }}
                >
                  <CardHeader sx={{ 
                    textAlign: 'center', 
                    pb: { xs: 4, lg: 6 }, 
                    px: { xs: 3, sm: 4, lg: 6 }, 
                    pt: { xs: 6, lg: 8 },
                    background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.02))'
                  }}>
                    <Box
                      sx={{
                        width: { xs: 48, sm: 56, lg: 64 },
                        height: { xs: 48, sm: 56, lg: 64 },
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        borderRadius: { xs: 3, lg: 4 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: { xs: 3, lg: 4 },
                        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Person sx={{ fontSize: { xs: 24, sm: 28, lg: 32 }, color: 'white' }} />
                    </Box>
                    <Typography variant="h4" component="h2" sx={{ 
                      fontWeight: 'bold', 
                      mb: { xs: 1, lg: 2 }, 
                      color: 'text.primary',
                      fontSize: { xs: '1.5rem', sm: '1.75rem', lg: '2rem' }
                    }}>
                      Create Account
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ 
                      fontSize: { xs: '0.9rem', sm: '1rem', lg: '1.125rem' }
                    }}>
                      Join EcoSmart and start your sustainable journey
                    </Typography>
                  </CardHeader>

                  <Box component="form" onSubmit={handleSubmit}>
                    <CardContent sx={{ px: { xs: 4, sm: 5, lg: 7 }, pb: { xs: 5, lg: 7 } }}>
                      {error && (
                        <Alert 
                          severity="error" 
                          sx={{ 
                          mb: 4, 
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: 'error.light',
                            backgroundColor: 'rgba(244, 67, 54, 0.08)',
                          color: 'error.dark',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                          '& .MuiAlert-icon': {
                              color: 'error.main',
                              fontSize: '1.25rem'
                          }
                          }}
                        >
                          {error}
                        </Alert>
                      )}

                      {/* Step Progress Indicator */}
                      <Box sx={{ mb: 4 }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                          {steps.map((step, index) => (
                            <Step key={step.label}>
                              <StepLabel
                                onClick={() => handleStepClick(index)}
                              sx={{
                                  cursor: index <= activeStep ? 'pointer' : 'default',
                                  '& .MuiStepLabel-label': {
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: index <= activeStep ? 'success.main' : 'text.secondary'
                                  },
                                  '& .MuiStepLabel-iconContainer': {
                                    '& .MuiSvgIcon-root': {
                                      fontSize: '1.5rem',
                                      color: index <= activeStep ? 'success.main' : 'text.secondary'
                                    }
                                  }
                                }}
                              >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {step.icon}
                                  <Typography variant="body2" sx={{ 
                                    fontWeight: 600,
                                    color: index <= activeStep ? 'success.main' : 'text.secondary'
                                  }}>
                                    {step.label}
                                  </Typography>
                                  </Box>
                              </StepLabel>
                            </Step>
                          ))}
                        </Stepper>
                                  </Box>

                      {/* Step Content */}
                      <Fade in timeout={300}>
                        <Box>
                          {renderStepContent(activeStep)}
                      </Box>
                      </Fade>
                    </CardContent>

                    <CardActions sx={{ 
                      flexDirection: 'row', 
                      justifyContent: 'space-between',
                      gap: { xs: 2, lg: 3 }, 
                      px: { xs: 4, sm: 5, lg: 7 }, 
                      pb: { xs: 6, lg: 8 } 
                    }}>
                      <Button
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        startIcon={<KeyboardArrowLeft />}
                              sx={{
                          color: 'text.secondary',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                                  '&:hover': {
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            color: 'success.main'
                          },
                          '&:disabled': {
                            color: 'text.disabled'
                          }
                        }}
                      >
                        Previous
                      </Button>

                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {activeStep === steps.length - 1 ? (
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                          color: 'white',
                              py: 2,
                              px: 4,
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              borderRadius: 4,
                              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3), 0 4px 10px rgba(16, 185, 129, 0.2)',
                              textTransform: 'none',
                              letterSpacing: '0.02em',
                          '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
                            transform: 'translateY(-2px)',
                                boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4), 0 8px 15px rgba(16, 185, 129, 0.3)'
                              },
                              '&:active': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                              },
                              '&:disabled': {
                                background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 50%, #4b5563 100%)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                transform: 'none',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
                              },
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                                transition: 'left 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                          },
                          '&:hover::before': {
                            left: '100%'
                          }
                        }}
                      >
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={20} sx={{ color: 'white' }} />
                            <span>Creating Account...</span>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CheckCircle sx={{ fontSize: 20 }} />
                            <span>Create Account</span>
                          </Box>
                        )}
                      </Button>
                        ) : (
                          <Button
                            onClick={handleNext}
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                              color: 'white',
                              py: 2,
                              px: 4,
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              borderRadius: 4,
                              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                              textTransform: 'none',
                              letterSpacing: '0.02em',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 30px rgba(16, 185, 129, 0.35)'
                              },
                              '&:active': {
                                transform: 'translateY(-1px)',
                                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                              },
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          >
                            Next
                          </Button>
                        )}
                      </Box>
                    </CardActions>

                    {/* Sign In Link */}
                    <Box sx={{ 
                      textAlign: 'center',
                      px: { xs: 4, sm: 5, lg: 7 },
                      pb: { xs: 4, lg: 6 },
                      borderTop: '1px solid',
                      borderColor: 'rgba(16, 185, 129, 0.1)'
                    }}>
                      <Typography variant="body1" sx={{ 
                        color: 'text.secondary',
                        fontSize: '1rem',
                        fontWeight: 500
                      }}>
                          Already have an account?{' '}
                          <Link 
                            component={RouterLink} 
                            to="/login"
                            sx={{ 
                              color: 'success.main',
                            fontWeight: 600,
                              textDecoration: 'none',
                            fontSize: '1.05rem',
                            position: 'relative',
                              '&:hover': { 
                              color: 'success.dark',
                              '&::after': {
                                width: '100%'
                              }
                            },
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              bottom: -2,
                              left: 0,
                              width: '0%',
                              height: 2,
                              background: 'linear-gradient(45deg, #10b981, #059669)',
                              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            },
                            transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          >
                            Sign in
                          </Link>
                        </Typography>
                      </Box>
                  </Box>
                </Card>
              </Fade>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;