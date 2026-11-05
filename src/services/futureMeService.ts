// ═══════════════════════════════════════════════════════════
// FUTURE ME — Message to your future self
// ═══════════════════════════════════════════════════════════

export interface FutureMessage {
  id: string;
  message: string;
  scheduledFor: number; // timestamp
  delivered: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'mc_future_messages';

export function getFutureMessages(): FutureMessage[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function saveFutureMessage(message: string, daysFromNow: number): FutureMessage {
  const messages = getFutureMessages();
  const entry: FutureMessage = {
    id: `fm-${Date.now()}`,
    message,
    scheduledFor: Date.now() + daysFromNow * 24 * 60 * 60 * 1000,
    delivered: false,
    createdAt: Date.now(),
  };
  messages.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  return entry;
}

export function getDueMessages(): FutureMessage[] {
  const now = Date.now();
  return getFutureMessages().filter(m => !m.delivered && m.scheduledFor <= now);
}

export function markDelivered(id: string): void {
  const messages = getFutureMessages().map(m =>
    m.id === id ? { ...m, delivered: true } : m
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

export function deleteFutureMessage(id: string): void {
  const messages = getFutureMessages().filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}
