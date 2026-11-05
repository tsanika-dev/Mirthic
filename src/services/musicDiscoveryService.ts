import type { MusicLanguage } from './musicRecommendationService';

// ═══════════════════════════════════════════════════
// MUSIC DISCOVERY SERVICE
// Centralized music data with categories, genres,
// languages, moods, and playback types
// ═══════════════════════════════════════════════════

export type PlaybackType = 'preview' | 'external';
export type MusicCategory = 'for-you' | 'new-releases' | 'dj-remix' | 'old-classics' | 'by-language' | 'by-mood' | 'genres';
export type MusicGenre = 'pop' | 'lofi' | 'edm' | 'classical' | 'acoustic' | 'indie' | 'hip-hop' | 'jazz' | 'rock' | 'r&b' | 'folk' | 'ambient';
export type Decade = '60s' | '70s' | '80s' | '90s' | '2000s' | '2010s';
export type MoodCategory = 'calm' | 'focus' | 'relax' | 'feel-good' | 'energy' | 'dance' | 'sleep' | 'motivation';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  language: MusicLanguage;
  mood: MoodCategory[];
  genre: MusicGenre;
  decade?: Decade;
  releaseYear: number;
  category: MusicCategory;
  coverUrl: string;
  previewUrl?: string;
  externalUrl: string;
  provider: string;
  playbackType: PlaybackType;
  isActive: boolean;
  tags: string[];
}

export interface MusicPlaylist {
  id: string;
  title: string;
  description: string;
  coverEmoji: string;
  tracks: string[];
  language: MusicLanguage[];
  mood: MoodCategory[];
  genre: MusicGenre[];
  decade?: Decade;
  category: MusicCategory;
  spotifyUrl: string;
}


// ─── CURATED SPOTIFY PLAYLISTS ───────────────────
// Real Spotify playlists organized by category
export const MUSIC_PLAYLISTS: MusicPlaylist[] = [
  // ── For You ──────────────────────────────────
  { id: 'fy-telugu', title: 'Telugu Daily Mix', description: 'Your daily blend of Telugu favourites', coverEmoji: '🎵', tracks: [], language: ['telugu'], mood: ['feel-good', 'relax'], genre: ['pop'], category: 'for-you', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1kCIzMYtzum' },
  { id: 'fy-hindi', title: 'Hindi Daily Mix', description: 'Your daily blend of Hindi favourites', coverEmoji: '🎶', tracks: [], language: ['hindi'], mood: ['feel-good'], genre: ['pop'], category: 'for-you', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX7KNKjOK0o75' },
  { id: 'fy-english', title: 'English Discover Weekly', description: 'Fresh picks tailored for you', coverEmoji: '🎧', tracks: [], language: ['english'], mood: ['focus', 'feel-good'], genre: ['indie', 'pop'], category: 'for-you', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'fy-tamil', title: 'Tamil Daily Mix', description: 'Your daily Tamil favourites', coverEmoji: '🎤', tracks: [], language: ['tamil'], mood: ['feel-good', 'energy'], genre: ['pop'], category: 'for-you', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1kCIzMYtzum' },

  // ── New Releases ─────────────────────────────
  { id: 'nr-telugu', title: 'New Telugu Releases', description: 'Fresh Telugu tracks and albums', coverEmoji: '🆕', tracks: [], language: ['telugu'], mood: ['feel-good', 'energy'], genre: ['pop'], category: 'new-releases', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC' },
  { id: 'nr-hindi', title: 'New Hindi Releases', description: 'Latest Hindi hits and debuts', coverEmoji: '✨', tracks: [], language: ['hindi'], mood: ['energy', 'feel-good'], genre: ['pop'], category: 'new-releases', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX10zrzysJ3GK3' },
  { id: 'nr-english', title: 'New Music Friday', description: 'The very best new releases this week', coverEmoji: '🔥', tracks: [], language: ['english'], mood: ['energy', 'feel-good'], genre: ['pop', 'indie'], category: 'new-releases', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4JWsHVnHEsc' },
  { id: 'nr-tamil', title: 'New Tamil Releases', description: 'Fresh Tamil music drops', coverEmoji: '💫', tracks: [], language: ['tamil'], mood: ['feel-good'], genre: ['pop'], category: 'new-releases', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1kCIzMYtzum' },
  { id: 'nr-kannada', title: 'New Kannada Releases', description: 'Latest Kannada music', coverEmoji: '🎶', tracks: [], language: ['kannada'], mood: ['feel-good'], genre: ['pop'], category: 'new-releases', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'nr-malayalam', title: 'New Malayalam Releases', description: 'Fresh Malayalam tracks', coverEmoji: '🎵', tracks: [], language: ['malayalam'], mood: ['feel-good', 'calm'], genre: ['pop'], category: 'new-releases', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },

  // ── DJ & Remixes ─────────────────────────────
  { id: 'dj-telugu', title: 'Telugu DJ Mix', description: 'Telugu club hits and remixes', coverEmoji: '🎧', tracks: [], language: ['telugu'], mood: ['dance', 'energy'], genre: ['edm'], category: 'dj-remix', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd' },
  { id: 'dj-hindi', title: 'Hindi DJ Mix', description: 'Bollywood dance and remix anthems', coverEmoji: '🔦', tracks: [], language: ['hindi'], mood: ['dance', 'energy'], genre: ['edm'], category: 'dj-remix', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX6VYUfU5Czbi' },
  { id: 'dj-english', title: 'EDM Party Mix', description: 'High-energy EDM and dance hits', coverEmoji: '🎉', tracks: [], language: ['english'], mood: ['dance', 'energy'], genre: ['edm'], category: 'dj-remix', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd' },
  { id: 'dj-tamil', title: 'Tamil DJ Mix', description: 'Tamil dance and club remixes', coverEmoji: '💥', tracks: [], language: ['tamil'], mood: ['dance', 'energy'], genre: ['edm'], category: 'dj-remix', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'dj-kannada', title: 'Kannada DJ Mix', description: 'Kannada remix and dance tracks', coverEmoji: '⚡', tracks: [], language: ['kannada'], mood: ['dance'], genre: ['edm'], category: 'dj-remix', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'dj-malayalam', title: 'Malayalam DJ Mix', description: 'Malayalam dance remixes', coverEmoji: '🌀', tracks: [], language: ['malayalam'], mood: ['dance', 'energy'], genre: ['edm'], category: 'dj-remix', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1kCIzMYtzum' },

  // ── Old Classics ─────────────────────────────
  { id: 'oc-telugu-80s', title: 'Telugu Classics 80s', description: 'Golden era Telugu melodies', coverEmoji: '🏛️', tracks: [], language: ['telugu'], mood: ['calm', 'relax'], genre: ['classical'], decade: '80s', category: 'old-classics', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'oc-telugu-90s', title: 'Telugu Classics 90s', description: '90s Telugu golden hits', coverEmoji: '📻', tracks: [], language: ['telugu'], mood: ['feel-good', 'calm'], genre: ['classical'], decade: '90s', category: 'old-classics', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'oc-hindi-70s', title: 'Bollywood Golden Era', description: 'Timeless Bollywood classics', coverEmoji: '🎶', tracks: [], language: ['hindi'], mood: ['calm', 'relax'], genre: ['classical'], decade: '70s', category: 'old-classics', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'oc-hindi-90s', title: 'Hindi Classics 90s', description: '90s Hindi evergreen favourites', coverEmoji: '📀', tracks: [], language: ['hindi'], mood: ['feel-good', 'relax'], genre: ['classical'], decade: '90s', category: 'old-classics', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'oc-english-80s', title: '80s Classics', description: 'The best of the 80s decade', coverEmoji: '🕺', tracks: [], language: ['english'], mood: ['energy', 'feel-good'], genre: ['pop'], decade: '80s', category: 'old-classics', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4KyJ8dAlYhm' },
  { id: 'oc-english-90s', title: '90s Hits', description: '90s nostalgia and favourites', coverEmoji: '💿', tracks: [], language: ['english'], mood: ['energy', 'feel-good'], genre: ['pop', 'rock'], decade: '90s', category: 'old-classics', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXbTmwAdrJySa' },
  { id: 'oc-english-2000s', title: '2000s Nostalgia', description: 'Y2K era hits and anthems', coverEmoji: '📼', tracks: [], language: ['english'], mood: ['energy', 'feel-good'], genre: ['pop', 'hip-hop'], decade: '2000s', category: 'old-classics', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1lVhptIYRda' },
  { id: 'oc-tamil-classic', title: 'Tamil Classics', description: 'Timeless Tamil melodies', coverEmoji: '🎵', tracks: [], language: ['tamil'], mood: ['calm', 'relax'], genre: ['classical'], category: 'old-classics', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },

  // ── By Language — additional mood/language combos ──
  { id: 'bl-telugu-calm', title: 'Telugu Calm', description: 'Peaceful Telugu melodies for quiet moments', coverEmoji: '🌿', tracks: [], language: ['telugu'], mood: ['calm', 'sleep'], genre: ['acoustic'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX9tPFwDM0mo0' },
  { id: 'bl-telugu-lofi', title: 'Telugu Lo-fi', description: 'Chill Telugu lo-fi vibes', coverEmoji: '🌙', tracks: [], language: ['telugu'], mood: ['focus', 'calm'], genre: ['lofi'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'bl-telugu-energy', title: 'Telugu Energy', description: 'High-energy Telugu hits', coverEmoji: '🔥', tracks: [], language: ['telugu'], mood: ['energy', 'motivation'], genre: ['pop'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC' },
  { id: 'bl-hindi-calm', title: 'Hindi Calm', description: 'Peaceful Hindi for reflection', coverEmoji: '🕊️', tracks: [], language: ['hindi'], mood: ['calm', 'sleep'], genre: ['acoustic'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO' },
  { id: 'bl-hindi-lofi', title: 'Hindi Lo-fi', description: 'Chill Hindi lo-fi for focus', coverEmoji: '☁️', tracks: [], language: ['hindi'], mood: ['focus'], genre: ['lofi'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JBER9Bg' },
  { id: 'bl-hindi-energy', title: 'Hindi Party', description: 'Energetic Hindi party hits', coverEmoji: '🎊', tracks: [], language: ['hindi'], mood: ['energy', 'dance'], genre: ['pop'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX10zrzysJ3GK3' },
  { id: 'bl-tamil-calm', title: 'Tamil Calm', description: 'Peaceful Tamil melodies', coverEmoji: '🌸', tracks: [], language: ['tamil'], mood: ['calm', 'sleep'], genre: ['acoustic'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'bl-tamil-lofi', title: 'Tamil Lo-fi', description: 'Chill Tamil vibes', coverEmoji: '🌜', tracks: [], language: ['tamil'], mood: ['focus', 'relax'], genre: ['lofi'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'bl-kannada-calm', title: 'Kannada Calm', description: 'Peaceful Kannada songs', coverEmoji: '🍃', tracks: [], language: ['kannada'], mood: ['calm', 'relax'], genre: ['acoustic'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'bl-malayalam-calm', title: 'Malayalam Calm', description: 'Peaceful Malayalam melodies', coverEmoji: '🌺', tracks: [], language: ['malayalam'], mood: ['calm', 'relax'], genre: ['acoustic'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'bl-english-lofi', title: 'Lofi Focus', description: 'Chill beats for concentration', coverEmoji: '🎧', tracks: [], language: ['english'], mood: ['focus'], genre: ['lofi'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'bl-english-sleep', title: 'Sleep Sounds', description: 'Ambient sounds for deep rest', coverEmoji: '🌙', tracks: [], language: ['english'], mood: ['sleep', 'calm'], genre: ['ambient'], category: 'by-language', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWViPt6iQqlRh' },

  // ── By Mood ──────────────────────────────────
  { id: 'bm-calm', title: 'Deep Calm', description: 'Music designed to soothe your mind', coverEmoji: '🧘', tracks: [], language: ['telugu', 'hindi', 'english'], mood: ['calm'], genre: ['ambient', 'acoustic'], category: 'by-mood', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'bm-focus', title: 'Pure Focus', description: 'Enhance concentration and productivity', coverEmoji: '🎯', tracks: [], language: ['english', 'telugu', 'hindi'], mood: ['focus'], genre: ['lofi', 'ambient'], category: 'by-mood', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'bm-energy', title: 'High Energy', description: 'Boost your energy and motivation', coverEmoji: '⚡', tracks: [], language: ['telugu', 'hindi', 'english'], mood: ['energy', 'motivation'], genre: ['pop', 'edm'], category: 'by-mood', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC' },
  { id: 'bm-dance', title: 'Dance Party', description: 'Get moving with infectious beats', coverEmoji: '💃', tracks: [], language: ['telugu', 'hindi', 'english'], mood: ['dance'], genre: ['edm', 'pop'], category: 'by-mood', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd' },
  { id: 'bm-sleep', title: 'Sleep Well', description: 'Gentle music for a restful night', coverEmoji: '😴', tracks: [], language: ['english', 'telugu', 'hindi'], mood: ['sleep'], genre: ['ambient', 'classical'], category: 'by-mood', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWViPt6iQqlRh' },
  { id: 'bm-feelgood', title: 'Feel-Good Vibes', description: 'Songs to brighten your day', coverEmoji: '☀️', tracks: [], language: ['telugu', 'hindi', 'english'], mood: ['feel-good'], genre: ['pop', 'indie'], category: 'by-mood', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1kCIzMYtzum' },
  { id: 'bm-relax', title: 'Chill & Relax', description: 'Wind down with mellow tunes', coverEmoji: '🍃', tracks: [], language: ['telugu', 'hindi', 'english'], mood: ['relax'], genre: ['acoustic', 'folk'], category: 'by-mood', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'bm-motivation', title: 'Workout Motivation', description: 'Power through your workout', coverEmoji: '💪', tracks: [], language: ['english', 'hindi', 'telugu'], mood: ['motivation', 'energy'], genre: ['hip-hop', 'pop'], category: 'by-mood', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX7KNKjOK0o75' },

  // ── Genres ───────────────────────────────────
  { id: 'g-pop', title: 'Pop Hits', description: 'Chart-topping pop music', coverEmoji: '🎤', tracks: [], language: ['telugu', 'hindi', 'english'], mood: ['feel-good', 'energy'], genre: ['pop'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' },
  { id: 'g-lofi', title: 'Lo-fi Beats', description: 'Chill lo-fi hip-hop beats', coverEmoji: '🎧', tracks: [], language: ['english'], mood: ['focus', 'relax'], genre: ['lofi'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ' },
  { id: 'g-edm', title: 'EDM Anthems', description: 'Electronic dance music', coverEmoji: '🔊', tracks: [], language: ['english', 'hindi'], mood: ['dance', 'energy'], genre: ['edm'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4o1oenSJRJd' },
  { id: 'g-classical', title: 'Classical Essentials', description: 'Timeless classical masterpieces', coverEmoji: '🎻', tracks: [], language: ['english'], mood: ['calm', 'focus'], genre: ['classical'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'g-acoustic', title: 'Acoustic Sessions', description: 'Beautiful acoustic performances', coverEmoji: '🎸', tracks: [], language: ['telugu', 'hindi', 'english'], mood: ['calm', 'relax'], genre: ['acoustic'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'g-indie', title: 'Indie Discoveries', description: 'Underground and indie gems', coverEmoji: '🌟', tracks: [], language: ['english'], mood: ['feel-good', 'relax'], genre: ['indie'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX2sUQwD7tbmL' },
  { id: 'g-hiphop', title: 'Hip-Hop Essentials', description: 'Best hip-hop and rap tracks', coverEmoji: '🎤', tracks: [], language: ['english', 'hindi'], mood: ['energy', 'motivation'], genre: ['hip-hop'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' },
  { id: 'g-ambient', title: 'Ambient Worlds', description: 'Atmospheric and ambient soundscapes', coverEmoji: '🌌', tracks: [], language: ['english'], mood: ['sleep', 'calm', 'focus'], genre: ['ambient'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWViPt6iQqlRh' },
  { id: 'g-rnb', title: 'R&B Smooth', description: 'Smooth R&B grooves', coverEmoji: '💜', tracks: [], language: ['english'], mood: ['relax', 'feel-good'], genre: ['r&b'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' },
  { id: 'g-jazz', title: 'Jazz Lounge', description: 'Smooth jazz for relaxation', coverEmoji: '🎷', tracks: [], language: ['english'], mood: ['relax', 'calm'], genre: ['jazz'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXbITWG1ZJKYt' },
  { id: 'g-folk', title: 'Folk & World', description: 'Folk music from around the world', coverEmoji: '🪕', tracks: [], language: ['telugu', 'hindi', 'tamil', 'english'], mood: ['calm', 'relax'], genre: ['folk'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n' },
  { id: 'g-rock', title: 'Rock Classics', description: 'Legendary rock anthems', coverEmoji: '🎸', tracks: [], language: ['english'], mood: ['energy', 'motivation'], genre: ['rock'], category: 'genres', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' },
];

// ─── HELPER FUNCTIONS ────────────────────────────

export function getSpotifyEmbedUrl(url: string): string {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  if (match) return `https://open.spotify.com/embed/playlist/${match[1]}?utm_source=generator&theme=0`;
  const trackMatch = url.match(/track\/([a-zA-Z0-9]+)/);
  if (trackMatch) return `https://open.spotify.com/embed/track/${trackMatch[1]}?utm_source=generator&theme=0`;
  return url;
}

export function getPlaylistsByCategory(category: MusicCategory): MusicPlaylist[] {
  return MUSIC_PLAYLISTS.filter(p => p.category === category && p.tracks !== undefined);
}

export function getPlaylistsByLanguage(language: MusicLanguage): MusicPlaylist[] {
  return MUSIC_PLAYLISTS.filter(p => p.language.includes(language));
}

export function getPlaylistsByMood(mood: MoodCategory): MusicPlaylist[] {
  return MUSIC_PLAYLISTS.filter(p => p.mood.includes(mood));
}

export function getPlaylistsByGenre(genre: MusicGenre): MusicPlaylist[] {
  return MUSIC_PLAYLISTS.filter(p => p.genre.includes(genre));
}

export function getPlaylistsByDecade(decade: Decade): MusicPlaylist[] {
  return MUSIC_PLAYLISTS.filter(p => p.decade === decade);
}

export function getForYouPlaylists(language: MusicLanguage, mood: MoodCategory): MusicPlaylist[] {
  const forYou = MUSIC_PLAYLISTS.filter(p => p.category === 'for-you');
  const langMatch = forYou.filter(p => p.language.includes(language));
  if (langMatch.length > 0) return langMatch;
  return forYou.filter(p => p.language.includes('english'));
}

export function searchPlaylists(query: string): MusicPlaylist[] {
  const q = query.toLowerCase().trim();
  if (!q) return MUSIC_PLAYLISTS;
  return MUSIC_PLAYLISTS.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.genre.some(g => g.toLowerCase().includes(q)) ||
    p.mood.some(m => m.toLowerCase().includes(q)) ||
    p.language.some(l => l.toLowerCase().includes(q))
  );
}

export function getNewReleases(language?: MusicLanguage): MusicPlaylist[] {
  let playlists = MUSIC_PLAYLISTS.filter(p => p.category === 'new-releases');
  if (language) playlists = playlists.filter(p => p.language.includes(language));
  return playlists;
}

export function getDJRemixes(language?: MusicLanguage): MusicPlaylist[] {
  let playlists = MUSIC_PLAYLISTS.filter(p => p.category === 'dj-remix');
  if (language) playlists = playlists.filter(p => p.language.includes(language));
  return playlists;
}

export function getOldClassics(language?: MusicLanguage, decade?: Decade): MusicPlaylist[] {
  let playlists = MUSIC_PLAYLISTS.filter(p => p.category === 'old-classics');
  if (language) playlists = playlists.filter(p => p.language.includes(language));
  if (decade) playlists = playlists.filter(p => p.decade === decade);
  return playlists;
}

// ─── DISCOVERY SECTIONS ──────────────────────────

export const DISCOVERY_SECTIONS = [
  { id: 'for-you' as MusicCategory, label: 'For You', emoji: '✨' },
  { id: 'new-releases' as MusicCategory, label: 'New Releases', emoji: '🆕' },
  { id: 'dj-remix' as MusicCategory, label: 'DJ & Remixes', emoji: '🎧' },
  { id: 'old-classics' as MusicCategory, label: 'Old Classics', emoji: '🏛️' },
  { id: 'by-language' as MusicCategory, label: 'By Language', emoji: '🌐' },
  { id: 'by-mood' as MusicCategory, label: 'By Mood', emoji: '🎭' },
  { id: 'genres' as MusicCategory, label: 'Genres', emoji: '🎵' },
];

export const LANGUAGES: { value: MusicLanguage; label: string }[] = [
  { value: 'telugu', label: 'Telugu' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'malayalam', label: 'Malayalam' },
  { value: 'english', label: 'English' },
  { value: 'instrumental', label: 'Instrumental' },
];

export const MOOD_CATEGORIES: { value: MoodCategory; label: string; emoji: string }[] = [
  { value: 'calm', label: 'Calm', emoji: '🧘' },
  { value: 'focus', label: 'Focus', emoji: '🎯' },
  { value: 'relax', label: 'Relax', emoji: '🍃' },
  { value: 'feel-good', label: 'Feel Good', emoji: '☀️' },
  { value: 'energy', label: 'Energy', emoji: '⚡' },
  { value: 'dance', label: 'Dance', emoji: '💃' },
  { value: 'sleep', label: 'Sleep', emoji: '😴' },
  { value: 'motivation', label: 'Motivation', emoji: '💪' },
];

export const GENRES: { value: MusicGenre; label: string; emoji: string }[] = [
  { value: 'pop', label: 'Pop', emoji: '🎤' },
  { value: 'lofi', label: 'Lo-fi', emoji: '🎧' },
  { value: 'edm', label: 'EDM', emoji: '🔊' },
  { value: 'classical', label: 'Classical', emoji: '🎻' },
  { value: 'acoustic', label: 'Acoustic', emoji: '🎸' },
  { value: 'indie', label: 'Indie', emoji: '🌟' },
  { value: 'hip-hop', label: 'Hip-Hop', emoji: '🎤' },
  { value: 'jazz', label: 'Jazz', emoji: '🎷' },
  { value: 'rock', label: 'Rock', emoji: '🎸' },
  { value: 'r&b', label: 'R&B', emoji: '💜' },
  { value: 'folk', label: 'Folk', emoji: '🪕' },
  { value: 'ambient', label: 'Ambient', emoji: '🌌' },
];

export const DECADES: { value: Decade; label: string }[] = [
  { value: '60s', label: "60s" },
  { value: '70s', label: "70s" },
  { value: '80s', label: "80s" },
  { value: '90s', label: "90s" },
  { value: '2000s', label: "2000s" },
  { value: '2010s', label: "2010s" },
];
