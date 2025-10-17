import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdQrCode, 
  MdArrowBack, 
  MdSearch, 
  MdRefresh,
  MdDownload,
  MdPrint,
  MdContentCopy
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getBins } from '../../../utils/api.jsx';
import SimpleQRGenerator from '../../../components/common/SimpleQRGenerator.jsx';

const AdminQRGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBin, setSelectedBin] = useState(null);

  useEffect(() => {
    fetchBins();
  }, []);

  const fetchBins = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getBins();
      
      if (response && response.success) {
        setBins(response.data);
      } else {
        throw new Error(response?.message || 'Failed to fetch bins');
      }
    } catch (err) {
      console.error('Error fetching bins:', err);
      setError(err.message || 'Failed to fetch bins');
    } finally {
      setLoading(false);
    }
  };

  const filteredBins = bins.filter(bin => 
    bin.binId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.binType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateQR = (binId, collectionUrl) => {
    console.log('Generated QR for bin:', binId);
    console.log('Collection URL:', collectionUrl);
    // You can add additional logic here if needed
  };

  if (loading) {
    return (
      <div className="flex-1 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Bins</h3>
          <p className="text-gray-600">Fetching bin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => navigate('/admin')}
                  className="group flex items-center px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-300 text-gray-700 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  title="Back to Admin Dashboard"
                >
                  <MdArrowBack className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-semibold">Back to Admin</span>
                </button>
                
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                    <MdQrCode className="text-3xl" />
                  </div>
                  
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      QR Code Generator
                    </h1>
                    <p className="text-xl text-gray-600 font-medium">
                      Generate QR codes for waste bins with auto-collection URLs
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={fetchBins}
                disabled={loading}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                title="Refresh Bins"
              >
                <MdRefresh className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                <span className="font-semibold">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Search bins by ID, type, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold">!</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-800">Error Loading Bins</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bins Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBins.map((bin) => (
            <div key={bin._id} className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              {/* Bin Info */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Bin {bin.binId}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    bin.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : bin.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {bin.status}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Type:</strong> {bin.binType}</p>
                  <p><strong>Capacity:</strong> {bin.capacity}L</p>
                  <p><strong>Current Fill:</strong> {bin.currentFill}%</p>
                  <p><strong>Address:</strong> {bin.address || 'Not specified'}</p>
                </div>
              </div>

              {/* QR Generator */}
              <SimpleQRGenerator
                binId={bin.binId}
                binType={bin.binType}
                onGenerate={handleGenerateQR}
                title={`QR Code for Bin ${bin.binId}`}
              />
            </div>
          ))}
        </div>

        {/* No Bins Message */}
        {filteredBins.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
              <div className="text-gray-400 text-6xl mb-6">📦</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {searchTerm ? 'No bins found matching your search' : 'No bins available'}
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                {searchTerm 
                  ? 'Try adjusting your search terms or clear the search to see all bins.'
                  : 'Bins will appear here once they are created in the system.'
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminQRGenerator;
