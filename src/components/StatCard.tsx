import type { ReactNode } from 'react'
import { useCountUp } from '@/hooks/useAnimations'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: number
  decimals?: number
  suffix?: string
  prefix?: string
  separator?: boolean
  hint?: string
  accentClassName?: string
  className?: string
  delay?: number
}

/**
 * Metric tile whose number counts up when it scrolls into view. The tween
 * writes straight to the DOM node, so the count never re-renders React.
 */
export function StatCard({
  icon,
  label,
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  separator = false,
  hint,
  accentClassName = 'bg-brand-50 text-brand-600 ring-brand-100',
  className,
  delay = 0,
}: StatCardProps) {
  const valueRef = useCountUp<HTMLSpanElement>(value, { decimals, suffix, prefix, separator, delay })

  return (
    <div
      data-reveal
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition-[box-shadow,border-color] duration-300 ease-smooth hover:border-brand-200 hover:shadow-card-hover',
        className,
      )}
    >
      <span
        className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-brand-500/[0.06] blur-xl transition-transform duration-500 ease-smooth group-hover:scale-150"
        aria-hidden
      />

      <div className="relative flex items-center gap-3">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-transform duration-300 ease-smooth group-hover:scale-105',
            accentClassName,
          )}
        >
          {icon}
        </span>
        <span className="label">{label}</span>
      </div>

      <p className="relative mt-3 text-[26px] font-bold leading-none tracking-[-0.03em] text-ink-900">
        <span ref={valueRef} className="tabular-nums">
          {prefix}0{suffix}
        </span>
      </p>

      {hint && <p className="relative mt-1.5 text-[12px] text-ink-400">{hint}</p>}
    </div>
  )
}
