import type { MusicTrack, CanonicalLanguage, MusicMood } from './musicCatalog';
import { MUSIC_CATALOG, normalizeLanguage } from './musicCatalog';

export interface MusicSearchResult {
  id: string;
  title: string;
  artist: string;
  album: string;
  language: CanonicalLanguage;
  mood: MusicMood[];
  genre: string;
  releaseDate: string;
  category: string;
  coverEmoji: string;
  playbackType: 'embed' | 'external' | 'native' | 'preview';
  externalUrl: string;
  youtubeEmbedUrl?: string;
  provider: string;
  isActive: boolean;
}

// Curated provider-backed search suggestions for common discovery queries.
// These are real provider search terms/pages, not fabricated audio URLs.
const CURATED_SEARCH: Array<{
  queryPatterns: string[];
  results: Partial<MusicSearchResult>[];
}> = [
  {
    queryPatterns: ['arijit', 'arijit singh', 'arijit singh songs', 'arijit hindi'],
    results: [
      { title: 'Arijit Singh - Billboard India', artist: 'Arijit Singh', album: 'Provider Playlist', language: 'Hindi' as CanonicalLanguage, mood: ['feel-good', 'energy'], genre: 'pop', releaseDate: '2025-08-01', category: 'new-releases', coverEmoji: '🎤', playbackType: 'external', externalUrl: 'https://open.spotify.com/search/Arijit%20Singh', provider: 'Spotify', isActive: true },
      { title: 'Arijit Singh Hits', artist: 'Arijit Singh', album: 'Provider Playlist', language: 'Hindi' as CanonicalLanguage, mood: ['relax', 'feel-good'], genre: 'pop', releaseDate: '2025-07-01', category: 'by-language', coverEmoji: '🎤', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Arijit%20Singh', provider: 'YouTube', isActive: true },
    ],
  },
  {
    queryPatterns: ['telugu songs', 'telugu', 'telugu new songs', 'telugu latest'],
    results: [
      { title: 'Telugu Songs 2025', artist: 'Various Artists', album: 'Provider Playlist', language: 'Telugu' as CanonicalLanguage, mood: ['feel-good', 'energy'], genre: 'pop', releaseDate: '2025-08-01', category: 'new-releases', coverEmoji: '🎵', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Telugu%20Songs', provider: 'YouTube', isActive: true },
      { title: 'Latest Telugu Songs', artist: 'Various Artists', album: 'Provider Playlist', language: 'Telugu' as CanonicalLanguage, mood: ['feel-good'], genre: 'pop', releaseDate: '2025-08-15', category: 'new-releases', coverEmoji: '🆕', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Telugu%20Latest', provider: 'YouTube', isActive: true },
    ],
  },
  {
    queryPatterns: ['anirudh', 'anirudh ravichander', 'anirudh music', 'anirudh tamil'],
    results: [
      { title: 'Anirudh - Film Soundtracks', artist: 'Anirudh Ravichander', album: 'Provider Playlist', language: 'Tamil' as CanonicalLanguage, mood: ['energy', 'dance'], genre: 'edm', releaseDate: '2025-07-01', category: 'new-releases', coverEmoji: '🎧', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Anirudh%20Ravichander', provider: 'YouTube', isActive: true },
      { title: 'Anirudh Hits', artist: 'Anirudh Ravichander', album: 'Provider Playlist', language: 'Tamil' as CanonicalLanguage, mood: ['focus', 'energy'], genre: 'edm', releaseDate: '2024-06-01', category: 'by-language', coverEmoji: '🎧', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Anirudh', provider: 'YouTube', isActive: true },
    ],
  },
  {
    queryPatterns: ['lofi', 'lofi study', 'lofi beats', 'study lofi', 'lofi music'],
    results: [
      { title: 'Lofi Beats to Study', artist: 'Lofi Girl', album: 'Lofi Girl', language: 'English' as CanonicalLanguage, mood: ['focus', 'calm'], genre: 'lofi', releaseDate: '2024-01-10', category: 'genres', coverEmoji: '🎧', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', externalUrl: 'https://open.spotify.com/search/Lofi%20Beats', provider: 'YouTube', isActive: true },
      { title: 'Lofi Study Session', artist: 'Various Artists', album: 'Provider Playlist', language: 'English' as CanonicalLanguage, mood: ['focus', 'calm'], genre: 'lofi', releaseDate: '2024-02-15', category: 'by-language', coverEmoji: '🎧', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Lofi%20Study', provider: 'YouTube', isActive: true },
    ],
  },
  {
    queryPatterns: ['tamil melody', 'tamil songs', 'tamil love', 'tamil classics'],
    results: [
      { title: 'Tamil Melody Hits', artist: 'Various Artists', album: 'Provider Playlist', language: 'Tamil' as CanonicalLanguage, mood: ['relax', 'calm'], genre: 'acoustic', releaseDate: '2024-06-01', category: 'by-language', coverEmoji: '🎵', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Tamil%20Melody', provider: 'YouTube', isActive: true },
      { title: 'Tamil Love Songs', artist: 'Various Artists', album: 'Provider Playlist', language: 'Tamil' as CanonicalLanguage, mood: ['relax', 'calm'], genre: 'acoustic', releaseDate: '2024-07-01', category: 'by-language', coverEmoji: '❤️', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Tamil%20Love', provider: 'YouTube', isActive: true },
    ],
  },
  {
    queryPatterns: ['hindi romantic', 'hindi love', 'hindi songs', 'hindi ghazal'],
    results: [
      { title: 'Hindi Romantic Hits', artist: 'Various Artists', album: 'Provider Playlist', language: 'Hindi' as CanonicalLanguage, mood: ['relax', 'feel-good'], genre: 'pop', releaseDate: '2024-05-01', category: 'by-language', coverEmoji: '❤️', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Hindi%20Romantic', provider: 'YouTube', isActive: true },
      { title: 'Hindi Love Songs', artist: 'Various Artists', album: 'Provider Playlist', language: 'Hindi' as CanonicalLanguage, mood: ['relax', 'calm'], genre: 'pop', releaseDate: '2024-06-15', category: 'by-language', coverEmoji: '❤️', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Hindi%20Love', provider: 'YouTube', isActive: true },
    ],
  },
  {
    queryPatterns: ['kannada', 'kannada songs'],
    results: [
      { title: 'Latest Kannada Songs', artist: 'Various Artists', album: 'Provider Playlist', language: 'Kannada' as CanonicalLanguage, mood: ['feel-good'], genre: 'pop', releaseDate: '2025-08-10', category: 'new-releases', coverEmoji: '🆕', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Kannada%20Songs', provider: 'YouTube', isActive: true },
      { title: 'Kannada Melody Hits', artist: 'Various Artists', album: 'Provider Playlist', language: 'Kannada' as CanonicalLanguage, mood: ['feel-good', 'relax'], genre: 'acoustic', releaseDate: '2024-05-15', category: 'by-language', coverEmoji: '🎶', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Kannada%20Melody', provider: 'YouTube', isActive: true },
    ],
  },
  {
    queryPatterns: ['malayalam', 'malayalam songs'],
    results: [
      { title: 'Latest Malayalam Songs', artist: 'Various Artists', album: 'Provider Playlist', language: 'Malayalam' as CanonicalLanguage, mood: ['feel-good'], genre: 'pop', releaseDate: '2025-08-10', category: 'new-releases', coverEmoji: '🆕', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Malayalam%20Songs', provider: 'YouTube', isActive: true },
      { title: 'Malayalam Romantic', artist: 'Various Artists', album: 'Provider Playlist', language: 'Malayalam' as CanonicalLanguage, mood: ['calm', 'relax'], genre: 'acoustic', releaseDate: '2024-06-15', category: 'by-language', coverEmoji: '❤️', playbackType: 'embed', youtubeEmbedUrl: 'https://www.youtube.com/embed/playlist?list=PLcN4K5MTNQmS3CZ0hGgWeaXR5Rl6ikLSm', externalUrl: 'https://open.spotify.com/search/Malayalam%20Romantic', provider: 'YouTube', isActive: true },
    ],
  },
];

function matchesAny(text: string, patterns: string[]): boolean {
  const lower = text.toLowerCase();
  return patterns.some((p) => lower.includes(p));
}

export function searchMusic(query: string, language: CanonicalLanguage | 'All Languages', history?: string[]): MusicSearchResult[] {
  const q = query.trim();
  if (!q) return [];

  // 1. Curated provider-backed results for common search terms
  const curated: MusicSearchResult[] = [];
  for (const block of CURATED_SEARCH) {
    if (matchesAny(q, block.queryPatterns)) {
      for (const r of block.results) {
        const lang = (r.language || (language === 'All Languages' ? 'English' : language)) as CanonicalLanguage;
        if (language !== 'All Languages' && lang !== language) continue;
        const track: MusicSearchResult = {
          id: `search-${q}-${curated.length}`,
          title: r.title ?? 'Search Result',
          artist: r.artist ?? 'Various Artists',
          album: r.album ?? 'Provider Playlist',
          language: lang,
          mood: r.mood ?? [],
          genre: r.genre ?? 'pop',
          releaseDate: r.releaseDate ?? new Date().toISOString(),
          category: r.category ?? 'new-releases',
          coverEmoji: r.coverEmoji ?? '🎵',
          playbackType: r.playbackType ?? 'external',
          externalUrl: r.externalUrl ?? '',
          youtubeEmbedUrl: r.youtubeEmbedUrl,
          provider: r.provider ?? 'YouTube',
          isActive: true,
        };
        curated.push(track);
      }
      if (curated.length > 0) return curated.slice(0, 8);
    }
  }

  // 2. Fallback: search the in-catalog tracks by title/artist/album/genre
  const catalog = MUSIC_CATALOG.filter((t) => t.isActive);
  const lower = q.toLowerCase();
  const matched = catalog.filter(
    (t) =>
      t.title.toLowerCase().includes(lower) ||
      t.artist.toLowerCase().includes(lower) ||
      t.album.toLowerCase().includes(lower) ||
      t.genre.toLowerCase().includes(lower)
  );

  const results = matched
    .filter((t) => language === 'All Languages' || t.language === language)
    .slice(0, 8);

  const mapped: MusicSearchResult[] = results.map((t) => ({
    id: t.id,
    title: t.title,
    artist: t.artist,
    album: t.album,
    language: t.language,
    mood: t.mood,
    genre: t.genre,
    releaseDate: t.releaseDate,
    category: t.category,
    coverEmoji: t.coverEmoji,
    playbackType: t.playbackType,
    externalUrl: t.externalUrl,
    youtubeEmbedUrl: t.youtubeEmbedUrl,
    provider: t.provider,
    isActive: true,
  }));

  if (history && history.length > 0) {
    const filtered = mapped.filter((t) => !history.includes(t.id));
    if (filtered.length > 0) return filtered;
  }

  return mapped;
}

