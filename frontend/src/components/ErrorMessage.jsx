// ErrorMessage component
import React from 'react';
import './ErrorMessage.css';

export function ErrorMessage({ 
  error, 
  onRetry, 
  onDismiss,
  title = 'Error' 
}) {
  if (!error) return null;

  return (
    <div className="error-message">
      <div className="error-content">
        <h4>{title}</h4>
        <p>{error}</p>
        <div className="error-actions">
          {onDismiss && (
            <button 
              className="btn btn-secondary"
              onClick={onDismiss}
            >
              Dismiss
            </button>
          )}
          {onRetry && (
            <button 
              className="btn btn-primary"
              onClick={onRetry}
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}