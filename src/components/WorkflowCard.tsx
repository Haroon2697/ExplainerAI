import { ArrowRight, Layers, Timer, Users } from 'lucide-react'
import { Badge, ScoreBadge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import type { Workflow } from '@/types'

export function WorkflowCard({
  workflow,
  rank,
  onOpen,
}: {
  workflow: Workflow
  rank: number
  onOpen: (workflow: Workflow) => void
}) {
  return (
    <article
      data-enter
      onClick={() => onOpen(workflow)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen(workflow)
        }
      }}
      className="group card-interactive cursor-pointer p-5"
    >
      <div className="flex items-start gap-4">
        <span
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold transition-colors duration-300',
            rank === 1
              ? 'bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-[0_2px_10px_-2px_rgba(79,70,229,.55)]'
              : 'bg-ink-100 text-ink-500 group-hover:bg-brand-50 group-hover:text-brand-600',
          )}
        >
          {rank}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-[15px] font-semibold leading-snug text-ink-900 transition-colors group-hover:text-brand-700">
              {workflow.title}
            </h3>
            <ScoreBadge score={workflow.score} />
          </div>

          <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-ink-500">{workflow.description}</p>

          {/* Score rendered as a bar as well as a number — easier to compare at a glance. */}
          <div className="mt-3.5 flex items-center gap-3">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-[width] duration-700 ease-smooth"
                style={{ width: `${workflow.score * 100}%` }}
              />
            </div>
            <span className="font-mono text-[11px] tabular-nums text-ink-400">
              {(workflow.score * 100).toFixed(0)}% explanatory value
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {workflow.tags.map((tag) => (
              <Badge key={tag} tone={tag === 'Onboarding' ? 'brand' : 'neutral'}>
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink-200/70 pt-3.5 text-[12px] text-ink-500">
            <span className="inline-flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-ink-400" />
              {workflow.steps.length} steps
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-ink-400" />
              {workflow.estimatedDuration}
            </span>
            <span className="hidden items-center gap-1.5 sm:inline-flex">
              <Users className="h-3.5 w-3.5 text-ink-400" />
              {workflow.reach}
            </span>
            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-brand-600 transition-all duration-200 group-hover:gap-2">
              View details
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
