/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Search, 
  Brain, 
  Thermometer, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  Pill, 
  CheckCircle,
  Eye, 
  Bot,
  Sparkles,
  Zap,
  Droplet,
  Edit2,
  Info,
  XSquare
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import { Patient } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface PatientManagerViewProps {
  patients: Patient[];
  onUpdatePatientVitals: (patientId: string, updatedVitals: any) => void;
  onGenerateAISummary: (patient: Patient) => Promise<string>;
  onUpdatePatientDetails?: (patientId: string, updatedFields: Partial<Patient>) => void;
}

export default function PatientManagerView({
  patients,
  onUpdatePatientVitals,
  onGenerateAISummary,
  onUpdatePatientDetails
}: PatientManagerViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('All');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  // Edit details localized state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState(30);
  const [editGender, setEditGender] = useState('Male');
  const [editBloodType, setEditBloodType] = useState('O+');
  const [editCondition, setEditCondition] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Tab selections for digital twin telemetry graphs
  const [activeGraphTab, setActiveGraphTab] = useState<'pulse' | 'bp' | 'sugar'>('pulse');

  // AI thinking state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Initialize edit states when selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      setEditName(selectedPatient.name);
      setEditAge(selectedPatient.age);
      setEditGender(selectedPatient.gender);
      setEditBloodType(selectedPatient.bloodType);
      setEditCondition(selectedPatient.condition);
      setEditDept(selectedPatient.department);
      setEditAvatar(selectedPatient.avatar);
      setIsEditing(false);
    }
  }, [selectedPatientId, selectedPatient]);

  const handleSaveDetails = () => {
    if (onUpdatePatientDetails && selectedPatient) {
      onUpdatePatientDetails(selectedPatient.id, {
        name: editName,
        age: Number(editAge),
        gender: editGender,
        bloodType: editBloodType,
        condition: editCondition,
        department: editDept,
        avatar: editAvatar
      });
      setIsEditing(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'All' || p.riskLevel.replace('Risk', '').trim() === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const handleRunAIAnalysis = async () => {
    if (!selectedPatient) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const summary = await onGenerateAISummary(selectedPatient);
      setAiResult(summary);
    } catch (err) {
      setAiResult("Failed to retrieve diagnostics. Check console. Please ensure Gemini API configuration is active.");
    } finally {
      setAiLoading(false);
    }
  };

  // Change individual vital points in clinical demo mode
  const handleVitalSlide = (vitalName: string, value: number) => {
    if (!selectedPatient) return;
    const newVitals = {
      ...selectedPatient.vitals,
      [vitalName]: value
    };
    onUpdatePatientVitals(selectedPatient.id, newVitals);
  };

  return (
    <div id="patient-manager-view" className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      
      {/* Page Instruction Guide */}
      <div className="col-span-full bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm text-xs">
        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-slate-600">
          <h4 className="font-extrabold text-emerald-800 font-mono uppercase tracking-wider flex items-center gap-1">
            🧬 DIGITAL TWINS & COGNITIVE SUMMARIZATION WORKSPACE
          </h4>
          <p className="text-slate-500 font-sans">
            Oversee simulated vital sign trends, edit digital twin profiles in real time, and request automated clinical risk summaries:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 font-sans pl-1">
            <li><strong>Interactive Profile Editing</strong>: Select a patient profile on the left. Click the ✏️ <strong>"Edit Profile"</strong> link or pencil icon to change patient names, ages, genders, blood types, ward placements, or diagnosing details instantly.</li>
            <li><strong>Mock Vitals Drifts</strong>: Use the <strong>"Live Vital Signs Simulator Sliders"</strong> in the bottom right to drift pulse rates, blood system parameters and oxygen saturations on the continuous Recharts graph.</li>
            <li><strong>Requesting Joshuaa Summarization</strong>: Click standard <strong>"Generate Gemini Summary"</strong> to review neat, brief, and bulleted physician summaries of current patient histories.</li>
          </ul>
        </div>
      </div>
      
      {/* Column 1: Patient Search Sieve and Selection Grid */}
      <div className="xl:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-start h-[640px] shadow-sm">
        <div className="mb-4">
          <h3 className="font-semibold text-xs font-mono tracking-wider text-slate-500 uppercase mb-2">
            Triage Patient Sieve
          </h3>
          <div className="relative mb-3">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, Name..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-slate-800 outline-none focus:border-sky-500/60"
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {['All', 'Critical', 'High', 'Medium', 'Stable'].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`flex-1 py-1.5 px-1 border rounded font-mono text-[9px] uppercase font-bold transition-all ${
                  riskFilter === r
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Scalable Patient Rows List */}
        <div className="space-y-2 overflow-y-auto pr-1 flex-1">
          {filteredPatients.map((pat) => (
            <div 
              key={pat.id}
              onClick={() => {
                setSelectedPatientId(pat.id);
                setAiResult(null);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex gap-3 relative overflow-hidden ${
                selectedPatientId === pat.id 
                  ? 'bg-sky-50/70 border-sky-400 font-semibold shadow-sm' 
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <img src={pat.avatar} alt="" className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{pat.name}</h4>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-bold ${
                    pat.riskLevel === 'Critical' 
                      ? 'bg-rose-100 text-rose-800 border-rose-250 border-rose-200 animate-pulse' 
                      : pat.riskLevel === 'High Risk'
                        ? 'bg-amber-100 text-amber-800 border-amber-250 border-amber-200'
                        : pat.riskLevel === 'Medium Risk'
                          ? 'bg-yellow-100 text-yellow-850 text-amber-900 border-yellow-250 border-yellow-200'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-250 border-emerald-200'
                  }`}>
                    {pat.riskLevel === 'Critical' ? 'CRIT' : pat.riskLevel.split(' ')[0].toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans truncate mt-0.5">{pat.condition}</p>
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-100">
                  <span>ID: {pat.id}</span>
                  <span className="text-sky-600 font-bold">SpO2: {pat.vitals.oxygenSat}%</span>
                </div>
              </div>
            </div>
          ))}

          {filteredPatients.length === 0 && (
            <div className="text-center font-mono text-[10px] text-slate-400 py-6">
              No clinical twins found.
            </div>
          )}
        </div>
      </div>

      {/* Columns 2-4: The Digital Health Twin Center */}
      <div className="xl:col-span-3 space-y-6">
        
        {/* Patient Profile Header Card */}
        {selectedPatient ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/5 rounded-full blur-3xl"></div>
            
            {/* Inline guide system */}
            <div className="mb-4 bg-teal-50/50 border border-teal-100 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-slate-650 text-slate-600">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-teal-850">Help Tip:</span> Use the <strong className="text-teal-700">"Edit Patient Name & Details"</strong> button next to the patient badge to rename the patient, adjust their critical ward targeting department, shift age, or update core diagnostic statuses instantly.
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
              <div className="flex items-center gap-4 w-full">
                {isEditing ? (
                  <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center text-xs text-teal-500 shrink-0">
                    <input 
                      type="text" 
                      value={editAvatar} 
                      onChange={(e) => setEditAvatar(e.target.value)} 
                      className="w-12 text-center text-xl bg-transparent outline-none border-b border-teal-350 border-teal-300" 
                      title="Avatar Emoji URL or Character"
                    />
                    <span className="text-[8px] font-mono mt-0.5">AVATAR</span>
                  </div>
                ) : (
                  <img src={selectedPatient.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow shrink-0" />
                )}
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 block font-bold">NAME</label>
                          <input 
                            type="text" 
                            value={editName} 
                            onChange={(e) => setEditName(e.target.value)} 
                            className="text-xs font-bold text-slate-900 border border-slate-200 focus:border-teal-500 outline-none p-2 w-full bg-slate-50 rounded-xl"
                            placeholder="Patient Name"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 block font-bold">PRIMARY DIAGNOSIS</label>
                          <input 
                            type="text" 
                            value={editCondition} 
                            onChange={(e) => setEditCondition(e.target.value)} 
                            className="text-xs font-bold text-slate-900 border border-slate-200 focus:border-teal-500 outline-none p-2 w-full bg-slate-50 rounded-xl"
                            placeholder="Primary Diagnosis Condition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 block font-bold">AGE</label>
                          <input 
                            type="number" 
                            value={editAge} 
                            onChange={(e) => setEditAge(Number(e.target.value))} 
                            className="w-full text-slate-800 font-bold border border-slate-200 focus:border-teal-500 outline-none p-2 bg-slate-50 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 block font-bold">SEX</label>
                          <select 
                            value={editGender} 
                            onChange={(e) => setEditGender(e.target.value)} 
                            className="w-full text-slate-800 border border-slate-200 focus:border-teal-500 outline-none p-2 bg-slate-50 rounded-xl font-semibold"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 block font-bold">BLOOD GROUPS</label>
                          <select 
                            value={editBloodType} 
                            onChange={(e) => setEditBloodType(e.target.value)} 
                            className="w-full text-rose-600 border border-slate-200 focus:border-teal-500 bg-slate-50 outline-none p-2 rounded-xl font-bold font-mono"
                          >
                            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bt => (
                              <option key={bt} value={bt}>{bt}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-slate-400 block font-bold">WARD LOCATION</label>
                          <input 
                            type="text" 
                            value={editDept} 
                            onChange={(e) => setEditDept(e.target.value)} 
                            className="w-full text-emerald-600 font-extrabold border border-slate-200 focus:border-teal-500 outline-none p-2 bg-slate-50 rounded-xl"
                            placeholder="Ward Department"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-1">
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="px-3.5 py-2 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl transition-all font-bold"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleSaveDetails}
                          className="px-4 py-2 text-xs bg-teal-600 text-white rounded-xl hover:bg-teal-500 transition-all font-bold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-extrabold text-slate-900">{selectedPatient.name}</h2>
                        <span className="text-xs bg-slate-50 border border-slate-200 py-0.5 px-2 rounded-full font-mono text-sky-600 font-bold">
                          {selectedPatient.id}
                        </span>
                        <span className={`text-[10px] font-mono leading-none tracking-wide text-xs px-2 py-0.5 rounded-full font-bold border ${
                          selectedPatient.riskLevel === 'Critical' 
                            ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {selectedPatient.riskLevel.toUpperCase()}
                        </span>
                        
                        {/* Edit Button */}
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="ml-2 inline-flex items-center gap-1 text-[10px] font-mono text-teal-650 text-teal-600 hover:text-teal-700 bg-teal-50/50 hover:bg-teal-50 border border-teal-200/50 py-0.5 px-2 rounded-md font-bold transition-all"
                        >
                          <Edit2 className="w-3 h-3" /> Edit Patient Name & Details
                        </button>
                      </div>
                      
                      <p className="text-xs text-sky-600 font-mono font-bold mt-1 uppercase tracking-wide flex items-center gap-1.5">
                        PRIMARY DIAGNOSIS: {selectedPatient.condition}
                        <button 
                          onClick={() => setIsEditing(true)} 
                          type="button" 
                          className="text-slate-400 hover:text-sky-600 transition-colors p-0.5" 
                          title="Click to edit patient parameters"
                        >
                          <Edit2 className="w-3 h-3 cursor-pointer inline-block" />
                        </button>
                      </p>
                      
                      <div className="flex gap-4 text-[11px] text-slate-500 font-mono mt-2 flex-wrap items-center">
                        <span className="flex items-center gap-1">
                          Age: <strong className="text-slate-800">{selectedPatient.age}</strong>
                          <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-teal-600 transition-colors p-0.5" title="Edit patient details">
                            <Edit2 className="w-2.5 h-2.5 cursor-pointer" />
                          </button>
                        </span>
                        <span className="flex items-center gap-1">
                          Gender: <strong className="text-slate-800">{selectedPatient.gender}</strong>
                          <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-teal-600 transition-colors p-0.5" title="Edit patient details">
                            <Edit2 className="w-2.5 h-2.5 cursor-pointer" />
                          </button>
                        </span>
                        <span className="flex items-center gap-1">
                          Blood Type: <strong className="text-rose-600 font-bold">{selectedPatient.bloodType}</strong>
                          <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-teal-600 transition-colors p-0.5" title="Edit patient details">
                            <Edit2 className="w-2.5 h-2.5 cursor-pointer" />
                          </button>
                        </span>
                        <span className="flex items-center gap-1">
                          Ward Target: <strong className="text-emerald-600 font-extrabold">{selectedPatient.department}</strong>
                          <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-teal-600 transition-colors p-0.5" title="Edit patient details">
                            <Edit2 className="w-2.5 h-2.5 cursor-pointer" />
                          </button>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Triage summary action box */}
              {!isEditing && (
                <button
                  id="btn-run-clinical-ai"
                  disabled={aiLoading}
                  onClick={handleRunAIAnalysis}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 font-sans whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 animate-spin text-white" style={{ animationDuration: aiLoading ? '2s' : '0s' }} />
                  {aiLoading ? 'ANALYZING CLINICAL HISTORY...' : 'RUN CLINICAL AI REGISTRY'}
                </button>
              )}
            </div>
            
            {/* AI Diagnostics Drawer Output */}
            <AnimatePresence>
              {(aiResult || selectedPatient.summary) && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 p-4 bg-indigo-50/50 border border-indigo-200/60 rounded-xl space-y-2 relative"
                >
                  <div className="flex items-center gap-2 border-b border-indigo-100 pb-1.5 mb-2">
                    <Bot className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
                    <h4 className="text-xs text-indigo-900 font-mono font-bold uppercase tracking-wider">
                      CLINICAL ASSESSMENT DIAGNOSTIC INSIGHT REPORT
                    </h4>
                  </div>
                  <p className="text-xs text-indigo-950 leading-relaxed font-sans font-semibold">
                    {aiResult || selectedPatient.summary}
                  </p>
                  <div className="text-[9px] text-indigo-505 text-indigo-500 text-right mt-1 font-mono">
                    &bull; Emergix Neural AI engine &bull; HIPAA Compliant Diagnostic Sandbox
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}

        {/* Telemetry Slider Adjustments & Graph trends */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Vitals Telemetry Adjustment Sliders */}
          <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-4 space-y-4 shadow-sm">
            <div>
              <h3 className="font-semibold text-xs font-mono tracking-wider text-slate-500 uppercase mb-1">
                DEMO VITAL TUNERS
              </h3>
              <p className="text-[10px] text-slate-400 lead-snug">Adjust live vitals to test critical triage threshold alarms</p>
            </div>

            <div className="space-y-4">
              {/* HR slider */}
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 heart-pulse" /> Pulse Rate
                  </span>
                  <span className="text-slate-805 text-slate-800 font-bold">{selectedPatient.vitals.heartRate} bpm</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="180" 
                  value={selectedPatient.vitals.heartRate} 
                  onChange={(e) => handleVitalSlide('heartRate', parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* SpO2 slider */}
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-sky-505 text-sky-500" /> Oxygen Sat (SpO2)
                  </span>
                  <span className="text-sky-600 font-bold">{selectedPatient.vitals.oxygenSat}%</span>
                </div>
                <input 
                  type="range" 
                  min="70" 
                  max="100" 
                  value={selectedPatient.vitals.oxygenSat} 
                  onChange={(e) => handleVitalSlide('oxygenSat', parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Temp slider */}
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-505 text-slate-500 flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temperature
                  </span>
                  <span className="text-amber-600 font-bold">{selectedPatient.vitals.temperature}°C</span>
                </div>
                <input 
                  type="range" 
                  min="34" 
                  max="42" 
                  step="0.1"
                  value={selectedPatient.vitals.temperature} 
                  onChange={(e) => handleVitalSlide('temperature', parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Blood Sugar slider */}
              <div className="space-y-1 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5 text-indigo-500" /> Blood Sugar
                  </span>
                  <span className="text-indigo-600 font-bold">{selectedPatient.vitals.bloodSugar} mg/dL</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="500" 
                  value={selectedPatient.vitals.bloodSugar} 
                  onChange={(e) => handleVitalSlide('bloodSugar', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Clinical Graphing Core (Tabs for Pulse, BP, Sugar) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-505 text-sky-500" />
                  Chronological Telemetry Waveform
                </h3>
                <p className="text-xs text-slate-400">Live updating metrics graphing continuous reference margins</p>
              </div>

              <div className="flex gap-1 bg-slate-100 border border-slate-200/60 p-1 rounded-xl shrink-0">
                {(['pulse', 'bp', 'sugar'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveGraphTab(t)}
                    className={`py-1 px-2.5 rounded-lg font-mono text-[9px] font-bold uppercase transition-all ${
                      activeGraphTab === t
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t === 'pulse' ? 'PULSE' : t === 'bp' ? 'BP REF' : 'SUGAR'}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedPatient.history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeGraphTab === 'pulse' ? '#ef4444' : activeGraphTab === 'bp' ? '#0ea5e9' : '#f59e0b'} stopOpacity={0.15}/>
                      <stop offset="95%" stopColor={activeGraphTab === 'pulse' ? '#ef4444' : activeGraphTab === 'bp' ? '#0ea5e9' : '#f59e0b'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} fontFamily="monospace" />
                  <YAxis stroke="#94a3b8" fontSize={9} fontFamily="monospace" />
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
                  
                  {activeGraphTab === 'pulse' && (
                    <Area type="monotone" dataKey="heartRate" stroke="#ef4444" fillOpacity={1} fill="url(#colorWave)" strokeWidth={2.5} name="Pulse Rate (bpm)" />
                  )}
                  {activeGraphTab === 'bp' && (
                    <>
                      <Area type="monotone" dataKey="bpSystolic" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorWave)" strokeWidth={2.5} name="BP Systolic (mmHg)" />
                      <Line type="monotone" dataKey="bpDiastolic" stroke="#38bdf8" strokeWidth={1.5} name="BP Diastolic (mmHg)" dot={false} />
                    </>
                  )}
                  {activeGraphTab === 'sugar' && (
                    <Area type="monotone" dataKey="bloodSugar" stroke="#f59e0b" fillOpacity={1} fill="url(#colorWave)" strokeWidth={2.5} name="Blood Sugar (mg/dL)" />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Detailed Medication and Clinical Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
          
          {/* Active Nursing Medication Schedule */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-start shadow-sm">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
              <Pill className="w-4 h-4 text-emerald-500" />
              Active Medication & IV Roster
            </h3>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {selectedPatient.medications.map((med, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all flex items-center justify-between">
                  <div className="flex gap-2.5 items-center">
                    <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                      💊
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{med.name}</h4>
                      <div className="text-[10px] text-emerald-700 font-mono tracking-wider font-semibold">Dosage: {med.dosage} &bull; {med.frequency}</div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[9px] text-slate-400">
                    <div>Scheduled</div>
                    <div className="text-slate-700 font-bold">{med.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scan Files & Lab documents panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-start shadow-sm">
            <h3 className="font-semibold text-sm text-slate-800 flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-sky-505 text-sky-500" />
              Diagnostic Reports & Imaging Scans
            </h3>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {selectedPatient.reports.map((rep) => (
                <div key={rep.id} className="p-2.5 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl transition-all">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] bg-sky-50 text-sky-600 font-mono py-0.5 px-2 rounded-full border border-sky-100 font-bold">
                      {rep.category}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{rep.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-805 text-slate-800">{rep.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-normal mt-1 border-t border-slate-100 pt-1 font-sans font-semibold italic">
                    Findings: {rep.result}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
