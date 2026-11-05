interface SkeletonProps {
  className?: string
  count?: number
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`bg-navy-100 rounded-xl animate-pulse ${className}`}
          style={{ animation: 'skeleton-pulse 1.5s ease-in-out infinite' }}
        />
      ))}
    </>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-100/50 p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-navy-100/50 p-6 space-y-3">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}
