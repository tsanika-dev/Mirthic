// ═══════════════════════════════════════════════════════════
// UNIFIED MUSIC CONTEXT
// Single global player + provider router for Mirthic.
// - One HTMLAudio element for local/licensed audio.
// - Spotify playback via official embed or Web Playback SDK.
// - Favorites/history/skipped stored locally (metadata only).
// ═══════════════════════════════════════════════════════════

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { UnifiedTrack, MusicProvider, RepeatMode } from '../services/music/types';
import { isFavorite, toggleFavorite, recordPlayed, getPlayed, getSkipped, recordSkipped } from '../services/music/library';

// ─── PLAYER STATE ─────────────────────────────────────

export interface PlayerState {
  // current track + queue
  currentTrack: UnifiedTrack | null;
  queue: UnifiedTrack[];
  queueIndex: number;

  // playback
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  shuffle: boolean;

  // UI
  loading: boolean;
  error: string | null;
  sourceLabel: string | null; // "Mirthic Originals" | "Spotify"

  // collapsed/expanded (mini vs full)
  expanded: boolean;
}

export interface MusicContextValue extends PlayerState {
  playTrack: (track: UnifiedTrack, queue?: UnifiedTrack[]) => void;
  playProviderTrack: (track: UnifiedTrack, provider?: MusicProvider, queue?: UnifiedTrack[]) => void;
  addToQueue: (tracks: UnifiedTrack[]) => void;
  appendToQueue: (tracks: UnifiedTrack[]) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setQueue: (tracks: UnifiedTrack[], startIndex?: number) => void;

  pause: () => void;
  resume: () => void;
  togglePlayPause: () => void;
  next: () => void;
  previous: () => void;
  seek: (timeSec: number) => void;
  seekRelative: (deltaSec: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;

  toggleFavorite: () => void;
  markSkipped: () => void;
  markPlayed: (trackId: string, from?: string) => void;
  isTrackFavorite: (id: string) => boolean;
  getPlayedHistory: () => ReturnType<typeof getPlayed>;
  getSkippedHistory: () => ReturnType<typeof getSkipped>;

  setExpanded: (expanded: boolean) => void;
}

// ─── CONTEXT ──────────────────────────────────────────

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic(): MusicContextValue {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within a MusicProvider');
  return ctx;
}

// ─── PROVIDER ─────────────────────────────────────────

export function MusicProvider({ children }: { children: ReactNode }) {
  // ── Playback state ──
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    queue: [],
    queueIndex: -1,
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    volume: parseFloat(localStorage.getItem('mc_music_volume') || '0.7') || 0.7,
    isMuted: false,
    repeatMode: 'off',
    shuffle: false,
    loading: false,
    error: null,
    sourceLabel: null,
    expanded: false,
  });

  // ── Single persistent audio element (local playback only) ──
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  // seed the audio element ONCE
  useEffect(() => {
    if (localAudioRef.current) return;
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = parseFloat(localStorage.getItem('mc_music_volume') || '0.7') || 0.7;
    localAudioRef.current = audio;

    const onTimeUpdate = () => {
      setState(s => ({ ...s, currentTime: audio.currentTime }));
    };
    const onDurationChange = () => {
      setState(s => ({ ...s, duration: audio.duration || 0 }));
    };
    const onLoadedMetadata = () => {
      setState(s => ({ ...s, loading: false, error: null }));
    };
    const onError = () => {
      setState(s => ({ ...s, loading: false, error: 'Could not play this local track.' }));
    };
    const onEnded = () => {
      setState(s => ({ ...s, isPlaying: false, isPaused: false, currentTime: 0 }));
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('error', onError);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // persist volume
  useEffect(() => {
    try {
      localStorage.setItem('mc_music_volume', String(state.volume));
    } catch { /* ignore */ }
    if (localAudioRef.current) {
      localAudioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);


  // ── Helpers ──

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const playLocalTrack = useCallback((track: UnifiedTrack) => {
    const audio = localAudioRef.current;
    if (!audio) return;

    if (track.playbackKind === 'unavailable') {
      setState(s => ({ ...s, error: 'This track is unavailable.', loading: false }));
      return;
    }

    if (track.playbackKind === 'embed' || track.playbackKind === 'external') {
      setState(s => ({
        ...s,
        currentTime: 0,
        duration: track.durationSec ? track.durationSec * 1000 : 0,
        loading: false,
        error: null,
        isPlaying: true,
        isPaused: false,
        sourceLabel: track.providerLabel,
      }));
      return;
    }

    // native local playback
    const url = track.playableUrl || track.previewUrl || track.externalUrl;
    if (!url) {
      setState(s => ({ ...s, error: 'No audio source available for this track.' }));
      return;
    }

    audio.src = url;
    audio.play().catch(() => {
      setState(s => ({ ...s, error: 'Playback failed. Try again.', loading: false }));
    });

    setState(s => ({
      ...s,
      currentTrack: track,
      isPlaying: true,
      isPaused: false,
      loading: true,
      error: null,
      sourceLabel: track.providerLabel,
      currentTime: 0,
      duration: track.durationSec ? track.durationSec * 1000 : 0,
    }));
  }, []);

  const resumeLocalAudio = useCallback((track: UnifiedTrack) => {
    const audio = localAudioRef.current;
    if (!audio) return;

    if (track.playbackKind === 'native') {
      audio.play().catch(() => {
        setState(s => ({ ...s, error: 'Playback failed. Try again.' }));
      });
    } else {
      setState(s => ({ ...s, isPlaying: true, isPaused: false }));
    }
  }, []);

  const pauseLocalAudio = useCallback(() => {
    const audio = localAudioRef.current;
    if (audio) audio.pause();
  }, []);

  const seekLocalAudio = useCallback((timeSec: number) => {
    const audio = localAudioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(audio.duration || 0, timeSec));
    }
  }, []);

  // ── Playback controls ──

  const playTrack = useCallback((track: UnifiedTrack, queue?: UnifiedTrack[]) => {
    if (queue && queue.length > 0) {
      const idx = queue.findIndex(t => t.id === track.id);
      setState(s => ({ ...s, queueIndex: idx >= 0 ? idx : 0 }));
    }

    if (track.source === 'spotify') {
      setState(s => ({
        ...s,
        currentTrack: track,
        isPlaying: true,
        isPaused: false,
        loading: true,
        error: null,
        sourceLabel: track.providerLabel,
        currentTime: 0,
        duration: track.durationSec ? track.durationSec * 1000 : 0,
      }));
      recordPlayed({ trackId: track.id, playedAt: Date.now(), from: 'spotify' });
      return;
    }

    playLocalTrack(track);
    recordPlayed({ trackId: track.id, playedAt: Date.now(), from: 'mirthic' });
  }, [playLocalTrack]);

  const playProviderTrack = useCallback((track: UnifiedTrack, _provider?: MusicProvider, queue?: UnifiedTrack[]) => {
    if (queue && queue.length > 0) {
      const idx = queue.findIndex(t => t.id === track.id);
      setState(s => ({ ...s, queueIndex: idx >= 0 ? idx : 0 }));
    }

    setState(s => ({
      ...s,
      currentTrack: track,
      isPlaying: true,
      isPaused: false,
      loading: true,
      error: null,
      sourceLabel: track.providerLabel,
      currentTime: 0,
      duration: track.durationSec ? track.durationSec * 1000 : 0,
    }));

    if (track.source === 'spotify') {
      recordPlayed({ trackId: track.id, playedAt: Date.now(), from: 'spotify' });
      return;
    }

    playLocalTrack(track);
    recordPlayed({ trackId: track.id, playedAt: Date.now(), from: 'mirthic' });
  }, [playLocalTrack]);

  const pause = useCallback(() => {
    pauseLocalAudio();
    setState(s => ({ ...s, isPlaying: false, isPaused: true, loading: false }));
  }, [pauseLocalAudio]);

  const resume = useCallback(() => {
    const track = state.currentTrack;
    if (!track) return;
    if (track.source === 'spotify') {
      setState(s => ({ ...s, isPlaying: true, isPaused: false }));
      return;
    }
    resumeLocalAudio(track);
    setState(s => ({ ...s, isPlaying: true, isPaused: false, loading: false }));
  }, [state.currentTrack, resumeLocalAudio]);

  const togglePlayPause = useCallback(() => {
    const track = state.currentTrack;
    if (!track) return;

    if (state.isPlaying && !state.isPaused) {
      pause();
      return;
    }

    if (track.source === 'spotify') {
      resume();
      return;
    }

    resumeLocalAudio(track);
    setState(s => ({ ...s, isPlaying: true, isPaused: false, loading: false }));
  }, [state.isPlaying, state.isPaused, state.currentTrack, pause, resume, resumeLocalAudio]);

  const next = useCallback(() => {
    const queue = state.queue;
    const index = state.queueIndex;
    if (queue.length === 0) return;

    let nextIndex: number;
    if (state.shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (index < queue.length - 1) {
      nextIndex = index + 1;
    } else if (state.repeatMode === 'all') {
      nextIndex = 0;
    } else {
      setState(s => ({ ...s, isPlaying: false, isPaused: false, currentTime: 0 }));
      return;
    }

    const nextTrack = queue[nextIndex % queue.length];
    if (nextTrack) {
      playProviderTrack(nextTrack, undefined, queue);
    }
  }, [state.queue, state.queueIndex, state.shuffle, state.repeatMode, playProviderTrack]);

  const previous = useCallback(() => {
    const queue = state.queue;
    if (queue.length === 0) return;

    const current = state.currentTrack;
    const index = state.queueIndex;

    // If more than 3s into track, restart current
    if (current && state.currentTime > 3) {
      seekLocalAudio(0);
      setState(s => ({ ...s, currentTime: 0, isPlaying: true, isPaused: false }));
      return;
    }

    let prevIndex: number;
    if (state.shuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else if (index > 0) {
      prevIndex = index - 1;
    } else if (state.repeatMode === 'all') {
      prevIndex = queue.length - 1;
    } else {
      prevIndex = queue.length - 1;
    }

    const prevTrack = queue[prevIndex % queue.length];
    if (prevTrack) {
      playProviderTrack(prevTrack, undefined, queue);
    }
  }, [state.queue, state.queueIndex, state.shuffle, state.repeatMode, state.currentTime, seekLocalAudio, playProviderTrack]);

  const seek = useCallback((timeSec: number) => {
    if (state.currentTrack?.source === 'mirthic') {
      seekLocalAudio(timeSec);
      setState(s => ({ ...s, currentTime: timeSec }));
    } else {
      setState(s => ({ ...s, currentTime: timeSec }));
    }
  }, [state.currentTrack, seekLocalAudio]);

  const seekRelative = useCallback((deltaSec: number) => {
    const current = state.currentTime / 1000;
    seek(current + deltaSec);
  }, [state.currentTime, seek]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setState(s => ({ ...s, volume: clamped, isMuted: clamped === 0 }));
    if (localAudioRef.current) {
      localAudioRef.current.volume = state.isMuted ? 0 : clamped;
    }
  }, [state.isMuted]);

  const toggleMute = useCallback(() => {
    setState(s => ({ ...s, isMuted: !s.isMuted }));
    if (localAudioRef.current) {
      localAudioRef.current.volume = state.isMuted ? state.volume : 0;
    }
  }, [state.volume, state.isMuted]);

  const toggleShuffle = useCallback(() => {
    setState(s => ({ ...s, shuffle: !s.shuffle }));
  }, []);

  const cycleRepeat = useCallback(() => {
    const modes: RepeatMode[] = ['off', 'all', 'one'];
    const nextIdx = (modes.indexOf(state.repeatMode) + 1) % modes.length;
    setState(s => ({ ...s, repeatMode: modes[nextIdx] }));
  }, [state.repeatMode]);

  // ── Queue ──

  const addToQueue = useCallback((tracks: UnifiedTrack[]) => {
    setState(s => ({ ...s, queue: [...s.queue, ...tracks] }));
  }, []);

  const appendToQueue = useCallback((tracks: UnifiedTrack[]) => {
    setState(s => ({ ...s, queue: [...s.queue, ...tracks] }));
  }, []);

  const setQueue = useCallback((tracks: UnifiedTrack[], startIndex = 0) => {
    if (tracks.length === 0) return;
    setState(s => ({
      ...s,
      queue: tracks,
      queueIndex: startIndex,
      currentTrack: tracks[startIndex],
      isPlaying: true,
      isPaused: false,
      loading: true,
      error: null,
      sourceLabel: tracks[startIndex]?.providerLabel || null,
    }));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setState(s => {
      const newQueue = s.queue.filter((_, i) => i !== index);
      let newIndex = s.queueIndex;
      if (index < s.queueIndex) newIndex--;
      if (index === s.queueIndex && newQueue.length > 0) {
        newIndex = Math.min(newIndex, newQueue.length - 1);
      }
      return {
        ...s,
        queue: newQueue,
        queueIndex: newIndex,
        currentTrack: newQueue[newIndex] || null,
        isPlaying: newQueue.length > 0,
        isPaused: false,
        loading: false,
        error: null,
      };
    });
  }, []);

  const clearQueue = useCallback(() => {
    pauseLocalAudio();
    setState(s => ({
      ...s,
      queue: [],
      queueIndex: -1,
      currentTrack: null,
      isPlaying: false,
      isPaused: false,
      currentTime: 0,
      duration: 0,
      loading: false,
      error: null,
    }));
  }, [pauseLocalAudio]);

  // ── Favorites ──

  const toggleFavoriteLocal = useCallback(() => {
    const track = state.currentTrack;
    if (!track) return;
    toggleFavorite(track);
  }, [state.currentTrack]);

  const markSkippedLocal = useCallback(() => {
    const track = state.currentTrack;
    if (!track) return;
    recordSkipped({ trackId: track.id, skippedAt: Date.now() });
  }, [state.currentTrack]);

  const markPlayedCallback = useCallback((trackId: string, from?: string) => {
    recordPlayed({ trackId, playedAt: Date.now(), from: from || 'unknown' });
  }, []);

  const isTrackFavorite = useCallback((id: string) => isFavorite(id), []);

  const getPlayedHistory = useCallback(() => getPlayed(), []);
  const getSkippedHistory = useCallback(() => getSkipped(), []);

  // ── Expanded ──

  const setExpanded = useCallback((expanded: boolean) => {
    setState(s => ({ ...s, expanded }));
  }, []);

  // ── Value ──

  const value: MusicContextValue = {
    ...state,
    playTrack,
    playProviderTrack,
    addToQueue,
    appendToQueue,
    removeFromQueue,
    clearQueue,
    setQueue,
    pause,
    resume,
    togglePlayPause,
    next,
    previous,
    seek,
    seekRelative,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleFavorite: toggleFavoriteLocal,
    markSkipped: markSkippedLocal,
    markPlayed: markPlayedCallback,
    isTrackFavorite,
    getPlayedHistory: getPlayedHistory,
    getSkippedHistory: getSkippedHistory,
    setExpanded,
  };

  // ── Render ──

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}
