import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, BookOpen, Dumbbell, Heart, TrendingUp, Clock, ArrowRight, Sparkles, Zap, X } from 'lucide-react';
import { getNeedResponse } from '../services/smileHubService';
import { getDailySurpriseId, markDailySurpriseShown } from '../services/antiRepetitionService';
import { getFreshJoke } from '../services/smileHubService';
import { useMood } from '../hooks/useMood';
import { useJournal } from '../hooks/useJournal';
import { useAuth } from '../context/AuthContext';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { mockArticles } from '../data/mockData';

const HOME_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4';

const MOODS = [
  { score: 1, mood: 'very_bad' as const, label: 'Very Bad', emoji: '😞', color: '#6B7280' },
  { score: 2, mood: 'bad' as const, label: 'Bad', emoji: '😕', color: '#94A3B8' },
  { score: 3, mood: 'okay' as const, label: 'Okay', emoji: '😐', color: '#CBD5E1' },
  { score: 4, mood: 'good' as const, label: 'Good', emoji: '🙂', color: '#9BBFA9' },
  { score: 5, mood: 'great' as const, label: 'Great', emoji: '😄', color: '#C6E6D3' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="liquid-glass rounded-xl px-3 py-2 border border-white/10">
        <p className="text-white/60 text-[10px]">{label}</p>
        <p className="text-white text-sm font-medium">{payload[0].value}/5</p>
      </div>
    );
  }
  return null;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { entries: moodEntries } = useMood();
  const { entries: journalEntries } = useJournal();
  const navigate = useNavigate();

  const todayMood = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return moodEntries.find(e => e.date === today);
  }, [moodEntries]);

  const moodInfo = todayMood ? MOODS.find(m => m.score === todayMood.moodScore) : null;

  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const dayMoods = moodEntries.filter(e => new Date(e.date).getDay() === (i + 1) % 7);
      const avg = dayMoods.length > 0 ? dayMoods.reduce((sum, e) => sum + e.moodScore, 0) / dayMoods.length : 0;
      return { name: day, mood: Number(avg.toFixed(1)) };
    });
  }, [moodEntries]);

  const stats = useMemo(() => {
    if (moodEntries.length === 0) return { avg: 0, entries: 0 };
    const scores = moodEntries.map(e => e.moodScore);
    return { avg: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1), entries: moodEntries.length };
  }, [moodEntries]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const recommendations = useMemo(() => {
    if (!todayMood) return null;
    const score = todayMood.moodScore;
    if (score <= 2) return { text: 'Consider a breathing exercise or reaching out to someone you trust.', action: '/exercises', label: 'Try an exercise' };
    if (score === 3) return { text: 'A short mindfulness session might help you feel more centered.', action: '/exercises', label: 'Mindfulness' };
    if (score === 4) return { text: 'Great mood! Consider journaling about what went well today.', action: '/journal', label: 'Write in journal' };
    return { text: 'Wonderful! Share some positivity with the community.', action: '/community', label: 'Visit community' };
  }, [todayMood]);

  return (
    <div className="relative min-h-screen">
      {/* Cinematic video background */}
      <PageVideoBackground videoUrl={HOME_VIDEO} overlay={0.25} />

      {/* Subtle teal/sage atmosphere over the video */}
      <div className="fixed inset-0 pointer-events-none" style={{
        zIndex: 1,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(15,60,80,0.08) 0%, transparent 60%)',
      }} />

      {/* Page content */}
      <div className="relative" style={{ zIndex: 10 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
          {/* Hero with mood-responsive orb */}
          <motion.div className="relative text-center py-8 md:py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="relative mx-auto w-40 h-40 mb-8">
              <motion.div
                className="absolute -inset-4 rounded-full"
                style={{
                  background: moodInfo
                    ? `radial-gradient(circle, ${moodInfo.color}12 0%, transparent 70%)`
                    : 'radial-gradient(circle, rgba(155,191,169,0.08) 0%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: moodInfo
                    ? `radial-gradient(circle at 35% 35%, ${moodInfo.color}30 0%, ${moodInfo.color}08 60%, transparent 80%)`
                    : 'radial-gradient(circle at 35% 35%, rgba(155,191,169,0.15) 0%, rgba(155,191,169,0.03) 60%, transparent 80%)',
                  boxShadow: moodInfo
                    ? `0 0 60px ${moodInfo.color}15, inset 0 0 40px ${moodInfo.color}08`
                    : '0 0 60px rgba(155,191,169,0.08), inset 0 0 40px rgba(155,191,169,0.03)',
                }}
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                {moodInfo ? (
                  <motion.span className="text-5xl" initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} key={moodInfo.score} transition={{ type: 'spring', stiffness: 200 }}>
                    {moodInfo.emoji}
                  </motion.span>
                ) : (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                    <Sparkles className="w-8 h-8 text-sage/40" />
                  </motion.div>
                )}
              </div>
            </div>

            <motion.h1 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              {greeting}, {user?.displayName || 'there'} 👋
            </motion.h1>
            <motion.p className="text-white/50 text-base md:text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {todayMood ? `You're feeling ${moodInfo?.label.toLowerCase()} today. ${moodInfo?.emoji}` : 'Take a moment to check in with yourself.'}
            </motion.p>

            {!todayMood && (
              <motion.div className="flex justify-center gap-3 mt-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                {MOODS.map(mood => (
                  <motion.button key={mood.score} onClick={() => navigate('/mood')} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-white/[0.04] transition-colors" whileHover={{ scale: 1.12, y: -4 }} whileTap={{ scale: 0.95 }}>
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[10px] text-white/30">{mood.label}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {recommendations && (
              <motion.div className="inline-flex items-center gap-2 mt-6 liquid-glass-pill px-5 py-2.5 text-white/50 text-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <span>{recommendations.text}</span>
                <button onClick={() => navigate(recommendations.action)} className="text-sage hover:text-sage/80 font-medium flex items-center gap-1 transition-colors">
                  {recommendations.label} <ArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Daily Surprise */}
          {getDailySurpriseId() && (
            <DailySurprise />
          )}

          {/* What do you need? */}
          <WhatDoYouNeed />

          {/* Stats */}
          <motion.div className="grid grid-cols-3 gap-3 md:gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            {[
              { label: 'Avg Mood', value: `${stats.avg}/5`, icon: TrendingUp, path: '/analytics', color: 'from-sage/15 to-sage/5', iconColor: 'text-sage' },
              { label: 'Check-ins', value: stats.entries.toString(), icon: Activity, path: '/mood', color: 'from-violet/15 to-lavender/5', iconColor: 'text-lavender' },
              { label: 'Journal', value: journalEntries.length.toString(), icon: BookOpen, path: '/journal', color: 'from-peach/15 to-sand/5', iconColor: 'text-sand' },
            ].map(stat => (
              <motion.div key={stat.label} className="liquid-glass rounded-2xl p-4 text-center cursor-pointer glass-reflect" whileHover={{ y: -4, transition: { duration: 0.2 } }} onClick={() => navigate(stat.path)}>
                <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-b ${stat.color} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <p className="text-white text-xl md:text-2xl font-light">{stat.value}</p>
                <p className="text-white/30 text-[10px] mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Chart */}
          {moodEntries.length > 0 && (
            <motion.div className="liquid-glass rounded-2xl p-5 md:p-6 glass-reflect" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white/60 text-sm">This week at a glance</h3>
                <button onClick={() => navigate('/analytics')} className="text-sage text-xs hover:text-sage/80 transition-colors flex items-center gap-1">Details <ArrowRight className="w-3 h-3" /></button>
              </div>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9DD9D0" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#9DD9D0" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="mood" stroke="#9DD9D0" strokeWidth={2.5} fill="url(#dashGrad)" dot={{ fill: '#9DD9D0', r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {/* 5-Minute Reset CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
            <button onClick={() => navigate('/play-listen')} className="w-full liquid-glass rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.04] transition-all text-left glass-reflect group" style={{ border: '1px solid rgba(155,191,169,0.15)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(155,191,169,0.2), rgba(155,191,169,0.05))' }}>
                <Zap className="w-5 h-5 text-sage" />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">I need a 5-minute reset</p>
                <p className="text-white/40 text-xs mt-0.5">Quick breathing, music, game, journal, and mood check — all in 5 minutes.</p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-sage group-hover:translate-x-1 transition-all" />
            </button>
          </motion.div>

          {/* Quick Actions */}
          <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
            {[
              { icon: Activity, label: 'Track Mood', path: '/mood', color: 'text-cyan', bg: 'from-cyan/10 to-transparent' },
              { icon: BookOpen, label: 'Write Journal', path: '/journal', color: 'text-peach', bg: 'from-peach/10 to-transparent' },
              { icon: Dumbbell, label: 'Exercise', path: '/exercises', color: 'text-lavender', bg: 'from-lavender/10 to-transparent' },
              { icon: Heart, label: 'Find Support', path: '/resources', color: 'text-sage', bg: 'from-sage/10 to-transparent' },
            ].map(action => (
              <motion.button key={action.label} onClick={() => navigate(action.path)} className="liquid-glass rounded-xl p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors text-left" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-b ${action.bg} flex items-center justify-center`}>
                  <action.icon className={`w-4.5 h-4.5 ${action.color}`} />
                </div>
                <span className="text-white/60 text-sm">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Recommended Articles */}
          <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="flex items-center justify-between">
              <h3 className="text-white/60 text-sm">Recommended for you</h3>
              <button onClick={() => navigate('/articles')} className="text-sage text-xs hover:text-sage/80 transition-colors flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mockArticles.slice(0, 4).map((article) => (
                <motion.button key={article.id} onClick={() => navigate(`/articles/${article.id}`)} className="liquid-glass rounded-xl p-4 text-left hover:bg-white/[0.04] transition-colors glass-reflect" whileHover={{ y: -3 }}>
                  <span className="text-white/20 text-[10px] uppercase tracking-wider">{article.category}</span>
                  <h4 className="text-white text-sm font-medium mt-1 mb-1 line-clamp-1">{article.title}</h4>
                  <p className="text-white/30 text-xs line-clamp-2">{article.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-white/20 text-[10px]"><Clock className="w-2.5 h-2.5" />{article.readingTime} min</div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Recent Journal */}
          {journalEntries.length > 0 && (
            <motion.div className="space-y-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}>
              <div className="flex items-center justify-between">
                <h3 className="text-white/60 text-sm">Recent journal entries</h3>
                <button onClick={() => navigate('/journal')} className="text-sage text-xs hover:text-sage/80 transition-colors flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></button>
              </div>
              <div className="space-y-2">
                {journalEntries.slice(0, 3).map(entry => {
                  const entryDate = entry.createdAt?.toDate?.() || new Date();
                  return (
                    <motion.button key={entry.id} onClick={() => navigate(`/journal/${entry.id}`)} className="w-full liquid-glass rounded-xl p-4 text-left hover:bg-white/[0.04] transition-colors flex items-center gap-3" whileHover={{ x: 4 }}>
                      <span className="text-lg">{MOODS.find(m => m.mood === entry.mood)?.emoji || '😐'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{entry.title}</p>
                        <p className="text-white/30 text-xs">{format(entryDate, 'MMM d, h:mm a')}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-white/20" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Get Support */}
          <motion.div className="sm:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <button onClick={() => navigate('/resources')} className="w-full liquid-glass rounded-2xl p-5 text-left hover:bg-white/[0.04] transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Need someone to talk to?</p>
                    <p className="text-white/40 text-xs">Mental health support and crisis helplines are always available.</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-sage transition-colors" />
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════ DAILY SURPRISE ═══════════════════

function DailySurprise() {
  const [joke] = useState(() => getFreshJoke(1)[0]);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    markDailySurpriseShown();
  }, []);

  if (dismissed || !joke) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
      className="liquid-glass rounded-2xl p-5 relative overflow-hidden"
      style={{ background: 'rgba(198,230,211,0.06)', border: '1px solid rgba(155,191,169,0.15)' }}>
      <button onClick={() => setDismissed(true)} className="absolute top-3 right-3 text-white/20 hover:text-white/50 transition-colors">
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-start gap-3">
        <span className="text-2xl">🎁</span>
        <div>
          <p className="text-white/70 text-xs font-medium mb-1">Your tiny dose of happiness 💛</p>
          <p className="text-white/50 text-sm leading-relaxed">{joke.text}</p>
          <button onClick={() => navigate('/play-listen')} className="mt-3 text-sage/70 text-xs hover:text-sage transition-colors">Explore more →</button>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════ WHAT DO YOU NEED? ═════════════════

function WhatDoYouNeed() {
  const [selected, setSelected] = useState<string | null>(null);
  const [response, setResponse] = useState<ReturnType<typeof getNeedResponse> | null>(null);
  const navigate = useNavigate();
  const { entries: moodEntries } = useMood();

  const currentMood = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const entry = moodEntries.find(e => e.date === today);
    if (!entry) return 'okay';
    const moodMap: Record<number, string> = { 1: 'very_bad', 2: 'bad', 3: 'okay', 4: 'good', 5: 'great' };
    return moodMap[entry.moodScore] || 'okay';
  }, [moodEntries]);

  const needs = [
    { id: 'comfort', label: 'Comfort me', emoji: '🫂' },
    { id: 'laugh', label: 'Make me laugh', emoji: '😂' },
    { id: 'calm', label: 'Calm me', emoji: '🧘' },
    { id: 'motivate', label: 'Motivate me', emoji: '⚡' },
    { id: 'talk', label: 'Let me talk', emoji: '💬' },
    { id: 'distract', label: 'Distract me', emoji: '🎵' },
  ];

  const handleSelect = (needId: string) => {
    setSelected(needId);
    setResponse(getNeedResponse(needId, currentMood));
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
      <AnimatePresence mode="wait">
        {!response ? (
          <motion.div key="choices" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            <h3 className="text-white/60 text-sm">What do you need right now?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {needs.map((need, i) => (
                <motion.button key={need.id} onClick={() => handleSelect(need.id)}
                  className="liquid-glass rounded-2xl p-4 text-left hover:bg-white/[0.04] transition-colors"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                  whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                  <span className="text-2xl block mb-1">{need.emoji}</span>
                  <span className="text-white/70 text-xs font-medium">{need.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="response" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="liquid-glass rounded-2xl p-5 space-y-4" style={{ background: 'rgba(155,191,169,0.06)', border: '1px solid rgba(155,191,169,0.12)' }}>
            <p className="text-white/80 text-base leading-relaxed font-medium">{response.message}</p>
            <div className="grid grid-cols-2 gap-2">
              {response.actions.map(action => (
                <motion.button key={action.label} onClick={() => navigate(action.route)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors text-left"
                  whileHover={{ x: 4 }}>
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-white/60 text-xs">{action.label}</span>
                </motion.button>
              ))}
            </div>
            <button onClick={() => { setSelected(null); setResponse(null); }}
              className="text-white/30 text-xs hover:text-white/50 transition-colors">
              ← Choose something else
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}