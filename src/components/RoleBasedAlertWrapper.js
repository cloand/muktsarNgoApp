import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import DonorEmergencyAlertScreen from '../screens/DonorEmergencyAlertScreen';
import AlertListScreen from '../screens/AlertListScreen';

/**
 * RoleBasedAlertWrapper - Ensures correct alert screen is shown based on user role
 * - Donors: See DonorEmergencyAlertScreen (Accept buttons only)
 * - Admins: See AlertListScreen (Resolve/manage functionality)
 */
const RoleBasedAlertWrapper = ({ navigation, route }) => {
  const { user } = useAuth();

  // Determine user role
  const userRole = user?.role?.toUpperCase();
  const isDonor = userRole === 'DONOR';
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  // Debug logging (remove in production)
  console.log('RoleBasedAlertWrapper - User role:', userRole, 'isDonor:', isDonor, 'isAdmin:', isAdmin);

  // Show appropriate screen based on role
  if (isDonor) {
    return <DonorEmergencyAlertScreen navigation={navigation} route={route} />;
  } else if (isAdmin) {
    return <AlertListScreen navigation={navigation} route={route} />;
  } else {
    // Fallback for unknown roles
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Access Restricted</Text>
        <Text style={styles.errorMessage}>
          Unable to determine your access level. Please contact support.
        </Text>
        <Text style={styles.debugInfo}>
          Role: {userRole || 'undefined'}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  debugInfo: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default RoleBasedAlertWrapper;
