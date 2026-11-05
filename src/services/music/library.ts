// ═══════════════════════════════════════════════════════════
// MUSIC LIBRARY — local persistence (metadata/IDs only)
// Favorites, recently played, recent searches, skipped tracks.
// No copyrighted audio is ever stored — only ids and metadata.
// ═══════════════════════════════════════════════════════════

import type { UnifiedTrack } from './types';

// ─── KEYS ───────────────────────────────────────────

const FAVORITES_KEY = 'mc_music_favorites';
const PLAYED_KEY = 'mc_music_played';
const SKIPPED_KEY = 'mc_music_skipped';
const SEARCHES_KEY = 'mc_music_recent_searches';
const PLAYLIST_KEY = 'mc_music_playlists';

// ─── HELPERS ────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or private mode — degrade silently */
  }
}

// ─── FAVORITES ──────────────────────────────────────

export type FavoriteId = string; // id of the UnifiedTrack

export function getFavoriteIds(): FavoriteId[] {
  return read<FavoriteId[]>(FAVORITES_KEY, []);
}

export function isFavorite(trackId: string): boolean {
  return getFavoriteIds().includes(trackId);
}

export function toggleFavorite(track: UnifiedTrack): FavoriteId[] {
  const current = getFavoriteIds();
  if (isFavorite(track.id)) {
    write(FAVORITES_KEY, current.filter((id) => id !== track.id));
    return current.filter((id) => id !== track.id);
  }
  write(FAVORITES_KEY, [track.id, ...current]);
  return [track.id, ...current];
}

export function favoriteCount(): number {
  return getFavoriteIds().length;
}

// ─── RECENTLY PLAYED ────────────────────────────────

export interface PlayedEntry {
  trackId: string;
  providerId?: string;
  playedAt: number;
  from: string; // section / source tag for debugging
}

export function getPlayed(limit = 50): PlayedEntry[] {
  return read<PlayedEntry[]>(PLAYED_KEY, []).slice(0, limit);
}

export function recordPlayed(entry: PlayedEntry): PlayedEntry[] {
  const current = read<PlayedEntry[]>(PLAYED_KEY, []);
  const filtered = current.filter((e) => e.trackId !== entry.trackId);
  const updated = [entry, ...filtered].slice(0, 100);
  write(PLAYED_KEY, updated);
  return updated;
}

// ─── SKIPPED TRACKS ─────────────────────────────────

export interface SkippedEntry {
  trackId: string;
  section?: string;
  skippedAt: number;
}

export function getSkipped(limit = 50): SkippedEntry[] {
  return read<SkippedEntry[]>(SKIPPED_KEY, []).slice(0, limit);
}

export function recordSkipped(entry: SkippedEntry): SkippedEntry[] {
  const current = read<SkippedEntry[]>(SKIPPED_KEY, []);
  const filtered = current.filter((e) => e.trackId !== entry.trackId);
  const updated = [entry, ...filtered].slice(0, 100);
  write(SKIPPED_KEY, updated);
  return updated;
}

// ─── RECENT SEARCHES ────────────────────────────────

export interface RecentSearch {
  query: string;
  language?: string;
  searchedAt: number;
}

export function getRecentSearches(limit = 12): RecentSearch[] {
  return read<RecentSearch[]>(SEARCHES_KEY, []).slice(0, limit);
}

export function recordSearch(query: string, language?: string): RecentSearch[] {
  const current = read<RecentSearch[]>(SEARCHES_KEY, []);
  const filtered = current.filter((s) => s.query.toLowerCase() !== query.toLowerCase());
  const updated = [{ query, language, searchedAt: Date.now() }, ...filtered].slice(0, 12);
  write(SEARCHES_KEY, updated);
  return updated;
}

export function clearRecentSearches(): RecentSearch[] {
  write(SEARCHES_KEY, []);
  return [];
}

// ─── LOCAL PLAYLISTS (user-created) ─────────────────

export interface LocalPlaylist {
  id: string;
  name: string;
  description?: string;
  tracks: string[]; // UnifiedTrack ids
  createdAt: number;
}

export function getPlaylists(): LocalPlaylist[] {
  return read<LocalPlaylist[]>(PLAYLIST_KEY, []);
}

export function getPlaylist(id: string): LocalPlaylist | undefined {
  return getPlaylists().find((p) => p.id === id);
}

export function createPlaylist(name: string, description?: string): LocalPlaylist {
  const playlist: LocalPlaylist = {
    id: `pl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    description,
    tracks: [],
    createdAt: Date.now(),
  };
  write(PLAYLIST_KEY, [playlist, ...getPlaylists()]);
  return playlist;
}

export function addToPlaylist(playlistId: string, trackId: string): LocalPlaylist | null {
  const playlists = getPlaylists();
  const idx = playlists.findIndex((p) => p.id === playlistId);
  if (idx < 0) return null;
  const next = playlists[idx];
  const tracks = next.tracks.includes(trackId)
    ? next.tracks
    : [trackId, ...next.tracks];
  const updated = [...playlists];
  updated[idx] = { ...next, tracks };
  write(PLAYLIST_KEY, updated);
  return updated[idx];
}

export function removeFromPlaylist(playlistId: string, trackId: string): LocalPlaylist | null {
  const playlists = getPlaylists();
  const idx = playlists.findIndex((p) => p.id === playlistId);
  if (idx < 0) return null;
  const next = playlists[idx];
  const updated = [...playlists];
  updated[idx] = { ...next, tracks: next.tracks.filter((t) => t !== trackId) };
  write(PLAYLIST_KEY, updated);
  return updated[idx];
}

// ─── ANTI-REPETITION HELPERS ────────────────────────

export interface HistorySnapshot {
  playedIds: string[];
  skippedIds: string[];
  playedSet: ReadonlySet<string>;
}

export function historySnapshot(): HistorySnapshot {
  const played = getPlayed(200);
  const skipped = getSkipped(200);
  const set = new Set(played.map((e) => e.trackId));
  skipped.forEach((e) => set.add(e.trackId));
  return { playedIds: played.map((e) => e.trackId), skippedIds: skipped.map((e) => e.trackId), playedSet: set };
}

/**
 * Return the subset of candidates that are not recently played/skipped,
 * with a fresh shuffle. If too few remain, recycle a few stale ones.
 */
export function pickFresh<T extends { id: string }>(
  candidates: T[],
  opts: { prefer?: T[]; min?: number; recycleLimit?: number },
): T[] {
  const min = opts.min ?? 1;
  const recycle = opts.recycleLimit ?? 3;

  const fresh = candidates.filter((c) => !historySnapshot().playedSet.has(c.id));
  const shuffled = shuffle([...fresh]);

  if (shuffled.length >= min) return shuffled.slice(0, min + 3);

  const recyclePool = candidates
    .filter((c) => !opts.prefer?.some((p) => p.id === c.id))
    .sort((a, b) => {
      const pa = playedAge(a.id);
      const pb = playedAge(b.id);
      return pb - pa;
    });
  const recycled = shuffle([...recyclePool]).slice(0, recycle);
  return shuffle([...shuffled, ...recycled]).slice(0, min + 3);
}

function playedAge(trackId: string): number {
  const played = getPlayed(200).find((e) => e.trackId === trackId);
  if (!played) return Number.MAX_SAFE_INTEGER;
  return Date.now() - played.playedAt;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── RESET (debug / account switch) ─────────────────

export function resetLocalMusic(): void {
  write(FAVORITES_KEY, []);
  write(PLAYED_KEY, []);
  write(SKIPPED_KEY, []);
  write(SEARCHES_KEY, []);
  // playlists intentionally preserved per account logic; callers opt out if needed
}
