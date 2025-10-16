import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import ApiService from './ApiService';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
    this.sound = null;
  }

  // Initialize notification service
  async initialize() {
    try {
      console.log('Initializing notification service...');
      
      // Request permissions
      const permissionGranted = await this.requestPermissions();
      if (!permissionGranted) {
        console.log('Notification permissions not granted, continuing without notifications');
      }

      // Get push token
      await this.registerForPushNotificationsAsync();

      // Set up listeners
      this.setupNotificationListeners();
      
      // Load alert sound
      await this.loadAlertSound();

      console.log('Notification service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      return false;
    }
  }

  // Request notification permissions
  async requestPermissions() {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please enable notifications to receive emergency alerts.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Settings', onPress: () => Notifications.openSettingsAsync() }
            ]
          );
          return false;
        }

        // Configure notification channel for Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('emergency', {
            name: 'Emergency Alerts',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            sound: 'emergency_alert.wav',
            enableVibrate: true,
            enableLights: true,
            showBadge: true,
          });
        }

        return true;
      } else {
        console.log('Running on simulator - notifications will work in development mode');
        return true;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  // Register for push notifications and get token
  async registerForPushNotificationsAsync() {
    try {
      // Get project ID from config, fallback to development mode
      const projectId = Constants.expoConfig?.extra?.eas?.projectId || 'development-mode';
      
      console.log('Project ID:', projectId);
      
      // Check if we're in development mode or on a simulator
      if (!Device.isDevice || projectId === 'development-mode') {
        // Development mode - create a mock token
        console.log('Running in development mode - using mock push token');
        this.expoPushToken = 'development-mock-token';
        await AsyncStorage.setItem('expoPushToken', this.expoPushToken);
        return this.expoPushToken;
      }

      // Production mode - get real token
      const token = (await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      })).data;

      this.expoPushToken = token;
      await AsyncStorage.setItem('expoPushToken', token);
      console.log('Expo Push Token:', token);
      await this.sendTokenToServer(token);
      return token;
    } catch (error) {
      console.error('Error getting push token:', error);
      // Fallback to development mode
      console.log('Falling back to development mode');
      this.expoPushToken = 'development-mock-token';
      await AsyncStorage.setItem('expoPushToken', this.expoPushToken);
      return this.expoPushToken;
    }
  }

  // Send token to backend server
  async sendTokenToServer(token) {
    try {
      // Skip sending mock tokens to server
      if (token === 'development-mock-token') {
        console.log('Skipping mock token registration');
        return;
      }

      const tokenData = {
        token: token,
        platform: Platform.OS,
        deviceId: Constants.deviceId || 'unknown',
        deviceName: Constants.deviceName || 'Unknown Device',
      };

      const response = await ApiService.registerFCMToken(tokenData);

      if (response && (response.success || response.data)) {
        console.log('FCM token registered successfully:', response);
      } else {
        console.warn('Failed to register FCM token');
      }
    } catch (error) {
      console.error('Error registering FCM token:', error);
    }
  }

  // Set up notification listeners
  setupNotificationListeners() {
    this.notificationListener = Notifications.addNotificationReceivedListener(
      this.handleNotificationReceived.bind(this)
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse.bind(this)
    );
  }

  // Handle notification received while app is in foreground
  async handleNotificationReceived(notification) {
    console.log('Notification received:', notification);

    const { title, body, data } = notification.request.content;

    if (data?.type === 'emergency' || title?.toLowerCase().includes('emergency')) {
      await this.handleEmergencyAlert(notification);
    }
  }

  // Handle notification tap
  handleNotificationResponse(response) {
    console.log('Notification tapped:', response);

    const { notification } = response;
    const { data } = notification.request.content;

    if (data?.type === 'emergency') {
      console.log('Emergency notification tapped');
    }
  }

  // Handle emergency alert specifically
  async handleEmergencyAlert(notification) {
    try {
      await this.playAlertSound();
      await this.showEmergencyNotification(notification.request.content);

      if (Platform.OS === 'android') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '',
            body: '',
            vibrate: [0, 500, 200, 500, 200, 500],
          },
          trigger: null,
        });
      }
    } catch (error) {
      console.error('Error handling emergency alert:', error);
    }
  }

  // Load alert sound
  async loadAlertSound() {
    try {
      console.log('Alert sound loading skipped in development mode');
      return;
    } catch (error) {
      console.warn('Could not load alert sound:', error);
    }
  }

  // Play alert sound
  async playAlertSound() {
    try {
      if (this.sound) {
        await this.sound.replayAsync();
      } else {
        console.log('Playing system notification sound');
      }
    } catch (error) {
      console.error('Error playing alert sound:', error);
    }
  }

  // Show emergency notification
  async showEmergencyNotification(content) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: content.title || 'Emergency Alert',
          body: content.body || 'Emergency notification received',
          data: {
            type: 'emergency',
            timestamp: new Date().toISOString(),
            ...content.data,
          },
          sound: Platform.OS === 'android' ? 'emergency_alert.wav' : 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          vibrate: [0, 250, 250, 250],
        },
        trigger: null,
        identifier: `emergency_${Date.now()}`,
      });
    } catch (error) {
      console.error('Error showing emergency notification:', error);
    }
  }

  // Send test emergency notification
  async sendTestEmergencyAlert() {
    try {
      await this.showEmergencyNotification({
        title: 'Emergency Blood Needed',
        body: 'O+ blood required at Civil Hospital Muktsar.',
        data: {
          type: 'emergency',
          bloodType: 'O+',
          hospital: 'Civil Hospital Muktsar',
          urgency: 'high',
        },
      });

      await this.playAlertSound();
      console.log('Test emergency alert sent');
    } catch (error) {
      console.error('Error sending test alert:', error);
    }
  }

  // Get stored push token
  async getStoredToken() {
    try {
      return await AsyncStorage.getItem('expoPushToken');
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  // Clean up listeners
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
    if (this.sound) {
      this.sound.unloadAsync();
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
