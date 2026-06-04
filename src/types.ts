/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type RiskLevel = 'Critical' | 'High Risk' | 'Medium Risk' | 'Stable';

export interface PatientVitals {
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  oxygenSat: number;
  temperature: number;
  bloodSugar: number;
}

export interface VitalHistoryEntry {
  time: string;
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  oxygenSat: number;
  bloodSugar: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  condition: string;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  department: string;
  vitals: PatientVitals;
  history: VitalHistoryEntry[];
  medications: { name: string; dosage: string; frequency: string; time: string }[];
  reports: { id: string; name: string; date: string; category: string; result: string }[];
  summary?: string;
  avatar: string;
}

export interface EmergencyCase {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  symptoms: string;
  severity: RiskLevel;
  reportedTime: string;
  etaMinutes?: number;
  ambulanceId?: string;
  status: 'Dispatched' | 'EnRoute' | 'Arrived' | 'Admitted';
  department: string;
}

export interface Ambulance {
  id: string;
  code: string;
  status: 'Available' | 'Dispatched' | 'EnRoute' | 'Returning';
  assignedHospital: string;
  crew: string[];
  location: string;
  activeEmergencyId?: string;
  eta: number; // minutes
  speed: number; // km/h
}

export interface IcuBed {
  id: string;
  name: string;
  occupied: boolean;
  patientId?: string;
  patientName?: string;
  ventilatorActive: boolean;
  oxygenFlowLpm: number;
  bedType: 'ICU' | 'CCU' | 'NICU' | 'Trauma';
  riskLevel?: RiskLevel;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: 'In Surgery' | 'On Call' | 'Active' | 'Offline';
  activePatients: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  level: 'info' | 'warning' | 'alert' | 'critical';
  timestamp: string;
  read: boolean;
}

export interface PredictionSnapshot {
  time: string;
  emergencyInflow: number;
  icuUtilizationPercent: number;
  ambulanceLoadPercent: number;
  riskFactor: number;
}

export type UserRole = 'Admin' | 'Doctor' | 'Nurse' | 'Receptionist' | 'Ambulance Operator';

export interface UserAccount {
  id: string;
  name: string;
  title: string;
  role: UserRole;
  avatar: string;
  department?: string;
  shift?: string;
}
