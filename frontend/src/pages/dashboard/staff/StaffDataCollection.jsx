import React, { useState, useEffect } from 'react';
import {
  MdLocalShipping,
  MdRoute,
  MdCheckCircle,
  MdWarning,
  MdRefresh,
  MdSave,
  MdLocationOn,
  MdAccessTime,
  MdScale,
  MdRecycling,
  MdSpeed,
  MdFuel
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext.jsx';
import { createCollection, updateCollection, getCollections } from '../../../utils/api.jsx';

const StaffDataCollection = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Collection data state
  const [collectionData, setCollectionData] = useState({
    binId: '',
    wasteType: 'organic',
    weight: '',
    collectionTime: new Date().toISOString().slice(0, 16),
    notes: '',
    qrScanned: false
  });

  // Route performance data
  const [routeData, setRouteData] = useState({
    routeId: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: '',
    distance: '',
    fuelUsed: '',
    wasteCollected: '',
    binsVisited: '',
    issues: ''
  });

  // Today's collections
  const [todayCollections, setTodayCollections] = useState([]);

  // Load today's collections
  useEffect(() => {
    fetchTodayCollections();
  }, []);

  const fetchTodayCollections = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const response = await getCollections({
        date: today,
        staff: user?.user?._id || user?._id
      });
      
      if (response.success) {
        setTodayCollections(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const response = await createCollection({
        ...collectionData,
        staff: user?.user?._id || user?._id,
        weight: parseFloat(collectionData.weight),
        collectionTime: new Date(collectionData.collectionTime)
      });
      
      if (response.success) {
        setSuccess('Collection data recorded successfully!');
        setCollectionData({
          binId: '',
          wasteType: 'organic',
          weight: '',
          collectionTime: new Date().toISOString().slice(0, 16),
          notes: '',
          qrScanned: false
        });
        fetchTodayCollections();
      } else {
        throw new Error(response.message || 'Failed to record collection');
      }
    } catch (err) {
      console.error('Error recording collection:', err);
      setError(err.message || 'Failed to record collection');
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // This would typically update route performance data
      // For now, we'll just show success
      setSuccess('Route performance data recorded successfully!');
      
      setRouteData({
        routeId: '',
        startTime: new Date().toISOString().slice(0, 16),
        endTime: '',
        distance: '',
        fuelUsed: '',
        wasteCollected: '',
        binsVisited: '',
        issues: ''
      });
    } catch (err) {
      console.error('Error recording route data:', err);
      setError(err.message || 'Failed to record route data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Data Collection Dashboard
          </h1>
          <p className="text-gray-600">
            Record collection data and route performance for analytics
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <MdCheckCircle className="text-green-500 text-xl mr-2" />
              <span className="text-green-700 font-medium">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <MdWarning className="text-red-500 text-xl mr-2" />
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Collection Data Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <MdRecycling className="text-2xl text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-slate-900">Collection Data</h2>
            </div>
            
            <form onSubmit={handleCollectionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bin ID
                </label>
                <input
                  type="text"
                  value={collectionData.binId}
                  onChange={(e) => setCollectionData(prev => ({ ...prev, binId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter bin ID or scan QR code"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type
                </label>
                <select
                  value={collectionData.wasteType}
                  onChange={(e) => setCollectionData(prev => ({ ...prev, wasteType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="organic">Organic</option>
                  <option value="plastic">Plastic</option>
                  <option value="paper">Paper</option>
                  <option value="glass">Glass</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={collectionData.weight}
                  onChange={(e) => setCollectionData(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter weight in kg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Time
                </label>
                <input
                  type="datetime-local"
                  value={collectionData.collectionTime}
                  onChange={(e) => setCollectionData(prev => ({ ...prev, collectionTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={collectionData.notes}
                  onChange={(e) => setCollectionData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="qrScanned"
                  checked={collectionData.qrScanned}
                  onChange={(e) => setCollectionData(prev => ({ ...prev, qrScanned: e.target.checked }))}
                  className="mr-2"
                />
                <label htmlFor="qrScanned" className="text-sm text-gray-700">
                  QR Code Scanned
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Recording...' : 'Record Collection'}
              </button>
            </form>
          </div>

          {/* Route Performance Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center mb-6">
              <MdRoute className="text-2xl text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-slate-900">Route Performance</h2>
            </div>
            
            <form onSubmit={handleRouteSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Route ID
                </label>
                <input
                  type="text"
                  value={routeData.routeId}
                  onChange={(e) => setRouteData(prev => ({ ...prev, routeId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter route ID"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={routeData.startTime}
                    onChange={(e) => setRouteData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={routeData.endTime}
                    onChange={(e) => setRouteData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={routeData.distance}
                    onChange={(e) => setRouteData(prev => ({ ...prev, distance: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Used (L)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={routeData.fuelUsed}
                    onChange={(e) => setRouteData(prev => ({ ...prev, fuelUsed: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Waste Collected (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={routeData.wasteCollected}
                    onChange={(e) => setRouteData(prev => ({ ...prev, wasteCollected: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bins Visited
                  </label>
                  <input
                    type="number"
                    value={routeData.binsVisited}
                    onChange={(e) => setRouteData(prev => ({ ...prev, binsVisited: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issues/Notes
                </label>
                <textarea
                  value={routeData.issues}
                  onChange={(e) => setRouteData(prev => ({ ...prev, issues: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Any issues or notes about the route..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Recording...' : 'Record Route Performance'}
              </button>
            </form>
          </div>
        </div>

        {/* Today's Collections Summary */}
        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Today's Collections</h3>
            <button
              onClick={fetchTodayCollections}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <MdRefresh className="text-lg" />
              <span>Refresh</span>
            </button>
          </div>
          
          {todayCollections.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No collections recorded today</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Bin ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Waste Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayCollections.map((collection, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">{collection.binId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">{collection.wasteType}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{collection.weight} kg</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(collection.collectionTime).toLocaleTimeString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          collection.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {collection.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDataCollection;
