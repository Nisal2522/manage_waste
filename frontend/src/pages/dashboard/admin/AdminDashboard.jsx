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
  LinearProgress,
  Tooltip,
  Fade,
  Zoom,
  Stack,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People,
  Recycling,
  TrendingUp,
  Notifications,
  Settings,
  Add,
  MoreVert,
  CheckCircle,
  Warning,
  Error,
  Info,
  ArrowUpward,
  ArrowDownward,
  Refresh,
  FilterList,
  Search,
  Download,
  Visibility,
  Edit,
  Delete,
  Security,
  Speed,
  Storage,
  NetworkCheck,
  Assessment,
  Timeline,
  BarChart,
  PieChart
} from '@mui/icons-material';

const AdminDashboard = () => {

  // Mock data - replace with actual API calls
  const stats = [
    { 
      title: 'Total Users', 
      value: '2,847', 
      change: '+12%', 
      changeType: 'increase',
      color: '#10b981', 
      icon: <People />,
      trend: [65, 70, 75, 80, 85, 90, 95, 100],
      description: 'Active users this month'
    },
    { 
      title: 'Waste Collected', 
      value: '15.2K kg', 
      change: '+8%', 
      changeType: 'increase',
      color: '#059669', 
      icon: <Recycling />,
      trend: [40, 45, 50, 55, 60, 65, 70, 75],
      description: 'Total waste processed'
    },
    { 
      title: 'Collection Routes', 
      value: '24', 
      change: '+2', 
      changeType: 'increase',
      color: '#3b82f6', 
      icon: <Timeline />,
      trend: [15, 18, 20, 22, 24, 26, 28, 30],
      description: 'Active collection routes'
    },
    { 
      title: 'Active Staff', 
      value: '156', 
      change: '+5%', 
      changeType: 'increase',
      color: '#14b8a6', 
      icon: <People />,
      trend: [120, 125, 130, 135, 140, 145, 150, 155],
      description: 'Staff members online'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'success', message: 'New resident registered', time: '2 minutes ago', user: 'John Doe' },
    { id: 2, type: 'info', message: 'Collection route completed', time: '15 minutes ago', user: 'Route #12' },
    { id: 3, type: 'warning', message: 'Staff member reported issue', time: '1 hour ago', user: 'Sarah Wilson' },
    { id: 4, type: 'error', message: 'Collection vehicle maintenance due', time: '2 hours ago', user: 'Vehicle #V-003' },
    { id: 5, type: 'success', message: 'System backup completed', time: '3 hours ago', user: 'System' },
    { id: 6, type: 'info', message: 'New waste bin installed', time: '4 hours ago', user: 'Installation Team' }
  ];

  const systemAlerts = [
    { id: 1, type: 'warning', title: 'High Memory Usage', message: 'Server memory usage is at 85%', time: '5 minutes ago' },
    { id: 2, type: 'error', title: 'Database Connection', message: 'Connection timeout detected', time: '10 minutes ago' },
    { id: 3, type: 'info', title: 'Scheduled Maintenance', message: 'System maintenance scheduled for tonight', time: '1 hour ago' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'resident', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'staff', status: 'active', joinDate: '2024-01-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'resident', status: 'inactive', joinDate: '2024-01-05' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@example.com', role: 'staff', status: 'active', joinDate: '2024-01-01' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle color="success" />;
      case 'info': return <Info color="info" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      default: return <Info color="info" />;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'info': return <Info />;
      case 'warning': return <Warning />;
      case 'error': return <Error />;
      default: return <Info />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
      backgroundAttachment: 'fixed',
      position: 'relative',
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
            top: 0,
            left: '25%',
            width: 384,
            height: 384,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
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
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1))',
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
            background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1))',
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

        <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          {/* Modern Header */}
          <Fade in timeout={600}>
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
                    Welcome Back!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Here's what's happening with your waste management system.
                  </Typography>
                </Box>
              <Stack direction="row" spacing={2}>
                <Tooltip title="Refresh Data">
                  <IconButton sx={{ 
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    '&:hover': { 
                      background: 'linear-gradient(45deg, #059669, #047857)',
                      transform: 'translateY(-2px)'
                    },
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                    transition: 'all 0.3s ease'
                  }}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  sx={{ 
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    color: 'white',
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #059669, #047857)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 30px rgba(16, 185, 129, 0.35)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Add User
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<Settings />}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    px: 3,
                    py: 1,
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: 'rgba(16, 185, 129, 0.04)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Settings
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Fade>

        {/* Enhanced Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={index}>
              <Zoom in timeout={600 + index * 100}>
                <Card sx={{ 
                  height: '100%', 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h3" component="div" sx={{ 
                          fontWeight: 700, 
                          color: stat.color,
                          mb: 1
                        }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {stat.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            icon={stat.changeType === 'increase' ? <ArrowUpward /> : <ArrowDownward />}
                            label={stat.change}
                            size="small"
                            color={stat.changeType === 'increase' ? 'success' : 'error'}
                            sx={{ 
                              fontWeight: 600,
                              '& .MuiChip-icon': { fontSize: 16 }
                            }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            vs last month
                          </Typography>
                        </Box>
                      </Box>
                      <Avatar sx={{ 
                        bgcolor: stat.color, 
                        width: 64, 
                        height: 64,
                        boxShadow: `0 8px 16px ${stat.color}40`
                      }}>
                        {stat.icon}
                      </Avatar>
                    </Box>
                    {/* Mini Progress Bar */}
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={75} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: `${stat.color}20`,
                          '& .MuiLinearProgress-bar': {
                            bgcolor: stat.color,
                            borderRadius: 3
                          }
                        }} 
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* System Alerts */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={800}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Security sx={{ mr: 1, color: '#10b981' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        System Alerts
                      </Typography>
                    </Box>
                  }
                  action={
                    <Badge badgeContent={systemAlerts.length} color="error">
                      <Notifications color="action" />
                    </Badge>
                  }
                />
                <CardContent sx={{ p: 0 }}>
                  <List sx={{ p: 0 }}>
                    {systemAlerts.map((alert, index) => (
                      <React.Fragment key={alert.id}>
                        <ListItem sx={{ px: 3, py: 2 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: `${alert.type}.main`, 
                              width: 40, 
                              height: 40 
                            }}>
                              {getAlertIcon(alert.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {alert.title}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {alert.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {alert.time}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < systemAlerts.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={8}>
            <Fade in timeout={900}>
              <Card sx={{ 
                height: '100%',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3,
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <CardHeader
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Timeline sx={{ mr: 1, color: '#10b981' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Recent Activities
                      </Typography>
                    </Box>
                  }
                  action={
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  }
                />
                <CardContent sx={{ p: 0 }}>
                  <List sx={{ p: 0 }}>
                    {recentActivities.map((activity, index) => (
                      <React.Fragment key={activity.id}>
                        <ListItem sx={{ px: 3, py: 2 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: `${activity.type}.main`, 
                              width: 40, 
                              height: 40 
                            }}>
                              {getActivityIcon(activity.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  {activity.message}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {activity.time}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary">
                                {activity.user}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < recentActivities.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Recent Users Table */}
        <Fade in timeout={1000}>
          <Card sx={{ 
            mt: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardHeader
              title={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People sx={{ mr: 1, color: '#10b981' }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Users
                  </Typography>
                </Box>
              }
              action={
                <Stack direction="row" spacing={1}>
                  <IconButton size="small">
                    <Search />
                  </IconButton>
                  <IconButton size="small">
                    <FilterList />
                  </IconButton>
                  <IconButton size="small">
                    <Download />
                  </IconButton>
                </Stack>
              }
            />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ 
                            mr: 2, 
                            background: 'linear-gradient(45deg, #10b981, #059669)',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                          }}>
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {user.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role} 
                          size="small" 
                          sx={{
                            color: '#10b981',
                            borderColor: '#10b981',
                            '&:hover': {
                              backgroundColor: 'rgba(16, 185, 129, 0.04)'
                            }
                          }}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.status} 
                          size="small" 
                          color={getStatusColor(user.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error">
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Fade>
        </Container>
    </Box>
  );
};

export default AdminDashboard;
