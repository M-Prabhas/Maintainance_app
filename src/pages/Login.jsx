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

    console.log('Submitting login form...'); // Debug log

    try {
      const result = login(email, password);
      console.log('Login result:', result); // Debug log
      
      if (result.success) {
        console.log('Login successful, navigating...'); // Debug log
        // Small delay to ensure state updates
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

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>AMC Management System</h1>
        <p className="subtitle">Manage your AMC contracts efficiently</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Manager:</strong> manager@example.com / manager123</p>
          <p><strong>Employee:</strong> rajesh@example.com / emp123</p>
          <p><strong>Employee:</strong> priya@example.com / emp123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
