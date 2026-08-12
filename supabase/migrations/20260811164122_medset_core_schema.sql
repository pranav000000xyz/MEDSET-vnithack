/*
# MEDSET Core Database Schema

Creates the complete relational schema for the MEDSET hospital management system.
Tables are created in dependency order. All tables have RLS enabled with role-based policies.

Tables: profiles, specializations, doctors, nurses, patients, appointments,
consultations, medical_records, prescriptions, soap_notes, lab_tests,
radiology_requests, icu_beds, pharmacy_inventory, billing_records,
follow_up_plans, follow_up_messages, progress_updates, ai_scribe_sessions,
notifications, audit_logs
*/

-- ============ PROFILES ============
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'doctor',
  status text NOT NULL DEFAULT 'pending',
  phone text,
  avatar_url text,
  rejection_reason text,
  department text,
  employee_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin' AND status = 'approved');
$$;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin','hospital_admin') AND status = 'approved');
$$;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS text LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid();
$$;

-- ============ SPECIALIZATIONS ============
CREATE TABLE IF NOT EXISTS specializations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;

-- ============ DOCTORS ============
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specialization_id uuid REFERENCES specializations(id),
  medical_registration_number text,
  qualification text,
  years_of_experience int,
  department text,
  hospital_id text,
  address text,
  emergency_contact text,
  consultation_fee numeric(10,2),
  online_consultation boolean NOT NULL DEFAULT false,
  available_timings text,
  date_of_birth date,
  gender text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- ============ NURSES ============
CREATE TABLE IF NOT EXISTS nurses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qualification text,
  nursing_registration_number text,
  department text,
  experience int,
  shift text,
  employee_id text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE nurses ENABLE ROW LEVEL SECURITY;

-- ============ PATIENTS ============
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  age int,
  gender text,
  phone text,
  email text,
  address text,
  emergency_contact text,
  blood_group text,
  allergies text,
  medical_history text,
  current_medications text,
  assigned_doctor_id uuid REFERENCES doctors(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- ============ APPOINTMENTS ============
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE SET NULL,
  doctor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  patient_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  specialization_id uuid REFERENCES specializations(id),
  department text,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  reason text,
  type text NOT NULL DEFAULT 'consultation',
  status text NOT NULL DEFAULT 'scheduled',
  notes text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- ============ CONSULTATIONS ============
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  doctor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  specialization_id uuid REFERENCES specializations(id),
  chief_complaint text,
  diagnosis text,
  treatment text,
  advice text,
  status text NOT NULL DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- ============ FOLLOW-UP PLANS ============
CREATE TABLE IF NOT EXISTS follow_up_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  doctor_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  consultation_id uuid REFERENCES consultations(id) ON DELETE SET NULL,
  specialization_id uuid REFERENCES specializations(id),
  department text,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NOT NULL,
  duration_days int NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE follow_up_plans ENABLE ROW LEVEL SECURITY;

-- ============ MEDICAL RECORDS ============
CREATE TABLE IF NOT EXISTS medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE SET NULL,
  doctor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  record_type text NOT NULL DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;

-- ============ PRESCRIPTIONS ============
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  doctor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  medication_name text NOT NULL,
  dosage text,
  frequency text,
  duration text,
  instructions text,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- ============ SOAP NOTES ============
CREATE TABLE IF NOT EXISTS soap_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  doctor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  consultation_id uuid REFERENCES consultations(id) ON DELETE SET NULL,
  subjective text,
  objective text,
  assessment text,
  plan text,
  status text NOT NULL DEFAULT 'draft',
  ai_generated boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE soap_notes ENABLE ROW LEVEL SECURITY;

-- ============ LAB TESTS ============
CREATE TABLE IF NOT EXISTS lab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE SET NULL,
  doctor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  test_name text NOT NULL,
  category text,
  priority text NOT NULL DEFAULT 'routine',
  status text NOT NULL DEFAULT 'pending',
  result text,
  result_range text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;

-- ============ RADIOLOGY REQUESTS ============
CREATE TABLE IF NOT EXISTS radiology_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE SET NULL,
  doctor_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  scan_type text NOT NULL,
  body_part text,
  findings text,
  impression text,
  radiologist_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
  cost numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE radiology_requests ENABLE ROW LEVEL SECURITY;

-- ============ ICU BEDS ============
CREATE TABLE IF NOT EXISTS icu_beds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_number text NOT NULL,
  ward text NOT NULL,
  status text NOT NULL DEFAULT 'available',
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  assigned_doctor_id uuid REFERENCES doctors(id) ON DELETE SET NULL,
  assigned_nurse_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  ventilator boolean NOT NULL DEFAULT false,
  emergency boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE icu_beds ENABLE ROW LEVEL SECURITY;

-- ============ PHARMACY INVENTORY ============
CREATE TABLE IF NOT EXISTS pharmacy_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  manufacturer text,
  batch text,
  stock int NOT NULL DEFAULT 0,
  reorder_level int NOT NULL DEFAULT 50,
  expiry date,
  price numeric(10,2) NOT NULL DEFAULT 0,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE pharmacy_inventory ENABLE ROW LEVEL SECURITY;

-- ============ BILLING RECORDS ============
CREATE TABLE IF NOT EXISTS billing_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  invoice_number text NOT NULL,
  services text[] NOT NULL DEFAULT '{}',
  amount numeric(10,2) NOT NULL DEFAULT 0,
  paid numeric(10,2) NOT NULL DEFAULT 0,
  insurance text,
  status text NOT NULL DEFAULT 'unpaid',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;

-- ============ FOLLOW-UP MESSAGES ============
CREATE TABLE IF NOT EXISTS follow_up_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follow_up_plan_id uuid NOT NULL REFERENCES follow_up_plans(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE follow_up_messages ENABLE ROW LEVEL SECURITY;

-- ============ PROGRESS UPDATES ============
CREATE TABLE IF NOT EXISTS progress_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follow_up_plan_id uuid NOT NULL REFERENCES follow_up_plans(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  patient_profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  update_type text NOT NULL,
  notes text,
  reviewed boolean NOT NULL DEFAULT false,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE progress_updates ENABLE ROW LEVEL SECURITY;

-- ============ AI SCRIBE SESSIONS ============
CREATE TABLE IF NOT EXISTS ai_scribe_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE SET NULL,
  transcript text,
  summary text,
  soap_subjective text,
  soap_objective text,
  soap_assessment text,
  soap_plan text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE ai_scribe_sessions ENABLE ROW LEVEL SECURITY;

-- ============ NOTIFICATIONS ============
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  type text NOT NULL DEFAULT 'general',
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============ AUDIT LOGS ============
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource text,
  resource_id text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============ ALL POLICIES ============

-- Profiles
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT TO authenticated USING (id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
DROP POLICY IF EXISTS "profiles_admin_update" ON profiles;
CREATE POLICY "profiles_admin_update" ON profiles FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Specializations
DROP POLICY IF EXISTS "specializations_select_all" ON specializations;
CREATE POLICY "specializations_select_all" ON specializations FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "specializations_admin_insert" ON specializations;
CREATE POLICY "specializations_admin_insert" ON specializations FOR INSERT TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "specializations_admin_update" ON specializations;
CREATE POLICY "specializations_admin_update" ON specializations FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "specializations_admin_delete" ON specializations;
CREATE POLICY "specializations_admin_delete" ON specializations FOR DELETE TO authenticated USING (is_admin());

-- Doctors
DROP POLICY IF EXISTS "doctors_select_all" ON doctors;
CREATE POLICY "doctors_select_all" ON doctors FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "doctors_insert_own" ON doctors;
CREATE POLICY "doctors_insert_own" ON doctors FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
DROP POLICY IF EXISTS "doctors_update_own_or_admin" ON doctors;
CREATE POLICY "doctors_update_own_or_admin" ON doctors FOR UPDATE TO authenticated USING (profile_id = auth.uid() OR is_admin()) WITH CHECK (profile_id = auth.uid() OR is_admin());

-- Nurses
DROP POLICY IF EXISTS "nurses_select_all" ON nurses;
CREATE POLICY "nurses_select_all" ON nurses FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "nurses_insert_own" ON nurses;
CREATE POLICY "nurses_insert_own" ON nurses FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
DROP POLICY IF EXISTS "nurses_update_own_or_admin" ON nurses;
CREATE POLICY "nurses_update_own_or_admin" ON nurses FOR UPDATE TO authenticated USING (profile_id = auth.uid() OR is_admin()) WITH CHECK (profile_id = auth.uid() OR is_admin());

-- Patients
DROP POLICY IF EXISTS "patients_select" ON patients;
CREATE POLICY "patients_select" ON patients FOR SELECT TO authenticated USING (
  profile_id = auth.uid() OR is_admin()
  OR EXISTS (SELECT 1 FROM doctors WHERE doctors.profile_id = auth.uid() AND doctors.id = patients.assigned_doctor_id)
  OR EXISTS (SELECT 1 FROM follow_up_plans fup WHERE fup.patient_id = patients.id AND fup.doctor_profile_id = auth.uid() AND fup.status IN ('active','expiring_soon'))
  OR current_user_role() IN ('nurse','receptionist')
);
DROP POLICY IF EXISTS "patients_insert" ON patients;
CREATE POLICY "patients_insert" ON patients FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "patients_update" ON patients;
CREATE POLICY "patients_update" ON patients FOR UPDATE TO authenticated USING (
  profile_id = auth.uid() OR is_admin()
  OR EXISTS (SELECT 1 FROM doctors WHERE doctors.profile_id = auth.uid() AND doctors.id = patients.assigned_doctor_id)
) WITH CHECK (true);

-- Appointments
DROP POLICY IF EXISTS "appointments_select" ON appointments;
CREATE POLICY "appointments_select" ON appointments FOR SELECT TO authenticated USING (
  patient_profile_id = auth.uid() OR doctor_profile_id = auth.uid() OR is_admin()
  OR current_user_role() IN ('receptionist','nurse')
);
DROP POLICY IF EXISTS "appointments_insert" ON appointments;
CREATE POLICY "appointments_insert" ON appointments FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "appointments_update" ON appointments;
CREATE POLICY "appointments_update" ON appointments FOR UPDATE TO authenticated USING (
  patient_profile_id = auth.uid() OR doctor_profile_id = auth.uid() OR is_admin()
  OR current_user_role() IN ('receptionist','nurse')
) WITH CHECK (true);

-- Consultations
DROP POLICY IF EXISTS "consultations_select" ON consultations;
CREATE POLICY "consultations_select" ON consultations FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = consultations.patient_id AND patients.profile_id = auth.uid())
  OR doctor_profile_id = auth.uid() OR is_admin() OR current_user_role() IN ('nurse','receptionist')
);
DROP POLICY IF EXISTS "consultations_insert" ON consultations;
CREATE POLICY "consultations_insert" ON consultations FOR INSERT TO authenticated WITH CHECK (doctor_profile_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "consultations_update" ON consultations;
CREATE POLICY "consultations_update" ON consultations FOR UPDATE TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin()) WITH CHECK (true);

-- Medical records
DROP POLICY IF EXISTS "medical_records_select" ON medical_records;
CREATE POLICY "medical_records_select" ON medical_records FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = medical_records.patient_id AND patients.profile_id = auth.uid())
  OR doctor_profile_id = auth.uid() OR is_admin() OR current_user_role() = 'nurse'
);
DROP POLICY IF EXISTS "medical_records_insert" ON medical_records;
CREATE POLICY "medical_records_insert" ON medical_records FOR INSERT TO authenticated WITH CHECK (doctor_profile_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "medical_records_update" ON medical_records;
CREATE POLICY "medical_records_update" ON medical_records FOR UPDATE TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin()) WITH CHECK (true);

-- Prescriptions
DROP POLICY IF EXISTS "prescriptions_select" ON prescriptions;
CREATE POLICY "prescriptions_select" ON prescriptions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = prescriptions.patient_id AND patients.profile_id = auth.uid())
  OR doctor_profile_id = auth.uid() OR is_admin() OR current_user_role() IN ('pharmacist','nurse')
);
DROP POLICY IF EXISTS "prescriptions_insert" ON prescriptions;
CREATE POLICY "prescriptions_insert" ON prescriptions FOR INSERT TO authenticated WITH CHECK (doctor_profile_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "prescriptions_update" ON prescriptions;
CREATE POLICY "prescriptions_update" ON prescriptions FOR UPDATE TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin() OR current_user_role() = 'pharmacist') WITH CHECK (true);

-- SOAP notes
DROP POLICY IF EXISTS "soap_notes_select" ON soap_notes;
CREATE POLICY "soap_notes_select" ON soap_notes FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = soap_notes.patient_id AND patients.profile_id = auth.uid())
  OR doctor_profile_id = auth.uid() OR is_admin()
);
DROP POLICY IF EXISTS "soap_notes_insert" ON soap_notes;
CREATE POLICY "soap_notes_insert" ON soap_notes FOR INSERT TO authenticated WITH CHECK (doctor_profile_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "soap_notes_update" ON soap_notes;
CREATE POLICY "soap_notes_update" ON soap_notes FOR UPDATE TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin()) WITH CHECK (true);

-- Lab tests
DROP POLICY IF EXISTS "lab_tests_select" ON lab_tests;
CREATE POLICY "lab_tests_select" ON lab_tests FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = lab_tests.patient_id AND patients.profile_id = auth.uid())
  OR doctor_profile_id = auth.uid() OR is_admin() OR current_user_role() IN ('lab_technician','nurse','receptionist')
);
DROP POLICY IF EXISTS "lab_tests_insert" ON lab_tests;
CREATE POLICY "lab_tests_insert" ON lab_tests FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "lab_tests_update" ON lab_tests;
CREATE POLICY "lab_tests_update" ON lab_tests FOR UPDATE TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin() OR current_user_role() = 'lab_technician') WITH CHECK (true);

-- Radiology
DROP POLICY IF EXISTS "radiology_select" ON radiology_requests;
CREATE POLICY "radiology_select" ON radiology_requests FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = radiology_requests.patient_id AND patients.profile_id = auth.uid())
  OR doctor_profile_id = auth.uid() OR is_admin() OR current_user_role() IN ('radiologist','nurse','receptionist')
);
DROP POLICY IF EXISTS "radiology_insert" ON radiology_requests;
CREATE POLICY "radiology_insert" ON radiology_requests FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "radiology_update" ON radiology_requests;
CREATE POLICY "radiology_update" ON radiology_requests FOR UPDATE TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin() OR current_user_role() = 'radiologist') WITH CHECK (true);

-- ICU beds
DROP POLICY IF EXISTS "icu_beds_select" ON icu_beds;
CREATE POLICY "icu_beds_select" ON icu_beds FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "icu_beds_insert" ON icu_beds;
CREATE POLICY "icu_beds_insert" ON icu_beds FOR INSERT TO authenticated WITH CHECK (is_admin() OR current_user_role() IN ('icu_staff','nurse'));
DROP POLICY IF EXISTS "icu_beds_update" ON icu_beds;
CREATE POLICY "icu_beds_update" ON icu_beds FOR UPDATE TO authenticated USING (is_admin() OR current_user_role() IN ('icu_staff','nurse')) WITH CHECK (true);

-- Pharmacy
DROP POLICY IF EXISTS "pharmacy_select" ON pharmacy_inventory;
CREATE POLICY "pharmacy_select" ON pharmacy_inventory FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "pharmacy_insert" ON pharmacy_inventory;
CREATE POLICY "pharmacy_insert" ON pharmacy_inventory FOR INSERT TO authenticated WITH CHECK (is_admin() OR current_user_role() = 'pharmacist');
DROP POLICY IF EXISTS "pharmacy_update" ON pharmacy_inventory;
CREATE POLICY "pharmacy_update" ON pharmacy_inventory FOR UPDATE TO authenticated USING (is_admin() OR current_user_role() = 'pharmacist') WITH CHECK (true);

-- Billing
DROP POLICY IF EXISTS "billing_select" ON billing_records;
CREATE POLICY "billing_select" ON billing_records FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM patients WHERE patients.id = billing_records.patient_id AND patients.profile_id = auth.uid())
  OR is_admin() OR current_user_role() = 'billing_staff'
);
DROP POLICY IF EXISTS "billing_insert" ON billing_records;
CREATE POLICY "billing_insert" ON billing_records FOR INSERT TO authenticated WITH CHECK (is_admin() OR current_user_role() = 'billing_staff');
DROP POLICY IF EXISTS "billing_update" ON billing_records;
CREATE POLICY "billing_update" ON billing_records FOR UPDATE TO authenticated USING (is_admin() OR current_user_role() = 'billing_staff') WITH CHECK (true);

-- Follow-up plans
DROP POLICY IF EXISTS "follow_up_plans_select" ON follow_up_plans;
CREATE POLICY "follow_up_plans_select" ON follow_up_plans FOR SELECT TO authenticated USING (patient_profile_id = auth.uid() OR doctor_profile_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "follow_up_plans_insert" ON follow_up_plans;
CREATE POLICY "follow_up_plans_insert" ON follow_up_plans FOR INSERT TO authenticated WITH CHECK (doctor_profile_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "follow_up_plans_update" ON follow_up_plans;
CREATE POLICY "follow_up_plans_update" ON follow_up_plans FOR UPDATE TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin()) WITH CHECK (true);

-- Follow-up messages
DROP POLICY IF EXISTS "follow_up_messages_select" ON follow_up_messages;
CREATE POLICY "follow_up_messages_select" ON follow_up_messages FOR SELECT TO authenticated USING (
  sender_id = auth.uid()
  OR EXISTS (SELECT 1 FROM follow_up_plans fup WHERE fup.id = follow_up_messages.follow_up_plan_id AND (fup.patient_profile_id = auth.uid() OR fup.doctor_profile_id = auth.uid() OR is_admin()))
);
DROP POLICY IF EXISTS "follow_up_messages_insert" ON follow_up_messages;
CREATE POLICY "follow_up_messages_insert" ON follow_up_messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (SELECT 1 FROM follow_up_plans fup WHERE fup.id = follow_up_messages.follow_up_plan_id AND (fup.patient_profile_id = auth.uid() OR fup.doctor_profile_id = auth.uid()) AND fup.status IN ('active','expiring_soon'))
);

-- Progress updates
DROP POLICY IF EXISTS "progress_updates_select" ON progress_updates;
CREATE POLICY "progress_updates_select" ON progress_updates FOR SELECT TO authenticated USING (
  patient_profile_id = auth.uid()
  OR EXISTS (SELECT 1 FROM follow_up_plans fup WHERE fup.id = progress_updates.follow_up_plan_id AND fup.doctor_profile_id = auth.uid())
  OR is_admin()
);
DROP POLICY IF EXISTS "progress_updates_insert" ON progress_updates;
CREATE POLICY "progress_updates_insert" ON progress_updates FOR INSERT TO authenticated WITH CHECK (patient_profile_id = auth.uid());
DROP POLICY IF EXISTS "progress_updates_update" ON progress_updates;
CREATE POLICY "progress_updates_update" ON progress_updates FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM follow_up_plans fup WHERE fup.id = progress_updates.follow_up_plan_id AND fup.doctor_profile_id = auth.uid()) OR is_admin()
) WITH CHECK (true);

-- AI scribe
DROP POLICY IF EXISTS "ai_scribe_select" ON ai_scribe_sessions;
CREATE POLICY "ai_scribe_select" ON ai_scribe_sessions FOR SELECT TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin());
DROP POLICY IF EXISTS "ai_scribe_insert" ON ai_scribe_sessions;
CREATE POLICY "ai_scribe_insert" ON ai_scribe_sessions FOR INSERT TO authenticated WITH CHECK (doctor_profile_id = auth.uid());
DROP POLICY IF EXISTS "ai_scribe_update" ON ai_scribe_sessions;
CREATE POLICY "ai_scribe_update" ON ai_scribe_sessions FOR UPDATE TO authenticated USING (doctor_profile_id = auth.uid() OR is_admin()) WITH CHECK (true);

-- Notifications
DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS "notifications_insert" ON notifications;
CREATE POLICY "notifications_insert" ON notifications FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Audit logs
DROP POLICY IF EXISTS "audit_logs_select" ON audit_logs;
CREATE POLICY "audit_logs_select" ON audit_logs FOR SELECT TO authenticated USING (is_admin());
DROP POLICY IF EXISTS "audit_logs_insert" ON audit_logs;
CREATE POLICY "audit_logs_insert" ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

-- ============ INITIAL SPECIALIZATIONS ============
INSERT INTO specializations (name, description) VALUES
  ('Cardiology', 'Heart and cardiovascular system'),
  ('Dermatology', 'Skin, hair, and nail conditions'),
  ('Pediatrics', 'Infant, child, and adolescent care'),
  ('Orthopaedics', 'Bones, joints, ligaments, and muscles'),
  ('General Medicine', 'General health and internal medicine'),
  ('Neurology', 'Brain, spinal cord, and nervous system'),
  ('ENT', 'Ear, nose, and throat'),
  ('Gynecology', 'Women''s health and reproductive system'),
  ('Dentistry', 'Oral health and dental care'),
  ('Ophthalmology', 'Eye care and vision'),
  ('Psychiatry', 'Mental health and behavioral disorders')
ON CONFLICT (name) DO NOTHING;

-- ============ TRIGGERS ============
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'doctor'),
    'pending'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
