import React, { useState } from 'react';
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
  Menu as MenuIcon,
  Notifications
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import UniversalSidebar from './UniversalSidebar.jsx';

const LayoutWrapper = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Universal Sidebar */}
      <UniversalSidebar 
        open={sidebarOpen} 
        onClose={handleSidebarClose} 
      />
      
      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex',
        flexDirection: 'column',
        ml: sidebarOpen && !isMobile ? '280px' : 0,
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top App Bar */}
        <AppBar 
          position="sticky" 
          elevation={0}
          sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#1f2937',
            zIndex: theme.zIndex.appBar
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {getRoleDisplayName()} Dashboard
            </Typography>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutWrapper;
