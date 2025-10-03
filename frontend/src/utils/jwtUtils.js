// JWT utility functions
export const jwtUtils = {
  // Decode JWT token (simple base64 decode - for payload only, not for verification)
  decodeToken(token) {
    try {
      if (!token) return null;
      
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired(token) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },

  // Get token expiration time
  getTokenExpiration(token) {
    const decoded = this.decodeToken(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  },

  // Get user ID from token
  getUserIdFromToken(token) {
    const decoded = this.decodeToken(token);
    return decoded?.sub || decoded?.userId || null;
  },

  // Get user email from token
  getUserEmailFromToken(token) {
    const decoded = this.decodeToken(token);
    return decoded?.email || null;
  },

  // Check if token will expire soon (within 5 minutes)
  willExpireSoon(token, minutesBefore = 5) {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    const expirationTime = decoded.exp;
    const timeUntilExpiration = expirationTime - currentTime;
    
    return timeUntilExpiration < (minutesBefore * 60);
  }
};