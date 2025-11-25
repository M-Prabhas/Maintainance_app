import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header';
import { mockLocations, mockAppliances, mockStores } from '../data/mockData';

const assignedEmployees = [
  { employeeId: 'E001', name: 'Rajesh Sharma', assignedLocations: [{ locationId: 'L001' }, { locationId: 'L003' }] },
  { employeeId: 'T001', name: 'Arvind Contractor', assignedLocations: [{ locationId: 'L002' }] }
];

const allEmployees = [
  ...assignedEmployees,
  { employeeId: 'E002', name: 'Priya Mehra', assignedLocations: [] }
];

const ManagerDashboard = ({ sidebarOpen }) => {
  const navigate = useNavigate();
  const [locationSearch, setLocationSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const appliancesFiltered = useMemo(() => {
    if (!locationSearch.trim()) return mockAppliances;
    const searchLower = locationSearch.toLowerCase();
    const matchingLocIds = mockLocations
      .filter(loc =>
        loc.id.toLowerCase().includes(searchLower) ||
        loc.city.toLowerCase().includes(searchLower) ||
        loc.region.toLowerCase().includes(searchLower)
      )
      .map(loc => loc.id);
    return mockAppliances.filter(app => matchingLocIds.includes(app.locationId));
  }, [locationSearch]);

  const grouped = useMemo(() => {
    const groups = {};
    appliancesFiltered.forEach(app => {
      if (!groups[app.locationId]) groups[app.locationId] = [];
      groups[app.locationId].push(app);
    });
    return groups;
  }, [appliancesFiltered]);

  // Flatten grouped for pagination while preserving location grouping info
  const flattenedApps = useMemo(() => {
    return Object.entries(grouped).flatMap(([locId, apps]) =>
      apps.map((app, idx) => ({ ...app, locId, locRow: idx, locSize: apps.length }))
    );
  }, [grouped]);

  const totalPages = Math.ceil(flattenedApps.length / rowsPerPage);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return flattenedApps.slice(start, start + rowsPerPage);
  }, [flattenedApps, currentPage]);

  const handleSearchChange = (e) => {
    setLocationSearch(e.target.value);
    setCurrentPage(1); // reset page on new search
  };

  const getStoreName = (storeId) => {
    const store = mockStores.find(s => s.id === storeId);
    return store ? store.name : 'N/A';
  };

  const handleStoreClick = (storeId) => {
    if (storeId) navigate(`/manager/store/${storeId}`);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // KPIs calculation
  const kpis = useMemo(() => {
    const totalStores = mockStores.length;

    const allAssignedLocationIds = allEmployees
      .flatMap(emp => emp.assignedLocations || [])
      .map(locObj => locObj.locationId);
    const uniqueAssignedLocations = Array.from(new Set(allAssignedLocationIds));
    const locationsAssigned = uniqueAssignedLocations.length;

    const employeesAssigned = allEmployees.filter(emp => (emp.assignedLocations && emp.assignedLocations.length > 0)).length;

    const unassignedEmployees = allEmployees.filter(emp => !emp.assignedLocations || emp.assignedLocations.length === 0).length;

    return {
      totalStores,
      locationsAssigned,
      employeesAssigned,
      unassignedEmployees,
    };
  }, []);

  return (
    <div>
      <Header />
      <main className={`main-content dashboard ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <div className="dashboard-header">
          <h1>Manager Dashboard</h1>
        </div>

        <div className="kpi-section">
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-content">
                <h3>Total Stores</h3>
                <div className="kpi-value">{kpis.totalStores}</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-content">
                <h3>Locations Assigned</h3>
                <div className="kpi-value">{kpis.locationsAssigned}</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-content">
                <h3>Employees Assigned</h3>
                <div className="kpi-value">{kpis.employeesAssigned}</div>
              </div>
            </div>
            <div className="kpi-card">
              <div className="kpi-content">
                <h3>Employees Free</h3>
                <div className="kpi-value">{kpis.unassignedEmployees}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="location-search">
          <h3>Search Location (ID or Name)</h3>
          <input
            type="text"
            placeholder="Type location ID, city or region"
            value={locationSearch}
            onChange={handleSearchChange}
            style={{
              padding: '10px 14px',
              fontSize: '1rem',
              borderRadius: '6px',
              border: '1.5px solid #cbd5e1',
              marginBottom: '20px',
              width: '300px',
              maxWidth: '100%',
            }}
            aria-label="Search locations"
          />
        </div>
        <h3>Appliances List</h3>
        <div className="stores-table-scroll" style={{ maxHeight: '430px', overflowY: 'auto' }}>
          
          <table className="stores-table grouped-table" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
           <tr style={{ backgroundColor: '#f5f5f5', color: '#222' }}>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>S.No</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Location ID</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Asset Code</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Model</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Serial Number</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Category</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>AMC Vendor</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>AMC Start</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>AMC End</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>AMC Status</th>
                <th style={{ padding: '8px', border: '1px solid #ddd' }}>Store Name</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>
                    No appliances found.
                  </td>
                </tr>
              ) : (
                pagedData.map((app, idx) => (
                  <tr
                    key={app.id}
                    onClick={() => app.storeId && handleStoreClick(app.storeId)}
                    style={{ cursor: app.storeId ? 'pointer' : 'default' }}
                    tabIndex={app.storeId ? 0 : undefined}
                    onKeyDown={(e) => { if (e.key === 'Enter' && app.storeId) handleStoreClick(app.storeId); }}
                    aria-label={`View details for appliance ${app.name}`}
                  >
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                    {app.locRow === 0 && (
                      <td rowSpan={app.locSize} style={{ verticalAlign: 'middle', fontWeight: 'bold', padding: '8px', border: '1px solid #ddd' }}>{app.locId}</td>
                    )}
                    <td style={{ padding: '8px', border: '1px solid #5e1ee7ff' }}>{app.id}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.name}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.model}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.serialNumber}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.category}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.amcVendor}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(app.amcStartDate)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(app.amcEndDate)}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{app.amcStatus}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{getStoreName(app.storeId)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={currentPage === 1}
            style={{
              padding: '10px 20px',
              backgroundColor: currentPage === 1 ? '#e0e0e0' : '#1976d2',
              color: currentPage === 1 ? '#9e9e9e' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              boxShadow: currentPage === 1 ? 'none' : '0 2px 5px rgba(25, 118, 210, 0.4)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1565c0';
            }}
            onMouseOut={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1976d2';
            }}
            aria-label="Previous page"
          >
            Previous
          </button>

          <span style={{ alignSelf: 'center', fontWeight: '600' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 20px',
              backgroundColor: currentPage === totalPages ? '#e0e0e0' : '#1976d2',
              color: currentPage === totalPages ? '#9e9e9e' : '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              boxShadow: currentPage === totalPages ? 'none' : '0 2px 5px rgba(25, 118, 210, 0.4)',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1565c0';
            }}
            onMouseOut={(e) => {
              if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1976d2';
            }}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
