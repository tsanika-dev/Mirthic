import { createContext, useContext, useCallback, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface NotificationPrefs {
  dailyMood: boolean
  exercise: boolean
  articles: boolean
  community: boolean
}

interface AppState {
  sidebarOpen: boolean
  mobileNavOpen: boolean
  theme: 'light' | 'dark' | 'system'
  notificationPrefs: NotificationPrefs
}

interface AppContextType extends AppState {
  toggleSidebar: () => void
  toggleMobileNav: () => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setNotificationPrefs: (prefs: NotificationPrefs) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpenState] = useLocalStorage('mc_sidebarOpen', true)
  const [mobileNavOpen, setMobileNavOpen] = useLocalStorage('mc_mobileNavOpen', false)
  const [theme, setThemeState] = useLocalStorage<'light' | 'dark' | 'system'>('mc_theme', 'light')
  const [notificationPrefs, setNotificationPrefsState] = useLocalStorage<NotificationPrefs>('mc_notifPrefs', {
    dailyMood: true, exercise: true, articles: true, community: true,
  })

  const toggleSidebar = useCallback(() => {
    setSidebarOpenState(prev => !prev)
  }, [setSidebarOpenState])

  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen(prev => !prev)
  }, [setMobileNavOpen])

  const setSidebarOpen = useCallback((open: boolean) => {
    setSidebarOpenState(open)
  }, [setSidebarOpenState])

  const setTheme = useCallback((t: 'light' | 'dark' | 'system') => {
    setThemeState(t)
  }, [setThemeState])

  const setNotificationPrefs = useCallback((prefs: NotificationPrefs) => {
    setNotificationPrefsState(prefs)
  }, [setNotificationPrefsState])

  return (
    <AppContext.Provider value={{
      sidebarOpen, mobileNavOpen, theme, notificationPrefs,
      toggleSidebar, toggleMobileNav, setSidebarOpen, setTheme, setNotificationPrefs,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppProvider')
  return context
}

// Alias for backward compatibility
export const useApp = useAppContext