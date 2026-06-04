/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Hourglass, 
  Ticket, 
  Plus, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  FileText, 
  Info, 
  Tag, 
  Trash2,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HospitalEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: 'Surgical Action' | 'Patient Discharge' | 'On-Call Review' | 'Clinic Appointment';
  remarks?: string;
  time?: string;
}

export default function AppointmentsView() {
  // Appointments Queue State
  const [appointments, setAppointments] = useState([
    { token: 'TK-12', name: 'Jonathan Baker', doctor: 'Dr. Evelyn Sterling', time: '18:30', status: 'Waiting', wait: '12 mins' },
    { token: 'TK-13', name: 'Linda McAllister', doctor: 'Dr. Clara Mendeleev', time: '18:45', status: 'Waiting', wait: '25 mins' },
    { token: 'TK-14', name: 'Reginald Vance', doctor: 'Dr. Daniel Fletcher', time: '19:00', status: 'Waiting', wait: '40 mins' },
    { token: 'TK-15', name: 'Susie Q', doctor: 'Dr. Kenji Tanaka', time: '19:15', status: 'Scheduled', wait: '55 mins' }
  ]);

  const [newName, setNewName] = useState('');
  const [newDoctor, setNewDoctor] = useState('Dr. Clara Mendeleev');
  const [newTime, setNewTime] = useState('19:30');

  // Calendar States
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026 as per local time context
  const [selectedDateStr, setSelectedDateStr] = useState('2026-06-01');
  const [showEventModal, setShowEventModal] = useState(false);

  // Prepopulated Hospital Events
  const [hospitalEvents, setHospitalEvents] = useState<HospitalEvent[]>([
    { id: 'ev-1', date: '2026-06-01', title: 'Triple Bypass - Charlotte Webb', category: 'Surgical Action', time: '09:00', remarks: 'Lead: Dr. Sterling. Assist: Nurse Vance.' },
    { id: 'ev-2', date: '2026-06-01', title: 'Discharge Plan: Timothy Cross', category: 'Patient Discharge', time: '14:00', remarks: 'Confirm cardiac drugs dispensed and route map clear.' },
    { id: 'ev-3', date: '2026-06-04', title: 'Appendectomy Procedure', category: 'Surgical Action', time: '11:30', remarks: 'OR Patient Room 3' },
    { id: 'ev-4', date: '2026-06-10', title: 'Monthly Trauma Audit', category: 'On-Call Review', time: '16:00', remarks: 'All chief residents must submit reports.' },
    { id: 'ev-5', date: '2026-06-15', title: 'Planned Stroke Bay Sanitation', category: 'On-Call Review', time: '02:00', remarks: 'Beds CCU-01 and CCU-02' },
    { id: 'ev-6', date: '2026-06-01', title: 'Senior Board Dr. Roster Review', category: 'On-Call Review', time: '17:00' },
  ]);

  // Sync data with Supabase if active
  useEffect(() => {
    if (!isConfigured) return;

    const syncAppointmentsData = async () => {
      try {
        const { data: appData, error: aErr } = await supabase.from('appointments').select('*');
        if (appData && appData.length > 0) {
          setAppointments(appData.map((d: any) => ({
            token: d.token || `TK-${d.id}`,
            name: d.name,
            doctor: d.doctor,
            time: d.time,
            status: d.status,
            wait: d.wait || '15 mins'
          })));
        } else if (!aErr) {
          // Pre-seed table with initial list
          const seedData = [
            { token: 'TK-12', name: 'Jonathan Baker', doctor: 'Dr. Evelyn Sterling', time: '18:30', status: 'Waiting', wait: '12 mins' },
            { token: 'TK-13', name: 'Linda McAllister', doctor: 'Dr. Clara Mendeleev', time: '18:45', status: 'Waiting', wait: '25 mins' },
            { token: 'TK-14', name: 'Reginald Vance', doctor: 'Dr. Daniel Fletcher', time: '19:00', status: 'Waiting', wait: '40 mins' },
            { token: 'TK-15', name: 'Susie Q', doctor: 'Dr. Kenji Tanaka', time: '19:15', status: 'Scheduled', wait: '55 mins' }
          ];
          await supabase.from('appointments').insert(seedData);
        }

        const { data: evData, error: eErr } = await supabase.from('hospital_events').select('*');
        if (evData && evData.length > 0) {
          setHospitalEvents(evData.map((d: any) => ({
            id: d.id,
            date: d.date,
            title: d.title,
            category: d.category,
            time: d.time || '',
            remarks: d.remarks || ''
          })));
        } else if (!eErr) {
          const seedData = [
            { id: 'ev-1', date: '2026-06-01', title: 'Triple Bypass - Charlotte Webb', category: 'Surgical Action', time: '09:00', remarks: 'Lead: Dr. Sterling. Assist: Nurse Vance.' },
            { id: 'ev-2', date: '2026-06-01', title: 'Discharge Plan: Timothy Cross', category: 'Patient Discharge', time: '14:00', remarks: 'Confirm cardiac drugs dispensed and route map clear.' },
            { id: 'ev-3', date: '2026-06-04', title: 'Appendectomy Procedure', category: 'Surgical Action', time: '11:30', remarks: 'OR Patient Room 3' },
            { id: 'ev-4', date: '2026-06-10', title: 'Monthly Trauma Audit', category: 'On-Call Review', time: '16:00', remarks: 'All chief residents must submit reports.' },
            { id: 'ev-5', date: '2026-06-15', title: 'Planned Stroke Bay Sanitation', category: 'On-Call Review', time: '02:00', remarks: 'Beds CCU-01 and CCU-02' },
            { id: 'ev-6', date: '2026-06-01', title: 'Senior Board Dr. Roster Review', category: 'On-Call Review', time: '17:00', remarks: '' }
          ];
          await supabase.from('hospital_events').insert(seedData);
        }
      } catch (err) {
        console.error("Failed to sync appointments/events schema:", err);
      }
    };

    syncAppointmentsData();
  }, []);

  // Add Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState<HospitalEvent['category']>('Surgical Action');
  const [eventTime, setEventTime] = useState('08:00');
  const [eventRemarks, setEventRemarks] = useState('');

  // Year & Month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Days in month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Create date cells
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(d);
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Select Date
  const handleSelectDay = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    setSelectedDateStr(`${year}-${formattedMonth}-${formattedDay}`);
  };

  // Add Hospital Event
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle) return;

    const newEv: HospitalEvent = {
      id: `ev-${Date.now()}`,
      date: selectedDateStr,
      title: eventTitle,
      category: eventCategory,
      time: eventTime,
      remarks: eventRemarks
    };

    setHospitalEvents([...hospitalEvents, newEv]);
    setEventTitle('');
    setEventRemarks('');
    setShowEventModal(false);

    if (isConfigured) {
      try {
        await supabase.from('hospital_events').insert({
          id: newEv.id,
          date: newEv.date,
          title: newEv.title,
          category: newEv.category,
          time: newEv.time,
          remarks: newEv.remarks
        });
      } catch (err) {
        console.error("Failed to write event to Supabase:", err);
      }
    }
  };

  // Delete Hospital Event
  const handleDeleteEvent = async (id: string) => {
    setHospitalEvents(prev => prev.filter(e => e.id !== id));
    if (isConfigured) {
      try {
        await supabase.from('hospital_events').delete().eq('id', id);
      } catch (err) {
        console.error("Failed to delete event from Supabase:", err);
      }
    }
  };

  // Book Triage Queue Ticket
  const handleBookQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const nextToken = `TK-${appointments.length + 12}`;
    const newEntry = {
      token: nextToken,
      name: newName,
      doctor: newDoctor,
      time: newTime,
      status: 'Waiting' as const,
      wait: '30 mins'
    };
    setAppointments([...appointments, newEntry]);
    setNewName('');

    if (isConfigured) {
      try {
        await supabase.from('appointments').insert({
          token: newEntry.token,
          name: newEntry.name,
          doctor: newEntry.doctor,
          time: newEntry.time,
          status: newEntry.status,
          wait: newEntry.wait
        });
      } catch (err) {
        console.error("Failed to book queue to Supabase:", err);
      }
    }
  };

  const handleCompleteQueue = async (token: string) => {
    setAppointments(prev => prev.map(a => a.token === token ? { ...a, status: 'Completed' } : a));
    if (isConfigured) {
      try {
        await supabase.from('appointments').update({ status: 'Completed' }).eq('token', token);
      } catch (err) {
        console.error("Failed to update queue position on Supabase:", err);
      }
    }
  };

  // Get events on selected date
  const eventsOnSelectedDate = hospitalEvents.filter(e => e.date === selectedDateStr);

  const getCategoryColor = (cat: HospitalEvent['category']) => {
    switch (cat) {
      case 'Surgical Action': return 'bg-rose-50 text-rose-700 border-rose-250 border-rose-200';
      case 'Patient Discharge': return 'bg-emerald-50 text-emerald-700 border-emerald-250 border-emerald-200';
      case 'On-Call Review': return 'bg-amber-50 text-amber-700 border-amber-250 border-amber-200';
      case 'Clinic Appointment': return 'bg-sky-50 text-sky-700 border-sky-250 border-sky-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="appointments-panel" className="space-y-6">
      
      {/* Page Header and Instructions banner */}
      <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-emerald-500" />
              Surgical Calendars & Reception Intake Hub
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mark operation schedules, configure automatic patient discharge dates, and direct raw queue waiting rosters.
            </p>
          </div>
        </div>

        {/* Dynamic Instructional Guide Card - "at everywhere, at everything" */}
        <div className="mt-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5 text-xs text-slate-600">
          <h4 className="font-extrabold text-emerald-800 flex items-center gap-1.5 font-mono text-[11px] uppercase">
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            INSTRUCTIONS: HOW TO USE THE HOSPITAL CALENDAR WORKSPACE
          </h4>
          <ul className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed font-sans">
            <li><strong>Interactive Date Mapping</strong>: Use the Calendar grid below. Click on any block to filter operations and discharge milestones specifically designated for that target date.</li>
            <li><strong>Registering New Hospital Events</strong>: Once you select a date block, click the green <strong>"+ Add Event to Date"</strong> button in the daily itinerary panel to create custom surgical timings, discharges, and on-call notes.</li>
            <li><strong>Managing Consultation Tokens</strong>: Use the Intake dispatch form to assign incoming walk-in patients to our attending physicians and track consultation timers.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Row Left: Interactive Monthly Calendar Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
            
            {/* Calendar Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-sky-500" />
                <h3 className="font-extrabold text-sm text-slate-800 font-mono uppercase tracking-tight">
                  {monthNames[month]} {year}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-200 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setCurrentDate(new Date(2026, 5, 1))}
                  className="py-1 px-2.5 text-[10px] font-bold font-mono border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600"
                >
                  TODAY
                </button>
                <button 
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 border border-slate-200 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-slate-400 mb-2">
              <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
            </div>

            {/* Grid Cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-16 bg-slate-50/50 rounded-lg"></div>;
                }

                const formattedMonth = String(month + 1).padStart(2, '0');
                const formattedDay = String(day).padStart(2, '0');
                const cellDateStr = `${year}-${formattedMonth}-${formattedDay}`;
                
                const isSelected = selectedDateStr === cellDateStr;
                const dayEvents = hospitalEvents.filter(e => e.date === cellDateStr);

                return (
                  <div 
                    key={`day-${day}`}
                    onClick={() => handleSelectDay(day)}
                    className={`h-16 p-1.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between hover:border-sky-300 relative ${
                      isSelected 
                        ? 'bg-sky-50 border-sky-400 text-sky-950 font-bold' 
                        : 'bg-white border-slate-100 text-slate-700 hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="text-xs">{day}</span>
                    
                    {/* Events indicators limit to 2 */}
                    <div className="space-y-0.5 max-h-8 overflow-hidden pointer-events-none">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div 
                          key={ev.id} 
                          className={`text-[8px] px-1 py-0.2 rounded truncate leading-none ${
                            ev.category === 'Surgical Action' ? 'bg-red-100 text-red-700' :
                            ev.category === 'Patient Discharge' ? 'bg-emerald-100 text-emerald-700' :
                            ev.category === 'On-Call Review' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[7px] text-slate-400 font-mono text-right font-extrabold pb-0.5">
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Clinic Flow Queue & Tokens */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 font-mono uppercase tracking-tight flex items-center justify-between border-b border-slate-100 pb-3">
              <span>Dynamic Walk-in Queue System</span>
              <span className="text-xs text-slate-400 font-normal underline">ATTENDING SHIFTS RUNNING</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-mono text-slate-400 font-bold">In-Queue Waiting</div>
                  <div className="text-lg font-bold text-slate-800">
                    {appointments.filter(a => a.status === 'Waiting').length} Consultations
                  </div>
                </div>
              </div>

              <div className="bg-sky-50/40 border border-sky-100 p-3 rounded-xl flex items-center gap-3">
                <div className="bg-sky-100 text-sky-700 p-2 rounded-lg">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-mono text-slate-400 font-bold">Active Station Ticket</div>
                  <div className="text-lg font-bold text-slate-800">TK-11</div>
                </div>
              </div>

              <div className="bg-amber-50/40 border border-amber-100 p-3 rounded-xl flex items-center gap-3">
                <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                  <Hourglass className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[9px] uppercase font-mono text-slate-400 font-bold">Clinic Wait Average</div>
                  <div className="text-lg font-bold text-slate-800">18 Mins</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {appointments.map(app => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 5 }}
                    key={app.token}
                    className={`p-3.5 border rounded-xl flex items-center justify-between gap-4 transition-all ${
                      app.status === 'Completed' 
                        ? 'bg-slate-50/65 border-slate-100 opacity-55' 
                        : 'bg-white border-slate-200/80 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-center font-mono py-1 px-2.5 bg-slate-100 border border-slate-200 text-slate-700 rounded font-bold text-xs min-w-[55px]">
                        {app.token}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-xs">{app.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono mt-0.5">Attending: {app.doctor} &bull; Targeted Arrival: {app.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      {app.status === 'Waiting' && (
                        <>
                          <span className="text-[9px] text-amber-600 font-bold bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
                            Wait: {app.wait}
                          </span>
                          <button 
                            onClick={() => handleCompleteQueue(app.token)}
                            className="bg-emerald-50 hover:bg-emerald-150 hover:bg-emerald-100 text-emerald-600 p-1.5 rounded-lg border border-emerald-200 transition-colors"
                            title="Complete Consultation Session"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {app.status === 'Scheduled' && (
                        <span className="text-[9px] text-sky-600 font-bold bg-sky-50 border border-sky-200/60 px-2 py-0.5 rounded-full">
                          Appt Reserved
                        </span>
                      )}

                      {app.status === 'Completed' && (
                        <span className="text-[9px] text-slate-400 font-bold">
                          ✓ Session Completed
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>
        </div>

        {/* Row Right: Selected Date Specific Events Timeline / Add Form */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Day's Events List Panel */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-xs text-slate-800 font-mono uppercase">
                  Schedule: {selectedDateStr}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase mt-0.5">
                  {eventsOnSelectedDate.length} Active events scheduled
                </p>
              </div>
              <button 
                onClick={() => setShowEventModal(true)}
                className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Event
              </button>
            </div>

            {eventsOnSelectedDate.length === 0 ? (
              <div className="text-center py-8 text-slate-400 font-mono text-xs">
                No events marked for this date. Click Add Event to enter a surgical operation or discharge milestone.
              </div>
            ) : (
              <div className="space-y-3.5">
                {eventsOnSelectedDate.map(ev => (
                  <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl relative group">
                    <button 
                      onClick={() => handleDeleteEvent(ev.id)}
                      className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors p-0.5"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5 cursor-pointer" />
                    </button>

                    <span className={`text-[8px] font-mono font-extrabold uppercase py-0.5 px-2 rounded-full border ${getCategoryColor(ev.category)}`}>
                      {ev.category}
                    </span>

                    <h4 className="font-extrabold text-slate-800 text-xs mt-2">{ev.title}</h4>
                    
                    {ev.time && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono mt-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Target: {ev.time}
                      </div>
                    )}

                    {ev.remarks && (
                      <p className="text-[10px] text-slate-500 mt-1.5 font-sans italic bg-white p-1.5 rounded border border-slate-100">
                        {ev.remarks}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Queue Appointment Form */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
            <h3 className="font-bold text-xs text-slate-800 font-mono uppercase tracking-wider border-b border-slate-100 pb-2 mb-3.5 flex items-center gap-1">
              <Plus className="w-4 h-4 text-emerald-500" />
              Register Intake consultation
            </h3>

            <form onSubmit={handleBookQueue} className="space-y-4 font-mono text-[11px] text-slate-500">
              <div className="space-y-1">
                <label className="block font-bold">PATIENT COMPLETE NAME:</label>
                <input 
                  required 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Charlotte Webb" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold">ONSITE REGISTRATION DOCTOR:</label>
                <select 
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-emerald-500"
                >
                  <option value="Dr. Clara Mendeleev">Dr. Clara Mendeleev - EM</option>
                  <option value="Dr. Evelyn Sterling">Dr. Evelyn Sterling - Trauma</option>
                  <option value="Dr. Daniel Fletcher">Dr. Daniel Fletcher - CCU</option>
                  <option value="Dr. Kenji Tanaka">Dr. Kenji Tanaka - Neuro</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-bold">TARGET TIME STAMP:</label>
                <input 
                  required 
                  type="text" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg font-sans font-bold transition-all text-xs uppercase"
              >
                PROVISION INTAKE TICKET
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* modal - Add Event Popup */}
      <AnimatePresence>
        {showEventModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleAddEvent}
              className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xl max-w-md w-full space-y-4 font-sans text-xs text-slate-700"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 uppercase">
                    Schedule Event for {selectedDateStr}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Establish hospital priority calendar markings</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowEventModal(false)}
                  className="text-slate-400 hover:text-slate-900 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1 font-mono">
                <label className="block text-slate-500">EVENT DESCRIPTION / PATIENT TITLE:</label>
                <input 
                  required 
                  type="text" 
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Quadruple Bypass Surgery - Marcus Vance" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-sans outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="space-y-1">
                  <label className="block text-slate-500">CATEGORY:</label>
                  <select 
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-emerald-500"
                  >
                    <option value="Surgical Action">Surgical Action</option>
                    <option value="Patient Discharge">Patient Discharge</option>
                    <option value="On-Call Review">On-Call Review</option>
                    <option value="Clinic Appointment">Clinic Appointment</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-slate-500">TIME STAMP:</label>
                  <input 
                    type="text" 
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 10:30" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1 font-mono">
                <label className="block text-slate-500">ADDITIONAL DIRECTIVES / INSTRUCTIONS:</label>
                <textarea 
                  value={eventRemarks}
                  onChange={(e) => setEventRemarks(e.target.value)}
                  placeholder="Room assignments, primary doctors, special medications instructions, emergency metrics, etc." 
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 font-sans outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-500 font-bold rounded-xl transition-all font-sans text-xs uppercase"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all font-sans text-xs uppercase"
                >
                  CONFIRM EVENT
                </button>
              </div>

            </motion.form>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
