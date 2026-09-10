import { useMemo, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  Anchor,
  ArrowLeft,
  Calendar,
  Compass,
  Download,
  ExternalLink,
  Film,
  Layers,
  Link2,
  MonitorPlay,
  RefreshCw,
  Route,
  ScrollText,
  Share2,
  Sparkles,
  Target,
  Timer,
  Trash2,
  Users,
} from 'lucide-react'
import { ScriptView } from '@/components/ScriptView'
import { StatCard } from '@/components/StatCard'
import { VideoPlayer } from '@/components/VideoPlayer'
import { WorkflowCard } from '@/components/WorkflowCard'
import { WorkflowDetail } from '@/components/WorkflowDetail'
import { Badge, ScoreBadge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressBar, StepIndicator } from '@/components/ui/Progress'
import { Tabs } from '@/components/ui/Tabs'
import { Toast } from '@/components/ui/Toast'
import { useProjects } from '@/context/ProjectsContext'
import { useEnter, useReveal } from '@/hooks/useAnimations'
import { ACCENTS, cn, formatDate, prettyUrl, relativeTime, secondsFromLabel } from '@/lib/utils'
import type { Workflow } from '@/types'

export function ProjectDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { getProject, deleteProject, duplicateProject, pipelineStages } = useProjects()

  const [tab, setTab] = useState('overview')
  const [activeWorkflow, setActiveWorkflow] = useState<Workflow | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [regenerating, setRegenerating] = useState(false)

  const pageRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const project = getProject(id)

  useReveal(pageRef, [project?.id])
  useEnter(panelRef, tab)

  const ranked = useMemo(() => [...(project?.workflows ?? [])].sort((a, b) => b.score - a.score), [project])

  if (!project) return <Navigate to="/dashboard" replace />

  const accent = ACCENTS[project.accent]
  const processing = project.status === 'processing'
  const activeStageIndex = Math.max(
    0,
    pipelineStages.findIndex((stage) => stage.label === project.currentStage),
  )

  const handleShare = () => {
    const link = `${window.location.origin}/project/${project.id}`
    void navigator.clipboard?.writeText(link).catch(() => undefined)
    setToast('Share link copied to clipboard')
  }

  const handleRegenerate = () => {
    setRegenerating(true)
    window.setTimeout(() => {
      setRegenerating(false)
      setToast('Regeneration queued — the render will refresh shortly')
    }, 1400)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'workflows', label: 'Workflows', icon: <Route className="h-4 w-4" />, count: project.workflows.length },
    { id: 'script', label: 'Script', icon: <ScrollText className="h-4 w-4" /> },
    { id: 'video', label: 'Video', icon: <MonitorPlay className="h-4 w-4" /> },
  ]

  return (
    <div ref={pageRef} className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-400 transition-colors hover:text-ink-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to projects
      </Link>

      {/* Header */}
      <header data-reveal className="mt-5 rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start gap-5">
          <span
            className={cn(
              'relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-[0_6px_18px_-6px_rgba(16,24,40,.5)]',
              accent.tile,
            )}
          >
            <span className="absolute inset-0 grid-bg opacity-20" aria-hidden />
            <span className="relative">{project.initials}</span>
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[26px] font-bold leading-tight tracking-[-0.03em] text-ink-950">{project.name}</h1>
              <StatusBadge status={project.status} />
            </div>

            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 text-[13.5px] text-ink-500 transition-colors hover:text-brand-600"
            >
              <Link2 className="h-3.5 w-3.5" />
              {prettyUrl(project.url)}
              <ExternalLink className="h-3 w-3" />
            </a>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-ink-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-ink-400" />
                Created {formatDate(project.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5 text-ink-400" />
                {project.videoDuration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Route className="h-3.5 w-3.5 text-ink-400" />
                {project.workflows.length} workflows
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-ink-400" />
                {project.audience}
              </span>
              <span className="text-ink-400">Updated {relativeTime(project.updatedAt)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleRegenerate} loading={regenerating}>
              {!regenerating && <RefreshCw className="h-4 w-4" />}
              Regenerate
            </Button>
            <Button variant="secondary" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} className="text-rose-600 hover:bg-rose-50">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        {processing && (
          <div className="mt-5 rounded-xl border border-amber-200/70 bg-amber-50/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[13px] font-semibold text-amber-800">
                {project.currentStage} — {Math.round(project.progress ?? 0)}% complete
              </p>
              <p className="text-[12px] text-amber-700/80">Results below update as the agent works.</p>
            </div>
            <ProgressBar value={project.progress ?? 0} className="mt-3" barClassName="bg-amber-500" />
          </div>
        )}
      </header>

      <Tabs items={tabs} value={tab} onChange={setTab} className="mt-7" />

      <div ref={panelRef} className="mt-6">
        {tab === 'overview' && (
          <div className="space-y-5">
            <div data-enter className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon={<Route className="h-[18px] w-[18px]" />} label="Workflows discovered" value={project.workflows.length} hint="Ranked by explanatory value" />
              <StatCard
                icon={<Compass className="h-[18px] w-[18px]" />}
                label="Pages explored"
                value={project.pagesExplored}
                delay={0.08}
                hint="Reachable surfaces crawled"
                accentClassName="bg-violet-50 text-violet-600 ring-violet-100"
              />
              <StatCard
                icon={<Anchor className="h-[18px] w-[18px]" />}
                label="Evidence anchors"
                value={project.evidenceAnchors}
                separator
                delay={0.16}
                hint="Elements captured for grounding"
                accentClassName="bg-emerald-50 text-emerald-600 ring-emerald-100"
              />
              <StatCard
                icon={<Film className="h-[18px] w-[18px]" />}
                label="Video duration"
                value={secondsFromLabel(project.videoDuration)}
                suffix="s"
                delay={0.24}
                hint={project.resolution}
                accentClassName="bg-amber-50 text-amber-600 ring-amber-100"
              />
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <div data-enter className="card p-6">
                <h2 className="text-[15px] font-semibold text-ink-900">What ExplainerAI found</h2>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-600">{project.summary}</p>

                <div className="mt-6">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="label">Top ranked workflows</h3>
                    <button
                      onClick={() => setTab('workflows')}
                      className="text-[12.5px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
                    >
                      See all →
                    </button>
                  </div>

                  <ul className="space-y-2">
                    {ranked.slice(0, 3).map((workflow, i) => (
                      <li key={workflow.id}>
                        <button
                          onClick={() => setActiveWorkflow(workflow)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-ink-200/70 p-3 text-left transition-all duration-200 ease-smooth hover:border-brand-200 hover:bg-brand-50/40"
                        >
                          <span
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[12px] font-bold',
                              i === 0 ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500',
                            )}
                          >
                            {i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13.5px] font-semibold text-ink-900">{workflow.title}</span>
                            <span className="block truncate text-[12px] text-ink-400">{workflow.featureCoverage}</span>
                          </span>
                          <ScoreBadge score={workflow.score} className="shrink-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-5">
                {processing ? (
                  <div data-enter className="card p-5">
                    <h3 className="mb-3 text-[13px] font-semibold text-ink-800">Pipeline</h3>
                    <StepIndicator stages={pipelineStages} activeIndex={activeStageIndex} />
                  </div>
                ) : (
                  <div data-enter className="card overflow-hidden">
                    <div className={cn('relative aspect-video bg-gradient-to-br', accent.tile)}>
                      <span className="absolute inset-0 grid-bg opacity-20" aria-hidden />
                      <button
                        onClick={() => setTab('video')}
                        className="absolute inset-0 flex items-center justify-center transition-colors hover:bg-ink-950/15"
                        aria-label="Open video tab"
                      >
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-pop transition-transform duration-300 ease-smooth hover:scale-105">
                          <MonitorPlay className="h-5 w-5" />
                        </span>
                      </button>
                      <span className="absolute bottom-2.5 right-2.5 rounded-md bg-ink-950/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
                        {project.videoDuration}
                      </span>
                    </div>
                    <div className="p-4">
                      <p className="text-[13px] font-semibold text-ink-900">Rendered explainer</p>
                      <p className="mt-0.5 text-[12px] text-ink-400">{project.resolution} · MP4</p>
                    </div>
                  </div>
                )}

                <div data-enter className="card p-5">
                  <h3 className="mb-3 text-[13px] font-semibold text-ink-800">Generation settings</h3>
                  <dl className="space-y-3 text-[13px]">
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-ink-400">Audience</dt>
                      <dd className="font-medium text-ink-800">{project.audience}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-ink-400">Resolution</dt>
                      <dd className="font-medium text-ink-800">{project.resolution}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-400">Focus areas</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.focusAreas.map((area) => (
                          <Badge key={area} tone="brand">
                            {area}
                          </Badge>
                        ))}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'workflows' && (
          <div className="space-y-4">
            <div data-enter className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-semibold text-ink-900">Discovered workflows</h2>
                <p className="text-[13.5px] text-ink-500">
                  Ranked by explanatory value — reach, feature coverage and how much of the product each one explains.
                </p>
              </div>
              <Badge tone="neutral">
                <Target className="mr-1 h-3 w-3" />
                {ranked.length} ranked
              </Badge>
            </div>

            {ranked.map((workflow, i) => (
              <WorkflowCard key={workflow.id} workflow={workflow} rank={i + 1} onOpen={setActiveWorkflow} />
            ))}
          </div>
        )}

        {tab === 'script' && (
          <div data-enter>
            {project.script ? (
              <ScriptView script={project.script} onRegenerate={() => setToast('Regenerating narration…')} />
            ) : (
              <EmptyState
                icon={<ScrollText className="h-6 w-6" />}
                title="Script not written yet"
                description="The narration is generated once workflow ranking settles. This project is still exploring the application."
                action={
                  <Button variant="secondary" onClick={() => setTab('overview')}>
                    View pipeline progress
                  </Button>
                }
              />
            )}
          </div>
        )}

        {tab === 'video' && (
          <div data-enter className="grid gap-5 lg:grid-cols-[1fr_300px]">
            <VideoPlayer src={project.videoUrl} />

            <aside className="space-y-5">
              <div className="card p-5">
                <h3 className="text-[13px] font-semibold text-ink-800">Render details</h3>
                <dl className="mt-3 space-y-3 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-400">Workflow</dt>
                    <dd className="truncate font-medium text-ink-800" title={ranked[0]?.title}>
                      {ranked[0]?.title ?? '—'}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-400">Duration</dt>
                    <dd className="font-medium text-ink-800">{project.videoDuration}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-400">Resolution</dt>
                    <dd className="font-medium text-ink-800">{project.resolution}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-400">Format</dt>
                    <dd className="font-medium text-ink-800">MP4 · H.264</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-ink-400">Captions</dt>
                    <dd className="font-medium text-ink-800">Burned in</dd>
                  </div>
                </dl>
              </div>

              <div className="card space-y-2 p-5">
                <Button
                  className="w-full"
                  disabled={!project.videoUrl}
                  onClick={() => setToast('Download started — check your browser downloads')}
                >
                  <Download className="h-4 w-4" />
                  Download MP4
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    const copy = duplicateProject(project.id)
                    if (copy) navigate(`/project/${copy.id}`)
                  }}
                >
                  <Layers className="h-4 w-4" />
                  Generate another
                </Button>
                <Button variant="ghost" className="w-full" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Copy share link
                </Button>
              </div>
            </aside>
          </div>
        )}
      </div>

      <WorkflowDetail
        workflow={activeWorkflow}
        open={Boolean(activeWorkflow)}
        onClose={() => setActiveWorkflow(null)}
        onUseForVideo={() => {
          setActiveWorkflow(null)
          setTab('video')
          setToast('Workflow queued for the next render')
        }}
      />

      <ConfirmDialog
        open={confirmDelete}
        title={`Delete “${project.name}”?`}
        description="This removes the project, its discovered workflows, the narration script and the rendered video. This cannot be undone."
        confirmLabel="Delete project"
        onConfirm={() => {
          deleteProject(project.id)
          navigate('/dashboard')
        }}
        onCancel={() => setConfirmDelete(false)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
