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

  // State for Tasks (History/Assignments)
  // Initializing with mockManagementHistory for demo purposes
  // In a real app, this would be fetched from an API
  const [tasks, setTasks] = useState([
    {
      id: 101,
      storeId: 1,
      storeName: 'Central Mall',
      employeeId: 1001,
      date: new Date().toISOString(),
      duration: '2.5',
      status: 'completed',
      approved: false, // New field for approval
      remarks: 'Replaced filters, checked wiring.',
    },
    {
      id: 102,
      storeId: 2,
      storeName: 'Eastside Plaza',
      employeeId: 1001,
      date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      duration: '1.0',
      status: 'completed',
      approved: true, // Already approved
      remarks: 'Inspection done, all good.',
    },
    {
      id: 103,
      storeId: 3,
      storeName: 'West End Store',
      employeeId: 1001,
      date: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
      duration: '3.0',
      status: 'hold',
      approved: false,
      remarks: 'Waiting for part replacement.',
    },
  ]);

  const approveTask = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, approved: true } : task
      )
    );
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
    tasks, // Expose tasks state
    approveTask, // Expose approval function
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
