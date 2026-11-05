import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { isDemoMode } from '../config/firebase'
import { aiService, type AIMessageDoc } from '../services/aiService'

const DEMO_RESPONSES: Record<string, string> = {
  'stressed': "I hear you — stress can feel really heavy. Let's try something: take a slow breath in for 4 seconds, hold for 4, and exhale for 6. Would you like me to guide you through a breathing exercise?",
  'sleep': "Trouble sleeping is so frustrating. A few things that might help: try our Sleep Well exercise, avoid screens an hour before bed, and keep a consistent bedtime. Would you like to try a sleep meditation?",
  'overwhelmed': "When everything feels like too much, it helps to pause. Try this: name 5 things you can see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This grounding exercise can bring you back to the present.",
  'relax': "Let's take a moment to breathe together. Inhale slowly for 4 seconds, hold for 4, and exhale for 6. Repeat this 3 times. You can also try our Body Scan Meditation for deeper relaxation.",
  'breathing': "Here's a simple breathing exercise: Breathe in through your nose for 4 seconds, hold for 4 seconds, then breathe out slowly through your mouth for 6 seconds. Repeat 5 times. Notice how your body feels calmer with each breath.",
}

function getDemoResponse(message: string): string {
  const lower = message.toLowerCase()
  for (const [key, response] of Object.entries(DEMO_RESPONSES)) {
    if (lower.includes(key)) return response
  }
  return "Thank you for sharing that with me. It takes courage to express how you're feeling. Would you like to try a breathing exercise, explore some self-care tips, or just talk about what's on your mind? I'm here to listen. 💚"
}

export function useAI() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<AIMessageDoc[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeConversation, setActiveConversation] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: AIMessageDoc = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation || 'demo',
      userId: user?.uid || 'demo',
      role: 'user',
      content,
      createdAt: new Date() as any,
    }
    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    if (isDemoMode) {
      // Simulate AI thinking delay
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))
      const response = getDemoResponse(content)
      const aiMsg: AIMessageDoc = {
        id: `msg-${Date.now()}`,
        conversationId: activeConversation || 'demo',
        userId: user?.uid || 'demo',
        role: 'assistant',
        content: response,
        createdAt: new Date() as any,
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
      return
    }

    try {
      if (!activeConversation) {
        const convId = await aiService.createConversation(user!.uid, content.slice(0, 50))
        setActiveConversation(convId)
        await aiService.addMessage(convId, user!.uid, 'user', content)
        const reply = await aiService.getAIResponse(content, convId)
        await aiService.addMessage(convId, user!.uid, 'assistant', reply)
        const aiMsg: AIMessageDoc = { id: `msg-${Date.now()}`, conversationId: activeConversation || 'demo', userId: user?.uid || 'demo', role: 'assistant', content: reply, createdAt: new Date() as any }
        setMessages(prev => [...prev, aiMsg])
      } else {
        await aiService.addMessage(activeConversation, user!.uid, 'user', content)
        const reply = await aiService.getAIResponse(content, activeConversation)
        await aiService.addMessage(activeConversation, user!.uid, 'assistant', reply)
        const aiMsg: AIMessageDoc = { id: `msg-${Date.now()}`, conversationId: activeConversation || 'demo', userId: user?.uid || 'demo', role: 'assistant', content: reply, createdAt: new Date() as any }
        setMessages(prev => [...prev, aiMsg])
      }
    } catch {
      const errorMsg: AIMessageDoc = { id: `msg-${Date.now()}`, conversationId: activeConversation || 'demo', userId: user?.uid || 'demo', role: 'assistant', content: "I'm having trouble connecting right now. Please try again.", createdAt: new Date() as any }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }, [user, activeConversation])

  const startNewConversation = useCallback(async (firstMessage?: string) => {
    setMessages([])
    setActiveConversation(null)
    if (firstMessage) {
      await sendMessage(firstMessage)
    }
  }, [sendMessage])

  return {
    conversations: [], activeConversation, messages, isTyping, error: null,
    sendMessage, startNewConversation,
    deleteConversation: async () => {},
    setActiveConversation: () => {},
    clearActiveConversation: () => { setMessages([]); setActiveConversation(null) },
  }
}