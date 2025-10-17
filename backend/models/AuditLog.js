import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
    maxlength: [100, 'Action cannot exceed 100 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    lowercase: true
  },
  userRole: {
    type: String,
    required: [true, 'User role is required'],
    enum: {
      values: ['resident', 'staff', 'finance', 'admin'],
      message: 'User role must be one of: resident, staff, finance, admin'
    }
  },
  timestamp: {
    type: Date,
    required: [true, 'Timestamp is required'],
    default: Date.now
  },
  meta: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty IP addresses
        // IPv4 regex
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        // IPv6 regex (simplified)
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
        return ipv4Regex.test(v) || ipv6Regex.test(v);
      },
      message: 'Invalid IP address format'
    }
  },
  userAgent: {
    type: String,
    trim: true,
    maxlength: [500, 'User agent cannot exceed 500 characters']
  },
  resource: {
    type: String,
    trim: true,
    maxlength: [100, 'Resource cannot exceed 100 characters']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  status: {
    type: String,
    enum: {
      values: ['success', 'failure', 'error'],
      message: 'Status must be one of: success, failure, error'
    },
    default: 'success'
  },
  errorMessage: {
    type: String,
    trim: true,
    maxlength: [500, 'Error message cannot exceed 500 characters']
  },
  severity: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Severity must be one of: low, medium, high, critical'
    },
    default: 'low'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['authentication', 'authorization', 'data_access', 'data_modification', 'system', 'security', 'payment', 'collection', 'device', 'route', 'user_management'],
      message: 'Category must be one of: authentication, authorization, data_access, data_modification, system, security, payment, collection, device, route, user_management'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Indexes
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ category: 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ severity: 1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

// Compound indexes for efficient queries
auditLogSchema.index({ 
  user: 1, 
  timestamp: -1 
});

auditLogSchema.index({ 
  category: 1, 
  timestamp: -1 
});

auditLogSchema.index({ 
  action: 1, 
  timestamp: -1 
});

// Virtual for formatted timestamp
auditLogSchema.virtual('formattedTimestamp').get(function() {
  return this.timestamp.toLocaleString();
});

// Virtual for time ago
auditLogSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffTime = now - this.timestamp;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Virtual for severity color
auditLogSchema.virtual('severityColor').get(function() {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'orange',
    critical: 'red'
  };
  return colors[this.severity] || 'gray';
});

// Ensure virtual fields are serialized
auditLogSchema.set('toJSON', { virtuals: true });
auditLogSchema.set('toObject', { virtuals: true });

export default mongoose.model('AuditLog', auditLogSchema);