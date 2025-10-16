// Blood group constants - now using centralized config
import { APP_CONFIG } from '../config/config';

// App constants
export const COLORS = {
  primary: '#3498db',
  secondary: '#2c3e50',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  light: '#f5f5f5',
  dark: '#2c3e50',
  white: '#ffffff',
  gray: '#7f8c8d',
};

export const SIZES = {
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

export const API_ENDPOINTS = {
  BASE_URL: 'https://your-backend-url.com',
  LOGIN: '/auth/login',
  DONORS: '/api/donors/',
  DONATIONS: '/api/donations/',
  ALERTS: '/api/alerts/',
  // Full URLs for direct access
  LOGIN_FULL: 'https://your-backend-url.com/api/login/',
  DONORS_FULL: 'https://your-backend-url.com/api/donors/',
  DONATIONS_FULL: 'https://your-backend-url.com/api/donations/',
  ALERTS_FULL: 'https://your-backend-url.com/api/alerts/',
  EMERGENCY_FULL: 'https://your-backend-url.com/api/emergency/',
};

// Donor eligibility constants
export const DONATION_ELIGIBILITY = {
  MINIMUM_DAYS_BETWEEN_DONATIONS: 90, // 90 days minimum gap
  MALE_MINIMUM_DAYS: 90,
  FEMALE_MINIMUM_DAYS: 120, // Females typically need longer gap
  MINIMUM_AGE: 18,
  MAXIMUM_AGE: 65,
  MINIMUM_WEIGHT: 50, // kg
};

// Helper function to check donor eligibility based on last donation date
export const checkEligibility = (lastDonationDate, gender = 'male') => {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      status: 'Available',
      reason: 'No previous donation recorded',
      daysUntilEligible: 0,
      daysSinceLastDonation: null,
    };
  }

  try {
    const lastDonation = new Date(lastDonationDate);
    const currentDate = new Date();

    // Calculate days since last donation
    const timeDifference = currentDate.getTime() - lastDonation.getTime();
    const daysSinceLastDonation = Math.floor(timeDifference / (1000 * 3600 * 24));

    // Determine minimum days based on gender
    const minimumDays = gender.toLowerCase() === 'female'
      ? DONATION_ELIGIBILITY.FEMALE_MINIMUM_DAYS
      : DONATION_ELIGIBILITY.MALE_MINIMUM_DAYS;

    const isEligible = daysSinceLastDonation >= minimumDays;
    const daysUntilEligible = isEligible ? 0 : minimumDays - daysSinceLastDonation;

    return {
      isEligible,
      status: isEligible ? 'Available' : 'Unavailable',
      reason: isEligible
        ? `Last donated ${daysSinceLastDonation} days ago`
        : `Must wait ${daysUntilEligible} more days`,
      daysUntilEligible,
      daysSinceLastDonation,
      nextEligibleDate: isEligible
        ? null
        : new Date(lastDonation.getTime() + (minimumDays * 24 * 60 * 60 * 1000)),
    };
  } catch (error) {
    console.error('Error checking eligibility:', error);
    return {
      isEligible: false,
      status: 'Unknown',
      reason: 'Invalid date format',
      daysUntilEligible: 0,
      daysSinceLastDonation: null,
    };
  }
};

// Helper function to get eligibility color
export const getEligibilityColor = (isEligible) => {
  return isEligible ? COLORS.success : COLORS.danger;
};

// Helper function to get eligibility icon
export const getEligibilityIcon = (isEligible) => {
  return isEligible ? 'check-circle' : 'clock-alert';
};

// Helper function to format next eligible date
export const formatNextEligibleDate = (nextEligibleDate) => {
  if (!nextEligibleDate) return null;

  return nextEligibleDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};


// Transform blood groups from config to display format
export const BLOOD_GROUPS = APP_CONFIG.UI_BLOOD_GROUPS.map(group => ({
  value: group.value,
  label: group.label
}));

// Transform genders from config to display format
export const GENDERS = APP_CONFIG.GENDERS.map(gender => ({
  value: gender,
  label: gender.charAt(0) + gender.slice(1).toLowerCase(),
}));

// Blood group mapping for backend compatibility
export const BLOOD_GROUP_MAPPING = {
  // Frontend to Backend
  'A+': 'A_POSITIVE',
  'A-': 'A_NEGATIVE',
  'B+': 'B_POSITIVE',
  'B-': 'B_NEGATIVE',
  'AB+': 'AB_POSITIVE',
  'AB-': 'AB_NEGATIVE',
  'O+': 'O_POSITIVE',
  'O-': 'O_NEGATIVE',
  // Backend to Frontend
  'A_POSITIVE': 'A+',
  'A_NEGATIVE': 'A-',
  'B_POSITIVE': 'B+',
  'B_NEGATIVE': 'B-',
  'AB_POSITIVE': 'AB+',
  'AB_NEGATIVE': 'AB-',
  'O_POSITIVE': 'O+',
  'O_NEGATIVE': 'O-',
};

// Gender mapping for backend compatibility
export const GENDER_MAPPING = {
  // Frontend to Backend
  'Male': 'MALE',
  'Female': 'FEMALE',
  'Other': 'OTHER',
  // Backend to Frontend
  'MALE': 'Male',
  'FEMALE': 'Female',
  'OTHER': 'Other',
};

// Helper functions for data transformation
export const transformDonorForBackend = (donorData) => {
  return {
    ...donorData,
    bloodGroup: BLOOD_GROUP_MAPPING[donorData.bloodGroup] || donorData.bloodGroup,
    gender: GENDER_MAPPING[donorData.gender] || donorData.gender,
    dateOfBirth: donorData.dateOfBirth ? new Date(donorData.dateOfBirth).toISOString() : null,
    lastDonationDate: donorData.lastDonationDate ? new Date(donorData.lastDonationDate).toISOString() : null,
  };
};

export const transformDonorFromBackend = (donorData) => {
  return {
    ...donorData,
    bloodGroup: BLOOD_GROUP_MAPPING[donorData.bloodGroup] || donorData.bloodGroup,
    gender: GENDER_MAPPING[donorData.gender] || donorData.gender,
    dateOfBirth: donorData.dateOfBirth ? new Date(donorData.dateOfBirth).toISOString().split('T')[0] : null,
    lastDonationDate: donorData.lastDonationDate ? new Date(donorData.lastDonationDate).toISOString().split('T')[0] : null,
  };
};

export default {
  COLORS,
  SIZES,
  API_ENDPOINTS,
  DONATION_ELIGIBILITY,
  BLOOD_GROUPS,
  BLOOD_GROUP_MAPPING,
  GENDER_MAPPING,
  checkEligibility,
  getEligibilityColor,
  getEligibilityIcon,
  formatNextEligibleDate,
  transformDonorForBackend,
  transformDonorFromBackend,
};

