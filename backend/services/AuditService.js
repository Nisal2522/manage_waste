import AuditLog from '../models/AuditLog.js';
import { sendNotification } from './NotificationService.js';

// Create audit log entry
export const createAuditLog = async (action, user, meta = {}, options = {}) => {
  try {
    const auditLog = new AuditLog({
      action,
      user: user._id || user,
      userEmail: user.email,
      userRole: user.role,
      meta,
      ipAddress: options.ipAddress,
      userAgent: options.userAgent,
      resource: options.resource,
      resourceId: options.resourceId,
      status: options.status || 'success',
      errorMessage: options.errorMessage,
      severity: options.severity || 'low',
      category: options.category || 'system',
      description: options.description
    });

    await auditLog.save();
    
    // Send notification for critical events
    if (options.severity === 'critical' || options.severity === 'high') {
      await sendNotification('systemAlert', user, {
        title: `Critical Action: ${action}`,
        message: options.description || `User ${user.email} performed: ${action}`,
        severity: options.severity
      });
    }

    return auditLog;
  } catch (error) {
    console.error('Audit log creation failed:', error);
    return null;
  }
};

// Get audit logs with filtering
export const getAuditLogs = async (filters = {}, options = {}) => {
  try {
    const {
      user,
      action,
      category,
      status,
      severity,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = filters;

    const query = {};
    
    if (user) query.user = user;
    if (action) query.action = { $regex: action, $options: 'i' };
    if (category) query.category = category;
    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;
    
    const logs = await AuditLog.find(query)
      .populate('user', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await AuditLog.countDocuments(query);

    return {
      logs,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
        limit: parseInt(limit)
      }
    };
  } catch (error) {
    console.error('Get audit logs failed:', error);
    throw error;
  }
};

// Get audit statistics
export const getAuditStatistics = async (period = '30d') => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    const stats = await AuditLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalActions: { $sum: 1 },
          successActions: {
            $sum: { $cond: [{ $eq: ['$status', 'success'] }, 1, 0] }
          },
          failureActions: {
            $sum: { $cond: [{ $eq: ['$status', 'failure'] }, 1, 0] }
          },
          errorActions: {
            $sum: { $cond: [{ $eq: ['$status', 'error'] }, 1, 0] }
          },
          criticalEvents: {
            $sum: { $cond: [{ $eq: ['$severity', 'critical'] }, 1, 0] }
          },
          highSeverityEvents: {
            $sum: { $cond: [{ $eq: ['$severity', 'high'] }, 1, 0] }
          },
          byCategory: {
            $push: {
              category: '$category',
              status: '$status',
              severity: '$severity'
            }
          },
          byAction: {
            $push: {
              action: '$action',
              status: '$status'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalActions: 1,
          successActions: 1,
          failureActions: 1,
          errorActions: 1,
          criticalEvents: 1,
          highSeverityEvents: 1,
          successRate: {
            $round: [
              { $multiply: [{ $divide: ['$successActions', '$totalActions'] }, 100] },
              2
            ]
          },
          categoryBreakdown: {
            $reduce: {
              input: '$byCategory',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this.category',
                          v: {
                            total: { $add: ['$$value.$$this.category.total', 1] },
                            success: { $add: ['$$value.$$this.category.success', { $cond: [{ $eq: ['$$this.status', 'success'] }, 1, 0] }] },
                            failures: { $add: ['$$value.$$this.category.failures', { $cond: [{ $eq: ['$$this.status', 'failure'] }, 1, 0] }] }
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          },
          actionBreakdown: {
            $reduce: {
              input: '$byAction',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this.action',
                          v: {
                            total: { $add: ['$$value.$$this.action.total', 1] },
                            success: { $add: ['$$value.$$this.action.success', { $cond: [{ $eq: ['$$this.status', 'success'] }, 1, 0] }] }
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);

    return stats[0] || {
      totalActions: 0,
      successActions: 0,
      failureActions: 0,
      errorActions: 0,
      criticalEvents: 0,
      highSeverityEvents: 0,
      successRate: 0,
      categoryBreakdown: {},
      actionBreakdown: {}
    };
  } catch (error) {
    console.error('Get audit statistics failed:', error);
    throw error;
  }
};

// Audit log categories
export const AuditCategories = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  DATA_ACCESS: 'data_access',
  DATA_MODIFICATION: 'data_modification',
  SYSTEM: 'system',
  SECURITY: 'security',
  PAYMENT: 'payment',
  COLLECTION: 'collection',
  DEVICE: 'device',
  ROUTE: 'route',
  USER_MANAGEMENT: 'user_management'
};

// Audit log severities
export const AuditSeverities = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Common audit actions
export const AuditActions = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  USER_UPDATE: 'user_update',
  DEVICE_LINK: 'device_link',
  DEVICE_UNLINK: 'device_unlink',
  COLLECTION_RECORD: 'collection_record',
  PAYMENT_PROCESS: 'payment_process',
  INVOICE_CREATE: 'invoice_create',
  INVOICE_UPDATE: 'invoice_update',
  ROUTE_CREATE: 'route_create',
  ROUTE_UPDATE: 'route_update',
  DATA_EXPORT: 'data_export',
  DATA_IMPORT: 'data_import',
  SYSTEM_CONFIG: 'system_config',
  SECURITY_ALERT: 'security_alert'
};