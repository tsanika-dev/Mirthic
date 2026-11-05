// ═══════════════════════════════════════════════════════════
// MIRTHIC ORIGINAL / LICENSED CATALOG
//
// Tracks the LocalLicensedProvider can actually play.
// They use real audio URLs (public assets, licensed copies, or
// Mirthic-produced content). Commercial Spotify songs are NOT stored
// here — those come from the official Spotify catalog only.
// ═══════════════════════════════════════════════════════════

import type { UnifiedTrack } from './types';

export interface CatalogTrack extends UnifiedTrack {
  providerId?: string;
  releaseAt: number;
  trending?: boolean;
  classic?: boolean;
  category?: 'remix' | 'devotional' | 'pop' | 'instrumental' | 'ambient';
}

// ─── ONLINE ASSET (reachable public audio) ───────────

export const ONLINE_AUDIO_URL =
  'https://d13oz58mz3082t.cloudfront.net/assets/songs/online.mp3';

// ─── CATALOG ─────────────────────────────────────────

export const musicCatalog: CatalogTrack[] = [
  {
    id: 'mirthic:breathing-space',
    source: 'mirthic',
    playbackKind: 'native',
    title: 'Breathing Space',
    artist: 'Mirthic Originals',
    album: 'Mirthic Calm Sessions',
    albumArt: 'https://d13oz58mz3082t.cloudfront.net/assets/songs/breathing-space.webp',
    language: 'English',
    moodTags: ['calm', 'focus', 'ambient'],
    externalUrl: 'https://mirthic.app/music/breathing-space',
    playableUrl: ONLINE_AUDIO_URL,
    providerUri: 'mirthic:breathing-space',
    durationSec: 180,
    explicit: false,
    providerLabel: 'Mirthic Originals',
    releaseAt: 2024,
    classic: false,
    category: 'ambient',
  },
  {
    id: 'mirthic:morning-light',
    source: 'mirthic',
    playbackKind: 'native',
    title: 'Morning Light',
    artist: 'Mirthic Originals',
    album: 'Mirthic Upbeat Sessions',
    albumArt: 'https://d13oz58mz3082t.cloudfront.net/assets/songs/morning-light.webp',
    language: 'English',
    moodTags: ['energy', 'upbeat', 'focus'],
    externalUrl: 'https://mirthic.app/music/morning-light',
    playableUrl: ONLINE_AUDIO_URL,
    providerUri: 'mirthic:morning-light',
    durationSec: 210,
    explicit: false,
    providerLabel: 'Mirthic Originals',
    releaseAt: 2024,
    trending: true,
    category: 'pop',
  },
  {
    id: 'mirthic:night-drift',
    source: 'mirthic',
    playbackKind: 'native',
    title: 'Night Drift',
    artist: 'Mirthic Originals',
    album: 'Mirthic Sleep Sessions',
    albumArt: 'https://d13oz58mz3082t.cloudfront.net/assets/songs/night-drift.webp',
    language: 'English',
    moodTags: ['sleep', 'calm', 'ambient'],
    externalUrl: 'https://mirthic.app/music/night-drift',
    playableUrl: ONLINE_AUDIO_URL,
    providerUri: 'mirthic:night-drift',
    durationSec: 240,
    explicit: false,
    providerLabel: 'Mirthic Originals',
    releaseAt: 2024,
    category: 'ambient',
  },
  {
    id: 'mirthic:focus-loop',
    source: 'mirthic',
    playbackKind: 'native',
    title: 'Focus Loop',
    artist: 'Mirthic Originals',
    album: 'Mirthic Focus Sessions',
    albumArt: 'https://d13oz58mz3082t.cloudfront.net/assets/songs/focus-loop.webp',
    language: 'English',
    moodTags: ['focus', 'calm', 'instrumental'],
    externalUrl: 'https://mirthic.app/music/focus-loop',
    playableUrl: ONLINE_AUDIO_URL,
    providerUri: 'mirthic:focus-loop',
    durationSec: 180,
    explicit: false,
    providerLabel: 'Mirthic Originals',
    releaseAt: 2024,
    category: 'instrumental',
  },
];

// ─── PLAYLIST HELPERS ─────────────────────────────────

export interface PlaylistInfo {
  id: string;
  title: string;
  description: string;
  url: string;
  tracks: number;
  tracksMeta?: Array<{
    title?: string;
    artist?: string;
    album?: string;
    albumArt?: string;
    moodTags?: string[];
    spotifyTrackId?: string;
  }>;
}

export function playlistToTrack(playlist: PlaylistInfo): PlaylistTrack[] {
  const tracks: PlaylistTrack[] = [];
  for (let i = 0; i < Math.min(playlist.tracks, 12); i++) {
    const meta = playlist.tracksMeta?.[i];
    const id = `spotify:playlist:${playlist.id}:track:${i}`;
    tracks.push({
      id,
      source: 'spotify',
      playbackKind: 'embed',
      title: meta?.title ?? 'Track',
      artist: meta?.artist ?? 'Artist',
      album: meta?.album,
      albumArt: meta?.albumArt,
      language: undefined,
      moodTags: meta?.moodTags ?? [],
      externalUrl: `https://open.spotify.com/track/${meta?.spotifyTrackId ?? ''}`,
      providerUri: `spotify:playlist:${playlist.id}`,
      providerLabel: 'Spotify',
      playlistId: playlist.id,
      playlistTitle: playlist.title,
      spotifyUrl: playlist.url,
    });
  }
  return tracks;
}

export interface PlaylistTrack extends UnifiedTrack {
  playlistId: string;
  playlistTitle: string;
  spotifyUrl: string;
}

function playlistInfoById(id: string): PlaylistInfo | undefined {
  const known: Record<string, PlaylistInfo> = {
    '37i9dQZF1DX1kCIzMYtzum': {
      id,
      title: 'Feel Good Hits',
      description: 'Songs to brighten your day.',
      url: `https://open.spotify.com/playlist/${id}`,
      tracks: 30,
      tracksMeta: [
        { title: 'Sunflower', artist: 'Various Artists', album: 'Pop', albumArt: 'https://i.scdn.co/image/ab67706f00000002' },
        { title: 'Good as Hell', artist: 'Various Artists', album: 'Pop', albumArt: 'https://i.scdn.co/image/ab67706f00000002' },
      ],
    },
    '37i9dQZF1DXdPec7aLTmlC': {
      id,
      title: 'Energy Boost',
      description: 'High-energy tracks for motivation.',
      url: `https://open.spotify.com/playlist/${id}`,
      tracks: 25,
      tracksMeta: [
        { title: 'Run the World', artist: 'Various Artists', album: 'Pop', albumArt: 'https://i.scdn.co/image/ab67706f00000002' },
      ],
    },
    '37i9dQZF1DWZeKCadgRdKQ': {
      id,
      title: 'Lofi Beats',
      description: 'Chill beats for focus.',
      url: `https://open.spotify.com/playlist/${id}`,
      tracks: 40,
      tracksMeta: [
        { title: 'Lofi Study', artist: 'Various Artists', album: 'Lofi', albumArt: 'https://i.scdn.co/image/ab67706f00000002' },
      ],
    },
    '37i9dQZF1DX9tPFwDM0mo0': {
      id,
      title: 'Peaceful Piano',
      description: 'Ambient piano for calm.',
      url: `https://open.spotify.com/playlist/${id}`,
      tracks: 35,
      tracksMeta: [
        { title: 'Peaceful Moments', artist: 'Various Artists', album: 'Piano', albumArt: 'https://i.scdn.co/image/ab67706f00000002' },
      ],
    },
    '37i9dQZF1DWViPt6iQqlRh': {
      id,
      title: 'Sleep Well',
      description: 'Ambient sounds for rest.',
      url: `https://open.spotify.com/playlist/${id}`,
      tracks: 30,
      tracksMeta: [
        { title: 'Drift Off', artist: 'Various Artists', album: 'Sleep', albumArt: 'https://i.scdn.co/image/ab67706f00000002' },
      ],
    },
    '37i9dQZF1DX4o1oenSJRJd': {
      id,
      title: 'EDM Anthems',
      description: 'Electronic dance hits.',
      url: `https://open.spotify.com/playlist/${id}`,
      tracks: 30,
      tracksMeta: [
        { title: 'Club Banger', artist: 'Various Artists', album: 'EDM', albumArt: 'https://i.scdn.co/image/ab67706f00000002' },
      ],
    },
  };
  return known[id];
}

export function playlistBySpotifyUrl(url: string): PlaylistInfo | undefined {
  const match = url.match(/open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/);
  if (!match) return undefined;
  return playlistInfoById(match[1]);
}

// ─── LANGUAGE HELPERS ─────────────────────────────────

export type CatalogLanguage = 'Telugu' | 'Hindi' | 'Tamil' | 'Kannada' | 'Malayalam' | 'English' | 'Instrumental';

export function allCatalogLanguages(): CatalogLanguage[] {
  return ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'English', 'Instrumental'];
}

export function isMirthicLanguage(lang: CatalogLanguage): boolean {
  return lang !== 'English' && lang !== 'Instrumental';
}

// ─── TOP TRACKS (canonical picks) ────────────────────

export function canonicalTopTracks(language: CatalogLanguage): CatalogTrack[] {
  const lang = language === 'English' ? 'English' : language === 'Instrumental' ? 'Instrumental' : language;
  return musicCatalog
    .filter((t) => t.language === lang || t.language === 'English' || t.language === 'Instrumental')
    .sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0))
    .slice(0, 8);
}
