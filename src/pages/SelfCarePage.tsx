import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartOff, ChevronRight, Sparkles, Moon, Brain, Activity, Leaf, Play, Pause, RotateCcw, X, Clock, Wind, Dumbbell } from 'lucide-react';
import { useSaved } from '../hooks/useSaved';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { useParams } from 'react-router-dom';

// ═══════════════ SHARED ═══════════════════════════════

const SELF_CARE_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_171521_25968ba2-b594-4b32-aab7-f6b69398a6fa.mp4';
const EXERCISES_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

type MainTab = 'selfcare' | 'exercises';

// ═══════════════ SELF CARE DATA ══════════════════════

interface SelfCareActivity {
  id: string; title: string; category: string; description: string;
  benefits: string[]; steps: string[]; icon: any; color: string;
}

const ACTIVITIES: SelfCareActivity[] = [
  { id: 'daily-tips', title: 'Daily Self Care Tips', category: 'Daily Care', description: 'Small daily habits that nurture your well-being.', benefits: ['Improved mood', 'Better stress management', 'Increased energy'], steps: ['Start with one small habit', 'Practice gratitude daily', 'Take breaks throughout the day', 'Stay hydrated'], icon: Leaf, color: '#9BBFA9' },
  { id: 'healthy-habits', title: 'Building Healthy Habits', category: 'Healthy Habits', description: 'Create routines that support your mental health.', benefits: ['Consistency', 'Reduced decision fatigue', 'Long-term well-being'], steps: ['Choose one habit to start', 'Set a specific time', 'Track your progress', 'Be patient with yourself'], icon: Activity, color: '#C6E6D3' },
  { id: 'positive-thinking', title: 'Positive Thinking', category: 'Mindfulness', description: 'Cultivate a more optimistic outlook on life.', benefits: ['Reduced negative self-talk', 'Better coping skills', 'Improved relationships'], steps: ['Notice negative thoughts', 'Challenge assumptions', 'Practice affirmations', 'Focus on what you can control'], icon: Sparkles, color: '#B8B4D9' },
  { id: 'sleep-better', title: 'Sleep Better', category: 'Sleep', description: 'Improve your sleep quality with gentle practices.', benefits: ['More energy', 'Better mood', 'Improved focus'], steps: ['Set a consistent bedtime', 'Limit screens before bed', 'Create a calming routine', 'Keep your room cool and dark'], icon: Moon, color: '#E8DCC8' },
  { id: 'digital-detox', title: 'Digital Detox', category: 'Daily Care', description: 'Take breaks from screens to reconnect with yourself.', benefits: ['Reduced anxiety', 'Better sleep', 'More present moments'], steps: ['Set screen-free hours', 'Turn off non-essential notifications', 'Spend time in nature', 'Read a physical book'], icon: Brain, color: '#9BBFA9' },
  { id: 'healthy-routine', title: 'Healthy Routine', category: 'Healthy Habits', description: 'Design a daily routine that supports your well-being.', benefits: ['Structure', 'Reduced stress', 'Better time management'], steps: ['Identify your priorities', 'Schedule self-care first', 'Include movement', 'Review weekly'], icon: Activity, color: '#C6E6D3' },
];

const SC_CATEGORIES = ['All', 'Daily Care', 'Sleep', 'Mindfulness', 'Healthy Habits'];

// ═══════════════ EXERCISES DATA ══════════════════════

interface Exercise {
  id: string; title: string; category: string; description: string;
  duration: string; icon: any; color: string;
}

const EXERCISES: Exercise[] = [
  { id: 'deep-breathing', title: 'Deep Breathing', category: 'Breathing', description: 'Calm your nervous system with controlled breathing.', duration: '5 min', icon: Wind, color: '#9BBFA9' },
  { id: 'body-scan', title: 'Body Scan Meditation', category: 'Meditation', description: 'Systematically relax each part of your body.', duration: '10 min', icon: Brain, color: '#B8B4D9' },
  { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', category: 'Relaxation', description: 'Release tension through muscle tensing and relaxing.', duration: '8 min', icon: Sparkles, color: '#C6E6D3' },
  { id: 'calm-mind', title: 'Calm Your Mind', category: 'Meditation', description: 'Quiet racing thoughts with guided awareness.', duration: '7 min', icon: Brain, color: '#B8B4D9' },
  { id: 'sleep-well', title: 'Sleep Well', category: 'Sleep', description: 'Gentle wind-down routine for better sleep.', duration: '15 min', icon: Moon, color: '#E8DCC8' },
  { id: 'quick-calm', title: 'Quick Calm', category: 'Breathing', description: 'A fast breathing exercise to reset your state.', duration: '3 min', icon: Wind, color: '#9BBFA9' },
  { id: 'loving-kindness', title: 'Loving Kindness', category: 'Meditation', description: 'Cultivate compassion for yourself and others.', duration: '10 min', icon: Sparkles, color: '#C6E6D3' },
  { id: 'tension-release', title: 'Tension Release', category: 'Relaxation', description: 'Targeted stretches for common stress areas.', duration: '12 min', icon: Sparkles, color: '#C6E6D3' },
];

const EX_CATEGORIES = ['All', 'Breathing', 'Meditation', 'Relaxation', 'Sleep'];
const BREATHING_CYCLE = { inhale: 4, hold: 4, exhale: 6 };
const RELAXATION_GUIDANCE = [
  'Find a comfortable position and close your eyes.',
  'Take a deep breath in... and slowly release.',
  'Focus on your forehead. Notice any tension.',
  'Now tense your forehead muscles for 5 seconds...',
  'Release and feel the tension melting away.',
  'Move to your jaw. Let it drop open slightly.',
  'Tense your shoulders, pull them toward your ears...',
  'Now let them drop completely. Feel the relief.',
  'Focus on your hands. Make gentle fists...',
  'Release your hands and let your fingers spread.',
  'Notice your belly. Let it soften and rise with each breath.',
  'Tense your legs gently, pressing your feet down...',
  'Release and feel your legs becoming heavy and relaxed.',
  'Your whole body is now at ease. Breathe naturally.',
];

// ═══════════════ MAIN COMPONENT ══════════════════════

export default function SelfCarePage() {
  const { id } = useParams();
  const { favoriteIds, toggleFavorite } = useSaved();
  const [mainTab, setMainTab] = useState<MainTab>(
    id === 'exercises' ? 'exercises' : 'selfcare'
  );

  return (
    <div className="relative min-h-screen">
      <PageVideoBackground videoUrl={mainTab === 'selfcare' ? SELF_CARE_VIDEO : EXERCISES_VIDEO} overlay={0.22} />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: 'radial-gradient(ellipse at 50% 40%, rgba(40,90,60,0.08) 0%, transparent 60%)' }} />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-2">Self Care & Exercises</h1>
          <p className="text-white/50 text-base">Nurture your mind, body, and spirit.</p>
        </motion.div>

        {/* Main Tabs */}
        <motion.div className="flex gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {([
            { id: 'selfcare' as MainTab, label: 'Self Care', icon: Leaf },
            { id: 'exercises' as MainTab, label: 'Exercises', icon: Dumbbell },
          ]).map(tab => (
            <button key={tab.id} onClick={() => setMainTab(tab.id)}
              className={`liquid-glass-pill px-5 py-2 text-sm flex items-center gap-2 transition-all ${mainTab === tab.id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {mainTab === 'selfcare' ? (
            <SelfCareTab key="sc" favoriteIds={favoriteIds} toggleFavorite={toggleFavorite} />
          ) : (
            <ExercisesTab key="ex" />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ═══════════════ SELF CARE TAB ═══════════════════════

function SelfCareTab({ favoriteIds, toggleFavorite }: { favoriteIds: string[]; toggleFavorite: (id: string, type: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFavorites, setShowFavorites] = useState(false);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let acts = showFavorites ? ACTIVITIES.filter(a => favoriteIds.includes(a.id)) : ACTIVITIES;
    return selectedCategory === 'All' ? acts : acts.filter(a => a.category === selectedCategory);
  }, [selectedCategory, showFavorites, favoriteIds]);

  const expanded = ACTIVITIES.find(a => a.id === expandedActivity);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {SC_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`liquid-glass-pill px-4 py-1.5 text-xs transition-all ${selectedCategory === cat ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>{cat}</button>
        ))}
        <button onClick={() => setShowFavorites(!showFavorites)} className={`liquid-glass-pill px-4 py-1.5 text-xs transition-all flex items-center gap-1 ${showFavorites ? 'text-sage bg-sage/10' : 'text-white/40 hover:text-white/60'}`}>
          {showFavorites ? <Heart className="w-3 h-3" /> : <HeartOff className="w-3 h-3" />} Favorites
        </button>
      </div>

      {/* Activities grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((activity, i) => (
          <motion.div key={activity.id} className="liquid-glass rounded-2xl overflow-hidden group cursor-pointer" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }} onClick={() => setExpandedActivity(activity.id)}>
            <div className="h-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${activity.color}10 0%, ${activity.color}05 100%)` }}>
              <div className="absolute inset-0 flex items-center justify-center"><activity.icon className="w-12 h-12 opacity-20 group-hover:opacity-30 transition-opacity" style={{ color: activity.color }} /></div>
              <motion.button onClick={(e) => { e.stopPropagation(); toggleFavorite(activity.id, 'selfcare'); }} className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white/60 hover:text-white transition-colors" whileTap={{ scale: 0.9 }}>
                {favoriteIds.includes(activity.id) ? <Heart className="w-4 h-4 text-sage fill-sage" /> : <Heart className="w-4 h-4" />}
              </motion.button>
            </div>
            <div className="p-5">
              <span className="text-white/30 text-xs uppercase tracking-wider">{activity.category}</span>
              <h3 className="text-white font-medium mt-1 mb-2 group-hover:text-sage transition-colors">{activity.title}</h3>
              <p className="text-white/40 text-sm line-clamp-2 mb-3">{activity.description}</p>
              <div className="flex items-center justify-between text-xs text-white/30">
                <span>{activity.benefits.length} benefits</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:text-sage transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="liquid-glass rounded-2xl p-12 text-center">
          <p className="text-white/60 text-lg mb-2">{showFavorites ? 'No favorite activities yet' : 'No activities in this category'}</p>
          <p className="text-white/30 text-sm">{showFavorites ? 'Browse activities and tap the heart to favorite them.' : 'Try a different category.'}</p>
        </div>
      )}

      {/* Expanded activity modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setExpandedActivity(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="liquid-glass rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${expanded.color}15` }}>
                    <expanded.icon className="w-5 h-5" style={{ color: expanded.color }} />
                  </div>
                  <div><h2 className="text-white font-medium">{expanded.title}</h2><span className="text-white/30 text-xs">{expanded.category}</span></div>
                </div>
                <motion.button onClick={() => toggleFavorite(expanded.id, 'selfcare')} className="p-2 rounded-full hover:bg-white/5 transition-colors" whileTap={{ scale: 0.9 }}>
                  {favoriteIds.includes(expanded.id) ? <Heart className="w-5 h-5 text-sage fill-sage" /> : <Heart className="w-5 h-5 text-white/40" />}
                </motion.button>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">{expanded.description}</p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Benefits</h3>
                  <div className="space-y-1.5">{expanded.benefits.map((b, i) => <div key={i} className="flex items-center gap-2 text-white/50 text-sm"><div className="w-1.5 h-1.5 rounded-full" style={{ background: expanded.color }} />{b}</div>)}</div>
                </div>
                <div>
                  <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Action Steps</h3>
                  <div className="space-y-2">{expanded.steps.map((s, i) => <div key={i} className="flex items-start gap-2 bg-white/5 rounded-xl px-3 py-2.5 text-white/50 text-sm"><span className="text-white/20 text-xs mt-0.5">{i + 1}.</span>{s}</div>)}</div>
                </div>
              </div>
              <button onClick={() => setExpandedActivity(null)} className="w-full mt-6 liquid-glass-pill py-3 text-white/60 text-sm hover:text-white transition-colors">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════ EXERCISES TAB ═══════════════════════

function ExercisesTab() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const filtered = useMemo(() => {
    return selectedCategory === 'All' ? EXERCISES : EXERCISES.filter(e => e.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {EX_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSelectedCategory(cat)} className={`liquid-glass-pill px-4 py-1.5 text-xs transition-all ${selectedCategory === cat ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>{cat}</button>
        ))}
      </div>

      {/* Exercise cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((exercise, i) => (
          <motion.div key={exercise.id} className="liquid-glass rounded-2xl overflow-hidden group cursor-pointer" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }} onClick={() => setActiveExercise(exercise)}>
            <div className="h-32 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${exercise.color}10 0%, ${exercise.color}05 100%)` }}>
              <div className="absolute inset-0 flex items-center justify-center"><exercise.icon className="w-12 h-12 opacity-20 group-hover:opacity-30 transition-opacity" style={{ color: exercise.color }} /></div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1">
                <Clock className="w-3 h-3 text-white/60" />
                <span className="text-white/60 text-[10px]">{exercise.duration}</span>
              </div>
            </div>
            <div className="p-5">
              <span className="text-white/30 text-xs uppercase tracking-wider">{exercise.category}</span>
              <h3 className="text-white font-medium mt-1 mb-2 group-hover:text-sage transition-colors">{exercise.title}</h3>
              <p className="text-white/40 text-sm line-clamp-2">{exercise.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active exercise player */}
      <AnimatePresence>
        {activeExercise && (
          <ExercisePlayer exercise={activeExercise} onClose={() => setActiveExercise(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═══════════════ EXERCISE PLAYER ═════════════════════

function ExercisePlayer({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const isRunningRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const phaseRef = useRef<'inhale' | 'hold' | 'exhale'>('inhale');

  const isBreathing = exercise.category === 'Breathing';
  const isRelaxation = exercise.category === 'Relaxation' || exercise.category === 'Meditation';

  const cleanup = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    isRunningRef.current = false;
    setIsRunning(false);
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const start = useCallback(() => {
    isRunningRef.current = true;
    setIsRunning(true);
    setTotalElapsed(0);
    setTimer(0);

    if (isBreathing) {
      phaseRef.current = 'inhale';
      setPhase('inhale');
      setTimer(BREATHING_CYCLE.inhale);

      timerRef.current = window.setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setPhase(currentPhase => {
              const next = currentPhase === 'inhale' ? 'hold' : currentPhase === 'hold' ? 'exhale' : 'inhale';
              phaseRef.current = next;
              setTimer(next === 'inhale' ? BREATHING_CYCLE.inhale : next === 'hold' ? BREATHING_CYCLE.hold : BREATHING_CYCLE.exhale);
              return next;
            });
            return prev;
          }
          return prev - 1;
        });
        setTotalElapsed(p => p + 1);
      }, 1000);
    } else if (isRelaxation) {
      let stepIndex = 0;
      setTimer(8);
      timerRef.current = window.setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            stepIndex++;
            if (stepIndex >= RELAXATION_GUIDANCE.length) { cleanup(); return 0; }
            setTotalElapsed(p => p + 1);
            return 8;
          }
          setTotalElapsed(p => p + 1);
          return prev - 1;
        });
      }, 1000);
    }
  }, [isBreathing, isRelaxation, cleanup]);

  const guidanceText = isBreathing
    ? phase === 'inhale' ? 'Breathe in...' : phase === 'hold' ? 'Hold...' : 'Breathe out...'
    : isRelaxation
    ? RELAXATION_GUIDANCE[Math.min(Math.floor(totalElapsed / 8), RELAXATION_GUIDANCE.length - 1)]
    : 'Follow along with the exercise.';

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="liquid-glass rounded-3xl p-8 max-w-lg mx-auto text-center">
      <div className="mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${exercise.color}15` }}>
          <exercise.icon className="w-8 h-8" style={{ color: exercise.color }} />
        </div>
        <h2 className="text-white font-serif text-2xl mb-1">{exercise.title}</h2>
        <p className="text-white/40 text-sm">{exercise.duration}</p>
      </div>

      {isRunning && (
        <div className="mb-8">
          {isBreathing && (
            <motion.div className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center"
              animate={{ scale: phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 1 }}
              transition={{ duration: BREATHING_CYCLE.inhale, ease: 'easeInOut' }}
              style={{ background: `radial-gradient(circle, ${exercise.color}20 0%, ${exercise.color}05 70%)`, border: `2px solid ${exercise.color}30` }}>
              <span className="text-white text-4xl font-light">{timer}</span>
            </motion.div>
          )}
          <p className="text-white/60 text-lg mb-2">{guidanceText}</p>
          <p className="text-white/30 text-sm">{formatTime(totalElapsed)} elapsed</p>
        </div>
      )}

      <div className="flex gap-3 justify-center">
        {!isRunning ? (
          <motion.button onClick={start} className="rounded-full px-8 py-3 flex items-center gap-2 text-white text-sm"
            style={{ background: `${exercise.color}20`, border: `1px solid ${exercise.color}30` }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Play className="w-4 h-4" /> Start
          </motion.button>
        ) : (
          <>
            <motion.button onClick={cleanup} className="rounded-full px-6 py-3 flex items-center gap-2 text-white/60 text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.97 }}>
              <Pause className="w-4 h-4" /> Stop
            </motion.button>
            <motion.button onClick={() => { cleanup(); setTotalElapsed(0); }} className="rounded-full px-6 py-3 flex items-center gap-2 text-white/60 text-sm"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.97 }}>
              <RotateCcw className="w-4 h-4" /> Reset
            </motion.button>
          </>
        )}
        <motion.button onClick={onClose} className="rounded-full px-6 py-3 flex items-center gap-2 text-white/60 text-sm"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} whileTap={{ scale: 0.97 }}>
          <X className="w-4 h-4" /> Close
        </motion.button>
      </div>
    </motion.div>
  );
}
