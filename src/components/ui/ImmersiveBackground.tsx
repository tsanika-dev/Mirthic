import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ImmersiveBackgroundProps {
  children: ReactNode;
  theme?: string;
  className?: string;
}

// Subtle page-specific atmospheric overlays — these sit between the global video and the UI
const themeOverlays: Record<string, {
  gradient: string;
  glow: string;
  accent: string;
}> = {
  dashboard: {
    gradient: 'radial-gradient(ellipse at 30% 20%, rgba(15,60,90,0.08) 0%, transparent 50%)',
    glow: 'rgba(155,191,169,0.04)',
    accent: 'rgba(15,60,90,0.06)',
  },
  mood: {
    gradient: 'radial-gradient(ellipse at 40% 20%, rgba(80,60,160,0.06) 0%, transparent 50%)',
    glow: 'rgba(155,145,201,0.04)',
    accent: 'rgba(80,60,160,0.04)',
  },
  exercises: {
    gradient: 'radial-gradient(ellipse at 50% 30%, rgba(70,50,160,0.06) 0%, transparent 50%)',
    glow: 'rgba(184,180,217,0.04)',
    accent: 'rgba(90,70,180,0.04)',
  },
  journal: {
    gradient: 'radial-gradient(ellipse at 50% 20%, rgba(60,45,30,0.06) 0%, transparent 50%)',
    glow: 'rgba(232,200,170,0.04)',
    accent: 'rgba(232,184,168,0.03)',
  },
  selfcare: {
    gradient: 'radial-gradient(ellipse at 30% 30%, rgba(40,90,60,0.06) 0%, transparent 50%)',
    glow: 'rgba(155,191,169,0.04)',
    accent: 'rgba(198,230,211,0.03)',
  },
  articles: {
    gradient: 'radial-gradient(ellipse at 40% 20%, rgba(10,30,60,0.06) 0%, transparent 50%)',
    glow: 'rgba(157,217,208,0.03)',
    accent: 'rgba(15,40,70,0.04)',
  },
  community: {
    gradient: 'radial-gradient(ellipse at 40% 30%, rgba(120,80,180,0.05) 0%, transparent 50%)',
    glow: 'rgba(184,180,217,0.03)',
    accent: 'rgba(140,100,200,0.03)',
  },
  resources: {
    gradient: 'radial-gradient(ellipse at 50% 30%, rgba(10,50,70,0.05) 0%, transparent 50%)',
    glow: 'rgba(157,217,208,0.03)',
    accent: 'rgba(20,60,80,0.04)',
  },
  meditation: {
    gradient: 'radial-gradient(ellipse at 50% 30%, rgba(70,50,140,0.05) 0%, transparent 50%)',
    glow: 'rgba(184,180,217,0.03)',
    accent: 'rgba(100,80,180,0.03)',
  },
  profile: {
    gradient: 'radial-gradient(ellipse at 40% 30%, rgba(10,40,50,0.04) 0%, transparent 50%)',
    glow: 'rgba(198,230,211,0.03)',
    accent: 'rgba(155,191,169,0.03)',
  },
  ai: {
    gradient: 'radial-gradient(ellipse at 50% 40%, rgba(70,50,140,0.05) 0%, transparent 50%)',
    glow: 'rgba(155,145,201,0.03)',
    accent: 'rgba(120,90,180,0.03)',
  },
  default: {
    gradient: 'radial-gradient(ellipse at 50% 50%, rgba(15,35,60,0.03) 0%, transparent 50%)',
    glow: 'rgba(155,191,169,0.02)',
    accent: 'rgba(20,40,70,0.02)',
  },
};

export function ImmersiveBackground({ children, theme = 'default', className = '' }: ImmersiveBackgroundProps) {
  const config = themeOverlays[theme] || themeOverlays.default;

  return (
    <div className={`relative min-h-screen ${className}`} style={{ zIndex: 2 }}>
      {/* Subtle page-specific color overlay — very transparent so the global video shows through */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: config.gradient }} />

      {/* Slow-moving accent glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-30"
        animate={{
          background: [
            `radial-gradient(circle at 30% 40%, ${config.glow} 0%, transparent 50%)`,
            `radial-gradient(circle at 60% 60%, ${config.accent} 0%, transparent 50%)`,
            `radial-gradient(circle at 30% 40%, ${config.glow} 0%, transparent 50%)`,
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Content — sits above the overlays */}
      <div className="relative" style={{ zIndex: 3 }}>
        {children}
      </div>
    </div>
  );
}