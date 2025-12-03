import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaPlusCircle, FaMapMarkerAlt, FaUserTie, FaBell, FaBars, FaTimes } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = ({ userRole, isOpen, setIsOpen }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when resizing down
      if (mobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, setIsOpen]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile, setIsOpen]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt />, path: '/manager', roles: ['manager', 'employee', 'thirdparty'] },
    { id: 'add-appliance', label: 'Add Appliance', icon: <FaPlusCircle />, path: '/add-appliance', roles: ['manager'] },
    { id: 'add-location', label: 'Add New Location', icon: <FaMapMarkerAlt />, path: '/add-location', roles: ['manager'] },
    { id: 'assign-location', label: 'Assign Location to Employee', icon: <FaUserTie />, path: '/assign-location', roles: ['manager'] },
    { id: 'notifications', label: 'Notifications', icon: <FaBell />, path: '/notifications', roles: ['manager', 'employee', 'thirdparty'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  const handleOverlayClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={handleOverlayClick}
          style={{
            display: 'block',
            position: 'fixed',
            top: '56px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1049,
          }}
        />
      )}
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>{(isOpen || isMobile) && 'Menu Bar'}</h2>
          <button 
            className="toggle-btn" 
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? (isMobile ? <FaTimes /> : '◀') : (isMobile ? <FaBars /> : '▶')}
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {filteredMenuItems.map(item => (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              {(isOpen || isMobile) && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
