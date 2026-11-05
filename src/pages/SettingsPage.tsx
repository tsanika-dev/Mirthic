import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Moon, Sun, Monitor, Trash2, Download, Shield, Palette, User, Key, ChevronRight, ArrowLeft, Music, Globe, Eraser } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SETTINGS_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4';

export default function SettingsPage() {
  const { theme, setTheme } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    dailyMood: true,
    exercise: true,
    journal: true,
    weeklySummary: true,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [clearHistoryConfirm, setClearHistoryConfirm] = useState<string | null>(null);
  const [musicPrefs, setMusicPrefs] = useState({
    language: localStorage.getItem('mc_music_language') || 'english',
    region: localStorage.getItem('mc_preferred_region') || 'Other',
  });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('mc_notifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    v.addEventListener('canplay', tryPlay, { once: true });
    if (v.readyState >= 3) tryPlay();
    return () => { v.pause(); };
  }, []);

  const toggleNotification = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('mc_notifications', JSON.stringify(updated));
  };

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const handleExport = () => {
    const data = {
      moods: JSON.parse(localStorage.getItem('mc_moods') || '[]'),
      journals: JSON.parse(localStorage.getItem('mc_journals') || '[]'),
      settings: { theme, notifications },
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindcare-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    localStorage.removeItem('mc_moods');
    localStorage.removeItem('mc_journals');
    localStorage.removeItem('mc_settings');
    localStorage.removeItem('mc_notifications');
    localStorage.removeItem('mc_community');
    setDeleteConfirm(false);
    window.location.reload();
  };

  const clearHistory = (type: string) => {
    if (type === 'jokes') localStorage.removeItem('mc_joke_history');
    if (type === 'games') localStorage.removeItem('mc_game_history');
    if (type === 'music') localStorage.removeItem('mc_music_history');
    setClearHistoryConfirm(null);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <source src={SETTINGS_VIDEO} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'rgba(3,7,15,0.30)', zIndex: 1 }} />

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-24">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-4 pt-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight">Settings</h1>
            <p className="text-white/40 text-sm">Customize your Mirthic experience</p>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.045)',
            backdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.22)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(155,191,169,0.08)' }}>
              <Palette className="w-4 h-4 text-sage" />
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">Appearance</h2>
              <p className="text-white/30 text-xs">Choose how Mirthic looks</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(t => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value as any)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${theme === t.value ? 'border text-white' : 'text-white/40 hover:text-white/60'}`}
                style={{
                  background: theme === t.value ? 'rgba(155,191,169,0.10)' : 'rgba(255,255,255,0.03)',
                  borderColor: theme === t.value ? 'rgba(155,191,169,0.25)' : 'rgba(255,255,255,0.06)',
                }}
              >
                <t.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          className="rounded-2xl p-6 space-y-1"
          style={{
            background: 'rgba(255,255,255,0.045)',
            backdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.22)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(184,180,217,0.08)' }}>
              <Bell className="w-4 h-4 text-lavender" />
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">Notifications</h2>
              <p className="text-white/30 text-xs">Stay mindful with gentle reminders</p>
            </div>
          </div>
          {[
            { key: 'dailyMood' as const, label: 'Daily Mood Reminder', desc: 'Gentle reminder to check in with yourself' },
            { key: 'exercise' as const, label: 'Exercise Reminders', desc: 'Stay active with exercise suggestions' },
            { key: 'journal' as const, label: 'Journal Reminders', desc: 'Prompt to write in your journal' },
            { key: 'weeklySummary' as const, label: 'Weekly Wellness Summary', desc: 'Get your mood insights each week' },
          ].map((item, i) => (
            <div key={item.key} className="flex items-center justify-between py-3" style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div className="pr-4">
                <p className="text-white text-sm">{item.label}</p>
                <p className="text-white/30 text-xs mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className="w-12 h-6 rounded-full transition-colors relative flex-shrink-0"
                style={{
                  background: notifications[item.key] ? 'rgba(155,191,169,0.4)' : 'rgba(255,255,255,0.08)',
                }}
                role="switch"
                aria-checked={notifications[item.key]}
                aria-label={item.label}
              >
                <motion.div
                  className="absolute top-1 w-4 h-4 rounded-full bg-white"
                  animate={{ left: notifications[item.key] ? 26 : 4 }}
                  transition={{ duration: 0.2 }}
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>
          ))}
        </motion.div>

        {/* Account */}
        <motion.div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.045)',
            backdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.22)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(155,191,169,0.08)' }}>
              <User className="w-4 h-4 text-sage" />
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">Account</h2>
              <p className="text-white/30 text-xs">{user?.displayName || user?.email}</p>
            </div>
          </div>
          {[
            { icon: User, label: 'Edit Profile', action: () => navigate('/profile'), color: 'text-sage' },
            { icon: Key, label: 'Change Password', action: () => {}, color: 'text-lavender', disabled: true },
            { icon: Trash2, label: 'Log Out', action: () => navigate('/profile'), color: 'text-red-400/60' },
          ].map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              disabled={item.disabled}
              className="w-full rounded-xl p-3.5 flex items-center gap-3 transition-all text-left disabled:opacity-30"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-white text-sm flex-1">{item.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-white/15" />
            </button>
          ))}
        </motion.div>

        {/* Privacy & Data */}
        <motion.div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.045)',
            backdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.22)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(184,180,217,0.08)' }}>
              <Shield className="w-4 h-4 text-lavender" />
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">Privacy & Data</h2>
              <p className="text-white/30 text-xs">Your data stays on your device</p>
            </div>
          </div>
          <p className="text-white/25 text-xs leading-relaxed">Your data is stored locally until Firebase is connected. Export anytime.</p>
          <button
            onClick={handleExport}
            className="w-full rounded-xl p-3.5 flex items-center gap-3 transition-all text-left"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
          >
            <Download className="w-4 h-4 text-sage" />
            <span className="text-white text-sm flex-1">Export My Data</span>
            <ChevronRight className="w-3.5 h-3.5 text-white/15" />
          </button>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="w-full rounded-xl p-3.5 flex items-center gap-3 transition-all text-left"
            style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.08)' }}
          >
            <Trash2 className="w-4 h-4 text-red-400/60" />
            <span className="text-red-400/80 text-sm flex-1">Delete All Data</span>
            <ChevronRight className="w-3.5 h-3.5 text-red-400/20" />
          </button>
        </motion.div>

        {/* Music Preferences */}
        <motion.div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.045)',
            backdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.22)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(198,120,221,0.08)' }}>
              <Music className="w-4 h-4 text-lavender" />
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">Music Preferences</h2>
              <p className="text-white/30 text-xs">Choose your preferred music language</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Language</label>
              <select value={musicPrefs.language} onChange={e => {
                const lang = e.target.value;
                setMusicPrefs(p => ({ ...p, language: lang }));
                localStorage.setItem('mc_music_language', lang);
              }} className="w-full rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
                {['telugu', 'hindi', 'tamil', 'kannada', 'malayalam', 'english', 'instrumental'].map(l => (
                  <option key={l} value={l} className="bg-[#0B1220]">{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-white/40 text-xs mb-1.5 block">Region</label>
              <select value={musicPrefs.region} onChange={e => {
                const r = e.target.value;
                setMusicPrefs(p => ({ ...p, region: r }));
                localStorage.setItem('mc_preferred_region', r);
              }} className="w-full rounded-xl px-4 py-2.5 text-sm text-white appearance-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
                {['Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Karnataka', 'Kerala', 'Other'].map(r => (
                  <option key={r} value={r} className="bg-[#0B1220]">{r}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Activity History */}
        <motion.div
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.045)',
            backdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.10), 0 20px 60px rgba(0,0,0,0.22)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,130,180,0.08)' }}>
              <Eraser className="w-4 h-4 text-pink-300" />
            </div>
            <div>
              <h2 className="text-white font-medium text-sm">Activity History</h2>
              <p className="text-white/30 text-xs">Clear recommendation history</p>
            </div>
          </div>
          {[
            { key: 'jokes', label: 'Joke History', desc: 'Clear viewed jokes so they can reappear' },
            { key: 'games', label: 'Game History', desc: 'Clear played games to refresh recommendations' },
            { key: 'music', label: 'Music History', desc: 'Clear opened playlist history' },
          ].map((item, i) => (
            <div key={item.key} className="flex items-center justify-between py-3" style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div className="pr-4">
                <p className="text-white text-sm">{item.label}</p>
                <p className="text-white/30 text-xs mt-0.5">{item.desc}</p>
              </div>
              <button onClick={() => setClearHistoryConfirm(item.key)} className="px-3 py-1.5 rounded-full text-xs text-white/50 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Clear
              </button>
            </div>
          ))}
        </motion.div>

        {/* About */}
        <motion.div
          className="text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p style={{ fontFamily: "'Dancing Script', cursive" }} className="text-white/20 text-lg mb-1">Mirthic</p>
          <p className="text-white/10 text-xs">Your mental well-being matters</p>
        </motion.div>
      </div>

      {/* History Clear Confirmation */}
      <AnimatePresence>
        {clearHistoryConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setClearHistoryConfirm(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="rounded-2xl p-6 max-w-sm w-full" style={{ background: 'rgba(10,14,24,0.9)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)' }} onClick={e => e.stopPropagation()}>
              <h3 className="text-white text-lg font-medium mb-2">Clear {clearHistoryConfirm} history?</h3>
              <p className="text-white/40 text-sm mb-6">This will reset your {clearHistoryConfirm} recommendations so you may see some previously viewed items again.</p>
              <div className="flex gap-3">
                <button onClick={() => setClearHistoryConfirm(null)} className="flex-1 py-2.5 text-white/60 text-sm rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                <button onClick={() => clearHistory(clearHistoryConfirm)} className="flex-1 py-2.5 text-sm rounded-full" style={{ background: 'rgba(232,130,180,0.15)', border: '1px solid rgba(232,130,180,0.2)', color: '#E882B4' }}>Clear</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setDeleteConfirm(false)}>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-2xl p-6 max-w-sm w-full"
              style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-white text-lg font-medium mb-2">Delete all data?</h3>
              <p className="text-white/40 text-sm mb-6">This will permanently remove all your mood entries, journal entries, and settings. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-2.5 text-white/60 text-sm rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                <button onClick={handleDeleteAll} className="flex-1 bg-red-500/20 text-red-400 rounded-full py-2.5 text-sm hover:bg-red-500/30 transition-colors border border-red-500/20">Delete Everything</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
