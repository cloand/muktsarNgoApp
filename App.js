import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

// Import the main navigator
import AppNavigator from './src/navigation/AppNavigator';
// Import context providers
import { AuthProvider } from './src/context/AuthContext';
import { AppProvider } from './src/context/AppContext';
import { NotificationProvider } from './src/context/NotificationContext';
// Import NGO theme
import { ngoTheme } from './src/theme/theme';

export default function App() {
  return (
    <PaperProvider theme={ngoTheme}>
      <NotificationProvider>
        <AuthProvider>
          <AppProvider>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor={ngoTheme.colors.primary} />
              <AppNavigator />
            </NavigationContainer>
          </AppProvider>
        </AuthProvider>
      </NotificationProvider>
    </PaperProvider>
  );
}
