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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  IconButton,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Recycling,
  Schedule,
  TrendingUp,
  Notifications,
  LocationOn,
  CalendarToday,
  CheckCircle,
  Warning,
  Info,
  Add,
  MoreVert,
  RequestPage
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Mock data - replace with actual API calls
  const stats = [
    { title: 'Waste Collected', value: '45.2 kg', change: '+8%', color: 'success.main', icon: <Recycling /> },
    { title: 'Next Collection', value: 'Tomorrow', change: '9:00 AM', color: 'info.main', icon: <Schedule /> },
    { title: 'Points Earned', value: '1,250', change: '+50', color: 'warning.main', icon: <TrendingUp /> },
    { title: 'Recycling Rate', value: '85%', change: '+5%', color: 'primary.main', icon: <Recycling /> }
  ];

  const upcomingCollections = [
    { id: 1, type: 'Organic', date: 'Tomorrow', time: '9:00 AM', status: 'scheduled' },
    { id: 2, type: 'Recyclables', date: 'Friday', time: '2:00 PM', status: 'scheduled' },
    { id: 3, type: 'General', date: 'Next Monday', time: '10:00 AM', status: 'scheduled' }
  ];

  const recentActivities = [
    { id: 1, type: 'success', message: 'Waste collection completed', time: '2 days ago' },
    { id: 2, type: 'info', message: 'New collection scheduled', time: '1 week ago' },
    { id: 3, type: 'warning', message: 'Reminder: Separate your waste', time: '2 weeks ago' },
    { id: 4, type: 'success', message: 'Points earned for recycling', time: '3 weeks ago' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle color="success" />;
      case 'info': return <Info color="info" />;
      case 'warning': return <Warning color="warning" />;
      default: return <Info color="info" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box className="dashboard-content-stable" sx={{ 
      flex: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: '20px',
      background: '#ffffff', // Changed to white background
      minHeight: '100vh',
      position: 'relative',
      left: 0,
      top: 0,
      marginLeft: 0,  // Ensure no left margin
      marginRight: 0,  // Ensure no right margin
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

      <Container maxWidth="xl" sx={{ 
        px: { xs: 2, sm: 3 },
        width: '100%',
        textAlign: 'left',
        marginLeft: 0,
        marginRight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#1f2937' }}>
            Welcome Back{user?.name ? `, ${user.name}` : user?.user?.name ? `, ${user.user.name}` : ''}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your waste management activities and environmental impact.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ 
          mb: 4, 
          justifyContent: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          marginLeft: 0,
          marginRight: 0
        }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '180px',
                minWidth: '200px',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }
              }}>
                <CardContent sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ backgroundColor: stat.color, width: 50, height: 50 }}>
                      {stat.icon}
                    </Avatar>
                    <Chip 
                      label={stat.change} 
                      color="success" 
                      size="small"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '12px',
                        height: '24px',
                        backgroundColor: '#27ae60',
                        color: 'white'
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h4" component="div" sx={{ 
                      fontWeight: 'bold', 
                      mb: 1, 
                      fontSize: '28px',
                      lineHeight: 1.2
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '14px' }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ 
          justifyContent: 'flex-start',
          display: 'flex',
          flexWrap: 'wrap',
          width: '100%',
          marginLeft: 0,
          marginRight: 0
        }}>
          {/* Upcoming Collections */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '400px',
              minWidth: '200px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }
            }}>
              <CardHeader
                title="Upcoming Collections"
                action={
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {upcomingCollections.map((collection, index) => (
                    <React.Fragment key={collection.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: 'success.light' }}>
                            <Recycling />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {collection.type} Waste
                              </Typography>
                              <Chip 
                                label={collection.status} 
                                color={getStatusColor(collection.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {collection.date} at {collection.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < upcomingCollections.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '400px',
              minWidth: '200px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }
            }}>
              <CardHeader
                title="Recent Activities"
                action={
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <List sx={{ p: 0 }}>
                  {recentActivities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: 'transparent' }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.message}
                          secondary={activity.time}
                        />
                      </ListItem>
                      {index < recentActivities.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Environmental Impact */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '400px',
              minWidth: '200px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }
            }}>
              <CardHeader
                title="Environmental Impact"
                sx={{ pb: 1 }}
              />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      CO2 Saved
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      12.5 kg
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Recycling Rate
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      85%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={85} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Waste Reduction
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      60%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={60} 
                    color="warning"
                    sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Card sx={{ 
              height: '400px',
              minWidth: '200px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }
            }}>
              <CardHeader
                title="Quick Actions"
                sx={{ pb: 1 }}
              />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      startIcon={<RequestPage />}
                      fullWidth
                      onClick={() => navigate('/resident/requests')}
                      sx={{ 
                        py: 2,
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #059669, #047857)'
                        }
                      }}
                    >
                      Request Bin
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<Add />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Schedule Collection
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<LocationOn />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Find Drop-off
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<CalendarToday />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      View Calendar
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ResidentDashboard;
