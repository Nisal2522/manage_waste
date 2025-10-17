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
          try {
            const tokenData = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (tokenData.exp && tokenData.exp < currentTime) {
              // Token is expired, remove it and clear user
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
              console.log('Token expired, user logged out');
              setLoading(false);
              return;
            }
          } catch (tokenError) {
            console.log('Invalid token format, clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setLoading(false);
            return;
          }

          // Try to get user from localStorage first (immediate display)
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              console.log('Using stored user data for immediate display:', parsedUser);
              setUser(parsedUser);
              setLoading(false); // Allow user to see the app immediately
            } catch (e) {
              console.log('Failed to parse stored user data');
            }
          }

          // Try to get fresh user data from API (in background)
          try {
            console.log('Attempting to get current user with token...');
            const response = await Promise.race([
              getCurrentUser(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Request timeout')), 5000)
              )
            ]);
            console.log('getCurrentUser response:', response);
            
            // Handle API response structure: { success: true, data: { user: {...} } }
            const userData = response.data?.user || response.user || response;
            console.log('Extracted user from getCurrentUser:', userData);
            
            if (userData && userData._id) {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
              console.log('Updated user data from API');
            }
          } catch (apiError) {
            console.log('API call failed, but keeping stored user data:', apiError.message);
            // Don't clear user data if API fails - keep the stored data
            // This prevents logout on network issues
          }
        } else {
          // No token found
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        
        // Only clear token if it's an authentication error
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        } else {
          // For other errors, keep stored data if available
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
              console.log('Using stored user data after error');
            } catch (e) {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
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
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User data saved to localStorage'); // Debug log
    }
  };

  const logout = () => {
    // Clear user state
    setUser(null);
    
    // Remove token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
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
