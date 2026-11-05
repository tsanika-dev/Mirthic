import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}

export function Button({ variant = 'primary', size = 'md', children, fullWidth, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm shadow-teal-600/25',
    secondary: 'bg-navy-100 text-navy-700 hover:bg-navy-200',
    ghost: 'bg-transparent text-navy-600 hover:bg-navy-100',
    outline: 'bg-white border border-navy-200 text-navy-700 hover:bg-navy-50',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.button>
  )
}
