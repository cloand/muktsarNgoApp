# MuktsarNGO React Native App - Folder Structure

## 📁 Project Structure

```
muktsarngo/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AdminOnlyAccess.js       # Role-based access control components
│   │   └── ...                      # Other shared components
│   │
│   ├── config/              # Centralized configuration
│   │   └── config.js               # Main config file with API URLs, constants
│   │
│   ├── context/             # React Context providers
│   │   ├── AuthContext.js          # Authentication state management
│   │   ├── AppContext.js           # Global app state
│   │   └── NotificationContext.js  # Push notification handling
│   │
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js         # Main navigation stack
│   │
│   ├── screens/             # Screen components
│   │   ├── AdminDashboardScreen.js # Admin-only dashboard
│   │   ├── DonorHomeScreen.js      # Donor home screen
│   │   ├── DonorRegistrationScreen.js # Public donor registration
│   │   ├── EmergencyAlertScreen.js # Alert viewing and management
│   │   ├── LoginScreen.js          # User authentication
│   │   ├── SecurityTestScreen.js   # Security testing interface
│   │   └── index.js               # Screen exports
│   │
│   ├── services/            # API and business logic services
│   │   ├── api.js                 # Centralized API configuration
│   │   ├── ApiService.js          # API service wrapper
│   │   ├── AuthService.js         # Authentication service
│   │   ├── AlertService.js        # Alert polling and management
│   │   └── SoundService.js        # Audio/sound handling
│   │
│   ├── theme/               # UI theming and styles
│   │   └── theme.js              # Material Design 3 theme
│   │
│   └── utils/               # Utility functions and constants
│       └── constants.js          # App constants and helpers
│
├── assets/                  # Static assets
│   ├── images/             # Image files
│   ├── sounds/             # Audio files
│   └── fonts/              # Custom fonts
│
├── App.js                   # Main app component
├── app.json                # Expo configuration
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

## 🔧 Key Configuration Files

### `/src/config/config.js`
**Purpose:** Centralized configuration for the entire application
- **API Base URLs** for different environments (dev, staging, production)
- **App constants** (timeouts, retry attempts, storage keys)
- **Feature flags** (enable/disable features)
- **Role definitions** and helper functions
- **Blood groups, genders, and other data constants**

**Usage Example:**
```javascript
import { getBaseURL, APP_CONFIG, isAdmin } from '../config/config';

// Get current environment's API URL
const apiUrl = getBaseURL();

// Check if user is admin
if (isAdmin(user)) {
  // Show admin features
}
```

### `/src/services/api.js`
**Purpose:** Centralized API configuration using axios
- **Base URL** from config.js
- **Request/response interceptors** for authentication
- **Endpoint definitions** using centralized config
- **Error handling** and token management

## 🛡️ Security & Access Control

### Admin-Only Features
- **Donor Management:** View all donors, manage donor data
- **Alert Creation:** Create and send emergency alerts
- **Reports:** View system statistics and analytics
- **User Management:** Admin user creation and management

### Donor Features
- **Profile Management:** View and update own profile
- **Alert Viewing:** Receive and acknowledge emergency alerts
- **Registration:** Self-registration through the app
- **Donation History:** Track personal donation history

### Role-Based Components
- **`AdminOnlyAccess`:** Wraps admin-only content
- **`DonorOnlyAccess`:** Wraps donor-only content
- **`RoleBasedAccess`:** Generic role-based wrapper
- **`AdminModeToggle`:** Shows current user role and admin access

## 📱 Screen Organization

### Public Screens
- **LoginScreen:** User authentication with role selection
- **DonorRegistrationScreen:** Public donor registration

### Donor Screens
- **DonorHomeScreen:** Main dashboard for donors
- **EmergencyAlertScreen:** View and acknowledge alerts
- **DonorProfile:** Personal profile management

### Admin Screens
- **AdminDashboardScreen:** Admin control panel with tabs:
  - 📋 **Donors Tab:** Donor list with search and filters
  - 🚨 **Alerts Tab:** Alert creation and management
  - 📊 **Reports Tab:** System statistics and analytics

### Utility Screens
- **SecurityTestScreen:** Interactive security testing interface

## 🔄 Services Architecture

### AuthService
- **Token Management:** Secure storage and retrieval
- **Login/Logout:** User authentication
- **Role Verification:** Admin/donor role checking
- **Session Management:** Auto-logout on token expiry

### AlertService
- **Alert Polling:** Periodic check for new alerts
- **Local Acknowledgments:** Donor alert acknowledgment storage
- **Sound Notifications:** Audio alerts for emergencies
- **Real-time Updates:** Background alert monitoring

### ApiService
- **HTTP Client:** Axios-based API communication
- **Error Handling:** Centralized error management
- **Request Interceptors:** Automatic token injection
- **Response Processing:** Data transformation and validation

## 🎨 Theming & Styling

### Material Design 3
- **Primary Color:** NGO Red (#C62828)
- **Color Scheme:** Light theme with NGO branding
- **Typography:** Material Design typography scale
- **Components:** React Native Paper components

### Common Styles
- **Responsive Design:** Adapts to different screen sizes
- **Accessibility:** WCAG compliant color contrasts
- **Consistent Spacing:** Standardized margins and padding
- **Icon System:** Material Design icons throughout

## 🔧 Configuration Management

### Environment Switching
Change the `CURRENT_ENV` in `/src/config/config.js`:
```javascript
export const CURRENT_ENV = 'DEVELOPMENT'; // or 'STAGING', 'PRODUCTION'
```

### Feature Flags
Enable/disable features in config:
```javascript
export const FEATURES = {
  ENABLE_ADMIN_MODE_TOGGLE: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_OFFLINE_MODE: false,
};
```

### API URL Configuration
All API calls use centralized URLs:
```javascript
// Development
DEVELOPMENT: "http://localhost:3000/api",

// Production  
PRODUCTION: "https://muktsarngo-api.herokuapp.com/api",
```

## 📋 Development Guidelines

### Adding New Features
1. **Check role requirements** - Use appropriate access control components
2. **Update config.js** - Add any new constants or endpoints
3. **Follow folder structure** - Place files in appropriate directories
4. **Use centralized services** - Leverage existing API and auth services
5. **Test security** - Use SecurityTestScreen to verify access control

### API Integration
1. **Add endpoints** to `config.js` ENDPOINTS object
2. **Update api.js** with new methods using centralized endpoints
3. **Use ApiService** for consistent error handling
4. **Test with different roles** to ensure proper access control

### Security Best Practices
- **Always use role-based access control** for sensitive features
- **Store tokens securely** using expo-secure-store
- **Validate user permissions** on both frontend and backend
- **Use HTTPS** for all API communications
- **Implement proper error handling** for unauthorized access

This folder structure provides a scalable, maintainable, and secure foundation for the MuktsarNGO blood donation management system.
