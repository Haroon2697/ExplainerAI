import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-ink-300/80 bg-white/60 px-6 py-16 text-center',
        className,
      )}
    >
      {/* Faint grid keeps the empty area from reading as a broken page. */}
      <div className="pointer-events-none absolute inset-0 grid-bg mask-radial opacity-70" aria-hidden />

      <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow">
        <span className="absolute inset-0 rounded-2xl bg-brand-400/30 animate-pulse-ring" aria-hidden />
        {icon}
      </div>

      <h3 className="relative text-base font-semibold text-ink-900">{title}</h3>
      <p className="relative mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>
      {action && <div className="relative mt-6">{action}</div>}
    </div>
  )
}
