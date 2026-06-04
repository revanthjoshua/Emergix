# 🎯 Emergix Full-Stack Connection Master Plan

This Master Plan bridges the designed **Emergix** patient dashboard with a production-grade **Node.js/Express** custom backend and **Supabase (PostgreSQL)** database. Follow this architectural roadmap to transform static mock-data streams into a live, highly reactive clinical environment.

---

## 🏗️ Phase 1: Unified System Architecture

The full stack operates on a **three-tier architecture**:

```
 🏥 CLINICAL WORKFLOW PORTAL (React SPA)
                │ (Sends actions & reads real-time records)
                ▼
 ⚡ CUSTOM API SERVICE (Node.js + Express) <───> 🧠 COGNITIVE SERVICES (Gemini AI SDK)
                │ (Secures traffic & reads/writes structured nodes)
                ▼
 ☁️ CLOUD DATABASE LAYER (Supabase Cloud + Postgres)
```

1.  **React Frontend Client**: Handles high-performance state-charts, visual telemetry displays (Recharts), and paramedic vector trackers (with elegant lavender ambient overlays).
2.  **Express Backend Service (`server.ts`)**: Proxies secure AI requests (avoiding browser key exposure) and handles custom server-side simulation triggers.
3.  **Supabase Postgres Engine**: Persists trauma rosters, bed assignments, and notification feeds, with built-in WebSockets for real-time telemetry updates.

---

## 🗄️ Phase 2: Database Migration Strategy

You have already run the PostgreSQL table creation script (located in `SUPABASE_SETUP.md`). Your tables are set up with initial on-call personnel and emergency sirens database rows. 

To expand this further, configure **PostgreSQL Row Level Security (RLS)** in Supabase to restrict modifications only to authenticated clinical users:

```sql
-- Enable RLS on core rosters
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- Allow internal clinical members with authenticated tokens to read patient files
CREATE POLICY "Allow clinical reads for auth users" 
ON patients FOR SELECT 
TO authenticated 
USING (true);

-- Allow doctors/nurses to modify vitals and records
CREATE POLICY "Allow clinical updates for auth doctors" 
ON patients FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);
```

---

## 📡 Phase 3: Step-by-Step API Integration Roadmap

Here is how to hot-wire your user-interface modules to the physical server APIs, replacing simulation loops with real query states:

### 1. Connecting `App.tsx` (Global Orchestrator)
Currently, `App.tsx` relies on local variables inside `/src/mockData.ts`. Connect them using the official `@supabase/supabase-js` client library:

```typescript
// Replace mock state initialization with standard web fetches
import { supabase } from './lib/supabase';

// Fetching global live metrics safely from Postgres
const loadClinicalWorkspace = async () => {
  setIsLoading(true);
  
  // 1. Get Beds
  const { data: beds } = await supabase.from('icu_beds').select('*');
  if (beds) setBeds(beds);
  
  // 2. Get Patients
  const { data: patients } = await supabase.from('patients').select('*');
  if (patients) setPatients(patients);
  
  // 3. Get Active Dispatch Sirens
  const { data: ambulances } = await supabase.from('ambulances').select('*');
  if (ambulances) setAmbulances(ambulances);
  
  setIsLoading(false);
};
```

### 2. Live Vitals Telemetry (The ECG & O2 Waveform Loop)
Instead of updating values randomly inside React timers, sync the clock rate with the Supabase client. When a user edits a patient's breathing metrics or when an automated simulation step triggers:

```typescript
// Pushes real-time heart rate and blood oxygen metrics straight to columns
const pushVitalsTelemetry = async (patientId: string, heartRate: number, oxygenSat: number) => {
  const { error } = await supabase
    .from('patients')
    .update({ 
      vitals: { heartRate, oxygenSat, bpSystolic: 120, bpDiastolic: 80, temperature: 36.8 } 
    })
    .eq('id', patientId);
    
  if (error) console.error("Telemetry upload failure:", error.message);
};
```

### 3. Patient Checkout & ICU Bed Deallocation
When a patient is discharged or declared stable, we free their bed in the ICU Bed Matrix:

```typescript
const releaseIcuBed = async (bedId: string) => {
  // 1. Update Bed to unoccupied state
  const { error: bedError } = await supabase
    .from('icu_beds')
    .update({ occupied: false, patient_id: null, patient_name: null })
    .eq('id', bedId);
    
  // 2. Track action inside audit logs table for diagnostics
  if (!bedError) {
    await supabase.from('logs').insert({ message: `Released bed ${bedId} successfully.` });
  }
};
```

### 4. Paramedic Fleet Dispatch Radar
When an emergency triage recommendation finishes, update the global dispatch dashboard:

```typescript
const dispatchAmbulance = async (ambulanceId: string, caseId: string) => {
  const { error } = await supabase
    .from('ambulances')
    .update({ 
      status: 'Dispatched', 
      active_emergency_id: caseId,
      eta: 10 // Start with default 10 minutes
    })
    .eq('id', ambulanceId);
};
```

---

## ⚡ Phase 4: Express API Integration (The AI Layer)

Since your Gemini API Key is a highly sensitive credential, **do not let the web browser touch it directly**. The web browser instead sends standard HTTP calls to your Node/Express server `server.ts`. 

```typescript
// inside server.ts - Proxying the Gemini Medical Triage Engine safely
import { GoogleGenAI } from "@google/genai";
import express from "express";

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/ai/triage", async (req, res) => {
  try {
    const { name, age, symptoms } = req.body;
    
    // Low latency directive system prompt
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: `Perform clinical trauma triage evaluation: Patient: ${name}, Age: ${age}, Symptoms: ${symptoms}. Return output strictly in JSON format matching { urgencyLevel: string, severityScore: number, probableDepartment: string, recs: string[] }.`
    });
    
    const assessment = JSON.parse(response.text);
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: "Failed to query clinical model advisor." });
  }
});
```

---

## 🚀 Phase 5: High-Performing Production Checklist

To make this app ready for hospital networks or real enterprise evaluation, verify these three critical security rules:

1.  **Add Domain Validation**: Configure Supabase authentication panel limits to only allow sign-ups ending in authorized hospital clinical domains (e.g., `*@emergix.org`).
2.  **Telemetry Debouncing**: Debounce local manual metrics sliders (like speeds or heart-rate slider adjusters in the UI) to avoid triggering dozens of quick database updates every fraction of a second.
3.  **Encrypted Logging**: Mask patient names inside the database `logs` activity feeds, keeping diagnostic feeds completely compliant with standard patient privacy structures.

---
*Created on June 3, 2026. Keep this document stored alongside your project workspace configs for rapid onboarding references!*
