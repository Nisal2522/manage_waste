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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Assignment,
  Add,
  Edit,
  Visibility,
  Route,
  Refresh,
  FilterList,
  Search,
  CheckCircle,
  Schedule
} from '@mui/icons-material';

const AdminCollections = () => {

  // Mock data for collections
  const collections = [
    { id: 1, route: 'Route A', driver: 'John Smith', vehicle: 'V-001', status: 'Completed', date: '2024-01-15', bins: 12 },
    { id: 2, route: 'Route B', driver: 'Sarah Johnson', vehicle: 'V-002', status: 'In Progress', date: '2024-01-15', bins: 8 },
    { id: 3, route: 'Route C', driver: 'Mike Wilson', vehicle: 'V-003', status: 'Scheduled', date: '2024-01-16', bins: 15 },
    { id: 4, route: 'Route D', driver: 'Lisa Brown', vehicle: 'V-004', status: 'Completed', date: '2024-01-14', bins: 10 },
    { id: 5, route: 'Route E', driver: 'David Lee', vehicle: 'V-005', status: 'Scheduled', date: '2024-01-16', bins: 18 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Scheduled': return 'warning';
      case 'Cancelled': return 'error';
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
                  Collections
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Monitor and manage waste collection routes and schedules.
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
                  New Collection
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
                      <Assignment />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                        {collections.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Routes
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
                        {collections.filter(c => c.status === 'Completed').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completed
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
                      <Schedule />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        {collections.filter(c => c.status === 'Scheduled').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Scheduled
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
                      <Route />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b5cf6' }}>
                        {collections.reduce((sum, c) => sum + c.bins, 0)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Bins
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Collections Table */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardHeader
              title="Collection Routes"
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
                    <TableCell sx={{ fontWeight: 600 }}>Route</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Driver</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Vehicle</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Bins</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {collections.map((collection) => (
                    <TableRow key={collection.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Route sx={{ mr: 1, color: '#6b7280' }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {collection.route}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {collection.driver}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {collection.vehicle}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={collection.status} 
                          size="small" 
                          color={getStatusColor(collection.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(collection.date).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {collection.bins} bins
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

export default AdminCollections;
