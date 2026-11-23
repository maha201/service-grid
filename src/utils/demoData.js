const today = new Date().toISOString().slice(0, 10);
const days = (offset) => new Date(Date.now() + offset * 86400000).toISOString().slice(0, 10);

export const INITIAL_DATA = {
  customers: [
    { id: 'c1', name: 'Northstar Medical', phone: '+1 415 555 0182', email: 'facilities@northstar.example', type: 'Business', gst: 'GSTIN-29AAACN1234F1Z5', address: '1450 Market Street', city: 'San Francisco', state: 'California', pincode: '94103' },
    { id: 'c2', name: 'Aarav Mehta', phone: '+1 415 555 0144', email: 'aarav@example.com', type: 'Individual', gst: '', address: '82 Valencia Street', city: 'San Francisco', state: 'California', pincode: '94110' },
    { id: 'c3', name: 'Cedar House Hotel', phone: '+1 510 555 0127', email: 'ops@cedarhouse.example', type: 'Business', gst: 'GSTIN-29AABCC5678D1Z2', address: '210 Grand Avenue', city: 'Oakland', state: 'California', pincode: '94612' },
  ],
  technicians: [
    { id: 't1', name: 'Maya Chen', employeeId: 'TECH-104', phone: '+1 415 555 0101', email: 'maya@servicegrid.example', specialization: 'HVAC', skills: 'HVAC, Diagnostics', joiningDate: '2023-04-10', availability: 'Available', address: 'San Francisco, CA' },
    { id: 't2', name: 'Luis Rivera', employeeId: 'TECH-108', phone: '+1 415 555 0102', email: 'luis@servicegrid.example', specialization: 'Electrical', skills: 'Electrical, Controls', joiningDate: '2022-09-15', availability: 'On Job', address: 'Oakland, CA' },
    { id: 't3', name: 'Priya Nair', employeeId: 'TECH-112', phone: '+1 415 555 0103', email: 'priya@servicegrid.example', specialization: 'Refrigeration', skills: 'Refrigeration, HVAC', joiningDate: '2024-01-08', availability: 'Available', address: 'Berkeley, CA' },
  ],
  equipment: [
    { id: 'e1', customerId: 'c1', name: 'Air Handler AHU-4', category: 'HVAC', brand: 'Carrier', model: '39M', serial: 'CA-390482', installationDate: '2022-06-12', warrantyStart: '2022-06-12', warrantyEnd: '2027-06-12', amcExpiry: '2026-12-31', location: 'Building A, Roof', status: 'Active' },
    { id: 'e2', customerId: 'c2', name: 'Split AC - Living Room', category: 'HVAC', brand: 'Daikin', model: 'FTKM50', serial: 'DK-882031', installationDate: '2023-03-21', warrantyStart: '2023-03-21', warrantyEnd: '2026-03-21', amcExpiry: '', location: 'Living room', status: 'Active' },
    { id: 'e3', customerId: 'c3', name: 'Walk-in Cooler 1', category: 'Refrigeration', brand: 'True', model: 'T-49', serial: 'TR-190337', installationDate: '2021-11-03', warrantyStart: '2021-11-03', warrantyEnd: '2024-11-03', amcExpiry: '2026-11-30', location: 'Kitchen', status: 'Active' },
  ],
  requests: [
    { id: 'r1', number: 'SR-2026-0142', customerId: 'c1', equipmentId: 'e1', category: 'Cooling issue', description: 'Airflow is reduced on the second floor.', priority: 'High', requestDate: days(-2), visitDate: days(1), status: 'Assigned' },
    { id: 'r2', number: 'SR-2026-0143', customerId: 'c2', equipmentId: 'e2', category: 'Preventive maintenance', description: 'Annual maintenance visit.', priority: 'Normal', requestDate: days(-1), visitDate: days(3), status: 'New' },
    { id: 'r3', number: 'SR-2026-0144', customerId: 'c3', equipmentId: 'e3', category: 'Temperature alarm', description: 'Cooler temperature is above set point.', priority: 'Urgent', requestDate: today, visitDate: today, status: 'In Progress' },
  ],
  jobs: [
    { id: 'j1', number: 'JOB-2026-0081', requestId: 'r1', customerId: 'c1', equipmentId: 'e1', technicianId: 't1', scheduledDate: days(1), priority: 'High', problem: 'Reduced airflow on second floor.', workDescription: '', spareParts: '', labourCharge: 0, totalAmount: 0, status: 'Assigned', serviceNotes: '', approval: false, signature: '', beforePhoto: '', afterPhoto: '' },
    { id: 'j2', number: 'JOB-2026-0082', requestId: 'r3', customerId: 'c3', equipmentId: 'e3', technicianId: 't2', scheduledDate: today, priority: 'Urgent', problem: 'Cooler temperature is above set point.', workDescription: 'Inspected thermostat and condenser.', spareParts: '', labourCharge: 180, totalAmount: 180, status: 'In Progress', serviceNotes: '', approval: false, signature: '', beforePhoto: '', afterPhoto: '' },
    { id: 'j3', number: 'JOB-2026-0079', requestId: '', customerId: 'c2', equipmentId: 'e2', technicianId: 't3', scheduledDate: days(-4), priority: 'Normal', problem: 'Seasonal maintenance.', workDescription: 'Cleaned filters and checked refrigerant.', spareParts: 'Air filter', labourCharge: 125, totalAmount: 150, status: 'Completed', serviceNotes: 'Unit tested and operating normally.', approval: true, signature: '', beforePhoto: '', afterPhoto: '' },
  ],
  inventory: [
    { id: 'i1', name: 'Universal air filter', code: 'FLT-001', category: 'HVAC', description: '20x25 pleated filter', unit: 'Each', purchasePrice: 12, sellingPrice: 22, stock: 18, minStock: 10, supplier: 'West Coast Parts', status: 'Active' },
    { id: 'i2', name: 'Thermostat sensor', code: 'SNS-014', category: 'Electrical', description: 'Digital temperature probe', unit: 'Each', purchasePrice: 28, sellingPrice: 45, stock: 4, minStock: 8, supplier: 'Climate Supply Co.', status: 'Active' },
    { id: 'i3', name: 'R-410A Refrigerant', code: 'REF-410', category: 'Refrigerant', description: '11.3 kg cylinder', unit: 'Cylinder', purchasePrice: 155, sellingPrice: 210, stock: 12, minStock: 3, supplier: 'West Coast Parts', status: 'Active' },
  ],
  invoices: [
    { id: 'v1', number: 'INV-2026-0038', customerId: 'c2', jobId: 'j3', invoiceDate: days(-3), dueDate: days(11), subtotal: 150, tax: 12, discount: 0, total: 162, paid: 162, paymentStatus: 'Paid', paymentMethod: 'Card' },
    { id: 'v2', number: 'INV-2026-0039', customerId: 'c3', jobId: 'j2', invoiceDate: today, dueDate: days(14), subtotal: 180, tax: 14.4, discount: 0, total: 194.4, paid: 0, paymentStatus: 'Unpaid', paymentMethod: 'Bank transfer' },
  ],
  settings: { businessName: 'ServiceGrid Field Services', businessEmail: 'hello@servicegrid.example', businessPhone: '+1 415 555 0100', taxId: 'GSTIN-29AABCS4321B1Z9', branchName: 'San Francisco', branchAddress: '500 Howard Street, San Francisco, CA', profileName: 'Alex Morgan', profileEmail: 'admin@servicegrid.io', emailNotifications: true, jobAlerts: true, compactTables: false, currency: 'USD' },
};

export const STORAGE_KEY = 'servicegrid-demo-data-v1';
export function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') return { ...structuredClone(INITIAL_DATA), ...saved };
  } catch { /* use fresh sample data */ }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
  return structuredClone(INITIAL_DATA);
}
export function persistData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  queueMicrotask(() => window.dispatchEvent(new Event('servicegrid-data-change')));
}
