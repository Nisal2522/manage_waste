import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

// Layout Components
import Navbar from "./components/Layout/Navbar.jsx";

import UniversalSideBar from "./components/Layout/UniversalSidebar.jsx";

// Auth Components
import Login from "./components/Auth/Login.jsx";
import Register from "./components/Auth/Register.jsx";

// Landing Pages
import Home from "./pages/Landing/Home.jsx";
import About from "./pages/Landing/About.jsx";
import Services from "./pages/Landing/Services.jsx";
import Contact from "./pages/Landing/Contact.jsx";

// Dashboard Pages
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard.jsx";
import AdminBins from "./pages/dashboard/admin/AdminBins.jsx";
import AdminCollections from "./pages/dashboard/admin/AdminCollections.jsx";
import AdminPayments from "./pages/dashboard/admin/AdminPayments.jsx";
import AdminAnalyticsDashboard from "./pages/dashboard/admin/AdminAnalyticsDashboard.jsx";
import AdminUserManagement from "./pages/dashboard/admin/AdminUserManagement.jsx";
import AdminUsers from "./pages/dashboard/admin/AdminUsers.jsx";
import AdminBinRequests from "./pages/dashboard/admin/AdminBinRequests.jsx";
import UserAnalytics from "./pages/dashboard/admin/UserAnalytics.jsx";
import StaffDashboard from "./pages/dashboard/staff/StaffDashboard.jsx";
import StaffDataCollection from "./pages/dashboard/staff/StaffDataCollection.jsx";
import ResidentDataContribution from "./pages/dashboard/resident/ResidentDataContribution.jsx";


// Profile Page
import Profile from "./pages/Profile.jsx";

// Resident
import ResidentDashboard from "./pages/dashboard/resident/ResidentDashboard.jsx";
import ResidentBinRequests from "./pages/dashboard/resident/ResidentBinRequests.jsx";
import MyBins from "./pages/dashboard/resident/MyBin.jsx";

// Layout Components
import LayoutWrapper from "./components/Layout/LayoutWrapper.jsx";

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log("RoleBasedRedirect - user:", user); // Debug log
  console.log("RoleBasedRedirect - isAuthenticated:", isAuthenticated); // Debug log
  console.log("RoleBasedRedirect - loading:", loading); // Debug log

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div>Loading...</div>
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login"); // Debug log
    return <Navigate to="/login" replace />;
  }

  // Handle nested user structure
  const userRole = user?.user?.role || user?.role;
  console.log("User role extracted:", userRole); // Debug log

  switch (userRole) {
    case "admin":
      console.log("Redirecting to admin dashboard"); // Debug log
      return <Navigate to="/dashboard/admin" replace />;
    case "staff":
      console.log("Redirecting to staff dashboard"); // Debug log
      return <Navigate to="/dashboard/staff" replace />;
    case "resident":
      console.log("Redirecting to resident dashboard"); // Debug log
      return <Navigate to="/dashboard/resident" replace />;
    default:
      console.log("Unknown role, redirecting to login"); // Debug log
      return <Navigate to="/login" replace />;
  }
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div>Loading...</div>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Handle nested user structure
  const userRole = user?.user?.role || user?.role;

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleBasedRedirect />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <AdminDashboard />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <AdminDashboard />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bins"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <AdminBins />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/collections"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <AdminCollections />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payments"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <AdminPayments />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <AdminAnalyticsDashboard />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <AdminUserManagement />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/bin-requests"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <AdminBinRequests />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/user-analytics"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <LayoutWrapper>
                        <UserAnalytics />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* Profile Route */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <LayoutWrapper>
                        <Profile />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/staff"
                  element={
                    <ProtectedRoute allowedRoles={["staff", "admin"]}>
                      <LayoutWrapper>
                        <StaffDashboard />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/data-collection"
                  element={
                    <ProtectedRoute allowedRoles={["staff", "admin"]}>
                      <LayoutWrapper>
                        <StaffDataCollection />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/resident"
                  element={
                    <ProtectedRoute allowedRoles={["resident", "admin"]}>
                      <LayoutWrapper>
                        <ResidentDashboard />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resident/requests"
                  element={
                    <ProtectedRoute allowedRoles={["resident", "admin"]}>
                      <LayoutWrapper>
                        <ResidentBinRequests />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resident/my-bins"
                  element={
                    <ProtectedRoute allowedRoles={["resident", "admin"]}>
                      <LayoutWrapper>
                        <MyBins />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resident/data-contribution"
                  element={
                    <ProtectedRoute allowedRoles={["resident", "admin"]}>
                      <LayoutWrapper>
                        <ResidentDataContribution />
                      </LayoutWrapper>
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
