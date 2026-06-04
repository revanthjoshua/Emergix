/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Compass, 
  Navigation, 
  User, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Flame, 
  SlidersHorizontal,
  Plus,
  Edit,
  Check,
  X,
  Info
} from 'lucide-react';
import { Ambulance, EmergencyCase } from '../types';
import { motion } from 'motion/react';

interface AmbulanceTrackerViewProps {
  ambulances: Ambulance[];
  emergencies: EmergencyCase[];
  onUpdateAmbulanceEta: (ambulanceId: string, value: number) => void;
  onUpdateAmbulanceSpeed: (ambulanceId: string, value: number) => void;
  onUpdateAmbulances?: (updatedAmbs: Ambulance[]) => void;
}

export default function AmbulanceTrackerView({
  ambulances,
  emergencies,
  onUpdateAmbulanceEta,
  onUpdateAmbulanceSpeed,
  onUpdateAmbulances
}: AmbulanceTrackerViewProps) {
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>(ambulances[0]?.id || '');
  const selectedAmbulance = ambulances.find(a => a.id === selectedAmbulanceId) || ambulances[0];

  // Edit states for currently selected ambulance profile metadata
  const [isEditing, setIsEditing] = useState(false);
  const [editCode, setEditCode] = useState('');
  const [editStatus, setEditStatus] = useState<Ambulance['status']>('Available');
  const [editLocation, setEditLocation] = useState('');
  const [editCrewRaw, setEditCrewRaw] = useState('');
  const [editSpeed, setEditSpeed] = useState(0);
  const [editEta, setEditEta] = useState(0);

  // Sync edits when selected ambulance changes
  useEffect(() => {
    if (selectedAmbulance) {
      setEditCode(selectedAmbulance.code);
      setEditStatus(selectedAmbulance.status);
      setEditLocation(selectedAmbulance.location);
      setEditCrewRaw(selectedAmbulance.crew.join(', '));
      setEditSpeed(selectedAmbulance.speed);
      setEditEta(selectedAmbulance.eta);
      setIsEditing(false);
    }
  }, [selectedAmbulanceId, selectedAmbulance]);

  const handleSaveAmbulance = () => {
    if (!selectedAmbulance || !onUpdateAmbulances) return;
    const splitCrew = editCrewRaw
      .split(/[,&]/)
      .map(c => c.trim())
      .filter(c => c.length > 0);
      
    const nextAmbulances = ambulances.map(a => {
      if (a.id === selectedAmbulance.id) {
        return {
          ...a,
          code: editCode,
          status: editStatus,
          location: editLocation,
          crew: splitCrew,
          speed: editSpeed,
          eta: editEta
        };
      }
      return a;
    });
    
    onUpdateAmbulances(nextAmbulances);
    setIsEditing(false);
  };

  const getAmbulanceEmergency = (amb: Ambulance) => {
    return emergencies.find(e => e.ambulanceId === amb.id && e.status !== 'Admitted');
  };

  return (
    <div className="space-y-6">
      
      {/* Page Instruction Guide */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm text-xs">
        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
          <Truck className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-1 text-slate-600">
          <h4 className="font-extrabold text-emerald-800 font-mono uppercase tracking-wider flex items-center gap-1">
            🚑 AMBULANCE TELEMETRY & DISPATCH MANUAL
          </h4>
          <p className="text-slate-500 font-sans">
            Oversee active trauma logistics, override vehicle speed metrics, shorten ETAs, and alter paramedic crew assignments:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 font-sans pl-1">
            <li><strong>Select Vehicle Nodes</strong>: Select any ambulance from the left board to review real-time coordinates and transit pathways.</li>
            <li><strong>Edit Fleet Details</strong>: Click the <strong>"Edit Fleet Node"</strong> button to physically change the callsing, sector area, assigned paramedics list, speed constants, and ETAs.</li>
            <li><strong>Simulate Path Progress</strong>: Drag the <strong>"Manual Telemetry Overrides"</strong> sliders to fast-forward patient transit progress in real-time.</li>
          </ul>
        </div>
      </div>

      <div id="ambulance-tracker-view" className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      {/* Col 1: Fleet Command Hub Cards */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200/85 p-4 rounded-2xl shadow-sm">
          <h3 className="font-bold text-sm text-slate-805 text-slate-800 flex items-center gap-1.5 mb-1">
            <Truck className="w-4.5 h-4.5 text-sky-505 text-sky-500" />
            Ambulance Fleet Status Board
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">Select mobile trauma unit to adjust dynamic transit velocities</p>
        </div>

        <div className="space-y-3 h-[490px] overflow-y-auto pr-1">
          {ambulances.map((amb) => {
            const activeEmg = getAmbulanceEmergency(amb);

            return (
              <div 
                key={amb.id}
                onClick={() => setSelectedAmbulanceId(amb.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all shadow-sm ${
                  selectedAmbulanceId === amb.id 
                    ? 'bg-sky-50/70 border-sky-450 border-sky-400' 
                    : 'bg-white border-slate-200/80 hover:border-slate-350'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${amb.status === 'EnRoute' ? 'text-red-505 text-red-500 animate-pulse' : 'text-sky-505 text-sky-500'}`} />
                    <h4 className="text-xs font-extrabold text-slate-800">{amb.code}</h4>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    amb.status === 'EnRoute' 
                      ? 'bg-rose-100 text-rose-800 border-rose-250 border-rose-200 animate-pulse' 
                      : amb.status === 'Available'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-250 border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border-amber-250 border-amber-200'
                  }`}>
                    {amb.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[10px] text-slate-500">
                  <div>Sector Zone: <strong className="text-slate-700">{amb.location}</strong></div>
                  {activeEmg ? (
                    <div className="text-red-600 font-semibold flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 animate-pulse" /> Emergency Code: {activeEmg.patientName}
                    </div>
                  ) : (
                    <div className="text-slate-400 uppercase text-[9px]">Standby: Base Ingress Bay</div>
                  )}
                </div>

                {/* Progress ETA Indicator */}
                {amb.status !== 'Available' && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center text-[9px] font-mono text-slate-400">
                    <span>SPEED: <strong className="text-sky-600 font-bold">{amb.speed} km/h</strong></span>
                    <span>ETA: <strong className="text-sky-600 font-bold">{amb.eta} mins</strong></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Col 2-3: Visual Route GPS Simulator */}
      <div className="xl:col-span-2 space-y-6">
        {selectedAmbulance ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between h-full shadow-sm">
            <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/5 rounded-full blur-3xl"></div>
            
            {/* Help tip alert banner */}
            <div className="mb-4 bg-teal-50/50 border border-teal-100 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-slate-650 text-slate-600">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-teal-850">Help Tip:</span> Fleet captains can click <strong className="text-teal-700">"Edit Fleet Node"</strong> to modify the vehicle's custom callsign code, change deployment zone region, or change the names of paramedics assigned to this medical crew roster.
              </div>
            </div>

            <div className="space-y-4">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal-55 bg-teal-50 text-teal-600 rounded-xl border border-teal-100 shadow-sm">
                    <Truck className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-extrabold text-slate-900">
                        {isEditing ? 'Editing ' : ''}{selectedAmbulance.code} Active Node
                      </h2>
                      {!isEditing && (
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center gap-1 text-[10px] bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 py-0.5 px-2 rounded-md font-bold transition-all"
                        >
                          <Edit className="w-2.5 h-2.5" /> Edit Fleet Node
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono uppercase">GPS-LINK STATUS: CONNECTED SECTOR {selectedAmbulance.id}</p>
                  </div>
                </div>

                <div className="flex gap-2 font-mono text-[10px]">
                  <div className="p-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-slate-600 flex items-center gap-1">
                    <span>SPEED CONSTANT:</span> <strong className="text-sky-600">{selectedAmbulance.speed} KM/H</strong>
                    <button onClick={() => setIsEditing(true)} className="p-0.5 text-slate-400 hover:text-teal-600 transition-colors" title="Edit speed constant">
                      <Edit className="w-2.5 h-2.5 cursor-pointer" />
                    </button>
                  </div>
                  <div className="p-1 px-2.5 bg-slate-50 border border-slate-200 rounded text-slate-600 flex items-center gap-1">
                    <span>ETA TIME:</span> <strong className="text-sky-600">{selectedAmbulance.eta} MIN</strong>
                    <button onClick={() => setIsEditing(true)} className="p-0.5 text-slate-400 hover:text-teal-600 transition-colors" title="Edit ETA time">
                      <Edit className="w-2.5 h-2.5 cursor-pointer" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Transit Map Progress Bar OR Editor */}
              {isEditing ? (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-[10px] text-teal-600 font-mono uppercase tracking-widest flex items-center gap-1.5 font-bold">
                    <Edit className="w-4 h-4" />
                    AMBULANCE PROFILE DETAILS CONVERTER
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-slate-400 block">VEHICLE CALLSIGN / ID CODE</label>
                      <input 
                        type="text" 
                        value={editCode} 
                        onChange={(e) => setEditCode(e.target.value)} 
                        className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:border-teal-500"
                        placeholder="e.g. AMB-101"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-slate-400 block">SECTOR ROUTE LOCATION</label>
                      <input 
                        type="text" 
                        value={editLocation} 
                        onChange={(e) => setEditLocation(e.target.value)} 
                        className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:border-teal-500"
                        placeholder="e.g. North Ridge Area"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-slate-400 block">DEPLOYMENT STATUS</label>
                      <select 
                        value={editStatus} 
                        onChange={(e) => setEditStatus(e.target.value as any)} 
                        className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:border-teal-500"
                      >
                        <option value="Available">Available (Standby At HQ Slot)</option>
                        <option value="EnRoute">EnRoute (Active Sirens Transiting)</option>
                        <option value="Busy">Busy (Admitting Medical Handover)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-slate-400 block font-sans">PARAMEDICS CREW (COMMA SEPARATED)</label>
                      <input 
                        type="text" 
                        value={editCrewRaw} 
                        onChange={(e) => setEditCrewRaw(e.target.value)} 
                        className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:border-teal-500 font-mono"
                        placeholder="e.g. Paramedic Jones, Tech Baker"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-slate-400 block">SPEED CONSTANT (KM/H)</label>
                      <input 
                        type="number" 
                        value={editSpeed} 
                        onChange={(e) => setEditSpeed(Math.max(0, parseInt(e.target.value) || 0))} 
                        className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:border-teal-500"
                        min="0"
                        max="200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-bold text-slate-400 block">DUE ETA (MINUTES)</label>
                      <input 
                        type="number" 
                        value={editEta} 
                        onChange={(e) => setEditEta(Math.max(0, parseInt(e.target.value) || 0))} 
                        className="w-full text-xs font-bold border border-slate-200 p-2.5 rounded-xl bg-white outline-none focus:border-teal-500"
                        min="0"
                        max="60"
                      />
                    </div>

                    <div className="space-y-1 flex items-end">
                      <p className="text-[10px] text-slate-400 font-sans italic leading-tight">
                        Editing the ETA modifies the GPS progress tracks and live countdown metrics immediately.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="py-1.5 px-3.5 bg-slate-100 rounded-lg text-slate-600 text-[10px] uppercase font-bold hover:bg-slate-200 flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" /> Abort
                    </button>
                    <button 
                      onClick={handleSaveAmbulance}
                      className="py-1.5 px-3.5 bg-teal-600 rounded-lg text-white text-[10px] uppercase font-bold hover:bg-teal-500 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Save Configuration
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-6">
                  <h4 className="text-[10px] text-sky-600 font-mono uppercase tracking-widest flex items-center gap-1 font-bold">
                    <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                    Vector GPS Route Tracking Progression
                  </h4>

                {/* Simulated GPS Pathway */}
                <div className="relative py-6">
                  {/* Glowing Road Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-210 bg-slate-200 -translate-y-1/2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        selectedAmbulance.status === 'EnRoute' ? 'bg-gradient-to-r from-red-500 to-sky-500' : 'bg-sky-500'
                      }`}
                      style={{ 
                        width: selectedAmbulance.status === 'Available' 
                          ? '0%' 
                          : `${Math.max(5, 100 - (selectedAmbulance.eta * 12))}%` 
                      }}
                    ></div>
                  </div>

                  {/* Intercept checkpoints */}
                  <div className="flex justify-between items-center relative z-10 font-mono text-[9px] text-slate-500">
                    <div className="flex flex-col items-center">
                      <div className={`p-1 bg-white border rounded-full ${
                        selectedAmbulance.status === 'EnRoute' ? 'border-red-500' : 'border-slate-200'
                      } shadow-sm`}>
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <span className="text-slate-800 mt-1 font-bold">INCIDENT</span>
                      <span className="text-[8px] text-slate-400">Triage Site</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="p-1 bg-white border border-slate-200 rounded-full shadow-sm">
                        <Navigation className="w-3.5 h-3.5 text-sky-500" />
                      </div>
                      <span className="text-slate-800 mt-1 font-bold">INTERCEPT</span>
                      <span className="text-[8px] text-slate-400 select-none truncate max-w-[80px]">{selectedAmbulance.location}</span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="p-1 bg-white border border-emerald-400 rounded-full shadow-sm">
                        <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-emerald-600 mt-1 font-bold">EMERGIX GATE</span>
                      <span className="text-[8px] text-slate-400">Ingress Bay</span>
                    </div>
                  </div>

                  {/* Simulated Moving Ambulance Indicator marker on track */}
                  {selectedAmbulance.status !== 'Available' && (
                    <div 
                      className="absolute top-1/2 -translate-y-[82%] z-20 transition-all duration-1000 flex flex-col items-center"
                      style={{ 
                        left: `${Math.min(90, Math.max(8, 100 - (selectedAmbulance.eta * 12)))}%` 
                      }}
                    >
                      <div className="p-1.5 bg-sky-500 text-white rounded-lg shadow-md rotate-90 scale-90">
                        <Navigation className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[8px] font-mono text-sky-700 bg-white shadow-sm border border-sky-100 px-1 rounded mt-0.5 font-bold">
                        {selectedAmbulance.code}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Sliders for manual telemetry tweaks */}
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200 space-y-3 shadow-inner">
                <h4 className="text-[10px] text-slate-500 font-mono uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-1.5 font-bold">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-450" />
                  Manual Telemetry Overrides (Simulation Tools)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* ETA adjustment */}
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">CRITICAL TRANSIT ETA:</span>
                      <span className="text-sky-600 font-bold">{selectedAmbulance.eta} MINS</span>
                    </div>
                    <input 
                      disabled={selectedAmbulance.status === 'Available'}
                      type="range" 
                      min="0" 
                      max="15" 
                      value={selectedAmbulance.eta} 
                      onChange={(e) => onUpdateAmbulanceEta(selectedAmbulance.id, parseInt(e.target.value))}
                      className="w-full cursor-pointer disabled:opacity-40"
                    />
                  </div>

                  {/* Speed adjustment */}
                  <div className="space-y-1 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">SPEED CONSTANT:</span>
                      <span className="text-sky-600 font-bold">{selectedAmbulance.speed} KM/H</span>
                    </div>
                    <input 
                      disabled={selectedAmbulance.status === 'Available'}
                      type="range" 
                      min="0" 
                      max="140" 
                      value={selectedAmbulance.speed} 
                      onChange={(e) => onUpdateAmbulanceSpeed(selectedAmbulance.id, parseInt(e.target.value))}
                      className="w-full cursor-pointer disabled:opacity-40"
                    />
                  </div>

                </div>
              </div>

              {/* Paramedics and Medical Crew detail */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-sm">
                <div className="space-y-1 font-sans">
                  <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold flex items-center gap-1">
                    ACTIVE MEDICS ROSTER:
                    <button onClick={() => setIsEditing(true)} className="p-0.5 text-slate-400 hover:text-teal-600 transition-colors" title="Edit medical crew roster">
                      <Edit className="w-2.5 h-2.5 cursor-pointer" />
                    </button>
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <User className="w-4 h-4 text-sky-505 text-sky-500" />
                    {selectedAmbulance.crew.join(' & ')}
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>GPS LINK DIRECTIVE VERIFIED</span>
                </div>
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  </div>
  );
}
