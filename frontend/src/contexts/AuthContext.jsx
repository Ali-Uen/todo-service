// AuthContext - Global authentication state management
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authApi } from '../services/authApi.js';
import { tokenStorage } from '../utils/tokenStorage.js';
import { getUserFriendlyErrorMessage, SUCCESS_MESSAGES } from '../utils/messages.js';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  RESTORE_SESSION: 'RESTORE_SESSION',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.RESTORE_SESSION:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        isLoading: false,
        error: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    default:
      return state;
  }
}

// Create contexts
const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

// AuthProvider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app start
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const isAuthenticated = authApi.isAuthenticated();
        const user = authApi.getCurrentUser();

        if (isAuthenticated && user) {
          // Verify token is still valid by making a test request
          try {
            await authApi.ensureValidToken();
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: { user, isAuthenticated: true }
            });
          } catch (error) {
            // Token invalid, clear session
            await authApi.logout();
            dispatch({
              type: AUTH_ACTIONS.RESTORE_SESSION,
              payload: { user: null, isAuthenticated: false }
            });
          }
        } else {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_SESSION,
            payload: { user: null, isAuthenticated: false }
          });
        }
      } catch (error) {
        console.error('Error restoring session:', error);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_SESSION,
          payload: { user: null, isAuthenticated: false }
        });
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

// Custom hooks for using auth context
export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within an AuthProvider');
  }
  return context;
}

export function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within an AuthProvider');
  }
  return context;
}

// Main useAuth hook with actions
export function useAuth() {
  const state = useAuthState();
  const dispatch = useAuthDispatch();

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const response = await authApi.login(credentials);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: response.user }
      });
      return response;
    } catch (error) {
      const friendlyMessage = getUserFriendlyErrorMessage(error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: friendlyMessage }
      });
      throw new Error(friendlyMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
      const response = await authApi.register(userData);
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: { user: response.user }
      });
      return response;
    } catch (error) {
      const friendlyMessage = getUserFriendlyErrorMessage(error);
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: { error: friendlyMessage }
      });
      throw new Error(friendlyMessage);
    }
  };

  // Logout function
  const logout = async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  return {
    ...state,
    login,
    register,
    logout,
    clearError
  };
}

export { AUTH_ACTIONS };