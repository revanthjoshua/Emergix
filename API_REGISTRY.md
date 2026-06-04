# 📡 Emergix Core API Registry

This registry serves as the system blueprint for the **Emergix Hospital Clinical Workspace & Dispatch Console**. It lists every operational endpoint currently integrated as a real full-stack service, as well as the proposed database and authentication REST APIs mapped to your **Supabase** backend.

---

## 🔐 1. Authentication & System Access (`LoginView`)

Responsible for secure authentication, session management, and determining user access privileges.

### 🟢 Used APIs (Active Server-Side Proxies / Clients)
#### `POST /api/auth/login`
*   **Description**: Verifies staff email address and access code credentials to assign active session state.
*   **Request Payload**:
    ```json
    {
      "email": "e.sterling@emergix.org",
      "accessCode": "********"
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "sessionToken": "jwt_token_string_here",
      "user": {
        "id": "USR-001",
        "name": "Dr. Evelyn Sterling",
        "role": "Doctor",
        "department": "Trauma Surgery"
      }
    }
    ```

### 🔮 Proposed APIs (Supabase Autopilot Setup)
#### `POST /api/auth/logout`
*   **Description**: Erases/destroys current active staff session credentials and revokes authorization tokens.
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Session terminated successfully."
    }
    ```

#### `GET /api/auth/profile`
*   **Description**: Analyzes active cookie/bearer tokens to secure and fetch signed-in clinician privilege levels.
*   **Response Payload (200 OK)**:
    ```json
    {
      "authenticated": true,
      "userId": "USR-001",
      "role": "Doctor",
      "permissions": ["read:all", "write:triage", "update:twin_vitals"]
    }
    ```

---

## 📊 2. Command Hub Home (`DashboardView` & `SimulatorControl`)

Brings global telemetry aggregated counts, active alert trackers, and timeflow parameters together dynamically.

### 🟢 Used APIs (Active Server-Side Proxies / Clients)
#### `POST /api/ai/predict-load`
*   **Description**: Employs Gemini to estimate shift operational load, identify bottlenecks, and calculate resource stress percentages.
*   **Request Payload**:
    ```json
    {
      "emergencyInflow": 3,
      "icuUtilization": 75,
      "ambulanceLoad": 66,
      "lastIncidents": ["BED-01 O2 saturation dropped", "Rescue 21 dispatched"]
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "bottleneckWarning": "⚠️ MODERATE CCU BED INTAKE STRAIN",
      "recs": [
        "Pre-screen stable sub-acute cardiology patients for early discharge transition.",
        "Request secondary backup teams to assist with inbound trauma cases."
      ],
      "overflowRiskPercent": 64,
      "summary": "Care teams are pacing within safety margins but expect tight critical-care margins."
    }
    ```

### 🔮 Proposed APIs (Supabase Autopilot Setup)
#### `GET /api/dashboard/stats`
*   **Description**: Aggregates continuous counters for ICU Bed bookings, Patient quotas, and Siren fleet dispatches.
*   **Response Payload (200 OK)**:
    ```json
    {
      "totalOccupiedBeds": 12,
      "totalAvailableBeds": 8,
      "activeAmbulancesDispatched": 3,
      "criticalPatientsCount": 2,
      "undispatchedCasesCount": 0
    }
    ```

#### `PATCH /api/simulator/speed`
*   **Description**: Multiplies simulation frequency constants (e.g., x1, x2, x4) to accelerate hospital patient cycles.
*   **Request Payload**:
    ```json
    {
      "multiplier": 4
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "currentMultiplier": 4,
      "simulatedIntervalMs": 5000
    }
    ```

---

## 🚑 3. Dispatch & Triage (`AiTriageView`)

Bridges field incident reports with automated department routing and acute care bed assignments.

### 🟢 Used APIs (Active Server-Side Proxies / Clients)
#### `POST /api/ai/triage`
*   **Description**: Evaluates symptoms using Gemini to output clinical severity scores and recommend medical disciplines.
*   **Request Payload**:
    ```json
    {
      "name": "David Kim",
      "age": 41,
      "gender": "Male",
      "symptoms": "Sudden left-sided weakness, slurred speech, drooping lip"
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "urgencyLevel": "Critical",
      "severityScore": 90,
      "probableDepartment": "Stroke Neurology",
      "recs": [
        "Order emergency non-contrast brain CT scan STAT.",
        "Initiate clinical NIH Stroke Scale evaluations."
      ],
      "assessmentSummary": "High diagnostic probability of acute ischemia stroke. Fast-track neurology priority."
    }
    ```

### 🔮 Proposed APIs (Supabase Autopilot Setup)
#### `GET /api/triage/queue`
*   **Description**: Retrieves currently unassigned emergency presentation logs arriving via phone or ambulance.
*   **Response Payload (200 OK)**:
    ```json
    [
      {
        "id": "EMG-4401",
        "patientName": "David Kim",
        "symptoms": "Sudden left-sided weakness, slurred speech",
        "severity": "Critical",
        "reportedTime": "18:02"
      }
    ]
    ```

#### `POST /api/triage/assign`
*   **Description**: Transfers a triaged case directly to an open ward bed position, updating the bed state instantly.
*   **Request Payload**:
    ```json
    {
      "caseId": "EMG-4401",
      "targetBedId": "BED-01",
      "assignedDoctorId": "DOC-501"
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "assignedBed": "BED-01",
      "status": "Admitted"
    }
    ```

---

## 🧬 4. Digital Health Twins (`PatientManagerView`)

Optimizes interactive electronic medical graphs, patient files, and historic telemetry registers.

### 🔮 Proposed APIs (Supabase Autopilot Setup)
#### `GET /api/patients`
*   **Description**: Returns all patients in the ward with live search, filtering, and pagination support.
*   **Response Payload (200 OK)**:
    ```json
    {
      "data": [
        {
          "id": "P-101",
          "name": "Marcus Vance",
          "age": 58,
          "riskLevel": "Critical",
          "condition": "Acute Coronary Syndrome"
        }
      ],
      "pagination": { "page": 1, "pageSize": 10, "totalPages": 1 }
    }
    ```

#### `PUT /api/patients/:id`
*   **Description**: Commits inline ✏️ edits to a patient’s name, age, biological details, medications list, and diagnosis records.
*   **Request Payload**:
    ```json
    {
      "name": "Marcus Vance Jr.",
      "age": 59,
      "condition": "ACS Recovery Stage"
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "patient": { "id": "P-101", "name": "Marcus Vance Jr.", "age": 59 }
    }
    ```

#### `GET /api/patients/:id/telemetry`
*   **Description**: Fetches historical vital parameters list for rendering physiological charts (ECG, O2 waveforms) inside Recharts canvas containers.
*   **Response Payload (200 OK)**:
    ```json
    {
      "history": [
        { "time": "18:00", "heartRate": 114, "bpSystolic": 165, "bpDiastolic": 104, "oxygenSat": 89 },
        { "time": "18:05", "heartRate": 110, "bpSystolic": 160, "bpDiastolic": 100, "oxygenSat": 91 }
      ]
    }
    ```

---

## 🛏️ 5. ICU Beds Matrix (`IcuBedView`)

Manages intensive care facility bookings, ventilator triggers, and physiological flow rates.

### 🔮 Proposed APIs (Supabase Autopilot Setup)
#### `GET /api/beds`
*   **Description**: Pulls current wards, category types, and active patient occupancies.
*   **Response Payload (200 OK)**:
    ```json
    [
      {
        "id": "BED-01",
        "name": "ICU-Bed 01",
        "occupied": true,
        "patientName": "Marcus Vance",
        "ventilatorActive": true,
        "oxygenFlowLpm": 15
      }
    ]
    ```

#### `PUT /api/beds/:id`
*   **Description**: Modifies hardware station names, classifications, and ventilator flow rates in real-time.
*   **Request Payload**:
    ```json
    {
      "name": "Critical Bed Alpha",
      "ventilatorActive": true,
      "oxygenFlowLpm": 12
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "bed": { "id": "BED-01", "name": "Critical Bed Alpha", "oxygenFlowLpm": 12 }
    }
    ```

#### `POST /api/beds/:id/release`
*   **Description**: Discharges / Releases a patient file upon recovery to safely release bed terminals.
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "releasedBed": "BED-01",
      "occupied": false,
      "patientName": null
    }
    ```

---

## 🛰️ 6. Ambulance Radar (`AmbulanceTrackerView`)

Maintains field ambulance coordinates, GPS speeds, crew shifts, and route metrics.

### 🔮 Proposed APIs (Supabase Autopilot Setup)
#### `GET /api/ambulances`
*   **Description**: Fetches siren positions, velocities, crew directories, and ETA progression status.
*   **Response Payload (200 OK)**:
    ```json
    [
      {
        "id": "AMB-01",
        "code": "Rescue 21",
        "status": "EnRoute",
        "speed": 78,
        "eta": 2,
        "location": "Sector 4 Hwy"
      }
    ]
    ```

#### `PUT /api/ambulances/:id`
*   **Description**: Edits callsing codes, overrides speed limits, alters targets, and adjusts paramedic lists.
*   **Request Payload**:
    ```json
    {
      "code": "Rescue 21-A",
      "speed": 85,
      "crew": ["Medic Sarah Conner", "Dr. John Connor"]
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "ambulance": { "id": "AMB-01", "code": "Rescue 21-A", "speed": 85 }
    }
    ```

---

## 🩺 7. Clinicians & Roster (`DoctorManagementView`)

Monitors on-call schedules, medical specialties, and clinician workloads.

### 🔮 Proposed APIs (Supabase Autopilot Setup)
#### `GET /api/doctors`
*   **Description**: Pulls on-call rosters, status conditions (Active, On-Call, In Surgery), and active patient quotas.
*   **Response Payload (200 OK)**:
    ```json
    [
      {
        "id": "DOC-501",
        "name": "Dr. Evelyn Sterling",
        "specialty": "Trauma Surgery",
        "status": "Active",
        "activePatients": 4
      }
    ]
    ```

#### `PUT /api/doctors/:id`
*   **Description**: Edits Clinician names, shift hours, specialties, and active patient capacities.
*   **Request Payload**:
    ```json
    {
      "name": "Dr. Evelyn Sterling-Rhodes",
      "status": "In Surgery"
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "doctor": { "id": "DOC-501", "name": "Dr. Evelyn Sterling-Rhodes", "status": "In Surgery" }
    }
    ```

---

## 📅 8. Appointments & Calendar (`AppointmentsView`)

Manages elective surgeries, clinical checkups, patient discharge bookings, and follow-ups.

### 🔮 Proposed APIs (Supabase Autopilot Setup)
#### `GET /api/appointments`
*   **Description**: Returns scheduled surgical procedures, clinical checkups, or discharge schedules.
*   **Response Payload (200 OK)**:
    ```json
    [
      {
        "id": "APT-901",
        "patientName": "Marcus Vance",
        "type": "Cardiac Bypass Surgery",
        "date": "2026-06-04T08:00:00Z",
        "clinicalSummary": "Pre-op checklist complete."
      }
    ]
    ```

#### `POST /api/appointments`
*   **Description**: Schedules and books a new surgery, discharge date, or follow-up task.
*   **Request Payload**:
    ```json
    {
      "patientName": "Elena Rostova",
      "type": "Polytrauma Assessment",
      "date": "2026-06-05T14:30:00Z",
      "clinicalSummary": "Trauma team review."
    }
    ```
*   **Response Payload (201 Created)**:
    ```json
    {
      "success": true,
      "appointment": { "id": "APT-902", "patientName": "Elena Rostova" }
    }
    ```

#### `PUT /api/appointments/:id`
*   **Description**: Modifies scheduled surgery times, specialties, or clinical checklist parameters.
*   **Request Payload**:
    ```json
    {
      "date": "2026-06-05T15:00:00Z",
      "clinicalSummary": "Rescheduled due to emergency ward flow."
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "success": true,
      "appointment": { "id": "APT-902", "date": "2026-06-05T15:00:00Z" }
    }
    ```

---

## 🧠 Cognitive Clinical Advisor Agent (`GlobalJoshuaaWidget`)

low-latency clinical guidelines and system instructions.

### 🟢 Used APIs (Active Server-Side Proxies / Clients)
#### `POST /api/ai/assistant`
*   **Description**: Direct Chat route to "Joshuaa", returning extremely focused, rapid, 2-3 bullet clinical directives (no long greeting fluff, capped strictly to 50-60 words).
*   **Request Payload**:
    ```json
    {
      "messages": [
        { "role": "user", "content": "How do I initial treat a cardiac arrest patient?" }
      ]
    }
    ```
*   **Response Payload (200 OK)**:
    ```json
    {
      "text": "👋 **Joshuaa here (Concise Care Advisor)!** Let's act immediately:\n\n• **Initiate Chest Compressions**: High-quality CPR at 100-120 compressions/min.\n• **Secure Airways**: Apply high-flow oxygen mask.\n• **Defibrillate**: Hook to AED/ECG pads and check shockable rhythms immediately."
    }
    ```
