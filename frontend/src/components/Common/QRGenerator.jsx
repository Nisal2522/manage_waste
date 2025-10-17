//QRGenerator

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from '@mui/material';
import { Download, Share, Print } from '@mui/icons-material';

const QRGenerator = ({ 
  value, 
  size = 200, 
  title = "QR Code",
  showControls = true,
  onGenerate,
  // Modal props
  isOpen = false,
  onClose,
  binData,
  getBinTypeLabel
}) => {
  const [qrValue, setQrValue] = useState(value || '');
  const [open, setOpen] = useState(false);

  // If binData is provided, use it to generate QR code
  const qrData = binData ? JSON.stringify({
    binId: binData.binId,
    type: binData.binType,
    owner: binData.owner,
    capacity: binData.capacity,
    location: {
      latitude: binData.latitude,
      longitude: binData.longitude,
      address: binData.address
    },
    url: `${window.location.origin}/bin/${binData._id || binData.id}`,
    generated: new Date().toISOString()
  }) : qrValue;

  const handleGenerate = () => {
    if (onGenerate) {
      onGenerate(qrValue);
    }
  };

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        const fileName = binData ? `bin-qr-${binData.binId || 'code'}-${Date.now()}.png` : `qr-code-${Date.now()}.png`;
        link.download = fileName;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printTitle = binData ? `Bin QR Code - ${binData.binId}` : title;
    const binInfo = binData ? `
      <div class="bin-info">
        <p><strong>Bin ID:</strong> ${binData.binId || 'N/A'}</p>
        <p><strong>Type:</strong> ${getBinTypeLabel ? getBinTypeLabel(binData.binType) : binData.binType || 'N/A'}</p>
        <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      </div>
    ` : '';
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${printTitle}</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0; 
              font-family: Arial, sans-serif;
            }
            .qr-container {
              text-align: center;
            }
            .qr-title {
              margin-bottom: 20px;
              font-size: 18px;
              font-weight: bold;
            }
            .bin-info {
              margin-top: 20px;
              font-size: 14px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-title">${printTitle}</div>
            ${document.getElementById('qr-code-svg')?.outerHTML || ''}
            ${binInfo}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `QR Code: ${qrValue}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrValue);
      alert('QR Code value copied to clipboard!');
    }
  };

  // If binData is provided, render as modal
  if (binData) {
    return (
      <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Bin QR Code</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Bin Information */}
          <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>Bin Information</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Typography variant="body2"><strong>Bin ID:</strong> {binData.binId}</Typography>
              <Typography variant="body2"><strong>Type:</strong> {getBinTypeLabel ? getBinTypeLabel(binData.binType) : binData.binType}</Typography>
              <Typography variant="body2"><strong>Owner:</strong> {binData.owner}</Typography>
              <Typography variant="body2"><strong>Capacity:</strong> {binData.capacity} liters</Typography>
            </Box>
          </Paper>

          {/* QR Code */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <QRCodeSVG
              id="qr-code-svg"
              value={qrData}
              size={size}
              level="M"
              includeMargin={true}
            />
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
            QR Code contains complete bin information and access link
          </Typography>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Tooltip title="Download QR Code">
              <IconButton onClick={handleDownload} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Print QR Code">
              <IconButton onClick={handlePrint} color="primary">
                <Print />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Regular QR Generator mode
  return (
    <Box>
      {showControls && (
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Generate QR Code
          </Typography>
          <TextField
            fullWidth
            label="Enter text or URL"
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={!qrValue}
            sx={{ mt: 2 }}
          >
            Generate QR Code
          </Button>
        </Paper>
      )}

      {qrValue && (
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <QRCodeSVG
              id="qr-code-svg"
              value={qrValue}
              size={size}
              level="M"
              includeMargin={true}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Tooltip title="Download QR Code">
              <IconButton onClick={handleDownload} color="primary">
                <Download />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Print QR Code">
              <IconButton onClick={handlePrint} color="primary">
                <Print />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Share QR Code">
              <IconButton onClick={handleShare} color="primary">
                <Share />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Value: {qrValue}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default QRGenerator;