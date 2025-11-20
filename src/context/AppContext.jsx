import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockLocations, getStoresByLocation } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login function
  const login = (email, password) => {
    console.log('Attempting login with:', email); // Debug log
    
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      console.log('User found:', user); // Debug log
      setCurrentUser(user);
      setIsAuthenticated(true);
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    } else {
      console.log('User not found'); // Debug log
      return { success: false, message: 'Invalid email or password' };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('currentUser');
  };

  // Restore session on reload
  useEffect(() => {
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to restore session:', error);
        sessionStorage.removeItem('currentUser');
      }
    }
  }, []);

  // IMPORTANT: Must have 'value' prop
  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    mockLocations,
    getStoresByLocation,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
