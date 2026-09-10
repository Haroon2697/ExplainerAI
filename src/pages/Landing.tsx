import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  Film,
  Gauge,
  Github,
  Link2,
  ListOrdered,
  Play,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { buttonStyles } from '@/components/ui/Button'
import { StatCard } from '@/components/StatCard'
import { useProjects } from '@/context/ProjectsContext'
import { useMagnetic, useParallax, useReveal } from '@/hooks/useAnimations'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

const FEATURES = [
  {
    icon: Compass,
    title: 'Autonomous Workflow Discovery',
    body: 'An agent signs in, crawls the reachable surface and clusters interaction traces into complete journeys — no scripts, no selectors, no manual tour building.',
    points: ['Authenticated crawling', 'Interaction clustering', 'Dead-end pruning'],
  },
  {
    icon: ScrollText,
    title: 'Evidence-Grounded Scripts',
    body: 'Every sentence of narration is bound to an element that was actually captured. Hover any claim in the script and the evidence behind it comes with it.',
    points: ['Element-level anchors', 'Confidence scoring', 'Tone and language control'],
  },
  {
    icon: Film,
    title: 'One-Click Video Generation',
    body: 'Ranked workflow, narration and captured frames compose into a finished MP4 — ready to embed in onboarding, docs or a sales follow-up.',
    points: ['1080p render', 'Auto captions', 'Download or share link'],
  },
]

const PIPELINE = [
  { icon: Compass, label: 'Explore', detail: 'Crawl the app' },
  { icon: Wand2, label: 'Discover', detail: 'Cluster journeys' },
  { icon: ListOrdered, label: 'Rank', detail: 'Score by value' },
  { icon: ScrollText, label: 'Script', detail: 'Ground each claim' },
  { icon: Film, label: 'Compose', detail: 'Render the video' },
]

export function Landing() {
  const pageRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.24)

  useReveal(pageRef, [])
  useParallax(heroRef)

  // Hero runs its own timeline rather than the scroll-reveal batch: it is
  // above the fold, so it should play immediately and in a deliberate order.
  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-hero]', { opacity: 1, y: 0 })
        return
      }
      gsap
        .timeline({ defaults: { ease: EASE.out } })
        .fromTo('[data-hero="badge"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo('[data-hero="title"]', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.35')
        .fromTo('[data-hero="tagline"]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('[data-hero="body"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .fromTo('[data-hero="cta"]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.45')
        .fromTo('[data-hero="proof"]', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.3')
        .fromTo(
          '[data-hero="visual"]',
          { opacity: 0, y: 40, rotateX: 8, scale: 0.97 },
          { opacity: 1, y: 0, rotateX: 0, scale: 1, duration: 1.1 },
          '-=0.75',
        )
        .fromTo('[data-hero-chip]', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.12 }, '-=0.5')
    },
    { scope: pageRef },
  )

  const { workspace } = useProjects()

  return (
    <div ref={pageRef} className="min-h-full bg-white">
      {/* Marketing nav */}
      <header className="sticky top-0 z-30 border-b border-ink-200/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <Logo />
          <nav className="ml-2 hidden items-center gap-1 md:flex">
            {['Product', 'How it works', 'Templates'].map((item) => (
              <a
                key={item}
                href="#features"
                className="rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-ink-100/70 hover:text-ink-900"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/dashboard" className={buttonStyles('ghost', 'sm', 'hidden sm:inline-flex')}>
              Sign in
            </Link>
            <Link to="/new" className={buttonStyles('primary', 'sm')}>
              Create New Project
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 grid-bg mask-fade-b opacity-[0.55]" />
          <div
            data-parallax="0.18"
            className="absolute -left-24 top-[-120px] h-[420px] w-[420px] rounded-full bg-brand-400/20 blur-[110px]"
          />
          <div
            data-parallax="0.3"
            className="absolute right-[-140px] top-10 h-[460px] w-[460px] rounded-full bg-violet-400/20 blur-[120px]"
          />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 text-center sm:pt-20">
          <span
            data-hero="badge"
            className="inline-flex items-center gap-2 rounded-full border border-brand-200/80 bg-brand-50/80 py-1 pl-1.5 pr-3 text-[12.5px] font-semibold text-brand-700"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] shadow-card">
              <Sparkles className="h-3 w-3" />
              FYP
            </span>
            Autonomous SaaS understanding
          </span>

          <h1
            data-hero="title"
            className="mx-auto mt-6 max-w-4xl text-balance text-[44px] font-extrabold leading-[1.05] tracking-[-0.04em] text-ink-950 sm:text-[64px]"
          >
            Explainer
            <span className="bg-gradient-to-br from-brand-500 to-violet-600 bg-clip-text text-transparent">AI</span>
          </h1>

          <p
            data-hero="tagline"
            className="mx-auto mt-4 max-w-3xl text-balance text-[19px] font-semibold leading-snug text-ink-800 sm:text-[24px]"
          >
            Autonomous SaaS Understanding and Explainer Video Generation
          </p>

          <p data-hero="body" className="mx-auto mt-4 max-w-2xl text-balance text-[16px] leading-relaxed text-ink-500">
            ExplainerAI autonomously explores a SaaS application, discovers meaningful workflows, and generates
            evidence-grounded explainer videos.
          </p>

          <div data-hero="cta" className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link ref={ctaRef} to="/new" className={buttonStyles('primary', 'lg', 'shadow-glow')}>
              Create New Project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/dashboard" className={buttonStyles('secondary', 'lg')}>
              <Play className="h-4 w-4 fill-current" />
              View the dashboard
            </Link>
          </div>

          <p data-hero="proof" className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Read-only exploration
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5" />
              Every claim anchored to evidence
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="h-3.5 w-3.5" />
              Under 5 minutes per video
            </span>
          </p>

          {/* Product preview */}
          <div data-hero="visual" className="relative mx-auto mt-14 max-w-5xl [perspective:1200px]">
            <div className="overflow-hidden rounded-2xl border border-ink-200/90 bg-white shadow-[0_40px_90px_-30px_rgba(16,24,40,.35)]">
              <div className="flex items-center gap-2 border-b border-ink-200/80 bg-ink-50/80 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                <span className="mx-auto flex items-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-1 text-[11px] text-ink-400">
                  <Link2 className="h-3 w-3" />
                  app.explainerai.dev/dashboard
                </span>
              </div>

              <div className="grid gap-4 p-5 text-left sm:grid-cols-[180px_1fr]">
                <div className="hidden space-y-2 sm:block">
                  <div className="h-9 rounded-xl bg-brand-600" />
                  {['All projects', 'Completed', 'Processing'].map((row, i) => (
                    <div
                      key={row}
                      className={cn(
                        'flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium',
                        i === 0 ? 'bg-brand-50 text-brand-700' : 'text-ink-400',
                      )}
                    >
                      <span className={cn('h-2 w-2 rounded-full', i === 0 ? 'bg-brand-500' : 'bg-ink-300')} />
                      {row}
                    </div>
                  ))}
                  <div className="mt-4 space-y-2 rounded-xl border border-ink-200 p-2.5">
                    <div className="h-1.5 w-16 rounded-full bg-ink-200" />
                    <div className="h-1.5 w-full rounded-full bg-ink-100">
                      <div className="h-full w-2/3 rounded-full bg-brand-500" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 w-24 rounded-full bg-ink-800" />
                      <div className="mt-2 h-2 w-40 rounded-full bg-ink-200" />
                    </div>
                    <div className="h-8 w-28 rounded-lg bg-brand-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['indigo', 'violet', 'emerald'].map((tone, i) => (
                      <div key={tone} className="overflow-hidden rounded-xl border border-ink-200">
                        <div
                          className={cn(
                            'aspect-[16/10] bg-gradient-to-br',
                            i === 0 ? 'from-indigo-500 to-violet-600' : i === 1 ? 'from-violet-500 to-purple-600' : 'from-emerald-500 to-teal-600',
                          )}
                        />
                        <div className="space-y-1.5 p-2.5">
                          <div className="h-2 w-3/4 rounded-full bg-ink-300" />
                          <div className="h-1.5 w-1/2 rounded-full bg-ink-200" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-ink-200 p-3">
                    <div className="mb-2 h-2 w-28 rounded-full bg-ink-300" />
                    <div className="space-y-1.5">
                      <div className="h-1.5 w-full rounded-full bg-ink-100" />
                      <div className="h-1.5 w-5/6 rounded-full bg-ink-100" />
                      <div className="h-1.5 w-2/3 rounded-full bg-brand-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating proof chips */}
            <div
              data-hero-chip
              className="absolute -left-4 top-24 hidden items-center gap-2 rounded-xl border border-ink-200 bg-white/95 px-3 py-2 shadow-pop backdrop-blur md:flex"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <ListOrdered className="h-4 w-4" />
              </span>
              <span className="text-left">
                <span className="block text-[12px] font-semibold text-ink-900">Workflow ranked</span>
                <span className="block font-mono text-[11px] text-ink-400">score 0.94</span>
              </span>
            </div>

            <div
              data-hero-chip
              className="absolute -right-4 bottom-20 hidden items-center gap-2 rounded-xl border border-ink-200 bg-white/95 px-3 py-2 shadow-pop backdrop-blur md:flex"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Link2 className="h-4 w-4" />
              </span>
              <span className="text-left">
                <span className="block text-[12px] font-semibold text-ink-900">Claim grounded</span>
                <span className="block font-mono text-[11px] text-ink-400">Export button · Reports</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-y border-ink-200/70 bg-ink-50/60">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div data-reveal className="text-center">
            <p className="label">The pipeline</p>
            <h2 className="mt-2 text-[26px] font-bold tracking-[-0.03em] text-ink-900">One URL in, one explainer out</h2>
          </div>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {PIPELINE.map((stage, i) => {
              const Icon = stage.icon
              return (
                <div key={stage.label} data-reveal className="relative">
                  {i < PIPELINE.length - 1 && (
                    <span
                      className="absolute left-[calc(50%+34px)] right-[calc(-50%+34px)] top-7 hidden h-px bg-gradient-to-r from-ink-300 to-transparent lg:block"
                      aria-hidden
                    />
                  )}
                  <div className="flex flex-col items-center text-center">
                    <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-ink-200 bg-white text-brand-600 shadow-card">
                      <Icon className="h-6 w-6" />
                      <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 font-mono text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <h3 className="mt-3.5 text-[14.5px] font-semibold text-ink-900">{stage.label}</h3>
                    <p className="mt-0.5 text-[12.5px] text-ink-400">{stage.detail}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-20">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="label">Why it is different</p>
          <h2 className="mt-2 text-balance text-[32px] font-bold leading-tight tracking-[-0.03em] text-ink-950">
            Explainers that can prove what they claim
          </h2>
          <p className="mt-3 text-[15.5px] leading-relaxed text-ink-500">
            Most demo tools record what you show them. ExplainerAI decides what is worth showing, then keeps the receipts.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                data-reveal
                className="group relative overflow-hidden rounded-2xl border border-ink-200/80 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
              >
                <span
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/[0.07] blur-2xl transition-transform duration-500 ease-smooth group-hover:scale-150"
                  aria-hidden
                />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,.6)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-5 text-[17px] font-semibold text-ink-900">{feature.title}</h3>
                <p className="relative mt-2 text-[14px] leading-relaxed text-ink-500">{feature.body}</p>
                <ul className="relative mt-4 space-y-2 border-t border-ink-200/70 pt-4">
                  {feature.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-[13px] text-ink-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y border-ink-200/70 bg-ink-50/60">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div data-reveal className="mb-8 text-center">
            <p className="label">In this workspace</p>
            <h2 className="mt-2 text-[26px] font-bold tracking-[-0.03em] text-ink-900">Numbers from the demo dataset</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={<Film className="h-[18px] w-[18px]" />} label="Minutes rendered" value={workspace.stats.minutesRendered} hint="Across every completed project" />
            <StatCard
              icon={<Link2 className="h-[18px] w-[18px]" />}
              label="Evidence anchors"
              value={workspace.stats.evidenceAnchors}
              separator
              delay={0.1}
              hint="Narration claims bound to captures"
              accentClassName="bg-violet-50 text-violet-600 ring-violet-100"
            />
            <StatCard
              icon={<Gauge className="h-[18px] w-[18px]" />}
              label="Avg. grounding"
              value={workspace.stats.avgGroundingScore * 100}
              suffix="%"
              delay={0.2}
              hint="Mean confidence across anchors"
              accentClassName="bg-emerald-50 text-emerald-600 ring-emerald-100"
            />
            <StatCard
              icon={<Sparkles className="h-[18px] w-[18px]" />}
              label="Hours saved"
              value={workspace.stats.hoursSaved}
              delay={0.3}
              hint="Versus scripting demos by hand"
              accentClassName="bg-amber-50 text-amber-600 ring-amber-100"
            />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950 px-8 py-14 text-center shadow-pop"
        >
          <span className="absolute inset-0 grid-bg opacity-[0.12]" aria-hidden />
          <span className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand-500/25 blur-[90px]" aria-hidden />
          <span className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-violet-500/25 blur-[90px]" aria-hidden />

          <h2 className="relative mx-auto max-w-2xl text-balance text-[32px] font-bold leading-tight tracking-[-0.03em] text-white">
            Paste a URL. Get an explainer that earns its claims.
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-[15px] text-white/60">
            Point ExplainerAI at any SaaS product and it will explore, rank, narrate and render — while you watch the
            progress.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/new" className={buttonStyles('primary', 'lg', 'bg-white text-ink-900 hover:bg-ink-100')}>
              Create New Project
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/dashboard"
              className={buttonStyles('ghost', 'lg', 'text-white/80 hover:bg-white/10 hover:text-white')}
            >
              Explore the dashboard
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-200/70">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-8">
          <Logo />
          <p className="text-[12.5px] text-ink-400">
            Final Year Project · Autonomous SaaS understanding and explainer video generation
          </p>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-400 transition-colors hover:text-ink-700"
          >
            <Github className="h-4 w-4" />
            Project repository
          </a>
        </div>
      </footer>
    </div>
  )
}
