// ═══════════════════════════════════════════════════════════
// BRAIN DUMP SERVICE — Free writing, organizing thoughts
// ═══════════════════════════════════════════════════════════

export interface BrainDumpEntry {
  id: string;
  rawText: string;
  organized?: {
    feelings: string[];
    controllable: string[];
    nextSteps: string[];
    rightNow: string[];
  };
  createdAt: number;
}

const STORAGE_KEY = 'mc_brain_dump';

export function getBrainDumpEntries(): BrainDumpEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function saveBrainDumpEntry(text: string): BrainDumpEntry {
  const entries = getBrainDumpEntries();
  const entry: BrainDumpEntry = {
    id: `bd-${Date.now()}`,
    rawText: text,
    organized: organizeThoughts(text),
    createdAt: Date.now(),
  };
  entries.unshift(entry);
  if (entries.length > 50) entries.length = 50;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  return entry;
}

export function deleteBrainDumpEntry(id: string): void {
  const entries = getBrainDumpEntries().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function clearAllBrainDump(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── SIMPLE THOUGHT ORGANIZER ──────────────────────
// This is a simple keyword-based organizer, not AI
// Do NOT claim this is professional mental health analysis

function organizeThoughts(text: string): BrainDumpEntry['organized'] {
  const lower = text.toLowerCase();
  const sentences = text.split(/[.!?\n]+/).filter(s => s.trim().length > 3);

  const feelings: string[] = [];
  const controllable: string[] = [];
  const nextSteps: string[] = [];
  const rightNow: string[] = [];

  // Feeling detection (simple keywords)
  const feelingKeywords = ['feel', 'feeling', 'think', 'believe', 'worried', 'anxious', 'sad', 'happy', 'angry', 'stressed', 'tired', 'lonely', 'overwhelmed'];
  sentences.forEach(s => {
    if (feelingKeywords.some(k => s.toLowerCase().includes(k))) {
      feelings.push(s.trim());
    }
  });

  // Control detection
  const controlKeywords = ['can', 'could', 'able', 'try', 'change', 'improve', 'control', 'manage'];
  sentences.forEach(s => {
    if (controlKeywords.some(k => s.toLowerCase().includes(k))) {
      controllable.push(s.trim());
    }
  });

  // Next steps detection
  const stepKeywords = ['should', 'need to', 'will', 'plan', 'goal', 'todo', 'task', 'deadline'];
  sentences.forEach(s => {
    if (stepKeywords.some(k => s.toLowerCase().includes(k))) {
      nextSteps.push(s.trim());
    }
  });

  // Right now detection
  const nowKeywords = ['right now', 'today', 'this moment', 'currently', 'start'];
  sentences.forEach(s => {
    if (nowKeywords.some(k => s.toLowerCase().includes(k))) {
      rightNow.push(s.trim());
    }
  });

  // Fallbacks if nothing detected
  if (feelings.length === 0 && sentences.length > 0) feelings.push(sentences[0].trim());
  if (controllable.length === 0) controllable.push('Take a deep breath and focus on what matters most right now.');
  if (nextSteps.length === 0) nextSteps.push('Write down one small thing you can do today.');
  if (rightNow.length === 0) rightNow.push('Try a short breathing exercise or take a walk.');

  return {
    feelings: feelings.slice(0, 3),
    controllable: controllable.slice(0, 3),
    nextSteps: nextSteps.slice(0, 3),
    rightNow: rightNow.slice(0, 2),
  };
}
