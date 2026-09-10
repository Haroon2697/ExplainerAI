import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

const MenuContext = createContext<{ close: () => void }>({ close: () => {} })

interface MenuProps {
  /** Content rendered inside the trigger button. */
  button: ReactNode
  label: string
  children: ReactNode
  align?: 'left' | 'right'
  width?: string
  buttonClassName?: string
  className?: string
}

/**
 * Minimal headless dropdown: one interactive trigger, outside-click and
 * Escape to dismiss, and a short GSAP open animation anchored to the trigger.
 */
export function Menu({ button, label, children, align = 'right', width = 'w-56', buttonClassName, className }: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel || !open || prefersReducedMotion()) return
      gsap.fromTo(
        panel,
        { opacity: 0, y: -6, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: EASE.out },
      )
      gsap.fromTo(
        gsap.utils.toArray<HTMLElement>('[data-menu-item]', panel),
        { opacity: 0, x: -4 },
        { opacity: 1, x: 0, duration: 0.2, stagger: 0.025, ease: EASE.out },
      )
    },
    { dependencies: [open] },
  )

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={buttonClassName}
      >
        {button}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="menu"
          className={cn(
            'absolute z-40 mt-2 origin-top overflow-hidden rounded-xl border border-ink-200/80 bg-white p-1.5 shadow-pop',
            align === 'right' ? 'right-0' : 'left-0',
            width,
          )}
        >
          <MenuContext.Provider value={{ close }}>{children}</MenuContext.Provider>
        </div>
      )}
    </div>
  )
}

export function MenuItem({
  icon,
  children,
  onSelect,
  danger = false,
  shortcut,
}: {
  icon?: ReactNode
  children: ReactNode
  onSelect?: () => void
  danger?: boolean
  shortcut?: string
}) {
  const { close } = useContext(MenuContext)
  return (
    <button
      type="button"
      role="menuitem"
      data-menu-item
      onClick={() => {
        close()
        onSelect?.()
      }}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors duration-150',
        danger ? 'text-rose-600 hover:bg-rose-50' : 'text-ink-700 hover:bg-ink-100/80 hover:text-ink-900',
      )}
    >
      {icon && <span className={cn('shrink-0', danger ? 'text-rose-500' : 'text-ink-400')}>{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && <span className="font-mono text-[10px] text-ink-400">{shortcut}</span>}
    </button>
  )
}

export function MenuSeparator() {
  return <div className="my-1.5 h-px bg-ink-200/70" data-menu-item />
}

export function MenuLabel({ children }: { children: ReactNode }) {
  return (
    <div data-menu-item className="px-2.5 pb-1.5 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-400">
      {children}
    </div>
  )
}
