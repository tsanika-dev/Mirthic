import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Edit3, LogOut, BookOpen, TrendingUp, Activity, Settings, Info, Camera, X, Save, ChevronRight, Heart, Shield, User, Star, Trophy } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMood } from '../hooks/useMood';
import { useJournal } from '../hooks/useJournal';
import { useSaved } from '../hooks/useSaved';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const PROFILE_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { entries: moodEntries } = useMood();
  const { entries: journalEntries } = useJournal();
  const { savedArticles } = useSaved();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 800], [0, -120]);
  const quoteOpacity = useTransform(scrollY, [300, 500], [0, 1]);
  const quoteY = useTransform(scrollY, [300, 600], [60, 0]);

  const stats = useMemo(() => ({
    moods: moodEntries.length,
    journals: journalEntries.length,
    avgMood: moodEntries.length > 0
      ? (moodEntries.reduce((sum, e) => sum + e.moodScore, 0) / moodEntries.length).toFixed(1)
      : '-',
    saved: savedArticles.length,
  }), [moodEntries, journalEntries, savedArticles]);

  // Tiny wins and capsules
  const [tinyWins, setTinyWins] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mc_tiny_wins') || '[]'); } catch { return []; }
  });
  const [capsules, setCapsules] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mc_mood_capsules') || '[]'); } catch { return []; }
  });
  const [newWin, setNewWin] = useState('');
  const [showWinInput, setShowWinInput] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    v.addEventListener('canplay', tryPlay, { once: true });
    if (v.readyState >= 3) tryPlay();
    return () => { v.pause(); };
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setShowEdit(false);
    setSaving(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const links = [
    { icon: TrendingUp, label: 'Mood History', path: '/mood', desc: 'Track your emotional journey' },
    { icon: BookOpen, label: 'My Journal', path: '/journal', desc: 'Your private thoughts' },
    { icon: Activity, label: 'Exercise Sessions', path: '/exercises', desc: 'Breathe, meditate, relax' },
    { icon: Heart, label: 'Self Care', path: '/self-care', desc: 'Nurture your wellbeing' },
    { icon: Settings, label: 'Settings', path: '/settings', desc: 'Customize your space' },
  ];

  return (
    <div className="relative">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <div ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src={PROFILE_VIDEO} type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(3,7,15,0.20)', zIndex: 1 }} />

        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 50% 45%, rgba(155,191,169,0.08) 0%, transparent 55%)',
          zIndex: 1,
        }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center px-6 py-12 max-w-2xl mx-auto text-center">
          {/* Profile avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative mb-8"
          >
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center text-4xl md:text-5xl font-serif"
              style={{
                background: 'linear-gradient(135deg, rgba(155,191,169,0.15), rgba(184,180,217,0.15))',
                border: '2px solid rgba(255,255,255,0.15)',
                boxShadow: '0 0 60px rgba(155,191,169,0.15), inset 0 1px 1px rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
            <button className="absolute bottom-1 right-1 p-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <Camera className="w-4 h-4 text-white/60" />
            </button>
          </motion.div>

          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1
              className="text-3xl md:text-5xl text-white tracking-tight mb-3"
              style={{ fontFamily: "'Instrument Serif', serif", textShadow: '0 2px 30px rgba(0,0,0,0.3)' }}
            >
              Welcome back, {user?.displayName || 'Friend'}
            </h1>
            <p className="text-white/50 text-sm md:text-base" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.3)' }}>
              Take care of yourself, one moment at a time.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-3 md:gap-4 mt-10 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {[
              { label: 'Check-ins', value: stats.moods, color: 'rgba(155,191,169,0.12)' },
              { label: 'Journal', value: stats.journals, color: 'rgba(184,180,217,0.12)' },
              { label: 'Avg Mood', value: stats.avgMood, color: 'rgba(198,230,211,0.12)' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl p-4 md:p-5 text-center"
                style={{
                  background: stat.color,
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.10)',
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-2xl md:text-3xl font-light text-white">{stat.value}</p>
                <p className="text-white/40 text-[10px] md:text-xs mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Action buttons */}
          <motion.div
            className="flex gap-3 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <motion.button
              onClick={() => setShowEdit(true)}
              className="px-8 py-3 rounded-full text-sm font-medium transition-all"
              style={{ background: 'white', color: '#07090D' }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Edit Profile
            </motion.button>
            <motion.button
              onClick={() => navigate('/mood')}
              className="px-8 py-3 rounded-full text-sm font-medium transition-all"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,0.10)',
                color: 'white',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              My Wellness Journey
            </motion.button>
          </motion.div>
        </div>

        {/* Subtle scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </div>
        </motion.div>
      </div>

      {/* ═══════════════ WELLNESS QUOTE SECTION ═══════════════ */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
        background: 'linear-gradient(180deg, #06101C 0%, #0B3048 35%, #245F78 65%, #6FA8B7 100%)',
      }}>
        {/* Floating orb */}
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: parallaxY }}
        >
          <div className="w-64 h-64 md:w-96 md:h-96 rounded-full" style={{
            background: 'radial-gradient(circle, rgba(155,191,169,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
        </motion.div>

        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              background: i % 3 === 0 ? 'rgba(155,191,169,0.3)' : 'rgba(255,255,255,0.15)',
            }}
            animate={{
              y: [0, -20 - Math.random() * 30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Quote content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          style={{ opacity: quoteOpacity, y: quoteY }}
        >
          <motion.blockquote
            className="text-2xl md:text-4xl lg:text-5xl leading-snug md:leading-tight mb-8"
            style={{
              fontFamily: "'Instrument Serif', serif",
              color: 'rgba(255,255,255,0.9)',
              textShadow: '0 2px 30px rgba(0,0,0,0.2)',
            }}
          >
            "Taking care of yourself is not an escape from life. It is how you return to it with greater clarity."
          </motion.blockquote>

          <motion.p
            className="text-white/30 text-xs md:text-sm uppercase tracking-[0.25em]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Mirthic — Your wellness space
          </motion.p>
        </motion.div>
      </div>

      {/* ═══════════════ TINY WINS ═══════════════ */}
      <div className="relative py-20 px-6" style={{ background: '#07090D' }}>
        <div className="max-w-2xl mx-auto">
          <motion.h2 className="text-2xl md:text-3xl text-white mb-2" style={{ fontFamily: "'Instrument Serif', serif" }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Today's Tiny Wins
          </motion.h2>
          <motion.p className="text-white/40 text-sm mb-6" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Celebrate the small moments.
          </motion.p>

          {/* Add win input */}
          <motion.div className="mb-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {!showWinInput ? (
              <button onClick={() => setShowWinInput(true)} className="flex items-center gap-2 text-white/40 hover:text-white/60 text-sm transition-colors" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.12)', padding: '10px 16px', borderRadius: '12px', width: '100%' }}>
                <Star className="w-4 h-4" /> Add a tiny win
              </button>
            ) : (
              <div className="flex gap-2">
                <input type="text" value={newWin} onChange={e => setNewWin(e.target.value)} placeholder="What made you smile today?" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-sage/40" onKeyDown={e => { if (e.key === 'Enter' && newWin.trim()) { const win = { id: `win-${Date.now()}`, text: newWin.trim(), date: new Date().toISOString().split('T')[0], createdAt: Date.now() }; const updated = [win, ...tinyWins]; setTinyWins(updated); localStorage.setItem('mc_tiny_wins', JSON.stringify(updated)); setNewWin(''); setShowWinInput(false); } }} autoFocus />
                <button onClick={() => { if (newWin.trim()) { const win = { id: `win-${Date.now()}`, text: newWin.trim(), date: new Date().toISOString().split('T')[0], createdAt: Date.now() }; const updated = [win, ...tinyWins]; setTinyWins(updated); localStorage.setItem('mc_tiny_wins', JSON.stringify(updated)); setNewWin(''); setShowWinInput(false); } }} className="px-4 py-2 rounded-xl text-sm" style={{ background: 'rgba(155,191,169,0.15)', border: '1px solid rgba(155,191,169,0.2)', color: '#9BBFA9' }}>Add</button>
                <button onClick={() => { setShowWinInput(false); setNewWin(''); }} className="px-3 py-2 text-white/30 hover:text-white/50">✕</button>
              </div>
            )}
          </motion.div>

          {/* Win list */}
          {tinyWins.length > 0 ? (
            <div className="space-y-2">
              {tinyWins.slice(0, 7).map((win: any, i: number) => (
                <motion.div key={win.id} className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                  <Trophy className="w-4 h-4 flex-shrink-0" style={{ color: '#C6E6D3' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">{win.text}</p>
                    <p className="text-white/25 text-[10px]">{win.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-white/20 text-sm text-center py-4">No tiny wins yet. Start celebrating the small moments!</p>
          )}
        </div>
      </div>

      {/* ═══════════════ QUICK LINKS ═══════════════ */}
      <div className="relative py-20 px-6" style={{ background: '#07090D' }}>
        <div className="max-w-2xl mx-auto space-y-4">
          <motion.h2
            className="text-2xl md:text-3xl text-white mb-8"
            style={{ fontFamily: "'Instrument Serif', serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Your space
          </motion.h2>

          {links.map((link, i) => (
            <motion.button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="w-full rounded-2xl p-5 flex items-center justify-between text-left transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(18px) saturate(140%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ x: 6, background: 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(155,191,169,0.08)' }}>
                  <link.icon className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <span className="text-white text-sm font-medium block">{link.label}</span>
                  <span className="text-white/30 text-xs">{link.desc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20" />
            </motion.button>
          ))}

          {/* Logout */}
          <motion.button
            onClick={() => setShowLogout(true)}
            className="w-full rounded-2xl p-5 flex items-center gap-4 text-left mt-4 transition-all"
            style={{
              background: 'rgba(220,38,38,0.04)',
              border: '1px solid rgba(220,38,38,0.08)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ background: 'rgba(220,38,38,0.08)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.08)' }}>
              <LogOut className="w-5 h-5 text-red-400/60" />
            </div>
            <div>
              <span className="text-red-400/80 text-sm font-medium block">Log Out</span>
              <span className="text-red-400/30 text-xs">Your data is saved securely</span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <div className="py-12 text-center" style={{ background: '#07090D', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ fontFamily: "'Dancing Script', cursive" }} className="text-white/30 text-lg">Mirthic</p>
        <p className="text-white/15 text-xs mt-2">Your mental well-being matters</p>
      </div>

      {/* ═══════════════ MODALS ═══════════════ */}
      <AnimatePresence>
        {showEdit && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setShowEdit(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl p-6 max-w-sm w-full"
              style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(24px) saturate(140%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white text-lg font-medium">Edit Profile</h3>
                <button onClick={() => setShowEdit(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sage/30" />
                </div>
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sage/30" disabled />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowEdit(false)} className="flex-1 py-2.5 text-white/60 text-sm rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                <button onClick={handleSaveProfile} disabled={saving} className="flex-1 rounded-full py-2.5 text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50" style={{ background: 'white', color: '#07090D' }}>
                  {saving ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={() => setShowLogout(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl p-6 max-w-sm w-full"
              style={{
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-white text-lg font-medium mb-2">Log out?</h3>
              <p className="text-white/40 text-sm mb-6">Are you sure you want to log out? Your data is saved securely.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogout(false)} className="flex-1 py-2.5 text-white/60 text-sm rounded-full" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
                <button onClick={handleLogout} className="flex-1 bg-red-500/20 text-red-400 rounded-full py-2.5 text-sm hover:bg-red-500/30 transition-colors border border-red-500/20">Log Out</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
