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
  onGenerate 
}) => {
  const [qrValue, setQrValue] = useState(value || '');
  const [open, setOpen] = useState(false);

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
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${title}</title>
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
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="qr-title">${title}</div>
            ${document.getElementById('qr-code-svg')?.outerHTML || ''}
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
