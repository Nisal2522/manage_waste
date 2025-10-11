import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import { 
  Dashboard, 
  Person, 
  LocationOn, 
  Assignment, 
  Settings,
  Analytics,
  Notifications
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
    { text: 'Bins', icon: <LocationOn />, path: '/bins' },
    { text: 'Collections', icon: <Assignment />, path: '/collections' },
    { text: 'Analytics', icon: <Analytics />, path: '/analytics' },
    { text: 'Notifications', icon: <Notifications />, path: '/notifications' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  // Filter menu items based on user role
  const getFilteredMenuItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
        return menuItems;
      case 'staff':
        return menuItems.filter(item => 
          !['Analytics'].includes(item.text)
        );
      case 'resident':
        return menuItems.filter(item => 
          ['Dashboard', 'Profile', 'Bins', 'Collections', 'Notifications', 'Settings'].includes(item.text)
        );
      default:
        return [];
    }
  };

  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap>
          Waste Management
        </Typography>
      </Box>
      <List>
        {getFilteredMenuItems().map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleItemClick(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
