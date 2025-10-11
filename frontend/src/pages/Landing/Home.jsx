import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  useTheme,
  Chip
} from '@mui/material';
import {
  Recycling,
  LocalShipping,
  Analytics,
  Security,
  Nature,
  Speed,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <Recycling sx={{ fontSize: 40, color: '#10b981' }} />,
      title: 'Intelligent Sorting',
      description: 'Advanced AI classification with 99% accuracy for optimal waste categorization.'
    },
    {
      icon: <LocalShipping sx={{ fontSize: 40, color: '#3b82f6' }} />,
      title: 'Smart Routing',
      description: 'Optimized collection routes save 40% fuel and reduce carbon emissions.'
    },
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      title: 'Real-time Analytics',
      description: 'Comprehensive dashboards with waste collection data and performance metrics.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#f59e0b' }} />,
      title: 'Secure & Compliant',
      description: 'Enterprise-grade security with audit logs and compliance reporting.'
    },
    {
      icon: <Nature sx={{ fontSize: 40, color: '#22c55e' }} />,
      title: 'Carbon Neutral',
      description: 'Reduce emissions by 60% with smart systems and sustainable practices.'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: '#ef4444' }} />,
      title: '24/7 Monitoring',
      description: 'High-performance system with 99.9% uptime and real-time notifications.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Active Users', color: 'success.main' },
    { number: '50K+', label: 'Waste Collected', color: 'info.main' },
    { number: '99%', label: 'Accuracy Rate', color: 'primary.main' },
    { number: '24/7', label: 'Support', color: 'secondary.main' }
  ];

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
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
          zIndex: 0
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 80,
            left: 40,
            width: 288,
            height: 288,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #a7f3d0, #6ee7b7)',
            filter: 'blur(40px)',
            opacity: 0.3,
            animation: 'pulse 3s ease-in-out infinite'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 160,
            right: 40,
            width: 384,
            height: 384,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #bfdbfe, #93c5fd)',
            filter: 'blur(40px)',
            opacity: 0.3,
            animation: 'pulse 3s ease-in-out infinite 1s'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -32,
            left: 80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #a7f3d0, #34d399)',
            filter: 'blur(40px)',
            opacity: 0.3,
            animation: 'pulse 3s ease-in-out infinite 2s'
          }}
        />
      </Box>

      {/* Hero Section */}
      <Box sx={{ position: 'relative', zIndex: 1, py: { xs: 6, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: { xs: 4, md: 8 },
            alignItems: 'center'
          }}>
            <Box sx={{ order: { xs: 2, lg: 1 } }}>
              <Chip
                icon={<TrendingUp />}
                label="Next-Generation Smart Solutions"
                sx={{
                  backgroundColor: 'success.light',
                  color: 'success.dark',
                  mb: 3,
                  fontWeight: 'bold',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              />
              
              <Typography 
                variant="h1" 
                component="h1" 
                sx={{ 
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem', lg: '5rem' },
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  mb: 2,
                  textAlign: { xs: 'center', lg: 'left' }
                }}
              >
                <Box component="span" sx={{ color: 'text.primary' }}>
                  Smart Waste
                </Box>
                <br />
                <Box 
                  component="span" 
                  sx={{ 
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Management
                </Box>
              </Typography>
              
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                  lineHeight: 1.6,
                  maxWidth: { xs: '100%', md: '500px' },
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  textAlign: { xs: 'center', lg: 'left' }
                }}
              >
                Revolutionize your waste collection with intelligent automation, 
                smart routing optimization, and data-driven insights that reduce costs 
                while maximizing environmental impact for a sustainable future.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexDirection: { xs: 'column', sm: 'row' }, 
                mb: 6,
                justifyContent: { xs: 'center', lg: 'flex-start' }
              }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    px: { xs: 3, sm: 4 },
                    py: 2,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 'bold',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #059669, #047857)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)'
                    },
                    transition: 'all 0.3s ease',
                    width: { xs: '100%', sm: 'auto' }
                  }}
                  onClick={() => navigate('/register')}
                >
                  Get Started →
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    borderWidth: 2,
                    px: { xs: 3, sm: 4 },
                    py: 2,
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease',
                    width: { xs: '100%', sm: 'auto' }
                  }}
                  onClick={() => navigate('/login')}
                >
                  Dashboard
                </Button>
              </Box>

              {/* Feature highlights */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
                gap: { xs: 3, sm: 4 },
                pt: 4
              }}>
                {[
                  { icon: <Recycling />, title: 'Intelligent Sorting', desc: 'Advanced AI classification with 99% accuracy', color: '#10b981', bg: 'linear-gradient(45deg, #d1fae5, #a7f3d0)' },
                  { icon: <LocalShipping />, title: 'Smart Routing', desc: 'Optimized collection routes save 40% fuel', color: '#3b82f6', bg: 'linear-gradient(45deg, #dbeafe, #bfdbfe)' },
                  { icon: <Nature />, title: 'Carbon Neutral', desc: 'Reduce emissions by 60% with smart systems', color: '#22c55e', bg: 'linear-gradient(45deg, #dcfce7, #bbf7d0)' }
                ].map((feature, index) => (
                  <Box key={index} sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: { xs: 48, sm: 64 },
                        height: { xs: 48, sm: 64 },
                        borderRadius: 3,
                        background: feature.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.1)' }
                      }}
                    >
                      {React.cloneElement(feature.icon, { sx: { fontSize: { xs: 24, sm: 32 }, color: feature.color } })}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Hero Image Section */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              position: 'relative',
              order: { xs: 1, lg: 2 },
              mb: { xs: 4, lg: 0 }
            }}>
              <Box sx={{ position: 'relative', width: '100%', maxWidth: { xs: 300, sm: 400, lg: 500 } }}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
                    transform: 'hover:scale-105',
                    transition: 'transform 0.5s ease'
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMG1hbmFnZW1lbnQlMjByZWN5Y2xpbmclMjBpbGx1c3RyYXRpb258ZW58MXx8fHwxNzU3ODQzODYwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Waste Management Illustration"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      display: 'block'
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(16, 185, 129, 0.2), transparent)',
                      borderRadius: 4
                    }}
                  />
                </Card>
                
                {/* Floating stats cards - Hidden on mobile for better UX */}
                <Card
                  sx={{
                    position: 'absolute',
                    top: { xs: 16, sm: 32 },
                    left: { xs: -32, sm: -64 },
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    transform: 'rotate(-3deg)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'rotate(0deg)' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'success.main', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                      95%
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      Efficiency
                    </Typography>
                  </Box>
                </Card>
                
                <Card
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 16, sm: 32 },
                    right: { xs: -32, sm: -64 },
                    p: { xs: 1.5, sm: 2 },
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                    transform: 'rotate(3deg)',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'rotate(0deg)' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                      24/7
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      Monitoring
                    </Typography>
                  </Box>
                </Card>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ 
        backgroundColor: '#f0fdf4',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(16, 185, 129, 0.1)',
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 3, md: 4 },
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <Box key={index} sx={{ 
                transition: 'transform 0.3s ease', 
                '&:hover': { transform: 'scale(1.05)' },
                p: { xs: 2, md: 0 }
              }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 'bold', 
                    color: stat.color,
                    mb: 1,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 }, position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}>
            Powerful Features
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ 
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }
          }}>
            Everything you need for efficient waste management
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: { xs: 3, md: 4 }
        }}>
          {features.map((feature, index) => (
            <Card 
              key={index} 
              sx={{ 
                height: '100%', 
                textAlign: 'center', 
                p: { xs: 2, md: 3 },
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                <Box sx={{ mb: { xs: 2, md: 3 } }}>
                  {React.cloneElement(feature.icon, { 
                    sx: { fontSize: { xs: 32, md: 40 } } 
                  })}
                </Box>
                <Typography variant="h6" component="h3" sx={{ 
                  fontWeight: 'bold', 
                  mb: 2,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ 
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.6
                }}>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          py: { xs: 8, md: 12 },
          position: 'relative',
          zIndex: 1
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', px: { xs: 2, sm: 3 } }}>
          <Typography variant="h3" component="h2" sx={{ 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
          }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ 
            mb: { xs: 4, md: 6 },
            fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
            lineHeight: 1.6
          }}>
            Join thousands of organizations already using our waste management system.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center', 
            flexDirection: { xs: 'column', sm: 'row' },
            maxWidth: { xs: '100%', sm: '500px' },
            mx: 'auto'
          }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(45deg, #10b981, #059669)',
                px: { xs: 4, sm: 6 },
                py: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 'bold',
                width: { xs: '100%', sm: 'auto' }
              }}
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: '#10b981',
                color: '#10b981',
                borderWidth: 2,
                px: { xs: 4, sm: 6 },
                py: 2,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 'bold',
                width: { xs: '100%', sm: 'auto' }
              }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
