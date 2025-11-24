import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock Data
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

const EmployeeInspection = ({ sidebarOpen = true }) => {
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
    setTimeout(() => setShowSuccess(false), 2800);
  };

  if (!store) {
    return (
      <div style={{
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
        textAlign: 'center',
        padding: 40,
        color: '#b00020'
      }}>Store not found.</div>
    );
  }

  return (
    <div className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}
      style={{
        minHeight: '100vh',
        background: '#f6f8fc',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: '35px',
        paddingBottom: '35px'
      }}
    >
      <div
        className="employee-inspection"
        style={{
          maxWidth: '900px',
          width: '100%',
          backgroundColor: '#f9f9fb',
          borderRadius: 18,
          padding: '2.3rem 2.2rem',
          boxShadow: '0 6px 32px rgba(25,118,210,0.10)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          transition: 'box-shadow 0.25s'
        }}
      >
        <h1
          style={{
            fontWeight: 800,
            fontSize: '2.2rem',
            marginBottom: 0,
            color: '#1976d2',
            letterSpacing: '1.5px',
            textAlign: 'center',
            borderBottom: '2px solid #eeeeee',
            paddingBottom: 6,
          }}
        >
          Appliance Inspection <span style={{ color: '#333' }}>- {store.name}</span>
        </h1>
        <p style={{ fontSize: '1.13rem', color: '#555', marginBottom: 24, textAlign: 'center' }}>{store.address}</p>

        {showSuccess && (
          <div
            style={{
              color: '#155724',
              backgroundColor: '#e7f6e7',
              border: '1.5px solid #c6e3c6',
              borderRadius: 6,
              padding: '10px 20px',
              marginBottom: 16,
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
              userSelect: 'none',
              fontSize: '1.03em'
            }}
          >
            ✓ Status updated successfully!
          </div>
        )}

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 26,
          justifyContent: 'flex-start'
        }}>
          {appliances.map(appliance => {
            const item = checklist[appliance.id];
            return (
              <div
                key={appliance.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 14,
                  padding: 22,
                  minWidth: '300px',
                  flex: '1 1 330px',
                  marginBottom: 10,
                  boxShadow: '0 3px 22px rgba(25,118,210,0.09)',
                  transition: 'transform 0.18s, box-shadow 0.25s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.017)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 15,
                    marginBottom: 12
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
                        fontSize: '1.33rem',
                        color: '#222',
                        fontWeight: '700',
                        lineHeight: 1.25,
                        userSelect: 'none',
                      }}
                    >
                      {appliance.name}
                    </h3>
                    <p style={{ margin: '5px 0', fontWeight: 500, color: '#7f8c8d', fontSize: '1.011em' }}>
                      {appliance.model} <span style={{ fontWeight: 400, color: '#ccc' }}>&#8226;</span> {appliance.serialNumber}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.93rem', color: '#95a5a6', userSelect: 'none' }}>
                      <strong>Category:</strong> {appliance.category} | <strong>AMC:</strong> {appliance.amcVendor}
                    </p>
                  </div>
                </div>
                <textarea
                  placeholder="Enter remarks..."
                  value={item.remarks}
                  onChange={e => handleRemarksChange(appliance.id, e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    resize: 'vertical',
                    padding: 12,
                    fontSize: '1em',
                    border: '1.6px solid #e3e9f2',
                    borderRadius: 8,
                    boxShadow: 'inset 0 1px 3px rgba(25,118,210,0.07)',
                    marginBottom: 14,
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#1976d2')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e3e9f2')}
                />
                <div style={{
                  display: 'flex',
                  gap: 14,
                  marginTop: 2,
                }}>
                  <button
                    onClick={() => handleStatusChange(appliance.id, 'completed')}
                    style={{
                      flex: 1,
                      padding: '12px 0',
                      backgroundColor: item.status === 'completed' ? '#4caf50' : '#e0e0e0',
                      color: item.status === 'completed' ? '#fff' : '#333',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: '1em',
                      fontWeight: 700,
                      boxShadow:
                        item.status === 'completed'
                          ? '0 4px 10px rgba(76, 175, 80, 0.23)'
                          : 'none',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s'
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
                    onClick={() => handleStatusChange(appliance.id, 'hold')}
                    style={{
                      flex: 1,
                      padding: '12px 0',
                      backgroundColor: item.status === 'hold' ? '#f57c00' : '#e0e0e0',
                      color: item.status === 'hold' ? '#fff' : '#333',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: '1em',
                      fontWeight: 700,
                      boxShadow:
                        item.status === 'hold'
                          ? '0 4px 10px rgba(245, 124, 0, 0.17)'
                          : 'none',
                      cursor: 'pointer',
                      userSelect: 'none',
                      transition: 'background-color 0.2s'
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
          onClick={() => navigate('/employee')}
          style={{
            marginTop: 32,
            padding: '14px 36px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            fontSize: '1.13rem',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(25, 118, 210, 0.13)',
            userSelect: 'none',
            transition: 'background-color 0.22s',
            display: 'block',
            marginLeft: 'auto'
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1565c0')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#1976d2')}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EmployeeInspection;
