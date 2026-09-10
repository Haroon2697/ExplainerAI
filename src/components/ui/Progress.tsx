import { Check, Loader2 } from 'lucide-react'
import { useCountUp, useProgressBar } from '@/hooks/useAnimations'
import { cn } from '@/lib/utils'
import type { PipelineStage } from '@/types'

export function ProgressBar({
  value,
  className,
  barClassName,
  showValue = false,
  size = 'md',
}: {
  value: number
  className?: string
  barClassName?: string
  showValue?: boolean
  size?: 'sm' | 'md'
}) {
  const barRef = useProgressBar(value)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn('relative w-full overflow-hidden rounded-full bg-ink-200/70', size === 'sm' ? 'h-1' : 'h-1.5')}
      >
        <div
          ref={barRef}
          style={{ width: 0 }}
          className={cn('relative h-full rounded-full bg-brand-600', barClassName)}
        >
          {/* Sheen conveys "still working" without a second spinner. */}
          <span className="absolute inset-0 bg-brand-sheen bg-[length:200%_100%] animate-shimmer" aria-hidden />
        </div>
      </div>
      {showValue && (
        <span className="w-10 shrink-0 text-right font-mono text-xs tabular-nums text-ink-500">{Math.round(value)}%</span>
      )}
    </div>
  )
}

/** Big animated percentage used on the generation overlay. */
export function ProgressReadout({ value }: { value: number }) {
  const ref = useCountUp<HTMLSpanElement>(value, { duration: 0.6, suffix: '%' })
  return (
    <span ref={ref} className="font-mono text-sm font-medium tabular-nums text-ink-500">
      0%
    </span>
  )
}

export function StepIndicator({
  stages,
  activeIndex,
  className,
}: {
  stages: PipelineStage[]
  activeIndex: number
  className?: string
}) {
  return (
    <ol className={cn('space-y-1', className)}>
      {stages.map((stage, i) => {
        const done = i < activeIndex
        const active = i === activeIndex
        return (
          <li
            key={stage.id}
            className={cn(
              'flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-300',
              active && 'bg-brand-50/70',
            )}
          >
            <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
              {active && (
                <span className="absolute inset-0 rounded-full bg-brand-400/40 animate-pulse-ring" aria-hidden />
              )}
              <span
                className={cn(
                  'relative flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300',
                  done && 'bg-emerald-500 text-white',
                  active && 'bg-brand-600 text-white',
                  !done && !active && 'bg-ink-200 text-ink-500',
                )}
              >
                {done ? <Check className="h-3 w-3" /> : active ? <Loader2 className="h-3 w-3 animate-spin" /> : i + 1}
              </span>
            </span>

            <span className="min-w-0">
              <span
                className={cn(
                  'block text-sm font-semibold transition-colors duration-300',
                  done ? 'text-ink-500' : active ? 'text-brand-800' : 'text-ink-400',
                )}
              >
                {stage.label}
              </span>
              <span className={cn('block text-xs', active ? 'text-brand-600/80' : 'text-ink-400')}>{stage.detail}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
