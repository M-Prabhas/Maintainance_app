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

const mockSubTasks = [
  'Check Power Supply Voltage',
  'Inspect Wiring & Connections',
  'Clean Filters & Vents',
  'Check for Abnormal Noise/Vibration',
  'Verify Control Panel Functionality'
];

const EmployeeInspection = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();

  const store = mockStores.find(s => s.id === parseInt(storeId));
  const appliances = mockAppliances.filter(a => a.storeId === parseInt(storeId));

  const [checklist, setChecklist] = useState(() => {
    const initial = {};
    appliances.forEach(appliance => {
      initial[appliance.id] = {
        beforePhoto: null,
        afterPhoto: null,
        subTasks: mockSubTasks.reduce((acc, task) => ({ ...acc, [task]: false }), {}),
        isInspected: false // Track if visited/filled
      };
    });
    return initial;
  });

  const [selectedApplianceId, setSelectedApplianceId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Global State
  const [globalRemarks, setGlobalRemarks] = useState('');
  const [globalStatus, setGlobalStatus] = useState(''); // 'completed', 'support_assist', 'not_accepted'

  const updateChecklist = (applianceId, updates) => {
    setChecklist(prev => ({ ...prev, [applianceId]: { ...prev[applianceId], ...updates } }));
  };

  const handlePhotoUpload = (applianceId, type, file) => {
    if (file) {
      const photoUrl = URL.createObjectURL(file);
      updateChecklist(applianceId, { [type]: photoUrl });
    }
  };

  const handleSubTaskChange = (applianceId, task, checked) => {
    setChecklist(prev => ({
      ...prev,
      [applianceId]: {
        ...prev[applianceId],
        subTasks: {
          ...prev[applianceId].subTasks,
          [task]: checked
        }
      }
    }));
  };

  const handleSaveModal = () => {
    // Mark as inspected if at least something is done (e.g. strict check or loose check).
    // Let's assume if modal is opened and saved, we mark it visited/inspected.
    // Or better: check if mandatory fields are filled?
    // For now, simple "Mark as Done" logic

    // Simple validation: Need at least one photo or check? User said just "save/close".
    updateChecklist(selectedApplianceId, { isInspected: true });
    setSelectedApplianceId(null);
  };

  const handleSubmitReport = async () => {
    if (!globalStatus) {
      alert('Please select an overall Status (Completed, Support Assist, or Not Done).');
      return;
    }
    if ((globalStatus === 'support_assist' || globalStatus === 'not_accepted') && !globalRemarks.trim()) {
      alert('Global Remarks are mandatory for Support Assist or Not Done status.');
      return;
    }

    setSubmitLoading(true);

    try {
      await new Promise(res => setTimeout(res, 1500));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {

    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredAppliances = appliances.filter(app =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!store) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#b00020' }}>Store not found.</div>
    );
  }

  const selectedAppliance = selectedApplianceId ? appliances.find(a => a.id === selectedApplianceId) : null;
  const selectedItem = selectedAppliance ? checklist[selectedAppliance.id] : null;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f6f8fc',
        display: 'flex',
        justifyContent: 'center', // Centered content
        alignItems: 'flex-start',
        paddingTop: '15px',
        paddingBottom: '35px',
        width: '100%'
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
        <h1 style={{
          fontWeight: 800,
          fontSize: '2.2rem',
          marginBottom: 0,
          color: '#1976d2',
          letterSpacing: '1.5px',
          textAlign: 'center',
          borderBottom: '2px solid #eeeeee',
          paddingBottom: 6,
        }}>
          Appliance Inspection <span style={{ color: '#333' }}>- {store.name}</span>
        </h1>
        <p style={{ fontSize: '1.13rem', color: '#555', marginBottom: 24, textAlign: 'center' }}>{store.address}</p>

        {/* Search Bar */}
        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search Appliance..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '95%',
              padding: '12px 16px',
              fontSize: '1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          />
        </div>

        {showSuccess && (
          <div style={{
            color: '#155724',
            backgroundColor: '#e7f6e7',
            border: '1.5px solid #c6e3c6',
            borderRadius: 6,
            padding: '10px 20px',
            marginBottom: 16,
            fontWeight: 600,
            boxShadow: '0 2px 4px rgba(0,0,0,0.07)',
          }}>
            ✓ Report submitted successfully!
          </div>
        )}

        {/* Appliance List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredAppliances.map(appliance => {
            const item = checklist[appliance.id];
            // Determine if "Ready" / Inspected
            const isDone = item.isInspected;

            return (
              <div
                key={appliance.id}
                onClick={() => setSelectedApplianceId(appliance.id)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#1976d2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#222', fontWeight: '700' }}>{appliance.name}</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                    {appliance.model} • {appliance.serialNumber}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isDone ? (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: '#e8f5e9',
                      color: '#2e7d32'
                    }}>
                      ✓ Checked
                    </span>
                  ) : (
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: '#f5f5f5',
                      color: '#777'
                    }}>
                      Pending
                    </span>
                  )}
                  <span style={{ fontSize: '1.5rem', color: '#1976d2' }}>→</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Universal Remarks & Status Section */}
        <div style={{ marginTop: '40px', padding: '24px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0, color: '#1976d2' }}>Inspection Summary</h3>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Global Remarks / Observation</label>
            <textarea
              placeholder="Enter overall remarks for this location (Mandatory for Support Assist / Not Accepted)..."
              value={globalRemarks}
              onChange={e => setGlobalRemarks(e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: 12,
                fontSize: '1em',
                border: '1px solid #ccc',
                borderRadius: 6,
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: '#333' }}>Overall Status</label>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setGlobalStatus('completed')}
              style={{
                flex: 1,
                padding: '12px 0',
                backgroundColor: globalStatus === 'completed' ? '#4caf50' : '#e0e0e0',
                color: globalStatus === 'completed' ? '#fff' : '#555',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: globalStatus === 'completed' ? '0 2px 6px rgba(76, 175, 80, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              ✓ Completed
            </button>
            <button
              onClick={() => setGlobalStatus('support_assist')}
              style={{
                flex: 1,
                padding: '12px 0',
                backgroundColor: globalStatus === 'support_assist' ? '#f57c00' : '#e0e0e0',
                color: globalStatus === 'support_assist' ? '#fff' : '#555',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: globalStatus === 'support_assist' ? '0 2px 6px rgba(245, 124, 0, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              🔧 Support Assist
            </button>
            <button
              onClick={() => setGlobalStatus('not_accepted')}
              style={{
                flex: 1,
                padding: '12px 0',
                backgroundColor: globalStatus === 'not_accepted' ? '#d32f2f' : '#e0e0e0',
                color: globalStatus === 'not_accepted' ? '#fff' : '#555',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: globalStatus === 'not_accepted' ? '0 2px 6px rgba(211, 47, 47, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              ✕ Not Done
            </button>
          </div>
        </div>

        {/* Submit Report Button */}
        <div style={{ marginTop: 32, textAlign: 'center', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#fff',
              color: '#1976d2',
              border: '2px solid #1976d2',
              borderRadius: "10px",
              cursor: 'pointer',
              display: "inline-block",
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(25,118,210,0.1)',
            }}
          >
            Download Report
          </button>
          <button
            onClick={handleSubmitReport}
            disabled={submitLoading}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: submitLoading ? '#90caf9' : '#1976d2',
              color: '#fff',
              border: 'none',
              borderRadius: "10px",
              display: "inline-block",
              cursor: submitLoading ? 'not-allowed' : 'pointer',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(25,118,210,0.4)',
            }}
          >
            {submitLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>

        {/* Back to Dashboard Button */}
        <button
          onClick={() => navigate('/employee')}
          style={{
            marginTop: 32,
            padding: '14px 36px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 14,
            fontWeight: '700',
            cursor: 'pointer',
            display: 'block',
            marginLeft: 'auto'
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Modal Overlay */}
      {selectedAppliance && selectedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 2000, // Increased z-index
          overflowY: 'auto', // Allow scrolling of the overlay itself
          padding: '40px 20px', // Add padding for spacing
          display: 'flex',
          alignItems: 'flex-start', // Align to top so scrolling works correctly
          justifyContent: 'center'
        }} onClick={handleSaveModal}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '600px',
            // Removed maxHeight and overflowY to allow full height
            padding: '24px',
            position: 'relative',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            margin: 'auto' // Center vertically if content is short
          }} onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#1976d2' }}>{selectedAppliance.name}</h2>
                <p style={{ margin: '4px 0 0 0', color: '#666' }}>{selectedAppliance.model} • {selectedAppliance.serialNumber}</p>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.9rem', color: '#888' }}>
                  <strong>Category:</strong> {selectedAppliance.category} | <strong>AMC:</strong> {selectedAppliance.amcVendor}
                </p>
              </div>
              <button
                onClick={handleSaveModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div>
              {/* Before Work Photo */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  1. Before Work Photo <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(selectedAppliance.id, 'beforePhoto', e.target.files[0])}
                />
                {selectedItem.beforePhoto && <div style={{ marginTop: '6px', color: 'green', fontSize: '0.9rem', fontWeight: '500' }}>✓ Photo Uploaded</div>}
              </div>

              {/* Sub-tasks */}
              <div style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: '#333' }}>
                  2. Inspection Checklist <span style={{ color: 'red' }}>*</span>
                  {!selectedItem.beforePhoto && <span style={{ fontSize: '0.85rem', color: '#d32f2f', marginLeft: '10px', fontWeight: 'normal' }}>(Upload Before Photo to enable)</span>}
                </label>
                {mockSubTasks.map(task => (
                  <div key={task} style={{ marginBottom: '8px' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: selectedItem.beforePhoto ? 'pointer' : 'not-allowed',
                      color: selectedItem.beforePhoto ? '#333' : '#999'
                    }}>
                      <input
                        type="checkbox"
                        checked={selectedItem.subTasks[task]}
                        onChange={(e) => handleSubTaskChange(selectedAppliance.id, task, e.target.checked)}
                        disabled={!selectedItem.beforePhoto}
                        style={{ width: '18px', height: '18px', accentColor: '#1976d2' }}
                      />
                      {task}
                    </label>
                  </div>
                ))}
              </div>

              {/* After Work Photo */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                  3. After Work Photo <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(selectedAppliance.id, 'afterPhoto', e.target.files[0])}
                />
                {selectedItem.afterPhoto && <div style={{ marginTop: '6px', color: 'green', fontSize: '0.9rem', fontWeight: '500' }}>✓ Photo Uploaded</div>}
              </div>

              <div style={{ marginTop: '30px', textAlign: 'right' }}>
                <button
                  onClick={handleSaveModal}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '1rem',
                    boxShadow: '0 4px 12px rgba(25,118,210,0.3)'
                  }}
                >
                  Save & Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeInspection;
