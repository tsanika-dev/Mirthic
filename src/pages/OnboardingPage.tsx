import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Brain, Users, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'

const slides = [
  {
    icon: Heart,
    title: 'You Matter',
    description: 'Take care of your mind the way you take care of your body.',
    color: 'from-rose-400 to-rose-500',
    bgColor: 'bg-rose-50',
  },
  {
    icon: Brain,
    title: 'Be Aware',
    description: 'Learn, understand and break the stigma around mental health.',
    color: 'from-teal-400 to-teal-500',
    bgColor: 'bg-teal-50',
  },
  {
    icon: Users,
    title: 'We Are Here',
    description: 'Get support, find resources and connect with professionals.',
    color: 'from-violet-400 to-violet-500',
    bgColor: 'bg-violet-50',
  },
]

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()

  const next = () => {
    if (current < slides.length - 1) setCurrent(current + 1)
    else navigate('/login')
  }

  const prev = () => {
    if (current > 0) setCurrent(current - 1)
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Skip button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-navy-400 hover:text-navy-600 font-medium cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Slides */}
        <div className="bg-white rounded-3xl shadow-sm border border-navy-100/50 p-8 md:p-10 min-h-[480px] flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className={`w-24 h-24 ${slides[current].bgColor} rounded-3xl flex items-center justify-center mb-8 mt-4`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${slides[current].color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  {(() => {
                    const Icon = slides[current].icon
                    return <Icon size={32} className="text-white" />
                  })()}
                </div>
              </div>

              {/* Text */}
              <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">{slides[current].title}</h2>
              <p className="text-navy-500 text-base leading-relaxed max-w-xs">{slides[current].description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8 mb-6">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 bg-teal-500' : 'w-1.5 bg-navy-200'
                }`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={prev}
              variant="ghost"
              disabled={current === 0}
              className="opacity-0 pointer-events-none"
            >
              <ChevronLeft size={18} />
              Back
            </Button>

            {current === slides.length - 1 ? (
              <Button onClick={() => navigate('/login')} className="flex items-center gap-2">
                <Sparkles size={16} />
                Get Started
              </Button>
            ) : (
              <Button onClick={next} className="flex items-center gap-2">
                Next
                <ChevronRight size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
