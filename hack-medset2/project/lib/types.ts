export type Role =
  | 'super_admin'
  | 'hospital_admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'pharmacist'
  | 'lab_technician'
  | 'radiologist'
  | 'billing_staff'
  | 'patient';

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  hospital_admin: 'Hospital Admin',
  doctor: 'Doctor',
  nurse: 'Nurse',
  receptionist: 'Receptionist',
  pharmacist: 'Pharmacist',
  lab_technician: 'Lab Technician',
  radiologist: 'Radiologist',
  billing_staff: 'Billing Staff',
  patient: 'Patient',
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  department?: string;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  bloodGroup: string;
  address: string;
  status: 'Outpatient' | 'Admitted' | 'Discharged' | 'Emergency' | 'ICU';
  ward?: string;
  bed?: string;
  admissionDate?: string;
  diagnosis?: string;
  doctor?: string;
  insurance?: string;
  vitals?: Vitals;
  allergies: string[];
  medications: string[];
  history: MedicalEvent[];
}

export interface Vitals {
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  oxygenSaturation: number;
  respiratoryRate: number;
  recordedAt: string;
}

export interface MedicalEvent {
  id: string;
  date: string;
  type: 'Visit' | 'Admission' | 'Surgery' | 'Lab' | 'Radiology' | 'Prescription' | 'Discharge';
  title: string;
  description: string;
  doctor?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  phone: string;
  email: string;
  experience: number;
  status: 'Available' | 'Busy' | 'On Leave' | 'Off Duty';
  patientsToday: number;
  rating: number;
  avatar?: string;
  qualifications: string[];
}

export interface Nurse {
  id: string;
  name: string;
  department: string;
  shift: 'Morning' | 'Evening' | 'Night';
  status: 'On Duty' | 'Off Duty' | 'Break';
  assignedWard: string;
  phone: string;
  experience: number;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientMrn: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  duration: number;
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery' | 'Check-up';
  status: 'Scheduled' | 'Checked-in' | 'In Progress' | 'Completed' | 'Cancelled' | 'No-show';
  reason: string;
}

export interface Bed {
  id: string;
  number: string;
  ward: string;
  type: 'General' | 'ICU' | 'ICU-Ventilator' | 'Private' | 'Emergency' | 'Isolation';
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance' | 'Cleaning';
  patientName?: string;
  patientMrn?: string;
  assignedDoctor?: string;
  assignedNurse?: string;
  ventilator?: boolean;
  monitor?: boolean;
  admittedAt?: string;
  estimatedDischarge?: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  batchNumber: string;
  stock: number;
  unit: string;
  reorderLevel: number;
  expiryDate: string;
  price: number;
  location: string;
}

export interface LabTest {
  id: string;
  orderId: string;
  patientName: string;
  patientMrn: string;
  testName: string;
  category: string;
  orderedBy: string;
  orderedAt: string;
  status: 'Ordered' | 'Sample Collected' | 'Processing' | 'Completed' | 'Verified' | 'Rejected';
  result?: string;
  normalRange?: string;
  priority: 'Routine' | 'Urgent' | 'STAT';
  cost: number;
}

export interface RadiologyScan {
  id: string;
  requestId: string;
  patientName: string;
  patientMrn: string;
  scanType: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound' | 'Mammography' | 'ECG' | 'Echocardiogram';
  bodyPart: string;
  orderedBy: string;
  orderedAt: string;
  status: 'Requested' | 'Scheduled' | 'In Progress' | 'Completed' | 'Reported' | 'Verified';
  findings?: string;
  impression?: string;
  radiologist?: string;
  cost: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  patientMrn: string;
  date: string;
  dueDate: string;
  items: BillingItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paid: number;
  balance: number;
  status: 'Paid' | 'Partial' | 'Unpaid' | 'Overdue';
  insurance: boolean;
  insuranceProvider?: string;
}

export interface BillingItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category: 'Consultation' | 'Procedure' | 'Lab' | 'Radiology' | 'Pharmacy' | 'Room' | 'Other';
}

export interface AuditLog {
  id: string;
  user: string;
  role: Role;
  action: string;
  resource: string;
  timestamp: string;
  ip: string;
  status: 'Success' | 'Failed' | 'Denied';
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'critical';
  timestamp: string;
  read: boolean;
  module: string;
}

export interface SoapNote {
  id: string;
  patientName: string;
  patientMrn: string;
  doctorName: string;
  date: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  status: 'Draft' | 'Generated' | 'Reviewed' | 'Approved';
  transcription?: string;
  entities?: MedicalEntity[];
  duration?: number;
}

export interface MedicalEntity {
  text: string;
  type: 'Condition' | 'Medication' | 'Procedure' | 'Dosage' | 'Symptom' | 'BodyPart' | 'Allergy';
  confidence: number;
  icdCode?: string;
}
