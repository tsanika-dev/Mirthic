import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VIDEOS = [
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9921cd5959.mp4',
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
];

// Page-specific atmospheric color overlays
export const PAGE_ATMOSPHERES: Record<string, { color: string; intensity: number }> = {
  dashboard:  { color: 'rgba(15,50,80,0.12)', intensity: 0.12 },
  mood:        { color: 'rgba(80,60,160,0.10)', intensity: 0.10 },
  journal:     { color: 'rgba(60,45,30,0.08)', intensity: 0.08 },
  selfcare:    { color: 'rgba(30,80,50,0.10)', intensity: 0.10 },
  exercises:   { color: 'rgba(60,50,140,0.10)', intensity: 0.10 },
  articles:    { color: 'rgba(10,30,60,0.10)', intensity: 0.10 },
  community:   { color: 'rgba(100,60,160,0.08)', intensity: 0.08 },
  resources:   { color: 'rgba(10,50,70,0.08)', intensity: 0.08 },
  profile:     { color: 'rgba(10,40,50,0.08)', intensity: 0.08 },
  settings:    { color: 'rgba(20,30,50,0.06)', intensity: 0.06 },
  analytics:   { color: 'rgba(60,50,150,0.08)', intensity: 0.08 },
};

function AtmosphericParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 18 : 40;

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.2 - 0.05,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.2 + 0.03,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.01 + 0.005,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        const alpha = p.opacity * (0.6 + Math.sin(p.pulse) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 210, 220, ${alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2, opacity: 0.8 }} />;
}

export function GlobalCinematicBackground() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const startNextVideo = useCallback(() => {
    const nextIndex = (activeIndex + 1) % VIDEOS.length;
    const nextVideo = videoRefs.current[nextIndex];
    const currentVideo = videoRefs.current[activeIndex];

    if (!nextVideo || !currentVideo) return;

    // Prepare next video
    nextVideo.currentTime = 0;
    nextVideo.style.opacity = '1';
    nextVideo.play().catch(() => {});

    // Fade out current
    setFadingOut(activeIndex);
    currentVideo.style.transition = 'opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1)';
    currentVideo.style.opacity = '0';

    setTimeout(() => {
      // Pause and reset previous
      currentVideo.pause();
      currentVideo.currentTime = 0;
      currentVideo.style.transition = '';
      currentVideo.style.opacity = '0';
      setFadingOut(null);
      setActiveIndex(nextIndex);
    }, 2600);
  }, [activeIndex]);

  // Start the first video
  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.style.opacity = '1';
      firstVideo.play().catch(() => {});
    }
  }, []);

  // Monitor video end to trigger crossfade
  useEffect(() => {
    const currentVideo = videoRefs.current[activeIndex];
    if (!currentVideo) return;

    const handleTimeUpdate = () => {
      if (prefersReducedMotion.current) return;
      const remaining = currentVideo.duration - currentVideo.currentTime;
      if (remaining <= 2.5 && remaining > 0) {
        currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
        startNextVideo();
      }
    };

    currentVideo.addEventListener('timeupdate', handleTimeUpdate);
    return () => currentVideo.removeEventListener('timeupdate', handleTimeUpdate);
  }, [activeIndex, startNextVideo]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
      {/* Video layers */}
      {VIDEOS.map((src, i) => (
        <video
          key={i}
          ref={el => { videoRefs.current[i] = el; }}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            opacity: i === 0 ? 1 : 0,
            transition: i === fadingOut ? 'opacity 2.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
          muted
          loop={false}
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}

      {/* Cinematic dark atmospheric overlay */}
      <div className="absolute inset-0" style={{ zIndex: 3 }}>
        <div className="absolute inset-0" style={{ background: 'rgba(3, 7, 15, 0.35)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(15,30,60,0.15) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(3,7,15,0.4) 100%)' }} />
      </div>

      {/* Atmospheric particles */}
      <AtmosphericParticles />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        zIndex: 4,
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(3,7,15,0.5) 100%)',
      }} />
    </div>
  );
}

// Page-specific color atmosphere overlay — renders on top of the global background
export function PageAtmosphere({ page }: { page: string }) {
  const atm = PAGE_ATMOSPHERES[page] || PAGE_ATMOSPHERES.dashboard;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      animate={{ background: `radial-gradient(ellipse at 50% 40%, ${atm.color} 0%, transparent 70%)` }}
      transition={{ duration: 3, ease: 'easeInOut' }}
    />
  );
}