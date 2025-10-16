import { apiMethods } from './api';
import { APP_CONFIG, FEATURES } from '../config/config';

/**
 * AlertService - Handles alert polling and management
 * 
 * This service provides functionality for:
 * - Polling alerts from the backend
 * - Managing alert state
 * - Handling real-time alert updates
 */
class AlertService {
  constructor() {
    this.pollInterval = null;
    this.isPolling = false;
    this.lastAlertCheck = null;
    this.alertCallbacks = [];
  }

  /**
   * Start polling for alerts
   * @param {Function} onNewAlert - Callback for new alerts
   * @param {number} interval - Polling interval in milliseconds
   */
  startPolling(onNewAlert, interval = APP_CONFIG.ALERT_POLL_INTERVAL) {
    if (this.isPolling) {
      console.log('Alert polling already active');
      return;
    }

    console.log(`Starting alert polling every ${interval}ms`);
    this.isPolling = true;
    
    // Add callback
    if (onNewAlert && typeof onNewAlert === 'function') {
      this.alertCallbacks.push(onNewAlert);
    }

    // Initial check
    this.checkForAlerts();

    // Set up polling interval
    this.pollInterval = setInterval(() => {
      this.checkForAlerts();
    }, interval);
  }

  /**
   * Stop polling for alerts
   */
  stopPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
    this.alertCallbacks = [];
    console.log('Alert polling stopped');
  }

  /**
   * Check for new alerts
   */
  async checkForAlerts() {
    try {
      const response = await apiMethods.getActiveAlerts();
      const alerts = response.data || [];

      // Filter new alerts since last check
      const newAlerts = this.filterNewAlerts(alerts);

      if (newAlerts.length > 0) {
        console.log(`Found ${newAlerts.length} new alerts`);
        this.notifyCallbacks(newAlerts);
      }

      // Update last check time
      this.lastAlertCheck = new Date();

      return alerts;
    } catch (error) {
      console.error('Error checking for alerts:', error);
      return [];
    }
  }

  /**
   * Filter alerts that are newer than last check
   * @param {Array} alerts - All alerts from API
   * @returns {Array} - New alerts only
   */
  filterNewAlerts(alerts) {
    if (!this.lastAlertCheck) {
      // First time checking - don't treat all as new
      return [];
    }

    return alerts.filter(alert => {
      const alertTime = new Date(alert.createdAt);
      return alertTime > this.lastAlertCheck;
    });
  }

  /**
   * Notify all callbacks about new alerts
   * @param {Array} newAlerts - New alerts to notify about
   */
  notifyCallbacks(newAlerts) {
    this.alertCallbacks.forEach(callback => {
      try {
        callback(newAlerts);
      } catch (error) {
        console.error('Error in alert callback:', error);
      }
    });
  }

  /**
   * Add a callback for new alerts
   * @param {Function} callback - Function to call when new alerts arrive
   */
  addAlertCallback(callback) {
    if (typeof callback === 'function') {
      this.alertCallbacks.push(callback);
    }
  }

  /**
   * Remove a callback
   * @param {Function} callback - Function to remove
   */
  removeAlertCallback(callback) {
    this.alertCallbacks = this.alertCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Get all active alerts
   * @returns {Promise<Array>} - Array of active alerts
   */
  async getActiveAlerts() {
    try {
      const response = await apiMethods.getActiveAlerts();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      return [];
    }
  }

  /**
   * Get all alerts (admin only)
   * @returns {Promise<Array>} - Array of all alerts
   */
  async getAllAlerts() {
    try {
      const response = await apiMethods.getAlerts();
      return response.data || [];
    } catch (error) {
      console.error('Error fetching all alerts:', error);
      return [];
    }
  }

  /**
   * Create a new alert (admin only)
   * @param {Object} alertData - Alert data
   * @returns {Promise<Object>} - Created alert
   */
  async createAlert(alertData) {
    try {
      const response = await apiMethods.createAlert(alertData);
      console.log('Alert created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  /**
   * Mark alert as acknowledged locally
   * @param {string} alertId - Alert ID
   */
  async acknowledgeAlert(alertId) {
    try {
      // Store acknowledgment locally (since donors can't reply to backend)
      const acknowledgments = await this.getLocalAcknowledgments();
      acknowledgments[alertId] = {
        acknowledgedAt: new Date().toISOString(),
        userId: 'current_user', // Would get from auth context
      };
      
      await this.saveLocalAcknowledgments(acknowledgments);
      console.log(`Alert ${alertId} acknowledged locally`);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  }

  /**
   * Check if alert is acknowledged locally
   * @param {string} alertId - Alert ID
   * @returns {Promise<boolean>} - True if acknowledged
   */
  async isAlertAcknowledged(alertId) {
    try {
      const acknowledgments = await this.getLocalAcknowledgments();
      return !!acknowledgments[alertId];
    } catch (error) {
      console.error('Error checking alert acknowledgment:', error);
      return false;
    }
  }

  /**
   * Get local acknowledgments from storage
   * @returns {Promise<Object>} - Acknowledgments object
   */
  async getLocalAcknowledgments() {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const stored = await AsyncStorage.getItem('alert_acknowledgments');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting local acknowledgments:', error);
      return {};
    }
  }

  /**
   * Save local acknowledgments to storage
   * @param {Object} acknowledgments - Acknowledgments to save
   */
  async saveLocalAcknowledgments(acknowledgments) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('alert_acknowledgments', JSON.stringify(acknowledgments));
    } catch (error) {
      console.error('Error saving local acknowledgments:', error);
    }
  }

  /**
   * Clear all local acknowledgments
   */
  async clearLocalAcknowledgments() {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('alert_acknowledgments');
      console.log('Local acknowledgments cleared');
    } catch (error) {
      console.error('Error clearing local acknowledgments:', error);
    }
  }

  /**
   * Get alert statistics (admin only)
   * @returns {Promise<Object>} - Alert statistics
   */
  async getAlertStatistics() {
    try {
      const response = await apiMethods.getAlertStatistics();
      return response.data || {};
    } catch (error) {
      console.error('Error fetching alert statistics:', error);
      return {};
    }
  }
}

// Create singleton instance
const alertService = new AlertService();

export default alertService;
