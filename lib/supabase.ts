import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type UserRole =
  | 'super_admin'
  | 'hospital_admin'
  | 'doctor'
  | 'nurse'
  | 'receptionist'
  | 'lab_technician'
  | 'radiologist'
  | 'pharmacist'
  | 'icu_staff'
  | 'billing_staff';

export type AccountStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  status: AccountStatus;
  phone: string | null;
  avatar_url: string | null;
  rejection_reason: string | null;
  must_change_password: boolean | null;
  created_at: string;
  updated_at: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  hospital_admin: 'Hospital Admin',
  doctor: 'Doctor',
  nurse: 'Nurse',
  receptionist: 'Receptionist',
  lab_technician: 'Lab Technician',
  radiologist: 'Radiologist',
  pharmacist: 'Pharmacist',
  icu_staff: 'ICU Staff',
  billing_staff: 'Billing Staff',
};

export const SIGNUP_ROLES: { value: UserRole; label: string }[] = [
  { value: 'hospital_admin', label: 'Hospital Admin' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'lab_technician', label: 'Lab Technician' },
  { value: 'radiologist', label: 'Radiologist' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'icu_staff', label: 'ICU Staff' },
  { value: 'billing_staff', label: 'Billing Staff' },
];

export function getInitials(name: string | null | undefined): string {
  if (!name) return '--';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
