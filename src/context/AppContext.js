import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  donors: [],
  donations: [],
  alerts: [],
  loading: false,
  error: null,
};

// Action types
const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_DONORS: 'SET_DONORS',
  ADD_DONOR: 'ADD_DONOR',
  SET_DONATIONS: 'SET_DONATIONS',
  ADD_DONATION: 'ADD_DONATION',
  SET_ALERTS: 'SET_ALERTS',
  ADD_ALERT: 'ADD_ALERT',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      };
    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };
    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case APP_ACTIONS.SET_DONORS:
      return {
        ...state,
        donors: action.payload.donors,
        loading: false,
      };
    case APP_ACTIONS.ADD_DONOR:
      return {
        ...state,
        donors: [...state.donors, action.payload.donor],
        loading: false,
      };
    case APP_ACTIONS.SET_DONATIONS:
      return {
        ...state,
        donations: action.payload.donations,
        loading: false,
      };
    case APP_ACTIONS.ADD_DONATION:
      return {
        ...state,
        donations: [...state.donations, action.payload.donation],
        loading: false,
      };
    case APP_ACTIONS.SET_ALERTS:
      return {
        ...state,
        alerts: action.payload.alerts,
        loading: false,
      };
    case APP_ACTIONS.ADD_ALERT:
      return {
        ...state,
        alerts: [...state.alerts, action.payload.alert],
        loading: false,
      };
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading) => {
    dispatch({
      type: APP_ACTIONS.SET_LOADING,
      payload: { loading },
    });
  };

  const setError = (error) => {
    dispatch({
      type: APP_ACTIONS.SET_ERROR,
      payload: { error },
    });
  };

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  const setDonors = (donors) => {
    dispatch({
      type: APP_ACTIONS.SET_DONORS,
      payload: { donors },
    });
  };

  const addDonor = (donor) => {
    dispatch({
      type: APP_ACTIONS.ADD_DONOR,
      payload: { donor },
    });
  };

  const setDonations = (donations) => {
    dispatch({
      type: APP_ACTIONS.SET_DONATIONS,
      payload: { donations },
    });
  };

  const addDonation = (donation) => {
    dispatch({
      type: APP_ACTIONS.ADD_DONATION,
      payload: { donation },
    });
  };

  const setAlerts = (alerts) => {
    dispatch({
      type: APP_ACTIONS.SET_ALERTS,
      payload: { alerts },
    });
  };

  const addAlert = (alert) => {
    dispatch({
      type: APP_ACTIONS.ADD_ALERT,
      payload: { alert },
    });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setDonors,
    addDonor,
    setDonations,
    addDonation,
    setAlerts,
    addAlert,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
