import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../../../context/AuthContext';
import { getResidentInvoices, createStripeCheckoutSession, verifyPaymentSession } from '../../../utils/api';

const ResidentInvoices = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState({ type: '', message: '' });

  // Fetch invoices
  const fetchInvoices = async () => {
    if (!user?._id) {
      setError('User not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching invoices for resident:', user._id);
      const response = await getResidentInvoices(user._id);
      console.log('Invoices fetched:', response);
      setInvoices(response.data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  // Check for payment success/failure from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const sessionId = urlParams.get('session_id');

    if (paymentStatus === 'success' && sessionId) {
      // Verify payment and update invoice
      verifyPayment(sessionId);
    } else if (paymentStatus === 'cancelled') {
      setPaymentMessage({
        type: 'warning',
        message: 'Payment was cancelled. You can try again anytime.'
      });
      // Clear URL params
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Verify payment after redirect from Stripe
  const verifyPayment = async (sessionId) => {
    try {
      console.log('Verifying payment session:', sessionId);
      const response = await verifyPaymentSession(sessionId);
      
      if (response.success && response.data.paymentStatus === 'paid') {
        setPaymentMessage({
          type: 'success',
          message: '✅ Payment successful! Your invoice has been paid.'
        });
        
        // Refresh invoices to show updated status
        fetchInvoices();
      } else {
        setPaymentMessage({
          type: 'error',
          message: 'Payment verification failed. Please contact support.'
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentMessage({
        type: 'error',
        message: 'Could not verify payment. Please refresh the page.'
      });
    } finally {
      // Clear URL params after verification
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return <CheckCircleIcon fontSize="small" />;
      case 'pending':
        return <AccessTimeIcon fontSize="small" />;
      case 'overdue':
        return <ErrorIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // View invoice details
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setViewDialog(false);
    setSelectedInvoice(null);
  };

  // Handle payment
  const handlePayNow = async (invoice) => {
    try {
      setProcessingPayment(true);
      setError(null);

      console.log('Initiating payment for invoice:', invoice._id);

      // Create Stripe checkout session
      const response = await createStripeCheckoutSession(invoice._id);
      
      if (response.success && response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err) {
      console.error('Error initiating payment:', err);
      setError(err.response?.data?.message || 'Failed to initiate payment. Please try again.');
      setProcessingPayment(false);
    }
  };

  // Calculate totals
  const totalAmount = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);

  return (
    <Box sx={{ 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Paper elevation={0} sx={{ 
          p: 3, 
          mb: 3, 
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          borderRadius: 3
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                My Invoices
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                View and manage your waste collection invoices
              </Typography>
            </Box>
            <IconButton 
              onClick={fetchInvoices} 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                color: 'white'
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Paper>

        {/* Payment Status Message */}
        {paymentMessage.message && (
          <Alert 
            severity={paymentMessage.type} 
            onClose={() => setPaymentMessage({ type: '', message: '' })}
            sx={{ mb: 3 }}
          >
            {paymentMessage.message}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Total Amount
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary">
                {formatCurrency(totalAmount)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Paid
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {formatCurrency(paidAmount)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Pending
              </Typography>
              <Typography variant="h4" fontWeight={700} color="warning.main">
                {formatCurrency(pendingAmount)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Invoices Table */}
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress />
            </Box>
          ) : invoices.length === 0 ? (
            <Box textAlign="center" py={8}>
              <ReceiptIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Invoices Yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your waste collection invoices will appear here
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Invoice #</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Waste Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }} align="right">Weight (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }} align="right">Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow 
                      key={invoice._id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          {invoice.invoiceNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(invoice.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={invoice.wasteType || 'Mixed'} 
                          size="small"
                          color={
                            invoice.wasteType === 'organic' ? 'success' :
                            invoice.wasteType === 'plastic' ? 'warning' :
                            invoice.wasteType === 'paper' ? 'info' :
                            'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {invoice.weight?.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={700}>
                          {formatCurrency(invoice.totalAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color={
                          new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' 
                            ? 'error' 
                            : 'text.primary'
                        }>
                          {formatDate(invoice.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={invoice.status} 
                          size="small"
                          color={getStatusColor(invoice.status)}
                          icon={getStatusIcon(invoice.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewInvoice(invoice)}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {invoice.status === 'pending' && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handlePayNow(invoice)}
                              disabled={processingPayment}
                              sx={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                textTransform: 'none',
                                minWidth: '70px',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                }
                              }}
                            >
                              {processingPayment ? <CircularProgress size={16} color="inherit" /> : 'Pay'}
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Invoice Details Dialog */}
        <Dialog 
          open={viewDialog} 
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            fontWeight: 600
          }}>
            <Box display="flex" alignItems="center" gap={1}>
              <ReceiptIcon />
              Invoice Details
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedInvoice && (
              <Box>
                {/* Invoice Header */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Invoice Number
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {selectedInvoice.invoiceNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="caption" color="text.secondary">
                      Status
                    </Typography>
                    <Box mt={0.5}>
                      <Chip 
                        label={selectedInvoice.status} 
                        color={getStatusColor(selectedInvoice.status)}
                        icon={getStatusIcon(selectedInvoice.status)}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Billing Details */}
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Billing Details
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Waste Type
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedInvoice.wasteType}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Weight
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {selectedInvoice.weight} kg
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Rate per Kg
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(selectedInvoice.ratePerKg)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Base Amount
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {formatCurrency(selectedInvoice.amount)}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Additional Charges */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Discount
                    </Typography>
                    <Typography variant="body1" color="success.main" fontWeight={500}>
                      -{formatCurrency(selectedInvoice.discount || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Tax
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      +{formatCurrency(selectedInvoice.tax || 0)}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2} sx={{ backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Total Amount
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary">
                    {formatCurrency(selectedInvoice.totalAmount)}
                  </Typography>
                </Box>

                {/* Dates */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Invoice Date
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedInvoice.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Due Date
                    </Typography>
                    <Typography variant="body2" color={
                      new Date(selectedInvoice.dueDate) < new Date() && selectedInvoice.status !== 'paid' 
                        ? 'error' 
                        : 'text.primary'
                    }>
                      {formatDate(selectedInvoice.dueDate)}
                    </Typography>
                  </Grid>
                  {selectedInvoice.paidDate && (
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Paid Date
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        {formatDate(selectedInvoice.paidDate)}
                      </Typography>
                    </Grid>
                  )}
                </Grid>

                {/* Notes */}
                {selectedInvoice.notes && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Notes
                    </Typography>
                    <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f8fafc' }}>
                      <Typography variant="body2">
                        {selectedInvoice.notes}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDialog}>
              Close
            </Button>
            {selectedInvoice?.status === 'pending' && (
              <Button 
                variant="contained"
                onClick={() => handlePayNow(selectedInvoice)}
                disabled={processingPayment}
                sx={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  }
                }}
              >
                {processingPayment ? <CircularProgress size={24} color="inherit" /> : 'Pay Now'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ResidentInvoices;
