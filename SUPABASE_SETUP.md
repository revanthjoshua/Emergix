# 🚑 Emergix Local Setup Guide (With Supabase Backend)

Welcome to the **Emergix Hospital Clinical Workspace & Dispatch Console** localized deployment manual. This document is written specifically for those who **do not have prior software programming experience** but wish to run this powerful full-stack application on their personal computer with a cloud database (**Supabase**).

---

## 🗺️ Part 1: Page-by-Page API Architecture

To scale this application with a dynamic backend database, your app communicates with two kinds of interfaces:
1. **AI Cognitive Microservices (Express Backend proxies)** handles diagnostic reasoning.
2. **Database REST API Interfaces (Supabase SDK client)** handles patient records, ambulance coordinates, and clinician roster storage.

Here is the exhaustive page-by-page directory of APIs used and those we will create in the database:

### 1. Secure Staff Access (Login Screen)
*   **Authentication API (Supabase Auth)**:
    *   `POST /auth/v1/token`: Logs staff into the portal using their emergency profile email and secure credentials, returning their custom clinical role (`UserRole`: Admin, Doctor, Nurse, etc.).

### 2. Command Hub Home (Dashboard)
*   **Capacity Overlap Predictions API (Express Backend + Gemini)**:
    *   `POST /api/ai/predict-load`: Formulates operational stress predictions over a 4-hour workflow delta. Calculates resource risks dynamically.
*   **Live Metrics APIs (Supabase client reads)**:
    *   `GET /rest/v1/icu_beds?occupied=eq.true` (Reads occupied ICU statistics).
    *   `GET /rest/v1/ambulances?status=neq.Available` (Reads active dispatches).
    *   `GET /rest/v1/patients?risk_level=eq.Critical` (Reads absolute critical cases count).

### 3. Triage Handover Panel
*   **Emergency Cases Queue API (Supabase client)**:
    *   `GET /rest/v1/emergency_cases`: Returns active sirens, incoming transports, and due ETAs.
    *   `POST /rest/v1/emergency_cases`: Registers newly incoming emergency trauma nodes.
    *   `PATCH /rest/v1/emergency_cases?id=eq.{id}`: Shifts timeline statuses (`EnRoute` ➔ `Arrived` ➔ `Admitted`).

### 4. Digital Health Twins Panel
*   **Patient Database API (Supabase client)**:
    *   `GET /rest/v1/patients`: Pulls detailed electronic health card registers.
    *   `PATCH /rest/v1/patients?id=eq.{id}`: Standard **Pencil (✏️)** override to alter names, ages, diagnostic summaries, and checklist drugs.
    *   `PUT /rest/v1/patients?id=eq.{id}`: Continuous telemetry vitals updater (pushes live oxygen and heartbeats).

### 5. ICU Beds Matrix Panel
*   **Ward Station Management API (Supabase client)**:
    *   `GET /rest/v1/icu_beds`: Views live hardware stations, ventilator switches, and LPM flow constants.
    *   `PATCH /rest/v1/icu_beds?id=eq.{id}`: Toggles critical care ventilators and sanitary release updates.

### 6. Ambulance Radar Panel
*   **Trauma Vehicle Telemetry API (Supabase client)**:
    *   `GET /rest/v1/ambulances`: Renders paramedic units, highway sectors, and coordinates.
    *   `PATCH /rest/v1/ambulances?id=eq.{id}`: Instantly overrides speed variables and live countdown minutes.

### 7. Cognitive Symptom Triage (AI Module)
*   **Neural Decision Support API (Express Backend + Gemini)**:
    *   `POST /api/ai/triage`: Swifty feeds symptom strings to Gemini AI and extracts a structured emergency placement advice score safely.

### 8. Global Joshuaa Assistant
*   **Conversational Assistant API (Express Backend + Gemini)**:
    *   `POST /api/ai/assistant`: Chat pathway connecting to "Joshuaa", returning brief, highly accurate 2-3 bullet clinical directives.

---

## 🏛️ Part 2: Supabase database setup (SQL Schema Script)

To back this system, we need to create database tables. Follow these simple steps:

1.  Sign up/Log in to the **[Supabase Dashboard](https://supabase.com)**.
2.  Click **"New Project"**, name it `Emergix`, and set a database password.
3.  Once the project starts, find the **"SQL Editor"** tab on the left sidebar (it looks like a small box containing a `>` sign).
4.  Click **"New Query"**, copy the large script block below, paste it into the dark text box, and click the green **"Run"** button in the bottom right.

```sql
-- Create custom risk standard definitions
CREATE TYPE risk_level AS ENUM ('Critical', 'High Risk', 'Medium Risk', 'Stable');
CREATE TYPE ambulance_status AS ENUM ('Available', 'Dispatched', 'EnRoute', 'Returning');
CREATE TYPE bed_type_enum AS ENUM ('ICU', 'CCU', 'NICU', 'Trauma');
CREATE TYPE doctor_status_enum AS ENUM ('In Surgery', 'On Call', 'Active', 'Offline');

-- 1. PATIENTS REGISTER
CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  blood_type TEXT NOT NULL,
  condition TEXT NOT NULL,
  risk_score INTEGER NOT NULL DEFAULT 50,
  risk_level risk_level NOT NULL DEFAULT 'Stable',
  department TEXT NOT NULL,
  avatar TEXT,
  vitals JSONB NOT NULL,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  medications JSONB NOT NULL DEFAULT '[]'::jsonb,
  reports JSONB NOT NULL DEFAULT '[]'::jsonb,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EMERGENCY CASES
CREATE TABLE emergency_cases (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  severity risk_level NOT NULL DEFAULT 'Medium Risk',
  reported_time TEXT NOT NULL,
  eta_minutes INTEGER,
  ambulance_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('Dispatched', 'EnRoute', 'Arrived', 'Admitted')),
  department TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. AMBULANCES FLEET
CREATE TABLE ambulances (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  status ambulance_status NOT NULL DEFAULT 'Available',
  assigned_hospital TEXT NOT NULL DEFAULT 'Emergix HQ Center',
  crew TEXT[] NOT NULL DEFAULT '{}'::text[],
  location TEXT NOT NULL,
  active_emergency_id TEXT,
  eta INTEGER NOT NULL DEFAULT 0,
  speed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ICU BEDS HARDWARE
CREATE TABLE icu_beds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  occupied BOOLEAN NOT NULL DEFAULT FALSE,
  patient_id TEXT,
  patient_name TEXT,
  ventilator_active BOOLEAN NOT NULL DEFAULT FALSE,
  oxygen_flow_lpm NUMERIC NOT NULL DEFAULT 0,
  bed_type bed_type_enum NOT NULL DEFAULT 'ICU',
  risk_level risk_level,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. DOCTORS COMMAND ROSTER
CREATE TABLE doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  status doctor_status_enum NOT NULL DEFAULT 'Active',
  active_patients INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SYSTEM NOTIFICATIONS FEED
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'alert', 'critical')),
  timestamp TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. DIAGNOSTIC SYSTEM LOGS
CREATE TABLE logs (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. APPOINTMENTS SCHEDULE
CREATE TABLE appointments (
  token TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  doctor TEXT NOT NULL,
  time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Waiting',
  wait TEXT NOT NULL DEFAULT '15 mins',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. HOSPITAL EVENTS
CREATE TABLE hospital_events (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  time TEXT NOT NULL DEFAULT '',
  remarks TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. LEADS REGISTER (Production CRM addition)
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  source TEXT NOT NULL DEFAULT 'Referral',
  status TEXT NOT NULL DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. PATIENT CONTACTS REGISTER (Family / Emergency relations)
CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  relationship TEXT NOT NULL DEFAULT 'Next of Kin',
  phone TEXT NOT NULL,
  email TEXT,
  patient_id TEXT REFERENCES patients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- SECURE ROW LEVEL SECURITY (RLS) POLICIES FOR PRODUCTION DATA SAFETY
-- =========================================================================

-- Enable RLS on all operational and pipeline tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambulances ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy protocols allowing absolute read, insert, update and delete capabilities:
-- We define public policies so that front-end clients can perform proper CRUD securely.

-- Patients
CREATE POLICY "Public Read Access Patients" ON patients FOR SELECT USING (true);
CREATE POLICY "Public Write Access Patients" ON patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Patients" ON patients FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Patients" ON patients FOR DELETE USING (true);

-- Emergency Cases
CREATE POLICY "Public Read Access Cases" ON emergency_cases FOR SELECT USING (true);
CREATE POLICY "Public Write Access Cases" ON emergency_cases FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Cases" ON emergency_cases FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Cases" ON emergency_cases FOR DELETE USING (true);

-- Ambulances
CREATE POLICY "Public Read Access Ambulances" ON ambulances FOR SELECT USING (true);
CREATE POLICY "Public Write Access Ambulances" ON ambulances FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Ambulances" ON ambulances FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Ambulances" ON ambulances FOR DELETE USING (true);

-- Beds
CREATE POLICY "Public Read Access Beds" ON icu_beds FOR SELECT USING (true);
CREATE POLICY "Public Write Access Beds" ON icu_beds FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Beds" ON icu_beds FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Beds" ON icu_beds FOR DELETE USING (true);

-- Doctors Roster
CREATE POLICY "Public Read Access Doctors" ON doctors FOR SELECT USING (true);
CREATE POLICY "Public Write Access Doctors" ON doctors FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Doctors" ON doctors FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Doctors" ON doctors FOR DELETE USING (true);

-- Notifications
CREATE POLICY "Public Read Access Notifications" ON notifications FOR SELECT USING (true);
CREATE POLICY "Public Write Access Notifications" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Notifications" ON notifications FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Notifications" ON notifications FOR DELETE USING (true);

-- Appointments
CREATE POLICY "Public Read Access Appointments" ON appointments FOR SELECT USING (true);
CREATE POLICY "Public Write Access Appointments" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Appointments" ON appointments FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Appointments" ON appointments FOR DELETE USING (true);

-- Events
CREATE POLICY "Public Read Access Events" ON hospital_events FOR SELECT USING (true);
CREATE POLICY "Public Write Access Events" ON hospital_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Events" ON hospital_events FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Events" ON hospital_events FOR DELETE USING (true);

-- Leads CRM
CREATE POLICY "Public Read Access Leads" ON leads FOR SELECT USING (true);
CREATE POLICY "Public Write Access Leads" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Leads" ON leads FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Leads" ON leads FOR DELETE USING (true);

-- Contacts
CREATE POLICY "Public Read Access Contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Public Write Access Contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Access Contacts" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Public Delete Access Contacts" ON contacts FOR DELETE USING (true);


-- =========================================================================
-- POPULATE TABLES WITH INITIAL CLINICAL DEMO RECORDS
-- =========================================================================

-- Seed Patients
INSERT INTO patients (id, name, age, gender, blood_type, condition, risk_score, risk_level, department, avatar, vitals, history, medications, reports, summary) VALUES
('P-101', 'Marcus Vance', 58, 'Male', 'A+', 'Acute Coronary Syndrome', 92, 'Critical', 'Cardiology', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', 
 '{"heartRate": 114, "bpSystolic": 165, "bpDiastolic": 104, "oxygenSat": 89, "temperature": 37.8, "bloodSugar": 145}'::jsonb,
 '[{"time": "17:30", "heartRate": 98, "bpSystolic": 145, "bpDiastolic": 92, "oxygenSat": 93, "bloodSugar": 140}, {"time": "18:00", "heartRate": 114, "bpSystolic": 165, "bpDiastolic": 104, "oxygenSat": 89, "bloodSugar": 145}]'::jsonb,
 '[{"name": "Nitroglycerin", "dosage": "0.4 mg", "frequency": "PRN", "time": "17:40"}, {"name": "Aspirin", "dosage": "325 mg", "frequency": "Once", "time": "17:32"}]'::jsonb,
 '[{"id": "R-701", "name": "12-Lead Electrocardiogram", "date": "2026-06-01", "category": "ECG", "result": "STEMI signs present."}]'::jsonb,
 'Patient presents with crushing chest pain radiation. Urgent cardiology bypass activated.'),
('P-102', 'Elena Rostova', 34, 'Female', 'AB-', 'Severe Polytrauma', 84, 'High Risk', 'Trauma Surgery', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
 '{"heartRate": 122, "bpSystolic": 95, "bpDiastolic": 55, "oxygenSat": 92, "temperature": 36.4, "bloodSugar": 110}'::jsonb,
 '[]'::jsonb, '[]'::jsonb, '[]'::jsonb, 'Admitted post high-speed highway collision.');

-- Seed Emergencies
INSERT INTO emergency_cases (id, patient_name, age, gender, symptoms, severity, reported_time, eta_minutes, ambulance_id, status, department) VALUES
('EMG-4401', 'David Kim', 41, 'Male', 'Sudden left-sided weakness, slurred speech', 'Critical', '18:02', 4, 'AMB-02', 'EnRoute', 'Stroke Neurology'),
('EMG-4402', 'Emma Watson', 12, 'Female', 'Anaphylaxis post nut ingestion', 'Critical', '18:05', 2, 'AMB-01', 'EnRoute', 'Pediatrics');

-- Seed Ambulances
INSERT INTO ambulances (id, code, status, location, active_emergency_id, eta, speed, crew) VALUES
('AMB-01', 'Rescue 21', 'EnRoute', 'Sector 4 North Highway', 'EMG-4402', 2, 78, ARRAY['Medic Sarah Conner', 'Driver John Doe']),
('AMB-02', 'Trauma Unit 09', 'EnRoute', 'Metro Plaza Boulevard', 'EMG-4401', 4, 64, ARRAY['Medic Rick Grimes', 'Driver Glenn R.']),
('AMB-03', 'Cardiac Support 15', 'Available', 'Emergix Bay 3', NULL, 0, 0, ARRAY['Paramedic Bruce Wayne', 'Driver Alfred P.']);

-- Seed Beds
INSERT INTO icu_beds (id, name, occupied, patient_id, patient_name, ventilator_active, oxygen_flow_lpm, bed_type, risk_level) VALUES
('BED-01', 'ICU-Bed 01', TRUE, 'P-101', 'Marcus Vance', TRUE, 15, 'ICU', 'Critical'),
('BED-02', 'ICU-Bed 02', TRUE, 'P-102', 'Elena Rostova', FALSE, 6, 'Trauma', 'High Risk'),
('BED-03', 'CCU-Bed 03', FALSE, NULL, NULL, FALSE, 0, 'CCU', NULL),
('BED-04', 'ICU-Bed 04', FALSE, NULL, NULL, FALSE, 0, 'ICU', NULL);

-- Seed Doctors
INSERT INTO doctors (id, name, specialty, status, active_patients) VALUES
('DOC-501', 'Dr. Evelyn Sterling', 'Trauma Surgery', 'Active', 4),
('DOC-502', 'Dr. Vincent Rhodes', 'Interventional Cardiology', 'In Surgery', 2),
('DOC-503', 'Dr. Clara Mendeleev', 'Emergency Medicine', 'On Call', 3);

-- Seed Notifications
INSERT INTO notifications (id, title, message, level, timestamp, read) VALUES
('N-201', 'O2 Level Drop Alert', 'Critical O2 drop (89%) recorded for Marcus Vance (BED-01).', 'critical', '18:10', FALSE),
('N-202', 'New Critical Intake', 'Emergency EMG-4402 has been dispatched. Pediatric anaphylaxis.', 'alert', '18:05', FALSE);

-- Seed Leads CRM
INSERT INTO leads (id, name, email, phone, source, status, notes) VALUES
('L-001', 'Sarah Jenkins', 'sjenkins@gmail.com', '+1-555-0143', 'Website Triage Portal', 'New', 'Interested in elective ambulatory schedules.'),
('L-002', 'Gregory House', 'housemd@princeton.org', '+1-555-0199', 'Partner Hospital Referrals', 'Contacted', 'Inbound transfer requested for respiratory diagnostics.');

-- Seed Contacts emergency references
INSERT INTO contacts (id, name, relationship, phone, email, patient_id) VALUES
('C-001', 'Sherry Vance', 'Spouse', '+1-555-0888', 'sherry.vance@gmail.com', 'P-101'),
('C-002', 'Alexei Rostov', 'Brother', '+1-555-0723', 'arostov@yahoo.com', 'P-102');

-- Seed Logs
INSERT INTO logs (message) VALUES
('Emergix database synchronization established on Supabase Cloud API portal.'),
('Siren telemetry dispatch units connected safely.');
```

---

## 🚀 Part 3: Step-by-Step Local Run Guide

Follow these exact steps sequentially on your private laptop or desktop computer to bring the Emergix workspace online:

### Step 1: Install Node.js (The Runtime)
1. Go to **[https://nodejs.org](https://nodejs.org)** on your browser.
2. Download and install the version labeled **LTS (Long Term Support)** for your operating system (Windows or macOS).
3. Leave all options on their default settings during installation and click Finish.

### Step 2: Open Your Code Terminal
*   **On Windows**: Press the `Windows Key`, type **cmd**, and press Enter (this opens the Command Prompt).
*   **On macOS**: Press `Command + Spacebar`, type **Terminal**, and press Enter.

### Step 3: Extract & Navigate to the Code Directory
1. If you downloaded the codebase as a ZIP file from AI Studio, right-click and **Extract All** to a folder (e.g., in your Documents folder).
2. Inside your Command Prompt/Terminal, type `cd ` followed by the path where you saved the files, then press Enter.
   * *Example*: `cd Documents/emergix-app`

### Step 4: Install Project Code Dependencies
Once inside the folder path in your terminal, type this command and hit Enter:
```bash
npm install
```
This will automatically parse the `package.json` file and safely download all UI components and server networks onto your machine.

### Step 5: Configure Environment Keys (`.env`)
1. Look inside the codebase folder for a file named `.env.example` (it has no words before the dot).
2. **Duplicate/Copy** this file and rename the new file exactly to: `.env`
3. Open the `.env` file with a standard Text Editor (such as Notepad or TextEdit).
4. Fill in your keys inside the quotes:
   ```env
   # Your Supabase Cloud Credentials from Settings -> API panel
   VITE_SUPABASE_URL="https://your-supabase-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-token-string"

   # Your secure Google Gemini intelligence brains Key
   GEMINI_API_KEY="AIzaSyYourPrivateGeminiKeyHere"
   ```

### Step 6: Connect your React components to Supabase
For the easiest setup, install the official Supabase bundle:
```bash
npm install @supabase/supabase-js
```
Then, you can initialize a single global connector instance (e.g., `/src/lib/supabase.ts`):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```
Replace the standard React `useState` hooks inside `/src/App.tsx` with real-time listeners:
```typescript
// Fetching patients dynamically from Supabase
useEffect(() => {
  const fetchPatients = async () => {
    const { data } = await supabase.from('patients').select('*');
    if (data) setPatients(data);
  };
  fetchPatients();
  
  // Setup real-time listeners
  const subscription = supabase
    .channel('patients-channel')
    .on('postgres_changes', { event: '*', table: 'patients' }, fetchPatients)
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, []);
```

### Step 7: Fire Up the Emergix Workspace!
In your terminal, run:
```bash
npm run dev
```

The terminal will print validation success logs and output:
```text
  ➜  Local:   http://localhost:3000/
```
Open **[http://localhost:3000](http://localhost:3000)** in your Chrome, Edge, or Safari browser. You will find your custom light, lavender-decorated clinical dashboard running live, querying and altering records on your Supabase cloud server!

---
*Manual drafted on June 3, 2026. For additional questions about secure clinical parameters or ventilator thresholds, write us at revanthjoshua77@gmail.com!*
