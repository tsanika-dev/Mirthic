import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Globe, ArrowRight, Heart, MessageCircle, ArrowUpRight } from 'lucide-react'

function useInViewOnce(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ── Hero ── */
function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const nav = useNavigate()

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const fade = (from: number, to: number, dur: number) =>
      new Promise<void>(resolve => {
        const start = performance.now()
        const step = (now: number) => {
          const p = Math.min((now - start) / dur, 1)
          v.style.opacity = String(from + (to - from) * p)
          if (p < 1) requestAnimationFrame(step)
          else resolve()
        }
        requestAnimationFrame(step)
      })
    const play = async () => {
      try { await v.play() } catch {}
      await fade(0, 1, 500)
    }
    v.addEventListener('canplay', play, { once: true })
    v.addEventListener('timeupdate', async () => {
      if (v.duration - v.currentTime <= 0.55) {
        await fade(1, 0, 500)
        v.currentTime = 0
        v.play()
        await fade(0, 1, 500)
      }
    })
    return () => v.removeEventListener('canplay', play)
  }, [])

  return (
    <div className="min-h-screen bg-black overflow-hidden relative flex flex-col">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover object-bottom" style={{ opacity: 0 }} muted playsInline preload="auto" autoPlay
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4" />

      {/* Navbar */}
      <nav className="relative z-20 px-6 py-6">
        <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe size={24} className="text-white" />
            <span className="text-white font-semibold text-lg">Mirthic</span>
          </div>
          <div className="hidden md:flex items-center gap-8 ml-8">
            <a href="#about" className="text-white/80 hover:text-white text-sm font-medium transition-colors">About</a>
            <a href="#features" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Features</a>
            <a href="#services" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Services</a>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => nav('/signup')} className="text-white text-sm font-medium cursor-pointer hover:text-white/80 transition-colors">Sign Up</button>
            <button onClick={() => nav('/login')} className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium cursor-pointer hover:bg-white/5 transition-colors">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[20%]">
        <h1 className="text-7xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap font-serif">
          Know it then <em className="italic">all</em>.
        </h1>
        <div className="max-w-xl w-full mt-10">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none text-sm" />
            <button className="bg-white rounded-full p-3 text-black hover:bg-white/90 transition-colors cursor-pointer">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        <p className="text-white text-sm leading-relaxed px-4 mt-6 max-w-md">
          Stay updated with the latest news and insights. Subscribe to our newsletter today and never miss out on exciting updates.
        </p>
        <button onClick={() => nav('/onboarding')} className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium mt-8 cursor-pointer hover:bg-white/5 transition-colors">
          Explore Mirthic
        </button>
      </div>

      {/* Social Icons */}
      <div className="relative z-10 flex justify-center gap-4 pb-12">
        {[Heart, MessageCircle, Globe].map((Icon, i) => (
          <button key={i} className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <Icon size={20} />
          </button>
        ))}
      </div>
    </div>
  )
}

/* ── About Section ── */
function AboutSection() {
  const { ref, visible } = useInViewOnce()
  return (
    <section ref={ref} id="about" className="bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-white/40 text-sm tracking-widest uppercase mb-6">About Us</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight">
          Pioneering <em className="italic font-serif text-white/60">ideas</em> for<br className="hidden md:block" />
          minds that <em className="italic font-serif text-white/60">create, build, and inspire.</em>
        </motion.h2>
      </div>
    </section>
  )
}

/* ── Featured Video ── */
function FeaturedVideoSection() {
  const { ref, visible } = useInViewOnce()
  return (
    <section ref={ref} className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 60 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9 }} className="rounded-3xl overflow-hidden aspect-video relative">
          <video className="w-full h-full object-cover" muted autoPlay loop playsInline preload="auto"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <p className="text-white/50 text-xs tracking-widest uppercase mb-3">Our Approach</p>
              <p className="text-white text-sm md:text-base leading-relaxed">
                We believe in the power of curiosity-driven exploration. Every project starts with a question, and every answer opens a new door to innovation.
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => window.location.href = '/onboarding'}
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium cursor-pointer hover:bg-white/5 transition-colors shrink-0">
              Explore more
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ── Philosophy ── */
function PhilosophySection() {
  const { ref, visible } = useInViewOnce()
  return (
    <section ref={ref} className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24">
          Innovation <em className="italic font-serif text-white/40">x</em> Vision
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="rounded-3xl overflow-hidden aspect-[4/3]">
            <video className="w-full h-full object-cover" muted autoPlay loop playsInline preload="auto"
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} animate={visible ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.3 }} className="flex flex-col justify-center">
            <div className="mb-10">
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Choose your space</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Every meaningful breakthrough begins at the intersection of disciplined strategy and remarkable creative vision. We operate at that crossroads, turning bold thinking into tangible outcomes that move people and reshape industries.
              </p>
            </div>
            <div className="w-full h-px bg-white/10 mb-10" />
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Shape the future</p>
              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                We believe that the best work emerges when curiosity meets conviction. Our process is designed to uncover hidden opportunities and translate them into experiences that resonate long after the first impression.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ── Services ── */
function ServicesSection() {
  const { ref, visible } = useInViewOnce()
  const cards = [
    { tag: 'Strategy', title: 'Research & Insight', desc: 'We dig deep into data, culture, and human behavior to surface the insights that drive meaningful, lasting change.', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4' },
    { tag: 'Craft', title: 'Design & Execution', desc: 'From concept to launch, we obsess over every detail to deliver experiences that feel effortless and look extraordinary.', video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4' },
  ]
  return (
    <section ref={ref} id="services" className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />
        <div className="relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="flex items-center justify-between mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl text-white tracking-tight">What we do</h2>
            <span className="text-white/40 text-sm hidden md:block">Our services</span>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {cards.map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 50 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: i * 0.15 }}
                className="liquid-glass rounded-3xl overflow-hidden group cursor-pointer">
                <div className="aspect-video relative overflow-hidden">
                  <video className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" muted autoPlay loop playsInline preload="auto" src={card.video} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6 md:p-8 flex items-start justify-between">
                  <div>
                    <p className="text-white/40 text-xs tracking-widest uppercase mb-3">{card.tag}</p>
                    <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">{card.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                  <div className="liquid-glass rounded-full p-2 shrink-0">
                    <ArrowUpRight size={18} className="text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Main Page ── */
export default function RecreationPage() {
  return (
    <div className="bg-black">
      <HeroSection />
      <AboutSection />
      <FeaturedVideoSection />
      <PhilosophySection />
      <ServicesSection />
    </div>
  )
}
