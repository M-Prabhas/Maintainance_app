import React, { useState } from 'react';

const AddLocation = ({ sidebarOpen }) => {
  const [formData, setFormData] = useState({
    city: '',
    region: '',
    state: '',
    address: '',
    postalCode: '',
    contactPerson: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Location added: ' + JSON.stringify(formData));
  };

  const inputStyle = {
    flex: '1 1 calc(50% - 12px)',
    minWidth: 'min(100%, 250px)',
    padding: 'clamp(10px, 2.5vw, 14px)',
    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
    borderRadius: '8px',
    border: '1.5px solid #cbd5e1',
    minHeight: '44px',
    boxSizing: 'border-box',
  };

  return (
    <div className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <div className="form-container" style={{ padding: 'clamp(12px, 3vw, 20px)' }}>
        <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 2rem)', marginBottom: '16px' }}>Add New Location</h1>
        <div style={{ marginBottom: '16px', color: '#444', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', lineHeight: 1.5 }}>
          <strong>Instructions:</strong> Enter the city, region, and state for the new location. All fields are required for accurate record keeping.
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px, 2vw, 16px)', alignItems: 'stretch' }}>
          <input name="city" placeholder="City *" onChange={handleChange} required style={inputStyle} />
          <input name="region" placeholder="Region *" onChange={handleChange} required style={inputStyle} />
          <input name="state" placeholder="State *" onChange={handleChange} required style={inputStyle} />
          <input name="address" placeholder="Address *" onChange={handleChange} required style={{...inputStyle, flex: '1 1 100%'}} />
          <input name="postalCode" placeholder="Postal Code" onChange={handleChange} style={inputStyle} />
          <input name="contactPerson" placeholder="Contact Person" onChange={handleChange} style={inputStyle} />
          <input name="phone" placeholder="Phone" onChange={handleChange} style={inputStyle} type="tel" />
          <button type="submit" style={{
            flex: '1 1 100%',
            padding: 'clamp(12px, 3vw, 16px)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            minHeight: '48px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
          }}>Add Location</button>
        </form>
      </div>
    </div>
  );
};

export default AddLocation;
