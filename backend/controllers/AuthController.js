import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createAuditLog } from '../services/AuditService.js';
import { sendNotification } from '../services/NotificationService.js';
import { AuditActions, AuditCategories, AuditSeverities } from '../services/AuditService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1d';

// Register a new user
export const register = async (req, res) => {
  try {
    const { name, email, password, role, address, phone, nic, department, employeeId, roleId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || 'resident',
      address,
      phone,
      nic,
      department,
      employeeId,
      roleId
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create audit log
    await createAuditLog(
      AuditActions.USER_REGISTER,
      user,
      { role, email },
      {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        resource: 'User',
        resourceId: user._id,
        category: AuditCategories.AUTHENTICATION,
        severity: AuditSeverities.LOW,
        description: `New user registered: ${email} with role: ${role}`
      }
    );

    // Send welcome notification
    await sendNotification('userRegistration', user, user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Create audit log
    await createAuditLog(
      AuditActions.USER_LOGIN,
      user,
      { email, role: user.role },
      {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        resource: 'User',
        resourceId: user._id,
        category: AuditCategories.AUTHENTICATION,
        severity: AuditSeverities.LOW,
        description: `User logged in: ${email}`
      }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get current user info
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update user profile photo
export const updateProfilePhoto = async (req, res) => {
  try {
    const { profilePhoto } = req.body;
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePhoto },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Update profile photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};