import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import {
  Card,
  Chip,
  ActivityIndicator,
  Text,
  Button,
  Searchbar,
  FAB,
  useTheme,
  Appbar,
} from 'react-native-paper';
import ApiService from '../services/ApiService';
import {
  checkEligibility,
  getEligibilityColor,
  getEligibilityIcon,
  formatNextEligibleDate,
  transformDonorFromBackend
} from '../utils/constants';
import { commonStyles } from '../theme/theme';

const DonorListScreen = ({ navigation }) => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [error, setError] = useState(null);

  // Fetch donors from API
  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the new API service
      const response = await ApiService.getDonors();
      console.log(response.data,'dnkdld')
      // Handle different response structures and transform data
      let donorData = [];
      if (Array.isArray(response)) {
        donorData = response.map(donor => transformDonorFromBackend(donor));
      } else if (response.data && Array.isArray(response.data)) {
        donorData = response.data.map(donor => transformDonorFromBackend(donor));
      } else if (response.donors && Array.isArray(response.donors)) {
        donorData = response.donors.map(donor => transformDonorFromBackend(donor));
      }

      setDonors(donorData);
      setFilteredDonors(donorData);
    } catch (error) {
      console.error('Error fetching donors:', error);
      setError(error.message || 'Failed to fetch donors');

      // For demo purposes, use mock data when API fails
      const mockDonors = [
        {
          id: '1',
          name: 'John Doe',
          bloodGroup: 'O+',
          lastDonationDate: '2024-12-01', // Recent donation - should be unavailable
          gender: 'male',
          phone: '+91 9876543210',
          email: 'john@example.com',
          age: 28,
          weight: 70,
        },
        {
          id: '2',
          name: 'Jane Smith',
          bloodGroup: 'A+',
          lastDonationDate: '2024-08-15', // Old donation - should be available
          gender: 'female',
          phone: '+91 9876543211',
          email: 'jane@example.com',
          age: 32,
          weight: 55,
        },
        {
          id: '3',
          name: 'Rajesh Kumar',
          bloodGroup: 'B+',
          lastDonationDate: '2024-11-20', // Recent donation - should be unavailable
          gender: 'male',
          phone: '+91 9876543212',
          email: 'rajesh@example.com',
          age: 35,
          weight: 75,
        },
        {
          id: '4',
          name: 'Priya Sharma',
          bloodGroup: 'AB+',
          lastDonationDate: '2024-07-10', // Old donation - should be available
          gender: 'female',
          phone: '+91 9876543213',
          email: 'priya@example.com',
          age: 29,
          weight: 52,
        },
        {
          id: '5',
          name: 'Amit Singh',
          bloodGroup: 'O-',
          lastDonationDate: null, // No previous donation - should be available
          gender: 'male',
          phone: '+91 9876543214',
          email: 'amit@example.com',
          age: 25,
          weight: 68,
        },
      ];
      setDonors(mockDonors);
      setFilteredDonors(mockDonors);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDonors();
  }, []);

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchDonors();
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDonors(donors);
    } else {
      const filtered = donors.filter(donor => {
        const eligibility = getDonorEligibility(donor);
        return (
          donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          donor.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
          eligibility.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (donor.phone && donor.phone.includes(searchQuery)) ||
          (donor.email && donor.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (donor.gender && donor.gender.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      });
      setFilteredDonors(filtered);
    }
  }, [searchQuery, donors]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check donor eligibility and get status
  const getDonorEligibility = (donor) => {
    const eligibility = checkEligibility(donor.lastDonationDate, donor.gender);
    return {
      ...eligibility,
      color: getEligibilityColor(eligibility.isEligible),
      icon: getEligibilityIcon(eligibility.isEligible),
    };
  };

  // Render donor card
  const renderDonorItem = ({ item }) => {
    const eligibility = getDonorEligibility(item);

    return (
      <Card style={[commonStyles.card, styles.donorCard, { backgroundColor: theme.colors.surface }]} elevation={2}>
        <Card.Content style={commonStyles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.donorName, { color: theme.colors.onSurface }]}>{item.name}</Text>
            <View style={styles.statusContainer}>
              <Chip
                mode="flat"
                style={[styles.statusChip, { backgroundColor: eligibility.color }]}
                textStyle={styles.statusText}
                icon={eligibility.icon}
              >
                {eligibility.status}
              </Chip>
              {!eligibility.isEligible && (
                <View style={styles.unavailableBadge}>
                  <Text style={styles.unavailableText}>
                    {eligibility.daysUntilEligible}d left
                  </Text>
                </View>
              )}
            </View>
          </View>

        <View style={styles.donorInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Blood Group:</Text>
            <Chip mode="outlined" compact style={styles.bloodGroupChip}>
              {item.bloodGroup}
            </Chip>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Last Donation:</Text>
            <Text style={styles.value}>{formatDate(item.lastDonationDate)}</Text>
          </View>

          {item.phone && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{item.phone}</Text>
            </View>
          )}

          {item.email && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{item.email}</Text>
            </View>
          )}

          {/* Eligibility Information */}
          {!eligibility.isEligible && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Available in:</Text>
              <Text style={[styles.value, styles.unavailableValue]}>
                {eligibility.daysUntilEligible} days
              </Text>
            </View>
          )}

          {eligibility.nextEligibleDate && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Next eligible:</Text>
              <Text style={styles.value}>
                {formatNextEligibleDate(eligibility.nextEligibleDate)}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>

      <Card.Actions>
        <Button
          mode="outlined"
          compact
          disabled={!eligibility.isEligible}
          onPress={() => {
            // Handle contact donor action
            Alert.alert('Contact Donor', `Contact ${item.name}?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Call', onPress: () => console.log('Call donor') },
              { text: 'Message', onPress: () => console.log('Message donor') },
            ]);
          }}
        >
          Contact
        </Button>
        <Button
          mode="text"
          compact
          onPress={() => {
            // Navigate to donor details screen
            navigation.navigate('DonorDetails', { donorId: item.id });
          }}
        >
          Details
        </Button>
      </Card.Actions>
    </Card>
    );
  };

  // Render loading state
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>Loading donors...</Text>
    </View>
  );

  // Render error state
  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>Failed to load donors</Text>
      <Text style={styles.errorSubtext}>{error}</Text>
      <Button mode="contained" onPress={fetchDonors} style={styles.retryButton}>
        Retry
      </Button>
    </View>
  );

  // Render empty state
  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.emptyText}>No donors found</Text>
      <Text style={styles.emptySubtext}>
        {searchQuery ? 'Try adjusting your search' : 'Add some donors to get started'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={`Donor List (${filteredDonors.length})`}
          titleStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
        />
      </Appbar.Header>

      {/* Search Bar */}
      <View style={[styles.searchContainer, commonStyles.paddingHorizontal.md]}>
        <Searchbar
          placeholder="Search donors..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          iconColor={theme.colors.primary}
        />
      </View>

      {/* Content */}
      {loading ? (
        renderLoading()
      ) : error && donors.length === 0 ? (
        renderError()
      ) : filteredDonors.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={filteredDonors}
          renderItem={renderDonorItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2196F3']}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          // Navigate to add donor screen
          navigation.navigate('AddDonation');
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  donorCard: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  donorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unavailableBadge: {
    backgroundColor: '#FF5722',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  unavailableText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  unavailableValue: {
    color: '#FF5722',
    fontWeight: 'bold',
  },
  donorInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 2,
    textAlign: 'right',
  },
  bloodGroupChip: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
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
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    marginTop: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  separator: {
    height: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196f3',
  },
});

export default DonorListScreen;
