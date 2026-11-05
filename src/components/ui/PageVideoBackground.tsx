import { useRef, useEffect, useState } from 'react';

interface PageVideoBackgroundProps {
  videoUrl: string;
  overlay?: number;
  className?: string;
}

export function PageVideoBackground({ videoUrl, overlay = 0.20, className = '' }: PageVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      setIsLoaded(true);
      video.play().catch(() => {
        // Autoplay blocked — retry on user interaction
        const handler = () => { video.play().catch(() => {}); document.removeEventListener('click', handler); };
        document.addEventListener('click', handler, { once: true });
      });
    };

    const onReady = () => { if (video.readyState >= 3) tryPlay(); };

    video.addEventListener('canplay', onReady);
    video.addEventListener('canplaythrough', onReady);

    // If already cached and ready
    if (video.readyState >= 3) {
      tryPlay();
    }

    return () => {
      video.removeEventListener('canplay', onReady);
      video.removeEventListener('canplaythrough', onReady);
      video.pause();
    };
  }, [videoUrl]);

  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`} style={{ zIndex: 0 }}>
      <video
        ref={videoRef}
        autoPlay={!prefersReducedMotion}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 1.5s ease-in-out',
        }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Dark atmospheric overlay */}
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to bottom, rgba(3,7,15,${overlay * 0.7}), rgba(3,7,15,${overlay * 1.2}))`,
      }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(3,7,15,0.3) 100%)',
      }} />
    </div>
  );
}