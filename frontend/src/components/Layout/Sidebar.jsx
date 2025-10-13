import React, { useState } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Typography,
  IconButton,
  Tooltip,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { 
  Dashboard, 
  Person, 
  LocationOn, 
  Assignment, 
  Settings,
  Analytics,
  Notifications,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  RequestPage,
  Delete,
  Payment,
  History,
  Support
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = ({ open, onClose, isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: getDashboardPath() }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { text: 'Waste Bins', icon: <Delete />, path: '/admin/bins' },
          { text: 'Collections', icon: <Assignment />, path: '/admin/collections' },
          { text: 'Payments', icon: <Payment />, path: '/admin/payments' },
          { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
          { text: 'Users', icon: <Person />, path: '/admin/users' },
          { text: 'Bin Requests', icon: <RequestPage />, path: '/admin/bin-requests' }
        ];

      case 'staff':
        return [
          ...baseItems,
          { text: 'My Routes', icon: <Assignment />, path: '/staff/routes' },
          { text: 'Collections', icon: <Delete />, path: '/staff/collections' },
          { text: 'Bins', icon: <LocationOn />, path: '/staff/bins' },
          { text: 'Reports', icon: <Analytics />, path: '/staff/reports' },
          { text: 'Support', icon: <Support />, path: '/staff/support' }
        ];

      case 'resident':
        return [
          ...baseItems,
          { text: 'My Bins', icon: <Delete />, path: '/resident/bins' },
          { text: 'Collection History', icon: <History />, path: '/resident/history' },
          { text: 'Bin Requests', icon: <RequestPage />, path: '/resident/requests' },
          { text: 'Payments', icon: <Payment />, path: '/resident/payments' },
          { text: 'Support', icon: <Support />, path: '/resident/support' }
        ];

      default:
        return baseItems;
    }
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'staff':
        return '/dashboard/staff';
      case 'resident':
        return '/dashboard/resident';
      default:
        return '/login';
    }
  };

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'admin': return 'Administrator';
      case 'staff': return 'Staff Member';
      case 'resident': return 'Resident';
      default: return 'User';
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case 'admin': return '#ef4444';
      case 'staff': return '#3b82f6';
      case 'resident': return '#10b981';
      default: return '#6b7280';
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: isCollapsed ? 60 : 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 60 : 280,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRight: '1px solid #e2e8f0',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          position: 'fixed',
          height: '100vh',
          zIndex: 1200
        },
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: isCollapsed ? 1 : 3, 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between'
      }}>
        {!isCollapsed && (
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              {getRoleDisplayName()} Panel
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Waste Management
            </Typography>
          </Box>
        )}
        <Tooltip title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
          <IconButton
            onClick={onToggleCollapse}
            sx={{ 
              color: 'white',
              background: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* User Profile Section - Only show when not collapsed */}
      {!isCollapsed && user && (
        <Box sx={{ p: 3, background: 'rgba(255, 255, 255, 0.8)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                mr: 2,
                background: 'linear-gradient(45deg, #10b981, #059669)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                {user?.email || 'user@example.com'}
              </Typography>
              <Chip 
                label={getRoleDisplayName()} 
                size="small" 
                sx={{ 
                  background: getRoleColor(),
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                  mt: 0.5
                }} 
              />
            </Box>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: isCollapsed ? 0.5 : 2, py: 1 }}>
        {menuItems.map((item) => (
          <Tooltip 
            key={item.text}
            title={isCollapsed ? item.text : ''} 
            placement="right"
            disableHoverListener={!isCollapsed}
          >
            <ListItem
              button
              onClick={() => handleItemClick(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                minHeight: 48,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                px: isCollapsed ? 1 : 2,
                '&.Mui-selected': {
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #059669, #047857)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 600,
                  }
                },
                '&:hover': {
                  background: 'rgba(16, 185, 129, 0.1)',
                  transform: isCollapsed ? 'none' : 'translateX(4px)',
                  transition: 'all 0.2s ease'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isCollapsed ? 'auto' : 40,
                justifyContent: 'center'
              }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      fontSize: '0.95rem'
                    }
                  }}
                />
              )}
            </ListItem>
          </Tooltip>
        ))}
      </List>

      {/* Footer - Only show when not collapsed */}
      {!isCollapsed && (
        <Box sx={{ 
          mt: 'auto', 
          p: 2, 
          textAlign: 'center',
          background: 'rgba(16, 185, 129, 0.05)'
        }}>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Waste Management v1.0
          </Typography>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
