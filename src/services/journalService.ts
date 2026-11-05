import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  Timestamp, getDocs,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { MoodLevel } from '../types'

export interface JournalEntryDoc {
  id: string
  userId: string
  title: string
  content: string
  mood: MoodLevel | null
  tags: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const journalService = {
  async addEntry(userId: string, title: string, content: string, mood: MoodLevel | null, tags: string[]): Promise<string> {
    const docRef = await addDoc(collection(db, 'journalEntries'), {
      userId, title, content, mood, tags,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  },

  async updateEntry(entryId: string, title: string, content: string, mood: MoodLevel | null, tags: string[]): Promise<void> {
    await updateDoc(doc(db, 'journalEntries', entryId), {
      title, content, mood, tags,
      updatedAt: serverTimestamp(),
    })
  },

  async deleteEntry(entryId: string): Promise<void> {
    await deleteDoc(doc(db, 'journalEntries', entryId))
  },

  subscribeToEntries(userId: string, callback: (entries: JournalEntryDoc[]) => void): () => void {
    const q = query(
      collection(db, 'journalEntries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as JournalEntryDoc))
    })
  },

  async getEntries(userId: string): Promise<JournalEntryDoc[]> {
    const q = query(
      collection(db, 'journalEntries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as JournalEntryDoc)
  },
}
