import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
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

const LocationMultiPicker = ({ options, selectedIds, onAdd, onRemove, onReorder, disabled, anchorLocationId, onAutoAssign, onUpdateOrder }) => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);
  const ref = useRef();

  // DnD State
  const [draggedIndex, setDraggedIndex] = useState(null);

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

  // Drag Handlers for Pills
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent dummy image or just let default ghost happen
  };

  const handleDragOver = (e, index) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newIds = [...selectedIds];
    const [movedStep] = newIds.splice(draggedIndex, 1);
    newIds.splice(targetIndex, 0, movedStep);

    if (onUpdateOrder) {
      onUpdateOrder(newIds);
    }
    setDraggedIndex(null);
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
          <span
            key={id}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            style={{
              background: '#e2f0fc',
              padding: '6px 12px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#2563eb',
              cursor: disabled ? 'default' : 'move',
              opacity: draggedIndex === index ? 0.5 : 1,
              transition: 'all 0.2s'
            }}
          >
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
  const [draggedIndex, setDraggedIndex] = useState(null);

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

  const handleDragStart = (e, index) => {
    if (readOnly) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (readOnly) return;
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (readOnly || draggedIndex === null || draggedIndex === targetIndex) return;

    const newLocations = [...locations];
    const [movedItem] = newLocations.splice(draggedIndex, 1);
    newLocations.splice(targetIndex, 0, movedItem);

    onUpdateOrder(newLocations.map(l => l.id));
    setDraggedIndex(null);
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
              <div
                key={loc.id}
                draggable={!readOnly}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px', marginBottom: '8px', backgroundColor: 'white',
                  borderRadius: '8px', border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  cursor: !readOnly ? 'grab' : 'default',
                  opacity: draggedIndex === index ? 0.5 : 1
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
                {!readOnly && (
                  <div style={{ color: '#ccc', cursor: 'grab' }}>☰</div>
                )}
              </div>
            ))}
          </div>
          {!readOnly && (
            <div style={{ padding: '12px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', borderTop: '1px solid #eee' }}>
              Drag items to reorder route
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

  const [columnFilters, setColumnFilters] = useState({
    name: '',
    role: '',
    location: '',
    date: '',
    email: ''
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const todayStr = new Date().toISOString().slice(0, 10);
  const highlightIfToday = (date) => date === todayStr ? { background: "#e2ffd8" } : {};

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      // Global search (if kept, or remove if using only column filters - user asked for "in table filters" so columns are key. 
      // But keeping search bar + table filters is fine or let's just make search bar affect name/email too?
      // The user said "style it properly with the in table filters and remove the date filter at the top". 
      // The search bar "Search employees..." is existing. I will keep it for now as a global text search if desired, 
      // or just assume they want ONLY table filters. 
      // Let's keep global search as an "OR" or "AND"? Usually AND.

      const globalMatch = !searchTerm.trim() ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase());

      if (!globalMatch) return false;

      // Column filters
      if (columnFilters.name && !emp.name.toLowerCase().includes(columnFilters.name.toLowerCase())) return false;
      if (columnFilters.role && !emp.role.toLowerCase().includes(columnFilters.role.toLowerCase())) return false;

      // Filter by location (check if ANY assigned location matches)
      if (columnFilters.location) {
        const hasMatchingLocation = emp.assignedLocations.some(loc =>
          loc.locationId.toLowerCase().includes(columnFilters.location.toLowerCase()) ||
          loc.city.toLowerCase().includes(columnFilters.location.toLowerCase())
        );
        if (!hasMatchingLocation) return false;
      }

      // Filter by date (check if ANY assigned location has this date)
      if (columnFilters.date) {
        const hasMatchingDate = emp.assignedLocations.some(loc => loc.date === columnFilters.date);
        if (!hasMatchingDate) return false;
      }

      return true;
    });
  }, [employees, searchTerm, columnFilters]);

  const handleColumnFilterChange = (key, value) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

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

      {/* Search Bar - User didn't explicitly say remove search bar, only date filter. Keeping it simple or removing if redundant. 
          "remove the date filter at the top". I will keep the search bar but style it cleaner if needed. */
       /* Actually, with in-table filters, the top search bar is often redundant. But let's keep it as a "Quick Search"? 
          Wait, the prompt said "style it properly with the in table filters". 
          I will remove the entire top bar if it contains date filter, OR just the date filter. 
          "remove the date filter at the top" -> implies keeping other things? 
          But often "in table filters" replaces global search. 
          I'll keep the search bar input but remove the date input.
       */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="filter-input" // Use our new class for consistency
          style={{ maxWidth: '300px' }}
        />
      </div>

      <div className="dashboard-table-container">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>
                <div className="header-cell-content">
                  Employee
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter Name..."
                    value={columnFilters.name || ''}
                    onChange={(e) => handleColumnFilterChange('name', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </th>
              <th>
                <div className="header-cell-content">
                  Role
                  <select
                    className="filter-input"
                    value={columnFilters.role || ''}
                    onChange={(e) => handleColumnFilterChange('role', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="">All</option>
                    <option value="employee">Employee</option>
                    <option value="thirdparty">Third Party</option>
                  </select>
                </div>
              </th>
              <th>
                <div className="header-cell-content">
                  Assigned Locations
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Filter Loc..."
                    value={columnFilters.location || ''}
                    onChange={(e) => handleColumnFilterChange('location', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </th>
              <th>
                <div className="header-cell-content">
                  Assigned Date
                  <input
                    type="date"
                    className="filter-input"
                    value={columnFilters.date || ''}
                    onChange={(e) => handleColumnFilterChange('date', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '130px' }}
                  />
                </div>
              </th>
              <th>Map</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pagedEmployees.length > 0 ? (
              pagedEmployees.map(emp => {
                // Filter displayed locations based on current filters
                const displayLocations = emp.assignedLocations.filter(loc => {
                  let matches = true;
                  if (columnFilters.location) {
                    matches = matches && (
                      loc.locationId.toLowerCase().includes(columnFilters.location.toLowerCase()) ||
                      loc.city.toLowerCase().includes(columnFilters.location.toLowerCase())
                    );
                  }
                  if (columnFilters.date) {
                    matches = matches && (loc.date === columnFilters.date);
                  }
                  return matches;
                });

                return (
                  <tr key={emp.employeeId}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#333' }}>{emp.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>{emp.email}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${emp.role === 'thirdparty' ? 'status-pending' : 'status-active'}`}>
                        {emp.role === 'thirdparty' ? 'Third Party' : 'Employee'}
                      </span>
                    </td>
                    <td>
                      {displayLocations.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {displayLocations.map((loc, idx) => (
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
                        <span style={{ color: '#999', fontStyle: 'italic' }}>
                          {emp.assignedLocations.length > 0 ? 'Filtered out' : 'None'}
                        </span>
                      )}
                    </td>
                    <td>
                      {displayLocations.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {displayLocations.map((loc, idx) => (
                            <span key={idx} style={{ fontSize: '0.85rem', color: '#555' }}>
                              {loc.date}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#999', fontStyle: 'italic' }}>-</span>
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
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center" style={{ padding: '32px', color: '#666' }}>
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
                  onUpdateOrder={handleUpdateLocationOrder}
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
