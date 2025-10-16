import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import {
  Text,
  Title,
  Button,
  Avatar,
  Divider,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { commonStyles } from '../theme/theme';

const HomeScreen = ({ navigation }) => {
  // Get auth context and theme
  const { user, logout } = useAuth();
  const theme = useTheme();

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ]
    );
  };

  // Navigation functions
  const navigateToDonorList = () => {
    navigation.navigate('DonorList');
  };

  const navigateToAddDonation = () => {
    navigation.navigate('AddDonation');
  };

  const navigateToEmergencyAlert = () => {
    navigation.navigate('EmergencyAlert');
  };

  return (
    <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={[commonStyles.content, styles.content]}>
        {/* Header with NGO Logo and Name */}
        <View style={styles.header}>
          <Avatar.Icon
            size={80}
            icon="heart"
            style={[styles.logo, { backgroundColor: theme.colors.primary }]}
          />
          <Title style={[styles.appName, { color: theme.colors.primary }]}>MuktsarNGO</Title>
          <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>Blood Donation Management</Text>
        </View>

        {/* User Welcome */}
        {user && (
          <View style={styles.welcomeSection}>
            <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
              Welcome, <Text style={[styles.userName, { color: theme.colors.primary }]}>{user.name}</Text>
            </Text>
            <Text style={[styles.userRole, { color: theme.colors.onSurfaceVariant }]}>Role: {user.role.toUpperCase()}</Text>
          </View>
        )}

        <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={navigateToDonorList}
            style={[commonStyles.primaryButton, styles.navButton]}
            contentStyle={commonStyles.buttonContent}
            icon="account-group"
            buttonColor={theme.colors.primary}
          >
            Donor List
          </Button>

          <Button
            mode="contained"
            onPress={navigateToAddDonation}
            style={[commonStyles.primaryButton, styles.navButton]}
            contentStyle={commonStyles.buttonContent}
            icon="plus-circle"
            buttonColor={theme.colors.success}
          >
            Add Donation
          </Button>

          <Button
            mode="contained"
            onPress={navigateToEmergencyAlert}
            style={[commonStyles.primaryButton, styles.navButton]}
            contentStyle={commonStyles.buttonContent}
            icon="alert"
            buttonColor={theme.colors.warning}
          >
            Emergency Alerts
          </Button>

          <Button
            mode="outlined"
            onPress={handleLogout}
            style={[commonStyles.outlineButton, styles.navButton, styles.logoutButton]}
            contentStyle={commonStyles.buttonContent}
            icon="logout"
            textColor={theme.colors.primary}
          >
            Logout
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32, // theme.spacing.xl
  },
  logo: {
    marginBottom: 16, // theme.spacing.md
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8, // theme.spacing.sm
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 24, // theme.spacing.lg
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 8, // theme.spacing.sm
  },
  userName: {
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
  },
  divider: {
    marginVertical: 24, // theme.spacing.lg
  },
  buttonContainer: {
    gap: 16, // theme.spacing.md
  },
  navButton: {
    elevation: 2,
  },
  logoutButton: {
    marginTop: 16, // theme.spacing.md
  },
});

export default HomeScreen;
