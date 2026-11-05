export interface Joke {
  id: string;
  text: string;
  category: string;
  mood: 'gentle' | 'light' | 'playful' | 'funny' | 'celebratory';
}

// 60+ clean, friendly jokes across categories
const JOKE_LIBRARY: Joke[] = [
  // ─── Gentle (for very_bad) ──────────────
  { id: 'j1', text: 'Why did the scarecrow win an award? He was outstanding in his field. 🌾', category: 'puns', mood: 'gentle' },
  { id: 'j2', text: 'What do you call a lazy kangaroo? Pouch potato. 🦘', category: 'puns', mood: 'gentle' },
  { id: 'j3', text: 'Why don\'t eggs tell jokes? They\'d crack each other up. 🥚', category: 'puns', mood: 'gentle' },
  { id: 'j4', text: 'What do you call a bear with no teeth? A gummy bear. 🐻', category: 'everyday', mood: 'gentle' },
  { id: 'j5', text: 'Why did the student bring a ladder to school? Because the class was on a higher level! 🪜', category: 'college', mood: 'gentle' },
  { id: 'j6', text: 'What do you call a sleeping dinosaur? A dino-snore! 🦕', category: 'everyday', mood: 'gentle' },

  // ─── Light (for bad) ────────────────────
  { id: 'j7', text: 'I told my wife she was drawing her eyebrows too high. She looked surprised. 😮', category: 'everyday', mood: 'light' },
  { id: 'j8', text: 'Why did the math book look so sad? Because it had too many problems. 📚', category: 'college', mood: 'light' },
  { id: 'j9', text: 'I\'m reading a book about anti-gravity. It\'s impossible to put down! 📖', category: 'everyday', mood: 'light' },
  { id: 'j10', text: 'What do you call a fake noodle? An impasta! 🍝', category: 'puns', mood: 'light' },
  { id: 'j11', text: 'Why don\'t scientists trust atoms? Because they make up everything! ⚛️', category: 'coding', mood: 'light' },
  { id: 'j12', text: 'Did you hear about the mathematician who\'s afraid of negative numbers? He\'ll stop at nothing to avoid them. ➖', category: 'college', mood: 'light' },
  { id: 'j13', text: 'Why did the bicycle fall over? Because it was two-tired! 🚲', category: 'puns', mood: 'light' },
  { id: 'j14', text: 'What did the ocean say to the beach? Nothing, it just waved. 🌊', category: 'everyday', mood: 'light' },

  // ─── Playful (for okay) ─────────────────
  { id: 'j15', text: 'I used to hate facial hair, but then it grew on me. 🧔', category: 'everyday', mood: 'playful' },
  { id: 'j16', text: 'What\'s the best thing about Switzerland? I don\'t know, but the flag is a big plus. 🇨🇭', category: 'everyday', mood: 'playful' },
  { id: 'j17', text: 'Why did the scarecrow become a successful politician? He was outstanding in his field! 🎃', category: 'everyday', mood: 'playful' },
  { id: 'j18', text: 'A SQL query walks into a bar, sees two tables and asks... Can I join you? 🍺', category: 'coding', mood: 'playful' },
  { id: 'j19', text: 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛', category: 'coding', mood: 'playful' },
  { id: 'j20', text: 'What do you call a group of musical whales? An orca-stra! 🐋', category: 'puns', mood: 'playful' },
  { id: 'j21', text: 'Why was the math book unhappy? It had too many problems. 📖', category: 'college', mood: 'playful' },
  { id: 'j22', text: 'Parallel lines have so much in common. It\'s a shame they\'ll never meet. 📐', category: 'college', mood: 'playful' },
  { id: 'j23', text: 'I told a chemistry joke... there was no reaction. ⚗️', category: 'college', mood: 'playful' },
  { id: 'j24', text: 'What did the grape say when it got stepped on? Nothing, it just let out a little wine. 🍇', category: 'puns', mood: 'playful' },

  // ─── Funny (for good) ───────────────────
  { id: 'j25', text: 'I told my computer I needed a break... now it won\'t stop sending me vacation ads. 💻', category: 'coding', mood: 'funny' },
  { id: 'j26', text: 'Why did the developer go broke? Because he used up all his cache. 💰', category: 'coding', mood: 'funny' },
  { id: 'j27', text: 'What\'s a computer\'s favorite snack? Microchips! 🍟', category: 'coding', mood: 'funny' },
  { id: 'j28', text: 'Why do Java developers wear glasses? Because they don\'t C#! 👓', category: 'coding', mood: 'funny' },
  { id: 'j29', text: 'A man walks into a library and asks for books about paranoia. The librarian whispers: "They\'re right behind you!" 📚', category: 'everyday', mood: 'funny' },
  { id: 'j30', text: 'What do you call a cold dog sitting on a bunny? A chili dog on a bun! 🌭', category: 'everyday', mood: 'funny' },
  { id: 'j31', text: 'Why did the student eat his homework? Because the teacher told him it was a piece of cake! 🎂', category: 'college', mood: 'funny' },
  { id: 'j32', text: 'I\'m on a seafood diet. I see food and I eat it. 🍕', category: 'everyday', mood: 'funny' },
  { id: 'j33', text: 'Why don\'t skeletons fight each other? They don\'t have the guts. 💀', category: 'everyday', mood: 'funny' },
  { id: 'j34', text: 'What did the left eye say to the right eye? Between us, something smells. 👃', category: 'everyday', mood: 'funny' },
  { id: 'j35', text: 'I told my wifi we needed to talk. Too many connections. 📶', category: 'coding', mood: 'funny' },
  { id: 'j36', text: 'Why was the JavaScript developer sad? Because he didn\'t Node how to Express himself. 😢', category: 'coding', mood: 'funny' },

  // ─── Celebratory (for great) ────────────
  { id: 'j37', text: 'I started out with nothing, and I still have most of it left! 🎉', category: 'everyday', mood: 'celebratory' },
  { id: 'j38', text: 'What do you call a dinosaur that crashes their car? A Tyrannosaurus WRECK! 🦕', category: 'everyday', mood: 'celebratory' },
  { id: 'j39', text: 'I\'m so good at sleeping I can do it with my eyes closed! 😴', category: 'everyday', mood: 'celebratory' },
  { id: 'j40', text: 'Why did the computer go to the doctor? Because it had a virus! 🖥️', category: 'coding', mood: 'celebratory' },
  { id: 'j41', text: 'What did the paper clip say to the magnet? I find you very attractive! 🧲', category: 'everyday', mood: 'celebratory' },
  { id: 'j42', text: 'Why don\'t eggs tell jokes? They\'d crack each other up! 🥚', category: 'puns', mood: 'celebratory' },

  // ─── College ────────────────────────────
  { id: 'j43', text: 'Why did the student bring a ladder to class? Because the course was too high-level! 🪜', category: 'college', mood: 'playful' },
  { id: 'j44', text: 'What\'s a college student\'s favorite meal? RAMEN-tic dinner! 🍜', category: 'college', mood: 'playful' },
  { id: 'j45', text: 'Why do college students love coffee? Because they\'re brewed for success! ☕', category: 'college', mood: 'funny' },
  { id: 'j46', text: 'What did the professor say to the struggling student? "You\'re not failing, you\'re finding what doesn\'t work!" 📝', category: 'college', mood: 'gentle' },
  { id: 'j47', text: 'Why did the student study in the airplane? Because they wanted higher grades! ✈️', category: 'college', mood: 'funny' },

  // ─── Coding ─────────────────────────────
  { id: 'j48', text: 'There are only 10 types of people in the world: those who understand binary and those who don\'t. 💻', category: 'coding', mood: 'playful' },
  { id: 'j49', text: 'A programmer\'s wife tells him: "Go to the store and get a loaf of bread. If they have eggs, get a dozen." He comes home with 12 loaves. 🍞', category: 'coding', mood: 'funny' },
  { id: 'j50', text: 'What\'s a programmer\'s favorite hangout place? Foo Bar! 🍻', category: 'coding', mood: 'playful' },
  { id: 'j51', text: 'Why do programmers hate nature? It has too many bugs. 🐞', category: 'coding', mood: 'playful' },
  { id: 'j52', text: 'What do you call 8 hobbits? A hobbyte! 🧙', category: 'puns', mood: 'funny' },
  { id: 'j53', text: 'Why do Java developers wear glasses? Because they can\'t C#! 👓', category: 'coding', mood: 'funny' },
  { id: 'j54', text: 'Algorithm: Word used by programmers when they don\'t want to explain what they did. 🤖', category: 'coding', mood: 'playful' },
  { id: 'j55', text: 'Debugging is like being the detective in a crime movie where you are also the murderer. 🔍', category: 'coding', mood: 'funny' },

  // ─── Puns ───────────────────────────────
  { id: 'j56', text: 'I\'m reading a book about anti-gravity — it\'s impossible to put down! 📚', category: 'puns', mood: 'playful' },
  { id: 'j57', text: 'What do you call a sad strawberry? A blueberry! 🫐', category: 'puns', mood: 'gentle' },
  { id: 'j58', text: 'I used to be a banker, but I lost interest. 🏦', category: 'puns', mood: 'playful' },
  { id: 'j59', text: 'What do you call a bear that\'s stuck in the rain? A drizzly bear! 🌧️', category: 'puns', mood: 'light' },
  { id: 'j60', text: 'Time flies like an arrow. Fruit flies like a banana. 🍌', category: 'puns', mood: 'funny' },
];

// Map mood levels to joke mood categories
const MOOD_TO_JOKE_MOOD: Record<string, Joke['mood'][]> = {
  very_bad: ['gentle'],
  bad: ['light', 'gentle'],
  okay: ['playful', 'light'],
  good: ['funny', 'playful'],
  great: ['celebratory', 'funny'],
};

// History management (localStorage-based for demo, Firestore in production)
function getJokeHistory(userId: string): string[] {
  try {
    const raw = localStorage.getItem(`mc_joke_history_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function addToJokeHistory(userId: string, jokeId: string) {
  const history = getJokeHistory(userId);
  history.unshift(jokeId);
  // Keep last 200 entries
  if (history.length > 200) history.length = 200;
  localStorage.setItem(`mc_joke_history_${userId}`, JSON.stringify(history));
}

function clearJokeHistory(userId: string) {
  localStorage.removeItem(`mc_joke_history_${userId}`);
}

// 30-day cooldown in ms
const JOKE_COOLDOWN = 30 * 24 * 60 * 60 * 1000;

export function getUnseenJoke(userId: string, mood: string): Joke {
  const allowedMoods = MOOD_TO_JOKE_MOOD[mood] || ['playful'];
  const history = getJokeHistory(userId);
  const now = Date.now();

  // Filter to jokes matching mood
  const candidates = JOKE_LIBRARY.filter(j => allowedMoods.includes(j.mood));

  // Remove recently viewed (within 30 days)
  const recentIds = new Set(history.slice(0, 50)); // Check last 50
  let available = candidates.filter(j => !recentIds.has(j.id));

  // If too few available, expand to 90-day history
  if (available.length < 3) {
    const olderIds = new Set(history.slice(50, 100));
    available = candidates.filter(j => !olderIds.has(j.id));
  }

  // Final fallback: any joke from this mood that isn't the very last one
  if (available.length === 0) {
    const lastId = history[0];
    available = candidates.filter(j => j.id !== lastId);
  }

  // Absolute fallback
  if (available.length === 0) {
    available = candidates;
  }

  // Pick random from available
  const joke = available[Math.floor(Math.random() * available.length)];
  addToJokeHistory(userId, joke.id);
  return joke;
}

export function getRandomJokeForMood(userId: string, mood: string): Joke {
  return getUnseenJoke(userId, mood);
}

export { clearJokeHistory, JOKE_LIBRARY };
