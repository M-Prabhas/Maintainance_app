import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FaBars } from 'react-icons/fa';

const Header = ({ onMenuToggle, showMenuButton = false }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        {showMenuButton && (
          <button 
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#2c3e50',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              minWidth: '44px',
              borderRadius: '8px',
              flexShrink: 0,
              zIndex: 10,
            }}
          >
            <FaBars />
          </button>
        )}
        <h2 style={{ 
          margin: 0, 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          fontSize: 'clamp(0.75rem, 3vw, 1.2rem)',
          flex: 1,
          minWidth: 0,
        }}>
          Medplus Maintainance Application
        </h2>
      </div>
      <div className="header-right">
        <span className="user-info">
          {currentUser?.name} ({currentUser?.role})
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
