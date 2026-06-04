/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  Activity, 
  User, 
  Truck, 
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { UserRole, UserAccount } from '../types';
import { motion } from 'motion/react';

interface LoginViewProps {
  onLogin: (user: UserAccount) => void;
}

const PRESET_ACCOUNTS: { name: string; title: string; role: UserRole; avatar: string; email: string; desc: string; icon: any; colorClass: string; defaultTab: string }[] = [
  {
    name: 'Dr. Evelyn Sterling',
    title: 'Chief Medical Super',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    email: 'e.sterling@emergix.org',
    desc: 'Uncapped commands. Orchestrate dynamic dispatch fleets, patient matrices, physicians, predictive AI projections, and logs.',
    icon: ShieldCheck,
    colorClass: 'border-slate-200 hover:border-teal-400 bg-slate-900',
    defaultTab: 'dashboard'
  },
  {
    name: 'Dr. Joshuaa Reyes',
    title: 'Senior ICU Cardiologist',
    role: 'Doctor',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    email: 'joshuaa.reyes@emergix.org',
    desc: 'Examine patient twin histories, review Gemini clinical summaries, and consult Joshuaa AI on diagnostic triage queries.',
    icon: Stethoscope,
    colorClass: 'border-slate-200 hover:border-amber-400 bg-slate-900',
    defaultTab: 'patients'
  },
  {
    name: 'Nurse Marcus Vance',
    title: 'ICU Critical Care Lead',
    role: 'Nurse',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150',
    email: 'm.vance@emergix.org',
    desc: 'Adjust bed allocation schemas, toggle critical care ventilators, monitor cardiopulmonary oxygen flows, and adjust vitals.',
    icon: Activity,
    colorClass: 'border-slate-200 hover:border-sky-400 bg-slate-900',
    defaultTab: 'icu'
  },
  {
    name: 'Clerk Sarah Jenkins',
    title: 'Intake Receptionist',
    role: 'Receptionist',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?w=150',
    email: 's.jenkins@emergix.org',
    desc: 'Register prospective patients, manage real-time queues, and coordinate clinical appointments.',
    icon: Calendar,
    colorClass: 'border-slate-200 hover:border-rose-400 bg-slate-900',
    defaultTab: 'appointments'
  },
  {
    name: 'Operator Leo Torres',
    title: 'Lead Dispatch Officer',
    role: 'Ambulance Operator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    email: 'l.torres@emergix.org',
    desc: 'Authorize dynamic emergency dispatches, regulate speed constants, override sector ETAs, and edit triage logs.',
    icon: Truck,
    colorClass: 'border-slate-200 hover:border-indigo-400 bg-slate-900',
    defaultTab: 'ambulance'
  }
];

export default function LoginView({ onLogin }: LoginViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [error, setError] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);

  const handlePresetSelect = (index: number) => {
    setSelectedPresetIndex(index);
    const preset = PRESET_ACCOUNTS[index];
    setEmail(preset.email);
    setPassword('emergix_demo_secret');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a secure account email.');
      return;
    }

    if (isSignUp) {
      if (!fullName) {
        setError('Please enter your full clinical name.');
        return;
      }
      // Create registered custom user
      const defaultTabMap: Record<UserRole, string> = {
        'Admin': 'dashboard',
        'Doctor': 'patients',
        'Nurse': 'icu',
        'Receptionist': 'appointments',
        'Ambulance Operator': 'emergency'
      };

      const customUser: UserAccount = {
        id: `USR-REG-${Date.now().toString().slice(-4)}`,
        name: fullName,
        title: `${selectedRole} Specialist`,
        role: selectedRole,
        avatar: selectedRole === 'Doctor' 
          ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150'
          : selectedRole === 'Nurse'
          ? 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
        department: selectedRole === 'Nurse' ? 'Critical Care Unit' : selectedRole === 'Doctor' ? 'Trauma Division' : 'Main Admin Division'
      };

      localStorage.setItem('emergix_session_role', customUser.role);
      localStorage.setItem('emergix_session_tab', defaultTabMap[selectedRole]);
      onLogin(customUser);
    } else {
      // Regular login
      const matched = PRESET_ACCOUNTS.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (matched) {
        const user: UserAccount = {
          id: `USR-${Math.floor(Math.random() * 8000) + 1000}`,
          name: matched.name,
          title: matched.title,
          role: matched.role,
          avatar: matched.avatar,
          department: matched.role === 'Nurse' ? 'Critical Care Unit' : matched.role === 'Doctor' ? 'Trauma Division' : 'Main Admin Staff'
        };
        
        localStorage.setItem('emergix_session_role', user.role);
        localStorage.setItem('emergix_session_tab', matched.defaultTab);
        onLogin(user);
      } else {
        const user: UserAccount = {
          id: `USR-CUSTOM`,
          name: email.split('@')[0].toUpperCase(),
          title: 'Specialist Clinician',
          role: 'Admin',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          department: 'Emergency Medicine Division'
        };
        localStorage.setItem('emergix_session_role', 'Admin');
        localStorage.setItem('emergix_session_tab', 'dashboard');
        onLogin(user);
      }
    }
  };

  const handleQuickLogin = (index: number) => {
    const preset = PRESET_ACCOUNTS[index];
    const user: UserAccount = {
      id: `USR-${Math.floor(Math.random() * 8000) + 1000}`,
      name: preset.name,
      title: preset.title,
      role: preset.role,
      avatar: preset.avatar,
      department: preset.role === 'Nurse' ? 'Critical Care Unit' : preset.role === 'Doctor' ? 'Trauma Division' : 'Main Admin Staff'
    };
    
    localStorage.setItem('emergix_session_role', user.role);
    localStorage.setItem('emergix_session_tab', preset.defaultTab);
    onLogin(user);
  };

  return (
    <div id="login-view-component" className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between p-8 md:p-16 font-sans antialiased relative overflow-hidden">
      
      {/* Absolute Minimal Grid Line Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:6rem_6rem] opacity-40 pointer-events-none"></div>

      {/* Subtle elegant faded purple/lavender decorative ambient blurs */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-teal-100/30 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-indigo-250 bg-indigo-150 bg-indigo-100/40 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-teal-600/10">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase font-sans flex items-center gap-1.5">
              Emergix <span className="text-[9px] font-mono tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">Core</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">Hospital Clinical Workspace & Dispatch</p>
          </div>
        </div>
      </header>

      {/* Main Premium Clean Grid */}
      <main className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 my-auto py-12">
        
        {/* Left Area: Welcome Title & Custom Structured Keys */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-150 text-teal-700 text-[10px] font-mono py-1 px-3 rounded-full uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Secure Intake Control Portal & Live Sync Database
            </div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 leading-tight font-sans">
              Precision hospital triage, <br/>
              <span className="font-extrabold text-teal-600">orchestrated at scale.</span>
            </h2>
            <p className="text-sm text-slate-650 leading-relaxed max-w-lg font-normal">
              Manage live clinical telemetry, coordinate field paramedic dispatches, oversee intensive care ward states, and query our cognitive advisor — optimized for critical care workflows.
            </p>
          </div>

          {/* Create Account call-to-action pointer */}
          <div className="bg-amber-50/60 border border-amber-200/95 p-4 rounded-xl text-xs space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" /> Need custom clinical privileges in Emergix?
            </h4>
            <p className="text-slate-600 leading-normal">
              Use the <strong className="text-teal-700 font-bold px-1.5 py-0.5 bg-white border border-slate-200 rounded">Register Account</strong> tab on the right card to instantly create a new profile with custom roles: <strong>Admin, Doctor, Nurse, Receptionist, or Ambulance Dispatch</strong>.
            </p>
          </div>

          {/* Premium Account Registry Selector */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono font-extrabold uppercase text-slate-400 tracking-wider">
              OR SELECT A PRESET DEMO CLINICAL KEY
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_ACCOUNTS.map((preset, idx) => {
                const IconComponent = preset.icon;
                const isSelected = selectedPresetIndex === idx;
                
                return (
                  <div 
                    key={preset.role}
                    onClick={() => handlePresetSelect(idx)}
                    className={`p-4 rounded-xl border cursor-pointer text-left transition-all ${
                      isSelected 
                        ? 'bg-teal-50/70 border-teal-500 shadow-md shadow-teal-500/5' 
                        : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {preset.role}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">{preset.name}</p>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-slate-600 leading-normal mb-3 font-sans truncate">
                      {preset.desc}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-[9px] text-slate-400 font-mono">{preset.email}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickLogin(idx);
                        }}
                        className="text-[10px] text-teal-600 hover:text-teal-700 font-mono font-bold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        Enter <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Clean Credentials Frame */}
        <div className="lg:col-span-5 flex flex-col justify-center animate-fade-in">
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl shadow-slate-200/50 space-y-6 relative">
            
            {/* Elegant Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-xl">
              <button 
                type="button"
                onClick={() => { setIsSignUp(false); setError(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setIsSignUp(true); setError(''); }}
                className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Register Account
              </button>
            </div>

            <div className="space-y-1 text-left border-b border-slate-150 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-sans">
                <Lock className="w-4 h-4 text-teal-600" />
                {isSignUp ? 'Register Security Credentials' : 'Staff Access Gate'}
              </h3>
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-wider font-extrabold col-span-full">
                {isSignUp ? 'CHOOSE YOUR FUNCTIONAL CLINICAL ROLE & ID' : 'SIGN-IN WITH EMAIL OR LAUNCH CHOSEN PRESET KEY'}
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-750 text-xs p-3 rounded-xl flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono tracking-wider font-extrabold text-slate-500 uppercase">FULL CLINICAL NAME</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Jordan Mitchell" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500 focus:bg-white transition-all font-sans"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono tracking-wider font-extrabold text-slate-500 uppercase">STAFF EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="j.mitchell@emergix.org" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500 focus:bg-white transition-all font-mono"
                />
              </div>

              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono tracking-wider font-extrabold text-slate-500 uppercase">HOSPITAL SERVICE ROLE</label>
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-950 outline-none focus:border-teal-500 focus:bg-white transition-all font-sans cursor-pointer"
                  >
                    <option value="Admin">Admin (Full System Privilege)</option>
                    <option value="Doctor">Doctor (Clinical Twins & AI Advice)</option>
                    <option value="Nurse">Nurse (ICU Beds & Cardiopulmonary Flow)</option>
                    <option value="Receptionist">Receptionist (Appointments & Registries)</option>
                    <option value="Ambulance Operator">Ambulance Operator (Dispatch Control)</option>
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono tracking-wider font-extrabold text-slate-500 uppercase">
                    {isSignUp ? 'CREATE SECURE PASSCODE' : 'ACCESS CODE'}
                  </label>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {isSignUp ? 'Private passcode' : 'Auto-filled'}
                  </span>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-teal-500 focus:bg-white transition-all font-mono"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-xs uppercase tracking-wider transition-all shadow-md shadow-teal-600/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSignUp ? 'Register & Launch Workspace' : 'Launch Workspace Control'}
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </form>

            <div className="text-[9px] text-slate-400 border-t border-slate-100 pt-4 font-mono text-center leading-relaxed">
              {isSignUp 
                ? 'Creating an account configures persistent local session states. You will immediately be routed to your respective command station.'
                : 'Preset profiles contain specialized simulation layouts. Standard email sign-in automatically maps to administrative master access level.'}
            </div>
          </div>
        </div>

      </main>

      {/* Footer System Diagnostics */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto border-t border-slate-200 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-mono text-slate-400">
        <div>
          <span>© 2026 EMERGIX MEDICAL COMMAND CONSOLE</span>
        </div>
        <div>
          <span>SECURE SECURE_TOKEN OK</span>
        </div>
      </footer>

    </div>
  );
}
