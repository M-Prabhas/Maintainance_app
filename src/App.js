import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/sidebar/Sidebar';
import Header from './components/common/Header';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import Notifications from './pages/Notifications';
import AddAppliance from './pages/AddAppliance';
import AddLocation from './pages/AddLocation';
import MapAppliance from './pages/MapAppliance';
import AssignLocation from './pages/AssignLocation';

// Import your Employee components here
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeInspection from './pages/EmployeeInspection';

import './App.css';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, currentUser } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, currentUser } = useApp();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, default to open; on mobile, default to closed
      if (!mobile) {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    if (window.innerWidth >= 768) {
      setSidebarOpen(true);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <div>
                <Header 
                  onMenuToggle={handleMenuToggle} 
                  showMenuButton={isMobile}
                />
                <div style={{ display: 'flex' }}>
                  <Sidebar
                    userRole={currentUser?.role || 'manager'}
                    isOpen={sidebarOpen}
                    setIsOpen={setSidebarOpen}
                  />
                  <div className={sidebarOpen ? 'main-content sidebar-open' : 'main-content sidebar-closed'}>
                    <Routes>
                      <Route path="/" element={<Navigate to={`/${currentUser?.role || 'manager'}`} replace />} />

                      {/* Manager routes */}
                      <Route
                        path="/manager"
                        element={
                          <ProtectedRoute allowedRoles={['manager']}>
                            <ManagerDashboard sidebarOpen={sidebarOpen} />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <ProtectedRoute allowedRoles={['manager', 'employee', 'thirdparty']}>
                            <Notifications />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/add-appliance"
                        element={
                          <ProtectedRoute allowedRoles={['manager']}>
                            <AddAppliance />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/add-location"
                        element={
                          <ProtectedRoute allowedRoles={['manager']}>
                            <AddLocation />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/map-appliance"
                        element={
                          <ProtectedRoute allowedRoles={['manager']}>
                            <MapAppliance />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/assign-location"
                        element={
                          <ProtectedRoute allowedRoles={['manager']}>
                            <AssignLocation />
                          </ProtectedRoute>
                        }
                      />

                      {/* Employee routes */}
                      <Route
                        path="/employee"
                        element={
                          <ProtectedRoute allowedRoles={['employee']}>
                            <EmployeeDashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/employee/inspection/:storeId"
                        element={
                          <ProtectedRoute allowedRoles={['employee']}>
                            <EmployeeInspection />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
