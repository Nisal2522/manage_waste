import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Check if token is expired
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenData.exp && tokenData.exp < currentTime) {
            // Token is expired, remove it and clear user
            localStorage.removeItem('token');
            setUser(null);
            console.log('Token expired, user logged out');
          } else {
            // Token is valid, get user data
            const response = await getCurrentUser();
            console.log('getCurrentUser response:', response); // Debug log
            
            // Handle API response structure: { success: true, data: { user: {...} } }
            const userData = response.data?.user || response.user || response;
            console.log('Extracted user from getCurrentUser:', userData); // Debug log
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData) => {
    console.log('AuthContext login called with:', userData); // Debug log
    
    // Handle API response structure: { success: true, data: { user: {...}, token: "..." } }
    let user, token;
    
    if (userData.data) {
      // API response format
      user = userData.data.user;
      token = userData.data.token;
    } else if (userData.user) {
      // Direct format with user property
      user = userData.user;
      token = userData.token;
    } else {
      // Fallback to direct user data
      user = userData;
      token = userData.token;
    }
    
    console.log('Extracted user data:', user); // Debug log
    console.log('Extracted token:', token); // Debug log
    
    setUser(user);
    if (token) {
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage'); // Debug log
    }
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Optional: Call logout endpoint to invalidate token on server
    // This ensures the JWT is properly expired on the backend
    try {
      // You can add a logout API call here if your backend supports it
      // await logoutUser();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
