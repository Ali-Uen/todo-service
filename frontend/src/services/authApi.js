// Authentication API service
import { tokenStorage } from '../utils/tokenStorage.js';
import { jwtUtils } from '../utils/jwtUtils.js';

const API_BASE = '/api/v1/auth';

class AuthApiService {
  constructor() {
    this.isRefreshing = false;
    this.refreshPromise = null;
  }

  // Register new user
  async register(userData) {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Registration failed: ${response.statusText}`);
    }

    const data = await response.json();
    this._handleAuthResponse(data);
    return data;
  }

  // Login user
  async login(credentials) {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    this._handleAuthResponse(data);
    return data;
  }

  // Refresh access token
  async refreshToken() {
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    this.isRefreshing = true;
    this.refreshPromise = this._performRefresh(refreshToken);

    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  async _performRefresh(refreshToken) {
    const response = await fetch(`${API_BASE}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      // Refresh failed - clear all tokens
      tokenStorage.clearAll();
      throw new Error('Token refresh failed - please login again');
    }

    const data = await response.json();
    this._handleAuthResponse(data);
    return data;
  }

  // Logout user
  async logout() {
    const refreshToken = tokenStorage.getRefreshToken();
    
    // Always clear local storage first
    tokenStorage.clearAll();

    // Try to invalidate on server (but don't fail if it doesn't work)
    if (refreshToken) {
      try {
        await fetch(`${API_BASE}/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      } catch (error) {
        console.warn('Logout request failed, but local tokens cleared:', error);
      }
    }
  }

  // Auto-refresh token if needed
  async ensureValidToken() {
    const accessToken = tokenStorage.getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token');
    }

    if (jwtUtils.isTokenExpired(accessToken) || jwtUtils.willExpireSoon(accessToken)) {
      await this.refreshToken();
      return tokenStorage.getAccessToken();
    }

    return accessToken;
  }

  // Get authorization header for API requests
  async getAuthHeader() {
    const token = await this.ensureValidToken();
    return { Authorization: `Bearer ${token}` };
  }

  // Handle auth response and store tokens
  _handleAuthResponse(data) {
    if (data.accessToken) {
      tokenStorage.setAccessToken(data.accessToken);
    }
    if (data.refreshToken) {
      tokenStorage.setRefreshToken(data.refreshToken);
    }
    if (data.user) {
      tokenStorage.setUser(data.user);
    }
  }

  // Check if user is currently authenticated
  isAuthenticated() {
    return tokenStorage.isAuthenticated();
  }

  // Get current user data
  getCurrentUser() {
    return tokenStorage.getUser();
  }
}

export const authApi = new AuthApiService();