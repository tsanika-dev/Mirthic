import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, AlertCircle, Info } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  isVisible: boolean
  onClose: () => void
}

const icons = {
  success: <CheckCircle size={18} className="text-emerald-500" />,
  error: <AlertCircle size={18} className="text-red-500" />,
  info: <Info size={18} className="text-sky-500" />,
}

export function Toast({ message, type = 'success', isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          className="fixed bottom-6 left-1/2 z-[100] bg-white rounded-xl shadow-lg border border-navy-100 px-4 py-3 flex items-center gap-3 min-w-[280px]"
        >
          {icons[type]}
          <span className="text-sm text-navy-700 font-medium">{message}</span>
          <button onClick={onClose} className="ml-auto p-1 hover:bg-navy-100 rounded-lg cursor-pointer">
            <X size={14} className="text-navy-400" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
