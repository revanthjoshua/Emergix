/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Activity, Bed, Thermometer, Milestone } from 'lucide-react';

export default function AnalyticsView() {
  const trendHistory = [
    { day: 'Mon', admissions: 12, recoveries: 10, icuRate: 40 },
    { day: 'Tue', admissions: 18, recoveries: 14, icuRate: 55 },
    { day: 'Wed', admissions: 24, recoveries: 15, icuRate: 75 },
    { day: 'Thu', admissions: 15, recoveries: 19, icuRate: 60 },
    { day: 'Fri', admissions: 29, recoveries: 21, icuRate: 85 },
    { day: 'Sat', admissions: 35, recoveries: 28, icuRate: 90 },
    { day: 'Sun', admissions: 22, recoveries: 30, icuRate: 65 }
  ];

  const diseaseHeatmap = [
    { illness: 'Cardiac', cases: 45, color: '#f43f5e' },
    { illness: 'Respiratory', cases: 38, color: '#0ea5e9' },
    { illness: 'Trauma Injury', cases: 52, color: '#f59e0b' },
    { illness: 'Neurology', cases: 19, color: '#8b5cf6' },
    { illness: 'Sepsis / Fever', cases: 28, color: '#10b981' }
  ];

  return (
    <div id="analytics-panel" className="space-y-6">
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-sky-500" />
            Clinical Intelligence & Analytical Waveforms
          </h2>
          <p className="text-xs text-slate-500 mt-1">Cross-referencing continuous historic intakes, trauma recovery vectors, and pathogen heatmaps.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart: Patient Inflows vs Recoveries */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" />
                Continuous Roster Load & Patient Recovery Speeds
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Comparing intake trauma volumes with medical discharges over 7 days</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdmit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
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
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Area type="monotone" dataKey="admissions" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAdmit)" name="Shift Inbound Admissions" />
                <Area type="monotone" dataKey="recoveries" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRec)" name="Staff Discharged Recoveries" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Disease triage distribution */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Thermometer className="w-4.5 h-4.5 text-sky-505 text-sky-500" />
              Disease Sector Distribution Heatmap
            </h3>
            <p className="text-[11px] text-slate-400 mt-2">Active diagnostic frequencies present in currently monitored ICU/CCU beds.</p>
          </div>

          <div className="h-48 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseHeatmap} layout="vertical" margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis type="number" stroke="#94a3b8" fontSize={9} fontFamily="monospace" hide />
                <YAxis dataKey="illness" type="category" stroke="#94a3b8" fontSize={10} fontFamily="monospace" width={80} />
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
                <Bar dataKey="cases" radius={[0, 4, 4, 0]}>
                  {diseaseHeatmap.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hospital ICU Utilization over time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-2">
              <Bed className="w-4 h-4 text-indigo-500" />
              Weekly Static ICU Capacity Utilization Percentage Index
            </h3>
            <p className="text-[11px] text-slate-400">Continuous telemetry tracking bed occupancy percentage averages</p>
          </div>

          <div className="h-52 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
                <YAxis stroke="#94a3b8" fontSize={10} fontFamily="monospace" unit="%" />
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
                <Line type="monotone" dataKey="icuRate" stroke="#8b5cf6" strokeWidth={3} name="ICU Utilization %" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestone side block */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl text-center space-y-2">
            <Milestone className="w-8 h-8 text-sky-600 mx-auto" />
            <h4 className="text-sm font-bold text-sky-900">Hospital Output Milestone</h4>
            <p className="text-xs text-sky-700 leading-normal">
              Clinical telemetry report signifies a **14.2% drop** in ICU average stay times due to automated AI triage handovers.
            </p>
          </div>
          
          <div className="text-xs text-slate-500 font-mono space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="font-bold text-slate-700">CORE TELEMETRY STATISTICS:</div>
            <div>• Average response time: <span className="text-sky-600">4.2 mins</span></div>
            <div>• Survival index rating: <span className="text-emerald-600">99.84%</span></div>
            <div>• Max ambulance dispatch speed: <span className="text-amber-600">114 km/h</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Cell } from 'recharts';
