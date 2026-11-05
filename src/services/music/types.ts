// ═══════════════════════════════════════════════════════════
// MUSIC PROVIDER ABSTRACTION
// One normalized track model + one provider contract so the UI
// never depends on Spotify directly. Spotify specifics stay in
// src/services/music/spotify*.ts and can be swapped for any
// future licensed provider.
// ═══════════════════════════════════════════════════════════

// ─── SOURCES ────────────────────────────────────────

export type TrackSource = 'mirthic' | 'spotify';

export const SOURCE_LABELS: Record<TrackSource, string> = {
  mirthic: 'Mirthic Originals',
  spotify: 'Spotify',
};

// ─── PLAYBACK ───────────────────────────────────────

// How in-app playback can happen for a track:
//  - native:      real audio URL (local/licensed files) via the app's audio engine
//  - embed:       official provider embed player surfaced inside Mirthic
//  - external:    only a provider link is available (opened in a new tab)
//  - unavailable: provider says this item can't be played (region / removed)
export type PlaybackKind = 'native' | 'embed' | 'external' | 'unavailable';

// ─── REPEAT MODES ───────────────────────────────────

export type RepeatMode = 'off' | 'all' | 'one';

// ─── TRACK ──────────────────────────────────────────

export interface UnifiedTrack {
  /** Stable id across the app: `${source}:${providerId}` */
  id: string;
  source: TrackSource;
  playbackKind: PlaybackKind;
  title: string;
  artist: string;
  album?: string;
  albumArt?: string;
  /**
   * Display language ONLY when it is genuinely known
   * (e.g. the local catalog's language, or a language-scoped
   * discovery section). Never invented for raw Spotify metadata.
   */
  language?: string | null;
  moodTags: string[];
  /** Link to the item on the provider's site (always available). */
  externalUrl: string;
  /** Real audio file URL for local/licensed playback. */
  playableUrl?: string;
  /** 30s preview when the provider exposes one. */
  previewUrl?: string;
  /** Provider URI for embed/playback-sdk, e.g. spotify:track:… */
  providerUri?: string;
  /** Duration in seconds when known. */
  durationSec?: number;
  explicit?: boolean;
  /** Human label of where this track comes from. */
  providerLabel: string;
}

// ─── SEARCH ─────────────────────────────────────────

export interface SearchOptions {
  limit?: number;
}

export interface MusicSearchError {
  kind: 'auth' | 'rate-limit' | 'network' | 'unavailable' | 'not-configured' | 'unknown';
  message: string;
}

export interface ProviderSearchResult {
  tracks: UnifiedTrack[];
  error: MusicSearchError | null;
}

// ─── RECOMMENDATIONS ────────────────────────────────

export interface RecommendationOptions {
  /** Hub section driving the recommendation (mood/language/curated…). */
  section?: string;
  /** Discovery language chosen by the user. */
  language?: string;
  /** Mood-tracker mood id (very_bad | bad | okay | good | great). */
  userMood?: string;
  /** Recent history ids to down-rank (anti-repetition). */
  historyIds?: string[];
  limit?: number;
}

// ─── PROVIDER CONTRACT ──────────────────────────────

export interface MusicProvider {
  readonly id: TrackSource;
  readonly label: string;
  /** Whether this provider has what it needs to serve content at all. */
  isConfigured(): boolean;
  /** Whether a user account is connected (where applicable). */
  isConnected(): boolean;
  searchTracks(query: string, options?: SearchOptions): Promise<ProviderSearchResult>;
  getTrack(id: string): Promise<UnifiedTrack | null>;
  getRecommendations(options: RecommendationOptions): Promise<ProviderSearchResult>;
}

// ─── MOOD → MUSIC MAPPING (no medical claims) ───────

export interface MoodMusicMap {
  /** Short, honest copy for the section header. */
  heading: string;
  /** Search/discovery queries that fit the mood. */
  queries: string[];
}

export const USER_MOOD_TO_MUSIC_MAP: Record<string, MoodMusicMap> = {
  very_bad: {
    heading: 'Something gentle and comforting',
    queries: ['comfort songs', 'calm songs'],
  },
  bad: {
    heading: 'Easy listening to help you unwind',
    queries: ['calm songs', 'relaxing ambient'],
  },
  anxious: {
    heading: 'Slow and steady for a settled mind',
    queries: ['calm instrumental', 'relaxing ambient'],
  },
  okay: {
    heading: 'A steady focus soundtrack',
    queries: ['focus songs', 'feel good songs'],
  },
  good: {
    heading: 'Feel-good songs for the moment',
    queries: ['feel good songs', 'trending hits'],
  },
  great: {
    heading: 'Ride the wave — high energy picks',
    queries: ['energy hits', 'trending hits'],
  },
  tired: {
    heading: 'Chill and low-key for low battery',
    queries: ['chill songs', 'sleep ambient'],
  },
  motivated: {
    heading: 'Pump it up',
    queries: ['energy hits', 'motivation songs'],
  },
  focus: {
    heading: 'Music that stays out of the way',
    queries: ['focus songs', 'instrumental study'],
  },
};

// ─── HUB SECTIONS ───────────────────────────────────

export type HubSectionId =
  | 'for-you'
  | 'trending'
  | 'new-releases'
  | 'old-classics'
  | 'devotional'
  | 'dj-remix';

export interface HubSectionDef {
  id: HubSectionId | `lang:${string}` | `mood:${string}`;
  label: string;
  emoji: string;
  /** Real discovery queries used with the official search API. */
  queries: (language: string) => string[];
  /** Whether the language selector should scope this section. */
  languageScoped: boolean;
}
