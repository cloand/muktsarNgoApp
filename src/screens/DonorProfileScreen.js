import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
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
  List,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { commonStyles } from '../theme/theme';
import { ApiService } from '../services';

const DonorProfileScreen = ({ navigation }) => {
  // Get auth context and theme
  const { user, logout } = useAuth();
  const theme = useTheme();

  // State
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock donor profile data - replace with actual API call
  useEffect(() => {
    const loadDonorProfile = async () => {
      try {
        setLoading(true);
        const profile = await ApiService.getProfile()
        
        // Mock data - replace with actual API call to get donor profile
        // const mockProfile = {
        //   id: user?.id || 1,
        //   name: user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || 'John Doe',
        //   email: user?.email || 'donor@muktsarngo.com',
        //   phone: '+91 98765 43210',
        //   bloodGroup: 'O+',
        //   gender: 'Male',
        //   dateOfBirth: '1990-01-15',
        //   address: '123 Main Street, Sector 1',
        //   city: 'Muktsar',
        //   state: 'Punjab',
        //   pincode: '152026',
        //   emergencyContact: '+91 98765 43211',
        //   totalDonations: 5,
        //   lastDonationDate: '2024-08-15',
        //   isEligible: true,
        //   nextEligibleDate: '2024-11-15',
        //   registrationDate: '2023-01-15',
        // };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setDonorProfile(profile.data);
      } catch (error) {
        console.error('Error loading donor profile:', error);
        Alert.alert('Error', 'Failed to load profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDonorProfile();
  }, [user]);

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
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

  if (loading) {
    return (
      <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={{ marginTop: 16, color: theme.colors.onBackground }}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!donorProfile) {
    return (
      <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Failed to load profile
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            buttonColor={theme.colors.primary}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.content, styles.content]}>
          {/* Header */}
          <View style={styles.header}>
            <Avatar.Icon
              size={80}
              icon="account"
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            />
            <Title style={[styles.name, { color: theme.colors.primary }]}>
              {donorProfile.name}
            </Title>
            <Text style={[styles.email, { color: theme.colors.onSurfaceVariant }]}>
              {donorProfile.email}
            </Text>
          </View>

          {/* Eligibility Status */}
          <Card style={[styles.statusCard, { 
            backgroundColor: donorProfile.isEligible ? theme.colors.primaryContainer : theme.colors.errorContainer 
          }]}>
            <Card.Content>
              <View style={styles.statusContent}>
                <Chip
                  icon={donorProfile.isEligible ? "check-circle" : "clock"}
                  style={[styles.statusChip, {
                    backgroundColor: donorProfile.isEligible ? '#4CAF50' : '#FF5722'
                  }]}
                  textStyle={{ color: 'white' }}
                >
                  {donorProfile.isEligible ? 'Eligible to Donate' : 'Not Eligible'}
                </Chip>
                <Text style={[styles.statusText, { 
                  color: donorProfile.isEligible ? theme.colors.onPrimaryContainer : theme.colors.onErrorContainer 
                }]}>
                  {donorProfile.isEligible 
                    ? 'You can donate blood now!'
                    : `Next eligible date: ${new Date(donorProfile.nextEligibleDate).toLocaleDateString()}`
                  }
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Personal Information */}
          <Card style={styles.infoCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Personal Information</Title>
              <List.Item
                title="Blood Group"
                description={donorProfile.bloodGroup}
                left={props => <List.Icon {...props} icon="water" />}
              />
              <List.Item
                title="Gender"
                description={donorProfile.gender}
                left={props => <List.Icon {...props} icon="human-male-female" />}
              />
              <List.Item
                title="Age"
                description={`${calculateAge(donorProfile.dateOfBirth)} years`}
                left={props => <List.Icon {...props} icon="calendar" />}
              />
              <List.Item
                title="Phone"
                description={donorProfile.phone}
                left={props => <List.Icon {...props} icon="phone" />}
              />
              <List.Item
                title="Address"
                description={`${donorProfile.address}, ${donorProfile.city}, ${donorProfile.state} - ${donorProfile.pincode}`}
                left={props => <List.Icon {...props} icon="map-marker" />}
              />
              <List.Item
                title="Emergency Contact"
                description={donorProfile.emergencyContact}
                left={props => <List.Icon {...props} icon="phone-alert" />}
              />
            </Card.Content>
          </Card>

          {/* Donation History */}
          <Card style={styles.historyCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Donation History</Title>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{donorProfile.totalDonations}</Text>
                  <Text style={styles.statLabel}>Total Donations</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {donorProfile.lastDonationDate 
                      ? new Date(donorProfile.lastDonationDate).toLocaleDateString()
                      : 'Never'
                    }
                  </Text>
                  <Text style={styles.statLabel}>Last Donation</Text>
                </View>
              </View>
              <Text style={styles.registrationText}>
                Member since: {new Date(donorProfile.registrationDate).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon!')}
              style={styles.actionButton}
              icon="pencil"
              textColor={theme.colors.primary}
            >
              Edit Profile
            </Button>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate('AlertList')}
              style={styles.actionButton}
              icon="bell"
              textColor={theme.colors.primary}
            >
              View Alerts
            </Button>

            <Button
              mode="outlined"
              onPress={handleLogout}
              style={[styles.actionButton, styles.logoutButton]}
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
    paddingVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    textAlign: 'center',
  },
  statusCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statusContent: {
    alignItems: 'center',
  },
  statusChip: {
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  historyCard: {
    marginBottom: 24,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  registrationText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    elevation: 1,
  },
  logoutButton: {
    marginTop: 16,
  },
});

export default DonorProfileScreen;
