import User from '../models/User.js';

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const staffUsers = await User.countDocuments({ role: 'staff' });
    const residentUsers = await User.countDocuments({ role: 'resident' });
    
    // Get new users this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Calculate percentage changes (mock data for now)
    const stats = {
      totalUsers,
      activeUsers,
      adminUsers,
      staffUsers,
      residentUsers,
      newUsersThisMonth,
      changes: {
        totalUsers: '+12%',
        activeUsers: '+8%',
        adminUsers: '+2%',
        newUsersThisMonth: '+15%'
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};
