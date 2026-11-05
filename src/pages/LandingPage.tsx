import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, Activity, BookOpen, Users, Sparkles, Shield, Globe } from 'lucide-react';

const FEATURES = [
  { icon: Activity, title: 'Track Your Mood', description: 'Understand how you feel over time.', color: 'text-sage' },
  { icon: Heart, title: 'Practice Self Care', description: 'Small habits can create meaningful changes.', color: 'text-lavender' },
  { icon: BookOpen, title: 'Learn & Grow', description: 'Explore trusted mental-health resources.', color: 'text-sand' },
  { icon: Users, title: 'Find Support', description: 'Connect with resources and helplines.', color: 'text-mint' },
];

const STEPS = [
  { icon: '📊', title: 'Track', description: 'Log your mood and emotions daily' },
  { icon: '🧠', title: 'Understand', description: 'Discover patterns in your well-being' },
  { icon: '✨', title: 'Improve', description: 'Build healthy habits and grow' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#07090D] overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          muted
          autoPlay
          playsInline
          preload="auto"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090D]/60 via-[#07090D]/40 to-[#07090D]" />

        {/* Navbar */}
        <nav className="relative z-20 px-6 py-6">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage/20 to-lavender/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-sage" />
              </div>
              <span className="text-white font-semibold text-lg font-serif">Mirthic</span>
            </div>
            <div className="hidden md:flex items-center gap-8 ml-8">
              {['Features', 'About', 'Resources'].map(link => (
                <a key={link} href={`#${link.toLowerCase()}`} className="text-white/60 hover:text-white text-sm font-medium transition-colors">{link}</a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/login')} className="text-white/70 hover:text-white text-sm font-medium transition-colors">
                Sign Up
              </button>
              <button onClick={() => navigate('/login')} className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium hover:bg-white/5 transition-colors">
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[10%]">
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl text-white tracking-tight font-serif mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Take care of your mind,<br />
            <em className="italic text-sage/80">one day at a time.</em>
          </motion.h1>

          <motion.p
            className="text-white/50 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Understand your emotions, build healthy habits, and find support whenever you need it.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              onClick={() => navigate('/signup')}
              className="liquid-glass-pill px-8 py-3.5 text-white font-medium flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={() => navigate('/recreation')}
              className="liquid-glass-pill px-8 py-3.5 text-white/60 font-medium hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Mirthic
            </motion.button>
          </motion.div>
        </div>

        {/* Social icons */}
        <div className="relative z-10 flex justify-center gap-4 pb-12">
          {[Globe, Heart, Shield].map((Icon, i) => (
            <motion.div
              key={i}
              className="liquid-glass rounded-full p-4 text-white/50 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
              whileHover={{ y: -3 }}
            >
              <Icon className="w-5 h-5" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sage/60 text-sm tracking-widest uppercase mb-3">Features</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
              Everything you need for<br />
              <span className="text-sage/60 italic">mental wellness</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="liquid-glass rounded-2xl p-6 hover:bg-white/[0.04] transition-colors cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <feature.icon className={`w-8 h-8 ${feature.color} mb-4 opacity-60`} />
                <h3 className="text-white font-medium mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lavender/60 text-sm tracking-widest uppercase mb-3">How it works</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">
              Your mental health deserves<br />
              <span className="text-lavender/60 italic">attention too</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-serif text-2xl text-white mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-4xl mx-auto liquid-glass rounded-3xl p-12 md:p-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-4">
            Your wellness journey<br />
            <span className="text-sage/60 italic">starts here</span>
          </h2>
          <p className="text-white/40 text-lg mb-8 max-w-lg mx-auto">
            Join Mirthic today and take the first step towards better mental health.
          </p>
          <motion.button
            onClick={() => navigate('/signup')}
            className="liquid-glass-pill px-10 py-4 text-white font-medium text-lg flex items-center gap-2 mx-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sage/20 to-lavender/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sage" />
            </div>
            <span className="font-serif text-white text-lg">Mirthic</span>
          </div>
          <div className="flex items-center gap-6 text-white/30 text-sm">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
            <a href="#" className="hover:text-white/60 transition-colors">Resources</a>
            <a href="#" className="hover:text-white/60 transition-colors">Emergency</a>
          </div>
          <p className="text-white/20 text-xs">© 2026 Mirthic. Your mental well-being matters.</p>
        </div>
      </footer>
    </div>
  );
}