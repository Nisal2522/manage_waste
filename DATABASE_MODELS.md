# 🗄️ Database Models Documentation

## Overview
This document describes all the database models used in the Waste Management System and how data flows from the frontend to the database.

## 📊 Database Models

### 1. Collection Model (`Collection.js`)
**Purpose**: Stores waste collection records when staff collect bins

```javascript
{
  bin: ObjectId (ref: 'Bin') - REQUIRED
  staff: ObjectId (ref: 'User') - REQUIRED  
  resident: ObjectId (ref: 'User') - REQUIRED
  weight: Number - REQUIRED
  isCollected: Boolean - REQUIRED
  collectionTime: Date (default: now)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### 2. Bin Model (`Bin.js`)
**Purpose**: Stores information about waste bins

```javascript
{
  binId: String - REQUIRED, UNIQUE
  owner: String - REQUIRED
  deviceType: String (default: 'QR Code')
  deviceId: String - REQUIRED
  binType: String - REQUIRED
  capacity: Number - REQUIRED
  currentFill: Number (default: 0)
  longitude: Number - REQUIRED
  latitude: Number - REQUIRED
  address: String (default: '')
  userId: ObjectId (ref: 'User') - REQUIRED
  temperature: Number (default: 25)
  humidity: Number (default: 60)
  lastCollection: Date (default: now)
  nextCollection: Date (default: +7 days)
  status: String
    enum: ['active', 'inactive', 'maintenance']
    default: 'active'
  qrCode: String
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### 3. User Model (`User.js`)
**Purpose**: Stores user information (staff, residents, admins)

```javascript
{
  name: String - REQUIRED
  email: String - REQUIRED, UNIQUE
  password: String - REQUIRED (encrypted)
  role: String - REQUIRED
    enum: ['admin', 'staff', 'resident']
  address: {
    street: String
    city: String
    district: String
    coordinates: {
      lat: Number
      lng: Number
    }
  }
  phone: String
  assignedRoute: ObjectId (ref: 'Route')
  binDevice: ObjectId (ref: 'Bin')
  qrCode: String
  isActive: Boolean (default: true)
  lastLogin: Date
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## 🔄 Data Flow: Frontend to Database

### QR Collection Process

1. **Staff Scans QR Code**
   - QR data can be: URL, JSON with binId, or direct binId
   - Backend `scanQRCode` function processes all formats
   - Returns bin details with populated user information

2. **Form Submission**
   ```javascript
   // Frontend sends:
   {
     bin: "64f8a1b2c3d4e5f6a7b8c9d0",      // Bin ObjectId
     staff: "68f1f3bb0674c601c62072c1",    // Staff ObjectId  
     resident: "64f8a1b2c3d4e5f6a7b8c9d1", // Resident ObjectId
     weight: 100,                          // User input
     isCollected: true                     // User checkbox
   }
   ```

3. **Backend Validation**
   - ✅ Required fields: bin, staff, resident, weight, isCollected
   - ✅ Weight validation: must be positive number
   - ✅ User existence check: bin, staff, resident must exist

4. **Database Operations**
   - ✅ Create collection record in `collections` table
   - ✅ Update bin: `currentFill = 0`, `lastCollection = now()` (if isCollected = true)
   - ✅ Return populated collection data

## 🎯 Key Features

### Automatic Data Management
- **Bin Fill Reset**: When isCollected = true, bin fill level automatically resets to 0%
- **Timestamp Updates**: `lastCollection` automatically updated
- **Simple Structure**: Only essential fields for collection tracking

### Data Validation
- **Referential Integrity**: All ObjectIds validated against existing records
- **Weight Validation**: Must be positive number
- **Boolean Validation**: isCollected must be true/false

### Smart QR Processing
- **Multi-format Support**: Handles URLs, JSON, and direct IDs
- **Fallback Search**: Searches by both `_id` and `binId` fields
- **User Population**: Automatically includes user details

## 📋 Collection Table Structure

When you click "Mark as Collected", the following data is saved:

| Field | Type | Value | Source |
|-------|------|-------|--------|
| `_id` | ObjectId | Auto-generated | MongoDB |
| `bin` | ObjectId | Bin ID from QR scan | QR Code |
| `staff` | ObjectId | Current logged-in staff | Auth Context |
| `resident` | ObjectId | Bin owner | Bin Model |
| `weight` | Number | User input | Form |
| `isCollected` | Boolean | User checkbox | Form |
| `collectionTime` | Date | Current timestamp | Auto |
| `createdAt` | Date | Current timestamp | Auto |
| `updatedAt` | Date | Current timestamp | Auto |

## ✅ Verification Checklist

- [x] Collection model properly defined
- [x] All required fields validated
- [x] Weight validation implemented
- [x] Bin fill level auto-reset
- [x] QR code processing enhanced
- [x] Database connection verified
- [x] API endpoints working
- [x] Frontend-backend integration complete

## 🚀 Ready for Production

The system is now fully configured to:
1. Accept QR scans from staff
2. Validate all input data
3. Save complete collection records
4. Automatically manage bin states
5. Maintain data integrity

**All data from the "Mark as Collected" button is properly saved to the MongoDB database!** 🎉
