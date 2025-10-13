import React, { useState } from 'react';
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
  IconButton,
  Badge,
  LinearProgress,
  Tooltip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab
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
  FilterList,
  Download,
  LocalShipping,
  Inventory,
  SupervisorAccount,
  BarChart,
  PeopleAlt
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Mock data - replace with actual API calls
  const stats = [
    { title: 'Total Users', value: '2,845', change: '+12%', color: '#3b82f6', icon: <PeopleAlt /> },
    { title: 'Waste Collected', value: '156.8 tons', change: '+8%', color: '#10b981', icon: <Recycling /> },
    { title: 'Active Collectors', value: '48', change: '+3', color: '#f59e0b', icon: <LocalShipping /> },
    { title: 'System Efficiency', value: '94%', change: '+2%', color: '#6366f1', icon: <BarChart /> }
  ];

  const systemAlerts = [
    { id: 1, type: 'error', message: 'Server load exceeded threshold', time: '2 hours ago' },
    { id: 2, type: 'warning', message: 'Database backup pending', time: '1 day ago' },
    { id: 3, type: 'info', message: 'System update available', time: '2 days ago' },
    { id: 4, type: 'success', message: 'All services operational', time: '3 days ago' }
  ];

  const recentUsers = [
    { id: 1, name: 'John Smith', role: 'Resident', status: 'active', location: 'North Zone', joined: '2 days ago' },
    { id: 2, name: 'Sarah Johnson', role: 'Collector', status: 'active', location: 'East Zone', joined: '1 week ago' },
    { id: 3, name: 'Michael Brown', role: 'Resident', status: 'pending', location: 'West Zone', joined: '2 weeks ago' },
    { id: 4, name: 'Emily Davis', role: 'Supervisor', status: 'active', location: 'South Zone', joined: '1 month ago' }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle sx={{ color: '#10b981' }} />;
      case 'info': return <Info sx={{ color: '#3b82f6' }} />;
      case 'warning': return <Warning sx={{ color: '#f59e0b' }} />;
      case 'error': return <Error sx={{ color: '#ef4444' }} />;
      default: return <Info sx={{ color: '#3b82f6' }} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ 
      flex: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <Container maxWidth="xl" sx={{ 
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Admin Dashboard Header */}
        <Box sx={{ 
          mb: 4, 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700, 
              mb: 1, 
              color: '#0f172a',
              letterSpacing: '-0.5px'
            }}>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Comprehensive system overview and management controls
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              sx={{ 
                backgroundColor: '#0f172a',
                '&:hover': { backgroundColor: '#1e293b' }
              }}
              startIcon={<Download />}
            >
              Export Report
            </Button>
            <IconButton 
              sx={{ 
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                '&:hover': { backgroundColor: '#f8fafc' }
              }}
            >
              <Badge badgeContent={4} color="error">
                <Notifications color="action" />
              </Badge>
            </IconButton>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ 
                height: '160px',
                background: 'white',
                borderRadius: 2,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '14px' }}>
                      {stat.title}
                    </Typography>
                    <Chip 
                      label={stat.change} 
                      size="small"
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: '11px',
                        height: '20px',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.2)'
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <Typography variant="h4" component="div" sx={{ 
                      fontWeight: 700, 
                      fontSize: '28px',
                      lineHeight: 1.2,
                      color: '#0f172a'
                    }}>
                      {stat.value}
                    </Typography>
                    <Avatar sx={{ 
                      backgroundColor: `${stat.color}15`, 
                      color: stat.color,
                      width: 42, 
                      height: 42 
                    }}>
                      {stat.icon}
                    </Avatar>
                  </Box>
                </CardContent>
                <Box sx={{ height: '4px', width: '100%', backgroundColor: stat.color }} />
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Content Area with Tabs */}
        <Card sx={{ 
          width: '100%', 
          mb: 4,
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{ 
                '& .MuiTab-root': { 
                  fontWeight: 600,
                  fontSize: '14px',
                  textTransform: 'none',
                  minHeight: '48px'
                },
                '& .Mui-selected': {
                  color: '#0f172a'
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#0f172a'
                }
              }}
            >
              <Tab label="System Overview" icon={<DashboardIcon />} iconPosition="start" />
              <Tab label="User Management" icon={<PeopleAlt />} iconPosition="start" />
              <Tab label="Waste Collection" icon={<Recycling />} iconPosition="start" />
              <Tab label="Analytics" icon={<BarChart />} iconPosition="start" />
            </Tabs>
          </Box>
          
          {/* Tab Content */}
          <Box sx={{ p: 3 }}>
            {/* System Overview Tab */}
            {tabValue === 0 && (
              <Grid container spacing={3}>
                {/* System Alerts */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      System Alerts
                    </Typography>
                    <IconButton size="small">
                      <FilterList fontSize="small" />
                    </IconButton>
                  </Box>
                  <List sx={{ 
                    bgcolor: 'background.paper',
                    border: '1px solid #e2e8f0',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}>
                    {systemAlerts.map((alert, index) => (
                      <React.Fragment key={alert.id}>
                        <ListItem 
                          sx={{ 
                            py: 1.5,
                            px: 2,
                            '&:hover': { backgroundColor: '#f8fafc' }
                          }}
                          secondaryAction={
                            <IconButton edge="end" size="small">
                              <MoreVert fontSize="small" />
                            </IconButton>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              backgroundColor: 'transparent',
                              width: 36,
                              height: 36
                            }}>
                              {getAlertIcon(alert.type)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                                {alert.message}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="caption" color="text.secondary">
                                {alert.time}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {index < systemAlerts.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Grid>
                
                {/* System Health */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      System Health
                    </Typography>
                  </Box>
                  <Card sx={{ 
                    border: '1px solid #e2e8f0',
                    boxShadow: 'none',
                    borderRadius: 1
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                            Server Load
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                            42%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={42} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3, 
                            backgroundColor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#3b82f6'
                            }
                          }}
                        />
                      </Box>
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                            Database Performance
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                            78%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={78} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3, 
                            backgroundColor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#10b981'
                            }
                          }}
                        />
                      </Box>
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                            Storage Capacity
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                            35%
                          </Typography>
                        </Box>
                        <LinearProgress 
                          variant="determinate" 
                          value={35} 
                          sx={{ 
                            height: 6, 
                            borderRadius: 3, 
                            backgroundColor: '#e2e8f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#6366f1'
                            }
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
            
            {/* User Management Tab */}
            {tabValue === 1 && (
              <Box>
                <Box sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    Recent User Activity
                  </Typography>
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<Add />}
                    sx={{ 
                      backgroundColor: '#0f172a',
                      '&:hover': { backgroundColor: '#1e293b' }
                    }}
                  >
                    Add User
                  </Button>
                </Box>
                <TableContainer component={Paper} sx={{ 
                  boxShadow: 'none',
                  border: '1px solid #e2e8f0',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  <Table sx={{ minWidth: 650 }} size="medium">
                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Joined</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentUsers.map((user) => (
                        <TableRow 
                          key={user.id}
                          sx={{ 
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:hover': { backgroundColor: '#f8fafc' }
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar 
                                sx={{ 
                                  width: 36, 
                                  height: 36,
                                  backgroundColor: '#e2e8f0',
                                  color: '#64748b',
                                  fontSize: '14px',
                                  fontWeight: 600
                                }}
                              >
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                                {user.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.role} 
                              size="small"
                              sx={{ 
                                fontWeight: 500,
                                fontSize: '12px',
                                backgroundColor: user.role === 'Supervisor' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(203, 213, 225, 0.3)',
                                color: user.role === 'Supervisor' ? '#6366f1' : '#64748b',
                                border: user.role === 'Supervisor' ? '1px solid rgba(99, 102, 241, 0.2)' : 'none'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={user.status} 
                              color={getStatusColor(user.status)}
                              size="small"
                              sx={{ 
                                fontWeight: 500,
                                fontSize: '12px',
                                height: '22px'
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {user.location}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {user.joined}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton size="small">
                              <MoreVert fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            
            {/* Waste Collection Tab */}
            {tabValue === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      Collection Routes
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<Add />}
                      sx={{ 
                        borderColor: '#0f172a',
                        color: '#0f172a',
                        '&:hover': { borderColor: '#1e293b', backgroundColor: 'rgba(15, 23, 42, 0.04)' }
                      }}
                    >
                      Add Route
                    </Button>
                  </Box>
                  <TableContainer component={Paper} sx={{ 
                    boxShadow: 'none',
                    border: '1px solid #e2e8f0',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}>
                    <Table size="small">
                      <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Route ID</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Area</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Collector</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Status</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#64748b', fontSize: '13px' }}>Progress</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { id: 'RT-1001', area: 'North Zone', collector: 'John Doe', status: 'active', progress: 75 },
                          { id: 'RT-1002', area: 'East Zone', collector: 'Jane Smith', status: 'active', progress: 45 },
                          { id: 'RT-1003', area: 'South Zone', collector: 'Robert Johnson', status: 'pending', progress: 0 },
                          { id: 'RT-1004', area: 'West Zone', collector: 'Emily Brown', status: 'completed', progress: 100 }
                        ].map((route) => (
                          <TableRow 
                            key={route.id}
                            sx={{ 
                              '&:last-child td, &:last-child th': { border: 0 },
                              '&:hover': { backgroundColor: '#f8fafc' }
                            }}
                          >
                            <TableCell>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                                {route.id}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {route.area}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {route.collector}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={route.status} 
                                color={getStatusColor(route.status)}
                                size="small"
                                sx={{ 
                                  fontWeight: 500,
                                  fontSize: '12px',
                                  height: '22px'
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={route.progress} 
                                  sx={{ 
                                    flexGrow: 1,
                                    height: 6, 
                                    borderRadius: 3, 
                                    backgroundColor: '#e2e8f0',
                                    '& .MuiLinearProgress-bar': {
                                      backgroundColor: route.progress === 100 ? '#10b981' : '#3b82f6'
                                    }
                                  }}
                                />
                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                                  {route.progress}%
                                </Typography>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                
                <Grid item xs={12} md={5}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                      Waste Categories
                    </Typography>
                  </Box>
                  <Card sx={{ 
                    border: '1px solid #e2e8f0',
                    boxShadow: 'none',
                    borderRadius: 1
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      {[
                        { name: 'Organic Waste', amount: '68.2 tons', percentage: 43, color: '#10b981' },
                        { name: 'Recyclable Materials', amount: '45.7 tons', percentage: 29, color: '#3b82f6' },
                        { name: 'Hazardous Waste', amount: '12.4 tons', percentage: 8, color: '#ef4444' },
                        { name: 'Other Waste', amount: '30.5 tons', percentage: 20, color: '#f59e0b' }
                      ].map((category, index) => (
                        <Box key={index} sx={{ mb: index < 3 ? 3 : 0 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#0f172a' }}>
                              {category.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                                {category.amount}
                              </Typography>
                              <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>
                                ({category.percentage}%)
                              </Typography>
                            </Box>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={category.percentage} 
                            sx={{ 
                              height: 8, 
                              borderRadius: 3, 
                              backgroundColor: '#e2e8f0',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: category.color
                              }
                            }}
                          />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
            
            {/* Analytics Tab */}
            {tabValue === 3 && (
              <Box>
                <Box sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    Performance Metrics
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<Download />}
                      sx={{ 
                        borderColor: '#0f172a',
                        color: '#0f172a',
                        '&:hover': { borderColor: '#1e293b', backgroundColor: 'rgba(15, 23, 42, 0.04)' }
                      }}
                    >
                      Export Data
                    </Button>
                    <Button 
                      variant="contained" 
                      size="small"
                      sx={{ 
                        backgroundColor: '#0f172a',
                        '&:hover': { backgroundColor: '#1e293b' }
                      }}
                    >
                      Generate Report
                    </Button>
                  </Box>
                </Box>
                
                <Grid container spacing={3}>
                  {[
                    { title: 'Collection Efficiency', value: '92%', change: '+5%', description: 'Average waste collected per route' },
                    { title: 'User Satisfaction', value: '4.7/5', change: '+0.3', description: 'Based on user feedback surveys' },
                    { title: 'System Uptime', value: '99.8%', change: '+0.1%', description: 'Platform availability this month' },
                    { title: 'Response Time', value: '1.2s', change: '-0.3s', description: 'Average API response time' }
                  ].map((metric, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card sx={{ 
                        border: '1px solid #e2e8f0',
                        boxShadow: 'none',
                        borderRadius: 1,
                        height: '100%'
                      }}>
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a' }}>
                              {metric.title}
                            </Typography>
                            <Chip 
                              label={metric.change} 
                              size="small"
                              sx={{ 
                                fontWeight: 'bold',
                                fontSize: '11px',
                                height: '20px',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                color: '#10b981',
                                border: '1px solid rgba(16, 185, 129, 0.2)'
                              }}
                            />
                          </Box>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0f172a', mb: 2 }}>
                            {metric.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metric.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        </Card>

        {/* Quick Actions */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#0f172a', mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {[
              { title: 'User Management', icon: <SupervisorAccount />, color: '#6366f1' },
              { title: 'Collection Routes', icon: <LocalShipping />, color: '#10b981' },
              { title: 'Inventory', icon: <Inventory />, color: '#f59e0b' },
              { title: 'System Settings', icon: <Settings />, color: '#ef4444' }
            ].map((action, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ 
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  height: '100%',
                  minHeight: 120,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(-2px)',
                    borderColor: '#cbd5e1'
                  }
                }}>
                  <Avatar sx={{ 
                    backgroundColor: `${action.color}15`, 
                    color: action.color,
                    width: 48,
                    height: 48,
                    mb: 1.5
                  }}>
                    {action.icon}
                  </Avatar>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#0f172a' }}>
                    {action.title}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
