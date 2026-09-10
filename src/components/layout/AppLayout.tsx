import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { EASE, ScrollTrigger, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'

/**
 * Application shell: fixed navbar, collapsible sidebar, routed content.
 * Route changes get a short cross-fade — long enough to feel deliberate,
 * short enough that it never sits between the user and the next screen.
 */
export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname])

  useGSAP(
    () => {
      const el = mainRef.current
      if (!el || prefersReducedMotion()) return
      gsap.fromTo(
        el,
        { opacity: 0, y: 6 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: EASE.out,
          clearProps: 'transform',
          // Layout has settled by the time the fade ends; re-measure triggers.
          onComplete: () => ScrollTrigger.refresh(),
        },
      )
    },
    { dependencies: [location.pathname] },
  )

  return (
    <div className="flex min-h-full flex-col bg-ink-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <main ref={mainRef} className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
