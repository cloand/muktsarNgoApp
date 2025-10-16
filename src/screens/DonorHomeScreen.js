import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Title,
  Button,
  Avatar,
  Divider,
  useTheme,
  Card,
  Paragraph,
  Chip,
  ActivityIndicator,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { commonStyles } from '../theme/theme';
import ApiService from '../services/ApiService';
import { AdminModeToggle, DonorOnlyAccess } from '../components/AdminOnlyAccess';
import { isAdmin, isDonor, APP_CONFIG, FEATURES } from '../config/config';

const DonorHomeScreen = ({ navigation }) => {
  // Get auth context and theme
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const theme = useTheme();

  // State for alerts and profile
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load donor data on mount
  useEffect(() => {
    loadDonorData();
  }, []);

  const loadDonorData = async () => {
    try {
      setLoading(true);
      
      // Load recent alerts
      const alertsResponse = await ApiService.getAlerts({ limit: 3 });
      if (alertsResponse.success) {
        setRecentAlerts(alertsResponse.data || []);
      }

      // Load donor profile if available
      // Note: In a real app, you'd have an endpoint to get donor profile by user ID
      
    } catch (error) {
      console.error('Error loading donor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDonorData();
    setRefreshing(false);
  };

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
  const navigateToProfile = () => {
    navigation.navigate('DonorProfile');
  };

  const navigateToAlerts = () => {
    navigation.navigate('AlertList');
  };

  const navigateToRegister = () => {
    Alert.alert(
      'Donor Registration',
      'Complete donor registration coming soon!',
      [{ text: 'OK' }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[commonStyles.content, styles.content]}>
          {/* Header with NGO Logo and Name */}
          <View style={styles.header}>
            <Avatar.Icon
              size={80}
              icon="heart"
              style={[styles.logo, { backgroundColor: theme.colors.primary }]}
            />
            <Title style={[styles.appName, { color: theme.colors.primary }]}>MuktsarNGO</Title>
            <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>Blood Donation Portal</Text>
          </View>

          {/* Admin Mode Toggle */}
          {FEATURES.ENABLE_ADMIN_MODE_TOGGLE && (
            <AdminModeToggle
              onToggle={() => {
                if (isAdmin(user)) {
                  navigation.navigate('AdminDashboard');
                }
              }}
            />
          )}

          {/* Donor Welcome */}
          {user && (
            <Card style={[styles.welcomeCard, { backgroundColor: theme.colors.primaryContainer }]}>
              <Card.Content>
                <Text style={[styles.welcomeText, { color: theme.colors.onPrimaryContainer }]}>
                  Welcome, <Text style={[styles.userName, { color: theme.colors.primary }]}>
                    {user.firstName || user.name}
                  </Text>
                </Text>
                <Text style={[styles.userRole, { color: theme.colors.onPrimaryContainer }]}>
                  {isAdmin(user) ? 'Administrator' : 'Blood Donor'}
                </Text>
              </Card.Content>
            </Card>
          )}

          {/* Recent Alerts */}
          <Card style={[styles.alertsCard, { backgroundColor: theme.colors.errorContainer }]}>
            <Card.Content>
              <Title style={[styles.cardTitle, { color: theme.colors.onErrorContainer }]}>
                Recent Emergency Alerts
              </Title>
              {recentAlerts.length > 0 ? (
                recentAlerts.slice(0, 2).map((alert, index) => (
                  <View key={alert.id || index} style={styles.alertItem}>
                    <Text style={[styles.alertTitle, { color: theme.colors.onErrorContainer }]}>
                      {alert.title}
                    </Text>
                    <Text style={[styles.alertDetails, { color: theme.colors.onErrorContainer }]}>
                      {alert.bloodGroup} • {alert.hospitalName}
                    </Text>
                    <Chip 
                      mode="outlined" 
                      style={[styles.urgencyChip, { borderColor: theme.colors.onErrorContainer }]}
                      textStyle={{ color: theme.colors.onErrorContainer }}
                    >
                      {alert.urgency}
                    </Chip>
                  </View>
                ))
              ) : (
                <Text style={[styles.noAlertsText, { color: theme.colors.onErrorContainer }]}>
                  No recent alerts
                </Text>
              )}
              <Button
                mode="outlined"
                onPress={navigateToAlerts}
                style={[styles.viewAllButton, { borderColor: theme.colors.onErrorContainer }]}
                textColor={theme.colors.onErrorContainer}
              >
                View All Alerts
              </Button>
            </Card.Content>
          </Card>

          <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />

          {/* Donor Actions */}
          <View style={styles.buttonContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Your Actions
            </Text>
            
            <Button
              mode="contained"
              onPress={navigateToProfile}
              style={[commonStyles.primaryButton, styles.navButton]}
              contentStyle={commonStyles.buttonContent}
              icon="account"
              buttonColor={theme.colors.primary}
            >
              View My Profile
            </Button>

            <Button
              mode="outlined"
              onPress={navigateToRegister}
              style={[commonStyles.outlineButton, styles.navButton]}
              contentStyle={commonStyles.buttonContent}
              icon="account-plus"
              textColor={theme.colors.primary}
            >
              Complete Registration
            </Button>

            <Button
              mode="outlined"
              onPress={navigateToAlerts}
              style={[commonStyles.outlineButton, styles.navButton]}
              contentStyle={commonStyles.buttonContent}
              icon="bell"
              textColor={theme.colors.primary}
            >
              Emergency Alerts
            </Button>

            <Divider style={[styles.divider, { backgroundColor: theme.colors.outline, marginVertical: 24 }]} />

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('SecurityTest')}
              style={[commonStyles.outlineButton, styles.navButton]}
              contentStyle={commonStyles.buttonContent}
              icon="shield-check"
              textColor={theme.colors.primary}
            >
              Security Tests
            </Button>

            <Button
              mode="outlined"
              onPress={handleLogout}
              style={[commonStyles.outlineButton, styles.navButton, styles.logoutButton]}
              contentStyle={commonStyles.buttonContent}
              icon="logout"
              textColor={theme.colors.error}
            >
              Logout
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingVertical: 24, // theme.spacing.lg
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32, // theme.spacing.xl
  },
  logo: {
    marginBottom: 16, // theme.spacing.md
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8, // theme.spacing.sm
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  welcomeCard: {
    marginBottom: 24, // theme.spacing.lg
    elevation: 2,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 8, // theme.spacing.sm
    textAlign: 'center',
  },
  userName: {
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  alertsCard: {
    marginBottom: 24, // theme.spacing.lg
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16, // theme.spacing.md
    textAlign: 'center',
  },
  alertItem: {
    marginBottom: 16, // theme.spacing.md
    paddingBottom: 12, // theme.spacing.sm + 4
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDetails: {
    fontSize: 14,
    marginBottom: 8, // theme.spacing.sm
  },
  urgencyChip: {
    alignSelf: 'flex-start',
  },
  noAlertsText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16, // theme.spacing.md
  },
  viewAllButton: {
    marginTop: 8, // theme.spacing.sm
  },
  divider: {
    marginVertical: 24, // theme.spacing.lg
  },
  buttonContainer: {
    gap: 12, // theme.spacing.sm + 4
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12, // theme.spacing.sm + 4
    textAlign: 'center',
  },
  navButton: {
    elevation: 2,
  },
  logoutButton: {
    marginTop: 16, // theme.spacing.md
  },
});

export default DonorHomeScreen;
