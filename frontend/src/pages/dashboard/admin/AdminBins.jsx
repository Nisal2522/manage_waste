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
  Delete,
  Add,
  Edit,
  Visibility,
  LocationOn,
  Refresh,
  FilterList,
  Search
} from '@mui/icons-material';

const AdminBins = () => {

  // Mock data for waste bins
  const bins = [
    { id: 1, location: 'Main Street', type: 'General', status: 'Active', capacity: '85%', lastCollection: '2024-01-15' },
    { id: 2, location: 'Park Avenue', type: 'Recyclable', status: 'Active', capacity: '60%', lastCollection: '2024-01-14' },
    { id: 3, location: 'Oak Street', type: 'Organic', status: 'Maintenance', capacity: '0%', lastCollection: '2024-01-10' },
    { id: 4, location: 'Central Plaza', type: 'General', status: 'Active', capacity: '90%', lastCollection: '2024-01-15' },
    { id: 5, location: 'University Road', type: 'Recyclable', status: 'Active', capacity: '45%', lastCollection: '2024-01-13' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Maintenance': return 'warning';
      case 'Full': return 'error';
      default: return 'default';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'General': return 'primary';
      case 'Recyclable': return 'info';
      case 'Organic': return 'success';
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
                  Waste Bins
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage and monitor waste collection bins across the city.
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
                  Add Bin
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
                      <Delete />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                        {bins.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Bins
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
                      <LocationOn />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#3b82f6' }}>
                        {bins.filter(bin => bin.status === 'Active').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Bins
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
                      <Refresh />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        {bins.filter(bin => bin.capacity > '80%').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Need Collection
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
                    <Avatar sx={{ bgcolor: '#ef4444', mr: 2 }}>
                      <Refresh />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                        {bins.filter(bin => bin.status === 'Maintenance').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Maintenance
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Bins Table */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardHeader
              title="Waste Bins"
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
                    <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Capacity</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Last Collection</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bins.map((bin) => (
                    <TableRow key={bin.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          #{bin.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOn sx={{ mr: 1, color: '#6b7280' }} />
                          {bin.location}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={bin.type} 
                          size="small" 
                          color={getTypeColor(bin.type)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={bin.status} 
                          size="small" 
                          color={getStatusColor(bin.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {bin.capacity}
                          </Typography>
                          <Box sx={{ 
                            width: 40, 
                            height: 6, 
                            backgroundColor: '#e5e7eb', 
                            borderRadius: 3,
                            overflow: 'hidden'
                          }}>
                            <Box sx={{ 
                              width: bin.capacity, 
                              height: '100%', 
                              backgroundColor: bin.capacity > '80%' ? '#ef4444' : bin.capacity > '60%' ? '#f59e0b' : '#10b981'
                            }} />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(bin.lastCollection).toLocaleDateString()}
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

export default AdminBins;
