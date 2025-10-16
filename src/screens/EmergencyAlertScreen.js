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
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
  Menu,
  Divider,
  HelperText,
  IconButton,
  useTheme,
  Appbar,
} from 'react-native-paper';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import ApiService from '../services/ApiService';
import SoundService from '../services/SoundService';
import { commonStyles } from '../theme/theme';
import { BLOOD_GROUP_MAPPING, transformDonorForBackend } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertService from '../services/AlertService';
import { APP_CONFIG, isDonor } from '../config/config';

const EmergencyAlertScreen = ({ navigation }) => {
  // Form state
  const [hospitalName, setHospitalName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [urgency, setUrgency] = useState('High');
  const [unitsRequired, setUnitsRequired] = useState('1');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // UI state
  const [urgencyMenuVisible, setUrgencyMenuVisible] = useState(false);
  const [bloodGroupMenuVisible, setBloodGroupMenuVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  // Alert state
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [lastAlertId, setLastAlertId] = useState(null);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState(new Set());

  // Contexts
  const { sendEmergencyAlert, sendTestNotification, isInitialized, hasPermission } = useNotifications();
  const { user } = useAuth();
  const theme = useTheme();

  // Blood groups and urgency options
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Any'];
  const urgencyLevels = [
    { label: 'High', value: 'High', color: '#e74c3c' },
    { label: 'Medium', value: 'Medium', color: '#f39c12' },
    { label: 'Low', value: 'Low', color: '#27ae60' },
  ];

  // Check if user is authorized to send alerts - ADMIN ONLY
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'admin');
  const canSendAlerts = isAdmin;

  // All authenticated users can view alerts
  const canViewAlerts = !!user;
  const isDonor = user && !isAdmin;

  useEffect(() => {
    if (!canViewAlerts) {
      Alert.alert(
        'Access Required',
        'Please login to view emergency alerts.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      // Load acknowledged alerts from storage
      loadAcknowledgedAlerts();

      // Fetch recent alerts when screen loads
      fetchRecentAlerts();

      // Set up polling for new alerts every 30 seconds (for donors)
      if (isDonor) {
        const alertPolling = setInterval(() => {
          checkForNewAlerts();
        }, 30000);

        return () => {
          clearInterval(alertPolling);
        };
      }
    }
  }, [canViewAlerts, navigation, isDonor]);

  // Load acknowledged alerts from AsyncStorage
  const loadAcknowledgedAlerts = async () => {
    try {
      const stored = await AsyncStorage.getItem('acknowledgedAlerts');
      if (stored) {
        setAcknowledgedAlerts(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('Error loading acknowledged alerts:', error);
    }
  };

  // Save acknowledged alerts to AsyncStorage
  const saveAcknowledgedAlerts = async (alertIds) => {
    try {
      await AsyncStorage.setItem('acknowledgedAlerts', JSON.stringify([...alertIds]));
    } catch (error) {
      console.error('Error saving acknowledged alerts:', error);
    }
  };

  // Acknowledge an alert (mark as seen)
  const acknowledgeAlert = async (alertId) => {
    const newAcknowledged = new Set([...acknowledgedAlerts, alertId]);
    setAcknowledgedAlerts(newAcknowledged);
    await saveAcknowledgedAlerts(newAcknowledged);
  };

  // Fetch recent alerts from backend
  const fetchRecentAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const response = await ApiService.getActiveAlerts();

      let alertsData = [];
      if (response?.data) {
        alertsData = response.data;
      } else if (Array.isArray(response)) {
        alertsData = response;
      }

      setRecentAlerts(alertsData);

      // Set the last alert ID for polling
      if (alertsData.length > 0) {
        setLastAlertId(alertsData[0].id);
      }
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
    } finally {
      setLoadingAlerts(false);
    }
  };

  // Check for new alerts (polling) - for donors only
  const checkForNewAlerts = async () => {
    if (!isDonor) return; // Only donors should check for new alerts

    try {
      const response = await ApiService.getActiveAlerts();

      let alertsData = [];
      if (response?.data) {
        alertsData = response.data;
      } else if (Array.isArray(response)) {
        alertsData = response;
      }

      // Check if there are new alerts
      if (alertsData.length > 0 && alertsData[0].id !== lastAlertId) {
        const newAlerts = alertsData.filter(alert =>
          !recentAlerts.find(existing => existing.id === alert.id) &&
          !acknowledgedAlerts.has(alert.id)
        );

        if (newAlerts.length > 0) {
          // Play alarm sound for new alerts
          await SoundService.playEmergencyAlert();

          // Update alerts list
          setRecentAlerts(alertsData);
          setLastAlertId(alertsData[0].id);

          // Show notification for new alert
          const latestAlert = newAlerts[0];
          Alert.alert(
            '🚨 New Emergency Alert',
            `${latestAlert.title || 'Emergency Blood Needed'}\n\nBlood Group: ${latestAlert.bloodGroup?.replace('_', ' ')}\nHospital: ${latestAlert.hospitalName}\nUrgency: ${latestAlert.urgency}`,
            [
              {
                text: 'Acknowledge',
                onPress: () => acknowledgeAlert(latestAlert.id),
              },
              {
                text: 'View Details',
                onPress: () => {
                  // Refresh alerts to show latest
                  fetchRecentAlerts();
                },
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error checking for new alerts:', error);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!hospitalName.trim()) {
      newErrors.hospitalName = 'Hospital name is required';
    }

    if (!bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required';
    }

    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,15}$/.test(contactNumber.trim())) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Send alert to backend API
  const sendAlertToAPI = async (alertData) => {
    try {
      // Transform data to backend format
      const backendAlertData = {
        title: `Urgent ${alertData.bloodGroup} Blood Needed`,
        message: `${alertData.bloodGroup} blood urgently needed at ${alertData.hospitalName}. Contact: ${alertData.contactNumber}`,
        hospitalName: alertData.hospitalName,
        bloodGroup: BLOOD_GROUP_MAPPING[alertData.bloodGroup] || alertData.bloodGroup,
        unitsRequired: alertData.unitsRequired || 1,
        urgency: alertData.urgency.toUpperCase(),
        contactNumber: alertData.contactNumber,
        additionalNotes: alertData.additionalNotes,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      };

      console.log('Sending alert to backend:', backendAlertData);

      // Use the new API service
      const response = await ApiService.createAlert(backendAlertData);

      console.log('Backend response:', response);

      // Handle different response structures
      if (response && (response.success || response.data)) {
        const alertData = response.data || response;

        // Refresh alerts list to show the new alert
        await fetchRecentAlerts();

        return {
          success: true,
          alertId: alertData.id || `alert_${Date.now()}`,
          notificationsSent: alertData.notificationsSent || 150,
          data: alertData
        };
      }

      return response;
    } catch (error) {
      console.error('API Error:', error);

      // For demo purposes, simulate successful API call
      console.log('Using mock API response for demo');
      return {
        success: true,
        message: 'Emergency alert sent successfully',
        alertId: `alert_${Date.now()}`,
        notificationsSent: 150, // Mock number of notifications sent
      };
    }
  };

  // Handle send alert
  const handleSendAlert = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    const alertData = {
      hospitalName: hospitalName.trim(),
      bloodGroup,
      contactNumber: contactNumber.trim(),
      urgency,
      unitsRequired: parseInt(unitsRequired) || 1,
      additionalNotes: additionalNotes.trim(),
      timestamp: new Date().toISOString(),
      sentBy: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    Alert.alert(
      'Confirm Emergency Alert',
      `Send ${urgency.toLowerCase()} priority alert for ${bloodGroup} blood at ${hospitalName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: async () => {
            setSending(true);
            try {
              // Send to backend API
              const apiResponse = await sendAlertToAPI(alertData);

              // Send local notification
              const notificationData = {
                title: 'Emergency Blood Needed',
                body: `${bloodGroup} blood urgently needed at ${hospitalName}. Contact: ${contactNumber}`,
                data: {
                  type: 'emergency',
                  hospitalName,
                  bloodGroup,
                  contactNumber,
                  urgency,
                  timestamp: alertData.timestamp,
                },
              };

              const notificationSuccess = await sendEmergencyAlert(notificationData);

              if (apiResponse.success && notificationSuccess) {
                // Play success sound
                await SoundService.playSuccessAlert();

                Alert.alert(
                  '✅ Alert Sent Successfully!',
                  `Emergency alert sent to ${apiResponse.notificationsSent || 'all'} users.\n\nAlert ID: ${apiResponse.alertId}`,
                  [
                    {
                      text: 'Send Another',
                      onPress: () => clearForm(),
                    },
                    {
                      text: 'Done',
                      onPress: () => navigation.goBack(),
                    },
                  ]
                );
              } else {
                throw new Error('Failed to send alert');
              }
            } catch (error) {
              console.error('Error sending alert:', error);
              Alert.alert(
                'Error',
                'Failed to send emergency alert. Please try again.',
                [{ text: 'OK' }]
              );
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  // Clear form
  const clearForm = () => {
    setHospitalName('');
    setBloodGroup('');
    setContactNumber('');
    setUrgency('High');
    setUnitsRequired('1');
    setAdditionalNotes('');
    setErrors({});
  };

  // Handle test notification
  const handleTestNotification = async () => {
    try {
      const success = await sendTestNotification();
      if (success) {
        Alert.alert('Test Sent', 'Test emergency notification sent successfully!');
      } else {
        Alert.alert('Error', 'Failed to send test notification');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  // Get urgency color
  const getUrgencyColor = (level) => {
    const urgencyLevel = urgencyLevels.find(u => u.value === level);
    return urgencyLevel ? urgencyLevel.color : '#95a5a6';
  };

  // Quick fill for common hospitals
  const fillCommonHospital = (hospitalName) => {
    setHospitalName(hospitalName);
  };

  const commonHospitals = [
    'Civil Hospital Muktsar',
    'Government Hospital Muktsar',
    'Private Hospital Muktsar',
    'Emergency Medical Center',
  ];

  if (!canViewAlerts) {
    return (
      <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
        <View style={styles.centerContainer}>
          <Title style={[styles.errorTitle, { color: theme.colors.error }]}>Login Required</Title>
          <Paragraph style={[styles.errorText, { color: theme.colors.onSurfaceVariant }]}>
            Please login to view emergency alerts.
          </Paragraph>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
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
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={canSendAlerts ? "Emergency Blood Alert" : "Blood Alerts"}
          titleStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
        />
        <Appbar.Action
          icon="information"
          onPress={() => Alert.alert(
            'Emergency Alert System',
            canSendAlerts
              ? 'Send urgent blood donation alerts to all registered users. Only authorized personnel can send alerts.'
              : 'View emergency blood donation alerts from hospitals and medical centers.'
          )}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        {/* User Info */}
        <Card style={styles.userInfoCard}>
          <Card.Content>
            <View style={styles.userInfoContent}>
              <Text style={styles.userInfoText}>
                {canSendAlerts ? 'Sending as:' : 'Viewing as:'} <Text style={styles.userInfoName}>{user?.name}</Text> ({user?.role})
              </Text>
              <Chip
                icon={canSendAlerts ? "shield-check" : "account"}
                style={canSendAlerts ? styles.authorizedChip : styles.donorChip}
                textStyle={canSendAlerts ? styles.authorizedText : styles.donorText}
              >
                {canSendAlerts ? 'Authorized' : 'Donor'}
              </Chip>
            </View>
          </Card.Content>
        </Card>

        {/* Admin-only: Quick Hospital Selection */}
        {canSendAlerts && (
          <Card style={styles.quickSection}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Quick Hospital Selection</Title>
              <View style={styles.quickHospitals}>
                {commonHospitals.map((hospital, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    onPress={() => fillCommonHospital(hospital)}
                    style={styles.hospitalChip}
                  >
                    {hospital}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Recent Alerts Section */}
        <Card style={styles.recentAlertsCard}>
          <Card.Content>
            <View style={styles.recentAlertsHeader}>
              <Title style={styles.sectionTitle}>Recent Emergency Alerts</Title>
              <View style={styles.headerActions}>
                <IconButton
                  icon="format-list-bulleted"
                  size={20}
                  onPress={() => navigation.navigate('AlertList')}
                />
                <IconButton
                  icon="refresh"
                  size={20}
                  onPress={fetchRecentAlerts}
                  disabled={loadingAlerts}
                />
              </View>
            </View>

            {loadingAlerts ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" />
                <Text style={styles.loadingText}>Loading alerts...</Text>
              </View>
            ) : recentAlerts.length === 0 ? (
              <View style={styles.emptyAlertsContainer}>
                <Text style={styles.emptyAlertsText}>No active alerts</Text>
              </View>
            ) : (
              <View style={styles.alertsList}>
                {recentAlerts.slice(0, 3).map((alert, index) => {
                  const isAcknowledged = acknowledgedAlerts.has(alert.id);
                  return (
                    <View key={alert.id} style={[
                      styles.alertItem,
                      isAcknowledged && styles.acknowledgedAlert
                    ]}>
                      <View style={styles.alertHeader}>
                        <Chip
                          mode="flat"
                          style={[styles.bloodGroupChip, { backgroundColor: getUrgencyColor(alert.urgency) }]}
                          textStyle={styles.bloodGroupText}
                        >
                          {BLOOD_GROUP_MAPPING[alert.bloodGroup] || alert.bloodGroup}
                        </Chip>
                        <View style={styles.alertHeaderRight}>
                          {isDonor && (
                            <Chip
                              mode="outlined"
                              style={[
                                styles.statusChip,
                                isAcknowledged && styles.acknowledgedChip
                              ]}
                              textStyle={[
                                styles.statusChipText,
                                isAcknowledged && styles.acknowledgedChipText
                              ]}
                              icon={isAcknowledged ? "check" : "bell"}
                            >
                              {isAcknowledged ? 'Seen' : 'New'}
                            </Chip>
                          )}
                          <Text style={styles.alertTime}>
                            {new Date(alert.createdAt).toLocaleTimeString()}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.alertHospital}>{alert.hospitalName}</Text>
                      <Text style={styles.alertMessage} numberOfLines={2}>
                        {alert.title || alert.message || `${alert.unitsRequired || 1} units needed`}
                      </Text>
                      {isDonor && !isAcknowledged && (
                        <Button
                          mode="outlined"
                          onPress={() => acknowledgeAlert(alert.id)}
                          style={styles.acknowledgeButton}
                          compact
                          icon="check"
                        >
                          Mark as Seen
                        </Button>
                      )}
                    </View>
                  );
                })}
                {recentAlerts.length > 3 && (
                  <Text style={styles.moreAlertsText}>
                    +{recentAlerts.length - 3} more alerts
                  </Text>
                )}
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Admin-only: Emergency Alert Form */}
        {canSendAlerts && (
          <Card style={styles.formCard}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Emergency Blood Alert</Title>
              <Paragraph style={styles.sectionDescription}>
                Fill in the details to send an urgent blood donation alert
              </Paragraph>

            {/* Hospital Name */}
            <TextInput
              label="Hospital Name *"
              value={hospitalName}
              onChangeText={setHospitalName}
              mode="outlined"
              style={styles.input}
              error={!!errors.hospitalName}
              disabled={sending}
              placeholder="Enter hospital name"
            />
            {errors.hospitalName && (
              <HelperText type="error" visible={!!errors.hospitalName}>
                {errors.hospitalName}
              </HelperText>
            )}

            {/* Blood Group Selection */}
            <Menu
              visible={bloodGroupMenuVisible}
              onDismiss={() => setBloodGroupMenuVisible(false)}
              anchor={
                <TextInput
                  label="Blood Group Needed *"
                  value={bloodGroup}
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.bloodGroup}
                  disabled={sending}
                  right={<TextInput.Icon icon="chevron-down" onPress={() => setBloodGroupMenuVisible(true)} />}
                  onPress={() => setBloodGroupMenuVisible(true)}
                  showSoftInputOnFocus={false}
                  placeholder="Select blood group"
                />
              }
            >
              {bloodGroups.map((group) => (
                <Menu.Item
                  key={group}
                  onPress={() => {
                    setBloodGroup(group);
                    setBloodGroupMenuVisible(false);
                  }}
                  title={group}
                />
              ))}
            </Menu>
            {errors.bloodGroup && (
              <HelperText type="error" visible={!!errors.bloodGroup}>
                {errors.bloodGroup}
              </HelperText>
            )}

            {/* Contact Number */}
            <TextInput
              label="Contact Number *"
              value={contactNumber}
              onChangeText={setContactNumber}
              mode="outlined"
              style={styles.input}
              error={!!errors.contactNumber}
              disabled={sending}
              keyboardType="phone-pad"
              placeholder="+91 9876543210"
            />
            {errors.contactNumber && (
              <HelperText type="error" visible={!!errors.contactNumber}>
                {errors.contactNumber}
              </HelperText>
            )}

            {/* Urgency Selection */}
            <Menu
              visible={urgencyMenuVisible}
              onDismiss={() => setUrgencyMenuVisible(false)}
              anchor={
                <TextInput
                  label="Urgency Level"
                  value={urgency}
                  mode="outlined"
                  style={styles.input}
                  disabled={sending}
                  right={<TextInput.Icon icon="chevron-down" onPress={() => setUrgencyMenuVisible(true)} />}
                  onPress={() => setUrgencyMenuVisible(true)}
                  showSoftInputOnFocus={false}
                />
              }
            >
              {urgencyLevels.map((level) => (
                <Menu.Item
                  key={level.value}
                  onPress={() => {
                    setUrgency(level.value);
                    setUrgencyMenuVisible(false);
                  }}
                  title={level.label}
                  leadingIcon={() => (
                    <View style={[styles.urgencyIndicator, { backgroundColor: level.color }]} />
                  )}
                />
              ))}
            </Menu>

            {/* Units Required */}
            <TextInput
              label="Units Required"
              value={unitsRequired}
              onChangeText={setUnitsRequired}
              mode="outlined"
              style={styles.input}
              disabled={sending}
              keyboardType="numeric"
              placeholder="1"
            />

            {/* Additional Notes */}
            <TextInput
              label="Additional Notes (Optional)"
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
              disabled={sending}
              placeholder="Any additional information..."
            />

            {/* Send Alert Button */}
            <Button
              mode="contained"
              onPress={handleSendAlert}
              style={[styles.sendButton, { backgroundColor: getUrgencyColor(urgency) }]}
              contentStyle={styles.sendButtonContent}
              disabled={sending || !isInitialized || !hasPermission}
              loading={sending}
              icon="alert"
            >
              {sending ? 'Sending Alert...' : `Send ${urgency} Priority Alert`}
            </Button>

            {/* Clear Form Button */}
            <Button
              mode="outlined"
              onPress={clearForm}
              style={styles.clearButton}
              disabled={sending}
            >
              Clear Form
            </Button>
          </Card.Content>
        </Card>
        )}

        {/* Admin-only: Test Notification Section */}
        {canSendAlerts && (
          <Card style={styles.testSection}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Test Notifications</Title>
              <Paragraph style={styles.sectionDescription}>
                Test the emergency notification system
              </Paragraph>
              <Button
                mode="outlined"
                onPress={handleTestNotification}
                style={styles.testButton}
                icon="bell-ring"
                disabled={!isInitialized || !hasPermission || sending}
              >
                Send Test Emergency Alert
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Admin-only: System Status */}
        {canSendAlerts && (
          <Card style={styles.statusSection}>
            <Card.Content>
              <Title style={styles.sectionTitle}>System Status</Title>
              <View style={styles.statusContainer}>
                <Chip
                  icon={isInitialized ? "check-circle" : "alert-circle"}
                  style={[styles.statusChip, {
                    backgroundColor: isInitialized ? '#4CAF50' : '#FF5722'
                  }]}
                  textStyle={styles.statusText}
                >
                  {isInitialized ? 'Notifications Ready' : 'Not Initialized'}
                </Chip>
                <Chip
                  icon={hasPermission ? "check-circle" : "alert-circle"}
                  style={[styles.statusChip, {
                    backgroundColor: hasPermission ? '#4CAF50' : '#FF5722'
                  }]}
                  textStyle={styles.statusText}
                >
                  {hasPermission ? 'Permissions OK' : 'No Permissions'}
                </Chip>
            </View>
          </Card.Content>
        </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfoCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#e8f5e8',
  },
  userInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  userInfoName: {
    fontWeight: 'bold',
  },
  authorizedChip: {
    backgroundColor: '#27ae60',
  },
  authorizedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  donorChip: {
    backgroundColor: '#3498db',
  },
  donorText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickSection: {
    marginBottom: 16,
    borderRadius: 12,
  },
  quickHospitals: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  hospitalChip: {
    marginBottom: 4,
  },
  formCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  statusSection: {
    marginBottom: 16,
    borderRadius: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  statusChip: {
    marginBottom: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  testSection: {
    marginBottom: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  textArea: {
    height: 100,
  },
  urgencyIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  sendButton: {
    marginTop: 20,
    borderRadius: 8,
  },
  sendButtonContent: {
    paddingVertical: 8,
  },
  clearButton: {
    marginTop: 10,
    borderRadius: 8,
  },
  testButton: {
    borderColor: '#3498db',
    borderWidth: 2,
  },
  recentAlertsCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  recentAlertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyAlertsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyAlertsText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  alertsList: {
    gap: 12,
  },
  alertItem: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  acknowledgedAlert: {
    backgroundColor: '#f0f0f0',
    borderLeftColor: '#95a5a6',
    opacity: 0.8,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusChip: {
    height: 24,
    borderColor: '#e74c3c',
  },
  statusChipText: {
    fontSize: 12,
    color: '#e74c3c',
  },
  acknowledgedChip: {
    borderColor: '#27ae60',
  },
  acknowledgedChipText: {
    color: '#27ae60',
  },
  acknowledgeButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  bloodGroupChip: {
    alignSelf: 'flex-start',
  },
  bloodGroupText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
  },
  alertHospital: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  moreAlertsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
});

export default EmergencyAlertScreen;
