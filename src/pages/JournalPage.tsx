import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, Tag, X, Save, SortAsc, SortDesc } from 'lucide-react';
import { useJournal } from '../hooks/useJournal';
import { JournalVisualBackground } from '../components/ui/JournalVisualBackground';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import type { MoodLevel } from '../types';

const MOODS = [
  { score: 1, mood: 'very_bad' as MoodLevel, label: 'Very Bad', emoji: '😞' },
  { score: 2, mood: 'bad' as MoodLevel, label: 'Bad', emoji: '😕' },
  { score: 3, mood: 'okay' as MoodLevel, label: 'Okay', emoji: '😐' },
  { score: 4, mood: 'good' as MoodLevel, label: 'Good', emoji: '🙂' },
  { score: 5, mood: 'great' as MoodLevel, label: 'Great', emoji: '😄' },
];

const TAGS = ['Stress', 'Study', 'Sleep', 'Family', 'Friends', 'Work', 'Health', 'Other'];

export default function JournalPage() {
  const { entries, loading, addEntry, updateEntry, deleteEntry } = useJournal();
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formMood, setFormMood] = useState<MoodLevel>('okay');
  const [formTags, setFormTags] = useState<string[]>([]);

  const filteredEntries = useMemo(() => {
    return entries
      .filter(e => {
        const matchesSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.content.toLowerCase().includes(searchQuery.toLowerCase()) || e.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesMood = moodFilter === null || MOODS.find(m => m.score === moodFilter)?.mood === e.mood;
        return matchesSearch && matchesMood;
      })
      .sort((a, b) => {
        const da = a.createdAt?.toDate?.() || new Date(0);
        const db = b.createdAt?.toDate?.() || new Date(0);
        return sortOrder === 'desc' ? db.getTime() - da.getTime() : da.getTime() - db.getTime();
      });
  }, [entries, searchQuery, moodFilter, sortOrder]);

  const resetForm = () => { setFormTitle(''); setFormContent(''); setFormMood('okay'); setFormTags([]); setEditingEntry(null); };

  const openNewEntry = useCallback(() => { resetForm(); setShowForm(true); }, []);

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim() || saving) return;
    setSaving(true);
    try {
      if (editingEntry) {
        await updateEntry(editingEntry.id, formTitle, formContent, formMood, formTags);
      } else {
        await addEntry(formTitle, formContent, formMood, formTags);
      }
      resetForm(); setShowForm(false);
    } catch (err) { console.error('Error saving entry:', err); } finally { setSaving(false); }
  };

  const handleEdit = (entry: any) => {
    setEditingEntry(entry); setFormTitle(entry.title); setFormContent(entry.content);
    setFormMood(entry.mood || 'okay'); setFormTags(entry.tags || []); setShowForm(true);
  };

  const handleDelete = async (id: string) => { await deleteEntry(id); setDeleteConfirm(null); };
  const toggleTag = (tag: string) => { setFormTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]); };
  const getMoodEmoji = (mood: MoodLevel | null) => MOODS.find(m => m.mood === mood)?.emoji || '😐';

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cinematic carousel background */}
      <JournalVisualBackground onWriteClick={openNewEntry} />

      {/* Journal content overlay */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center justify-between pt-16 sm:pt-0">
          <div>
            <h1 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-2" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>Your private space</h1>
            <p className="text-white/60 text-base" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>{entries.length === 0 ? 'Start writing to capture your thoughts.' : `${entries.length} ${entries.length === 1 ? 'entry' : 'entries'} in your journal`}</p>
          </div>
          <motion.button onClick={openNewEntry} className="liquid-glass-pill px-5 py-2.5 text-white/80 hover:text-white flex items-center gap-2 text-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <Plus className="w-4 h-4" /> New Entry
          </motion.button>
        </motion.div>

        {/* Search & filters */}
        <motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search journal..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-full pl-11 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={moodFilter || ''} onChange={(e) => setMoodFilter(e.target.value ? Number(e.target.value) : null)} className="rounded-full px-4 py-3 text-white/60 text-sm bg-transparent focus:outline-none appearance-none cursor-pointer" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <option value="" className="bg-[#0B1220]">All moods</option>
              {MOODS.map(m => <option key={m.score} value={m.score} className="bg-[#0B1220]">{m.emoji} {m.label}</option>)}
            </select>
            <button onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')} className="rounded-full px-4 py-3 text-white/40 hover:text-white flex items-center gap-1 text-sm" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)' }}>
              {sortOrder === 'desc' ? <SortDesc className="w-3.5 h-3.5" /> : <SortAsc className="w-3.5 h-3.5" />}{sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>
        </motion.div>

        {/* New Entry Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: 20, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -20, height: 0 }} className="rounded-3xl p-6 md:p-8 space-y-5" style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(24px) saturate(140%)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-white text-lg font-medium">{editingEntry ? 'Edit entry' : 'What is on your mind today?'}</h2>
                <button onClick={() => { setShowForm(false); resetForm(); }} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <input type="text" placeholder="Title" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/30 text-lg focus:outline-none focus:border-white/25" />
              <div>
                <p className="text-white/40 text-sm mb-2">How are you feeling?</p>
                <div className="flex gap-3">
                  {MOODS.map(mood => (
                    <button key={mood.score} onClick={() => setFormMood(mood.mood)} className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${formMood === mood.mood ? 'bg-white/12 border border-white/20' : 'hover:bg-white/5 border border-transparent'}`}>
                      <span className="text-xl">{mood.emoji}</span><span className="text-[10px] text-white/40">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <textarea placeholder="Write your thoughts..." value={formContent} onChange={(e) => setFormContent(e.target.value)} className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-white/25 min-h-[200px]" rows={8} />
              <div>
                <p className="text-white/40 text-sm mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)} className={`px-3 py-1.5 rounded-full text-xs transition-all ${formTags.includes(tag) ? 'bg-white/15 text-white border border-white/25' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'}`}>{tag}</button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <motion.button onClick={handleSave} disabled={!formTitle.trim() || !formContent.trim() || saving} className="liquid-glass-pill px-8 py-3 text-white font-medium flex items-center gap-2 disabled:opacity-40" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}{editingEntry ? 'Update Entry' : 'Save Entry'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Journal entries */}
        <motion.div className="space-y-4 pb-24" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {filteredEntries.length === 0 ? (
            <div className="rounded-3xl p-12 text-center" style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
              <div className="text-5xl mb-4">🌱</div>
              <p className="text-white/60 text-lg mb-2">No journal entries yet</p>
              <p className="text-white/30 text-sm mb-6">Start writing to capture your thoughts and feelings.</p>
              <motion.button onClick={openNewEntry} className="px-6 py-2.5 text-white/70 text-sm hover:text-white rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Plus className="w-4 h-4 inline mr-2" />Write Your First Entry
              </motion.button>
            </div>
          ) : filteredEntries.map((entry, i) => {
            const entryDate = entry.createdAt?.toDate?.() || new Date();
            return (
              <motion.div key={entry.id} className="rounded-2xl overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }} style={{ background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(18px) saturate(140%)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 50px rgba(0,0,0,0.18)' }}>
                <div className="p-5 md:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      <div>
                        <Link to={`/journal/${entry.id}`} className="text-white font-medium hover:text-white/80 transition-colors">{entry.title}</Link>
                        <p className="text-white/30 text-xs mt-0.5">{format(entryDate, 'MMM d, yyyy • h:mm a')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleEdit(entry)} className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/8"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm(entry.id)} className="p-2 text-white/30 hover:text-red-300 transition-colors rounded-lg hover:bg-white/8"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-white/50 text-sm line-clamp-3 mb-3">{entry.content}</p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">{entry.tags.map(tag => <span key={tag} className="px-2 py-0.5 rounded-full bg-white/8 text-white/35 text-xs flex items-center gap-1"><Tag className="w-2.5 h-2.5" />{tag}</span>)}</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Delete confirmation modal */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="rounded-2xl p-6 max-w-sm w-full" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.15)' }} onClick={e => e.stopPropagation()}>
                <h3 className="text-white text-lg font-medium mb-2">Delete this entry?</h3>
                <p className="text-white/40 text-sm mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 text-white/60 text-sm hover:text-white rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500/20 text-red-300 rounded-full py-2.5 text-sm hover:bg-red-500/30 transition-colors border border-red-500/20">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
