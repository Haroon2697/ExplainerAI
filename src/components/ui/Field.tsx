import { type ReactNode, type SelectHTMLAttributes } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Field({
  label,
  hint,
  children,
  className,
  htmlFor,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
  htmlFor?: string
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-ink-700">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-400">{hint}</p>}
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-10 w-full appearance-none rounded-xl border border-ink-200 bg-white pl-3.5 pr-9 text-sm font-medium text-ink-800',
          'transition-colors duration-200 hover:border-ink-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10',
          className,
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
    </div>
  )
}

/** Segmented radio group — used for video length and tone pickers. */
export function SegmentedControl({
  options,
  value,
  onChange,
  className,
}: {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex rounded-xl border border-ink-200 bg-ink-100/60 p-1', className)}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            'rounded-lg px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200 ease-smooth',
            value === opt.value ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-800',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

/** Multi-select chips for focus areas. */
export function ChipGroup({
  options,
  values,
  onToggle,
  className,
}: {
  options: string[]
  values: string[]
  onToggle: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const active = values.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ease-smooth',
              active
                ? 'border-brand-300 bg-brand-50 text-brand-700 shadow-[0_0_0_3px_rgba(79,70,229,.06)]'
                : 'border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50',
            )}
          >
            <span
              className={cn(
                'flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border transition-colors',
                active ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-300 bg-white',
              )}
            >
              {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
            </span>
            {opt}
          </button>
        )
      })}
    </div>
  )
}
