import { Crosshair, Layers, PencilLine, RefreshCw, Target, Timer, Users, Video } from 'lucide-react'
import { Badge, ScoreBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal, ModalHeader } from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import type { Workflow, WorkflowStep } from '@/types'

/**
 * Stand-in for a captured frame. Rather than a grey rectangle, it renders a
 * miniature of the page with the interacted element ringed — which is what a
 * real capture would show, and it makes the "grounded" claim legible.
 */
function StepCapture({ step }: { step: WorkflowStep }) {
  // Vary the highlight position per step so a run of captures does not look pasted.
  const spots = [
    'right-3 top-3 h-5 w-20',
    'left-4 top-14 h-16 w-32',
    'left-1/2 top-1/2 h-8 w-40 -translate-x-1/2 -translate-y-1/2',
    'bottom-4 right-4 h-6 w-24',
    'left-4 bottom-4 h-10 w-28',
  ]
  const spot = spots[(step.n - 1) % spots.length]

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-ink-200 bg-ink-100/70">
      <div className="absolute inset-0 grid-bg opacity-60" aria-hidden />

      {/* Miniature app chrome */}
      <div className="absolute inset-x-0 top-0 flex items-center gap-1.5 border-b border-ink-200 bg-white/80 px-2.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-ink-300" />
        <span className="ml-2 h-2 w-24 rounded-full bg-ink-200" />
      </div>
      <div className="absolute bottom-0 left-0 top-9 w-14 border-r border-ink-200 bg-white/60 p-2">
        <span className="mb-2 block h-2 w-8 rounded-full bg-ink-200" />
        <span className="mb-2 block h-2 w-10 rounded-full bg-ink-200" />
        <span className="block h-2 w-7 rounded-full bg-ink-200" />
      </div>
      <div className="absolute bottom-0 left-14 right-0 top-9 p-3">
        <span className="mb-3 block h-2.5 w-28 rounded-full bg-ink-200" />
        <span className="mb-2 block h-2 w-full max-w-[220px] rounded-full bg-ink-200/80" />
        <span className="mb-4 block h-2 w-full max-w-[180px] rounded-full bg-ink-200/80" />
        <span className="block h-10 w-full rounded-lg bg-white ring-1 ring-ink-200" />
      </div>

      {/* The grounded element */}
      <span
        className={cn(
          'absolute rounded-md bg-brand-500/10 ring-2 ring-brand-500 ring-offset-1 ring-offset-white/60',
          spot,
        )}
      >
        <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-70" />
          <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-600">
            <Crosshair className="h-2.5 w-2.5 text-white" />
          </span>
        </span>
      </span>

      <span className="absolute bottom-2 right-2 rounded-md bg-ink-950/70 px-1.5 py-0.5 font-mono text-[10px] text-white">
        frame {String(step.n).padStart(2, '0')} · {step.duration}
      </span>
    </div>
  )
}

export function WorkflowDetail({
  workflow,
  open,
  onClose,
  onUseForVideo,
}: {
  workflow: Workflow | null
  open: boolean
  onClose: () => void
  onUseForVideo?: (workflow: Workflow) => void
}) {
  if (!workflow) return null

  return (
    <Modal open={open} onClose={onClose} size="max-w-5xl" labelledBy="workflow-title">
      <ModalHeader
        id="workflow-title"
        title={workflow.title}
        description={workflow.description}
        onClose={onClose}
        icon={
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-[0_2px_10px_-2px_rgba(79,70,229,.55)]">
            <Target className="h-5 w-5" />
          </div>
        }
      />

      <div className="grid max-h-[70vh] gap-0 overflow-y-auto lg:grid-cols-[1fr_290px]">
        {/* Steps */}
        <div className="p-6" data-modal-stagger>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-400">
              Step-by-step breakdown
            </h3>
            <span className="text-xs text-ink-400">{workflow.steps.length} steps captured</span>
          </div>

          <ol className="relative space-y-6">
            {/* Spine connecting the steps */}
            <span className="absolute bottom-4 left-[15px] top-4 w-px bg-gradient-to-b from-brand-200 via-ink-200 to-transparent" aria-hidden />

            {workflow.steps.map((step) => (
              <li key={step.n} className="relative pl-11">
                <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-ink-200 bg-white text-[12px] font-bold text-ink-600 shadow-card">
                  {step.n}
                </span>

                <p className="text-[14.5px] font-semibold leading-snug text-ink-900">{step.action}</p>

                <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-brand-50/70 px-2 py-1 text-[12px] font-medium text-brand-700 ring-1 ring-inset ring-brand-100">
                  <Crosshair className="h-3.5 w-3.5" />
                  {step.element}
                </p>

                <div className="mt-3">
                  <StepCapture step={step} />
                </div>

                <p className="mt-2 truncate font-mono text-[11px] text-ink-400" title={step.evidence}>
                  evidence · {step.evidence}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Metadata */}
        <aside className="border-t border-ink-200/70 bg-ink-50/60 p-6 lg:border-l lg:border-t-0" data-modal-stagger>
          <h3 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-400">Metadata</h3>

          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[12px] font-medium text-ink-400">Explanatory score</dt>
              <dd className="mt-1">
                <ScoreBadge score={workflow.score} />
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-medium text-ink-400">Feature coverage</dt>
              <dd className="mt-1 font-medium text-ink-800">{workflow.featureCoverage}</dd>
            </div>
            <div>
              <dt className="text-[12px] font-medium text-ink-400">Estimated duration</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 font-medium text-ink-800">
                <Timer className="h-3.5 w-3.5 text-ink-400" />
                {workflow.estimatedDuration}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-medium text-ink-400">Steps</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 font-medium text-ink-800">
                <Layers className="h-3.5 w-3.5 text-ink-400" />
                {workflow.steps.length}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-medium text-ink-400">Reach</dt>
              <dd className="mt-1 inline-flex items-center gap-1.5 font-medium text-ink-800">
                <Users className="h-3.5 w-3.5 text-ink-400" />
                {workflow.reach}
              </dd>
            </div>
            <div>
              <dt className="text-[12px] font-medium text-ink-400">Tags</dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {workflow.tags.map((tag) => (
                  <Badge key={tag} tone={tag === 'Onboarding' ? 'brand' : 'neutral'}>
                    {tag}
                  </Badge>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-6 space-y-2">
            <Button className="w-full" onClick={() => onUseForVideo?.(workflow)}>
              <Video className="h-4 w-4" />
              Use for video
            </Button>
            <Button variant="secondary" className="w-full">
              <RefreshCw className="h-4 w-4" />
              Regenerate
            </Button>
            <Button variant="ghost" className="w-full">
              <PencilLine className="h-4 w-4" />
              Edit steps
            </Button>
          </div>
        </aside>
      </div>
    </Modal>
  )
}
