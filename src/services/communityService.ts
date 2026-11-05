import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  Timestamp, getDocs, increment, limit,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { anonymousNames } from '../data/mockData'

export interface CommunityPostDoc {
  id: string
  userId: string
  anonymousName: string
  content: string
  category: string
  createdAt: Timestamp
  updatedAt: Timestamp
  likeCount: number
}

export interface CommunityReplyDoc {
  id: string
  postId: string
  userId: string
  anonymousName: string
  content: string
  createdAt: Timestamp
  likeCount: number
}

export interface CommunityReportDoc {
  id: string
  postId: string
  reporterId: string
  reason: string
  category: string
  createdAt: Timestamp
}

function getRandomAnonymousName(): string {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)]
}

export const communityService = {
  async addPost(userId: string, content: string, category: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'communityPosts'), {
      userId,
      anonymousName: getRandomAnonymousName(),
      content,
      category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      likeCount: 0,
    })
    return docRef.id
  },

  async deletePost(postId: string): Promise<void> {
    await deleteDoc(doc(db, 'communityPosts', postId))
  },

  async likePost(postId: string): Promise<void> {
    await updateDoc(doc(db, 'communityPosts', postId), {
      likeCount: increment(1),
    })
  },

  async unlikePost(postId: string): Promise<void> {
    await updateDoc(doc(db, 'communityPosts', postId), {
      likeCount: increment(-1),
    })
  },

  subscribeToPosts(callback: (posts: CommunityPostDoc[]) => void, maxPosts = 50): () => void {
    const q = query(
      collection(db, 'communityPosts'),
      orderBy('createdAt', 'desc'),
      limit(maxPosts)
    )
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as CommunityPostDoc))
    })
  },

  // Replies
  async addReply(postId: string, userId: string, content: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'communityReplies'), {
      postId,
      userId,
      anonymousName: getRandomAnonymousName(),
      content,
      createdAt: serverTimestamp(),
      likeCount: 0,
    })
    return docRef.id
  },

  subscribeToReplies(postId: string, callback: (replies: CommunityReplyDoc[]) => void): () => void {
    const q = query(
      collection(db, 'communityReplies'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    )
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as CommunityReplyDoc))
    })
  },

  // Reports
  async reportPost(postId: string, reporterId: string, reason: string, category: string): Promise<void> {
    await addDoc(collection(db, 'communityReports'), {
      postId, reporterId, reason, category,
      createdAt: serverTimestamp(),
    })
  },

  // Get user's posts
  async getUserPosts(userId: string): Promise<CommunityPostDoc[]> {
    const q = query(
      collection(db, 'communityPosts'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as CommunityPostDoc)
  },
}
