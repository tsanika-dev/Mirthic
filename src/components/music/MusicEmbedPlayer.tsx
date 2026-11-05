import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import type { UnifiedTrack } from '../../services/music/types';

interface MusicEmbedPlayerProps {
  track?: UnifiedTrack | null;
  src?: string;
  playing?: boolean;
  onClose?: () => void;
  onExpand?: () => void;
  onCollapse?: () => void;
  compact?: boolean;
}

export function MusicEmbedPlayer({
  track,
  src,
  playing,
  onClose,
  onExpand,
  onCollapse,
  compact = false,
}: MusicEmbedPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setReady(false);
    setError(false);
  }, [src]);

  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame || !src) return;

    const onLoad = () => setReady(true);
    const onError = () => setError(true);

    frame.addEventListener('load', onLoad);
    frame.addEventListener('error', onError);
    return () => {
      frame.removeEventListener('load', onLoad);
      frame.removeEventListener('error', onError);
    };
  }, [src]);

  if (!track && !src) return null;

  const displayTitle = track?.title || 'Now Playing';
  const displayArtist = track?.artist || '';
  const displayAlbum = track?.album || '';

  // Determine embedded URL: prefer explicit src, else build Spotify embed from providerUri
  const embedUrl = src || (track?.providerUri
    ? `https://open.spotify.com/embed/${track.providerUri.split(':')[1] || 'track'}/${track.providerUri.split(':')[2] || ''}?utm_source=mirthic&theme=0`
    : src || '');

  return (
    <motion.div
      initial={!compact ? { opacity: 0, scale: 0.98 } : false}
      animate={!compact ? { opacity: 1, scale: 1 } : false}
      exit={!compact ? { opacity: 0 } : undefined}
      className={compact ? 'w-full' : 'w-full max-w-4xl mx-auto'}
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {track?.albumArt ? (
            <img
              src={track.albumArt}
              alt=""
              className="w-10 h-10 rounded-full object-cover bg-white/10 flex-shrink-0"
              loading="lazy"
            />
          ) : (
            <span className="text-2xl flex-shrink-0">🎵</span>
          )}
          <div className="min-w-0">
            <p className="text-white font-medium text-sm md:text-base truncate">{displayTitle}</p>
            <p className="text-white/40 text-xs truncate">
              {displayArtist}
              {displayAlbum && ` — ${displayAlbum}`}
              <span className="ml-2 text-white/20 text-[10px]">{track?.providerLabel}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onExpand && (
            <button
              onClick={onExpand}
              className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
              title="Open full player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
              title="Minimise"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          )}
          {track?.providerUri && (
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-white/40 hover:text-white transition-colors"
              title={`Open in ${track.providerLabel}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* Embed surface */}
      <div
        className={`rounded-2xl overflow-hidden ${compact ? 'aspect-video' : 'aspect-video max-h-[55vh]'}`}
        style={{
          background: 'rgba(8,12,20,0.92)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
      >
        {!ready && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-white/40 text-xs">Loading player…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-red-300/90 text-sm mb-1">Player could not load.</p>
              <p className="text-white/40 text-xs">Playback is provided by {track?.providerLabel || 'the provider'}.</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={embedUrl}
          title={`Now playing: ${displayTitle}`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            opacity: ready || error ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>

      {/* Playback note */}
      <p className="mt-3 text-white/30 text-[11px] text-center">
        Playback runs in {track?.providerLabel || 'the provider'}s embedded player. Some browsers may require an interaction before audio starts.
      </p>
    </motion.div>
  );
}
