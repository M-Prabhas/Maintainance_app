import React, { useState } from 'react';

const AddLocation = () => {
  const [formData, setFormData] = useState({
    city: '',
    region: '',
    state: '',
    address: '',
    postalCode: '',
    contactPerson: '',

    phone: '',
    lat: '',
    lng: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Location added: ' + JSON.stringify(formData));
  };

  return (
    <div className="form-container">
      <h1>Add New Location</h1>
      <br />
      <div style={{ marginBottom: '16px', color: '#444' }}>
        <strong>Instructions:</strong> Enter the city, region, and state for the new location. All fields are required for accurate record keeping.
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <input name="city" placeholder="City" onChange={handleChange} required />
        <input name="region" placeholder="Region" onChange={handleChange} required />
        <input name="state" placeholder="State" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <input name="postalCode" placeholder="Postal Code" onChange={handleChange} />
        <input name="contactPerson" placeholder="Contact Person" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />

        {/* Coordinates Inputs */}
        <input name="lat" placeholder="Latitude" onChange={handleChange} style={{ width: '48%' }} />
        <input name="lng" placeholder="Longitude" onChange={handleChange} style={{ width: '48%' }} />

        <button type="submit">Add Location</button>
      </form>
    </div>
  );
};

export default AddLocation;
