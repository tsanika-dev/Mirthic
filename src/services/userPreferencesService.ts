// ═══════════════════════════════════════════════════════════
// USER PREFERENCES SERVICE — Region, Language, Content
// Reusable across all pages for personalized experience
// ═══════════════════════════════════════════════════════════

export interface UserPreferences {
  country: string;
  state: string;
  preferredLanguage: string;
  secondaryLanguage: string;
  contentLanguages: string[];
  updatedAt: number;
}

const STORAGE_KEY = 'mc_user_preferences';

// ─── DEFAULT PREFERENCES ───────────────────────────

const DEFAULT_PREFS: UserPreferences = {
  country: 'IN',
  state: '',
  preferredLanguage: 'English',
  secondaryLanguage: 'English',
  contentLanguages: ['English'],
  updatedAt: Date.now(),
};

// ─── COUNTRY / REGION DATA ─────────────────────────

export const COUNTRIES = [
  { code: 'IN', name: 'India', defaultLanguage: 'English' },
  { code: 'US', name: 'United States', defaultLanguage: 'English' },
  { code: 'GB', name: 'United Kingdom', defaultLanguage: 'English' },
  { code: 'AE', name: 'UAE', defaultLanguage: 'English' },
  { code: 'SA', name: 'Saudi Arabia', defaultLanguage: 'English' },
  { code: 'SG', name: 'Singapore', defaultLanguage: 'English' },
  { code: 'MY', name: 'Malaysia', defaultLanguage: 'English' },
  { code: 'AU', name: 'Australia', defaultLanguage: 'English' },
  { code: 'CA', name: 'Canada', defaultLanguage: 'English' },
  { code: 'OTHER', name: 'Other', defaultLanguage: 'English' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Chandigarh', 'Puducherry', 'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli', 'Lakshadweep',
];

export const LANGUAGES = [
  { code: 'Telugu', label: 'Telugu' },
  { code: 'Hindi', label: 'Hindi' },
  { code: 'Tamil', label: 'Tamil' },
  { code: 'Kannada', label: 'Kannada' },
  { code: 'Malayalam', label: 'Malayalam' },
  { code: 'English', label: 'English' },
  { code: 'Instrumental', label: 'Instrumental' },
];

// ─── HELPLINE DATA BY COUNTRY ─────────────────────

export interface Helpline {
  name: string;
  number: string;
  description: string;
  type: 'crisis' | 'support';
  available: string;
}

export const HELPLINES_BY_COUNTRY: Record<string, Helpline[]> = {
  IN: [
    { name: 'Tele-MANAS (Mental Health)', number: '14416', description: 'Government 24/7 mental health helpline. Toll-free.', type: 'crisis', available: '24/7' },
    { name: 'Tele-MANAS (Toll-free)', number: '1-800-891-4416', description: 'Alternative toll-free number for Tele-MANAS.', type: 'crisis', available: '24/7' },
    { name: 'Vandrevala Foundation', number: '1860-2662-345', description: 'Free 24/7 mental health support and crisis intervention.', type: 'crisis', available: '24/7' },
    { name: 'iCall', number: '9152987821', description: 'Professional counselling service by TISS.', type: 'support', available: 'Mon-Sat 8am-10pm' },
    { name: 'Sangath', number: '011-41198622', description: 'Mental health research and support organization.', type: 'support', available: 'Mon-Fri 10am-6pm' },
    { name: 'AASRA', number: '9820466726', description: 'Suicide prevention helpline.', type: 'crisis', available: '24/7' },
    { name: 'Emergency Services', number: '112', description: 'National emergency number for police, fire, and ambulance.', type: 'crisis', available: '24/7' },
  ],
  US: [
    { name: '988 Suicide & Crisis Lifeline', number: '988', description: 'Free, confidential 24/7 support.', type: 'crisis', available: '24/7' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Free crisis support via text message.', type: 'crisis', available: '24/7' },
    { name: 'SAMHSA Helpline', number: '1-800-662-4357', description: 'Free referrals and information service.', type: 'crisis', available: '24/7' },
    { name: 'NAMI Helpline', number: '1-800-950-6264', description: 'Information and referral service.', type: 'support', available: 'Mon-Fri 10am-10pm ET' },
    { name: 'Veterans Crisis Line', number: '1-800-273-8255 (Press 1)', description: 'Support for veterans and their families.', type: 'crisis', available: '24/7' },
    { name: 'Trevor Project (LGBTQ+)', number: '1-866-488-7386', description: 'Crisis intervention for LGBTQ+ youth.', type: 'crisis', available: '24/7' },
    { name: 'Emergency Services', number: '911', description: 'Police, fire, and medical emergency.', type: 'crisis', available: '24/7' },
  ],
  GB: [
    { name: 'Samaritans', number: '116 123', description: 'Free 24/7 emotional support.', type: 'crisis', available: '24/7' },
    { name: 'Mind Infoline', number: '0300 123 3393', description: 'Mental health information and support.', type: 'support', available: 'Mon-Fri 9am-6pm' },
    { name: 'Shout Crisis Text Line', number: 'Text SHOUT to 85258', description: 'Free 24/7 crisis text support.', type: 'crisis', available: '24/7' },
    { name: 'Emergency Services', number: '999', description: 'Police, fire, and medical emergency.', type: 'crisis', available: '24/7' },
  ],
};

// Fallback for unknown countries
const DEFAULT_HELPLINES: Helpline[] = [
  { name: 'Emergency Services', number: '112', description: 'International emergency number.', type: 'crisis', available: '24/7' },
];

// ─── BROWSER LANGUAGE DETECTION ────────────────────

export function detectBrowserLanguage(): string | null {
  try {
    const prefix = navigator.language.split('-')[0].toLowerCase();
    const map: Record<string, string> = {
      'te': 'Telugu', 'hi': 'Hindi', 'ta': 'Tamil',
      'kn': 'Kannada', 'ml': 'Malayalam',
    };
    return map[prefix] || null;
  } catch { return null; }
}

export function detectBrowserCountry(): string {
  try {
    const region = navigator.language.split('-')[1]?.toUpperCase();
    if (region && COUNTRIES.find(c => c.code === region)) return region;
    return 'IN'; // default to India
  } catch { return 'IN'; }
}

// ─── GET / SET PREFERENCES ─────────────────────────

export function getUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_PREFS, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_PREFS };
}

export function setUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences();
  const updated = { ...current, ...prefs, updatedAt: Date.now() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// ─── CONVENIENCE GETTERS ───────────────────────────

export function getUserCountry(): string {
  return getUserPreferences().country;
}

export function getUserState(): string {
  return getUserPreferences().state;
}

export function getUserLanguage(): string {
  return getUserPreferences().preferredLanguage;
}

export function getUserSecondaryLanguage(): string {
  return getUserPreferences().secondaryLanguage;
}

export function getUserContentLanguages(): string[] {
  return getUserPreferences().contentLanguages;
}

// ─── REGION-AWARE HELPERS ──────────────────────────

export function getHelplinesForCountry(country?: string): Helpline[] {
  const code = country || getUserCountry();
  return HELPLINES_BY_COUNTRY[code] || DEFAULT_HELPLINES;
}

export function getStatesForCountry(country?: string): string[] {
  const code = country || getUserCountry();
  if (code === 'IN') return INDIAN_STATES;
  return [];
}

// ─── REGION-AWARE TIPS ────────────────────────────

export const SUPPORT_TIPS = [
  { title: 'Talk to Someone You Trust', description: 'Sharing your feelings with a trusted friend, family member, or counselor can make a significant difference.' },
  { title: 'Practice Grounding', description: 'Use the 5-4-3-2-1 technique: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.' },
  { title: 'Move Your Body', description: 'Even a short 10-minute walk can help reduce stress and improve your mood.' },
  { title: 'Take Deep Breaths', description: 'Try box breathing: inhale for 4 counts, hold for 4, exhale for 4, hold for 4.' },
];

// ─── FIRST-TIME SETUP CHECK ────────────────────────

export function hasCompletedOnboarding(): boolean {
  try {
    const prefs = getUserPreferences();
    // If country is set and language is set, onboarding was done
    return !!(prefs.country && prefs.preferredLanguage && prefs.updatedAt > 0);
  } catch { return false; }
}

export function markOnboardingComplete(): void {
  setUserPreferences({ updatedAt: Date.now() });
}
