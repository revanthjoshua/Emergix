/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Doctor } from '../types';
import { Stethoscope, User, HelpCircle, Activity, Star, CalendarDays, Edit, Check, X, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface DoctorManagementViewProps {
  doctors: Doctor[];
  onUpdateDoctors?: (docs: Doctor[]) => void;
}

export default function DoctorManagementView({ doctors, onUpdateDoctors }: DoctorManagementViewProps) {
  const [filter, setFilter] = useState<string>('ALL');

  // Edit doctor local states
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');
  const [editStatus, setEditStatus] = useState<Doctor['status']>('Active');
  const [editPatients, setEditPatients] = useState(0);

  const startEdit = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setEditName(doc.name);
    setEditSpecialty(doc.specialty);
    setEditStatus(doc.status);
    setEditPatients(doc.activePatients);
  };

  const saveEdit = () => {
    if (!editingDoctorId) return;
    const updated = doctors.map(d => {
      if (d.id === editingDoctorId) {
        return {
          ...d,
          name: editName,
          specialty: editSpecialty,
          status: editStatus,
          activePatients: Number(editPatients)
        };
      }
      return d;
    });
    if (onUpdateDoctors) {
      onUpdateDoctors(updated);
    }
    setEditingDoctorId(null);
  };

  // Specialties list for filtering
  const specialties = ['ALL', 'Trauma Surgery', 'Interventional Cardiology', 'Emergency Medicine', 'Pulmonology / Critical Care', 'Stroke Neurology'];

  const filteredDoctors = filter === 'ALL' 
    ? doctors 
    : doctors.filter(doc => doc.specialty === filter);

  // Chart data representing live caseloads per physician
  const caseloadData = doctors.map(d => ({
    name: d.name.replace('Dr. ', ''),
    cases: d.activePatients,
    status: d.status
  }));

  const getStatusColor = (status: Doctor['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Surgery':
        return 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse';
      case 'On Call':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div id="doctor-manager-panel" className="space-y-6">
      
      {/* Page Instruction Guide */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm text-xs">
        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-1 text-slate-600">
          <h4 className="font-extrabold text-emerald-800 font-mono uppercase tracking-wider flex items-center gap-1">
            🩺 CLINICIAN ROSTER & CASELOAD DIRECTORY NOTES
          </h4>
          <p className="text-slate-500 font-sans">
            Oversee on-call registries, modify clinician specialties, and load active surgical queues:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 font-sans pl-1">
            <li><strong>Roster Filter Bar</strong>: Press any pill in the top filter bar (e.g. <em>Trauma Surgery</em>) to immediately narrow down visible staff files.</li>
            <li><strong>Update Doctor Assignment</strong>: Click <strong>"Edit Staff Profile"</strong> on any card to update their name, set shifts (Active, On-Call, In Surgery), and change the total active patient quota.</li>
            <li><strong>Analyze Caseload Stats</strong>: Monitor the live caseload graph on the right to visualize physician task saturation in real time.</li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-sky-505 text-sky-500" />
            Physician Command Registry
          </h2>
          <p className="text-xs text-slate-500 mt-1">Real-time status tracking, operating surgical loading, and shift rosters.</p>
        </div>
        
        {/* Filtering Pills */}
        <div className="flex flex-wrap gap-1.5">
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setFilter(spec)}
              className={`py-1 px-3 rounded-full text-xs font-mono font-semibold transition-all ${
                filter === spec 
                  ? 'bg-sky-500 text-white shadow-sm' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {spec === 'ALL' ? 'Show All Staff' : spec}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor lists */}
        <div className="lg:col-span-2 space-y-4">
          {/* Help tip ticker */}
          <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-3.5 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4.5 h-4.5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-850">Help Tip:</span> Operations directors can tune active doctor names, surgical specialties, roster shift states, and caseload quotas directly by clicking on the <strong className="text-teal-700">"Edit staff profile"</strong> link below each clinician!
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-slate-500 font-bold px-1">
            <span>SHOWING {filteredDoctors.length} ACTIVE PRACTITIONERS</span>
            <span>🟢 STABILITY PROTOCOL ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map(doc => {
              const urgencyHigh = doc.activePatients >= 3;
              const isEditing = editingDoctorId === doc.id;
              
              return (
                <div 
                  key={doc.id}
                  className={`bg-white border rounded-2xl p-4 transition-all hover:shadow-md flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                    isEditing ? 'border-teal-400 ring-2 ring-teal-50/50' : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {isEditing ? (
                    <div className="space-y-3 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-teal-50 border border-teal-100 rounded-xl p-1.5 text-[11px] font-mono">
                          <span className="text-slate-500">ID: {doc.id}</span>
                          <span className="text-teal-700 font-bold">EDITING STAFF</span>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">PRACTITIONER NAME</label>
                          <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 p-2 rounded-xl outline-none focus:border-teal-500 bg-slate-50"
                            placeholder="Dr. Name"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-mono font-bold text-slate-400">CLINICAL SPECIALTY</label>
                          <input 
                            type="text" 
                            value={editSpecialty} 
                            onChange={(e) => setEditSpecialty(e.target.value)} 
                            className="w-full text-xs font-bold text-slate-800 border border-slate-200 p-2 rounded-xl outline-none focus:border-teal-500 bg-slate-50"
                            placeholder="e.g. Trauma Surgery"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-slate-400">SHIFT STATE</label>
                            <select 
                              value={editStatus} 
                              onChange={(e) => setEditStatus(e.target.value as any)} 
                              className="w-full text-xs font-bold text-slate-705 border border-slate-200 p-2 rounded-xl outline-none focus:border-teal-505 bg-slate-50"
                            >
                              <option value="Active">Active</option>
                              <option value="In Surgery">In Surgery</option>
                              <option value="On Call">On Call</option>
                              <option value="Offline">Offline</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono font-bold text-slate-400">ACTIVE CASES</label>
                            <input 
                              type="number" 
                              value={editPatients} 
                              onChange={(e) => setEditPatients(Number(e.target.value))} 
                              className="w-full text-xs font-bold text-slate-800 border border-slate-200 p-2 rounded-xl outline-none focus:border-teal-500 bg-slate-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                        <button 
                          onClick={() => setEditingDoctorId(null)}
                          className="p-1 px-3 bg-slate-100 rounded-lg text-slate-600 text-[10px] uppercase font-bold hover:bg-slate-200 flex items-center gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" /> Abort
                        </button>
                        <button 
                          onClick={saveEdit}
                          className="p-1 px-3 bg-teal-600 rounded-lg text-white text-[10px] uppercase font-bold hover:bg-teal-500 flex items-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Confirm
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-teal-500 transition-colors">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm group-hover:text-slate-900 flex items-center gap-1.5">
                              {doc.name}
                              <button onClick={() => startEdit(doc)} className="text-slate-400 hover:text-teal-605 hover:text-teal-600 transition-colors" title="Edit name">
                                <Edit className="w-3 h-3 cursor-pointer" />
                              </button>
                            </h4>
                            <p className="text-[11px] font-mono font-semibold text-teal-600 flex items-center gap-1">
                              {doc.specialty}
                              <button onClick={() => startEdit(doc)} className="text-slate-400 hover:text-teal-700 transition-colors" title="Edit specialty">
                                <Edit className="w-2.5 h-2.5 cursor-pointer" />
                              </button>
                            </p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getStatusColor(doc.status)}`}>
                          {doc.status}
                          <button onClick={() => startEdit(doc)} className="text-slate-400 hover:text-teal-600 transition-colors" title="Edit shift status">
                            <Edit className="w-2.5 h-2.5 cursor-pointer" />
                          </button>
                        </span>
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-500">Active Case Handover:</span>
                        <span className={`font-bold flex items-center gap-1 ${urgencyHigh ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {doc.activePatients} Cases Assigned
                          <button onClick={() => startEdit(doc)} className="text-slate-400 hover:text-teal-600 transition-colors" title="Edit active cases">
                            <Edit className="w-2.5 h-2.5 cursor-pointer" />
                          </button>
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <button 
                          onClick={() => startEdit(doc)}
                          className="text-[10px] font-bold font-mono text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" /> Edit staff profile
                        </button>
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          ID: {doc.id}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Workload Chart Side Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-850 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Activity className="w-4 h-4 text-sky-505 text-sky-500" />
              Live Clinical Case Allocation Metrics
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Real-time monitoring of physician backlogs to distribute incoming triage cases efficiently and avoid surgeon burnout.
            </p>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseloadData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontFamily="monospace" />
                <YAxis stroke="#94a3b8" fontSize={9} fontFamily="monospace" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '12px', 
                    borderColor: '#e2e8f0',
                    color: '#0f172a',
                    fontFamily: 'monospace',
                    fontSize: '11px'
                  }} 
                />
                <Bar dataKey="cases" radius={[4, 4, 0, 0]}>
                  {caseloadData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.status === 'In Surgery' ? '#f43f5e' : entry.cases >= 3 ? '#f59e0b' : '#0ea5e9'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-sky-50 border border-sky-100 rounded-xl space-y-1.5 text-xs text-slate-600">
            <h5 className="font-bold text-sky-800 flex items-center gap-1 font-mono text-[11px] uppercase">
              <HelpCircle className="w-3.5 h-3.5" />
              Triage Advice:
            </h5>
            <p className="leading-snug">
              Recommend dispatching new cardiology calls to practitioners with lower workload metrics below 3 cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
