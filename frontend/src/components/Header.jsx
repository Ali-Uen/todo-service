// Navigation Header Component - TodoMaster Marketing Site
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import './Header.css';

export function Header() {
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="url(#logoGradient)"/>
                <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea"/>
                    <stop offset="100%" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">TodoMaster</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/features" className="nav-link">Features</Link>
          <Link to="/pricing" className="nav-link">Pricing</Link>
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        {/* Auth Section */}
        <div className="header-auth desktop-auth">
          <Link to="/contact" className="btn btn-outline">
            Contact
          </Link>
          {isAuthenticated ? (
            <div className="user-section">
              <span className="welcome-text">Hi, {user?.username}!</span>
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <button onClick={handleGetStarted} className="btn btn-primary">
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav className="mobile-nav">
          <Link to="/" className="mobile-nav-link" onClick={toggleMobileMenu}>
            Home
          </Link>
          <Link to="/features" className="mobile-nav-link" onClick={toggleMobileMenu}>
            Features
          </Link>
          <Link to="/pricing" className="mobile-nav-link" onClick={toggleMobileMenu}>
            Pricing
          </Link>
          <Link to="/about" className="mobile-nav-link" onClick={toggleMobileMenu}>
            About
          </Link>
          <Link to="/contact" className="mobile-nav-link" onClick={toggleMobileMenu}>
            Contact
          </Link>
          <div className="mobile-auth">
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary full-width" onClick={toggleMobileMenu}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline full-width" onClick={toggleMobileMenu}>
                  Login
                </Link>
                <button onClick={() => { handleGetStarted(); toggleMobileMenu(); }} className="btn btn-primary full-width">
                  Sign Up
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}