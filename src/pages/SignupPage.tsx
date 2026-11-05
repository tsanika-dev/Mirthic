import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Heart } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')
    try {
      await signup(email, password, name)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? 'An account with this email already exists.' :
        err.code === 'auth/invalid-email' ? 'Invalid email address.' :
        err.code === 'auth/weak-password' ? 'Password is too weak.' :
        'Failed to create account. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute bottom-32 left-16 w-56 h-56 bg-white/10 rounded-full" />
        </div>
        <div className="relative text-center text-white px-12">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm"><Heart size={36} className="text-white" fill="white" /></div>
          <h2 className="text-3xl font-bold mb-4">Join Mirthic</h2>
          <p className="text-teal-100 text-lg leading-relaxed">Start your journey to better mental health. Create your free account today.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center"><span className="text-white font-bold">M</span></div>
            <span className="font-bold text-navy-900 text-xl">Mirthic</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-2">Create your account</h1>
          <p className="text-navy-500 mb-8">Begin your path to better mental wellness.</p>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required
                  className="w-full pl-11 pr-4 py-3 bg-navy-50 border border-navy-100 rounded-xl text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
              </div>
            </div>
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
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required
                  className="w-full pl-11 pr-11 py-3 bg-navy-50 border border-navy-100 rounded-xl text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 cursor-pointer">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" required
                  className={`w-full pl-11 pr-4 py-3 bg-navy-50 border rounded-xl text-sm text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all ${
                    confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-400' : 'border-navy-100 focus:border-teal-400'
                  }`} />
              </div>
              {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
            </div>
            <Button type="submit" fullWidth size="lg" disabled={loading || (password !== confirmPassword && confirmPassword !== '')}>
              {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight size={18} />}
            </Button>
          </form>
          <p className="text-center text-sm text-navy-500 mt-6">
            Already have an account? <Link to="/login" className="text-teal-600 hover:text-teal-700 font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
