import type { Appointment, AuditLog, Bed, Doctor, InventoryItem, Invoice, LabOrder, Medicine, Patient, RadiologyOrder, SoapNote } from './types';

export const patients: Patient[] = [
  { id: 'PT-1001', name: 'Aarav Sharma', age: 42, gender: 'Male', bloodGroup: 'B+', phone: '+91 98765 43210', condition: 'Hypertension', status: 'Active', lastVisit: '2024-08-05' },
  { id: 'PT-1002', name: 'Ananya Iyer', age: 29, gender: 'Female', bloodGroup: 'O+', phone: '+91 98765 43211', condition: 'Migraine', status: 'Active', lastVisit: '2024-08-04' },
  { id: 'PT-1003', name: 'Rohan Mehta', age: 57, gender: 'Male', bloodGroup: 'A+', phone: '+91 98765 43212', condition: 'Type 2 Diabetes', status: 'Admitted', lastVisit: '2024-08-03' },
  { id: 'PT-1004', name: 'Meera Nair', age: 35, gender: 'Female', bloodGroup: 'AB+', phone: '+91 98765 43213', condition: 'Asthma', status: 'Active', lastVisit: '2024-08-02' },
  { id: 'PT-1005', name: 'Vikram Singh', age: 64, gender: 'Male', bloodGroup: 'O-', phone: '+91 98765 43214', condition: 'Cardiac care', status: 'Critical', lastVisit: '2024-08-01' },
  { id: 'PT-1006', name: 'Ishita Kapoor', age: 24, gender: 'Female', bloodGroup: 'B-', phone: '+91 98765 43215', condition: 'Routine checkup', status: 'Active', lastVisit: '2024-07-30' },
];
export const doctors: Doctor[] = [
  { id: 'DR-101', name: 'Dr. Rajesh Kumar', specialty: 'Cardiology', department: 'Cardiology', phone: '+91 98760 11223', email: 'rajesh.kumar@medset.demo', status: 'Available', patients: 18, experience: '18 years' },
  { id: 'DR-102', name: 'Dr. Priya Menon', specialty: 'Neurology', department: 'Neurology', phone: '+91 98760 11224', email: 'priya.menon@medset.demo', status: 'In Consultation', patients: 12, experience: '12 years' },
  { id: 'DR-103', name: 'Dr. Amit Shah', specialty: 'General Medicine', department: 'General Medicine', phone: '+91 98760 11225', email: 'amit.shah@medset.demo', status: 'Available', patients: 24, experience: '15 years' },
  { id: 'DR-104', name: 'Dr. Sneha Reddy', specialty: 'Pediatrics', department: 'Pediatrics', phone: '+91 98760 11226', email: 'sneha.reddy@medset.demo', status: 'On Leave', patients: 8, experience: '9 years' },
];
export const appointments: Appointment[] = [
  { id: 'APT-001', patientId: 'PT-1001', patient: 'Aarav Sharma', doctorId: 'DR-101', doctor: 'Dr. Rajesh Kumar', department: 'Cardiology', date: '2024-08-08', time: '09:30 AM', type: 'Follow-up', status: 'Confirmed' as Appointment['status'], notes: 'Review ECG results' },
  { id: 'APT-002', patientId: 'PT-1002', patient: 'Ananya Iyer', doctorId: 'DR-102', doctor: 'Dr. Priya Menon', department: 'Neurology', date: '2024-08-08', time: '10:00 AM', type: 'Consultation', status: 'Pending', notes: 'Recurring migraine' },
  { id: 'APT-003', patientId: 'PT-1003', patient: 'Rohan Mehta', doctorId: 'DR-103', doctor: 'Dr. Amit Shah', department: 'General Medicine', date: '2024-08-08', time: '11:30 AM', type: 'Follow-up', status: 'Checked In' as Appointment['status'], notes: 'Diabetes management' },
  { id: 'APT-004', patientId: 'PT-1004', patient: 'Meera Nair', doctorId: 'DR-104', doctor: 'Dr. Sneha Reddy', department: 'Pediatrics', date: '2024-08-09', time: '02:00 PM', type: 'Consultation', status: 'Confirmed' as Appointment['status'], notes: 'Breathing difficulty' },
  { id: 'APT-005', patientId: 'PT-1005', patient: 'Vikram Singh', doctorId: 'DR-101', doctor: 'Dr. Rajesh Kumar', department: 'Cardiology', date: '2024-08-09', time: '03:30 PM', type: 'Emergency', status: 'Completed', notes: 'Post procedure review' },
];
export const beds: Bed[] = [
  { id: 'ICU-01', ward: 'ICU A', status: 'Occupied', patient: 'Vikram Singh', doctor: 'Dr. Rajesh Kumar', nurse: 'Nurse Kavita', ventilator: true, emergency: true },
  { id: 'ICU-02', ward: 'ICU A', status: 'Occupied', patient: 'Rohan Mehta', doctor: 'Dr. Amit Shah', nurse: 'Nurse Sunita', ventilator: false, emergency: false },
  { id: 'ICU-03', ward: 'ICU A', status: 'Available', ventilator: true, emergency: false },
  { id: 'ICU-04', ward: 'ICU B', status: 'Maintenance', ventilator: false, emergency: false },
  { id: 'ICU-05', ward: 'ICU B', status: 'Available', ventilator: true, emergency: false },
  { id: 'ICU-06', ward: 'ICU B', status: 'Occupied', patient: 'Suresh Patil', doctor: 'Dr. Rajesh Kumar', nurse: 'Nurse Kavita', ventilator: false, emergency: true },
];
export const labOrders: LabOrder[] = [
  { id: 'LAB-001', patient: 'Aarav Sharma', patientId: 'PT-1001', test: 'Complete Blood Count', category: 'Hematology', doctor: 'Dr. Rajesh Kumar', priority: 'Routine', status: 'Completed', orderedAt: '2024-08-08 08:15', result: 'Normal', range: '4.5 - 11.0 x10^9/L' },
  { id: 'LAB-002', patient: 'Rohan Mehta', patientId: 'PT-1003', test: 'HbA1c', category: 'Biochemistry', doctor: 'Dr. Amit Shah', priority: 'Urgent', status: 'In Progress', orderedAt: '2024-08-08 09:05', range: '4.0 - 5.6%' },
  { id: 'LAB-003', patient: 'Vikram Singh', patientId: 'PT-1005', test: 'Troponin I', category: 'Cardiology', doctor: 'Dr. Rajesh Kumar', priority: 'STAT', status: 'Pending', orderedAt: '2024-08-08 09:40', range: '< 0.04 ng/mL' },
  { id: 'LAB-004', patient: 'Ananya Iyer', patientId: 'PT-1002', test: 'Thyroid Profile', category: 'Endocrinology', doctor: 'Dr. Priya Menon', priority: 'Routine', status: 'Completed', orderedAt: '2024-08-07 14:20', result: 'Within range', range: '0.4 - 4.0 mIU/L' },
];
export const radiologyOrders: RadiologyOrder[] = [
  { id: 'RAD-001', patient: 'Vikram Singh', scan: 'MRI', bodyPart: 'Chest', doctor: 'Dr. Rajesh Kumar', status: 'Completed', findings: 'Mild cardiomegaly noted.', impression: 'Recommend clinical correlation.', radiologist: 'Dr. Neha Joshi', cost: 4500, date: '2024-08-07' },
  { id: 'RAD-002', patient: 'Meera Nair', scan: 'X-Ray', bodyPart: 'Chest PA View', doctor: 'Dr. Sneha Reddy', status: 'In Progress', findings: 'Report pending.', impression: 'Awaiting radiologist review.', radiologist: 'Dr. Neha Joshi', cost: 800, date: '2024-08-08' },
  { id: 'RAD-003', patient: 'Aarav Sharma', scan: 'CT Scan', bodyPart: 'Head', doctor: 'Dr. Priya Menon', status: 'Pending', findings: 'Not available', impression: 'Not available', radiologist: 'Unassigned', cost: 6500, date: '2024-08-08' },
];
export const medicines: Medicine[] = [
  { id: 'MED-001', name: 'Metformin 500mg', category: 'Antidiabetic', manufacturer: 'Sun Pharma', batch: 'MFT-2401', stock: 245, reorderLevel: 100, expiry: '2026-04-30', price: 4.5, location: 'Rack A-12' },
  { id: 'MED-002', name: 'Atorvastatin 20mg', category: 'Cardiovascular', manufacturer: 'Cipla', batch: 'ATV-2312', stock: 34, reorderLevel: 50, expiry: '2025-02-28', price: 8.2, location: 'Rack A-18' },
  { id: 'MED-003', name: 'Amoxicillin 500mg', category: 'Antibiotic', manufacturer: 'Abbott', batch: 'AMX-2403', stock: 12, reorderLevel: 60, expiry: '2024-11-30', price: 12, location: 'Rack B-04' },
  { id: 'MED-004', name: 'Salbutamol Inhaler', category: 'Respiratory', manufacturer: 'GSK', batch: 'SLB-2402', stock: 76, reorderLevel: 30, expiry: '2025-08-31', price: 185, location: 'Rack C-07' },
  { id: 'MED-005', name: 'Paracetamol 650mg', category: 'Analgesic', manufacturer: 'Dr. Reddy’s', batch: 'PCM-2405', stock: 420, reorderLevel: 150, expiry: '2026-01-31', price: 2.5, location: 'Rack A-02' },
];
export const invoices: Invoice[] = [
  { id: 'INV-001', number: 'MS-2024-001', patient: 'Vikram Singh', services: ['ICU stay', 'Cardiology consultation', 'MRI'], amount: 48600, paid: 30000, insurance: 'Star Health', status: 'Partial', date: '2024-08-08' },
  { id: 'INV-002', number: 'MS-2024-002', patient: 'Aarav Sharma', services: ['Consultation', 'Lab tests'], amount: 2450, paid: 2450, insurance: 'Self-pay', status: 'Paid', date: '2024-08-08' },
  { id: 'INV-003', number: 'MS-2024-003', patient: 'Rohan Mehta', services: ['Room charges', 'Medication', 'Lab tests'], amount: 12800, paid: 0, insurance: 'HDFC Ergo', status: 'Unpaid', date: '2024-08-07' },
  { id: 'INV-004', number: 'MS-2024-004', patient: 'Ananya Iyer', services: ['Neurology consultation'], amount: 1800, paid: 1800, insurance: 'Self-pay', status: 'Paid', date: '2024-08-07' },
];
export const inventory: InventoryItem[] = [
  { id: 'INV-IT-001', name: 'Surgical Gloves (Box)', category: 'Consumables', quantity: 42, threshold: 20, location: 'Store Room A', supplier: 'MedSupply India', unit: 'boxes' },
  { id: 'INV-IT-002', name: '3ml Syringes', category: 'Consumables', quantity: 18, threshold: 50, location: 'Store Room A', supplier: 'HealthCare Supplies', unit: 'packs' },
  { id: 'INV-IT-003', name: 'IV Cannula 20G', category: 'Medical Devices', quantity: 120, threshold: 40, location: 'Store Room B', supplier: 'MedSupply India', unit: 'pieces' },
  { id: 'INV-IT-004', name: 'Oxygen Masks', category: 'Respiratory', quantity: 9, threshold: 25, location: 'ICU Store', supplier: 'LifeLine Equipments', unit: 'pieces' },
  { id: 'INV-IT-005', name: 'Bed Sheets', category: 'Linen', quantity: 85, threshold: 30, location: 'Linen Room', supplier: 'CleanCare Textiles', unit: 'pieces' },
];
export const soapNotes: SoapNote[] = [
  { id: 'SOAP-001', patient: 'Aarav Sharma', doctor: 'Dr. Rajesh Kumar', date: '2024-08-08', status: 'Completed', subjective: 'Patient reports occasional chest discomfort on exertion.', objective: 'BP 138/86, HR 78 bpm. ECG reviewed.', assessment: 'Stable angina, well controlled hypertension.', plan: 'Continue current medications. Follow up in 2 weeks.' },
  { id: 'SOAP-002', patient: 'Rohan Mehta', doctor: 'Dr. Amit Shah', date: '2024-08-08', status: 'Draft', subjective: 'Increased thirst and fatigue for one week.', objective: 'Fasting glucose 164 mg/dL. HbA1c pending.', assessment: 'Type 2 diabetes, suboptimal control.', plan: 'Await HbA1c. Review diet and medication adherence.' },
  { id: 'SOAP-003', patient: 'Ananya Iyer', doctor: 'Dr. Priya Menon', date: '2024-08-07', status: 'Completed', subjective: 'Two migraine episodes this week, photophobia present.', objective: 'Neurological examination normal.', assessment: 'Migraine without aura.', plan: 'Continue preventive therapy and maintain headache diary.' },
];
export const auditLogs: AuditLog[] = [
  { id: 'LOG-001', user: 'Pranav Vispute', role: 'Developer', action: 'Updated appointment status', module: 'Appointments', timestamp: 'Today, 10:42 AM', status: 'Success', severity: 'Info' },
  { id: 'LOG-002', user: 'Dr. Rajesh Kumar', role: 'Doctor', action: 'Viewed patient record', module: 'Patients', timestamp: 'Today, 10:35 AM', status: 'Success', severity: 'Info' },
  { id: 'LOG-003', user: 'Devanshu Kindarley', role: 'Developer', action: 'Low stock reorder triggered', module: 'Pharmacy', timestamp: 'Today, 09:18 AM', status: 'Warning', severity: 'Warning' },
  { id: 'LOG-004', user: 'System', role: 'System', action: 'Failed report export', module: 'Analytics', timestamp: 'Yesterday, 06:22 PM', status: 'Failed', severity: 'Critical' },
];
