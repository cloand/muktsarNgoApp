# 🩸 DonorListScreen Documentation

## Overview
The DonorListScreen is a comprehensive React Native component that fetches and displays donor data from a backend API using axios. It provides a modern, Material Design interface using React Native Paper components.

## 🔧 Features

### ✅ API Integration
- **Axios HTTP Client** for API calls
- **Configurable API endpoint** via constants
- **Error handling** with fallback to mock data
- **Request timeout** (10 seconds)
- **Authorization header** support (ready for JWT tokens)

### ✅ UI Components
- **React Native Paper Cards** for donor display
- **Search functionality** with real-time filtering
- **Pull-to-refresh** capability
- **Loading states** with activity indicators
- **Error states** with retry functionality
- **Empty states** with helpful messages
- **Floating Action Button** for adding new donors

### ✅ Data Display
Each donor card shows:
- **Donor Name** (prominent title)
- **Blood Group** (color-coded chip)
- **Last Donation Date** (formatted)
- **Status** (Active/Unavailable with color coding)
- **Phone Number** (if available)
- **Email Address** (if available)
- **Action buttons** (Contact, Details)

## 📡 API Configuration

### Endpoint
```javascript
const API_ENDPOINT = 'https://your-backend-url.com/api/donors/';
```

### Expected API Response Format
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "bloodGroup": "O+",
    "lastDonationDate": "2024-01-15",
    "status": "Active",
    "phone": "+91 9876543210",
    "email": "john@example.com"
  }
]
```

### Alternative Response Formats Supported
```json
{
  "donors": [...],
  "data": [...]
}
```

## 🎨 UI States

### 1. Loading State
- Shows activity indicator
- "Loading donors..." message

### 2. Error State
- Error message display
- Retry button
- Falls back to mock data for demo

### 3. Empty State
- "No donors found" message
- Different messages for search vs. no data

### 4. Success State
- Scrollable list of donor cards
- Search functionality
- Pull-to-refresh

## 🔍 Search Functionality
Searches across:
- Donor name
- Blood group
- Status
- Case-insensitive matching

## 🎯 Status Color Coding
- **Active**: Green (#4CAF50)
- **Unavailable**: Red (#FF5722)
- **Default**: Gray (#9E9E9E)

## 📱 User Interactions

### Card Actions
- **Contact Button**: Shows alert with call/message options
- **Details Button**: Logs donor ID (ready for navigation)

### Navigation
- **Back Button**: Returns to previous screen
- **FAB**: Ready for "Add Donor" functionality

### Refresh
- **Pull-to-refresh**: Reloads data from API
- **Retry Button**: Appears on error state

## 🔧 Configuration

### API Endpoint
Update in `src/utils/constants.js`:
```javascript
export const API_ENDPOINTS = {
  DONORS_FULL: 'https://your-actual-backend-url.com/api/donors/',
};
```

### Mock Data
When API fails, displays sample donors for demo purposes.

## 📦 Dependencies Used
- `axios` - HTTP client
- `react-native-paper` - Material Design components
- `react-native` - Core components

## 🚀 Usage Example

```javascript
// Navigate to DonorListScreen
navigation.navigate('DonorList');
```

## 🔄 State Management
- **Local state** using React hooks
- **Search filtering** with useEffect
- **Loading states** for better UX
- **Error handling** with user feedback

## 📋 Future Enhancements
- [ ] Pagination for large datasets
- [ ] Advanced filtering (by blood group, status)
- [ ] Sorting options
- [ ] Donor profile details screen
- [ ] Direct calling/messaging integration
- [ ] Offline data caching
- [ ] Export functionality

## 🐛 Error Handling
- Network timeouts
- Invalid API responses
- Empty data sets
- Search with no results
- Graceful fallbacks to mock data

The DonorListScreen provides a complete, production-ready interface for managing donor information with modern UX patterns and robust error handling.
