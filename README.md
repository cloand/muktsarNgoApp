# Muktsar NGO - React Native App

A React Native (Expo) application for managing NGO operations including donor management, donations tracking, and emergency alerts.

## Features

- **Authentication**: Login system with basic validation
- **Home Dashboard**: Central hub with navigation to all features
- **Donor Management**: View and manage donor information
- **Donation Tracking**: Record and track donations
- **Emergency Alerts**: Send emergency notifications with quick alert options

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.js       # Custom button component
│   ├── Header.js       # Header component
│   └── index.js        # Component exports
├── screens/            # App screens
│   ├── LoginScreen.js
│   ├── HomeScreen.js
│   ├── DonorListScreen.js
│   ├── AddDonationScreen.js
│   ├── EmergencyAlertScreen.js
│   └── index.js
├── navigation/         # Navigation configuration
│   ├── AppNavigator.js # Main navigation setup
│   └── index.js
├── services/          # API and external services
│   ├── ApiService.js  # HTTP API service
│   ├── AuthService.js # Authentication service
│   └── index.js
├── context/           # React Context providers
│   ├── AuthContext.js # Authentication context
│   ├── AppContext.js  # App state context
│   └── index.js
└── utils/             # Utility functions and constants
    ├── constants.js   # App constants
    ├── helpers.js     # Helper functions
    └── index.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- React Native development environment

### Installation

1. Navigate to the project directory:
   ```bash
   cd muktsarngo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Use Expo Go app on your mobile device to scan the QR code, or run on simulator:
   ```bash
   npm run ios     # for iOS simulator
   npm run android # for Android emulator
   npm run web     # for web browser
   ```

## Default Login Credentials

For testing purposes, use these credentials:
- **Email**: admin@muktsarngo.com
- **Password**: password

## Navigation Structure

- **Login Screen** (Initial Route)
  - Home Screen
    - Donor List Screen
    - Add Donation Screen
    - Emergency Alert Screen

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Navigation library
- **React Context**: State management
- **AsyncStorage**: Local data persistence

## Development Notes

- All screens use functional components with hooks
- Navigation is configured with React Navigation v6
- State management uses React Context API
- Clean folder organization following React Native best practices
- Responsive design with proper styling

## Future Enhancements

- Integration with backend API
- Push notifications for emergency alerts
- Advanced donor analytics
- Offline data synchronization
- Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
