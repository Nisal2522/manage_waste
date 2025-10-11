import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Checkbox,
  FormControlLabel,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
  Recycling,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { loginUser } from '../../utils/api.jsx';
import wasteImage from '../../assets/waste.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      login(response.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
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
                 Welcome Back to{' '}
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
                 </Box>
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
                 Sign in to your EcoSmart WMS account and continue managing waste efficiently
            </Typography>
              
              {/* Features List */}
              <Box sx={{ 
                display: { xs: 'none', lg: 'flex' }, // Hidden on mobile for cleaner layout
                flexDirection: 'column', 
                gap: 4,
                maxWidth: { xs: '100%', lg: '400px' },
                mx: { xs: 'auto', lg: 0 }
              }}>
                {[
                  'Track your waste collection schedule',
                  'Monitor your environmental impact',
                  'Access smart analytics and reports'
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

            {/* Waste Management Image */}
            <Box
              sx={{
                width: '100%',
                height: { xs: 200, sm: 300, lg: 384 },
                borderRadius: 6,
                overflow: 'hidden',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.02)',
                  transition: 'transform 0.5s ease'
                },
                display: { xs: 'none', sm: 'block' } // Hidden on mobile for cleaner layout
              }}
            >
              <Box
                component="img"
                src={wasteImage}
                alt="Smart Waste Management"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
            
          </Box>

          {/* Right Side - Login Form */}
          <Box sx={{ 
            order: { xs: 2, lg: 2 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: { xs: 'flex-start', lg: 'center' },
            minHeight: { xs: 'auto', lg: '100vh' },
            mb: { xs: 4, lg: 0 }
          }}>
            <Box sx={{ 
              maxWidth: { xs: '100%', lg: 400 },
              mx: { xs: 'auto', lg: 0 },
              ml: { lg: 'auto' },
              mr: { lg: 8 },
              width: '100%',
              px: { xs: 1, sm: 0 }
            }}>
              <Card
                sx={{
                  boxShadow: { xs: '0 10px 25px rgba(0, 0, 0, 0.1)', sm: '0 20px 40px rgba(0, 0, 0, 0.12)', lg: '0 25px 50px rgba(0, 0, 0, 0.15)' },
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: { xs: 4, sm: 5, lg: 6 },
                  overflow: 'hidden'
                }}
              >
                <CardHeader sx={{ textAlign: 'center', pb: { xs: 4, lg: 6 }, px: { xs: 3, sm: 4, lg: 6 }, pt: { xs: 6, lg: 8 } }}>
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
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    <Lock sx={{ fontSize: { xs: 24, sm: 28, lg: 32 }, color: 'white' }} />
                  </Box>
                  <Typography variant="h4" component="h2" sx={{ 
                    fontWeight: 'bold', 
                    mb: { xs: 1, lg: 2 }, 
                    color: 'text.primary',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', lg: '2rem' }
                  }}>
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ 
                    fontSize: { xs: '0.9rem', sm: '1rem', lg: '1.125rem' }
                  }}>
                    Enter your credentials to access your account
                  </Typography>
                </CardHeader>

                <Box component="form" onSubmit={handleSubmit}>
                  <CardContent sx={{ px: { xs: 3, sm: 4, lg: 6 }, pb: { xs: 4, lg: 6 } }}>
          {error && (
                      <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
                      sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                            <Email sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
                      sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                            <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      gap: 2,
                      mb: 4
                    }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            sx={{ color: 'success.main' }}
                          />
                        }
                        label="Remember me"
                      />
                      <Button
                        variant="text"
                        sx={{ 
                          color: 'success.main',
                          textTransform: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        Forgot password?
                      </Button>
                    </Box>

                    <Divider sx={{ my: 4 }} />
                  </CardContent>

                  <CardActions sx={{ flexDirection: 'column', gap: { xs: 2, lg: 3 }, px: { xs: 3, sm: 4, lg: 6 }, pb: { xs: 6, lg: 8 } }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                background: 'linear-gradient(45deg, #10b981, #059669)',
                color: 'white',
                py: { xs: 1.5, lg: 2 },
                fontSize: { xs: '1rem', lg: '1.125rem' },
                fontWeight: 'bold',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #059669, #047857)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(16, 185, 129, 0.35)'
                },
                transition: 'all 0.3s ease'
              }}
            >
                      {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={20} sx={{ color: 'white' }} />
                          <span>Signing in...</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CheckCircle sx={{ fontSize: 20 }} />
                          <span>Sign In</span>
                        </Box>
                      )}
            </Button>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                        <Link 
                          component={RouterLink} 
                          to="/register"
                          sx={{ 
                            color: 'success.main',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          Create account
                </Link>
              </Typography>
            </Box>
                  </CardActions>
          </Box>
              </Card>

              {/* Stats Cards - Right Side */}
              <Box sx={{ 
                display: { xs: 'none', sm: 'grid' }, // Hidden on mobile for cleaner layout
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: { xs: 2, sm: 4 },
                mt: { xs: 4, lg: 6 },
                maxWidth: { xs: '100%', lg: 400 },
                mx: { xs: 'auto', lg: 0 },
                ml: { lg: 'auto' },
                mr: { lg: 4 },
                pl: { lg: 2 }
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
          </Box>
          </Box>
      </Container>
    </Box>
  );
};

export default Login;
