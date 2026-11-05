interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
}

const colorPalette = [
  'bg-teal-100 text-teal-700',
  'bg-emerald-100 text-emerald-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]

function getColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colorPalette[Math.abs(hash) % colorPalette.length]
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function Avatar({ name, src, size = 'md' }: AvatarProps) {
  if (src) {
    return (
      <img src={src} alt={name} className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white`} />
    )
  }

  return (
    <div className={`${sizeMap[size]} rounded-full flex items-center justify-center font-semibold ring-2 ring-white ${getColor(name)}`}>
      {getInitials(name)}
    </div>
  )
}
