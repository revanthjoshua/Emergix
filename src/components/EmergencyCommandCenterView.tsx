/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Flame, 
  MapPin, 
  UserPlus, 
  Clock, 
  Activity, 
  Search, 
  Compass, 
  Navigation,
  CheckCircle,
  Stethoscope,
  Radio,
  BedDouble,
  Edit,
  Check,
  X,
  Info
} from 'lucide-react';
import { EmergencyCase, Ambulance, IcuBed, Doctor, RiskLevel } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface EmergencyCommandCenterViewProps {
  emergencies: EmergencyCase[];
  ambulances: Ambulance[];
  doctors: Doctor[];
  icuBeds: IcuBed[];
  onAdmitPatient: (emergencyId: string, bedId: string) => void;
  onDispatchAmbulance: (ambulanceId: string, patientName: string, symptoms: string, severity: RiskLevel) => void;
  onUpdateEmergencies?: (newEmg: EmergencyCase[]) => void;
}

export default function EmergencyCommandCenterView({
  emergencies,
  ambulances,
  doctors,
  icuBeds,
  onAdmitPatient,
  onDispatchAmbulance,
  onUpdateEmergencies
}: EmergencyCommandCenterViewProps) {
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyCase | null>(null);
  const [admitDrawerOpen, setAdmitDrawerOpen] = useState(false);
  const [dispatchFormOpen, setDispatchFormOpen] = useState(false);

  // Dispatch fields
  const [patientName, setPatientName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<RiskLevel>('High Risk');

  // Emergency local edit state
  const [editingEmgId, setEditingEmgId] = useState<string | null>(null);
  const [editPatName, setEditPatName] = useState('');
  const [editAge, setEditAge] = useState(30);
  const [editGender, setEditGender] = useState('Male');
  const [editSymptoms, setEditSymptoms] = useState('');
  const [editSeverity, setEditSeverity] = useState<RiskLevel>('High Risk');
  const [editStatus, setEditStatus] = useState<EmergencyCase['status']>('Dispatched');
  const [editEta, setEditEta] = useState(10);

  const startEditEmg = (emg: EmergencyCase) => {
    setEditingEmgId(emg.id);
    setEditPatName(emg.patientName);
    setEditAge(emg.age);
    setEditGender(emg.gender);
    setEditSymptoms(emg.symptoms);
    setEditSeverity(emg.severity);
    setEditStatus(emg.status);
    setEditEta(emg.etaMinutes || 10);
  };

  const saveEditEmg = () => {
    if (!editingEmgId) return;
    const updated = emergencies.map(e => {
      if (e.id === editingEmgId) {
        return {
          ...e,
          patientName: editPatName,
          age: Number(editAge),
          gender: editGender,
          symptoms: editSymptoms,
          severity: editSeverity,
          status: editStatus,
          etaMinutes: Number(editEta)
        };
      }
      return e;
    });
    if (onUpdateEmergencies) {
      onUpdateEmergencies(updated);
    }
    setEditingEmgId(null);
  };

  // Handover bed index
  const [selectedBedId, setSelectedBedId] = useState('');

  const freeBeds = icuBeds.filter(b => !b.occupied);
  const availableAmbulances = ambulances.filter(a => a.status === 'Available');

  const handleStartAdmit = (emg: EmergencyCase) => {
    setSelectedEmergency(emg);
    if (freeBeds.length > 0) {
      setSelectedBedId(freeBeds[0].id);
    }
    setAdmitDrawerOpen(true);
  };

  const handleConfirmAdmit = () => {
    if (selectedEmergency && selectedBedId) {
      onAdmitPatient(selectedEmergency.id, selectedBedId);
      setAdmitDrawerOpen(false);
      setSelectedEmergency(null);
    }
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !symptoms) return;
    
    const amb = availableAmbulances[0];
    if (amb) {
      onDispatchAmbulance(amb.id, patientName, symptoms, severity);
      // Reset
      setPatientName('');
      setSymptoms('');
      setSeverity('High Risk');
      setDispatchFormOpen(false);
    } else {
      alert("No ambulances are currently stationary in bays! Wait for them to return or pause simulation.");
    }
  };

  return (
    <div id="command-center-tab-view" className="space-y-6">
      
      {/* Page Instruction Guide */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs text-slate-600">
          <h4 className="font-extrabold text-emerald-800 font-mono uppercase tracking-wider flex items-center gap-1">
            🚨 SIREN DISPATCH & ADMIT WORKFLOW NOTES
          </h4>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 font-sans">
            <li><strong>Manual Dispatch</strong>: Click the red <strong>"Manual Dispatch Directive"</strong> button. Enter patient credentials and emergency triage symptoms to dispatch an available ambulance vehicle immediately.</li>
            <li><strong>Interactive Edits</strong>: Click the pencil (✏️) icon next to any incoming emergency patient row to change active parameters (patient name, age, symptoms, or ETA minutes).</li>
            <li><strong>Ward Handovers</strong>: Once an ambulance arrives at the hospital (ETA = 0), click the green <strong>"Admit to Bed"</strong> button in the listings to instantly transfer the patient digital twin to an open ICU bed station.</li>
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Dispatch queue */}
        <div id="active-emergencies-panel" className="xl:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                  <Flame className="w-4.5 h-4.5 text-red-500 heart-pulse" />
                  Siren Dispatch & Active Handover Queue
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Real-time inbound telemetry coordinates and clinical actions</p>
              </div>
              <button
                id="btn-dispatch-form-toggle"
                onClick={() => setDispatchFormOpen(!dispatchFormOpen)}
                className="py-2 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-sans text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                MANUAL DISPATCH DIRECTIVE
              </button>
            </div>

            {/* Manual Dispatch Form Overlay */}
            <AnimatePresence>
              {dispatchFormOpen && (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleDispatch}
                  className="mb-4 bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-4 font-mono text-xs text-slate-700 shadow-inner"
                >
                  <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-1">
                    🚨 SATELLITE DISPATCH DIRECTIVE
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 block mb-1 font-bold">PATIENT FULL NAME:</label>
                      <input 
                        required 
                        type="text" 
                        value={patientName} 
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="John Smith" 
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-red-500/60 font-sans"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 block mb-1 font-bold">TRIAGE PRIORITY CLASS:</label>
                      <select 
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value as any)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-805 outline-none focus:border-red-500/60 font-sans text-xs"
                      >
                        <option value="Critical">Critical (Immediate Code Red)</option>
                        <option value="High Risk">High Risk (Code Orange)</option>
                        <option value="Medium Risk">Medium Risk (Code Yellow)</option>
                        <option value="Stable">Stable Clinic Work Flow</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 block mb-1 font-bold">PRESENTED SYMPTOMS & HISTORY:</label>
                    <textarea 
                      required 
                      value={symptoms} 
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Crushing pressure in left breast radiating downward..." 
                      className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 h-16 outline-none resize-none focus:border-red-500/60 font-sans text-xs"
                    />
                  </div>

                  <div className="flex gap-2 justify-end font-sans">
                    <button 
                      type="button" 
                      onClick={() => setDispatchFormOpen(false)}
                      className="px-3.5 py-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-500 font-bold text-xs"
                    >
                      ABORT
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold text-xs"
                    >
                      TRANSMIT MISSION ({availableAmbulances.length > 0 ? availableAmbulances[0].code : 'No Free Vehicle'})
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {/* Help tip helper */}
              <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-3 text-xs text-slate-650 text-slate-600 flex items-start gap-2">
                <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-teal-850">Help Tip:</span> Dispatch staff can click <strong className="text-teal-700">"Edit Mission Details"</strong> directly within each active emergency panel card below to change age/sex, symptoms, severity, and transit status.
                </div>
              </div>

              {emergencies.map((emg) => {
                const isArrived = emg.status === 'Arrived';
                const isAdmitted = emg.status === 'Admitted';
                const parentAmb = ambulances.find(a => a.id === emg.ambulanceId);
                const isEditing = editingEmgId === emg.id;

                if (isEditing) {
                  return (
                    <div key={emg.id} className="p-4 border rounded-2xl bg-white border-teal-400 ring-2 ring-teal-50 shadow-md space-y-3">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <span className="text-[10px] font-mono font-bold text-teal-600">MISSION ID: {emg.id}</span>
                        <span className="text-[8px] bg-teal-50 text-teal-700 font-mono py-0.5 px-2 rounded-full uppercase font-bold">MODE: COMMAND EDIT</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400 block">PATIENT NAME</label>
                          <input 
                            type="text" 
                            value={editPatName} 
                            onChange={(e) => setEditPatName(e.target.value)} 
                            className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-slate-400 block">AGE</label>
                            <input 
                              type="number" 
                              value={editAge} 
                              onChange={(e) => setEditAge(Number(e.target.value))} 
                              className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-slate-400 block">GENDER</label>
                            <select 
                              value={editGender} 
                              onChange={(e) => setEditGender(e.target.value)} 
                              className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                            >
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-bold text-slate-400 block">PRESENTED SYMPTOMS & HISTORY</label>
                        <input 
                          type="text" 
                          value={editSymptoms} 
                          onChange={(e) => setEditSymptoms(e.target.value)} 
                          className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400 block">SEVERITY PROTOCOL</label>
                          <select 
                            value={editSeverity} 
                            onChange={(e) => setEditSeverity(e.target.value as any)} 
                            className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                          >
                            <option value="Critical">Critical</option>
                            <option value="High Risk">High Risk</option>
                            <option value="Medium Risk">Medium Risk</option>
                            <option value="Stable">Stable</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400 block">DISPATCH STATUS</label>
                          <select 
                            value={editStatus} 
                            onChange={(e) => setEditStatus(e.target.value as any)} 
                            className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                          >
                            <option value="Dispatched">Dispatched</option>
                            <option value="EnRoute">EnRoute</option>
                            <option value="Arrived">Arrived</option>
                            <option value="Admitted">Admitted</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400 block">ETA TIME (MINS)</label>
                          <input 
                            type="number" 
                            value={editEta} 
                            onChange={(e) => setEditEta(Number(e.target.value))} 
                            className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                        <button 
                          onClick={() => setEditingEmgId(null)}
                          className="py-1.5 px-3.5 bg-slate-105 bg-slate-100 rounded-lg text-slate-600 text-[10px] uppercase font-bold hover:bg-slate-200 flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                        <button 
                          onClick={saveEditEmg}
                          className="py-1.5 px-3.5 bg-teal-600 rounded-lg text-white text-[10px] uppercase font-bold hover:bg-teal-500 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Confirm Changes
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div 
                    key={emg.id} 
                    className={`p-4 border rounded-2xl flex flex-col md:flex-row justify-between gap-4 transition-all shadow-sm ${
                      isAdmitted 
                        ? 'bg-slate-50/70 border-slate-200/40 opacity-50' 
                        : emg.severity === 'Critical' 
                          ? 'bg-rose-50/40 border-rose-200/85 siren-blink'
                          : 'bg-white border-slate-200/80'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-bold border ${
                          emg.severity === 'Critical' 
                            ? 'bg-rose-100 text-rose-800 border-rose-200' 
                            : emg.severity === 'High Risk'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : emg.severity === 'Medium Risk'
                                ? 'bg-yellow-100 text-amber-900 border-yellow-250 border-yellow-200'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {emg.severity} ({emg.id})
                        </span>
                        
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Reported: {emg.reportedTime}
                        </span>

                        {parentAmb && (
                          <span className="text-[10px] bg-slate-100 border border-slate-200 text-sky-600 px-2 py-0.5 rounded-md font-mono font-bold">
                            Ambulance: {parentAmb.code} ({parentAmb.speed} km/h)
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{emg.patientName} &bull; <span className="text-slate-500 font-normal">{emg.age}yo ({emg.gender})</span></h4>
                          <button 
                            onClick={() => startEditEmg(emg)}
                            className="text-teal-650 text-teal-600 hover:text-teal-700 bg-teal-50/50 hover:bg-teal-50 border border-teal-200/50 text-[10px] py-0.5 px-2 rounded-md font-bold transition-all flex items-center gap-1"
                            title="Edit Emergency Details"
                          >
                            <Edit className="w-3 h-3" /> Edit Case Specs
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1 font-sans italic">
                          "{emg.symptoms}"
                        </p>
                      </div>

                      {/* ETA Progress bar */}
                      {!isArrived && !isAdmitted && emg.etaMinutes !== undefined && emg.etaMinutes > 0 && (
                        <div>
                          <div className="flex justify-between items-center text-[9px] text-sky-600 font-mono mb-1 font-bold">
                            <span>ETA TRANSPORT TIMELINE</span>
                            <span>{emg.etaMinutes} MINS ETA</span>
                          </div>
                          <div className="w-full bg-slate-100 border border-slate-200/50 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-sky-500 h-full rounded-full transition-all duration-1000"
                              style={{ width: `${Math.max(10, 100 - (emg.etaMinutes * 15))}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col justify-end items-end shrink-0 gap-2 font-mono">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        emg.status === 'Dispatched' 
                          ? 'bg-amber-50 border-amber-200 text-amber-700' 
                          : emg.status === 'EnRoute'
                            ? 'bg-sky-50 border-sky-200 text-sky-700'
                            : emg.status === 'Arrived'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800 animate-pulse'
                              : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>
                        {emg.status.toUpperCase()}
                      </span>

                      {/* Admit Action button */}
                      {isArrived && (
                        <button
                          onClick={() => handleStartAdmit(emg)}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-bold text-xs rounded-lg shadow-sm mt-1.5 transition-all flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          ADMIT HANDOVER
                        </button>
                      )}

                      {isAdmitted && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 py-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          CARE ASSIGNED
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Radar GPS Map */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-1.5">
                <Compass className="w-4.5 h-4.5 text-sky-500 animate-spin" style={{ animationDuration: '10s' }} />
                Emergix Satellite Fleet Telemetry Map
              </h3>
              <p className="text-[10px] text-slate-400 mb-4 font-mono">Active tracking radius around hospital command center</p>
            </div>

            {/* Simulated Vector radar grid */}
            <div className="relative bg-slate-50 border border-slate-200 rounded-2xl h-60 overflow-hidden flex items-center justify-center shadow-inner">
              <div className="absolute border border-slate-200 rounded-full w-52 h-52"></div>
              <div className="absolute border border-slate-200 rounded-full w-40 h-40"></div>
              <div className="absolute border border-slate-200 rounded-full w-24 h-24"></div>
              <div className="absolute border border-slate-250 border-slate-200 rounded-full w-12 h-12"></div>
              
              <div className="absolute z-10 flex flex-col items-center">
                <div className="w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping absolute"></div>
                <div className="w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white relative flex items-center justify-center shadow">
                  <span className="text-[7px] font-extrabold text-white font-sans">H</span>
                </div>
                <span className="text-[8px] font-mono text-red-600 mt-1.5 font-bold">EMERGIX CTR</span>
              </div>

              {/* Pulsing Sweep line */}
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-sky-500/0 via-sky-400/20 to-sky-500/0 animate-pulse rotate-12 transform origin-center"></div>

              {ambulances.map((amb, idx) => {
                const angle = (idx * 85 + 40) * (Math.PI / 180);
                const offset = amb.status === 'Available' ? 15 : amb.status === 'EnRoute' ? 80 : 50;
                const topVal = 120 + Math.sin(angle) * offset;
                const leftVal = 145 + Math.cos(angle) * offset;

                return (
                  <div 
                    key={amb.id}
                    className="absolute group cursor-pointer"
                    style={{ top: `${topVal}px`, left: `${leftVal}px` }}
                  >
                    <span className="relative flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                        amb.status === 'EnRoute' ? 'bg-red-400' : 'bg-sky-400'
                      } opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                        amb.status === 'EnRoute' ? 'bg-red-500' : 'bg-sky-500'
                      } border border-white shadow-sm`}></span>
                    </span>

                    <div className="absolute hidden group-hover:block bg-white border border-slate-200 shadow-md p-2 font-mono text-[9px] text-slate-800 rounded-xl z-30 min-w-[110px] -top-12 -left-10 select-none">
                      <div className="font-bold text-sky-600">{amb.code}</div>
                      <div>ETA: {amb.eta}m &bull; Speed: {amb.speed}kmh</div>
                      <div className="text-[8px] text-slate-400 truncate mt-0.5">{amb.location}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3.5 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-405 text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-sky-500 rounded-full"></span>
                <span>Vehicle In Bay / Returning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                <span>Active Siren Dispatch</span>
              </div>
            </div>
          </div>

          {/* Doctor Shift list */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="mb-3">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Stethoscope className="w-4.5 h-4.5 text-sky-505 text-sky-500" />
                Active Staff Rostering Board
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">On-duty surgeons and critical teams</p>
            </div>

            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
              {doctors.map((doc) => (
                <div key={doc.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{doc.name}</h4>
                    <span className="text-[9px] text-sky-600 font-mono tracking-wide uppercase font-semibold">{doc.specialty}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-[9.5px] px-1.5 py-0.5 rounded-full border font-mono font-bold ${
                      doc.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                        : doc.status === 'In Surgery'
                          ? 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}>
                      {doc.status}
                    </span>
                    <div className="text-[9px] text-slate-400 mt-1 font-mono">Load: {doc.activePatients} case</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Handover Dialog / Bed Allocator Popup */}
      <AnimatePresence>
        {admitDrawerOpen && selectedEmergency && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl max-w-md w-full font-sans text-xs text-slate-700 space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                    <BedDouble className="w-5 h-5 text-red-500" />
                    ICU Handover Admission Authorization
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Authorize emergency bed handover on clinical grid</p>
                </div>
                <button 
                  onClick={() => setAdmitDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-900 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-[11px] leading-relaxed">
                <div><span className="text-slate-400 font-bold">PATIENT:</span> <span className="text-slate-800 font-bold">{selectedEmergency.patientName}</span> ({selectedEmergency.age}yo)</div>
                <div><span className="text-slate-400 font-bold">SYMPTOMS:</span> <span className="italic text-slate-600">" {selectedEmergency.symptoms} "</span></div>
                <div><span className="text-slate-400 font-bold">DEPT TARGET:</span> <span className="text-red-600 font-bold font-mono">{selectedEmergency.department}</span></div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] block font-mono font-bold uppercase">SELECT FREE ICU / GENERAL BED STATION:</label>
                {freeBeds.length > 0 ? (
                  <select 
                    value={selectedBedId}
                    onChange={(e) => setSelectedBedId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-cyan-500 font-sans"
                  >
                    {freeBeds.map((bed) => (
                      <option key={bed.id} value={bed.id}>
                        {bed.name} &bull; [{bed.bedType} BED]
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-red-600 text-[10px] bg-rose-50 p-2 text-rose-800 border border-rose-250 border-rose-200 rounded-xl font-bold flex items-center gap-2">
                    ⚠️ ALERT: All beds completely booked. Discharge patients to free up stations.
                  </div>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  onClick={() => setAdmitDrawerOpen(false)}
                  className="flex-1 py-2.5 border border-slate-250 border-slate-200 hover:bg-slate-100 text-slate-500 rounded-xl font-bold transition-all text-xs"
                >
                  ABORT
                </button>
                <button 
                  disabled={freeBeds.length === 0}
                  onClick={handleConfirmAdmit}
                  className={`flex-1 py-2.5 rounded-xl font-bold transition-all text-xs text-white ${
                    freeBeds.length === 0
                      ? 'bg-slate-300 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
                >
                  AUTHORIZE ADMISSION
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
