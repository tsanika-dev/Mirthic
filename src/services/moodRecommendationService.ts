export type MoodLevel = 'very_bad' | 'bad' | 'okay' | 'good' | 'great';

export interface MoodRecommendations {
  journalPrompt: string;
  jokeCategory: string;
  gameRecommendation: string;
  musicCategory: string;
  exerciseRecommendation: string;
  boostCards: BoostCard[];
  tone: 'gentle' | 'calm' | 'neutral' | 'positive' | 'celebratory';
  message: string;
}

export interface BoostCard {
  icon: string;
  label: string;
  action: 'write' | 'laugh' | 'play' | 'listen' | 'relax';
  description: string;
}

const RECOMMENDATIONS: Record<MoodLevel, MoodRecommendations> = {
  very_bad: {
    journalPrompt: "What is one thing you wish someone understood about how you're feeling?",
    jokeCategory: 'gentle',
    gameRecommendation: 'bubble-pop',
    musicCategory: 'calm',
    exerciseRecommendation: 'deep-breathing',
    tone: 'gentle',
    message: "You don't need to fix everything right now. Here's something gentle.",
    boostCards: [
      { icon: '✍', label: 'Write it out', action: 'write', description: 'Put your thoughts on paper' },
      { icon: '🌱', label: 'A gentle breath', action: 'relax', description: 'Take three slow breaths' },
      { icon: '🌙', label: 'Quiet moments', action: 'listen', description: 'Soft calming sounds' },
      { icon: '🫧', label: '60-second calm game', action: 'play', description: 'A tiny mindful break' },
    ],
  },
  bad: {
    journalPrompt: 'What would make the next hour feel a little easier?',
    jokeCategory: 'light',
    gameRecommendation: 'bubble-pop',
    musicCategory: 'calming',
    exerciseRecommendation: 'deep-breathing',
    tone: 'calm',
    message: "Want a tiny distraction? Here's something light.",
    boostCards: [
      { icon: '✍', label: 'Write it out', action: 'write', description: 'Express how you feel' },
      { icon: '😂', label: 'A gentle laugh', action: 'laugh', description: 'Something light and kind' },
      { icon: '🎮', label: 'Quick game', action: 'play', description: 'A simple mindful break' },
      { icon: '🎵', label: 'Calming sounds', action: 'listen', description: 'Lo-fi and acoustic' },
    ],
  },
  okay: {
    journalPrompt: "What's one small thing that went okay today?",
    jokeCategory: 'playful',
    gameRecommendation: 'memory-match',
    musicCategory: 'lofi',
    exerciseRecommendation: 'calm-mind',
    tone: 'neutral',
    message: 'Here are some things you might enjoy.',
    boostCards: [
      { icon: '✍', label: 'Reflect', action: 'write', description: 'Capture your thoughts' },
      { icon: '😂', label: 'Something funny', action: 'laugh', description: 'A playful joke' },
      { icon: '🎮', label: 'Memory match', action: 'play', description: 'Match the pairs' },
      { icon: '🎵', label: 'Focus music', action: 'listen', description: 'Lo-fi and ambient' },
    ],
  },
  good: {
    journalPrompt: 'What made you smile today?',
    jokeCategory: 'funny',
    gameRecommendation: 'reaction-game',
    musicCategory: 'feel-good',
    exerciseRecommendation: 'loving-kindness',
    tone: 'positive',
    message: "Great to hear! Here's something to keep the good vibes going.",
    boostCards: [
      { icon: '✍', label: "Capture today's joy", action: 'write', description: 'Remember this feeling' },
      { icon: '😂', label: 'Something funny', action: 'laugh', description: 'A fun joke' },
      { icon: '🎮', label: 'Quick challenge', action: 'play', description: 'Test your reflexes' },
      { icon: '🎵', label: 'Feel-good playlist', action: 'listen', description: 'Upbeat and chill' },
    ],
  },
  great: {
    journalPrompt: 'What is something you are grateful for today?',
    jokeCategory: 'celebratory',
    gameRecommendation: 'word-scramble',
    musicCategory: 'upbeat',
    exerciseRecommendation: 'loving-kindness',
    tone: 'celebratory',
    message: "Wonderful! Let's celebrate this moment.",
    boostCards: [
      { icon: '✍', label: 'Gratitude journal', action: 'write', description: 'Capture this joy' },
      { icon: '😂', label: 'Celebration joke', action: 'laugh', description: 'Something uplifting' },
      { icon: '🎮', label: 'Word scramble', action: 'play', description: 'Fun word challenge' },
      { icon: '🎵', label: 'Upbeat playlist', action: 'listen', description: 'Feel-good energy' },
    ],
  },
};

export function getMoodRecommendations(mood: MoodLevel): MoodRecommendations {
  return RECOMMENDATIONS[mood] || RECOMMENDATIONS.okay;
}

// Jokes database
export const JOKES: Record<string, string[]> = {
  gentle: [
    "Why did the scarecrow win an award? He was outstanding in his field. 🌾",
    "What do you call a lazy kangaroo? Pouch potato. 🦘",
    "Why don't eggs tell jokes? They'd crack each other up. 🥚",
  ],
  light: [
    "I told my wife she was drawing her eyebrows too high. She looked surprised. 😮",
    "What do you call a bear with no teeth? A gummy bear. 🐻",
    "Why did the math book look so sad? Because it had too many problems. 📚",
  ],
  playful: [
    "Why don't scientists trust atoms? Because they make up everything! ⚛️",
    "I'm reading a book about anti-gravity. It's impossible to put down! 📖",
    "What do you call a fake noodle? An impasta! 🍝",
  ],
  funny: [
    "Why did the scarecrow become a successful politician? He was outstanding in his field! 🎃",
    "I used to hate facial hair, but then it grew on me. 🧔",
    "What's the best thing about Switzerland? I don't know, but the flag is a big plus. 🇨🇭",
  ],
  celebratory: [
    "Why did the student eat his homework? Because the teacher told him it was a piece of cake! 🎂",
    "What do you call a dinosaur that crashes their car? A Tyrannosaurus WRECK! 🦕",
    "Parallel lines have so much in common. It's a shame they'll never meet. 📐",
  ],
  college: [
    "Why did the student bring a ladder to class? Because the course was too high-level! 🪜",
    "What's a college student's favorite meal? RAMEN-tic dinner! 🍜",
    "Why do college students love coffee? Because they're brewed for success! ☕",
  ],
  coding: [
    "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
    "There are only 10 types of people in the world: those who understand binary and those who don't. 💻",
    "A SQL query walks into a bar, sees two tables and asks... Can I join you? 🍺",
  ],
};

export function getRandomJoke(category: string): string {
  const jokes = JOKES[category] || JOKES.playful;
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// Music suggestions
export const MUSIC_SUGGESTIONS: Record<string, { title: string; mood: string; icon: string }[]> = {
  calm: [
    { title: 'Peaceful Piano', mood: 'Calm & serene', icon: '🎹' },
    { title: 'Ocean Waves', mood: 'Natural sounds', icon: '🌊' },
    { title: 'Rain on Window', mood: 'Gentle rain', icon: '🌧' },
  ],
  calming: [
    { title: 'Acoustic Café', mood: 'Warm & relaxing', icon: '🎸' },
    { title: 'Lo-fi Study', mood: 'Chill beats', icon: '🎧' },
    { title: 'Soft Guitar', mood: 'Mellow acoustic', icon: '🎵' },
  ],
  lofi: [
    { title: 'Lo-fi Focus', mood: 'Productive vibes', icon: '☕' },
    { title: 'Ambient Waves', mood: 'Dreamy sounds', icon: '🌌' },
    { title: 'Chill Beats', mood: 'Relaxed rhythm', icon: '🎶' },
  ],
  'feel-good': [
    { title: 'Sunny Day', mood: 'Upbeat acoustic', icon: '☀️' },
    { title: 'Indie Pop', mood: 'Feel-good energy', icon: '🎤' },
    { title: 'Morning Coffee', mood: 'Warm & positive', icon: '☕' },
  ],
  upbeat: [
    { title: 'Energy Boost', mood: 'Power up', icon: '⚡' },
    { title: 'Happy Vibes', mood: 'Pure joy', icon: '🌈' },
    { title: 'Celebrate', mood: 'Party mood', icon: '🎉' },
  ],
};

// Tiny challenges
export const TINY_CHALLENGES = [
  "Name 3 things you can see right now.",
  "Take 3 slow, deep breaths.",
  "Think of one person you're grateful for.",
  "Stretch your arms above your head for 10 seconds.",
  "Write one tiny win from today.",
  "Drink some water. 💧",
  "Close your eyes and listen to 3 sounds around you.",
  "Smile at yourself for 5 seconds. 😊",
  "Think of a favorite memory.",
  "Place your hand on your heart and breathe.",
];

export function getRandomChallenge(): string {
  return TINY_CHALLENGES[Math.floor(Math.random() * TINY_CHALLENGES.length)];
}
