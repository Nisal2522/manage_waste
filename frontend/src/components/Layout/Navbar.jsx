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
  Divider
} from '@mui/material';
import {
  Recycling,
  Menu as MenuIcon,
  Close as CloseIcon,
  Home,
  Info,
  Business,
  ContactMail
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
    handleMenuClose();
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
