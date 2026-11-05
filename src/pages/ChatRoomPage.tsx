import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, Smile, MoreVertical, Users, Pin, Flag, VolumeX, LogOut, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { format } from 'date-fns';
import type { RoomMessage } from '../services/chatService';

const REACTION_EMOJIS = ['❤️', '🌱', '🤍', '👍', '🫶'];
const COMMUNITY_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260419_065931_e3ca7b53-d32e-4ad5-81de-dc9d6fcfda6d.mp4';

export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const {
    rooms, currentMessages, typingUsers, userId, anonymousName,
    loadRoomMessages, sendMessage, addReaction, leaveRoom, reportMessage, blockUser,
  } = useChat();

  const room = rooms.find(r => r.id === roomId);
  const [input, setInput] = useState('');
  const [replyTo, setReplyTo] = useState<RoomMessage | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!roomId) return;
    const unsub = loadRoomMessages(roomId);
    return () => { if (typeof unsub === 'function') unsub(); };
  }, [roomId, loadRoomMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return currentMessages;
    const q = searchQuery.toLowerCase();
    return currentMessages.filter(m => m.content.toLowerCase().includes(q) || m.anonymousName.toLowerCase().includes(q));
  }, [currentMessages, searchQuery]);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;
    sendMessage(roomId, input, replyTo ? {
      messageId: replyTo.id,
      content: replyTo.content,
      anonymousName: replyTo.anonymousName,
    } : undefined);
    setInput('');
    setReplyTo(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp?.toDate?.() || new Date(timestamp);
      return format(date, 'h:mm a');
    } catch { return ''; }
  };

  if (!room) {
    return (
      <div className="relative min-h-screen">
        <PageVideoBackground videoUrl={COMMUNITY_VIDEO} overlay={0.3} />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-white/60 text-lg mb-4">Room not found</p>
            <button onClick={() => navigate('/community')} className="liquid-glass-pill px-6 py-2 text-white/60 text-sm">Back to Community</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      <PageVideoBackground videoUrl={COMMUNITY_VIDEO} overlay={0.25} />
      {/* Dark atmospheric layer */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,9,17,0.42)', backdropFilter: 'blur(2px)', zIndex: 1 }} />

      {/* ─── Header ──────────────────────────── */}
      <div className="relative z-10 flex items-center gap-3 px-4 py-3" style={{ background: 'rgba(8,12,20,0.78)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={() => navigate('/community')} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white/60" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{room.icon}</span>
            <h2 className="text-white font-medium text-sm truncate">{room.name}</h2>
          </div>
          <p className="text-white/30 text-xs">{room.onlineCount} online</p>
        </div>
        <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <Search className="w-4 h-4 text-white/40" />
        </button>
        <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <MoreVertical className="w-4 h-4 text-white/40" />
        </button>

        {/* Menu dropdown */}
        <AnimatePresence>
          {showMenu && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full right-4 mt-1 rounded-xl overflow-hidden z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', minWidth: 180 }}>
              {room.pinnedMessage && (
                <button onClick={() => { setShowMenu(false); }} className="w-full px-4 py-3 text-left text-white/60 text-sm hover:bg-white/5 flex items-center gap-2">
                  <Pin className="w-3.5 h-3.5" /> Pinned Message
                </button>
              )}
              <button onClick={() => { setShowMenu(false); setReportTarget('room'); }} className="w-full px-4 py-3 text-left text-white/60 text-sm hover:bg-white/5 flex items-center gap-2">
                <Flag className="w-3.5 h-3.5" /> Report Room
              </button>
              <button onClick={() => { setShowMenu(false); leaveRoom(room.id); navigate('/community'); }} className="w-full px-4 py-3 text-left text-red-400/60 text-sm hover:bg-white/5 flex items-center gap-2">
                <LogOut className="w-3.5 h-3.5" /> Leave Room
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Search bar ──────────────────────── */}
      <AnimatePresence>
        {showSearch && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative z-10 overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-4 py-2">
              <input type="text" placeholder="Search messages..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-lavender/30" autoFocus />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Pinned message ──────────────────── */}
      {room.pinnedMessage && (
        <div className="relative z-10 px-4 py-2.5" style={{ background: 'rgba(155,191,169,0.10)', borderBottom: '1px solid rgba(155,191,169,0.12)' }}>
          <div className="flex items-center gap-2">
            <Pin className="w-3 h-3 text-sage/60 flex-shrink-0" />
            <p className="text-white/60 text-xs leading-relaxed">{room.pinnedMessage}</p>
          </div>
        </div>
      )}

      {/* ─── Messages ────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
        {filteredMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-white/40 text-sm">You're the first to say something</p>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isOwn = msg.userId === userId;
            const replyToMsg = msg.replyTo;

            return (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`} style={{ maxWidth: '85%' }}>
                {/* Reply preview */}
                {replyToMsg && (
                  <div className={`mb-1 px-3 py-1.5 rounded-lg text-xs ${isOwn ? 'mr-2' : 'ml-2'}`} style={{ background: 'rgba(0,0,0,0.30)', borderLeft: '2px solid rgba(155,191,169,0.5)' }}>
                    <span className="text-sage font-medium">{replyToMsg.anonymousName}</span>
                    <p className="text-white/45 truncate max-w-[200px]">{replyToMsg.content}</p>
                  </div>
                )}

                {/* Name */}
                {!isOwn && (
                  <span className="text-[10px] ml-2 mb-0.5 font-medium" style={{ color: 'rgba(23,32,29,0.7)' }}>{msg.anonymousName}</span>
                )}

                {/* Bubble */}
                <div
                  className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed group ${
                    isOwn ? 'rounded-br-md' : 'rounded-bl-md'
                  }`}
                  style={{
                    background: isOwn
                      ? 'rgba(52,48,90,0.88)'
                      : 'rgba(245,248,247,0.90)',
                    border: `1px solid ${isOwn ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.55)'}`,
                    backdropFilter: 'blur(20px)',
                    color: isOwn ? '#FFFFFF' : '#17201D',
                    boxShadow: isOwn ? '0 8px 25px rgba(52,48,90,0.2)' : '0 8px 25px rgba(0,0,0,0.12)',
                  }}
                  onDoubleClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                >
                  {msg.content}

                  {/* Timestamp */}
                  <span className="text-[9px] block mt-1" style={{ color: isOwn ? 'rgba(255,255,255,0.55)' : '#66726D' }}>{formatDate(msg.createdAt)}</span>

                  {/* Reaction picker on hover */}
                  {showReactions === msg.id && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute -top-10 left-0 flex gap-1 rounded-full px-2 py-1 z-20" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      {REACTION_EMOJIS.map(emoji => (
                        <button key={emoji} onClick={() => { addReaction(msg.id, emoji); setShowReactions(null); }} className="text-sm hover:scale-125 transition-transform px-0.5">{emoji}</button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Existing reactions */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className={`flex gap-1 mt-1 ${isOwn ? 'mr-2' : 'ml-2'}`}>
                    {Object.entries(msg.reactions).map(([emoji, users]) => {
                      const hasReacted = users.includes(userId);
                      return (
                        <button key={emoji} onClick={() => addReaction(msg.id, emoji)} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] transition-all ${hasReacted ? 'bg-white/10 border border-white/15' : 'bg-white/3 border border-transparent hover:bg-white/5'}`}>
                          <span>{emoji}</span>
                          <span className="text-white/30">{users.length}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Action buttons on hover */}
                <div className={`flex gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${isOwn ? 'mr-2' : 'ml-2'}`}>
                  <button onClick={() => setReplyTo(msg)} className="text-[9px] text-white/15 hover:text-white/40 transition-colors">Reply</button>
                  {!isOwn && (
                    <button onClick={() => setReportTarget(msg.id)} className="text-[9px] text-white/15 hover:text-red-400/50 transition-colors">Report</button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}

        {/* Typing indicator */}
        {typingUsers[roomId || ''] && (
          <div className="flex items-center gap-2 ml-2">
            <div className="flex gap-1 px-3 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
            <span className="text-white/20 text-[10px]">Someone is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── Reply preview ───────────────────── */}
      <AnimatePresence>
        {replyTo && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative z-10 overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-4 py-2.5 flex items-center gap-3">
              <div className="flex-1 min-w-0 pl-3" style={{ borderLeft: '2px solid rgba(155,191,169,0.4)' }}>
                <p className="text-sage/60 text-[10px] font-medium">Replying to {replyTo.anonymousName}</p>
                <p className="text-white/30 text-xs truncate">{replyTo.content}</p>
              </div>
              <button onClick={() => setReplyTo(null)} className="text-white/30 hover:text-white/60"><span className="text-xs">✕</span></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Input ───────────────────────────── */}
      <div className="relative z-10 px-4 py-3" style={{ background: 'rgba(12,16,24,0.85)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-end gap-2">
          <button className="p-2 rounded-xl hover:bg-white/5 transition-colors flex-shrink-0 mb-0.5">
            <Smile className="w-5 h-5 text-white/30" />
          </button>
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share something..."
              rows={1}
              className="w-full rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none"
              style={{ background: 'rgba(12,16,24,0.82)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', minHeight: 40, maxHeight: 120 }}
            />
          </div>
          <motion.button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl flex-shrink-0 mb-0.5 transition-all disabled:opacity-20"
            style={{ background: input.trim() ? 'rgba(155,191,169,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.92 }}
          >
            <Send className="w-4 h-4 text-white/60" />
          </motion.button>
        </div>
      </div>

      {/* ─── Report Modal ────────────────────── */}
      <AnimatePresence>
        {reportTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setReportTarget(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="rounded-2xl p-6 max-w-sm w-full" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)' }} onClick={e => e.stopPropagation()}>
              <h3 className="text-white text-lg font-medium mb-4">Report</h3>
              <div className="space-y-2 mb-6">
                {['Harassment', 'Spam', 'Harmful content', 'Self-harm concern', 'Unsafe advice', 'Other'].map(reason => (
                  <button key={reason} onClick={() => { reportMessage(reportTarget, reason); setReportTarget(null); }} className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-white/40 hover:bg-white/5 hover:text-white transition-all">{reason}</button>
                ))}
              </div>
              <button onClick={() => setReportTarget(null)} className="w-full py-2.5 text-white/40 text-sm rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
