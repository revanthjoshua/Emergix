/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, Download, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

export default function ReportsView() {
  const reportsList = [
    { id: 'REP-801', title: 'Daily Patient Discharge Summary', date: '2026-06-01', size: '2.4 MB', author: 'Dr. Sterling', type: 'Discharge Report' },
    { id: 'REP-802', title: 'Weekly Triage Audit & Bottlenecks', date: '2026-05-31', size: '1.8 MB', author: 'System AI Audit', type: 'SLA Triage' },
    { id: 'REP-803', title: 'Oxygen Delivery Line Pressure Logs', date: '2026-05-29', size: '4.5 MB', author: 'Telemetry Sys', type: 'Maintenance' },
    { id: 'REP-804', title: 'Ambulance Satellite Route Optimization', date: '2026-05-28', size: '920 KB', author: 'System Dispatcher', type: 'Logistics Audit' }
  ];

  return (
    <div id="reports-panel" className="space-y-6">
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-500" />
            Clinical Archives & Audit Reports
          </h2>
          <p className="text-xs text-slate-500 mt-1">Exportable diagnostic audits, daily hospital discharge summaries, and patient intake statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left main: table list of reports */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <h3 className="font-bold text-xs font-mono text-slate-500 uppercase tracking-wider">
              Available Clinical PDFs & Spreadsheet Logs
            </h3>
            <button className="text-xs font-semibold font-mono text-sky-600 flex items-center gap-1 hover:text-sky-700">
              <RefreshCw className="w-3.5 h-3.5" /> REFRESH
            </button>
          </div>

          <div className="space-y-3">
            {reportsList.map(rep => (
              <div 
                key={rep.id}
                className="p-4 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50 flex items-center justify-between gap-4 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-rose-100 text-rose-700 p-2.5 rounded-lg">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{rep.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Class: {rep.type} &bull; Date: {rep.date} &bull; Size: {rep.size}
                    </p>
                  </div>
                </div>

                <button className="flex items-center gap-1 py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-sm transition-colors font-mono">
                  <Download className="w-3.5 h-3.5 text-slate-505" /> DOWNLOAD
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right card: summaries */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              SLA Compliance & Auditor Signals
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mt-2">
              Emergix hospital operations satisfy standard HIPAA compliance bounds. Satellite telemetry ensures patient reception speeds average less than 5 minutes.
            </p>
          </div>

          <div className="space-y-4 font-mono text-xs text-slate-600">
            <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
              <span className="flex items-center gap-1 text-emerald-800 font-bold">
                <CheckCircle className="w-4 h-4" /> HIPAA Compliance
              </span>
              <span className="text-emerald-700 font-bold">Passed</span>
            </div>

            <div className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
              <span className="flex items-center gap-1 text-indigo-800 font-bold">
                ⚡ ICU Intake SLA
              </span>
              <span className="text-indigo-700 font-bold">99.2% Rate</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-sans italic text-center">
            "Automated audit files generated synchronously at 00:00 server UTC"
          </div>
        </div>
      </div>
    </div>
  );
}
