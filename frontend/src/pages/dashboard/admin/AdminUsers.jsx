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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Badge,
  Tooltip,
  AppBar,
  Toolbar,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  People,
  Add,
  Edit,
  Visibility,
  Delete,
  Refresh,
  FilterList,
  Search,
  Menu as MenuIcon,
  Notifications,
  CheckCircle,
  Block
} from '@mui/icons-material';

const AdminUsers = () => {

  // Mock data for users
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'resident', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'staff', status: 'active', joinDate: '2024-01-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'resident', status: 'inactive', joinDate: '2024-01-05' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@example.com', role: 'staff', status: 'active', joinDate: '2024-01-01' },
    { id: 5, name: 'David Lee', email: 'david@example.com', role: 'admin', status: 'active', joinDate: '2023-12-20' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'error';
      case 'staff': return 'info';
      case 'resident': return 'success';
      default: return 'default';
    }
  };

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
                  Users
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage system users, roles, and permissions.
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
                  Refresh
                </Button>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
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
                  Add User
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Stats Cards */}
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
                      <People />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                        {users.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Users
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
                      <CheckCircle />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                        {users.filter(u => u.status === 'active').length}
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
                      <People />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        {users.filter(u => u.role === 'staff').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Staff Members
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
                      <Block />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                        {users.filter(u => u.status === 'inactive').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Inactive Users
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Users Table */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardHeader
              title="System Users"
              action={
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton>
                    <Search />
                  </IconButton>
                  <IconButton>
                    <FilterList />
                  </IconButton>
                </Box>
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
                  {users.map((user) => (
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
                          color={getRoleColor(user.role)}
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
                        <Box sx={{ display: 'flex', gap: 1 }}>
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
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Container>
    </Box>
  );
};

export default AdminUsers;
