import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FaBars, FaCaretDown } from 'react-icons/fa';

const Header = ({ toggleSidebar }) => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <h2>Medplus Maintainance Application</h2>
      </div>
      <div className="header-right" ref={dropdownRef}>
        <div
          className="user-menu"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}
        >
          <span className="user-info">
            {currentUser?.name} ({currentUser?.role})
          </span>
          <FaCaretDown />

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
