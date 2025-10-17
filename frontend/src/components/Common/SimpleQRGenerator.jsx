import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { MdQrCode, MdDownload, MdRefresh, MdContentCopy } from 'react-icons/md';

const SimpleQRGenerator = ({ 
  binId, 
  binType, 
  onGenerate,
  title = "Generate QR Code for Bin"
}) => {
  const [qrData, setQrData] = useState('');
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-generate QR code when component mounts
  useEffect(() => {
    if (binId) {
      generateQRCode();
    }
  }, [binId]);

  const generateQRCode = async () => {
    if (!binId) {
      setError('Bin ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create collection URL that will auto-submit collection
      const baseUrl = window.location.origin;
      const collectionUrl = `${baseUrl}/staff/collect?binId=${binId}&autoSubmit=true`;
      
      setQrData(collectionUrl);
      setGenerated(true);
      
      if (onGenerate) {
        onGenerate(collectionUrl);
      }
    } catch (err) {
      setError('Failed to generate QR code');
      console.error('QR generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    const canvas = document.querySelector('#qr-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `bin-${binId}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qrData).then(() => {
      alert('QR URL copied to clipboard!');
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <MdQrCode className="text-2xl text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Bin ID: {binId}</p>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-blue-600 font-semibold">Generating QR Code...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Generated QR Code */}
      {generated && qrData && (
        <div className="space-y-4">
          {/* QR Code Display */}
          <div className="text-center">
            <div className="bg-white p-4 rounded-xl border-2 border-gray-200 inline-block">
              <QRCodeSVG
                value={qrData}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                includeMargin={true}
              />
            </div>
          </div>

          {/* QR URL */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2">Collection URL:</p>
            <p className="text-sm text-gray-800 break-all font-mono">{qrData}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={downloadQR}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
            >
              <MdDownload className="text-lg" />
              <span>Download</span>
            </button>
            
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
            >
              <MdContentCopy className="text-lg" />
              <span>Copy URL</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-blue-800 text-xs">
              <strong>Instructions:</strong> Print this QR code and attach it to the waste bin. 
              When staff scan it, the collection will be automatically submitted.
            </p>
          </div>

          {/* Regenerate Button */}
          <button
            onClick={() => {
              setGenerated(false);
              setQrData('');
              generateQRCode();
            }}
            className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-semibold"
          >
            <MdRefresh className="text-lg" />
            <span>Regenerate QR Code</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleQRGenerator;
