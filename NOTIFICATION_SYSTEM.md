# 🔔 Firebase Cloud Messaging (FCM) Integration

## Overview
Complete Firebase Cloud Messaging integration using Expo Notifications for emergency alerts in the Muktsar NGO app.

## 🚀 Features Implemented

### ✅ Core Functionality
- **Permission Requests** - Automatic notification permission handling
- **FCM Token Generation** - Expo push token for device identification
- **Local Notifications** - Emergency alerts with custom styling
- **Alert Sounds** - Custom emergency alert sound playback
- **Background Handling** - Notifications work when app is closed
- **Foreground Handling** - Custom notification display when app is active

### ✅ Emergency Alert Features
- **Custom Sound** - Emergency alert audio file
- **Vibration Patterns** - Emergency-specific vibration
- **High Priority** - Maximum importance notifications
- **Rich Content** - Title, body, location, and metadata
- **Action Buttons** - Contact and details options

## 📦 Dependencies Added

```json
{
  "expo-notifications": "~0.20.1",
  "expo-device": "~5.4.0", 
  "expo-constants": "~14.4.2",
  "expo-av": "~13.4.1"
}
```

## 🔧 Configuration Files

### app.json
```json
{
  "notification": {
    "icon": "./assets/notification-icon.png",
    "color": "#e74c3c",
    "sounds": ["./assets/sounds/emergency-alert.mp3"]
  },
  "plugins": [
    ["expo-notifications", {
      "icon": "./assets/notification-icon.png",
      "color": "#e74c3c",
      "sounds": ["./assets/sounds/emergency-alert.mp3"]
    }]
  ]
}
```

## 📱 Notification Service API

### Initialize Service
```javascript
import notificationService from './src/services/notifications';

// Initialize in App.js
await notificationService.initialize();
```

### Send Emergency Alert
```javascript
await notificationService.showEmergencyNotification({
  title: 'Emergency Blood Needed',
  body: 'O+ blood required at Civil Hospital Muktsar.',
  data: {
    type: 'emergency',
    bloodType: 'O+',
    hospital: 'Civil Hospital Muktsar',
    urgency: 'high'
  }
});
```

### Test Notification
```javascript
await notificationService.sendTestEmergencyAlert();
```

## 🎵 Sound Configuration

### Required Files
- `assets/sounds/emergency-alert.mp3` - Emergency alert sound
- `assets/notification-icon.png` - Notification icon

### Sound Features
- **Custom Audio** - Emergency-specific alert sound
- **Fallback** - System default if custom sound fails
- **Volume Control** - Maximum volume for emergencies
- **Cross-Platform** - Works on iOS and Android

## 🔐 Permissions

### Automatic Handling
- **Request on App Start** - Permissions requested during initialization
- **Settings Redirect** - Direct users to settings if denied
- **Graceful Degradation** - App works without notifications

### Permission Flow
1. Check existing permissions
2. Request if not granted
3. Show settings dialog if denied
4. Configure notification channels (Android)

## 📡 Token Management

### FCM Token
```javascript
// Get current token
const token = await notificationService.getStoredToken();

// Token is automatically:
// - Generated on app start
// - Stored locally
// - Sent to backend server
```

### Backend Integration
```javascript
// Token sent to server automatically
POST /api/register-token
{
  "token": "ExponentPushToken[...]",
  "platform": "android",
  "deviceId": "device-uuid"
}
```

## 🎨 Notification Styling

### Emergency Alert Appearance
- **High Priority** - Appears over other notifications
- **Custom Color** - Red theme (#e74c3c)
- **Vibration** - Emergency pattern [0, 250, 250, 250]
- **Sound** - Custom emergency alert audio
- **Persistent** - Stays until user interaction

### Notification Data
```javascript
{
  title: "Emergency Blood Needed",
  body: "O+ blood required at Civil Hospital Muktsar.",
  data: {
    type: "emergency",
    bloodType: "O+", 
    hospital: "Civil Hospital Muktsar",
    location: "Civil Hospital Muktsar",
    urgency: "high",
    timestamp: "2024-01-15T10:30:00Z"
  }
}
```

## 🔄 Event Handling

### Notification Received (Foreground)
```javascript
// Automatically handled in notification service
// - Shows custom notification
// - Plays alert sound
// - Triggers vibration
```

### Notification Tapped
```javascript
// User taps notification
// - Opens app
// - Navigates to relevant screen
// - Shows emergency details
```

## 🧪 Testing

### Test Button
- Added to EmergencyAlertScreen
- Sends sample emergency notification
- Tests complete notification flow

### Test Notification Content
```javascript
{
  title: "Emergency Blood Needed",
  body: "O+ blood required at Civil Hospital Muktsar.",
  data: {
    type: "emergency",
    bloodType: "O+",
    hospital: "Civil Hospital Muktsar", 
    urgency: "high"
  }
}
```

## 🚨 Emergency Alert Flow

1. **Alert Created** - User creates emergency alert
2. **Notification Sent** - Local notification triggered
3. **Sound Played** - Emergency alert sound
4. **Vibration** - Emergency vibration pattern
5. **Display** - High-priority notification shown
6. **User Action** - Tap to view details

## 🔧 Customization

### Alert Types
- Medical Emergency
- Blood Donation Needed  
- Natural Disaster
- Food Distribution

### Sound Customization
- Replace `assets/sounds/emergency-alert.mp3`
- Update app.json configuration
- Rebuild app for changes

### Styling Customization
- Modify notification colors in app.json
- Update vibration patterns in service
- Customize notification icons

## 📋 Backend Requirements

### Token Registration Endpoint
```
POST /api/register-token
Content-Type: application/json

{
  "token": "ExponentPushToken[...]",
  "platform": "ios|android", 
  "deviceId": "unique-device-id"
}
```

### Send Notification Endpoint
```
POST /api/send-emergency-alert
Content-Type: application/json

{
  "title": "Emergency Blood Needed",
  "body": "O+ blood required at Civil Hospital Muktsar.",
  "data": {
    "type": "emergency",
    "urgency": "high"
  },
  "recipients": ["token1", "token2"]
}
```

## 🐛 Troubleshooting

### Common Issues
- **No Sound**: Check audio file exists and app.json config
- **No Permissions**: Verify permission request flow
- **Token Issues**: Check Expo project configuration
- **Background Issues**: Verify notification channel setup

### Debug Mode
```javascript
// Enable debug logging
console.log('Notification service initialized');
console.log('Push token:', token);
console.log('Notification received:', notification);
```

The notification system is fully integrated and ready for emergency alerts!
