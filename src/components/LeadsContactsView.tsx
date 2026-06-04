/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { 
  Users, 
  Phone, 
  Mail, 
  Trash2, 
  Plus, 
  Info, 
  Database, 
  Sparkles, 
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Patient } from '../types';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: string;
  notes: string;
  created_at?: string;
}

interface Contact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  patient_id: string;
  created_at?: string;
}

interface LeadsContactsViewProps {
  patients: Patient[];
}

export default function LeadsContactsView({ patients }: LeadsContactsViewProps) {
  const [leads, setLeads] = useState<Lead[]>([
    { id: 'L-001', name: 'Sarah Jenkins', email: 'sjenkins@gmail.com', phone: '+1-555-0143', source: 'Website Triage Portal', status: 'New', notes: 'Interested in elective ambulatory schedules.' },
    { id: 'L-002', name: 'Gregory House', email: 'housemd@princeton.org', phone: '+1-555-0199', source: 'Partner Hospital Referrals', status: 'Contacted', notes: 'Inbound transfer requested for respiratory diagnostics.' }
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    { id: 'C-001', name: 'Sherry Vance', relationship: 'Spouse', phone: '+1-555-0888', email: 'sherry.vance@gmail.com', patient_id: 'P-101' },
    { id: 'C-002', name: 'Alexei Rostov', relationship: 'Brother', phone: '+1-555-0723', email: 'arostov@yahoo.com', patient_id: 'P-102' }
  ]);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search and filters
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('All');

  // Form states for Lead creation
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSource, setLeadSource] = useState('Website Triage Portal');
  const [leadStatus, setLeadStatus] = useState('New');
  const [leadNotes, setLeadNotes] = useState('');

  // Form states for Contact creation
  const [contactName, setContactName] = useState('');
  const [contactRel, setContactRel] = useState('Next of Kin');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPatientId, setContactPatientId] = useState(patients[0]?.id || 'P-101');

  // Fetch initial data from Supabase if configured
  useEffect(() => {
    if (!isConfigured) return;

    const fetchSchemaData = async () => {
      setLoading(true);
      try {
        // Fetch Leads
        const { data: leadsData, error: lErr } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (leadsData && leadsData.length > 0) {
          setLeads(leadsData);
        } else if (lErr && lErr.code !== 'PGRST') {
          console.warn("Could not query leads stream:", lErr);
        }

        // Fetch Contacts
        const { data: contactsData, error: cErr } = await supabase
          .from('contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (contactsData && contactsData.length > 0) {
          setContacts(contactsData);
        } else if (cErr && cErr.code !== 'PGRST') {
          console.warn("Could not query contacts stream:", cErr);
        }
      } catch (err) {
        console.error("Supabase live schema error:", err);
        setErrorMessage("Persistence error. Verify table schema setups are created active.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchemaData();

    // Enable Supabase real-time channel updates
    const leadsChannel = supabase
      .channel('leads-realtime-changes')
      .on('postgres_changes', { event: '*', table: 'leads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads((prev) => [payload.new as Lead, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setLeads((prev) => prev.filter((item) => item.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setLeads((prev) => prev.map((item) => item.id === payload.new.id ? (payload.new as Lead) : item));
        }
      })
      .subscribe();

    const contactsChannel = supabase
      .channel('contacts-realtime-changes')
      .on('postgres_changes', { event: '*', table: 'contacts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setContacts((prev) => [payload.new as Contact, ...prev]);
        } else if (payload.eventType === 'DELETE') {
          setContacts((prev) => prev.filter((item) => item.id !== payload.old.id));
        } else if (payload.eventType === 'UPDATE') {
          setContacts((prev) => prev.map((item) => item.id === payload.new.id ? (payload.new as Contact) : item));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(contactsChannel);
    };
  }, []);

  // Form submissions
  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;

    const newLead: Lead = {
      id: `L-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      source: leadSource,
      status: leadStatus,
      notes: leadNotes
    };

    // Update local state first to ensure fluid high-speed UX
    setLeads((prev) => [newLead, ...prev]);

    // Push persistence call to Supabase
    if (isConfigured) {
      try {
        const { error } = await supabase.from('leads').insert(newLead);
        if (error) throw error;
      } catch (err: any) {
        console.error("Insert lead error:", err);
        setErrorMessage(`Failed persistence write: ${err.message || 'Check database status.'}`);
      }
    }

    // Reset Form Fields
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadNotes('');
  };

  const handleDeleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((item) => item.id !== id));

    if (isConfigured) {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        console.error("Delete lead error:", err);
      }
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;

    const newContact: Contact = {
      id: `C-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: contactName,
      relationship: contactRel,
      phone: contactPhone,
      email: contactEmail,
      patient_id: contactPatientId
    };

    // Update state
    setContacts((prev) => [newContact, ...prev]);

    // Push persistence
    if (isConfigured) {
      try {
        const { error } = await supabase.from('contacts').insert(newContact);
        if (error) throw error;
      } catch (err: any) {
        console.error("Insert contact error:", err);
        setErrorMessage(`Failed family contact registration: ${err.message}`);
      }
    }

    // Reset Form
    setContactName('');
    setContactPhone('');
    setContactEmail('');
  };

  const handleDeleteContact = async (id: string) => {
    setContacts((prev) => prev.filter((item) => item.id !== id));

    if (isConfigured) {
      try {
        const { error } = await supabase.from('contacts').delete().eq('id', id);
        if (error) throw error;
      } catch (err: any) {
        console.error("Delete contact error:", err);
      }
    }
  };

  // Filter computations
  const filteredLeads = leads.filter((item) => {
    const sTerm = leadSearch.toLowerCase();
    const matchSearch = item.name.toLowerCase().includes(sTerm) || 
                        item.email.toLowerCase().includes(sTerm) || 
                        item.notes.toLowerCase().includes(sTerm);
    const matchStatus = leadStatusFilter === 'All' || item.status === leadStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div id="leads-contacts-view" className="space-y-6">
      
      {/* Visual Status Indicator on Connection Security */}
      <div className={`p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all text-xs font-mono ${
        isConfigured 
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
          : 'bg-amber-50/70 border-amber-200 text-amber-850'
      }`}>
        <div className="flex items-center gap-2">
          <Database className={`w-4.5 h-4.5 ${isConfigured ? 'text-emerald-600 animate-pulse' : 'text-amber-500'}`} />
          <div>
            <span className="font-extrabold uppercase uppercase">Database Access Gateway Status:</span>{' '}
            <strong>{isConfigured ? 'FULLY ONLINE - REAL-TIME CLOUD STREAM ACTIVE' : 'LOCAL DEMO EMBED'}</strong>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isConfigured ? (
            <span className="bg-emerald-100/80 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
              Secure RLS Enabled
            </span>
          ) : (
            <span className="bg-amber-100/85 text-amber-900 font-bold px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider">
              Offline Cache
            </span>
          )}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-55 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main double column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left column: Add inputs */}
        <div className="space-y-6 xl:col-span-1">
          
          {/* Form 1: Add CRM Acquisition Lead */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="bg-teal-50 text-teal-700 p-2 rounded-xl">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase font-mono text-slate-800 tracking-wider">Register CRM Direct Lead</h3>
                <p className="text-[10px] text-slate-400">Add outbound or inbounds medical routing leads</p>
              </div>
            </div>

            <form onSubmit={handleAddLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Lead Contact Name</label>
                <input 
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Kenneth Cooper"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Email Address</label>
                  <input 
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="k.coop@mail.co"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Phone Number</label>
                  <input 
                    type="tel"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="+1-555-0100"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Traffic Source</label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Website Triage Portal">Website Triage</option>
                    <option value="Partner Hospital Referrals">Partner Referral</option>
                    <option value="Ambulance Rerouting">Ambulance Reroute</option>
                    <option value="Hotline Direct">Hotline Direct</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Lead Status</label>
                  <select
                    value={leadStatus}
                    onChange={(e) => setLeadStatus(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Roster Shifted">Roster Shifted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Pipeline Notes / Requests</label>
                <textarea
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  placeholder="Cardiac evaluation backup or private bed assignment inquiry details..."
                  rows={2}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold p-2.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 shadow-sm text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Upsert Secure Lead</span>
              </button>
            </form>
          </div>

          {/* Form 2: Add Next of Kin Emergency Contact */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="bg-amber-50 text-amber-700 p-2 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase font-mono text-slate-800 tracking-wider">Link Emergency Contact</h3>
                <p className="text-[10px] text-slate-400">Map a legal representative to an active digital twin patient</p>
              </div>
            </div>

            <form onSubmit={handleAddContact} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Target Patient Identity</label>
                <select
                  value={contactPatientId}
                  onChange={(e) => setContactPatientId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.condition}
                    </option>
                  ))}
                  {patients.length === 0 && <option value="P-101">Marcus Vance (P-101)</option>}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Contact Full Name</label>
                <input 
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Sherry Vance"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Relationship</label>
                  <select
                    value={contactRel}
                    onChange={(e) => setContactRel(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Legal Representative">Legal Gaurdian</option>
                    <option value="Next of Kin">Next of Kin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Emergency Phone</label>
                  <input 
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+1-555-0888"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[10px] uppercase font-bold mb-1">Contact Email</label>
                <input 
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="name@kin.org"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold p-2.5 rounded-xl flex items-center justify-center gap-2 transition-all mt-2 shadow-sm text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Link Next of Kin to Patient</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Columns: Active registries (CRM acquisition funnel + Patient contact mapping maps) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Section A: CRM Pipeline Leads */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-xs uppercase font-mono text-slate-850 tracking-wider">
                  ACTIVE LEAD COLLECTION PILES
                </h3>
                <p className="text-[10px] text-slate-400">Total Pipeline Records Online: {filteredLeads.length}</p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                    placeholder="Search leads..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-[11px]"
                  />
                </div>
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-[11px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Roster Shifted">Roster Shifted</option>
                </select>
              </div>
            </div>

            {/* List display */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">
                    <th className="pb-2">Lead details</th>
                    <th className="pb-2">Source</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Notes</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5">
                          <span className="flex items-center gap-0.5"><Mail className="w-3 h-3 shrink-0" /> {item.email}</span>
                          {item.phone && <span className="flex items-center gap-0.5"><Phone className="w-3 h-3 shrink-0" /> {item.phone}</span>}
                        </div>
                      </td>
                      <td className="py-3 font-mono text-[10px] text-slate-500">
                        {item.source}
                      </td>
                      <td className="py-3">
                        <span className={`inline-block font-mono text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          item.status === 'New' 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                            : item.status === 'Contacted'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 max-w-[180px] text-slate-500 overflow-hidden text-ellipsis">
                        {item.notes || <span className="text-slate-350 italic">None</span>}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteLead(item.id)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded-lg transition-transform hover:scale-105 hover:border border-red-100 text-red-500"
                          title="Purge CRM Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                        No active clinical acquisition leads found. Create one above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section B: Patient Contact/Next-of-Kin Map */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-xs uppercase font-mono text-slate-850 tracking-wider">
                PATIENT LEGAL REPRESENTATION & NEXT OF KIN DIRECTORY
              </h3>
              <p className="text-[10px] text-slate-400">Synced family records representing live ICU twins</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((contact) => {
                const associatedPatient = patients.find(p => p.id === contact.patient_id);
                return (
                  <div key={contact.id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl relative group hover:border-slate-300 transition-all flex flex-col justify-between">
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="absolute top-2.5 right-2.5 p-1 bg-white hover:bg-red-50 text-slate-400 hover:text-red-650 border border-slate-200 hover:border-red-200 rounded-lg opacity-80 group-hover:opacity-100 transition-all text-red-500"
                      title="Sever legal link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{contact.name}</span>
                        <span className="bg-slate-200 text-slate-700 py-0.2 px-1.5 rounded-md text-[8px] font-mono uppercase font-bold">
                          {contact.relationship}
                        </span>
                      </div>

                      <div className="space-y-0.5 text-[10px] font-sans text-slate-500">
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{contact.phone}</span>
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/40 text-[10px] flex items-center justify-between text-slate-600 font-mono">
                      <span>Linked Patient Target:</span>
                      <strong className="text-teal-700 uppercase">
                        {associatedPatient ? associatedPatient.name : `ID: ${contact.patient_id}`}
                      </strong>
                    </div>
                  </div>
                );
              })}

              {contacts.length === 0 && (
                <div className="col-span-2 py-6 text-center text-slate-400 italic text-xs">
                  No linked Next of Kin records found. Link representative data using the form.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
