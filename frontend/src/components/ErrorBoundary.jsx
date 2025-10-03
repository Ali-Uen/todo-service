// ErrorBoundary component - Catch React errors
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something went wrong. Please try refreshing the page.</p>
            
            <button 
              className="error-boundary-button"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Add styles to main CSS or create separate file
const errorBoundaryStyles = `
.error-boundary {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8f9fa;
}

.error-boundary-content {
  text-align: center;
  max-width: 500px;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-boundary-content h2 {
  color: #e53e3e;
  margin-bottom: 1rem;
}

.error-boundary-content p {
  color: #666;
  margin-bottom: 2rem;
}

.error-boundary-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.error-boundary-button:hover {
  opacity: 0.9;
}

.error-details {
  margin-top: 2rem;
  text-align: left;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.error-details pre {
  font-size: 0.8rem;
  color: #666;
  white-space: pre-wrap;
  word-break: break-word;
}
`;

// Inject styles if they don't exist
if (typeof document !== 'undefined' && !document.getElementById('error-boundary-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'error-boundary-styles';
  styleSheet.textContent = errorBoundaryStyles;
  document.head.appendChild(styleSheet);
}