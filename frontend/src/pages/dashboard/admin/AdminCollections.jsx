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
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Tooltip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getCollections, createInvoiceFromCollection } from '../../../utils/api';

const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Invoice dialog state
  const [invoiceDialog, setInvoiceDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [invoiceData, setInvoiceData] = useState({
    ratePerKg: 5,
    discount: 0,
    tax: 0,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: ''
  });
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  // Filter state
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWasteType, setFilterWasteType] = useState('all');
  const [showPaidInvoices, setShowPaidInvoices] = useState(false);

  // Fetch collections
  const fetchCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCollections();
      console.log('Collections fetched:', response);
      setCollections(response.data || []);
      setFilteredCollections(response.data || []);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError('Failed to load collections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...collections];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => 
        filterStatus === 'collected' ? c.isCollected : !c.isCollected
      );
    }
    
    if (filterWasteType !== 'all') {
      filtered = filtered.filter(c => 
        c.bin?.binType?.toLowerCase() === filterWasteType.toLowerCase()
      );
    }

    // Filter out collections with paid invoices (unless showPaidInvoices is true)
    if (!showPaidInvoices) {
      filtered = filtered.filter(c => {
        // Show if no invoice exists OR invoice is not paid
        return !c.invoice || c.invoice.status !== 'paid';
      });
    }
    
    setFilteredCollections(filtered);
  }, [filterStatus, filterWasteType, showPaidInvoices, collections]);

  // Open invoice dialog
  const handleOpenInvoiceDialog = (collection) => {
    setSelectedCollection(collection);
    setInvoiceData({
      ratePerKg: 5,
      discount: 0,
      tax: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: `Invoice for waste collection on ${new Date(collection.collectionTime).toLocaleDateString()}`
    });
    setInvoiceDialog(true);
  };

  // Close invoice dialog
  const handleCloseInvoiceDialog = () => {
    setInvoiceDialog(false);
    setSelectedCollection(null);
    setInvoiceData({
      ratePerKg: 5,
      discount: 0,
      tax: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: ''
    });
  };

  // Create invoice
  const handleCreateInvoice = async () => {
    if (!selectedCollection) return;

    try {
      setCreatingInvoice(true);
      setError(null);

      const payload = {
        collectionId: selectedCollection._id,
        ratePerKg: parseFloat(invoiceData.ratePerKg),
        discount: parseFloat(invoiceData.discount),
        tax: parseFloat(invoiceData.tax),
        dueDate: invoiceData.dueDate,
        notes: invoiceData.notes
      };

      console.log('Creating invoice with payload:', payload);
      const response = await createInvoiceFromCollection(payload);
      
      if (response.success) {
        setSuccess(`Invoice ${response.data.invoiceNumber} created successfully!`);
        handleCloseInvoiceDialog();
        fetchCollections(); // Refresh collections
        
        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err) {
      console.error('Error creating invoice:', err);
      setError(err.response?.data?.message || 'Failed to create invoice. Please try again.');
    } finally {
      setCreatingInvoice(false);
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    if (!selectedCollection) return '0.00';
    const amount = parseFloat(selectedCollection.weight || 0) * parseFloat(invoiceData.ratePerKg || 0);
    const discount = parseFloat(invoiceData.discount || 0);
    const tax = parseFloat(invoiceData.tax || 0);
    const total = amount - discount + tax;
    return total.toFixed(2);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          mb: 3, 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: 3
        }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                Waste Collections
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage all waste collection records and generate invoices
              </Typography>
            </Box>
            <IconButton 
              onClick={fetchCollections} 
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

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="collected">Collected</MenuItem>
                  <MenuItem value="not_collected">Not Collected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Waste Type</InputLabel>
                <Select
                  value={filterWasteType}
                  onChange={(e) => setFilterWasteType(e.target.value)}
                  label="Waste Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="organic">Organic</MenuItem>
                  <MenuItem value="plastic">Plastic</MenuItem>
                  <MenuItem value="paper">Paper</MenuItem>
                  <MenuItem value="glass">Glass</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Invoice Status</InputLabel>
                <Select
                  value={showPaidInvoices ? 'all' : 'unpaid'}
                  onChange={(e) => setShowPaidInvoices(e.target.value === 'all')}
                  label="Invoice Status"
                >
                  <MenuItem value="unpaid">Unpaid/No Invoice</MenuItem>
                  <MenuItem value="all">All (Include Paid)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary">
                Total Collections: <strong>{filteredCollections.length}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Collections Table */}
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress />
            </Box>
          ) : filteredCollections.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Collections Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {collections.length === 0 
                  ? 'No waste collections have been recorded yet.'
                  : 'Try adjusting your filters to see more results.'
                }
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Bin ID</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Resident</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Staff</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Waste Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }} align="right">Weight (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Collection Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCollections.map((collection) => (
                    <TableRow 
                      key={collection._id}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          {collection.bin?.binId || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {collection.bin?.binType || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {collection.resident?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {collection.resident?.email || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {collection.staff?.name || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={collection.bin?.binType || 'Mixed'} 
                          size="small"
                          color={
                            collection.bin?.binType?.toLowerCase() === 'organic' ? 'success' :
                            collection.bin?.binType?.toLowerCase() === 'plastic' ? 'warning' :
                            collection.bin?.binType?.toLowerCase() === 'paper' ? 'info' :
                            'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {collection.weight?.toFixed(2) || '0.00'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={collection.isCollected ? 'Collected' : 'Pending'} 
                          size="small"
                          color={collection.isCollected ? 'success' : 'warning'}
                          icon={collection.isCollected ? <CheckCircleIcon /> : undefined}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(collection.collectionTime)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box display="flex" gap={1} justifyContent="center">
                          <Tooltip title="Generate Invoice">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenInvoiceDialog(collection)}
                              sx={{
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.2)' }
                              }}
                            >
                              <ReceiptIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Create Invoice Dialog */}
        <Dialog 
          open={invoiceDialog} 
          onClose={handleCloseInvoiceDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            fontWeight: 600
          }}>
            <Box display="flex" alignItems="center" gap={1}>
              <ReceiptIcon />
              Create Invoice
            </Box>
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedCollection && (
              <Box>
                {/* Collection Details */}
                <Paper elevation={0} sx={{ p: 2, mb: 3, backgroundColor: '#f8fafc' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Collection Details
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Bin:</strong> {selectedCollection.bin?.binId}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <strong>Weight:</strong> {selectedCollection.weight} kg
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2">
                        <strong>Resident:</strong> {selectedCollection.resident?.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Invoice Form */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Rate per Kg"
                      type="number"
                      value={invoiceData.ratePerKg}
                      onChange={(e) => setInvoiceData({...invoiceData, ratePerKg: e.target.value})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Discount"
                      type="number"
                      value={invoiceData.discount}
                      onChange={(e) => setInvoiceData({...invoiceData, discount: e.target.value})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tax"
                      type="number"
                      value={invoiceData.tax}
                      onChange={(e) => setInvoiceData({...invoiceData, tax: e.target.value})}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Notes"
                      multiline
                      rows={2}
                      value={invoiceData.notes}
                      onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
                    />
                  </Grid>
                </Grid>

                {/* Total Amount */}
                <Paper elevation={0} sx={{ p: 2, mt: 3, backgroundColor: '#10b981', color: 'white' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" fontWeight={600}>
                      Total Amount
                    </Typography>
                    <Typography variant="h5" fontWeight={700}>
                      ${calculateTotal()}
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseInvoiceDialog} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateInvoice} 
              variant="contained" 
              disabled={creatingInvoice}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                }
              }}
            >
              {creatingInvoice ? <CircularProgress size={24} color="inherit" /> : 'Create Invoice'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminCollections;