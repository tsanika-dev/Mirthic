import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { isDemoMode } from '../config/firebase'
import { moodService, type MoodEntryDoc } from '../services/moodService'
import type { MoodLevel } from '../types'

const MOOD_SCORES: Record<MoodLevel, number> = { very_bad: 1, bad: 2, okay: 3, good: 4, great: 5 }

// Demo mode localStorage helpers
function getDemoEntries(): MoodEntryDoc[] {
  try { return JSON.parse(localStorage.getItem('mc_demo_moods') || '[]') } catch { return [] }
}
function saveDemoEntries(entries: MoodEntryDoc[]) {
  localStorage.setItem('mc_demo_moods', JSON.stringify(entries))
}

export function useMood() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<MoodEntryDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Demo mode: load from localStorage with seed data
  useEffect(() => {
    if (isDemoMode) {
      let stored = getDemoEntries()
      // Seed with sample data if empty
      if (stored.length === 0) {
        const now = new Date()
        const seeds: MoodEntryDoc[] = ['great', 'good', 'okay', 'bad', 'good', 'great', 'okay'].map((mood, i) => {
          const d = new Date(now)
          d.setDate(d.getDate() - (6 - i))
          return {
            id: `seed-${i}`,
            userId: 'demo-user-001',
            mood: mood as MoodLevel,
            moodScore: MOOD_SCORES[mood as MoodLevel],
            note: i === 0 ? 'Started the week with energy' : i === 3 ? 'Stressful day' : '',
            tags: i === 3 ? ['Work', 'Stress'] : i === 5 ? ['Exercise', 'Health'] : [],
            date: d.toISOString().split('T')[0],
            createdAt: d as any,
            updatedAt: d as any,
          }
        })
        stored = seeds
        saveDemoEntries(stored)
      }
      setEntries(stored)
      setLoading(false)
      return
    }

    if (!user) { setLoading(false); return }
    setLoading(true)
    try {
      const unsubscribe = moodService.subscribeToEntries(user.uid, (data) => {
        setEntries(data)
        setLoading(false)
        setError(null)
      })
      return unsubscribe
    } catch (e) {
      console.warn('Mood subscription error:', e)
      setLoading(false)
    }
  }, [user])

  const addEntry = useCallback(async (mood: MoodLevel, note: string, tags: string[]) => {
    const newEntry: MoodEntryDoc = {
      id: `mood-${Date.now()}`,
      userId: user?.uid || 'demo',
      mood,
      moodScore: MOOD_SCORES[mood],
      note,
      tags,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
    }

    if (isDemoMode) {
      const updated = [newEntry, ...getDemoEntries()]
      saveDemoEntries(updated)
      setEntries(updated)
      return
    }

    if (!user) return
    try {
      setError(null)
      await moodService.addEntry(user.uid, mood, note, tags)
    } catch (e) {
      setError('Failed to save mood entry. Please try again.')
      throw e
    }
  }, [user])

  const updateEntry = useCallback(async (entryId: string, mood: MoodLevel, note: string, tags: string[]) => {
    if (isDemoMode) {
      const all = getDemoEntries().map(e => e.id === entryId ? { ...e, mood, moodScore: MOOD_SCORES[mood], note, tags, updatedAt: new Date() as any } : e)
      saveDemoEntries(all)
      setEntries(all)
      return
    }
    try {
      setError(null)
      await moodService.updateEntry(entryId, mood, note, tags)
    } catch (e) {
      setError('Failed to update mood entry.')
      throw e
    }
  }, [])

  const deleteEntry = useCallback(async (entryId: string) => {
    if (isDemoMode) {
      const all = getDemoEntries().filter(e => e.id !== entryId)
      saveDemoEntries(all)
      setEntries(all)
      return
    }
    try {
      setError(null)
      await moodService.deleteEntry(entryId)
    } catch (e) {
      setError('Failed to delete mood entry.')
      throw e
    }
  }, [])

  const todayMood = moodService.getTodayMood(entries)
  const stats = moodService.calculateStats(entries)

  return { entries, loading, error, addEntry, updateEntry, deleteEntry, todayMood, stats }
}