/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  HelpCircle, 
  MapPin, 
  User, 
  Flame, 
  Bed, 
  Truck, 
  Brain, 
  Bot, 
  LayoutDashboard, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  Clipboard,
  ShieldAlert,
  Terminal,
  Clock,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

export default function UserGuideView() {
  const [activeManual, setActiveManual] = useState<string>('intro');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    'login': true,
    'dashboard': false,
    'dispatch': false,
    'twin': false,
    'icu': false,
    'radar': false,
    'ai-triage': false,
    'ai-ask': false
  });

  const toggleStep = (stepKey: string) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  const manualSections = [
    {
      id: 'intro',
      label: '🚀 Introduction & Setup',
      icon: BookOpen,
      title: 'Emergix Intelligent System Overview',
      subtitle: 'Emergix is an AI-augmented emergency healthcare hub designed for instant triage, real-time telemetry streaming, and automated resource distribution.',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed font-sans">
            Welcome to the Emergix Main Operating Guide. This system streamlines critical decision-making processes for medical dispatchers, emergency physicians, ICU nurses, ambulance fleet operator crews, and clinic receptionists.
          </p>
          
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-3 font-mono text-xs">
            <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-250 pb-1.5">
              <Terminal className="w-4 h-4 text-teal-600" />
              SYSTEM ROLE ACCOUNT PRIVILEGES
            </h4>
            <div className="space-y-2 text-[11px] text-slate-600 leading-normal">
              <div>🏥 <strong className="text-slate-805">Admin (Chief of Medicine):</strong> Unrestricted access to all core monitors, charts, rosters, system parameter simulators, and medical twin vaults.</div>
              <div>🧑‍⚕️ <strong className="text-slate-805">Doctor (Physician Command):</strong> Privileges to modify patient profiles, execute AI triage, track ambulance ETA, and consult Joshuaa.</div>
              <div>🩹 <strong className="text-slate-805">Nurse (Care Coordinator):</strong> Full access to Patient digital twins, ICU bed matrices, and ventilator overrides.</div>
              <div>📞 <strong className="text-slate-805">Receptionist (Admissions Officer):</strong> Access to admissions queue, clinic calendar appointment books, and system logs.</div>
              <div>🚑 <strong className="text-slate-805">Ambulance Operator (Fleet driver):</strong> Full access to active Siren Handover queue and real-time Ambulance Radar map telemetry.</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-xs font-sans">Getting Started Path:</h4>
            <div className="space-y-1.5">
              <label className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-305 hover:bg-slate-50/55 transition-all text-xs cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={completedSteps.login} 
                  onChange={() => toggleStep('login')}
                  className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5" 
                />
                <div>
                  <span className={`font-bold block ${completedSteps.login ? 'line-through text-slate-400' : 'text-slate-800'}`}>Step 1: Session Authenticator</span>
                  <span className="text-[10px] text-slate-400 block">Switch user profiles in the top header menu to test role-based accessibility walls.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      label: '📊 Command Hub Guide',
      icon: LayoutDashboard,
      title: 'Command Hub Home Monitor',
      subtitle: 'The centralized system dashboard showcasing overall clinic loads, inbound sirens, and clinical throughput telemetry.',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed font-sans text-xs">
            The Command Hub gathers widgets representing active sirens, patient census levels, bed occupancies, and physician load coefficients. It is your ultimate real-time birds-eye-view of hospital health.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 border border-slate-200 bg-white rounded-xl space-y-1">
              <span className="font-extrabold text-[10px] font-mono text-sky-650 text-sky-600 block uppercase">Dynamic Widgets</span>
              <p className="text-[11px] text-slate-505 text-slate-500 leading-normal">
                Click any numeric value widget to immediately jump to the respective detail tab view (e.g., clicking Bed Occupancy redirects to ICU Bed Matrix).
              </p>
            </div>
            <div className="p-3 border border-slate-200 bg-white rounded-xl space-y-1">
              <span className="font-extrabold text-[10px] font-mono text-indigo-650 text-indigo-600 block uppercase">Continuous Simulation Ticker</span>
              <p className="text-[11px] text-slate-500 leading-normal">
                Use the bottom left Simulator board to pause/resume time or speed up continuous patient vitals fluctuations and transit telemetry.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-805 text-slate-800 text-xs">Command Hub Checklist:</h4>
            <label className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-350 transition-all text-xs cursor-pointer">
              <input 
                type="checkbox" 
                checked={completedSteps.dashboard} 
                onChange={() => toggleStep('dashboard')}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5" 
              />
              <div>
                <span className={`font-bold block ${completedSteps.dashboard ? 'line-through text-slate-400' : 'text-slate-800'}`}>Verify AI Surge predictions</span>
                <span className="text-[10px] text-slate-400 block">Click "Predict Surge Load" in the top bar to trigger neural forecasting projections.</span>
              </div>
            </label>
          </div>
        </div>
      )
    },
    {
      id: 'dispatch',
      label: '🚨 Triage & Ambulance Dispatch',
      icon: Flame,
      title: 'Sirens & Inbound Triage Dispatch Queue',
      subtitle: 'Receive active paramedic siren transmissions, triage priority levels, and trigger ICU bed admission handovers.',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed font-sans text-xs">
            When raw symptoms stream into the dispatch logs, clinical command operators coordinate response efforts using spatial and severity indicators.
          </p>

          <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl space-y-2 font-mono text-[11px] text-rose-800">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-600 animate-pulse" />
              SATELLITE HANDOVER DISPATCH PROTOCOL:
            </div>
            <ol className="list-decimal list-inside space-y-1 text-rose-700 font-medium">
              <li>Click <strong className="text-rose-900">"Manual Dispatch Directive"</strong> widget to declare a new emergencg case.</li>
              <li>Input details like Patient Name, symptom indicators, and select Priority Severity.</li>
              <li>Confirm to automatically assign the nearest stationary vehicle.</li>
              <li>Once the ambulance arrives at the bay, click <strong className="text-rose-900">"Admit Handover"</strong> to reserve an open ICU bed!</li>
            </ol>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-800 text-xs">Siren & Handover Checklist:</h4>
            <label className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-350 transition-all text-xs cursor-pointer">
              <input 
                type="checkbox" 
                checked={completedSteps.dispatch} 
                onChange={() => toggleStep('dispatch')}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5" 
              />
              <div>
                <span className={`font-bold block ${completedSteps.dispatch ? 'line-through text-slate-400' : 'text-slate-800'}`}>Dispatch an incoming ambulance</span>
                <span className="text-[10px] text-slate-400 block">Create an emergency using the manual dispatch form and observe the transit animation.</span>
              </div>
            </label>
          </div>
        </div>
      )
    },
    {
      id: 'patients',
      label: '🧬 Digital Twin Management',
      icon: Activity,
      title: 'Continuous Clinical Twins Vault',
      subtitle: 'Graph precise vitals waveforms, adjust active medication lists, and run AI differential diagnoses.',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed font-sans text-xs">
            Every admitted resident is assigned a clinical digital twin node. This node coordinates visual area graphs, scheduled medication trackers, and lab findings.
          </p>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 font-mono text-[11px] text-slate-600">
            <div>📊 <strong className="text-slate-800">Vitals Sliders:</strong> Drag sliders to simulate raw heart-rate beats, blood pressure spikes, temperature drops, or blood sugar drifts in real time.</div>
            <div>📉 <strong className="text-slate-800">Live Waveform Graph:</strong> Toggle tabs above the area charts (PULSE, BP, SUGAR) to observe live-updating streams.</div>
            <div>🧠 <strong className="text-slate-800">AI Clinical Insights:</strong> Click "Generate AI Case Summary" to request clinical projections from Joshuaa.</div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-800 text-xs">Health Twin Checklist:</h4>
            <label className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-350 transition-all text-xs cursor-pointer">
              <input 
                type="checkbox" 
                checked={completedSteps.twin} 
                onChange={() => toggleStep('twin')}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5" 
              />
              <div>
                <span className={`font-bold block ${completedSteps.twin ? 'line-through text-slate-400' : 'text-slate-800'}`}>Pencil Editing Controls</span>
                <span className="text-[10px] text-slate-400 block">Click the pencil icon next to the patient's name, diagnosis, or age parameters to modify them immediately inline.</span>
              </div>
            </label>
          </div>
        </div>
      )
    },
    {
      id: 'icu',
      label: '🛌 ICU Bed Matrix guide',
      icon: Bed,
      title: 'ICU Ward Command & Ventilator Register',
      subtitle: 'Coordinate intensive bed assignments, toggle mechanical ventilator levels, and monitor oxygen flows.',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed font-sans text-xs">
            Beds are segmented by unit specialties (ICU, CCU, NICU, Trauma). Each bay shows live telemetry links from the patient twin's metrics.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
            <div className="p-3 border border-slate-200 bg-white rounded-xl">
              <span className="font-bold text-sky-600 block">🌪️ VENTILATOR CONTROLLER</span>
              <span>Click the Wind turbine button in each occupied bed cell to toggle the mechanical ventilator state.</span>
            </div>
            <div className="p-3 border border-slate-200 bg-white rounded-xl">
              <span className="font-bold text-emerald-600 block">🚪 DISCHARGE PATIENT</span>
              <span>When the patient stabilizes, click "Discharge Patient" to release the bay and recycle the resource.</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-800 text-xs">ICU Matrix Checklist:</h4>
            <label className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-350 transition-all text-xs cursor-pointer">
              <input 
                type="checkbox" 
                checked={completedSteps.icu} 
                onChange={() => toggleStep('icu')}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5" 
              />
              <div>
                <span className={`font-bold block ${completedSteps.icu ? 'line-through text-slate-400' : 'text-slate-800'}`}>Change Oxygen flow value</span>
                <span className="text-[10px] text-slate-400 block">Click the pencil icon next to "Ventilator" to edit oxygen levels (LPM) or specialty units of the bed station.</span>
              </div>
            </label>
          </div>
        </div>
      )
    },
    {
      id: 'help',
      label: '💬 Meet Joshuaa (AI)',
      icon: Bot,
      title: 'Your Dedicated Clinical Intelligence Assistant',
      subtitle: 'Joshuaa is always active, providing helpful, fun, and immediate solutions to medical queries, clinical checklists, or software navigation problems.',
      content: (
        <div className="space-y-4">
          <p className="text-slate-600 leading-relaxed font-sans text-xs">
            Joshuaa is designed to offer constant aid. Ask him about medication dosages, patient status summaries, ICU transfer protocols, or general questions!
          </p>

          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5 font-sans">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              PRO-TIPS FOR CHATTING WITH JOSHUAA:
            </div>
            <ul className="list-disc list-inside space-y-1 text-indigo-805 text-indigo-700 leading-normal">
              <li>Open the <strong className="text-indigo-900">"AI Operations Advisor"</strong> tab for an immersive terminal chat experience.</li>
              <li>Or click the hovering circular smart widget in the bottom right corner of the page to chat with him at any second, regardless of your active page!</li>
              <li>Ask him to generate a medical checklist or explain diagnostic terms! He's always ready to assist and loves keeping clinical discussions fun and energetic.</li>
            </ul>
          </div>

          <div className="space-y-2 pt-2">
            <h4 className="font-bold text-slate-800 text-xs">Intelligence Checklist:</h4>
            <label className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-350 transition-all text-xs cursor-pointer">
              <input 
                type="checkbox" 
                checked={completedSteps.ai_ask} 
                onChange={() => toggleStep('ai_ask')}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5" 
              />
              <div>
                <span className={`font-bold block ${completedSteps.ai_ask ? 'line-through text-slate-400' : 'text-slate-800'}`}>Consult the Global Widget</span>
                <span className="text-[10px] text-slate-400 block">Click the floating circle model in the bottom right and type "Hi Joshuaa! Help me triage a high heart rate patient".</span>
              </div>
            </label>
          </div>
        </div>
      )
    }
  ];

  const currentManual = manualSections.find(m => m.id === activeManual) || manualSections[0];

  return (
    <div id="emergix-user-guidebook-view" className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5.5 h-5.5 text-teal-600" />
            Emergix Operational Manual & Staff Guidebook
          </h2>
          <p className="text-xs text-slate-450 text-slate-400 font-mono uppercase tracking-wide">Interactive on-call tutorials, privilege indexes, and diagnostic checklists</p>
        </div>
        
        <div className="p-1 px-3 bg-teal-50 border border-teal-200 text-teal-700 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-inner">
          <CheckCircle2 className="w-4 h-4 text-teal-650" />
          <span>TRAINING STATUS: LEVEL VERIFIED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation Sidebar of the manual */}
        <div className="md:col-span-1 space-y-2">
          <span className="text-[9px] text-slate-400 font-mono uppercase tracking-widest block font-bold mb-1">
            MANUAL INDEX MODULES
          </span>
          <div className="space-y-1.5">
            {manualSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveManual(sec.id)}
                className={`w-full flex items-center justify-between text-left p-3.5 rounded-xl border font-sans text-xs font-bold transition-all ${
                  activeManual === sec.id
                    ? 'bg-gradient-to-r from-teal-50 to-emerald-50/40 border-teal-300 text-teal-900 shadow-sm'
                    : 'bg-slate-50/50 hover:bg-slate-50 border-slate-205 border-slate-200 text-slate-650 text-slate-605'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <sec.icon className={`w-4 h-4 shrink-0 ${activeManual === sec.id ? 'text-teal-650 text-teal-600' : 'text-slate-400'}`} />
                  <span>{sec.label}</span>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 ${activeManual === sec.id ? 'text-teal-600' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic content display pane */}
        <div className="md:col-span-2 bg-slate-50/30 border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 font-sans tracking-tight">
              {currentManual.title}
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans mt-1">
              {currentManual.subtitle}
            </p>
          </div>

          <div className="pt-1">
            {currentManual.content}
          </div>
        </div>

      </div>

    </div>
  );
}
