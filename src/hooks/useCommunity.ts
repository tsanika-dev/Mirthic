import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { isDemoMode } from '../config/firebase'
import { communityService, type CommunityPostDoc } from '../services/communityService'

function getDemoPosts(): CommunityPostDoc[] {
  try { return JSON.parse(localStorage.getItem('mc_demo_community') || '[]') } catch { return [] }
}
function saveDemoPosts(posts: CommunityPostDoc[]) {
  localStorage.setItem('mc_demo_community', JSON.stringify(posts))
}

const SEED_POSTS: CommunityPostDoc[] = [
  { id: 'cp1', userId: 'user-2', anonymousName: 'Calm Breeze', content: 'Feeling overwhelmed with college lately. Any tips for managing everything at once?', category: 'College Life', createdAt: new Date(Date.now() - 86400000) as any, updatedAt: new Date(Date.now() - 86400000) as any, likeCount: 14 },
  { id: 'cp2', userId: 'user-3', anonymousName: 'Warm Sun', content: 'Today I told myself "I am enough" and it felt really good. Sending love to everyone here. 💚', category: 'Motivation', createdAt: new Date(Date.now() - 172800000) as any, updatedAt: new Date(Date.now() - 172800000) as any, likeCount: 23 },
  { id: 'cp3', userId: 'user-4', anonymousName: 'Soft Wind', content: 'Started a 30-day meditation challenge and I am on day 12. Feeling calmer and more focused already!', category: 'Self Care', createdAt: new Date(Date.now() - 259200000) as any, updatedAt: new Date(Date.now() - 259200000) as any, likeCount: 18 },
]

export function useCommunity() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<CommunityPostDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isDemoMode) {
      let stored = getDemoPosts()
      if (stored.length === 0) { stored = SEED_POSTS; saveDemoPosts(stored) }
      setPosts(stored)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const unsubscribe = communityService.subscribeToPosts((data) => {
        setPosts(data)
        setLoading(false)
      })
      return unsubscribe
    } catch (e) {
      console.warn('Community subscription error:', e)
      setLoading(false)
    }
  }, [])

  const addPost = useCallback(async (content: string, category: string) => {
    const newPost: CommunityPostDoc = {
      id: `post-${Date.now()}`,
      userId: user?.uid || 'demo',
      anonymousName: 'Anonymous',
      content, category,
      createdAt: new Date() as any,
      updatedAt: new Date() as any,
      likeCount: 0,
    }

    if (isDemoMode) {
      const updated = [newPost, ...getDemoPosts()]
      saveDemoPosts(updated)
      setPosts(updated)
      return
    }

    if (!user) return
    try {
      setError(null)
      await communityService.addPost(user.uid, content, category)
    } catch (e) {
      setError('Failed to create post.')
      throw e
    }
  }, [user])

  const deletePost = useCallback(async (postId: string) => {
    if (isDemoMode) {
      const updated = getDemoPosts().filter(p => p.id !== postId)
      saveDemoPosts(updated)
      setPosts(updated)
      return
    }
    try { await communityService.deletePost(postId) } catch { }
  }, [])

  const likePost = useCallback(async (postId: string) => {
    if (isDemoMode) {
      const updated = getDemoPosts().map(p => p.id === postId ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p)
      saveDemoPosts(updated)
      setPosts(updated)
      return
    }
    try { await communityService.likePost(postId) } catch { }
  }, [])

  const addReply = useCallback(async (postId: string, content: string) => {
    if (isDemoMode) return // Simplified for demo
    if (!user) return
    try { await communityService.addReply(postId, user.uid, content) } catch { }
  }, [user])

  const reportPost = useCallback(async (postId: string, reason: string, category: string) => {
    if (isDemoMode) return
    if (!user) return
    try { await communityService.reportPost(postId, user.uid, reason, category) } catch { }
  }, [user])

  return { posts, loading, error, addPost, deletePost, likePost, addReply, reportPost }
}