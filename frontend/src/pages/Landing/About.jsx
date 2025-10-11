import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Paper,
  Chip,
  Button,
  useTheme
} from '@mui/material';
import { 
  Nature, 
  Public, 
  TrendingUp,
  Group,
  Security,
  Support,
  Recycling,
  Eco,
  Business,
  Engineering
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();

  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      avatar: 'JS',
      description: '10+ years in waste management technology',
      icon: <Business sx={{ fontSize: 20, color: '#6b7280' }} />
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      avatar: 'SJ',
      description: 'Expert in IoT and smart city solutions',
      icon: <Engineering sx={{ fontSize: 20, color: '#3b82f6' }} />
    },
    {
      name: 'Mike Chen',
      role: 'Lead Developer',
      avatar: 'MC',
      description: 'Full-stack developer with AI expertise',
      icon: <Recycling sx={{ fontSize: 20, color: '#8b5cf6' }} />
    }
  ];

  const values = [
    {
      icon: <Nature sx={{ fontSize: 40, color: '#6b7280' }} />,
      title: 'Sustainability',
      description: 'Committed to environmental protection and sustainable waste management practices.',
      color: '#6b7280',
      bg: 'linear-gradient(45deg, #d1fae5, #a7f3d0)'
    },
    {
      icon: <Public sx={{ fontSize: 40, color: '#3b82f6' }} />,
      title: 'Community Impact',
      description: 'Building cleaner, healthier communities through innovative waste management solutions.',
      color: '#3b82f6',
      bg: 'linear-gradient(45deg, #dbeafe, #bfdbfe)'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#8b5cf6' }} />,
      title: 'Innovation',
      description: 'Continuously advancing technology to solve complex waste management challenges.',
      color: '#8b5cf6',
      bg: 'linear-gradient(45deg, #e9d5ff, #ddd6fe)'
    },
    {
      icon: <Group sx={{ fontSize: 40, color: '#f59e0b' }} />,
      title: 'Collaboration',
      description: 'Working closely with municipalities, businesses, and residents for better outcomes.',
      color: '#f59e0b',
      bg: 'linear-gradient(45deg, #fef3c7, #fde68a)'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#ef4444' }} />,
      title: 'Data Security',
      description: 'Protecting user data with enterprise-grade security and privacy measures.',
      color: '#ef4444',
      bg: 'linear-gradient(45deg, #fee2e2, #fecaca)'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#22c55e' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock technical support and maintenance for all our clients.',
      color: '#22c55e',
      bg: 'linear-gradient(45deg, #dcfce7, #bbf7d0)'
    }
  ];

  const stats = [
    { number: '50+', label: 'Cities Served', color: 'success.main' },
    { number: '100K+', label: 'Bins Monitored', color: 'info.main' },
    { number: '30%', label: 'Cost Reduction', color: 'primary.main' },
    { number: '99.9%', label: 'Uptime', color: 'secondary.main' }
  ];

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
      {/* Hero Section - Full Background Image */}
      <Box sx={{ position: 'relative', minHeight: { xs: '60vh', md: '80vh' } }}>
        {/* Background Image */}
        <Box
          component="img"
          src={require('../../assets/about.jpg')}
          alt="About EcoSmart Waste Management"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(15px)',
            zIndex: 0
          }}
        />
        
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
            zIndex: 1
          }}
        />
        
        {/* Content */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 8, md: 12 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'flex-start',
            minHeight: { xs: '60vh', md: '80vh' },
            color: 'white'
          }}>
               <Typography 
                 variant="h2" 
                 component="h1" 
                 sx={{ 
                   fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                   fontWeight: 'bold',
                   color: '#047857',
                   mb: 2,
                   lineHeight: 1.2,
                   textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                 }}
               >
                 About Us
               </Typography>
            
             <Typography 
               variant="h4" 
               sx={{ 
                 fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                 fontWeight: 'bold',
                 color: 'white',
                 mb: 3,
                 lineHeight: 1.3,
                 textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
               }}
             >
               EcoSmart Waste Management is revolutionizing urban sustainability by providing innovative smart waste collection solutions, IoT-powered monitoring systems, and AI-driven analytics to cities worldwide, helping them achieve environmental goals while reducing operational costs and improving citizen satisfaction.
             </Typography>
            
            
            <Button
              variant="contained"
              size="large"
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: '#047857',
                border: '2px solid #047857',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  background: 'rgba(4, 120, 87, 0.3)',
                  border: '2px solid #059669',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(4, 120, 87, 0.3)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Join Us →
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Smart Solutions Cards Section */}
      <Box sx={{ backgroundColor: '#f8fafc', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 3,
                lineHeight: 1.2
              }}
            >
              Smart Solutions
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: { xs: '1rem', sm: '1.25rem' },
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto'
              }}
            >
              We are always working to provide you the best features in all aspects of waste management.
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                icon: <Recycling sx={{ fontSize: 40 }} />,
                title: 'Smart Collection',
                description: 'AI-powered waste collection optimization'
              },
              {
                icon: <Nature sx={{ fontSize: 40 }} />,
                title: 'IoT Sensors',
                description: 'Real-time monitoring and analytics'
              },
              {
                icon: <TrendingUp sx={{ fontSize: 40 }} />,
                title: 'Route Optimization',
                description: 'Efficient collection route planning'
              },
              {
                icon: <Security sx={{ fontSize: 40 }} />,
                title: 'Data Analytics',
                description: 'Predictive insights and reporting'
              }
            ].map((solution, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    backgroundColor: '#f0f9ff',
                    borderRadius: 3,
                    border: '1px solid #e0f2fe',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                      backgroundColor: '#f8fafc'
                    }
                  }}
                >
                  <CardContent sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: '#047857',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
                      }}
                    >
                      {React.cloneElement(solution.icon, { 
                        sx: { color: 'white', fontSize: 40 } 
                      })}
                    </Box>
                    
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#6b7280',
                        mb: 2,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}
                    >
                      {solution.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }}
                    >
                      {solution.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
         </Grid>
         </Container>
       </Box>

       {/* Benefits Section - Full Background Image */}
       <Box sx={{ position: 'relative', minHeight: { xs: '60vh', md: '80vh' } }}>
         {/* Background Image */}
         <Box
           component="img"
           src={require('../../assets/benifits.jpg')}
           alt="EcoSmart Benefits"
           sx={{
             position: 'absolute',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             objectFit: 'cover',
             filter: 'blur(8px)',
             zIndex: 0
           }}
         />
         
         {/* Overlay */}
         <Box
           sx={{
             position: 'absolute',
             top: 0,
             left: 0,
             width: '100%',
             height: '100%',
             background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
             zIndex: 1
           }}
         />
         
         {/* Content */}
         <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 8, md: 12 } }}>
           <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
             <Typography 
               variant="h4" 
               sx={{ 
                 fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                 fontWeight: 'bold',
                 color: '#6b7280',
                 mb: 2,
                 textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
               }}
             >
               Our Benefits
             </Typography>
             
             <Typography 
               variant="h3" 
               sx={{ 
                 fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                 fontWeight: 'bold',
                 color: 'white',
                 mb: 3,
                 lineHeight: 1.2,
                 textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
               }}
             >
               By Joining EcoSmart Platform, One Can Avail a Lot Of Benefits.
             </Typography>
             
             <Typography 
               variant="body1" 
               sx={{ 
                 fontSize: { xs: '1rem', sm: '1.125rem' },
                 lineHeight: 1.6,
                 color: 'rgba(255, 255, 255, 0.9)',
                 maxWidth: '600px',
                 mx: 'auto',
                 textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
               }}
             >
               Install our top-rated waste management system to your city infrastructure and get access to 
               Smart Sensors, AI Analytics, and the best optimization algorithms.
             </Typography>
           </Box>
        
        <Grid container spacing={2} justifyContent="center">
          {[
            {
              number: '01',
              title: 'Standardization',
              description: 'Difficulty in gauging training experiences in a global workplace can be overcome with our standardized approach.'
            },
            {
              number: '02',
              title: 'Reduced Costs',
              description: 'No cost to reproduce materials thanks to digital solutions and automated systems.'
            },
            {
              number: '03',
              title: 'More Customization',
              description: 'Learning is not one-size-fits-all. Our system adapts to your specific needs.'
            },
            {
              number: '04',
              title: 'Affordable Pricing',
              description: 'Cost-effective solutions that scale with your organization size and requirements.'
            },
            {
              number: '05',
              title: 'User Satisfaction',
              description: 'We aim for high satisfaction rates for better user retention and engagement.'
            },
            {
              number: '06',
              title: 'Smart Analytics',
              description: 'Custom analytics and reporting as an effective delivery method for insights.'
            }
          ].map((benefit, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ maxWidth: { xs: '100%', sm: '300px', md: '280px' } }}>
               <Card 
                 sx={{ 
                   height: '100%',
                   aspectRatio: '1/1',
                   backgroundColor: 'rgba(255, 255, 255, 0.9)',
                   backdropFilter: 'blur(10px)',
                   border: '1px solid rgba(255, 255, 255, 0.2)',
                   borderLeft: '4px solid #6b7280',
                   borderRadius: 2,
                   display: 'flex',
                   flexDirection: 'column',
                   justifyContent: 'center',
                   transition: 'all 0.3s ease',
                   '&:hover': {
                     transform: 'translateY(-4px)',
                     boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                     backgroundColor: 'rgba(255, 255, 255, 0.95)'
                   }
                 }}
               >
                <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#6b7280',
                        mb: 1,
                        fontSize: { xs: '0.9rem', sm: '1rem' }
                      }}
                    >
                      {benefit.number} {benefit.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        lineHeight: 1.4,
                        mb: 1,
                        fontSize: { xs: '0.75rem', sm: '0.8rem' }
                      }}
                    >
                      {benefit.description}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="text"
                    sx={{
                      color: '#6b7280',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      p: 0,
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      '&:hover': {
                        backgroundColor: 'transparent',
                        color: '#4b5563'
                      }
                    }}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
         </Container>
       </Box>

      {/* Stats Section */}
      <Box sx={{ 
        backgroundColor: '#f8fafc',
        py: { xs: 8, md: 12 }
      }}>
        <Container maxWidth="lg">
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
    </Box>
  );
};

export default About;
