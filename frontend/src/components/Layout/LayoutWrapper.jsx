import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from './Sidebar.jsx';
import '../../styles/layout.css';

const LayoutWrapper = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  // Get CSS class for main content based on sidebar state
  const getMainContentClass = () => {
    if (isMobile) {
      return 'main-content sidebar-hidden';
    }
    
    if (!sidebarOpen) {
      return 'main-content sidebar-hidden';
    }
    
    if (sidebarCollapsed) {
      return 'main-content sidebar-collapsed';
    }
    
    return 'main-content sidebar-expanded';
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Don't show sidebar for unauthenticated users or on landing pages
  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'admin': return 'Administrator';
      case 'staff': return 'Staff Member';
      case 'resident': return 'Resident';
      default: return 'User';
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      flexDirection: 'row',
      width: '100%'
    }}>
      {/* Fixed Sidebar */}
      <Sidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main Content */}
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 0,  // No margin - content starts from left edge
          width: '100%', // Full width - content takes full available space
          transition: 'all 0.3s ease',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1  // Ensure content is above sidebar
        }}
      >
        {/* Header removed as requested */}

        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutWrapper;
