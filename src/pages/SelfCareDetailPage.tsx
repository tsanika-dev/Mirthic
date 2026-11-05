import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, CheckCircle } from 'lucide-react'
import { useSaved } from '../hooks/useSaved'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'
import { mockSelfCareActivities } from '../data/mockData'

const actionSteps: Record<string, string[]> = {
  '1': ['Stretch for 5 minutes when you wake up', 'Drink a glass of water before breakfast', 'Take 3 deep breaths before starting work', 'Write down one thing you are grateful for'],
  '2': ['Pick one new habit to focus on this week', 'Set a small daily goal related to it', 'Track your progress each evening', 'Celebrate your consistency after 7 days'],
  '3': ['Notice one positive thing each hour', 'Reframe one negative thought today', 'Write a short gratitude list before bed', 'Give yourself a genuine compliment'],
  '4': ['Set a consistent bedtime alarm', 'Put screens away 30 minutes before sleep', 'Try a calming bedtime tea', 'Practice the 4-7-8 breathing technique in bed'],
  '5': ['Set a 30-minute timer without screens', 'Go for a walk without your phone', 'Read a physical book or magazine', 'Have a conversation without checking notifications'],
  '6': ['Write out your ideal daily schedule', 'Block time for meals, movement, and rest', 'Stick to your routine for 3 days', 'Adjust and refine based on what works'],
}

const benefits: Record<string, string[]> = {
  '1': ['Sets a positive tone for the day', 'Improves mental clarity', 'Builds self-awareness', 'Creates consistency'],
  '2': ['Increases self-discipline', 'Builds momentum over time', 'Creates lasting positive change', 'Boosts self-confidence'],
  '3': ['Shifts focus to the positive', 'Reduces negative self-talk', 'Improves emotional resilience', 'Enhances overall mood'],
  '4': ['Improves sleep quality', 'Regulates circadian rhythm', 'Boosts immune function', 'Enhances cognitive performance'],
  '5': ['Reduces digital fatigue', 'Lowers anxiety levels', 'Improves present-moment awareness', 'Strengthens real-world connections'],
  '6': ['Provides structure and comfort', 'Reduces decision fatigue', 'Ensures all needs are met', 'Creates a sense of control'],
}

export default function SelfCareDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { favoriteIds, toggleFavorite } = useSaved()
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')

  const activity = mockSelfCareActivities.find(a => a.id === id)
  const isFavorited = favoriteIds.includes(id || '')

  if (!activity) return (
    <div className="max-w-3xl mx-auto py-20 text-center"><p className="text-navy-400 text-lg mb-4">Activity not found</p><Button onClick={() => navigate('/self-care')}>Back to Self Care</Button></div>
  )

  const handleToggleFavorite = async () => {
    await toggleFavorite(activity.id, 'selfcare')
    setToastMsg(isFavorited ? 'Removed from favorites' : 'Added to favorites ❤️'); setShowToast(true)
  }

  const steps = actionSteps[id || ''] || ['Start with small steps', 'Be consistent', 'Track your progress', 'Celebrate wins']
  const benefitsList = benefits[id || ''] || ['Improves well-being', 'Builds healthy habits', 'Reduces stress', 'Enhances mood']

  return (
    <div className="max-w-3xl mx-auto">
      <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/self-care')} className="flex items-center gap-2 text-sm text-navy-500 hover:text-navy-700 mb-6 cursor-pointer"><ArrowLeft size={18} />Back to Self Care</button>
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div className="text-5xl">{activity.icon}</div>
            <Button onClick={handleToggleFavorite} variant={isFavorited ? 'primary' : 'outline'} size="sm">
              <Heart size={16} fill={isFavorited ? 'white' : 'none'} />{isFavorited ? 'Favorited' : 'Favorite'}
            </Button>
          </div>
          <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full inline-block mb-3">{activity.category}</span>
          <h1 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">{activity.title}</h1>
          <p className="text-navy-600 leading-relaxed mb-8">{activity.description}</p>
          <div className="mb-8">
            <h3 className="font-semibold text-navy-900 mb-4">Benefits</h3>
            <div className="grid grid-cols-2 gap-3">{benefitsList.map((benefit, i) => <div key={i} className="flex items-start gap-2 p-3 bg-teal-50 rounded-xl"><CheckCircle size={16} className="text-teal-600 mt-0.5 shrink-0" /><span className="text-sm text-navy-700">{benefit}</span></div>)}</div>
          </div>
          <div>
            <h3 className="font-semibold text-navy-900 mb-4">Simple Action Steps</h3>
            <div className="space-y-3">{steps.map((step, i) => <div key={i} className="flex items-center gap-3 p-3 bg-navy-50 rounded-xl"><div className="w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{i + 1}</div><span className="text-sm text-navy-700">{step}</span></div>)}</div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
