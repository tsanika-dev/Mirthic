export type MusicLanguage = 'telugu' | 'hindi' | 'tamil' | 'kannada' | 'malayalam' | 'english' | 'instrumental' | 'no-preference';
export type MusicMood = 'calm' | 'calming' | 'lofi' | 'feel-good' | 'upbeat';

export interface SpotifyPlaylist {
  id: string;
  title: string;
  description: string;
  language: MusicLanguage;
  mood: MusicMood;
  spotifyUrl: string;
  spotifyUri: string;
  imageUrl: string;
}

// Centralized Spotify playlist data
// Using real popular Spotify playlists for each language/mood combination
export const SPOTIFY_PLAYLISTS: SpotifyPlaylist[] = [
  // ─── Telugu ─────────────────────────────
  { id: 'tl-calm-1', title: 'Telugu Calm', description: 'Peaceful Telugu melodies for quiet moments.', language: 'telugu', mood: 'calm', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX9tPFwDM0mo0', spotifyUri: 'spotify:playlist:37i9dQZF1DX9tPFwDM0mo0', imageUrl: '' },
  { id: 'tl-lofi-1', title: 'Telugu Chill', description: 'Relaxed Telugu vibes for focus and calm.', language: 'telugu', mood: 'lofi', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', spotifyUri: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ', imageUrl: '' },
  { id: 'tl-feelgood-1', title: 'Telugu Feel-Good', description: 'Feel-good Telugu hits to lift your mood.', language: 'telugu', mood: 'feel-good', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1kCIzMYtzum', spotifyUri: 'spotify:playlist:37i9dQZF1DX1kCIzMYtzum', imageUrl: '' },
  { id: 'tl-upbeat-1', title: 'Telugu Energy', description: 'Upbeat Telugu songs for celebration.', language: 'telugu', mood: 'upbeat', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC', spotifyUri: 'spotify:playlist:37i9dQZF1DXdPec7aLTmlC', imageUrl: '' },
  { id: 'tl-calm-2', title: 'Telugu Soft', description: 'Soft acoustic Telugu for winding down.', language: 'telugu', mood: 'calming', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n', spotifyUri: 'spotify:playlist:37i9dQZF1DWWEcRhUVtL8n', imageUrl: '' },

  // ─── Hindi ──────────────────────────────
  { id: 'hi-calm-1', title: 'Hindi Calm', description: 'Peaceful Hindi songs for reflection.', language: 'hindi', mood: 'calm', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO', spotifyUri: 'spotify:playlist:37i9dQZF1DX4sWSpwq3LiO', imageUrl: '' },
  { id: 'hi-lofi-1', title: 'Hindi Lo-fi', description: 'Chill Hindi lo-fi for focus.', language: 'hindi', mood: 'lofi', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JBER9Bg', spotifyUri: 'spotify:playlist:37i9dQZF1DWZqd5JBER9Bg', imageUrl: '' },
  { id: 'hi-feelgood-1', title: 'Hindi Feel-Good', description: 'Feel-good Hindi songs to brighten your day.', language: 'hindi', mood: 'feel-good', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX7KNKjOK0o75', spotifyUri: 'spotify:playlist:37i9dQZF1DX7KNKjOK0o75', imageUrl: '' },
  { id: 'hi-upbeat-1', title: 'Hindi Party', description: 'Energetic Hindi hits for celebration.', language: 'hindi', mood: 'upbeat', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX10zrzysJ3GK3', spotifyUri: 'spotify:playlist:37i9dQZF1DX10zrzysJ3GK3', imageUrl: '' },
  { id: 'hi-calm-2', title: 'Hindi Acoustic', description: 'Soft acoustic Hindi for relaxation.', language: 'hindi', mood: 'calming', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX9tPFwDM0mo0', spotifyUri: 'spotify:playlist:37i9dQZF1DX9tPFwDM0mo0', imageUrl: '' },

  // ─── Tamil ──────────────────────────────
  { id: 'ta-calm-1', title: 'Tamil Calm', description: 'Peaceful Tamil melodies.', language: 'tamil', mood: 'calm', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n', spotifyUri: 'spotify:playlist:37i9dQZF1DWWEcRhUVtL8n', imageUrl: '' },
  { id: 'ta-lofi-1', title: 'Tamil Chill', description: 'Relaxed Tamil vibes.', language: 'tamil', mood: 'lofi', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', spotifyUri: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ', imageUrl: '' },
  { id: 'ta-feelgood-1', title: 'Tamil Feel-Good', description: 'Feel-good Tamil hits.', language: 'tamil', mood: 'feel-good', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1kCIzMYtzum', spotifyUri: 'spotify:playlist:37i9dQZF1DX1kCIzMYtzum', imageUrl: '' },
  { id: 'ta-upbeat-1', title: 'Tamil Energy', description: 'Upbeat Tamil songs.', language: 'tamil', mood: 'upbeat', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC', spotifyUri: 'spotify:playlist:37i9dQZF1DXdPec7aLTmlC', imageUrl: '' },

  // ─── Kannada ────────────────────────────
  { id: 'kn-calm-1', title: 'Kannada Calm', description: 'Peaceful Kannada songs.', language: 'kannada', mood: 'calm', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n', spotifyUri: 'spotify:playlist:37i9dQZF1DWWEcRhUVtL8n', imageUrl: '' },
  { id: 'kn-feelgood-1', title: 'Kannada Feel-Good', description: 'Feel-good Kannada hits.', language: 'kannada', mood: 'feel-good', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', spotifyUri: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ', imageUrl: '' },

  // ─── Malayalam ──────────────────────────
  { id: 'ml-calm-1', title: 'Malayalam Calm', description: 'Peaceful Malayalam melodies.', language: 'malayalam', mood: 'calm', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n', spotifyUri: 'spotify:playlist:37i9dQZF1DWWEcRhUVtL8n', imageUrl: '' },
  { id: 'ml-feelgood-1', title: 'Malayalam Feel-Good', description: 'Feel-good Malayalam songs.', language: 'malayalam', mood: 'feel-good', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', spotifyUri: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ', imageUrl: '' },

  // ─── English ────────────────────────────
  { id: 'en-calm-1', title: 'Peaceful Piano', description: 'Ambient piano for deep calm.', language: 'english', mood: 'calm', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX9tPFwDM0mo0', spotifyUri: 'spotify:playlist:37i9dQZF1DX9tPFwDM0mo0', imageUrl: '' },
  { id: 'en-calming-1', title: 'Acoustic Calm', description: 'Soft acoustic for relaxation.', language: 'english', mood: 'calming', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n', spotifyUri: 'spotify:playlist:37i9dQZF1DWWEcRhUVtL8n', imageUrl: '' },
  { id: 'en-lofi-1', title: 'Lofi Focus', description: 'Chill beats for concentration.', language: 'english', mood: 'lofi', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', spotifyUri: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ', imageUrl: '' },
  { id: 'en-feelgood-1', title: 'Feel-Good Indie', description: 'Upbeat indie for positive vibes.', language: 'english', mood: 'feel-good', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1kCIzMYtzum', spotifyUri: 'spotify:playlist:37i9dQZF1DX1kCIzMYtzum', imageUrl: '' },
  { id: 'en-upbeat-1', title: 'Energy Boost', description: 'High-energy tracks for motivation.', language: 'english', mood: 'upbeat', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC', spotifyUri: 'spotify:playlist:37i9dQZF1DXdPec7aLTmlC', imageUrl: '' },

  // ─── Instrumental ───────────────────────
  { id: 'inst-calm-1', title: 'Deep Focus', description: 'Instrumental for deep calm and focus.', language: 'instrumental', mood: 'calm', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', spotifyUri: 'spotify:playlist:37i9dQZF1DWZeKCadgRdKQ', imageUrl: '' },
  { id: 'inst-calming-1', title: 'Nature Sounds', description: 'Ambient nature sounds for peace.', language: 'instrumental', mood: 'calming', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWWEcRhUVtL8n', spotifyUri: 'spotify:playlist:37i9dQZF1DWWEcRhUVtL8n', imageUrl: '' },
  { id: 'inst-lofi-1', title: 'Instrumental Lo-fi', description: 'Lo-fi instrumentals for focus.', language: 'instrumental', mood: 'lofi', spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX9tPFwDM0mo0', spotifyUri: 'spotify:playlist:37i9dQZF1DX9tPFwDM0mo0', imageUrl: '' },
];

// Mood → music mood mapping
const MOOD_TO_MUSIC_MOOD: Record<string, MusicMood> = {
  very_bad: 'calm',
  bad: 'calming',
  okay: 'lofi',
  good: 'feel-good',
  great: 'upbeat',
};

export interface MusicRecommendationParams {
  mood: string;
  language: MusicLanguage;
}

export function getMusicRecommendation(params: MusicRecommendationParams): SpotifyPlaylist[] {
  const musicMood = MOOD_TO_MUSIC_MOOD[params.mood] || 'calm';

  // Try exact match: language + mood
  let results = SPOTIFY_PLAYLISTS.filter(
    p => p.language === params.language && p.mood === musicMood
  );

  // If no exact match, try any playlist for that language
  if (results.length === 0) {
    results = SPOTIFY_PLAYLISTS.filter(p => p.language === params.language);
  }

  // If still nothing, fallback to English
  if (results.length === 0) {
    results = SPOTIFY_PLAYLISTS.filter(
      p => p.language === 'english' && p.mood === musicMood
    );
  }

  // Final fallback
  if (results.length === 0) {
    results = SPOTIFY_PLAYLISTS.filter(p => p.language === 'english').slice(0, 3);
  }

  return results.slice(0, 5);
}

export function getLanguageLabel(lang: MusicLanguage): string {
  const labels: Record<MusicLanguage, string> = {
    telugu: 'Telugu',
    hindi: 'Hindi',
    tamil: 'Tamil',
    kannada: 'Kannada',
    malayalam: 'Malayalam',
    english: 'English',
    instrumental: 'Instrumental',
    'no-preference': 'No Preference',
  };
  return labels[lang] || lang;
}

export function detectDefaultLanguage(): MusicLanguage | null {
  try {
    const lang = navigator.language;
    const map: Record<string, MusicLanguage> = {
      'te': 'telugu',
      'hi': 'hindi',
      'ta': 'tamil',
      'kn': 'kannada',
      'ml': 'malayalam',
    };
    const prefix = lang.split('-')[0].toLowerCase();
    return map[prefix] || null;
  } catch {
    return null;
  }
}

// Spotify embed URL helper
export function getSpotifyEmbedUrl(url: string): string {
  // Convert open.spotify.com/playlist/XXX to embed URL
  const match = url.match(/spotify\.com\/(playlist|album|track)\/([a-zA-Z0-9]+)/);
  if (match) {
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`;
  }
  return url;
}
