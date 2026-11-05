import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Heart, MessageCircle, Flag, Send, X, Users, DoorOpen, Circle, Clock, ChevronRight, MessageSquare, Search } from 'lucide-react';
import { useCommunity } from '../hooks/useCommunity';
import { useChat } from '../hooks/useChat';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'General', 'Stress', 'College Life', 'Relationships', 'Self Care', 'Motivation'];
const REPORT_REASONS = ['Harassment', 'Spam', 'Harmful content', 'Self-harm concern', 'Unsafe advice', 'Other'];
const ANONYMOUS_NAMES = ['MindfulSoul', 'HopefulMind', 'CalmSpirit', 'PeacefulHeart', 'SereneThought', 'GentleWave', 'QuietStrength', 'WarmGlow'];
const TABS = ['Feed', 'Rooms', 'Messages'] as const;
type Tab = typeof TABS[number];

export default function CommunityPage() {
  const { posts, addPost, likePost, addReply, reportPost } = useCommunity();
  const { rooms, joinedRoomIds, conversations, anonymousName, joinRoom, leaveRoom, startConversation } = useChat();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>('Feed');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('General');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [roomSearch, setRoomSearch] = useState('');

  const filteredPosts = selectedCategory === 'All' ? posts : posts.filter(p => p.category === selectedCategory);

  const filteredRooms = useMemo(() => {
    if (!roomSearch.trim()) return rooms;
    const q = roomSearch.toLowerCase();
    return rooms.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));
  }, [rooms, roomSearch]);

  const getAnonymousName = (userId: string) => {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) { hash = ((hash << 5) - hash) + userId.charCodeAt(i); hash |= 0; }
    return ANONYMOUS_NAMES[Math.abs(hash) % ANONYMOUS_NAMES.length];
  };

  const handleNewPost = async () => {
    if (!newPostContent.trim() || submitting) return;
    setSubmitting(true);
    try { await addPost(newPostContent, newPostCategory); setNewPostContent(''); setShowNewPost(false); } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const handleReply = async (postId: string) => { if (!replyContent.trim()) return; await addReply(postId, replyContent); setReplyContent(''); };
  const handleReport = async () => { if (!reportTarget || !reportReason) return; await reportPost(reportTarget, reportReason, 'other'); setReportTarget(null); setReportReason(''); };

  return (
    <div className="relative min-h-screen">
      <PageVideoBackground videoUrl="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260419_065931_e3ca7b53-d32e-4ad5-81de-dc9d6fcfda6d.mp4" overlay={0.22} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: 'radial-gradient(ellipse at 50% 40%, rgba(100,60,160,0.06) 0%, transparent 60%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-2">Community</h1>
            <p className="text-white/50 text-base flex items-center gap-2"><Users className="w-4 h-4" />A safe space to share and connect</p>
          </div>
          {activeTab === 'Feed' && (
            <motion.button onClick={() => setShowNewPost(true)} className="liquid-glass-pill px-5 py-2.5 text-white/80 hover:text-white flex items-center gap-2 text-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Plus className="w-4 h-4" /> Share
            </motion.button>
          )}
        </motion.div>

        {/* Tabs */}
        <motion.div className="flex gap-2 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2.5 text-sm rounded-xl transition-all font-medium ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}>
              {tab}
            </button>
          ))}
        </motion.div>

        {/* ═══════════ FEED TAB ═══════════ */}
        {activeTab === 'Feed' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`liquid-glass-pill px-4 py-1.5 text-xs transition-all ${selectedCategory === cat ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>{cat}</button>
              ))}
            </div>

            {/* New post modal */}
            <AnimatePresence>
              {showNewPost && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewPost(false)}>
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="liquid-glass rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white text-lg font-medium">Share anonymously</h3>
                      <button onClick={() => setShowNewPost(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <select value={newPostCategory} onChange={e => setNewPostCategory(e.target.value)} className="w-full liquid-glass rounded-xl px-4 py-2.5 text-white/70 text-sm bg-transparent mb-3 focus:outline-none appearance-none">
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-[#0B1220]">{c}</option>)}
                    </select>
                    <textarea value={newPostContent} onChange={e => setNewPostContent(e.target.value)} placeholder="What's on your mind?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-sage/30 min-h-[120px]" rows={5} />
                    <div className="flex justify-end mt-4">
                      <motion.button onClick={handleNewPost} disabled={!newPostContent.trim() || submitting} className="liquid-glass-pill px-6 py-2.5 text-white text-sm flex items-center gap-2 disabled:opacity-40" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Send className="w-3.5 h-3.5" /> Post Anonymously
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <div className="liquid-glass rounded-2xl p-12 text-center">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-white/60 text-lg mb-2">Be the first to share something</p>
                  <p className="text-white/30 text-sm">Your post will be completely anonymous.</p>
                </div>
              ) : filteredPosts.map((post, i) => (
                <motion.div key={post.id} className="liquid-glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lavender/30 to-sage/30 flex items-center justify-center text-xs text-white/70 font-medium">
                        {getAnonymousName(post.userId).charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{getAnonymousName(post.userId)}</p>
                        <p className="text-white/30 text-xs">{post.createdAt?.toDate?.() ? new Date(post.createdAt.toDate()).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-xs">{post.category}</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed mb-4">{post.content}</p>
                  <div className="flex items-center gap-4">
                    <motion.button onClick={() => likePost(post.id)} className="flex items-center gap-1.5 text-white/30 hover:text-sage text-xs transition-colors" whileTap={{ scale: 0.9 }}>
                      <Heart className="w-3.5 h-3.5" /> {post.likeCount || 0}
                    </motion.button>
                    <button onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)} className="flex items-center gap-1.5 text-white/30 hover:text-white text-xs transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setReportTarget(post.id)} className="text-white/20 hover:text-red-400 text-xs transition-colors ml-auto">
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {expandedPost === post.id && (
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-2">
                        <input type="text" value={replyContent} onChange={e => setReplyContent(e.target.value)} placeholder="Write a supportive reply..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-sage/30" onKeyDown={e => e.key === 'Enter' && handleReply(post.id)} />
                        <motion.button onClick={() => handleReply(post.id)} className="p-2 rounded-full bg-white/5 text-white/40 hover:text-white" whileTap={{ scale: 0.9 }}><Send className="w-4 h-4" /></motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════ ROOMS TAB ═══════════ */}
        {activeTab === 'Rooms' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-6">
              <h2 className="font-serif text-xl md:text-2xl text-white mb-2">Find your people.</h2>
              <p className="text-white/40 text-sm">Join a space where you can talk, listen and feel understood.</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" placeholder="Find a room..." value={roomSearch} onChange={e => setRoomSearch(e.target.value)} className="w-full liquid-glass rounded-full pl-11 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none" />
            </div>

            {/* Room cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRooms.map((room, i) => {
                const isJoined = joinedRoomIds.has(room.id);
                return (
                  <motion.div
                    key={room.id}
                    className="liquid-glass rounded-2xl p-5 cursor-pointer group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{room.icon}</span>
                        <div>
                          <h3 className="text-white font-medium text-sm">{room.name}</h3>
                          <p className="text-white/30 text-xs mt-0.5">{room.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-white/25 mb-4">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" />{room.memberCount} members</span>
                      <span className="flex items-center gap-1"><Circle className="w-2 h-2 fill-green-400/50 text-green-400/50" />{room.onlineCount} online</span>
                    </div>
                    {isJoined ? (
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/community/rooms/${room.id}`); }} className="flex-1 py-2.5 rounded-xl text-sm text-white flex items-center justify-center gap-2 transition-all" style={{ background: 'rgba(155,191,169,0.15)', border: '1px solid rgba(155,191,169,0.2)' }}>
                          <DoorOpen className="w-3.5 h-3.5" /> Enter Room
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); leaveRoom(room.id); }} className="px-3 py-2.5 rounded-xl text-xs text-white/30 hover:text-white/50 transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          Leave
                        </button>
                      </div>
                    ) : (
                      <button onClick={(e) => { e.stopPropagation(); joinRoom(room.id); }} className="w-full py-2.5 rounded-xl text-sm text-white/60 hover:text-white flex items-center justify-center gap-2 transition-all group-hover:bg-white/5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                        Join Room <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════════ MESSAGES TAB ═══════════ */}
        {activeTab === 'Messages' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mb-6">
              <h2 className="font-serif text-xl md:text-2xl text-white mb-2">Messages</h2>
              <p className="text-white/40 text-sm">Private conversations with other members.</p>
            </div>

            {conversations.length === 0 ? (
              <div className="liquid-glass rounded-2xl p-12 text-center">
                <MessageSquare className="w-10 h-10 text-white/15 mx-auto mb-4" />
                <p className="text-white/60 text-lg mb-2">No conversations yet</p>
                <p className="text-white/30 text-sm">Start a conversation from a community post.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {conversations.map((convo, i) => {
                  const otherId = convo.participantIds.find(id => id !== (useChat as any).userId) || '';
                  const otherName = convo.participantNames?.[otherId] || 'Anonymous';
                  return (
                    <motion.div
                      key={convo.id}
                      className="liquid-glass rounded-2xl p-4 flex items-center gap-3 cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender/20 to-sage/20 flex items-center justify-center text-sm text-white/60 font-medium">
                        {otherName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{otherName}</p>
                        <p className="text-white/30 text-xs truncate">{convo.lastMessage || 'Start a conversation'}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/15" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── Report Modal ────────────────────── */}
        <AnimatePresence>
          {reportTarget && !posts.find(p => p.id === reportTarget) && reportReason === '' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setReportTarget(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="liquid-glass rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-white text-lg font-medium mb-4">Report this post</h3>
                <div className="space-y-2 mb-6">
                  {REPORT_REASONS.map(reason => (
                    <button key={reason} onClick={() => setReportReason(reason)} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all ${reportReason === reason ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5'}`}>{reason}</button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => { setReportTarget(null); setReportReason(''); }} className="flex-1 liquid-glass-pill py-2.5 text-white/60 text-sm">Cancel</button>
                  <button onClick={handleReport} disabled={!reportReason} className="flex-1 bg-red-500/20 text-red-400 rounded-full py-2.5 text-sm disabled:opacity-40 transition-colors">Report</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
