import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  HelperText,
  useTheme,
  Avatar,
  SegmentedButtons,
} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { commonStyles } from '../theme/theme';
import { APP_CONFIG } from '../config/config';
import { BLOOD_GROUPS, GENDERS } from '../utils/constants';

const DonorRegistrationScreen = ({ navigation }) => {
  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    bloodGroup: 'O_POSITIVE',
    gender: 'MALE',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContact: '',
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Get auth context and theme
  const { registerDonor, loading, error, clearError } = useAuth();
  const theme = useTheme();

  // Update form data
  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) {
      clearError();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email == '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle registration
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Prepare registration data - exclude confirmPassword
      const { confirmPassword, ...registrationData } = formData;
      const finalData = {
        ...registrationData,
        name: `${formData.firstName} ${formData.lastName}`.trim()
      };

      const response = await registerDonor(finalData);
      
      if (response.user) {
        Alert.alert(
          'Registration Successful',
          `Welcome to MuktsarNGO, ${response.user.firstName}! You can now receive emergency blood donation alerts.`,
          [
            {
              text: 'Continue',
              onPress: () => navigation.replace('Home'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Registration error details:', error);
      
      // Extract validation errors from Axios error response
      let errorMessage = 'Failed to register. Please try again.';
      
      if (error.response?.data?.message) {
        // NestJS validation errors
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join('\n');
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(
        'Registration Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={[commonStyles.safeArea, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[commonStyles.content, styles.content]}>
          {/* Header */}
          <View style={styles.header}>
            <Avatar.Icon
              size={80}
              icon="account-plus"
              style={[styles.logo, { backgroundColor: theme.colors.primary }]}
            />
            <Title style={[styles.appName, { color: theme.colors.primary }]}>Donor Registration</Title>
            <Text style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>Join MuktsarNGO Blood Donation</Text>
          </View>

          <Card style={[commonStyles.card, styles.card]}>
            <Card.Content style={commonStyles.cardContent}>
              <Title style={[styles.title, { color: theme.colors.onSurface }]}>Create Your Account</Title>

              <View style={styles.form}>
                {/* Email */}
                <TextInput
                  label="Email *"
                  value={formData.email}
                  onChangeText={(value) => updateFormData('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  mode="outlined"
                  style={[commonStyles.textInput, styles.input]}
                  error={!!errors.email}
                  disabled={loading}
                />
                {errors.email && <HelperText type="error">{errors.email}</HelperText>}

                {/* Password */}
                <TextInput
                  label="Password *"
                  value={formData.password}
                  onChangeText={(value) => updateFormData('password', value)}
                  secureTextEntry
                  mode="outlined"
                  style={[commonStyles.textInput, styles.input]}
                  error={!!errors.password}
                  disabled={loading}
                />
                {errors.password && <HelperText type="error">{errors.password}</HelperText>}

                {/* Confirm Password */}
                <TextInput
                  label="Confirm Password *"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateFormData('confirmPassword', value)}
                  secureTextEntry
                  mode="outlined"
                  style={[commonStyles.textInput, styles.input]}
                  error={!!errors.confirmPassword}
                  disabled={loading}
                />
                {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword}</HelperText>}

                {/* Name */}
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <TextInput
                      label="First Name *"
                      value={formData.firstName}
                      onChangeText={(value) => updateFormData('firstName', value)}
                      mode="outlined"
                      style={[commonStyles.textInput, styles.input]}
                      error={!!errors.firstName}
                      disabled={loading}
                    />
                    {errors.firstName && <HelperText type="error">{errors.firstName}</HelperText>}
                  </View>
                  <View style={styles.halfWidth}>
                    <TextInput
                      label="Last Name *"
                      value={formData.lastName}
                      onChangeText={(value) => updateFormData('lastName', value)}
                      mode="outlined"
                      style={[commonStyles.textInput, styles.input]}
                      error={!!errors.lastName}
                      disabled={loading}
                    />
                    {errors.lastName && <HelperText type="error">{errors.lastName}</HelperText>}
                  </View>
                </View>

                {/* Phone */}
                <TextInput
                  label="Phone Number *"
                  value={formData.phone}
                  onChangeText={(value) => updateFormData('phone', value)}
                  keyboardType="phone-pad"
                  mode="outlined"
                  style={[commonStyles.textInput, styles.input]}
                  error={!!errors.phone}
                  disabled={loading}
                />
                {errors.phone && <HelperText type="error">{errors.phone}</HelperText>}

                {/* Blood Group */}
                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>Blood Group *</Text>
                <SegmentedButtons
                  value={formData.bloodGroup}
                  onValueChange={(value) => updateFormData('bloodGroup', value)}
                  buttons={BLOOD_GROUPS.map(bg => ({
                    value: bg.value,
                    label: bg.label,
                  }))}
                  style={styles.segmentedButtons}
                />

                {/* Gender */}
                <Text style={[styles.sectionLabel, { color: theme.colors.onSurface }]}>Gender *</Text>
                <SegmentedButtons
                  value={formData.gender}
                  onValueChange={(value) => updateFormData('gender', value)}
                  buttons={GENDERS.map(gender => ({
                    value: gender.value,
                    label: gender.label,
                  }))}
                  style={styles.segmentedButtons}
                />

                {/* Date of Birth */}
                <TextInput
                  label="Date of Birth (YYYY-MM-DD) *"
                  value={formData.dateOfBirth}
                  onChangeText={(value) => updateFormData('dateOfBirth', value)}
                  placeholder="1990-01-01"
                  mode="outlined"
                  style={[commonStyles.textInput, styles.input]}
                  error={!!errors.dateOfBirth}
                  disabled={loading}
                />
                {errors.dateOfBirth && <HelperText type="error">{errors.dateOfBirth}</HelperText>}

                {/* Address */}
                <TextInput
                  label="Address"
                  value={formData.address}
                  onChangeText={(value) => updateFormData('address', value)}
                  mode="outlined"
                  multiline
                  numberOfLines={2}
                  style={[commonStyles.textInput, styles.input]}
                  disabled={loading}
                />

                {/* City, State, Pincode */}
                <View style={styles.row}>
                  <View style={styles.halfWidth}>
                    <TextInput
                      label="City"
                      value={formData.city}
                      onChangeText={(value) => updateFormData('city', value)}
                      mode="outlined"
                      style={[commonStyles.textInput, styles.input]}
                      disabled={loading}
                    />
                  </View>
                  <View style={styles.halfWidth}>
                    <TextInput
                      label="State"
                      value={formData.state}
                      onChangeText={(value) => updateFormData('state', value)}
                      mode="outlined"
                      style={[commonStyles.textInput, styles.input]}
                      disabled={loading}
                    />
                  </View>
                </View>

                <TextInput
                  label="Pincode"
                  value={formData.pincode}
                  onChangeText={(value) => updateFormData('pincode', value)}
                  keyboardType="numeric"
                  mode="outlined"
                  style={[commonStyles.textInput, styles.input]}
                  disabled={loading}
                />

                {/* Emergency Contact */}
                <TextInput
                  label="Emergency Contact"
                  value={formData.emergencyContact}
                  onChangeText={(value) => updateFormData('emergencyContact', value)}
                  keyboardType="phone-pad"
                  mode="outlined"
                  style={[commonStyles.textInput, styles.input]}
                  disabled={loading}
                />

                {/* Global error message */}
                {error && (
                  <HelperText type="error" visible={!!error} style={styles.errorText}>
                    {error}
                  </HelperText>
                )}

                <Button
                  mode="contained"
                  onPress={handleRegister}
                  style={[commonStyles.primaryButton, styles.button]}
                  contentStyle={commonStyles.buttonContent}
                  disabled={loading}
                  loading={loading}
                  buttonColor={theme.colors.primary}
                >
                  {loading ? 'Registering...' : 'Register as Donor'}
                </Button>

                <Button
                  mode="text"
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                  textColor={theme.colors.primary}
                  disabled={loading}
                >
                  Back to Login
                </Button>
              </View>
            </Card.Content>
          </Card>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Optional: Adjust how items are distributed
    alignItems: 'flex-start'
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 24,
  },
  backButton: {
    marginTop: 16,
  },
});

export default DonorRegistrationScreen;


