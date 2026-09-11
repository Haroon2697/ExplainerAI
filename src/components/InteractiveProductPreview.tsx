import { useRef, useState } from 'react'
import { Link2, ArrowRight, CheckCircle2, Users, CreditCard, UserPlus, Lock } from 'lucide-react'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

type CardState = 'indigo' | 'violet' | 'emerald'

// Workflow visualization components
function OnboardingWorkflow() {
  return (
    <div className="space-y-3 p-3">
      {/* Step 1 */}
      <div className="flex items-start gap-2">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-400 text-xs font-bold text-white">1</div>
        <div className="flex-1">
          <div className="h-1.5 w-20 rounded bg-indigo-300/60" />
          <div className="mt-1 h-1 w-16 rounded bg-indigo-200/40" />
        </div>
      </div>
      {/* Arrow */}
      <div className="flex justify-center text-indigo-400/50">
        <ArrowRight className="h-4 w-4 rotate-90" />
      </div>
      {/* Step 2 */}
      <div className="flex items-start gap-2">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-400 text-xs font-bold text-white">2</div>
        <div className="flex-1">
          <div className="h-1.5 w-24 rounded bg-indigo-300/60" />
          <div className="mt-1 h-1 w-20 rounded bg-indigo-200/40" />
        </div>
      </div>
      {/* Arrow */}
      <div className="flex justify-center text-indigo-400/50">
        <ArrowRight className="h-4 w-4 rotate-90" />
      </div>
      {/* Step 3 */}
      <div className="flex items-start gap-2">
        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">
          <CheckCircle2 className="h-3 w-3" />
        </div>
        <div className="flex-1">
          <div className="h-1.5 w-20 rounded bg-indigo-300/60" />
          <div className="mt-1 h-1 w-14 rounded bg-indigo-200/40" />
        </div>
      </div>
    </div>
  )
}

function PaymentWorkflow() {
  return (
    <div className="space-y-2.5 p-3">
      {/* Form Section */}
      <div className="space-y-1.5 rounded bg-white/20 p-2">
        <div className="h-2 w-16 rounded bg-purple-300/70" />
        <div className="h-1.5 w-32 rounded bg-purple-200/50" />
      </div>
      {/* Amount Input */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <CreditCard className="h-3 w-3 text-purple-300" />
          <div className="h-1.5 w-20 rounded bg-purple-300/70" />
        </div>
      </div>
      {/* Buttons */}
      <div className="flex gap-1.5 pt-1">
        <div className="h-2 flex-1 rounded bg-purple-400/80" />
        <div className="h-2 w-12 rounded bg-purple-300/60" />
      </div>
      {/* Confirmation */}
      <div className="flex items-center gap-2 rounded bg-purple-400/30 px-2 py-1.5">
        <CheckCircle2 className="h-3 w-3 text-purple-400" />
        <div className="h-1 flex-1 rounded bg-purple-300/70" />
      </div>
    </div>
  )
}

function CollaborationWorkflow() {
  return (
    <div className="space-y-2 p-3">
      {/* User Avatars */}
      <div className="flex items-center -space-x-2 pb-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br from-teal-400 to-emerald-500"
          />
        ))}
        <div className="ml-1 h-1.5 w-12 rounded bg-emerald-300/60" />
      </div>
      {/* Shared Items */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <Lock className="h-3 w-3 text-emerald-400" />
          <div className="h-1.5 w-20 rounded bg-emerald-300/60" />
        </div>
      </div>
      {/* Activity */}
      <div className="space-y-1 text-[10px] text-emerald-200/70">
        <div className="flex justify-between">
          <div className="h-1 w-16 rounded bg-emerald-300/50" />
          <div className="h-1 w-12 rounded bg-emerald-200/40" />
        </div>
        <div className="flex justify-between">
          <div className="h-1 w-20 rounded bg-emerald-300/50" />
          <div className="h-1 w-10 rounded bg-emerald-200/40" />
        </div>
      </div>
      {/* User indicator */}
      <div className="flex items-center gap-1.5 rounded bg-emerald-400/20 px-2 py-1.5">
        <Users className="h-3 w-3 text-emerald-300" />
        <div className="h-1 flex-1 rounded bg-emerald-300/70" />
      </div>
    </div>
  )
}

export function InteractiveProductPreview() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState<CardState>('indigo')
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const cardConfig = {
    indigo: {
      title: 'Lead Onboarding Flow',
      description: 'User journey through the initial setup',
      gradient: 'from-indigo-500 to-violet-600',
      component: OnboardingWorkflow,
      icon: UserPlus,
    },
    violet: {
      title: 'Payment Integration',
      description: 'Complete billing workflow with UI interactions',
      gradient: 'from-violet-500 to-purple-600',
      component: PaymentWorkflow,
      icon: CreditCard,
    },
    emerald: {
      title: 'Team Collaboration',
      description: 'Multi-user workflow with shared features',
      gradient: 'from-emerald-500 to-teal-600',
      component: CollaborationWorkflow,
      icon: Users,
    },
  }

  // Initial animations
  useGSAP(
    () => {
      if (prefersReducedMotion()) return

      // Animate progress bar
      gsap.fromTo(
        '[data-progress-fill]',
        { width: '0%' },
        { width: '66%', duration: 1.2, ease: 'power2.out', delay: 0.6 },
      )

      // Animate cards on mount
      const cards = gsap.utils.toArray<HTMLElement>('[data-card]')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: EASE.out,
          delay: 0.4,
        },
      )

      // Subtle floating animation for cards
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: -8,
          duration: 3 + i * 0.5,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      })
    },
    { scope: containerRef },
  )

  // Animate card interactions
  useGSAP(
    () => {
      const activeCardEl = containerRef.current?.querySelector(`[data-card="${activeCard}"]`)
      if (!activeCardEl || prefersReducedMotion()) return

      gsap.to('[data-card-content]', {
        opacity: 0,
        y: 10,
        duration: 0.2,
      })

      setTimeout(() => {
        gsap.to('[data-card-content]', {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: EASE.out,
        })
      }, 100)
    },
    { dependencies: [activeCard], scope: containerRef },
  )

  // Auto-cycle through cards
  useGSAP(
    () => {
      if (!isAutoPlay || prefersReducedMotion()) return

      const interval = setInterval(() => {
        setActiveCard((prev) => {
          const cards: CardState[] = ['indigo', 'violet', 'emerald']
          const currentIndex = cards.indexOf(prev)
          return cards[(currentIndex + 1) % cards.length]
        })
      }, 3000)

      return () => clearInterval(interval)
    },
    { dependencies: [isAutoPlay] },
  )

  const currentConfig = cardConfig[activeCard]

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-[0_40px_90px_-30px_rgba(16,24,40,.35)]"
    >
      {/* Browser header */}
      <div className="flex items-center gap-2 border-b border-ink-200/80 bg-ink-50/80 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        <span className="mx-auto flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-1 text-[11px] text-ink-400">
          <Link2 className="h-3 w-3" />
          app.explainerai.dev/dashboard
        </span>
      </div>

      {/* Content area */}
      <div className="grid gap-4 p-5 text-left sm:grid-cols-[180px_1fr]">
        {/* Sidebar - Project list with interactive states */}
        <div className="hidden space-y-2 sm:block">
          <button
            onClick={() => setIsAutoPlay(false)}
            className="w-full rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-brand-700 active:scale-95"
          >
            Create
          </button>

          {['All projects', 'Completed', 'Processing'].map((row, i) => (
            <button
              key={row}
              onClick={() => setIsAutoPlay(false)}
              className={cn(
                'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-all hover:bg-ink-100',
                i === 0
                  ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  : 'text-ink-400 hover:text-ink-600',
              )}
            >
              <span className={cn('h-2 w-2 rounded-full', i === 0 ? 'bg-brand-500' : 'bg-ink-300')} />
              {row}
            </button>
          ))}

          {/* Animated progress bar */}
          <div className="mt-4 space-y-2 rounded-xl border border-ink-200 p-2.5">
            <div className="h-1.5 w-16 rounded-full bg-ink-200" />
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
              <div
                data-progress-fill
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-500 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Main content - Interactive cards */}
        <div className="space-y-3">
          {/* Header with interactive button */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-24 rounded-full bg-ink-800" />
              <div className="mt-2 h-2 w-40 rounded-full bg-ink-200" />
            </div>
            <button
              onClick={() => setIsAutoPlay(false)}
              className="group relative h-8 w-28 overflow-hidden rounded-lg bg-gradient-to-r from-brand-600 to-violet-600 text-xs font-semibold text-white shadow-md transition-all hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Generate</span>
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 to-brand-600 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </div>

          {/* Interactive cards grid */}
          <div className="grid grid-cols-3 gap-3">
            {(['indigo', 'violet', 'emerald'] as const).map((tone) => {
              const config = cardConfig[tone as CardState]
              const WorkflowComponent = config.component
              const IconComponent = config.icon

              return (
                <button
                  key={tone}
                  data-card={tone}
                  onClick={() => {
                    setActiveCard(tone)
                    setIsAutoPlay(false)
                  }}
                  className={cn(
                    'group relative overflow-hidden rounded-xl border-2 transition-all duration-300',
                    activeCard === tone
                      ? 'border-brand-500 shadow-lg scale-105'
                      : 'border-ink-200 hover:border-brand-300 hover:scale-102',
                  )}
                >
                  {/* Workflow visualization background */}
                  <div
                    className={cn(
                      'aspect-[16/10] bg-gradient-to-br transition-all duration-300 relative overflow-hidden',
                      config.gradient,
                    )}
                  >
                    {/* Workflow content */}
                    <WorkflowComponent />

                    {/* Processing indicator */}
                    <div className="absolute bottom-1 right-1 flex h-2 w-2 items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse" />
                    </div>
                  </div>

                  {/* Card footer */}
                  <div className="space-y-1.5 bg-white p-2.5 transition-all duration-300 group-hover:bg-ink-50">
                    <div className="flex items-center gap-1.5">
                      <IconComponent className="h-3 w-3 text-ink-500" />
                      <div className="h-2 flex-1 rounded-full bg-ink-300" />
                    </div>
                    <div className="h-1.5 w-3/4 rounded-full bg-ink-200" />
                  </div>

                  {/* Active indicator */}
                  {activeCard === tone && (
                    <div className="absolute inset-0 rounded-xl border-2 border-brand-400 ring-2 ring-brand-200 ring-offset-2" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Card details panel */}
          <div className="rounded-xl border border-ink-200 bg-gradient-to-br from-white to-ink-50 p-4 transition-all duration-300">
            <div data-card-content>
              <div className="mb-3 flex items-center gap-2">
                {(() => {
                  const IconComponent = currentConfig.icon
                  return (
                    <>
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-white', `bg-gradient-to-br ${currentConfig.gradient}`)}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-ink-900">{currentConfig.title}</h4>
                        <p className="text-xs text-ink-500">{currentConfig.description}</p>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Mini workflow preview */}
              <div className={cn('mb-3 rounded-lg bg-gradient-to-br p-2', `${currentConfig.gradient} text-white text-opacity-90`)}>
                {(() => {
                  const WorkflowComponent = currentConfig.component
                  return (
                    <div className="text-xs">
                      <WorkflowComponent />
                    </div>
                  )
                })()}
              </div>

              <div className="flex gap-1.5">
                <button className="flex-1 rounded px-2 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-50 transition-colors border border-brand-200">
                  View Flow
                </button>
                <button className="flex-1 rounded px-2 py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-100 transition-colors border border-ink-200">
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Card navigation dots */}
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {(['indigo', 'violet', 'emerald'] as const).map((tone) => (
              <button
                key={tone}
                onClick={() => {
                  setActiveCard(tone)
                  setIsAutoPlay(false)
                }}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  activeCard === tone ? 'w-6 bg-brand-500' : 'w-2 bg-ink-200 hover:bg-ink-300',
                )}
                aria-label={`Switch to ${tone}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Auto-play toggle */}
      <div className="border-t border-ink-200/50 bg-ink-50/40 px-5 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsAutoPlay(!isAutoPlay)}
          className="inline-flex items-center gap-2 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-600 transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        >
          <span className={cn('h-1.5 w-1.5 rounded-full transition-colors', isAutoPlay ? 'bg-brand-500' : 'bg-ink-300')} />
          {isAutoPlay ? 'Auto-cycling' : 'Paused'}
        </button>
        <p className="text-xs text-ink-400">Click cards to explore workflows</p>
      </div>
    </div>
  )
}
