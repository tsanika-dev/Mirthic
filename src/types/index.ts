export type MoodLevel = 'very_bad' | 'bad' | 'okay' | 'good' | 'great'

export interface MoodEntry {
  id: string
  userId: string
  mood: MoodLevel
  note: string
  tags: string[]
  date: string
}

export interface JournalEntry {
  id: string
  userId: string
  title: string
  content: string
  mood: MoodLevel | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Exercise {
  id: string
  title: string
  category: 'breathing' | 'meditation' | 'relaxation' | 'sleep'
  duration: number
  description: string
  audioUrl?: string
}

export interface Article {
  id: string
  title: string
  category: string
  description: string
  content: string
  readingTime: number
  image: string
}

export interface CommunityPost {
  id: string
  userId: string
  anonymousName: string
  content: string
  category: string
  createdAt: string
  likes: number
  replies: CommunityReply[]
}

export interface CommunityReply {
  id: string
  userId: string
  anonymousName: string
  content: string
  createdAt: string
  likes: number
}

export interface User {
  id: string
  name: string
  email: string
  profileImage: string
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'mood' | 'exercise' | 'article' | 'community' | 'system'
  read: boolean
  createdAt: string
}

export interface AIMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

export type MoodDataPoint = {
  date: string
  mood: number
  label: string
}
