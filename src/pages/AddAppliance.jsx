import React, { useState } from 'react';

const AddAppliance = ({ sidebarOpen }) => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    category: '',
    locationId: '',
    storeId: '',
    amcVendor: '',
    amcStartDate: '',
    amcEndDate: '',
    purchaseDate: '',
    warrantyPeriod: '',
    status: 'active',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Appliance added: ' + JSON.stringify(formData));
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
        <h1 style={{ fontSize: 'clamp(1.25rem, 5vw, 2rem)', marginBottom: '16px' }}>Add Appliance</h1>
        <div style={{ marginBottom: '16px', color: '#444', fontSize: 'clamp(0.85rem, 2.5vw, 1rem)', lineHeight: 1.5 }}>
          <strong>Instructions:</strong> Please fill out all required fields. Ensure the appliance details are accurate. AMC dates are optional but recommended for tracking contract periods.
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(10px, 2vw, 16px)', alignItems: 'stretch' }}>
          <input name="name" placeholder="Appliance Name *" onChange={handleChange} required style={inputStyle} />
          <input name="model" placeholder="Model *" onChange={handleChange} required style={inputStyle} />
          <input name="serialNumber" placeholder="Serial Number *" onChange={handleChange} required style={inputStyle} />
          <input name="category" placeholder="Category *" onChange={handleChange} required style={inputStyle} />
          <input name="locationId" placeholder="Location ID *" onChange={handleChange} required style={inputStyle} />
          <input name="storeId" placeholder="Store ID (optional)" onChange={handleChange} style={inputStyle} />
          <input name="amcVendor" placeholder="AMC Vendor" onChange={handleChange} style={inputStyle} />
          <input type="date" name="amcStartDate" onChange={handleChange} style={inputStyle} aria-label="AMC Start Date" />
          <input type="date" name="amcEndDate" onChange={handleChange} style={inputStyle} aria-label="AMC End Date" />
          <input type="date" name="purchaseDate" placeholder="Purchase Date" onChange={handleChange} style={inputStyle} aria-label="Purchase Date" />
          <input name="warrantyPeriod" placeholder="Warranty Period (months)" onChange={handleChange} style={inputStyle} />
          <select name="status" onChange={handleChange} style={inputStyle}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input name="notes" placeholder="Notes (optional)" onChange={handleChange} style={{...inputStyle, flex: '1 1 100%'}} />
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
          }}>Add Appliance</button>
        </form>
      </div>
    </div>
  );
};

export default AddAppliance;
