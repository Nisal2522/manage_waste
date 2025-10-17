import React, { useState, useEffect } from 'react';
import { 
  MdArrowBack,
  MdPerson,
  MdRecycling,
  MdTrendingUp,
  MdLocationOn,
  MdCalendarToday,
  MdCheckCircle,
  MdWarning,
  MdInfo,
  MdBarChart,
  MdPieChart,
  MdTimeline,
  MdRefresh,
  MdDownload,
  MdFilterList,
  MdAssessment
} from 'react-icons/md';
import { FaHome, FaUser, FaCrown, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getBinsByUser, getBinRequestsByUser, getUserStats } from '../../../utils/api';

const UserAnalytics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // Get user data from location state or URL params
  const selectedUser = location.state?.user || null;
  const [userBins, setUserBins] = useState([]);
  const [userBinRequests, setUserBinRequests] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (selectedUser) {
      fetchUserData();
    } else {
      setError('No user selected');
      setLoading(false);
    }
  }, [selectedUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [binsResponse, requestsResponse, statsResponse] = await Promise.all([
        getBinsByUser(selectedUser._id),
        getBinRequestsByUser(selectedUser._id),
        getUserStats()
      ]);

      if (binsResponse.success) {
        setUserBins(binsResponse.data || []);
      }

      if (requestsResponse.success) {
        setUserBinRequests(requestsResponse.data || []);
      }

      if (statsResponse.success) {
        setUserStats(statsResponse.data);
      }
    } catch (err) {
      setError('Error fetching user data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToUsers = () => {
    navigate('/admin/users');
  };

  const handleExportToAnalytics = () => {
    // Navigate to AdminAnalyticsDashboard with user analysis data
    navigate('/admin/analytics', { 
      state: { 
        userAnalysis: {
          userId: selectedUser._id,
          userName: selectedUser.name,
          districtAnalysis: districtAnalysis,
          userAnalytics: userAnalytics,
          userBins: userBins
        }
      } 
    });
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: { 
        bg: 'bg-purple-100', 
        text: 'text-purple-800', 
        icon: <FaCrown className="w-4 h-4" />,
        label: 'Admin'
      },
      staff: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-800', 
        icon: <FaUser className="w-4 h-4" />,
        label: 'Staff'
      },
      resident: { 
        bg: 'bg-green-100', 
        text: 'text-green-800', 
        icon: <FaHome className="w-4 h-4" />,
        label: 'Resident'
      },
      driver: { 
        bg: 'bg-orange-100', 
        text: 'text-orange-800', 
        icon: <FaTruck className="w-4 h-4" />,
        label: 'Driver'
      }
    };
    return colors[role] || { 
      bg: 'bg-gray-100', 
      text: 'text-gray-800', 
      icon: <FaUser className="w-4 h-4" />,
      label: 'User'
    };
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? { 
          bg: 'bg-green-100', 
          text: 'text-green-800', 
          icon: <FaCheckCircle className="w-4 h-4" />,
          label: 'Active'
        }
      : { 
          bg: 'bg-red-100', 
          text: 'text-red-800', 
          icon: <FaTimesCircle className="w-4 h-4" />,
          label: 'Inactive'
        };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate user-specific statistics
  const userAnalytics = {
    totalBins: userBins.length,
    activeBins: userBins.filter(bin => bin.status === 'active').length,
    totalRequests: userBinRequests.length,
    approvedRequests: userBinRequests.filter(req => req.status === 'approved').length,
    pendingRequests: userBinRequests.filter(req => req.status === 'pending').length,
    rejectedRequests: userBinRequests.filter(req => req.status === 'rejected').length,
    averageFillLevel: userBins.length > 0 
      ? (userBins.reduce((sum, bin) => sum + (bin.currentFill || 0), 0) / userBins.length).toFixed(1)
      : 0,
    totalCapacity: userBins.reduce((sum, bin) => sum + (bin.capacity || 0), 0)
  };

  // Calculate fill levels by district from address
  const fillLevelsByDistrict = userBins.reduce((acc, bin) => {
    // Extract district from address - try different patterns
    let district = 'Unknown';
    
    if (bin.address) {
      const addressParts = bin.address.split(',');
      // Try to find district from address parts
      if (addressParts.length >= 2) {
        // Look for common district indicators
        const possibleDistrict = addressParts[1]?.trim() || addressParts[0]?.trim();
        if (possibleDistrict && possibleDistrict !== 'Unknown') {
          district = possibleDistrict;
        }
      } else if (addressParts.length === 1) {
        district = addressParts[0]?.trim() || 'Unknown';
      }
    }
    
    if (!acc[district]) {
      acc[district] = {
        district,
        totalBins: 0,
        totalFill: 0,
        averageFill: 0,
        bins: []
      };
    }
    acc[district].totalBins += 1;
    acc[district].totalFill += bin.currentFill || 0;
    acc[district].bins.push(bin);
    acc[district].averageFill = (acc[district].totalFill / acc[district].totalBins).toFixed(1);
    return acc;
  }, {});

  const districtAnalysis = Object.values(fillLevelsByDistrict).sort((a, b) => b.averageFill - a.averageFill);

  if (loading) {
    return (
      <div className="flex-1 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Loading User Analytics</h3>
            <p className="text-gray-600">Fetching user data and analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedUser) {
    return (
      <div className="flex-1 p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MdWarning className="text-4xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Error Loading User Data</h2>
            <p className="text-lg text-gray-600 mb-8">{error || 'No user selected'}</p>
            <button 
              onClick={handleBackToUsers}
              className="group flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl mx-auto"
            >
              <MdArrowBack className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Users</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-3 md:p-6 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header - Mobile Responsive */}
        <div className="mb-6 md:mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 md:mb-6 gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full lg:w-auto">
                <button
                  onClick={handleBackToUsers}
                  className="group flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-300 text-gray-700 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
                  title="Back to User Management"
                >
                  <MdArrowBack className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span className="font-semibold hidden sm:inline">Back to Users</span>
                  <span className="font-semibold sm:hidden">Back</span>
                </button>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full lg:w-auto">
                  <div className="relative">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-bold text-lg md:text-2xl shadow-xl">
                      {getInitials(selectedUser.name)}
                    </div>
                    <div className="absolute -top-1 md:-top-2 -right-1 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                      {selectedUser.name}
                    </h1>
                    <p className="text-sm md:text-base lg:text-xl text-gray-600 font-medium truncate">{selectedUser.email}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4">
                      <span className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold shadow-lg ${getRoleColor(selectedUser.role).bg} ${getRoleColor(selectedUser.role).text}`}>
                        <span className="mr-1.5 md:mr-2">{getRoleColor(selectedUser.role).icon}</span>
                        {getRoleColor(selectedUser.role).label}
                      </span>
                      <span className={`inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-semibold shadow-lg ${getStatusColor(selectedUser.isActive).bg} ${getStatusColor(selectedUser.isActive).text}`}>
                        <span className="mr-1.5 md:mr-2">{getStatusColor(selectedUser.isActive).icon}</span>
                        {getStatusColor(selectedUser.isActive).label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={fetchUserData}
                className="group flex items-center px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl text-sm md:text-base"
                title="Refresh Data"
              >
                <MdRefresh className="w-4 h-4 md:w-5 md:h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-semibold hidden sm:inline">Refresh Data</span>
                <span className="font-semibold sm:hidden">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Mobile Responsive */}
        <div className="mb-6 md:mb-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl md:rounded-3xl p-2 md:p-3 shadow-2xl">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 md:space-x-3">
              {[
                { id: 'overview', label: 'Overview', icon: <MdBarChart />, color: 'from-blue-500 to-cyan-500' },
                { id: 'bins', label: 'Bins', icon: <MdRecycling />, color: 'from-green-500 to-emerald-500' },
                { id: 'requests', label: 'Requests', icon: <MdCalendarToday />, color: 'from-orange-500 to-red-500' },
                { id: 'analysis', label: 'Analysis', icon: <MdAssessment />, color: 'from-indigo-500 to-purple-500' },
                { id: 'analytics', label: 'Analytics', icon: <MdTrendingUp />, color: 'from-purple-500 to-pink-500' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center justify-center sm:justify-start space-x-2 md:space-x-3 px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all duration-300 font-semibold text-sm md:text-base ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-xl scale-105`
                      : 'text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-lg'
                  }`}
                >
                  <span className={`text-lg md:text-xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                    {tab.icon}
                  </span>
                  <span className="hidden sm:inline text-base md:text-lg">{tab.label}</span>
                  <span className="sm:hidden text-xs">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">Total Bins</h3>
                    <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {userAnalytics.totalBins}
                    </p>
                    <p className="text-sm text-gray-500">All user bins</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <MdRecycling className="text-3xl text-white" />
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">Active Bins</h3>
                    <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      {userAnalytics.activeBins}
                    </p>
                    <p className="text-sm text-gray-500">Currently active</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <MdCheckCircle className="text-3xl text-white" />
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">Total Requests</h3>
                    <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      {userAnalytics.totalRequests}
                    </p>
                    <p className="text-sm text-gray-500">All time requests</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <MdCalendarToday className="text-3xl text-white" />
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-700">Avg Fill Level</h3>
                    <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {userAnalytics.averageFillLevel}%
                    </p>
                    <p className="text-sm text-gray-500">Average utilization</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <MdTrendingUp className="text-3xl text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Request Status Breakdown */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                  <MdBarChart className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Request Status Breakdown
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-green-600 uppercase tracking-wide">Approved</p>
                      <p className="text-3xl font-bold text-green-800">{userAnalytics.approvedRequests}</p>
                      <p className="text-xs text-green-600">
                        {userAnalytics.totalRequests > 0 
                          ? `${((userAnalytics.approvedRequests / userAnalytics.totalRequests) * 100).toFixed(1)}% of total`
                          : '0% of total'
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MdCheckCircle className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
                <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-yellow-600 uppercase tracking-wide">Pending</p>
                      <p className="text-3xl font-bold text-yellow-800">{userAnalytics.pendingRequests}</p>
                      <p className="text-xs text-yellow-600">
                        {userAnalytics.totalRequests > 0 
                          ? `${((userAnalytics.pendingRequests / userAnalytics.totalRequests) * 100).toFixed(1)}% of total`
                          : '0% of total'
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MdWarning className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
                <div className="group bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-red-600 uppercase tracking-wide">Rejected</p>
                      <p className="text-3xl font-bold text-red-800">{userAnalytics.rejectedRequests}</p>
                      <p className="text-xs text-red-600">
                        {userAnalytics.totalRequests > 0 
                          ? `${((userAnalytics.rejectedRequests / userAnalytics.totalRequests) * 100).toFixed(1)}% of total`
                          : '0% of total'
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <MdInfo className="text-2xl text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bins Tab */}
        {activeTab === 'bins' && (
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                  <MdRecycling className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  User's Bins
                </h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Bin ID</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Capacity</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Fill Level</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {userBins.map((bin, index) => (
                    <tr key={bin._id} className={`group hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'}`}>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {bin.binId || bin._id}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-medium">
                          {bin.binType || 'General Waste'}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-medium">
                          {bin.capacity || 'N/A'} L
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-24">
                            <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                              <div 
                                className={`h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-1 ${
                                  (bin.currentFill || 0) > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                  (bin.currentFill || 0) > 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                  (bin.currentFill || 0) > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                  'bg-gradient-to-r from-green-500 to-green-600'
                                }`}
                                style={{ width: `${bin.currentFill || 0}%` }}
                              >
                                {(bin.currentFill || 0) > 15 && (
                                  <span className="text-white text-xs font-bold">
                                    {bin.currentFill || 0}%
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Scale markers for bins */}
                            <div className="flex justify-between mt-1 text-xs text-gray-400">
                              <span>0</span>
                              <span>50</span>
                              <span>100</span>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className={`text-sm font-bold ${
                              (bin.currentFill || 0) > 80 ? 'text-red-600' :
                              (bin.currentFill || 0) > 60 ? 'text-orange-600' :
                              (bin.currentFill || 0) > 40 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {bin.currentFill || 0}%
                            </span>
                            <div className="text-xs text-gray-500">
                              {(bin.currentFill || 0) > 80 ? 'High' :
                               (bin.currentFill || 0) > 60 ? 'Medium' :
                               (bin.currentFill || 0) > 40 ? 'Low' : 'Very Low'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold shadow-sm ${
                          bin.status === 'active' 
                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200'
                        }`}>
                          {bin.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-medium">
                          {bin.address || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="bg-white border-4 border-indigo-500 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-black">User's Bin Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">Bin Type</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">Requested Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userBinRequests.map((request, index) => (
                    <tr key={request._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {request._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.binType || 'General Waste'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(request.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {request.address || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            {/* Fill Levels by City Analysis */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mr-4">
                    <MdAssessment className="text-2xl text-white" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Fill Levels by District
                  </h3>
                </div>
                <button
                  onClick={handleExportToAnalytics}
                  className="group flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                  title="Export to Analytics Dashboard"
                >
                  <MdTrendingUp className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">Export to Analytics</span>
                </button>
              </div>
              
              {/* Fill Level Legend */}
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Fill Level Indicators:</h4>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded"></div>
                    <span className="text-gray-600">Very Low (0-40%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded"></div>
                    <span className="text-gray-600">Low (40-60%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded"></div>
                    <span className="text-gray-600">Medium (60-80%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
                    <span className="text-gray-600">High (80-100%)</span>
                  </div>
                </div>
              </div>
              
              {districtAnalysis.length > 0 ? (
                <div className="space-y-6">
                  {districtAnalysis.map((districtData, index) => (
                    <div key={districtData.district} className="group bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{districtData.district}</h4>
                            <p className="text-sm text-gray-600">{districtData.totalBins} bins in this district</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {districtData.averageFill}%
                          </div>
                          <p className="text-sm text-gray-600">Average Fill Level</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Fill Level Distribution</span>
                          <span className="text-sm text-gray-600">{districtData.averageFill}% average</span>
                        </div>
                        
                        {/* Enhanced Progress Bar with Scale */}
                        <div className="relative">
                          <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                            <div 
                              className={`h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2 ${
                                districtData.averageFill > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                districtData.averageFill > 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                districtData.averageFill > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                'bg-gradient-to-r from-green-500 to-green-600'
                              }`}
                              style={{ width: `${districtData.averageFill}%` }}
                            >
                              <span className="text-white text-xs font-bold">
                                {districtData.averageFill}%
                              </span>
                            </div>
                          </div>
                          
                          {/* Scale Markers */}
                          <div className="flex justify-between mt-2 text-xs text-gray-500">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                          </div>
                          
                          {/* Current Level Indicator */}
                          <div 
                            className={`absolute top-0 w-0.5 h-6 z-10 ${
                              districtData.averageFill > 80 ? 'bg-red-500' :
                              districtData.averageFill > 60 ? 'bg-orange-500' :
                              districtData.averageFill > 40 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ left: `${districtData.averageFill}%` }}
                          >
                            <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-white text-xs px-2 py-1 rounded shadow-lg ${
                              districtData.averageFill > 80 ? 'bg-red-500' :
                              districtData.averageFill > 60 ? 'bg-orange-500' :
                              districtData.averageFill > 40 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}>
                              {districtData.averageFill}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                            <div className="text-lg font-bold text-indigo-600">{districtData.totalBins}</div>
                            <div className="text-xs text-gray-600">Total Bins</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                            <div className={`text-lg font-bold ${
                              districtData.averageFill > 80 ? 'text-red-600' :
                              districtData.averageFill > 60 ? 'text-orange-600' :
                              districtData.averageFill > 40 ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {districtData.averageFill}%
                            </div>
                            <div className="text-xs text-gray-600">Average Fill</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                            <div className="text-lg font-bold text-red-600">
                              {districtData.bins.filter(bin => bin.currentFill > 80).length}
                            </div>
                            <div className="text-xs text-gray-600">High Fill (&gt;80%)</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                            <div className="text-lg font-bold text-green-600">
                              {districtData.bins.filter(bin => bin.currentFill < 20).length}
                            </div>
                            <div className="text-xs text-gray-600">Low Fill (&lt;20%)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MdLocationOn className="text-3xl text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">No Location Data Available</h4>
                  <p className="text-gray-600">Bin location data is required for city analysis</p>
                </div>
              )}
            </div>

            {/* Summary Statistics */}
            {districtAnalysis.length > 0 && (
              <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                  Analysis Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-blue-800">Highest Fill District</h4>
                      <MdTrendingUp className="text-2xl text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-blue-900 mb-2">{districtAnalysis[0]?.district}</div>
                    <div className="text-sm text-blue-700">{districtAnalysis[0]?.averageFill}% average fill</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-green-800">Total Districts</h4>
                      <MdLocationOn className="text-2xl text-green-600" />
                    </div>
                    <div className="text-3xl font-bold text-green-900 mb-2">{districtAnalysis.length}</div>
                    <div className="text-sm text-green-700">Districts with bins</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-purple-800">Overall Average</h4>
                      <MdBarChart className="text-2xl text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-purple-900 mb-2">{userAnalytics.averageFillLevel}%</div>
                    <div className="text-sm text-purple-700">System-wide average</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white border-4 border-indigo-500 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-black mb-4">User Performance Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">Bin Utilization</h4>
                  <p className="text-3xl font-bold text-blue-900">{userAnalytics.averageFillLevel}%</p>
                  <p className="text-sm text-blue-600">Average fill level across all bins</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-green-800 mb-2">Total Capacity</h4>
                  <p className="text-3xl font-bold text-green-900">{userAnalytics.totalCapacity}L</p>
                  <p className="text-sm text-green-600">Combined capacity of all bins</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-4 border-purple-500 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-black mb-4">Request Success Rate</h3>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-purple-600">
                    {userAnalytics.totalRequests > 0 
                      ? ((userAnalytics.approvedRequests / userAnalytics.totalRequests) * 100).toFixed(1)
                      : 0}%
                  </div>
                  <p className="text-lg text-gray-600">Approval Rate</p>
                  <p className="text-sm text-gray-500">
                    {userAnalytics.approvedRequests} approved out of {userAnalytics.totalRequests} total requests
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAnalytics;
