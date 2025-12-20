import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mockUsers, mockLocations } from '../data/mockData';

// Fix for default Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom numbered icon
const createNumberedIcon = (number) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="
      background-color: #2563eb;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 14px;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    ">${number}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Component to fit bounds
const FitBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [locations, map]);
  return null;
};

// Helper to transform shared mock data into component state format
const getInitialEmployees = () => {
  return mockUsers
    .filter(u => u.role === 'employee' || u.role === 'thirdparty')
    .map(u => {
      const assignedLocs = u.assignedLocationIds.map(locId => {
        const loc = mockLocations.find(l => l.id === locId);
        return {
          locationId: locId,
          city: loc ? loc.city : 'Unknown',
          date: new Date().toISOString().slice(0, 10), // Mock date as it's not in user data
          role: u.role,
          notes: 'Assigned via system'
        };
      });

      return {
        employeeId: u.id.toString(), // Ensure string for consistency
        name: u.name,
        email: u.email,
        role: u.role,
        assignedLocations: assignedLocs,
        kpi: { // Mock KPI data as it's not in shared data
          completedTasks: Math.floor(Math.random() * 20),
          activeLocations: assignedLocs.length,
          overdueTasks: Math.floor(Math.random() * 5)
        }
      };
    });
};

const rowsPerPage = 5;

// Haversine formula to calculate distance in km
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const LocationMultiPicker = ({ options, selectedIds, onAdd, onRemove, onReorder, disabled, anchorLocationId, onAutoAssign }) => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const ref = useRef();

  const filteredOptions = useMemo(() => {
    const lower = searchText.toLowerCase();

    // Get anchor location coordinates
    const anchorLocation = anchorLocationId
      ? options.find(opt => opt.id === anchorLocationId)
      : null;

    let availableOptions = options.filter(opt =>
      (opt.city.toLowerCase().includes(lower) || opt.id.toLowerCase().includes(lower)) &&
      !selectedIds.includes(opt.id)
    );

    if (anchorLocation && anchorLocation.lat && anchorLocation.lng) {
      // Calculate distances and filter by 20km radius
      availableOptions = availableOptions.map(opt => {
        const dist = calculateDistance(anchorLocation.lat, anchorLocation.lng, opt.lat, opt.lng);
        return { ...opt, distance: dist };
      }).filter(opt => opt.distance !== null && opt.distance <= 20)
        .sort((a, b) => a.distance - b.distance);
    }

    return availableOptions;
  }, [searchText, options, selectedIds, anchorLocationId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
        setSearchText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id) => {
    if (!disabled) {
      if (autoAssignEnabled && onAutoAssign) {
        onAutoAssign(id);
      } else {
        onAdd(id);
      }
      setSearchText('');
      setIsOpen(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }} ref={ref}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
        <input
          type="text"
          value={isOpen ? searchText : ''}
          onChange={e => { setSearchText(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search locations"
          disabled={disabled}
          aria-label="Search locations"
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '8px',
            border: disabled ? '1.5px solid #ccc' : '1.5px solid #d2d7df',
            fontSize: '1rem',
            outline: 'none',
            cursor: disabled ? 'not-allowed' : 'text'
          }}
        />
        <button
          type="button"
          onClick={() => setAutoAssignEnabled(!autoAssignEnabled)}
          title="Auto-assign 10 nearby locations"
          style={{
            padding: '0 12px',
            borderRadius: '8px',
            border: '1px solid #d2d7df',
            backgroundColor: autoAssignEnabled ? '#e0f2fe' : '#fff',
            color: autoAssignEnabled ? '#0284c7' : '#6b7280',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: '0.9rem', fontWeight: '600', marginRight: '4px' }}>Auto (10)</span>
          {autoAssignEnabled ? '✅' : '⬜'}
        </button>
      </div>
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 4px)',
          left: 0, right: 0,
          maxHeight: '180px',
          overflowY: 'auto',
          backgroundColor: '#fff',
          border: '1px solid #d2d7df',
          borderRadius: '8px',
          zIndex: 1000,
          boxShadow: '0 3px 12px rgba(0,0,0,0.1)'
        }}>
          {filteredOptions.length > 0 ? (
            filteredOptions.map(opt => (
              <div
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                onMouseDown={e => e.preventDefault()} // prevent input blur
                style={{
                  padding: '10px 15px',
                  cursor: 'pointer',
                  backgroundColor: '#fff'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e7f3fb'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
              >
                {opt.id} - {opt.city}
                {opt.distance !== undefined && opt.distance !== null && (
                  <span style={{ fontSize: '0.85rem', color: '#666', marginLeft: '8px' }}>
                    ({opt.distance < 1 ? '< 1 km' : `~${Math.round(opt.distance)} km`})
                  </span>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '12px', color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
              {anchorLocationId ? 'No other nearby locations found.' : 'No locations found.'}
            </div>
          )}
        </div>
      )}
      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {selectedIds.map((id, index) => (
          <span key={id} style={{
            background: '#e2f0fc',
            padding: '6px 12px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#2563eb'
          }}>
            <span style={{
              background: '#2563eb', color: 'white', borderRadius: '50%',
              width: '18px', height: '18px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '0.75rem', marginRight: '6px'
            }}>
              {index + 1}
            </span>
            {id}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '6px', gap: '1px' }}>
              <button
                type="button"
                onClick={() => onReorder(index, -1)}
                disabled={index === 0}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, lineHeight: 0.5, fontSize: '0.7rem', color: index === 0 ? '#ccc' : '#2563eb' }}
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => onReorder(index, 1)}
                disabled={index === selectedIds.length - 1}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, lineHeight: 0.5, fontSize: '0.7rem', color: index === selectedIds.length - 1 ? '#ccc' : '#2563eb' }}
              >
                ▼
              </button>
            </div>
            <button
              onClick={() => onRemove(id)}
              aria-label={`Remove location ${id}`}
              style={{
                border: 'none',
                background: 'transparent',
                marginLeft: '8px',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '1.2rem',
                color: '#2563eb',
                lineHeight: 1,
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#194291'}
              onMouseLeave={e => e.currentTarget.style.color = '#2563eb'}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

const MapModal = ({ locations, onClose, onUpdateOrder, readOnly = false }) => {
  if (!locations || locations.length === 0) return null;

  const polylinePositions = locations.map(l => [l.lat, l.lng]);

  const handleSequenceChange = (currentIndex, newSequence) => {
    const newIndex = parseInt(newSequence) - 1;
    if (isNaN(newIndex) || newIndex < 0 || newIndex >= locations.length || newIndex === currentIndex) return;

    const newLocations = [...locations];
    const [movedItem] = newLocations.splice(currentIndex, 1);
    newLocations.splice(newIndex, 0, movedItem);

    onUpdateOrder(newLocations.map(l => l.id));
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 3000,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }} className="map-modal-overlay">
      <div style={{
        backgroundColor: 'white', borderRadius: '12px',
        width: '90%', maxWidth: '900px', height: '80vh', position: 'relative', display: 'flex', overflow: 'hidden'
      }} className="map-modal-content">
        {/* Sidebar for List */}
        <div style={{ width: '300px', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }} className="map-modal-sidebar">
          <div style={{ padding: '16px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{readOnly ? 'Assigned Locations' : 'Route Order'}</h3>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {locations.map((loc, index) => (
              <div key={loc.id} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '10px', marginBottom: '8px', backgroundColor: 'white',
                borderRadius: '8px', border: '1px solid #e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                {!readOnly && (
                  <input
                    type="number"
                    min="1"
                    max={locations.length}
                    value={index + 1}
                    onChange={(e) => handleSequenceChange(index, e.target.value)}
                    style={{
                      width: '40px', padding: '4px', textAlign: 'center',
                      borderRadius: '4px', border: '1px solid #d1d5db', fontWeight: 'bold'
                    }}
                  />
                )}
                {readOnly && (
                  <div style={{
                    width: '24px', height: '24px', borderRadius: '50%', background: '#2563eb', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{loc.city}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{loc.id}</div>
                </div>
              </div>
            ))}
          </div>
          {!readOnly && (
            <div style={{ padding: '12px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', borderTop: '1px solid #eee' }}>
              Type a number to move location
            </div>
          )}
        </div>

        {/* Map Area */}
        <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }} className="map-modal-map">
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '15px', right: '15px',
              background: 'white', border: 'none', fontSize: '1.5rem', cursor: 'pointer', zIndex: 1000,
              width: '36px', height: '36px', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            &times;
          </button>

          <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <FitBounds locations={locations} />
            <Polyline positions={polylinePositions} color="blue" />
            {locations.map((loc, index) => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={createNumberedIcon(index + 1)}
              >
                <Popup>
                  <strong>{index + 1}. {loc.city}</strong><br />
                  {loc.id}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};



const AssignLocation = () => {
  const [employees, setEmployees] = useState(getInitialEmployees());
  const [assigningEmployeeId, setAssigningEmployeeId] = useState('');
  const [formData, setFormData] = useState({
    locationIds: [],
    assignmentDate: '',
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showMap, setShowMap] = useState(false);
  const [viewingMapEmployeeId, setViewingMapEmployeeId] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const highlightIfToday = (date) => date === todayStr ? { background: "#e2ffd8" } : {};

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees;
    const lower = searchTerm.toLowerCase();
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(lower) ||
      emp.employeeId.toLowerCase().includes(lower) ||
      emp.email.toLowerCase().includes(lower)
    );
  }, [employees, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));
  const pagedEmployees = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredEmployees.slice(start, start + rowsPerPage);
  }, [filteredEmployees, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [searchTerm]);

  const handleAssignClick = (employeeId) => {
    setAssigningEmployeeId(employeeId);
    setFormData({
      locationIds: [],
      assignmentDate: '',
      notes: ''
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddLocation = (id) => {
    setFormData(prev => ({
      ...prev,
      locationIds: prev.locationIds.includes(id) ? prev.locationIds : [...prev.locationIds, id]
    }));
  };

  const handleRemoveLocation = (id) => {
    setFormData(prev => ({
      ...prev,
      locationIds: prev.locationIds.filter(locId => locId !== id)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.assignmentDate) {
      alert('Please select assignment date');
      return;
    }
    if (formData.locationIds.length === 0) {
      alert('Please select at least one location');
      return;
    }

    const assigningEmployeeRole = employees.find(emp => emp.employeeId === assigningEmployeeId)?.role || '';

    const newLocations = formData.locationIds.map(id => {
      const city = mockLocations.find(loc => loc.id === id)?.city || '-';
      return {
        locationId: id,
        city,
        date: formData.assignmentDate,
        role: assigningEmployeeRole,
        notes: formData.notes
      };
    });

    const updatedEmployees = employees.map(emp => {
      if (emp.employeeId === assigningEmployeeId) {
        return {
          ...emp,
          assignedLocations: [...emp.assignedLocations, ...newLocations]
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setAssigningEmployeeId('');
    setFormData({
      locationIds: [],
      assignmentDate: '',
      notes: ''
    });
    alert('Locations assigned!');
  };

  // Pagination button styles reused from original
  const paginationButtonStyle = (disabled) => ({
    padding: '10px 20px',
    backgroundColor: disabled ? '#e0e0e0' : '#2563eb',
    color: disabled ? '#9e9e9e' : '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    boxShadow: disabled ? 'none' : '0 2px 8px rgba(37, 99, 235, 0.5)',
    transition: 'background-color 0.3s ease'
  });

  const handleReorderLocation = (index, direction) => {
    const newLocations = [...formData.locationIds];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newLocations.length) {
      [newLocations[index], newLocations[targetIndex]] = [newLocations[targetIndex], newLocations[index]];
      setFormData(prev => ({ ...prev, locationIds: newLocations }));
    }
  };

  const handleUpdateLocationOrder = (newLocationIds) => {
    setFormData(prev => ({ ...prev, locationIds: newLocationIds }));
  };

  const handleAddMultipleLocations = (newIds) => {
    setFormData(prev => {
      const currentIds = new Set(prev.locationIds);
      const uniqueNewIds = newIds.filter(id => !currentIds.has(id));
      return {
        ...prev,
        locationIds: [...prev.locationIds, ...uniqueNewIds]
      };
    });
  };

  const handleAutoAssign = (centerId) => {
    const centerLoc = mockLocations.find(l => l.id === centerId);
    if (!centerLoc) return;

    // Find 10 nearest unselected locations
    const selectedIds = new Set(formData.locationIds);
    // Include the center location in selected so we don't duplicate it if it's not already there
    selectedIds.add(centerId);

    const unselected = mockLocations.filter(l => !selectedIds.has(l.id));

    if (unselected.length === 0) {
      handleAddLocation(centerId); // Just add the center one
      return;
    }

    const withDist = unselected.map(l => {
      const dist = calculateDistance(centerLoc.lat, centerLoc.lng, l.lat, l.lng);
      return { ...l, distance: dist };
    });

    withDist.sort((a, b) => a.distance - b.distance);
    const nearest10 = withDist.slice(0, 10).map(l => l.id);

    // Add center + nearest 10
    handleAddMultipleLocations([centerId, ...nearest10]);
    alert(`Added ${centerId} and auto-assigned ${nearest10.length} nearby locations!`);
  };

  return (
    <div className="form-container" style={isMobile ? { padding: '16px' } : {}}>
      <h1>Assign Location to Employee</h1>
      <br />

      {/* Search Bar */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexDirection: isMobile ? 'column' : 'row' }}>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* Employee List Table */}
      <div className="table-container" style={{ boxShadow: 'none', border: '1px solid #eee', marginTop: 0 }}>
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Role</th>
              <th>Assigned Locations</th>
              <th>Map</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedEmployees.length > 0 ? (
              pagedEmployees.map(emp => (
                <tr key={emp.employeeId}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#333' }}>{emp.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{emp.email}</div>
                  </td>
                  <td>
                    <span className={`status-badge ${emp.role === 'thirdparty' ? 'status-pending' : 'status-active'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td>
                    {emp.assignedLocations.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {emp.assignedLocations.map((loc, idx) => (
                          <span key={idx} style={{
                            background: '#f0f4f8',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.85rem',
                            border: '1px solid #e1e4e8',
                            ...highlightIfToday(loc.date)
                          }}>
                            {loc.locationId}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>None</span>
                    )}
                  </td>
                  <td>
                    {emp.assignedLocations.length > 0 && (
                      <button
                        onClick={() => setViewingMapEmployeeId(emp.employeeId)}
                        title="View Map"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontSize: '1.2rem', padding: '4px 8px', borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f9ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        🗺️
                      </button>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAssignClick(emp.employeeId)}
                      style={{ padding: '6px 12px', fontSize: '0.9rem' }}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center" style={{ padding: '32px', color: '#666' }}>
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={paginationButtonStyle(currentPage === 1)}
          >
            Previous
          </button>
          <span style={{ alignSelf: 'center', fontWeight: '600' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={paginationButtonStyle(currentPage === totalPages)}
          >
            Next
          </button>
        </div>
      )}

      {/* Assignment Modal/Form Overlay */}
      {assigningEmployeeId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: isMobile ? '16px' : '0'
        }}>
          <div style={{
            background: 'white',
            padding: isMobile ? '20px' : '32px',
            borderRadius: '12px',
            width: isMobile ? '100%' : '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            maxHeight: isMobile ? '90vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            <h2 style={{ marginTop: 0, color: '#1976d2', fontSize: isMobile ? '1.5rem' : '1.8rem' }}>Assign Locations</h2>
            <p style={{ marginBottom: '24px', color: '#666' }}>
              Assigning to: <strong>{employees.find(e => e.employeeId === assigningEmployeeId)?.name}</strong>
            </p>

            <form onSubmit={handleSubmit}>


              <div className="form-group">
                <label>Assignment Date</label>
                <input
                  type="date"
                  name="assignmentDate"
                  value={formData.assignmentDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ marginBottom: 0 }}>Select Locations</label>
                  {formData.locationIds.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowMap(true)}
                      style={{
                        background: 'none', border: 'none', color: '#2563eb',
                        cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>🗺️</span> Map View
                    </button>
                  )}
                </div>
                <LocationMultiPicker
                  options={mockLocations}
                  selectedIds={formData.locationIds}
                  onAdd={handleAddLocation}
                  onRemove={handleRemoveLocation}
                  onReorder={handleReorderLocation}
                  disabled={!formData.assignmentDate}
                  anchorLocationId={formData.locationIds.length > 0 ? formData.locationIds[0] : null}
                  onAutoAssign={handleAutoAssign}
                />
              </div>
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter any specific instructions..."
                  disabled={!formData.assignmentDate}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', flexDirection: isMobile ? 'column' : 'row' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setAssigningEmployeeId('')}
                  style={{
                    ...(isMobile ? { width: '100%', justifyContent: 'center' } : { flex: 1 }),
                    backgroundColor: '#757575',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    border: 'none'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    ...(isMobile ? { width: '100%', justifyContent: 'center' } : { flex: 1 }),
                    marginTop: 0
                  }}
                >
                  Confirm Assignment
                </button>
              </div>
            </form >
          </div >
        </div >
      )}
      {
        assigningEmployeeId && showMap && (
          <MapModal
            locations={formData.locationIds.map(id => mockLocations.find(l => l.id === id))}
            onClose={() => setShowMap(false)}
            onUpdateOrder={handleUpdateLocationOrder}
          />
        )
      }
      {
        viewingMapEmployeeId && (
          <MapModal
            locations={employees.find(e => e.employeeId === viewingMapEmployeeId)?.assignedLocations.map(al => mockLocations.find(ml => ml.id === al.locationId)).filter(Boolean) || []}
            onClose={() => setViewingMapEmployeeId(null)}
            readOnly={true}
          />
        )
      }
    </div >
  );
};

export default AssignLocation;
