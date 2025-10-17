import React from 'react';
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
  Paper,
  IconButton,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  TrendingDown,
  Refresh,
  FilterList,
  Search,
  BarChart,
  PieChart,
  Timeline
} from '@mui/icons-material';

const AdminAnalytics = () => {

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
                  Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Comprehensive insights and performance metrics for your waste management system.
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<Refresh />}
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
                  Refresh Data
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Analytics />}
                  sx={{ 
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #059669, #047857)'
                    }
                  }}
                >
                  Export Report
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Analytics Cards */}
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
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                        +12.5%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Collection Efficiency
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
                      <BarChart />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                        2,847
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Users
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
                      <Timeline />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        15.2K kg
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Waste Collected
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
                    <Avatar sx={{ bgcolor: '#8b5cf6', mr: 2 }}>
                      <PieChart />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                        94.2%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        System Uptime
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Placeholder */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardHeader
                  title="Collection Trends"
                  action={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton>
                        <FilterList />
                      </IconButton>
                    </Box>
                  }
                />
                <CardContent>
                  <Box sx={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6" color="text.secondary">
                      Chart visualization will be implemented here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardHeader
                  title="Waste Distribution"
                  action={
                    <IconButton>
                      <FilterList />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Box sx={{ 
                    height: 300, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6" color="text.secondary">
                      Pie chart will be implemented here
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
    </Box>
  );
};

export default AdminAnalytics;
