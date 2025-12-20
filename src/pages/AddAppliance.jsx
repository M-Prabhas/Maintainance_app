import React, { useState } from 'react';
import { mockLocations } from '../data/mockData';

const AddAppliance = () => {
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    serialNumber: '',
    category: '',
    locationId: '',
    storeId: '',
    amcVendor: '',
    purchaseDate: '',
    warrantyPeriod: '',
    status: 'active',
    notes: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleLocationSelect = (location) => {
    setFormData({ ...formData, locationId: location.id });
    setSelectedLocation(location);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleCancelLocation = () => {
    setFormData({ ...formData, locationId: '' });
    setSelectedLocation(null);
    setSearchTerm('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Appliance added: ' + JSON.stringify(formData));
  };

  const filteredLocations = mockLocations.filter(loc =>
    loc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loc.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="form-container">
      <h1>Add Appliance</h1>
      <br />
      <div style={{ marginBottom: '16px', color: '#444' }}>
        <strong>Instructions:</strong> Please fill out all required fields. Ensure the appliance details are accurate.
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        <input name="name" placeholder="Appliance Name" onChange={handleChange} required />
        <input name="model" placeholder="Model" onChange={handleChange} required />
        <input name="serialNumber" placeholder="Serial Number" onChange={handleChange} required />
        <input name="category" placeholder="Category" onChange={handleChange} required />

        {/* Location Search Section */}
        <div style={{ position: 'relative', width: '100%' }}>
          {!selectedLocation ? (
            <>
              <input
                placeholder="Search Location ID or City"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setShowSuggestions(true)}
              />
              {showSuggestions && searchTerm && (
                <ul style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'white',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  zIndex: 1000,
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {filteredLocations.map(loc => (
                    <li
                      key={loc.id}
                      onClick={() => handleLocationSelect(loc)}
                      style={{
                        padding: '8px 12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.background = 'white'}
                    >
                      <strong>{loc.id}</strong> - {loc.region}, {loc.city}
                    </li>
                  ))}
                  {filteredLocations.length === 0 && (
                    <li style={{ padding: '8px 12px', color: '#999' }}>No locations found</li>
                  )}
                </ul>
              )}
            </>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 18px',
              background: '#e7f3ff',
              border: '1.5px solid #90cdf4',
              borderRadius: '8px',
              color: '#1e3a8a',
              fontWeight: '500',
              marginBottom: '12px'
            }}>
              <span>
                <strong>{selectedLocation.id}</strong> ({selectedLocation.region}, {selectedLocation.city})
              </span>
              <button
                type="button"
                onClick={handleCancelLocation}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#dc3545',
                  fontSize: '16px',
                  cursor: 'pointer',
                  padding: '0 0 0 10px',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <input name="storeId" placeholder="Store ID (optional)" onChange={handleChange} />
        <input name="amcVendor" placeholder="AMC Vendor" onChange={handleChange} />

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
  );
};

export default AddAppliance;
