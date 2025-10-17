import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
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
  Directions,
  Assignment
} from '@mui/icons-material';

const StaffDashboard = () => {
  const navigate = useNavigate();
  
  // Mock data - replace with actual API calls
  const stats = [
    { title: 'Routes Completed', value: '8/12', change: '+2', color: 'success.main', icon: <Directions /> },
    { title: 'Waste Collected', value: '2.3K kg', change: '+15%', color: 'info.main', icon: <Recycling /> },
    { title: 'Efficiency Rate', value: '92%', change: '+3%', color: 'primary.main', icon: <TrendingUp /> },
    { title: 'Pending Tasks', value: '4', change: '-1', color: 'warning.main', icon: <Assignment /> }
  ];

  const todayRoutes = [
    { id: 1, area: 'Downtown District', time: '9:00 AM', status: 'completed', waste: '450 kg' },
    { id: 2, area: 'Residential Zone A', time: '11:30 AM', status: 'in-progress', waste: '320 kg' },
    { id: 3, area: 'Commercial Area', time: '2:00 PM', status: 'scheduled', waste: '0 kg' },
    { id: 4, area: 'Industrial Zone', time: '4:30 PM', status: 'scheduled', waste: '0 kg' }
  ];

  const recentActivities = [
    { id: 1, type: 'success', message: 'Route completed successfully', time: '30 minutes ago' },
    { id: 2, type: 'info', message: 'New collection request received', time: '1 hour ago' },
    { id: 3, type: 'warning', message: 'Vehicle maintenance reminder', time: '2 hours ago' },
    { id: 4, type: 'success', message: 'Efficiency target achieved', time: '3 hours ago' }
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
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'scheduled': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Staff Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage your collection routes and track your daily performance.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Assignment />}
              onClick={() => navigate('/staff/data-collection')}
              sx={{
                background: 'linear-gradient(45deg, #10b981, #059669)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #059669, #047857)'
                }
              }}
            >
              Data Collection
            </Button>
          </Box>
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
          {/* Today's Routes */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardHeader
                title="Today's Collection Routes"
                action={
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                }
                sx={{ pb: 1 }}
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Area</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Waste Collected</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todayRoutes.map((route) => (
                        <TableRow key={route.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationOn color="action" />
                              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                {route.area}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {route.time}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={route.status} 
                              color={getStatusColor(route.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {route.waste}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={4}>
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

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader
                title="Performance Metrics"
                sx={{ pb: 1 }}
              />
              <Divider />
              <CardContent>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Route Efficiency
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      92%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={92} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' }}
                  />
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Time Management
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      88%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={88} 
                    color="info"
                    sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Safety Score
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      96%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={96} 
                    color="primary"
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
                      Start Route
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<Schedule />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      View Schedule
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<LocationOn />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      Report Issue
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUp />}
                      fullWidth
                      sx={{ py: 2 }}
                    >
                      View Reports
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

export default StaffDashboard;
