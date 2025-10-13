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
  Payment,
  Add,
  Edit,
  Visibility,
  AttachMoney,
  Refresh,
  FilterList,
  Search,
  Menu as MenuIcon,
  Notifications,
  CheckCircle,
  Pending
} from '@mui/icons-material';

const AdminPayments = () => {

  // Mock data for payments
  const payments = [
    { id: 1, customer: 'John Doe', amount: 25.00, type: 'Monthly Fee', status: 'Paid', date: '2024-01-15', method: 'Credit Card' },
    { id: 2, customer: 'Sarah Wilson', amount: 15.00, type: 'Service Fee', status: 'Pending', date: '2024-01-14', method: 'Bank Transfer' },
    { id: 3, customer: 'Mike Johnson', amount: 30.00, type: 'Monthly Fee', status: 'Paid', date: '2024-01-13', method: 'Cash' },
    { id: 4, customer: 'Lisa Brown', amount: 20.00, type: 'Late Fee', status: 'Overdue', date: '2024-01-10', method: 'Credit Card' },
    { id: 5, customer: 'David Lee', amount: 25.00, type: 'Monthly Fee', status: 'Paid', date: '2024-01-12', method: 'Bank Transfer' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'success';
      case 'Pending': return 'warning';
      case 'Overdue': return 'error';
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
                  Payments
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Manage customer payments and billing information.
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
                  New Payment
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
                      <AttachMoney />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                        ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Revenue
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
                        {payments.filter(p => p.status === 'Paid').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Paid
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
                      <Pending />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        {payments.filter(p => p.status === 'Pending').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending
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
                      <Payment />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                        {payments.filter(p => p.status === 'Overdue').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overdue
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Payments Table */}
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <CardHeader
              title="Payment Records"
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
                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          #{payment.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.customer}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${payment.amount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.type}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={payment.status} 
                          size="small" 
                          color={getStatusColor(payment.status)}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {payment.method}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(payment.date).toLocaleDateString()}
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

export default AdminPayments;
