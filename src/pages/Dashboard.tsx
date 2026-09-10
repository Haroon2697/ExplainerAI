import { useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Anchor,
  ArrowUpRight,
  Clock3,
  LayoutGrid,
  List,
  Plus,
  Route,
  Search,
  Sparkles,
  Video,
  X,
} from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import { StatCard } from '@/components/StatCard'
import { StatusBadge } from '@/components/ui/Badge'
import { Button, buttonStyles } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Field'
import { ProgressBar } from '@/components/ui/Progress'
import { Toast } from '@/components/ui/Toast'
import { useProjects } from '@/context/ProjectsContext'
import { useEnter, useMagnetic, useReveal } from '@/hooks/useAnimations'
import { ACCENTS, cn, formatDate, prettyUrl } from '@/lib/utils'
import type { Project } from '@/types'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'processing', label: 'Processing' },
]

const SORTS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'name', label: 'Name (A–Z)' },
  { value: 'workflows', label: 'Most workflows' },
]

export function Dashboard() {
  const { projects, workspace, duplicateProject, deleteProject } = useProjects()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('recent')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const ctaRef = useMagnetic<HTMLAnchorElement>(0.2)

  const filter = params.get('filter') ?? 'all'

  useReveal(pageRef, [])

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = projects
      .filter((p) => (filter === 'all' ? true : p.status === filter))
      .filter((p) => (term ? `${p.name} ${p.url} ${p.tagline}`.toLowerCase().includes(term) : true))

    return filtered.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name)
      if (sort === 'workflows') return b.workflowsCount - a.workflowsCount
      return +new Date(b.updatedAt) - +new Date(a.updatedAt)
    })
  }, [projects, filter, query, sort])

  // Replay the stagger whenever the visible set changes.
  useEnter(gridRef, `${filter}-${sort}-${view}-${query}-${visible.length}`)

  const totals = useMemo(() => {
    const completed = projects.filter((p) => p.status === 'completed')
    const workflows = projects.reduce((sum, p) => sum + p.workflowsCount, 0)
    const anchors = projects.reduce((sum, p) => sum + p.evidenceAnchors, 0)
    return { completed: completed.length, workflows, anchors }
  }, [projects])

  const confirmDelete = () => {
    if (!pendingDelete) return
    deleteProject(pendingDelete.id)
    setToast(`“${pendingDelete.name}” deleted`)
    setPendingDelete(null)
  }

  const handleDuplicate = (id: string) => {
    const copy = duplicateProject(id)
    if (copy) setToast(`Duplicated as “${copy.name}”`)
  }

  return (
    <div ref={pageRef} className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12.5px] font-medium text-ink-400">
            <span>{workspace.name}</span>
            <span aria-hidden>/</span>
            <span className="text-ink-600">Projects</span>
          </div>
          <h1 className="mt-1.5 text-[30px] font-bold leading-tight tracking-[-0.03em] text-ink-900">Projects</h1>
          <p className="mt-1 text-[15px] text-ink-500">Manage and monitor your explainer video projects</p>
        </div>

        <Link ref={ctaRef} to="/new" className={buttonStyles('primary', 'lg', 'shadow-glow')}>
          <Plus className="h-4.5 w-4.5" />
          New Project
        </Link>
      </div>

      {/* Metrics */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<LayoutGrid className="h-[18px] w-[18px]" />}
          label="Projects"
          value={projects.length}
          hint={`${totals.completed} completed · ${projects.length - totals.completed} in progress`}
        />
        <StatCard
          icon={<Route className="h-[18px] w-[18px]" />}
          label="Workflows discovered"
          value={totals.workflows}
          delay={0.1}
          hint="Ranked by explanatory value"
          accentClassName="bg-violet-50 text-violet-600 ring-violet-100"
        />
        <StatCard
          icon={<Anchor className="h-[18px] w-[18px]" />}
          label="Evidence anchors"
          value={totals.anchors}
          separator
          delay={0.2}
          hint="Narration claims bound to captured elements"
          accentClassName="bg-emerald-50 text-emerald-600 ring-emerald-100"
        />
        <StatCard
          icon={<Video className="h-[18px] w-[18px]" />}
          label="Minutes rendered"
          value={workspace.stats.minutesRendered}
          delay={0.3}
          hint={`Avg. grounding score ${workspace.stats.avgGroundingScore.toFixed(2)}`}
          accentClassName="bg-amber-50 text-amber-600 ring-amber-100"
        />
      </div>

      {/* Toolbar */}
      <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects or URLs"
            className="h-10 w-full rounded-xl border border-ink-200 bg-white pl-9 pr-9 text-sm text-ink-800 transition-colors placeholder:text-ink-400 hover:border-ink-300 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters mirror the sidebar so the page still works on small screens. */}
        <div className="inline-flex rounded-xl border border-ink-200 bg-ink-100/60 p-1 lg:hidden">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setParams(f.id === 'all' ? {} : { filter: f.id })}
              className={cn(
                'rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-all duration-200',
                filter === f.id ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-800',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Select options={SORTS} value={sort} onChange={(e) => setSort(e.target.value)} className="w-[168px]" aria-label="Sort projects" />

          <div className="inline-flex rounded-xl border border-ink-200 bg-white p-1">
            <button
              onClick={() => setView('grid')}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                view === 'grid' ? 'bg-ink-100 text-ink-900' : 'text-ink-400 hover:text-ink-700',
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              aria-label="List view"
              aria-pressed={view === 'list'}
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                view === 'list' ? 'bg-ink-100 text-ink-900' : 'text-ink-400 hover:text-ink-700',
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div ref={gridRef} className="mt-5">
        {visible.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title={query || filter !== 'all' ? 'No projects match this view' : 'No projects yet'}
            description={
              query || filter !== 'all'
                ? 'Try a different filter or clear your search to see every project in the workspace.'
                : 'Paste a SaaS URL and ExplainerAI will explore it, rank the workflows worth showing, and narrate the best one.'
            }
            action={
              query || filter !== 'all' ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setQuery('')
                    setParams({})
                  }}
                >
                  Clear filters
                </Button>
              ) : (
                <Link to="/new" className={buttonStyles('primary', 'md')}>
                  <Plus className="h-4 w-4" />
                  New Project
                </Link>
              )
            }
          />
        ) : view === 'grid' ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDuplicate={handleDuplicate}
                onDelete={setPendingDelete}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card">
            {visible.map((project, i) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                data-enter
                className={cn(
                  'group flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-ink-50/80',
                  i > 0 && 'border-t border-ink-200/70',
                )}
              >
                <span
                  className={cn(
                    'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-[13px] font-bold text-white',
                    ACCENTS[project.accent].tile,
                  )}
                >
                  {project.initials}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[14.5px] font-semibold text-ink-900">{project.name}</span>
                    <StatusBadge status={project.status} />
                  </span>
                  <span className="block truncate text-[12.5px] text-ink-400">{prettyUrl(project.url)}</span>
                </span>

                <span className="hidden w-40 shrink-0 md:block">
                  {project.status === 'processing' ? (
                    <ProgressBar value={project.progress ?? 0} size="sm" barClassName="bg-amber-500" showValue />
                  ) : (
                    <span className="flex items-center gap-1.5 text-[12.5px] text-ink-500">
                      <Route className="h-3.5 w-3.5 text-ink-400" />
                      {project.workflowsCount} workflows
                    </span>
                  )}
                </span>

                <span className="hidden w-24 shrink-0 items-center gap-1.5 text-[12.5px] text-ink-500 lg:flex">
                  <Clock3 className="h-3.5 w-3.5 text-ink-400" />
                  {project.videoDuration}
                </span>

                <span className="hidden w-28 shrink-0 text-[12.5px] text-ink-400 xl:block">
                  {formatDate(project.createdAt)}
                </span>

                <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete “${pendingDelete?.name ?? ''}”?`}
        description="This removes the project, its discovered workflows, the narration script and the rendered video. This cannot be undone."
        confirmLabel="Delete project"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
