import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';

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

const rowsPerPage = 10;

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

  // Tabs and pagination states
  const [activeTab, setActiveTab] = useState('today');
  const [currentPageToday, setCurrentPageToday] = useState(1);
  const [currentPageHistory, setCurrentPageHistory] = useState(1);

  useEffect(() => {
    if (activeTab === 'today') setCurrentPageToday(1);
    else setCurrentPageHistory(1);
  }, [activeTab]);

  const pagedTodaysAssignments = useMemo(() => {
    const start = (currentPageToday - 1) * rowsPerPage;
    return todaysAssignments.slice(start, start + rowsPerPage);
  }, [todaysAssignments, currentPageToday]);

  const totalTodayPages = Math.max(1, Math.ceil(todaysAssignments.length / rowsPerPage));

  const pagedEmployeeHistory = useMemo(() => {
    const start = (currentPageHistory - 1) * rowsPerPage;
    return employeeHistory.slice(start, start + rowsPerPage);
  }, [employeeHistory, currentPageHistory]);

  const totalHistoryPages = Math.max(1, Math.ceil(employeeHistory.length / rowsPerPage));

  const handleStoreClick = (storeId) => {
    navigate(`/employee/inspection/${storeId}`);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const totalStores = assignedStores.length;
  const locationsAssigned = todaysAssignments.length;
  const workCompleted = employeeHistory.length;
  const status = todaysAssignments.length === 0 ? "Free" : "Active";

  // Pagination button style helper
  const paginationButtonStyle = (disabled) => ({
    padding: '10px 20px',
    backgroundColor: disabled ? '#e0e0e0' : '#1976d2',
    color: disabled ? '#9e9e9e' : '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '600',
    boxShadow: disabled ? 'none' : '0 2px 5px rgba(25, 118, 210, 0.4)',
    transition: 'background-color 0.3s ease',
  });

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
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 'clamp(6px, 2vw, 12px)', marginBottom: '14px', marginTop: '18px', flexWrap: 'wrap' }}>
          <button
            style={{
              padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 36px)',
              fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)',
              borderRadius: 32,
              cursor: 'pointer',
              backgroundColor: activeTab === 'today' ? '#1976d2' : '#ddeafc',
              color: activeTab === 'today' ? 'white' : '#1976d2',
              border: 'none',
              outline: 'none',
              fontWeight: activeTab === 'today' ? 700 : 600,
              boxShadow: activeTab === 'today' ? '0 4px 15px rgba(25, 118, 210, 0.17)' : 'none',
              transition: 'all 0.3s ease',
              minHeight: '44px',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setActiveTab('today')}
          >
            📍 Today's ({todaysAssignments.length})
          </button>
          <button
            style={{
              padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 34px)',
              fontSize: 'clamp(0.8rem, 2.5vw, 1.1rem)',
              borderRadius: 32,
              cursor: 'pointer',
              backgroundColor: activeTab === 'history' ? '#1976d2' : '#ddeafc',
              color: activeTab === 'history' ? 'white' : '#1976d2',
              border: 'none',
              outline: 'none',
              fontWeight: activeTab === 'history' ? 700 : 600,
              boxShadow: activeTab === 'history' ? '0 4px 15px rgba(25, 118, 210, 0.17)' : 'none',
              transition: 'all 0.3s ease',
              minHeight: '44px',
              whiteSpace: 'nowrap',
            }}
            onClick={() => setActiveTab('history')}
          >
            📜 History ({employeeHistory.length})
          </button>
        </div>

        {/* Scrollable content box */}
        <div
          style={{
            overflowY: 'auto',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            maxHeight: 'calc(100vh - 380px)',
            padding: 'clamp(10px, 2.5vw, 18px)',
            borderRadius: '8px',
            backgroundColor: '#fff',
            margin: '0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.045)',
          }}
        >
          {activeTab === 'today' && (
            <>{todaysAssignments.length > 0 ? (
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="stores-table grouped-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(0.75rem, 2vw, 1.06rem)', minWidth: '500px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', color: '#222' }}>
                      <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Store</th>
                      <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Address</th>
                      <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Contact</th>
                      <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Phone</th>
                      <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedTodaysAssignments.map(store => (
                      <tr
                        key={store.id}
                        tabIndex={0}
                        className="row-hover"
                        aria-label={`Inspect ${store.name}`}
                        onClick={() => handleStoreClick(store.id)}
                        onKeyDown={e => e.key === 'Enter' && handleStoreClick(store.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>{store.name}</td>
                        <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>{store.address}</td>
                        <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>{store.contactPerson}</td>
                        <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>{store.contactNumber}</td>
                        <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>
                          <button
                            style={{ padding: 'clamp(6px, 1.5vw, 10px) clamp(10px, 2.5vw, 16px)', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: 12, fontWeight: '600', cursor: 'pointer', minHeight: '44px', fontSize: 'clamp(0.75rem, 2vw, 0.9rem)' }}
                            onClick={e => { e.stopPropagation(); handleStoreClick(store.id); }}
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#777', padding: 'clamp(16px, 4vw, 28px)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>
                  No assignments scheduled for today.
                </div>
              )}
            </>
          )}

          {activeTab === 'history' && (
            <>
                <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {employeeHistory.length > 0 ? (
                  <table className="stores-table grouped-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(0.75rem, 2vw, 1.06rem)', minWidth: '500px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f5f5f5', color: '#222' }}>
                        <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Store</th>
                        <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Date</th>
                        <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Duration</th>
                        <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Status</th>
                        <th style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedEmployeeHistory.map(entry => (
                        <tr key={entry.id}>
                          <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>{entry.storeName}</td>
                          <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>{formatDate(entry.date)}</td>
                          <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>{entry.duration}</td>
                          <td style={{
                            fontWeight: 600,
                            color: entry.status === 'completed' ? '#4caf50' : '#f57c00',
                            padding: 'clamp(6px, 1.5vw, 10px)',
                            border: '1px solid #ddd',
                          }}>
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </td>
                          <td style={{ padding: 'clamp(6px, 1.5vw, 10px)', border: '1px solid #ddd' }}>{entry.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#777', padding: 'clamp(16px, 4vw, 28px)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>
                    No maintenance history found.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Pagination Controls - always visible outside scrollable container */}
        <div style={{ marginTop: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: 'clamp(8px, 2vw, 16px)', flexWrap: 'wrap', padding: '0 8px' }}>
          <button
            onClick={() => activeTab === 'today' ? setCurrentPageToday(p => Math.max(1, p - 1)) : setCurrentPageHistory(p => Math.max(1, p - 1))}
            disabled={(activeTab === 'today' ? currentPageToday : currentPageHistory) === 1}
            style={{
              ...paginationButtonStyle((activeTab === 'today' ? currentPageToday : currentPageHistory) === 1),
              minHeight: '44px',
              fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
            }}
            onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1565c0'; }}
            onMouseOut={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1976d2'; }}
            aria-label="Previous page"
          >
            Previous
          </button>

          <span style={{ alignSelf: 'center', fontWeight: '600', fontSize: 'clamp(0.8rem, 2.5vw, 1rem)' }}>
            Page {activeTab === 'today' ? currentPageToday : currentPageHistory} of {activeTab === 'today' ? totalTodayPages : totalHistoryPages}
          </span>

          <button
            onClick={() => activeTab === 'today' ? setCurrentPageToday(p => Math.min(totalTodayPages, p + 1)) : setCurrentPageHistory(p => Math.min(totalHistoryPages, p + 1))}
            disabled={(activeTab === 'today' ? currentPageToday : currentPageHistory) === (activeTab === 'today' ? totalTodayPages : totalHistoryPages)}
            style={{
              ...paginationButtonStyle((activeTab === 'today' ? currentPageToday : currentPageHistory) === (activeTab === 'today' ? totalTodayPages : totalHistoryPages)),
              minHeight: '44px',
              fontSize: 'clamp(0.8rem, 2.5vw, 1rem)',
            }}
            onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1565c0'; }}
            onMouseOut={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1976d2'; }}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
