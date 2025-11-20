import React, { useState } from 'react';

const MapAppliance = () => {
  const [formData, setFormData] = useState({
    applianceId: '',
    locationId: '',
    storeId: '',
    mappingDate: '',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Mapping submitted: ' + JSON.stringify(formData));
  };

  return (
    <div className="form-container">
      <h1>Map Appliance to Location</h1>
      <br />
      <div style={{ marginBottom: '16px', color: '#444' }}>
        <strong>Instructions:</strong> Select the appliance and location to map. Store ID is optional if the appliance is not tied to a specific store.
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <input name="applianceId" placeholder="Appliance ID" onChange={handleChange} required />
        <input name="locationId" placeholder="Location ID" onChange={handleChange} required />
        <input name="storeId" placeholder="Store ID (optional)" onChange={handleChange} />
        <input type="date" name="mappingDate" placeholder="Mapping Date" onChange={handleChange} />
        <input name="notes" placeholder="Notes (optional)" onChange={handleChange} />
        <button type="submit">Map Appliance</button>
      </form>
    </div>
  );
};

export default MapAppliance;
