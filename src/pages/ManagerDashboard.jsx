import React, { useState, useMemo } from 'react';

import { useApp } from '../context/AppContext'; // Import useApp to access context
import { FaStore, FaMapMarkerAlt, FaUsers, FaUserClock } from 'react-icons/fa';
import { mockLocations, mockAppliances, mockStores } from '../data/mockData';

const assignedEmployees = [
  { employeeId: 'E001', name: 'Rajesh Sharma', assignedLocations: [{ locationId: 'L001' }, { locationId: 'L003' }] },
  { employeeId: 'T001', name: 'Arvind Contractor', assignedLocations: [{ locationId: 'L002' }] }
];
const allEmployees = [
  ...assignedEmployees,
  { employeeId: 'E002', name: 'Priya Mehra', assignedLocations: [] }
];

const ManagerDashboard = () => {
  // State Definitions
  const [locationSearch, setLocationSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLocationId, setSelectedLocationId] = useState(null);

  // Reassignment Modal State
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [managerRemark, setManagerRemark] = useState('');
  const [reassignDate, setReassignDate] = useState('');

  const rowsPerPage = 10;

  // Context
  const { tasks, approveTask, reassignTask } = useApp();

  // For modal: Download dummy report file
  const handleDownloadReport = (locId) => {
    const link = document.createElement('a');
    link.href = '/reports/dummy-location-report.pdf';
    link.download = `${locId}-inspection-report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Use a more robust check or fallback
  const currentTask = tasks.find(t => t.storeName.toLowerCase().includes(selectedLocationId?.toLowerCase()) || t.id === 101);
  const isApproved = currentTask?.approved;
  const isCompleted = currentTask?.status === 'completed';

  const handleApprove = () => {
    if (currentTask) {
      approveTask(currentTask.id);
      alert(`Inspection for ${selectedLocationId} approved!`);
      setSelectedLocationId(null);
    }
  };

  const openReassignModal = () => {
    setManagerRemark('');
    setReassignDate(''); // Reset date
    setIsReassignModalOpen(true);
  };

  const confirmReassign = () => {
    if (!reassignDate) {
      alert('Assignment Date is mandatory.');
      return;
    }
    if (!managerRemark.trim()) {
      alert('Manager Remark is mandatory for reassignment.');
      return;
    }

    if (currentTask) {
      // In a real app, we would pass reassignDate too.
      // For now, reassignTask might only accept remarks, but we'll assume we capture the date logic here.
      // We append date to remark for visibility in this mock.
      const fullRemark = `[Reassigned for ${reassignDate}] ${managerRemark}`;
      reassignTask(currentTask.id, fullRemark);
      alert(`Reassigned inspection for location ${selectedLocationId} to same employee for ${reassignDate}.`);
    }

    setIsReassignModalOpen(false);
    setSelectedLocationId(null);
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

  return (
    <div>

      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Manager Dashboard</h1>
        </div>

        <div className="kpi-section">
          <div className="kpi-grid">
            {/* KPI 1: Total Stores */}
            <div className="kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-content">
                  <h3>Total Locations</h3>
                  <div className="kpi-value">{kpis.totalStores}</div>
                </div>
                <div className="kpi-icon" style={{ backgroundColor: 'rgba(25, 118, 210, 0.1)', color: '#1976d2' }}>
                  <FaStore />
                </div>
              </div>
              <div className="kpi-progress-container">
                <div className="kpi-progress-track">
                  <div className="kpi-progress-fill" style={{ width: '100%', backgroundColor: '#1976d2' }}></div>
                </div>
                <div className="kpi-progress-text">100% of inventory</div>
              </div>
            </div>

            {/* KPI 2: Locations Assigned */}
            <div className="kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-content">
                  <h3>Locations Assigned</h3>
                  <div className="kpi-value">{kpis.locationsAssigned}</div>
                </div>
                <div className="kpi-icon" style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', color: '#f57c00' }}>
                  <FaMapMarkerAlt />
                </div>
              </div>
              <div className="kpi-progress-container">
                <div className="kpi-progress-track">
                  <div
                    className="kpi-progress-fill"
                    style={{
                      width: `${kpis.totalStores ? (kpis.locationsAssigned / kpis.totalStores) * 100 : 0}%`,
                      backgroundColor: '#f57c00'
                    }}
                  ></div>
                </div>
                <div className="kpi-progress-text">
                  {kpis.totalStores ? Math.round((kpis.locationsAssigned / kpis.totalStores) * 100) : 0}% of total
                </div>
              </div>
            </div>

            {/* KPI 3: Employees Assigned */}
            <div className="kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-content">
                  <h3>Employees Assigned</h3>
                  <div className="kpi-value">{kpis.employeesAssigned}</div>
                </div>
                <div className="kpi-icon" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' }}>
                  <FaUsers />
                </div>
              </div>
              <div className="kpi-progress-container">
                <div className="kpi-progress-track">
                  <div
                    className="kpi-progress-fill"
                    style={{
                      width: `${allEmployees.length ? (kpis.employeesAssigned / allEmployees.length) * 100 : 0}%`,
                      backgroundColor: '#4caf50'
                    }}
                  ></div>
                </div>
                <div className="kpi-progress-text">
                  {allEmployees.length ? Math.round((kpis.employeesAssigned / allEmployees.length) * 100) : 0}% of workforce
                </div>
              </div>
            </div>

            {/* KPI 4: Employees Free */}
            <div className="kpi-card">
              <div className="kpi-top-row">
                <div className="kpi-content">
                  <h3>Employees Available</h3>
                  <div className="kpi-value">{kpis.unassignedEmployees}</div>
                </div>
                <div className="kpi-icon" style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', color: '#f44336' }}>
                  <FaUserClock />
                </div>
              </div>
              <div className="kpi-progress-container">
                <div className="kpi-progress-track">
                  <div
                    className="kpi-progress-fill"
                    style={{
                      width: `${allEmployees.length ? (kpis.unassignedEmployees / allEmployees.length) * 100 : 0}%`,
                      backgroundColor: '#f44336'
                    }}
                  ></div>
                </div>
                <div className="kpi-progress-text">
                  {allEmployees.length ? Math.round((kpis.unassignedEmployees / allEmployees.length) * 100) : 0}% of workforce
                </div>
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
            onClick={() => setSelectedLocationId(null)}
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
                onClick={() => setSelectedLocationId(null)}
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

              {/* Approval Button */}
              <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                <div style={{ marginBottom: '10px', fontSize: '0.9rem', color: '#555' }}>
                  <strong>Status:</strong> {
                    isApproved ? 'Approved ✅' :
                      isCompleted ? 'Pending Approval ⏳' :
                        currentTask?.status === 'support_assist' ? 'Support Assist 🆘' :
                          currentTask?.status === 'not_accepted' ? 'Not Done ❌' :
                            (currentTask?.status || 'In Progress')
                  }
                </div>
                {!isApproved && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {/* Show Approve ONLY if status is 'completed' */}
                    {isCompleted && (
                      <button
                        onClick={handleApprove}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#2e7d32',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>✓</span> Approve
                      </button>
                    )}

                    {/* Show Reassign ONLY if status is 'support_assist' or 'not_accepted' (or just NOT completed implies issue?)
                        The user said: "in case of other two options not show approve button and reassign button...".
                        Let's rely on !isCompleted + explicit check if needed, or just show Reassign if not completed.
                        Given 'In Progress' shouldn't show buttons, we should check for pending review statuses.
                        We'll check: status === 'not_accepted' || status === 'support_assist'
                    */}
                    {(currentTask?.status === 'not_accepted' || currentTask?.status === 'support_assist') && (
                      <button
                        onClick={openReassignModal}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#f57c00',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>↺</span> Reassign
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reassignment Modal - customized as Assignment Form */}
        {isReassignModalOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="modal-overlay"
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1100,
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
          >
            <div style={{
              backgroundColor: '#fff', padding: '24px', borderRadius: '12px',
              maxWidth: '500px', width: '90%', boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              maxHeight: '90vh', overflowY: 'auto'
            }}>
              <h2 style={{ marginTop: 0, color: '#1976d2' }}>Reassign Task</h2>

              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f5f9ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem', color: '#1e3a8a' }}>
                  <strong>Assigning to:</strong> {currentTask?.employeeName || 'Original Employee'} <span style={{ fontSize: '0.8rem', color: '#666' }}>(Fixed)</span>
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#1e3a8a' }}>
                  <strong>Location:</strong> {selectedLocationId} <span style={{ fontSize: '0.8rem', color: '#666' }}>(Read-only)</span>
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                  <strong>Current Status:</strong> {currentTask?.status || 'N/A'}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Assignment Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  value={reassignDate}
                  onChange={(e) => setReassignDate(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '6px',
                    border: '1px solid #ccc', fontSize: '1rem'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Manager Remark (Notes) <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea
                  value={managerRemark}
                  onChange={(e) => setManagerRemark(e.target.value)}
                  placeholder="Enter specific instructions for the employee..."
                  rows={4}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '6px',
                    border: '1px solid #ccc', fontSize: '1rem', resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setIsReassignModalOpen(false)}
                  style={{
                    padding: '10px 20px', background: 'transparent', border: '1px solid #ccc',
                    borderRadius: '6px', cursor: 'pointer', color: '#555', fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReassign}
                  style={{
                    padding: '10px 20px', backgroundColor: '#f57c00', color: '#fff',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <span>↺</span> Reassign
                </button>
              </div>
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
      </div>
    </div>
  );
};

export default ManagerDashboard;
