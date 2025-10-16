// Helper functions
export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN');
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[+]?[0-9]{10,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default {
  formatCurrency,
  formatDate,
  validateEmail,
  validatePhone,
  capitalizeFirstLetter,
};
