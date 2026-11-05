// ═══════════════════════════════════════════════════════════
// MUSIC PROVIDERS — isolated implementations of the contract
// in music/types.ts. The page/player code talks to the contract,
// never to Spotify directly.
//
// Providers:
//   LocalLicensedProvider — Mirthic-original / licensed tracks
//                            (public/local audio, real playable URLs)
//   SpotifyProvider         — official Spotify catalog search
//                            and track lookup; playback via official
//                            embed or Web Playback SDK.
//
// ═══════════════════════════════════════════════════════════

import type { MusicProvider, UnifiedTrack, RecommendationOptions, ProviderSearchResult } from './types';
import type { LocalPlaylist } from './library';
import type { CatalogLanguage } from './catalog';
import { getPlaylists, isFavorite, recordPlayed } from './library';
import { musicCatalog as catalog,
  playlistToTrack,
  playlistBySpotifyUrl,
  allCatalogLanguages,
  canonicalTopTracks,
  type CatalogTrack,
} from './catalog';
import type { PlaylistInfo, PlaylistTrack } from './catalog';


// ─── SHARED HELPERS ──────────────────────────────────

function makeSearchResult(tracks: UnifiedTrack[], error: ProviderSearchResult['error'] = null): ProviderSearchResult {
  return { tracks, error };
}

function ensureId(track: UnifiedTrack): UnifiedTrack {
  // guarantee stable ids for every track the UI might play
  if (!track.id) {
    track = {
      ...track,
      id: track.source === 'spotify' ? `spotify:${track.providerUri ?? 'unknown'}` : `mirthic:${track.title?.replace(/\s+/g, '-').toLowerCase() ?? 'track'}`,
    };
  }
  return track;
}

// ─── LOCAL LICENSED PROVIDER ─────────────────────────

/**
 * Serves Mirthic-original / licensed audio. Only tracks with a real
 * playableUrl are playable. No commercial songs are present here.
 */
export class LocalLicensedProvider implements MusicProvider {
  readonly id = 'mirthic' as const;
  readonly label = 'Mirthic Originals';

  isConfigured(): boolean {
    return catalog.length > 0 || getPlaylists().length > 0;
  }

  isConnected(): boolean {
    // local content does not require an external account
    return true;
  }

  searchTracks(_query: string, options?: { limit?: number }): Promise<ProviderSearchResult> {
    const limit = options?.limit ?? 12;
    const tracks = catalog
      .filter((t) => !isFavorite(t.id))
      .slice(0, limit);
    return Promise.resolve(makeSearchResult(tracks.map(ensureId)));
  }

  getTrack(id: string): Promise<UnifiedTrack | null> {
    const byId = catalog.find((t) => t.id === id || t.providerId === id);
    if (!byId) return Promise.resolve(null);
    return Promise.resolve(ensureId(byId));
  }

  getRecommendations(options: RecommendationOptions): Promise<ProviderSearchResult> {
    const { section, language, userMood, limit = 12 } = options;

    if (section === 'favorites') {
      const favorites = catalog.filter((t) => isFavorite(t.id)).slice(0, limit);
      return Promise.resolve(makeSearchResult(favorites.map(ensureId)));
    }

    // Top tracks per language first (canonical, high-quality licensed picks)
    let candidates = canonicalTopTracks((language ?? 'English') as CatalogLanguage)
      .filter((t) => !isFavorite(t.id))
      .slice(0, limit);


    // If mood is provided, add mood-tagged tracks from all languages the user chose
    if (userMood && candidates.length < limit) {
      const mooded = catalog
        .filter((t) => t.moodTags.includes(userMood) && !isFavorite(t.id))
        .slice(0, limit - candidates.length);
      candidates = [...candidates, ...mooded];
    }

    // Section-specific picks
    if (section === 'mood:focus' || section === 'mood:calm') {
      const calm = catalog
        .filter((t) => (t.moodTags.includes('calm') || t.moodTags.includes('focus')) && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(calm.map(ensureId)));
    }
    if (section === 'mood:energy' || section === 'mood:motivation' || section === 'mood:upbeat') {
      const upbeat = catalog
        .filter((t) => (t.moodTags.includes('energy') || t.moodTags.includes('motivation') || t.moodTags.includes('upbeat')) && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(upbeat.map(ensureId)));
    }
    if (section === 'mood:sleep') {
      const sleep = catalog
        .filter((t) => (t.moodTags.includes('sleep') || t.moodTags.includes('ambient')) && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(sleep.map(ensureId)));
    }
    if (section === 'mood:comfort') {
      const comfort = catalog
        .filter((t) => (t.moodTags.includes('comfort') || t.moodTags.includes('calm') || t.moodTags.includes('relax')) && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(comfort.map(ensureId)));
    }
    if (section === 'mood:trending') {
      const trending = catalog
        .filter((t) => t.trending && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(trending.map(ensureId)));
    }

    if (section && section.startsWith('lang:')) {
      const lang = section.slice(5);
      const byLang = catalog
        .filter((t) => t.language === lang && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(byLang.map(ensureId)));
    }

    if (section === 'new-releases') {
      const newest = catalog
        .filter((t) => t.releaseAt >= 0 && !isFavorite(t.id))
        .sort((a, b) => b.releaseAt - a.releaseAt)
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(newest.map(ensureId)));
    }

    if (section === 'old-classics') {
      const classics = catalog
        .filter((t) => t.classic && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(classics.map(ensureId)));
    }

    if (section === 'devotional') {
      const devo = catalog
        .filter((t) => t.category === 'devotional' && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(devo.map(ensureId)));
    }

    if (section === 'dj-remix') {
      const remix = catalog
        .filter((t) => t.category === 'remix' && !isFavorite(t.id))
        .slice(0, limit);
      return Promise.resolve(makeSearchResult(remix.map(ensureId)));
    }

    // default: top tracks + favorites + a small random licensed batch
    const favorites = catalog.filter((t) => isFavorite(t.id)).slice(0, Math.min(limit, 4));
    const rest = canonicalTopTracks((language ?? 'English') as CatalogLanguage)
      .filter((t) => t.id !== favorites[0]?.id && !isFavorite(t.id))
      .slice(0, limit - favorites.length);

    const combined = [...favorites, ...rest];
    return Promise.resolve(makeSearchResult(combined.map(ensureId)));
  }
}

// ─── SPOTIFY PROVIDER ────────────────────────────────

/**
 * Uses only the official Spotify Accounts API (PKCE) and Spotify Web API
 * (search / track endpoints). Plays through the official embed iframe or
 * the Web Playback SDK when the account permits; never extracts or streams
 * unprotected audio.
 */
export class SpotifyProvider implements MusicProvider {
  readonly id = 'spotify' as const;
  readonly label = 'Spotify';

  private token: () => string | null;
  private refreshToken: () => Promise<boolean>;
  private searchFn: (q: string, type: 'track' | 'playlist', limit: number) => Promise<ProviderSearchResult>;
  private getTrackFn: (id: string) => Promise<{ track: UnifiedTrack } | { error: ProviderSearchResult['error'] }>;

  constructor(
    token: () => string | null,
    refreshToken: () => Promise<boolean>,
    searchFn: (q: string, type: 'track' | 'playlist', limit: number) => Promise<ProviderSearchResult>,
    getTrackFn: (id: string) => Promise<{ track: UnifiedTrack } | { error: ProviderSearchResult['error'] }>,
  ) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.searchFn = searchFn;
    this.getTrackFn = getTrackFn;
  }


  isConfigured(): boolean {
    return this.token() !== null;
  }

  isConnected(): boolean {
    return this.token() !== null;
  }

  async searchTracks(query: string, options?: { limit?: number }): Promise<ProviderSearchResult> {
    const q = query.trim();
    if (!q) return makeSearchResult([]);
    const limit = options?.limit ?? 16;

    // Run track + playlist searches in parallel (official Web API).
    const [tracks, playlists] = await Promise.all([
      this.searchFn(q, 'track', Math.min(limit, 12)),
      this.searchFn(q, 'playlist', Math.min(limit, 8)),
    ]);

    if (tracks.error && playlists.error) {
      // Prefer the more actionable message.
      return makeSearchResult([], tracks.error.kind === 'auth' ? tracks.error : playlists.error);
    }

    const list: UnifiedTrack[] = [];

    if (!tracks.error) {
      for (const t of tracks.tracks) {
        list.push(ensureId(t));
      }
    }
    if (!playlists.error) {
      for (const p of playlists.tracks) {
        list.push(ensureId(p));
      }
    }

    // Deduplicate by id, preferring track items for song searches.
    const seen = new Set<string>();
    const deduped = list.filter((t) => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });

    return makeSearchResult(deduped.slice(0, limit));
  }

  async getTrack(id: string): Promise<UnifiedTrack | null> {
    const result = await this.getTrackFn(id);
    if ('error' in result) return null;
    return ensureId(result.track);
  }

  async getRecommendations(options: RecommendationOptions): Promise<ProviderSearchResult> {
    const { section, language, userMood, limit = 12 } = options;

    if (!this.token()) {
      return makeSearchResult(
        [],
        { kind: 'auth', message: 'Connect Spotify to enable recommendations.' },
      );
    }

    // Save heavy work: use real search queries derived from the section.
    const queries = sectionToQueries(section, language ?? 'English', userMood);
    if (queries.length === 0) {
      return makeSearchResult(
        [],
        { kind: 'unknown', message: 'No recommendations available for this section.' },
      );
    }

    // Query the first one; if that fails we still return an honest error.
    const result = await this.searchFn(queries[0], 'track', limit);
    if (result.error) return result;

    const tracks = result.tracks.slice(0, limit);
    return makeSearchResult(tracks);
  }
}

function sectionToQueries(section?: string, language?: string, userMood?: string): string[] {
  if (!section) return [];        const lang = (language ?? 'English') as CatalogLanguage;

  const mood = userMood ?? '';

  if (section === 'for-you') {
    const map: Record<string, string> = {
      'very_bad': 'comfort songs',
      'bad': 'calm songs',
      'anxious': 'calm instrumental songs',
      'okay': 'focus songs',
      'good': 'feel good songs',
      'great': 'energy songs',
      'tired': 'chill songs',
      'motivated': 'motivation songs',
      'focus': 'focus songs',
    };
    const q = map[mood] || 'feel good songs';
    return [q];
  }

  if (section === 'trending') return [lang === 'English' ? 'trending hits' : `${lang} trending songs`];

  if (section === 'new-releases') return [lang === 'English' ? 'new songs' : `${lang} new songs`];

  if (section === 'old-classics') return [lang === 'English' ? 'oldies songs' : `${lang} old classics songs`];

  if (section === 'devotional') {
    const devo: Record<string, string> = {
      'Telugu': 'telugu devotional songs',
      'Hindi': 'hindi devotional songs',
      'Tamil': 'tamil devotional songs',
      'Kannada': 'kannada devotional songs',
      'Malayalam': 'malayalam devotional songs',
      'English': 'christian worship songs',
      'Instrumental': 'instrumental worship songs',
    };
    return [devo[lang] ?? 'devotional songs'];
  }

  if (section === 'dj-remix') return [lang === 'English' ? 'remix hits' : `${lang} remix songs`];

  if (section?.startsWith('lang:')) {
    const langKey = section.slice(5);
    return [langKey === 'English' ? 'english trending songs' : `${langKey} latest songs`];
  }

  if (section?.startsWith('mood:')) {
    const moodKey = section.slice(5);
    const moodQueries: Record<string, string> = {
      calm: lang === 'English' ? 'calm songs' : `${lang} calm songs`,
      comfort: 'comfort songs',
      focus: lang === 'English' ? 'focus songs' : `${lang} focus songs`,
      energy: lang === 'English' ? 'energy songs' : `${lang} energy songs`,
      sleep: lang === 'English' ? 'sleep songs' : `${lang} sleep songs`,
      motivation: lang === 'English' ? 'motivation songs' : `${lang} motivation songs`,
    };
    return [moodQueries[moodKey] ?? 'calm songs'];
  }

  return [];
}

// ─── FACTORY ─────────────────────────────────────────

export function createSpotifyProvider(
  options: {
    token: () => string | null;
    refreshToken: () => Promise<boolean>;
  },
): SpotifyProvider {
  return new SpotifyProvider(
    options.token,
    options.refreshToken,
    async (q, type, limit) => {
      const token = options.token();
      if (!token) return makeSearchResult([], { kind: 'auth', message: 'Connect Spotify to search.' });
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { searchSpotify } = await import('./spotifyClient');
      return searchSpotify(token, { q, type, limit });
    },
    async (id) => {
      const token = options.token();
      if (!token) return { error: { kind: 'auth', message: 'Connect Spotify to view this track.' } };
      const { getSpotifyTrack } = await import('./spotifyClient');
      return getSpotifyTrack(token, id);
    },
  );
}

export const localProvider = new LocalLicensedProvider();

