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
  MoreVert
} from '@mui/icons-material';

const ResidentDashboard = () => {
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
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Resident Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your waste management activities and environmental impact.
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Avatar sx={{ backgroundColor: stat.color, width: 56, height: 56 }}>
                      {stat.icon}
                    </Avatar>
                    <Chip 
                      label={stat.change} 
                      color="success" 
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Upcoming Collections */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
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
            <Card sx={{ height: '100%' }}>
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
            <Card>
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
            <Card>
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
                      startIcon={<Add />}
                      fullWidth
                      sx={{ 
                        py: 2,
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #059669, #047857)'
                        }
                      }}
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
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUp />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      View Progress
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
