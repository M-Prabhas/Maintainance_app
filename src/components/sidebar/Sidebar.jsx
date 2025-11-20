import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ userRole, isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/manager', roles: ['manager', 'employee', 'thirdparty'] },
    { id: 'add-appliance', label: 'Add Appliance', icon: '➕', path: '/add-appliance', roles: ['manager'] },
    { id: 'add-location', label: 'Add New Location', icon: '📍', path: '/add-location', roles: ['manager'] },
    { id: 'assign-location', label: 'Assign Location to Employee', icon: '👥', path: '/assign-location', roles: ['manager'] },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/notifications', roles: ['manager', 'employee', 'thirdparty'] }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>{isOpen && 'AMC Manager'}</h2>
        <button 
          className="toggle-btn" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        {filteredMenuItems.map(item => (
          <Link
            key={item.id}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {isOpen && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
