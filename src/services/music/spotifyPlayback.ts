// ═══════════════════════════════════════════════════════════
// SPOTIFY WEB PLAYBACK SDK
// ═══════════════════════════════════════════════════════════

export interface PlaybackState {
  track: TrackInfo | null;
  isPlaying: boolean;
  isPaused: boolean;
  position: number;
  duration: number;
  loading: boolean;
}

export interface TrackInfo {
  id: string;
  name: string;
  artist: string;
  albumName: string;
  uri: string;
  albumArt?: string;
}

export interface PlayerEvent {
  type: 'ready' | 'player_state_changed' | 'initialization_error' | 'playback_error';
  payload: unknown;
}

export interface PlayerStatePayload {
  playUri?: string;
  playToken?: string;
  paused?: boolean;
  timestamp?: number;
  duration?: number;
  track?: TrackInfo;
}

export interface SpotifyPlayer {
  connect(userId: string, token: string, opts?: { name?: string; volume?: number }): void;
  disconnect(): void;
  play(uri: string): Promise<boolean>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;
  seek(positionMs: number): Promise<void>;
  setVolume(volume: number): void;
  getState(): PlaybackState;
  onPlayStateChange(listener: (state: PlaybackState) => void): void;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: ((cb?: any) => void);
    Spotify?: any;
    spotifySDK?: any;
  }
}

const SDK_URL = 'https://sdk.scdn.co/spotify-player.js';

export function createSpotifyPlayer(): SpotifyPlayer {
  let sdkPlayer: any = null;
  const listeners: Array<(state: PlaybackState) => void> = [];
  let _token: string | null = null;

  const state: PlaybackState = {
    track: null,
    isPlaying: false,
    isPaused: false,
    position: 0,
    duration: 0,
    loading: false,
  };

  function sync() {
    listeners.forEach((l) => l({ ...state }));
  }

  function initSDK(accessToken: string, opts: { name?: string; volume?: number }) {
    const SDK = window.spotifySDK || (window.Spotify && window.Spotify.Player);
    if (!SDK || typeof SDK !== 'function') {
      console.warn('[SpotifySDK] SDK constructor unavailable.');
      return;
    }
    try {
      sdkPlayer = new SDK({
        name: opts.name ?? 'Mirthic Player',
        getOAuthToken: (callback: (token: string) => void) => callback(accessToken),
        volume: opts.volume ?? 0.5,
      });

      sdkPlayer.on('ready', () => {
        state.loading = false;
        sync();
      });
      sdkPlayer.on('player_state_changed', (p: any) => {
        const ps = p as {
          paused?: boolean;
          timestamp?: number;
          duration?: number;
          track?: { uri?: string; name?: string; artist?: string; album?: { name?: string }; albumArt?: string };
        };
        state.isPlaying = ps?.paused === false;
        state.isPaused = !!ps?.paused;
        state.position = ps?.timestamp ?? 0;
        state.duration = ps?.duration ?? 0;
        if (ps?.track) {
          state.track = {
            id: (ps.track.uri ?? '').replace(/^spotify:track:/, '') || 'unknown',
            name: ps.track.name ?? 'Unknown',
            artist: ps.track.artist ?? 'Unknown',
            albumName: ps.track.album?.name ?? '',
            uri: ps.track.uri ?? '',
            albumArt: ps.track.albumArt,
          };
        }
        sync();
      });
      sdkPlayer.on('initialization_error', () => {
        state.loading = false;
        sync();
      });
      sdkPlayer.on('playback_error', () => {
        state.loading = false;
        sync();
      });
    } catch (e) {
      console.warn('[SpotifySDK] Could not init:', e);
      sdkPlayer = null;
    }
  }

  async function playPlayUri(uri: string): Promise<void> {
    if (!sdkPlayer) {
      state.loading = true;
      state.track = null;
      state.isPlaying = false;
      state.isPaused = false;
      state.position = 0;
      state.duration = 0;
      sync();
      return;
    }
    state.loading = true;
    sync();
    try {
      const ok = await sdkPlayer.play(uri);
      if (!ok) {
        state.loading = false;
        sync();
      }
    } catch {
      state.loading = false;
      sync();
    }
  }

  return {
    connect(_user: string, accessToken: string, opts: { name?: string; volume?: number } = {}): void {
      _token = accessToken;
      if (window.onSpotifyWebPlaybackSDKReady) {
        initSDK(accessToken, opts);
        return;
      }
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.onload = () => {
        if (window.onSpotifyWebPlaybackSDKReady) {
          window.onSpotifyWebPlaybackSDKReady();
          initSDK(accessToken, opts);
        }
      };
      document.head.appendChild(script);
    },

    disconnect(): void {
      if (sdkPlayer) {
        try { sdkPlayer.disconnect(); } catch { /* ignore */ }
        sdkPlayer = null;
      }
      _token = null;
      state.track = null;
      state.isPlaying = false;
      state.isPaused = false;
      state.position = 0;
      state.duration = 0;
      state.loading = false;
      sync();
    },

    async play(uri: string): Promise<boolean> {
      if (!sdkPlayer) {
        if (uri.startsWith('spotify:')) {
          await playPlayUri(uri);
        }
        return false;
      }
      try {
        const success = sdkPlayer.play(uri);
        return success ?? false;
      } catch {
        return false;
      }
    },

    async pause(): Promise<void> {
      if (!sdkPlayer) return;
      try { await sdkPlayer.pause(); } catch { /* ignore */ }
    },

    async resume(): Promise<void> {
      if (!sdkPlayer) return;
      try { await sdkPlayer.resume(); } catch { /* ignore */ }
    },

    async next(): Promise<void> {
      if (!sdkPlayer) return;
      try { await sdkPlayer.skipNext(); } catch { /* ignore */ }
    },

    async previous(): Promise<void> {
      if (!sdkPlayer) return;
      try { await sdkPlayer.skipPrevious(); } catch { /* ignore */ }
    },

    async seek(pos: number): Promise<void> {
      if (!sdkPlayer) return;
      try { await sdkPlayer.seek(pos); } catch { /* ignore */ }
    },

    setVolume(v: number): void {
      if (sdkPlayer) {
        try { sdkPlayer.setVolume(v); } catch { /* ignore */ }
      }
    },

    getState(): PlaybackState {
      return { ...state };
    },

    onPlayStateChange(listener: (state: PlaybackState) => void): void {
      listeners.push(listener);
    },
  };
}

