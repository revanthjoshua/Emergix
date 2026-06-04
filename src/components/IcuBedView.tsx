/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bed, 
  Wind, 
  Activity, 
  Sparkles, 
  Trash2, 
  Plus, 
  Filter, 
  LayoutGrid, 
  AlertTriangle,
  Flame,
  ShieldCheck,
  Stethoscope,
  Edit,
  Check,
  X,
  Info
} from 'lucide-react';
import { IcuBed, Patient } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface IcuBedViewProps {
  beds: IcuBed[];
  patients: Patient[];
  onReleaseBed: (bedId: string) => void;
  onAllocateBed: (bedId: string, patientName: string, bedType: 'ICU' | 'CCU' | 'NICU' | 'Trauma') => void;
  onToggleVentilator: (bedId: string) => void;
  onUpdateBeds?: (newBeds: IcuBed[]) => void;
}

export default function IcuBedView({
  beds,
  patients,
  onReleaseBed,
  onAllocateBed,
  onToggleVentilator,
  onUpdateBeds
}: IcuBedViewProps) {
  const [filterType, setFilterType] = useState<string>('All');
  const [allocationBed, setAllocationBed] = useState<IcuBed | null>(null);

  // Manual Allocation Fields
  const [allocPatientName, setAllocPatientName] = useState('');
  const [allocBedType, setAllocBedType] = useState<'ICU' | 'CCU' | 'NICU' | 'Trauma'>('ICU');

  // Edit Bed localised state fields
  const [editingBedId, setEditingBedId] = useState<string | null>(null);
  const [editBedName, setEditBedName] = useState('');
  const [editBedType, setEditBedType] = useState<'ICU' | 'CCU' | 'NICU' | 'Trauma'>('ICU');
  const [editOxygen, setEditOxygen] = useState(5);
  const [editVentilator, setEditVentilator] = useState(false);

  // Capacity and Bed scaling states
  const [newBedCode, setNewBedCode] = useState('');
  const [newBedSpecialty, setNewBedSpecialty] = useState<'ICU' | 'CCU' | 'NICU' | 'Trauma'>('ICU');

  const handleAddNewBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBedCode) return;
    const isExist = beds.some(b => b.id.toLowerCase() === newBedCode.toLowerCase() || b.name.toLowerCase() === newBedCode.toLowerCase());
    if (isExist) {
      alert("This Bed Station code is already listed in the matrix.");
      return;
    }
    const createdBed: IcuBed = {
      id: newBedCode.toUpperCase(),
      name: newBedCode.toUpperCase(),
      bedType: newBedSpecialty,
      occupied: false,
      ventilatorActive: false,
      oxygenFlowLpm: 0
    };
    if (onUpdateBeds) {
      onUpdateBeds([...beds, createdBed]);
    }
    setNewBedCode('');
  };

  const handleDeleteBedNode = (bedId: string) => {
    if (onUpdateBeds) {
      onUpdateBeds(beds.filter(b => b.id !== bedId));
    }
  };

  const startEditBed = (bed: IcuBed) => {
    setEditingBedId(bed.id);
    setEditBedName(bed.name);
    setEditBedType(bed.bedType);
    setEditOxygen(bed.oxygenFlowLpm || 5);
    setEditVentilator(bed.ventilatorActive || false);
  };

  const saveEditBed = () => {
    if (!editingBedId) return;
    const nextBeds = beds.map(b => {
      if (b.id === editingBedId) {
        return {
          ...b,
          name: editBedName,
          bedType: editBedType,
          oxygenFlowLpm: Number(editOxygen),
          ventilatorActive: editVentilator
        };
      }
      return b;
    });
    if (onUpdateBeds) {
      onUpdateBeds(nextBeds);
    }
    setEditingBedId(null);
  };

  const filteredBeds = beds.filter(b => {
    return filterType === 'All' || b.bedType === filterType;
  });

  const occupiedBeds = beds.filter(b => b.occupied);
  const occupiedPercent = Math.round((occupiedBeds.length / beds.length) * 100);

  const handleStartAllocate = (bed: IcuBed) => {
    setAllocationBed(bed);
    setAllocPatientName('');
    setAllocBedType(bed.bedType);
  };

  const handleConfirmAllocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (allocationBed && allocPatientName) {
      onAllocateBed(allocationBed.id, allocPatientName, allocBedType);
      setAllocationBed(null);
    }
  };

  return (
    <div id="icu-grid-view" className="space-y-6">
      
      {/* Page Instruction Guide */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm text-xs">
        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-slate-600">
          <h4 className="font-extrabold text-emerald-800 font-mono uppercase tracking-wider flex items-center gap-1">
            🛌 ICU MATRIX: CAPACITY MANAGEMENT & PARAMETERS
          </h4>
          <p className="text-slate-500 font-sans">
            Scale dynamic ward bed parameters, modulate oxygen flow limits, toggle ventilators, and edit individual bed properties inline:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 font-sans pl-1">
            <li><strong>Scale Bed Capacity</strong>: Use the <strong>"Scale Capacity & Add New Bed Station"</strong> form below to increase or decrease the total number of physical beds in real time.</li>
            <li><strong>Interactive Edits</strong>: Click the pencil (✏️) icon on any Bed Card to change the bed label, designation department classification, or target LPM flow values.</li>
            <li><strong>Ventilator Activation</strong>: Click the wind turbine (🌬️) button to toggle respiratory supports or instantly release a patient card.</li>
          </ul>
        </div>
      </div>

      {/* Capacity Customizer & Add Bed Component */}
      <form onSubmit={handleAddNewBed} className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-end text-xs font-mono text-slate-500">
        <div className="md:col-span-1 space-y-1">
          <label className="block font-bold">SCALE CAPACITIES (NEW STATION CODE):</label>
          <input 
            type="text" 
            placeholder="e.g. ICU-10" 
            value={newBedCode}
            onChange={(e) => setNewBedCode(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 outline-none focus:border-teal-500 font-sans text-xs"
          />
        </div>
        <div className="md:col-span-1 space-y-1">
          <label className="block font-bold">WARD CLASSIFICATION:</label>
          <select 
            value={newBedSpecialty}
            onChange={(e) => setNewBedSpecialty(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 outline-none focus:border-teal-500 font-sans text-xs"
          >
            <option value="ICU">ICU (Intensive Care)</option>
            <option value="CCU">CCU (Coronary Care)</option>
            <option value="NICU">NICU (Neonatal Care)</option>
            <option value="Trauma">Trauma Bay</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <button 
            type="submit" 
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-sans font-bold transition-all text-xs flex items-center justify-center gap-1 uppercase height-[36px]"
          >
            <Plus className="w-4 h-4 text-teal-400" /> Save Bed Node
          </button>
        </div>
        <div className="md:col-span-1 text-[10px] text-slate-400 font-sans leading-tight pb-1">
          Each bed station added updates the overall CRM registers and increases capacity limits immediately.
        </div>
      </form>
      
      {/* Top statistics cards and Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-bold text-sm text-slate-805 text-slate-800 flex items-center gap-1.5">
              <LayoutGrid className="w-4.5 h-4.5 text-sky-505 text-sky-500" />
              ICU Ward Bed Command Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time bed telemetry mapping, oxygen flow control, and ventilator registers</p>
          </div>

          <div className="border-l border-slate-200 pl-4 py-1.5 hidden sm:block">
            <div className="text-[10px] text-slate-400 font-mono">ICU LOAD LIMIT:</div>
            <div className="text-sm font-extrabold text-sky-600 font-mono">{occupiedBeds.length} / {beds.length} occupied</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl font-mono text-xs">
          <span className="text-slate-500 text-[10px] uppercase font-bold px-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Unit Filter:
          </span>
          {['All', 'ICU', 'CCU', 'NICU', 'Trauma'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
                filterType === t
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bed Grid Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {filteredBeds.map((bed) => {
          const matchingPat = patients.find(p => p.id === bed.patientId);
          const vitals = matchingPat?.vitals;
          const isEditing = editingBedId === bed.id;

          if (isEditing) {
            return (
              <div 
                key={bed.id}
                className="border p-4 rounded-2xl flex flex-col justify-between transition-all bg-white border-teal-400 ring-2 ring-teal-50 h-auto min-h-72 shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-mono font-bold text-teal-600">ID: {bed.id}</span>
                    <span className="text-[8px] bg-teal-50 text-teal-700 font-mono py-0.5 px-1.5 rounded font-bold">STATION CONFIG</span>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-bold text-slate-400">STATION NAME</label>
                    <input 
                      type="text" 
                      value={editBedName} 
                      onChange={(e) => setEditBedName(e.target.value)} 
                      className="w-full text-xs font-bold border border-slate-200 p-2 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-bold text-slate-400">UNIT SPECIALTY</label>
                    <select 
                      value={editBedType} 
                      onChange={(e) => setEditBedType(e.target.value as any)} 
                      className="w-full text-xs font-bold border border-slate-200 p-2 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                    >
                      <option value="ICU">ICU (Intensive)</option>
                      <option value="CCU">CCU (Coronary)</option>
                      <option value="NICU">NICU (Neonatal)</option>
                      <option value="Trauma">Trauma (Resus)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-bold text-slate-400">OXYGEN FLOW (LPM)</label>
                    <input 
                      type="number" 
                      value={editOxygen} 
                      onChange={(e) => setEditOxygen(Number(e.target.value))} 
                      className="w-full text-xs font-bold border border-slate-200 p-2 rounded-xl bg-slate-50 outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <input 
                      type="checkbox" 
                      id={`edit-vent-${bed.id}`}
                      checked={editVentilator} 
                      onChange={(e) => setEditVentilator(e.target.checked)} 
                      className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 border-slate-300"
                    />
                    <label htmlFor={`edit-vent-${bed.id}`} className="text-[10px] font-mono font-bold text-slate-500 cursor-pointer">
                      VENTILATOR ON
                    </label>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-2.5 flex gap-1.5 font-mono">
                  <button 
                    onClick={() => setEditingBedId(null)}
                    className="w-1/2 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-[9px] font-bold border border-slate-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <X className="w-3 h-3" /> CANCEL
                  </button>
                  <button 
                    onClick={saveEditBed}
                    className="w-1/2 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-[9px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Check className="w-3 h-3" /> SAVE
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div 
              key={bed.id}
              className={`border p-4 rounded-2xl flex flex-col justify-between transition-all relative overflow-hidden h-72 shadow-sm ${
                bed.occupied 
                  ? bed.riskLevel === 'Critical'
                    ? 'bg-rose-50/40 border-rose-200/90 active-red-glow'
                    : bed.riskLevel === 'High Risk'
                      ? 'bg-amber-50/40 border-amber-200/95'
                      : 'bg-white border-sky-200'
                  : 'bg-slate-50/50 border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors'
              }`}
            >
              <div>
                {/* Header Bed info */}
                <div className="flex items-center justify-between mb-3.5 border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-mono tracking-widest text-slate-700 font-extrabold flex items-center gap-1">
                    {bed.name}
                    <button 
                      onClick={() => startEditBed(bed)}
                      className="text-slate-400 hover:text-teal-600 hover:scale-110 transition-transform p-0.5"
                      title="Edit Station Specs"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    {!bed.occupied && (
                      <button 
                        onClick={() => handleDeleteBedNode(bed.id)}
                        className="text-slate-400 hover:text-red-500 hover:scale-110 transition-transform p-0.5 ml-1"
                        title="Delete Bed Station"
                      >
                        <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
                      </button>
                    )}
                  </span>
                  <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-505 text-slate-500 font-mono py-0.5 px-2 rounded-full uppercase font-bold">
                    {bed.bedType}
                  </span>
                </div>

                {/* Patient status if occupied */}
                {bed.occupied ? (
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-normal truncate">
                        {bed.patientName}
                      </h4>
                      
                      {matchingPat && (
                        <p className="text-[10px] text-sky-600 font-bold font-mono truncate mt-0.5">
                          {matchingPat.condition}
                        </p>
                      )}
                    </div>

                    {/* Vitals overview Mini tracker */}
                    {vitals && (
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px] text-slate-500 border-t border-slate-100 pt-2 pb-1.5">
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="block text-slate-400 font-bold text-[8px]">PULSE</span>
                          <strong className={`text-slate-800 ${vitals.heartRate > 115 ? 'text-red-650 font-extrabold animate-pulse' : ''}`}>
                            {vitals.heartRate} bpm
                          </strong>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                          <span className="block text-slate-400 font-bold text-[8px]">OXYGEN</span>
                          <strong className={`text-slate-800 ${vitals.oxygenSat < 91 ? 'text-red-500 font-extrabold animate-pulse' : 'text-sky-600'}`}>
                            {vitals.oxygenSat}%
                          </strong>
                        </div>
                      </div>
                    )}

                    {/* Ventilator Indicator */}
                    <div className="flex items-center gap-2 mt-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200/80">
                      <button
                        onClick={() => onToggleVentilator(bed.id)}
                        className={`p-1 rounded transition-all ${
                          bed.ventilatorActive 
                            ? 'bg-sky-500 text-white font-extrabold animate-pulse' 
                            : 'bg-white border border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title="Toggle Ventilator Activity"
                      >
                        <Wind className="w-3.5 h-3.5" />
                      </button>

                      <div className="font-mono text-[9px] text-slate-500 leading-normal flex-1 flex justify-between items-center">
                        <div>
                          <span>VENTILATOR:</span>
                          <strong className={`block ${bed.ventilatorActive ? 'text-sky-600' : 'text-slate-400'}`}>
                            {bed.ventilatorActive ? `ACTIVE (${bed.oxygenFlowLpm} LPM)` : 'STANDBY (0L)'}
                          </strong>
                        </div>
                        <button 
                          onClick={() => startEditBed(bed)}
                          className="text-slate-400 hover:text-teal-600 transition-colors p-0.5 inline-block"
                          title="Change oxygen flow or details"
                        >
                          <Edit className="w-3 h-3 cursor-pointer" />
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-8 text-center space-y-2">
                    <Bed className="w-10 h-10 text-slate-300" />
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-semibold">
                      POD DISCHARGED
                    </p>
                  </div>
                )}
              </div>

              {/* Actions footer */}
              <div className="mt-4 border-t border-slate-100 pt-2.5 flex justify-end gap-1 font-mono">
                {bed.occupied ? (
                  <button
                    onClick={() => onReleaseBed(bed.id)}
                    className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-bold border border-red-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    DISCHARGE PATIENT
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartAllocate(bed)}
                    className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold border border-emerald-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    RESERVE BED
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Allocate Bed Modal */}
      <AnimatePresence>
        {allocationBed && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleConfirmAllocate}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl max-w-md w-full font-sans text-xs text-slate-705 text-slate-700 space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-905 text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                    <Activity className="w-5 h-5 text-red-500 heart-pulse" />
                    Tactical Patient Bed Assignment
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Initiate localized bed provisioning hold</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setAllocationBed(null)}
                  className="text-slate-400 hover:text-slate-900 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1.5 font-mono">
                <label className="text-slate-500 block mb-1">PATIENT FULL NAME:</label>
                <input 
                  required 
                  type="text" 
                  value={allocPatientName} 
                  onChange={(e) => setAllocPatientName(e.target.value)}
                  placeholder="Charlotte Webb" 
                  className="w-full bg-slate-50 border border-slate-20 rounded-lg p-2.5 text-slate-800 font-sans outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5 font-mono">
                <label className="text-slate-500 block mb-1 font-bold">WARD CLASSIFICATION:</label>
                <select 
                  value={allocBedType}
                  onChange={(e) => setAllocBedType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-20 rounded-lg p-2.5 text-slate-800 outline-none focus:border-sky-500"
                >
                  <option value="ICU">ICU (Intensive Care Unit)</option>
                  <option value="CCU">CCU (Coronary Care Unit)</option>
                  <option value="NICU">NICU (Neonatal ICU)</option>
                  <option value="Trauma">Trauma Emergency Bay</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button 
                  type="button"
                  onClick={() => setAllocationBed(null)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-500 font-bold rounded-xl transition-all text-sm"
                >
                  ABORT
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all text-sm"
                >
                  ALLOCATE STATION
                </button>
              </div>

            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
