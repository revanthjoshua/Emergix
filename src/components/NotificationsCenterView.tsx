/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemNotification } from '../types';
import { BellRing, ShieldAlert, CheckCircle, Info, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationsCenterViewProps {
  notifications: SystemNotification[];
  logs: string[];
}

export default function NotificationsCenterView({ notifications, logs }: NotificationsCenterViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [notifList, setNotifList] = useState<SystemNotification[]>(notifications);

  React.useEffect(() => {
    setNotifList(notifications);
  }, [notifications]);

  const filteredNotifs = notifList.filter(n => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'critical') return n.level === 'critical' || n.level === 'alert';
    if (activeFilter === 'warning') return n.level === 'warning';
    return n.level === 'info';
  });

  const getBadgeStyle = (level: SystemNotification['level']) => {
    switch (level) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'alert':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-sky-100 text-sky-800 border-sky-200';
    }
  };

  const getIcon = (level: SystemNotification['level']) => {
    switch (level) {
      case 'critical':
      case 'alert':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'warning':
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      default:
        return <Info className="w-5 h-5 text-sky-500" />;
    }
  };

  const clearAll = () => {
    setNotifList([]);
  };

  return (
    <div id="notifications-panel" className="space-y-6">
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BellRing className="w-6 h-6 text-sky-505 text-sky-500 animate-pulse" />
            Live Hospital Dispatch Notices & Logs
          </h2>
          <p className="text-xs text-slate-500 mt-1">Real-time vital alerts, hospital ward notifications, and continuous telemetry logs.</p>
        </div>

        <button 
          onClick={clearAll}
          className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" /> CLEAR NOTICES
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Notifications */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 flex-wrap gap-2">
            <h3 className="font-bold text-xs font-mono text-slate-500 uppercase tracking-wider">
              Urgent Clinician Alert Despatches
            </h3>
            
            {/* Filter Pills */}
            <div className="flex gap-1">
              {(['all', 'critical', 'warning'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`py-1 px-2.5 rounded-full text-[10px] font-mono font-bold uppercase transition-all ${
                    activeFilter === f 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Alerts' : f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5 max-h-[480px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {filteredNotifs.length > 0 ? (
                Array.from(new Map<string, SystemNotification>(filteredNotifs.map(n => [n.id, n])).values()).map(notif => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={notif.id}
                    className={`p-4 border rounded-xl flex gap-3 items-start transition-all ${
                      notif.level === 'critical' || notif.level === 'alert'
                        ? 'bg-rose-50/50 border-rose-200'
                        : 'bg-slate-50 border-slate-200/60'
                    }`}
                  >
                    <div className="p-1.5 rounded bg-white border border-slate-200/60 shadow-sm shrink-0">
                      {getIcon(notif.level)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(notif.level)}`}>
                          {notif.level.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono font-semibold">{notif.timestamp}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">{notif.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{notif.message}</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 font-mono text-xs">
                  ✓ NO URGENT CLINICAL ALERTS TRIGGERED
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Column: System Logs Console */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-xs font-mono text-slate-500 uppercase tracking-wider mb-2.5 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Telemetry Trace Stream</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 border border-emerald-200 py-0.5 px-2 rounded-full font-bold">
                SECURE LINK
              </span>
            </h3>
            
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {logs.map((log, index) => (
                <div 
                  key={index}
                  className="p-2 bg-slate-50 border-l-2 border-slate-300 rounded text-[10px] font-mono text-slate-600 leading-relaxed"
                >
                  <span className="text-slate-400 select-none mr-1.5 font-bold">»</span>
                  {log}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] font-mono text-slate-500">
            📡 Mainframe stream link active. Connected via container route to local cluster.
          </div>
        </div>
      </div>
    </div>
  );
}
