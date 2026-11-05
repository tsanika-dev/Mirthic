import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, Minimize2, Trash2, Activity, Music, BookOpen, Gamepad2, Dumbbell } from 'lucide-react';
import { useAI } from '../../hooks/useAI';
import { useNavigate } from 'react-router-dom';

const SUGGESTED_PROMPTS = [
  "I'm feeling stressed",
  "I can't sleep",
  "I feel overwhelmed",
  "Help me relax",
  "Give me a breathing exercise",
];

const AI_ACTION_BUTTONS = [
  { icon: Activity, label: 'Breathe', path: '/exercises', color: '#9BBFA9' },
  { icon: Music, label: 'Focus Music', path: '/play-listen?tab=music', color: '#C678DD' },
  { icon: Gamepad2, label: 'Quick Game', path: '/play-listen?tab=games', color: '#61AFEF' },
  { icon: BookOpen, label: 'Journal', path: '/journal', color: '#E882B4' },
  { icon: Dumbbell, label: 'Exercise', path: '/exercises', color: '#F4845F' },
];

export function AIChat() {
  const { messages, isTyping, sendMessage, startNewConversation, activeConversation } = useAI();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const message = text || input.trim();
    if (!message || isTyping) return;
    setInput('');
    if (!activeConversation) {
      await startNewConversation(message);
    } else {
      await sendMessage(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} onClick={() => setIsOpen(true)} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full liquid-glass flex items-center justify-center shadow-lg shadow-black/20 hover:shadow-sage/20 transition-shadow group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sage/20 to-lavender/20 animate-pulse" />
            <MessageCircle className="w-5 h-5 text-white relative z-10" />
            <span className="absolute -top-10 right-0 bg-[#0B1220]/90 text-white/70 text-xs px-3 py-1.5 rounded-full whitespace-nowrap border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">Mirthic AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} transition={{ duration: 0.3, ease: 'easeOut' }} className="fixed inset-x-3 bottom-16 md:inset-x-auto md:bottom-6 md:right-6 md:w-96 md:h-[600px] z-50 liquid-glass rounded-2xl md:rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/40" style={{ maxHeight: 'calc(100vh - 100px)' }}>
              {/* Neural particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-sage/5 via-transparent to-lavender/5" />
                {[...Array(8)].map((_, i) => (
                  <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-sage/20" style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%` }} animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
                ))}
              </div>

              {/* Header */}
              <div className="relative flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sage/30 to-lavender/30 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 text-white/70" />
                    </div>
                    <motion.div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-sage" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Mirthic AI</p>
                    <p className="text-white/30 text-xs">Always here to listen</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 text-white/30 hover:text-white/60 transition-colors rounded-lg hover:bg-white/5">
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 py-4">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-sage/20 to-lavender/20 flex items-center justify-center">
                        <motion.div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage/30 to-lavender/30" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} />
                      </div>
                      <p className="text-white/60 text-sm mb-1">Hi 👋 I'm here to listen.</p>
                      <p className="text-white/40 text-xs">What would you like to talk about?</p>
                    </div>
                    <div className="space-y-2">
                      {SUGGESTED_PROMPTS.map((prompt, i) => (
                        <motion.button key={prompt} onClick={() => handleSend(prompt)} className="w-full text-left px-4 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm hover:bg-white/10 hover:text-white/70 transition-all border border-white/5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ x: 4 }}>{prompt}</motion.button>
                      ))}
                    </div>
                    <div className="pt-2">
                      <p className="text-white/20 text-[10px] mb-2">Or try a feature:</p>
                      <div className="flex flex-wrap gap-2">
                        {AI_ACTION_BUTTONS.map(btn => (
                          <motion.button key={btn.label} onClick={() => { navigate(btn.path); setIsOpen(false); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs" style={{ background: `${btn.color}15`, border: `1px solid ${btn.color}25`, color: btn.color }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <btn.icon className="w-3 h-3" /> {btn.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {messages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-sage/15 text-white/80 rounded-br-md' : 'bg-white/5 text-white/60 rounded-bl-md'}`}>{msg.content}</div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2">
                        <motion.div className="w-2 h-2 rounded-full bg-sage/40" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
                        <motion.div className="w-2 h-2 rounded-full bg-sage/40" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} />
                        <motion.div className="w-2 h-2 rounded-full bg-sage/40" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} />
                        <span className="text-white/30 text-xs ml-1">Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="relative px-4 py-2 border-t border-white/5">
                <p className="text-white/20 text-[10px] text-center">Mirthic AI provides general wellness support, not professional medical care.</p>
              </div>

              <div className="relative p-3 border-t border-white/5">
                <div className="flex items-center gap-2 bg-white/5 rounded-full pl-4 pr-2 py-1.5">
                  <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message..." className="flex-1 bg-transparent text-white text-sm placeholder-white/30 focus:outline-none" disabled={isTyping} />
                  <motion.button onClick={() => handleSend()} disabled={!input.trim() || isTyping} className="p-2 rounded-full bg-white/10 text-white/60 hover:text-white disabled:opacity-30 transition-all" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}