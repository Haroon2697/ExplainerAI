import { useRef, useState } from 'react'
import { Compass, Film, ListOrdered, ScrollText, Wand2 } from 'lucide-react'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'

const STAGES = [
  { icon: Compass, label: 'Explore', detail: 'Crawl the app', color: 'from-blue-500 to-cyan-500' },
  { icon: Wand2, label: 'Discover', detail: 'Cluster journeys', color: 'from-purple-500 to-pink-500' },
  { icon: ListOrdered, label: 'Rank', detail: 'Score by value', color: 'from-orange-500 to-red-500' },
  { icon: ScrollText, label: 'Script', detail: 'Ground each claim', color: 'from-green-500 to-emerald-500' },
  { icon: Film, label: 'Compose', detail: 'Render the video', color: 'from-violet-500 to-purple-500' },
]

export function WorkflowDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStage, setActiveStage] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Initial animation
      const stages = gsap.utils.toArray<HTMLElement>('[data-stage]')
      gsap.fromTo(
        stages,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: EASE.out,
        },
      )

      // Animate connecting lines
      const lines = gsap.utils.toArray<SVGElement>('[data-line]')
      lines.forEach((line) => {
        const length = (line as any).getTotalLength?.()
        if (length) {
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length })
          gsap.to(line, {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'power1.inOut',
            delay: 0.4,
          })
        }
      })
    },
    { scope: containerRef },
  )

  // Auto-play stage progression
  useGSAP(
    () => {
      if (!isAutoPlay || prefersReducedMotion()) return

      const interval = setInterval(() => {
        setActiveStage((prev) => (prev + 1) % STAGES.length)
      }, 2500)

      return () => clearInterval(interval)
    },
    { dependencies: [isAutoPlay] },
  )

  // Animate active stage highlight
  useGSAP(
    () => {
      const activeElement = containerRef.current?.querySelector(`[data-stage="${activeStage}"]`)
      if (!activeElement) return

      if (prefersReducedMotion()) return

      gsap.to(activeElement, {
        boxShadow: '0 0 30px rgba(79, 70, 229, 0.4)',
        duration: 0.4,
        ease: EASE.out,
      })

      gsap.to('[data-stage-content]', {
        opacity: 0,
        y: 10,
        duration: 0.3,
      })

      setTimeout(() => {
        gsap.to('[data-stage-content]', {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: EASE.out,
        })
      }, 150)
    },
    { dependencies: [activeStage], scope: containerRef },
  )

  const currentStage = STAGES[activeStage]
  const CurrentIcon = currentStage.icon

  return (
    <div ref={containerRef} className="relative">
      {/* Animated pipeline visualization */}
      <div className="relative mb-12 overflow-x-auto">
        <div className="relative inline-flex w-full min-w-max items-center justify-center gap-0 px-4 py-8">
          {/* Connection lines SVG */}
          <svg
            className="absolute inset-0 h-full w-full pointer-events-none"
            style={{ overflow: 'visible' }}
            aria-hidden="true"
          >
            {STAGES.map((_, index) => {
              if (index === STAGES.length - 1) return null
              return (
                <line
                  key={`line-${index}`}
                  data-line
                  x1={`${((index + 0.5) * 100) / STAGES.length}%`}
                  y1="50%"
                  x2={`${(((index + 1) * 100) / STAGES.length) - 2}%`}
                  y2="50%"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              )
            })}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgb(79, 70, 229)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>

          {/* Stage cards */}
          <div className="relative flex w-full items-center justify-between gap-3 sm:gap-4">
            {STAGES.map((stage, index) => {
              const Icon = stage.icon
              const isActive = index === activeStage

              return (
                <button
                  key={stage.label}
                  onClick={() => {
                    setActiveStage(index)
                    setIsAutoPlay(false)
                  }}
                  onMouseEnter={() => setIsAutoPlay(false)}
                  data-stage={index}
                  className={`group relative flex flex-shrink-0 flex-col items-center rounded-2xl border-2 p-3 sm:p-4 transition-all duration-300 sm:min-w-[120px] ${
                    isActive
                      ? 'border-brand-500 bg-brand-50/50 shadow-lg'
                      : 'border-ink-200 bg-white hover:border-brand-300 hover:bg-brand-50/30'
                  }`}
                  aria-pressed={isActive}
                >
                  {/* Animated background pulse */}
                  {isActive && !prefersReducedMotion() && (
                    <div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-400 to-violet-500 opacity-0"
                      style={{
                        animation: 'pulse-glow 2s ease-in-out infinite',
                      }}
                    />
                  )}

                  {/* Icon container with gradient */}
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 sm:h-12 sm:w-12 ${
                      isActive ? 'scale-110 bg-gradient-to-br ' + stage.color : 'bg-gradient-to-br from-ink-300 to-ink-400'
                    }`}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    {isActive && (
                      <span className="absolute inset-0 rounded-xl border-2 border-white/40" />
                    )}
                  </div>

                  {/* Stage number */}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 font-mono text-[10px] font-bold text-white shadow-md sm:h-6 sm:w-6">
                    {index + 1}
                  </span>

                  {/* Label */}
                  <h3 className="relative mt-2 text-xs font-semibold text-ink-900 sm:text-sm">{stage.label}</h3>

                  {/* Detail text - only show on hover/active on larger screens */}
                  <p className="relative hidden text-[10px] text-ink-400 sm:block">{stage.detail}</p>

                  {/* Activity indicator dot */}
                  {isActive && (
                    <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-brand-500 shadow-sm" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Stage detail panel */}
      <div className="mx-auto max-w-2xl rounded-2xl border border-ink-200 bg-gradient-to-br from-white to-ink-50/50 p-6 shadow-card sm:p-8">
        <div data-stage-content className="text-center">
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${currentStage.color} text-white shadow-lg sm:h-20 sm:w-20`}>
            <CurrentIcon className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>

          <h3 className="text-xl font-bold text-ink-900 sm:text-2xl">{currentStage.label}</h3>
          <p className="mt-2 text-sm text-ink-500 sm:text-base">{currentStage.detail}</p>

          {/* Stage-specific description */}
          <div className="mt-4 space-y-2 text-left">
            {activeStage === 0 && (
              <>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Agent signs in to your SaaS
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Crawls the entire reachable surface
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Records every interaction & transition
                </p>
              </>
            )}

            {activeStage === 1 && (
              <>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Groups similar interaction patterns
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Identifies complete user journeys
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Filters out dead-ends & duplicates
                </p>
              </>
            )}

            {activeStage === 2 && (
              <>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Scores journeys by complexity & value
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Prioritizes workflows users care about
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Reorders for maximum impact
                </p>
              </>
            )}

            {activeStage === 3 && (
              <>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Generates narration for each step
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Anchors every claim to captured evidence
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Scores confidence for each anchor
                </p>
              </>
            )}

            {activeStage === 4 && (
              <>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Frames + narration + evidence compose
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Renders to 1080p MP4 with captions
                </p>
                <p className="text-sm text-ink-600">
                  <span className="font-semibold">→</span> Ready to share or embed instantly
                </p>
              </>
            )}
          </div>

          {/* Progress indicator */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {STAGES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === activeStage ? 'w-6 bg-brand-500' : i < activeStage ? 'w-2 bg-brand-300' : 'w-2 bg-ink-200'
                }`}
              />
            ))}
          </div>

          {/* Auto-play toggle */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:text-sm"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isAutoPlay ? 'bg-brand-500' : 'bg-ink-300'}`} />
            {isAutoPlay ? 'Auto-playing' : 'Paused'}
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  )
}
