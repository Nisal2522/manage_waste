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
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

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

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setHasPermission(true);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Start QR code detection simulation
      // In a real implementation, you would use a QR code detection library
      // For now, we'll simulate scanning with a timeout
      simulateQRDetection();

    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied or not available. Please check your camera permissions.');
      setHasPermission(false);
      setScanning(false);
    }
  };

  const stopScanning = () => {
    setScanning(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const simulateQRDetection = () => {
    // Simulate QR code detection
    // In a real implementation, you would use a library like jsQR or quagga
    scanIntervalRef.current = setInterval(() => {
      // This is a simulation - in real implementation, you would detect QR codes from the video stream
      // For demo purposes, we'll randomly detect a QR code after a few seconds
      if (Math.random() < 0.1) { // 10% chance per interval
        const mockQRData = `BIN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        handleQRDetected(mockQRData);
      }
    }, 1000);
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
    }, 500);
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
            {/* Camera View */}
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
                <video
                  ref={videoRef}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  playsInline
                  muted
                />
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

              {/* Scanning Overlay */}
              {scanning && hasPermission && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none'
                }}>
                  {/* Scanning Frame */}
                  <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 250,
                    height: 250,
                    border: '2px solid #4CAF50',
                    borderRadius: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      border: '2px solid rgba(76, 175, 80, 0.3)',
                      borderRadius: 2,
                      animation: 'pulse 2s infinite'
                    }
                  }} />

                  {/* Corner Indicators */}
                  {[
                    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 250, height: 250 }
                  ].map((style, index) => (
                    <Box key={index} sx={{ position: 'absolute', ...style }}>
                      {/* Top Left */}
                      <Box sx={{
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        width: 20,
                        height: 20,
                        borderTop: '4px solid #4CAF50',
                        borderLeft: '4px solid #4CAF50'
                      }} />
                      {/* Top Right */}
                      <Box sx={{
                        position: 'absolute',
                        top: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        borderTop: '4px solid #4CAF50',
                        borderRight: '4px solid #4CAF50'
                      }} />
                      {/* Bottom Left */}
                      <Box sx={{
                        position: 'absolute',
                        bottom: -2,
                        left: -2,
                        width: 20,
                        height: 20,
                        borderBottom: '4px solid #4CAF50',
                        borderLeft: '4px solid #4CAF50'
                      }} />
                      {/* Bottom Right */}
                      <Box sx={{
                        position: 'absolute',
                        bottom: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        borderBottom: '4px solid #4CAF50',
                        borderRight: '4px solid #4CAF50'
                      }} />
                    </Box>
                  ))}
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

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </Dialog>
  );
};

export default QRScanner;
