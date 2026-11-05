// ═══════════════════════════════════════════════════════════
// MUSIC RECOMMENDATION ENGINE
// Language-first filtering, no English fallback, debug logging
// ═══════════════════════════════════════════════════════════

import {
  MUSIC_CATALOG,
  normalizeLanguage,
  USER_MOOD_TO_MUSIC,
  type CanonicalLanguage,
  type MusicMood,
  type MusicCategory,
  type MusicGenre,
  type MusicTrack,
} from './musicCatalog';

export interface RecommendationParams {
  language: CanonicalLanguage;
  mood?: string;
  category?: MusicCategory;
  genre?: MusicGenre;
  userHistory?: string[];  // IDs of recently played tracks
}

export interface RecommendationResult {
  tracks: MusicTrack[];
  debug: {
    selectedLanguage: string;
    normalizedLanguage: string;
    mood?: string;
    category?: string;
    genre?: string;
    candidateCount: number;
    finalCount: number;
    returnedLanguages: string[];
    hasResults: boolean;
  };
}

// ═══════════════════════════════════════════════════
// CORE: getMusicRecommendations()
// Language-first filtering. NO English fallback.
// ═══════════════════════════════════════════════════

export function getMusicRecommendations(params: RecommendationParams): RecommendationResult {
  const normalizedLang = params.language;
  const musicMood = params.mood ? USER_MOOD_TO_MUSIC[params.mood] : undefined;

  // STEP 1: Filter by language FIRST
  let candidates = MUSIC_CATALOG.filter(t => t.language === normalizedLang && t.isActive);

  const candidateCount = candidates.length;

  // STEP 2: Filter by category (if specified)
  if (params.category) {
    const catFiltered = candidates.filter(t => t.category === params.category);
    if (catFiltered.length > 0) candidates = catFiltered;
    // If no category match, keep language-only results (don't drop to other languages)
  }

  // STEP 3: Filter by mood (if specified)
  if (musicMood) {
    const moodFiltered = candidates.filter(t => t.mood.includes(musicMood));
    if (moodFiltered.length > 0) candidates = moodFiltered;
    // If no mood match, keep category+language results (don't drop to other languages)
  }

  // STEP 4: Filter by genre (if specified)
  if (params.genre) {
    const genreFiltered = candidates.filter(t => t.genre === params.genre);
    if (genreFiltered.length > 0) candidates = genreFiltered;
  }

  // STEP 5: Remove recently played tracks
  const userHistory = params.userHistory;
  if (userHistory && userHistory.length > 0) {
    const notPlayed = candidates.filter(t => !userHistory.includes(t.id));
    if (notPlayed.length > 0) candidates = notPlayed;
  }


  // STEP 6: Sort by relevance (newest first for new-releases, then by mood match)
  candidates.sort((a, b) => {
    if (a.releaseDate > b.releaseDate) return -1;
    if (a.releaseDate < b.releaseDate) return 1;
    return 0;
  });

  // HARD VALIDATION: Every returned track MUST match selected language
  const validated = candidates.filter(t => t.language === normalizedLang);

  const result = validated.slice(0, 6);

  // Debug logging (dev only)
  if (import.meta.env.DEV) {
    console.log(`[MusicRec] selectedLanguage: ${normalizedLang}`);
    console.log(`[MusicRec] mood: ${musicMood || '(none)'}, category: ${params.category || '(none)'}`);
    console.log(`[MusicRec] candidateCount: ${candidateCount}, finalCount: ${result.length}`);
    console.log(`[MusicRec] returnedLanguages: [${result.map(t => t.language).join(', ')}]`);
  }

  return {
    tracks: result,
    debug: {
      selectedLanguage: params.language,
      normalizedLanguage: normalizedLang,
      mood: musicMood,
      category: params.category,
      genre: params.genre,
      candidateCount,
      finalCount: result.length,
      returnedLanguages: result.map(t => t.language),
      hasResults: result.length > 0,
    },
  };
}

// ═══════════════════════════════════════════════════
// SEARCH — respects selected language
// ═══════════════════════════════════════════════════

export function searchMusic(
  query: string,
  language: CanonicalLanguage,
  userHistory?: string[]
): MusicTrack[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  // Search ONLY within selected language
  let results = MUSIC_CATALOG.filter(t => t.language === language && t.isActive);

  results = results.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.artist.toLowerCase().includes(q) ||
    t.album.toLowerCase().includes(q) ||
    t.genre.toLowerCase().includes(q)
  );

  // Remove recently played
  if (userHistory && userHistory.length > 0) {
    const notPlayed = results.filter(t => !userHistory.includes(t.id));
    if (notPlayed.length > 0) results = notPlayed;
  }

  return results.slice(0, 8);
}

// ═══════════════════════════════════════════════════
// MOOD MIX — sequence of tracks for a mood
// ═══════════════════════════════════════════════════

export function getMoodMix(language: CanonicalLanguage, mood: string): MusicTrack[] {
  const result = getMusicRecommendations({ language, mood });
  return result.tracks;
}

// ═══════════════════════════════════════════════════
// WHY THIS? — contextual recommendation explanation
// ═══════════════════════════════════════════════════

export function getWhyThis(
  language: CanonicalLanguage,
  mood?: string,
  category?: MusicCategory,
  genre?: MusicGenre
): string {
  const reasons: string[] = [];

  if (language !== 'English') {
    reasons.push(`you prefer ${language} music`);
  }
  if (mood) {
    const moodLabels: Record<string, string> = {
      very_bad: 'a calm moment', bad: 'relaxation', okay: 'focus',
      good: 'positive vibes', great: 'high energy',
    };
    if (moodLabels[mood]) reasons.push(`you're in the mood for ${moodLabels[mood]}`);
  }
  if (category) {
    const catLabels: Record<string, string> = {
      'new-releases': 'fresh sounds', 'dj-remix': 'electronic beats', 'old-classics': 'timeless classics',
    };
    if (catLabels[category]) reasons.push(`you enjoy ${catLabels[category]}`);
  }
  if (genre) {
    reasons.push(`${genre} music`);
  }

  if (reasons.length === 0) return 'Based on your general preferences.';
  return `Suggested because ${reasons.join(' and ')}.`;
}

// ═══════════════════════════════════════════════════
// LANGUAGE STATS — for debug panel
// ═══════════════════════════════════════════════════

export function getLanguageStats(language: CanonicalLanguage) {
  const tracks = MUSIC_CATALOG.filter(t => t.language === language && t.isActive);
  return {
    total: tracks.length,
    native: tracks.filter(t => t.playbackType === 'native').length,
    preview: tracks.filter(t => t.playbackType === 'preview').length,
    external: tracks.filter(t => t.playbackType === 'external').length,
    categories: [...new Set(tracks.map(t => t.category))],
    moods: [...new Set(tracks.flatMap(t => t.mood))],
    genres: [...new Set(tracks.map(t => t.genre))],
  };
}
