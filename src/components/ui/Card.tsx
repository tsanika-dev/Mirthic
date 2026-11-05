import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-sm border border-navy-100/50 p-6 ${hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  )
}
