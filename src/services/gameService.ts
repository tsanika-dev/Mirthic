export interface Game {
  id: string;
  title: string;
  icon: string;
  description: string;
  duration: string;
  mood: 'calm' | 'light' | 'playful' | 'active' | 'energetic';
}

export const GAME_LIBRARY: Game[] = [
  { id: 'bubble-pop', title: 'Bubble Pop', icon: '🫧', description: 'Tap the floating bubbles', duration: '30s', mood: 'calm' },
  { id: 'memory-match', title: 'Memory Match', icon: '🧠', description: 'Find matching pairs', duration: '2 min', mood: 'light' },
  { id: 'reaction-game', title: 'Reaction Game', icon: '⚡', description: 'Tap when the circle changes', duration: '30s', mood: 'active' },
  { id: 'word-scramble', title: 'Word Scramble', icon: '📝', description: 'Unscramble wellness words', duration: '1 min', mood: 'playful' },
  { id: 'emoji-guess', title: 'Emoji Guess', icon: '😊', description: 'Guess the word from emojis', duration: '1 min', mood: 'playful' },
  { id: 'color-match', title: 'Color Match', icon: '🎨', description: 'Match the colors quickly', duration: '30s', mood: 'active' },
  { id: 'find-star', title: 'Find the Star', icon: '⭐', description: 'Spot the hidden star', duration: '30s', mood: 'calm' },
  { id: 'sequence-memory', title: 'Sequence Memory', icon: '🔢', description: 'Remember the pattern', duration: '1 min', mood: 'light' },
  { id: 'odd-one-out', title: 'Odd One Out', icon: '🔍', description: 'Find the different one', duration: '30s', mood: 'light' },
  { id: 'tap-rhythm', title: 'Tap Rhythm', icon: '🎵', description: 'Tap along to the beat', duration: '45s', mood: 'playful' },
  { id: 'quick-trivia', title: 'Quick Trivia', icon: '❓', description: 'Fun wellness trivia', duration: '1 min', mood: 'playful' },
  { id: 'breathing-bubbles', title: 'Breathing Bubbles', icon: '🫧', description: 'Pop bubbles with your breath pace', duration: '1 min', mood: 'calm' },
  { id: 'gentle-focus', title: 'Gentle Focus', icon: '🎯', description: 'Follow the gentle target', duration: '30s', mood: 'calm' },
  { id: 'color-burst', title: 'Color Burst', icon: '💥', description: 'Tap the matching colors', duration: '30s', mood: 'energetic' },
  { id: 'star-catcher', title: 'Star Catcher', icon: '🌟', description: 'Catch falling stars', duration: '45s', mood: 'energetic' },
];

// Mood → game mood mapping
const MOOD_TO_GAME_MOOD: Record<string, Game['mood'][]> = {
  very_bad: ['calm'],
  bad: ['calm', 'light'],
  okay: ['playful', 'light'],
  good: ['active', 'playful'],
  great: ['energetic', 'active'],
};

// History management
function getGameHistory(userId: string): { gameId: string; playedAt: number }[] {
  try {
    const raw = localStorage.getItem(`mc_game_history_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function addToGameHistory(userId: string, gameId: string) {
  const history = getGameHistory(userId);
  history.unshift({ gameId, playedAt: Date.now() });
  if (history.length > 100) history.length = 100;
  localStorage.setItem(`mc_game_history_${userId}`, JSON.stringify(history));
}

export function clearGameHistory(userId: string) {
  localStorage.removeItem(`mc_game_history_${userId}`);
}

// 7-day cooldown
const GAME_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

export function getNextGame(userId: string, mood: string): Game {
  const allowedMoods = MOOD_TO_GAME_MOOD[mood] || ['playful'];
  const history = getGameHistory(userId);
  const now = Date.now();

  // Filter games matching mood
  const candidates = GAME_LIBRARY.filter(g => allowedMoods.includes(g.mood));

  // Remove games played within 7 days
  const recentlyPlayed = new Set(
    history
      .filter(h => now - h.playedAt < GAME_COOLDOWN)
      .map(h => h.gameId)
  );
  let available = candidates.filter(g => !recentlyPlayed.has(g.id));

  // Fallback: allow oldest played game
  if (available.length === 0) {
    const lastPlayed = history[0]?.gameId;
    available = candidates.filter(g => g.id !== lastPlayed);
  }

  // Absolute fallback
  if (available.length === 0) {
    available = candidates;
  }

  const game = available[Math.floor(Math.random() * available.length)];
  addToGameHistory(userId, game.id);
  return game;
}

export function recordGamePlay(userId: string, gameId: string) {
  addToGameHistory(userId, gameId);
}
