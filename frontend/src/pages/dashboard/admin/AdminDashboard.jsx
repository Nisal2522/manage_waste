import React, { useState, useEffect } from 'react';
import {
  MdDashboard,
  MdPeople,
  MdRecycling,
  MdTrendingUp,
  MdNotifications,
  MdSettings,
  MdAdd,
  MdMoreVert,
  MdCheckCircle,
  MdWarning,
  MdError,
  MdInfo,
  MdFilterList,
  MdDownload,
  MdLocalShipping,
  MdInventory,
  MdSupervisorAccount,
  MdBarChart,
  MdPeopleAlt,
  MdNotificationsActive,
  MdExport,
  MdRefresh
} from 'react-icons/md';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { getUsers, updateUser, deleteUser, getUserStats } from '../../../utils/api.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  
  // User management state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    userGrowthPercentage: 0,
    activeStaff: 0,
    activeStaffGrowth: 0
  });
  const [statsLoading, setStatsLoading] = useState(false);
  
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers();
      
      if (response && response.success) {
        setUsers(response.data || []);
      } else {
        throw new Error(response?.message || 'Failed to fetch users');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await getUserStats();
      
      if (response && response.success) {
        const stats = response.data;
        console.log('API Stats response:', stats);
        setDashboardStats({
          totalUsers: stats.totalUsers || 0,
          activeUsers: stats.activeUsers || 0,
          newUsersThisMonth: stats.newUsersThisMonth || 0,
          userGrowthPercentage: stats.userGrowthPercentage || 0,
          activeStaff: stats.activeStaff || 0,
          activeStaffGrowth: stats.activeStaffGrowth || 0
        });
      } else {
        // Fallback: fetch users and calculate stats
        console.log('Using fallback: fetching users directly');
        const usersResponse = await getUsers();
        console.log('Users API response:', usersResponse);
        if (usersResponse && usersResponse.success) {
          const allUsers = usersResponse.data || [];
          console.log('Fetched users count:', allUsers.length);
          const activeUsers = allUsers.filter(user => user.isActive !== false);
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const newUsersThisMonth = allUsers.filter(user => {
            const userDate = new Date(user.createdAt || user.joinedAt);
            return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
          }).length;
          
          // Calculate active staff (only users with role='staff' and isActive=true)
          console.log('All users:', allUsers);
          console.log('Users with role staff:', allUsers.filter(user => user.role === 'staff'));
          console.log('Users with isActive true:', allUsers.filter(user => user.isActive === true));
          
          // Try different variations of the filter
          const activeStaff1 = allUsers.filter(user => 
            user.role === 'staff' && user.isActive === true
          );
          
          const activeStaff2 = allUsers.filter(user => 
            user.role === 'staff' && user.isActive !== false
          );
          
          const activeStaff3 = allUsers.filter(user => 
            user.role === 'staff'
          );
          
          console.log('Active staff (isActive === true):', activeStaff1.length);
          console.log('Active staff (isActive !== false):', activeStaff2.length);
          console.log('All staff (any status):', activeStaff3.length);
          
          // Use the most permissive filter for now
          const activeStaff = activeStaff2;
          
          console.log('Final active staff count:', activeStaff.length);
          console.log('Active staff users:', activeStaff);
          
          // Calculate staff growth (new staff this month)
          const newStaffThisMonth = allUsers.filter(user => {
            const userDate = new Date(user.createdAt || user.joinedAt);
            return userDate.getMonth() === currentMonth && 
                   userDate.getFullYear() === currentYear && 
                   user.role === 'staff';
          }).length;
          
          setDashboardStats({
            totalUsers: allUsers.length,
            activeUsers: activeUsers.length,
            newUsersThisMonth: newUsersThisMonth,
            userGrowthPercentage: newUsersThisMonth > 0 ? Math.round((newUsersThisMonth / allUsers.length) * 100) : 0,
            activeStaff: activeStaff.length,
            activeStaffGrowth: newStaffThisMonth
          });
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // Fallback to mock data if API fails
      setDashboardStats({
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        userGrowthPercentage: 0,
        activeStaff: 0,
        activeStaffGrowth: 0
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Load users when component mounts or when user management tab is selected
  useEffect(() => {
    if (tabValue === 0) { // User Management tab
      fetchUsers();
    }
  }, [tabValue]);

  // Load dashboard stats when component mounts
  useEffect(() => {
    fetchDashboardStats();
  }, []);



  // Handle user status update
  const handleUserStatusUpdate = async (userId, newStatus) => {
    try {
      setLoading(true);
      const response = await updateUser(userId, { isActive: newStatus === 'active' });
      
      if (response && response.success) {
        // Update user in local state
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user._id === userId || user.id === userId
              ? { ...user, isActive: newStatus === 'active' }
              : user
          )
        );
        
        // Refresh dashboard stats after user status change
        fetchDashboardStats();
      } else {
        throw new Error(response?.message || 'Failed to update user status');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err.response?.data?.message || err.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleUserDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setLoading(true);
        const response = await deleteUser(userId);
        
        if (response && response.success) {
          // Remove user from local state
          setUsers(prevUsers => 
            prevUsers.filter(user => (user._id || user.id) !== userId)
          );
          
          // Refresh dashboard stats after user deletion
          fetchDashboardStats();
        } else {
          throw new Error(response?.message || 'Failed to delete user');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.message || 'Failed to delete user');
      } finally {
        setLoading(false);
      }
    }
  };
  
  // Dynamic stats based on real data
  const stats = [
    { 
      title: 'Total Users', 
      value: statsLoading ? 'Loading...' : dashboardStats.totalUsers.toLocaleString(), 
      change: dashboardStats.userGrowthPercentage > 0 ? `+${dashboardStats.userGrowthPercentage}%` : '0%', 
      color: '#3b82f6', 
      icon: <MdPeopleAlt /> 
    },
    { title: 'Waste Collected', value: '156.8 tons', change: '+8%', color: '#10b981', icon: <MdRecycling /> },
    { 
      title: 'Active Staff', 
      value: statsLoading ? 'Loading...' : dashboardStats.activeStaff.toString(), 
      change: dashboardStats.activeStaffGrowth > 0 ? `+${dashboardStats.activeStaffGrowth}` : '0', 
      color: '#f59e0b', 
      icon: <MdLocalShipping /> 
    },
    { title: 'System Efficiency', value: '94%', change: '+2%', color: '#6366f1', icon: <MdBarChart /> }
  ];

  const systemAlerts = [
    { id: 1, type: 'error', message: 'Server load exceeded threshold', time: '2 hours ago' },
    { id: 2, type: 'warning', message: 'Database backup pending', time: '1 day ago' },
    { id: 3, type: 'info', message: 'System update available', time: '2 days ago' },
    { id: 4, type: 'success', message: 'All services operational', time: '3 days ago' }
  ];

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return <MdCheckCircle className="text-green-500 text-xl" />;
      case 'info': return <MdInfo className="text-blue-500 text-xl" />;
      case 'warning': return <MdWarning className="text-yellow-500 text-xl" />;
      case 'error': return <MdError className="text-red-500 text-xl" />;
      default: return <MdInfo className="text-blue-500 text-xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  return (
    <div className="flex-1 p-3 md:p-6 min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header - Mobile Responsive */}
        <div className="mb-6 md:mb-8">
          <div className="bg-white border-4 border-blue-500 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl" style={{borderImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6) 1'}}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black flex items-center">
                <MdDashboard className="text-blue-600 mr-2 md:mr-3" size={32} />
                <span className="hidden sm:inline">Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 w-full lg:w-auto">
                <button 
                  onClick={fetchDashboardStats}
                  disabled={statsLoading}
                  className="flex items-center justify-center px-3 md:px-4 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-600 rounded-lg md:rounded-xl hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25 text-sm md:text-base"
                  title="Refresh Dashboard Stats"
                >
                  <MdRefresh className={`w-4 h-4 mr-2 ${statsLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{statsLoading ? 'Refreshing...' : 'Refresh Stats'}</span>
                  <span className="sm:hidden">{statsLoading ? '...' : 'Refresh'}</span>
                </button>
                <button className="flex items-center justify-center px-3 md:px-4 py-2 bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-600 rounded-lg md:rounded-xl hover:bg-gray-500/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gray-500/25 text-sm md:text-base">
                  <MdDownload className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Export Report</span>
                  <span className="sm:hidden">Export</span>
                </button>
                <button className="relative px-3 md:px-4 py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-600 rounded-lg md:rounded-xl hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25">
                  <MdNotifications className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center font-bold text-xs">
                    4
                  </span>
                </button>
              </div>
            </div>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 font-light tracking-wide">
              Comprehensive system overview and management controls for waste management operations
            </p>
          </div>
        </div>

        {/* Stats Cards - Mobile Responsive */}
        <div className="mb-6 md:mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => {
              const colors = [
                { border: 'border-blue-500', gradient: 'from-blue-400 to-cyan-400', bg: 'from-blue-300 to-cyan-300' },
                { border: 'border-green-500', gradient: 'from-green-400 to-emerald-400', bg: 'from-green-300 to-emerald-300' },
                { border: 'border-orange-500', gradient: 'from-orange-400 to-yellow-400', bg: 'from-orange-300 to-yellow-300' },
                { border: 'border-purple-500', gradient: 'from-purple-400 to-violet-400', bg: 'from-purple-300 to-violet-300' }
              ];
              const colorScheme = colors[index] || colors[0];
              
              return (
                <div key={index} className={`bg-white border-4 ${colorScheme.border} rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl relative overflow-hidden hover:scale-105 transition-all duration-300`}>
                  <div className={`absolute top-0 right-0 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br ${colorScheme.bg} rounded-full transform translate-x-4 md:translate-x-8 -translate-y-4 md:-translate-y-8`} />
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <h3 className="text-sm md:text-base lg:text-lg font-medium text-gray-800">{stat.title}</h3>
                      <div className={`bg-gradient-to-r ${colorScheme.gradient} rounded-lg md:rounded-xl px-2 md:px-3 py-1 shadow-lg`}>
                        <span className="text-white font-bold text-xs">{stat.change}</span>
                </div>
                </div>
                    
                    <div className="flex justify-between items-end">
                      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">{stat.value}</div>
                      <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${colorScheme.gradient} rounded-lg md:rounded-xl flex items-center justify-center shadow-lg`}>
                      <span className="text-lg md:text-xl">{stat.icon}</span>
                  </div>
                </div>
                    
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colorScheme.gradient} rounded-b-2xl md:rounded-b-3xl`} />
              </div>
            </div>
              );
            })}
            </div>
        </div>

        {/* Main Content Area with Tabs - Mobile Responsive */}
        <div className="bg-white border-4 border-blue-500 rounded-2xl md:rounded-3xl shadow-xl mb-6 md:mb-8 overflow-hidden">
          <div className="border-b-4 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex flex-col sm:flex-row">
              {[
                { label: 'User Management', icon: <MdPeopleAlt className="text-lg" /> },
                { label: 'Waste Collection', icon: <MdRecycling className="text-lg" /> }
              ].map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setTabValue(index)}
                  className={`flex items-center space-x-2 md:space-x-3 px-4 md:px-6 lg:px-8 py-4 md:py-6 text-xs md:text-sm font-bold transition-all duration-300 border-b-4 ${
                    tabValue === index
                      ? 'text-green-700 border-green-500 bg-white shadow-lg transform scale-105'
                      : 'text-gray-600 border-transparent hover:text-green-700 hover:bg-white/50 hover:scale-105'
                  }`}
                >
                  <span className={tabValue === index ? 'text-green-600' : 'text-gray-500'}>
                  {tab.icon}
                  </span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content - Mobile Responsive */}
          <div className="p-4 md:p-6 lg:p-8">
            
            {/* User Management Tab */}
            {tabValue === 0 && (
                      <div>
                {/* Professional Header */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border-4 border-blue-500 rounded-3xl p-6 mb-8 shadow-xl">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <MdPeopleAlt className="text-2xl text-white" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-800">User Management</h3>
                        <p className="text-gray-600 font-medium">Manage system users, roles, and permissions</p>
                        </div>
                        </div>
                    <div className="flex gap-4">
                    <button 
                      onClick={fetchUsers}
                        className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-white hover:border-gray-400 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                    >
                        <MdRefresh className="text-xl" />
                      <span>Refresh</span>
                    </button>
                    <button 
                      onClick={() => navigate('/admin/users')}
                        className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                    >
                        <MdAdd className="text-xl" />
                      <span>Manage Users</span>
                    </button>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 bg-red-50 border-4 border-red-200 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
                        <MdError className="text-red-500 text-2xl" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-red-800">Error Loading Users</h4>
                        <p className="text-red-700 font-medium">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="bg-white border-4 border-blue-500 rounded-3xl p-8 shadow-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-lg font-semibold text-gray-700">Loading users...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Users Table */}
                {!loading && (
                  <div className="bg-white border-4 border-gray-300 rounded-3xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                          <tr>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">NAME</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">EMAIL</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">ROLE</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">STATUS</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">JOINED</th>
                            <th className="px-8 py-6 text-left text-sm font-bold text-gray-800 uppercase tracking-wider">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y-2 divide-gray-100">
                          {users.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="px-8 py-12 text-center">
                                <div className="bg-gray-50 border-4 border-gray-200 rounded-3xl p-8">
                                  <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <MdPeopleAlt className="text-3xl text-gray-400" />
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-600 mb-2">No Users Found</h3>
                                  <p className="text-gray-500">No users are currently registered in the system.</p>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            users.map((user, index) => (
                              <tr key={user._id || user.id} className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}`}>
                                <td className="px-8 py-6 whitespace-nowrap">
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-lg">
                                      {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                                    </div>
                                    <div>
                                      <div className="text-lg font-bold text-gray-800">
                                        {user.name || 'Unknown User'}
                                      </div>
                                      <div className="text-sm text-gray-500 font-medium">
                                        ID: {user._id || user.id}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-gray-700">
                                  {user.email || 'No email'}
                                  </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                  <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                                    user.role === 'admin' || user.role === 'supervisor'
                                      ? 'bg-purple-100 text-purple-800 border-2 border-purple-200' 
                                      : user.role === 'collector' || user.role === 'staff'
                                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                                      : 'bg-gray-100 text-gray-800 border-2 border-gray-200'
                                  }`}>
                                    {user.role || 'resident'}
                                  </span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                  <span
                                    onClick={() => handleUserStatusUpdate(user._id || user.id, user.isActive ? 'inactive' : 'active')}
                                    className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg ${
                                      user.isActive 
                                        ? 'bg-green-100 text-green-800 border-2 border-green-200 hover:bg-green-200' 
                                        : 'bg-red-100 text-red-800 border-2 border-red-200 hover:bg-red-200'
                                    }`}
                                  >
                                    {user.isActive ? 'active' : 'inactive'}
                                  </span>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-gray-700">
                                  {formatDate(user.createdAt || user.joinedAt)}
                                  </div>
                                </td>
                                <td className="px-8 py-6 whitespace-nowrap">
                                  <div className="flex items-center space-x-3">
                                    <button 
                                      onClick={() => setSelectedUser(user)}
                                      className="w-10 h-10 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                                      title="View Details"
                                    >
                                      <FaEye className="text-lg" />
                                    </button>
                                    <button 
                                      onClick={() => setSelectedUser(user)}
                                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                                      title="Edit User"
                                    >
                                      <FaEdit className="text-lg" />
                                    </button>
                                    <button 
                                      onClick={() => handleUserDelete(user._id || user.id)}
                                      className="w-10 h-10 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                                      title="Delete User"
                                    >
                                      <FaTrash className="text-lg" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Waste Collection Tab */}
            {tabValue === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Collection Routes
                    </h3>
                    <button className="flex items-center space-x-2 border border-slate-900 text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                      <MdAdd className="text-lg" />
                      <span>Add Route</span>
                    </button>
                  </div>
                  <div className="bg-white border-4 border-green-500 rounded-xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Route ID</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Area</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Collector</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {[
                          { id: 'RT-1001', area: 'North Zone', collector: 'John Doe', status: 'active', progress: 75 },
                          { id: 'RT-1002', area: 'East Zone', collector: 'Jane Smith', status: 'active', progress: 45 },
                          { id: 'RT-1003', area: 'South Zone', collector: 'Robert Johnson', status: 'pending', progress: 0 },
                          { id: 'RT-1004', area: 'West Zone', collector: 'Emily Brown', status: 'completed', progress: 100 }
                        ].map((route) => (
                            <tr key={route.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className="text-sm font-semibold text-slate-900">{route.id}</span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                {route.area}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                {route.collector}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  route.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : route.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {route.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full transition-all duration-300 ${
                                        route.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                                      }`}
                                      style={{ width: `${route.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-semibold text-gray-600 min-w-[30px]">
                                  {route.progress}%
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Waste Categories
                    </h3>
                  </div>
                  <div className="bg-white border-4 border-green-500 rounded-xl p-4 shadow-lg">
                      {[
                        { name: 'Organic Waste', amount: '68.2 tons', percentage: 43, color: '#10b981' },
                        { name: 'Recyclable Materials', amount: '45.7 tons', percentage: 29, color: '#3b82f6' },
                        { name: 'Hazardous Waste', amount: '12.4 tons', percentage: 8, color: '#ef4444' },
                        { name: 'Other Waste', amount: '30.5 tons', percentage: 20, color: '#f59e0b' }
                      ].map((category, index) => (
                      <div key={index} className={index < 3 ? 'mb-6' : ''}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-slate-900">{category.name}</span>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm font-semibold text-slate-900">{category.amount}</span>
                            <span className="text-xs font-semibold text-gray-600">({category.percentage}%)</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${category.percentage}%`,
                                backgroundColor: category.color
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="w-full mb-8">
          <div className="bg-white border-4 border-purple-500 rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <MdSettings className="text-purple-600 mr-3" size={28} />
            Quick Actions
          </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'User Management', icon: <MdSupervisorAccount />, color: 'blue' },
                { title: 'Collection Routes', icon: <MdLocalShipping />, color: 'green' },
                { title: 'Inventory', icon: <MdInventory />, color: 'orange' },
                { title: 'System Settings', icon: <MdSettings />, color: 'red' }
              ].map((action, index) => {
                const colorClasses = {
                  blue: 'border-blue-500 bg-gradient-to-br from-blue-400 to-cyan-400',
                  green: 'border-green-500 bg-gradient-to-br from-green-400 to-emerald-400',
                  orange: 'border-orange-500 bg-gradient-to-br from-orange-400 to-yellow-400',
                  red: 'border-red-500 bg-gradient-to-br from-red-400 to-pink-400'
                };
                const colorClass = colorClasses[action.color] || colorClasses.blue;
                
                return (
                  <div key={index} className={`bg-white border-4 ${action.color === 'blue' ? 'border-blue-500' : action.color === 'green' ? 'border-green-500' : action.color === 'orange' ? 'border-orange-500' : 'border-red-500'} rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[140px] cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden`}>
                    <div className={`absolute top-0 right-0 w-16 h-16 ${colorClass.split(' ')[1]} rounded-full transform translate-x-6 -translate-y-6`} />
                    <div className="relative z-10">
                      <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <span className="text-2xl text-white">{action.icon}</span>
                </div>
                      <span className="text-sm font-bold text-gray-800">{action.title}</span>
              </div>
                </div>
                );
              })}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
