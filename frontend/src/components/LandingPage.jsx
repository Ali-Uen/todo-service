// Landing Page - TodoMaster Marketing Site
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Header } from '../components/Header.jsx';
import './LandingPage.css';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: '🎯',
      title: 'Smart Organization',
      description: 'Organize your tasks with intelligent categorization and priority levels.'
    },
    {
      icon: '⚡',
      title: 'Real-time Sync',
      description: 'Access your todos from anywhere with instant synchronization across devices.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your productivity with detailed analytics and completion insights.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      avatar: '👩‍💼',
      comment: 'TodoMaster has revolutionized how I manage my daily tasks. The interface is clean and intuitive.'
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      avatar: '👨‍💻',
      comment: 'Finally, a todo app that doesn\'t get in my way. Simple, fast, and reliable.'
    },
    {
      name: 'Emma Wilson',
      role: 'Freelance Designer',
      avatar: '👩‍🎨',
      comment: 'The perfect balance of functionality and design. I can focus on what matters most.'
    }
  ];

  return (
    <div className="landing-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              A simple <span className="gradient-text">To Do Web-App</span>
            </h1>
            <p className="hero-subtitle">
              Organize your life, boost your productivity, and achieve your goals with our intuitive task management platform.
            </p>
            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="btn btn-primary btn-large">
                Get Started Free
              </button>
              <Link to="/features" className="btn btn-outline btn-large">
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Tasks Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="app-mockup">
              <div className="mockup-header">
                <div className="mockup-controls">
                  <span className="control red"></span>
                  <span className="control yellow"></span>
                  <span className="control green"></span>
                </div>
                <span className="mockup-title">TodoMaster</span>
              </div>
              <div className="mockup-content">
                <div className="mock-todo completed">
                  <span className="todo-check">✓</span>
                  <span className="todo-text">Design new landing page</span>
                </div>
                <div className="mock-todo">
                  <span className="todo-check">○</span>
                  <span className="todo-text">Review authentication system</span>
                </div>
                <div className="mock-todo">
                  <span className="todo-check">○</span>
                  <span className="todo-text">Plan next sprint</span>
                </div>
                <div className="mock-todo high-priority">
                  <span className="todo-check">○</span>
                  <span className="todo-text">Fix critical bug</span>
                  <span className="priority-badge">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose TodoMaster?</h2>
            <p className="section-subtitle">
              Powerful features designed to help you stay organized and productive
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-subtitle">
              Join thousands of satisfied users who trust TodoMaster
            </p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p className="testimonial-text">"{testimonial.comment}"</p>
                </div>
                <div className="testimonial-author">
                  <span className="author-avatar">{testimonial.avatar}</span>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Organized?</h2>
            <p className="cta-subtitle">
              Start your productivity journey today with TodoMaster
            </p>
            <div className="cta-buttons">
              <button onClick={handleGetStarted} className="btn btn-primary btn-large">
                Start Free Trial
              </button>
              <Link to="/pricing" className="btn btn-outline btn-large">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                    <rect width="32" height="32" rx="8" fill="url(#footerLogoGradient)"/>
                    <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#667eea"/>
                        <stop offset="100%" stopColor="#764ba2"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <p className="footer-description">
                The simple and powerful way to manage your tasks and boost productivity.
              </p>
            </div>
            
            <div className="footer-links-horizontal">
              <div className="footer-column">
                <h4 className="footer-column-title">Product</h4>
                <Link to="/features" className="footer-link">Features</Link>
                <Link to="/pricing" className="footer-link">Pricing</Link>
                <Link to="/security" className="footer-link">Security</Link>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-column-title">Company</h4>
                <Link to="/about" className="footer-link">About Us</Link>
                <Link to="/contact" className="footer-link">Contact</Link>
                <Link to="/careers" className="footer-link">Careers</Link>
              </div>
              
              <div className="footer-column">
                <h4 className="footer-column-title">Support</h4>
                <Link to="/help" className="footer-link">Help Center</Link>
                <Link to="/docs" className="footer-link">Documentation</Link>
                <Link to="/status" className="footer-link">Status</Link>
              </div>
            </div>
            

          </div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="footer-bottom-left">
                <div className="language-selector">
                  <span className="language-icon">🌐</span>
                  <select className="language-select">
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <p className="copyright">
                  © 2025 TodoMaster
                </p>
              </div>
              
              <div className="footer-bottom-center">
                <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
                <Link to="/privacy" className="footer-bottom-link">Privacy</Link>
                <Link to="/imprint" className="footer-bottom-link">Imprint</Link>
              </div>
              
              <div className="footer-bottom-right">
                <div className="social-links">
                  <a href="#" className="social-link" aria-label="Twitter">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-link" aria-label="GitHub">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                  <a href="#" className="social-link" aria-label="LinkedIn">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
                <div className="app-download">
                  <a href="#" className="app-download-link">
                    <span>📱</span> Download App
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}