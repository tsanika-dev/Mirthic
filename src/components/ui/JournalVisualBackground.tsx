import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const JOURNAL_IMAGES = [
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
    bg: '#F4845F',
    panel: '#F79B7F'
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
    bg: '#6BBF7A',
    panel: '#85CC92'
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
    bg: '#E882B4',
    panel: '#ED9DC4'
  },
  {
    src: 'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
    bg: '#6EB5FF',
    panel: '#8DC4FF'
  }
];

const TRANSITION = 'all 650ms cubic-bezier(0.4,0,0.2,1)';

export function JournalVisualBackground({ onWriteClick }: { onWriteClick?: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsMobile(window.innerWidth < 640);
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Preload images
  useEffect(() => {
    let loaded = 0;
    JOURNAL_IMAGES.forEach(img => {
      const i = new Image();
      i.onload = i.onerror = () => {
        loaded++;
        if (loaded >= JOURNAL_IMAGES.length) setImagesLoaded(true);
      };
      i.src = img.src;
    });
  }, []);

  const navigate = useCallback((dir: 'next' | 'prev') => {
    if (isAnimating || prefersReducedMotion.current) {
      setActiveIndex(prev => dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4);
      return;
    }
    setIsAnimating(true);
    setActiveIndex(prev => dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsAnimating(false), 650);
  }, [isAnimating]);

  // Auto-advance
  useEffect(() => {
    if (prefersReducedMotion.current) return;
    const interval = setInterval(() => navigate('next'), 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const getRole = (index: number): 'center' | 'left' | 'right' | 'back' => {
    const diff = (index - activeIndex + 4) % 4;
    if (diff === 0) return 'center';
    if (diff === 1) return 'right';
    if (diff === 2) return 'back';
    return 'left';
  };

  const getStyle = (role: 'center' | 'left' | 'right' | 'back'): React.CSSProperties => {
    if (role === 'center') {
      return {
        left: '50%',
        transform: `translateX(-50%) scale(${isMobile ? 1.18 : 1.50})`,
        height: isMobile ? '55%' : '85%',
        bottom: isMobile ? '20%' : '0%',
        filter: 'none',
        opacity: 1,
        zIndex: 20,
      };
    }
    if (role === 'left') {
      return {
        left: isMobile ? '18%' : '28%',
        transform: 'translateX(-50%) scale(1)',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        filter: 'blur(2px)',
        opacity: 0.8,
        zIndex: 10,
      };
    }
    if (role === 'right') {
      return {
        left: isMobile ? '80%' : '72%',
        transform: 'translateX(-50%) scale(1)',
        height: isMobile ? '16%' : '28%',
        bottom: isMobile ? '32%' : '12%',
        filter: 'blur(2px)',
        opacity: 0.8,
        zIndex: 10,
      };
    }
    // back
    return {
      left: '50%',
      transform: 'translateX(-50%) scale(1)',
      height: isMobile ? '13%' : '22%',
      bottom: isMobile ? '32%' : '12%',
      filter: 'blur(4px)',
      opacity: 0.5,
      zIndex: 5,
    };
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{
        backgroundColor: JOURNAL_IMAGES[activeIndex].bg,
        transition: TRANSITION,
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      {/* Film grain */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.06, zIndex: 30, pointerEvents: 'none' }}>
        <filter id="journalGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#journalGrain)" />
      </svg>

      {/* Ghost text */}
      <div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 pointer-events-none select-none whitespace-nowrap"
        style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(80px, 20vw, 300px)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.15)',
          zIndex: 2,
        }}
      >
        YOUR STORY
      </div>

      {/* Carousel images */}
      {JOURNAL_IMAGES.map((img, i) => {
        const role = getRole(i);
        const style = getStyle(role);
        return (
          <img
            key={i}
            src={img.src}
            alt=""
            className="absolute object-contain"
            style={{
              ...style,
              objectPosition: 'bottom center',
              transition: TRANSITION,
              willChange: 'transform, filter, opacity',
              pointerEvents: 'none',
            }}
          />
        );
      })}

      {/* Atmospheric lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 60%, ${JOURNAL_IMAGES[activeIndex].panel}22 0%, transparent 60%)`,
          transition: TRANSITION,
          zIndex: 25,
        }}
      />

      {/* Bottom gradient for readability */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.25), transparent)',
          zIndex: 26,
        }}
      />

      {/* Carousel controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-30 pointer-events-auto">
        <button
          onClick={() => navigate('prev')}
          aria-label="Previous journal visual"
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={() => navigate('next')}
          aria-label="Next journal visual"
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Journal header label */}
      <div className="absolute top-6 left-6 z-30 pointer-events-none">
        <p className="text-white/80 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium">Mindful Journal</p>
      </div>

      {/* Bottom-left message panel */}
      <div
        className="absolute bottom-20 sm:bottom-6 left-6 right-auto max-w-xs z-30 pointer-events-auto hidden sm:block"
        style={{
          background: 'rgba(0,0,0,0.20)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '16px 20px',
        }}
      >
        <p className="text-white text-sm font-medium mb-1">Your story matters.</p>
        <p className="text-white/60 text-xs mb-3">Give your thoughts a place to breathe.</p>
        {onWriteClick && (
          <button
            onClick={onWriteClick}
            className="text-white/80 text-xs hover:text-white transition-colors underline underline-offset-2"
          >
            Write something
          </button>
        )}
      </div>

      {/* Loading fade-in */}
      {!imagesLoaded && (
        <div className="absolute inset-0 bg-[#E882B4] z-40 transition-opacity duration-1000" style={{ opacity: imagesLoaded ? 0 : 1 }} />
      )}
    </div>
  );
}
