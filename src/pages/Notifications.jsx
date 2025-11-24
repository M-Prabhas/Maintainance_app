import React from 'react';
import { notifications as initialNotifications } from '../data/mockData';

const Notifications = ({ sidebarOpen }) => {
  const notifications = initialNotifications;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    // Notice the sidebar-aware wrapper below:
    <div className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <div className="notifications-page">
        <h1>Notifications</h1>
        <br />
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((n) => (
              <li key={n.id} className={`notification-item ${n.priority}`}>
                <h3>{n.title}</h3>
                <p>{n.message}</p>
                <small>{formatTime(n.timestamp)}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notifications;
