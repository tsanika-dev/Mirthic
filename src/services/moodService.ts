import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  Timestamp, getDocs,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { MoodLevel } from '../types'

export interface MoodEntryDoc {
  id: string
  userId: string
  mood: MoodLevel
  moodScore: number
  note: string
  tags: string[]
  date: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

const MOOD_SCORES: Record<MoodLevel, number> = {
  very_bad: 1, bad: 2, okay: 3, good: 4, great: 5,
}

export const moodService = {
  async addEntry(userId: string, mood: MoodLevel, note: string, tags: string[]): Promise<string> {
    const docRef = await addDoc(collection(db, 'moodEntries'), {
      userId,
      mood,
      moodScore: MOOD_SCORES[mood],
      note,
      tags,
      date: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async updateEntry(entryId: string, mood: MoodLevel, note: string, tags: string[]): Promise<void> {
    const entryRef = doc(db, 'moodEntries', entryId)
    await updateDoc(entryRef, {
      mood,
      moodScore: MOOD_SCORES[mood],
      note,
      tags,
      updatedAt: serverTimestamp(),
    })
  },

  async deleteEntry(entryId: string): Promise<void> {
    await deleteDoc(doc(db, 'moodEntries', entryId))
  },

  subscribeToEntries(userId: string, callback: (entries: MoodEntryDoc[]) => void): () => void {
    const q = query(
      collection(db, 'moodEntries'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )
    return onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as MoodEntryDoc[]
      callback(entries)
    })
  },

  async getEntries(userId: string): Promise<MoodEntryDoc[]> {
    const q = query(
      collection(db, 'moodEntries'),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as MoodEntryDoc)
  },

  getTodayMood(entries: MoodEntryDoc[]): MoodLevel | null {
    const today = new Date().toISOString().split('T')[0]
    return entries.find(e => e.date === today)?.mood ?? null
  },

  calculateStats(entries: MoodEntryDoc[]) {
    if (entries.length === 0) return { average: 0, total: 0, bestDay: '-', mostCommon: null, streak: 0 }

    const scores = entries.map(e => e.moodScore)
    const average = (scores.reduce((a, b) => a + b, 0) / scores.length)

    const best = entries.reduce((best, e) => e.moodScore > best.moodScore ? e : best, entries[0])
    const bestDay = new Date(best.date).toLocaleDateString('en-US', { weekday: 'long' })

    const counts: Record<string, number> = {}
    entries.forEach(e => { counts[e.mood] = (counts[e.mood] || 0) + 1 })
    const mostCommon = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as MoodLevel | null

    return { average: Number(average.toFixed(1)), total: entries.length, bestDay, mostCommon, streak: Math.min(entries.length, 7) }
  },
}
