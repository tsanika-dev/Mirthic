// ═══════════════════════════════════════════════════════════
// ANTI-REPETITION ENGINE — Reusable fresh recommendations
// Ensures jokes, games, music, quotes never repeat for user
// ═══════════════════════════════════════════════════════════

const HISTORY_PREFIX = 'mc_content_history';

export interface ContentHistoryEntry {
  contentId: string;
  category: string;
  shownAt: number;
}

// ─── GET HISTORY ───────────────────────────────────

function getHistory(): ContentHistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_PREFIX) || '[]');
  } catch { return []; }
}

function saveHistory(history: ContentHistoryEntry[]): void {
  // Keep only last 500 entries
  if (history.length > 500) history.length = 500;
  localStorage.setItem(HISTORY_PREFIX, JSON.stringify(history));
}

// ─── CHECK IF SHOWN ────────────────────────────────

export function wasContentShown(contentId: string): boolean {
  const history = getHistory();
  return history.some(h => h.contentId === contentId);
}

export function markContentShown(contentId: string, category: string): void {
  const history = getHistory();
  history.unshift({ contentId, category, shownAt: Date.now() });
  saveHistory(history);
}

// ─── CLEAR HISTORY ─────────────────────────────────

export function clearContentHistory(category?: string): void {
  if (category) {
    const history = getHistory().filter(h => h.category !== category);
    saveHistory(history);
  } else {
    localStorage.removeItem(HISTORY_PREFIX);
  }
}

// ─── GET FRESH ITEMS ───────────────────────────────

export interface FreshItem {
  id: string;
}

export function getFreshItems<T extends FreshItem>(
  candidates: T[],
  category: string,
  count: number = 1
): T[] {
  const history = getHistory();
  const shownIds = new Set(history.map(h => h.contentId));

  // Filter out previously shown items
  const fresh = candidates.filter(item => !shownIds.has(item.id));

  if (fresh.length === 0) {
    // All items shown — allow oldest items back
    const sorted = [...history]
      .filter(h => h.category === category)
      .sort((a, b) => a.shownAt - b.shownAt);
    const oldestIds = new Set(sorted.slice(0, count).map(h => h.contentId));
    const recycled = candidates.filter(item => oldestIds.has(item.id));
    if (recycled.length > 0) {
      recycled.forEach(item => markContentShown(item.id, category));
      return recycled;
    }
    // Absolute fallback: just pick from start
    return candidates.slice(0, count);
  }

  // Shuffle and pick
  const shuffled = [...fresh].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  selected.forEach(item => markContentShown(item.id, category));
  return selected;
}

// ─── MOOD-BASED CATEGORY MAPPING ──────────────────

export function getMoodCategories(mood: string): string[] {
  const map: Record<string, string[]> = {
    'very_bad': ['comfort', 'gentle', 'wholesome', 'calm'],
    'bad': ['funny', 'wholesome', 'playful', 'comfort'],
    'anxious': ['silly', 'cute', 'gentle', 'calm'],
    'angry': ['playful', 'silly', 'calm'],
    'okay': ['clever', 'college', 'random', 'funny'],
    'good': ['funny', 'flirty', 'romantic', 'playful'],
    'great': ['energetic', 'silly', 'playful', 'romantic'],
  };
  return map[mood] || map['okay'];
}

// ─── DAILY SURPRISE ────────────────────────────────

const DAILY_KEY = 'mc_daily_surprise';

export function getDailySurpriseId(): string | null {
  try {
    const stored = localStorage.getItem(DAILY_KEY);
    if (stored) {
      const { date } = JSON.parse(stored);
      const today = new Date().toDateString();
      if (date === today) return null; // Already shown today
    }
  } catch { /* ignore */ }
  return 'available';
}

export function markDailySurpriseShown(): void {
  localStorage.setItem(DAILY_KEY, JSON.stringify({ date: new Date().toDateString() }));
}
