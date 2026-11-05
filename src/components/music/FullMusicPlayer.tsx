import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, Share2, ExternalLink, Heart } from 'lucide-react';
import { useMusic } from '../../context/MusicContext';
import type { UnifiedTrack } from '../../services/music/types';

interface FullMusicPlayerProps {
  open: boolean;
  onClose: () => void;
}

export function FullMusicPlayer({ open, onClose }: FullMusicPlayerProps) {
  const music = useMusic();
  const [mini, setMini] = useState(false);

  if (!open) return null;

  const track = music.currentTrack;
  if (!track) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(3,6,12,0.78)', backdropFilter: 'blur(14px)' }}
        >
          {/* Backdrop click to minimise */}
          <div
            className="absolute inset-0"
            onClick={() => setMini(true)}
          />

          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-3xl"
          >
            {/* Panel */}
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(12,17,26,0.96)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <h2 className="text-white font-medium text-lg tracking-tight">Now Playing</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-white/40 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Embed player */}
              <div className="p-5">
                <MusicNowPlaying
                  track={track}
                  playing={music.isPlaying || false}
                  compact={false}
                  onExpand={() => {}}
                  onCollapse={() => setMini(true)}
                  onClose={onClose}
                />
              </div>

              {/* Queue */}
              {music.queue.length > 0 && (
                <div className="border-t border-white/5">
                  <div className="px-5 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white/70 text-sm font-medium">Up Next</h3>
                      <span className="text-white/30 text-[11px]">{music.queue.length} tracks</span>
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {music.queue.map((t, i) => (
                        <div
                          key={`${t.id}-${i}`}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors"
                          style={{
                            background: i === music.queueIndex ? 'rgba(52,211,153,0.12)' : 'transparent',
                            color: i === music.queueIndex ? '#34D399' : 'rgba(255,255,255,0.7)',
                          }}
                        >
                          {t.albumArt ? (
                            <img
                              src={t.albumArt}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-white/10"
                              loading="lazy"
                            />
                          ) : (
                            <span className="text-lg shrink-0">🎵</span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{t.title}</p>
                            <p className="truncate text-[11px] opacity-70">{t.artist}</p>
                          </div>
                          {i === music.queueIndex && (
                            <span className="text-[10px] uppercase tracking-wide shrink-0">Playing</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Footer actions */}
              <div className="px-5 py-4 flex items-center justify-between border-t border-white/5">
                <button
                  onClick={() => music.toggleShuffle()}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    music.shuffle ? 'text-emerald-400' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  Shuffle
                </button>
                <button
                  onClick={() => music.cycleRepeat()}
                  className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                    music.repeatMode !== 'off' ? 'text-emerald-400' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  Repeat
                </button>
                <a
                  href={track.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 hover:text-white underline underline-offset-2"
                >
                  Open in {track.providerLabel}
                </a>
              </div>
            </div>

            {/* Mini fallback shown when minimised */}
            {mini && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-between text-xs text-white/40"
              >
                <span>Minimised — tap the player bar to reopen.</span>
                <button
                  onClick={() => setMini(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  Reopen full player
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MusicNowPlaying({
  track,
  playing,
  compact,
  onExpand,
  onCollapse,
  onClose,
}: {
  track: UnifiedTrack;
  playing: boolean;
  compact?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          {track.albumArt ? (
            <img
              src={track.albumArt}
              alt=""
              className="w-12 h-12 rounded-full object-cover bg-white/10 flex-shrink-0"
              loading="lazy"
            />
          ) : (
            <span className="text-2xl flex-shrink-0">🎵</span>
          )}
          <div className="min-w-0">
            <p className="text-white font-medium text-sm md:text-base truncate">{track.title}</p>
            <p className="text-white/40 text-xs truncate">
              {track.artist}
              {track.album && ` — ${track.album}`}
              <span className="ml-2 text-white/20 text-[10px]">{track.providerLabel}</span>
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
        </div>
      </div>

      {/* Embed surface or native artwork + external link */}
      <div
        className={`rounded-2xl overflow-hidden ${compact ? 'aspect-video' : 'aspect-video max-h-[55vh]'}`}
        style={{
          background: 'rgba(8,12,20,0.92)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
        }}
      >
        {track.playbackKind === 'embed' && track.providerUri && (
          <iframe
            src={`https://open.spotify.com/embed/${track.providerUri.startsWith('spotify:') ? track.providerUri.split(':')[1] : 'track'}/${track.providerUri.split(':')[2] || ''}?utm_source=mirthic&theme=0`}
            title={`Now playing: ${track.title}`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ opacity: playing ? 1 : 0.6, transition: 'opacity 0.4s ease' }}
          />
        )}
        {track.playbackKind === 'external' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }}
            >
              <ExternalLink className="w-4 h-4" />
              Open in {track.providerLabel}
            </a>
          </div>
        )}
      </div>

      {/* Playback note */}
      <p className="mt-3 text-white/30 text-[11px] text-center">
        Playback runs in {track.providerLabel}’s embedded player. Some browsers may require interaction before audio starts.
      </p>
    </div>
  );
}
