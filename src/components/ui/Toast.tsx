import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, X } from 'lucide-react'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'

/**
 * One-at-a-time toast. Parent owns the message; passing a new string shows a
 * fresh toast and restarts the auto-dismiss timer.
 */
export function Toast({ message, onDismiss }: { message: string | null; onDismiss: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  // Parents pass inline arrows; keeping the latest in a ref stops every
  // re-render from restarting the dismiss timer.
  const dismissRef = useRef(onDismiss)
  dismissRef.current = onDismiss

  useEffect(() => {
    if (!message) return
    const timer = window.setTimeout(() => dismissRef.current(), 3200)
    return () => window.clearTimeout(timer)
  }, [message])

  useGSAP(
    () => {
      const el = ref.current
      if (!el || !message || prefersReducedMotion()) return
      gsap.fromTo(el, { opacity: 0, y: 16, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: EASE.spring })
    },
    { dependencies: [message] },
  )

  if (!message) return null

  return createPortal(
    <div
      ref={ref}
      role="status"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-ink-800/10 bg-ink-950 py-3 pl-4 pr-3 text-sm font-medium text-white shadow-pop"
    >
      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
      {message}
      <button onClick={onDismiss} aria-label="Dismiss" className="rounded-md p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white">
        <X className="h-3.5 w-3.5" />
      </button>
    </div>,
    document.body,
  )
}
