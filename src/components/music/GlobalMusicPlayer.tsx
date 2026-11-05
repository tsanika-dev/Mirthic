import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, ChevronUp, ChevronDown, Heart, Plus, ExternalLink,
} from 'lucide-react';
import { useMusic } from '../../context/MusicContext';

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export function GlobalMusicPlayer() {
  const music = useMusic();
  const [showQueue, setShowQueue] = useState(false);
  const [embedMounted, setEmbedMounted] = useState(false);
  const embedContainerRef = useRef<HTMLDivElement | null>(null);
  const [embedPlayer, setEmbedPlayer] = useState<ReturnType<typeof import('../../services/music/spotifyEmbed').createSpotifyEmbedController> | null>(null);

  // Skip rendering if nothing is loaded
  if (!music.currentTrack) return null;

  const track = music.currentTrack;
  const progress = music.duration > 0 ? (music.currentTime / music.duration) * 100 : 0;

  // Memoized state for embed lifecycle
  useEffect(() => {
    if (track.source === 'spotify' && track.playbackKind === 'embed' && music.isPlaying) {
      (async () => {
        const { createSpotifyEmbedController } = await import('../../services/music/spotifyEmbed');
        const player = createSpotifyEmbedController();
        setEmbedPlayer(player);
        if (embedContainerRef.current) {
          player.mount(embedContainerRef.current, {
            uri: track.providerUri || `spotify:track:${track.id.replace('spotify:track:', '')}`,
            type: 'track' as const,
          });
          setEmbedMounted(true);
        }
      })();
    } else {
      setEmbedMounted(false);
    }
  }, [track.id, track.source, track.playbackKind, music.isPlaying]);

  return (
    <>
      {/* Mini bar — always visible when a track is loaded */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto"
        style={{ background: 'rgba(18,22,30,0.85)', backdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Queue panel */}
        <AnimatePresence>
          {showQueue && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
              style={{ background: 'rgba(18,22,30,0.96)', backdropFilter: 'blur(24px)' }}
            >
              <div className="max-w-md mx-auto p-4 space-y-2 max-h-sm overflow-y-auto">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/70 text-xs font-medium">Up next</span>
                  <button
                    onClick={() => setShowQueue(false)}
                    className="text-white/40 hover:text-white/70 transition-colors"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                {music.queue.map((t, i) => (
                  <div
                    key={`${t.id}-${i}`}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      i === music.queueIndex ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <span className="text-white/30 text-xs w-5">{i + 1}</span>
                    {t.albumArt ? (
                      <img
                        src={t.albumArt}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover bg-white/10"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-lg">{t.albumArt ? '' : '🎵'}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-xs truncate">{t.title}</p>
                      <p className="text-white/40 text-[10px] truncate">{t.artist}</p>
                    </div>
                    {i === music.queueIndex && (
                      <span className="text-[10px] text-emerald-400">Playing</span>
                    )}
                    <button
                      onClick={() => music.removeFromQueue(i)}
                      className="text-white/20 hover:text-red-400/60 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar (clickable) for local playback */}
        {track.source === 'mirthic' && music.duration > 0 && (
          <div
            className="w-full h-1 bg-white/10 cursor-pointer group relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              music.seek(pct * (music.duration / 1000));
            }}
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <div
              className="h-full bg-emerald-400/70 transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-0 h-full w-1 bg-white/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
            />
          </div>
        )}

        {/* Player bar */}
        <div className="flex items-center gap-4 px-4 py-3"
          style={{ background: 'rgba(18,22,30,0.92)', backdropFilter: 'blur(24px)' }}
        >
          {/* Track info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {track.albumArt ? (
              <img
                src={track.albumArt}
                alt=""
                className="w-10 h-10 rounded-full object-cover bg-white/10 flex-shrink-0"
                loading="lazy"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              />
            ) : (
              <span className="text-2xl flex-shrink-0">🎵</span>
            )}
            <div className="min-w-0">
              <p className="text-white/90 text-sm font-medium truncate">{track.title}</p>
              <p className="text-white/40 text-[11px] truncate">{track.artist}</p>
              <p className="text-white/30 text-[10px] truncate">{track.providerLabel}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={music.previous}
              className="text-white/40 hover:text-white transition-colors p-1"
              disabled={music.queue.length <= 1}
              aria-label="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={music.togglePlayPause}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}
              aria-label={music.isPlaying ? 'Pause' : 'Play'}
            >
              {music.loading ? (
                <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : music.isPlaying ? (
                <Pause className="w-4 h-4 text-emerald-400" />
              ) : (
                <Play className="w-4 h-4 text-emerald-400 ml-0.5" />
              )}
            </button>

            <button
              onClick={music.next}
              className="text-white/40 hover:text-white transition-colors p-1"
              disabled={music.queue.length <= 1}
              aria-label="Next"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={music.toggleShuffle}
              className={`p-1 transition-colors ${
                music.shuffle ? 'text-emerald-400' : 'text-white/30 hover:text-white/60'
              }`}
              aria-label="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={music.cycleRepeat}
              className={`p-1 transition-colors ${
                music.repeatMode !== 'off' ? 'text-emerald-400' : 'text-white/30 hover:text-white/60'
              }`}
              aria-label="Repeat"
            >
              {music.repeatMode === 'one' ? (
                <Repeat className="w-3.5 h-3.5" />
              ) : (
                <Repeat className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={music.toggleMute}
              className="text-white/40 hover:text-white/70 transition-colors p-1"
              aria-label="Mute"
            >
              {music.isMuted || music.volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`p-1 transition-colors ${
                showQueue ? 'text-emerald-400' : 'text-white/30 hover:text-white/60'
              }`}
              aria-label="Queue"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={music.toggleFavorite}
              className={`p-1 transition-colors ${
                music.isTrackFavorite(track.id) ? 'text-rose-400' : 'text-white/30 hover:text-white/60'
              }`}
              aria-label="Favorite"
            >
              <Heart className="w-3.5 h-3.5" fill={music.isTrackFavorite(track.id) ? 'currentColor' : 'none'} />
            </button>

            <a
              href={track.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white/60 transition-colors p-1"
              aria-label="Open in Spotify"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {track.durationSec && music.duration > 0 && (
              <span className="text-white/30 text-[11px] ml-1 hidden sm:inline">
                {formatTime(music.currentTime / 1000)} / {formatTime(music.duration)}
              </span>
            )}

          </div>
        </div>

        {/* Error banner */}
        {music.error && (
          <div
            className="px-4 py-2 text-xs text-center"
            style={{ background: 'rgba(239,68,68,0.15)', borderTop: '1px solid rgba(239,68,68,0.2)' }}
          >
            <span className="text-red-300/80">{music.error}</span>
            {track.externalUrl && (
              <button
                onClick={() => window.open(track.externalUrl, '_blank')}
                className="ml-3 text-emerald-400/80 hover:text-emerald-400 underline"
              >
                Open in {track.providerLabel}
              </button>
            )}
            <button
              onClick={music.next}
              className="ml-3 text-white/40 hover:text-white/70"
            >
              Skip →
            </button>
          </div>
        )}

        {/* Spotify embed surface (when playing a Spotify track) */}
        {track.source === 'spotify' && track.playbackKind === 'embed' && (
          <div
            ref={embedContainerRef}
            className="h-0 w-full"
            style={{ minHeight: 0 }}
          />
        )}
      </div>
    </>
  );
}
