// ═══════════════════════════════════════════════════════════
// MUSIC CATALOG — Single source of truth for all music data
// Normalized language, real provider playlists, honest playback
// ═══════════════════════════════════════════════════════════

// ─── CANONICAL LANGUAGE SYSTEM ──────────────────────

export type CanonicalLanguage = 'Telugu' | 'Hindi' | 'Tamil' | 'Kannada' | 'Malayalam' | 'English' | 'Instrumental';
export type LanguageCode = 'te' | 'hi' | 'ta' | 'kn' | 'ml' | 'en' | 'instrumental';
export type MusicMood = 'calm' | 'focus' | 'relax' | 'feel-good' | 'energy' | 'dance' | 'sleep' | 'motivation';
export type MusicCategory = 'for-you' | 'new-releases' | 'dj-remix' | 'old-classics' | 'by-language' | 'by-mood' | 'genres';
export type MusicGenre = 'pop' | 'lofi' | 'edm' | 'classical' | 'acoustic' | 'indie' | 'hip-hop' | 'jazz' | 'rock' | 'r&b' | 'folk' | 'ambient';
export type Decade = '60s' | '70s' | '80s' | '90s' | '2000s' | '2010s';
export type PlaybackType = 'native' | 'preview' | 'external' | 'embed';

// ─── NORMALIZE LANGUAGE ─────────────────────────────

const LANG_MAP: Record<string, CanonicalLanguage> = {
  'telugu': 'Telugu', 'te': 'Telugu', 'te-in': 'Telugu', 'te_in': 'Telugu', 'telugu-in': 'Telugu',
  'hindi': 'Hindi', 'hi': 'Hindi', 'hi-in': 'Hindi', 'hi_in': 'Hindi', 'hindi-in': 'Hindi',
  'tamil': 'Tamil', 'ta': 'Tamil', 'ta-in': 'Tamil', 'ta_in': 'Tamil', 'tamil-in': 'Tamil',
  'kannada': 'Kannada', 'kn': 'Kannada', 'kn-in': 'Kannada', 'kn_in': 'Kannada', 'kannada-in': 'Kannada',
  'malayalam': 'Malayalam', 'ml': 'Malayalam', 'ml-in': 'Malayalam', 'ml_in': 'Malayalam', 'malayalam-in': 'Malayalam',
  'english': 'English', 'en': 'English', 'en-in': 'English', 'en_us': 'English', 'en-gb': 'English',
  'instrumental': 'Instrumental', 'inst': 'Instrumental',
  'no-preference': 'English',
};

export function normalizeLanguage(input: string): CanonicalLanguage {
  const key = input.toLowerCase().trim().replace(/_/g, '-');
  return LANG_MAP[key] || 'English';
}

export function languageCode(lang: CanonicalLanguage): LanguageCode {
  const map: Record<CanonicalLanguage, LanguageCode> = {
    'Telugu': 'te', 'Hindi': 'hi', 'Tamil': 'ta', 'Kannada': 'kn',
    'Malayalam': 'ml', 'English': 'en', 'Instrumental': 'instrumental',
  };
  return map[lang];
}

export function detectBrowserLanguage(): CanonicalLanguage | null {
  try {
    const prefix = navigator.language.split('-')[0].toLowerCase();
    const map: Record<string, CanonicalLanguage> = {
      'te': 'Telugu', 'hi': 'Hindi', 'ta': 'Tamil', 'kn': 'Kannada', 'ml': 'Malayalam',
    };
    return map[prefix] || null;
  } catch { return null; }
}

// ─── MUSIC TRACK SCHEMA ─────────────────────────────

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  language: CanonicalLanguage;
  mood: MusicMood[];
  genre: MusicGenre;
  decade?: Decade;
  releaseDate: string;
  category: MusicCategory;
  coverEmoji: string;
  playbackType: PlaybackType;
  playableUrl?: string;    // For native playback (must be a real audio file URL)
  previewUrl?: string;     // For preview playback
  externalUrl: string;     // For external provider link
  youtubeEmbedUrl?: string; // In-app legal embed playback (e.g. YouTube/YouTube Music iframe)
  provider: string;
  isActive: boolean;
}

// ─── MOOD MAPPING ───────────────────────────────────

export const USER_MOOD_TO_MUSIC: Record<string, MusicMood> = {
  'very_bad': 'calm',
  'bad': 'relax',
  'okay': 'focus',
  'good': 'feel-good',
  'great': 'energy',
};

// ─── LANGUAGE DISPLAY NAMES ─────────────────────────

export const LANGUAGE_LABELS: Record<CanonicalLanguage, string> = {
  'Telugu': 'Telugu', 'Hindi': 'Hindi', 'Tamil': 'Tamil', 'Kannada': 'Kannada',
  'Malayalam': 'Malayalam', 'English': 'English', 'Instrumental': 'Instrumental',
};
export const ALL_LANGUAGES: CanonicalLanguage[] = ['Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam', 'English', 'Instrumental'];

// ═══════════════════════════════════════════════════
// MUSIC CATALOGUE
// Each track now has a legal in-app embed path (playbackType: 'embed')
// and an external provider link for the provider app/browser.
// ═══════════════════════════════════════════════════

function sp(id: string): string {
  return `https://open.spotify.com/playlist/${id}`;
}

// Shared YouTube embed playlist URL used as the legal in-app
// playback surface until track-level YouTube content IDs are wired.
const YT_EMBED_PLAYLIST = 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm';

export const MUSIC_CATALOG: MusicTrack[] = [
  // ═══════════════ TELUGU ═══════════════════════════════════════
  { id: 'te-trending-1', title: 'Trending Now Telugu', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Telugu', mood: ['energy', 'feel-good'], genre: 'pop', releaseDate: '2025-08-15', category: 'new-releases', coverEmoji: '🔥', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWTt3gMo0DLxA'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'te-latest-1', title: 'Latest Telugu', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Telugu', mood: ['feel-good'], genre: 'pop', releaseDate: '2025-08-20', category: 'new-releases', coverEmoji: '🆕', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWWwrjLPC16W7'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'te-feelgood-1', title: 'Feel Good Telugu', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Telugu', mood: ['feel-good'], genre: 'pop', releaseDate: '2024-05-20', category: 'by-language', coverEmoji: '😊', playbackType: 'embed', externalUrl: sp('37i9dQZF1DXdMUUSqm9tTc'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'te-hot-1', title: 'Hot Hits Telugu', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Telugu', mood: ['energy', 'dance'], genre: 'pop', releaseDate: '2025-07-10', category: 'by-language', coverEmoji: '🎶', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX6XE7HRLM75P'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'te-happy-1', title: 'Happy Vibes Telugu', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Telugu', mood: ['feel-good', 'energy'], genre: 'pop', releaseDate: '2024-08-15', category: 'by-language', coverEmoji: '☀️', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX2UT3NuRgcHd'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'te-love-1', title: 'Telugu Love Songs', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Telugu', mood: ['relax', 'calm'], genre: 'acoustic', releaseDate: '2024-04-10', category: 'by-language', coverEmoji: '❤️', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX44F1QWqYoaV'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'te-item-1', title: 'Telugu Item Songs', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Telugu', mood: ['dance', 'energy'], genre: 'pop', releaseDate: '2025-06-01', category: 'dj-remix', coverEmoji: '💃', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX5fit7Rq5tmH'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },

  // ═══════════════ HINDI ═══════════════════════════════════════
  { id: 'hi-hot-1', title: 'Hot Hits Hindi', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Hindi', mood: ['energy', 'feel-good'], genre: 'pop', releaseDate: '2025-08-10', category: 'new-releases', coverEmoji: '🔥', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX0XUfTFmNBRM'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'hi-bollywood-1', title: 'Bollywood Top 50', artist: 'Various Artists', album: 'Filtr India', language: 'Hindi', mood: ['energy', 'feel-good'], genre: 'pop', releaseDate: '2025-08-15', category: 'by-language', coverEmoji: '🎬', playbackType: 'embed', externalUrl: sp('4nNVfQ9eWidZXkBKZN5li4'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'hi-feelgood-1', title: 'Hindi Feel Good', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Hindi', mood: ['feel-good'], genre: 'pop', releaseDate: '2024-05-15', category: 'by-language', coverEmoji: '😊', playbackType: 'embed', externalUrl: sp('0jmrNpZzcgFqHJJ0UTR2Tj'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'hi-dance-1', title: 'Bollywood Dance Music', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Hindi', mood: ['dance', 'energy'], genre: 'pop', releaseDate: '2024-06-20', category: 'dj-remix', coverEmoji: '💃', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX8xfQRRX1PDm'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'hi-classic-00s', title: 'All Out 00s Hindi', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Hindi', mood: ['feel-good', 'relax'], genre: 'pop', decade: '2000s', releaseDate: '2005-01-01', category: 'old-classics', coverEmoji: '📀', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWZNJXX2UeBij'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'hi-top-1', title: 'Top 50 - India', artist: 'Various Artists', album: 'Spotify Charts', language: 'Hindi', mood: ['energy', 'feel-good'], genre: 'pop', releaseDate: '2025-08-20', category: 'new-releases', coverEmoji: '📊', playbackType: 'embed', externalUrl: sp('37i9dQZEVXbLZ52XmnySJg'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },

  // ═══════════════ TAMIL ═══════════════════════════════════════
  { id: 'ta-hot-1', title: 'Hot Hits Tamil', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Tamil', mood: ['energy', 'feel-good'], genre: 'pop', releaseDate: '2025-08-10', category: 'new-releases', coverEmoji: '🔥', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX1i3hvzHpcQV'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ta-latest-1', title: 'Latest Tamil', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Tamil', mood: ['feel-good'], genre: 'pop', releaseDate: '2025-08-15', category: 'new-releases', coverEmoji: '🆕', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWVo4cdnikh7Z'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ta-happy-1', title: 'Happy Vibes Tamil', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Tamil', mood: ['feel-good'], genre: 'pop', releaseDate: '2024-07-10', category: 'by-language', coverEmoji: '😊', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX2x1COalpsUi'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ta-energy-1', title: 'Tamil Dance Party', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Tamil', mood: ['dance', 'energy'], genre: 'edm', releaseDate: '2024-09-15', category: 'dj-remix', coverEmoji: '⚡', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWWwrjLPC16W7'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ta-classic-90s', title: 'All Out 90s Tamil', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Tamil', mood: ['feel-good', 'relax'], genre: 'classical', decade: '90s', releaseDate: '1995-01-01', category: 'old-classics', coverEmoji: '📻', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWTgirUMN05o2'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ta-melody-1', title: 'Tamil Melody Hits', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Tamil', mood: ['relax', 'calm'], genre: 'acoustic', releaseDate: '2024-06-01', category: 'by-language', coverEmoji: '🎵', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX44F1QWqYoaV'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },

  // ═══════════════ KANNADA ═══════════════════════════════════════
  { id: 'kn-latest-1', title: 'Latest Kannada', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Kannada', mood: ['feel-good'], genre: 'pop', releaseDate: '2025-08-10', category: 'new-releases', coverEmoji: '🆕', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWZqTcNLmb3sH'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'kn-hot-1', title: 'Hot Hits Kannada', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Kannada', mood: ['energy', 'dance'], genre: 'pop', releaseDate: '2025-07-01', category: 'by-language', coverEmoji: '🔥', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX1ahAlaaz0ZE'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'kn-feelgood-1', title: 'Kannada Melody Hits', artist: 'Various Artists', album: 'Song diary', language: 'Kannada', mood: ['feel-good', 'relax'], genre: 'acoustic', releaseDate: '2024-05-15', category: 'by-language', coverEmoji: '🎶', playbackType: 'embed', externalUrl: sp('0td8Ug256plxMIOzOXKHNo'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'kn-party-1', title: 'Kannada Party Hits', artist: 'Various Artists', album: 'Song diary', language: 'Kannada', mood: ['dance', 'energy'], genre: 'pop', releaseDate: '2024-09-01', category: 'dj-remix', coverEmoji: '🎉', playbackType: 'embed', externalUrl: sp('6jAgAcK95VOel3jXjjEWu8'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },

  // ═══════════════ MALAYALAM ═══════════════════════════════════════
  { id: 'ml-feelgood-1', title: 'Feel Good Malayalam', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Malayalam', mood: ['feel-good'], genre: 'pop', releaseDate: '2024-05-10', category: 'by-language', coverEmoji: '😊', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX0YqJHUZrLcd'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ml-latest-1', title: 'Latest Malayalam', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Malayalam', mood: ['feel-good'], genre: 'pop', releaseDate: '2025-08-10', category: 'new-releases', coverEmoji: '🆕', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWSxEc2RjBCQv'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ml-party-1', title: 'Malayalam Party Hits', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Malayalam', mood: ['dance', 'energy'], genre: 'pop', releaseDate: '2024-08-20', category: 'dj-remix', coverEmoji: '🎉', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX7ko3EzbLi5w'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ml-evergreen-1', title: 'Malayalam Evergreen', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Malayalam', mood: ['relax', 'calm'], genre: 'classical', releaseDate: '2024-03-01', category: 'old-classics', coverEmoji: '🎶', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX1236GypTYSU'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'ml-romantic-1', title: 'Romantic Malayalam', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Malayalam', mood: ['calm', 'relax'], genre: 'acoustic', releaseDate: '2024-06-15', category: 'by-language', coverEmoji: '❤️', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX3lmpQSniUBH'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },

  // ═══════════════ ENGLISH ═══════════════════════════════════════
  { id: 'en-new-1', title: 'New Music Friday', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['feel-good', 'energy'], genre: 'pop', releaseDate: '2025-08-15', category: 'new-releases', coverEmoji: '🆕', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX4JAvHpjipBk'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'en-lofi-1', title: 'Lofi Beats to Study', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['focus', 'calm'], genre: 'lofi', releaseDate: '2024-02-15', category: 'by-language', coverEmoji: '🎧', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX8Uebhn9wzrS'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'en-lofi-study-1', title: 'Beats to Relax/Study', artist: 'Lofi Girl', album: 'Lofi Girl', language: 'English', mood: ['focus', 'calm'], genre: 'lofi', releaseDate: '2024-01-10', category: 'genres', coverEmoji: '☕', playbackType: 'embed', externalUrl: sp('0vvXsWCC9xrXsKd4FyS8kM'), youtubeEmbedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', provider: 'YouTube', isActive: true },
  { id: 'en-calm-1', title: 'Ambient Relaxation', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['calm', 'sleep'], genre: 'ambient', releaseDate: '2024-01-10', category: 'by-mood', coverEmoji: '🧘', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX3Ogo9pFvBkY'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'en-feelgood-1', title: 'Feel-Good Hits', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['feel-good'], genre: 'pop', releaseDate: '2024-04-01', category: 'by-language', coverEmoji: '☀️', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX1kCIzMYtzum'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'en-energy-1', title: 'Energy Boost', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['energy', 'motivation'], genre: 'pop', releaseDate: '2024-05-10', category: 'by-mood', coverEmoji: '⚡', playbackType: 'embed', externalUrl: sp('37i9dQZF1DXdPec7aLTmlC'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'en-classic-80s', title: '80s Classics', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['energy', 'feel-good'], genre: 'pop', decade: '80s', releaseDate: '1985-01-01', category: 'old-classics', coverEmoji: '🕺', playbackType: 'embed', externalUrl: sp('37i9dQZF1DX4KyJ8dAlYhm'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'en-classic-90s', title: '90s Hits', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['energy', 'feel-good'], genre: 'pop', decade: '90s', releaseDate: '1995-01-01', category: 'old-classics', coverEmoji: '💿', playbackType: 'embed', externalUrl: sp('37i9dQZF1DXbTmwAdrJySa'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'en-rock-1', title: 'Rock Classics', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['energy', 'motivation'], genre: 'rock', releaseDate: '2024-06-01', category: 'genres', coverEmoji: '🎸', playbackType: 'embed', externalUrl: sp('37i9dQZF1DXcBWIGoYBM5M'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'en-jazz-1', title: 'Jazz Lounge', artist: 'Various Artists', album: 'Spotify Editorial', language: 'English', mood: ['relax', 'calm'], genre: 'jazz', releaseDate: '2024-03-01', category: 'genres', coverEmoji: '🎷', playbackType: 'embed', externalUrl: sp('37i9dQZF1DXbITWG1ZJKYt'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },

  // ═══════════════ INSTRUMENTAL ═══════════════════════════════════════
  { id: 'inst-focus-1', title: 'Deep Focus', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Instrumental', mood: ['focus', 'calm'], genre: 'ambient', releaseDate: '2024-01-25', category: 'by-language', coverEmoji: '🧠', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWZeKCadgRdKQ'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'inst-nature-1', title: 'Nature Sounds', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Instrumental', mood: ['sleep', 'calm'], genre: 'ambient', releaseDate: '2024-02-28', category: 'by-mood', coverEmoji: '🌊', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWWEcRhUVtL8n'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
  { id: 'inst-ambient-1', title: 'Ambient Chill', artist: 'Various Artists', album: 'Spotify Editorial', language: 'Instrumental', mood: ['focus', 'relax'], genre: 'lofi', releaseDate: '2024-04-15', category: 'genres', coverEmoji: '🎧', playbackType: 'embed', externalUrl: sp('37i9dQZF1DWYoYGBbGKurt'), youtubeEmbedUrl: YT_EMBED_PLAYLIST, provider: 'YouTube', isActive: true },
];

// ═══════════════════════════════════════════════════
// HELPER: Spotify embed URL
// ═══════════════════════════════════════════════════

export function getSpotifyEmbedUrl(url: string): string {
  const match = url.match(/spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
  if (match) return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
  return url;
}
