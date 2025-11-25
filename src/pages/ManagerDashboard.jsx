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
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const rowsPerPage = 10;

  // For modal: Download dummy report file
  const handleDownloadReport = (locId) => {
    // Dummy file - update to whatever path/file you need
    const link = document.createElement('a');
    link.href = '/reports/dummy-location-report.pdf';
    link.download = `${locId}-inspection-report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const flattenedApps = useMemo(() =>
    Object.entries(grouped).flatMap(([locId, apps]) =>
      apps.map((app, idx) => ({ ...app, locId, locRow: idx, locSize: apps.length }))
    ), [grouped]);

  const totalPages = Math.ceil(flattenedApps.length / rowsPerPage);

  const pagedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return flattenedApps.slice(start, start + rowsPerPage);
  }, [flattenedApps, currentPage]);

  const handleSearchChange = (e) => {
    setLocationSearch(e.target.value);
    setCurrentPage(1);
  };

  const getStoreName = (storeId) => {
    const store = mockStores.find(s => s.id === storeId);
    return store ? store.name : 'N/A';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  const kpis = useMemo(() => {
    const totalStores = mockStores.length;
    const allAssignedLocationIds = allEmployees.flatMap(emp => emp.assignedLocations || []).map(locObj => locObj.locationId);
    const uniqueAssignedLocations = Array.from(new Set(allAssignedLocationIds));
    const locationsAssigned = uniqueAssignedLocations.length;
    const employeesAssigned = allEmployees.filter(emp => emp.assignedLocations && emp.assignedLocations.length > 0).length;
    const unassignedEmployees = allEmployees.filter(emp => !emp.assignedLocations || emp.assignedLocations.length === 0).length;
    return { totalStores, locationsAssigned, employeesAssigned, unassignedEmployees };
  }, []);

  const openModal = (locId) => setSelectedLocationId(locId);
  const closeModal = () => setSelectedLocationId(null);

  return (
    <div>
      <Header />
      <main className={`main-content dashboard ${sidebarOpen ? '' : 'sidebar-closed'}`}>
        <div className="dashboard-header">
          <h1>Manager Dashboard</h1>
        </div>

        <div className="kpi-section">
          <div className="kpi-grid">
            <div className="kpi-card"><div className="kpi-content"><h3 className="kpi-label">Total Stores</h3><div className="kpi-value">{kpis.totalStores}</div></div></div>
            <div className="kpi-card"><div className="kpi-content"><h3 className="kpi-label">Locations Assigned</h3><div className="kpi-value">{kpis.locationsAssigned}</div></div></div>
            <div className="kpi-card"><div className="kpi-content"><h3 className="kpi-label">Employees Assigned</h3><div className="kpi-value">{kpis.employeesAssigned}</div></div></div>
            <div className="kpi-card"><div className="kpi-content"><h3 className="kpi-label">Employees Free</h3><div className="kpi-value">{kpis.unassignedEmployees}</div></div></div>
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

        <h2>Appliances List</h2>
        <br />
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
                  <tr key={app.id}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {(currentPage - 1) * rowsPerPage + idx + 1}
                    </td>
                    {app.locRow === 0 && (
                      <td
                        rowSpan={app.locSize}
                        style={{
                          verticalAlign: 'middle',
                          fontWeight: 'bold',
                          padding: '8px',
                          border: '1px solid #ddd',
                          cursor: 'pointer',
                          color: '#1976d2',
                          textDecoration: 'underline'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLocationId(app.locId);
                        }}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedLocationId(app.locId);
                          }
                        }}
                        aria-label={`Show details for location ${app.locId}`}
                      >
                        {app.locId}
                      </td>
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
                                      </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal with dummy inspection and download report button */}
        {selectedLocationId && (
          <div
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            className="modal-overlay"
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            }}
          >
            <div
              className="modal-content"
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: '#fff',
                padding: '24px',
                borderRadius: '8px',
                maxWidth: '450px',
                width: '90%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                position: 'relative',
              }}
            >
              <button
                onClick={closeModal}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                }}
              >&times;</button>
              <h2>Inspection Details for {selectedLocationId}</h2>
              <p><strong>Last Check Date:</strong> 2025-11-01</p>
              <p><strong>Details:</strong> Routine inspection completed. No major issues found. All readings normal.</p>
              <p><strong>Employees Visited:</strong> Dummy Employee</p>
              <button
                onClick={() => handleDownloadReport(selectedLocationId)}
                style={{
                  marginTop: '18px',
                  padding: '10px 20px',
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Download Report
              </button>
            </div>
          </div>
        )}

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
            aria-label="Previous page"
          >Previous</button>
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
            aria-label="Next page"
          >Next</button>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
