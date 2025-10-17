import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token with optional role restrictions
export const authenticateToken = (allowedRoles = null) => {
  return async (req, res, next) => {
  try {
    console.log('🔐 Auth middleware called for:', req.method, req.originalUrl);
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔑 Token present:', !!token);

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    console.log('🔍 Verifying token...');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified, user ID:', decoded.userId);
    
    // Check if user still exists and is active
    console.log('🔍 Looking up user in database...');
    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    console.log('✅ User found:', user.email, 'Active:', user.isActive);

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Add user info to request object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    console.log('👤 User info added to request:', req.user);

    // Check role restrictions if specified
    if (allowedRoles) {
      const userRole = req.user.role;
      const allowedRolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      
      if (!allowedRolesArray.includes(userRole)) {
        console.log('❌ Role check failed:', userRole, 'not in', allowedRolesArray);
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }
    }

    console.log('✅ Auth middleware completed, calling next()');
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Token verification failed',
      error: error.message
    });
  }
  };
};

// Middleware to check if user has required role
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user is admin
export const requireAdmin = requireRole('admin');

// Middleware to check if user is staff or admin
export const requireStaff = requireRole(['staff', 'admin']);

// Middleware to check if user is finance or admin
export const requireFinance = requireRole(['finance', 'admin']);

// Default auth middleware (alias for authenticateToken)
export const authMiddleware = authenticateToken();