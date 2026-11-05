import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { MusicProvider } from './context/MusicContext'
import { AppLayout } from './components/layout/AppLayout'
import { HeartTransition } from './components/ui/HeartTransition'

import RecreationPage from './pages/RecreationPage'
import LandingPage from './pages/LandingPage'
import OnboardingPage from './pages/OnboardingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import MoodTrackerPage from './pages/MoodTrackerPage'
import JournalPage from './pages/JournalPage'
import JournalDetailPage from './pages/JournalDetailPage'
import SelfCarePage from './pages/SelfCarePage'
import SelfCareDetailPage from './pages/SelfCareDetailPage'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import ExercisesPage from './pages/ExercisesPage'
import ResourcesPage from './pages/ResourcesPage'
import CommunityPage from './pages/CommunityPage'
import ChatRoomPage from './pages/ChatRoomPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import PlayListenPage from './pages/PlayListenPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  const [showTransition, setShowTransition] = useState(true)

  const handleTransitionComplete = useCallback(() => {
    setShowTransition(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-sage border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-white/40">Loading Mirthic...</p>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return (
    <>
      {showTransition && <HeartTransition onComplete={handleTransitionComplete} />}
      {children}
    </>
  )
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/recreation" element={<RecreationPage />} />
        <Route path="/onboarding" element={<PublicRoute><OnboardingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/mood" element={<MoodTrackerPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/journal/:id" element={<JournalDetailPage />} />
          <Route path="/play-listen" element={<PlayListenPage />} />
          <Route path="/self-care" element={<SelfCarePage />} />
          <Route path="/self-care/:id" element={<SelfCareDetailPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/articles/:id" element={<ArticleDetailPage />} />
          <Route path="/self-care/exercises" element={<SelfCarePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/community/rooms/:roomId" element={<ChatRoomPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <MusicProvider>
            <AppRoutes />
          </MusicProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
