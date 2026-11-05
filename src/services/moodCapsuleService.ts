import { format } from 'date-fns';

// ═══════════════════════════════════════════════════
// MOOD CAPSULE SERVICE
// Private emotional timeline, tiny wins, before/after
// ═══════════════════════════════════════════════════

export interface MoodCapsule {
  id: string;
  date: string;
  mood: string;
  moodScore: number;
  journalEntry?: string;
  song?: string;
  activity?: string;
  tinyWin?: string;
  beforeMood?: number;
  afterMood?: number;
  createdAt: number;
}

export interface TinyWin {
  id: string;
  text: string;
  date: string;
  createdAt: number;
}

export interface BeforeAfterCheckin {
  id: string;
  trigger: string; // 'game' | 'exercise' | 'music' | 'journal'
  beforeMood: number;
  afterMood?: number;
  date: string;
  createdAt: number;
}

const STORAGE_KEYS = {
  capsules: 'mc_mood_capsules',
  tinyWins: 'mc_tiny_wins',
  checkins: 'mc_before_after_checkins',
} as const;

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── CAPSULES ────────────────────────────────────

export function getCapsules(): MoodCapsule[] {
  return load<MoodCapsule>(STORAGE_KEYS.capsules);
}

export function addCapsule(capsule: Omit<MoodCapsule, 'id' | 'createdAt'>): MoodCapsule {
  const existing = getCapsules();
  const newCapsule: MoodCapsule = {
    ...capsule,
    id: `capsule-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: Date.now(),
  };
  save(STORAGE_KEYS.capsules, [newCapsule, ...existing]);
  return newCapsule;
}

export function updateCapsule(id: string, updates: Partial<MoodCapsule>): void {
  const existing = getCapsules();
  const updated = existing.map(c => c.id === id ? { ...c, ...updates } : c);
  save(STORAGE_KEYS.capsules, updated);
}

// ─── TINY WINS ───────────────────────────────────

export function getTinyWins(): TinyWin[] {
  return load<TinyWin>(STORAGE_KEYS.tinyWins);
}

export function getTodayTinyWins(): TinyWin[] {
  const today = format(new Date(), 'yyyy-MM-dd');
  return getTinyWins().filter(w => w.date === today);
}

export function addTinyWin(text: string): TinyWin {
  const existing = getTinyWins();
  const win: TinyWin = {
    id: `win-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    text,
    date: format(new Date(), 'yyyy-MM-dd'),
    createdAt: Date.now(),
  };
  save(STORAGE_KEYS.tinyWins, [win, ...existing]);
  return win;
}

export function deleteTinyWin(id: string): void {
  const wins = getTinyWins().filter(w => w.id !== id);
  save(STORAGE_KEYS.tinyWins, wins);
}

// ─── BEFORE/AFTER CHECK-IN ───────────────────────

export function getCheckins(): BeforeAfterCheckin[] {
  return load<BeforeAfterCheckin>(STORAGE_KEYS.checkins);
}

export function addCheckin(trigger: string, beforeMood: number): BeforeAfterCheckin {
  const existing = getCheckins();
  const checkin: BeforeAfterCheckin = {
    id: `checkin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    trigger,
    beforeMood,
    date: format(new Date(), 'yyyy-MM-dd'),
    createdAt: Date.now(),
  };
  save(STORAGE_KEYS.checkins, [checkin, ...existing]);
  return checkin;
}

export function completeCheckin(id: string, afterMood: number): void {
  const existing = getCheckins();
  const updated = existing.map(c => c.id === id ? { ...c, afterMood } : c);
  save(STORAGE_KEYS.checkins, updated);
}

// ─── 5-MINUTE RESET ──────────────────────────────

export interface ResetSession {
  id: string;
  startedAt: number;
  completedAt?: number;
  steps: { name: string; completed: boolean; skipped: boolean }[];
}

export const RESET_STEPS = [
  { name: 'Breathe', duration: 60, path: '/exercises', description: '1 minute of deep breathing' },
  { name: 'Listen', duration: 60, path: '/play-listen?tab=music', description: '1 minute of calming music' },
  { name: 'Play', duration: 60, path: '/play-listen?tab=games', description: '1 minute quick game' },
  { name: 'Write', duration: 60, path: '/journal', description: '1 minute journal prompt' },
  { name: 'Check In', duration: 60, path: '/mood', description: '1 minute mood re-check' },
];

const RESET_KEY = 'mc_reset_sessions';

export function getResetSessions(): ResetSession[] {
  return load<ResetSession>(RESET_KEY);
}

export function startResetSession(): ResetSession {
  const session: ResetSession = {
    id: `reset-${Date.now()}`,
    startedAt: Date.now(),
    steps: RESET_STEPS.map(s => ({ name: s.name, completed: false, skipped: false })),
  };
  const existing = getResetSessions();
  save(RESET_KEY, [session, ...existing]);
  return session;
}

export function completeResetStep(sessionId: string, stepIndex: number): void {
  const sessions = getResetSessions();
  const updated = sessions.map(s => {
    if (s.id !== sessionId) return s;
    const steps = [...s.steps];
    steps[stepIndex] = { ...steps[stepIndex], completed: true };
    const allDone = steps.every(st => st.completed || st.skipped);
    return { steps, completedAt: allDone ? Date.now() : undefined };
  });
  save(RESET_KEY, updated);
}

export function skipResetStep(sessionId: string, stepIndex: number): void {
  const sessions = getResetSessions();
  const updated = sessions.map(s => {
    if (s.id !== sessionId) return s;
    const steps = [...s.steps];
    steps[stepIndex] = { ...steps[stepIndex], skipped: true };
    const allDone = steps.every(st => st.completed || st.skipped);
    return { steps, completedAt: allDone ? Date.now() : undefined };
  });
  save(RESET_KEY, updated);
}

// ─── "WHY THIS?" EXPLANATIONS ────────────────────

export function getWhyThis(
  language: string,
  mood: string,
  category: string,
  tags: string[]
): string {
  const reasons: string[] = [];

  if (language && language !== 'english') {
    reasons.push(`you prefer ${language} music`);
  }
  if (mood) {
    const moodMap: Record<string, string> = {
      calm: 'a calm moment',
      focus: 'deep focus',
      relax: 'relaxation',
      'feel-good': 'positive vibes',
      energy: 'high energy',
      dance: 'movement',
      sleep: 'winding down',
      motivation: 'staying motivated',
    };
    if (moodMap[mood]) reasons.push(`you're in the mood for ${moodMap[mood]}`);
  }
  if (category) {
    const catMap: Record<string, string> = {
      'new-releases': 'fresh sounds',
      'dj-remix': 'electronic beats',
      'old-classics': 'timeless classics',
    };
    if (catMap[category]) reasons.push(`you enjoy ${catMap[category]}`);
  }

  if (reasons.length === 0) {
    return 'Based on your general preferences and listening history.';
  }

  return `Suggested because ${reasons.join(' and ')}.`;
}

// ─── MOOD MIX SEQUENCES ──────────────────────────

export interface MoodMixTrack {
  title: string;
  artist: string;
  description: string;
  mood: string;
}

export function getMoodMix(mood: string): MoodMixTrack[] {
  const mixes: Record<string, MoodMixTrack[]> = {
    very_bad: [
      { title: 'Gentle Rain', artist: 'Nature Sounds', description: 'Soft rain on a window', mood: 'calm' },
      { title: 'Ambient Breath', artist: 'Sleep Sounds', description: 'Deep ambient waves', mood: 'calm' },
      { title: 'Piano Solitude', artist: 'Classical', description: 'Gentle piano for reflection', mood: 'relax' },
      { title: 'Forest Walk', artist: 'Nature Sounds', description: 'Birds and gentle wind', mood: 'calm' },
    ],
    bad: [
      { title: 'Soft Acoustic', artist: 'Acoustic Sessions', description: 'Gentle acoustic guitar', mood: 'calm' },
      { title: 'Warm Drift', artist: 'Ambient', description: 'Warm ambient textures', mood: 'relax' },
      { title: 'Evening Calm', artist: 'Lo-fi', description: 'Soft lo-fi for comfort', mood: 'calm' },
    ],
    okay: [
      { title: 'Light Focus', artist: 'Lo-fi', description: 'Easy listening lo-fi', mood: 'focus' },
      { title: 'Afternoon Breeze', artist: 'Chill', description: 'Relaxed afternoon vibes', mood: 'relax' },
      { title: 'Soft Groove', artist: 'Acoustic', description: 'Gentle rhythm', mood: 'feel-good' },
    ],
    good: [
      { title: 'Sunshine Walk', artist: 'Feel-Good', description: 'Upbeat acoustic', mood: 'feel-good' },
      { title: 'Happy Vibes', artist: 'Indie Pop', description: 'Positive energy', mood: 'feel-good' },
      { title: 'Easy Breeze', artist: 'Chill Pop', description: 'Light and cheerful', mood: 'feel-good' },
      { title: 'Good Morning', artist: 'Acoustic Pop', description: 'Start the day bright', mood: 'energy' },
    ],
    great: [
      { title: 'Celebration', artist: 'Pop Hits', description: 'Party vibes', mood: 'energy' },
      { title: 'Dance Floor', artist: 'EDM', description: 'High-energy dance', mood: 'dance' },
      { title: 'Victory Lap', artist: 'Upbeat Pop', description: 'Triumphant energy', mood: 'motivation' },
      { title: 'Golden Hour', artist: 'Indie', description: 'Feel-good indie', mood: 'feel-good' },
    ],
  };
  return mixes[mood] || mixes.okay;
}
