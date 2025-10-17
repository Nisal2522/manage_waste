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
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Error as ErrorIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Receipt as ReceiptIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { getInvoices } from '../../../utils/api';

const AdminPayments = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterWasteType, setFilterWasteType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getInvoices();
      console.log('Invoices fetched:', response);
      setInvoices(response.data || []);
      setFilteredInvoices(response.data || []);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to load payments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...invoices];

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(inv => inv.status === filterStatus);
    }

    // Waste type filter
    if (filterWasteType !== 'all') {
      filtered = filtered.filter(inv => inv.wasteType === filterWasteType);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.invoiceNumber?.toLowerCase().includes(query) ||
        inv.resident?.name?.toLowerCase().includes(query) ||
        inv.resident?.email?.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      if (dateRange !== 'all') {
        filtered = filtered.filter(inv => new Date(inv.createdAt) >= startDate);
      }
    }

    setFilteredInvoices(filtered);
  }, [filterStatus, filterWasteType, searchQuery, dateRange, invoices]);

  // Calculate statistics
  const stats = {
    totalRevenue: invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0),
    paidCount: invoices.filter(inv => inv.status === 'paid').length,
    paidAmount: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0),
    pendingCount: invoices.filter(inv => inv.status === 'pending').length,
    pendingAmount: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0),
    overdueCount: invoices.filter(inv => inv.status === 'overdue').length,
    overdueAmount: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.totalAmount || 0), 0),
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
      case 'cancelled':
        return <CancelIcon fontSize="small" />;
      default:
        return <AccessTimeIcon fontSize="small" />;
    }
  };

  // Handle view invoice
  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setViewDialog(true);
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setViewDialog(false);
    setSelectedInvoice(null);
  };

  // Generate PDF Report
  const generatePDFReport = () => {
    // Create PDF content
    const reportTitle = 'Payment Report';
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Filter information
    const filterInfo = [];
    if (filterStatus !== 'all') filterInfo.push(`Status: ${filterStatus}`);
    if (filterWasteType !== 'all') filterInfo.push(`Waste Type: ${filterWasteType}`);
    if (dateRange !== 'all') filterInfo.push(`Date Range: ${dateRange}`);
    if (searchQuery) filterInfo.push(`Search: "${searchQuery}"`);

    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${reportTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #10b981;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #10b981;
            margin: 0;
            font-size: 28px;
          }
          .header .date {
            color: #666;
            margin-top: 5px;
          }
          .filters {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .filters h3 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 16px;
          }
          .filters p {
            margin: 5px 0;
            color: #666;
            font-size: 14px;
          }
          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .summary-card {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
          }
          .summary-card h3 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
          }
          .summary-card p {
            margin: 5px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
          }
          .summary-card.paid { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
          .summary-card.pending { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
          .summary-card.overdue { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 12px;
          }
          th {
            background: #10b981;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
          }
          tr:nth-child(even) {
            background: #f9fafb;
          }
          tr:hover {
            background: #f3f4f6;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status.paid { background: #d1fae5; color: #065f46; }
          .status.pending { background: #fef3c7; color: #92400e; }
          .status.overdue { background: #fee2e2; color: #991b1b; }
          .status.cancelled { background: #e5e7eb; color: #374151; }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
          .total-row {
            font-weight: bold;
            background: #f3f4f6 !important;
            border-top: 2px solid #10b981;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💰 ${reportTitle}</h1>
          <p class="date">Generated on ${reportDate}</p>
        </div>

        ${filterInfo.length > 0 ? `
        <div class="filters">
          <h3>Applied Filters:</h3>
          ${filterInfo.map(f => `<p>• ${f}</p>`).join('')}
        </div>
        ` : ''}

        <div class="summary">
          <div class="summary-card">
            <h3>${formatCurrency(stats.totalRevenue)}</h3>
            <p>Total Revenue</p>
          </div>
          <div class="summary-card paid">
            <h3>${stats.paidCount}</h3>
            <p>Paid Invoices (${formatCurrency(stats.paidAmount)})</p>
          </div>
          <div class="summary-card pending">
            <h3>${stats.pendingCount}</h3>
            <p>Pending (${formatCurrency(stats.pendingAmount)})</p>
          </div>
          <div class="summary-card overdue">
            <h3>${stats.overdueCount}</h3>
            <p>Overdue (${formatCurrency(stats.overdueAmount)})</p>
          </div>
        </div>

        <h2>Invoice Details (${filteredInvoices.length} records)</h2>
        <table>
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Resident</th>
              <th>Waste Type</th>
              <th>Weight (kg)</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created</th>
              <th>Due Date</th>
              <th>Paid Date</th>
            </tr>
          </thead>
          <tbody>
            ${filteredInvoices.map(invoice => `
              <tr>
                <td>${invoice.invoiceNumber}</td>
                <td>
                  ${invoice.resident?.name || 'Unknown'}<br>
                  <small style="color: #666;">${invoice.resident?.email || 'N/A'}</small>
                </td>
                <td>${invoice.wasteType}</td>
                <td>${invoice.weight?.toFixed(2) || '0.00'}</td>
                <td>${formatCurrency(invoice.totalAmount)}</td>
                <td><span class="status ${invoice.status}">${invoice.status}</span></td>
                <td>${formatDate(invoice.createdAt)}</td>
                <td>${formatDate(invoice.dueDate)}</td>
                <td>${invoice.paidDate ? formatDate(invoice.paidDate) : '-'}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="4" style="text-align: right;">TOTAL:</td>
              <td>${formatCurrency(filteredInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0))}</td>
              <td colspan="4"></td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Waste Management System - Payment Report</p>
          <p>This report was automatically generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    setTimeout(() => {
      printWindow.print();
    }, 500);
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
                Payments & Invoices
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Monitor payment status and manage billing
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

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Revenue
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {formatCurrency(stats.totalRevenue)}
                    </Typography>
                  </Box>
                  <MoneyIcon sx={{ fontSize: 48, opacity: 0.3 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Paid Invoices
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981' }}>
                      {stats.paidCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(stats.paidAmount)}
                    </Typography>
                  </Box>
                  <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', opacity: 0.2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Pending Payments
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                      {stats.pendingCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(stats.pendingAmount)}
                    </Typography>
                  </Box>
                  <AccessTimeIcon sx={{ fontSize: 48, color: '#f59e0b', opacity: 0.2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card elevation={0} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Overdue Invoices
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#ef4444' }}>
                      {stats.overdueCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(stats.overdueAmount)}
                    </Typography>
                  </Box>
                  <ErrorIcon sx={{ fontSize: 48, color: '#ef4444', opacity: 0.2 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search invoice or resident..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="overdue">Overdue</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  label="Date Range"
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">
                Showing <strong>{filteredInvoices.length}</strong> of <strong>{invoices.length}</strong> invoices
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={12} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                startIcon={<PdfIcon />}
                onClick={generatePDFReport}
                sx={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  }
                }}
              >
                Export PDF Report
              </Button>
            </Grid>
          </Grid>
        </Paper>

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
          ) : filteredInvoices.length === 0 ? (
            <Box textAlign="center" py={8}>
              <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.3, mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Invoices Found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {invoices.length === 0 
                  ? 'No invoices have been created yet.'
                  : 'Try adjusting your filters to see more results.'
                }
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: 'calc(100vh - 350px)' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Invoice #</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Resident</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Waste Type</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }} align="right">Weight (kg)</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }} align="right">Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Due Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }}>Paid Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, backgroundColor: '#f8fafc' }} align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice._id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          {invoice.invoiceNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {invoice.resident?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {invoice.resident?.email || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={invoice.wasteType} 
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
                        <Typography variant="body2">
                          {invoice.weight?.toFixed(2) || '0.00'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(invoice.totalAmount)}
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
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(invoice.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(invoice.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {invoice.paidDate ? formatDate(invoice.paidDate) : '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => handleViewInvoice(invoice)}
                            sx={{
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' }
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* View Invoice Dialog */}
        <Dialog 
          open={viewDialog} 
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            fontWeight: 600
          }}>
            Invoice Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedInvoice && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Invoice Number</Typography>
                    <Typography variant="body1" fontWeight={600}>{selectedInvoice.invoiceNumber}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Box mt={0.5}>
                      <Chip 
                        label={selectedInvoice.status} 
                        size="small"
                        color={getStatusColor(selectedInvoice.status)}
                        icon={getStatusIcon(selectedInvoice.status)}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Resident</Typography>
                    <Typography variant="body1">{selectedInvoice.resident?.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{selectedInvoice.resident?.email}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Waste Type</Typography>
                    <Box mt={0.5}>
                      <Chip label={selectedInvoice.wasteType} size="small" />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Weight</Typography>
                    <Typography variant="body1">{selectedInvoice.weight} kg</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Rate per kg</Typography>
                    <Typography variant="body1">{formatCurrency(selectedInvoice.ratePerKg)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Subtotal</Typography>
                    <Typography variant="body1">{formatCurrency(selectedInvoice.amount)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Discount</Typography>
                    <Typography variant="body1">{formatCurrency(selectedInvoice.discount || 0)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Tax</Typography>
                    <Typography variant="body1">{formatCurrency(selectedInvoice.tax || 0)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Total Amount</Typography>
                    <Typography variant="h6" fontWeight={700} color="primary">
                      {formatCurrency(selectedInvoice.totalAmount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Created Date</Typography>
                    <Typography variant="body2">{formatDate(selectedInvoice.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Due Date</Typography>
                    <Typography variant="body2">{formatDate(selectedInvoice.dueDate)}</Typography>
                  </Grid>
                  {selectedInvoice.paidDate && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Paid Date</Typography>
                        <Typography variant="body2">{formatDate(selectedInvoice.paidDate)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">Payment Method</Typography>
                        <Typography variant="body2">{selectedInvoice.paymentMethod || 'N/A'}</Typography>
                      </Grid>
                    </>
                  )}
                  {selectedInvoice.notes && (
                    <Grid item xs={12}>
                      <Typography variant="caption" color="text.secondary">Notes</Typography>
                      <Typography variant="body2">{selectedInvoice.notes}</Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Close</Button>
            <Button variant="contained" startIcon={<DownloadIcon />}>
              Download PDF
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminPayments;
