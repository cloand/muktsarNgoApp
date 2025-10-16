import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  Alert as RNAlert,
  Linking,
} from 'react-native';
import {
  Text,
  Title,
  Button,
  Card,
  Chip,
  ActivityIndicator,
  Appbar,
  Divider,
  IconButton,
  List,
  useTheme,
} from 'react-native-paper';
import ApiService from '../services/ApiService';
import { formatBloodGroup } from '../utils/bloodGroupFormatter';
import { commonStyles } from '../theme/theme';

/**
 * AlertDetailScreen
 * Shows detailed information about an alert including:
 * - Alert details
 * - List of donors who accepted the alert
 * - Actions to mark as complete or cancel
 * (Admin only)
 */
const AlertDetailScreen = ({ route, navigation }) => {
  const { alert } = route.params;
  const theme = useTheme();

  // State
  const [acceptedDonors, setAcceptedDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load accepted donors on mount
  useEffect(() => {
    loadAcceptedDonors();
  }, []);

  // Load accepted donors from API
  const loadAcceptedDonors = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAcceptedDonors(alert.id);
      setAcceptedDonors(response.data.data || []);
    } catch (error) {
      console.error('Error loading accepted donors:', error);
      RNAlert.alert('Error', 'Failed to load accepted donors.');
    } finally {
      setLoading(false);
    }
  };

  // Refresh accepted donors
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAcceptedDonors();
    setRefreshing(false);
  };

  // Handle marking alert as complete
  const handleMarkComplete = async () => {
    RNAlert.alert(
      'Mark as Complete',
      'Mark this alert as completed? This will move it to past alerts.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await ApiService.markAlertComplete(alert.id);
              RNAlert.alert('Success', 'Alert marked as completed', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error('Error marking alert complete:', error);
              RNAlert.alert('Error', 'Failed to mark alert as complete.');
            }
          },
        },
      ]
    );
  };

  // Handle calling donor
  const handleCallDonor = (phoneNumber) => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          RNAlert.alert('Error', 'Phone calls are not supported on this device');
        }
      })
      .catch((error) => {
        console.error('Error opening phone dialer:', error);
        RNAlert.alert('Error', 'Failed to open phone dialer');
      });
  };

  // Get urgency color
  const getUrgencyColor = (urgency) => {
    switch (urgency?.toUpperCase()) {
      case 'HIGH':
      case 'CRITICAL':
        return '#e74c3c';
      case 'MEDIUM':
        return '#f39c12';
      case 'LOW':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  // Render donor item
  const renderDonorItem = ({ item }) => (
    <Card style={styles.donorCard}>
      <List.Item
        title={item.name}
        description={`${item.email}\n${formatBloodGroup(item.bloodGroup)} | ${item.city}, ${item.state}`}
        descriptionNumberOfLines={3}
        left={(props) => (
          <List.Icon {...props} icon="account-circle" color={theme.colors.primary} />
        )}
        right={(props) => (
          <View style={styles.donorActions}>
            <IconButton
              icon="phone"
              size={24}
              iconColor={theme.colors.primary}
              onPress={() => handleCallDonor(item.phone)}
            />
            <Chip
              mode="outlined"
              style={styles.eligibilityChip}
              textStyle={{
                color: item.isEligible ? '#27ae60' : '#e74c3c',
                fontSize: 10,
              }}
            >
              {item.isEligible ? 'Eligible' : 'Not Eligible'}
            </Chip>
          </View>
        )}
      />
      <Divider />
    </Card>
  );

  const urgencyColor = getUrgencyColor(alert.urgency);
  const isActive = alert.status?.toUpperCase() === 'ACTIVE' || !alert.status;

  return (
    <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Alert Details"
          titleStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
        />
        <Appbar.Action icon="refresh" onPress={onRefresh} />
      </Appbar.Header>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Alert Information Card */}
        <Card style={[styles.alertCard, { borderLeftColor: urgencyColor, borderLeftWidth: 6 }]}>
          <Card.Content>
            {/* Title and Status */}
            <View style={styles.headerRow}>
              <Title style={styles.alertTitle}>{alert.title || 'Blood Needed'}</Title>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  { backgroundColor: isActive ? '#f39c12' : '#27ae60' },
                ]}
                textStyle={styles.chipText}
              >
                {alert.status || (isActive ? 'Active' : 'Completed')}
              </Chip>
            </View>

            <Divider style={styles.divider} />

            {/* Blood Group and Urgency */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Chip
                  mode="flat"
                  style={[styles.bloodGroupChip, { backgroundColor: urgencyColor }]}
                  textStyle={styles.chipText}
                >
                  {formatBloodGroup(alert.bloodGroup)}
                </Chip>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Urgency</Text>
                <Chip
                  mode="outlined"
                  style={[styles.urgencyChip, { borderColor: urgencyColor }]}
                  textStyle={{ color: urgencyColor, fontWeight: 'bold' }}
                >
                  {alert.urgency}
                </Chip>
              </View>
            </View>

            <Divider style={styles.divider} />

            {/* Hospital Information */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Hospital Information</Text>
              <View style={styles.detailRow}>
                <IconButton icon="hospital-building" size={20} style={styles.detailIcon} />
                <Text style={styles.detailText}>{alert.hospitalName}</Text>
              </View>
              {alert.hospitalAddress && (
                <View style={styles.detailRow}>
                  <IconButton icon="map-marker" size={20} style={styles.detailIcon} />
                  <Text style={styles.detailText}>{alert.hospitalAddress}</Text>
                </View>
              )}
              {alert.contactPerson && (
                <View style={styles.detailRow}>
                  <IconButton icon="account" size={20} style={styles.detailIcon} />
                  <Text style={styles.detailText}>{alert.contactPerson}</Text>
                </View>
              )}
              {alert.contactPhone && (
                <View style={styles.detailRow}>
                  <IconButton icon="phone" size={20} style={styles.detailIcon} />
                  <Text style={styles.detailText}>{alert.contactPhone}</Text>
                </View>
              )}
            </View>

            <Divider style={styles.divider} />

            {/* Alert Details */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Alert Details</Text>
              <View style={styles.detailRow}>
                <IconButton icon="water" size={20} style={styles.detailIcon} />
                <Text style={styles.detailText}>
                  {alert.unitsRequired || 1} unit{alert.unitsRequired !== 1 ? 's' : ''} required
                </Text>
              </View>
              <View style={styles.detailRow}>
                <IconButton icon="message-text" size={20} style={styles.detailIcon} />
                <Text style={styles.detailText}>
                  {alert.message || 'No additional message'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <IconButton icon="clock" size={20} style={styles.detailIcon} />
                <Text style={styles.detailText}>
                  Created: {new Date(alert.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Accepted Donors Section */}
        <Card style={styles.donorsCard}>
          <Card.Title
            title={`Accepted Donors (${acceptedDonors.length})`}
            titleStyle={{ fontWeight: 'bold' }}
            left={(props) => <List.Icon {...props} icon="account-check" />}
          />
          <Card.Content>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading donors...</Text>
              </View>
            ) : acceptedDonors.length === 0 ? (
              <View style={styles.emptyContainer}>
                <IconButton icon="account-off" size={48} iconColor="#ccc" />
                <Text style={styles.emptyText}>No donors have accepted yet</Text>
                <Text style={styles.emptySubtext}>
                  Donors who accept this alert will appear here
                </Text>
              </View>
            ) : (
              <FlatList
                data={acceptedDonors}
                renderItem={renderDonorItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            )}
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        {isActive && (
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={handleMarkComplete}
              style={[styles.actionButton, { backgroundColor: '#27ae60' }]}
              icon="check-circle"
            >
              Mark as Completed
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  alertCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  statusChip: {
    height: 28,
  },
  chipText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  bloodGroupChip: {
    alignSelf: 'flex-start',
  },
  urgencyChip: {
    alignSelf: 'flex-start',
  },
  detailSection: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  detailIcon: {
    margin: 0,
  },
  detailText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  donorsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  donorCard: {
    marginBottom: 8,
    elevation: 1,
  },
  donorActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eligibilityChip: {
    height: 24,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  actionButtons: {
    marginBottom: 32,
  },
  actionButton: {
    marginBottom: 12,
  },
});

export default AlertDetailScreen;

