/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, Cpu, Radio, Shield, HelpCircle, Save } from 'lucide-react';

export default function SystemSettingsView() {
  const [modelType, setModelType] = useState('gemini-2.5-flash');
  const [telemetryRate, setTelemetryRate] = useState('5s');
  const [enableAlertSound, setEnableAlertSound] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  return (
    <div id="settings-panel" className="space-y-6">
      
      {/* Page Instruction Guide */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm text-xs">
        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
          <Settings className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-1 text-slate-600">
          <h4 className="font-extrabold text-emerald-800 font-mono uppercase tracking-wider flex items-center gap-1">
            ⚙️ SYSTEM SETTINGS CONFIGURATION GUIDE
          </h4>
          <p className="text-slate-500 font-sans">
            Customize AI inference models, global telemetry count timers, and audit logs:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 font-sans pl-1">
            <li><strong>AI Inference Model Agent</strong>: Allows choosing the correct model version representing the cognitive diagnostic advisor.</li>
            <li><strong>Telemetry Countdown Rate</strong>: Defines how fast clinical monitor panels pull live oxygen LPM values and heartbeat rates.</li>
            <li><strong>Save Global Settings</strong>: Apply choices to update live workspace metrics instantly across the Emergix hospital console.</li>
          </ul>
        </div>
      </div>
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            Emergix System Configuration Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">Configure server-side Gemini intelligence models, medical telemetry rates, and hospital profile parameters.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main form settings */}
        <form onSubmit={handleSave} className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-xs font-mono text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-sky-505" /> Global Neural & AI Telemetry
            </h3>
            {isSaved && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-mono font-bold px-2.5 py-1 rounded border border-emerald-200">
                ✓ SETTINGS CACHED ON SERVER
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-700 block">AI INFERENCE MODEL AGENT:</label>
              <select 
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 font-mono"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Ultralight, Low Latency)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Clinical Diagnostics, Fine-Tuned)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Legacy, Broad Context Window)</option>
              </select>
              <span className="text-[10px] text-slate-400 block font-mono">Selects the default LLM pipeline utilized for patient triage advice.</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-700 block">TELEMETRY COUNTDOWN TICK RATE:</label>
              <select
                value={telemetryRate}
                onChange={(e) => setTelemetryRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-sky-500 font-mono"
              >
                <option value="2s">Fast (2s interval telemetry updates)</option>
                <option value="5s">Normal (5s standard interval ticker)</option>
                <option value="10s">Consensus (10s eco-friendly tick saving)</option>
              </select>
              <span className="text-[10px] text-slate-400 block font-mono font-sans">Forces clinical monitors to sample vital updates at this frequency.</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-700 block py-1 border-t border-slate-100 pt-3">
              ALERT NOTIFICATION AUDIT SYSTEMS
            </h4>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={enableAlertSound}
                onChange={(e) => setEnableAlertSound(e.target.checked)}
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="text-xs text-slate-600 font-sans">Trigger audio synthesized sirens when critically hypoxic O2 states occur on beds.</span>
            </label>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> SAVE GLOBAL SETTINGS
            </button>
          </div>
        </form>

        {/* Info card sidebar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Shield className="w-4.5 h-4.5 text-emerald-600" />
              Security & Admin Link Integrity
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Emergix is configured utilizing full-stack SSL connections to hospital database nodes. Standard credential audits occur every 24 hours.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
            <div>• Host Link: <span className="text-slate-800">0.0.0.0:3000</span></div>
            <div>• Database Node: <span className="text-[#00B25C] font-semibold">Active Engine</span></div>
            <div>• HMR Status: <span className="text-slate-400">Disabled on host</span></div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-100 font-mono">
            <HelpCircle className="w-3.5 h-3.5 text-sky-505" />
            <span>Operational Mode: DEMO PREVIEW</span>
          </div>
        </div>
      </div>
    </div>
  );
}
