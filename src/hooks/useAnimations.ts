import { useEffect, useRef, type RefObject } from 'react'
import { EASE, ScrollTrigger, gsap, hasFinePointer, prefersReducedMotion, useGSAP } from '@/lib/gsap'

/**
 * Scroll-reveal for any element marked `data-reveal` inside `scope`.
 *
 * Uses ScrollTrigger.batch so N elements share a handful of triggers and
 * animate in grouped, staggered waves — far cheaper than one trigger each,
 * and it looks intentional rather than mechanical.
 */
export function useReveal(scope: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
      if (!items.length) return

      if (prefersReducedMotion()) {
        gsap.set(items, { clearProps: 'all', opacity: 1, y: 0 })
        return
      }

      gsap.set(items, { opacity: 0, y: 22 })
      ScrollTrigger.batch(items, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.06,
            ease: EASE.out,
            overwrite: true,
          }),
      })
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}

interface CountUpOptions {
  decimals?: number
  duration?: number
  prefix?: string
  suffix?: string
  /** Adds thousands separators — off by default so small counts stay clean. */
  separator?: boolean
  /** Delay before the tween starts, in seconds. */
  delay?: number
}

/**
 * Animates a number by tweening a proxy object and writing to textContent.
 * Never touches React state, so a 60fps counter costs zero re-renders.
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  value: number,
  { decimals = 0, duration = 1.5, prefix = '', suffix = '', separator = false, delay = 0 }: CountUpOptions = {},
) {
  const ref = useRef<T>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return

      const format = (n: number) => {
        const fixed = n.toFixed(decimals)
        const withSeparator = separator ? Number(fixed).toLocaleString('en-US', { minimumFractionDigits: decimals }) : fixed
        return `${prefix}${withSeparator}${suffix}`
      }

      if (prefersReducedMotion()) {
        el.textContent = format(value)
        return
      }

      const proxy = { n: 0 }
      el.textContent = format(0)

      gsap.to(proxy, {
        n: value,
        duration,
        delay,
        ease: 'power2.out',
        snap: { n: decimals > 0 ? 1 / 10 ** decimals : 1 },
        onUpdate: () => {
          el.textContent = format(proxy.n)
        },
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      })
    },
    { dependencies: [value, decimals, duration, prefix, suffix, separator, delay] },
  )

  return ref
}

/**
 * Magnetic hover: the element eases toward the cursor and springs back.
 * gsap.quickTo pre-compiles the setter, so pointermove stays allocation-free.
 * Disabled for coarse pointers and reduced-motion users.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !hasFinePointer()) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength)
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength)
    }
    const onLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [strength])

  return ref
}

/**
 * Subtle pointer-tracked tilt plus a CSS-variable spotlight, driven by
 * quickTo so the whole effect is two composited transforms per frame.
 */
export function useTilt<T extends HTMLElement>(max = 6) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || !hasFinePointer()) return

    const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' })
    const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' })

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width
      const py = (event.clientY - rect.top) / rect.height
      rotY((px - 0.5) * max * 2)
      rotX((0.5 - py) * max * 2)
      el.style.setProperty('--spot-x', `${px * 100}%`)
      el.style.setProperty('--spot-y', `${py * 100}%`)
    }
    const onEnter = () => gsap.to(el, { scale: 1.012, duration: 0.4, ease: EASE.out })
    const onLeave = () => {
      rotX(0)
      rotY(0)
      gsap.to(el, { scale: 1, duration: 0.5, ease: EASE.out })
    }

    gsap.set(el, { transformPerspective: 900, transformOrigin: 'center' })
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  }, [max])

  return ref
}

/**
 * Enter animation for a freshly mounted route/section. Runs once per key,
 * which lets filtered grids replay the stagger when their contents change.
 */
export function useEnter(scope: RefObject<HTMLElement | null>, key: unknown = null, selector = '[data-enter]') {
  useGSAP(
    () => {
      const root = scope.current
      if (!root) return
      const items = gsap.utils.toArray<HTMLElement>(selector, root)
      if (!items.length) return

      if (prefersReducedMotion()) {
        gsap.set(items, { clearProps: 'all', opacity: 1 })
        return
      }

      gsap.fromTo(
        items,
        { opacity: 0, y: 18, scale: 0.985 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.045, ease: EASE.out, clearProps: 'transform' },
      )
    },
    { scope, dependencies: [key], revertOnUpdate: true },
  )
}

/**
 * Parallax drift for decorative layers. `data-parallax` holds the depth
 * multiplier; scrub keeps it tied to scroll position instead of time.
 */
export function useParallax(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current
      if (!root || prefersReducedMotion()) return
      const layers = gsap.utils.toArray<HTMLElement>('[data-parallax]', root)

      layers.forEach((layer) => {
        const depth = Number(layer.dataset.parallax ?? 0.2)
        gsap.to(layer, {
          yPercent: depth * 100,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
      })
    },
    { scope },
  )
}

/** Animates a progress bar's width whenever the value changes. */
export function useProgressBar(value: number) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      gsap.to(el, {
        width: `${Math.max(0, Math.min(100, value))}%`,
        duration: prefersReducedMotion() ? 0 : 0.8,
        ease: EASE.out,
      })
    },
    { dependencies: [value] },
  )

  return ref
}
