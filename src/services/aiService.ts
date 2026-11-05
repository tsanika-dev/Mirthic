import { httpsCallable } from 'firebase/functions'
import { functions } from '../config/firebase'
import {
  collection, addDoc, updateDoc, query, where, orderBy, onSnapshot,
  deleteDoc, doc, serverTimestamp, Timestamp, getDocs, limit,
} from 'firebase/firestore'
import { db } from '../config/firebase'

export interface AIConversationDoc {
  id: string
  userId: string
  title: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface AIMessageDoc {
  id: string
  conversationId: string
  userId: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Timestamp
}

// Crisis keywords that trigger safety response
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'harm myself',
  'self-harm', 'cutting myself', 'no reason to live', 'better off dead',
  'end it all', 'not worth living',
]

function detectCrisis(message: string): boolean {
  const lower = message.toLowerCase()
  return CRISIS_KEYWORDS.some(keyword => lower.includes(keyword))
}

const CRISIS_RESPONSE = `You're not alone, and your life has value. Please reach out for immediate support right now.

🆘 **Emergency Resources:**
• **988 Suicide & Crisis Lifeline**: Call or text **988** (US)
• **Crisis Text Line**: Text **HOME** to **741741**
• **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

If you're in immediate danger, please call your local emergency services (911 in the US) right now.

Would you like me to take you to our Resources & Helplines page for more support options?`

export const aiService = {
  // Call Cloud Function for AI response
  async getAIResponse(message: string, conversationId: string, userContext?: {
    recentMood?: string
    hasJournalToday?: boolean
    exerciseCount?: number
  }): Promise<string> {
    if (detectCrisis(message)) {
      return CRISIS_RESPONSE
    }

    try {
      const callMindcareChat = httpsCallable<{ message: string; conversationId: string; userContext?: typeof userContext }, { reply: string }>(
        functions, 'mindcareChat'
      )
      const result = await callMindcareChat({ message, conversationId, userContext })
      return result.data.reply
    } catch (error) {
      // Fallback to local response if Cloud Function is unavailable
      return this.getLocalResponse(message)
    }
  },

  // Local fallback responses (used when Cloud Function is unavailable)
  getLocalResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase()

    if (detectCrisis(msg)) return CRISIS_RESPONSE

    if (msg.includes('stressed') || msg.includes('stress')) {
      return "I hear you — stress can feel really overwhelming. Here are a few things that might help:\n\n🫁 Try the Deep Breathing exercise in our Exercises section.\n🧘 Take a 5-minute mindfulness break.\n📝 Write about what's stressing you in your Journal.\n\nWould you like me to guide you through a quick breathing exercise right now? Remember, it's okay to feel this way."
    }

    if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes("can't sleep")) {
      return "Difficulty with sleep is really common and can affect how you feel. Here are some gentle suggestions:\n\n🌙 Try our Sleep Meditation exercise.\n📵 Put your phone away 30 minutes before bed.\n📖 Read something calming instead.\n🫁 Use the 4-7-8 breathing technique.\n\nWould you like me to walk you through the 4-7-8 breathing exercise?"
    }

    if (msg.includes('overwhelm') || msg.includes('overwhelmed')) {
      return "Feeling overwhelmed is a lot to carry. Let's take this one step at a time.\n\nFirst, take a deep breath. You're doing your best, and that's enough.\n\nSome things that might help:\n🎯 Break your tasks into smaller steps\n🧘 Try a body scan meditation\n📞 Talk to someone you trust\n📝 Write it out in your journal\n\nYou don't have to handle everything at once. Would you like to try a calming exercise?"
    }

    if (msg.includes('relax') || msg.includes('calm')) {
      return "Let's help you find some calm right now. 🌿\n\nHere are some options:\n🫁 Deep Breathing — 5 minutes of focused breathing\n🧘 Body Scan Meditation — release tension from head to toe\n💆 Progressive Muscle Relaxation — 8 minutes of gentle relaxation\n\nWould you like to try one of these exercises? I'd recommend starting with Deep Breathing."
    }

    if (msg.includes('breathing') || msg.includes('breathe')) {
      return "Let's do a calming breathing exercise together! 🫁\n\nHere's a simple one you can do right now:\n\n1. Breathe IN slowly for 4 seconds\n2. HOLD your breath for 4 seconds\n3. Breathe OUT slowly for 6 seconds\n\nRepeat this 3-4 times.\n\nFor a guided experience, head to the Exercises section and try 'Deep Breathing'!\n\nHow do you feel after trying that?"
    }

    if (msg.includes('sad') || msg.includes('depressed') || msg.includes('unhappy')) {
      return "I'm sorry you're feeling this way. Your feelings are completely valid, and it takes courage to express them.\n\nSome things that might help:\n💚 Be gentle with yourself today\n🌿 Try a gentle exercise like a body scan\n📝 Write about your feelings in your Journal\n👥 Connect with someone you trust\n\nPlease know that some of what you're describing can happen when we're going through difficult times. If these feelings persist, consider reaching out to a mental health professional. You don't have to go through this alone.\n\nWould you like to explore our Resources & Helplines page for professional support options?"
    }

    if (msg.includes('anxious') || msg.includes('anxiety') || msg.includes('worry')) {
      return "I hear you, and anxiety can be really uncomfortable. Remember, some of what you're describing can happen with stress, but I can't diagnose you.\n\nHere are some grounding techniques:\n🫁 4-7-8 Breathing\n🦶 Feel your feet on the ground\n👀 Name 5 things you can see\n👂 Name 4 things you can hear\n✋ Name 3 things you can touch\n\nWould you like me to guide you through one of these exercises? Also, check out our Self Care section for more coping strategies."
    }

    if (msg.includes('thank')) {
      return "You're welcome! 💚 Remember, taking care of your mental health is one of the most important things you can do. I'm always here if you need to talk. Don't hesitate to explore Mirthic's exercises, articles, and resources whenever you need them."
    }

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! 👋 I'm glad you're here. I'm Mirthic AI, and I'm here to listen and support you. What would you like to talk about? You can share how you're feeling, ask for coping strategies, or request a calming exercise."
    }

    return "Thank you for sharing that with me. 💙 I'm here to listen and support you.\n\nHere are some things you can do:\n🫁 Try a breathing or relaxation exercise\n📝 Journal about how you're feeling\n📚 Read an article on mental wellness\n📞 Check our Resources page for professional support\n\nIf you're going through a difficult time, please remember that seeking professional help is a sign of strength. Would you like to explore any of these options?"
  },

  // Conversation management
  async createConversation(userId: string, title: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'aiConversations'), {
      userId, title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async addMessage(conversationId: string, userId: string, role: 'user' | 'assistant', content: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'aiMessages'), {
      conversationId, userId, role, content,
      createdAt: serverTimestamp(),
    })
    await updateDoc(doc(db, 'aiConversations', conversationId), {
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async deleteConversation(conversationId: string): Promise<void> {
    // Delete all messages in the conversation
    const msgsQuery = query(
      collection(db, 'aiMessages'),
      where('conversationId', '==', conversationId)
    )
    const msgsSnapshot = await getDocs(msgsQuery)
    const deletePromises = msgsSnapshot.docs.map(d => deleteDoc(d.ref))
    await Promise.all(deletePromises)
    // Delete conversation
    await deleteDoc(doc(db, 'aiConversations', conversationId))
  },

  subscribeToConversations(userId: string, callback: (conversations: AIConversationDoc[]) => void): () => void {
    const q = query(
      collection(db, 'aiConversations'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      limit(20)
    )
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as AIConversationDoc))
    })
  },

  subscribeToMessages(conversationId: string, callback: (messages: AIMessageDoc[]) => void): () => void {
    const q = query(
      collection(db, 'aiMessages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    )
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as AIMessageDoc))
    })
  },
}
