import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Clock, Wind, Brain, Moon, Sparkles } from 'lucide-react';
import { PageVideoBackground } from '../components/ui/PageVideoBackground';
import { useParams, useNavigate } from 'react-router-dom';

const EXERCISES_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4';

interface Exercise {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  icon: any;
  color: string;
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

const CATEGORIES = ['All', 'Breathing', 'Meditation', 'Relaxation', 'Sleep'];
const BREATHING_CYCLE = { inhale: 4, hold: 4, exhale: 6 };

// Guidance messages for non-breathing exercises
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

const SLEEP_GUIDANCE = [
  'Dim your lights and settle into a comfortable position.',
  'Close your eyes gently. Let your breathing slow.',
  'Imagine a warm, soft light above your head.',
  'Feel it slowly moving down, relaxing your forehead.',
  'The light reaches your eyes... your cheeks... your jaw.',
  'It flows down your neck, soothing every muscle.',
  'Your shoulders are heavy and warm.',
  'The light wraps around your chest like a gentle blanket.',
  'Feel your heartbeat slow and steady.',
  'Your arms are relaxed. Your hands are still.',
  'The warmth reaches your legs, your feet.',
  'You are safe. You are calm. You are ready to rest.',
];

const MEDITATION_GUIDANCE = [
  'Settle into stillness. Let the world fade away.',
  'Notice your breath without changing it.',
  'Each thought is a cloud passing through your mind.',
  'You are the sky — vast, open, unchanging.',
  'If your mind wanders, gently guide it back.',
  'Feel the space between your thoughts growing.',
  'There is nothing to fix. Nothing to solve.',
  'Just this moment. Just this breath.',
  'You are exactly where you need to be.',
  'Rest in this awareness. Peace is already here.',
];

const BREATHING_GUIDANCE = [
  'Follow the orb. Let it guide your breath.',
  'Inhale slowly through your nose...',
  'Hold gently at the top...',
  'Exhale slowly through your mouth...',
  'Feel your body soften with each breath.',
];

export default function ExercisesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);

  const filteredExercises = selectedCategory === 'All'
    ? EXERCISES
    : EXERCISES.filter(e => e.category === selectedCategory);

  useEffect(() => {
    if (id) {
      const ex = EXERCISES.find(e => e.id === id);
      if (ex) setActiveExercise(ex);
    }
  }, [id]);

  const handleStart = (exercise: Exercise) => {
    setActiveExercise(exercise);
    navigate(`/exercises/${exercise.id}`);
  };

  const handleClose = () => {
    setActiveExercise(null);
    navigate('/exercises');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageVideoBackground videoUrl={EXERCISES_VIDEO} overlay={0.25} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-tight mb-3">Find your calm</h1>
          <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto">Take a few minutes to reconnect with yourself.</p>
        </motion.div>

        <motion.div className="flex justify-center flex-wrap gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`liquid-glass-pill px-5 py-2 text-sm transition-all ${selectedCategory === cat ? 'bg-white/10 text-white border-sage/30' : 'text-white/40 hover:text-white/60'}`}>
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {filteredExercises.map((exercise, i) => (
            <motion.div key={exercise.id} className="liquid-glass rounded-2xl p-5 cursor-pointer group" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5, transition: { duration: 0.2 } }} onClick={() => handleStart(exercise)}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${exercise.color}15` }}>
                  <exercise.icon className="w-5 h-5" style={{ color: exercise.color }} />
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Play className="w-3.5 h-3.5 text-white/60 ml-0.5" />
                </div>
              </div>
              <h3 className="text-white font-medium mb-1">{exercise.title}</h3>
              <p className="text-white/40 text-sm mb-3 line-clamp-2">{exercise.description}</p>
              <div className="flex items-center gap-3 text-xs text-white/30">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exercise.duration}</span>
                <span className="px-2 py-0.5 rounded-full bg-white/5">{exercise.category}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatePresence>
          {activeExercise && (
            <ExercisePlayer exercise={activeExercise} onClose={handleClose} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ExercisePlayer({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  const navigate = useNavigate();
  const [state, setState] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [totalTime, setTotalTime] = useState(0);
  const [meditationDuration, setMeditationDuration] = useState(5);
  const [guidanceIndex, setGuidanceIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const breathTimeoutRef = useRef<number | null>(null);
  const guidanceIntervalRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  const durationMinutes = parseInt(exercise.duration) || 5;
  const isBreathing = exercise.category === 'Breathing';
  const isMeditation = exercise.category === 'Meditation';
  const isRelaxation = exercise.category === 'Relaxation';
  const isSleep = exercise.category === 'Sleep';
  const totalSeconds = isMeditation ? meditationDuration * 60 : durationMinutes * 60;

  // Get guidance messages based on exercise type
  const getGuidance = () => {
    if (isBreathing) return BREATHING_GUIDANCE;
    if (isRelaxation) return RELAXATION_GUIDANCE;
    if (isSleep) return SLEEP_GUIDANCE;
    if (isMeditation) return MEDITATION_GUIDANCE;
    return [];
  };
  const guidance = getGuidance();

  const clearAll = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    if (breathTimeoutRef.current) { clearTimeout(breathTimeoutRef.current); breathTimeoutRef.current = null; }
    if (guidanceIntervalRef.current) { clearInterval(guidanceIntervalRef.current); guidanceIntervalRef.current = null; }
  }, []);

  // Start the exercise timer
  const startTimer = useCallback(() => {
    clearAll();
    isRunningRef.current = true;

    intervalRef.current = window.setInterval(() => {
      setTotalTime(prev => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          isRunningRef.current = false;
          clearAll();
          setState('completed');
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
  }, [totalSeconds, clearAll]);

  // Breathing cycle using refs to avoid stale closures
  const runBreathCycle = useCallback(() => {
    if (!isRunningRef.current) return;

    setBreathPhase('inhale');
    breathTimeoutRef.current = window.setTimeout(() => {
      if (!isRunningRef.current) return;
      setBreathPhase('hold');
      breathTimeoutRef.current = window.setTimeout(() => {
        if (!isRunningRef.current) return;
        setBreathPhase('exhale');
        breathTimeoutRef.current = window.setTimeout(() => {
          if (!isRunningRef.current) return;
          runBreathCycle(); // recursive call
        }, BREATHING_CYCLE.exhale * 1000);
      }, BREATHING_CYCLE.hold * 1000);
    }, BREATHING_CYCLE.inhale * 1000);
  }, []);

  // Guidance cycle for non-breathing exercises
  const startGuidance = useCallback(() => {
    if (guidance.length === 0) return;
    setGuidanceIndex(0);
    guidanceIntervalRef.current = window.setInterval(() => {
      setGuidanceIndex(prev => (prev + 1) % guidance.length);
    }, 8000); // Change guidance every 8 seconds
  }, [guidance.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isRunningRef.current = false;
      clearAll();
    };
  }, [clearAll]);

  const handleStart = () => {
    setState('running');
    startTimer();
    if (isBreathing) {
      // Small delay to let state settle
      setTimeout(() => runBreathCycle(), 100);
    } else {
      startGuidance();
    }
  };

  const handlePause = () => {
    isRunningRef.current = false;
    setState('paused');
    clearAll();
  };

  const handleResume = () => {
    setState('running');
    isRunningRef.current = true;

    // Restart timer
    intervalRef.current = window.setInterval(() => {
      setTotalTime(prev => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          isRunningRef.current = false;
          clearAll();
          setState('completed');
          return totalSeconds;
        }
        return next;
      });
    }, 1000);

    if (isBreathing) {
      setTimeout(() => runBreathCycle(), 100);
    } else {
      startGuidance();
    }
  };

  const handleStop = () => {
    isRunningRef.current = false;
    clearAll();
    setState('idle');
    setTotalTime(0);
    setBreathPhase('inhale');
    setGuidanceIndex(0);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const remaining = totalSeconds - totalTime;
  const progress = totalTime / totalSeconds;
  const circumference = 2 * Math.PI * 100;
  const dashOffset = circumference * (1 - progress);

  const breathScale = isBreathing ? (breathPhase === 'inhale' ? 1.4 : breathPhase === 'hold' ? 1.4 : 1.0) : 1.0;

  // Current guidance text for non-breathing exercises
  const currentGuidance = guidance.length > 0 ? guidance[guidanceIndex % guidance.length] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(3,7,15,0.92)', backdropFilter: 'blur(24px)' }}
    >
      <button onClick={onClose} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors z-10">
        <X className="w-6 h-6" />
      </button>

      <div className="flex flex-col items-center space-y-8 px-6 max-w-lg w-full">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h2 className="font-serif text-2xl md:text-4xl text-white mb-2">{exercise.title}</h2>
          <p className="text-white/40 text-sm">{exercise.description}</p>
        </motion.div>

        {/* Meditation Duration Picker */}
        {isMeditation && state === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            {[5, 10, 15].map(d => (
              <button key={d} onClick={() => setMeditationDuration(d)} className={`liquid-glass-pill px-6 py-3 text-sm transition-all ${meditationDuration === d ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60'}`}>
                {d} min
              </button>
            ))}
          </motion.div>
        )}

        {/* Visual orb + progress ring */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {state !== 'idle' && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
              <motion.circle cx="110" cy="110" r="100" fill="none" stroke={exercise.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={circumference} animate={{ strokeDashoffset: dashOffset }} transition={{ duration: 0.5 }} />
            </svg>
          )}

          {/* Orb */}
          <motion.div
            className="rounded-full flex items-center justify-center text-center"
            style={{
              background: `radial-gradient(circle, ${exercise.color}25 0%, ${exercise.color}08 70%)`,
              boxShadow: `0 0 100px ${exercise.color}20`,
            }}
            animate={isBreathing && state === 'running' ? { scale: breathScale } : { scale: 1 }}
            transition={{ duration: isBreathing ? (breathPhase === 'inhale' ? BREATHING_CYCLE.inhale : breathPhase === 'hold' ? 0.3 : BREATHING_CYCLE.exhale) : 0.5, ease: 'easeInOut' }}
          >
            {state === 'completed' ? (
              <div>
                <div className="text-4xl mb-2">🌿</div>
                <p className="text-white font-medium text-sm">Complete</p>
              </div>
            ) : isBreathing && state === 'running' ? (
              <div>
                <motion.p key={breathPhase} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-white text-xl font-serif">
                  {breathPhase === 'inhale' ? 'Inhale' : breathPhase === 'hold' ? 'Hold' : 'Exhale'}
                </motion.p>
                <p className="text-white/30 text-xs mt-1">
                  {breathPhase === 'inhale' ? BREATHING_CYCLE.inhale : breathPhase === 'hold' ? BREATHING_CYCLE.hold : BREATHING_CYCLE.exhale}s
                </p>
              </div>
            ) : state === 'running' || state === 'paused' ? (
              <div>
                <p className="text-white text-3xl font-light">{formatTime(remaining)}</p>
                <p className="text-white/30 text-xs mt-1">{state === 'paused' ? 'paused' : 'remaining'}</p>
              </div>
            ) : (
              <div>
                <p className="text-white/50 text-sm">{formatTime(totalSeconds)}</p>
                <p className="text-white/25 text-xs mt-1">tap play to begin</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Guidance text for non-breathing exercises */}
        {currentGuidance && (state === 'running' || state === 'paused') && (
          <motion.div key={guidanceIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center px-4">
            <p className="text-white/60 text-sm leading-relaxed italic max-w-sm">"{currentGuidance}"</p>
          </motion.div>
        )}

        {/* Controls */}
        <div className="flex items-center gap-4">
          {state === 'idle' && (
            <motion.button onClick={handleStart} className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Play className="w-6 h-6 text-white ml-1" />
            </motion.button>
          )}
          {state === 'running' && (
            <>
              <motion.button onClick={handleStop} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <X className="w-5 h-5 text-white/60" />
              </motion.button>
              <motion.button onClick={handlePause} className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Pause className="w-6 h-6 text-white" />
              </motion.button>
            </>
          )}
          {state === 'paused' && (
            <>
              <motion.button onClick={handleStop} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <RotateCcw className="w-5 h-5 text-white/60" />
              </motion.button>
              <motion.button onClick={handleResume} className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Play className="w-6 h-6 text-white ml-1" />
              </motion.button>
            </>
          )}
          {state === 'completed' && (
            <div className="text-center space-y-4">
              <div>
                <p className="text-white text-lg font-medium mb-1">Exercise complete 🌿</p>
                <p className="text-white/40 text-sm">Take a moment to notice how you feel.</p>
              </div>
              <div className="flex gap-3 justify-center">
                <motion.button onClick={() => navigate('/mood')} className="liquid-glass-pill px-6 py-2.5 text-white text-sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  How are you feeling now?
                </motion.button>
                <motion.button onClick={handleStop} className="liquid-glass-pill px-6 py-2.5 text-white/60 text-sm" whileHover={{ scale: 1.02 }}>
                  <RotateCcw className="w-4 h-4 inline mr-1" />Restart
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
