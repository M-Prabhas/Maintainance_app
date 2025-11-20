import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockStores = [
  { id: 1, name: 'Central Mall', address: '123 Main St, Cityville' },
  { id: 2, name: 'Eastside Plaza', address: '456 East Rd, Townsville' },
  { id: 3, name: 'West End Store', address: '789 West Ave, Villagetown' },
];

const mockAppliances = [
  { id: 11, storeId: 1, name: 'Air Conditioner', model: 'AC-1000', serialNumber: 'SN12345', category: 'HVAC', amcVendor: 'CoolTech' },
  { id: 12, storeId: 1, name: 'Water Heater', model: 'WH-500', serialNumber: 'WH67890', category: 'Plumbing', amcVendor: 'HeatPro' },
  { id: 21, storeId: 2, name: 'Refrigerator', model: 'RF-900', serialNumber: 'RF12345', category: 'Kitchen', amcVendor: 'ColdKeep' },
  { id: 31, storeId: 3, name: 'Generator', model: 'GN-300', serialNumber: 'GN11111', category: 'Power', amcVendor: 'PowerMax' },
];

const initialChecklist = { 
  11: { isChecked: false, remarks: '', status: '' }, 
  12: { isChecked: false, remarks: '', status: '' },
  21: { isChecked: false, remarks: '', status: '' },
  31: { isChecked: false, remarks: '', status: '' },
};

const EmployeeInspection = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const store = mockStores.find(s => s.id === parseInt(storeId));
  const appliances = mockAppliances.filter(a => a.storeId === parseInt(storeId));

  const [checklist, setChecklist] = useState(() => {
    const initial = {};
    appliances.forEach(appliance => {
      initial[appliance.id] = initialChecklist[appliance.id] || { isChecked: false, remarks: '', status: '' };
    });
    return initial;
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const updateChecklist = (applianceId, updates) => {
    setChecklist(prev => ({ ...prev, [applianceId]: { ...prev[applianceId], ...updates } }));
  };

  const handleCheckboxChange = (applianceId, checked) => {
    updateChecklist(applianceId, { isChecked: checked });
  };

  const handleRemarksChange = (applianceId, remarks) => {
    updateChecklist(applianceId, { remarks });
  };

  const handleStatusChange = (applianceId, status) => {
    updateChecklist(applianceId, { status });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!store) {
    return (
      <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', textAlign: 'center', padding: 40, color: '#b00020' }}>
        Store not found.
      </div>
    );
  }

  return (
    <div
      className="employee-inspection"
      style={{
        maxWidth: 900,
        margin: '2rem auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f9f9fb',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    >
      <h1
        style={{
          fontWeight: 700,
          fontSize: '2.4rem',
          marginBottom: 8,
          color: '#2c3e50',
          borderBottom: '2px solid #1976d2',
          paddingBottom: 8,
        }}
      >
        Appliance Inspection - {store.name}
      </h1>
      <p style={{ fontSize: '1rem', color: '#555', marginBottom: 20 }}>{store.address}</p>

      {showSuccess && (
        <div
          className="success-message"
          style={{
            color: '#155724',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: 6,
            padding: '12px 20px',
            marginBottom: 20,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            userSelect: 'none',
          }}
        >
          ✓ Status updated successfully!
        </div>
      )}

      <div className="inspection-list">
        {appliances.map(appliance => {
          const item = checklist[appliance.id];
          return (
            <div
              key={appliance.id}
              className="inspection-item"
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 20,
                marginBottom: 20,
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.01)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div
                className="appliance-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 12,
                  gap: 16,
                }}
              >
                <input
                  type="checkbox"
                  checked={item.isChecked}
                  onChange={e => handleCheckboxChange(appliance.id, e.target.checked)}
                  style={{
                    cursor: 'pointer',
                    width: 24,
                    height: 24,
                    accentColor: '#1976d2',
                  }}
                />
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '1.5rem',
                      color: '#34495e',
                      fontWeight: 700,
                      userSelect: 'none',
                    }}
                  >
                    {appliance.name}
                  </h3>
                  <p style={{ margin: 0, fontWeight: 500, color: '#7f8c8d' }}>
                    {appliance.model} - {appliance.serialNumber}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#95a5a6', userSelect: 'none' }}>
                    <strong>Category:</strong> {appliance.category} | <strong>AMC:</strong> {appliance.amcVendor}
                  </p>
                </div>
              </div>

              <textarea
                placeholder="Enter your remarks here..."
                value={item.remarks}
                onChange={e => handleRemarksChange(appliance.id, e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  resize: 'vertical',
                  padding: 12,
                  fontSize: '1rem',
                  border: '1.5px solid #d1d8e0',
                  borderRadius: 8,
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
                  marginBottom: 12,
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  transition: 'border-color 0.3s ease',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#1976d2')}
                onBlur={e => (e.currentTarget.style.borderColor = '#d1d8e0')}
              />

              <div className="status-buttons" style={{ display: 'flex', gap: 16 }}>
                <button
                  className={`btn-completed ${item.status === 'completed' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(appliance.id, 'completed')}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    backgroundColor: item.status === 'completed' ? '#4caf50' : '#e0e0e0',
                    color: item.status === 'completed' ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow:
                      item.status === 'completed'
                        ? '0 4px 10px rgba(76, 175, 80, 0.5)'
                        : 'none',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    if (item.status !== 'completed') e.currentTarget.style.backgroundColor = '#aed581';
                  }}
                  onMouseLeave={e => {
                    if (item.status !== 'completed') e.currentTarget.style.backgroundColor = '#e0e0e0';
                  }}
                >
                  ✓ Completed
                </button>
                <button
                  className={`btn-hold ${item.status === 'hold' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(appliance.id, 'hold')}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    backgroundColor: item.status === 'hold' ? '#f57c00' : '#e0e0e0',
                    color: item.status === 'hold' ? '#fff' : '#333',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow:
                      item.status === 'hold'
                        ? '0 4px 10px rgba(245, 124, 0, 0.5)'
                        : 'none',
                    transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={e => {
                    if (item.status !== 'hold') e.currentTarget.style.backgroundColor = '#ffb74d';
                  }}
                  onMouseLeave={e => {
                    if (item.status !== 'hold') e.currentTarget.style.backgroundColor = '#e0e0e0';
                  }}
                >
                  ⏸ Hold
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="btn-back"
        onClick={() => navigate('/employee')}
        style={{
          marginTop: 24,
          padding: '12px 24px',
          backgroundColor: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontSize: '1.1rem',
          fontWeight: '700',
          cursor: 'pointer',
          boxShadow: '0 6px 12px rgba(25, 118, 210, 0.5)',
          userSelect: 'none',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1565c0')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1976d2')}
      >
        ← Back to Dashboard
      </button>
    </div>
  );
};

export default EmployeeInspection;
