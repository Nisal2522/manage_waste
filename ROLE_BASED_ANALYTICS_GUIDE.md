# Role-Based Analytics & Data Flow Guide

## 🎯 **System Overview**

The Smart Waste Management System uses a **role-based analytics approach** where:
- **Admin (WMA Staff)** = Full analytics access + optimization tools
- **Other Users** = Data contributors only (no analytics access)

## 👥 **User Roles & Responsibilities**

### 🧑‍💼 **Admin (WMA Staff) - Analytics Dashboard Access**

**✅ What Admin Can Do:**
- Access full analytics dashboard (`/admin/analytics`)
- View operational, financial, and sustainability reports
- Run route optimization algorithms
- Execute what-if simulations
- Export comprehensive reports
- Update truck assignments after optimization

**📊 Analytics Features:**
- **Operational Reports**: Waste by zone, collection efficiency, system uptime
- **Financial Reports**: Revenue analysis, cost recovery, rebate tracking
- **Sustainability Reports**: Recycling rates, carbon footprint, waste reduction
- **Route Optimization**: Algorithm-based route improvements
- **Policy Simulation**: Test pricing changes and policy impacts

### 👷‍♂️ **Staff/Drivers - Data Collection Interface**

**✅ What Staff Can Do:**
- Access data collection dashboard (`/staff/data-collection`)
- Record collection data (waste type, weight, time)
- Submit route performance data (distance, fuel, time)
- Report issues and maintenance needs

**📝 Data Contributed:**
```javascript
// Collection Data
{
  binId: "BIN-001",
  wasteType: "organic",
  weight: 15.5,
  collectionTime: "2024-01-15T10:30:00Z",
  staff: "staff_user_id",
  qrScanned: true
}

// Route Performance Data
{
  routeId: "RT-001",
  startTime: "2024-01-15T08:00:00Z",
  endTime: "2024-01-15T16:00:00Z",
  distance: 45.2,
  fuelUsed: 12.5,
  wasteCollected: 150.8,
  binsVisited: 25
}
```

### 🏠 **Residents - Data Contribution Interface**

**✅ What Residents Can Do:**
- Access data contribution dashboard (`/resident/data-contribution`)
- Record bin usage data (waste type, weight, fill level)
- Submit payment information
- Provide feedback and complaints
- Request new bins

**📝 Data Contributed:**
```javascript
// Bin Usage Data
{
  binId: "BIN-001",
  wasteType: "organic",
  weight: 8.5,
  fillLevel: 75,
  resident: "resident_user_id"
}

// Payment Data
{
  amount: 45.50,
  paymentMethod: "cash",
  invoiceId: "INV-001",
  resident: "resident_user_id"
}

// Feedback Data
{
  type: "complaint",
  subject: "Collection missed",
  description: "Bin not collected on scheduled day",
  priority: "high"
}
```

## 🔄 **Data Flow Architecture**

### **Data Collection Flow**
```
[Staff/Drivers] ──► Collection Data ──► Backend API ──► MongoDB
[Residents] ─────► Usage Data ──────► Backend API ──► MongoDB
[Finance] ───────► Payment Data ─────► Backend API ──► MongoDB
```

### **Analytics Processing Flow**
```
MongoDB ──► Analytics Controller ──► Data Aggregation ──► Admin Dashboard
```

### **Route Optimization Flow**
```
Current Routes ──► Optimization Algorithm ──► Optimized Routes ──► Admin Approval ──► Truck Assignment
```

## 🛡️ **Access Control Implementation**

### **Frontend Route Protection**
```javascript
// Admin-only analytics access
<Route
  path="/admin/analytics"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminAnalyticsDashboard />
    </ProtectedRoute>
  }
/>

// Staff data collection access
<Route
  path="/staff/data-collection"
  element={
    <ProtectedRoute allowedRoles={["staff", "admin"]}>
      <StaffDataCollection />
    </ProtectedRoute>
  }
/>

// Resident data contribution access
<Route
  path="/resident/data-contribution"
  element={
    <ProtectedRoute allowedRoles={["resident", "admin"]}>
      <ResidentDataContribution />
    </ProtectedRoute>
  }
/>
```

### **Backend API Protection**
```javascript
// Analytics endpoints - Admin only
router.get('/analytics/operational', authMiddleware, getOperationalAnalytics);
router.get('/analytics/financial', authMiddleware, getFinancialAnalytics);
router.post('/analytics/routes/optimize', authMiddleware, optimizeRoutes);

// Data collection endpoints - Staff/Admin
router.post('/collections', authMiddleware, createCollection);
router.get('/collections', authMiddleware, getCollections);

// Data contribution endpoints - All authenticated users
router.post('/bin-requests', authMiddleware, createBinRequest);
router.post('/feedback', authMiddleware, createFeedback);
```

## 📊 **Data Contribution by Role**

| User Role | Data Contributed | Used in Analytics | Access Level |
|-----------|------------------|-------------------|--------------|
| **Admin** | N/A | Full analytics access | ✅ Analytics Dashboard |
| **Staff/Driver** | Collection records, Route performance | Operational reports, Route optimization | ❌ No analytics access |
| **Resident** | Bin usage, Payments, Feedback | Financial reports, Sustainability reports | ❌ No analytics access |
| **Finance Officer** | Invoice data, Rebate records | Financial reports | ❌ No analytics access |
| **Supervisor** | Recycling data, Quality reports | Sustainability reports | ❌ No analytics access |

## 🔧 **Implementation Details**

### **1. Admin Analytics Dashboard**
- **Location**: `/admin/analytics`
- **Access**: Admin only
- **Features**: Full analytics, optimization, simulation, export

### **2. Staff Data Collection**
- **Location**: `/staff/data-collection`
- **Access**: Staff + Admin
- **Features**: Collection recording, route performance, issue reporting

### **3. Resident Data Contribution**
- **Location**: `/resident/data-contribution`
- **Access**: Resident + Admin
- **Features**: Bin usage, payments, feedback, bin requests

## 🚀 **Getting Started**

### **For Admins:**
1. Login as admin
2. Navigate to `/admin/analytics`
3. Access full analytics dashboard
4. Run optimizations and simulations
5. Export reports

### **For Staff:**
1. Login as staff
2. Navigate to `/staff/data-collection`
3. Record daily collection data
4. Submit route performance reports

### **For Residents:**
1. Login as resident
2. Navigate to `/resident/data-contribution`
3. Record bin usage data
4. Submit payments and feedback

## 📈 **Data Flow Benefits**

### **For Admins:**
- Complete system overview
- Data-driven decision making
- Optimization capabilities
- Policy simulation tools

### **For Data Contributors:**
- Simple, focused interfaces
- Clear data entry forms
- Immediate feedback on submissions
- No overwhelming analytics complexity

## 🔒 **Security Considerations**

1. **Role-based access control** at both frontend and backend
2. **JWT authentication** for all API calls
3. **Data validation** on all inputs
4. **Audit logging** for all data changes
5. **Rate limiting** on data submission endpoints

## 📋 **Summary**

This role-based approach ensures:
- **Admins** get powerful analytics tools for decision making
- **Other users** contribute data through simple, focused interfaces
- **Data flows** efficiently from contributors to analytics
- **Access control** prevents unauthorized analytics access
- **System scalability** through clear role separation

The analytics dashboard remains **Admin-only** while other users contribute valuable data that feeds into the admin's analysis and optimization processes.
