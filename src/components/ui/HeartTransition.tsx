import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartScene } from './HeartScene';

interface LoveTransitionProps {
  onComplete: () => void;
}

type Phase = 'enter' | 'rotate' | 'pause' | 'bubbles' | 'zoom' | 'reveal';

const TOTAL_ROTATION = Math.PI * 2; // One full revolution
const ROTATION_DURATION = 4000; // 4 seconds for full revolution

const BUBBLE_CONFIGS = [
  { size: 28, left: '22%', top: '25%', delay: 0 },
  { size: 18, left: '75%', top: '20%', delay: 80 },
  { size: 35, left: '68%', top: '65%', delay: 160 },
  { size: 15, left: '18%', top: '70%', delay: 240 },
  { size: 24, left: '80%', top: '45%', delay: 320 },
  { size: 20, left: '30%', top: '80%', delay: 400 },
  { size: 14, left: '55%', top: '15%', delay: 120 },
  { size: 22, left: '42%', top: '75%', delay: 280 },
];

export function HeartTransition({ onComplete }: LoveTransitionProps) {
  const [phase, setPhase] = useState<Phase>('enter');
  const [rotationAngle, setRotationAngle] = useState(0);
  const [cameraZ, setCameraZ] = useState(6);
  const [heartScale, setHeartScale] = useState(0.70);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const startRotation = useCallback(() => {
    startTimeRef.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / ROTATION_DURATION, 1);
      // Smooth ease-in-out
      const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setRotationAngle(eased * TOTAL_ROTATION);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setRotationAngle(TOTAL_ROTATION);
        setPhase('pause');
      }
    };
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  // Phase state machine
  useEffect(() => {
    if (prefersReducedMotion.current) {
      // Simplified: enter → pause → reveal
      setPhase('enter');
      const t1 = setTimeout(() => setHeartScale(1), 500);
      const t2 = setTimeout(() => setPhase('pause'), 1500);
      const t3 = setTimeout(() => setPhase('zoom'), 3000);
      const t4 = setTimeout(() => { setPhase('reveal'); onComplete(); }, 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }

    switch (phase) {
      case 'enter':
        setTimeout(() => setPhase('rotate'), 900);
        break;
      case 'rotate':
        startRotation();
        break;
      case 'pause':
        setTimeout(() => setPhase('bubbles'), 300);
        break;
      case 'bubbles':
        setTimeout(() => setPhase('zoom'), 1200);
        break;
      case 'zoom':
        // Camera zoom animation
        const zoomStart = performance.now();
        const zoomDuration = 600;
        const animateZoom = (now: number) => {
          const elapsed = now - zoomStart;
          const progress = Math.min(elapsed / zoomDuration, 1);
          // Aggressive ease-out for dramatic zoom
          const eased = 1 - Math.pow(1 - progress, 3);
          setCameraZ(6 - eased * 5.5); // 6 → 0.5
          setHeartScale(1 + eased * 2.5); // 1 → 3.5
          if (progress < 1) {
            rafRef.current = requestAnimationFrame(animateZoom);
          } else {
            setTimeout(() => setPhase('reveal'), 100);
          }
        };
        rafRef.current = requestAnimationFrame(animateZoom);
        break;
      case 'reveal':
        setTimeout(() => onComplete(), 700);
        break;
    }

    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [phase, onComplete, startRotation]);

  const isZooming = phase === 'zoom';
  const showBubbles = phase === 'bubbles' || phase === 'zoom';

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === 'reveal' ? 0 : 1 }}
      transition={{ duration: 0.7 }}
      style={{ background: '#050507' }}
    >
      {/* Subtle atmospheric haze */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 60%)',
      }} />

      {/* Film grain */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.04, zIndex: 30 }}>
        <filter id="heartGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heartGrain)" />
      </svg>

      {/* 3D Heart Canvas */}
      <div className="absolute inset-0" style={{ opacity: heartScale > 0 ? 1 : 0, transition: 'opacity 0.5s' }}>
        <HeartScene rotationAngle={rotationAngle} cameraZ={cameraZ} heartScale={heartScale} />
      </div>

      {/* Liquid glass bubbles */}
      <AnimatePresence>
        {showBubbles && !isZooming && BUBBLE_CONFIGS.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.7, scale: 1, y: [0, -8, 0] }}
            exit={{ opacity: 0, scale: 2 }}
            transition={{
              opacity: { delay: b.delay / 1000, duration: 0.5 },
              scale: { delay: b.delay / 1000, duration: 0.6, ease: 'easeOut' },
              y: { delay: b.delay / 1000, duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              top: b.top,
              background: i % 3 === 0
                ? 'rgba(255,255,255,0.06)'
                : i % 3 === 1
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.15)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.25)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 15px 40px rgba(0,0,0,0.30)',
              zIndex: 5,
            }}
          />
        ))}
      </AnimatePresence>

      {/* Welcome text */}
      <AnimatePresence>
        {(phase === 'rotate' || phase === 'pause' || phase === 'bubbles') && (
          <motion.div
            className="absolute text-center z-20"
            style={{ bottom: '12%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h1
              className="text-2xl md:text-4xl text-white mb-3"
              style={{ fontFamily: "'Instrument Serif', serif", textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              Welcome to Mirthic
            </h1>
            <p className="text-white/40 text-sm" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.5)' }}>
              Take a moment for yourself.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glass pop flash at zoom peak */}
      {phase === 'reveal' && (
        <motion.div
          className="absolute inset-0 z-30 pointer-events-none"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(200,200,200,0.3) 30%, transparent 70%)',
          }}
        />
      )}
    </motion.div>
  );
}
