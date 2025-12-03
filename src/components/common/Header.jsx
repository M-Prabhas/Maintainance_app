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
    <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, maxWidth: 'calc(100% - 160px)' }}>
        {showMenuButton && (
          <button 
            onClick={onMenuToggle}
            aria-label="Toggle menu"
            style={{
              background: '#f0f4f8',
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
              position: 'relative',
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
          fontSize: 'clamp(0.7rem, 2.5vw, 1.2rem)',
          minWidth: 0,
        }}>
          Medplus Maintainance App
        </h2>
      </div>
      <div className="header-right" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="user-info" style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          maxWidth: 'clamp(60px, 15vw, 150px)',
          fontSize: 'clamp(0.65rem, 2vw, 0.9rem)',
        }}>
          {currentUser?.name}
        </span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
