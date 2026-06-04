/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Activity, 
  Flame, 
  Bed, 
  Truck, 
  Brain, 
  BellRing, 
  ShieldAlert, 
  Sparkles,
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Patient, EmergencyCase, Ambulance, IcuBed, Doctor, SystemNotification } from '../types';
import { motion } from 'motion/react';

interface DashboardViewProps {
  patients: Patient[];
  emergencies: EmergencyCase[];
  ambulances: Ambulance[];
  icuBeds: IcuBed[];
  doctors: Doctor[];
  notifications: SystemNotification[];
  logs: string[];
  onNavigateToTab: (tab: string) => void;
  onRunAIPrediction: () => Promise<void>;
  aiPrediction: {
    bottleneckWarning: string;
    recs: string[];
    overflowRiskPercent: number;
    summary: string;
    loading: boolean;
  };
}

export default function DashboardView({
  patients,
  emergencies,
  ambulances,
  icuBeds,
  doctors,
  notifications,
  logs,
  onNavigateToTab,
  onRunAIPrediction,
  aiPrediction
}: DashboardViewProps) {
  
  const occupiedBedCount = icuBeds.filter(b => b.occupied).length;
  const criticalPatientCount = patients.filter(p => p.riskLevel === 'Critical').length;
  const activeAmbulanceCount = ambulances.filter(a => a.status !== 'Available').length;
  const activeEmergenciesCount = emergencies.filter(e => e.status !== 'Admitted').length;

  const chartData = [
    { time: '14:00', inflow: 3, trauma: 1, ccu: 2 },
    { time: '15:00', inflow: 5, trauma: 2, ccu: 3 },
    { time: '16:00', inflow: 8, trauma: 3, ccu: 4 },
    { time: '17:00', inflow: 4, trauma: 1, ccu: 3 },
    { time: '18:00', inflow: activeEmergenciesCount + 2, trauma: criticalPatientCount, ccu: occupiedBedCount - 4 },
  ];

  return (
    <div id="dashboard-tab-view" className="space-y-6">
      
      {/* Dynamic Guideline Notes */}
      <div className="bg-[#0f172a] text-slate-100 p-4 border border-slate-800 rounded-2xl flex items-start gap-3.5 shadow-sm">
        <div className="bg-teal-500/15 p-2 rounded-xl text-teal-400 shrink-0 mt-0.5">
          <Brain className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-extrabold text-teal-300 font-mono uppercase tracking-wider flex items-center gap-1.5 text-xs">
            🏥 OPERATIONAL MANUAL: SYSTEM OVERVIEW & WORKFLOWS
          </h4>
          <p className="text-slate-300 leading-relaxed max-w-4xl">
            Welcome to the Emergix CRM Command Suite! This panel consolidates live ward variables, fleet dispatch, and predictive surgery scheduling:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
            <li><strong>Intake dispatching</strong>: Select the <strong>Siren Handover</strong> tab to manage active paramedic routes, confirm hospital handovers, and allocate open ICU beds.</li>
            <li><strong>Digital Twins & Vitals</strong>: Go to <strong>Digital Health Twins</strong> to tweak clinical parameters, diagnose records, adjust patient settings, or chat with our automated advisor.</li>
            <li><strong>Bed Constraints</strong>: Visit <strong>ICU Beds Matrix</strong> to adjust ventilator statuses or scale total bed configurations of the departments.</li>
            <li><strong>Surgical Schedules</strong>: Click the <strong>Appointments</strong> tab to plan upcoming critical operations or set patient discharge limits on our Monthly Calendar.</li>
          </ul>
        </div>
      </div>
      
      {/* Top Cards (Live Statistics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigateToTab('emergency')}
          className="cursor-pointer bg-white border border-slate-200/80 hover:border-red-400 p-5 rounded-2xl relative overflow-hidden transition-all duration-200 hover:shadow-md group shadow-sm flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 text-red-500 group-hover:scale-110 transition-transform">
            <Flame className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-red-600 uppercase">
                ACTIVE EMERGENCIES
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {activeEmergenciesCount}
              </span>
              <span className="text-xs text-slate-500 font-mono">enroute cases</span>
            </div>
          </div>
          <div className="mt-4 text-[10px] text-slate-500 font-mono border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Critical Severity Inflows:</span>
            <span className="text-red-600 font-bold">Priority Triage</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigateToTab('icu')}
          className="cursor-pointer bg-white border border-slate-200/80 hover:border-teal-400 p-5 rounded-2xl relative overflow-hidden transition-all duration-200 hover:shadow-md group shadow-sm flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 text-teal-500 group-hover:scale-110 transition-transform">
            <Bed className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 bg-teal-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-teal-600 uppercase">
                ICU BED TRACKING
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {icuBeds.length - occupiedBedCount}
              </span>
              <span className="text-xs text-slate-500 font-mono">beds free of {icuBeds.length}</span>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-teal-500 h-1.5 rounded-full" 
                style={{ width: `${(occupiedBedCount / icuBeds.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-[9px] text-slate-400 font-mono flex justify-between pt-0.5">
              <span>utilization:</span>
              <span className="text-teal-600 font-bold">{Math.round((occupiedBedCount / icuBeds.length) * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigateToTab('ambulance')}
          className="cursor-pointer bg-white border border-slate-200/80 hover:border-amber-400 p-5 rounded-2xl relative overflow-hidden transition-all duration-200 hover:shadow-md group shadow-sm flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 text-amber-500 group-hover:scale-110 transition-transform">
            <Truck className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2 w-2 bg-amber-500 rounded-full"></span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase">
                AMBULANCE DISPATCH
              </span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {activeAmbulanceCount}
              </span>
              <span className="text-xs text-slate-500 font-mono">active transits</span>
            </div>
          </div>
          <div className="mt-4 text-[10px] text-slate-500 font-mono border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Fleet Availability:</span>
            <span className="text-amber-600 font-bold">{ambulances.length - activeAmbulanceCount} idle bays</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigateToTab('predictions')}
          className="cursor-pointer bg-white border border-slate-200/80 hover:border-indigo-400 p-5 rounded-2xl relative overflow-hidden transition-all duration-200 hover:shadow-md group shadow-sm flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 p-3 opacity-10 text-indigo-500 group-hover:rotate-12 transition-transform">
            <Brain className="w-12 h-12" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase">
                AI COGNITIVE HAZARDS
              </span>
            </div>
            <div className="flex items-baseline gap-1 pt-1">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
                {aiPrediction.overflowRiskPercent}%
              </span>
              <span className="text-xs text-indigo-500 font-mono font-bold">surge rating</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1 bg-indigo-50/50 border border-indigo-100 rounded-lg py-1 px-1.5 text-[9px] text-indigo-700 font-mono">
            <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
            <span className="truncate">{aiPrediction.loading ? 'Forecasting workload...' : aiPrediction.bottleneckWarning || 'RUN SURGE PREDICTIONS'}</span>
          </div>
        </div>
      </div>

      {/* AI Advisory summary banner */}
      {aiPrediction.summary && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 border border-indigo-200/60 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="flex items-start gap-3">
            <div className="bg-indigo-100 border border-indigo-200 p-2 rounded-xl text-indigo-600 mt-1 md:mt-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold font-mono tracking-wider text-indigo-800 uppercase">
                AI PREDICTIVE COGNITIVE ADVISORY (NEXT 4 Hours)
              </h4>
              <p className="text-xs text-indigo-950 leading-relaxed max-w-4xl mt-1 font-semibold">
                {aiPrediction.summary}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1 shrink-0 mt-2 md:mt-0">
            <div className="flex items-center gap-1.5 bg-white border border-indigo-200/50 p-1.5 rounded-lg text-[10px] text-indigo-700 font-mono">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Forecast Generated Live</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analytics chart and Symptoms stand */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Path Inflow Waveform */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Real-Time Patient Inflow Waveform
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Continuous triage workload projection indices</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 font-bold">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-teal-500 rounded-sm"></span> Total Inflows
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-red-400 rounded-sm"></span> Intensive Trauma Hold
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInflow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorTrauma" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
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
                <Area type="monotone" dataKey="inflow" stroke="#14b8a6" fillOpacity={1} fill="url(#colorInflow)" strokeWidth={2.5} name="Total Hourly Inflow" />
                <Area type="monotone" dataKey="trauma" stroke="#ef4444" fillOpacity={1} fill="url(#colorTrauma)" strokeWidth={1.5} name="Intensive Trauma Patients" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Symptoms Monitor */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500 heart-pulse" />
              Symptom Vital Monitor (Beds)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Physiological vital telemetry tracking</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[250px] pr-1 flex-1">
            {patients.slice(0, 3).map((pat) => (
              <div 
                key={pat.id} 
                onClick={() => onNavigateToTab('patients')}
                className="p-3 bg-slate-50 border border-slate-100 hover:border-slate-300 rounded-xl transition-all cursor-pointer flex items-center justify-between group shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img referrerPolicy="no-referrer" src={pat.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                      pat.riskLevel === 'Critical' ? 'bg-red-500' : 'bg-amber-500'
                    }`}></span>
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-sky-600 transition-colors">{pat.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate max-w-[125px] font-mono">{pat.condition}</p>
                  </div>
                </div>

                <div className="flex gap-1.5 font-mono text-xs">
                  <div className="text-center bg-white border border-slate-200 py-1 px-1.5 rounded-lg min-w-[45px]">
                    <div className="text-[9px] text-slate-400 font-bold">HR</div>
                    <div className={`font-semibold font-mono text-slate-800 ${pat.vitals.heartRate > 110 ? 'text-red-500 animate-pulse' : ''}`}>
                      {pat.vitals.heartRate}
                    </div>
                  </div>
                  <div className="text-center bg-white border border-slate-200 py-1 px-1.5 rounded-lg min-w-[45px]">
                    <div className="text-[9px] text-sky-505 text-sky-500 font-bold">SpO2</div>
                    <div className={`font-semibold font-mono ${pat.vitals.oxygenSat < 92 ? 'text-red-500 animate-pulse' : 'text-slate-800'}`}>
                      {pat.vitals.oxygenSat}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => onNavigateToTab('patients')}
            className="w-full mt-4 py-2.5 text-center text-xs font-mono font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors border border-sky-100 flex items-center justify-center gap-1"
          >
            SEE ALL DIGITAL TWINS <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Operational Logs & System alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
        {/* Live Logs feed */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <BellRing className="w-4 h-4 text-sky-505 text-sky-500 animate-pulse" />
              Live Operational Mission Feed
            </h3>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono py-0.5 px-2 rounded-full font-bold">
              UDP LIVE
            </span>
          </div>

          <div className="space-y-2 max-h-[190px] overflow-y-auto flex-1 pr-1">
            {logs.slice(0, 4).map((log, index) => (
              <div key={index} className="flex gap-2 text-[11px] font-mono leading-relaxed text-slate-600 p-2.5 bg-slate-50 border-l-2 border-sky-500 rounded-xl hover:bg-slate-100/80 transition-colors">
                <span className="text-sky-500 font-bold select-none">•</span>
                <span className="flex-1">{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate alerts Notices */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Urgent Clinical Warnings & Notifications
            </h3>
            <span className="text-[9px] bg-red-50 text-red-700 border border-red-250 border-red-200 font-mono py-0.5 px-2 rounded-full font-bold">
              {notifications.length} NOTICES
            </span>
          </div>

          <div className="space-y-2 max-h-[190px] overflow-y-auto flex-1 pr-1">
            {Array.from(new Map<string, SystemNotification>(notifications.map(n => [n.id, n])).values()).map((notif) => (
              <div 
                key={notif.id} 
                onClick={() => onNavigateToTab('notifications')}
                className={`p-3 border rounded-xl flex gap-3 items-start transition-all cursor-pointer hover:shadow-sm ${
                  notif.level === 'critical'
                    ? 'bg-red-50 border-red-200 text-slate-800'
                    : 'bg-slate-50 border-slate-200/60 text-slate-850'
                }`}
              >
                <div className={`p-1 rounded bg-white border shrink-0 text-sm shadow-sm ${notif.level === 'critical' ? 'border-red-200' : 'border-slate-200'}`}>
                  ⚠️
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800">{notif.title}</h4>
                    <span className="text-[9px] text-slate-400 font-mono font-semibold">{notif.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-normal">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
