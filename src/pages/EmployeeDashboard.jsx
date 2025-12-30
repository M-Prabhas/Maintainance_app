import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { FaStore, FaClipboardList, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { mockLocations } from '../data/mockData';

// Fix for default Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom numbered icon
const createNumberedIcon = (number) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: #2563eb;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Component to fit bounds
const FitBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  return null;
};

// Mock Data
const mockAssignedStores = [
  { id: 1, name: 'Central Mall', address: '123 Main St, Cityville', contactPerson: 'John Doe', contactNumber: '9876543210', locationId: 'inmumbandheri' },
  { id: 2, name: 'Eastside Plaza', address: '456 East Rd, Townsville', contactPerson: 'Jane Smith', contactNumber: '9123456780', locationId: 'inmumbandra' },
  { id: 3, name: 'West End Store', address: '789 West Ave, Villagetown', contactPerson: 'Alan Brown', contactNumber: '9988776655', locationId: 'indelcp' },
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

const MapModal = ({ locations, onClose, onUpdateOrder, readOnly = false }) => {
  if (!locations || locations.length === 0) return null;

  const polylinePositions = locations.map(l => [l.lat, l.lng]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', borderRadius: '12px',
        width: '90%', maxWidth: '900px', height: '80vh', position: 'relative', display: 'flex',
        overflowX: 'auto', overflowY: 'hidden' // Allow horizontal scroll
      }}>
        {/* Sidebar for List */}
        <div style={{ width: '300px', minWidth: '300px', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb', flexShrink: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{readOnly ? 'Assigned Locations' : 'Route Order'}</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {locations.map((loc, index) => (
              <div key={loc.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px', marginBottom: '8px', backgroundColor: 'white',
                borderRadius: '8px', border: '1px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%', background: '#2563eb', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                }}>
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{loc.city}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{loc.id}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Area */}
        <div style={{ flex: 1, minWidth: '350px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '15px', right: '15px',
              background: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer', zIndex: 1000,
              width: '36px', height: '36px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            &times;
          </button>

          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <FitBounds locations={locations} />
            <Polyline positions={polylinePositions} color="blue" />
            {locations.map((loc, index) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={createNumberedIcon(index + 1)}
              >
                <Popup>
                  <strong>{index + 1}. {loc.city}</strong><br />
                  {loc.id}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { tasks } = useApp(); // Get tasks from context

  const assignedStores = getAssignedStores(currentUser.id);

  const today = new Date();
  const todayString = today.toISOString().slice(0, 10);
  // Filter tasks from context for history
  const employeeHistory = tasks
    .filter(record =>
      record.employeeId === currentUser.id &&
      record.approved === true // ONLY show approved tasks in history
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Determine today's assignments (Assigned but not yet in history/completed)
  // For this mock, we keep using 'assignedStores' but we check if they are done?
  // The requirement says "Dual-tab... Today's Tasks and Work History... Completed tasks transition to Work History ONCE manager grants approval"
  // So "Today's Tasks" should probably be separate from History.

  // Let's keep existing logic for "Today's Assignments" for now as it relies on `assignedStores` which comes from a helper,
  // but ensure History uses the new `tasks` state filtered by `approved`.

  const todaysAssignments = assignedStores.filter(store =>
    // Logic to hide if completed and approved? Or just assigned. 
    // Usually "Today's Tasks" are things TO DO. 
    // If it's done and approved, it moves to history.
    !employeeHistory.some(h => h.storeId === store.id && new Date(h.date).toISOString().slice(0, 10) === todayString)
  );

  // Tabs and pagination states
  const [activeTab, setActiveTab] = useState('today');
  const [currentPageToday, setCurrentPageToday] = useState(1);
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const [showMap, setShowMap] = useState(false);
  const [todayFilters, setTodayFilters] = useState({});
  const [historyFilters, setHistoryFilters] = useState({});

  useEffect(() => {
    if (activeTab === 'today') setCurrentPageToday(1);
    else setCurrentPageHistory(1);
  }, [activeTab]);

  const handleTodayFilterChange = (key, value) => {
    setTodayFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPageToday(1);
  };

  const handleHistoryFilterChange = (key, value) => {
    setHistoryFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPageHistory(1);
  };

  const filteredTodaysAssignments = useMemo(() => {
    return todaysAssignments.filter(store => {
      return Object.entries(todayFilters).every(([key, value]) => {
        if (!value) return true;
        const cellValue = String(store[key] || '').toLowerCase();
        return cellValue.includes(value.toLowerCase());
      });
    });
  }, [todaysAssignments, todayFilters]);

  const uniqueHistoryStatuses = ['completed', 'pending', 'support_assist', 'not_accepted'];
  const filteredEmployeeHistory = useMemo(() => {
    return employeeHistory.filter(entry => {
      return Object.entries(historyFilters).every(([key, value]) => {
        if (!value) return true;
        let cellValue;
        if (key === 'date') {
          // entry.date is likely YYYY-MM-DD or ISO
          cellValue = String(entry.date || '').toLowerCase();
          // if value is YYYY-MM-DD from input, we can check includes
          return cellValue.includes(value);
        } else if (key === 'status') {
          cellValue = String(entry[key] || '').toLowerCase();
          return cellValue === value.toLowerCase();
        } else {
          cellValue = String(entry[key] || '').toLowerCase();
        }
        return cellValue.includes(value.toLowerCase());
      });
    });
  }, [employeeHistory, historyFilters]);

  const pagedTodaysAssignments = useMemo(() => {
    const start = (currentPageToday - 1) * rowsPerPage;
    return filteredTodaysAssignments.slice(start, start + rowsPerPage);
  }, [filteredTodaysAssignments, currentPageToday]);

  const totalTodayPages = Math.max(1, Math.ceil(filteredTodaysAssignments.length / rowsPerPage));

  const pagedEmployeeHistory = useMemo(() => {
    const start = (currentPageHistory - 1) * rowsPerPage;
    return filteredEmployeeHistory.slice(start, start + rowsPerPage);
  }, [filteredEmployeeHistory, currentPageHistory]);

  const totalHistoryPages = Math.max(1, Math.ceil(filteredEmployeeHistory.length / rowsPerPage));

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

  const mapLocations = useMemo(() => {
    return filteredTodaysAssignments.map(store => {
      const loc = mockLocations.find(l => l.id === store.locationId);
      return loc ? { ...loc, city: store.name } : null;
    }).filter(Boolean);
  }, [filteredTodaysAssignments]);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
      </div>

      {/* KPI Section */}
      {/* KPI Section */}
      <div className="kpi-section">
        <div className="kpi-grid">
          {/* KPI 1: Total Stores */}
          <div className="kpi-card">
            <div className="kpi-top-row">
              <div className="kpi-content">
                <h3>Total Locations</h3>
                <div className="kpi-value">{totalStores}</div>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' }}>
                <FaStore />
              </div>
            </div>
            <div className="kpi-progress-container">
              <div className="kpi-progress-track">
                <div className="kpi-progress-fill" style={{ width: '100%', backgroundColor: '#1976d2' }}></div>
              </div>
              <div className="kpi-progress-text">100% Assigned</div>
            </div>
          </div>

          {/* KPI 2: Locations Assigned */}
          <div className="kpi-card">
            <div className="kpi-top-row">
              <div className="kpi-content">
                <h3>Locations Assigned</h3>
                <div className="kpi-value">{locationsAssigned}</div>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#f57c00' }}>
                <FaClipboardList />
              </div>
            </div>
            <div className="kpi-progress-container">
              <div className="kpi-progress-track">
                <div
                  className="kpi-progress-fill"
                  style={{
                    width: `${totalStores ? (locationsAssigned / totalStores) * 100 : 0}%`,
                    backgroundColor: '#f57c00'
                  }}
                ></div>
              </div>
              <div className="kpi-progress-text">
                {totalStores ? Math.round((locationsAssigned / totalStores) * 100) : 0}% of scope
              </div>
            </div>
          </div>

          {/* KPI 3: Work Completed */}
          <div className="kpi-card">
            <div className="kpi-top-row">
              <div className="kpi-content">
                <h3>Completed Locations</h3>
                <div className="kpi-value">{workCompleted}</div>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                <FaCheckCircle />
              </div>
            </div>
            <div className="kpi-progress-container">
              <div className="kpi-progress-track">
                <div className="kpi-progress-fill" style={{ width: '100%', backgroundColor: '#4caf50' }}></div>
              </div>
              <div className="kpi-progress-text">Total History</div>
            </div>
          </div>

          {/* KPI 4: Status */}
          <div className="kpi-card">
            <div className="kpi-top-row">
              <div className="kpi-content">
                <h3>Status</h3>
                <div className="kpi-value" style={{ fontSize: "2rem" }}>{status}</div>
              </div>
              <div className="kpi-icon" style={{ backgroundColor: 'rgba(233, 30, 99, 0.1)', color: '#e91e63' }}>
                <FaInfoCircle />
              </div>
            </div>
            <div className="kpi-progress-container">
              <div className="kpi-progress-track">
                <div
                  className="kpi-progress-fill"
                  style={{
                    width: status === 'Active' ? '100%' : '0%',
                    backgroundColor: '#e91e63'
                  }}
                ></div>
              </div>
              <div className="kpi-progress-text">{status === 'Active' ? 'Occupied' : 'Standing By'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Map Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', marginTop: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '1.1rem',
              borderRadius: 10,
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
            Today's Assignments ({todaysAssignments.length})
          </button>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '1.1rem',
              borderRadius: 10,
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
            Work History ({employeeHistory.length})
          </button>
        </div>

        <button
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: 10,
            cursor: 'pointer',
            backgroundColor: '#fff',
            color: '#1976d2',
            border: '1px solid #1976d2',
            outline: 'none',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setShowMap(true)}
        >
          <span>🗺️</span> View Map
        </button>
      </div>

      {/* Scrollable content box */}
      <div
        style={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 360px)', // Adjust for pagination controls height
          padding: '18px 10px',
          borderRadius: '8px',
          backgroundColor: '#fff',
          margin: '0 10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.045)',
        }}
      >
        {activeTab === 'today' && (
          <>{todaysAssignments.length > 0 ? (
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>
                      <div className="header-cell-content">
                        Store
                        <input
                          type="text"
                          className="filter-input"
                          placeholder="Filter..."
                          value={todayFilters.name || ''}
                          onChange={(e) => handleTodayFilterChange('name', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </th>
                    <th>
                      <div className="header-cell-content">
                        Address
                        <input
                          type="text"
                          className="filter-input"
                          placeholder="Filter..."
                          value={todayFilters.address || ''}
                          onChange={(e) => handleTodayFilterChange('address', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </th>
                    <th>
                      <div className="header-cell-content">
                        Contact
                        <input
                          type="text"
                          className="filter-input"
                          placeholder="Filter..."
                          value={todayFilters.contactPerson || ''}
                          onChange={(e) => handleTodayFilterChange('contactPerson', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </th>
                    <th>
                      <div className="header-cell-content">
                        Phone
                        <input
                          type="text"
                          className="filter-input"
                          placeholder="Filter..."
                          value={todayFilters.contactNumber || ''}
                          onChange={(e) => handleTodayFilterChange('contactNumber', e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </th>
                    <th>Action</th>
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
                      <td>{store.name}</td>
                      <td>{store.address}</td>
                      <td>{store.contactPerson}</td>
                      <td>{store.contactNumber}</td>
                      <td>
                        <button
                          style={{ padding: '8px 16px', backgroundColor: '#1976d2', color: '#fff', border: 'none', borderRadius: 12, fontWeight: '600', cursor: 'pointer' }}
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
            <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#777', padding: 28, fontSize: '1.1rem' }}>
              No assignments scheduled for today.
            </div>
          )}
          </>
        )}

        {activeTab === 'history' && (
          <>
            <div>
              {employeeHistory.length > 0 ? (
                <div className="dashboard-table-container">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>
                          <div className="header-cell-content">
                            Store
                            <input
                              type="text"
                              className="filter-input"
                              placeholder="Filter..."
                              value={historyFilters.storeName || ''}
                              onChange={(e) => handleHistoryFilterChange('storeName', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </th>
                        <th>
                          <div className="header-cell-content">
                            Date
                            <input
                              type="date"
                              className="filter-input"
                              value={historyFilters.date || ''}
                              onChange={(e) => handleHistoryFilterChange('date', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </th>
                        <th>
                          <div className="header-cell-content">
                            Duration
                            <input
                              type="text"
                              className="filter-input"
                              placeholder="Filter..."
                              value={historyFilters.duration || ''}
                              onChange={(e) => handleHistoryFilterChange('duration', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </th>
                        <th>
                          <div className="header-cell-content">
                            Status
                            <select
                              className="filter-input"
                              value={historyFilters.status || ''}
                              onChange={(e) => handleHistoryFilterChange('status', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="">All</option>
                              {uniqueHistoryStatuses.map(status => (
                                <option key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </th>
                        <th>
                          <div className="header-cell-content">
                            Remarks
                            <input
                              type="text"
                              className="filter-input"
                              placeholder="Filter..."
                              value={historyFilters.remarks || ''}
                              onChange={(e) => handleHistoryFilterChange('remarks', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pagedEmployeeHistory.map(entry => (
                        <tr key={entry.id}>
                          <td>{entry.storeName}</td>
                          <td>{formatDate(entry.date)}</td>
                          <td>{entry.duration}</td>
                          <td>
                            <span className={`status-badge ${entry.status === 'completed' ? 'status-active' : 'status-pending'}`}>
                              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1).replace('_', ' ')}
                            </span>
                          </td>
                          <td>{entry.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#777', padding: 28, fontSize: '1.1rem' }}>
                  No maintenance history found.
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Pagination Controls - always visible outside scrollable container */}
      <div style={{ marginTop: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button
          onClick={() => activeTab === 'today' ? setCurrentPageToday(p => Math.max(1, p - 1)) : setCurrentPageHistory(p => Math.max(1, p - 1))}
          disabled={(activeTab === 'today' ? currentPageToday : currentPageHistory) === 1}
          style={paginationButtonStyle((activeTab === 'today' ? currentPageToday : currentPageHistory) === 1)}
          onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1565c0'; }}
          onMouseOut={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1976d2'; }}
          aria-label="Previous page"
        >
          Previous
        </button>

        <span style={{ alignSelf: 'center', fontWeight: '600' }}>
          Page {activeTab === 'today' ? currentPageToday : currentPageHistory} of {activeTab === 'today' ? totalTodayPages : totalHistoryPages}
        </span>

        <button
          onClick={() => activeTab === 'today' ? setCurrentPageToday(p => Math.min(totalTodayPages, p + 1)) : setCurrentPageHistory(p => Math.min(totalHistoryPages, p + 1))}
          disabled={(activeTab === 'today' ? currentPageToday : currentPageHistory) === (activeTab === 'today' ? totalTodayPages : totalHistoryPages)}
          style={paginationButtonStyle((activeTab === 'today' ? currentPageToday : currentPageHistory) === (activeTab === 'today' ? totalTodayPages : totalHistoryPages))}
          onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1565c0'; }}
          onMouseOut={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1976d2'; }}
          aria-label="Next page"
        >
          Next
        </button>
      </div>

      {showMap && (
        <MapModal
          locations={mapLocations}
          onClose={() => setShowMap(false)}
          readOnly={true}
        />
      )}
    </div >
  );
};

export default EmployeeDashboard;
