import {
  collection, addDoc, deleteDoc, doc,
  query, where, onSnapshot, serverTimestamp, getDocs, Timestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'

export interface SavedArticleDoc {
  id: string
  userId: string
  articleId: string
  createdAt: Timestamp
}

export interface FavoriteDoc {
  id: string
  userId: string
  itemId: string
  type: 'exercise' | 'selfcare' | 'article'
  createdAt: Timestamp
}

export const savedService = {
  // Saved Articles
  async saveArticle(userId: string, articleId: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'savedArticles'), {
      userId, articleId, createdAt: serverTimestamp(),
    })
    return docRef.id
  },

  async unsaveArticle(userId: string, articleId: string): Promise<void> {
    const q = query(
      collection(db, 'savedArticles'),
      where('userId', '==', userId),
      where('articleId', '==', articleId)
    )
    const snapshot = await getDocs(q)
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref))
    await Promise.all(deletePromises)
  },

  subscribeToSavedArticles(userId: string, callback: (saved: SavedArticleDoc[]) => void): () => void {
    const q = query(
      collection(db, 'savedArticles'),
      where('userId', '==', userId)
    )
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as SavedArticleDoc))
    })
  },

  // Favorites
  async addFavorite(userId: string, itemId: string, type: FavoriteDoc['type']): Promise<string> {
    const docRef = await addDoc(collection(db, 'favorites'), {
      userId, itemId, type, createdAt: serverTimestamp(),
    })
    return docRef.id
  },

  async removeFavorite(userId: string, itemId: string): Promise<void> {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('itemId', '==', itemId)
    )
    const snapshot = await getDocs(q)
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref))
    await Promise.all(deletePromises)
  },

  subscribeToFavorites(userId: string, callback: (favorites: FavoriteDoc[]) => void): () => void {
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', userId)
    )
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as FavoriteDoc))
    })
  },

  // Exercise completions
  async completeExercise(userId: string, exerciseId: string, duration: number): Promise<string> {
    const docRef = await addDoc(collection(db, 'exerciseCompletions'), {
      userId, exerciseId, duration, completedAt: serverTimestamp(),
    })
    return docRef.id
  },

  subscribeToExerciseCompletions(userId: string, callback: (completions: Array<{ id: string; exerciseId: string; completedAt: Timestamp }>) => void): () => void {
    const q = query(
      collection(db, 'exerciseCompletions'),
      where('userId', '==', userId),
    )
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as { id: string; exerciseId: string; completedAt: Timestamp }))
    })
  },
}
