import React, { useState } from 'react';

// Mock sample data
const mockEmployees = [
  {
    employeeId: 'E001',
    name: 'Rajesh Sharma',
    email: 'rajesh@example.com',
    role: 'employee',
    assignedLocations: [
      { locationId: 'L001', city: 'Delhi', date: '2023-01-15', role: 'employee', notes: 'Main branch' },
      { locationId: 'L003', city: 'Pune', date: new Date().toISOString().slice(0,10), role: 'employee', notes: 'Today assigned' }
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

const AssignLocation = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [assigningEmployeeId, setAssigningEmployeeId] = useState('');
  const [formData, setFormData] = useState({
    locationId: '',
    assignmentDate: '',
    role: '',
    notes: ''
  });

  // MODAL state
  const [viewingEmployee, setViewingEmployee] = useState(null);

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
    setFormData({...formData, [e.target.name]: e.target.value});
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
              city: '-', // fill from lookup if you wish
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

  // UTILS
  const todayStr = new Date().toISOString().slice(0,10);
  const highlightIfToday = (date) => date === todayStr ? {background:"#e2ffd8"} : {};

  // Main Table
  return (
    <div className="form-container">
      <h1>Assign Location to Employee</h1>
      {/* Employee assignments table */}
      <div style={{overflowX: "auto", margin: '16px 0 32px 0'}}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(44, 62, 80, 0.07)'
        }}>
          <thead style={{background: "#e7f3fb"}}>
            <tr>
              <th style={{padding: "12px"}}>Employee ID</th>
              <th style={{padding: "12px"}}>Name</th>
              <th style={{padding: "12px"}}>Email</th>
              <th style={{padding: "12px"}}>Role</th>
              <th style={{padding: "12px"}}>Assigned Locations</th>
              <th style={{padding: "12px"}}></th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.employeeId}>
                <td style={{padding: "8px"}}>
                  <span
                    onClick={() => setViewingEmployee(emp)}
                    style={{color: "#2563eb", textDecoration:"underline", cursor:"pointer", fontWeight:700}}
                  >
                    {emp.employeeId}
                  </span>
                </td>
                <td style={{padding: "8px"}}>
                  <span
                    onClick={() => setViewingEmployee(emp)}
                    style={{color: "#2156b9", cursor:"pointer", fontWeight:700}}
                  >
                    {emp.name}
                  </span>
                </td>
                <td style={{padding: "8px"}}>{emp.email}</td>
                <td style={{padding: "8px"}}>{emp.role}</td>
                <td style={{padding: "8px"}}>
                  {emp.assignedLocations.length === 0
                    ? <i style={{color: "#888"}}>Not Assigned</i>
                    : (
                        <ul style={{margin:0,padding:0}}>
                          {emp.assignedLocations.map((loc, idx) => (
                            <li key={loc.locationId + idx} style={highlightIfToday(loc.date)}>
                              <span style={{fontWeight:600}}>{loc.locationId}</span>
                              {loc.city && <span> ({loc.city})</span>}{' '}
                              — {loc.date}{loc.date === todayStr && <span style={{color:"#15a503",fontWeight:600}}> (today)</span>}, role: {loc.role}
                              {loc.notes && <> — <span>{loc.notes}</span></>}
                            </li>
                          ))}
                        </ul>
                      )
                  }
                </td>
                <td style={{padding: "8px", textAlign: "center"}}>
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Assignment form, shown only when assigning */}
      {assigningEmployeeId && (
        <form onSubmit={handleSubmit} style={{
          display: 'flex', flexWrap: 'wrap',
          gap: '16px', alignItems: 'center',
          background: '#f9fbff',
          padding: '18px 22px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(59,130,246,0.07)',
          margin: '0 auto',
          maxWidth: '680px'
        }}>
          <h3 style={{width:"100%", color:"#2563eb", marginTop:0}}>
            Assign to {employees.find(emp=>emp.employeeId===assigningEmployeeId)?.name} ({assigningEmployeeId})
          </h3>
            <input
            type="date"
            name="assignmentDate"
            placeholder="Assignment Date"
            value={formData.assignmentDate}
            onChange={handleChange}
            required
          />
          <input
            name="locationId"
            placeholder="Location ID"
            value={formData.locationId}
            onChange={handleChange}
            disabled={!formData.assignmentDate}
            required
          />
        
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={!formData.assignmentDate}
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
          />
          <button
            type="submit"
            style={{
              background: !(formData.locationId && formData.assignmentDate && formData.role) ? "#b4b8bc" : "#2156b9",
              color: "#fff",
              padding: "12px 26px",
              fontWeight: 700,
              borderRadius: "8px",
              border: "none",
              fontSize: "1rem",
              cursor: !(formData.locationId && formData.assignmentDate && formData.role) ? "not-allowed" : "pointer"
            }}
            disabled={!(formData.locationId && formData.assignmentDate && formData.role)}
          >
            Assign Location
          </button>
          <button
            type="button"
            style={{
              background: '#fff',
              color: '#2156b9',
              padding: "12px 22px",
              fontWeight: 600,
              borderRadius: "8px",
              border: "1.5px solid #a3b6e6",
              fontSize: "1rem",
            }}
            onClick={() => setAssigningEmployeeId('')}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Popup modal for employee detail view */}
      {viewingEmployee &&
        <div style={{
          position: "fixed", zIndex: "9999",
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
            <h2 style={{marginBottom: "5px", fontWeight: "bold", color: "#234e8c"}}>
              {viewingEmployee.name} <span style={{color:"#aaa", fontSize:"0.98rem"}}>({viewingEmployee.employeeId})</span>
            </h2>
            <div style={{color:"#476fcc", fontSize:"0.98rem", marginBottom:"5px"}}>{viewingEmployee.email}</div>
            <div style={{marginBottom:"10px"}}><span style={{color:"#757676", fontWeight:600}}>Role:</span> {viewingEmployee.role}</div>
            <div style={{
              background:"#f8fafc",
              padding:"14px 12px", borderRadius:"8px",
              marginBottom:"18px",
              border: "1px solid #d3e3fa"
            }}>
              <div style={{fontWeight:600, marginBottom:"5px", color:"#1c46a5"}}>KPIs</div>
              <div style={{display:"flex", gap:"26px", fontSize:"1.02rem", color:"#2b3499"}}>
                <div>
                  <div style={{fontSize:"1.23rem", fontWeight:700, color:"#246653"}}>{viewingEmployee.kpi.completedTasks}</div>
                  <div style={{fontSize:"0.96rem", color:"#455"}}>Completed Tasks</div>
                </div>
                <div>
                  <div style={{fontSize:"1.23rem", fontWeight:700, color:"#085fad"}}>{viewingEmployee.kpi.activeLocations}</div>
                  <div style={{fontSize:"0.96rem", color:"#455"}}>Active Locations</div>
                </div>
                <div>
                  <div style={{fontSize:"1.23rem", fontWeight:700, color:"#c92531"}}>{viewingEmployee.kpi.overdueTasks}</div>
                  <div style={{fontSize:"0.96rem", color:"#455"}}>Overdue Tasks</div>
                </div>
              </div>
            </div>
            <div style={{fontWeight:600, color:"#486cff", marginBottom:"7px"}}>Location Assignments</div>
            <ul style={{margin:0, paddingLeft:"17px"}}>
              {viewingEmployee.assignedLocations.length === 0 ? (
                <li style={{color:"#888"}}>No previous assignments</li>
              ) : (
                viewingEmployee.assignedLocations.map((loc, idx) => (
                  <li key={loc.locationId + idx} style={highlightIfToday(loc.date)}>
                    <span style={{fontWeight:600,color:"#5F27CD"}}>{loc.locationId}</span>
                    {loc.city && <span> ({loc.city})</span>} — {loc.date}{loc.date === todayStr && <span style={{color:"#15a503",fontWeight:600}}> (today)</span>}, role: {loc.role}
                    {loc.notes && <> — <span>{loc.notes}</span></>}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      }
    </div>
  );
};

export default AssignLocation;
