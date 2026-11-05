import { motion } from 'framer-motion'
import type { MoodLevel } from '../../types'
import { MOOD_CONFIG } from '../../data/mockData'

interface MoodSelectorProps {
  selected: MoodLevel | null
  onSelect: (mood: MoodLevel) => void
  size?: 'sm' | 'md' | 'lg'
}

export function MoodSelector({ selected, onSelect, size = 'md' }: MoodSelectorProps) {
  const moods = Object.entries(MOOD_CONFIG) as [MoodLevel, typeof MOOD_CONFIG[MoodLevel]][]

  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  }

  return (
    <div className="flex gap-3 md:gap-4 justify-center flex-wrap">
      {moods.map(([key, config]) => (
        <motion.button
          key={key}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onSelect(key)}
          className={`flex flex-col items-center gap-2 cursor-pointer group`}
        >
          <div
            className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center transition-all duration-200 ${
              selected === key
                ? 'ring-2 ring-offset-2 shadow-lg'
                : 'hover:shadow-md'
            }`}
            style={{
              backgroundColor: selected === key ? `${config.color}15` : '#f1f5f9',
              borderColor: config.color,
              boxShadow: selected === key ? `0 0 0 2px white, 0 0 0 4px ${config.color}` : undefined,
            }}
          >
            <span className="transition-transform duration-200 group-hover:scale-110">{config.emoji}</span>
          </div>
          <span className={`text-xs font-medium transition-colors ${
            selected === key ? 'text-navy-800' : 'text-navy-400 group-hover:text-navy-600'
          }`}>
            {config.label}
          </span>
        </motion.button>
      ))}
    </div>
  )
}
