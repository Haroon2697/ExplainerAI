import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  ArrowLeft,
  ChevronDown,
  Globe,
  Info,
  Layers,
  Rocket,
  Settings2,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { Button, buttonStyles } from '@/components/ui/Button'
import { ChipGroup, Field, SegmentedControl, Select } from '@/components/ui/Field'
import { ProgressBar, StepIndicator } from '@/components/ui/Progress'
import { LogoMark } from '@/components/Logo'
import { useProjects } from '@/context/ProjectsContext'
import { useMagnetic, useReveal } from '@/hooks/useAnimations'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import { cn, hostFromUrl, isValidUrl, normalizeUrl, prettyUrl } from '@/lib/utils'

const AUDIENCES = [
  { value: 'New users', label: 'New users' },
  { value: 'Admins', label: 'Admins' },
  { value: 'Power users', label: 'Power users' },
  { value: 'Buyers', label: 'Buyers' },
]

const LENGTHS = [
  { value: '30s', label: '30s' },
  { value: '60s', label: '60s' },
  { value: '90s', label: '90s' },
]

const FOCUS_AREAS = ['Onboarding', 'Core features', 'Admin', 'Reporting', 'Integrations']

const SUGGESTIONS = ['https://linear.app', 'https://www.notion.so', 'https://vercel.com', 'https://figma.com']

const LOG_LINES = [
  ['auth: session established', 'crawl: 6 routes queued', 'crawl: 18 interactive elements mapped'],
  ['trace: 42 interaction traces recorded', 'cluster: 7 candidate journeys', 'prune: 2 dead-ends removed'],
  ['rank: scoring by reach × coverage × novelty', 'rank: top workflow score 0.94'],
  ['script: drafting narration', 'ground: 11 claims bound to captured elements'],
  ['render: composing 1920×1080', 'render: captions burned in', 'render: MP4 ready'],
]

export function NewProject() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { createProject, completeProject, pipelineStages, templates } = useProjects()

  const [url, setUrl] = useState('')
  const [audience, setAudience] = useState('New users')
  const [length, setLength] = useState('60s')
  const [focus, setFocus] = useState<string[]>(['Onboarding', 'Core features'])
  const [templateId, setTemplateId] = useState(params.get('template') ?? '')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [generating, setGenerating] = useState(false)
  const [stageIndex, setStageIndex] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const createdId = useRef<string | null>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const inputWrapRef = useRef<HTMLDivElement>(null)
  const submitRef = useMagnetic<HTMLButtonElement>(0.18)

  useReveal(pageRef, [])

  // Pre-selecting a template from /templates should also apply its settings.
  useEffect(() => {
    const template = templates.find((t) => t.id === templateId)
    if (!template) return
    setAudience(template.audience === 'Buyers' || template.audience === 'Existing users' ? 'New users' : template.audience)
    setFocus(template.focusAreas)
  }, [templateId, templates])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!isValidUrl(url)) {
      setError('Enter a valid product URL, for example https://your-saas-product.com')
      const wrap = inputWrapRef.current
      if (wrap && !prefersReducedMotion()) {
        gsap.fromTo(wrap, { x: -8 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
      }
      return
    }

    setError(null)
    const project = createProject({ url: normalizeUrl(url), audience, videoLength: length, focusAreas: focus, templateId })
    createdId.current = project.id
    setGenerating(true)
  }

  // Drives the mocked pipeline: one stage roughly every 900ms, then redirect.
  useEffect(() => {
    if (!generating) return
    setStageIndex(0)
    setLogs(LOG_LINES[0] ?? [])

    const timers: number[] = []
    pipelineStages.forEach((_, i) => {
      if (i === 0) return
      timers.push(
        window.setTimeout(() => {
          setStageIndex(i)
          setLogs((prev) => [...prev, ...(LOG_LINES[i] ?? [])])
        }, i * 900),
      )
    })

    timers.push(
      window.setTimeout(() => {
        const id = createdId.current
        if (!id) return
        completeProject(id)
        navigate(`/project/${id}`)
      }, pipelineStages.length * 900 + 700),
    )

    return () => timers.forEach(window.clearTimeout)
  }, [generating, pipelineStages, completeProject, navigate])

  const progress = ((stageIndex + 1) / pipelineStages.length) * 100

  return (
    <div ref={pageRef} className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to projects
      </Link>

      <div data-reveal className="mt-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/80 bg-brand-50 px-3 py-1 text-[12px] font-semibold text-brand-700">
          <Sparkles className="h-3.5 w-3.5" />
          New project
        </span>
        <h1 className="mt-4 text-balance text-[34px] font-bold leading-tight tracking-[-0.03em] text-ink-950">
          Paste your product URL
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-[15px] leading-relaxed text-ink-500">
          ExplainerAI will explore the application, rank the workflows worth explaining, and narrate the best one with
          evidence attached.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div
          ref={inputWrapRef}
          data-reveal
          className={cn(
            'group rounded-2xl border bg-white p-2 shadow-card transition-[border-color,box-shadow] duration-300 focus-within:shadow-glow',
            error ? 'border-rose-300' : 'border-ink-200 focus-within:border-brand-400',
          )}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Globe className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-brand-500" />
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="https://your-saas-product.com"
                autoFocus
                spellCheck={false}
                aria-label="Product URL"
                className="h-14 w-full rounded-xl bg-transparent pl-12 pr-4 text-[16px] font-medium text-ink-900 placeholder:font-normal placeholder:text-ink-400 focus:outline-none"
              />
            </div>
            <Button ref={submitRef} type="submit" size="lg" className="h-14 shrink-0 px-7 text-[15px]">
              <Wand2 className="h-4 w-4" />
              Generate Demo
            </Button>
          </div>
        </div>

        {error && (
          <p className="mt-2 flex items-center gap-1.5 text-[13px] font-medium text-rose-600 animate-fade-in">
            <Info className="h-3.5 w-3.5" />
            {error}
          </p>
        )}

        <div data-reveal className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[12.5px] text-ink-400">Try:</span>
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setUrl(suggestion)
                setError(null)
              }}
              className="rounded-lg border border-ink-200 bg-white px-2.5 py-1 text-[12px] font-medium text-ink-500 transition-all duration-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
            >
              {prettyUrl(suggestion)}
            </button>
          ))}
        </div>

        {/* Advanced settings */}
        <div data-reveal className="mt-6 overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            aria-expanded={showAdvanced}
            className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-ink-50/70"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
              <Settings2 className="h-[18px] w-[18px]" />
            </span>
            <span className="flex-1">
              <span className="block text-[14.5px] font-semibold text-ink-900">Advanced settings</span>
              <span className="block text-[12.5px] text-ink-400">
                {audience} · {length} · {focus.length} focus {focus.length === 1 ? 'area' : 'areas'}
              </span>
            </span>
            <ChevronDown
              className={cn('h-4 w-4 text-ink-400 transition-transform duration-300 ease-smooth', showAdvanced && 'rotate-180')}
            />
          </button>

          <Collapsible open={showAdvanced}>
            <div className="space-y-6 border-t border-ink-200/70 p-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Target audience" hint="Shapes vocabulary and which workflows rank highest.">
                  <Select options={AUDIENCES} value={audience} onChange={(e) => setAudience(e.target.value)} />
                </Field>

                <Field label="Video length" hint="Longer videos keep more steps per workflow.">
                  <SegmentedControl options={LENGTHS} value={length} onChange={setLength} />
                </Field>
              </div>

              <Field label="Focus areas" hint="Workflows matching these areas receive a ranking boost.">
                <ChipGroup
                  options={FOCUS_AREAS}
                  values={focus}
                  onToggle={(value) =>
                    setFocus((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
                  }
                />
              </Field>

              <Field label="Start from a template" hint="Optional. Templates preset the audience and focus areas.">
                <div className="grid gap-2 sm:grid-cols-3">
                  {templates.slice(0, 3).map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setTemplateId((prev) => (prev === template.id ? '' : template.id))}
                      className={cn(
                        'rounded-xl border p-3 text-left transition-all duration-200 ease-smooth',
                        templateId === template.id
                          ? 'border-brand-300 bg-brand-50/70 shadow-[0_0_0_3px_rgba(79,70,229,.06)]'
                          : 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50',
                      )}
                    >
                      <Layers className={cn('h-4 w-4', templateId === template.id ? 'text-brand-600' : 'text-ink-400')} />
                      <span className="mt-2 block text-[13px] font-semibold text-ink-900">{template.name}</span>
                      <span className="mt-0.5 block text-[11.5px] text-ink-400">{template.duration}</span>
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </Collapsible>
        </div>
      </form>

      {generating &&
        createPortal(
          <GeneratingOverlay
            url={url}
            stageIndex={stageIndex}
            progress={progress}
            logs={logs}
            stages={pipelineStages}
          />,
          document.body,
        )}
    </div>
  )
}

/** Height-animated disclosure; measured with scrollHeight so content can change. */
function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const duration = prefersReducedMotion() ? 0 : 0.42
      if (open) {
        gsap.set(el, { display: 'block' })
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration, ease: EASE.out, clearProps: 'height' },
        )
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration, ease: EASE.inOut, onComplete: () => gsap.set(el, { display: 'none' }) })
      }
    },
    { dependencies: [open] },
  )

  return (
    <div ref={ref} style={{ display: 'none', overflow: 'hidden' }}>
      {children}
    </div>
  )
}

function GeneratingOverlay({
  url,
  stageIndex,
  progress,
  logs,
  stages,
}: {
  url: string
  stageIndex: number
  progress: number
  logs: string[]
  stages: { id: string; label: string; detail: string }[]
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const panel = panelRef.current
      if (!panel || prefersReducedMotion()) return
      gsap.fromTo(panel, { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: EASE.out })
    },
    { dependencies: [] },
  )

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/50 p-4 backdrop-blur-md">
      <div
        ref={panelRef}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-pop"
      >
        <div className="flex items-center gap-3 border-b border-ink-200/70 px-6 py-5">
          <span className="relative">
            <span className="absolute inset-0 rounded-[11px] bg-brand-400/40 animate-pulse-ring" aria-hidden />
            <LogoMark />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-[15px] font-semibold text-ink-900">Generating your explainer</h2>
            <p className="truncate text-[12.5px] text-ink-400">{hostFromUrl(url)}</p>
          </div>
          <Rocket className="h-4 w-4 shrink-0 text-brand-500" />
        </div>

        <div className="px-6 py-5">
          <div className="mb-4 flex items-center gap-3">
            <ProgressBar value={progress} className="flex-1" />
            <span className="font-mono text-[12px] tabular-nums text-ink-500">{Math.round(progress)}%</span>
          </div>

          <StepIndicator stages={stages} activeIndex={stageIndex} />

          <div
            ref={logRef}
            className="mt-4 h-24 overflow-y-auto rounded-xl border border-ink-200/80 bg-ink-950 p-3 font-mono text-[11px] leading-relaxed text-emerald-300/90"
          >
            {logs.map((line, i) => (
              <p key={i} className="animate-fade-in">
                <span className="text-ink-500">$</span> {line}
              </p>
            ))}
          </div>
        </div>

        <p className="border-t border-ink-200/70 bg-ink-50/70 px-6 py-3 text-center text-[12px] text-ink-400">
          You will be taken to the project as soon as the render completes.
        </p>
      </div>
    </div>
  )
}

/** Kept for parity with the design system export surface. */
export const NewProjectCtaClass = buttonStyles('primary', 'lg')
