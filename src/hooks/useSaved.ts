import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { isDemoMode } from '../config/firebase'

function getDemo<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function saveDemo(key: string, data: any[]) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function useSaved() {
  const { user } = useAuth()
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([])
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])

  useEffect(() => {
    if (isDemoMode) {
      setSavedArticleIds(getDemo<string>('mc_demo_saved_articles'))
      setFavoriteIds(getDemo<string>('mc_demo_favorites'))
      return
    }
    // Firebase subscriptions would go here
  }, [user])

  const toggleSaveArticle = useCallback(async (articleId: string) => {
    if (isDemoMode) {
      setSavedArticleIds(prev => {
        const next = prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]
        saveDemo('mc_demo_saved_articles', next)
        return next
      })
    }
  }, [])

  const toggleFavorite = useCallback(async (itemId: string, _type?: string) => {
    if (isDemoMode) {
      setFavoriteIds(prev => {
        const next = prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        saveDemo('mc_demo_favorites', next)
        return next
      })
    }
  }, [])

  return {
    savedArticleIds, favoriteIds,
    toggleSaveArticle, toggleFavorite,
    savedArticles: [], favorites: [], completions: [],
    saveArticle: toggleSaveArticle, unsaveArticle: toggleSaveArticle,
    addFavorite: toggleFavorite, removeFavorite: toggleFavorite,
    completeExercise: async () => {},
  }
}