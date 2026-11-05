// ═══════════════════════════════════════════════════════════
// SMILE HUB — Jokes, Flirting, Quotes, Cute Lines
// Mood-aware, anti-repetition, age-appropriate
// ═══════════════════════════════════════════════════════════

import { getFreshItems, type FreshItem } from './antiRepetitionService';

// ─── TYPES ─────────────────────────────────────────

export type SmileGenre =
  | 'wholesome' | 'funny' | 'cute' | 'flirty' | 'romantic'
  | 'silly' | 'clever' | 'college' | 'programmer'
  | 'friendship' | 'playful' | 'desi' | 'telugu'
  | 'pop-culture' | 'cheesy' | 'comfort' | 'gentle'
  | 'energetic' | 'calm' | 'quotes' | 'motivational';

export interface SmileContent {
  id: string;
  text: string;
  genre: SmileGenre;
  mood?: string[];
}

// ─── JOKE DATABASE ─────────────────────────────────

export const JOKES: SmileContent[] = [
  // Wholesome
  { id: 'w1', text: "Why don't scientists trust atoms? Because they make up everything! 😄", genre: 'wholesome' },
  { id: 'w2', text: "What do you call a bear with no teeth? A gummy bear! 🐻", genre: 'wholesome' },
  { id: 'w3', text: "Why did the scarecrow win an award? He was outstanding in his field! 🌾", genre: 'wholesome' },
  { id: 'w4', text: "What do you call a dog that does magic tricks? A Labracadabrador! 🐕", genre: 'wholesome' },
  { id: 'w5', text: "Why don't eggs tell jokes? They'd crack each other up! 🥚", genre: 'wholesome' },
  { id: 'w6', text: "What did the ocean say to the beach? Nothing, it just waved! 🌊", genre: 'wholesome' },
  { id: 'w7', text: "Why did the bicycle fall over? Because it was two-tired! 🚲", genre: 'wholesome' },
  { id: 'w8', text: "What do you call a sleeping dinosaur? A dino-snore! 🦕", genre: 'wholesome' },

  // Funny
  { id: 'f1', text: "I told my wife she was drawing her eyebrows too high. She looked surprised! 😂", genre: 'funny' },
  { id: 'f2', text: "Why don't scientists trust atoms? Because they make up everything! ...Wait, I said that already. See? Even jokes repeat! 😅", genre: 'funny' },
  { id: 'f3', text: "I'm reading a book about anti-gravity. It's impossible to put down! 📚", genre: 'funny' },
  { id: 'f4', text: "What did the grape do when it got stepped on? Nothing, it just let out a little wine! 🍇", genre: 'funny' },
  { id: 'f5', text: "I used to hate facial hair, but then it grew on me! 😆", genre: 'funny' },
  { id: 'f6', text: "What do you call a fake noodle? An impasta! 🍝", genre: 'funny' },
  { id: 'f7', text: "Why did the math book look so sad? Because it had too many problems! 📐", genre: 'funny' },
  { id: 'f8', text: "I told my computer I needed a break. Now it keeps sending me vacation ads! 💻", genre: 'funny' },

  // Cute / Flirty
  { id: 'c1', text: "Are you a sunrise? Because you light up my world. 🌅", genre: 'cute' },
  { id: 'c2', text: "Do you have a map? Because I just got lost in your eyes. 🗺️", genre: 'cute' },
  { id: 'c3', text: "If you were a vegetable, you'd be a cute-cumber! 🥒", genre: 'cute' },
  { id: 'c4', text: "You must be a magician, because every time I look at you, everyone else disappears! ✨", genre: 'cute' },
  { id: 'c5', text: "Are you made of copper and tellurium? Because you're Cu-Te! 💕", genre: 'cute' },
  { id: 'c6', text: "I think you dropped something... my jaw! 😍", genre: 'cute' },
  { id: 'c7', text: "Can you hand me the map? I keep getting lost in your smile. 😊", genre: 'cute' },
  { id: 'c8', text: "If hugging was an Olympic sport, you'd be a gold medalist! 🏅", genre: 'cute' },

  // Flirty
  { id: 'fl1', text: "Do you believe in love at first sight, or should I walk by again? 😏", genre: 'flirty' },
  { id: 'fl2', text: "If you were a star, you'd be the brightest one in the sky. ⭐", genre: 'flirty' },
  { id: 'fl3', text: "Is your name Google? Because you have everything I've been searching for. 🔍", genre: 'flirty' },
  { id: 'fl4', text: "Do you have a Band-Aid? I just scraped my knee falling for you. 🩹", genre: 'flirty' },
  { id: 'fl5', text: "Are you a parking ticket? Because you've got FINE written all over you! 😜", genre: 'flirty' },
  { id: 'fl6', text: "I'm not a photographer, but I can picture us together. 📸", genre: 'flirty' },

  // Romantic
  { id: 'r1', text: "Every love story is beautiful, but ours is my favourite. 💕", genre: 'romantic' },
  { id: 'r2', text: "In a world full of temporary things, you are a perpetual feeling. 🌙", genre: 'romantic' },
  { id: 'r3', text: "You're my favourite notification. 🔔", genre: 'romantic' },
  { id: 'r4', text: "I didn't choose the cute life, the cute life chose me — because of you. 💗", genre: 'romantic' },
  { id: 'r5', text: "If I had a flower for every time you made me smile, I'd have an infinite garden. 🌷", genre: 'romantic' },

  // Silly
  { id: 's1', text: "Why can't a nose be 12 inches long? Because then it would be a foot! 👃", genre: 'silly' },
  { id: 's2', text: "What do you call cheese that isn't yours? Nacho cheese! 🧀", genre: 'silly' },
  { id: 's3', text: "Why did the student eat his homework? Because his teacher told him it was a piece of cake! 🎂", genre: 'silly' },
  { id: 's4', text: "What do you call a bear in the rain? A wet bear! 🐻‍❄️", genre: 'silly' },
  { id: 's5', text: "Why don't skeletons fight each other? They don't have the guts! 💀", genre: 'silly' },
  { id: 's6', text: "What did one wall say to the other wall? I'll meet you at the corner! 🏠", genre: 'silly' },

  // Clever
  { id: 'cl1', text: "I'm on a seafood diet. I see food and I eat it. 🍕", genre: 'clever' },
  { id: 'cl2', text: "The cemetery is the most popular place in town. People are dying to get in! ⚰️", genre: 'clever' },
  { id: 'cl3', text: "I told my friend 10 jokes to make him laugh. Sadly, only 3 jokes were funny. 😐", genre: 'clever' },
  { id: 'cl4', text: "Parallel lines have so much in common. It's a shame they'll never meet. 📏", genre: 'clever' },
  { id: 'cl5', text: "What's the best thing about Switzerland? I don't know, but the flag is a big plus! 🇨🇭", genre: 'clever' },

  // College
  { id: 'co1', text: "My professor's teaching style is like a broken pencil — pointless! ✏️", genre: 'college' },
  { id: 'co2', text: "College is like a dawn. Full of dragons. But also coffee. ☕", genre: 'college' },
  { id: 'co3', text: "I don't need Google. My college WiFi is so bad, I have to actually think. 🧠", genre: 'college' },
  { id: 'co4', text: "The only thing I study in college is the menu of the cafeteria. 🍔", genre: 'college' },
  { id: 'co5', text: "College: where sleep becomes a myth and deadlines become a lifestyle. 📅", genre: 'college' },

  // Programmer
  { id: 'p1', text: "There are only 10 types of people in the world: those who understand binary and those who don't. 💻", genre: 'programmer' },
  { id: 'p2', text: "Why do programmers prefer dark mode? Because light attracts bugs! 🐛", genre: 'programmer' },
  { id: 'p3', text: "A SQL query walks into a bar, sees two tables and asks: Can I join you? 🍺", genre: 'programmer' },
  { id: 'p4', text: "Why do Java developers wear glasses? Because they can't C#! 👓", genre: 'programmer' },
  { id: 'p5', text: "There's no place like 127.0.0.1 🏠", genre: 'programmer' },

  // Friendship
  { id: 'fr1', text: "Friends are the family we choose. And I'd choose you every time. 💛", genre: 'friendship' },
  { id: 'fr2', text: "A true friend stabs you in the front, not the back. 🤝", genre: 'friendship' },
  { id: 'fr3', text: "Real friends don't let you do stupid things alone! 😄", genre: 'friendship' },
  { id: 'fr4', text: "Friends don't let friends have bad hair days. Wait, we're not supposed to fix that? 💇", genre: 'friendship' },

  // Desi
  { id: 'd1', text: "Indian moms be like: 'I'm not angry, I'm just disappointed.' That's worse. 😬", genre: 'desi' },
  { id: 'd2', text: "Indian WiFi: Loading... Loading... Connection failed. But 5 stars for optimism! 📶", genre: 'desi' },
  { id: 'd3', text: "Autowala uncle said 'meter off' but his smile said 'dm for rates'. 🛺", genre: 'desi' },
  { id: 'd4', text: "My parents: 'We're not like other parents.' Also my parents: 'LOG KYA KAHENGE!' 😂", genre: 'desi' },
  { id: 'd5', text: "Dadi: 'Beta, padho.' Me: 'Dadi, I'm a grown-up.' Dadi: 'Haan, grown-up who needs to padho!' 👵", genre: 'desi' },

  // Telugu Fun
  { id: 't1', text: "Manchi pilla ante... WiFi strong ga undali! 😄", genre: 'telugu' },
  { id: 't2', text: "Life lo two important things: WiFi and Food. Baaki anni secondary! 🍛", genre: 'telugu' },
  { id: 't3', text: "Biryani ante sarriga thinali, lekapothe adi biryani kaadhu! 🍚", genre: 'telugu' },
  { id: 't4', text: "Ee roju ki artha: Life ante biryani laantidi, spicy ga undali! 🌶️", genre: 'telugu' },

  // Pop Culture
  { id: 'pc1', text: "I'm not lazy, I'm on energy-saving mode! 🔋", genre: 'pop-culture' },
  { id: 'pc2', text: "My phone's battery lasts longer than most of my relationships. 📱", genre: 'pop-culture' },
  { id: 'pc3', text: "Adulting is like magic but backwards: you start with money and end up tired. 🪄", genre: 'pop-culture' },
  { id: 'pc4', text: "Netflix asked if I'm still watching. I'm watching life scroll by. 😅", genre: 'pop-culture' },

  // Cheesy
  { id: 'ch1', text: "Are you a camera? Because every time I look at you, I smile! 📷", genre: 'cheesy' },
  { id: 'ch2', text: "Do you have a map? Because I just keep getting lost in your eyes. 🗺️", genre: 'cheesy' },
  { id: 'ch3', text: "If beauty were time, you'd be an eternity! ⏳", genre: 'cheesy' },

  // Comfort
  { id: 'cf1', text: "It's okay to not be okay. You're doing better than you think. 💙", genre: 'comfort' },
  { id: 'cf2', text: "Even the darkest night will end, and the sun will rise again. 🌅", genre: 'comfort' },
  { id: 'cf3', text: "You are not alone. You matter, and you are loved. 💚", genre: 'comfort' },
  { id: 'cf4', text: "It's okay to take things one step at a time. You're doing enough. 🌱", genre: 'comfort' },
  { id: 'cf5', text: "Be gentle with yourself. You're doing the best you can. 💛", genre: 'comfort' },

  // Gentle
  { id: 'g1', text: "The sun is always there, even behind the clouds. ☀️", genre: 'gentle' },
  { id: 'g2', text: "Every storm runs out of rain. 🌧️→🌈", genre: 'gentle' },
  { id: 'g3', text: "This too shall pass. And you'll be stronger for it. 🌿", genre: 'gentle' },

  // Motivational
  { id: 'm1', text: "The only impossible journey is the one you never begin. 🚀", genre: 'motivational' },
  { id: 'm2', text: "You don't have to be perfect to be amazing. ⭐", genre: 'motivational' },
  { id: 'm3', text: "Small steps every day lead to big changes. 📈", genre: 'motivational' },
  { id: 'm4', text: "Your potential is endless. Don't let anyone dim your light. ✨", genre: 'motivational' },
  { id: 'm5', text: "Believe you can and you're already halfway there. 💪", genre: 'motivational' },

  // Quotes
  { id: 'q1', text: '"Be yourself; everyone else is already taken." — Oscar Wilde 📝', genre: 'quotes' },
  { id: 'q2', text: '"In the middle of difficulty lies opportunity." — Albert Einstein 📝', genre: 'quotes' },
  { id: 'q3', text: '"The only way to do great work is to love what you do." — Steve Jobs 📝', genre: 'quotes' },
  { id: 'q4', text: '"Happiness is not something ready-made. It comes from your own actions." — Dalai Lama 📝', genre: 'quotes' },
  { id: 'q5', text: '"You miss 100% of the shots you don\'t take." — Wayne Gretzky 📝', genre: 'quotes' },
];

// ─── GET FRESH SMILE CONTENT ───────────────────────

export function getFreshJoke(count: number = 1): SmileContent[] {
  return getFreshItems(JOKES, 'smile-jokes', count);
}

export function getFreshByGenre(genre: SmileGenre, count: number = 1): SmileContent[] {
  const filtered = JOKES.filter(j => j.genre === genre);
  return getFreshItems(filtered, `smile-${genre}`, count);
}

export function getMoodAppropriateContent(mood: string, count: number = 3): SmileContent[] {
  const moodGenreMap: Record<string, SmileGenre[]> = {
    'very_bad': ['comfort', 'gentle', 'wholesome', 'calm'],
    'bad': ['funny', 'wholesome', 'playful', 'comfort'],
    'anxious': ['silly', 'cute', 'gentle', 'calm'],
    'angry': ['playful', 'silly', 'calm'],
    'okay': ['clever', 'college', 'funny', 'pop-culture'],
    'good': ['funny', 'flirty', 'romantic', 'playful'],
    'great': ['energetic', 'silly', 'playful', 'romantic'],
  };

  const genres = moodGenreMap[mood] || moodGenreMap['okay'];
  const candidates = JOKES.filter(j => genres.includes(j.genre));
  return getFreshItems(candidates, 'smile-mood', count);
}


// ─── ALL GENRES ────────────────────────────────────

export const SMILE_GENRES: { id: SmileGenre; label: string; emoji: string }[] = [
  { id: 'wholesome', label: 'Wholesome', emoji: '🫶' },
  { id: 'funny', label: 'Funny', emoji: '😂' },
  { id: 'cute', label: 'Cute', emoji: '🥰' },
  { id: 'flirty', label: 'Flirty', emoji: '😏' },
  { id: 'romantic', label: 'Romantic', emoji: '💘' },
  { id: 'silly', label: 'Silly', emoji: '🤪' },
  { id: 'clever', label: 'Clever', emoji: '🧠' },
  { id: 'college', label: 'College Life', emoji: '🎓' },
  { id: 'programmer', label: 'Programmer', emoji: '💻' },
  { id: 'friendship', label: 'Friendship', emoji: '🫂' },
  { id: 'playful', label: 'Playful Teasing', emoji: '🌶️' },
  { id: 'desi', label: 'Desi', emoji: '🇮🇳' },
  { id: 'telugu', label: 'Telugu Fun', emoji: '🗣️' },
  { id: 'pop-culture', label: 'Pop Culture', emoji: '🎬' },
  { id: 'cheesy', label: 'Cheesy', emoji: '🧀' },
  { id: 'comfort', label: 'Comfort', emoji: '💙' },
  { id: 'gentle', label: 'Gentle', emoji: '🌿' },
  { id: 'motivational', label: 'Motivational', emoji: '💪' },
  { id: 'quotes', label: 'Quotes', emoji: '✨' },
];

// ─── "WHAT DO I NEED?" RESPONSES ──────────────────

export interface NeedResponse {
  message: string;
  actions: { label: string; icon: string; route: string }[];
}

export function getNeedResponse(need: string, mood: string): NeedResponse {
  const responses: Record<string, NeedResponse> = {
    comfort: {
      message: "💙 I'm here with you. Let's take this one moment at a time.",
      actions: [
        { label: 'Write it out', icon: '📝', route: '/mood' },
        { label: 'Take a breath', icon: '🌬️', route: '/self-care' },
        { label: 'Listen gently', icon: '🎵', route: '/play-listen' },
        { label: 'Read something supportive', icon: '📚', route: '/articles' },
      ],
    },
    laugh: {
      message: "😂 Let's find something to smile about!",
      actions: [
        { label: 'Get a joke', icon: '😂', route: '/play-listen' },
        { label: 'Play a game', icon: '🎮', route: '/play-listen' },
        { label: 'Hear something fun', icon: '🎵', route: '/play-listen' },
      ],
    },
    calm: {
      message: "🧘 Let's slow down and breathe together.",
      actions: [
        { label: 'Breathing exercise', icon: '🌬️', route: '/self-care' },
        { label: 'Meditation', icon: '🧘', route: '/self-care' },
        { label: 'Calming music', icon: '🎵', route: '/play-listen' },
      ],
    },
    motivate: {
      message: "⚡ You've got this. Let me remind you how far you've come.",
      actions: [
        { label: 'Read motivation', icon: '📚', route: '/articles' },
        { label: 'Set a goal', icon: '🎯', route: '/mood' },
        { label: 'Energetic music', icon: '🎵', route: '/play-listen' },
      ],
    },
    talk: {
      message: "💬 Let's talk. I'm listening.",
      actions: [
        { label: 'Mirthic AI', icon: '💬', route: '/community' },
        { label: 'Journal it', icon: '📝', route: '/mood' },
        { label: 'Find support', icon: '🫂', route: '/resources' },
      ],
    },
    distract: {
      message: "✨ Let's take your mind off things for a bit.",
      actions: [
        { label: 'Play a game', icon: '🎮', route: '/play-listen' },
        { label: 'Get a joke', icon: '😂', route: '/play-listen' },
        { label: 'Listen to music', icon: '🎵', route: '/play-listen' },
        { label: 'Read something fun', icon: '📚', route: '/articles' },
      ],
    },
  };
  return responses[need] || responses.comfort;
}
