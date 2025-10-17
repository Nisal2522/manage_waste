import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  QrCodeScanner, 
  Close, 
  FlashOn, 
  FlashOff,
  CameraAlt,
  Refresh
} from '@mui/icons-material';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const QRScanner = ({ 
  open, 
  onClose, 
  onScan, 
  title = "Scan QR Code",
  description = "Position the QR code within the frame to scan"
}) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const scannerRef = useRef(null);
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    if (open) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [open]);

  const startScanning = async () => {
    try {
      setError(null);
      setScanning(true);

      // Wait for the DOM element to be available with retry logic
      let qrReaderElement = null;
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!qrReaderElement && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        qrReaderElement = document.getElementById('qr-reader');
        attempts++;
      }

      if (!qrReaderElement) {
        throw new Error('QR reader element not found after multiple attempts');
      }

      // Suppress console warnings from html5-qrcode library
      const originalConsoleWarn = console.warn;
      console.warn = (message) => {
        if (typeof message === 'string' && 
            (message.includes('button') || message.includes('jsx'))) {
          // Suppress these specific warnings
          return;
        }
        originalConsoleWarn(message);
      };

      // Create HTML5 QR Code Scanner
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        supportedScanTypes: [Html5QrcodeSupportedFormats.QR_CODE]
      };

      html5QrcodeScannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        config,
        false
      );

      // Start scanning
      html5QrcodeScannerRef.current.render(
        (decodedText, decodedResult) => {
          console.log('QR Code detected:', decodedText);
          handleQRDetected(decodedText);
        },
        (errorMessage) => {
          // Handle scan errors silently
          console.log('QR Code scan error:', errorMessage);
        }
      );

      // Restore console.warn
      console.warn = originalConsoleWarn;

      setHasPermission(true);

    } catch (err) {
      console.error('Error starting QR scanner:', err);
      setError('Failed to start QR scanner. Please check your camera permissions.');
      setHasPermission(false);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    
    if (html5QrcodeScannerRef.current) {
      html5QrcodeScannerRef.current.clear().catch(err => {
        console.error('Error stopping QR scanner:', err);
      });
      html5QrcodeScannerRef.current = null;
    }
  };

  const handleQRDetected = (qrData) => {
    stopScanning();
    if (onScan) {
      onScan(qrData);
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
    // In a real implementation, you would control the camera flash
  };

  const retryScanning = () => {
    stopScanning();
    setTimeout(() => {
      startScanning();
    }, 1000);
  };

  const handleManualInput = () => {
    const binId = prompt('Enter Bin ID manually:');
    if (binId && binId.trim()) {
      handleQRDetected(binId.trim());
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <QrCodeScanner />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {error && (
          <Alert 
            severity="error" 
            sx={{ m: 2 }}
            action={
              <Button color="inherit" size="small" onClick={retryScanning}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {!error && (
          <>
            {/* QR Scanner */}
            <Box sx={{ 
              position: 'relative',
              width: '100%',
              height: 400,
              bgcolor: 'black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {scanning && hasPermission ? (
                <Box sx={{ width: '100%', height: '100%' }}>
                  <div id="qr-reader" style={{ width: '100%', height: '100%' }}></div>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  color: 'white',
                  gap: 2
                }}>
                  {scanning ? (
                    <CircularProgress color="inherit" />
                  ) : (
                    <CameraAlt sx={{ fontSize: 48, opacity: 0.5 }} />
                  )}
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    {scanning ? 'Initializing camera...' : 'Camera not available'}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Instructions */}
            <Paper sx={{ p: 2, m: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" color="text.secondary" align="center">
                {description}
              </Typography>
            </Paper>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleManualInput}
          variant="outlined"
          startIcon={<QrCodeScanner />}
        >
          Manual Input
        </Button>
        
        <Button
          onClick={toggleFlash}
          variant="outlined"
          startIcon={flashOn ? <FlashOff /> : <FlashOn />}
          disabled={!scanning || !hasPermission}
        >
          {flashOn ? 'Flash Off' : 'Flash On'}
        </Button>
        
        <Button
          onClick={retryScanning}
          variant="outlined"
          startIcon={<Refresh />}
          disabled={scanning}
        >
          Retry
        </Button>
        
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
        >
          Close
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default QRScanner;