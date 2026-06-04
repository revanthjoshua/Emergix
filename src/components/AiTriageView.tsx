/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Brain, 
  Stethoscope, 
  Sparkles, 
  AlertOctagon, 
  Activity, 
  CheckCircle, 
  Compass, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TriageResult {
  urgencyLevel: 'Critical' | 'High' | 'Medium' | 'Stable';
  severityScore: number;
  probableDepartment: string;
  recs: string[];
  assessmentSummary: string;
}

export default function AiTriageView() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age: parseInt(age) || undefined, gender, symptoms })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Triage calculation failed.');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error executing AI symptoms triage. Please review API server logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Instruction Guide */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm text-xs">
        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-1 text-slate-600">
          <h4 className="font-extrabold text-emerald-800 font-mono uppercase tracking-wider flex items-center gap-1">
            🧠 SYMPTOM TRIAGE & DIAGNOSTIC DIRECTIVES HUB NOTES
          </h4>
          <p className="text-slate-500 font-sans">
            Identify severe presentation markers, query anatomical target sectors, and draft clinical department suggestions in real time:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 font-sans pl-1">
            <li><strong>Input Demographics</strong>: Formulate patient age, gender, and name identifiers on the left panel.</li>
            <li><strong>Describe Acute Symptoms</strong>: Type acute, raw complaints (e.g. <em>chronic radiating chest pain with diaphoresis</em>) into the prompt input box.</li>
            <li><strong>Analyze Outcomes</strong>: Press the <strong>"Analyze & Categorize Patient Symptoms"</strong> button to obtain urgency classifications, severity numbers, and recommended clinical pathways.</li>
          </ul>
        </div>
      </div>

      <div id="ai-triage-view" className="grid grid-cols-1 xl:grid-cols-5 gap-6">
      
      {/* Left Input form */}
      <div className="xl:col-span-2 bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between shadow-sm">
        <div>
          <div className="mb-4 pb-2 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <Brain className="text-indigo-500 w-4.5 h-4.5 animate-pulse" />
              Symptom-Triage Neural Analyst
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-sans">Input presenting complaints to trigger automated severity indexing</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs text-slate-705 text-slate-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">PATIENT NAME:</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Miller" 
                  className="w-full bg-slate-50 border border-slate-20 rounded-lg p-2.5 text-slate-800 font-sans outline-none focus:border-indigo-500"
                  id="triage-name-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">AGE:</label>
                  <input 
                    type="number" 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 58" 
                    className="w-full bg-slate-50 border border-slate-20 rounded-lg p-2.5 text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">GENDER:</label>
                  <select 
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-20 rounded-lg p-2.5 text-slate-800 outline-none focus:border-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-indigo-600 block mb-1 font-bold uppercase">
                PATIENT PRESENTATION SYMPTOMS / COGNITIVE REPORT:
              </label>
              <textarea 
                required 
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe presenting conditions e.g., Patient is experiencing sudden crushing chest pains under sternum that radiates to neck and left jaw. Suffering diaphoresis, hyperacusis and high panic. Historical double bypass 3 years ago." 
                className="w-full bg-slate-50 border border-slate-20 rounded-lg p-2.5 text-slate-805 text-slate-800 h-32 outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed text-xs"
                id="triage-symptoms-field"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 font-sans text-xs"
              id="triage-submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  COMPILING PHYSIOLOGICAL MATRIX...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  INITIATE CLINICAL AI TRIAGE
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-2.5 font-sans text-[10px] text-indigo-705 text-indigo-700 leading-normal font-semibold">
          <span>🛡️</span>
          <span>Emergix automated decision systems utilize Gemini reasoning metrics to generate prioritization categories. Clinicians must verify physiological traces before invasive incisions.</span>
        </div>
      </div>

      {/* Right Triage Analysis Outputs */}
      <div className="xl:col-span-3 min-h-[460px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading-spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center bg-white border border-slate-200/80 rounded-2xl p-8 w-full h-full space-y-4 shadow-sm"
            >
              <div className="relative">
                <Brain className="w-16 h-16 text-indigo-550 text-indigo-500 animate-pulse" />
                <span className="absolute inset-0 block h-full w-full rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin"></span>
              </div>
              <div className="text-center font-sans">
                <h4 className="text-sm font-bold text-slate-850 text-slate-800">CALCULATING CRITICAL CARE SEVERITY...</h4>
                <p className="text-xs text-slate-400 mt-1 font-mono">Running deep semantic clinical model parsing</p>
                <div className="mt-4 flex gap-1.5 text-[9px] text-slate-400 font-mono justify-center font-bold">
                  <span>Searching departments...</span>
                  <span>&bull; Listing urgent directives...</span>
                </div>
              </div>
            </motion.div>
          ) : result ? (
            <motion.div 
              key="triage-result-card"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 w-full h-full flex flex-col justify-between space-y-5 shadow-sm"
            >
              <div>
                {/* Result header urgency classifications */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight flex items-center gap-1.5 font-sans">
                      <CheckCircle className="text-emerald-500 w-4.5 h-4.5" />
                      Triage Evaluation Complete
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">EMERGIX NEURAL DECISION ANALYSIS ENG-TRIAGE</p>
                  </div>

                  <div className="flex gap-2">
                    <span className={`px-3 py-1 border rounded-lg font-mono text-xs font-bold leading-none uppercase tracking-wider ${
                      result.urgencyLevel === 'Critical' 
                        ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse'
                        : result.urgencyLevel === 'High'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : result.urgencyLevel === 'Medium'
                            ? 'bg-yellow-105 bg-yellow-105 bg-yellow-101 bg-yellow-100 text-amber-900 border-yellow-250 border-yellow-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-250 border-emerald-250'
                    }`}>
                      {result.urgencyLevel} RISK STATUS
                    </span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 font-mono text-xs">
                  
                  {/* Gauge score box */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1.5 md:col-span-1 shadow-inner">
                    <span className="text-[10px] text-slate-455 text-slate-400 block uppercase font-bold">SEVERITY SCORE</span>
                    <strong className={`text-2xl font-extrabold block ${
                      result.severityScore > 80 ? 'text-rose-600' : 'text-sky-600'
                    }`}>{result.severityScore} <span className="text-[10.5px] font-normal text-slate-400">/100</span></strong>
                    <div className="w-full bg-slate-200 rounded-full h-1">
                      <div 
                        className={`h-full rounded-full ${result.severityScore > 80 ? 'bg-rose-600' : 'bg-sky-505 bg-sky-500'}`}
                        style={{ width: `${result.severityScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Suggest department */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 md:col-span-3">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">SUGGESTED ADMISSION DEPT:</span>
                    <strong className="text-sm font-extrabold text-slate-800 block uppercase tracking-tight">
                      {result.probableDepartment}
                    </strong>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans font-semibold italic mt-1 leading-snug">
                      Priority admission pathways mapped on central bed roster grids.
                    </p>
                  </div>

                </div>

                {/* Synthesis review text */}
                <div className="mt-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                  <h4 className="text-[10px] text-indigo-905 text-indigo-700 font-mono font-bold uppercase mb-1.5 flex items-center gap-1">
                    <AlertOctagon className="w-3.5 h-3.5 text-indigo-600" />
                    CLINICAL PRESENTATION SYNTHESIS:
                  </h4>
                  <p className="text-xs text-indigo-950 leading-relaxed font-sans font-semibold">
                    {result.assessmentSummary}
                  </p>
                </div>

                {/* Nursing clinical recommendations lists */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-[10px] text-slate-500 font-mono uppercase tracking-widest font-bold">
                    IMMEDIATE CLINICAL ACTION DIRECTIVES:
                  </h4>
                  <div className="space-y-1.5 font-mono text-xs">
                    {result.recs.map((rec, index) => (
                      <div 
                        key={index} 
                        className="flex gap-2 text-xs text-slate-655 text-slate-600 p-2 bg-slate-50 border border-slate-150 border-slate-200 rounded-lg"
                      >
                        <span className="text-indigo-600 font-bold shrink-0">ORDER 0{index + 1}:</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-100 font-mono text-[9px] text-slate-400 justify-between items-center font-bold">
                <span>SYSTEM LINK LINK INTEGRITY ACTIVE</span>
                <span>DATA SIGN: CHG-EMERG-PROG</span>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="triage-error-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-rose-50 border border-rose-200 p-6 rounded-2xl text-center space-y-3 shadow-sm"
            >
              <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto animate-bounce" />
              <div className="font-mono text-xs">
                <h4 className="font-bold text-rose-800">AI CLINICAL SERVICES OFFLINE</h4>
                <p className="text-rose-700 leading-relaxed mt-1 max-w-sm mx-auto font-semibold font-sans">
                  {error}
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="border border-dashed border-slate-205 border-slate-200 rounded-2xl w-full h-[460px] flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-4">
              <Stethoscope className="w-12 h-12 text-slate-300" />
              <div className="max-w-md font-sans">
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Awaiting Symptoms Input Packet</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-semibold">
                  Complete the triage parameters in the left lane and click evaluation to request clinical priority recommendation parameters.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
    </div>
  );
}
