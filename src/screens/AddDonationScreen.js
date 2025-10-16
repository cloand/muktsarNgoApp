import React, { useState } from 'react';
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
  HelperText,
  useTheme,
  Appbar,
  Chip,
} from 'react-native-paper';
import { commonStyles } from '../theme/theme';
import ApiService from '../services/ApiService';
import { transformDonorForBackend } from '../utils/constants';

const AddDonationScreen = ({ navigation }) => {
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const theme = useTheme();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  const validateForm = () => {
    const newErrors = {};

    if (!donorName.trim()) newErrors.donorName = 'Donor name is required';
    if (!donorEmail.trim()) newErrors.donorEmail = 'Email is required';
    if (!donorPhone.trim()) newErrors.donorPhone = 'Phone number is required';
    if (!bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!gender) newErrors.gender = 'Gender is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (donorEmail && !emailRegex.test(donorEmail)) {
      newErrors.donorEmail = 'Please enter a valid email';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
    if (donorPhone && !phoneRegex.test(donorPhone)) {
      newErrors.donorPhone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Prepare donor data
      const donorData = {
        name: donorName.trim(),
        email: donorEmail.trim(),
        phone: donorPhone.trim(),
        bloodGroup,
        gender,
        dateOfBirth,
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        emergencyContact: emergencyContact.trim(),
        lastDonationDate: lastDonationDate || null,
      };

      // Transform data for backend
      const transformedData = transformDonorForBackend(donorData);

      // Call API to create donor
      const response = await ApiService.createDonor(transformedData);

      console.log('Donor created successfully:', response);

      Alert.alert(
        'Success',
        'Donor information recorded successfully!',
        [
          {
            text: 'Add Another',
            onPress: () => {
              setDonorName('');
              setDonorEmail('');
              setDonorPhone('');
              setBloodGroup('');
              setLastDonationDate('');
              setGender('');
              setDateOfBirth('');
              setAddress('');
              setCity('');
              setState('');
              setPincode('');
              setEmergencyContact('');
              setErrors({});
            },
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error creating donor:', error);
      Alert.alert('Error', 'Failed to record donor information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Add Donor"
          titleStyle={{ color: theme.colors.primary, fontWeight: 'bold' }}
        />
      </Appbar.Header>

      <ScrollView style={[commonStyles.content, styles.content]}>
        <Card style={[commonStyles.card, styles.formCard]}>
          <Card.Content style={commonStyles.cardContent}>
            <Title style={[styles.formTitle, { color: theme.colors.primary }]}>Donor Information</Title>
            <Paragraph style={[styles.formSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Enter donor details for blood donation registration
            </Paragraph>

            {/* Donor Name */}
            <TextInput
              label="Donor Name *"
              value={donorName}
              onChangeText={setDonorName}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              error={!!errors.donorName}
              disabled={loading}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            {errors.donorName && (
              <HelperText type="error" visible={!!errors.donorName}>
                {errors.donorName}
              </HelperText>
            )}

            {/* Email */}
            <TextInput
              label="Email Address *"
              value={donorEmail}
              onChangeText={setDonorEmail}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              error={!!errors.donorEmail}
              disabled={loading}
              keyboardType="email-address"
              autoCapitalize="none"
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            {errors.donorEmail && (
              <HelperText type="error" visible={!!errors.donorEmail}>
                {errors.donorEmail}
              </HelperText>
            )}

            {/* Phone Number */}
            <TextInput
              label="Phone Number *"
              value={donorPhone}
              onChangeText={setDonorPhone}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              error={!!errors.donorPhone}
              disabled={loading}
              keyboardType="phone-pad"
              placeholder="+91 9876543210"
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            {errors.donorPhone && (
              <HelperText type="error" visible={!!errors.donorPhone}>
                {errors.donorPhone}
              </HelperText>
            )}

            {/* Blood Group Selection */}
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>Blood Group *</Text>
            <View style={styles.chipContainer}>
              {bloodGroups.map((group) => (
                <Chip
                  key={group}
                  mode={bloodGroup === group ? 'flat' : 'outlined'}
                  selected={bloodGroup === group}
                  onPress={() => setBloodGroup(group)}
                  style={[
                    styles.chip,
                    bloodGroup === group && { backgroundColor: theme.colors.primary }
                  ]}
                  textStyle={bloodGroup === group ? { color: 'white' } : { color: theme.colors.primary }}
                >
                  {group}
                </Chip>
              ))}
            </View>
            {errors.bloodGroup && (
              <HelperText type="error" visible={!!errors.bloodGroup}>
                {errors.bloodGroup}
              </HelperText>
            )}

            {/* Gender Selection */}
            <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>Gender *</Text>
            <View style={styles.chipContainer}>
              {genders.map((genderOption) => (
                <Chip
                  key={genderOption}
                  mode={gender === genderOption ? 'flat' : 'outlined'}
                  selected={gender === genderOption}
                  onPress={() => setGender(genderOption)}
                  style={[
                    styles.chip,
                    gender === genderOption && { backgroundColor: theme.colors.primary }
                  ]}
                  textStyle={gender === genderOption ? { color: 'white' } : { color: theme.colors.primary }}
                >
                  {genderOption}
                </Chip>
              ))}
            </View>
            {errors.gender && (
              <HelperText type="error" visible={!!errors.gender}>
                {errors.gender}
              </HelperText>
            )}

            {/* Last Donation Date */}
            <TextInput
              label="Last Donation Date (Optional)"
              value={lastDonationDate}
              onChangeText={setLastDonationDate}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              disabled={loading}
              placeholder="YYYY-MM-DD"
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            <HelperText type="info">
              Leave empty if this is the first donation
            </HelperText>

            {/* Date of Birth */}
            <TextInput
              label="Date of Birth *"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              error={!!errors.dateOfBirth}
              disabled={loading}
              placeholder="YYYY-MM-DD"
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            {errors.dateOfBirth && (
              <HelperText type="error" visible={!!errors.dateOfBirth}>
                {errors.dateOfBirth}
              </HelperText>
            )}

            {/* Address */}
            <TextInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              disabled={loading}
              multiline
              numberOfLines={2}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />

            {/* City */}
            <TextInput
              label="City *"
              value={city}
              onChangeText={setCity}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              error={!!errors.city}
              disabled={loading}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            {errors.city && (
              <HelperText type="error" visible={!!errors.city}>
                {errors.city}
              </HelperText>
            )}

            {/* State */}
            <TextInput
              label="State *"
              value={state}
              onChangeText={setState}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              error={!!errors.state}
              disabled={loading}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />
            {errors.state && (
              <HelperText type="error" visible={!!errors.state}>
                {errors.state}
              </HelperText>
            )}

            {/* Pincode */}
            <TextInput
              label="Pincode"
              value={pincode}
              onChangeText={setPincode}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              disabled={loading}
              keyboardType="numeric"
              maxLength={6}
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />

            {/* Emergency Contact */}
            <TextInput
              label="Emergency Contact"
              value={emergencyContact}
              onChangeText={setEmergencyContact}
              mode="outlined"
              style={[commonStyles.textInput, styles.input]}
              disabled={loading}
              keyboardType="phone-pad"
              placeholder="+91 9876543210"
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={[commonStyles.primaryButton, styles.submitButton]}
              contentStyle={commonStyles.buttonContent}
              disabled={loading}
              loading={loading}
              buttonColor={theme.colors.primary}
            >
              {loading ? 'Recording Donor...' : 'Record Donor Information'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24, // theme.spacing.lg
  },
  formCard: {
    marginBottom: 24, // theme.spacing.lg
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8, // theme.spacing.sm
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24, // theme.spacing.lg
  },
  input: {
    marginBottom: 8, // theme.spacing.sm
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16, // theme.spacing.md
    marginBottom: 12, // theme.spacing.sm + 4
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, // theme.spacing.sm
    marginBottom: 8, // theme.spacing.sm
  },
  chip: {
    marginBottom: 8, // theme.spacing.sm
  },
  submitButton: {
    marginTop: 32, // theme.spacing.xl
  },
});

export default AddDonationScreen;
