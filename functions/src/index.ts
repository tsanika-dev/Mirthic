import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'

// The Gemini API key is stored as a Firebase secret, never exposed to the client
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY')

const SYSTEM_INSTRUCTION = `You are MindCare AI, a supportive mental wellness assistant integrated into the MindCare app. You MUST follow these rules strictly:

CRITICAL SAFETY RULES:
- You must NEVER diagnose mental health conditions. Never say "You have depression" or "You have anxiety."
- Instead say things like: "Some of what you're describing can happen with stress or low mood, but I can't diagnose you."
- If a user expresses possible self-harm or imminent danger, respond supportively and immediately encourage contact with local emergency services or a trusted person.
- Never provide instructions for self-harm.
- Never prescribe medication or recommend specific medication dosages.
- You are NOT a psychologist or medical professional. Make this clear when asked.
- Do not make definitive clinical judgments.

PERSONALITY:
- Empathetic, warm, and supportive
- Use calming, non-clinical language
- Suggest healthy coping strategies
- Recommend relevant exercises (breathing, meditation, relaxation)
- Recommend journaling when appropriate
- Encourage reaching out to trusted people
- Encourage professional help when appropriate
- Keep responses concise and actionable (under 200 words)

If the user shares their recent MindCare activity (mood, journal, exercises), you may make gentle wellness suggestions based on that data. For example:
- If recent mood is "Good" or "Great": Suggest gratitude journaling or maintaining their routine
- If recent mood is "Bad" or "Very Bad": Suggest breathing exercises, self-care, or professional support
- If the user has journal entries today: Acknowledge their reflection practice
- If the user has exercised recently: Encourage continued practice

NEVER infer or diagnose conditions from this data. Only make general wellness suggestions.`

interface ChatRequest {
  message: string
  conversationId: string
  userContext?: {
    recentMood?: string
    hasJournalToday?: boolean
    exerciseCount?: number
  }
}

export const mindcareChat = onCall<ChatRequest>(
  {
    secrets: [GEMINI_API_KEY],
    maxInstances: 10,
    timeoutSeconds: 30,
    memory: '256MiB',
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to use MindCare AI.')
    }

    const { message, conversationId, userContext } = request.data

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new HttpsError('invalid-argument', 'Message is required.')
    }

    if (message.length > 2000) {
      throw new HttpsError('invalid-argument', 'Message is too long. Please keep it under 2000 characters.')
    }

    const apiKey = GEMINI_API_KEY.value()
    if (!apiKey) {
      throw new HttpsError('internal', 'AI service is not configured. Please try again later.')
    }

    // Build context message
    let contextMessage = ''
    if (userContext) {
      const parts: string[] = []
      if (userContext.recentMood) parts.push(`User's recent mood: ${userContext.recentMood}`)
      if (userContext.hasJournalToday) parts.push('User has written a journal entry today')
      if (userContext.exerciseCount && userContext.exerciseCount > 0) parts.push(`User has completed ${userContext.exerciseCount} exercise(s) recently`)
      if (parts.length > 0) contextMessage = `\n\nUser context (for wellness suggestions only, do not diagnose):\n${parts.join('\n')}`
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION + contextMessage }] },
            contents: [{ role: 'user', parts: [{ text: message }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 300,
              topP: 0.9,
            },
            safetySettings: [
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            ],
          }),
        }
      )

      const data = await response.json()

      if (data.error) {
        console.error('Gemini API error:', data.error)
        throw new HttpsError('internal', 'AI service encountered an error. Please try again.')
      }

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!reply) {
        throw new HttpsError('internal', 'AI could not generate a response. Please try again.')
      }

      return { reply }
    } catch (error) {
      if (error instanceof HttpsError) throw error
      console.error('Error calling Gemini:', error)
      throw new HttpsError('internal', 'AI service is temporarily unavailable. Please try again later.')
    }
  }
)
