import { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, Filter, Plus, Trash2, Edit3, Tag, ArrowDown, ArrowUp, ArrowRight, X, Save, PenTool, Gamepad2, Music, Laugh, Send, Brain, Clock, ChevronRight } from 'lucide-react';
import { saveBrainDumpEntry, getBrainDumpEntries, deleteBrainDumpEntry } from '../services/brainDumpService';
import { saveFutureMessage, getFutureMessages, getDueMessages, markDelivered, deleteFutureMessage } from '../services/futureMeService';
import { getFreshJoke } from '../services/smileHubService';
import { useNavigate } from 'react-router-dom';
import { useMood } from '../hooks/useMood';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getMoodRecommendations } from '../services/moodRecommendationService';
import { addCheckin, completeCheckin, getCheckins } from '../services/moodCapsuleService';
import type { MoodLevel } from '../types';

const MOODS = [
  { score: 1, mood: 'very_bad' as MoodLevel, label: 'Very Bad', emoji: '😞', color: '#6B7280' },
  { score: 2, mood: 'bad' as MoodLevel, label: 'Bad', emoji: '😕', color: '#94A3B8' },
  { score: 3, mood: 'okay' as MoodLevel, label: 'Okay', emoji: '😐', color: '#CBD5E1' },
  { score: 4, mood: 'good' as MoodLevel, label: 'Good', emoji: '🙂', color: '#9BBFA9' },
  { score: 5, mood: 'great' as MoodLevel, label: 'Great', emoji: '😄', color: '#C6E6D3' },
];

const TAGS = ['Stress', 'Study', 'Sleep', 'Family', 'Friends', 'Work', 'Health', 'Other'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="liquid-glass rounded-xl px-4 py-3 border border-white/10">
        <p className="text-white/60 text-xs">{label}</p>
        <p className="text-white text-lg font-medium">{payload[0].value}/5</p>
      </div>
    );
  }
  return null;
};

export default function MoodTrackerPage() {
  const { entries, loading, addEntry, deleteEntry, updateEntry } = useMood();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<'7d' | '30d' | '90d'>('7d');
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const [lastCheckinId, setLastCheckinId] = useState<string | null>(null);
  const [afterMood, setAfterMood] = useState<number | null>(null);
  const [showAfterMood, setShowAfterMood] = useState(false);

  const filteredEntries = useMemo(() => {
    const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90;
    const cutoff = subDays(new Date(), days);
    return entries
      .filter(e => new Date(e.date) > cutoff)
      .sort((a, b) => sortOrder === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
  }, [entries, filter, sortOrder]);

  const stats = useMemo(() => {
    if (filteredEntries.length === 0) return { avg: 0, total: 0, mostCommon: '-' };
    const scores = filteredEntries.map(e => e.moodScore);
    const avg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
    const frequency: Record<number, number> = {};
    scores.forEach(s => { frequency[s] = (frequency[s] || 0) + 1; });
    const mostCommon = Object.entries(frequency).sort((a, b) => b[1] - a[1])[0];
    return { avg, total: filteredEntries.length, mostCommon: MOODS.find(m => m.score === Number(mostCommon[0]))?.emoji || '-' };
  }, [filteredEntries]);

  const chartData = useMemo(() => {
    const now = new Date();
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const daysInRange = eachDayOfInterval({ start: weekStart, end: weekEnd });
    return daysInRange.map((day, i) => {
      const dayEntries = entries.filter(e => e.date === format(day, 'yyyy-MM-dd'));
      const avg = dayEntries.length > 0
        ? dayEntries.reduce((sum, e) => sum + e.moodScore, 0) / dayEntries.length
        : 0;
      return { name: labels[i] || format(day, 'EEE'), mood: Number(avg.toFixed(1)) };
    });
  }, [entries, filter]);

  const handleSave = useCallback(async () => {
    if (!selectedMood || saving) return;
    setSaving(true);
    try {
      const moodObj = MOODS.find(m => m.score === selectedMood);
      if (!moodObj) return;
      if (editingEntry) {
        await updateEntry(editingEntry.id, moodObj.mood, note, selectedTags);
      } else {
        await addEntry(moodObj.mood, note, selectedTags);
      }
      // Create a before/after check-in record
      const checkin = addCheckin('mood', moodObj.score);
      setShowRecommendations(true);
      setLastCheckinId(checkin.id);
    } catch (err) {
      console.error('Error saving mood:', err);
    } finally { setSaving(false); }
  }, [selectedMood, note, selectedTags, editingEntry, saving, addEntry, updateEntry]);

  const handleEdit = (entry: any) => {
    setEditingEntry(entry); setSelectedMood(entry.moodScore); setNote(entry.note || '');
    setSelectedTags(entry.tags || []); setShowForm(true);
  };

  const handleDelete = async (id: string) => { await deleteEntry(id); setDeleteConfirm(null); };

  const toggleTag = (tag: string) => { setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]); };
  const getMoodInfo = (score: number) => MOODS.find(m => m.score === score) || MOODS[2];

  return (
    <div className="relative min-h-screen">
      <PageVideoBackground videoUrl="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4" overlay={0.22} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: 'radial-gradient(ellipse at 50% 40%, rgba(60,50,140,0.06) 0%, transparent 60%)' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-2">Your emotional journey</h1>
          <p className="text-white/50 text-base md:text-lg">Track your mood, reflect on your feelings, and discover patterns.</p>
        </motion.div>

        <motion.div className="grid grid-cols-3 gap-3 md:gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {[
            { label: 'Average Mood', value: `${stats.avg}/5`, icon: TrendingUp },
            { label: 'Check-ins', value: stats.total.toString(), icon: Calendar },
            { label: 'Most Common', value: stats.mostCommon, icon: Filter },
          ].map((stat) => (
            <motion.div key={stat.label} className="liquid-glass rounded-2xl p-4 md:p-5 text-center" whileHover={{ y: -4 }}>
              <stat.icon className="w-4 h-4 text-white/40 mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-light text-white mb-1">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {!showForm && (
          <motion.button onClick={() => setShowForm(true)} className="liquid-glass-pill px-6 py-3 text-white/80 hover:text-white flex items-center gap-2 mx-auto" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Plus className="w-4 h-4" /> Track Today's Mood
          </motion.button>
        )}

        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -20, height: 0 }} className="liquid-glass rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-white text-lg font-medium">{editingEntry ? 'Edit mood entry' : 'How are you feeling today?'}</h2>
                <button onClick={() => { setShowForm(false); setEditingEntry(null); setSelectedMood(null); setNote(''); setSelectedTags([]); setShowRecommendations(false); }} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                {MOODS.map((mood) => (
                  <motion.button key={mood.score} onClick={() => setSelectedMood(mood.score)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${selectedMood === mood.score ? 'liquid-glass border-sage/40 bg-white/5' : 'hover:bg-white/5'}`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <span className="text-3xl md:text-4xl">{mood.emoji}</span>
                    <span className={`text-xs ${selectedMood === mood.score ? 'text-white' : 'text-white/50'}`}>{mood.label}</span>
                  </motion.button>
                ))}
              </div>
              {selectedMood && !showRecommendations && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write a few words about how you're feeling..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-sage/40 transition-colors" rows={3} />
                  <div>
                    <p className="text-white/40 text-sm mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {TAGS.map(tag => (
                        <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded-full text-xs transition-all ${selectedTags.includes(tag) ? 'bg-sage/20 text-sage border border-sage/30' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'}`}>{tag}</button>
                      ))}
                    </div>
                  </div>
                  <motion.button onClick={handleSave} disabled={saving} className="liquid-glass-pill px-8 py-3 text-white font-medium flex items-center gap-2 mx-auto disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                    {editingEntry ? 'Update Entry' : 'Save Mood'}
                  </motion.button>
                </motion.div>
              )}

              {/* Mood-Based Recommendations */}
              {selectedMood && showRecommendations && (() => {
                const moodLabel = MOODS.find(m => m.score === selectedMood)?.mood || 'okay';
                const recs = getMoodRecommendations(moodLabel);
                const actions = [
                  { icon: PenTool, label: 'Write', desc: 'Journal your thoughts', color: '#9BBFA9', bg: 'rgba(155,191,169,0.12)', action: () => navigate('/journal') },
                  { icon: Laugh, label: 'Laugh', desc: 'A gentle distraction', color: '#E882B4', bg: 'rgba(232,130,180,0.12)', action: () => navigate('/play-listen?tab=jokes') },
                  { icon: Gamepad2, label: 'Play', desc: 'Take a fun break', color: '#61AFEF', bg: 'rgba(97,175,239,0.12)', action: () => navigate('/play-listen?tab=games') },
                  { icon: Music, label: 'Listen', desc: 'Music for your mood', color: '#C678DD', bg: 'rgba(198,120,221,0.12)', action: () => navigate('/play-listen?tab=music') },
                ];
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <p className="text-white/60 text-sm text-center">Here's something for you</p>
                    <div className="grid grid-cols-2 gap-3">
                      {actions.map((a) => (
                        <motion.button key={a.label} onClick={a.action} className="rounded-2xl p-4 text-left transition-all" style={{ background: a.bg, border: `1px solid ${a.color}22` }} whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <a.icon className="w-5 h-5 mb-2" style={{ color: a.color }} />
                          <p className="text-white text-sm font-medium">{a.label}</p>
                          <p className="text-white/40 text-xs mt-0.5">{a.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                    {recs.journalPrompt && (
                      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <p className="text-white/50 text-xs mb-1">Journal prompt</p>
                        <p className="text-white/70 text-sm italic">{recs.journalPrompt}</p>
                      </div>
                    )}
                    {/* Mini Experience */}
                    <MiniExperience mood={MOODS.find(m => m.score === selectedMood)?.mood || 'okay'} />
                    <motion.button onClick={() => setShowAfterMood(true)} className="text-white/30 text-xs hover:text-white/50 block mx-auto" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '6px 14px', borderRadius: '9999px' }}>
                      How do you feel now?
                    </motion.button>
                    <motion.button onClick={() => { setShowRecommendations(false); }} className="text-white/30 text-xs hover:text-white/50 mx-auto block">← Back to save</motion.button>
                  </motion.div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="liquid-glass rounded-3xl p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-medium">Mood History</h3>
            <div className="flex gap-2">
              {(['7d', '30d', '90d'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`liquid-glass-pill px-3 py-1.5 text-xs transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
                  {f === '7d' ? '7 Days' : f === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>
          </div>
          {chartData.some(d => d.mood > 0) ? (
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs><linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9BBFA9" stopOpacity={0.3} /><stop offset="95%" stopColor="#9BBFA9" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <YAxis domain={[0, 5]} stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="mood" stroke="#9BBFA9" strokeWidth={2} fill="url(#moodGradient)" dot={{ fill: '#9BBFA9', r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-16"><div className="text-5xl mb-4">🌱</div><p className="text-white/60 text-lg mb-2">Your mood journey starts here</p><p className="text-white/30 text-sm">Check in today to begin tracking your emotional well-being.</p></div>
          )}
        </motion.div>

        <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Recent Entries</h3>
            <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="text-white/40 hover:text-white flex items-center gap-1 text-xs">
              {sortOrder === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}{sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>
          {filteredEntries.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-8 text-center"><p className="text-white/40">No mood entries for this period</p></div>
          ) : filteredEntries.map((entry, i) => {
            const moodInfo = getMoodInfo(entry.moodScore);
            return (
              <motion.div key={entry.id} className="liquid-glass rounded-2xl p-4 md:p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{moodInfo.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white text-sm font-medium">{moodInfo.label}</span>
                        <span className="text-white/30 text-xs">{entry.date}</span>
                      </div>
                      {entry.note && <p className="text-white/50 text-sm">{entry.note}</p>}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">{entry.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-xs flex items-center gap-1"><Tag className="w-2.5 h-2.5" />{tag}</span>)}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(entry)} className="p-2 text-white/30 hover:text-sage transition-colors rounded-lg hover:bg-white/5"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteConfirm(entry.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {deleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="liquid-glass rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-white text-lg font-medium mb-2">Delete this mood entry?</h3>
                <p className="text-white/40 text-sm mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 liquid-glass-pill py-2.5 text-white/60 text-sm hover:text-white">Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500/20 text-red-400 rounded-full py-2.5 text-sm hover:bg-red-500/30 transition-colors">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* After-Mood Check-in */}
        <AnimatePresence>
          {showAfterMood && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAfterMood(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="liquid-glass rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-white text-lg font-medium mb-1">How do you feel now?</h3>
                <p className="text-white/40 text-sm mb-4">Compare with how you felt before.</p>
                <div className="flex justify-center gap-3 mb-4">
                  {MOODS.map(mood => (
                    <button key={mood.score} onClick={() => setAfterMood(mood.score)} className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all" style={{ background: afterMood === mood.score ? 'rgba(155,191,169,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${afterMood === mood.score ? 'rgba(155,191,169,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-[10px]" style={{ color: afterMood === mood.score ? '#9BBFA9' : 'rgba(255,255,255,0.4)' }}>{mood.label}</span>
                    </button>
                  ))}
                </div>
                {afterMood && selectedMood && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl p-4 mb-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <span className="text-white/50">{MOODS.find(m => m.score === selectedMood)?.emoji} Before</span>
                      <ArrowRight className="w-4 h-4 text-white/30" />
                      <span className="text-white/80">{MOODS.find(m => m.score === afterMood)?.emoji} After</span>
                    </div>
                    <p className="text-white/30 text-xs text-center mt-2">
                      {afterMood > selectedMood ? 'Looks like things improved! 🌱' : afterMood < selectedMood ? 'Take it easy — your feelings are valid. 💙' : 'Same mood — perfectly okay.'}
                    </p>
                  </motion.div>
                )}
                <div className="flex gap-3">
                  <button onClick={() => setShowAfterMood(false)} className="flex-1 py-2.5 text-white/50 text-sm rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                  <button onClick={() => { if (afterMood && lastCheckinId) { completeCheckin(lastCheckinId, afterMood); } setShowAfterMood(false); }} disabled={!afterMood} className="flex-1 py-2.5 text-sm rounded-full" style={{ background: 'rgba(155,191,169,0.15)', border: '1px solid rgba(155,191,169,0.2)', color: '#9BBFA9', opacity: afterMood ? 1 : 0.4 }}>Save</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brain Dump + Future Me row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BrainDumpSection />
          <FutureMeSection />
        </div>
      </div>
    </div>
  );
}

// ═══════════════ MINI EXPERIENCE ═══════════════════

const MINI_EXPERIENCES: Record<string, { title: string; steps: { emoji: string; text: string; time: string }[] }> = {
  very_bad: {
    title: 'A soft moment for you 💙',
    steps: [
      { emoji: '🌬️', text: 'Take three slow breaths. In through your nose, out through your mouth.', time: '1 min' },
      { emoji: '🎵', text: 'Put on something gentle. Let the music hold you.', time: '3 min' },
      { emoji: '📝', text: 'Write whatever comes to mind. No rules, no judgment.', time: '3 min' },
      { emoji: '🌿', text: 'Try this: touch something soft nearby. Feel its texture.', time: '1 min' },
      { emoji: '💙', text: 'You are not alone. This feeling will pass. You are enough.', time: '1 min' },
    ],
  },
  bad: {
    title: "Let's find a small light \u{1F324}\u{FE0F}",
    steps: [
      { emoji: '🌬️', text: 'Breathe in for 4 counts. Hold for 4. Out for 4.', time: '2 min' },
      { emoji: "\u{1F602}", text: "Here's something to smile about.", time: '1 min' },
      { emoji: '📝', text: 'What is one small thing that went okay today?', time: '2 min' },
      { emoji: '🎵', text: 'Listen to something that lifts you, even slightly.', time: '3 min' },
    ],
  },
  okay: {
    title: 'A gentle nudge forward ✨',
    steps: [
      { emoji: '🌬️', text: 'Take a moment. Feel your feet on the ground.', time: '1 min' },
      { emoji: '📝', text: 'What is one thing you are grateful for right now?', time: '2 min' },
      { emoji: '🎮', text: 'Play something fun. You deserve a break.', time: '3 min' },
      { emoji: '🎵', text: 'Listen to a song that matches your energy.', time: '3 min' },
    ],
  },
  good: {
    title: 'Ride this wave 🌊',
    steps: [
      { emoji: '📝', text: 'Capture this feeling. What made today good?', time: '2 min' },
      { emoji: '🎉', text: 'Share a smile with someone.', time: '1 min' },
      { emoji: '🎵', text: 'Play something upbeat to keep the momentum.', time: '3 min' },
      { emoji: '🎯', text: 'Set one intention for tomorrow while you feel this way.', time: '2 min' },
    ],
  },
  great: {
    title: 'You are glowing! 🌟',
    steps: [
      { emoji: '📝', text: 'Write down what made today amazing.', time: '2 min' },
      { emoji: '🎉', text: 'Do something fun to celebrate this feeling.', time: '5 min' },
      { emoji: '💪', text: 'Channel this energy into something you have been putting off.', time: '5 min' },
      { emoji: '🎵', text: 'Put on your favourite song and enjoy the moment.', time: '3 min' },
    ],
  },
};

function MiniExperience({ mood }: { mood: string }) {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const experience = MINI_EXPERIENCES[mood] || MINI_EXPERIENCES['okay'];

  if (!started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl p-4" style={{ background: 'rgba(155,145,201,0.08)', border: '1px solid rgba(155,145,201,0.15)' }}>
        <p className="text-white/70 text-sm font-medium mb-1">{experience.title}</p>
        <p className="text-white/40 text-xs mb-3">A {experience.steps.length * 2}-minute guided moment, just for you.</p>
        <button onClick={() => setStarted(true)} className="rounded-full px-5 py-2 text-xs" style={{ background: 'rgba(155,145,201,0.15)', border: '1px solid rgba(155,145,201,0.25)', color: '#B8B4D9' }}>
          Start Mini Experience ✨
        </button>
      </motion.div>
    );
  }

  const step = experience.steps[currentStep];
  const isDone = currentStep >= experience.steps.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl p-5" style={{ background: 'rgba(155,145,201,0.08)', border: '1px solid rgba(155,145,201,0.15)' }}>
      {!isDone ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/40 text-[10px]">Step {currentStep + 1} of {experience.steps.length}</span>
            <span className="text-white/30 text-[10px]">{step.time}</span>
          </div>
          <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            <span className="text-3xl block">{step.emoji}</span>
            <p className="text-white/80 text-sm leading-relaxed">{step.text}</p>
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {experience.steps.map((_, i) => (
                <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i <= currentStep ? 'bg-lavender' : 'bg-white/10'}`} />
              ))}
            </div>
          </motion.div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setCurrentStep(s => s + 1)} className="flex-1 py-2 text-xs rounded-full" style={{ background: 'rgba(155,145,201,0.15)', border: '1px solid rgba(155,145,201,0.25)', color: '#B8B4D9' }}>
              {currentStep < experience.steps.length - 1 ? 'Next step →' : 'Complete ✨'}
            </button>
            <button onClick={() => setStarted(false)} className="py-2 px-3 text-xs text-white/30 hover:text-white/50">Skip</button>
          </div>
        </>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
          <span className="text-3xl block mb-2">🌟</span>
          <p className="text-white/70 text-sm font-medium">Well done. You took a moment for yourself.</p>
          <p className="text-white/40 text-xs mt-1">That matters more than you think.</p>
          <button onClick={() => { setStarted(false); setCurrentStep(0); }} className="mt-3 text-lavender/70 text-xs hover:text-lavender">Try again</button>
        </motion.div>
      )}
    </motion.div>
  );
}

// ═══════════════ BRAIN DUMP ════════════════════════

function BrainDumpSection() {
  const [text, setText] = useState('');
  const [entries, setEntries] = useState(getBrainDumpEntries);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSave = () => {
    if (!text.trim()) return;
    const entry = saveBrainDumpEntry(text);
    setEntries([entry, ...entries]);
    setText('');
  };

  const handleDelete = (id: string) => {
    deleteBrainDumpEntry(id);
    setEntries(entries.filter(e => e.id !== id));
  };

  const expanded = entries.find(e => e.id === expandedId);

  return (
    <motion.div className="liquid-glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-4 h-4 text-lavender" />
        <h3 className="text-white/70 text-sm font-medium">Brain Dump</h3>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Pour your thoughts here. No judgement. No rules."
        className="w-full rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 resize-none focus:outline-none mb-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        rows={3} />
      <button onClick={handleSave} disabled={!text.trim()}
        className="rounded-full px-4 py-1.5 text-xs flex items-center gap-1.5 disabled:opacity-30"
        style={{ background: 'rgba(155,145,201,0.12)', border: '1px solid rgba(155,145,201,0.2)', color: '#B8B4D9' }}>
        <Save className="w-3 h-3" /> Save
      </button>
      {entries.length > 0 && (
        <div className="mt-3 space-y-1.5 max-h-32 overflow-y-auto">
          {entries.slice(0, 3).map(entry => (
            <div key={entry.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/5 cursor-pointer" onClick={() => setExpandedId(entry.id)}>
              <span className="text-white/20 text-[10px]">{new Date(entry.createdAt).toLocaleDateString()}</span>
              <span className="text-white/50 text-xs flex-1 truncate">{entry.rawText}</span>
            </div>
          ))}
        </div>
      )}
      {/* Expanded view */}
      <AnimatePresence>
        {expanded && expanded.organized && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setExpandedId(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="liquid-glass rounded-3xl p-5 max-w-md w-full max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-white font-medium mb-3">Your thoughts, organized 🧠</h3>
              <div className="space-y-3">
                <div><p className="text-lavender/60 text-[10px] uppercase mb-1">💭 What you're feeling</p>
                  {expanded.organized.feelings.map((f, i) => <p key={i} className="text-white/60 text-xs">{f}</p>)}</div>
                <div><p className="text-sage/60 text-[10px] uppercase mb-1">🎯 What you can control</p>
                  {expanded.organized.controllable.map((c, i) => <p key={i} className="text-white/60 text-xs">{c}</p>)}</div>
                <div><p className="text-sky-300/60 text-[10px] uppercase mb-1">📝 Possible next steps</p>
                  {expanded.organized.nextSteps.map((n, i) => <p key={i} className="text-white/60 text-xs">{n}</p>)}</div>
                <div><p className="text-amber-300/60 text-[10px] uppercase mb-1">🌿 Something right now</p>
                  {expanded.organized.rightNow.map((r, i) => <p key={i} className="text-white/60 text-xs">{r}</p>)}</div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => { handleDelete(expanded.id); setExpandedId(null); }} className="text-red-400/50 text-xs hover:text-red-400/80">Delete</button>
                <button onClick={() => setExpandedId(null)} className="ml-auto text-white/30 text-xs hover:text-white/50">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════ FUTURE ME ═════════════════════════

function FutureMeSection() {
  const [text, setText] = useState('');
  const [days, setDays] = useState(30);
  const [messages, setMessages] = useState(getFutureMessages);
  const dueMessages = getDueMessages();

  const handleSave = () => {
    if (!text.trim()) return;
    const msg = saveFutureMessage(text, days);
    setMessages([msg, ...messages]);
    setText('');
  };

  const handleDelete = (id: string) => {
    deleteFutureMessage(id);
    setMessages(messages.filter(m => m.id !== id));
  };

  return (
    <motion.div className="liquid-glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <div className="flex items-center gap-2 mb-3">
        <Send className="w-4 h-4 text-peach" />
        <h3 className="text-white/70 text-sm font-medium">Message to Future Me 💌</h3>
      </div>
      {dueMessages.length > 0 && (
        <div className="mb-3 space-y-2">
          {dueMessages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-3" style={{ background: 'rgba(232,130,180,0.08)', border: '1px solid rgba(232,130,180,0.15)' }}>
              <p className="text-white/30 text-[10px] mb-1">A message from {new Date(msg.createdAt).toLocaleDateString()} 💌</p>
              <p className="text-white/70 text-sm">{msg.message}</p>
              <button onClick={() => markDelivered(msg.id)} className="mt-2 text-peach/60 text-[10px] hover:text-peach">Dismiss</button>
            </motion.div>
          ))}
        </div>
      )}
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="What would you tell your future self?"
        className="w-full rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 resize-none focus:outline-none mb-2"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        rows={2} />
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-3 h-3 text-white/30" />
        <select value={days} onChange={e => setDays(Number(e.target.value))}
          className="bg-transparent text-white/50 text-xs focus:outline-none">
          <option value={7} className="bg-[#0B1220]">7 days</option>
          <option value={30} className="bg-[#0B1220]">30 days</option>
          <option value={90} className="bg-[#0B1220]">90 days</option>
        </select>
      </div>
      <button onClick={handleSave} disabled={!text.trim()}
        className="rounded-full px-4 py-1.5 text-xs flex items-center gap-1.5 disabled:opacity-30"
        style={{ background: 'rgba(232,130,180,0.12)', border: '1px solid rgba(232,130,180,0.2)', color: '#E882B4' }}>
        <Send className="w-3 h-3" /> Send to Future Me
      </button>
      {messages.filter(m => m.delivered).length > 0 && (
        <p className="text-white/20 text-[10px] mt-2">{messages.filter(m => m.delivered).length} message{messages.filter(m => m.delivered).length !== 1 ? 's' : ''} delivered</p>
      )}
    </motion.div>
  );
}