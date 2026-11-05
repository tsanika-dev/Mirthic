import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, BarChart3, Activity, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { useMood } from '../hooks/useMood';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const MOODS = [
  { score: 1, label: 'Very Bad', emoji: '😞', color: '#E06C75' },
  { score: 2, label: 'Bad', emoji: '😕', color: '#D19A66' },
  { score: 3, label: 'Okay', emoji: '😐', color: '#61AFEF' },
  { score: 4, label: 'Good', emoji: '🙂', color: '#98C379' },
  { score: 5, label: 'Great', emoji: '😄', color: '#C678DD' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
        <p className="text-white/60 text-xs">{label}</p>
        <p className="text-white text-lg font-medium">{payload[0].value}/5</p>
      </div>
    );
  }
  return null;
};

// Custom pie chart label with color
const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, color }: any) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 28;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill={color} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalyticsPage() {
  const { entries } = useMood();
  const [filter, setFilter] = useState<'7d' | '30d' | '90d'>('7d');

  const days = filter === '7d' ? 7 : filter === '30d' ? 30 : 90;

  const filteredEntries = useMemo(() => {
    const cutoff = subDays(new Date(), days);
    return entries.filter(e => new Date(e.date) > cutoff);
  }, [entries, days]);

  const stats = useMemo(() => {
    if (filteredEntries.length === 0) return { avg: 0, total: 0, bestDay: '-', mostCommon: '-', trend: 0 };
    const scores = filteredEntries.map(e => e.moodScore);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;

    const dayScores: Record<string, number[]> = {};
    filteredEntries.forEach(e => {
      const day = format(new Date(e.date), 'EEEE');
      if (!dayScores[day]) dayScores[day] = [];
      dayScores[day].push(e.moodScore);
    });
    const bestDay = Object.entries(dayScores).sort((a, b) => {
      const avgA = a[1].reduce((s, v) => s + v, 0) / a[1].length;
      const avgB = b[1].reduce((s, v) => s + v, 0) / b[1].length;
      return avgB - avgA;
    })[0];

    const freq: Record<number, number> = {};
    scores.forEach(s => { freq[s] = (freq[s] || 0) + 1; });
    const mostCommon = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];

    const half = Math.floor(scores.length / 2);
    const firstHalf = scores.slice(0, half);
    const secondHalf = scores.slice(half);
    const avgFirst = firstHalf.length > 0 ? firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length : 0;
    const avgSecond = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : 0;
    const trend = avgSecond - avgFirst;

    return {
      avg: avg.toFixed(1),
      total: filteredEntries.length,
      bestDay: bestDay ? bestDay[0] : '-',
      mostCommon: MOODS.find(m => m.score === Number(mostCommon[0]))?.emoji || '-',
      trend: Number(trend.toFixed(1)),
    };
  }, [filteredEntries]);

  const weeklyData = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const daysInRange = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return daysInRange.map((day, i) => {
      const dayEntries = entries.filter(e => e.date === format(day, 'yyyy-MM-dd'));
      const avg = dayEntries.length > 0 ? dayEntries.reduce((sum, e) => sum + e.moodScore, 0) / dayEntries.length : 0;
      return { name: labels[i], mood: Number(avg.toFixed(1)) };
    });
  }, [entries]);

  const distribution = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredEntries.forEach(e => { counts[e.moodScore] = (counts[e.moodScore] || 0) + 1; });
    return MOODS.map(m => ({ name: m.label, value: counts[m.score], color: m.color, emoji: m.emoji })).filter(d => d.value > 0);
  }, [filteredEntries]);

  const isEmpty = filteredEntries.length === 0;

  return (
    <div className="relative min-h-screen">
      {/* Starfield background */}
      <div className="starfield-container" aria-hidden="true">
        <div className="star-layer stars1" />
        <div className="star-layer stars2" />
        <div className="star-layer stars3" />
      </div>

      {/* Subtle dark overlay for readability */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: 'rgba(3,7,15,0.25)', zIndex: 1 }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-2" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>Mood Analytics</h1>
          <p className="text-white/60 text-base" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>Discover patterns in your emotional well-being.</p>
        </motion.div>

        <motion.div className="flex gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {(['7d', '30d', '90d'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`liquid-glass-pill px-5 py-2 text-sm transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
              {f === '7d' ? '7 Days' : f === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </motion.div>

        {isEmpty ? (
          <motion.div className="liquid-glass rounded-3xl p-16 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-white/60 text-lg mb-2">Your mood journey starts here</p>
            <p className="text-white/30 text-sm max-w-md mx-auto">Check in today to begin tracking your emotional well-being.</p>
          </motion.div>
        ) : (
          <>
            <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
              {[
                { label: 'Average Mood', value: `${stats.avg}/5`, icon: TrendingUp },
                { label: 'Total Entries', value: stats.total.toString(), icon: Calendar },
                { label: 'Best Day', value: stats.bestDay, icon: BarChart3 },
                { label: 'Most Common', value: stats.mostCommon, icon: Activity },
              ].map((stat) => (
                <motion.div key={stat.label} className="liquid-glass rounded-2xl p-4 text-center" whileHover={{ y: -3 }}>
                  <stat.icon className="w-4 h-4 text-white/40 mx-auto mb-2" />
                  <p className="text-white text-2xl font-light">{stat.value}</p>
                  <p className="text-white/40 text-[10px] mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="liquid-glass rounded-2xl p-4 flex items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <span className="text-white/50 text-sm">Trend:</span>
              {stats.trend > 0 ? (
                <span className="flex items-center gap-1 text-sage text-sm"><ArrowUp className="w-4 h-4" /> Improving (+{stats.trend})</span>
              ) : stats.trend < 0 ? (
                <span className="flex items-center gap-1 text-amber-400 text-sm"><ArrowDown className="w-4 h-4" /> Declining ({stats.trend})</span>
              ) : (
                <span className="flex items-center gap-1 text-white/50 text-sm"><Minus className="w-4 h-4" /> Stable</span>
              )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <motion.div className="liquid-glass rounded-2xl p-5 lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
                <h3 className="text-white/60 text-sm font-medium mb-4">Weekly Trend</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs><linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#9BBFA9" stopOpacity={0.3} /><stop offset="95%" stopColor="#9BBFA9" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                      <YAxis domain={[0, 5]} stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="mood" stroke="#9BBFA9" strokeWidth={2} fill="url(#analyticsGrad)" dot={{ fill: '#9BBFA9', r: 3 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div className="liquid-glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                <h3 className="text-white/60 text-sm font-medium mb-4">Distribution</h3>
                {distribution.length > 0 ? (
                  <div className="h-56 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={distribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" label={renderPieLabel} labelLine={false}>
                          {distribution.map((entry, i) => (<Cell key={i} fill={entry.color} stroke="none" />))}
                        </Pie>
                        <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                          <div className="rounded-xl px-3 py-2" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                            <p className="text-white text-sm">{payload[0].name}: {payload[0].value}</p>
                          </div>
                        ) : null} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : <div className="h-56 flex items-center justify-center text-white/30 text-sm">No data</div>}
                <div className="space-y-1.5 mt-3">
                  {distribution.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-white/60">{d.emoji} {d.name}</span>
                      <span className="ml-auto font-medium" style={{ color: d.color }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div className="liquid-glass rounded-2xl p-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}>
              <h3 className="text-white/60 text-sm font-medium mb-4">Common Factors</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(() => {
                  const tagCount: Record<string, number> = {};
                  filteredEntries.forEach(e => e.tags?.forEach((t: string) => { tagCount[t] = (tagCount[t] || 0) + 1; }));
                  return Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
                })().map(([tag, count]) => (
                  <div key={tag} className="bg-white/5 rounded-xl px-3 py-2 text-center" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-white/70 text-sm">{tag}</p>
                    <p className="text-white/35 text-xs">{count} entries</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
