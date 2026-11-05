import {
  collection, addDoc, updateDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp,
  Timestamp, getDocs, increment, limit, deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ─── Types ──────────────────────────────────────────────
export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  memberCount: number;
  onlineCount: number;
  isOfficial: boolean;
  pinnedMessage?: string;
  createdAt: any;
}

export interface RoomMember {
  roomId: string;
  userId: string;
  anonymousName: string;
  joinedAt: any;
  lastReadAt: any;
}

export interface RoomMessage {
  id: string;
  roomId: string;
  userId: string;
  anonymousName: string;
  content: string;
  type: 'text' | 'system' | 'emoji';
  createdAt: any;
  replyTo?: { messageId: string; content: string; anonymousName: string } | null;
  reactions?: Record<string, string[]>;  // emoji -> userId[]
}

export interface DirectConversation {
  id: string;
  participantIds: string[];
  participantNames: Record<string, string>;
  lastMessage?: string;
  lastMessageAt?: any;
  unreadCounts?: Record<string, number>;
  createdAt: any;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  anonymousName: string;
  content: string;
  createdAt: any;
}

// ─── Predefined rooms ───────────────────────────────────
export const PREDEFINED_ROOMS: Omit<ChatRoom, 'id' | 'createdAt'>[] = [
  { name: 'Daily Check-In', description: 'Share how your day is going.', category: 'Wellness', icon: '🌱', memberCount: 126, onlineCount: 18, isOfficial: true, pinnedMessage: 'Be kind. No judgment. No harassment. Share experiences, not diagnoses.' },
  { name: 'Student Life', description: 'Talk about college, exams and everyday pressure.', category: 'Students', icon: '📚', memberCount: 89, onlineCount: 12, isOfficial: true, pinnedMessage: 'This is a safe space for students. Be supportive.' },
  { name: 'Mindfulness', description: 'Breathing, meditation and mindful habits.', category: 'Mindfulness', icon: '🧘', memberCount: 74, onlineCount: 8, isOfficial: true, pinnedMessage: 'Share your mindfulness journey. No judgment.' },
  { name: 'Just Talk', description: 'A relaxed space for everyday conversations.', category: 'Social', icon: '💬', memberCount: 103, onlineCount: 22, isOfficial: true, pinnedMessage: 'Keep it friendly and respectful.' },
  { name: 'Late Night Thoughts', description: 'A quiet space for thoughts that are hard to say.', category: 'Wellness', icon: '🌙', memberCount: 67, onlineCount: 5, isOfficial: true, pinnedMessage: 'A gentle space for quiet hours.' },
  { name: 'Relationships', description: 'Talk about friendships, connections and boundaries.', category: 'Relationships', icon: '❤️', memberCount: 91, onlineCount: 14, isOfficial: true, pinnedMessage: 'Be kind and respectful of all experiences.' },
];

// ─── Anonymous names ────────────────────────────────────
const ANONYMOUS_POOL = [
  'CalmSoul', 'MindfulHeart', 'QuietMoon', 'HopefulMind', 'GentleWave',
  'BlueSky', 'SoftRain', 'PeacefulOak', 'WarmLight', 'StillWater',
  'BrightStar', 'KindBreeze', 'DeepBreath', 'FreshLeaf', 'CoolShade',
  'SweetDawn', 'ClearMind', 'TenderHeart', 'BraveSpirit', 'SafeHarbor',
];

export function generateAnonymousName(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash |= 0;
  }
  return ANONYMOUS_POOL[Math.abs(hash) % ANONYMOUS_POOL.length];
}

export function getRandomAnonymousName(): string {
  return ANONYMOUS_POOL[Math.floor(Math.random() * ANONYMOUS_POOL.length)];
}

// ─── Service ────────────────────────────────────────────
export const chatService = {
  // Rooms
  subscribeToRooms(callback: (rooms: ChatRoom[]) => void): () => void {
    const q = query(collection(db, 'chatRooms'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as ChatRoom));
    });
  },

  async joinRoom(roomId: string, userId: string, anonymousName: string): Promise<void> {
    const memberRef = doc(db, 'roomMembers', `${roomId}_${userId}`);
    await updateDoc(memberRef, {
      roomId, userId, anonymousName,
      joinedAt: serverTimestamp(),
      lastReadAt: serverTimestamp(),
    }).catch(async () => {
      await addDoc(collection(db, 'roomMembers'), {
        roomId, userId, anonymousName,
        joinedAt: serverTimestamp(),
        lastReadAt: serverTimestamp(),
      });
    });
    await updateDoc(doc(db, 'chatRooms', roomId), { memberCount: increment(1) });
  },

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    await updateDoc(doc(db, 'chatRooms', roomId), { memberCount: increment(-1) });
  },

  // Messages
  subscribeToMessages(roomId: string, callback: (msgs: RoomMessage[]) => void, maxMessages = 100): () => void {
    const q = query(
      collection(db, 'roomMessages'),
      where('roomId', '==', roomId),
      orderBy('createdAt', 'asc'),
      limit(maxMessages)
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as RoomMessage));
    });
  },

  async sendMessage(roomId: string, userId: string, anonymousName: string, content: string, replyTo?: RoomMessage['replyTo']): Promise<string> {
    const docRef = await addDoc(collection(db, 'roomMessages'), {
      roomId, userId, anonymousName, content,
      type: 'text',
      createdAt: serverTimestamp(),
      replyTo: replyTo || null,
      reactions: {},
    });
    return docRef.id;
  },

  async addReaction(messageId: string, emoji: string, userId: string): Promise<void> {
    const msgRef = doc(db, 'roomMessages', messageId);
    await updateDoc(msgRef, {
      [`reactions.${emoji}`]: increment(1),
    });
  },

  async deleteMessage(messageId: string): Promise<void> {
    await deleteDoc(doc(db, 'roomMessages', messageId));
  },

  // Direct Messages
  async getOrCreateConversation(userId1: string, userId2: string, name1: string, name2: string): Promise<string> {
    const q = query(
      collection(db, 'directConversations'),
      where('participantIds', 'array-contains', userId1)
    );
    const snap = await getDocs(q);
    const existing = snap.docs.find(d => {
      const data = d.data();
      return data.participantIds.includes(userId2);
    });
    if (existing) return existing.id;

    const docRef = await addDoc(collection(db, 'directConversations'), {
      participantIds: [userId1, userId2],
      participantNames: { [userId1]: name1, [userId2]: name2 },
      createdAt: serverTimestamp(),
      lastMessageAt: serverTimestamp(),
      unreadCounts: { [userId1]: 0, [userId2]: 0 },
    });
    return docRef.id;
  },

  subscribeToConversations(userId: string, callback: (convos: DirectConversation[]) => void): () => void {
    const q = query(
      collection(db, 'directConversations'),
      where('participantIds', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as DirectConversation));
    });
  },

  subscribeToDirectMessages(conversationId: string, callback: (msgs: DirectMessage[]) => void): () => void {
    const q = query(
      collection(db, 'directMessages'),
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc'),
      limit(200)
    );
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map(d => ({ id: d.id, ...d.data() }) as DirectMessage));
    });
  },

  async sendDirectMessage(conversationId: string, senderId: string, anonymousName: string, content: string): Promise<string> {
    const docRef = await addDoc(collection(db, 'directMessages'), {
      conversationId, senderId, anonymousName, content,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'directConversations', conversationId), {
      lastMessage: content,
      lastMessageAt: serverTimestamp(),
    });
    return docRef.id;
  },

  // Reports
  async reportMessage(messageId: string, reporterId: string, reason: string): Promise<void> {
    await addDoc(collection(db, 'messageReports'), {
      messageId, reporterId, reason,
      createdAt: serverTimestamp(),
    });
  },

  // Block
  async blockUser(userId: string, blockedUserId: string): Promise<void> {
    await addDoc(collection(db, 'blockedUsers'), {
      userId, blockedUserId,
      createdAt: serverTimestamp(),
    });
  },

  async getBlockedUsers(userId: string): Promise<string[]> {
    const q = query(collection(db, 'blockedUsers'), where('userId', '==', userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data().blockedUserId);
  },
};
