import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

/**
 * Single registration point for the animation layer. Importing gsap from here
 * (instead of from 'gsap' directly) guarantees plugins are registered exactly
 * once and that every tween inherits the same house easing/duration.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP)

gsap.defaults({ ease: 'power3.out', duration: 0.7 })

// ScrollTrigger recalculates on resize; ignoring mobile-browser URL-bar
// resizes avoids a whole class of jitter on scroll.
ScrollTrigger.config({ ignoreMobileResize: true })

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  soft: 'power1.out',
  spring: 'back.out(1.6)',
} as const

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function hasFinePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
}

export { gsap, ScrollTrigger, useGSAP }
