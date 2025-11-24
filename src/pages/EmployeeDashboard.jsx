import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';import Header from '../components/common/Header';

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

const getAssignedStores = (employeeId) => {
  return mockAssignedStores;
};

const EmployeeDashboard = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const assignedStores = getAssignedStores(currentUser.id);

  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);

  const todaysAssignments = assignedStores.filter(store =>
    mockManagementHistory.some(record =>
      record.storeId === store.id &&
      record.employeeId === currentUser.id &&
      new Date(record.date).toISOString().slice(0, 10) === todayString
    )
  );

  const employeeHistory = mockManagementHistory
    .filter(record => record.employeeId === currentUser.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const [activeTab, setActiveTab] = useState('today');

  const handleStoreClick = (storeId) => {
    navigate(`/employee/inspection/${storeId}`);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // KPI values
  const totalStores = assignedStores.length;
  const locationsAssigned = todaysAssignments.length;
  const workCompleted = employeeHistory.length;
  const status = todaysAssignments.length === 0 ? "Free" : "Active";

  return (
     <div>
      <Header />
    <main className={`main-content${sidebarOpen ? '' : ' sidebar-closed'}`}>
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
      </div>

      {/* KPI Section */}
      <div className="kpi-section">
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-content">
              <h3>Total Stores</h3>
              <div className="kpi-value">{totalStores}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-content">
              <h3>Locations Assigned</h3>
              <div className="kpi-value">{locationsAssigned}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-content">
              <h3>Work Completed</h3>
              <div className="kpi-value">{workCompleted}</div>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-content">
              <h3>Status</h3>
              <div className="kpi-value" style={{ fontSize: "2.4rem" }}>{status}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '12px',
        marginBottom: '14px',
        marginTop: '18px'
      }}>
        <button
          style={{
            padding: '10px 36px',
            fontSize: '1.1rem',
            borderRadius: 32,
            cursor: 'pointer',
            backgroundColor: activeTab === 'today' ? '#1976d2' : '#ddeafc',
            color: activeTab === 'today' ? 'white' : '#1976d2',
            border: 'none',
            outline: 'none',
            fontWeight: activeTab === 'today' ? 700 : 600,
            boxShadow: activeTab === 'today' ? '0 4px 15px rgba(25, 118, 210, 0.17)' : 'none',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveTab('today')}
        >
          📍 Today's Assignments ({todaysAssignments.length})
        </button>
        <button
          style={{
            padding: '10px 34px',
            fontSize: '1.1rem',
            borderRadius: 32,
            cursor: 'pointer',
            backgroundColor: activeTab === 'history' ? '#1976d2' : '#ddeafc',
            color: activeTab === 'history' ? 'white' : '#1976d2',
            border: 'none',
            outline: 'none',
            fontWeight: activeTab === 'history' ? 700 : 600,
            boxShadow: activeTab === 'history' ? '0 4px 15px rgba(25, 118, 210, 0.17)' : 'none',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveTab('history')}
        >
          📜 Work History ({employeeHistory.length})
        </button>
      </div>

      {/* Content Box */}
      <div style={{
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 300px)',
        padding: '18px 10px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        margin: '0 10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.045)'
      }}>
        {activeTab === 'today' && (
          <>
            <div style={{
              textAlign: 'center',
              fontSize: '1.51rem',
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#1748a0'
            }}>
              Today's Assignments
            </div>
            {todaysAssignments.length > 0 ? (
              <table className="stores-table grouped-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.06rem' }}>
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Phone</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {todaysAssignments.map((store) => (
                    <tr
                      key={store.id}
                      tabIndex={0}
                      className="row-hover"
                      aria-label={`Inspect ${store.name}`}
                      onClick={() => handleStoreClick(store.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleStoreClick(store.id)}
                    >
                      <td>{store.name}</td>
                      <td>{store.address}</td>
                      <td>{store.contactPerson}</td>
                      <td>{store.contactNumber}</td>
                      <td>
                        <button
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 12,
                            fontWeight: '600',
                            cursor: 'pointer'
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
              <div style={{
                textAlign: 'center',
                fontStyle: 'italic',
                color: '#777',
                padding: 28,
                fontSize: '1.1rem'
              }}>
                No assignments scheduled for today.
              </div>
            )}
          </>
        )}
        {activeTab === 'history' && (
          <>
            <div style={{
              textAlign: 'center',
              fontSize: '1.51rem',
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#1748a0'
            }}>
              Work History
            </div>
            {employeeHistory.length > 0 ? (
              <table className="stores-table grouped-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.06rem' }}>
                <thead>
                  <tr>
                    <th>Store</th>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeHistory.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.storeName}</td>
                      <td>{formatDate(entry.date)}</td>
                      <td>{entry.duration}</td>
                      <td style={{
                        fontWeight: 600,
                        color: entry.status === 'completed' ? '#4caf50' : '#f57c00'
                      }}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </td>
                      <td>{entry.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{
                textAlign: 'center',
                fontStyle: 'italic',
                color: '#777',
                padding: 28,
                fontSize: '1.1rem'
              }}>
                No maintenance history found.
              </div>
            )}
          </>
        )}
      </div>
    </main>
    </div>
  );
};

export default EmployeeDashboard;
