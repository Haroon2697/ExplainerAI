import { useRef, type ReactNode } from 'react'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon?: ReactNode
  count?: number
}

/**
 * Underlined tabs with a single travelling indicator. The indicator is
 * measured from the active trigger and moved with a transform, so switching
 * tabs never triggers layout on the list itself.
 */
export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  className?: string
}) {
  const listRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const list = listRef.current
      const indicator = indicatorRef.current
      if (!list || !indicator) return
      const active = list.querySelector<HTMLButtonElement>(`[data-tab="${value}"]`)
      if (!active) return

      gsap.to(indicator, {
        x: active.offsetLeft,
        width: active.offsetWidth,
        duration: prefersReducedMotion() ? 0 : 0.42,
        ease: EASE.out,
      })
    },
    { dependencies: [value, items.length] },
  )

  return (
    <div className={cn('relative border-b border-ink-200/80', className)}>
      <div ref={listRef} role="tablist" className="relative flex gap-1 overflow-x-auto">
        {items.map((item) => {
          const active = item.id === value
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={active}
              data-tab={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                'group relative flex items-center gap-2 whitespace-nowrap px-3.5 pb-3 pt-2 text-sm font-semibold transition-colors duration-200',
                active ? 'text-brand-700' : 'text-ink-500 hover:text-ink-800',
              )}
            >
              {item.icon && (
                <span className={cn('transition-colors', active ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-600')}>
                  {item.icon}
                </span>
              )}
              {item.label}
              {typeof item.count === 'number' && (
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums transition-colors',
                    active ? 'bg-brand-50 text-brand-700' : 'bg-ink-100 text-ink-500',
                  )}
                >
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
        <span
          ref={indicatorRef}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 rounded-full bg-brand-600"
        />
      </div>
    </div>
  )
}
