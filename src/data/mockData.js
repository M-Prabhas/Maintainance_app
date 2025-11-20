// Location-based data structure
export const mockLocations = [
  { id: 'inmumbandheri', city: 'Mumbai', region: 'Andheri', state: 'Maharashtra' },
  { id: 'inmumbandra', city: 'Mumbai', region: 'Bandra', state: 'Maharashtra' },
  { id: 'indelcp', city: 'Delhi', region: 'Connaught Place', state: 'Delhi' },
  { id: 'inblrkrmngla', city: 'Bangalore', region: 'Koramangala', state: 'Karnataka' },
  { id: 'inblrwhitefield', city: 'Bangalore', region: 'Whitefield', state: 'Karnataka' }
];

// Users with location assignments
export const mockUsers = [
  { 
    id: 1, 
    name: 'Manager Singh', 
    email: 'manager@example.com', 
    password: 'manager123',
    role: 'manager',
    assignedLocationIds: ['inmumbandheri', 'inmumbandra'] // Mumbai locations
  },
  { 
    id: 2, 
    name: 'Manager Gupta', 
    email: 'manager.gupta@example.com', 
    password: 'manager123',
    role: 'manager',
    assignedLocationIds: ['indelcp'] // Delhi location
  },
  { 
    id: 3, 
    name: 'Manager Reddy', 
    email: 'manager.reddy@example.com', 
    password: 'manager123',
    role: 'manager',
    assignedLocationIds: ['inblrkrmngla', 'inblrwhitefield'] // Bangalore locations
  },
  { 
    id: 4, 
    name: 'Rajesh Kumar', 
    email: 'rajesh@example.com', 
    password: 'emp123',
    role: 'employee',
    assignedLocationIds: ['inmumbandheri']
  },
  { 
    id: 5, 
    name: 'Priya Sharma', 
    email: 'priya@example.com', 
    password: 'emp123',
    role: 'employee',
    assignedLocationIds: ['inmumbandra']
  },
  { 
    id: 6, 
    name: 'Karthik Rao', 
    email: 'karthik@example.com', 
    password: 'emp123',
    role: 'employee',
    assignedLocationIds: ['indelcp']
  },
  { 
    id: 7, 
    name: 'Suresh Iyer', 
    email: 'suresh@example.com', 
    password: 'emp123',
    role: 'employee',
    assignedLocationIds: ['inblrkrmngla', 'inblrwhitefield']
  },
  { 
    id: 8, 
    name: 'Third Party Tech', 
    email: 'vendor@example.com', 
    password: 'vendor123',
    role: 'thirdparty',
    assignedLocationIds: []
  }
];

// Stores mapped to location IDs
export const mockStores = [
  {
    id: 1,
    name: 'Store Alpha',
    locationId: 'inmumbandheri',
    address: '123 MG Road, Andheri West, Mumbai',
    contactPerson: 'Amit Patel',
    contactNumber: '+91 9876543210',
    status: 'active',
    lastMaintenanceDate: '2024-10-15',
    maintenanceFrequencyDays: 30
  },
  {
    id: 2,
    name: 'Store Beta',
    locationId: 'inmumbandheri',
    address: '456 SV Road, Andheri East, Mumbai',
    contactPerson: 'Sneha Desai',
    contactNumber: '+91 9876543211',
    status: 'active',
    lastMaintenanceDate: '2024-11-01',
    maintenanceFrequencyDays: 30
  },
  {
    id: 3,
    name: 'Store Gamma',
    locationId: 'inmumbandra',
    address: '789 Hill Road, Bandra West, Mumbai',
    contactPerson: 'Rohan Mehta',
    contactNumber: '+91 9876543212',
    status: 'active',
    lastMaintenanceDate: '2024-09-20',
    maintenanceFrequencyDays: 30
  },
  {
    id: 4,
    name: 'Store Delta',
    locationId: 'indelcp',
    address: '321 Rajiv Chowk, CP, Delhi',
    contactPerson: 'Neha Gupta',
    contactNumber: '+91 9876543213',
    status: 'active',
    lastMaintenanceDate: '2024-11-10',
    maintenanceFrequencyDays: 30
  },
  {
    id: 5,
    name: 'Store Epsilon',
    locationId: 'inblrkrmngla',
    address: '654 80 Feet Road, Koramangala, Bangalore',
    contactPerson: 'Karthik Reddy',
    contactNumber: '+91 9876543214',
    status: 'active',
    lastMaintenanceDate: '2024-10-25',
    maintenanceFrequencyDays: 30
  },
  {
    id: 6,
    name: 'Store Zeta',
    locationId: 'inblrwhitefield',
    address: '987 ITPL Main Road, Whitefield, Bangalore',
    contactPerson: 'Divya Iyer',
    contactNumber: '+91 9876543215',
    status: 'active',
    lastMaintenanceDate: '2024-11-05',
    maintenanceFrequencyDays: 30
  }
];

// Appliances mapped directly to location IDs
export const mockAppliances = [
  // Location: inmumbandheri (Andheri, Mumbai)
  { 
    id: 1, 
    locationId: 'inmumbandheri',
    name: 'Air Conditioner - Central Unit 1', 
    model: 'Daikin Split AC 1.5T',
    serialNumber: 'DAI-2024-001',
    category: 'HVAC',
    amcVendor: 'CoolTech Services',
    amcStartDate: '2024-01-15',
    amcEndDate: '2025-01-14',
    amcStatus: 'active'
  },
  { 
    id: 2, 
    locationId: 'inmumbandheri',
    name: 'Electrical Panel - Main', 
    model: 'Siemens 400A MCB',
    serialNumber: 'SIE-2023-045',
    category: 'Electrical',
    amcVendor: 'PowerSafe Solutions',
    amcStartDate: '2024-03-01',
    amcEndDate: '2025-02-28',
    amcStatus: 'active'
  },
  { 
    id: 3, 
    locationId: 'inmumbandheri',
    name: 'Fire Alarm System', 
    model: 'Honeywell FA-500',
    serialNumber: 'HON-2024-012',
    category: 'Safety',
    amcVendor: 'SafeGuard Systems',
    amcStartDate: '2024-02-10',
    amcEndDate: '2025-02-09',
    amcStatus: 'active'
  },
  { 
    id: 4, 
    locationId: 'inmumbandheri',
    name: 'Generator - Backup Power', 
    model: 'Cummins 50KVA',
    serialNumber: 'CUM-2023-089',
    category: 'Power',
    amcVendor: 'GenPower Maintenance',
    amcStartDate: '2023-12-01',
    amcEndDate: '2024-11-30',
    amcStatus: 'expiring'
  },
  
  // Location: inmumbandra (Bandra, Mumbai)
  { 
    id: 5, 
    locationId: 'inmumbandra',
    name: 'Air Conditioner - Office Block', 
    model: 'LG Dual Inverter 2T',
    serialNumber: 'LG-2024-034',
    category: 'HVAC',
    amcVendor: 'CoolTech Services',
    amcStartDate: '2024-04-01',
    amcEndDate: '2025-03-31',
    amcStatus: 'active'
  },
  { 
    id: 6, 
    locationId: 'inmumbandra',
    name: 'Water Pump - Main Supply', 
    model: 'Grundfos CR 5-12',
    serialNumber: 'GRU-2023-067',
    category: 'Plumbing',
    amcVendor: 'AquaTech Services',
    amcStartDate: '2024-01-20',
    amcEndDate: '2025-01-19',
    amcStatus: 'active'
  },
  { 
    id: 7, 
    locationId: 'inmumbandra',
    name: 'CCTV System - 12 Cameras', 
    model: 'Hikvision DS-7608',
    serialNumber: 'HIK-2024-023',
    category: 'Security',
    amcVendor: 'SecureView Technologies',
    amcStartDate: '2024-03-15',
    amcEndDate: '2025-03-14',
    amcStatus: 'active'
  },
  
  // Location: indelcp (Connaught Place, Delhi)
  { 
    id: 8, 
    locationId: 'indelcp',
    name: 'LED Lighting System', 
    model: 'Philips SmartBright 100W',
    serialNumber: 'PHI-2024-056',
    category: 'Electrical',
    amcVendor: 'BrightLight Solutions',
    amcStartDate: '2024-02-01',
    amcEndDate: '2025-01-31',
    amcStatus: 'active'
  },
  { 
    id: 9, 
    locationId: 'indelcp',
    name: 'Elevator System', 
    model: 'Otis Gen2',
    serialNumber: 'OTI-2023-012',
    category: 'Infrastructure',
    amcVendor: 'Otis Maintenance',
    amcStartDate: '2023-11-01',
    amcEndDate: '2024-10-31',
    amcStatus: 'expired'
  },
  { 
    id: 10, 
    locationId: 'indelcp',
    name: 'UPS System - Server Room', 
    model: 'APC Smart-UPS 10KVA',
    serialNumber: 'APC-2024-078',
    category: 'Power',
    amcVendor: 'PowerSafe Solutions',
    amcStartDate: '2024-05-01',
    amcEndDate: '2025-04-30',
    amcStatus: 'active'
  },
  
  // Location: inblrkrmngla (Koramangala, Bangalore)
  { 
    id: 11, 
    locationId: 'inblrkrmngla',
    name: 'HVAC Central System', 
    model: 'Carrier 30GTR140',
    serialNumber: 'CAR-2023-145',
    category: 'HVAC',
    amcVendor: 'ClimateControl Services',
    amcStartDate: '2024-01-10',
    amcEndDate: '2025-01-09',
    amcStatus: 'active'
  },
  { 
    id: 12, 
    locationId: 'inblrkrmngla',
    name: 'Fire Suppression System', 
    model: 'Tyco FM200',
    serialNumber: 'TYC-2024-089',
    category: 'Safety',
    amcVendor: 'SafeGuard Systems',
    amcStartDate: '2024-03-01',
    amcEndDate: '2025-02-28',
    amcStatus: 'active'
  },
  
  // Location: inblrwhitefield (Whitefield, Bangalore)
  { 
    id: 13, 
    locationId: 'inblrwhitefield',
    name: 'Diesel Generator - Main', 
    model: 'Kirloskar 100KVA',
    serialNumber: 'KIR-2023-234',
    category: 'Power',
    amcVendor: 'GenPower Maintenance',
    amcStartDate: '2023-10-15',
    amcEndDate: '2024-10-14',
    amcStatus: 'expired'
  },
  { 
    id: 14, 
    locationId: 'inblrwhitefield',
    name: 'Security Access Control System', 
    model: 'HID VertX V100',
    serialNumber: 'HID-2024-067',
    category: 'Security',
    amcVendor: 'SecureView Technologies',
    amcStartDate: '2024-06-01',
    amcEndDate: '2025-05-31',
    amcStatus: 'active'
  }
];

// Maintenance history with location references
export const maintenanceHistory = [
  {
    id: 1,
    employeeId: 4,
    storeId: 1,
    storeName: 'Store Alpha',
    locationId: 'inmumbandheri',
    date: '2024-11-15',
    duration: '3 hours',
    status: 'completed',
    applianceIds: [1, 2],
    appliances: ['Air Conditioner - Central Unit 1', 'Electrical Panel - Main'],
    remarks: 'Regular maintenance completed. All systems functioning normally.',
    nextScheduled: '2024-12-15'
  },
  {
    id: 2,
    employeeId: 5,
    storeId: 3,
    storeName: 'Store Gamma',
    locationId: 'inmumbandra',
    date: '2024-11-10',
    duration: '2.5 hours',
    status: 'completed',
    applianceIds: [5, 6],
    appliances: ['Air Conditioner - Office Block', 'Water Pump - Main Supply'],
    remarks: 'Cleaned AC filters, checked water pump motor. All OK.',
    nextScheduled: '2024-12-10'
  },
  {
    id: 3,
    employeeId: 6,
    storeId: 4,
    storeName: 'Store Delta',
    locationId: 'indelcp',
    date: '2024-11-05',
    duration: '4 hours',
    status: 'completed',
    applianceIds: [9, 10],
    appliances: ['Elevator System', 'UPS System - Server Room'],
    remarks: 'Elevator cable inspection done. UPS battery replaced.',
    nextScheduled: '2024-12-05'
  },
  {
    id: 4,
    employeeId: 7,
    storeId: 5,
    storeName: 'Store Epsilon',
    locationId: 'inblrkrmngla',
    date: '2024-11-12',
    duration: '3.5 hours',
    status: 'completed',
    applianceIds: [11, 12],
    appliances: ['HVAC Central System', 'Fire Suppression System'],
    remarks: 'HVAC filters replaced. Fire suppression system tested.',
    nextScheduled: '2024-12-12'
  },
  {
    id: 5,
    employeeId: 4,
    storeId: 1,
    storeName: 'Store Alpha',
    locationId: 'inmumbandheri',
    date: '2024-10-15',
    duration: '2 hours',
    status: 'completed',
    applianceIds: [3, 4],
    appliances: ['Fire Alarm System', 'Generator - Backup Power'],
    remarks: 'Fire alarm sensors tested. Generator oil changed.',
    nextScheduled: '2024-11-15'
  }
];

// Notifications with location references
export const notifications = [
  {
    id: 1,
    type: 'urgent',
    title: 'Expired AMC - Elevator System',
    message: 'Elevator AMC expired at indelcp location. Safety compliance issue!',
    timestamp: '2024-11-19T10:30:00',
    read: false,
    locationId: 'indelcp',
    applianceId: 9,
    priority: 'high'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Generator AMC Expiring Soon',
    message: 'Generator at inmumbandheri has AMC expiring in 10 days.',
    timestamp: '2024-11-19T09:15:00',
    read: false,
    locationId: 'inmumbandheri',
    applianceId: 4,
    priority: 'medium'
  },
  {
    id: 3,
    type: 'info',
    title: 'New AMC Contract Renewed',
    message: 'HVAC system AMC renewed for inblrkrmngla location.',
    timestamp: '2024-11-18T16:45:00',
    read: false,
    locationId: 'inblrkrmngla',
    applianceId: 11,
    priority: 'low'
  },
  {
    id: 4,
    type: 'success',
    title: 'Maintenance Completed',
    message: 'All appliances at inmumbandra location serviced successfully.',
    timestamp: '2024-11-18T11:30:00',
    read: true,
    locationId: 'inmumbandra',
    priority: 'low'
  },
  {
    id: 5,
    type: 'urgent',
    title: 'Diesel Generator AMC Expired',
    message: 'Generator at inblrwhitefield has expired AMC. Immediate renewal required!',
    timestamp: '2024-11-17T14:20:00',
    read: false,
    locationId: 'inblrwhitefield',
    applianceId: 13,
    priority: 'high'
  }
];

// Initialize checklist data
export let checklistData = {};
mockAppliances.forEach(appliance => {
  checklistData[appliance.id] = {
    isChecked: false,
    remarks: '',
    status: 'pending',
    lastUpdated: null,
    updatedBy: null
  };
});

// Helper function to get appliances by location
export const getAppliancesByLocation = (locationId) => {
  return mockAppliances.filter(appliance => appliance.locationId === locationId);
};

// Helper function to get locations assigned to a manager
export const getManagerLocations = (managerId) => {
  const manager = mockUsers.find(user => user.id === managerId && user.role === 'manager');
  if (!manager) return [];
  return mockLocations.filter(loc => manager.assignedLocationIds.includes(loc.id));
};

// Helper function to get stores by location
export const getStoresByLocation = (locationId) => {
  return mockStores.filter(store => store.locationId === locationId);
};
