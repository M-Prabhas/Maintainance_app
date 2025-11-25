import React, { useState, useMemo, useRef, useEffect } from 'react';

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

const mockLocations = [
  { id: 'L001', city: 'Delhi' },
  { id: 'L002', city: 'Mumbai' },
  { id: 'L003', city: 'Pune' },
  { id: 'L004', city: 'Kolkata' },
  { id: 'L005', city: 'Chennai' },
];

const rowsPerPage = 5;

const LocationMultiPicker = ({ options, selectedIds, onAdd, onRemove, disabled }) => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const filteredOptions = useMemo(() => {
    const lower = searchText.toLowerCase();
    return options.filter(opt => 
      (opt.city.toLowerCase().includes(lower) || opt.id.toLowerCase().includes(lower)) &&
      !selectedIds.includes(opt.id)
    );
  }, [searchText, options, selectedIds]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearchText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    if (!disabled) {
      onAdd(id);
      setSearchText('');
      setIsOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }} ref={ref}>
      <input
        type="text"
        value={isOpen ? searchText : ''}
        onChange={e => { setSearchText(e.target.value); setIsOpen(true); }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search locations"
        disabled={disabled}
        aria-label="Search locations"
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: '8px',
          border: disabled ? '1.5px solid #ccc' : '1.5px solid #d2d7df',
          fontSize: '1rem',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'text'
        }}
      />
      {isOpen && filteredOptions.length > 0 && !disabled && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0, right: 0,
          maxHeight: '180px',
          overflowY: 'auto',
          backgroundColor: '#fff',
          border: '1px solid #d2d7df',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 3px 12px rgba(0,0,0,0.1)'
        }}>
          {filteredOptions.map(opt => (
            <div
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              onMouseDown={e => e.preventDefault()} // prevent input blur
              style={{
                padding: '10px 15px',
                cursor: 'pointer',
                backgroundColor: '#fff'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e7f3fb'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
            >
              {opt.id} - {opt.city}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {selectedIds.map(id => (
          <span key={id} style={{
            background: '#e2f0fc',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#2563eb'
          }}>
            {id}
            <button
              onClick={() => onRemove(id)}
              aria-label={`Remove location ${id}`}
              style={{
                border: 'none',
                background: 'transparent',
                marginLeft: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1.2rem',
                color: '#2563eb',
                lineHeight: 1,
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#194291'}
              onMouseLeave={e => e.currentTarget.style.color = '#2563eb'}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

const AssignLocation = ({ sidebarOpen }) => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [assigningEmployeeId, setAssigningEmployeeId] = useState('');
  const [formData, setFormData] = useState({
    locationIds: [],
    assignmentDate: '',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const todayStr = new Date().toISOString().slice(0, 10);
  const highlightIfToday = (date) => date === todayStr ? { background: "#e2ffd8" } : {};

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const lower = searchTerm.toLowerCase();
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(lower) ||
      emp.employeeId.toLowerCase().includes(lower) ||
      emp.email.toLowerCase().includes(lower)
    );
  }, [employees, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));
  const pagedEmployees = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredEmployees.slice(start, start + rowsPerPage);
  }, [filteredEmployees, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const handleAssignClick = (employeeId) => {
    setAssigningEmployeeId(employeeId);
    setFormData({
      locationIds: [],
      assignmentDate: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddLocation = (id) => {
    setFormData(prev => ({
      ...prev,
      locationIds: prev.locationIds.includes(id) ? prev.locationIds : [...prev.locationIds, id]
    }));
  };

  const handleRemoveLocation = (id) => {
    setFormData(prev => ({
      ...prev,
      locationIds: prev.locationIds.filter(locId => locId !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.assignmentDate) {
      alert('Please select assignment date');
      return;
    }
    if (formData.locationIds.length === 0) {
      alert('Please select at least one location');
      return;
    }

    const assigningEmployeeRole = employees.find(emp => emp.employeeId === assigningEmployeeId)?.role || '';

    const newLocations = formData.locationIds.map(id => {
      const city = mockLocations.find(loc => loc.id === id)?.city || '-';
      return {
        locationId: id,
        city,
        date: formData.assignmentDate,
        role: assigningEmployeeRole,
        notes: formData.notes
      };
    });

    const updatedEmployees = employees.map(emp => {
      if (emp.employeeId === assigningEmployeeId) {
        return {
          ...emp,
          assignedLocations: [...emp.assignedLocations, ...newLocations]
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setAssigningEmployeeId('');
    setFormData({
      locationIds: [],
      assignmentDate: '',
      notes: ''
    });
    alert('Locations assigned!');
  };

  // Pagination button styles reused from original
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
        <br />
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
            outline: 'none'
          }}
          aria-label="Search Employees"
        />

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
                        onClick={() => alert("Use the Assign Location button to assign locations")}
                        style={{ color: "#2563eb", textDecoration: "underline", cursor: "default", fontWeight: 700 }}
                      >
                        {emp.employeeId}
                      </span>
                    </td>
                    <td style={{ padding: "8px" }}>
                      <span
                        onClick={() => alert("Use the Assign Location button to assign locations")}
                        style={{ color: "#2156b9", cursor: "default", fontWeight: 700 }}
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

        {/* Pagination controls */}
        <div style={{ marginBottom: "20px", display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={paginationButtonStyle(currentPage === 1)}
            aria-label="Previous page"
            onMouseOver={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1e40af'; }}
            onMouseOut={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#2563eb'; }}
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
            aria-label="Next page"
            onMouseOver={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#1e40af'; }}
            onMouseOut={e => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#2563eb'; }}
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
              maxWidth: "480px",
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
                  transition: "border-color 0.3s ease"
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                onBlur={e => e.currentTarget.style.borderColor = "#d2d7df"}
              />

              <LocationMultiPicker
                selectedIds={formData.locationIds}
                onAdd={handleAddLocation}
                onRemove={handleRemoveLocation}
                disabled={!formData.assignmentDate}
                options={mockLocations}
              />

              <input
                name="notes"
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={handleChange}
                disabled={!formData.assignmentDate}
                style={{
                  flexBasis: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: !formData.assignmentDate ? '1.5px solid #ccc' : '1.5px solid #d2d7df',
                  fontSize: "1rem",
                  outline: "none",
                  transition: "border-color 0.3s ease",
                  backgroundColor: !formData.assignmentDate ? '#f5f5f5' : '#fff',
                  cursor: !formData.assignmentDate ? 'not-allowed' : 'text',
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#2563eb"}
                onBlur={e => e.currentTarget.style.borderColor = "#d2d7df"}
              />

              <button
                type="submit"
                disabled={!(formData.locationIds.length > 0 && formData.assignmentDate)}
                style={{
                  flexBasis: "100%",
                  backgroundColor: (formData.locationIds.length > 0 && formData.assignmentDate) ? "#2156b9" : "#b4b8bc",
                  color: "#fff",
                  padding: "12px 26px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  cursor: (formData.locationIds.length > 0 && formData.assignmentDate) ? "pointer" : "not-allowed",
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
      </div>
    </div>
  );
};

export default AssignLocation;
