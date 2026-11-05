import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Heart } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const navigate = useNavigate()
  const { login, loginWithGoogle, loginAsGuest, resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.code === 'auth/user-not-found' ? 'No account found with this email.' :
        err.code === 'auth/wrong-password' ? 'Incorrect password.' :
        err.code === 'auth/invalid-email' ? 'Invalid email address.' :
        'Failed to sign in. Please try again.')
    } finally { setLoading(false) }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err: any) {
      setError('Failed to sign in with Google. Please try again.')
    } finally { setLoading(false) }
  }

  const handleGuestLogin = async () => {
    setLoading(true)
    try {
      await loginAsGuest()
      navigate('/dashboard')
    } catch { setError('Failed to continue as guest.') }
    finally { setLoading(false) }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resetPassword(resetEmail)
      setResetSent(true)
    } catch (err: any) {
      setError(err.code === 'auth/user-not-found' ? 'No account found with this email.' : 'Failed to send reset email.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute bottom-32 right-16 w-56 h-56 bg-white/10 rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white/10 rounded-full" />
        </div>
        <div className="relative text-center text-white px-12">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"><Heart size={36} className="text-white" fill="white" /></div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Mirthic</h2>
          <p className="text-teal-100 text-lg leading-relaxed">Your safe space for mental wellness. Track your mood, practice self-care, and find support.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center"><span className="text-white font-bold">M</span></div>
            <span className="font-bold text-navy-900 text-xl">Mirthic</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">Welcome back</h1>
          <p className="text-navy-500 mb-8">Sign in to continue your wellness journey.</p>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

          {showReset ? (
            resetSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Mail size={28} className="text-teal-600" /></div>
                <h3 className="font-semibold text-navy-900 mb-2">Check your email</h3>
                <p className="text-sm text-navy-500 mb-6">We sent a password reset link to {resetEmail}</p>
                <Button onClick={() => { setShowReset(false); setResetSent(false) }} variant="outline">Back to Login</Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-sm text-navy-600 mb-2">Enter your email and we'll send you a reset link.</p>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                  <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="you@example.com" required
                    className="w-full pl-11 pr-4 py-3 bg-navy-50 border border-navy-100 rounded-xl text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
                </div>
                <div className="flex gap-3">
                  <Button type="button" onClick={() => setShowReset(false)} variant="ghost" className="flex-1">Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={loading}>Send Reset Link</Button>
                </div>
              </form>
            )
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                      className="w-full pl-11 pr-4 py-3 bg-navy-50 border border-navy-100 rounded-xl text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required
                      className="w-full pl-11 pr-11 py-3 bg-navy-50 border border-navy-100 rounded-xl text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 cursor-pointer">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="button" onClick={() => { setShowReset(true); setResetEmail(email) }} className="text-sm text-teal-600 hover:text-teal-700 font-medium cursor-pointer">Forgot password?</button>
                </div>
                <Button type="submit" fullWidth size="lg" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign In'} {!loading && <ArrowRight size={18} />}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-navy-200" />
                <span className="text-xs text-navy-400 font-medium">or</span>
                <div className="flex-1 h-px bg-navy-200" />
              </div>

              <div className="space-y-3">
                <Button onClick={handleGoogleLogin} variant="outline" fullWidth size="lg" disabled={loading}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </Button>
                <Button onClick={handleGuestLogin} variant="ghost" fullWidth size="lg" disabled={loading}>Continue as Guest</Button>
              </div>

              <p className="text-center text-sm text-navy-500 mt-6">
                Don't have an account? <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-semibold">Create one</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
