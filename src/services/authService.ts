import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL: string | null
  createdAt: unknown
  updatedAt: unknown
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    dailyMoodReminder: boolean
    exerciseReminder: boolean
    journalReminder: boolean
  }
}

export const authService = {
  async signUp(email: string, password: string, displayName: string): Promise<FirebaseUser> {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName })
    await this.createUserProfile(credential.user, displayName)
    return credential.user
  },

  async signIn(email: string, password: string): Promise<FirebaseUser> {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  },

  async signInWithGoogle(): Promise<FirebaseUser> {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    await this.createUserProfile(credential.user, credential.user.displayName || 'User')
    return credential.user
  },

  async signInAsGuest(): Promise<FirebaseUser> {
    const credential = await signInAnonymously(auth)
    await this.createUserProfile(credential.user, 'Guest User')
    return credential.user
  },

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email)
  },

  async signOut(): Promise<void> {
    await signOut(auth)
  },

  async updateDisplayName(name: string): Promise<void> {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name })
      const userRef = doc(db, 'users', auth.currentUser.uid)
      await setDoc(userRef, { displayName: name, updatedAt: serverTimestamp() }, { merge: true })
    }
  },

  async createUserProfile(user: FirebaseUser, displayName: string): Promise<void> {
    const userRef = doc(db, 'users', user.uid)
    const existing = await getDoc(userRef)
    if (!existing.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: displayName || user.displayName || 'User',
        email: user.email || '',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        preferences: {
          theme: 'light',
          notifications: true,
          dailyMoodReminder: true,
          exerciseReminder: true,
          journalReminder: true,
        },
      } satisfies Omit<UserProfile, 'createdAt' | 'updatedAt'> & { createdAt: unknown; updatedAt: unknown })
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid)
    const snap = await getDoc(userRef)
    return snap.exists() ? (snap.data() as UserProfile) : null
  },

  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback)
  },
}
