// UserProfile component - Display user info and logout
import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import './UserProfile.css';

export function UserProfile() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-info">
        <div className="user-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
        <div className="user-details">
          <span className="user-name">{user.name || 'User'}</span>
          <span className="user-email">{user.email}</span>
        </div>
      </div>
      
      <button 
        className="logout-btn"
        onClick={handleLogout}
        disabled={isLoading}
        title="Logout"
      >
        {isLoading ? '...' : 'Logout'}
      </button>
    </div>
  );
}