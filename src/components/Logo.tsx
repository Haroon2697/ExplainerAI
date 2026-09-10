import { cn } from '@/lib/utils'

/**
 * Brand mark: a play glyph built from a waveform, nodding to
 * "narration + video" without spelling either of them out.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-gradient-to-br from-brand-500 via-brand-600 to-violet-600 text-white shadow-[0_2px_8px_-2px_rgba(79,70,229,.6)]',
        className,
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0" aria-hidden />
      <svg viewBox="0 0 24 24" className="relative h-[18px] w-[18px]" fill="none" aria-hidden>
        <path d="M9 7.5v9l7-4.5-7-4.5Z" fill="currentColor" />
        <path
          d="M4 10.5v3M20 10v4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity=".85"
        />
      </svg>
    </span>
  )
}

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      {showWord && (
        <span className="text-[15px] font-bold tracking-[-0.02em] text-ink-900">
          Explainer<span className="text-brand-600">AI</span>
        </span>
      )}
    </span>
  )
}
