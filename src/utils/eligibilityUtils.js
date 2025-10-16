/**
 * Utility functions for donor eligibility calculations
 */

/**
 * Calculate if a donor is eligible to donate based on their last donation date
 * A donor is eligible if their last donation was more than 3 months ago
 * or if they have never donated before
 * 
 * @param {string|Date|null} lastDonationDate - The last donation date
 * @returns {boolean} - True if eligible, false otherwise
 */
export const calculateDonorEligibility = (lastDonationDate) => {
  if (!lastDonationDate) {
    // If no previous donation, donor is eligible
    return true;
  }

  const lastDonation = new Date(lastDonationDate);
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  // Donor is eligible if last donation was more than 3 months ago
  return lastDonation <= threeMonthsAgo;
};

/**
 * Get the next eligible donation date for a donor
 * 
 * @param {string|Date|null} lastDonationDate - The last donation date
 * @returns {Date|null} - The next eligible date, or null if already eligible
 */
export const getNextEligibleDate = (lastDonationDate) => {
  if (!lastDonationDate) {
    // If no previous donation, donor is already eligible
    return null;
  }

  const lastDonation = new Date(lastDonationDate);
  const nextEligibleDate = new Date(lastDonation);
  nextEligibleDate.setMonth(lastDonation.getMonth() + 3);

  const now = new Date();
  
  // If next eligible date is in the past, donor is already eligible
  if (nextEligibleDate <= now) {
    return null;
  }

  return nextEligibleDate;
};

/**
 * Get days remaining until next eligible donation
 * 
 * @param {string|Date|null} lastDonationDate - The last donation date
 * @returns {number|null} - Days remaining, or null if already eligible
 */
export const getDaysUntilEligible = (lastDonationDate) => {
  const nextEligibleDate = getNextEligibleDate(lastDonationDate);
  
  if (!nextEligibleDate) {
    return null; // Already eligible
  }

  const now = new Date();
  const diffTime = nextEligibleDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Format eligibility status for display
 * 
 * @param {string|Date|null} lastDonationDate - The last donation date
 * @returns {object} - Object with eligibility info for display
 */
export const getEligibilityDisplayInfo = (lastDonationDate) => {
  const isEligible = calculateDonorEligibility(lastDonationDate);
  const daysUntilEligible = getDaysUntilEligible(lastDonationDate);
  const nextEligibleDate = getNextEligibleDate(lastDonationDate);

  if (isEligible) {
    return {
      isEligible: true,
      status: 'Eligible',
      message: 'Ready to donate',
      color: '#4CAF50', // Green
      daysRemaining: null
    };
  } else {
    return {
      isEligible: false,
      status: 'Not Eligible',
      message: `Eligible in ${daysUntilEligible} days`,
      color: '#FF5722', // Red
      daysRemaining: daysUntilEligible,
      nextEligibleDate: nextEligibleDate
    };
  }
};
