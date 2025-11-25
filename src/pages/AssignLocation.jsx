import React, { useState, useMemo } from 'react';

// Mock sample data
const mockEmployees = [
  {
    employeeId: 'E001',
    name: 'Rajesh Sharma',
    email: 'rajesh@example.com',
    role: 'employee',
    assignedLocations: [
      { locationId: 'L001', city: 'Delhi', date: '2023-01-15', role: 'employee', notes: 'Main branch' },
      { locationId: 'L003', city: 'Pune', date: new Date().toISOString().slice(0, 10), role: 'employee', notes: 'Today assigned' }
    ],
    kpi: {
      completedTasks: 12,
      activeLocations: 2,
      overdueTasks: 1
    }
  },
  {
    employeeId: 'E002',
    name: 'Priya Mehra',
    email: 'priya@example.com',
    role: 'employee',
    assignedLocations: [],
    kpi: {
      completedTasks: 18,
      activeLocations: 0,
      overdueTasks: 0
    }
  },
  {
    employeeId: 'T001',
    name: 'Arvind Contractor',
    email: 'arvind@thirdparty.com',
    role: 'thirdparty',
    assignedLocations: [
      { locationId: 'L002', city: 'Mumbai', date: '2023-05-03', role: 'thirdparty', notes: '' }
    ],
    kpi: {
      completedTasks: 4,
      activeLocations: 1,
      overdueTasks: 0
    }
  }
];

const rowsPerPage = 5; // number of rows per page for pagination

const AssignLocation = ({ sidebarOpen }) => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [assigningEmployeeId, setAssigningEmployeeId] = useState('');
  const [formData, setFormData] = useState({
    locationId: '',
    assignmentDate: '',
    role: '',
    notes: ''
  });
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const todayStr = new Date().toISOString().slice(0, 10);
  const highlightIfToday = (date) => date === todayStr ? { background: "#e2ffd8" } : {};

  // Filter employees based on search term (id, name or email)
  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const lower = searchTerm.toLowerCase();
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(lower) ||
      emp.employeeId.toLowerCase().includes(lower) ||
      emp.email.toLowerCase().includes(lower)
    );
  }, [employees, searchTerm]);

  // Pagination: total pages and current page's employees
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));
  const pagedEmployees = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredEmployees.slice(start, start + rowsPerPage);
  }, [filteredEmployees, currentPage]);

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAssignClick = (employeeId) => {
    setAssigningEmployeeId(employeeId);
    setFormData({
      locationId: '',
      assignmentDate: '',
      role: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEmployees = employees.map(emp => {
      if (emp.employeeId === assigningEmployeeId) {
        return {
          ...emp,
          assignedLocations: [
            ...emp.assignedLocations,
            {
              locationId: formData.locationId,
              city: '-', // You can add actual city lookup logic here
              date: formData.assignmentDate,
              role: formData.role,
              notes: formData.notes
            }
          ]
        };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
    setAssigningEmployeeId('');
    setFormData({
      locationId: '',
      assignmentDate: '',
      role: '',
      notes: ''
    });
    alert('Location assigned!');
  };

  const paginationButtonStyle = (disabled) => ({
    padding: '10px 20px',
    backgroundColor: disabled ? '#e0e0e0' : '#2563eb',
    color: disabled ? '#9e9e9e' : '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    boxShadow: disabled ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.5)',
    transition: 'background-color 0.3s ease'
  });

  return (
    <div className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <div className="form-container">
        <h1>Assign Location to Employee</h1>
        <br></br>
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name, employee ID or email"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 15px',
            width: '100%',
            maxWidth: '400px',
            fontSize: '1rem',
            marginBottom: '20px',
            borderRadius: '6px',
            border: '1.5px solid #cbd5e1',
            outline: 'none',
          }}
          aria-label="Search Employees"
        />

        {/* Employee Table */}
        <div style={{ overflowX: 'auto', margin: '0 0 16px 0' }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(44, 62, 80, 0.07)',
            }}
          >
            <thead style={{ background: "#e7f3fb" }}>
              <tr>
                <th style={{ padding: "12px" }}>Employee ID</th>
                <th style={{ padding: "12px" }}>Name</th>
                <th style={{ padding: "12px" }}>Email</th>
                <th style={{ padding: "12px" }}>Role</th>
                <th style={{ padding: "12px" }}>Assigned Locations</th>
                <th style={{ padding: "12px" }}></th>
              </tr>
            </thead>
            <tbody>
              {pagedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No employees found.</td>
                </tr>
              ) : (
                pagedEmployees.map(emp => (
                  <tr key={emp.employeeId}>
                    <td style={{ padding: "8px" }}>
                      <span
                        onClick={() => setViewingEmployee(emp)}
                        style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer", fontWeight: 700 }}
                      >
                        {emp.employeeId}
                      </span>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <span
                        onClick={() => setViewingEmployee(emp)}
                        style={{ color: "#2156b9", cursor: "pointer", fontWeight: 700 }}
                      >
                        {emp.name}
                      </span>
                    </td>
                    <td style={{ padding: "8px" }}>{emp.email}</td>
                    <td style={{ padding: "8px" }}>{emp.role}</td>
                    <td style={{ padding: "8px" }}>
                      {emp.assignedLocations.length === 0
                        ? <i style={{ color: "#888" }}>Not Assigned</i>
                        : (
                          <ul style={{ margin: 0, paddingLeft: '18px' }}>
                            {emp.assignedLocations.map((loc, idx) => (
                              <li key={loc.locationId + idx} style={highlightIfToday(loc.date)}>
                                <span style={{ fontWeight: 600 }}>{loc.locationId}</span>
                                {loc.city && <span> ({loc.city})</span>} — {loc.date}
                                {loc.date === todayStr && <span style={{ color: "#15a503", fontWeight: 600 }}> (today)</span>}, role: {loc.role}
                                {loc.notes && <> — <span>{loc.notes}</span></>}
                              </li>
                            ))}
                          </ul>
                        )}
                    </td>
                    <td style={{ padding: "8px", textAlign: "center" }}>
                      <button
                        type="button"
                        style={{
                          padding: '7px 14px',
                          borderRadius: '6px',
                          background: '#2563eb',
                          color: '#fff',
                          border: 'none',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                        onClick={() => handleAssignClick(emp.employeeId)}
                      >
                        Assign Location
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls - outside table for always visible */}
        <div style={{ marginBottom: "20px", display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={paginationButtonStyle(currentPage === 1)}
            onMouseOver={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1e40af'; }}
            onMouseOut={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#2563eb'; }}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span style={{ alignSelf: 'center', fontWeight: '600' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={paginationButtonStyle(currentPage === totalPages)}
            onMouseOver={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1e40af'; }}
            onMouseOut={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#2563eb'; }}
            aria-label="Next page"
          >
            Next
          </button>
        </div>

        {/* Assignment Form Modal */}
        {assigningEmployeeId && (
          <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "20px"
          }}>
            <form onSubmit={handleSubmit} style={{
              background: "#fff",
              borderRadius: "14px",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
              padding: "30px 36px",
              maxWidth: "440px",
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              position: "relative",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
              <button
                type="button"
                style={{
                  position: "absolute",
                  top: 14,
                  right: 18,
                  background: "none",
                  border: "none",
                  fontSize: "1.8rem",
                  cursor: "pointer",
                  color: "#6278f7",
                  padding: 0,
                  lineHeight: 1
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#294bb5"}
                onMouseLeave={e => e.currentTarget.style.color = "#6278f7"}
                onClick={() => setAssigningEmployeeId('')}
                aria-label="Close"
              >
                &times;
              </button>
              <h3 style={{ width: "100%", color: "#2563eb", marginTop: 0, fontWeight: "bold" }}>
                Assign to {employees.find(emp => emp.employeeId === assigningEmployeeId)?.name} ({assigningEmployeeId})
              </h3>
              <input
                type="date"
                name="assignmentDate"
                placeholder="Assignment Date"
                value={formData.assignmentDate}
                onChange={handleChange}
                required
                style={{
                  flexBasis: "48%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1.5px solid #d2d7df",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                onBlur={e => e.currentTarget.style.borderColor = "#d2d7df"}
              />
              <input
                name="locationId"
                placeholder="Location ID"
                value={formData.locationId}
                onChange={handleChange}
                disabled={!formData.assignmentDate}
                required
                style={{
                  flexBasis: "48%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: !formData.assignmentDate ? '1.5px solid #ccc' : '1.5px solid #d2d7df',
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  backgroundColor: !formData.assignmentDate ? '#f5f5f5' : '#fff',
                  cursor: !formData.assignmentDate ? 'not-allowed' : 'text'
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                onBlur={e => e.currentTarget.style.borderColor = "#d2d7df"}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                disabled={!formData.assignmentDate}
                style={{
                  flexBasis: "48%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: !formData.assignmentDate ? '1.5px solid #ccc' : '1.5px solid #d2d7df',
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  backgroundColor: !formData.assignmentDate ? '#f5f5f5' : '#fff',
                  cursor: !formData.assignmentDate ? 'not-allowed' : 'pointer'
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                onBlur={e => e.currentTarget.style.borderColor = "#d2d7df"}
              >
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="thirdparty">Third Party</option>
              </select>
              <input
                name="notes"
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={handleChange}
                disabled={!formData.assignmentDate || !formData.role}
                style={{
                  flexBasis: "48%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: (!formData.assignmentDate || !formData.role) ? '1.5px solid #ccc' : '1.5px solid #d2d7df',
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  backgroundColor: (!formData.assignmentDate || !formData.role) ? '#f5f5f5' : '#fff',
                  cursor: (!formData.assignmentDate || !formData.role) ? 'not-allowed' : 'text'
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                onBlur={e => e.currentTarget.style.borderColor = "#d2d7df"}
              />
              <button
                type="submit"
                disabled={!(formData.locationId && formData.assignmentDate && formData.role)}
                style={{
                  flexBasis: "100%",
                  backgroundColor: (formData.locationId && formData.assignmentDate && formData.role) ? "#2156b9" : "#b4b8bc",
                  color: "#fff",
                  padding: "12px 26px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: (formData.locationId && formData.assignmentDate && formData.role) ? "pointer" : "not-allowed",
                  transition: "background-color 0.3s ease",
                  marginTop: "10px"
                }}
              >
                Assign Location
              </button>
              <button
                type="button"
                onClick={() => setAssigningEmployeeId('')}
                style={{
                  flexBasis: "100%",
                  background: "#fff",
                  color: "#2156b9",
                  padding: "12px 26px",
                  borderRadius: "8px",
                  border: "1.5px solid #a3b6e6",
                  fontWeight: 600,
                  fontSize: "1rem",
                  cursor: "pointer",
                  marginTop: "8px"
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Employee Details Modal */}
        {viewingEmployee &&
          <div style={{
            position: "fixed", zIndex: 3000,
            left: 0, top: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.23)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              background: "#fff",
              borderRadius: "14px",
              maxWidth: "450px",
              minWidth: "310px",
              boxShadow: "0 8px 40px rgba(46, 64, 120, .22)",
              padding: "30px 29px 25px 29px",
              position: "relative"
            }}>
              <button
                style={{
                  position: "absolute", top: 18, right: 22, background: "none",
                  border: "none", fontSize: "1.6rem", cursor: "pointer", color: "#8c9be6"
                }}
                onClick={() => setViewingEmployee(null)}
                aria-label="Close"
              >&times;</button>
              <h2 style={{ marginBottom: "5px", fontWeight: "bold", color: "#234e8c" }}>
                {viewingEmployee.name} <span style={{ color: "#aaa", fontSize: "0.98rem" }}>({viewingEmployee.employeeId})</span>
              </h2>
              <div style={{ color: "#476fcc", fontSize: "0.98rem", marginBottom: "5px" }}>{viewingEmployee.email}</div>
              <div style={{ marginBottom: "10px" }}><span style={{ color: "#757676", fontWeight: 600 }}>Role:</span> {viewingEmployee.role}</div>
              <div style={{
                background: "#f8fafc",
                padding: "14px 12px",
                borderRadius: "8px",
                marginBottom: "18px",
                border: "1px solid #d3e3fa"
              }}>
                <div style={{ fontWeight: 600, marginBottom: "5px", color: "#1c46a5" }}>KPIs</div>
                <div style={{ display: "flex", gap: "26px", fontSize: "1.02rem", color: "#2b3499" }}>
                  <div>
                    <div style={{ fontSize: "1.23rem", fontWeight: 700, color: "#246653" }}>{viewingEmployee.kpi.completedTasks}</div>
                    <div style={{ fontSize: "0.96rem", color: "#455" }}>Completed Tasks</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "1.23rem", fontWeight: 700, color: "#085fad" }}>{viewingEmployee.kpi.activeLocations}</div>
                    <div style={{ fontSize: "0.96rem", color: "#455" }}>Active Locations</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "1.23rem", fontWeight: 700, color: "#c92531" }}>{viewingEmployee.kpi.overdueTasks}</div>
                    <div style={{ fontSize: "0.96rem", color: "#455" }}>Overdue Tasks</div>
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 600, color: "#486cff", marginBottom: "7px" }}>Location Assignments</div>
              <ul style={{ margin: 0, paddingLeft: "17px" }}>
                {viewingEmployee.assignedLocations.length === 0 ? (
                  <li style={{ color: "#888" }}>No previous assignments</li>
                ) : (
                  viewingEmployee.assignedLocations.map((loc, idx) => (
                    <li key={loc.locationId + idx} style={highlightIfToday(loc.date)}>
                      <span style={{ fontWeight: 600, color: "#5F27CD" }}>{loc.locationId}</span>
                      {loc.city && <span> ({loc.city})</span>} — {loc.date}
                      {loc.date === todayStr && <span style={{ color: "#15a503", fontWeight: 600 }}> (today)</span>}, role: {loc.role}
                      {loc.notes && <> — <span>{loc.notes}</span></>}
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default AssignLocation;
