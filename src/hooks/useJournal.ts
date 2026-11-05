import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { isDemoMode } from '../config/firebase'
import { journalService, type JournalEntryDoc } from '../services/journalService'
import type { MoodLevel } from '../types'

function getDemoEntries(): JournalEntryDoc[] {
  try { return JSON.parse(localStorage.getItem('mc_demo_journals') || '[]') } catch { return [] }
}
function saveDemoEntries(entries: JournalEntryDoc[]) {
  localStorage.setItem('mc_demo_journals', JSON.stringify(entries))
}

export function useJournal() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntryDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      let stored = getDemoEntries()
      if (stored.length === 0) {
        const now = new Date()
        const seeds: JournalEntryDoc[] = [
          { id: 'j1', userId: 'demo-user-001', title: 'A Reflective Day', content: 'Today I took some time to think about what truly matters to me. I realized that I need to prioritize my mental health more consistently.', mood: 'good', tags: ['Self Care', 'Meditation'], createdAt: new Date(now.getTime() - 86400000) as any, updatedAt: new Date(now.getTime() - 86400000) as any },
          { id: 'j2', userId: 'demo-user-001', title: 'Dealing with Stress', content: 'Work has been overwhelming lately. I tried the deep breathing exercise before my meeting and it really helped calm my nerves.', mood: 'okay', tags: ['Stress', 'Work'], createdAt: new Date(now.getTime() - 172800000) as any, updatedAt: new Date(now.getTime() - 172800000) as any },
          { id: 'j3', userId: 'demo-user-001', title: 'Gratitude Journal', content: 'Today I am grateful for my friends who checked in on me. I went for a walk in the park and felt genuinely peaceful.', mood: 'great', tags: ['Friends', 'Health'], createdAt: new Date(now.getTime() - 259200000) as any, updatedAt: new Date(now.getTime() - 259200000) as any },
        ]
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
      const unsubscribe = journalService.subscribeToEntries(user.uid, (data) => {
        setEntries(data)
        setLoading(false)
        setError(null)
      })
      return unsubscribe
    } catch (e) {
      console.warn('Journal subscription error:', e)
      setLoading(false)
    }
  }, [user])

  const addEntry = useCallback(async (title: string, content: string, mood: MoodLevel | null, tags: string[]) => {
    const newEntry: JournalEntryDoc = {
      id: `journal-${Date.now()}`,
      userId: user?.uid || 'demo',
      title, content, mood, tags,
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
      await journalService.addEntry(user.uid, title, content, mood, tags)
    } catch (e) {
      setError('Failed to save journal entry.')
      throw e
    }
  }, [user])

  const updateEntry = useCallback(async (entryId: string, title: string, content: string, mood: MoodLevel | null, tags: string[]) => {
    if (isDemoMode) {
      const all = getDemoEntries().map(e => e.id === entryId ? { ...e, title, content, mood, tags, updatedAt: new Date() as any } : e)
      saveDemoEntries(all)
      setEntries(all)
      return
    }
    try {
      setError(null)
      await journalService.updateEntry(entryId, title, content, mood, tags)
    } catch (e) {
      setError('Failed to update journal entry.')
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
      await journalService.deleteEntry(entryId)
    } catch (e) {
      setError('Failed to delete journal entry.')
      throw e
    }
  }, [])

  return { entries, loading, error, addEntry, updateEntry, deleteEntry }
}