import React, { useState, useEffect, useCallback } from 'react';
import {
  MdDashboard,
  MdRecycling,
  MdSchedule,
  MdTrendingUp,
  MdNotifications,
  MdLocationOn,
  MdCalendarToday,
  MdCheckCircle,
  MdWarning,
  MdInfo,
  MdAdd,
  MdMoreVert,
  MdRequestPage,
  MdDelete,
  MdEdit
} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getBinRequestsByUser } from '../../../utils/api';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [binRequests, setBinRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's bin requests
  const fetchBinRequests = useCallback(async () => {
    // Try different possible user ID properties
    const userId = user?.id || user?._id || user?.user?.id || user?.user?._id;
    
    if (!userId) {
      console.log('No user ID found. User object:', user);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching bin requests for user ID:', userId);
      const response = await getBinRequestsByUser(userId);
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      console.log('Response success:', response.success);
      
      if (response.success && response.data) {
        setBinRequests(response.data);
        console.log('Set bin requests:', response.data);
      } else {
        console.log('No data in response or request failed');
        setBinRequests([]);
      }
    } catch (error) {
      console.error('Error fetching bin requests:', error);
      console.error('Error details:', error.response?.data);
      setBinRequests([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBinRequests();
  }, [fetchBinRequests]);
  
  // Calculate stats from real bin requests data
  const totalRequests = binRequests.length;
  const pendingRequests = binRequests.filter(req => req.status === 'pending').length;
  const approvedRequests = binRequests.filter(req => req.status === 'approved').length;

  // Debug logging
  console.log('Bin requests array:', binRequests);
  console.log('Total requests:', totalRequests);
  console.log('Pending requests:', pendingRequests);
  console.log('Approved requests:', approvedRequests);

  const stats = [
    { title: 'Total Requests', value: totalRequests.toString(), change: '', color: 'bg-blue-500', icon: <MdRequestPage className="text-2xl" /> },
    { title: 'Pending', value: pendingRequests.toString(), change: '', color: 'bg-amber-500', icon: <MdSchedule className="text-2xl" /> },
    { title: 'Approved', value: approvedRequests.toString(), change: '', color: 'bg-green-500', icon: <MdCheckCircle className="text-2xl" /> }
  ];

  // Show recent bin requests as upcoming collections
  const upcomingCollections = binRequests
    .filter(req => req.status === 'pending' || req.status === 'approved')
    .slice(0, 3)
    .map((req, index) => ({
      id: req._id || req.id || index,
      type: req.selectedBins ? req.selectedBins.map(bin => bin.binType).join(', ') : 'General',
      date: req.requestDate ? new Date(req.requestDate).toLocaleDateString() : 'Today',
      time: req.requestDate ? new Date(req.requestDate).toLocaleTimeString() : 'N/A',
      status: req.status
    }));

  // Show recent bin request activities
  const recentActivities = binRequests
    .slice(0, 4)
    .map((req, index) => ({
      id: req._id || req.id || index,
      type: req.status === 'completed' ? 'success' : req.status === 'approved' ? 'info' : 'warning',
      message: `Bin request ${req.status} - ${req.selectedBins ? req.selectedBins.map(bin => bin.binType).join(', ') : 'General'} bins`,
      time: req.requestDate ? new Date(req.requestDate).toLocaleDateString() : 'Recently'
    }));

  const getActivityIcon = (type) => {
    switch (type) {
      case 'success': return <MdCheckCircle className="text-green-500 text-xl" />;
      case 'info': return <MdInfo className="text-blue-500 text-xl" />;
      case 'warning': return <MdWarning className="text-amber-500 text-xl" />;
      default: return <MdInfo className="text-blue-500 text-xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-r from-emerald-200/30 to-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-15 w-36 h-36 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Welcome Back{user?.name ? `, ${user.name}` : user?.user?.name ? `, ${user.user.name}` : ''}! 👋
              </h1>
              <p className="text-gray-600 text-lg">
                Track your waste management activities and environmental impact.
              </p>
            </div>
            <button
              onClick={() => navigate('/resident/data-contribution')}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              <MdRecycling className="text-xl" />
              <span>Contribute Data</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300/50 p-6 h-48 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
                {stat.change && (
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-3xl font-bold text-gray-800 mb-1">
                  {loading ? (
                    <div className="animate-pulse bg-gray-300 h-8 w-12 rounded"></div>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Collections */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300/50 overflow-hidden h-96 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Upcoming Collections</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MdMoreVert className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ) : upcomingCollections.length > 0 ? (
                upcomingCollections.map((collection, index) => (
                  <div key={collection.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <MdRecycling className="text-green-600 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{collection.type} Waste</h4>
                        <p className="text-sm text-gray-600">{collection.date} at {collection.time}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(collection.status)}`}>
                        {collection.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <MdRecycling className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No upcoming collections</p>
                  <p className="text-sm">Create a bin request to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300/50 overflow-hidden h-96 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activities</h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MdMoreVert className="text-gray-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div key={activity.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{activity.message}</p>
                        <p className="text-sm text-gray-600">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <MdInfo className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No recent activities</p>
                  <p className="text-sm">Your activities will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300/50 overflow-hidden h-96 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Environmental Impact</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">CO2 Saved</span>
                  <span className="text-sm font-bold text-gray-800">12.5 kg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Recycling Rate</span>
                  <span className="text-sm font-bold text-gray-800">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Waste Reduction</span>
                  <span className="text-sm font-bold text-gray-800">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300/50 overflow-hidden h-96 flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/resident/requests')}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 font-medium"
                >
                  <MdRequestPage className="text-xl" />
                  <span>Request Bin</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium">
                  <MdAdd className="text-xl" />
                  <span>Schedule Collection</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium">
                  <MdLocationOn className="text-xl" />
                  <span>Find Drop-off</span>
                </button>
                <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium">
                  <MdCalendarToday className="text-xl" />
                  <span>View Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;
