import React, { useState, useRef, useEffect } from 'react';
import { MdQrCodeScanner, MdClose, MdFlashOn, MdFlashOff } from 'react-icons/md';
import jsQR from 'jsqr';

const SimpleQRScanner = ({ 
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
          facingMode: 'environment', // Use back camera on mobile
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

      // Start scanning for QR codes
      startQRDetection();

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

  const startQRDetection = () => {
    // Simple QR code detection using canvas
    scanIntervalRef.current = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        detectQRCode();
      }
    }, 100);
  };

  const detectQRCode = () => {
    const video = videoRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) return;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // Use jsQR to detect QR codes
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });
    
    if (code) {
      console.log('QR Code detected:', code.data);
      // Stop scanning and call the onScan callback
      stopScanning();
      onScan(code.data);
    }
  };

  const handleManualInput = () => {
    const qrData = prompt('Enter QR code data manually:');
    if (qrData && qrData.trim()) {
      onScan(qrData.trim());
    }
  };

  const toggleFlash = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack && videoTrack.getCapabilities().torch) {
        videoTrack.applyConstraints({
          advanced: [{ torch: !flashOn }]
        }).then(() => {
          setFlashOn(!flashOn);
        }).catch(err => {
          console.log('Flash not supported:', err);
        });
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MdQrCodeScanner className="text-2xl text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose className="text-xl text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-gray-600 text-sm mb-4">{description}</p>

          {/* Camera View */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4">
            {!hasPermission && !error ? (
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <MdQrCodeScanner className="text-4xl mx-auto mb-2" />
                  <p className="text-sm">Requesting camera access...</p>
                </div>
              </div>
            ) : error ? (
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center text-white p-4">
                  <MdQrCodeScanner className="text-4xl mx-auto mb-2" />
                  <p className="text-sm mb-4">{error}</p>
                  <button
                    onClick={startScanning}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleManualInput}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <span>Manual Input</span>
            </button>

            {hasPermission && (
              <button
                onClick={toggleFlash}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {flashOn ? <MdFlashOff className="text-lg" /> : <MdFlashOn className="text-lg" />}
                <span>{flashOn ? 'Flash Off' : 'Flash On'}</span>
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-800 text-xs">
              <strong>Instructions:</strong> Point your camera at the QR code on the waste bin. 
              The code will be automatically detected. If scanning fails, use "Manual Input" to enter the code manually.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleQRScanner;
