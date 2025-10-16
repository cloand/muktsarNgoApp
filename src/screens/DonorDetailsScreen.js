import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  Chip,
  useTheme,
  Appbar,
  Divider,
  IconButton,
} from 'react-native-paper';
import { commonStyles } from '../theme/theme';
import ApiService from '../services/ApiService';
import {
  checkEligibility,
  getEligibilityColor,
  getEligibilityIcon,
  formatNextEligibleDate,
  transformDonorFromBackend
} from '../utils/constants';

const DonorDetailsScreen = ({ navigation, route }) => {
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  const theme = useTheme();
  const { donorId } = route.params;

  useEffect(() => {
    fetchDonorDetails();
  }, [donorId]);

  const fetchDonorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.getDonorById(donorId);
      console.log('Donor details fetched:', response);
      
      // Transform backend data to frontend format
      const donorData = response.data ? transformDonorFromBackend(response.data) : transformDonorFromBackend(response);
      setDonor(donorData);
    } catch (error) {
      console.error('Error fetching donor details:', error);
      setError('Failed to load donor details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDonor = () => {
    // Navigate to edit donor screen (to be implemented)
    Alert.alert(
      'Update Donor',
      'Edit donor functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteDonor = () => {
    Alert.alert(
      'Delete Donor',
      'Are you sure you want to delete this donor? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setUpdating(true);
              await ApiService.deleteDonor(donorId);
              Alert.alert('Success', 'Donor deleted successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error('Error deleting donor:', error);
              Alert.alert('Error', 'Failed to delete donor. Please try again.');
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  const handleContactDonor = () => {
    if (!donor?.phone) {
      Alert.alert('No Contact', 'No phone number available for this donor.');
      return;
    }

    Alert.alert(
      'Contact Donor',
      `Contact ${donor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Call donor:', donor.phone) },
        { text: 'Message', onPress: () => console.log('Message donor:', donor.phone) },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Donor Details" />
        </Appbar.Header>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading donor details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !donor) {
    return (
      <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
        <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Donor Details" />
        </Appbar.Header>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || 'Donor not found'}</Text>
          <Button mode="outlined" onPress={fetchDonorDetails} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const eligibility = checkEligibility(donor.lastDonationDate, donor.gender);

  return (
    <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Donor Details" />
        <Appbar.Action icon="pencil" onPress={handleUpdateDonor} disabled={updating} />
        <Appbar.Action icon="delete" onPress={handleDeleteDonor} disabled={updating} />
      </Appbar.Header>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Basic Information Card */}
        <Card style={[commonStyles.card, styles.card]}>
          <Card.Content>
            <View style={styles.headerRow}>
              <View style={styles.nameSection}>
                <Title style={[styles.donorName, { color: theme.colors.onSurface }]}>
                  {donor.name}
                </Title>
                <Paragraph style={{ color: theme.colors.onSurfaceVariant }}>
                  ID: {donor.id}
                </Paragraph>
              </View>
              <Chip
                mode="flat"
                style={[styles.statusChip, { backgroundColor: eligibility.color }]}
                textStyle={styles.statusText}
                icon={eligibility.icon}
              >
                {eligibility.status}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Blood Group
                </Text>
                <Chip mode="outlined" style={styles.bloodGroupChip}>
                  {donor.bloodGroup}
                </Chip>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Gender
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                  {donor.gender}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Total Donations
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                  {donor.totalDonations || 0}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Last Donation
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                  {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}
                </Text>
              </View>
            </View>

            {!eligibility.isEligible && (
              <View style={styles.eligibilityInfo}>
                <Text style={[styles.eligibilityText, { color: theme.colors.onSurfaceVariant }]}>
                  Next eligible date: {formatNextEligibleDate(donor.lastDonationDate, donor.gender)}
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Contact Information Card */}
        <Card style={[commonStyles.card, styles.card]}>
          <Card.Content>
            <Title style={[styles.sectionTitle, { color: theme.colors.primary }]}>
              Contact Information
            </Title>
            
            <View style={styles.contactItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Email
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {donor.email || 'Not provided'}
              </Text>
            </View>

            <View style={styles.contactItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Phone
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {donor.phone || 'Not provided'}
              </Text>
            </View>

            <View style={styles.contactItem}>
              <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                Emergency Contact
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                {donor.emergencyContact || 'Not provided'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Address Information Card */}
        {(donor.address || donor.city || donor.state) && (
          <Card style={[commonStyles.card, styles.card]}>
            <Card.Content>
              <Title style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                Address Information
              </Title>
              
              {donor.address && (
                <View style={styles.contactItem}>
                  <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Address
                  </Text>
                  <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                    {donor.address}
                  </Text>
                </View>
              )}

              <View style={styles.addressRow}>
                {donor.city && (
                  <View style={styles.addressItem}>
                    <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                      City
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                      {donor.city}
                    </Text>
                  </View>
                )}

                {donor.state && (
                  <View style={styles.addressItem}>
                    <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                      State
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                      {donor.state}
                    </Text>
                  </View>
                )}

                {donor.pincode && (
                  <View style={styles.addressItem}>
                    <Text style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                      Pincode
                    </Text>
                    <Text style={[styles.infoValue, { color: theme.colors.onSurface }]}>
                      {donor.pincode}
                    </Text>
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={handleContactDonor}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            disabled={!donor.phone || updating}
            icon="phone"
          >
            Contact Donor
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  nameSection: {
    flex: 1,
  },
  donorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoItem: {
    width: '48%',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  bloodGroupChip: {
    alignSelf: 'flex-start',
  },
  eligibilityInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
  },
  eligibilityText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  contactItem: {
    marginBottom: 12,
  },
  addressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addressItem: {
    width: '48%',
    marginBottom: 12,
  },
  actionButtons: {
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    marginVertical: 8,
    paddingVertical: 8,
  },
});

export default DonorDetailsScreen;
