import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme, Text } from 'react-native-paper';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import DonorHomeScreen from '../screens/DonorHomeScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import DonorRegistrationScreen from '../screens/DonorRegistrationScreen';
import DonorProfileScreen from '../screens/DonorProfileScreen';
import SecurityTestScreen from '../screens/SecurityTestScreen';
import DonorListScreen from '../screens/DonorListScreen';
import AddDonationScreen from '../screens/AddDonationScreen';
import DonorDetailsScreen from '../screens/DonorDetailsScreen';
import EmergencyAlertScreen from '../screens/EmergencyAlertScreen';
import AlertListScreen from '../screens/AlertListScreen';
import AlertDetailScreen from '../screens/AlertDetailScreen';

// Import auth context
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const theme = useTheme();

  // Determine initial route based on authentication and user role
  const getInitialRoute = () => {
    if (!isAuthenticated) return "Login";

    if (user?.role === 'ADMIN' || user?.role === 'admin') {
      return "AdminDashboard";
    } else {
      return "Home";
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background
      }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={getInitialRoute()}
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable swipe back on login
        }}
      />
      <Stack.Screen
        name="Home"
        component={DonorHomeScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable swipe back on home
        }}
      />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Disable swipe back on admin dashboard
        }}
      />
      <Stack.Screen
        name="DonorRegistration"
        component={DonorRegistrationScreen}
        options={{
          headerShown: false,
          title: 'Donor Registration',
        }}
      />
      <Stack.Screen
        name="DonorProfile"
        component={DonorProfileScreen}
        options={{
          headerShown: false,
          title: 'My Profile',
        }}
      />
      <Stack.Screen
        name="SecurityTest"
        component={SecurityTestScreen}
        options={{
          headerShown: false,
          title: 'Security Tests',
        }}
      />
      <Stack.Screen
        name="DonorList"
        component={DonorListScreen}
        options={{
          headerShown: false,
          title: 'Donor List',
        }}
      />
      <Stack.Screen
        name="AddDonation"
        component={AddDonationScreen}
        options={{
          headerShown: false,
          title: 'Add Donation',
        }}
      />
      <Stack.Screen
        name="DonorDetails"
        component={DonorDetailsScreen}
        options={{
          headerShown: false,
          title: 'Donor Details',
        }}
      />
      <Stack.Screen
        name="EmergencyAlert"
        component={EmergencyAlertScreen}
        options={{
          headerShown: false,
          title: 'Emergency Alert',
        }}
      />
      <Stack.Screen
        name="AlertList"
        component={AlertListScreen}
        options={{
          headerShown: false,
          title: 'Alert List',
        }}
      />
      <Stack.Screen
        name="AlertDetail"
        component={AlertDetailScreen}
        options={{
          headerShown: false,
          title: 'Alert Details',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
