import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Avatar,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Recycling,
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Info,
  Business,
  ContactMail,
  AccountCircle,
  Logout,
  Settings,
  Dashboard
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  // Debug logging
  console.log('Navbar - user data:', user);
  console.log('Navbar - user name:', user?.name);
  console.log('Navbar - user email:', user?.email);
  console.log('Navbar - user role:', user?.role);
  console.log('Navbar - isAuthenticated:', isAuthenticated);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
    handleMenuClose();
    handleProfileMenuClose();
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    const userRole = user?.user?.role || user?.role;
    switch (userRole) {
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

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'About', path: '/about', icon: <Info /> },
    { label: 'Services', path: '/services', icon: <Business /> },
    { label: 'Contact', path: '/contact', icon: <ContactMail /> }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Recycling sx={{ mr: 1, color: 'success.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            EcoSmart
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.label}
            component="button"
            onClick={() => handleNavigation(item.path)}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'success.light',
                '& .MuiListItemText-primary': {
                  color: 'success.dark'
                }
              }
            }}
          >
            <ListItemText 
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: 'medium'
                }
              }}
            />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {isAuthenticated ? (
          <>
            {/* User Profile Section */}
            <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
                <Avatar sx={{ 
                  mr: 2, 
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}>
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                    {user?.name || 'User'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                    {user?.email || 'user@example.com'}
                  </Typography>
                  {user?.phone && (
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', display: 'block' }}>
                      📞 {user.phone}
                    </Typography>
                  )}
                  {user?.address?.city && (
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', display: 'block' }}>
                      📍 {user.address.city}, {user.address.district}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip 
                      label={user?.user?.role || user?.role || 'User'} 
                      size="small" 
                      sx={{ 
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        color: 'white',
                        fontSize: '0.7rem',
                        height: 20
                      }} 
                    />
                    {user?.isActive !== false && (
                      <Chip 
                        label="Active" 
                        size="small" 
                        sx={{ 
                          background: '#10b981',
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20
                        }} 
                      />
                    )}
                  </Box>
                  {user?.lastLogin && (
                    <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </Box>
            </ListItem>
            
            {/* Dashboard Link */}
            <ListItem 
              component="button"
              onClick={() => handleNavigation(getDashboardPath())}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'success.light',
                  '& .MuiListItemText-primary': {
                    color: 'success.dark'
                  }
                }
              }}
            >
              <ListItemText 
                primary="Dashboard"
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                    color: 'success.main'
                  }
                }}
              />
            </ListItem>
            
            {/* Logout Button */}
            <ListItem 
              component="button"
              onClick={handleLogout}
              sx={{
                cursor: 'pointer',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.2)'
                }
              }}
            >
              <ListItemText 
                primary="Logout"
                sx={{
                  textAlign: 'center',
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                    color: '#ef4444'
                  }
                }}
              />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem 
              component="button"
              onClick={() => handleNavigation('/login')}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'success.light',
                  '& .MuiListItemText-primary': {
                    color: 'success.dark'
                  }
                }
              }}
            >
              <ListItemText 
                primary="Sign In"
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                    color: 'success.main'
                  }
                }}
              />
            </ListItem>
            <ListItem 
              component="button"
              onClick={() => handleNavigation('/register')}
              sx={{
                cursor: 'pointer',
                backgroundColor: 'success.main',
                mx: 2,
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'success.dark'
                }
              }}
            >
              <ListItemText 
                primary="Get Started"
                sx={{
                  textAlign: 'center',
                  '& .MuiListItemText-primary': {
                    fontWeight: 'bold',
                    color: 'white'
                  }
                }}
              />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.1)',
          zIndex: theme.zIndex.appBar + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo Section */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.05)' },
              transition: 'transform 0.2s ease'
            }}
            onClick={() => navigate('/')}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                background: 'linear-gradient(45deg, #10b981, #059669)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <Recycling sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #10b981, #059669)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1
                }}
              >
                EcoSmart
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                  lineHeight: 1,
                  mt: -0.5,
                  display: 'block'
                }}
              >
                Waste Management
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 'medium',
                    position: 'relative',
                    '&:hover': {
                      color: 'success.main',
                      backgroundColor: 'transparent'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      width: 0,
                      height: 2,
                      backgroundColor: 'success.main',
                      transition: 'width 0.3s ease'
                    },
                    '&:hover::after': {
                      width: '100%'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {!isMobile ? (
              isAuthenticated ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => handleNavigation(getDashboardPath())}
                    startIcon={<Dashboard />}
                    sx={{
                      borderColor: '#10b981',
                      color: '#10b981',
                      fontWeight: 'medium',
                      '&:hover': {
                        borderColor: '#059669',
                        backgroundColor: 'rgba(16, 185, 129, 0.04)'
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                  <Tooltip title="User Profile">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      sx={{
                        p: 0,
                        '&:hover': {
                          transform: 'scale(1.05)'
                        },
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <Avatar sx={{ 
                        width: 40, 
                        height: 40,
                        background: 'linear-gradient(45deg, #10b981, #059669)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        border: '2px solid white'
                      }}>
                        {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  
                  {/* User Profile Menu */}
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                        border: '1px solid rgba(0,0,0,0.1)',
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1
                        }
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {/* User Info Header */}
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                        {user?.name || 'User'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                        {user?.email || 'user@example.com'}
                      </Typography>
                      {user?.phone && (
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', display: 'block' }}>
                          📞 {user.phone}
                        </Typography>
                      )}
                      {user?.address?.city && (
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', display: 'block' }}>
                          📍 {user.address.city}, {user.address.district}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                        <Chip 
                          label={user?.user?.role || user?.role || 'User'} 
                          size="small" 
                          sx={{ 
                            background: 'linear-gradient(45deg, #10b981, #059669)',
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20
                          }} 
                        />
                        {user?.isActive !== false && (
                          <Chip 
                            label="Active" 
                            size="small" 
                            sx={{ 
                              background: '#10b981',
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 20
                            }} 
                          />
                        )}
                      </Box>
                      {user?.lastLogin && (
                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem', display: 'block', mt: 0.5 }}>
                          Last login: {new Date(user.lastLogin).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                    
                    <MenuItem onClick={() => handleNavigation('/profile')}>
                      <AccountCircle sx={{ mr: 1.5, color: '#6b7280' }} />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigation('/settings')}>
                      <Settings sx={{ mr: 1.5, color: '#6b7280' }} />
                      Settings
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: '#ef4444' }}>
                      <Logout sx={{ mr: 1.5, color: '#ef4444' }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => handleNavigation('/login')}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 'medium',
                      '&:hover': {
                        color: 'success.main',
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => handleNavigation('/register')}
                    sx={{
                      background: 'linear-gradient(45deg, #10b981, #059669)',
                      color: 'white',
                      fontWeight: 'bold',
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #059669, #047857)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            backgroundColor: 'background.paper'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
