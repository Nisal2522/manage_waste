import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

// Layout Components
import Navbar from './components/Layout/Navbar.jsx';
import Footer from './components/Layout/Footer.jsx';

// Auth Components
import Login from './components/Auth/Login.jsx';
import Register from './components/Auth/Register.jsx';

// Landing Pages
import Home from './pages/Landing/Home.jsx';
import About from './pages/Landing/About.jsx';
import Services from './pages/Landing/Services.jsx';
import Contact from './pages/Landing/Contact.jsx';

// Dashboard Pages (Placeholder components)
const AdminDashboard = () => <div>Admin Dashboard - Coming Soon</div>;
const StaffDashboard = () => <div>Staff Dashboard - Coming Soon</div>;
const ResidentDashboard = () => <div>Resident Dashboard - Coming Soon</div>;

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
};

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
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
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
                      <div>Dashboard - Role-based routing coming soon</div>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/staff" 
                  element={
                    <ProtectedRoute allowedRoles={['staff', 'admin']}>
                      <StaffDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard/resident" 
                  element={
                    <ProtectedRoute allowedRoles={['resident', 'admin']}>
                      <ResidentDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
