/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, Zap, Flame, Radio, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SimulatorControlProps {
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onInjectEmergency: () => void;
  onTriggerVitalsAnomaly: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export default function SimulatorControl({
  isSimulating,
  onToggleSimulation,
  onInjectEmergency,
  onTriggerVitalsAnomaly,
  speed,
  onSpeedChange,
}: SimulatorControlProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div id="sim-control-widget" className="relative bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSimulating ? 'bg-emerald-400' : 'bg-slate-350 bg-slate-300'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSimulating ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
          </span>
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-500">
            EMERGIX DEMO SIMULATOR
          </h3>
        </div>
        <button 
          onClick={() => setShowTooltip(!showTooltip)} 
          className="text-slate-400 hover:text-sky-505 hover:text-sky-500 transition-colors"
          title="Simulator Help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-[11px] text-slate-500 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-150 border-slate-200/80 leading-relaxed font-mono"
          >
            <p className="mb-1 text-sky-600 font-bold">⚡ DEMO AUTO-SIMULATION ENGINE:</p>
            <p className="mb-1">• **Live Tick**: Fluctuates patient vitals (heart rhythm metrics, oxygen sat) and fleet transits.</p>
            <p className="mb-1">• **Siren Signal**: Inbound emergency dispatches.</p>
            <p className="mb-1">• **Collapse Event**: Injects hypoxic anomaly drop codes on patients.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          id="btn-toggle-sim"
          onClick={onToggleSimulation}
          className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold font-mono transition-all duration-300 ${
            isSimulating
              ? 'bg-amber-50 hover:bg-amber-100/60 border border-amber-200 text-amber-700'
              : 'bg-emerald-50 hover:bg-emerald-100/60 border border-emerald-200 text-emerald-700'
          }`}
        >
          {isSimulating ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              PAUSE
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              PLAY
            </>
          )}
        </button>

        <button
          id="btn-inject-emg"
          onClick={onInjectEmergency}
          className="flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 border border-rose-200 hover:bg-rose-100/60 text-red-700 rounded-xl text-xs font-semibold font-mono transition-all duration-300"
        >
          <Flame className="w-3.5 h-3.5 animate-pulse" />
          SIREN REG
        </button>
      </div>

      <button
        id="btn-trigger-anomaly"
        onClick={onTriggerVitalsAnomaly}
        className="w-full mb-3.5 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-red-50 to-amber-50 hover:from-rose-100 h-10 hover:to-amber-100/80 border border-rose-200 hover:border-red-400 text-red-700 rounded-xl text-xs font-semibold font-mono transition-all duration-300 shadow-sm"
      >
        <Zap className="w-3.5 h-3.5 text-amber-500" />
        INJECT BED CRISIS (O3)
      </button>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] text-slate-400 font-mono font-semibold">
          <span>SAMPLING TICK SPEED:</span>
          <span className="text-sky-600 font-bold">{speed}s INTERVAL</span>
        </div>
        <div className="flex gap-1">
          {[2, 5, 10, 20].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`flex-1 py-1 rounded-md text-[10px] font-mono border transition-all ${
                speed === s
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s}s
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono border-t border-slate-100 pt-3">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>CYBERSEC COGNITIVE LOCK SECURE</span>
      </div>
    </div>
  );
}
