/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Brain, Sparkles, TrendingUp, HelpCircle, AlertTriangle, Play, ShieldAlert } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PredictionsInsightViewProps {
  onRunAIPrediction: () => Promise<void>;
  aiPrediction: {
    bottleneckWarning: string;
    recs: string[];
    overflowRiskPercent: number;
    summary: string;
    loading: boolean;
  };
}

export default function PredictionsInsightView({ onRunAIPrediction, aiPrediction }: PredictionsInsightViewProps) {
  const forecastData = [
    { hour: '19:00', inflowRisk: 30, resourceUtilization: 45 },
    { hour: '20:00', inflowRisk: 55, resourceUtilization: 68 },
    { hour: '21:00', inflowRisk: 82, resourceUtilization: 91 },
    { hour: '22:00', inflowRisk: 42, resourceUtilization: 70 },
    { hour: '23:00', inflowRisk: 25, resourceUtilization: 48 },
    { hour: '00:00', inflowRisk: 15, resourceUtilization: 35 }
  ];

  return (
    <div id="ai-predictions-insight-panel" className="space-y-6">
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-500 animate-pulse" />
            AI Clinical Load & Overload Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1">Predictive clinical inflows, hospital bottlenecks, and neural-driven surge warnings.</p>
        </div>

        <button 
          onClick={onRunAIPrediction}
          disabled={aiPrediction.loading}
          className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: aiPrediction.loading ? '2s' : '0s' }} />
          {aiPrediction.loading ? 'FORECASTING BOTTLENECKS...' : 'RUN LIVE NEURAL FORECAST'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-indigo-505 text-indigo-500" />
              Surge & Capacity Forecasting Index (Next 6 Hours)
            </h3>
            <p className="text-xs text-slate-400 mt-1">Neural-modeled clinical intake threat parameters and static resource thresholds</p>
          </div>

          <div className="h-60 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorUtil" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} fontFamily="monospace" />
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
                <Area type="monotone" dataKey="inflowRisk" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRisk)" name="Inbound Surge Threat %" />
                <Area type="monotone" dataKey="resourceUtilization" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorUtil)" name="Resource Utilization Threat %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Forecast Card metrics */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-600 uppercase">
                AI HAZARD STATUS REPORT
              </span>
            </div>
            
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {aiPrediction.overflowRiskPercent}%
              </span>
              <span className="text-xs text-indigo-600 font-mono font-bold">Risk Rating</span>
            </div>
          </div>

          {/* Forecast Summary Banner */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl space-y-2">
            <h5 className="font-bold text-indigo-900 text-xs flex items-center gap-1 font-mono uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Symmetric Action Advice:
            </h5>
            <p className="text-xs text-indigo-700 leading-relaxed font-sans">
              {aiPrediction.summary || "Projections denote standard stability. Click 'Run Live Neural Forecast' to poll continuous clinician workloads."}
            </p>
          </div>

          {aiPrediction.bottleneckWarning && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 font-sans font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-rose-900 uppercase text-[10px] font-mono">NEURAL OVERLOAD DETECTED</span>
                {aiPrediction.bottleneckWarning}
              </div>
            </div>
          )}

          <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 border-t border-slate-100 pt-3 self-end w-full">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Updates calculated in parallel threads.</span>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {aiPrediction.recs && aiPrediction.recs.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            🎯 SYMMETRIC CLINIC DEFENSE RECOMMENDATIONS:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {aiPrediction.recs.map((rec, ind) => (
              <div key={ind} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-700 flex items-start gap-2 font-mono">
                <span className="bg-indigo-100 text-indigo-800 font-bold rounded-lg w-5 h-5 flex items-center justify-center shrink-0">
                  {ind + 1}
                </span>
                <span className="leading-snug">{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
