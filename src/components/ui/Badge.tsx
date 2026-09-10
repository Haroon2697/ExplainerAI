import type { ReactNode } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProjectStatus } from '@/types'

export function Badge({
  children,
  className,
  tone = 'neutral',
}: {
  children: ReactNode
  className?: string
  tone?: 'neutral' | 'brand' | 'success' | 'warning'
}) {
  const tones = {
    neutral: 'bg-ink-100/80 text-ink-600 ring-ink-200/70',
    brand: 'bg-brand-50 text-brand-700 ring-brand-200/70',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200/70',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide ring-1 ring-inset',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  if (status === 'processing') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-amber-50 py-1 pl-1.5 pr-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-700 ring-1 ring-inset ring-amber-200/80',
          className,
        )}
      >
        <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
        Processing
      </span>
    )
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-emerald-50 py-1 pl-1.5 pr-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-emerald-700 ring-1 ring-inset ring-emerald-200/80',
        className,
      )}
    >
      <CheckCircle2 className="h-3 w-3" aria-hidden />
      Completed
    </span>
  )
}

/** Ranking score chip. Colour tracks confidence so a weak workflow reads as weak. */
export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const tone =
    score >= 0.9
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/70'
      : score >= 0.8
        ? 'bg-brand-50 text-brand-700 ring-brand-200/70'
        : 'bg-ink-100 text-ink-600 ring-ink-200/70'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg px-2 py-1 font-mono text-[11px] font-medium ring-1 ring-inset',
        tone,
        className,
      )}
      title="Explanatory value score"
    >
      <span className="opacity-60">Score</span>
      {score.toFixed(2)}
    </span>
  )
}
