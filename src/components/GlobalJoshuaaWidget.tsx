/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Loader2, 
  HelpCircle, 
  Info,
  Maximize2,
  Minimize2,
  Heart,
  Terminal,
  Activity,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function GlobalJoshuaaWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'jsh-initial',
      role: 'assistant',
      content: "Hello! I am **Joshuaa**, your intelligent Emergix CRM co-pilot. \n\nI can help you clear doubts about page routing, dynamic fleet dispatches, edit controls, or medical operations. Ask me anything!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle preset help issues
  const handleQuerySample = (query: string) => {
    setInput(query);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: userText
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      // Build conversation with specific system context so Joshuaa knows its persona
      const contextPrompt = {
        role: 'user',
        content: `Persona Context: You are "Joshuaa", an elite, brief, and clear clinical assistant. You MUST give short, direct, very clear, easy-to-understand, neat, and highly accurate answers with exactly 2-3 short bullet points (maximum 50 words). Avoid paragraphs or essays.
        
        Answer this quick user query: "${userText}"`
      };

      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [contextPrompt] })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Joshuaa service communication anomaly.');
      }

      setMessages(prev => [...prev, {
        id: `jsh-${Date.now()}`,
        role: 'assistant',
        content: data.text
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `jsh-err-${Date.now()}`,
        role: 'assistant',
        content: `👋 **Joshuaa Backup Advisor Activated!** I am here to assist immediately! 🌟\n\nI encountered a brief model busy state, but worry not! I am always ready to guide you. If you have any doubts:\n- **Pencil Edit Controls**: Try out the brand new ✏️ **pencil icons** added to all changeable fields (Ages, Genders, ventilator speeds, ward divisions, active doctor shift statuses) to easily edit specs!\n- **Guidebook Tab**: Click the **"Operating Manual & Guide"** tab on your left sidebar to consult step-by-step role logs or clinical checklists!\n- We have full guidelines ready for you: try asking about Chest Pain, Stroke Codes, Asthma pathways, or Sepsis crystalloid bundles!\n\n*Tell me, which puzzle or doubt can I help you clear up? I am fully at your service!*`
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="joshuaa-global-floating-widget" className="fixed bottom-6 right-6 z-50 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            className="bg-slate-900 text-white w-80 sm:w-96 h-[500px] rounded-3xl shadow-2xl border border-slate-800 flex flex-col justify-between overflow-hidden mb-4 relative"
          >
            {/* Ambient Background Glow Inside Panel */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none z-0"></div>
            
            {/* Header */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-teal-400 to-sky-500 text-slate-950 rounded-xl animate-pulse">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold tracking-tight text-white flex items-center gap-1 font-sans">
                    JOSHUAA Operations Advisor
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  </h3>
                  <p className="text-[9px] text-slate-400 font-mono">Emergix Neutral Co-Pilot</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Guides & Small Message Log Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 relative z-10 bg-slate-950/40 text-left">
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role !== 'user' && (
                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700 text-teal-400 font-mono text-[10px]">
                      J
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-2xl text-[11px] max-w-[80%] leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-teal-600 text-slate-900 font-bold rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-750 border-slate-705/50 rounded-tl-none font-sans'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-1.5 text-[10px] text-teal-400 font-mono bg-slate-900/50 p-2 rounded-xl border border-slate-800 max-w-[120px]">
                  <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Helpful Quick Hints Guide */}
            {messages.length <= 1 && (
              <div className="p-3 bg-slate-900 border-t border-slate-800 space-y-1.5 text-left relative z-10">
                <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block font-bold">Frequently Asked Doubts:</span>
                <div className="flex flex-col gap-1">
                  {[
                    "How do I edit patient properties?",
                    "Where do I dispatched a manual ambulance?",
                    "How to monitor ventilator Active status?"
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuerySample(q)}
                      className="text-[10px] text-teal-400 hover:text-white hover:underline truncate text-left font-sans"
                    >
                      • {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2 relative z-10">
              <input 
                type="text" 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask Joshuaa to clear clinical doubts..." 
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500"
              />
              <button 
                type="submit" 
                className="bg-teal-505 bg-teal-400 hover:bg-teal-500 text-slate-950 p-2.5 rounded-xl transition-all shadow-md shadow-teal-500/15 font-bold"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Floating Circle Bubble Button */}
      <motion.button 
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 bg-teal-650 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-full shadow-2xl relative flex items-center justify-center border-4 border-slate-900 animate-bounce cursor-pointer"
        title="Consult Joshuaa Operations Assistant"
        id="joshuaa-floating-bubble-btn"
      >
        <Bot className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-mono py-0.5 px-1.5 rounded-full uppercase font-extrabold shadow-md border border-slate-900 leading-none">
          Live
        </span>
      </motion.button>

    </div>
  );
}
