import { 
  Patient, 
  EmergencyCase, 
  Ambulance, 
  IcuBed, 
  Doctor, 
  SystemNotification 
} from '../types';

// ==========================================
// 1. PATIENTS MAPS
// ==========================================
export function mapDbPatientToReact(db: any): Patient {
  return {
    id: db.id,
    name: db.name,
    age: db.age,
    gender: db.gender,
    bloodType: db.blood_type || 'O+',
    condition: db.condition,
    riskScore: db.risk_score || 0,
    riskLevel: db.risk_level,
    department: db.department,
    avatar: db.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    vitals: db.vitals || { heartRate: 75, bpSystolic: 120, bpDiastolic: 80, oxygenSat: 98, temperature: 37, bloodSugar: 100 },
    history: db.history || [],
    medications: db.medications || [],
    reports: db.reports || [],
    summary: db.summary || ''
  };
}

export function mapReactPatientToDb(react: Patient): any {
  return {
    id: react.id,
    name: react.name,
    age: react.age,
    gender: react.gender,
    blood_type: react.bloodType,
    condition: react.condition,
    risk_score: react.riskScore,
    risk_level: react.riskLevel,
    department: react.department,
    avatar: react.avatar,
    vitals: react.vitals,
    history: react.history,
    medications: react.medications,
    reports: react.reports,
    summary: react.summary || null
  };
}

// ==========================================
// 2. EMERGENCY CASES MAPS
// ==========================================
export function mapDbEmergencyToReact(db: any): EmergencyCase {
  return {
    id: db.id,
    patientName: db.patient_name,
    age: db.age,
    gender: db.gender,
    symptoms: db.symptoms,
    severity: db.severity,
    reportedTime: db.reported_time,
    etaMinutes: db.eta_minutes !== null ? db.eta_minutes : undefined,
    ambulanceId: db.ambulance_id || undefined,
    status: db.status,
    department: db.department
  };
}

export function mapReactEmergencyToDb(react: EmergencyCase): any {
  return {
    id: react.id,
    patient_name: react.patientName,
    age: react.age,
    gender: react.gender,
    symptoms: react.symptoms,
    severity: react.severity,
    reported_time: react.reportedTime,
    eta_minutes: react.etaMinutes !== undefined ? react.etaMinutes : null,
    ambulance_id: react.ambulanceId || null,
    status: react.status,
    department: react.department
  };
}

// ==========================================
// 3. AMBULANCES MAPS
// ==========================================
export function mapDbAmbulanceToReact(db: any): Ambulance {
  return {
    id: db.id,
    code: db.code,
    status: db.status,
    assignedHospital: db.assigned_hospital || 'Emergix HQ Center',
    crew: db.crew || [],
    location: db.location,
    activeEmergencyId: db.active_emergency_id || undefined,
    eta: db.eta || 0,
    speed: db.speed || 0
  };
}

export function mapReactAmbulanceToDb(react: Ambulance): any {
  return {
    id: react.id,
    code: react.code,
    status: react.status,
    assigned_hospital: react.assignedHospital,
    crew: react.crew,
    location: react.location,
    active_emergency_id: react.activeEmergencyId || null,
    eta: react.eta,
    speed: react.speed
  };
}

// ==========================================
// 4. ICU BEDS MAPS
// ==========================================
export function mapDbBedToReact(db: any): IcuBed {
  return {
    id: db.id,
    name: db.name,
    occupied: db.occupied,
    patientId: db.patient_id || undefined,
    patientName: db.patient_name || undefined,
    ventilatorActive: db.ventilator_active,
    oxygenFlowLpm: Number(db.oxygen_flow_lpm) || 0,
    bedType: db.bed_type,
    riskLevel: db.risk_level || undefined
  };
}

export function mapReactBedToDb(react: IcuBed): any {
  return {
    id: react.id,
    name: react.name,
    occupied: react.occupied,
    patient_id: react.patientId || null,
    patient_name: react.patientName || null,
    ventilator_active: react.ventilatorActive,
    oxygen_flow_lpm: react.oxygenFlowLpm,
    bed_type: react.bedType,
    risk_level: react.riskLevel || null
  };
}

// ==========================================
// 5. DOCTORS MAPS
// ==========================================
export function mapDbDoctorToReact(db: any): Doctor {
  return {
    id: db.id,
    name: db.name,
    specialty: db.specialty,
    status: db.status,
    activePatients: db.active_patients || 0
  };
}

export function mapReactDoctorToDb(react: Doctor): any {
  return {
    id: react.id,
    name: react.name,
    specialty: react.specialty,
    status: react.status,
    active_patients: react.activePatients
  };
}

// ==========================================
// 6. SYSTEM NOTIFICATIONS MAPS
// ==========================================
export function mapDbNotificationToReact(db: any): SystemNotification {
  return {
    id: db.id,
    title: db.title,
    message: db.message,
    level: db.level,
    timestamp: db.timestamp,
    read: db.read
  };
}

export function mapReactNotificationToDb(react: SystemNotification): any {
  return {
    id: react.id,
    title: react.title,
    message: react.message,
    level: react.level,
    timestamp: react.timestamp,
    read: react.read
  };
}
