import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { auth, isDemoMode } from '../config/firebase'
import { authService, type UserProfile } from '../services/authService'

// Demo user for when Firebase is not configured
const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@mindcare.app',
  displayName: 'Demo User',
  isAnonymous: false,
  metadata: { creationTime: new Date().toISOString() },
  providerData: [],
  delete: async () => {},
  getIdToken: async () => 'demo-token',
  getIdTokenResult: async () => ({ token: 'demo-token', signInProvider: 'demo' } as any),
  reload: async () => {},
  toJSON: () => ({}),
} as unknown as FirebaseUser

interface AuthContextType {
  user: FirebaseUser | null
  profile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  isGuest: boolean
  isDemoMode: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginAsGuest: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (name: string) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      // In demo mode, auto-login as demo user
      setUser(DEMO_USER)
      setProfile({ uid: 'demo-user-001', displayName: 'Demo User', email: 'demo@mindcare.app', photoURL: null, createdAt: new Date(), updatedAt: new Date() } as any)
      setLoading(false)
      return
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser)
        if (firebaseUser) {
          try {
            const userProfile = await authService.getUserProfile(firebaseUser.uid)
            setProfile(userProfile)
          } catch {
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
        setLoading(false)
      }, (error) => {
        console.warn('Auth state listener error:', error.message)
        // Fall back to demo user on auth errors
        setUser(DEMO_USER)
        setProfile({ uid: 'demo-user-001', displayName: 'Demo User', email: 'demo@mindcare.app', photoURL: null, createdAt: new Date(), updatedAt: new Date() } as any)
        setLoading(false)
      })
      return unsubscribe
    } catch (error) {
      console.warn('Firebase auth initialization error:', error)
      setUser(DEMO_USER)
      setProfile({ uid: 'demo-user-001', displayName: 'Demo User', email: 'demo@mindcare.app', photoURL: null, createdAt: new Date(), updatedAt: new Date() } as any)
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    if (isDemoMode) {
      setUser(DEMO_USER)
      setProfile({ uid: 'demo-user-001', displayName: email.split('@')[0], email, photoURL: null, createdAt: new Date(), updatedAt: new Date() } as any)
      return
    }
    await authService.signIn(email, password)
  }, [])

  const signup = useCallback(async (email: string, password: string, name: string) => {
    if (isDemoMode) {
      const demoUser = { ...DEMO_USER, displayName: name, email } as FirebaseUser
      setUser(demoUser)
      setProfile({ uid: 'demo-user-001', displayName: name, email, photoURL: null, createdAt: new Date(), updatedAt: new Date() } as any)
      return
    }
    await authService.signUp(email, password, name)
  }, [])

  const loginWithGoogle = useCallback(async () => {
    if (isDemoMode) {
      setUser(DEMO_USER)
      setProfile({ uid: 'demo-user-001', displayName: 'Demo User', email: 'demo@mindcare.app', photoURL: null, createdAt: new Date(), updatedAt: new Date() } as any)
      return
    }
    await authService.signInWithGoogle()
  }, [])

  const loginAsGuest = useCallback(async () => {
    if (isDemoMode) {
      setUser({ ...DEMO_USER, isAnonymous: true } as unknown as FirebaseUser)
      setProfile({ uid: 'demo-user-001', displayName: 'Guest', email: '', photoURL: null, createdAt: new Date(), updatedAt: new Date() } as any)
      return
    }
    await authService.signInAsGuest()
  }, [])

  const logout = useCallback(async () => {
    if (isDemoMode) {
      setUser(null)
      setProfile(null)
      return
    }
    await authService.signOut()
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    if (isDemoMode) return
    await authService.resetPassword(email)
  }, [])

  const updateProfile = useCallback(async (name: string) => {
    if (isDemoMode) {
      if (user) {
        setUser({ ...user, displayName: name } as unknown as FirebaseUser)
        setProfile(prev => prev ? { ...prev, displayName: name } as any : prev)
      }
      return
    }
    await authService.updateDisplayName(name)
    if (user) {
      const updated = await authService.getUserProfile(user.uid)
      setProfile(updated)
    }
  }, [user])

  const refreshProfile = useCallback(async () => {
    if (isDemoMode) return
    if (user) {
      const updated = await authService.getUserProfile(user.uid)
      setProfile(updated)
    }
  }, [user])

  const isAuthenticated = user !== null
  const isGuest = user?.isAnonymous ?? false

  return (
    <AuthContext.Provider value={{
      user, profile, loading, isAuthenticated, isGuest, isDemoMode,
      login, signup, loginWithGoogle, loginAsGuest, logout,
      resetPassword, updateProfile, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}