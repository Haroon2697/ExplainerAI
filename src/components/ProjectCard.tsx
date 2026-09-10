import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Clock3, Copy, ExternalLink, Film, MoreHorizontal, Play, Route, Trash2 } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { Menu, MenuItem, MenuSeparator } from '@/components/ui/Menu'
import { ProgressBar } from '@/components/ui/Progress'
import { useTilt } from '@/hooks/useAnimations'
import { ACCENTS, cn, formatDate, prettyUrl } from '@/lib/utils'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onDuplicate: (id: string) => void
  onDelete: (project: Project) => void
}

export function ProjectCard({ project, onDuplicate, onDelete }: ProjectCardProps) {
  const navigate = useNavigate()
  const cardRef = useTilt<HTMLElement>(3.5)
  const accent = ACCENTS[project.accent]
  const processing = project.status === 'processing'

  return (
    <article
      ref={cardRef}
      data-enter
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card transition-[box-shadow,border-color] duration-300 ease-smooth hover:border-brand-200 hover:shadow-card-hover"
    >
      {/* Cursor-tracked spotlight; --spot-x/y are written by useTilt. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--spot-x,50%) var(--spot-y,50%), rgba(79,70,229,.07), transparent 60%)',
        }}
      />

      <Link to={`/project/${project.id}`} className="relative block" aria-label={`Open ${project.name}`}>
        <div className={cn('relative aspect-[16/9] overflow-hidden bg-gradient-to-br', accent.tile)}>
          <span className="absolute inset-0 grid-bg opacity-[0.18]" aria-hidden />
          <span
            className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl transition-transform duration-700 ease-smooth group-hover:scale-125"
            aria-hidden
          />

          {/* Faux browser chrome — reads instantly as "a capture of a web app". */}
          <div className="absolute inset-x-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/15 px-2 py-1.5 backdrop-blur-sm ring-1 ring-inset ring-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            <span className="ml-1.5 truncate text-[10px] font-medium text-white/80">{prettyUrl(project.url)}</span>
          </div>

          <div className="absolute inset-x-3 bottom-3 top-11 rounded-lg bg-white/10 ring-1 ring-inset ring-white/15">
            <div className="flex h-full items-center justify-center">
              <span className="text-2xl font-bold tracking-tight text-white/85">{project.initials}</span>
            </div>
          </div>

          {processing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-950/25 backdrop-blur-[1px]">
              <span className="rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink-700 shadow-card">
                {project.currentStage ?? 'Processing'}…
              </span>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/20">
              <span className="flex h-12 w-12 scale-90 items-center justify-center rounded-full bg-white/95 text-brand-700 opacity-0 shadow-pop transition-all duration-300 ease-smooth group-hover:scale-100 group-hover:opacity-100">
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </span>
            </div>
          )}

          {!processing && (
            <span className="absolute bottom-3 right-3 rounded-md bg-ink-950/70 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-sm">
              {project.videoDuration}
            </span>
          )}
        </div>
      </Link>

      <div className="relative z-20 flex flex-1 flex-col p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/project/${project.id}`}
                className="truncate text-[15px] font-semibold text-ink-900 transition-colors hover:text-brand-700"
              >
                {project.name}
              </Link>
              <StatusBadge status={project.status} />
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-0.5 inline-flex items-center gap-1 text-[12.5px] text-ink-400 transition-colors hover:text-brand-600"
            >
              {prettyUrl(project.url)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <Menu
            label={`Actions for ${project.name}`}
            buttonClassName="-mr-1 -mt-1 flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
            button={<MoreHorizontal className="h-[18px] w-[18px]" />}
          >
            <MenuItem icon={<ExternalLink className="h-4 w-4" />} onSelect={() => navigate(`/project/${project.id}`)}>
              Open project
            </MenuItem>
            <MenuItem icon={<Copy className="h-4 w-4" />} onSelect={() => onDuplicate(project.id)}>
              Duplicate
            </MenuItem>
            <MenuSeparator />
            <MenuItem icon={<Trash2 className="h-4 w-4" />} danger onSelect={() => onDelete(project)}>
              Delete
            </MenuItem>
          </Menu>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-ink-400" />
            {formatDate(project.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 text-ink-400" />
            {project.videoDuration}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Route className="h-3.5 w-3.5 text-ink-400" />
            {project.workflowsCount} workflows
          </span>
        </div>

        <div className="mt-4 border-t border-ink-200/70 pt-3.5">
          {processing ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-ink-600">{project.currentStage}</span>
                <span className="font-mono tabular-nums text-ink-400">{Math.round(project.progress ?? 0)}%</span>
              </div>
              <ProgressBar value={project.progress ?? 0} size="sm" barClassName="bg-amber-500" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-ink-500">
                <Film className="h-3.5 w-3.5 text-ink-400" />
                {project.resolution}
              </span>
              <Link
                to={`/project/${project.id}`}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 transition-all duration-200 hover:gap-1.5 hover:text-brand-700"
              >
                Open
                <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
