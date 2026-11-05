// ═══════════════════════════════════════════════════════════
// SPOTIFY WEB API CLIENT
// ═══════════════════════════════════════════════════════════

import type { UnifiedTrack, ProviderSearchResult, MusicSearchError, SearchOptions } from './types';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

// ─── ERROR CLASSIFICATION ────────────────────────────

export function classifySpotifyError(status: number, body: unknown): MusicSearchError {
  if (status === 401 || status === 403) {
    return { kind: 'auth', message: 'Spotify authorization is needed to load this result.' };
  }
  if (status === 429) {
    return { kind: 'rate-limit', message: 'Spotify search is busy right now. Try again in a moment.' };
  }
  if (status >= 500) {
    return { kind: 'unknown', message: 'Spotify couldn’t load this result. Please try again.' };
  }
  if (status === 400 || status === 404) {
    return { kind: 'unavailable', message: 'Spotify couldn’t load this result.' };
  }
  return { kind: 'unknown', message: 'Spotify couldn’t load this result.' };
}

async function readResponse<T>(
  res: Response,
): Promise<{ ok: true; data: T } | { ok: false; status: number; body: unknown }> {
  let parsed: unknown = null;
  try {
    parsed = res.status !== 204 ? ((await res.json()) as unknown) : null;
  } catch {
    parsed = null;
  }
  if (res.ok) return { ok: true, data: parsed as T };
  return { ok: false, status: res.status, body: parsed };
}


// ─── SEARCH ──────────────────────────────────────────

export interface SpotifySearchParams {
  q: string;
  type: 'track' | 'playlist' | 'album' | 'artist';
  market?: string;
  limit: number;
  offset?: number;
}

export async function searchSpotify(
  accessToken: string,
  params: SpotifySearchParams,
): Promise<ProviderSearchResult> {
  const url = new URL(`${SPOTIFY_API_BASE}/search`);
  url.searchParams.set('q', params.q);
  url.searchParams.set('type', params.type);
  url.searchParams.set('market', params.market ?? 'IN');
  url.searchParams.set('limit', String(params.limit));
  if (params.offset !== undefined) url.searchParams.set('offset', String(params.offset));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return { tracks: [], error: classifySpotifyError(res.status, null) };
  }

  const json = (await res.json()) as {
    tracks?: { items: unknown[] };
    playlists?: { items: unknown[] };
    albums?: { items: unknown[] };
    artists?: { items: unknown[] };
  };

  const items =
    params.type === 'track'
      ? json.tracks?.items ?? []
      : params.type === 'playlist'
        ? json.playlists?.items ?? []
        : params.type === 'album'
          ? json.albums?.items ?? []
          : json.artists?.items ?? [];

  const tracks = items.map((item, i) => normalizeSpotifyItem(item, params.type, i));
  return { tracks, error: null };
}

// ─── GET TRACK ───────────────────────────────────────

export async function getSpotifyTrack(
  accessToken: string,
  trackId: string,
  market = 'IN',
): Promise<{ track: UnifiedTrack } | { error: MusicSearchError }> {
  const res = await fetch(`${SPOTIFY_API_BASE}/tracks/${trackId}?market=${market}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    return { error: classifySpotifyError(res.status, null) };
  }

  return { track: normalizeSpotifyItem((await res.json()) as unknown, 'track', 0) };
}

// ─── EMBED URL ───────────────────────────────────────

export function spotifyEmbedUrl(url: string): string {
  const match = url.match(/open\.spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
  if (!match) return url;
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=mirthic&theme=0`;
}

export function spotifyUriFromId(type: 'playlist' | 'album' | 'track', id: string): string {
  return `spotify:${type}:${id}`;
}

// ─── NORMALIZE SPOTIFY ITEM ──────────────────────────

function normalizeSpotifyItem(raw: unknown, type: 'track' | 'playlist' | 'album' | 'artist', idx: number): UnifiedTrack {
  if (type === 'track') {
    return normalizeSpotifyTrack(raw as { id?: string; name?: string; artists?: { name?: string }[]; album?: { name?: string; images?: { url?: string; width?: number }[] }; explicit?: boolean; duration_ms?: number; uri?: string; is_playable?: boolean; restrictions?: unknown }, idx);
  }
  if (type === 'playlist') {
    return normalizeSpotifyPlaylist(raw as { id?: string; name?: string; description?: string; images?: { url?: string; width?: number }[]; owner?: { display_name?: string }; uri?: string }, idx);
  }
  if (type === 'album') {
    return normalizeSpotifyAlbum(raw as { id?: string; name?: string; artists?: { name?: string }[]; images?: { url?: string; width?: number }[]; uri?: string }, idx);
  }
  return normalizeSpotifyArtist(raw as { id?: string; name?: string; images?: { url?: string }[]; uri?: string }, idx);
}

function pickAlbumArt(images: { url?: string; width?: number }[]): string | undefined {
  if (!images || images.length === 0) return undefined;
  const sorted = [...images].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return sorted[0]?.url;
}

function normalizeSpotifyTrack(
  t: { id?: string; name?: string; artists?: { name?: string }[]; album?: { name?: string; images?: { url?: string; width?: number }[] }; explicit?: boolean; duration_ms?: number; uri?: string; is_playable?: boolean; restrictions?: unknown },
  idx: number,
): UnifiedTrack {
  const id = t.id ?? `spotify-track-unknown-${idx}`;
  const albumArt = pickAlbumArt(t.album?.images ?? []);
  const isPlayable = t.is_playable !== false && t.restrictions == null;
  const durationSec = t.duration_ms ? Math.round(t.duration_ms / 1000) : undefined;
  return {
    id: `spotify:track:${id}`,
    source: 'spotify',
    playbackKind: isPlayable ? 'embed' : 'unavailable',
    title: t.name ?? 'Unknown Track',
    artist: (t.artists ?? []).map((a) => a.name ?? '').filter(Boolean).join(', ') || 'Unknown Artist',
    album: t.album?.name,
    albumArt,
    language: undefined,
    moodTags: [],
    externalUrl: `https://open.spotify.com/track/${id}`,
    previewUrl: t.is_playable === false ? undefined : undefined,
    providerUri: t.uri ?? `spotify:track:${id}`,
    durationSec,
    explicit: t.explicit ?? false,
    providerLabel: 'Spotify',
  };
}

function normalizeSpotifyPlaylist(
  p: { id?: string; name?: string; description?: string; images?: { url?: string; width?: number }[]; owner?: { display_name?: string }; uri?: string },
  idx: number,
): UnifiedTrack {
  const id = p.id ?? `spotify-playlist-unknown-${idx}`;
  if (!id) {
    return {
      id: `spotify-playlist-fallback-${idx}`,
      source: 'spotify',
      playbackKind: 'external',
      title: p.name ?? 'Playlist',
      artist: p.owner?.display_name ?? 'Unknown',
      album: undefined,
      albumArt: undefined,
      language: undefined,
      moodTags: [],
      externalUrl: 'https://open.spotify.com',
      providerLabel: 'Spotify',
    };
  }
  return {
    id: `spotify:playlist:${id}`,
    source: 'spotify',
    playbackKind: 'embed',
    title: p.name ?? 'Playlist',
    artist: p.owner?.display_name ?? 'Various Artists',
    album: p.description ? `${p.description.slice(0, 120)}${p.description.length > 120 ? '…' : ''}` : 'Spotify Playlist',
    albumArt: pickAlbumArt(p.images ?? []),
    language: undefined,
    moodTags: [],
    externalUrl: `https://open.spotify.com/playlist/${id}`,
    providerUri: p.uri ?? `spotify:playlist:${id}`,
    providerLabel: 'Spotify',
  };
}

function normalizeSpotifyAlbum(
  a: { id?: string; name?: string; artists?: { name?: string }[]; images?: { url?: string; width?: number }[]; uri?: string },
  idx: number,
): UnifiedTrack {
  const id = a.id ?? `spotify-album-unknown-${idx}`;
  return {
    id: `spotify:album:${id}`,
    source: 'spotify',
    playbackKind: 'embed',
    title: a.name ?? 'Album',
    artist: (a.artists ?? []).map((a) => a.name ?? '').filter(Boolean).join(', ') || 'Unknown Artist',
    album: a.name,
    albumArt: pickAlbumArt(a.images ?? []),
    language: undefined,
    moodTags: [],
    externalUrl: `https://open.spotify.com/album/${id}`,
    providerUri: a.uri ?? `spotify:album:${id}`,
    providerLabel: 'Spotify',
  };
}

function normalizeSpotifyArtist(
  a: { id?: string; name?: string; images?: { url?: string }[]; uri?: string },
  idx: number,
): UnifiedTrack {
  const id = a.id ?? `spotify-artist-unknown-${idx}`;
  return {
    id: `spotify:artist:${id}`,
    source: 'spotify',
    playbackKind: 'external',
    title: a.name ?? 'Artist',
    artist: a.name ?? 'Unknown Artist',
    album: undefined,
    albumArt: a.images?.[0]?.url,
    language: undefined,
    moodTags: [],
    externalUrl: `https://open.spotify.com/artist/${id}`,
    providerUri: a.uri ?? `spotify:artist:${id}`,
    providerLabel: 'Spotify',
  };
}
