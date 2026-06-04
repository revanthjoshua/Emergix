/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Activity, 
  Flame, 
  Bed, 
  Truck, 
  Brain, 
  Bot, 
  LayoutDashboard,
  Sparkles,
  Zap,
  SlidersHorizontal,
  Stethoscope,
  CalendarDays,
  BarChart3,
  Bell,
  FileText,
  Settings,
  HelpCircle,
  Menu,
  X,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Patient, 
  EmergencyCase, 
  Ambulance, 
  IcuBed, 
  Doctor, 
  SystemNotification,
  RiskLevel,
  UserRole,
  UserAccount
} from './types';
import { 
  INITIAL_PATIENTS, 
  INITIAL_EMERGENCIES, 
  INITIAL_AMBULANCES, 
  INITIAL_ICU_BEDS, 
  INITIAL_DOCTORS, 
  INITIAL_NOTIFICATIONS,
  NEW_SIREN_ALERTS,
  SYSTEM_MESSAGES
} from './mockData';

import { supabase, isConfigured } from './lib/supabase';
import { 
  mapDbPatientToReact, 
  mapReactPatientToDb,
  mapDbEmergencyToReact,
  mapReactEmergencyToDb,
  mapDbAmbulanceToReact,
  mapReactAmbulanceToDb,
  mapDbBedToReact,
  mapReactBedToDb,
  mapDbDoctorToReact,
  mapReactDoctorToDb,
  mapDbNotificationToReact,
  mapReactNotificationToDb
} from './lib/typesMapper';

// Component Views
import SimulatorControl from './components/SimulatorControl';
import DashboardView from './components/DashboardView';
import EmergencyCommandCenterView from './components/EmergencyCommandCenterView';
import PatientManagerView from './components/PatientManagerView';
import IcuBedView from './components/IcuBedView';
import AmbulanceTrackerView from './components/AmbulanceTrackerView';
import AiTriageView from './components/AiTriageView';
import AiAssistantView from './components/AiAssistantView';

// Newly added Views
import DoctorManagementView from './components/DoctorManagementView';
import AppointmentsView from './components/AppointmentsView';
import AnalyticsView from './components/AnalyticsView';
import PredictionsInsightView from './components/PredictionsInsightView';
import NotificationsCenterView from './components/NotificationsCenterView';
import ReportsView from './components/ReportsView';
import SystemSettingsView from './components/SystemSettingsView';
import LoginView from './components/LoginView';
import GlobalJoshuaaWidget from './components/GlobalJoshuaaWidget';
import UserGuideView from './components/UserGuideView';
import LeadsContactsView from './components/LeadsContactsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isTabVisible = (tabId: string): boolean => {
    if (!currentUser) return false;
    if (tabId === 'guide') return true;
    const role = currentUser.role;
    if (role === 'Admin') return true;
    
    if (role === 'Doctor') {
      return ['dashboard', 'emergency', 'patients', 'ai-chat', 'notifications', 'leads'].includes(tabId);
    }
    if (role === 'Nurse') {
      return ['patients', 'icu', 'notifications', 'leads'].includes(tabId);
    }
    if (role === 'Receptionist') {
      return ['dashboard', 'appointments', 'notifications', 'leads'].includes(tabId);
    }
    if (role === 'Ambulance Operator') {
      return ['emergency', 'ambulance', 'notifications'].includes(tabId);
    }
    return false;
  };

  // Application-wide entities
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [emergencies, setEmergencies] = useState<EmergencyCase[]>(INITIAL_EMERGENCIES);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);
  const [icuBeds, setIcuBeds] = useState<IcuBed[]>(INITIAL_ICU_BEDS);
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [notifications, setNotifications] = useState<SystemNotification[]>(INITIAL_NOTIFICATIONS);
  const [logs, setLogs] = useState<string[]>([
    'Emergix mainframe core version 3.5.0 initialized.',
    'Continuous telemetry link secure on port 3000.',
    'Paramedic dispatch satellite synchronization approved.',
    'AI triage modules ready for symptom scoring.'
  ]);

  // Load data from Supabase if configured, otherwise fallback to local mock templates
  useEffect(() => {
    if (!isConfigured) {
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Offline Mode: Connect to Supabase using .env.example values.`,
        ...prev
      ]);
      return;
    }

    const syncInitialData = async () => {
      try {
        // Beds
        const { data: bedsData, error: bErr } = await supabase.from('icu_beds').select('*');
        if (bedsData && bedsData.length > 0) {
          setIcuBeds(bedsData.map(mapDbBedToReact));
        } else if (!bErr) {
          await supabase.from('icu_beds').insert(INITIAL_ICU_BEDS.map(mapReactBedToDb));
        }

        // Patients
        const { data: patData, error: pErr } = await supabase.from('patients').select('*');
        if (patData && patData.length > 0) {
          setPatients(patData.map(mapDbPatientToReact));
        } else if (!pErr) {
          await supabase.from('patients').insert(INITIAL_PATIENTS.map(mapReactPatientToDb));
        }

        // Emergencies
        const { data: emgData, error: eErr } = await supabase.from('emergency_cases').select('*');
        if (emgData && emgData.length > 0) {
          setEmergencies(emgData.map(mapDbEmergencyToReact));
        } else if (!eErr) {
          await supabase.from('emergency_cases').insert(INITIAL_EMERGENCIES.map(mapReactEmergencyToDb));
        }

        // Ambulances
        const { data: ambData, error: aErr } = await supabase.from('ambulances').select('*');
        if (ambData && ambData.length > 0) {
          setAmbulances(ambData.map(mapDbAmbulanceToReact));
        } else if (!aErr) {
          await supabase.from('ambulances').insert(INITIAL_AMBULANCES.map(mapReactAmbulanceToDb));
        }

        // Doctors
        const { data: docData, error: dErr } = await supabase.from('doctors').select('*');
        if (docData && docData.length > 0) {
          setDoctors(docData.map(mapDbDoctorToReact));
        } else if (!dErr) {
          await supabase.from('doctors').insert(INITIAL_DOCTORS.map(mapReactDoctorToDb));
        }

        // Notifications
        const { data: ntfData, error: nErr } = await supabase.from('notifications').select('*');
        if (ntfData && ntfData.length > 0) {
          setNotifications(ntfData.map(mapDbNotificationToReact));
        } else if (!nErr) {
          await supabase.from('notifications').insert(INITIAL_NOTIFICATIONS.map(mapReactNotificationToDb));
        }

        setLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] DATABASE CONNECTION: Loaded telemetry sync from Supabase.`,
          ...prev
        ]);
      } catch (err) {
        console.error("Supabase load error:", err);
      }
    };

    syncInitialData();
  }, []);

  // Non-blocking writes helper to push state variables to Supabase collections on client update
  const pushPatientToSupabase = async (patient: Patient) => {
    if (!isConfigured) return;
    await supabase.from('patients').upsert(mapReactPatientToDb(patient));
  };

  const pushEmergencyToSupabase = async (emergency: EmergencyCase) => {
    if (!isConfigured) return;
    await supabase.from('emergency_cases').upsert(mapReactEmergencyToDb(emergency));
  };

  const pushAmbulanceToSupabase = async (ambulance: Ambulance) => {
    if (!isConfigured) return;
    await supabase.from('ambulances').upsert(mapReactAmbulanceToDb(ambulance));
  };

  const pushBedToSupabase = async (bed: IcuBed) => {
    if (!isConfigured) return;
    await supabase.from('icu_beds').upsert(mapReactBedToDb(bed));
  };

  const pushDoctorToSupabase = async (doctor: Doctor) => {
    if (!isConfigured) return;
    await supabase.from('doctors').upsert(mapReactDoctorToDb(doctor));
  };

  const pushNotificationToSupabase = async (notif: SystemNotification) => {
    if (!isConfigured) return;
    await supabase.from('notifications').upsert(mapReactNotificationToDb(notif));
  };

  // Simulation Controls state
  const [isSimulating, setIsSimulating] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(5); // interval in seconds

  // AI load prediction center state (central caching)
  const [aiPrediction, setAiPrediction] = useState({
    bottleneckWarning: 'Status Nominal',
    recs: [
      'Pre-deploy trauma nurses to bypass triage intake lines.',
      'Reroute non-critical ambulances to sister facilities.'
    ] as string[],
    overflowRiskPercent: 42,
    summary: 'Clinical projections indicate standard workflow velocities with average emergency intake cycles.',
    loading: false
  });

  // Dynamic simulation ticker effect
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // 1. Randomly drift patients vitals (heart rate beat fluctuation, oxygen drift)
      setPatients((prevPatients) =>
        prevPatients.map((pat) => {
          const hrDelta = Math.floor(Math.random() * 7) - 3; // -3 to +3
          const oxygenDelta = Math.floor(Math.random() * 3) - 1; // -1 to +1

          const newHr = Math.min(180, Math.max(50, pat.vitals.heartRate + hrDelta));
          const newOxygen = Math.min(100, Math.max(75, pat.vitals.oxygenSat + oxygenDelta));

          // Also inject a historical timeline entry to make the Recharts wave live
          const timeNow = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });

          const nextHistory = [
            ...pat.history.slice(1),
            {
              time: timeNow,
              heartRate: newHr,
              bpSystolic: pat.vitals.bpSystolic,
              bpDiastolic: pat.vitals.bpDiastolic,
              oxygenSat: newOxygen,
              bloodSugar: pat.vitals.bloodSugar
            }
          ];

          return {
            ...pat,
            vitals: {
              ...pat.vitals,
              heartRate: newHr,
              oxygenSat: newOxygen
            },
            history: nextHistory
          };
        })
      );

      // 2. Reduce ETA of dispatched and returning ambulances
      setAmbulances((prevAmbs) =>
        prevAmbs.map((amb) => {
          if (amb.status === 'Available' || amb.eta <= 0) return amb;
          const nextEta = amb.eta - 1;

          // If ETA drops to zero, the ambulance arrives
          if (nextEta === 0) {
            const nextStatus = amb.status === 'EnRoute' ? 'Arrived' : 'Available';

            // Push a notification and log entry
            setLogs((prevLogs) => [
              `[${new Date().toLocaleTimeString()}] ${amb.code} arrived at destination site. Prepare reception.`,
              ...prevLogs.slice(0, 15)
            ]);

            // Update associated Emergency's status if any
            if (amb.status === 'EnRoute' && amb.activeEmergencyId) {
              setEmergencies((prevEmgs) =>
                prevEmgs.map((emg) =>
                  emg.id === amb.activeEmergencyId
                    ? { ...emg, status: 'Arrived' }
                    : emg
                )
              );

              // Add real-time urgent alert notification
              const arrivingCase = emergencies.find(e => e.id === amb.activeEmergencyId);
              const customNotif: SystemNotification = {
                id: `N-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
                title: `Ambulance Handover: ${amb.code}`,
                message: `Patient ${arrivingCase?.patientName || 'Emergency Casualty'} has arrived at Ingress Bay. Assign to beds.`,
                level: 'alert',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: false
              };
              setNotifications(prev => [customNotif, ...prev]);
            }

            return {
              ...amb,
              status: nextStatus,
              eta: 0,
              speed: 0,
              activeEmergencyId: nextStatus === 'Available' ? undefined : amb.activeEmergencyId
            };
          }

          return {
            ...amb,
            eta: nextEta
          };
        })
      );

      // 3. Keep updating live countdown etas on active emergencies queue
      setEmergencies((prevEmgs) =>
        prevEmgs.map((emg) => {
          if (emg.status === 'Admitted' || emg.status === 'Arrived') return emg;
          const parentAmb = ambulances.find((a) => a.id === emg.id);
          if (parentAmb && parentAmb.eta > 0) {
            return {
              ...emg,
              etaMinutes: parentAmb.eta
            };
          }
          return emg;
        })
      );

      // 4. Periodically insert standard telemetry monitoring logs (keeping things highly interactive)
      if (Math.random() > 0.6) {
        const randomMsg = SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)];
        setLogs((prev) => [
          `[${new Date().toLocaleTimeString()}] telemetry: ${randomMsg}`,
          ...prev.slice(0, 15)
        ]);
      }

    }, simulationSpeed * 1000);

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed, emergencies, ambulances]);

  // Command Action 1: Discharging/Releasing Bed
  const handleReleaseBed = (bedId: string) => {
    setIcuBeds((prevBeds) => {
      const updated = prevBeds.map((bed) =>
        bed.id === bedId
          ? { ...bed, occupied: false, patientId: undefined, patientName: undefined, ventilatorActive: false, oxygenFlowLpm: 0, riskLevel: undefined }
          : bed
      );
      const targetBed = updated.find(b => b.id === bedId);
      if (targetBed) pushBedToSupabase(targetBed);
      return updated;
    });
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] BED STATUS RELEASE: Station ${bedId} fully sanitized for incoming casualty.`,
      ...prev
    ]);
  };

  // Command Action 2: Allocating Bed manually
  const handleAllocateBed = (bedId: string, patientName: string, bedType: 'ICU' | 'CCU' | 'NICU' | 'Trauma') => {
    setIcuBeds((prevBeds) => {
      const updated = prevBeds.map((bed) =>
        bed.id === bedId
          ? { ...bed, occupied: true, patientName, ventilatorActive: false, oxygenFlowLpm: 2, bedType, riskLevel: 'Stable' as const }
          : bed
      );
      const targetBed = updated.find(b => b.id === bedId);
      if (targetBed) pushBedToSupabase(targetBed);
      return updated;
    });
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] BED RESERVED: Allocated ${bedId} manually for patient ${patientName}.`,
      ...prev
    ]);
  };

  // Command Action 3: Adjusting Ventilator state
  const handleToggleVentilator = (bedId: string) => {
    setIcuBeds((prevBeds) => {
      const updated = prevBeds.map((bed) => {
        if (bed.id !== bedId) return bed;
        const nextVentilator = !bed.ventilatorActive;
        return {
          ...bed,
          ventilatorActive: nextVentilator,
          oxygenFlowLpm: nextVentilator ? 12 : 2
        };
      });
      const targetBed = updated.find(b => b.id === bedId);
      if (targetBed) pushBedToSupabase(targetBed);
      return updated;
    });
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] VENTILATOR SWITCH [${bedId}]: Oxygen line configured to ${icuBeds.find(b => b.id === bedId)?.ventilatorActive ? '2 LPM' : '12 LPM (Critical Press)'}.`,
      ...prev
    ]);
  };

  // Command Action 4: Handover Admission of active emergency patient posts arrival
  const handleAdmitEmergencyPatient = (emergencyId: string, bedId: string) => {
    const activeEmgCase = emergencies.find((e) => e.id === emergencyId);
    if (!activeEmgCase) return;

    // Allocate the ICU bed
    setIcuBeds((prevBeds) => {
      const updated = prevBeds.map((bed) =>
        bed.id === bedId
          ? {
              ...bed,
              occupied: true,
              patientName: activeEmgCase.patientName,
              ventilatorActive: activeEmgCase.severity === 'Critical',
              oxygenFlowLpm: activeEmgCase.severity === 'Critical' ? 15 : 4,
              riskLevel: activeEmgCase.severity
            }
          : bed
      );
      const targetBed = updated.find(b => b.id === bedId);
      if (targetBed) pushBedToSupabase(targetBed);
      return updated;
    });

    // Create a new digital twin patient profile
    const newPatientProfile: Patient = {
      id: `P-${Math.floor(Math.random() * 800) + 200}`,
      name: activeEmgCase.patientName,
      age: activeEmgCase.age,
      gender: activeEmgCase.gender,
      bloodType: 'O+',
      condition: activeEmgCase.symptoms,
      riskScore: activeEmgCase.severity === 'Critical' ? 95 : activeEmgCase.severity === 'High Risk' ? 82 : 55,
      riskLevel: activeEmgCase.severity,
      department: activeEmgCase.department,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      vitals: {
        heartRate: activeEmgCase.severity === 'Critical' ? 122 : 98,
        bpSystolic: activeEmgCase.severity === 'Critical' ? 165 : 125,
        bpDiastolic: activeEmgCase.severity === 'Critical' ? 104 : 78,
        oxygenSat: activeEmgCase.severity === 'Critical' ? 88 : 96,
        temperature: 37.4,
        bloodSugar: 140
      },
      history: [
        { time: '17:45', heartRate: 98, bpSystolic: 125, oxygenSat: 96, bloodSugar: 140, bpDiastolic: 78 },
        { time: '18:00', heartRate: 110, bpSystolic: 145, oxygenSat: 92, bloodSugar: 140, bpDiastolic: 88 }
      ],
      medications: [
        { name: 'Humidified Oxygen', dosage: '4 L/min', frequency: 'Continuous', time: '18:02' }
      ],
      reports: [
        { id: 'R-901', name: 'Rapid Trauma Sieve Ultrasound', date: '2026-06-01', category: 'Ultrasound', result: 'Completed. Stabilizing bed transfer notes.' }
      ]
    };

    setPatients((prev) => {
      const updated = [newPatientProfile, ...prev];
      pushPatientToSupabase(newPatientProfile);
      return updated;
    });

    // Mark the emergency case status as Admitted
    setEmergencies((prev) => {
      const updated = prev.map((e) => (e.id === emergencyId ? { ...e, status: 'Admitted' as const } : e));
      const targetEmg = updated.find(e => e.id === emergencyId);
      if (targetEmg) pushEmergencyToSupabase(targetEmg);
      return updated;
    });

    // Liberate/Free up the ambulance
    setAmbulances((prev) => {
      const updated = prev.map((amb) =>
        amb.activeEmergencyId === emergencyId
          ? { ...amb, status: 'Available' as const, activeEmergencyId: undefined, eta: 0, speed: 0 }
          : amb
      );
      const targetAmb = updated.find(a => a.id === activeEmgCase.ambulanceId);
      if (targetAmb) pushAmbulanceToSupabase(targetAmb);
      return updated;
    });

    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] CLINICAL ADMISSION COMPLETE: ${activeEmgCase.patientName} assigned to ICU station ${bedId}.`,
      ...prev
    ]);
  };

  // Command Action 5: Satellite dispatching of manual ambulances
  const handleDispatchAmbulance = (
    ambulanceId: string, 
    patientName: string, 
    symptoms: string, 
    severity: RiskLevel
  ) => {
    const emgId = `EMG-${Math.floor(Math.random() * 9000) + 1000}`;

    const newEmg: EmergencyCase = {
      id: emgId,
      patientName,
      age: 44,
      gender: 'Male',
      symptoms,
      severity,
      reportedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      etaMinutes: 6,
      ambulanceId,
      status: 'EnRoute',
      department: 'Trauma Surgery'
    };

    setEmergencies((prev) => {
      const updated = [newEmg, ...prev];
      pushEmergencyToSupabase(newEmg);
      return updated;
    });

    setAmbulances((prev) => {
      const updated = prev.map((amb) =>
        amb.id === ambulanceId
          ? {
              ...amb,
              status: 'EnRoute' as const,
              activeEmergencyId: emgId,
              eta: 6,
              speed: 95
            }
          : amb
      );
      const targetAmb = updated.find(a => a.id === ambulanceId);
      if (targetAmb) pushAmbulanceToSupabase(targetAmb);
      return updated;
    });

    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] SATELLITE DISPATCH TRANSMIT: Dispatching unit ${ambulanceId} to recover ${patientName}. Severity: ${severity}.`,
      ...prev
    ]);
  };

  // Command Actions 6-7: Manual slider trackers on ambulance routes
  const handleUpdateAmbulanceEta = (ambId: string, value: number) => {
    setAmbulances((prev) => {
      const updated = prev.map((a) => (a.id === ambId ? { ...a, eta: value } : a));
      const targetAmb = updated.find(a => a.id === ambId);
      if (targetAmb) pushAmbulanceToSupabase(targetAmb);
      return updated;
    });
  };

  const handleUpdateAmbulanceSpeed = (ambId: string, value: number) => {
    setAmbulances((prev) => {
      const updated = prev.map((a) => (a.id === ambId ? { ...a, speed: value } : a));
      const targetAmb = updated.find(a => a.id === ambId);
      if (targetAmb) pushAmbulanceToSupabase(targetAmb);
      return updated;
    });
  };

  // Command Action 8: Sliders editing patient digital twins
  const handleUpdatePatientVitals = (patientId: string, updatedVitals: any) => {
    setPatients(prev => {
      const updated = prev.map(p => {
        if (p.id !== patientId) return p;
        return {
          ...p,
          vitals: updatedVitals
        };
      });
      const targetPat = updated.find(p => p.id === patientId);
      if (targetPat) pushPatientToSupabase(targetPat);
      return updated;
    });
  };

  const handleUpdatePatientDetails = (patientId: string, updatedFields: Partial<Patient>) => {
    setPatients(prev => {
      const updated = prev.map(p => p.id === patientId ? { ...p, ...updatedFields } : p);
      const targetPat = updated.find(p => p.id === patientId);
      if (targetPat) pushPatientToSupabase(targetPat);
      return updated;
    });
  };

  // CRM Simulation Event 1: Trigger an immediate high-siren Emergency case
  const handleInjectEmergency = () => {
    const randomCase = NEW_SIREN_ALERTS[Math.floor(Math.random() * NEW_SIREN_ALERTS.length)];
    const availableAmb = ambulances.find(a => a.status === 'Available');

    if (!availableAmb) {
      alert("All vehicles are active. Pause simulation or scale back to free an ambulance bay.");
      return;
    }

    const emgId = `EMG-${Math.floor(Math.random() * 9000) + 1000}`;
    const newEmg: EmergencyCase = {
      id: emgId,
      patientName: randomCase.name,
      age: randomCase.age,
      gender: randomCase.gender,
      symptoms: randomCase.symptoms,
      severity: randomCase.severity as any,
      reportedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      etaMinutes: 4,
      ambulanceId: availableAmb.id,
      status: 'EnRoute',
      department: randomCase.department
    };

    setEmergencies((prev) => {
      const updated = [newEmg, ...prev];
      pushEmergencyToSupabase(newEmg);
      return updated;
    });
    setAmbulances((prev) => {
      const updated = prev.map((amb) =>
        amb.id === availableAmb.id
          ? {
              ...amb,
              status: 'EnRoute' as const,
              activeEmergencyId: emgId,
              eta: 4,
              speed: 110,
              location: 'Sector 5 Outbound Highway'
            }
          : amb
      );
      const targetAmb = updated.find(a => a.id === availableAmb.id);
      if (targetAmb) pushAmbulanceToSupabase(targetAmb);
      return updated;
    });

    // Push audio/visual notice
    const sirenNotif: SystemNotification = {
      id: `N-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      title: `🚨 HIGH SIREN SIGNAL ALERT`,
      message: `Critically unstable presentation incoming: ${randomCase.name} - ${randomCase.symptoms}. Assigned ${availableAmb.code}.`,
      level: 'critical',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setNotifications(prev => {
      const updated = [sirenNotif, ...prev];
      pushNotificationToSupabase(sirenNotif);
      return updated;
    });
    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] SIREN WARNING: Urgent dispatch code red activated for ${randomCase.name} (${randomCase.department}).`,
      ...prev
    ]);
  };

  // CRM Simulation Event 2: Trigger urgent heart rate / oxygen saturation decay crisis
  const handleTriggerVitalsAnomaly = () => {
    // Select first patient and drop their vitals
    setPatients((prev) => {
      const copy = [...prev];
      if (copy[0]) {
        copy[0] = {
          ...copy[0],
          vitals: {
            ...copy[0].vitals,
            heartRate: 145,
            oxygenSat: 84
          },
          riskLevel: 'Critical'
        };
        pushPatientToSupabase(copy[0]);

        const alertNotif: SystemNotification = {
          id: `N-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          title: `💥 CRITICAL ANOMALY ALERT`,
          message: `Cardiac collapse telemetry trigger detected for ${copy[0].name} (ICU Station BED-01). oxygen drop (84%)!`,
          level: 'critical',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        };
        setNotifications((prevN) => {
          const updated = [alertNotif, ...prevN];
          pushNotificationToSupabase(alertNotif);
          return updated;
        });
      }
      return copy;
    });

    setLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] CRISIS TRIGGERED: Severe acute decay injected on ICU Bed 01 monitors!`,
      ...prev
    ]);
  };

  // AI Service 1: Call Express backend to get predictive load waves
  const runAILoadPrediction = async () => {
    setAiPrediction(prev => ({ ...prev, loading: true }));
    try {
      const activeEmergenciesCount = emergencies.filter(e => e.status !== 'Admitted').length;
      const occupiedBedCount = icuBeds.filter(b => b.occupied).length;
      const occupiedPercent = Math.round((occupiedBedCount / icuBeds.length) * 100);

      const res = await fetch('/api/ai/predict-load', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emergencyInflow: activeEmergenciesCount,
          icuUtilization: occupiedPercent,
          ambulanceLoad: Math.round((ambulances.filter(a => a.status !== 'Available').length / ambulances.length) * 100),
          lastIncidents: logs.slice(0, 3)
        })
      });

      const data = await res.json();
      setAiPrediction({
        bottleneckWarning: data.bottleneckWarning || 'High Flow Backlog Warnings',
        recs: data.recs || [
          'Pre-deploy critical cardiology teams to Emergency ward ingress portals.',
          'Optimize doctor rosters to prepare for overlapping high-tension clinical cycles.'
        ],
        overflowRiskPercent: data.overflowRiskPercent || 68,
        summary: data.summary || 'AI analytical telemetry anticipates localized clinical saturation near peak evening shift rosters.',
        loading: false
      });
    } catch (err) {
      console.error(err);
      setAiPrediction(prev => ({ ...prev, loading: false }));
    }
  };

  // AI Service 2: Generate Clinical patient medical summary on-demand
  const generateAICaseSummary = async (patient: Patient) => {
    try {
      const res = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          symptoms: `Patient's diagnosis is ${patient.condition}. Current vital details display: heart rate of ${patient.vitals.heartRate} bpm, spO2 of ${patient.vitals.oxygenSat}%, core temp of ${patient.vitals.temperature}C. Recent diagnostic files read: "${JSON.stringify(patient.reports)}" and medication is "${JSON.stringify(patient.medications)}". Provide a comprehensive assessment overview.`
        })
      });

      const data = await res.json();
      return `${data.assessmentSummary}\n\n**PROBABLE UNIT:** ${data.probableDepartment}\n**RECOMMENDED DIRECTIVES:**\n${data.recs.map((r: string, i: number) => `${i+1}. ${r}`).join('\n')}`;
    } catch (err) {
      console.error(err);
      return "AI operational interface timed out. Confirm neural key credentials in secrets tab.";
    }
  };

  if (!currentUser) {
    return <LoginView onLogin={(user) => {
      setCurrentUser(user);
      const targetTab = localStorage.getItem('emergix_session_tab') || 'dashboard';
      setActiveTab(targetTab);
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased">
      
      {/* Top Main Command Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        
        {/* Brand identity */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2.5 rounded-xl shadow-md shadow-teal-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-extrabold tracking-tight text-slate-950">Emergix</h1>
                <span className="text-[10px] bg-teal-50 border border-teal-200 text-teal-600 font-mono py-0.5 px-2 rounded-full uppercase tracking-wider font-bold animate-pulse">
                  SMART EMERGENCY CRM
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">NEURAL OPERATING CLINICAL SUITE v3.5</p>
            </div>
          </div>

          {/* Hamburger Mobile/Tablet Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl transition-all"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Global indicator panel */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2 py-1.5 rounded-xl shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> GPS FLEET: SYNCED
            </span>
            <span className="flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2 py-1.5 rounded-xl shadow-sm">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span> AI COGNITION: ONLINE
            </span>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1.5 px-2.5 rounded-xl shadow-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-bold uppercase text-[9px]">MODE:</span>
            <strong className="text-teal-600 uppercase text-[9px]">DEMO READY</strong>
          </div>

          {/* Connected User Account Segment */}
          {currentUser && (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-slate-100" 
                referrerPolicy="no-referrer"
              />
              <div className="text-left hidden md:block">
                <div className="text-[11px] font-extrabold text-slate-800 leading-none flex items-center gap-1">
                  {currentUser.name}
                  <span className="text-[8px] bg-teal-50 border border-teal-200 text-teal-700 px-1.5 py-0.2 rounded-md font-mono font-bold uppercase">{currentUser.role}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono tracking-wider">{currentUser.title} &bull; {currentUser.department}</span>
              </div>
              <button 
                onClick={() => setCurrentUser(null)}
                className="ml-1.5 text-[9px] bg-red-50 hover:bg-red-100 text-red-650 font-bold font-mono py-1 px-2.5 rounded-lg border border-red-200/60 shadow-sm hover:scale-105 transition-all text-red-700"
                title="End Active Session"
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>

      </header>

      {/* Main Structural Area */}
      <div className="flex-1 flex flex-col lg:flex-row">
        
        {/* Left Column: Command Tab navigation & Ticker Controller (Desktop Pane) */}
        <aside className="w-80 border-r border-slate-200 bg-white p-6 hidden lg:flex flex-col justify-between shrink-0 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
          
          {/* Main Module Tabs navigation */}
          <div className="space-y-4">
            
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">
                OPERATIONAL MONITORS
              </span>
              <nav className="space-y-1">
                {[
                  { id: 'dashboard', label: 'Command Hub Home', icon: LayoutDashboard },
                  { id: 'emergency', label: 'Triage Handover', icon: Flame },
                  { id: 'patients', label: 'Digital Health Twins', icon: Activity },
                  { id: 'icu', label: 'ICU Beds Matrix', icon: Bed },
                  { id: 'ambulance', label: 'Ambulance Radar', icon: Truck },
                ].filter(tab => isTabVisible(tab.id)).map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-xs font-sans font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-teal-50 border-r-4 border-teal-600 text-teal-800 font-extrabold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-900" />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">
                CLINICAL ROSTERS
              </span>
              <nav className="space-y-1">
                {[
                  { id: 'doctors', label: 'Physicians Command', icon: Stethoscope },
                  { id: 'appointments', label: 'Clinic Appointments', icon: CalendarDays },
                  { id: 'leads', label: 'Leads & Contacts', icon: Users },
                ].filter(tab => isTabVisible(tab.id)).map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-xs font-sans font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-amber-50 border-r-4 border-amber-600 text-amber-900 font-extrabold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 shrink-0 text-slate-400" />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">
                CLINICAL COGNITION (AI)
              </span>
              <nav className="space-y-1">
                {[
                  { id: 'ai-triage', label: 'Symptom Triage', icon: Brain },
                  { id: 'ai-chat', label: 'AI Operations Advisor', icon: Bot },
                  { id: 'predictions', label: 'AI Surge Analytics', icon: Sparkles },
                ].filter(tab => isTabVisible(tab.id)).map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-xs font-sans font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 border-r-4 border-indigo-600 text-indigo-900 font-extrabold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 shrink-0 text-slate-400" />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">
                INTEL & ADMINISTRATION
              </span>
              <nav className="space-y-1">
                {[
                  { id: 'analytics', label: 'Workflow Graphs', icon: BarChart3 },
                  { id: 'notifications', label: 'System Logs', icon: Bell },
                  { id: 'reports', label: 'Archives & Reports', icon: FileText },
                  { id: 'settings', label: 'Config Center', icon: Settings },
                ].filter(tab => isTabVisible(tab.id)).map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-xs font-sans font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-slate-100 border-r-4 border-slate-700 text-slate-900 font-extrabold'
                          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComp className="w-4 h-4 shrink-0 text-slate-400" />
                        <span>{tab.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest block font-bold">
                SYSTEM INSTRUCTIONS
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('guide');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-xs font-sans font-bold py-2.5 px-3.5 rounded-xl transition-all ${
                    activeTab === 'guide'
                      ? 'bg-emerald-50 border-r-4 border-emerald-600 text-emerald-800 font-extrabold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>Operating Manual & Guide</span>
                  </div>
                </button>
              </nav>
            </div>

          </div>

          {/* Floating simulator control module inside column */}
          <SimulatorControl
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(!isSimulating)}
            onInjectEmergency={handleInjectEmergency}
            onTriggerVitalsAnomaly={handleTriggerVitalsAnomaly}
            speed={simulationSpeed}
            onSpeedChange={(s) => setSimulationSpeed(s)}
          />

        </aside>

        {/* Mobile Navigation Dropdown Drawer Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden w-full bg-white border-b border-slate-200 shadow-md p-5 flex flex-col space-y-4 z-30"
            >
              <div className="grid grid-cols-2 gap-4 pb-2">
                <div>
                  <span className="text-[9px] text-slate-405 text-slate-400 font-mono uppercase tracking-wider block mb-1.5 font-bold">MONITORS</span>
                  <div className="space-y-1">
                    {[
                      { id: 'dashboard', label: 'Command Hub' },
                      { id: 'emergency', label: 'Triage' },
                      { id: 'patients', label: 'Health Twins' },
                      { id: 'icu', label: 'ICU Beds' },
                      { id: 'ambulance', label: 'Ambulance radar' },
                    ].filter(tab => isTabVisible(tab.id)).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left text-xs font-bold py-1.5 px-2 rounded-lg transition-all ${
                          activeTab === tab.id ? 'bg-teal-50 text-teal-800' : 'text-slate-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[9px] text-slate-450 text-slate-400 font-mono uppercase tracking-wider block mb-1.5 font-bold">ROSTERS & AI</span>
                  <div className="space-y-1">
                    {[
                      { id: 'doctors', label: 'Physicians' },
                      { id: 'appointments', label: 'Appointments' },
                      { id: 'leads', label: 'Leads & Contacts' },
                      { id: 'ai-triage', label: 'AI Triage' },
                      { id: 'ai-chat', label: 'AI Operations Advisor' },
                      { id: 'predictions', label: 'Surge Predict' },
                      { id: 'guide', label: 'Operating Manual & Guide' },
                    ].filter(tab => isTabVisible(tab.id)).map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left text-xs font-bold py-1.5 px-2 rounded-lg transition-all ${
                          activeTab === tab.id ? 'bg-amber-50 text-amber-900 border-l border-amber-500' : 'text-slate-600'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Compact Auto-Simulator Controller in Mobile view */}
              <div className="border-t border-slate-100 pt-3">
                <SimulatorControl
                  isSimulating={isSimulating}
                  onToggleSimulation={() => setIsSimulating(!isSimulating)}
                  onInjectEmergency={handleInjectEmergency}
                  onTriggerVitalsAnomaly={handleTriggerVitalsAnomaly}
                  speed={simulationSpeed}
                  onSpeedChange={(s) => setSimulationSpeed(s)}
                />
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Display area rendering views */}
        <main className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-80px)] bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.23 }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  patients={patients}
                  emergencies={emergencies}
                  ambulances={ambulances}
                  icuBeds={icuBeds}
                  doctors={doctors}
                  notifications={notifications}
                  logs={logs}
                  onNavigateToTab={(t) => setActiveTab(t)}
                  onRunAIPrediction={runAILoadPrediction}
                  aiPrediction={aiPrediction}
                />
              )}

              {activeTab === 'emergency' && (
                <EmergencyCommandCenterView
                  emergencies={emergencies}
                  ambulances={ambulances}
                  doctors={doctors}
                  icuBeds={icuBeds}
                  onAdmitPatient={handleAdmitEmergencyPatient}
                  onDispatchAmbulance={handleDispatchAmbulance}
                  onUpdateEmergencies={setEmergencies}
                />
              )}

              {activeTab === 'patients' && (
                <PatientManagerView
                  patients={patients}
                  onUpdatePatientVitals={handleUpdatePatientVitals}
                  onGenerateAISummary={generateAICaseSummary}
                  onUpdatePatientDetails={handleUpdatePatientDetails}
                />
              )}

              {activeTab === 'icu' && (
                <IcuBedView
                  beds={icuBeds}
                  patients={patients}
                  onReleaseBed={handleReleaseBed}
                  onAllocateBed={handleAllocateBed}
                  onToggleVentilator={handleToggleVentilator}
                  onUpdateBeds={setIcuBeds}
                />
              )}

              {activeTab === 'ambulance' && (
                <AmbulanceTrackerView
                  ambulances={ambulances}
                  emergencies={emergencies}
                  onUpdateAmbulanceEta={handleUpdateAmbulanceEta}
                  onUpdateAmbulanceSpeed={handleUpdateAmbulanceSpeed}
                  onUpdateAmbulances={setAmbulances}
                />
              )}

              {activeTab === 'doctors' && (
                <DoctorManagementView 
                  doctors={doctors} 
                  onUpdateDoctors={setDoctors}
                />
              )}

              {activeTab === 'appointments' && (
                <AppointmentsView />
              )}

              {activeTab === 'leads' && (
                <LeadsContactsView patients={patients} />
              )}

              {activeTab === 'ai-triage' && (
                <AiTriageView />
              )}

              {activeTab === 'ai-chat' && (
                <AiAssistantView />
              )}

              {activeTab === 'predictions' && (
                <PredictionsInsightView 
                  onRunAIPrediction={runAILoadPrediction}
                  aiPrediction={aiPrediction}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView />
              )}

              {activeTab === 'notifications' && (
                <NotificationsCenterView 
                  notifications={notifications}
                  logs={logs}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView />
              )}

              {activeTab === 'settings' && (
                <SystemSettingsView />
              )}

              {activeTab === 'guide' && (
                <UserGuideView />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

      </div>
      <GlobalJoshuaaWidget />
    </div>
  );
}
