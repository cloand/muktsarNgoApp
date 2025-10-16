/**
 * Blood Group Formatter Utility
 * Converts backend blood group format to user-friendly display format
 * Backend: A_POSITIVE, B_NEGATIVE, etc.
 * Display: A+, B-, etc.
 */

/**
 * Format blood group from backend format to display format
 * @param {string} bloodGroup - Blood group in backend format (e.g., "A_POSITIVE")
 * @returns {string} - Formatted blood group (e.g., "A+")
 */
export const formatBloodGroup = (bloodGroup) => {
  if (!bloodGroup) return '';
  
  const mapping = {
    'A_POSITIVE': 'A+',
    'A_NEGATIVE': 'A-',
    'B_POSITIVE': 'B+',
    'B_NEGATIVE': 'B-',
    'AB_POSITIVE': 'AB+',
    'AB_NEGATIVE': 'AB-',
    'O_POSITIVE': 'O+',
    'O_NEGATIVE': 'O-',
  };
  
  return mapping[bloodGroup] || bloodGroup;
};

/**
 * Convert display format back to backend format
 * @param {string} displayFormat - Blood group in display format (e.g., "A+")
 * @returns {string} - Backend format (e.g., "A_POSITIVE")
 */
export const toBackendFormat = (displayFormat) => {
  if (!displayFormat) return '';
  
  const mapping = {
    'A+': 'A_POSITIVE',
    'A-': 'A_NEGATIVE',
    'B+': 'B_POSITIVE',
    'B-': 'B_NEGATIVE',
    'AB+': 'AB_POSITIVE',
    'AB-': 'AB_NEGATIVE',
    'O+': 'O_POSITIVE',
    'O-': 'O_NEGATIVE',
  };
  
  return mapping[displayFormat] || displayFormat;
};

/**
 * Get all blood group options for pickers/dropdowns
 * @returns {Array} - Array of blood group options with label and value
 */
export const getBloodGroupOptions = () => {
  return [
    { label: 'A+', value: 'A_POSITIVE' },
    { label: 'A-', value: 'A_NEGATIVE' },
    { label: 'B+', value: 'B_POSITIVE' },
    { label: 'B-', value: 'B_NEGATIVE' },
    { label: 'AB+', value: 'AB_POSITIVE' },
    { label: 'AB-', value: 'AB_NEGATIVE' },
    { label: 'O+', value: 'O_POSITIVE' },
    { label: 'O-', value: 'O_NEGATIVE' },
  ];
};

/**
 * Get color for blood group badge
 * @param {string} bloodGroup - Blood group in any format
 * @returns {string} - Color code
 */
export const getBloodGroupColor = (bloodGroup) => {
  const formatted = formatBloodGroup(bloodGroup);
  
  const colorMap = {
    'A+': '#e74c3c',
    'A-': '#c0392b',
    'B+': '#3498db',
    'B-': '#2980b9',
    'AB+': '#9b59b6',
    'AB-': '#8e44ad',
    'O+': '#27ae60',
    'O-': '#229954',
  };
  
  return colorMap[formatted] || '#95a5a6';
};

/**
 * Validate blood group format
 * @param {string} bloodGroup - Blood group to validate
 * @returns {boolean} - True if valid
 */
export const isValidBloodGroup = (bloodGroup) => {
  const validGroups = [
    'A_POSITIVE', 'A_NEGATIVE',
    'B_POSITIVE', 'B_NEGATIVE',
    'AB_POSITIVE', 'AB_NEGATIVE',
    'O_POSITIVE', 'O_NEGATIVE',
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  ];
  
  return validGroups.includes(bloodGroup);
};

/**
 * Get blood group compatibility information
 * @param {string} bloodGroup - Blood group
 * @returns {object} - Compatibility info
 */
export const getBloodGroupCompatibility = (bloodGroup) => {
  const formatted = formatBloodGroup(bloodGroup);
  
  const compatibility = {
    'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
    'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
    'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
    'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
    'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
    'AB-': { canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'] },
    'O+': { canDonateTo: ['A+', 'B+', 'AB+', 'O+'], canReceiveFrom: ['O+', 'O-'] },
    'O-': { canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceiveFrom: ['O-'] },
  };
  
  return compatibility[formatted] || { canDonateTo: [], canReceiveFrom: [] };
};

/**
 * Check if donor can donate to recipient
 * @param {string} donorBloodGroup - Donor blood group
 * @param {string} recipientBloodGroup - Recipient blood group
 * @returns {boolean} - True if compatible
 */
export const canDonate = (donorBloodGroup, recipientBloodGroup) => {
  const donorFormatted = formatBloodGroup(donorBloodGroup);
  const recipientFormatted = formatBloodGroup(recipientBloodGroup);
  
  const compatibility = getBloodGroupCompatibility(donorFormatted);
  return compatibility.canDonateTo.includes(recipientFormatted);
};

// Default export
export default {
  formatBloodGroup,
  toBackendFormat,
  getBloodGroupOptions,
  getBloodGroupColor,
  isValidBloodGroup,
  getBloodGroupCompatibility,
  canDonate,
};
