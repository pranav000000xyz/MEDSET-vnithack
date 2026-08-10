export type Status = 'Active' | 'Pending' | 'Completed' | 'Cancelled' | 'Available' | 'Occupied' | 'Maintenance' | 'Paid' | 'Partial' | 'Unpaid' | 'Critical' | 'Normal' | 'Low' | 'In Progress' | 'Draft' | 'Confirmed' | 'Checked In';

export interface Patient { id: string; name: string; age: number; gender: string; bloodGroup: string; phone: string; condition: string; status: string; lastVisit: string; }
export interface Doctor { id: string; name: string; specialty: string; department: string; phone: string; email: string; status: string; patients: number; experience: string; }
export interface Appointment { id: string; patientId: string; patient: string; doctorId: string; doctor: string; department: string; date: string; time: string; type: string; status: Status; notes: string; }
export interface Bed { id: string; ward: string; status: Status; patient?: string; doctor?: string; nurse?: string; ventilator: boolean; emergency: boolean; }
export interface LabOrder { id: string; patient: string; patientId: string; test: string; category: string; doctor: string; priority: 'Routine' | 'Urgent' | 'STAT'; status: Status; orderedAt: string; result?: string; range?: string; }
export interface RadiologyOrder { id: string; patient: string; scan: string; bodyPart: string; doctor: string; status: Status; findings: string; impression: string; radiologist: string; cost: number; date: string; }
export interface Medicine { id: string; name: string; category: string; manufacturer: string; batch: string; stock: number; reorderLevel: number; expiry: string; price: number; location: string; }
export interface Invoice { id: string; number: string; patient: string; services: string[]; amount: number; paid: number; insurance: string; status: Status; date: string; }
export interface InventoryItem { id: string; name: string; category: string; quantity: number; threshold: number; location: string; supplier: string; unit: string; }
export interface SoapNote { id: string; patient: string; doctor: string; date: string; status: Status; subjective: string; objective: string; assessment: string; plan: string; }
export interface AuditLog { id: string; user: string; role: string; action: string; module: string; timestamp: string; status: 'Success' | 'Warning' | 'Failed'; severity: 'Info' | 'Warning' | 'Critical'; }
