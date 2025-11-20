import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock Data
const mockAssignedStores = [
  { id: 1, name: 'Central Mall', address: '123 Main St, Cityville', contactPerson: 'John Doe', contactNumber: '9876543210' },
  { id: 2, name: 'Eastside Plaza', address: '456 East Rd, Townsville', contactPerson: 'Jane Smith', contactNumber: '9123456780' },
  { id: 3, name: 'West End Store', address: '789 West Ave, Villagetown', contactPerson: 'Alan Brown', contactNumber: '9988776655' },
];

const mockManagementHistory = [
  {
    id: 101,
    storeId: 1,
    storeName: 'Central Mall',
    employeeId: 1001,
    date: new Date().toISOString(),
    duration: '2.5',
    status: 'completed',
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
    remarks: 'Waiting for part replacement.',
  },
];

const currentUser = {
  id: 1001,
  name: 'Ravi Kumar',
  role: 'Maintenance Engineer',
};

// Helper function to get stores
const getAssignedStores = (employeeId) => {
  return mockAssignedStores;
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // Get assigned stores (mock)
  const assignedStores = getAssignedStores(currentUser.id);

  // Date strings
  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);

  // Filter today's assignments
  const todaysAssignments = assignedStores.filter(store => {
    return mockManagementHistory.some(record =>
      record.storeId === store.id &&
      record.employeeId === currentUser.id &&
      new Date(record.date).toISOString().slice(0, 10) === todayString
    );
  });

  // Work history for employee
  const employeeHistory = mockManagementHistory
    .filter(record => record.employeeId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // KPIs
  const totalCompleted = employeeHistory.length;
  const thisMonthCount = employeeHistory.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
  }).length;
  const totalHours = employeeHistory.reduce((sum, r) => sum + parseFloat(r.duration), 0);

  const [activeTab, setActiveTab] = useState('today');

  const handleStoreClick = (storeId) => {
    navigate(`/employee/inspection/${storeId}`);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Styles
  const styles = {
    container: {
      minHeight: '90vh',
      width: '90vw',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#fefefe',
      borderRadius: 10,
      padding: 20,
      boxSizing: 'border-box',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    KPIs: {
      display: 'flex',
      justifyContent: 'space-around',
      flexWrap: 'wrap',
      marginBottom: 20,
      backgroundColor: '#1976d2',
      borderRadius: 8,
      padding: 15,
    },
    KPIBox: {
      flex: '1 1 150px',
      minWidth: 150,
      textAlign: 'center',
      padding: 10,
    },
    KPIValue: {
      fontSize: '2.2rem',
      fontWeight: '700',
      color: 'white',
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 20,
    },
    tabBtn: (active) => ({
      padding: '0.6rem 1.8rem',
      fontSize: '1.1rem',
      borderRadius: 30,
      cursor: 'pointer',
      backgroundColor: active ? '#1976d2' : '#d0e2f3',
      color: active ? 'white' : '#1976d2',
      border: 'none',
      outline: 'none',
      fontWeight: active ? 700 : 600,
      boxShadow: active ? '0 4px 15px rgba(25, 118, 210, 0.4)' : 'none',
      transition: 'all 0.3s ease',
      margin: '0 8px',
    }),
    contentBox: {
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 220px)',
      padding: 10,
      borderRadius: 8,
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      backgroundColor: '#1976d2',
      color: 'white',
      padding: '12px 15px',
      textAlign: 'left',
      position: 'sticky',
      top: 0,
      zIndex: 2,
    },
    td: {
      padding: '12px 15px',
      borderBottom: '1px solid #eee',
    },
    rowHover: {
      cursor: 'pointer',
      backgroundColor: '#f1f9ff',
      transition: 'background-color 0.2s',
    },
    noData: {
      textAlign: 'center',
      fontStyle: 'italic',
      color: '#777',
      padding: 20,
    },
    headerTitle: {
      textAlign: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      {/* KPIs section */}
      <div style={styles.KPIs}>
        <div style={styles.KPIBox}>
          <div style={styles.KPIValue}>{totalCompleted}</div>
          <div style={{ color: 'white' }}>Total Completed</div>
        </div>
        <div style={styles.KPIBox}>
          <div style={styles.KPIValue}>{thisMonthCount}</div>
          <div style={{ color: 'white' }}>This Month</div>
        </div>
        <div style={styles.KPIBox}>
          <div style={styles.KPIValue}>{totalHours.toFixed(1)}</div>
          <div style={{ color: 'white' }}>Total Hours</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={styles.tabBtn(activeTab === 'today')}
          onClick={() => setActiveTab('today')}
        >
          📍 Today's Assignments ({todaysAssignments.length})
        </button>
        <button
          style={styles.tabBtn(activeTab === 'history')}
          onClick={() => setActiveTab('history')}
        >
          📜 Work History ({employeeHistory.length})
        </button>
      </div>

      {/* Content Area */}
      <div style={styles.contentBox}>
        {activeTab === 'today' && (
          <>
            <div style={styles.headerTitle}>Today's Assignments</div>
            {todaysAssignments.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Store</th>
                    <th style={styles.th}>Address</th>
                    <th style={styles.th}>Contact</th>
                    <th style={styles.th}>Phone</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysAssignments.map((store) => (
                    <tr
                      key={store.id}
                      style={styles.rowHover}
                      tabIndex={0}
                      role="button"
                      aria-label={`Inspect ${store.name}`}
                      onClick={() => handleStoreClick(store.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStoreClick(store.id)}
                    >
                      <td style={styles.td}>{store.name}</td>
                      <td style={styles.td}>{store.address}</td>
                      <td style={styles.td}>{store.contactPerson}</td>
                      <td style={styles.td}>{store.contactNumber}</td>
                      <td style={styles.td}>
                        <button
                          style={{
                            padding: '6px 14px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            border: 'none',
                            borderRadius: 12,
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onClick={(e) => { e.stopPropagation(); handleStoreClick(store.id); }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.noData}>No assignments scheduled for today.</div>
            )}
          </>
        )}
        {activeTab === 'history' && (
          <>
            <div style={styles.headerTitle}>Work History</div>
            {employeeHistory.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Store</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Duration</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeHistory.map((entry) => (
                    <tr key={entry.id} style={{ cursor: 'default' }}>
                      <td style={styles.td}>{entry.storeName}</td>
                      <td style={styles.td}>{formatDate(entry.date)}</td>
                      <td style={styles.td}>{entry.duration}</td>
                      <td style={{ ...styles.td, fontWeight: 600, color: entry.status === 'completed' ? '#4caf50' : '#f57c00' }}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </td>
                      <td style={styles.td}>{entry.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={styles.noData}>No maintenance history found.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
