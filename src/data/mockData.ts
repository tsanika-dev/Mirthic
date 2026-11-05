import type { MoodEntry, JournalEntry, Article, Exercise, CommunityPost, Notification, MoodDataPoint } from '../types'

export const MOOD_CONFIG = {
  very_bad: { emoji: '😞', label: 'Very Bad', color: '#ef4444', value: 1 },
  bad: { emoji: '😕', label: 'Bad', color: '#f97316', value: 2 },
  okay: { emoji: '😐', label: 'Okay', color: '#eab308', value: 3 },
  good: { emoji: '🙂', label: 'Good', color: '#22c55e', value: 4 },
  great: { emoji: '😄', label: 'Great', color: '#14b8a6', value: 5 },
} as const

export const MOOD_TAGS = [
  'Stress', 'Study', 'Sleep', 'Family', 'Friends', 'Work', 'Health', 'Exercise', 'Meditation', 'Other'
]

export const COMMUNITY_CATEGORIES = [
  'General', 'Stress', 'College Life', 'Relationships', 'Self Care', 'Motivation'
]

export const ARTICLE_CATEGORIES = [
  'All', 'Stress', 'Anxiety', 'Depression', 'Sleep', 'Relationships', 'Self-esteem', 'Mindfulness'
]

export const SELF_CARE_CATEGORIES = [
  'All', 'Daily Care', 'Sleep', 'Mindfulness', 'Healthy Habits'
]

export const EXERCISE_CATEGORIES = [
  'All', 'Breathing', 'Meditation', 'Relaxation', 'Sleep'
]

export const mockMoodHistory: MoodEntry[] = [
  { id: '1', userId: '1', mood: 'good', note: 'Had a productive day at work', tags: ['Work'], date: '2026-09-01' },
  { id: '2', userId: '1', mood: 'great', note: 'Morning meditation helped a lot', tags: ['Meditation', 'Exercise'], date: '2026-08-31' },
  { id: '3', userId: '1', mood: 'okay', note: 'Feeling a bit tired', tags: ['Sleep'], date: '2026-08-30' },
  { id: '4', userId: '1', mood: 'bad', note: 'Stressful day with deadlines', tags: ['Stress', 'Work'], date: '2026-08-29' },
  { id: '5', userId: '1', mood: 'good', note: 'Good lunch with friends', tags: ['Friends'], date: '2026-08-28' },
  { id: '6', userId: '1', mood: 'great', note: 'Great workout and healthy meal', tags: ['Exercise', 'Health'], date: '2026-08-27' },
  { id: '7', userId: '1', mood: 'okay', note: 'Quiet day at home', tags: ['Family'], date: '2026-08-26' },
]

export const mockWeeklyMoodData: MoodDataPoint[] = [
  { date: 'Mon', mood: 4, label: 'Good' },
  { date: 'Tue', mood: 5, label: 'Great' },
  { date: 'Wed', mood: 3, label: 'Okay' },
  { date: 'Thu', mood: 2, label: 'Bad' },
  { date: 'Fri', mood: 4, label: 'Good' },
  { date: 'Sat', mood: 5, label: 'Great' },
  { date: 'Sun', mood: 3, label: 'Okay' },
]

export const mockMonthlyMoodData: MoodDataPoint[] = [
  { date: 'Week 1', mood: 3.8, label: 'Good' },
  { date: 'Week 2', mood: 4.2, label: 'Good' },
  { date: 'Week 3', mood: 3.5, label: 'Okay' },
  { date: 'Week 4', mood: 4.0, label: 'Good' },
]

export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1', userId: '1', title: 'A Reflective Day',
    content: 'Today I took some time to think about what truly matters to me. I realized that I need to prioritize my mental health more consistently. I want to develop a routine that includes meditation and regular exercise. The small steps matter most.',
    mood: 'good', tags: ['Self Care', 'Meditation'], createdAt: '2026-09-01T10:30:00Z', updatedAt: '2026-09-01T10:30:00Z'
  },
  {
    id: '2', userId: '1', title: 'Dealing with Stress',
    content: 'Work has been overwhelming lately. I had a conversation with my manager about redistributing some tasks. It felt good to speak up for myself. I also tried the deep breathing exercise before my meeting and it really helped calm my nerves.',
    mood: 'okay', tags: ['Stress', 'Work'], createdAt: '2026-08-30T14:00:00Z', updatedAt: '2026-08-30T14:00:00Z'
  },
  {
    id: '3', userId: '1', title: 'Gratitude Journal',
    content: 'Today I am grateful for my friends who checked in on me. Sometimes the smallest gestures mean the most. I went for a walk in the park and felt genuinely peaceful for the first time in a while.',
    mood: 'great', tags: ['Friends', 'Health'], createdAt: '2026-08-28T09:00:00Z', updatedAt: '2026-08-28T09:00:00Z'
  },
  {
    id: '4', userId: '1', title: 'Sleep Struggles',
    content: 'Another night of poor sleep. I need to address my screen time before bed. I am going to try reading instead of scrolling through my phone. The sleep meditation exercise on MindCare looked promising too.',
    mood: 'bad', tags: ['Sleep'], createdAt: '2026-08-26T22:00:00Z', updatedAt: '2026-08-26T22:00:00Z'
  },
]

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Understanding Stress and How to Manage It',
    category: 'Stress',
    description: 'Learn about the science behind stress and discover practical techniques to manage it effectively in your daily life.',
    content: `Stress is a natural response to challenges and threats, but when it becomes chronic, it can significantly impact our mental and physical health.

**What is Stress?**

Stress is your body's response to demands or threats. When you feel threatened, your nervous system responds by releasing a flood of stress hormones, including adrenaline and cortisol.

**Common Signs of Stress:**

• Headaches and muscle tension
• Difficulty sleeping
• Anxiety and restlessness
• Lack of motivation
• Feeling overwhelmed

**Effective Stress Management Techniques:**

1. **Deep Breathing** — Practice diaphragmatic breathing for 5-10 minutes daily
2. **Physical Exercise** — Regular activity reduces stress hormones
3. **Time Management** — Prioritize tasks and set realistic goals
4. **Social Connection** — Talk to trusted friends or family
5. **Mindfulness** — Stay present and practice meditation

**When to Seek Help:**

If stress feels unmanageable, consider speaking with a mental health professional. Seeking help is a sign of strength, not weakness.`,
    readingTime: 8,
    image: '🧘'
  },
  {
    id: '2',
    title: 'How to Build Emotional Resilience',
    category: 'Self-esteem',
    description: 'Discover practical strategies to strengthen your emotional resilience and navigate life challenges with greater confidence.',
    content: `Emotional resilience is the ability to adapt to stressful situations and bounce back from difficult experiences.

**What is Emotional Resilience?**

Resilience doesn't mean you won't experience difficulty or distress. Rather, it means you have the tools to cope with challenges and recover from setbacks.

**Building Your Resilience:**

• **Practice Self-Compassion** — Treat yourself with the same kindness you'd offer a friend
• **Maintain Connections** — Build and nurture supportive relationships
• **Find Purpose** — Engage in activities that give you a sense of meaning
• **Stay Optimistic** — Focus on what you can control
• **Embrace Change** — View change as an opportunity for growth

**Daily Resilience Practices:**

Start with small steps:
- Write down three things you're grateful for each day
- Practice saying "no" to protect your energy
- Take breaks when you need them
- Celebrate small victories`,
    readingTime: 6,
    image: '💪'
  },
  {
    id: '3',
    title: 'Self Care Habits for a Better You',
    category: 'Mindfulness',
    description: 'Explore essential self care habits that can help you feel more balanced, energized, and at peace.',
    content: `Self care isn't selfish — it's essential. Taking care of yourself helps you stay healthy and better handle life's challenges.

**Physical Self Care:**

• Get 7-9 hours of sleep each night
• Move your body for at least 30 minutes daily
• Eat nutritious, balanced meals
• Stay hydrated throughout the day

**Emotional Self Care:**

• Allow yourself to feel your emotions
• Practice journaling
• Set healthy boundaries
• Connect with people who lift you up

**Mental Self Care:**

• Read for pleasure
• Limit social media consumption
• Learn something new
• Practice mindfulness or meditation

**Social Self Care:**

• Spend quality time with loved ones
• Join a community or group
• Volunteer for a cause you care about

Remember: Self care looks different for everyone. Find what works for you and make it a non-negotiable part of your routine.`,
    readingTime: 5,
    image: '🌿'
  },
  {
    id: '4',
    title: 'Breaking the Stigma Around Mental Health',
    category: 'Stress',
    description: 'Understanding why mental health stigma exists and how we can work together to break down these barriers.',
    content: `Mental health stigma prevents many people from seeking the help they need. Understanding and challenging these stigmas is crucial.

**The Impact of Stigma:**

• People avoid seeking help
• Feelings of shame and isolation increase
• Relationships suffer
• Recovery takes longer

**Common Misconceptions:**

❌ "Mental health issues are a sign of weakness"
✅ Mental health conditions are medical conditions — they are not a choice or character flaw

❌ "You should just snap out of it"
✅ Recovery takes time, support, and often professional treatment

❌ "Only certain types of people have mental health issues"
✅ Mental health affects everyone regardless of age, gender, or background

**How to Help Break the Stigma:**

1. Talk openly about mental health
2. Educate yourself and others
3. Choose your language carefully
4. Show compassion and empathy
5. Support mental health awareness initiatives

**Remember:** Seeking help is brave. You are not alone.`,
    readingTime: 7,
    image: '💚'
  },
  {
    id: '5',
    title: 'Better Sleep Habits for Mental Wellness',
    category: 'Sleep',
    description: 'Learn how quality sleep impacts your mental health and discover tips for building better sleep habits.',
    content: `Sleep and mental health are deeply connected. Poor sleep can worsen mental health conditions, and mental health issues can disrupt sleep.

**Why Sleep Matters:**

• Brain processes emotions during sleep
• Memory consolidation happens during rest
• Physical recovery and immune function depend on sleep

**Building Better Sleep Habits:**

1. **Keep a Consistent Schedule** — Go to bed and wake up at the same time
2. **Create a Restful Environment** — Cool, dark, quiet room
3. **Limit Screen Time** — Stop using devices 1 hour before bed
4. **Watch What You Consume** — Avoid caffeine after 2 PM
5. **Wind Down** — Develop a calming bedtime routine

**Sleep-Friendly Activities:**

• Reading a physical book
• Gentle stretching
• Listening to calming music
• Practicing the 4-7-8 breathing technique
• Writing in a gratitude journal

**When to Seek Help:**

If you consistently struggle with sleep despite good habits, consider speaking with a healthcare provider.`,
    readingTime: 6,
    image: '😴'
  },
  {
    id: '6',
    title: 'Mindfulness for Everyday Life',
    category: 'Mindfulness',
    description: 'Simple mindfulness practices you can incorporate into your daily routine for improved mental clarity.',
    content: `Mindfulness is the practice of being fully present in the moment. It's simple to learn and profoundly beneficial.

**Benefits of Mindfulness:**

• Reduced stress and anxiety
• Improved focus and concentration
• Better emotional regulation
• Enhanced self-awareness
• Greater sense of calm

**Easy Ways to Practice:**

1. **Morning Mindfulness** — Spend 5 minutes focusing on your breath before starting your day
2. **Mindful Eating** — Pay full attention to the taste, texture, and smell of your food
3. **Walking Meditation** — Focus on each step and your surroundings
4. **Body Scan** — Slowly move your attention through each part of your body
5. **Gratitude Practice** — Notice three things you're thankful for each day

**Tips for Success:**

• Start with just 5 minutes daily
• Be patient with yourself
• Use guided meditations if helpful
• Practice consistently, even on busy days
• Remember: there's no "perfect" way to be mindful`,
    readingTime: 5,
    image: '🧘‍♂️'
  },
]

export const mockExercises: Exercise[] = [
  {
    id: '1', title: 'Deep Breathing', category: 'breathing', duration: 5,
    description: 'A simple but powerful technique to calm your nervous system and reduce anxiety. Focus on slow, deep breaths to activate your body\'s relaxation response.'
  },
  {
    id: '2', title: 'Body Scan Meditation', category: 'meditation', duration: 10,
    description: 'A gentle practice of bringing awareness to each part of your body. This helps release tension and promotes deep relaxation.'
  },
  {
    id: '3', title: 'Progressive Muscle Relaxation', category: 'relaxation', duration: 8,
    description: 'Systematically tense and release different muscle groups to relieve physical tension and promote mental calmness.'
  },
  {
    id: '4', title: 'Calm Your Mind', category: 'meditation', duration: 7,
    description: 'A guided meditation focused on quieting racing thoughts and finding a peaceful mental state. Perfect for moments of overwhelm.'
  },
  {
    id: '5', title: 'Sleep Meditation', category: 'sleep', duration: 15,
    description: 'A soothing guided meditation designed to help you drift into restful sleep. Features gentle imagery and breathing cues.'
  },
  {
    id: '6', title: '4-7-8 Breathing', category: 'breathing', duration: 4,
    description: 'An ancient breathing technique known for its calming effects. Inhale for 4 seconds, hold for 7, exhale for 8.'
  },
  {
    id: '7', title: 'Loving Kindness Meditation', category: 'meditation', duration: 12,
    description: 'Cultivate compassion for yourself and others through this heartwarming meditation practice. Great for improving mood and relationships.'
  },
  {
    id: '8', title: 'Gentle Stretch & Relax', category: 'relaxation', duration: 10,
    description: 'A sequence of gentle stretches paired with deep breathing to release physical tension and calm your mind.'
  },
]

export const mockSelfCareActivities = [
  { id: '1', title: 'Daily Self Care Tips', category: 'Daily Care', icon: '🌅', description: 'Start your day with intention. Small morning rituals like stretching, journaling, or enjoying a quiet cup of tea can set a positive tone for the entire day.' },
  { id: '2', title: 'Building Healthy Habits', category: 'Healthy Habits', icon: '🌱', description: 'Small, consistent changes lead to lasting results. Focus on one habit at a time and celebrate your progress along the way.' },
  { id: '3', title: 'Positive Thinking', category: 'Mindfulness', icon: '☀️', description: 'Train your mind to notice the good. Practice reframing negative thoughts and cultivating gratitude for the everyday moments.' },
  { id: '4', title: 'Sleep Better', category: 'Sleep', icon: '🌙', description: 'Quality sleep is the foundation of mental wellness. Create a calming bedtime routine and protect your sleep schedule.' },
  { id: '5', title: 'Digital Detox', category: 'Daily Care', icon: '📵', description: 'Take intentional breaks from screens. Even 30 minutes of device-free time can reduce stress and improve your mood.' },
  { id: '6', title: 'Healthy Routine', category: 'Healthy Habits', icon: '🗓️', description: 'Structure brings comfort. Build a daily routine that includes movement, nourishment, rest, and meaningful activities.' },
]

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1', userId: '2', anonymousName: 'Calm Breeze',
    content: 'Feeling overwhelmed with college lately. Any tips for managing everything at once?',
    category: 'College Life', createdAt: '2026-09-01T08:00:00Z', likes: 14,
    replies: [
      { id: '1', userId: '3', anonymousName: 'Gentle River', content: 'I totally understand. Try breaking tasks into smaller pieces and celebrate each small win. You got this! 💙', createdAt: '2026-09-01T09:00:00Z', likes: 5 },
      { id: '2', userId: '4', anonymousName: 'Peaceful Mind', content: 'Prioritize sleep and self-care too. You can\'t pour from an empty cup. Take it one day at a time.', createdAt: '2026-09-01T10:30:00Z', likes: 8 },
    ]
  },
  {
    id: '2', userId: '5', anonymousName: 'Warm Sun',
    content: 'Today I told myself "I am enough" and it felt really good. Sometimes we need to hear our own kind words. Sending love to everyone here. 💚',
    category: 'Motivation', createdAt: '2026-08-31T14:00:00Z', likes: 23,
    replies: [
      { id: '3', userId: '6', anonymousName: 'Quiet Forest', content: 'This made me smile. Thank you for sharing. We truly are enough. 🌻', createdAt: '2026-08-31T15:00:00Z', likes: 4 },
    ]
  },
  {
    id: '3', userId: '7', anonymousName: 'Still Water',
    content: 'How do you all handle conflict in relationships? I always feel anxious when there is a disagreement.',
    category: 'Relationships', createdAt: '2026-08-30T11:00:00Z', likes: 9,
    replies: [
      { id: '4', userId: '8', anonymousName: 'Rising Star', content: 'I used to feel the same way. What helped me was learning to pause before reacting and trying to understand the other person\'s perspective first.', createdAt: '2026-08-30T12:00:00Z', likes: 6 },
    ]
  },
  {
    id: '4', userId: '9', anonymousName: 'Soft Wind',
    content: 'Started a 30-day meditation challenge and I am on day 12. Feeling calmer and more focused already!',
    category: 'Self Care', createdAt: '2026-08-29T16:00:00Z', likes: 18,
    replies: []
  },
  {
    id: '5', userId: '10', anonymousName: 'Morning Dew',
    content: 'Does anyone else struggle with overthinking? I feel like my mind never stops, even at night when I try to sleep.',
    category: 'General', createdAt: '2026-08-28T20:00:00Z', likes: 11,
    replies: [
      { id: '5', userId: '11', anonymousName: 'Night Owl', content: 'You are definitely not alone. Try the sleep meditation here on MindCare — it has helped me quiet my thoughts before bed.', createdAt: '2026-08-28T21:00:00Z', likes: 3 },
    ]
  },
]

export const mockNotifications: Notification[] = [
  { id: '1', title: 'Daily Check-in', message: 'Time for your daily mood check-in 💙', type: 'mood', read: false, createdAt: '2026-09-02T08:00:00Z' },
  { id: '2', title: 'Take a Break', message: 'Take 5 minutes for yourself today.', type: 'exercise', read: false, createdAt: '2026-09-01T12:00:00Z' },
  { id: '3', title: 'Weekly Summary', message: 'Your weekly mood summary is ready to view.', type: 'system', read: true, createdAt: '2026-08-31T09:00:00Z' },
  { id: '4', title: 'New Article', message: 'Check out: Mindfulness for Everyday Life', type: 'article', read: true, createdAt: '2026-08-30T14:00:00Z' },
  { id: '5', title: 'Community Reply', message: 'Someone replied to your post in the community.', type: 'community', read: true, createdAt: '2026-08-29T10:00:00Z' },
]

export const anonymousNames = [
  'Calm Breeze', 'Gentle River', 'Peaceful Mind', 'Warm Sun', 'Quiet Forest',
  'Still Water', 'Rising Star', 'Soft Wind', 'Morning Dew', 'Night Owl',
  'Ocean Wave', 'Green Meadow', 'Silver Lining', 'Bright Sky', 'Cozy Flame'
]
