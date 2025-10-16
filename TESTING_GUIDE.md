# MuktsarNGO App - Testing Guide

## 🚀 **App is Now Running with Centralized Configuration!**

### **Current Status:**
- ✅ **React Native App:** Running on http://localhost:8082
- ✅ **Centralized Config:** All API calls use `/src/config/config.js`
- ✅ **Admin-Only Management:** Role-based access control implemented
- ⚠️ **Backend:** NestJS compilation in progress (using mock data fallback)

## 🧪 **Testing the Centralized Configuration**

### **1. Environment Switching Test**
The app now uses centralized configuration from `/src/config/config.js`:

**Current Settings:**
```javascript
// Current environment
export const CURRENT_ENV = 'DEVELOPMENT';

// API URLs
DEVELOPMENT: "http://localhost:3000/api",
PRODUCTION: "https://muktsarngo-api.herokuapp.com/api",
STAGING: "https://staging-muktsarngo-api.herokuapp.com/api",
```

**To Switch Environments:**
1. Open `/src/config/config.js`
2. Change `CURRENT_ENV` to `'PRODUCTION'` or `'STAGING'`
3. Reload the app
4. All API calls will automatically use the new URL

### **2. Admin-Only Management Test**

**Test Admin Access:**
1. **Login as Admin:**
   - Email: `admin@muktsarngo.com`
   - Password: `password`
   - Select "Admin" user type

2. **Admin Features Available:**
   - ✅ **Donor Management:** View all donors with search/filters
   - ✅ **Alert Creation:** Create emergency alerts with FCM notifications
   - ✅ **Reports Dashboard:** View system statistics and analytics
   - ✅ **Security Testing:** Interactive security test interface

**Test Donor Access:**
1. **Register as Donor:**
   - Use the donor registration form
   - Fill basic information (name, blood group, contact)
   - Auto-registration creates donor account

2. **Donor Features Available:**
   - ✅ **View Alerts:** Emergency notifications from admin
   - ✅ **Acknowledge Alerts:** Mark alerts as seen locally
   - ✅ **Profile Management:** Update own profile and donation history
   - ❌ **No Admin Access:** Cannot view donor lists or create alerts

### **3. Role-Based UI Testing**

**Admin Mode Toggle:**
- **Feature Flag:** Controlled by `FEATURES.ENABLE_ADMIN_MODE_TOGGLE`
- **Visibility:** Shows current user role and admin access
- **Functionality:** Allows role switching for admin users

**Access Control Components:**
- **`AdminOnlyAccess`:** Wraps admin-only content
- **`DonorOnlyAccess`:** Wraps donor-only content
- **`RoleBasedAccess`:** Generic role-based wrapper

## 🔧 **Configuration Testing**

### **API Base URL Testing**
```javascript
// Test current configuration
import { getBaseURL, APP_CONFIG } from './src/config/config';

console.log('Current API URL:', getBaseURL());
console.log('Environment:', APP_CONFIG.CURRENT_ENV);
```

### **Feature Flags Testing**
```javascript
// Test feature flags
import { FEATURES } from './src/config/config';

console.log('Admin Mode Toggle:', FEATURES.ENABLE_ADMIN_MODE_TOGGLE);
console.log('Push Notifications:', FEATURES.ENABLE_PUSH_NOTIFICATIONS);
```

### **Role Testing**
```javascript
// Test role functions
import { isAdmin, isDonor } from './src/config/config';

const adminUser = { role: 'admin' };
const donorUser = { role: 'DONOR' };

console.log('Is Admin:', isAdmin(adminUser)); // true
console.log('Is Donor:', isDonor(donorUser)); // true
```

## 🛡️ **Security Testing**

### **Interactive Security Tests**
1. **Access Security Test Screen:**
   - **Admin:** Click shield icon in header
   - **Donor:** Click "Security Tests" button

2. **Test Scenarios:**
   - ✅ **Admin can access:** Donor lists, alert creation, reports
   - ❌ **Admin cannot access:** Donor-only endpoints
   - ✅ **Donor can access:** Own profile, alerts viewing
   - ❌ **Donor cannot access:** Admin-only features

### **Manual Security Testing**
```javascript
// Test API endpoints with different roles
const testEndpoints = [
  { url: '/donors', expectedForAdmin: 'success', expectedForDonor: 'forbidden' },
  { url: '/donors/me', expectedForAdmin: 'forbidden', expectedForDonor: 'success' },
  { url: '/alerts', expectedForAdmin: 'success', expectedForDonor: 'success' },
  { url: '/reports/summary', expectedForAdmin: 'success', expectedForDonor: 'forbidden' },
];
```

## 📱 **App Features Testing**

### **Donor Registration Flow**
1. **Open App:** http://localhost:8082
2. **Navigate to Registration:** Click "Register as Donor"
3. **Fill Form:**
   - Name, email, password
   - Blood group (from centralized config)
   - Contact information
   - Last donation date
4. **Submit:** Creates donor account with role 'DONOR'

### **Admin Dashboard Testing**
1. **Login as Admin**
2. **Test Three Tabs:**
   - **📋 Donors:** Search, filter, view donor details
   - **🚨 Alerts:** Create emergency alerts with all fields
   - **📊 Reports:** View system statistics and analytics

### **Alert System Testing**
1. **Admin Creates Alert:**
   - Fill comprehensive form
   - Submit triggers FCM notifications
2. **Donors Receive Alerts:**
   - Real-time polling (30-second intervals)
   - Sound notifications
   - Local acknowledgment

## 🔄 **Backend Integration**

### **Current Status**
- **NestJS Backend:** Compilation in progress
- **Mock Data:** App uses fallback mock data
- **API Calls:** All use centralized configuration

### **When Backend is Ready**
1. **Update Config:** Ensure `CURRENT_ENV = 'DEVELOPMENT'`
2. **Start Backend:** `npm run start:dev` in muktsar-api folder
3. **Test Endpoints:** Use SecurityTestScreen for validation
4. **Verify Data:** Real data from database instead of mocks

### **Production Deployment**
1. **Update Config:**
   ```javascript
   export const CURRENT_ENV = 'PRODUCTION';
   ```
2. **Set Production URL:**
   ```javascript
   PRODUCTION: "https://your-production-api.com/api",
   ```
3. **Build and Deploy:** All API calls automatically use production URL

## 🎯 **Key Testing Points**

### **✅ Centralized Configuration**
- Single point of change for API URLs
- Environment switching with one variable
- Consistent constants across the app

### **✅ Admin-Only Management**
- Strict role-based access control
- Admin dashboard with comprehensive features
- Donor registration and limited access

### **✅ Security Implementation**
- JWT authentication with role validation
- Access control components
- Interactive security testing

### **✅ Production Ready**
- Environment-specific configurations
- Feature flags for gradual rollouts
- Scalable architecture

## 📋 **Next Steps**

1. **Test the Web App:** http://localhost:8082
2. **Try Different User Roles:** Admin vs Donor access
3. **Test Configuration Changes:** Switch environments
4. **Verify Security Rules:** Use SecurityTestScreen
5. **Wait for Backend:** Full integration when NestJS compiles

**The app is now ready for comprehensive testing with centralized configuration and admin-only management!** 🎉
