import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, currentUser } = useApp();
  const navigate = useNavigate();

  // Remove body margins on mount
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      console.log('Already authenticated, redirecting...');
      if (currentUser.role === 'manager') {
        navigate('/manager', { replace: true });
      } else {
        navigate('/employee', { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Submitting login form...');

    try {
      const result = login(email, password);
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, navigating...');
        setTimeout(() => {
          if (result.user.role === 'manager') {
            navigate('/manager', { replace: true });
          } else if (result.user.role === 'employee' || result.user.role === 'thirdparty') {
            navigate('/employee', { replace: true });
          }
        }, 100);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #a8c0e8 0%, #c4d7f2 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'auto'
  };

  const loginBoxStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    margin: '20px'
  };

  const headingStyle = {
    color: '#2c5aa0',
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '8px',
    marginTop: 0
  };

  const subtitleStyle = {
    color: '#666',
    fontSize: '14px',
    marginBottom: '24px',
    marginTop: 0
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '16px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2c5aa0',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    marginTop: '8px',
    opacity: isLoading ? 0.7 : 1
  };

  const errorStyle = {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '14px'
  };

  const demoBoxStyle = {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    borderLeft: '4px solid #2c5aa0',
    textAlign: 'left'
  };

  const demoHeadingStyle = {
    color: '#333',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: 0,
    marginBottom: '12px'
  };

  const demoParagraphStyle = {
    color: '#555',
    fontSize: '13px',
    margin: '6px 0'
  };

  return (
    <div style={containerStyle}>
      <div style={loginBoxStyle}>
        <h1 style={headingStyle}>AMC Management System</h1>
        <p style={subtitleStyle}>Manage your AMC contracts efficiently</p>
        
        {error && <div style={errorStyle}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            style={inputStyle}
          />
          <button type="submit" disabled={isLoading} style={buttonStyle}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={demoBoxStyle}>
          <h4 style={demoHeadingStyle}>Demo Credentials:</h4>
          <p style={demoParagraphStyle}>
            <strong>Manager:</strong> manager@example.com / manager123
          </p>
          <p style={demoParagraphStyle}>
            <strong>Employee:</strong> rajesh@example.com / emp123
          </p>
          <p style={demoParagraphStyle}>
            <strong>Employee:</strong> priya@example.com / emp123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
