import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  IconButton,
  Divider,
  Link,
  useTheme
} from '@mui/material';
import {
  Recycling,
  Email,
  Phone,
  LocationOn,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const footerLinks = {
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'Our Team', path: '/team' },
      { label: 'Careers', path: '/careers' },
      { label: 'Press', path: '/press' }
    ],
    services: [
      { label: 'Smart Collection', path: '/services/collection' },
      { label: 'Route Optimization', path: '/services/routes' },
      { label: 'Analytics', path: '/services/analytics' },
      { label: 'IoT Solutions', path: '/services/iot' }
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Documentation', path: '/docs' },
      { label: 'API Reference', path: '/api' },
      { label: 'Contact Support', path: '/support' }
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Cookie Policy', path: '/cookies' },
      { label: 'GDPR', path: '/gdpr' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook />, label: 'Facebook', href: '#' },
    { icon: <Twitter />, label: 'Twitter', href: '#' },
    { icon: <LinkedIn />, label: 'LinkedIn', href: '#' },
    { icon: <Instagram />, label: 'Instagram', href: '#' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'grey.900',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '3px solid #10b981'
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0.1
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #10b981, #059669)',
            filter: 'blur(60px)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
            filter: 'blur(60px)'
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Main Footer Content */}
        <Box sx={{ py: 8 }}>
          <Grid container spacing={6}>
            {/* Company Info & Logo */}
            <Grid item xs={12} md={4}>
              <Box sx={{ mb: 4 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 3,
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.05)' },
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={() => navigate('/')}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <Recycling sx={{ color: 'white', fontSize: 28 }} />
                  </Box>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1
                      }}
                    >
                      EcoSmart
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'grey.400',
                        fontSize: '0.8rem',
                        lineHeight: 1,
                        mt: -0.5,
                        display: 'block'
                      }}
                    >
                      Waste Management
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="grey.400" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Revolutionizing waste collection with smart technology and AI optimization. 
                  Join thousands of organizations already using our sustainable waste management system.
                </Typography>

                {/* Contact Info */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Email sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                    <Typography variant="body2" color="grey.400">
                      support@ecosmart.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Phone sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                    <Typography variant="body2" color="grey.400">
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ fontSize: 16, color: 'success.main', mr: 1 }} />
                    <Typography variant="body2" color="grey.400">
                      123 Green Street, Eco City, EC 12345
                    </Typography>
                  </Box>
                </Box>

                {/* Social Links */}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      sx={{
                        color: 'grey.400',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '&:hover': {
                          color: 'success.main',
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                      href={social.href}
                      aria-label={social.label}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                Company
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {footerLinks.company.map((link, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => handleNavigation(link.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'grey.400',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        color: 'success.main',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {footerLinks.services.map((link, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => handleNavigation(link.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'grey.400',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        color: 'success.main',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {footerLinks.support.map((link, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => handleNavigation(link.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'grey.400',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        color: 'success.main',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: 'white' }}>
                Legal
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {footerLinks.legal.map((link, index) => (
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => handleNavigation(link.path)}
                    sx={{
                      justifyContent: 'flex-start',
                      color: 'grey.400',
                      textTransform: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        color: 'success.main',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ borderColor: 'grey.700', mb: 4 }} />

        {/* Bottom Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 4,
          gap: 2
        }}>
          <Typography variant="body2" color="grey.400">
            © 2024 EcoSmart Waste Management. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate('/login')}
              sx={{
                borderColor: 'success.main',
                color: 'success.main',
                '&:hover': {
                  borderColor: 'success.light',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)'
                }
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => navigate('/register')}
              sx={{
                background: 'linear-gradient(45deg, #10b981, #059669)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #059669, #047857)'
                }
              }}
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
