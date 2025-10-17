import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
  Divider,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Dashboard,
  Delete,
  Assignment,
  Payment,
  Analytics,
  People,
  RequestPage,
  AccountCircle,
  Logout,
  Settings,
  Notifications,
  Home,
  Recycling,
  LocationOn,
  History,
  Report,
  Support,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const UniversalSidebar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Debug logging
  console.log("UniversalSidebar - user data:", user);
  console.log("UniversalSidebar - user role:", user?.role);

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      {
        text: "Dashboard",
        icon: <Dashboard />,
        path: getDashboardPath(),
      },
    ];

    switch (user?.role) {
      case "admin":
        return [
          ...baseItems,
          {
            text: "Waste Bins",
            icon: <Delete />,
            path: "/admin/bins",
          },
          {
            text: "Collections",
            icon: <Assignment />,
            path: "/admin/collections",
          },
          {
            text: "Payments",
            icon: <Payment />,
            path: "/admin/payments",
          },
          {
            text: "Analytics",
            icon: <Analytics />,
            path: "/admin/analytics",
          },
          {
            text: "Users",
            icon: <People />,
            path: "/admin/users",
          },
          {
            text: "Bin Requests",
            icon: <RequestPage />,
            path: "/admin/bin-requests",
          },
        ];

      case "staff":
        return [
          ...baseItems,
          {
            text: "My Routes",
            icon: <Assignment />,
            path: "/staff/routes",
          },
          {
            text: "Collections",
            icon: <Recycling />,
            // Point to the QR collection page (existing route)
            path: "/staff/qr-collection",
          },
          {
            text: "Bins",
            icon: <Delete />,
            path: "/staff/bins",
          },
          {
            text: "Reports",
            icon: <Report />,
            path: "/staff/reports",
          },
          {
            text: "Support",
            icon: <Support />,
            path: "/staff/support",
          },
        ];

      case "resident":
        return [
          ...baseItems,
          {
            text: "My Bins",
            icon: <Delete />,
            path: "/resident/my-bins",
          },
          {
            text: "Collection History",
            icon: <History />,
            path: "/resident/history",
          },
          {
            text: "Bin Requests",
            icon: <RequestPage />,
            path: "/resident/requests",
          },
          {
            text: "My Invoices",
            icon: <Payment />,
            path: "/resident/invoices",
          },
          {
            text: "Support",
            icon: <Support />,
            path: "/resident/support",
          },
        ];

      default:
        return baseItems;
    }
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "staff":
        return "/dashboard/staff";
      case "resident":
        return "/dashboard/resident";
      default:
        return "/login";
    }
  };

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case "admin":
        return "Administrator";
      case "staff":
        return "Staff Member";
      case "resident":
        return "Resident";
      default:
        return "User";
    }
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case "admin":
        return "#ef4444";
      case "staff":
        return "#3b82f6";
      case "resident":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const menuItems = getMenuItems();

  const handleItemClick = (path) => {
    navigate(path);
    // Removed onClose call to prevent sidebar from closing when menu items are clicked
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate("/profile");
    // Removed onClose call to prevent sidebar from closing
  };

  const handleSettingsClick = () => {
    navigate("/settings");
    // Removed onClose call to prevent sidebar from closing
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      sx={{
        width: 280,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
          borderRight: "1px solid #e2e8f0",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "white",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          {getRoleDisplayName()} Panel
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Waste Management System
        </Typography>
      </Box>

      {/* User Profile Section */}
      <Box sx={{ p: 3, background: "rgba(255, 255, 255, 0.8)" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              mr: 2,
              background: "linear-gradient(45deg, #10b981, #059669)",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            {user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "U"}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#1f2937" }}
            >
              {user?.name || "User"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontSize: "0.75rem" }}
            >
              {user?.email || "user@example.com"}
            </Typography>
            {user?.phone && (
              <Typography
                variant="caption"
                sx={{ color: "#6b7280", fontSize: "0.7rem", display: "block" }}
              >
                📞 {user.phone}
              </Typography>
            )}
            {user?.address?.city && (
              <Typography
                variant="caption"
                sx={{ color: "#6b7280", fontSize: "0.7rem", display: "block" }}
              >
                📍 {user.address.city}
              </Typography>
            )}
            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
              <Chip
                label={getRoleDisplayName()}
                size="small"
                sx={{
                  background: getRoleColor(),
                  color: "white",
                  fontSize: "0.7rem",
                  height: 20,
                }}
              />
              {user?.isActive !== false && (
                <Chip
                  label="Active"
                  size="small"
                  sx={{
                    background: "#10b981",
                    color: "white",
                    fontSize: "0.7rem",
                    height: 20,
                  }}
                />
              )}
            </Box>
            {user?.lastLogin && (
              <Typography
                variant="caption"
                sx={{
                  color: "#6b7280",
                  fontSize: "0.7rem",
                  display: "block",
                  mt: 0.5,
                }}
              >
                Last login: {new Date(user.lastLogin).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Profile">
            <IconButton
              size="small"
              onClick={handleProfileClick}
              sx={{
                background: "rgba(16, 185, 129, 0.1)",
                "&:hover": { background: "rgba(16, 185, 129, 0.2)" },
              }}
            >
              <AccountCircle sx={{ color: "#10b981" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton
              size="small"
              onClick={handleSettingsClick}
              sx={{
                background: "rgba(16, 185, 129, 0.1)",
                "&:hover": { background: "rgba(16, 185, 129, 0.2)" },
              }}
            >
              <Settings sx={{ color: "#10b981" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              sx={{
                background: "rgba(16, 185, 129, 0.1)",
                "&:hover": { background: "rgba(16, 185, 129, 0.2)" },
              }}
            >
              <Notifications sx={{ color: "#10b981" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton
              size="small"
              onClick={handleLogout}
              sx={{
                background: "rgba(239, 68, 68, 0.1)",
                "&:hover": { background: "rgba(239, 68, 68, 0.2)" },
              }}
            >
              <Logout sx={{ color: "#ef4444" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleItemClick(item.path)}
            selected={location.pathname === item.path}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.Mui-selected": {
                background: "linear-gradient(45deg, #10b981, #059669)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #059669, #047857)",
                },
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
                "& .MuiListItemText-primary": {
                  fontWeight: 600,
                },
              },
              "&:hover": {
                background: "rgba(16, 185, 129, 0.1)",
                transform: "translateX(4px)",
                transition: "all 0.2s ease",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.text}
              sx={{
                "& .MuiListItemText-primary": {
                  fontWeight: 500,
                  fontSize: "0.95rem",
                },
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box
        sx={{
          mt: "auto",
          p: 2,
          textAlign: "center",
          background: "rgba(16, 185, 129, 0.05)",
        }}
      >
        <Typography variant="caption" sx={{ color: "#6b7280" }}>
          Waste Management System v1.0
        </Typography>
      </Box>
    </Drawer>
  );
};

export default UniversalSidebar;