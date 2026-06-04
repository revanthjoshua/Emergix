/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Patient, EmergencyCase, Ambulance, IcuBed, Doctor, SystemNotification, RiskLevel } from './types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'P-101',
    name: 'Marcus Vance',
    age: 58,
    gender: 'Male',
    bloodType: 'A+',
    condition: 'Acute Coronary Syndrome',
    riskScore: 92,
    riskLevel: 'Critical',
    department: 'Cardiology',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    vitals: {
      heartRate: 114,
      bpSystolic: 165,
      bpDiastolic: 104,
      oxygenSat: 89,
      temperature: 37.8,
      bloodSugar: 145
    },
    history: [
      { time: '17:30', heartRate: 98, bpSystolic: 145, bpDiastolic: 92, oxygenSat: 93, bloodSugar: 140 },
      { time: '17:45', heartRate: 105, bpSystolic: 155, bpDiastolic: 98, oxygenSat: 91, bloodSugar: 142 },
      { time: '18:00', heartRate: 114, bpSystolic: 165, bpDiastolic: 104, oxygenSat: 89, bloodSugar: 145 }
    ],
    medications: [
      { name: 'Nitroglycerin', dosage: '0.4 mg', frequency: 'PRN', time: '17:40' },
      { name: 'Aspirin', dosage: '325 mg', frequency: 'Once', time: '17:32' },
      { name: 'Heparin', dosage: '5000 units', frequency: 'Continuous IV Infusion', time: '17:50' }
    ],
    reports: [
      { id: 'R-701', name: '12-Lead Electrocardiogram', date: '2026-06-01', category: 'ECG', result: 'ST-segment elevation in V1-V4. Hyperacute T waves.' },
      { id: 'R-702', name: 'Troponin I Assay', date: '2026-06-01', category: 'Lab', result: 'Elevated: 1.24 ng/mL (Reference: < 0.04 ng/mL)' }
    ],
    summary: 'Marcus present with crushing central chest pain radiating to back and left arm. Onset 45 mins ago. Initial ECG denotes acute anterior STEMI. Revascularization is underway.'
  },
  {
    id: 'P-102',
    name: 'Elena Rostova',
    age: 34,
    gender: 'Female',
    bloodType: 'AB-',
    condition: 'Severe Polytrauma',
    riskScore: 84,
    riskLevel: 'High Risk',
    department: 'Trauma Surgery',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    vitals: {
      heartRate: 122,
      bpSystolic: 95,
      bpDiastolic: 55,
      oxygenSat: 92,
      temperature: 36.4,
      bloodSugar: 110
    },
    history: [
      { time: '17:30', heartRate: 110, bpSystolic: 108, bpDiastolic: 65, oxygenSat: 94, bloodSugar: 105 },
      { time: '17:45', heartRate: 118, bpSystolic: 100, bpDiastolic: 60, oxygenSat: 93, bloodSugar: 108 },
      { time: '18:00', heartRate: 122, bpSystolic: 95, bpDiastolic: 55, oxygenSat: 92, bloodSugar: 110 }
    ],
    medications: [
      { name: 'Fentanyl', dosage: '50 mcg', frequency: 'PRN', time: '17:35' },
      { name: 'Tranexamic Acid (TXA)', dosage: '1 g', frequency: 'Bolus', time: '17:42' },
      { name: 'Normal Saline', dosage: '1 L', frequency: 'Bolus IV', time: '17:45' }
    ],
    reports: [
      { id: 'R-704', name: 'Polytrauma CT Full Body Scan', date: '2026-06-01', category: 'Radiology', result: 'Subsplenic hematoma with active extravasation, grade III liver laceration, and left femoral shaft fracture.' },
      { id: 'R-705', name: 'eFAST Ultrasound', date: '2026-06-01', category: 'Ultrasound', result: 'Positive fluid collection in Morisons pouch and splenorenal recess.' }
    ],
    summary: 'Elena admitted post high-speed motor vehicle collision. Suffering multiple system injuries. Subsplenic rupture, internal bleed. Immediate emergency laparotomy scheduled.'
  },
  {
    id: 'P-103',
    name: 'Sarah Jenkins',
    age: 26,
    gender: 'Female',
    bloodType: 'O+',
    condition: 'Acute Diabetic Ketoacidosis',
    riskScore: 68,
    riskLevel: 'Medium Risk',
    department: 'Endocrinology',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    vitals: {
      heartRate: 95,
      bpSystolic: 115,
      bpDiastolic: 72,
      oxygenSat: 97,
      temperature: 38.2,
      bloodSugar: 480
    },
    history: [
      { time: '17:30', heartRate: 100, bpSystolic: 110, bpDiastolic: 70, oxygenSat: 96, bloodSugar: 512 },
      { time: '17:45', heartRate: 98, bpSystolic: 112, bpDiastolic: 71, oxygenSat: 96, bloodSugar: 495 },
      { time: '18:00', heartRate: 95, bpSystolic: 115, bpDiastolic: 72, oxygenSat: 97, bloodSugar: 480 }
    ],
    medications: [
      { name: 'Regular Insulin', dosage: '10 Units', frequency: 'IV Bolus', time: '17:38' },
      { name: 'Fluid Infusion (0.9% NaCl)', dosage: '500 mL/hr', frequency: 'Continuous', time: '17:40' },
      { name: 'Potassium Chloride', dosage: '20 mEq', frequency: 'Continuous IV Infusion', time: '17:48' }
    ],
    reports: [
      { id: 'R-707', name: 'Arterial Blood Gas Analysis', date: '2026-06-01', category: 'Lab', result: 'pH: 7.15 (Metabolic Acidosis), HCO3: 11 mEq/L, Anion Gap: 24.' },
      { id: 'R-708', name: 'Serum Ketone Level Test', date: '2026-06-01', category: 'Lab', result: 'Significantly elevated: 6.2 mmol/L.' }
    ],
    summary: 'Sarah presents highly lethargic and reporting deep Kussmaul respirations. Blood sugar is critically high at 480. Commenced on insulin infusion with careful electrolyte monitoring.'
  },
  {
    id: 'P-104',
    name: 'Julian Chen',
    age: 48,
    gender: 'Male',
    bloodType: 'B+',
    condition: 'Status Asthmaticus',
    riskScore: 78,
    riskLevel: 'High Risk',
    department: 'Pulmonology',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    vitals: {
      heartRate: 108,
      bpSystolic: 130,
      bpDiastolic: 80,
      oxygenSat: 90,
      temperature: 37.1,
      bloodSugar: 130
    },
    history: [
      { time: '17:30', heartRate: 115, bpSystolic: 135, bpDiastolic: 85, oxygenSat: 87, bloodSugar: 125 },
      { time: '17:45', heartRate: 112, bpSystolic: 132, bpDiastolic: 82, oxygenSat: 88, bloodSugar: 128 },
      { time: '18:00', heartRate: 108, bpSystolic: 130, bpDiastolic: 80, oxygenSat: 90, bloodSugar: 130 }
    ],
    medications: [
      { name: 'Albuterol Nebulizer', dosage: '5.0 mg', frequency: 'Continuous Q20min', time: '17:32' },
      { name: 'Solu-Medrol', dosage: '125 mg', frequency: 'IV Push', time: '17:40' },
      { name: 'Magnesium Sulfate', dosage: '2.0 g', frequency: 'Infusion over 20m', time: '17:48' }
    ],
    reports: [
      { id: 'R-710', name: 'Chest Radiograph (X-Ray)', date: '2026-06-01', category: 'Imaging', result: 'Bilateral lung hyperinflation. No deep consolidations or acute pneumothorax.' }
    ],
    summary: 'Julian presented with refractory asthma attack, severe wheezing, accessory muscle use, and poor air movement. Oxygen saturation improving slowly post nebulizers and magnesium infusion.'
  },
  {
    id: 'P-105',
    name: 'Eliza Thorne',
    age: 72,
    gender: 'Female',
    bloodType: 'O-',
    condition: 'Postoperative Sepsis',
    riskScore: 90,
    riskLevel: 'Critical',
    department: 'Intensive Care',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    vitals: {
      heartRate: 118,
      bpSystolic: 88,
      bpDiastolic: 48,
      oxygenSat: 93,
      temperature: 39.4,
      bloodSugar: 160
    },
    history: [
      { time: '17:30', heartRate: 108, bpSystolic: 98, bpDiastolic: 54, oxygenSat: 95, bloodSugar: 150 },
      { time: '17:45', heartRate: 114, bpSystolic: 92, bpDiastolic: 50, oxygenSat: 94, bloodSugar: 155 },
      { time: '18:00', heartRate: 118, bpSystolic: 88, bpDiastolic: 48, oxygenSat: 93, bloodSugar: 160 }
    ],
    medications: [
      { name: 'Norepinephrine', dosage: '0.1 mcg/kg/min', frequency: 'Continuous Infusion', time: '17:45' },
      { name: 'Meropenem', dosage: '1.0 g', frequency: 'IV Q8hr', time: '17:35' },
      { name: 'Lactate Ringer', dosage: '2.0 L', frequency: 'IV Bolus', time: '17:30' }
    ],
    reports: [
      { id: 'R-712', name: 'Comprehensive Sepsis Blood Panel', date: '2026-06-01', category: 'Lab', result: 'WBC high: 22.4 x10^3/uL. Serum Lactate critically high: 4.8 mmol/L.' },
      { id: 'R-713', name: 'Urine Culture & Gram Scan', date: '2026-06-01', category: 'Microbiology', result: 'Gram-negative bacilli detected. Pending final identification and sensitivity margins.' }
    ],
    summary: 'Eliza admitted with hypotension refractory to initial fluid resuscitation. Initiated vasopressor therapy (Levo). Under Broad-spectrum antibiotic coverage. ICU status.'
  }
];

export const INITIAL_EMERGENCIES: EmergencyCase[] = [
  {
    id: 'EMG-4401',
    patientName: 'David Kim',
    age: 41,
    gender: 'Male',
    symptoms: 'Sudden left-sided weakness, severe slurred speech, facial droop',
    severity: 'Critical',
    reportedTime: '18:02',
    etaMinutes: 4,
    ambulanceId: 'AMB-02',
    status: 'EnRoute',
    department: 'Stroke Neurology'
  },
  {
    id: 'EMG-4402',
    patientName: 'Emma Watson',
    age: 12,
    gender: 'Female',
    symptoms: 'Acute respiratory distress post peanut ingestion, anaphylaxis signs',
    severity: 'Critical',
    reportedTime: '18:05',
    etaMinutes: 2,
    ambulanceId: 'AMB-01',
    status: 'EnRoute',
    department: 'Pediatrics / Allergy'
  },
  {
    id: 'EMG-4403',
    patientName: 'Frank Miller',
    age: 63,
    gender: 'Male',
    symptoms: 'Chest pressure, diaphoresis, pain radiating down left shoulder blade',
    severity: 'High Risk',
    reportedTime: '17:58',
    status: 'Arrived',
    department: 'Cardiology'
  },
  {
    id: 'EMG-4404',
    patientName: 'Grace Peterson',
    age: 78,
    gender: 'Female',
    symptoms: 'Mechanical fall on stairs, suspected hip fracture, extreme local pain',
    severity: 'Medium Risk',
    reportedTime: '17:52',
    status: 'Admitted',
    department: 'Orthopedic Surgery'
  }
];

export const INITIAL_AMBULANCES: Ambulance[] = [
  {
    id: 'AMB-01',
    code: 'Rescue 21',
    status: 'EnRoute',
    assignedHospital: 'Emergix HQ Center',
    crew: ['Medic Sarah Conner', 'Driver John Doe'],
    location: 'Sector 4 North Highway',
    activeEmergencyId: 'EMG-4402',
    eta: 2,
    speed: 78
  },
  {
    id: 'AMB-02',
    code: 'Trauma Unit 09',
    status: 'EnRoute',
    assignedHospital: 'Emergix HQ Center',
    crew: ['Medic Rick Grimes', 'Driver Glenn R.'],
    location: 'Metro Plaza Boulevard',
    activeEmergencyId: 'EMG-4401',
    eta: 4,
    speed: 64
  },
  {
    id: 'AMB-03',
    code: 'Cardiac Support 15',
    status: 'Available',
    assignedHospital: 'Emergix HQ Center',
    crew: ['Paramedic Bruce Wayne', 'Driver Alfred P.'],
    location: 'Emergix Bay 3',
    eta: 0,
    speed: 0
  },
  {
    id: 'AMB-04',
    code: 'Mobile ICU unit 04',
    status: 'Returning',
    assignedHospital: 'Emergix HQ Center',
    crew: ['Dr. J. Watson', 'Driver Sherlock H.'],
    location: 'Stanton Residential Link',
    eta: 8,
    speed: 35
  }
];

export const INITIAL_ICU_BEDS: IcuBed[] = [
  { id: 'BED-01', name: 'ICU-Bed 01', occupied: true, patientId: 'P-101', patientName: 'Marcus Vance', ventilatorActive: true, oxygenFlowLpm: 15, bedType: 'ICU', riskLevel: 'Critical' },
  { id: 'BED-02', name: 'ICU-Bed 02', occupied: true, patientId: 'P-102', patientName: 'Elena Rostova', ventilatorActive: false, oxygenFlowLpm: 6, bedType: 'Trauma', riskLevel: 'High Risk' },
  { id: 'BED-03', name: 'CCU-Bed 03', occupied: true, patientId: 'P-104', patientName: 'Julian Chen', ventilatorActive: false, oxygenFlowLpm: 4, bedType: 'CCU', riskLevel: 'High Risk' },
  { id: 'BED-04', name: 'ICU-Bed 04', occupied: false, ventilatorActive: false, oxygenFlowLpm: 0, bedType: 'ICU' },
  { id: 'BED-05', name: 'NICU-Bed 05', occupied: false, ventilatorActive: false, oxygenFlowLpm: 0, bedType: 'NICU' },
  { id: 'BED-06', name: 'Trauma-Bed 06', occupied: true, patientId: 'P-105', patientName: 'Eliza Thorne', ventilatorActive: true, oxygenFlowLpm: 12, bedType: 'Trauma', riskLevel: 'Critical' },
  { id: 'BED-07', name: 'CCU-Bed 07', occupied: false, ventilatorActive: false, oxygenFlowLpm: 0, bedType: 'CCU' },
  { id: 'BED-08', name: 'ICU-Bed 08', occupied: true, patientId: 'P-103', patientName: 'Sarah Jenkins', ventilatorActive: false, oxygenFlowLpm: 2, bedType: 'ICU', riskLevel: 'Medium Risk' },
  { id: 'BED-09', name: 'Trauma-Bed 09', occupied: false, ventilatorActive: false, oxygenFlowLpm: 0, bedType: 'Trauma' },
  { id: 'BED-10', name: 'NICU-Bed 10', occupied: false, ventilatorActive: false, oxygenFlowLpm: 0, bedType: 'NICU' }
];

export const INITIAL_DOCTORS: Doctor[] = [
  { id: 'DOC-501', name: 'Dr. Evelyn Sterling', specialty: 'Trauma Surgery', status: 'Active', activePatients: 4 },
  { id: 'DOC-502', name: 'Dr. Vincent Rhodes', specialty: 'Interventional Cardiology', status: 'In Surgery', activePatients: 2 },
  { id: 'DOC-503', name: 'Dr. Clara Mendeleev', specialty: 'Emergency Medicine', status: 'On Call', activePatients: 3 },
  { id: 'DOC-504', name: 'Dr. Daniel Fletcher', specialty: 'Pulmonology / Critical Care', status: 'Active', activePatients: 2 },
  { id: 'DOC-505', name: 'Dr. Kenji Tanaka', specialty: 'Stroke Neurology', status: 'Active', activePatients: 3 }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  { id: 'N-201', title: 'O2 Level Drop Alert', message: 'Critical O2 drop (89%) recorded for patient Marcus Vance (BED-01). Immediate intervention required.', level: 'critical', timestamp: '18:10', read: false },
  { id: 'N-202', title: 'New Critical Intake', message: 'Emergency EMG-4402 has been dispatched. Pediatric anaphylaxis. ETA 2 minutes.', level: 'alert', timestamp: '18:05', read: false },
  { id: 'N-203', title: 'Bed Availability Low', message: 'ICU Bed Capacity is currently at 80% (8/10 beds occupied or reserved).', level: 'warning', timestamp: '17:50', read: true }
];

// Symptoms and potential responses lists for Simulator
export const NEW_SIREN_ALERTS = [
  { name: 'Arthur Pendelton', age: 79, gender: 'Male', symptoms: 'Severe acute confusion, unable to stand, acute high fever 40C', severity: 'Critical', department: 'Infectious Disease' },
  { name: 'Isabella Vance', age: 24, gender: 'Female', symptoms: 'Severe laceration in thigh following industrial accident, massive tourniquet bleeding', severity: 'Critical', department: 'Trauma Surgery' },
  { name: 'Xavier Ruiz', age: 67, gender: 'Male', symptoms: 'Crushing left jaw pain, stabbing chest constriction, acute cold sweat', severity: 'High Risk', department: 'Cardiology' },
  { name: 'Diana Prince', age: 31, gender: 'Female', symptoms: 'Third-degree heat burns on arms and torso post residential oven blast', severity: 'High Risk', department: 'Trauma / Burn Unit' }
];

export const SYSTEM_MESSAGES = [
  'Arrhythmia warning triggered on telemetry panel 4',
  'Ambulance 02 reports stable cardiac trace on transport monitor',
  'Automated triage re-calculated priority matrices across all queues',
  'CT scanner 2 report for roster uploaded to patient portal record',
  'Pharmacy authorized immediate IV epinephrine release for Trauma unit',
  'Oxygen distribution grid line pressure stable at 75 PSI'
];
