// Loading component
import React from 'react';
import './Loading.css';

export function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
}