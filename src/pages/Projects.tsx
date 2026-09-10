import { useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Copy, ExternalLink, FolderOpen, MoreHorizontal, Plus, Route, Search, Trash2, X } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { buttonStyles } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Menu, MenuItem, MenuSeparator } from '@/components/ui/Menu'
import { ProgressBar } from '@/components/ui/Progress'
import { Toast } from '@/components/ui/Toast'
import { useProjects } from '@/context/ProjectsContext'
import { useEnter, useReveal } from '@/hooks/useAnimations'
import { ACCENTS, cn, formatDate, prettyUrl, relativeTime } from '@/lib/utils'
import type { Project } from '@/types'

/**
 * The table counterpart to the dashboard grid: same data, denser reading,
 * built for the moment a workspace has more projects than fit on one screen.
 */
export function Projects() {
  const { projects, duplicateProject, deleteProject } = useProjects()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useReveal(pageRef, [])

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase()
    return projects
      .filter((p) => (term ? `${p.name} ${p.url} ${p.tagline}`.toLowerCase().includes(term) : true))
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
  }, [projects, query])

  useEnter(tableRef, `${query}-${rows.length}`, '[data-row]')

  return (
    <div ref={pageRef} className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div data-reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[12.5px] font-medium text-ink-400">
            <span>Library</span>
            <span aria-hidden>/</span>
            <span className="text-ink-600">All projects</span>
          </div>
          <h1 className="mt-1.5 text-[30px] font-bold leading-tight tracking-[-0.03em] text-ink-900">All projects</h1>
          <p className="mt-1 text-[15px] text-ink-500">
            {projects.length} {projects.length === 1 ? 'project' : 'projects'} across this workspace
          </p>
        </div>

        <Link to="/new" className={buttonStyles('primary', 'md')}>
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div data-reveal className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or URL…"
            aria-label="Search projects"
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
        <span className="text-[13px] text-ink-400">
          Showing <span className="font-semibold text-ink-700">{rows.length}</span> of {projects.length}
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<FolderOpen className="h-6 w-6" />}
          title={query ? 'No projects match that search' : 'No projects yet'}
          description={
            query
              ? 'Try a different product name or URL fragment.'
              : 'Create your first explainer video and it will appear here.'
          }
          action={
            query ? (
              <button onClick={() => setQuery('')} className={buttonStyles('secondary', 'md')}>
                Clear search
              </button>
            ) : (
              <Link to="/new" className={buttonStyles('primary', 'md')}>
                <Plus className="h-4 w-4" />
                New Project
              </Link>
            )
          }
        />
      ) : (
        <div data-reveal className="mt-5 overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card">
          <div className="hidden grid-cols-[minmax(0,2.4fr)_repeat(4,minmax(0,1fr))_48px] gap-4 border-b border-ink-200/70 bg-ink-50/70 px-5 py-3 lg:grid">
            {['Project', 'Status', 'Workflows', 'Duration', 'Created', ''].map((head, i) => (
              <span key={head || i} className="label">
                {head}
              </span>
            ))}
          </div>

          <div ref={tableRef} className="divide-y divide-ink-200/70">
            {rows.map((project) => (
              <div
                key={project.id}
                data-row
                className="group grid grid-cols-1 items-center gap-3 px-5 py-4 transition-colors duration-200 hover:bg-ink-50/60 lg:grid-cols-[minmax(0,2.4fr)_repeat(4,minmax(0,1fr))_48px] lg:gap-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-[12px] font-bold text-white shadow-[0_2px_6px_-2px_rgba(16,24,40,.4)]',
                      ACCENTS[project.accent].tile,
                    )}
                  >
                    {project.initials}
                  </span>
                  <span className="min-w-0">
                    <Link
                      to={`/project/${project.id}`}
                      className="block truncate text-[14.5px] font-semibold text-ink-900 transition-colors hover:text-brand-700"
                    >
                      {project.name}
                    </Link>
                    <span className="block truncate text-[12.5px] text-ink-400">{prettyUrl(project.url)}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 lg:block">
                  <StatusBadge status={project.status} />
                  {project.status === 'processing' && (
                    <ProgressBar value={project.progress ?? 0} size="sm" className="mt-2 hidden w-24 lg:flex" barClassName="bg-amber-500" />
                  )}
                </div>

                <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-600">
                  <Route className="h-3.5 w-3.5 text-ink-400 lg:hidden" />
                  <span className="font-semibold tabular-nums">{project.workflowsCount}</span>
                  <span className="text-ink-400 lg:hidden">workflows</span>
                </span>

                <span className="font-mono text-[13px] tabular-nums text-ink-600">{project.videoDuration}</span>

                <span className="inline-flex items-center gap-1.5 text-[13px] text-ink-500">
                  <Calendar className="h-3.5 w-3.5 text-ink-400 lg:hidden" />
                  <span title={`Updated ${relativeTime(project.updatedAt)}`}>{formatDate(project.createdAt)}</span>
                </span>

                <div className="justify-self-end">
                  <Menu
                    label={`Actions for ${project.name}`}
                    buttonClassName="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 opacity-0 transition-all duration-200 hover:bg-ink-100 hover:text-ink-700 focus-visible:opacity-100 group-hover:opacity-100"
                    button={<MoreHorizontal className="h-[18px] w-[18px]" />}
                  >
                    <MenuItem
                      icon={<ExternalLink className="h-4 w-4" />}
                      onSelect={() => navigate(`/project/${project.id}`)}
                    >
                      Open project
                    </MenuItem>
                    <MenuItem
                      icon={<Copy className="h-4 w-4" />}
                      onSelect={() => {
                        const copy = duplicateProject(project.id)
                        if (copy) setToast(`Duplicated as “${copy.name}”`)
                      }}
                    >
                      Duplicate
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem icon={<Trash2 className="h-4 w-4" />} danger onSelect={() => setPendingDelete(project)}>
                      Delete
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete “${pendingDelete?.name ?? ''}”?`}
        description="The project, its discovered workflows, narration script and rendered video will be removed. This cannot be undone."
        confirmLabel="Delete project"
        onConfirm={() => {
          if (!pendingDelete) return
          deleteProject(pendingDelete.id)
          setToast(`“${pendingDelete.name}” deleted`)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
