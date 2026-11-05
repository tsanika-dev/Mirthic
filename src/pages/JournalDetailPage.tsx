import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit3, Trash2, Calendar, Tag } from 'lucide-react'
import { useJournal } from '../hooks/useJournal'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'
import { MOOD_CONFIG } from '../data/mockData'

export default function JournalDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { entries: journalEntries, deleteEntry: deleteJournalEntry } = useJournal()
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const entry = journalEntries.find(e => e.id === id)

  if (!entry) return (
    <div className="max-w-3xl mx-auto py-20 text-center">
      <p className="text-navy-400 text-lg mb-4">Journal entry not found</p>
      <Button onClick={() => navigate('/journal')}>Back to Journal</Button>
    </div>
  )

  const handleDelete = async () => {
    await deleteJournalEntry(entry.id)
    setToastMsg('Entry deleted'); setShowToast(true)
    setTimeout(() => navigate('/journal'), 800)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Toast message={toastMsg} isVisible={showToast} onClose={() => setShowToast(false)} />
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate('/journal')} className="flex items-center gap-2 text-sm text-navy-500 hover:text-navy-700 mb-6 cursor-pointer"><ArrowLeft size={18} />Back to Journal</button>
        <Card>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              {entry.mood && <span className="text-4xl">{MOOD_CONFIG[entry.mood].emoji}</span>}
              <div><h1 className="text-xl md:text-2xl font-bold text-navy-900">{entry.title}</h1>
                <div className="flex items-center gap-2 mt-1 text-sm text-navy-500"><Calendar size={14} /><span>{new Date((entry.createdAt as any)?.toDate?.() || entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span></div></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate('/journal')} className="p-2 rounded-lg hover:bg-navy-100 text-navy-400 hover:text-navy-600 cursor-pointer" aria-label="Edit"><Edit3 size={18} /></button>
              <button onClick={() => setShowDeleteConfirm(true)} className="p-2 rounded-lg hover:bg-red-50 text-navy-400 hover:text-red-500 cursor-pointer" aria-label="Delete"><Trash2 size={18} /></button>
            </div>
          </div>
          {entry.mood && <div className="mb-6 p-3 bg-navy-50 rounded-xl flex items-center gap-2"><span className="text-lg">{MOOD_CONFIG[entry.mood].emoji}</span><span className="text-sm font-medium text-navy-700">Mood: {MOOD_CONFIG[entry.mood].label}</span></div>}
          <div>{entry.content.split('\n').map((line, i) => <p key={i} className="text-navy-700 leading-relaxed mb-3 text-sm">{line}</p>)}</div>
          {entry.tags.length > 0 && (
            <div className="mt-6 pt-4 border-t border-navy-100">
              <div className="flex items-center gap-2 mb-2"><Tag size={14} className="text-navy-400" /><span className="text-sm font-medium text-navy-600">Tags</span></div>
              <div className="flex flex-wrap gap-2">{entry.tags.map(tag => <span key={tag} className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">{tag}</span>)}</div>
            </div>
          )}
        </Card>
      </motion.div>
      {showDeleteConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-semibold text-navy-900 mb-2">Delete Entry</h3>
            <p className="text-sm text-navy-500 mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3"><Button onClick={() => setShowDeleteConfirm(false)} variant="ghost" className="flex-1">Cancel</Button><Button onClick={handleDelete} className="flex-1 !bg-red-500 hover:!bg-red-600">Delete</Button></div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
