import React, { useState, useEffect } from 'react';
import { 
  MdAdd, 
  MdFilterList,
  MdPerson,
  MdEmail,
  MdAdminPanelSettings,
  MdCheckCircle,
  MdCancel,
  MdCalendarToday,
  MdMoreVert,
  MdPeople,
  MdPersonAdd,
  MdTrendingUp,
  MdSecurity,
  MdDownload,
  MdRefresh
} from 'react-icons/md';
import { 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaUserCircle, 
  FaUser, 
  FaChartBar,
  FaHome, 
  FaCrown, 
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUsers,
  FaArrowLeft
} from 'react-icons/fa';
import { HiEnvelope, HiCog8Tooth } from 'react-icons/hi2';
import { HiOutlineSearch } from 'react-icons/hi';
import { PiIdentificationBadgeLight } from 'react-icons/pi';
import { MdOutlineVerifiedUser } from 'react-icons/md';
import { LuCalendarClock } from 'react-icons/lu';
import { useAuth } from '../../../context/AuthContext';
import { getAllUsers, updateUser, deleteUser, getUserStats } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import ExportPdfHtml2Canvas from '../../../components/ExportPdfHtml2Canvas';

const AdminUserManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch users and stats on component mount
  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        setError('Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await getUserStats();
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleViewUserAnalytics = (user) => {
    navigate('/admin/user-analytics', { state: { user } });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
    setEditDialogOpen(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    // Validate form data
    if (!editFormData.name || !editFormData.email) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      });
      return;
    }

    setIsUpdating(true);
    try {
      console.log('Updating user:', selectedUser._id, editFormData);
      const response = await updateUser(selectedUser._id, editFormData);
      console.log('Update response:', response);
      
      if (response.success) {
        setUsers(users.map(user => 
          user._id === selectedUser._id ? { ...user, ...editFormData } : user
        ));
        setEditDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'User updated successfully',
          severity: 'success'
        });
      } else {
        console.error('Update failed:', response);
        setSnackbar({
          open: true,
          message: response.message || 'Failed to update user',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error updating user:', err);
      setSnackbar({
        open: true,
        message: `Error updating user: ${err.message}`,
        severity: 'error'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deleteUser(selectedUser._id);
      if (response.success) {
        setUsers(users.filter(user => user._id !== selectedUser._id));
        setDeleteDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'User deleted successfully',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: response.message || 'Failed to delete user',
          severity: 'error'
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Error deleting user',
        severity: 'error'
      });
    }
  };

  // Helper functions
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

  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleExportToPDF = async () => {
    try {
      const input = document.getElementById('user-management-content');
      if (!input) {
        setSnackbar({
          open: true,
          message: 'Content not found for export',
          severity: 'error'
        });
        return;
      }

      // Import jsPDF and html2canvas dynamically
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      // Capture element
      const canvas = await html2canvas(input, { 
        scale: 2, 
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // If content higher than one page, split
      if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      } else {
        let heightLeft = pdfHeight;
        let position = 0;
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Add first page slice
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        // Add more pages
        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }
      }

      const fileName = `users-export-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      setSnackbar({
        open: true,
        message: 'PDF exported successfully to downloads folder!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbar({
        open: true,
        message: 'Error generating PDF: ' + error.message,
        severity: 'error'
      });
    }
  };


  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && user.isActive) ||
                          (statusFilter === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex-1 p-6 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Users</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 min-h-screen bg-white relative overflow-hidden">
      
      <div className="relative z-10 max-w-7xl mx-auto" id="user-management-content">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white border-4 border-blue-500 rounded-3xl p-8 shadow-xl" style={{borderImage: 'linear-gradient(45deg, #3b82f6, #8b5cf6) 1'}}>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold text-black flex items-center">
                <FaUsers className="text-blue-600 mr-3" size={40} />
                User Management
              </h1>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchUsers}
                  className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md"
                  title="Refresh Users"
                >
                  <MdRefresh className="w-4 h-4 mr-2" />
                  Refresh
                </button>
                <button
                  onClick={handleExportToPDF}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 border border-green-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  title="Export Users to PDF"
                >
                  <MdDownload className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center px-4 py-2 bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-600 rounded-xl hover:bg-gray-500/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gray-500/25"
                  title="Back to Admin Dashboard"
                >
                  <FaArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </button>
              </div>
            </div>
            <p className="text-lg text-gray-600 font-light tracking-wide">
              Manage system users, roles, and permissions with advanced controls
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users Card */}
            <div className="bg-white border-4 border-blue-500 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full transform translate-x-8 -translate-y-8" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Total Users</h3>
                  <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl px-3 py-1 shadow-lg">
                    <span className="text-white font-bold text-xs">
                      {userStats?.changes?.totalUsers || '+12%'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-black">
                    {userStats?.totalUsers?.toLocaleString() || users.length.toLocaleString()}
                  </div>
                   <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                     <MdPeople className="text-2xl text-white" />
                   </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-b-3xl" />
              </div>
            </div>

            {/* Active Users Card */}
            <div className="bg-white border-4 border-green-500 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-300 to-emerald-300 rounded-full transform translate-x-8 -translate-y-8" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Active Users</h3>
                  <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-xl px-3 py-1 shadow-lg">
                    <span className="text-white font-bold text-xs">
                      {userStats?.changes?.activeUsers || '+8%'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-black">
                    {userStats?.activeUsers?.toLocaleString() || users.filter(user => user.isActive).length.toLocaleString()}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                    <MdCheckCircle className="text-2xl text-white" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-b-3xl" />
              </div>
            </div>

            {/* Admin Users Card */}
            <div className="bg-white border-4 border-purple-500 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-300 to-violet-300 rounded-full transform translate-x-8 -translate-y-8" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Admin Users</h3>
                  <div className="bg-gradient-to-r from-purple-400 to-violet-400 rounded-xl px-3 py-1 shadow-lg">
                    <span className="text-white font-bold text-xs">
                      {userStats?.changes?.adminUsers || '+2%'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-black">
                    {userStats?.adminUsers?.toLocaleString() || users.filter(user => user.role === 'admin').length.toLocaleString()}
                  </div>
                   <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-400 rounded-xl flex items-center justify-center shadow-lg">
                     <MdSecurity className="text-2xl text-white" />
                   </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-violet-400 rounded-b-3xl" />
              </div>
            </div>

            {/* New This Month Card */}
            <div className="bg-white border-4 border-orange-500 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-300 to-red-300 rounded-full transform translate-x-8 -translate-y-8" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-800">New This Month</h3>
                  <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl px-3 py-1 shadow-lg">
                    <span className="text-white font-bold text-xs">
                      {userStats?.changes?.newUsersThisMonth || '+15%'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-black">
                    {userStats?.newUsersThisMonth?.toLocaleString() || users.filter(user => {
                      const userDate = new Date(user.createdAt);
                      const now = new Date();
                      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                    }).length.toLocaleString()}
                  </div>
                   <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                     <MdTrendingUp className="text-2xl text-white" />
                   </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-b-3xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border-4 border-cyan-500 rounded-3xl p-6 mb-6 shadow-xl">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 min-w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <HiOutlineSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Role Filter */}
            <div className="min-w-32">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="resident">Resident</option>
                <option value="driver">Driver</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="min-w-32">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Add User Button */}
             <button className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
               <MdPersonAdd className="text-xl" />
               <span>Add User</span>
             </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white border-4 border-indigo-500 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-100 to-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <FaUserCircle className="text-lg text-blue-600" />
                      <span>Name</span>
                      <span className="text-xs text-blue-500 bg-blue-100 px-2 py-1 rounded-full">Click for Analytics</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <HiEnvelope className="text-lg text-green-600" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <PiIdentificationBadgeLight className="text-lg text-purple-600" />
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <MdOutlineVerifiedUser className="text-lg text-orange-600" />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <LuCalendarClock className="text-lg text-cyan-600" />
                      <span>Joined</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-black uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <HiCog8Tooth className="text-lg text-indigo-600" />
                      <span>Actions</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <tr 
                    key={user._id}
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                          {getInitials(user.name)}
                        </div>
                        <div>
                          <button
                            onClick={() => handleViewUserAnalytics(user)}
                            className="group relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-sm font-semibold text-blue-700 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-300 hover:text-blue-800 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5"
                            title="Click to view user analytics and bin data"
                          >
                            <FaUser className="mr-2 text-blue-600 group-hover:animate-bounce" />
                            {user.name}
                            <FaChartBar className="ml-2 text-blue-500 group-hover:text-blue-700 transition-colors group-hover:animate-pulse" />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role).bg} ${getRoleColor(user.role).text}`}>
                        <span className="mr-2">{getRoleColor(user.role).icon}</span>
                        {getRoleColor(user.role).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive).bg} ${getStatusColor(user.isActive).text}`}>
                        <span className="mr-2">{getStatusColor(user.isActive).icon}</span>
                        {getStatusColor(user.isActive).label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       <div className="flex items-center space-x-3">
                         <button
                           onClick={() => handleViewUser(user)}
                           className="p-3 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-600 rounded-xl hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25"
                           title="View User"
                         >
                           <FaEye className="w-4 h-4" />
                         </button>
                         <button
                           onClick={() => handleEditUser(user)}
                           className="p-3 bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/30 text-yellow-600 rounded-xl hover:bg-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-yellow-500/25"
                           title="Edit User"
                         >
                           <FaEdit className="w-4 h-4" />
                         </button>
                         <button
                           onClick={() => handleDeleteUser(user)}
                           className="p-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-600 rounded-xl hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
                           title="Delete User"
                         >
                           <FaTrash className="w-4 h-4" />
                         </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View User Dialog */}
        {viewDialogOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {getInitials(selectedUser.name)}
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">{selectedUser.name}</h3>
                <p className="text-gray-600 mb-6">{selectedUser.email}</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Role:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(selectedUser.role).bg} ${getRoleColor(selectedUser.role).text}`}>
                      <span className="mr-2">{getRoleColor(selectedUser.role).icon}</span>
                      {getRoleColor(selectedUser.role).label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedUser.isActive).bg} ${getStatusColor(selectedUser.isActive).text}`}>
                      <span className="mr-2">{getStatusColor(selectedUser.isActive).icon}</span>
                      {getStatusColor(selectedUser.isActive).label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Joined:</span>
                    <span className="text-gray-800">{formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setViewDialogOpen(false)}
                  className="mt-6 w-full bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-600 py-3 rounded-xl hover:bg-gray-500/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gray-500/25"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Dialog */}
        {editDialogOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-2xl font-bold text-black mb-6">Edit User</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter user name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={editFormData.role || 'resident'}
                    onChange={(e) => setEditFormData({...editFormData, role: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="resident">Resident</option>
                    <option value="driver">Driver</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={editFormData.isActive || false}
                      onChange={(e) => setEditFormData({...editFormData, isActive: e.target.checked})}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active User</span>
                  </label>
                </div>
              </div>
              
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setEditDialogOpen(false)}
                  disabled={isUpdating}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 ${
                    isUpdating 
                      ? 'bg-gray-300/50 cursor-not-allowed' 
                      : 'bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-600 hover:bg-gray-500/30 hover:border-gray-500/50 hover:scale-105 shadow-lg hover:shadow-gray-500/25'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={isUpdating}
                  className={`flex-1 py-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
                    isUpdating 
                      ? 'bg-gray-400/50 cursor-not-allowed' 
                      : 'bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 text-blue-600 hover:bg-blue-500/30 hover:border-blue-500/50 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Dialog */}
        {deleteDialogOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <FaTrash className="w-8 h-8 text-red-500" />
                 </div>
                <h3 className="text-2xl font-bold text-black mb-2">Delete User</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete <strong>{selectedUser.name}</strong>? This action cannot be undone.
                </p>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => setDeleteDialogOpen(false)}
                    className="flex-1 bg-gray-500/20 backdrop-blur-sm border border-gray-500/30 text-gray-600 py-3 rounded-xl hover:bg-gray-500/30 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-gray-500/25"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-600 py-3 rounded-xl hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-500/25"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar */}
        {snackbar.open && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className={`px-6 py-3 rounded-xl shadow-lg ${
              snackbar.severity === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {snackbar.message}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;