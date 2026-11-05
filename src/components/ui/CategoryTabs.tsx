import { motion } from 'framer-motion'

interface CategoryTabsProps {
  categories: string[]
  active: string
  onChange: (category: string) => void
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
            active === cat
              ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/25'
              : 'bg-navy-100 text-navy-600 hover:bg-navy-200'
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  )
}
