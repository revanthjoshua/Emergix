/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Loader2, 
  RefreshCw, 
  HelpCircle,
  FileText,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function AiAssistantView() {
  const [messages, setMessages] = useState<ChatMessage[]>( [
    { 
      id: 'msg-101', 
      role: 'assistant', 
      content: "👋 Greetings clinician! I am the **Emergix AI Operations Advisor**. \n\nI can assist you in:\n- Summarizing severe polytrauma patient histories.\n- Assisting with clinical intake guidelines.\n- Preparing transfer-out notes, medication checklists, or high-level discharge summaries.\n\n*Select a template below to begin, or type a custom query.*" 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendQuery = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'General assistant service anomaly.');
      }

      setMessages(prev => [...prev, {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.text
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `ast-err-${Date.now()}`,
        role: 'assistant',
        content: `👋 **Emergix Backup AI Advisor Active!** I am here to help you solve any doubt immediately! 🌟\n\nI detected a busy model state, but nothing stops our emergency coordination! Let me guide you:\n- **Immediate Doubts**: If you have questions about how to use Emergix: click the 📖 **"Operating Manual & Guide"** tab in the sidebar.\n- **Pencil Edit Indicators**: We have added neat pencil icons next to editable elements in all dashboards (Patient Twin fields, ICU Ward names, Ambulance ETA/Roster, and Doctors' active workloads). Hover and click them to edit!\n- **Triage Guide**: For acute chest pain, STEMI pathways, or stroke code presentations, you can prompt me right here. I am designed to give you continuous assistance and clear checklists.\n\n*What other doubt or clinical protocol can I break down for you? Ask away!*`
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(inputMessage);
  };

  const clearChat = () => {
    setMessages([
      { 
        id: 'msg-102', 
        role: 'assistant', 
        content: "Cleared session buffer. Welcome back Emergix Practitioner. How can I assist you with clinical protocols or shift analytics?" 
      }
    ]);
  };

  const handleTemplateClick = (text: string) => {
    setInputMessage(text);
  };

  const QUICK_TEMPLATES = [
    { title: "STEMI Care Summary", text: "Create an ICU handover summary for Marcus Vance with Anterior STEMI, detailing key nursing priorities and potential arrhythmic complications." },
    { title: "Sepsis Fluid Policy", text: "Explain standard emergency medicine fluid resuscitation protocol for an elderly patient suspected of postoperative sepsis." },
    { title: "DKA Treatment Plan", text: "Summarize a typical DKA correction plan, including insulin infusion guidelines and potassium replacement limits." },
    { title: "Trauma OR Handover", text: "Draft a high-speed OR surgical handover draft for severe polytrauma with splenic bleed and femur fracture." }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Instruction Guide */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-sm text-xs">
        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg shrink-0 mt-0.5">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="space-y-1 text-slate-600">
          <h4 className="font-extrabold text-emerald-800 font-mono uppercase tracking-wider flex items-center gap-1">
            🤖 JOSHUAA CLINICAL COMPANION MANUAL
          </h4>
          <p className="text-slate-500 font-sans">
            Consult our natural language clinical companion on high-priority sepsis guidelines, bypass plans, on-call schedules, or dosage guidelines:
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 font-sans pl-1">
            <li><strong>Select Templates</strong>: Click any pre-configured card (e.g. <em>STEMI Care Summary</em>) in the left panel to insert a pre-formulated query instantly.</li>
            <li><strong>Send Custom Queries</strong>: Type instructions directly into the message text bar on the right to receive medical advice from Joshuaa.</li>
            <li><strong>Keep it Clean</strong>: Click the <strong>Reset</strong> counter button on top of the chat area to wipe existing chat sequences.</li>
          </ul>
        </div>
      </div>

      <div id="ai-assistant-tab-view" className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[580px]">
      
      {/* Templates Column Left */}
      <div className="xl:col-span-1 bg-white border border-slate-205 border-slate-200/80 p-4 rounded-2xl flex flex-col justify-start h-full space-y-3.5 shadow-sm">
        <div>
          <h3 className="font-bold text-xs font-mono tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
            <Bot className="w-4.5 h-4.5 text-indigo-600 animate-pulse" />
            Quick Clinical Templates
          </h3>
          <p className="text-[10px] text-slate-400 mt-1 leading-snug font-sans font-semibold">Shorthand medical directives to feed directly into Gemini</p>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {QUICK_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => handleTemplateClick(tmpl.text)}
              className="w-full text-left p-3 bg-slate-50 border border-slate-200 hover:border-indigo-400 rounded-xl transition-all font-sans text-xs text-slate-700 leading-normal"
            >
              <div className="font-bold font-mono text-[10px] text-indigo-700 mb-1 flex items-center gap-1 uppercase">
                <FileText className="w-3.5 h-3.5 text-indigo-600" /> {tmpl.title}
              </div>
              <div className="line-clamp-2 text-slate-500 italic text-[11px]">"{tmpl.text}"</div>
            </button>
          ))}
        </div>

        <button
          onClick={clearChat}
          className="w-full py-2 border border-slate-205 border-slate-200 hover:bg-slate-100 text-slate-600 text-[10px] font-mono rounded-xl transition-all flex items-center justify-center gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
          RESET DISCOURSE
        </button>
      </div>

      {/* Main Chat Center Column Right */}
      <div className="xl:col-span-3 bg-white border border-slate-200/80 rounded-2xl flex flex-col justify-between h-full overflow-hidden shadow-sm">
        
        {/* Chat Header banner */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
            <div>
              <span className="font-mono text-xs font-bold text-slate-800 block uppercase tracking-wider">
                EMERGIX CLINICAL CHAT LAB
              </span>
              <span className="text-[9.5px] text-indigo-600 font-mono font-bold uppercase">Neural Assistant online</span>
            </div>
          </div>
          <HelpCircle className="w-4 h-4 text-slate-400 hover:text-indigo-600 cursor-pointer" />
        </div>

        {/* Messaging Box Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                {/* Avatar icons */}
                <div className={`p-2 rounded-lg shrink-0 h-9 w-9 flex items-center justify-center border ${
                  msg.role === 'user' 
                    ? 'bg-slate-55 bg-slate-100 border-slate-200 text-sky-600 shadow-sm' 
                    : 'bg-indigo-50 border-indigo-150 border-indigo-100 text-indigo-600 shadow-sm'
                }`}>
                  {msg.role === 'user' ? <User className="w-4.5 h-4.5" /> : <Bot className="w-4.5 h-4.5 animate-pulse" />}
                </div>

                {/* Message Text bubble */}
                <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed whitespace-pre-wrap font-sans ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 border-indigo-600 text-white rounded-tr-none shadow-sm'
                    : 'bg-slate-50 border-slate-200/80 text-slate-800 rounded-tl-none font-medium'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex gap-3 max-w-[80%]"
              >
                <div className="p-2 rounded-lg shrink-0 h-9 w-9 flex items-center justify-center border bg-indigo-50 border-indigo-100 text-indigo-600 shadow-sm">
                  <Bot className="w-4.5 h-4.5 animate-bounce" />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  AI compiling physiological reasoning parameters...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef}></div>
        </div>

        {/* Chat Input form Footer */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-slate-50/50 flex gap-2 font-mono text-xs">
          <input 
            type="text" 
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type custom protocols, summaries or vital audits..." 
            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 outline-none focus:border-indigo-500 font-sans text-xs shadow-inner"
            id="chat-input-field"
          />

          <button 
            type="submit" 
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
    </div>
  );
}
