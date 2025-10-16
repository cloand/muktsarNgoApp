# NestJS Emergency Alert Integration

## Overview

This document outlines the complete integration of emergency blood donation alerts between the React Native mobile app and the NestJS backend API.

## Backend API Endpoints

### Alert Management

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/alerts` | Create new emergency alert | Admin/Volunteer |
| `GET` | `/alerts` | List all alerts with pagination | All authenticated |
| `GET` | `/alerts/active` | Get only active alerts | All authenticated |
| `PATCH` | `/alerts/:id/resolve` | Mark alert as resolved | Admin/Volunteer |
| `PATCH` | `/alerts/:id/cancel` | Cancel an alert | Admin/Volunteer |

### Request/Response Format

#### POST /alerts (Create Alert)
```json
{
  "title": "Urgent O+ Blood Needed",
  "message": "O+ blood urgently needed at Civil Hospital Muktsar",
  "hospitalName": "Civil Hospital Muktsar",
  "bloodGroup": "O_POSITIVE",
  "unitsRequired": 3,
  "urgency": "HIGH",
  "contactNumber": "+91-9876543210",
  "additionalNotes": "Patient in critical condition",
  "expiresAt": "2024-10-08T12:00:00.000Z"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": "alert_1728123456789",
    "title": "Urgent O+ Blood Needed",
    "status": "ACTIVE",
    "createdAt": "2024-10-07T12:00:00.000Z",
    "notificationsSent": 150
  }
}
```

## Frontend Integration

### API Service Updates

**File:** `src/services/api.js`

Added new alert endpoints:
- `alerts: '/alerts'`
- `activeAlerts: '/alerts/active'`
- `resolveAlert: (id) => '/alerts/${id}/resolve'`
- `cancelAlert: (id) => '/alerts/${id}/cancel'`

Added new API methods:
- `getAlerts(params)`
- `createAlert(alertData)`
- `getActiveAlerts()`
- `resolveAlert(id)`
- `cancelAlert(id)`

### Data Transformation

**File:** `src/utils/constants.js`

Blood group mapping for backend compatibility:
```javascript
const BLOOD_GROUP_MAPPING = {
  'A+': 'A_POSITIVE',
  'A-': 'A_NEGATIVE',
  'B+': 'B_POSITIVE',
  'B-': 'B_NEGATIVE',
  'AB+': 'AB_POSITIVE',
  'AB-': 'AB_NEGATIVE',
  'O+': 'O_POSITIVE',
  'O-': 'O_NEGATIVE',
  // Reverse mappings for display
  'A_POSITIVE': 'A+',
  'A_NEGATIVE': 'A-',
  // ... etc
};
```

### Sound Integration

**File:** `src/services/SoundService.js`

New sound service with:
- Emergency alert sounds with vibration
- Success notification sounds
- Notification sounds
- Audio mode configuration for background playback

Key methods:
- `playEmergencyAlert()` - Plays alarm sound + vibration
- `playSuccessAlert()` - Plays success sound + vibration
- `playNotificationAlert()` - Plays notification sound + vibration

### EmergencyAlertScreen Updates

**Enhanced Features:**

1. **Real-time Alert Display**
   - Shows recent active alerts at the top
   - Auto-refreshes every 30 seconds
   - Plays alarm sound when new alerts arrive

2. **Enhanced Form**
   - Added "Units Required" field
   - Improved validation
   - Backend-compatible data transformation

3. **Sound Integration**
   - Plays emergency alarm when new alerts arrive
   - Plays success sound when alert is sent
   - Vibration patterns for different alert types

4. **UI Improvements**
   - Recent alerts section with status indicators
   - Navigation to full alert list
   - Loading states and error handling

### New AlertListScreen

**File:** `src/screens/AlertListScreen.js`

Complete alert management interface:
- List all alerts with search functionality
- Filter by hospital, blood group, or message
- Resolve/cancel alerts with confirmation
- Real-time status updates
- Pull-to-refresh functionality

## Key Features Implemented

### 1. Real-time Alert Updates
- Polling mechanism checks for new alerts every 30 seconds
- Instant display of new alerts in EmergencyAlertScreen
- Automatic sound/vibration alerts for new emergencies

### 2. Sound & Vibration System
- Emergency alerts: Long vibration pattern + alarm sound
- Success notifications: Short vibration + success sound
- Background audio support for critical alerts

### 3. Role-based Access Control
- Only Admin/Volunteer can create alerts
- All authenticated users can view alerts
- Only Admin/Volunteer can resolve/cancel alerts

### 4. Data Validation & Transformation
- Frontend validation for required fields
- Automatic blood group format conversion
- Date/time handling for alert expiration

### 5. Enhanced User Experience
- Loading indicators during API calls
- Error handling with retry options
- Intuitive navigation between screens
- Search and filter capabilities

## Firebase Cloud Messaging (FCM)

### Backend Integration
The NestJS backend should implement FCM notifications:

```typescript
// In alerts.service.ts
async create(createAlertDto: CreateAlertDto) {
  const alert = await this.prisma.alert.create({ data: createAlertDto });
  
  // Send FCM notifications to all donors
  await this.notificationsService.sendToAllDonors({
    title: alert.title,
    body: alert.message,
    data: {
      alertId: alert.id,
      bloodGroup: alert.bloodGroup,
      urgency: alert.urgency,
    },
  });
  
  return alert;
}
```

### Frontend FCM Handling
The app already has FCM setup in `NotificationContext.js` and will automatically receive push notifications when the backend sends them.

## Testing

### Manual Testing Steps

1. **Create Alert:**
   - Login as Admin/Volunteer
   - Navigate to Emergency Alert screen
   - Fill form and submit
   - Verify alert appears in recent alerts
   - Check success sound plays

2. **View Alerts:**
   - Navigate to Alert List screen
   - Verify all alerts display correctly
   - Test search functionality
   - Test pull-to-refresh

3. **Real-time Updates:**
   - Have another user create an alert
   - Verify new alert appears automatically
   - Check alarm sound plays for new alerts

4. **Alert Management:**
   - Test resolve alert functionality
   - Test cancel alert functionality
   - Verify status updates correctly

## Production Deployment

### Backend Requirements
1. Ensure NestJS backend is running with alert endpoints
2. Configure Firebase Admin SDK for FCM
3. Set up proper JWT authentication
4. Configure CORS for mobile app domain

### Frontend Configuration
1. Update `baseURL` in `src/services/api.js` to production backend
2. Configure Firebase project for production
3. Test FCM notifications on physical devices
4. Verify sound permissions on iOS/Android

### Environment Variables
```bash
# Backend (.env)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Frontend (app.config.js)
EXPO_PUBLIC_API_BASE_URL=https://api.muktsarngo.org
```

## API Usage Examples

### Create Emergency Alert
```javascript
const alertData = {
  hospitalName: "Civil Hospital Muktsar",
  bloodGroup: "O+",
  urgency: "High",
  unitsRequired: 3,
  contactNumber: "+91-9876543210",
  additionalNotes: "Patient in critical condition"
};

const response = await ApiService.createAlert(alertData);
```

### Get Active Alerts
```javascript
const activeAlerts = await ApiService.getActiveAlerts();
```

### Resolve Alert
```javascript
await ApiService.resolveAlert(alertId);
```

## Error Handling

The integration includes comprehensive error handling:
- Network connectivity issues
- Authentication failures
- Validation errors
- Backend service unavailability
- Sound playback failures

All errors are logged and user-friendly messages are displayed with retry options where appropriate.

## Security Considerations

1. **Authentication:** All API calls include JWT tokens
2. **Authorization:** Role-based access control enforced
3. **Data Validation:** Input sanitization on both frontend and backend
4. **Rate Limiting:** Backend should implement rate limiting for alert creation
5. **Audit Trail:** All alert actions are logged with user information

## Future Enhancements

1. **WebSocket Integration:** Replace polling with real-time WebSocket connections
2. **Geolocation:** Add location-based alert filtering
3. **Push Notification Actions:** Allow users to respond directly from notifications
4. **Alert Analytics:** Track response rates and effectiveness
5. **Bulk Operations:** Allow bulk alert management for administrators
