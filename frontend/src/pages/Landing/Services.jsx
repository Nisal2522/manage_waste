import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  CardActions,
  Button,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  Avatar,
  Divider,
  Stack
} from '@mui/material';
import { 
  Nature, 
  LocationOn, 
  Schedule, 
  Analytics,
  Security,
  Support,
  CheckCircle,
  TrendingUp,
  SmartToy,
  Public,
  Recycling,
  Business,
  Engineering,
  Star,
  ArrowForward,
  Verified,
  Speed
} from '@mui/icons-material';

const Services = () => {
  const theme = useTheme();
  
  const services = [
    {
      icon: <LocationOn sx={{ fontSize: 40, color: '#047857' }} />,
      title: 'Smart Bin Monitoring',
      description: 'Real-time monitoring of waste bin levels using IoT sensors and GPS tracking.',
      features: [
        'Real-time fill level monitoring',
        'GPS location tracking',
        'Automated alerts and notifications',
        'Historical data analysis'
      ],
      price: 'Starting at $50/month per bin',
      color: '#047857',
      bg: 'linear-gradient(45deg, #d1fae5, #a7f3d0)'
    },
    {
      icon: <Schedule sx={{ fontSize: 40, color: '#3b82f6' }} />,
      title: 'Route Optimization',
      description: 'AI-powered route planning to minimize travel time and fuel consumption.',
      features: [
        'Dynamic route optimization',
        'Traffic-aware scheduling',
        'Multi-vehicle coordination',
        'Real-time route adjustments'
      ],
      price: 'Starting at $200/month per route',
      color: '#3b82f6',
      bg: 'linear-gradient(45deg, #dbeafe, #bfdbfe)'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and reporting for data-driven decision making.',
      features: [
        'Performance metrics tracking',
        'Cost analysis and optimization',
        'Environmental impact reports',
        'Custom reporting tools'
      ],
      price: 'Starting at $100/month',
      color: '#8b5cf6',
      bg: 'linear-gradient(45deg, #e9d5ff, #ddd6fe)'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#f59e0b' }} />,
      title: 'Mobile App',
      description: 'User-friendly mobile application for staff and residents.',
      features: [
        'QR code scanning',
        'Collection scheduling',
        'Real-time notifications',
        'Offline functionality'
      ],
      price: 'Included with all plans',
      color: '#f59e0b',
      bg: 'linear-gradient(45deg, #fef3c7, #fde68a)'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#ef4444' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock technical support and system maintenance.',
      features: [
        '24/7 technical support',
        'System monitoring',
        'Regular maintenance',
        'Training and onboarding'
      ],
      price: 'Included with all plans',
      color: '#ef4444',
      bg: 'linear-gradient(45deg, #fee2e2, #fecaca)'
    }
  ];

  const plans = [
    {
      name: 'Basic',
      price: '$99/month',
      description: 'Perfect for small municipalities',
      features: [
        'Up to 50 bins',
        'Basic route optimization',
        'Standard analytics',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$299/month',
      description: 'Ideal for medium-sized cities',
      features: [
        'Up to 200 bins',
        'Advanced route optimization',
        'Comprehensive analytics',
        'Priority support',
        'Mobile app access'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large cities and organizations',
      features: [
        'Unlimited bins',
        'AI-powered optimization',
        'Custom analytics',
        'Dedicated support',
        'API integration',
        'Custom development'
      ],
      popular: false
    }
  ];

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Hero Section - Professional Design */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        py: { xs: 10, md: 16 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Professional Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 20% 80%, rgba(4, 120, 87, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)
            `,
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Chip
                  icon={<Verified />}
                  label="Enterprise Solutions"
                  sx={{
                    backgroundColor: '#047857',
                    color: 'white',
                    mb: 3,
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    px: 2,
                    py: 1,
                    height: 'auto'
                  }}
                />
                
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
                    fontWeight: 800,
                    color: '#1a202c',
                    mb: 3,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em'
                  }}
                >
                  Professional
                  <Box component="span" sx={{ color: '#047857', display: 'block' }}>
                    Waste Management
                  </Box>
                </Typography>
                
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#64748b',
                    mb: 4,
                    lineHeight: 1.6,
                    fontSize: { xs: '1.1rem', sm: '1.3rem' },
                    fontWeight: 400
                  }}
                >
                  Transform your waste operations with our comprehensive suite of 
                  intelligent solutions designed for modern municipalities and enterprises.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      backgroundColor: '#047857',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(4, 120, 87, 0.3)',
                      '&:hover': {
                        backgroundColor: '#059669',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(4, 120, 87, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#047857',
                      color: '#047857',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#059669',
                        backgroundColor: 'rgba(4, 120, 87, 0.05)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View Demo
                  </Button>
                </Stack>

                {/* Key Stats */}
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {[
                    { number: '500+', label: 'Cities Served' },
                    { number: '30%', label: 'Cost Reduction' },
                    { number: '99.9%', label: 'Uptime' }
                  ].map((stat, index) => (
                    <Box key={index} sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#047857', mb: 0.5 }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.875rem' }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
            
          </Grid>
        </Container>
      </Box>

      {/* Services Section - Professional Cards */}
      <Box sx={{ backgroundColor: 'white', py: { xs: 10, md: 16 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Chip
              icon={<Engineering />}
              label="Our Services"
              sx={{
                backgroundColor: '#047857',
                color: 'white',
                mb: 3,
                fontWeight: 'bold',
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                height: 'auto'
              }}
            />
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#1a202c',
                mb: 4,
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              Comprehensive Solutions
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                color: '#64748b',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              From smart monitoring to AI-powered optimization, we provide end-to-end 
              waste management solutions that drive efficiency and sustainability.
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} lg={4} xl={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: 3,
                    border: `1px solid ${service.color}20`,
                    boxShadow: `
                      0 2px 4px -1px rgba(0, 0, 0, 0.1),
                      0 1px 2px -1px rgba(0, 0, 0, 0.06),
                      0 0 0 1px rgba(0, 0, 0, 0.05)
                    `,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateX(-3deg) rotateY(3deg) translateY(-8px)',
                      boxShadow: `
                        0 15px 30px -8px rgba(0, 0, 0, 0.2),
                        0 0 0 1px ${service.color}40,
                        0 0 15px ${service.color}20
                      `,
                      border: `1px solid ${service.color}`,
                      '& .service-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                        boxShadow: `0 8px 20px ${service.color}40`
                      },
                      '& .service-card-content': {
                        transform: 'translateZ(10px)'
                      }
                    }
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: `linear-gradient(135deg, ${service.color}05 0%, ${service.color}10 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        opacity: 1
                      }
                    }}
                  />
                  
                  <CardContent className="service-card-content" sx={{ 
                    p: 3, 
                    position: 'relative', 
                    zIndex: 1,
                    transition: 'all 0.3s ease',
                    transform: 'translateZ(0)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box>
                      <Box
                        className="service-icon"
                        sx={{
                          width: 60,
                          height: 60,
                          background: `linear-gradient(135deg, ${service.color} 0%, ${service.color}CC 100%)`,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          boxShadow: `
                            0 4px 12px ${service.color}30,
                            0 2px 6px ${service.color}15,
                            inset 0 1px 0 rgba(255, 255, 255, 0.2)
                          `,
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`,
                            borderRadius: 3,
                            pointerEvents: 'none'
                          }
                        }}
                      >
                        {React.cloneElement(service.icon, { 
                          sx: { color: 'white', fontSize: 28, filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))' } 
                        })}
                      </Box>
                    
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          color: '#1a202c',
                          mb: 2,
                          fontSize: { xs: '1rem', sm: '1.1rem' },
                          textAlign: 'center',
                          lineHeight: 1.3
                        }}
                      >
                        {service.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#64748b',
                          lineHeight: 1.5,
                          mb: 2,
                          fontSize: { xs: '0.8rem', sm: '0.9rem' },
                          textAlign: 'center'
                        }}
                      >
                        {service.description}
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <List sx={{ py: 0 }}>
                          {service.features.slice(0, 3).map((feature, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                              <ListItemIcon sx={{ minWidth: 24 }}>
                                <CheckCircle sx={{ fontSize: 14, color: service.color }} />
                              </ListItemIcon>
                              <ListItemText 
                                primary={feature}
                                primaryTypographyProps={{ 
                                  variant: 'body2',
                                  fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                  fontWeight: 500,
                                  color: '#374151'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Box>
                    
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: service.color,
                            fontWeight: 700,
                            mb: 2,
                            fontSize: { xs: '0.8rem', sm: '0.9rem' }
                          }}
                        >
                          {service.price}
                        </Typography>
                        <Button 
                          variant="contained"
                          size="small"
                          fullWidth
                          sx={{
                            backgroundColor: service.color,
                            color: 'white',
                            py: 1.5,
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: `
                              0 3px 8px ${service.color}40,
                              0 1px 3px ${service.color}20,
                              inset 0 1px 0 rgba(255, 255, 255, 0.2)
                            `,
                            border: `1px solid ${service.color}60`,
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
                              borderRadius: 2,
                              pointerEvents: 'none'
                            },
                            '&:hover': {
                              backgroundColor: service.color,
                              transform: 'translateY(-2px) scale(1.02)',
                              boxShadow: `
                                0 5px 15px ${service.color}50,
                                0 2px 6px ${service.color}30,
                                inset 0 1px 0 rgba(255, 255, 255, 0.3)
                              `,
                              '&::before': {
                                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`
                              }
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          Learn More
                        </Button>
                      </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section - Professional Design */}
      <Box sx={{ 
        backgroundColor: '#f8fafc', 
        py: { xs: 10, md: 16 },
        position: 'relative'
      }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 10% 20%, rgba(4, 120, 87, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 90% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
            `,
            zIndex: 0
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Chip
              icon={<Business />}
              label="Pricing Plans"
              sx={{
                backgroundColor: '#047857',
                color: 'white',
                mb: 3,
                fontWeight: 'bold',
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                height: 'auto'
              }}
            />
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#1a202c',
                mb: 4,
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              Choose Your Plan
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                color: '#64748b',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Flexible pricing options designed to scale with your organization's needs
            </Typography>
          </Box>
          
          <Grid container spacing={5} justifyContent="center" sx={{ maxWidth: '1200px', mx: 'auto' }}>
            {plans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    position: 'relative',
                    backgroundColor: 'white',
                    borderRadius: 4,
                    border: plan.popular ? '3px solid #047857' : '2px solid #e2e8f0',
                    boxShadow: plan.popular 
                      ? `
                        0 20px 40px rgba(4, 120, 87, 0.2),
                        0 8px 16px rgba(4, 120, 87, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1)
                      ` 
                      : `
                        0 8px 16px rgba(0, 0, 0, 0.1),
                        0 2px 4px rgba(0, 0, 0, 0.06),
                        inset 0 1px 0 rgba(255, 255, 255, 0.05)
                      `,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    transform: 'perspective(1000px) rotateX(0deg)',
                    '&:hover': {
                      transform: 'perspective(1000px) rotateX(-3deg) translateY(-12px)',
                      boxShadow: plan.popular 
                        ? `
                          0 30px 60px rgba(4, 120, 87, 0.3),
                          0 15px 30px rgba(4, 120, 87, 0.2),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)
                        ` 
                        : `
                          0 20px 40px rgba(0, 0, 0, 0.15),
                          0 8px 20px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.1)
                        `
                    }
                  }}
                >
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -1,
                        left: -1,
                        right: -1,
                        height: 4,
                        background: 'linear-gradient(90deg, #047857 0%, #059669 100%)',
                        zIndex: 1
                      }}
                    />
                  )}
                  
                  {plan.popular && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 20,
                        right: 20,
                        backgroundColor: '#047857',
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        zIndex: 2
                      }}
                    >
                      Most Popular
                    </Box>
                  )}
                  
                  <CardContent sx={{ p: 5, textAlign: 'center' }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: plan.popular ? '#047857' : '#1a202c',
                        mb: 2,
                        fontSize: { xs: '1.5rem', sm: '1.75rem' }
                      }}
                    >
                      {plan.name}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          color: plan.popular ? '#047857' : '#1a202c',
                          fontWeight: 800,
                          mb: 1,
                          fontSize: { xs: '2.5rem', sm: '3rem' }
                        }}
                      >
                        {plan.price}
                      </Typography>
                      {plan.price !== 'Custom' && (
                        <Typography variant="body2" color="text.secondary">
                          per month
                        </Typography>
                      )}
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 4,
                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                        lineHeight: 1.6
                      }}
                    >
                      {plan.description}
                    </Typography>
                    
                    <List sx={{ textAlign: 'left', mb: 4 }}>
                      {plan.features.map((feature, idx) => (
                        <ListItem key={idx} sx={{ py: 1.5, px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircle sx={{ 
                              fontSize: 20, 
                              color: plan.popular ? '#047857' : '#10b981' 
                            }} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={feature}
                            primaryTypographyProps={{ 
                              variant: 'body1',
                              fontSize: { xs: '0.9rem', sm: '1rem' },
                              fontWeight: 500,
                              color: '#374151'
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  
                  <CardActions sx={{ p: 5, pt: 0 }}>
                    <Button
                      variant={plan.popular ? 'contained' : 'outlined'}
                      fullWidth
                      size="large"
                      sx={{
                        backgroundColor: plan.popular ? '#047857' : 'transparent',
                        borderColor: '#047857',
                        color: plan.popular ? 'white' : '#047857',
                        fontWeight: 600,
                        py: 2,
                        fontSize: '1rem',
                        borderRadius: 2,
                        textTransform: 'none',
                        boxShadow: plan.popular ? '0 4px 12px rgba(4, 120, 87, 0.3)' : 'none',
                        '&:hover': {
                          backgroundColor: plan.popular ? '#059669' : '#047857',
                          color: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: plan.popular 
                            ? '0 6px 16px rgba(4, 120, 87, 0.4)' 
                            : '0 4px 12px rgba(4, 120, 87, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section - Professional Design */}
      <Box sx={{ backgroundColor: 'white', py: { xs: 10, md: 16 } }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Chip
              icon={<Speed />}
              label="Why Choose Us"
              sx={{
                backgroundColor: '#047857',
                color: 'white',
                mb: 3,
                fontWeight: 'bold',
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                height: 'auto'
              }}
            />
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#1a202c',
                mb: 4,
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              Why Choose Our Services?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                color: '#64748b',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Our comprehensive platform combines cutting-edge technology with proven 
              methodologies to deliver exceptional results for municipalities and enterprises.
            </Typography>
          </Box>

          <Grid container spacing={8} alignItems="center" sx={{ maxWidth: '1200px', mx: 'auto' }}>
            <Grid item xs={12} lg={6}>
              <Box sx={{ pr: { xs: 0, lg: 6 } }}>
                <Stack spacing={5}>
                  {[
                    { 
                      icon: <TrendingUp />, 
                      title: 'Proven ROI',
                      description: 'Average 30% cost reduction with measurable efficiency gains',
                      color: '#10b981'
                    },
                    { 
                      icon: <Public />, 
                      title: 'Environmental Impact',
                      description: 'Comprehensive tracking and reporting for sustainability goals',
                      color: '#3b82f6'
                    },
                    { 
                      icon: <Security />, 
                      title: 'Enterprise Security',
                      description: 'Bank-grade security with full data protection compliance',
                      color: '#8b5cf6'
                    }
                  ].map((benefit, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'white',
                        borderColor: benefit.color,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: benefit.color,
                          borderRadius: 3,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 3,
                          flexShrink: 0,
                          boxShadow: `0 4px 12px ${benefit.color}30`
                        }}
                      >
                        {React.cloneElement(benefit.icon, { 
                          sx: { color: 'white', fontSize: 24 } 
                        })}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700,
                            color: '#1a202c',
                            mb: 1,
                            fontSize: { xs: '1.1rem', sm: '1.25rem' }
                          }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#64748b',
                            lineHeight: 1.6,
                            fontSize: { xs: '0.9rem', sm: '1rem' }
                          }}
                        >
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Grid>
            
            <Grid item xs={12} lg={6}>
              <Box sx={{ 
                position: 'relative',
                height: { xs: '400px', lg: '500px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 6, 
                    textAlign: 'center',
                    backgroundColor: 'white',
                    borderRadius: 4,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Background decoration */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
                      opacity: 0.1,
                      filter: 'blur(60px)'
                    }}
                  />
                  
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      backgroundColor: '#047857',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 4,
                      boxShadow: '0 8px 24px rgba(4, 120, 87, 0.3)',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <Nature sx={{ fontSize: 60, color: 'white' }} />
                  </Box>
                  
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#1a202c',
                      mb: 3,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    Sustainable Future
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#64748b',
                      lineHeight: 1.7,
                      fontSize: { xs: '0.95rem', sm: '1.1rem' },
                      maxWidth: '400px',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    Join us in building a more sustainable future through intelligent 
                    waste management solutions that benefit communities and the environment.
                  </Typography>
                  
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      backgroundColor: '#047857',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      mt: 4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(4, 120, 87, 0.3)',
                      '&:hover': {
                        backgroundColor: '#059669',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(4, 120, 87, 0.4)'
                      },
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    Learn More
                  </Button>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section - Smart Waste Management Style */}
      <Box sx={{ 
        backgroundColor: '#f8fafc',
        py: { xs: 10, md: 16 },
        position: 'relative'
      }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 20% 20%, rgba(4, 120, 87, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
            `,
            zIndex: 0
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Chip
              icon={<TrendingUp />}
              label="Our Impact"
              sx={{
                backgroundColor: '#047857',
                color: 'white',
                mb: 3,
                fontWeight: 'bold',
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                height: 'auto'
              }}
            />
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#1a202c',
                mb: 4,
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              Proven Results
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                color: '#64748b',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Numbers that speak for our success in transforming waste management
            </Typography>
          </Box>
          
          <Grid container spacing={5} justifyContent="center" sx={{ maxWidth: '1400px', mx: 'auto' }}>
            {[
              { 
                number: '500+', 
                label: 'Cities Served', 
                icon: <Public />,
                color: '#047857',
                description: 'Municipalities transformed'
              },
              { 
                number: '10K+', 
                label: 'Bins Monitored', 
                icon: <LocationOn />,
                color: '#3b82f6',
                description: 'Smart sensors deployed'
              },
              { 
                number: '30%', 
                label: 'Cost Reduction', 
                icon: <TrendingUp />,
                color: '#8b5cf6',
                description: 'Average savings achieved'
              },
              { 
                number: '99.9%', 
                label: 'Uptime', 
                icon: <Security />,
                color: '#f59e0b',
                description: 'System reliability'
              }
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                  borderRadius: 4,
                  p: 4,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `
                    0 10px 25px rgba(4, 120, 87, 0.2),
                    0 4px 10px rgba(4, 120, 87, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `
                      0 20px 40px rgba(4, 120, 87, 0.3),
                      0 8px 20px rgba(4, 120, 87, 0.2),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)
                    `
                  }
                }}>
                  {/* Icon in top right */}
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 40,
                    height: 40,
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    {React.cloneElement(stat.icon, { 
                      sx: { fontSize: 20, color: 'white' } 
                    })}
                  </Box>
                  
                  {/* Main content */}
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800, 
                        color: 'white',
                        mb: 1,
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        mb: 1,
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        fontWeight: 600,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {stat.label}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: { xs: '0.75rem', sm: '0.875rem' },
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {stat.description}
                    </Typography>
                  </Box>
                  
                  {/* Subtle background pattern */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
                      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)
                    `,
                    pointerEvents: 'none'
                  }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section - Professional Design */}
      <Box sx={{ 
        backgroundColor: '#f8fafc', 
        py: { xs: 10, md: 16 },
        position: 'relative'
      }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 20% 20%, rgba(4, 120, 87, 0.03) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.03) 0%, transparent 50%)
            `,
            zIndex: 0
          }}
        />
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 12 } }}>
            <Chip
              icon={<Star />}
              label="Client Testimonials"
              sx={{
                backgroundColor: '#047857',
                color: 'white',
                mb: 3,
                fontWeight: 'bold',
                fontSize: '0.875rem',
                px: 2,
                py: 1,
                height: 'auto'
              }}
            />
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#1a202c',
                mb: 4,
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              What Our Clients Say
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                color: '#64748b',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                fontWeight: 400
              }}
            >
              Hear from municipalities and organizations that have transformed their 
              waste management operations with our solutions.
            </Typography>
          </Box>
          
          <Box sx={{
            display: 'grid',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            maxWidth: '1000px',
            mx: 'auto',
            p: 2
          }}>
            {[
              {
                name: 'Sarah Johnson',
                role: 'City Manager, Greenville',
                content: 'EcoSmart has revolutionized our waste collection efficiency. We\'ve reduced costs by 35% while improving service quality significantly.',
                rating: 5,
                avatar: 'SJ'
              },
              {
                name: 'Michael Chen',
                role: 'Operations Director, Metro City',
                content: 'The AI-powered route optimization is incredible. Our collection teams are more efficient than ever before.',
                rating: 5,
                avatar: 'MC'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Environmental Officer, EcoTown',
                content: 'The real-time monitoring and analytics help us make data-driven decisions for better environmental outcomes.',
                rating: 5,
                avatar: 'ER'
              }
            ].map((testimonial, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'stretch',
                  aspectRatio: '1 / 1',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #047857'
                  }
                }}
              >
                {/* Quote decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    backgroundColor: '#047857',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.1,
                    zIndex: 1
                  }}
                >
                  <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>"</Typography>
                </Box>
                
                <Box sx={{ 
                  p: 3, 
                  position: 'relative', 
                  zIndex: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                  textAlign: 'center'
                }}>
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', mb: 2, gap: 0.5, justifyContent: 'center' }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#fbbf24', fontSize: '0.9rem' }} />
                      ))}
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#374151',
                        mb: 2,
                        lineHeight: 1.4,
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        fontStyle: 'italic',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      "{testimonial.content}"
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 'auto' }}>
                    <Avatar
                      sx={{
                        backgroundColor: '#047857',
                        color: 'white',
                        width: 32,
                        height: 32,
                        mb: 1,
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 700, 
                        color: '#1a202c', 
                        mb: 0.5,
                        fontSize: { xs: '0.75rem', sm: '0.85rem' }
                      }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#64748b',
                        fontSize: { xs: '0.65rem', sm: '0.75rem' }
                      }}
                    >
                      {testimonial.role}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTA Section - Professional Design */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
        py: { xs: 12, md: 20 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Professional Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)
            `,
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Chip
              icon={<ArrowForward />}
              label="Get Started Today"
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                mb: 4,
                fontWeight: 'bold',
                fontSize: '0.875rem',
                px: 3,
                py: 1.5,
                height: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            />
            
            <Typography 
              variant="h2" 
              sx={{ 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                fontWeight: 800,
                color: 'white',
                mb: 4,
                lineHeight: 1.1,
                letterSpacing: '-0.02em'
              }}
            >
              Ready to Transform Your
              <Box component="span" sx={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)' }}>
                Waste Management?
              </Box>
            </Typography>
            
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)',
                mb: 6,
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: 'auto',
                fontSize: { xs: '1.1rem', sm: '1.3rem' },
                fontWeight: 400
              }}
            >
              Join hundreds of cities and organizations already using our smart 
              waste management solutions to reduce costs and improve efficiency.
            </Typography>
            
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              justifyContent="center"
              sx={{ mb: 6 }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: 'white',
                  color: '#047857',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    backgroundColor: '#f8fafc',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)'
                  },
                  transition: 'all 0.3s ease',
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: '200px'
                }}
              >
                Get Started Today
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: 2,
                  px: 6,
                  py: 2.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.2)'
                  },
                  transition: 'all 0.3s ease',
                  width: { xs: '100%', sm: 'auto' },
                  minWidth: '200px'
                }}
              >
                Schedule Demo
              </Button>
            </Stack>

            {/* Trust indicators - Smart Waste Management Style */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: 4,
              flexWrap: 'wrap',
              mt: 8,
              maxWidth: '1000px',
              mx: 'auto'
            }}>
              {[
                { number: '500+', label: 'Cities Served', icon: <Public /> },
                { number: '10K+', label: 'Bins Monitored', icon: <LocationOn /> },
                { number: '30%', label: 'Cost Reduction', icon: <TrendingUp /> },
                { number: '99.9%', label: 'Uptime', icon: <Security /> }
              ].map((stat, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    p: 3,
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  {/* Icon */}
                  <Box sx={{
                    width: 40,
                    height: 40,
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    {React.cloneElement(stat.icon, { 
                      sx: { fontSize: 20, color: 'white' } 
                    })}
                  </Box>
                  
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 800, 
                      color: 'white', 
                      mb: 0.5,
                      fontSize: { xs: '1.5rem', sm: '2rem' },
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      fontWeight: 500,
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Services;
