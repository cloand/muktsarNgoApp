# 🧪 Navigation & Functionality Test Guide

## ✅ **Complete App Testing Checklist**

This guide provides step-by-step testing instructions for all navigation flows and functionality in the MuktsarNGO app.

## 📱 **App Structure Overview**

### **Complete File Structure:**
```
muktsarngo/
├── App.js                          # Main app with theme provider
├── src/
│   ├── navigation/
│   │   └── AppNavigator.js         # Stack navigation setup
│   ├── screens/
│   │   ├── index.js               # Screen exports
│   │   ├── LoginScreen.js         # Authentication screen
│   │   ├── HomeScreen.js          # Main dashboard
│   │   ├── DonorListScreen.js     # Donor management
│   │   ├── AddDonationScreen.js   # Donor registration
│   │   └── EmergencyAlertScreen.js # Emergency alerts
│   ├── context/
│   │   ├── AuthContext.js         # Authentication state
│   │   ├── AppContext.js          # Global app state
│   │   └── NotificationContext.js # FCM notifications
│   ├── services/
│   │   ├── AuthService.js         # Auth API calls
│   │   ├── ApiService.js          # General API calls
│   │   └── notifications.js       # FCM service
│   ├── theme/
│   │   └── theme.js               # NGO red/white theme
│   └── utils/
│       └── constants.js           # API endpoints & helpers
└── package.json                   # Dependencies
```

## 🔐 **1. Login Screen Testing**

### **Test Cases:**
1. **App Launch** - Should open to LoginScreen
2. **Demo Credentials** - Test all three user types
3. **Form Validation** - Test email/password validation
4. **Theme Application** - Verify red/white NGO theme

### **Demo Credentials to Test:**
```javascript
// Admin User (Full Access)
Email: admin@muktsarngo.com
Password: password

// Volunteer User (Can Send Alerts)
Email: volunteer@muktsarngo.com  
Password: volunteer123

// Donor User (Limited Access)
Email: donor@muktsarngo.com
Password: donor123
```

### **Expected Results:**
- ✅ **NGO Logo** - Red heart icon with "MuktsarNGO" title
- ✅ **Demo Chips** - One-tap credential filling
- ✅ **Form Validation** - Email format and required field checks
- ✅ **Loading State** - Button shows spinner during login
- ✅ **Success Navigation** - Redirects to HomeScreen on success

## 🏠 **2. HomeScreen Testing**

### **Test Cases:**
1. **User Welcome** - Shows personalized greeting
2. **Role Display** - Shows user role (ADMIN/VOLUNTEER/DONOR)
3. **Navigation Buttons** - All four buttons work correctly
4. **Logout Confirmation** - Shows alert before logout

### **Navigation Buttons to Test:**
```javascript
// Test each button navigation
1. Donor List → DonorListScreen
2. Add Donation → AddDonationScreen  
3. Emergency Alerts → EmergencyAlertScreen
4. Logout → Shows confirmation → LoginScreen
```

### **Expected Results:**
- ✅ **NGO Branding** - Heart logo and "MuktsarNGO" title
- ✅ **User Info** - "Welcome, [Name]" with role display
- ✅ **Themed Buttons** - Red, green, orange, outlined colors
- ✅ **Smooth Navigation** - No lag or errors between screens

## 📋 **3. DonorListScreen Testing**

### **Test Cases:**
1. **Data Loading** - Shows loading spinner then donor list
2. **Search Functionality** - Filter donors by name/blood group
3. **Eligibility Display** - Shows available/unavailable status
4. **Cooldown Logic** - Displays days until next eligible donation

### **Eligibility Testing:**
```javascript
// Test donor eligibility calculations
- Male donors: 90-day cooldown period
- Female donors: 120-day cooldown period
- Available: Green chip with "Available" status
- Unavailable: Red chip with "X days remaining"
```

### **Expected Results:**
- ✅ **Modern App Bar** - Back button and donor count
- ✅ **Search Bar** - Real-time filtering
- ✅ **Donor Cards** - Clean white cards with donor info
- ✅ **Status Chips** - Color-coded eligibility status
- ✅ **Contact Buttons** - Disabled for unavailable donors

## ➕ **4. AddDonationScreen Testing**

### **Test Cases:**
1. **Form Validation** - Test all required fields
2. **Blood Group Selection** - Chip-based selection
3. **Gender Selection** - Male/Female/Other options
4. **Data Submission** - Success/error handling

### **Form Fields to Test:**
```javascript
// Required Fields
- Donor Name: Text validation
- Email: Email format validation  
- Phone: Phone number format validation
- Blood Group: A+, A-, B+, B-, AB+, AB-, O+, O- selection
- Gender: Male, Female, Other selection

// Optional Fields  
- Last Donation Date: YYYY-MM-DD format
```

### **Expected Results:**
- ✅ **Modern Form** - Outlined inputs with theme colors
- ✅ **Chip Selection** - Visual feedback for selections
- ✅ **Validation Errors** - Red helper text for invalid fields
- ✅ **Loading State** - Button spinner during submission
- ✅ **Success Dialog** - Options to add another or return

## 🚨 **5. EmergencyAlertScreen Testing**

### **Test Cases:**
1. **Authorization Check** - Only admin/volunteer access
2. **Form Completion** - All required fields
3. **API Integration** - Mock emergency alert sending
4. **Notification Trigger** - FCM notification to all users

### **Authorization Testing:**
```javascript
// Test with different user roles
- Admin: ✅ Full access to emergency alerts
- Volunteer: ✅ Can send emergency alerts  
- Donor: ❌ Access denied with clear message
```

### **Emergency Alert Form:**
```javascript
// Required Fields
- Hospital Name: Text input with quick selection chips
- Blood Group: Dropdown (A+, A-, B+, B-, AB+, AB-, O+, O-, Any)
- Contact Number: Phone validation
- Urgency: High/Medium/Low with color coding

// Optional Fields
- Additional Notes: Multiline text area
```

### **Expected Results:**
- ✅ **Role-Based Access** - Proper authorization checks
- ✅ **Quick Hospital Selection** - Pre-filled hospital chips
- ✅ **Dropdown Menus** - Blood group and urgency selection
- ✅ **Form Validation** - Required field checking
- ✅ **API Call** - Mock emergency alert submission
- ✅ **Notification Sending** - FCM alert to all users

## 🔔 **6. Notification System Testing**

### **Test Cases:**
1. **Permission Request** - Asks for notification permissions
2. **FCM Token Registration** - Registers device for notifications
3. **Emergency Alerts** - Receives high-priority notifications
4. **Sound Playback** - Custom emergency alert sound

### **Notification Testing:**
```javascript
// Test notification flow
1. App initialization → Request permissions
2. Emergency alert sent → All users receive notification
3. Notification content → Hospital, blood group, contact info
4. Sound playback → Custom emergency alert audio
```

### **Expected Results:**
- ✅ **Permission Dialog** - System notification permission request
- ✅ **Token Registration** - Device registered for FCM
- ✅ **High Priority** - Emergency notifications appear over other apps
- ✅ **Rich Content** - Complete alert information in notification
- ✅ **Custom Sound** - Emergency-specific alert audio

## 🎨 **7. Theme Consistency Testing**

### **Test Cases:**
1. **Color Scheme** - Red and white throughout app
2. **Spacing Consistency** - 16px standard spacing
3. **Typography** - Consistent font weights and sizes
4. **Component Styling** - Material Design 3 components

### **Theme Elements to Verify:**
```javascript
// Primary Colors
- Primary Red: #C62828 (buttons, headers, logos)
- Light Pink: #FFCDD2 (secondary elements)
- White: #FFFFFF (card backgrounds)
- Off-White: #FAFAFA (app background)

// Spacing Scale
- Small: 8px (margins, gaps)
- Medium: 16px (standard padding)
- Large: 24px (section spacing)
- Extra Large: 32px (major spacing)
```

### **Expected Results:**
- ✅ **Consistent Colors** - Red/white theme across all screens
- ✅ **Proper Spacing** - Clean, organized layouts
- ✅ **Material Design** - Modern component styling
- ✅ **Professional Appearance** - NGO-appropriate design

## 🔄 **8. Navigation Flow Testing**

### **Complete Navigation Map:**
```
LoginScreen
    ↓ (successful login)
HomeScreen
    ├── Donor List → DonorListScreen
    │                    ↓ (back button)
    │                HomeScreen
    ├── Add Donation → AddDonationScreen  
    │                    ↓ (back button)
    │                HomeScreen
    ├── Emergency Alerts → EmergencyAlertScreen
    │                         ↓ (back button)
    │                     HomeScreen
    └── Logout → (confirmation) → LoginScreen
```

### **Navigation Testing Steps:**
1. **Login** → Enter credentials → Navigate to Home
2. **Home to Donor List** → Test back navigation
3. **Home to Add Donation** → Test form submission → Back to Home
4. **Home to Emergency Alert** → Test authorization → Send alert → Back to Home
5. **Logout** → Confirm logout → Return to Login

### **Expected Results:**
- ✅ **Smooth Transitions** - No lag or errors
- ✅ **Back Navigation** - Proper stack management
- ✅ **State Persistence** - User data maintained during navigation
- ✅ **Clean URLs** - Proper route naming

## 🚀 **Quick Test Commands**

### **Start the App:**
```bash
cd muktsarngo
npm install
npm start
```

### **Test Sequence:**
1. **Launch App** → Should open LoginScreen
2. **Login as Admin** → Use admin@muktsarngo.com / password
3. **Navigate to Each Screen** → Test all four navigation buttons
4. **Test Emergency Alert** → Send test notification
5. **Check Donor List** → Verify eligibility calculations
6. **Add New Donor** → Complete form submission
7. **Logout** → Confirm logout flow

## ✅ **Success Criteria**

The app passes testing if:
- ✅ **All navigation works** without errors
- ✅ **Login authentication** functions correctly
- ✅ **Donor eligibility logic** displays accurate cooldown periods
- ✅ **Emergency alerts** trigger notifications successfully
- ✅ **Theme consistency** maintained across all screens
- ✅ **Form validation** prevents invalid submissions
- ✅ **Role-based access** properly restricts features

The MuktsarNGO app should provide a smooth, professional experience for blood donation management with all features working correctly!
