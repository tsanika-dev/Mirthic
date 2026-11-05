import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginTransitionProps {
  onComplete: () => void;
}

// 3D glass heart SVG path
const HEART_PATH = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

function FloatingParticle({ delay, x, y, color }: { delay: number; x: number; y: number; color: string }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 rounded-full"
      style={{ left: `${x}%`, top: `${y}%`, background: color }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0],
        scale: [0, 1.5, 0.5],
        y: [0, -60 - Math.random() * 40],
        x: [(Math.random() - 0.5) * 40],
      }}
      transition={{ duration: 1.5, delay: delay, ease: 'easeOut' }}
    />
  );
}

export function LoginTransition({ onComplete }: LoginTransitionProps) {
  const [phase, setPhase] = useState<'heart' | 'dissolve' | 'done'>('heart');

  useEffect(() => {
    // Heart appears and rotates for 2.5s
    const t1 = setTimeout(() => setPhase('dissolve'), 2500);
    // Dissolve completes and transition ends
    const t2 = setTimeout(() => { setPhase('done'); onComplete(); }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  // Generate particles for dissolve effect
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.5,
    x: 35 + Math.random() * 30,
    y: 35 + Math.random() * 30,
    color: ['#9BBFA9', '#C6E6D3', '#B8B4D9', '#9DD9D0', '#E8DCC8'][Math.floor(Math.random() * 5)],
  }));

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #101A32 0%, #07090D 100%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Atmospheric glow */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(155,191,169,0.08) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(184,180,217,0.06) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(155,191,169,0.08) 0%, transparent 60%)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* 3D Glass Heart */}
          <AnimatePresence>
            {phase === 'heart' && (
              <motion.div className="relative" style={{ perspective: '800px' }}>
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, scale: 0.3, rotateY: -30 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateY: [0, 5, -5, 0],
                    rotateX: [0, 3, -3, 0],
                  }}
                  exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  {/* Heart glow */}
                  <motion.div
                    className="absolute -inset-8 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 60px rgba(155,191,169,0.15), 0 0 120px rgba(184,180,217,0.08)',
                        '0 0 80px rgba(155,191,169,0.2), 0 0 160px rgba(184,180,217,0.1)',
                        '0 0 60px rgba(155,191,169,0.15), 0 0 120px rgba(184,180,217,0.08)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Heart SVG — glass translucent */}
                  <svg width="120" height="120" viewBox="0 0 24 24" className="drop-shadow-2xl">
                    <defs>
                      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(155,191,169,0.5)" />
                        <stop offset="50%" stopColor="rgba(184,180,217,0.4)" />
                        <stop offset="100%" stopColor="rgba(157,217,208,0.35)" />
                      </linearGradient>
                      <linearGradient id="heartShine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                        <stop offset="40%" stopColor="rgba(255,255,255,0.05)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
                      </linearGradient>
                    </defs>
                    <path d={HEART_PATH} fill="url(#heartGrad)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.3" />
                    <path d={HEART_PATH} fill="url(#heartShine)" />
                  </svg>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dissolving particles */}
          {phase === 'dissolve' && particles.map(p => (
            <FloatingParticle key={p.id} delay={p.delay} x={p.x} y={p.y} color={p.color} />
          ))}

          {/* Welcome text */}
          <motion.p
            className="absolute bottom-[30%] text-white/40 font-serif text-xl tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
            transition={{ duration: 3, times: [0, 0.3, 0.7, 1] }}
          >
            Welcome to Mirthic
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}