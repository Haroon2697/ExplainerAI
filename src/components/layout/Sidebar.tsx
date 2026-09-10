import { Link, useLocation, useSearchParams } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronsLeft,
  Clock3,
  LayoutGrid,
  Loader2,
  PanelsTopLeft,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { buttonStyles } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/Progress'
import { useProjects } from '@/context/ProjectsContext'
import { ACCENTS, cn, relativeTime } from '@/lib/utils'

const FILTERS = [
  { id: 'all', label: 'All projects', icon: LayoutGrid },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'processing', label: 'Processing', icon: Loader2 },
] as const

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { projects, resetDemo } = useProjects()
  const [params] = useSearchParams()
  const location = useLocation()

  const activeFilter = location.pathname === '/dashboard' ? (params.get('filter') ?? 'all') : ''
  const counts = {
    all: projects.length,
    completed: projects.filter((p) => p.status === 'completed').length,
    processing: projects.filter((p) => p.status === 'processing').length,
  }

  const recent = [...projects]
    .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
    .slice(0, 4)

  const minutesUsed = projects.length * 4.5

  return (
    <aside
      className={cn(
        'sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-ink-200/70 bg-white/70 transition-[width] duration-300 ease-smooth lg:flex',
        collapsed ? 'w-[74px]' : 'w-[264px]',
      )}
    >
      <div className={cn('flex flex-col gap-6 overflow-y-auto p-4', collapsed && 'items-center px-3')}>
        <Link
          to="/new"
          className={buttonStyles('primary', 'md', cn('w-full', collapsed && 'w-10 px-0'))}
          title="New project"
        >
          <Plus className="h-4 w-4" />
          {!collapsed && 'New Project'}
        </Link>

        <nav className="w-full space-y-1">
          {!collapsed && <p className="label px-2.5 pb-1.5">Library</p>}
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.id
            const Icon = filter.icon
            return (
              <Link
                key={filter.id}
                to={`/dashboard?filter=${filter.id}`}
                title={filter.label}
                className={cn(
                  'group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-all duration-200 ease-smooth',
                  collapsed && 'justify-center px-0',
                  active
                    ? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200/60'
                    : 'text-ink-600 hover:bg-ink-100/70 hover:text-ink-900',
                )}
              >
                <Icon
                  className={cn(
                    'h-[18px] w-[18px] shrink-0 transition-colors',
                    active ? 'text-brand-600' : 'text-ink-400 group-hover:text-ink-600',
                    filter.id === 'processing' && counts.processing > 0 && 'animate-spin [animation-duration:2.4s]',
                  )}
                />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{filter.label}</span>
                    <span
                      className={cn(
                        'rounded-md px-1.5 py-0.5 text-[11px] font-semibold tabular-nums',
                        active ? 'bg-white text-brand-700' : 'bg-ink-100 text-ink-500',
                      )}
                    >
                      {counts[filter.id]}
                    </span>
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {!collapsed && (
          <div className="w-full space-y-1">
            <p className="label px-2.5 pb-1.5">Recent</p>
            {recent.map((project) => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="group flex items-center gap-2.5 rounded-xl px-2.5 py-2 transition-colors hover:bg-ink-100/70"
              >
                <span
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[10px] font-bold text-white',
                    ACCENTS[project.accent].tile,
                  )}
                >
                  {project.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-ink-800 group-hover:text-ink-950">
                    {project.name}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-ink-400">
                    <Clock3 className="h-3 w-3" />
                    {relativeTime(project.updatedAt)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}

        {!collapsed && (
          <div className="w-full rounded-2xl border border-ink-200/80 bg-gradient-to-b from-white to-ink-50/80 p-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-ink-800">Render minutes</span>
              <Sparkles className="h-3.5 w-3.5 text-brand-500" />
            </div>
            <ProgressBar value={Math.min(100, (minutesUsed / 120) * 100)} size="sm" />
            <p className="mt-2 text-[11px] text-ink-400">
              <span className="font-semibold text-ink-600">{minutesUsed.toFixed(1)}</span> of 120 min used this month
            </p>
            <Link
              to="/settings"
              className="mt-3 inline-flex text-[12px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              Manage plan →
            </Link>
          </div>
        )}
      </div>

      <div className={cn('mt-auto flex items-center gap-1 border-t border-ink-200/70 p-3', collapsed && 'justify-center')}>
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
        >
          {collapsed ? <PanelsTopLeft className="h-[18px] w-[18px]" /> : <ChevronsLeft className="h-[18px] w-[18px]" />}
        </button>
        {!collapsed && (
          <button
            onClick={resetDemo}
            title="Restore the seeded demo projects"
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-medium text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset demo data
          </button>
        )}
      </div>
    </aside>
  )
}
