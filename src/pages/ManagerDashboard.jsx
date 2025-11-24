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

  const appliancesFiltered = useMemo(() => {
    if (!locationSearch.trim()) return mockAppliances;
    const searchLower = locationSearch.toLowerCase();
    const matchingLocIds = mockLocations
      .filter(loc =>
        loc.id.toLowerCase().includes(searchLower) ||
        loc.city.toLowerCase().includes(searchLower) ||
        loc.region.toLowerCase().includes(searchLower)
      ).map(loc => loc.id);
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

  const handleSearchChange = (e) => {
    setLocationSearch(e.target.value);
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

  let serialNumber = 1;

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

        <div className="stores-table-container">
          <table className="stores-table grouped-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Location ID</th>
                <th>Asset Code</th>
                <th>Name</th>
                <th>Model</th>
                <th>Serial Number</th>
                <th>Category</th>
                <th>AMC Vendor</th>
                <th>AMC Start</th>
                <th>AMC End</th>
                <th>AMC Status</th>
                <th>Store Name</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).length === 0 ? (
                <tr>
                  <td colSpan="12" style={{ textAlign: 'center', padding: '20px' }}>
                    No appliances found.
                  </td>
                </tr>
              ) : (
                Object.entries(grouped).map(([locId, apps]) =>
                  apps.map((app, idx) => (
                    <tr key={app.id} onClick={() => app.storeId && handleStoreClick(app.storeId)} style={{ cursor: app.storeId ? 'pointer' : 'default' }} tabIndex={app.storeId ? 0 : undefined}
                      onKeyDown={(e) => { if(e.key === 'Enter' && app.storeId) handleStoreClick(app.storeId); }} aria-label={`View details for appliance ${app.name}`}>
                      <td>{serialNumber++}</td>
                      {idx === 0 && <td rowSpan={apps.length} style={{ verticalAlign: 'middle', fontWeight: 'bold' }}>{locId}</td>}
                      <td>{app.id}</td>
                      <td>{app.name}</td>
                      <td>{app.model}</td>
                      <td>{app.serialNumber}</td>
                      <td>{app.category}</td>
                      <td>{app.amcVendor}</td>
                      <td>{formatDate(app.amcStartDate)}</td>
                      <td>{formatDate(app.amcEndDate)}</td>
                      <td>{app.amcStatus}</td>
                      <td>{getStoreName(app.storeId)}</td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
