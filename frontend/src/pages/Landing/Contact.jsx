import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  TextField, 
  Button,
  Paper,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Chip,
  Avatar,
  Divider,
  Stack
} from '@mui/material';
import { 
  Email, 
  Phone, 
  LocationOn,
  Schedule,
  Send,
  Business,
  Support,
  Engineering,
  Star,
  ArrowForward,
  Verified,
  Speed,
  Public,
  TrendingUp,
  Security
} from '@mui/icons-material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Email',
      details: 'info@wastemanagement.com',
      description: 'Send us an email anytime'
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Phone',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm'
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Address',
      details: '123 Tech Street, Innovation City, IC 12345',
      description: 'Visit our headquarters'
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Business Hours',
      details: 'Monday - Friday: 8:00 AM - 6:00 PM',
      description: '24/7 support available'
    }
  ];

  return (
    <Box>
      {/* Hero Section - Background Image (Method 2: Full-width background) */}
      <Box 
        sx={{ 
          // Layout Properties
          height: { xs: '100vh', md: '100vh' }, // Full viewport height
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          
          // Fallback background (in case image doesn't load)
          backgroundColor: '#f8fafc'
        }}
      >
        {/* Blurred Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url(/assets/contacts.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(8px)',
            transform: 'scale(1.1)', // Prevents blur edges
            zIndex: 0
          }}
        />
        
        {/* Dark Overlay for better text readability */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%)',
            zIndex: 1
          }}
        />
        
        {/* Content Container */}
        <Container 
          maxWidth="xl" 
          sx={{ 
            position: 'relative', 
            zIndex: 2,
            textAlign: 'center',
            color: 'white'
          }}
        >
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            {/* Chip with Icon */}
            <Chip
              icon={<Business />}
              label="Get In Touch"
              sx={{
                backgroundColor: '#047857',
                color: 'white',
                mb: 4,
                fontWeight: 'bold',
                fontSize: '0.875rem',
                px: 3,
                py: 1.5,
                height: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: '#065f46',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(4, 120, 87, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            />
            
            {/* Main Heading */}
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5rem' },
                fontWeight: 800,
                color: 'white',
                mb: 4,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
                animation: 'fadeInUp 1s ease-out'
              }}
            >
            Contact Us
          </Typography>
            
            {/* Description */}
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                maxWidth: '600px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.4rem' },
                lineHeight: 1.6,
                fontWeight: 400,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                mb: 6
              }}
            >
              Get in touch with our team for support, questions, or partnership opportunities. 
              We're here to help you transform your waste management operations.
          </Typography>
            
            {/* Call to Action Button */}
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: '#047857',
                color: 'white',
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(4, 120, 87, 0.3)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                '&:hover': {
                  backgroundColor: '#065f46',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 35px rgba(4, 120, 87, 0.4)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Today
            </Button>
          </Box>
        </Container>
        
        {/* Scroll Indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            animation: 'bounce 2s infinite'
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 50,
              border: '2px solid rgba(255, 255, 255, 0.7)',
              borderRadius: 15,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 4,
                height: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                borderRadius: 2,
                animation: 'scroll 2s infinite'
              }
            }}
          />
        </Box>
      </Box>

      {/* Contact Form & Info Section - Split Layout */}
      <Box sx={{ backgroundColor: '#f8fafc', py: { xs: 10, md: 16 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={8} alignItems="center">
            {/* Left Side - Visual Element */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ 
                position: 'relative',
                height: { xs: '400px', lg: '600px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Smartphone Mockup */}
                <Box sx={{
                  width: { xs: '200px', sm: '250px', lg: '300px' },
                  height: { xs: '350px', sm: '450px', lg: '550px' },
                  background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                  borderRadius: { xs: 3, lg: 4 },
                  position: 'relative',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                  transform: 'rotate(-5deg)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '8%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60%',
                    height: '4px',
                    background: '#4a5568',
                    borderRadius: 2
                  }
                }}>
                  {/* Phone Screen */}
                  <Box sx={{
                    position: 'absolute',
                    top: '12%',
                    left: '6%',
                    right: '6%',
                    bottom: '6%',
                    background: 'white',
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    {/* Phone Header */}
                    <Box sx={{
                      background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                      p: 2,
                      color: 'white',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        EcoSmart Waste Management
                      </Typography>
                    </Box>
                    
                    {/* Phone Content */}
                    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          Real-time Monitoring
                        </Typography>
                        <Box sx={{ 
                          background: '#f0f9ff', 
                          p: 1.5, 
                          borderRadius: 1,
                          border: '1px solid #e0f2fe'
                        }}>
                          <Typography variant="body2" sx={{ color: '#0369a1', fontWeight: 600 }}>
                            Bin Level: 85%
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Collection needed in 2 hours
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                          Route Optimization
                        </Typography>
                        <Box sx={{ 
                          background: '#f0fdf4', 
                          p: 1.5, 
                          borderRadius: 1,
                          border: '1px solid #dcfce7'
                        }}>
                          <Typography variant="body2" sx={{ color: '#166534', fontWeight: 600 }}>
                            Efficiency: +35%
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748b' }}>
                            Fuel savings achieved
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ 
                        background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                        p: 1.5,
                        borderRadius: 1,
                        color: 'white',
                        textAlign: 'center'
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Smart Analytics
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          AI-powered insights
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                
                {/* Floating Elements */}
                <Box sx={{
                  position: 'absolute',
                  top: '20%',
                  right: '10%',
                  background: 'white',
                  borderRadius: 2,
                  p: 2,
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transform: 'rotate(3deg)',
                  zIndex: 2
                }}>
                  <Typography variant="h6" sx={{ color: '#1a202c', fontWeight: 700, mb: 1 }}>
                    TOP 5 FEATURES
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    you need for smart waste management
                  </Typography>
                </Box>
                
                <Box sx={{
                  position: 'absolute',
                  bottom: '15%',
                  left: '5%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: 2,
                  p: 2,
                  color: 'white',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)',
                  transform: 'rotate(-2deg)',
                  zIndex: 2
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Real-time Dashboard
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Monitor everything
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Side - Contact Form */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ 
                background: 'white',
                borderRadius: 4,
                p: 6,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontSize: { xs: '2rem', sm: '2.5rem' },
                    fontWeight: 700,
                    color: '#1a202c',
                    mb: 3,
                    lineHeight: 1.2
                  }}
                >
                  Contact Us
              </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#64748b',
                    mb: 5,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    lineHeight: 1.6
                  }}
                >
                  Get in touch with our team for support, questions, or partnership opportunities.
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! We'll get back to you soon.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={4}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      name="name"
                      label="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#1a202c',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#1a202c',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          fontWeight: 500
                        }
                      }}
                    />
                    
                    <TextField
                      required
                      fullWidth
                      id="email"
                      name="email"
                      label="E-mail"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#1a202c',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#1a202c',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          fontWeight: 500
                        }
                      }}
                    />
                    
                    <TextField
                      required
                      fullWidth
                      id="message"
                      name="message"
                      label="Message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      variant="standard"
                      sx={{
                        '& .MuiInput-underline:before': {
                          borderBottomColor: '#1a202c',
                        },
                        '& .MuiInput-underline:after': {
                          borderBottomColor: '#1a202c',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#64748b',
                          fontWeight: 500
                        }
                      }}
                    />
                    
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                      sx={{ 
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        borderRadius: 3,
                        backgroundColor: '#1a202c',
                        textTransform: 'none',
                        boxShadow: '0 6px 20px rgba(26, 32, 44, 0.3)',
                        '&:hover': {
                          backgroundColor: '#2d3748',
                          boxShadow: '0 8px 25px rgba(26, 32, 44, 0.4)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease',
                        alignSelf: 'flex-start'
                      }}
                    >
                      {loading ? 'Sending...' : 'Contact Us'}
                    </Button>
                  </Stack>
              </Box>

          {/* Contact Information */}
                <Box sx={{ mt: 6 }}>
                  <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                      <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#1a202c',
                            fontWeight: 700,
                            mb: 2,
                            fontSize: '1.1rem'
                          }}
                        >
                          Contact
            </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#1a202c',
                            fontSize: '1rem'
                          }}
                        >
                          hi@ecosmart.com
            </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                        <Box>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#1a202c',
                            fontWeight: 700,
                            mb: 2,
                            fontSize: '1.1rem'
                          }}
                        >
                          Based in
                          </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#1a202c',
                            fontSize: '1rem'
                          }}
                        >
                          New York, California, Ohio
                          </Typography>
                      </Box>
            </Grid>
          </Grid>
                  
                  {/* Social Media Icons */}
                  <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#1a202c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#2d3748',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>f</Typography>
                    </Box>
                    
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#1a202c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#2d3748',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>📷</Typography>
                    </Box>
                    
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: '#1a202c',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: '#2d3748',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1rem' }}>🐦</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

    </Box>
  );
};

export default Contact;
