import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Tailwind max-width class for the panel. */
  size?: string
  labelledBy?: string
  className?: string
}

/**
 * Portal dialog with a GSAP enter/exit timeline. Unmounting is deferred until
 * the exit animation finishes, so closing never snaps.
 */
export function Modal({ open, onClose, children, size = 'max-w-lg', labelledBy, className }: ModalProps) {
  const [mounted, setMounted] = useState(open)
  const backdropRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  useEffect(() => {
    if (!mounted) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [mounted, onClose])

  useGSAP(
    () => {
      if (!mounted) return
      const backdrop = backdropRef.current
      const panel = panelRef.current
      if (!backdrop || !panel) return

      const reduced = prefersReducedMotion()
      const tl = gsap.timeline()

      if (open) {
        panel.focus({ preventScroll: true })
        tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.22, ease: 'none' })
          .fromTo(
            panel,
            { opacity: 0, y: 18, scale: 0.975 },
            { opacity: 1, y: 0, scale: 1, duration: reduced ? 0 : 0.4, ease: EASE.out },
            '<',
          )
          .fromTo(
            gsap.utils.toArray<HTMLElement>('[data-modal-stagger]', panel),
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: reduced ? 0 : 0.35, stagger: 0.04, ease: EASE.out },
            '-=0.22',
          )
      } else {
        tl.to(panel, { opacity: 0, y: 8, scale: 0.985, duration: reduced ? 0 : 0.18, ease: EASE.inOut })
          .to(backdrop, { opacity: 0, duration: reduced ? 0 : 0.16, onComplete: () => setMounted(false) }, '<')
      }
    },
    { dependencies: [open, mounted] },
  )

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        ref={backdropRef}
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/40 backdrop-blur-[3px]"
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          'relative w-full rounded-2xl border border-ink-200/80 bg-white shadow-pop outline-none',
          size,
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}

export function ModalHeader({
  title,
  description,
  onClose,
  id,
  icon,
}: {
  title: string
  description?: string
  onClose?: () => void
  id?: string
  icon?: ReactNode
}) {
  return (
    <div className="flex items-start gap-4 border-b border-ink-200/70 p-6" data-modal-stagger>
      {icon}
      <div className="min-w-0 flex-1">
        <h2 id={id} className="text-lg font-semibold text-ink-900">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="-mr-1 -mt-1 rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
