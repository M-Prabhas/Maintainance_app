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

  return (
    <div className={`main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <div className="form-container">
        <h1>Add Appliance</h1>
        <br />
        <div style={{ marginBottom: '16px', color: '#444' }}>
          <strong>Instructions:</strong> Please fill out all required fields. Ensure the appliance details are accurate. AMC dates are optional but recommended for tracking contract periods.
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
          <input name="name" placeholder="Appliance Name" onChange={handleChange} required />
          <input name="model" placeholder="Model" onChange={handleChange} required />
          <input name="serialNumber" placeholder="Serial Number" onChange={handleChange} required />
          <input name="category" placeholder="Category" onChange={handleChange} required />
          <input name="locationId" placeholder="Location ID" onChange={handleChange} required />
          <input name="storeId" placeholder="Store ID (optional)" onChange={handleChange} />
          <input name="amcVendor" placeholder="AMC Vendor" onChange={handleChange} />
          <input type="date" name="amcStartDate" onChange={handleChange} />
          <input type="date" name="amcEndDate" onChange={handleChange} />
          <input type="date" name="purchaseDate" placeholder="Purchase Date" onChange={handleChange} />
          <input name="warrantyPeriod" placeholder="Warranty Period (months)" onChange={handleChange} />
          <select name="status" onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input name="notes" placeholder="Notes (optional)" onChange={handleChange} />
          <button type="submit">Add Appliance</button>
        </form>
      </div>
    </div>
  );
};

export default AddAppliance;
