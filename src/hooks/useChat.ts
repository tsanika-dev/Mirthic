import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { isDemoMode } from '../config/firebase';
import {
  chatService, generateAnonymousName, getRandomAnonymousName,
  PREDEFINED_ROOMS,
  type ChatRoom, type RoomMessage, type DirectConversation, type DirectMessage,
} from '../services/chatService';

// ─── Demo Data ──────────────────────────────────────────
const DEMO_ROOMS: ChatRoom[] = PREDEFINED_ROOMS.map((r, i) => ({
  ...r,
  id: `room-${i}`,
  createdAt: new Date(Date.now() - 86400000 * (30 - i)),
}));

const DEMO_MESSAGES: Record<string, RoomMessage[]> = {
  'room-0': [
    { id: 'dm-1', roomId: 'room-0', userId: 'user-2', anonymousName: 'MindfulHeart', content: 'Good morning everyone! How are we feeling today?', type: 'text', createdAt: { toDate: () => new Date(Date.now() - 3600000) } as any, reactions: { '🌱': ['user-3', 'user-4'], '❤️': ['user-5'] } },
    { id: 'dm-2', roomId: 'room-0', userId: 'user-3', anonymousName: 'QuietMoon', content: 'Feeling a bit anxious about exams but trying to stay positive 💚', type: 'text', createdAt: { toDate: () => new Date(Date.now() - 2400000) } as any, reactions: { '🤍': ['user-2'] } },
    { id: 'dm-3', roomId: 'room-0', userId: 'user-4', anonymousName: 'GentleWave', content: "You've got this! Take it one day at a time.", type: 'text', createdAt: { toDate: () => new Date(Date.now() - 1200000) } as any, replyTo: { messageId: 'dm-2', content: 'Feeling a bit anxious about exams...', anonymousName: 'QuietMoon' }, reactions: {} },
    { id: 'dm-4', roomId: 'room-0', userId: 'user-5', anonymousName: 'BlueSky', content: "I did the breathing exercise this morning and it really helped. Highly recommend!", type: 'text', createdAt: { toDate: () => new Date(Date.now() - 600000) } as any, reactions: { '👍': ['user-2', 'user-3', 'user-4'] } },
  ],
  'room-1': [
    { id: 'dm-5', roomId: 'room-1', userId: 'user-6', anonymousName: 'WarmLight', content: 'Finals week is killing me. Anyone else struggling?', type: 'text', createdAt: { toDate: () => new Date(Date.now() - 7200000) } as any, reactions: {} },
    { id: 'dm-6', roomId: 'room-1', userId: 'user-7', anonymousName: 'StillWater', content: 'Same here. I find that the Pomodoro technique helps me stay focused without burning out.', type: 'text', createdAt: { toDate: () => new Date(Date.now() - 3600000) } as any, reactions: { '👍': ['user-6'] } },
  ],
  'room-3': [
    { id: 'dm-7', roomId: 'room-3', userId: 'user-8', anonymousName: 'DeepBreath', content: "Just wanted to say hi to everyone. Hope you're all having a decent day 🌿", type: 'text', createdAt: { toDate: () => new Date(Date.now() - 1800000) } as any, reactions: { '🤍': ['user-2', 'user-3'] } },
  ],
};

function getDemoRooms(): ChatRoom[] {
  try {
    const stored = localStorage.getItem('mc_chat_rooms');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  localStorage.setItem('mc_chat_rooms', JSON.stringify(DEMO_ROOMS));
  return DEMO_ROOMS;
}

function getDemoMessages(roomId: string): RoomMessage[] {
  const key = `mc_chat_msgs_${roomId}`;
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  const seed = DEMO_MESSAGES[roomId] || [];
  if (seed.length) localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}

function saveDemoMessages(roomId: string, msgs: RoomMessage[]) {
  localStorage.setItem(`mc_chat_msgs_${roomId}`, JSON.stringify(msgs));
}

function getDemoConversations(): DirectConversation[] {
  try {
    const stored = localStorage.getItem('mc_chat_convos');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveDemoConversations(convos: DirectConversation[]) {
  localStorage.setItem('mc_chat_convos', JSON.stringify(convos));
}

function getDemoDirectMsgs(convoId: string): DirectMessage[] {
  try {
    const stored = localStorage.getItem(`mc_dm_${convoId}`);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveDemoDirectMsgs(convoId: string, msgs: DirectMessage[]) {
  localStorage.setItem(`mc_dm_${convoId}`, JSON.stringify(msgs));
}

// ─── Hook ───────────────────────────────────────────────
export function useChat() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedRoomIds, setJoinedRoomIds] = useState<Set<string>>(new Set());
  const [currentMessages, setCurrentMessages] = useState<RoomMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [conversations, setConversations] = useState<DirectConversation[]>([]);
  const [currentDirectMessages, setCurrentDirectMessages] = useState<DirectMessage[]>([]);
  const anonymousNameRef = useRef<string>('');

  const userId = user?.uid || 'demo-user';
  if (!anonymousNameRef.current) {
    anonymousNameRef.current = isDemoMode ? 'CalmSoul' : generateAnonymousName(userId);
  }

  // Load rooms
  useEffect(() => {
    if (isDemoMode) {
      setRooms(getDemoRooms());
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const unsub = chatService.subscribeToRooms((data) => {
        setRooms(data);
        setLoading(false);
      });
      return unsub;
    } catch {
      setLoading(false);
    }
  }, []);

  // Load conversations
  useEffect(() => {
    if (isDemoMode) {
      setConversations(getDemoConversations());
      return;
    }
    try {
      const unsub = chatService.subscribeToConversations(userId, (data) => {
        setConversations(data);
      });
      return unsub;
    } catch { /* ignore */ }
  }, [userId]);

  // Join a room
  const joinRoom = useCallback(async (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    if (isDemoMode) {
      setJoinedRoomIds(prev => new Set([...prev, roomId]));
      const updated = rooms.map(r => r.id === roomId ? { ...r, memberCount: r.memberCount + 1 } : r);
      setRooms(updated);
      localStorage.setItem('mc_chat_rooms', JSON.stringify(updated));
      return;
    }

    try {
      await chatService.joinRoom(roomId, userId, anonymousNameRef.current);
      setJoinedRoomIds(prev => new Set([...prev, roomId]));
    } catch (e) {
      console.error('Failed to join room:', e);
    }
  }, [rooms, userId]);

  // Leave a room
  const leaveRoom = useCallback(async (roomId: string) => {
    if (isDemoMode) {
      setJoinedRoomIds(prev => { const n = new Set(prev); n.delete(roomId); return n; });
      return;
    }
    try {
      await chatService.leaveRoom(roomId, userId);
      setJoinedRoomIds(prev => { const n = new Set(prev); n.delete(roomId); return n; });
    } catch { /* ignore */ }
  }, [userId]);

  // Load messages for a room
  const loadRoomMessages = useCallback((roomId: string) => {
    if (isDemoMode) {
      setCurrentMessages(getDemoMessages(roomId));
      return () => {};
    }
    try {
      const unsub = chatService.subscribeToMessages(roomId, (msgs) => {
        setCurrentMessages(msgs);
      });
      return unsub;
    } catch { return () => {}; }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (roomId: string, content: string, replyTo?: RoomMessage['replyTo']) => {
    if (!content.trim()) return;

    if (isDemoMode) {
      const newMsg: RoomMessage = {
        id: `msg-${Date.now()}`,
        roomId,
        userId,
        anonymousName: anonymousNameRef.current,
        content: content.trim(),
        type: 'text',
        createdAt: { toDate: () => new Date() } as any,
        replyTo: replyTo || null,
        reactions: {},
      };
      const existing = getDemoMessages(roomId);
      const updated = [...existing, newMsg];
      saveDemoMessages(roomId, updated);
      setCurrentMessages(updated);
      return;
    }

    try {
      await chatService.sendMessage(roomId, userId, anonymousNameRef.current, content.trim(), replyTo);
    } catch (e) {
      console.error('Failed to send message:', e);
    }
  }, [userId]);

  // Add reaction
  const addReaction = useCallback(async (messageId: string, emoji: string) => {
    if (isDemoMode) {
      setCurrentMessages(prev => prev.map(msg => {
        if (msg.id !== messageId) return msg;
        const reactions = { ...msg.reactions };
        const existing = reactions[emoji] || [];
        if (existing.includes(userId)) {
          reactions[emoji] = existing.filter(id => id !== userId);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          reactions[emoji] = [...existing, userId];
        }
        return { ...msg, reactions };
      }));
      return;
    }
    try {
      await chatService.addReaction(messageId, emoji, userId);
    } catch { /* ignore */ }
  }, [userId]);

  // Typing indicator (lightweight simulation)
  const simulateTyping = useCallback((roomId: string) => {
    setTypingUsers(prev => ({ ...prev, [roomId]: true }));
    setTimeout(() => setTypingUsers(prev => ({ ...prev, [roomId]: false })), 2000 + Math.random() * 3000);
  }, []);

  // Private messages
  const loadDirectMessages = useCallback((convoId: string) => {
    if (isDemoMode) {
      setCurrentDirectMessages(getDemoDirectMsgs(convoId));
      return () => {};
    }
    try {
      const unsub = chatService.subscribeToDirectMessages(convoId, (msgs) => {
        setCurrentDirectMessages(msgs);
      });
      return unsub;
    } catch { return () => {}; }
  }, []);

  const sendDirectMessage = useCallback(async (convoId: string, content: string) => {
    if (!content.trim()) return;

    if (isDemoMode) {
      const newMsg: DirectMessage = {
        id: `dm-${Date.now()}`,
        conversationId: convoId,
        senderId: userId,
        anonymousName: anonymousNameRef.current,
        content: content.trim(),
        createdAt: { toDate: () => new Date() } as any,
      };
      const existing = getDemoDirectMsgs(convoId);
      const updated = [...existing, newMsg];
      saveDemoDirectMsgs(convoId, updated);
      setCurrentDirectMessages(updated);
      return;
    }

    try {
      await chatService.sendDirectMessage(convoId, userId, anonymousNameRef.current, content.trim());
    } catch { /* ignore */ }
  }, [userId]);

  const startConversation = useCallback(async (otherUserId: string) => {
    const otherName = getRandomAnonymousName();
    if (isDemoMode) {
      const existing = getDemoConversations();
      const found = existing.find(c => c.participantIds.includes(otherUserId) && c.participantIds.includes(userId));
      if (found) return found.id;

      const convo: DirectConversation = {
        id: `convo-${Date.now()}`,
        participantIds: [userId, otherUserId],
        participantNames: { [userId]: anonymousNameRef.current, [otherUserId]: otherName },
        lastMessage: undefined,
        lastMessageAt: { toDate: () => new Date() } as any,
        unreadCounts: { [userId]: 0, [otherUserId]: 0 },
        createdAt: { toDate: () => new Date() } as any,
      };
      const updated = [convo, ...existing];
      saveDemoConversations(updated);
      setConversations(updated);
      return convo.id;
    }

    return chatService.getOrCreateConversation(userId, otherUserId, anonymousNameRef.current, otherName);
  }, [userId]);

  // Report
  const reportMessage = useCallback(async (messageId: string, reason: string) => {
    if (isDemoMode) return;
    try { await chatService.reportMessage(messageId, userId, reason); } catch { /* ignore */ }
  }, [userId]);

  // Block
  const blockUser = useCallback(async (blockedUserId: string) => {
    if (isDemoMode) return;
    try { await chatService.blockUser(userId, blockedUserId); } catch { /* ignore */ }
  }, [userId]);

  return {
    rooms,
    loading,
    joinedRoomIds,
    currentMessages,
    typingUsers,
    conversations,
    currentDirectMessages,
    anonymousName: anonymousNameRef.current,
    userId,
    joinRoom,
    leaveRoom,
    loadRoomMessages,
    sendMessage,
    addReaction,
    simulateTyping,
    loadDirectMessages,
    sendDirectMessage,
    startConversation,
    reportMessage,
    blockUser,
  };
}
