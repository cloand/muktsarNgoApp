import React, { createContext, useContext, useReducer, useEffect } from 'react';
import notificationService from '../services/notifications';
import SoundService from '../services/SoundService';
import { Alert } from 'react-native';

// Initial state
const initialState = {
  isInitialized: false,
  hasPermission: false,
  pushToken: null,
  lastNotification: null,
  notificationHistory: [],
  loading: false,
  error: null,
};

// Action types
const NOTIFICATION_ACTIONS = {
  INIT_START: 'INIT_START',
  INIT_SUCCESS: 'INIT_SUCCESS',
  INIT_FAILURE: 'INIT_FAILURE',
  SET_PERMISSION: 'SET_PERMISSION',
  SET_TOKEN: 'SET_TOKEN',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.INIT_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case NOTIFICATION_ACTIONS.INIT_SUCCESS:
      return {
        ...state,
        isInitialized: true,
        loading: false,
        error: null,
      };
    case NOTIFICATION_ACTIONS.INIT_FAILURE:
      return {
        ...state,
        isInitialized: false,
        loading: false,
        error: action.payload.error,
      };
    case NOTIFICATION_ACTIONS.SET_PERMISSION:
      return {
        ...state,
        hasPermission: action.payload.hasPermission,
      };
    case NOTIFICATION_ACTIONS.SET_TOKEN:
      return {
        ...state,
        pushToken: action.payload.token,
      };
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        lastNotification: action.payload.notification,
        notificationHistory: [
          action.payload.notification,
          ...state.notificationHistory.slice(0, 49), // Keep last 50
        ],
      };
    case NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notificationHistory: [],
        lastNotification: null,
      };
    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };
    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Initialize notification service
  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    dispatch({ type: NOTIFICATION_ACTIONS.INIT_START });

    try {
      const success = await notificationService.initialize();

      if (success) {
        dispatch({ type: NOTIFICATION_ACTIONS.INIT_SUCCESS });

        // Get stored token
        const token = await notificationService.getStoredToken();
        if (token) {
          dispatch({
            type: NOTIFICATION_ACTIONS.SET_TOKEN,
            payload: { token },
          });
        }

        // Set permission status
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_PERMISSION,
          payload: { hasPermission: true },
        });

        // Set up notification listeners for emergency alerts
        setupNotificationListeners();
      } else {
        throw new Error('Failed to initialize notification service');
      }
    } catch (error) {
      dispatch({
        type: NOTIFICATION_ACTIONS.INIT_FAILURE,
        payload: { error: error.message },
      });
    }
  };

  // Setup notification listeners for emergency alerts
  const setupNotificationListeners = () => {
    // Listen for foreground notifications
    notificationService.setNotificationHandler((notification) => {
      const { title, body, data } = notification.request.content;

      // Check if it's an emergency alert
      if (data?.type === 'emergency_alert') {
        handleEmergencyAlert({ title, body, data });
      }

      // Add to notification history
      dispatch({
        type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
        payload: {
          notification: {
            id: Date.now().toString(),
            title,
            body,
            data,
            timestamp: new Date().toISOString(),
          },
        },
      });
    });

    // Listen for notification responses (when user taps notification)
    notificationService.setNotificationResponseHandler((response) => {
      const { notification } = response;
      const { data } = notification.request.content;

      if (data?.type === 'emergency_alert') {
        // Navigate to emergency alert screen or handle accordingly
        console.log('User tapped emergency alert notification');
      }
    });
  };

  // Handle emergency alert notifications
  const handleEmergencyAlert = async (alertData) => {
    try {
      // Play emergency sound
      await SoundService.playEmergencyAlert();

      // Show alert dialog
      Alert.alert(
        '🚨 Emergency Blood Alert',
        `${alertData.title}\n\n${alertData.body}`,
        [
          {
            text: 'View Details',
            onPress: () => {
              // Navigate to emergency alert screen
              console.log('Navigate to emergency alerts');
            },
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error handling emergency alert:', error);
    }
  };

  // Send emergency alert
  const sendEmergencyAlert = async (alertData) => {
    try {
      await notificationService.showEmergencyNotification(alertData);
      
      // Add to history
      const notification = {
        id: Date.now().toString(),
        type: 'emergency',
        title: alertData.title,
        body: alertData.body,
        data: alertData.data,
        timestamp: new Date().toISOString(),
        sent: true,
      };
      
      dispatch({
        type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
        payload: { notification },
      });
      
      return true;
    } catch (error) {
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      return false;
    }
  };

  // Send test notification
  const sendTestNotification = async () => {
    try {
      await notificationService.sendTestEmergencyAlert();
      
      const notification = {
        id: Date.now().toString(),
        type: 'test',
        title: 'Emergency Blood Needed',
        body: 'O+ blood required at Civil Hospital Muktsar.',
        timestamp: new Date().toISOString(),
        sent: true,
      };
      
      dispatch({
        type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
        payload: { notification },
      });
      
      return true;
    } catch (error) {
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      return false;
    }
  };

  // Request permissions
  const requestPermissions = async () => {
    try {
      const hasPermission = await notificationService.requestPermissions();
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_PERMISSION,
        payload: { hasPermission },
      });
      return hasPermission;
    } catch (error) {
      dispatch({
        type: NOTIFICATION_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      return false;
    }
  };

  // Clear notification history
  const clearNotificationHistory = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR });
  };

  // Get notification statistics
  const getNotificationStats = () => {
    const total = state.notificationHistory.length;
    const emergency = state.notificationHistory.filter(n => n.type === 'emergency').length;
    const test = state.notificationHistory.filter(n => n.type === 'test').length;
    
    return {
      total,
      emergency,
      test,
      lastSent: state.lastNotification?.timestamp,
    };
  };

  const value = {
    ...state,
    sendEmergencyAlert,
    sendTestNotification,
    requestPermissions,
    clearNotificationHistory,
    clearError,
    getNotificationStats,
    initializeNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
