import api, { apiMethods, mockResponses, isDevelopmentMode } from './api';

class ApiService {
  constructor() {
    // Use the centralized API instance
    this.api = api;
  }

  // GET request
  async get(endpoint, config = {}) {
    try {
      const response = await this.api.get(endpoint, config);
      return response.data;
    } catch (error) {
      // Fallback to mock data in development mode
      if (isDevelopmentMode) {
        console.log(`Using mock data for GET ${endpoint}`);
        return this.getMockData(endpoint);
      }
      throw error;
    }
  }

  // POST request
  async post(endpoint, data, config = {}) {
    try {
      const response = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      // Fallback to mock response in development mode
      if (isDevelopmentMode) {
        console.log(`Using mock response for POST ${endpoint}`);
        return this.getMockResponse(endpoint, data);
      }
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data, config = {}) {
    try {
      const response = await this.api.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      if (isDevelopmentMode) {
        console.log(`Using mock response for PUT ${endpoint}`);
        return { success: true, data };
      }
      throw error;
    }
  }

  // DELETE request
  async delete(endpoint, config = {}) {
    try {
      const response = await this.api.delete(endpoint, config);
      return response.data;
    } catch (error) {
      if (isDevelopmentMode) {
        console.log(`Using mock response for DELETE ${endpoint}`);
        return { success: true };
      }
      throw error;
    }
  }

  // Mock data helper
  getMockData(endpoint) {
    if (endpoint.includes('/donors/eligible')) {
      return {
        data: mockResponses.donors.data.filter(donor => donor.isEligible),
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
    }
    if (endpoint.includes('/donors/blood-group/')) {
      const bloodGroup = endpoint.split('/').pop().toUpperCase().replace('+', '_POSITIVE').replace('-', '_NEGATIVE');
      return {
        data: mockResponses.donors.data.filter(donor => donor.bloodGroup === bloodGroup),
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };
    }
    if (endpoint.includes('/donors/statistics')) {
      return {
        totalDonors: 2,
        eligibleDonors: 1,
        bloodGroupDistribution: {
          'O_POSITIVE': 1,
          'A_POSITIVE': 1,
        },
        genderDistribution: {
          'MALE': 1,
          'FEMALE': 1,
        },
      };
    }
    if (endpoint.includes('/alerts/active')) {
      return {
        data: mockResponses.alerts.data.filter(alert => alert.status === 'ACTIVE'),
        pagination: { page: 1, limit: 10, total: 2, totalPages: 1 },
      };
    }
    if (endpoint.includes('/alerts')) {
      return mockResponses.alerts;
    }
    if (endpoint.includes('/donors')) {
      return mockResponses.donors;
    }
    return [];
  }

  // Mock response helper
  getMockResponse(endpoint, data) {
    if (endpoint.includes('/auth/login')) {
      return mockResponses.login;
    }
    if (endpoint.includes('/donors')) {
      return { success: true, data: { id: Date.now(), ...data } };
    }
    if (endpoint.includes('/alerts')) {
      return {
        success: true,
        data: {
          id: `alert_${Date.now()}`,
          ...data,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          notificationsSent: 150
        }
      };
    }
    return { success: true };
  }

  // Donors API - Updated to use new API methods
  async getDonors(params = {}) {
    return apiMethods.getDonors(params);
  }

  async getDonorById(id) {
    return apiMethods.getDonorById(id);
  }

  async createDonor(donorData) {
    return apiMethods.createDonor(donorData);
  }

  async updateDonor(id, donorData) {
    return apiMethods.updateDonor(id, donorData);
  }

  async deleteDonor(id) {
    return apiMethods.deleteDonor(id);
  }

  async getEligibleDonors() {
    return apiMethods.getEligibleDonors();
  }

  async getDonorsByBloodGroup(bloodGroup) {
    return apiMethods.getDonorsByBloodGroup(bloodGroup);
  }

  async updateDonorLastDonation(id, lastDonationDate) {
    return apiMethods.updateDonorLastDonation(id, lastDonationDate);
  }

  async getDonorStatistics() {
    return apiMethods.getDonorStatistics();
  }

  // Donations API - Updated to use new API methods
  async getDonations(params = {}) {
    return apiMethods.getDonations(params);
  }

  async createDonation(donationData) {
    return apiMethods.createDonation(donationData);
  }

  // Alerts API - Updated to use new API methods
  async getAlerts(params = {}) {
    return apiMethods.getAlerts(params);
  }

  async getActiveAlerts() {
    return apiMethods.getActiveAlerts();
  }

  async sendAlert(alertData) {
    return apiMethods.createAlert(alertData);
  }

  async createAlert(alertData) {
    return apiMethods.createAlert(alertData);
  }

  async resolveAlert(id) {
    return apiMethods.resolveAlert(id);
  }

  async cancelAlert(id) {
    return apiMethods.cancelAlert(id);
  }

  async getCurrentAlerts() {
    return apiMethods.getCurrentAlerts();
  }

  async getPastAlerts() {
    return apiMethods.getPastAlerts();
  }

  async acceptAlert(alertId, donorId) {
    return apiMethods.acceptAlert(alertId, donorId);
  }

  async getAcceptedDonors(alertId) {
    return apiMethods.getAcceptedDonors(alertId);
  }

  async markAlertComplete(alertId) {
    return apiMethods.markAlertComplete(alertId);
  }

  // User API - New methods
  async getProfile() {
    return apiMethods.getProfile();
  }

  async updateProfile(userData) {
    return apiMethods.updateProfile(userData);
  }

  // Notification API - New methods
  async registerFCMToken(tokenData) {
    return apiMethods.registerFCMToken(tokenData);
  }

  async unregisterFCMToken(tokenData) {
    return apiMethods.unregisterFCMToken(tokenData);
  }
}

export default new ApiService();
