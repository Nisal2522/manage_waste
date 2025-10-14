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
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext.jsx';
import UniversalSidebar from './UniversalSidebar.jsx';

const LayoutWrapper = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open

  // Auto-close on mobile, open on desktop
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Don't show sidebar for unauthenticated users or on landing pages
  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%'
    }}>
      {/* Static Sidebar */}
      <UniversalSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onToggle={handleToggleSidebar}
        isMobile={isMobile}
      />
      
      {/* Main Content */}
      <Box 
        component="main"
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: sidebarOpen ? '280px' : '0px',
          width: sidebarOpen ? 'calc(100% - 280px)' : '100%',
          minHeight: '100vh',
          position: 'relative'
        }}
      >
        {/* Header with Toggle Button */}
        <AppBar 
          position="static" 
          elevation={1}
          sx={{ 
            background: 'white',
            color: 'text.primary',
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="toggle sidebar"
              onClick={handleToggleSidebar}
              sx={{ mr: 2 }}
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
              Waste Management System
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutWrapper;