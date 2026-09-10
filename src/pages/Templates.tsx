import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, Flame, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { buttonStyles } from '@/components/ui/Button'
import { useProjects } from '@/context/ProjectsContext'
import { useReveal } from '@/hooks/useAnimations'
import { ACCENTS, cn } from '@/lib/utils'

export function Templates() {
  const { templates } = useProjects()
  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef, [])

  return (
    <div ref={pageRef} className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-8">
      <div data-reveal>
        <h1 className="text-[30px] font-bold leading-tight tracking-[-0.03em] text-ink-900">Templates</h1>
        <p className="mt-1 text-[15px] text-ink-500">
          Presets that change how workflows are ranked and how the narration is written.
        </p>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => {
          const accent = ACCENTS[template.accent]
          return (
            <article
              key={template.id}
              data-reveal
              className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-smooth hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover"
            >
              <div className={cn('relative h-24 bg-gradient-to-br', accent.tile)}>
                <span className="absolute inset-0 grid-bg opacity-20" aria-hidden />
                <span
                  className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/20 blur-2xl transition-transform duration-700 ease-smooth group-hover:scale-125"
                  aria-hidden
                />
                <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-2 py-1 text-[11px] font-semibold text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                  <Clock3 className="h-3 w-3" />
                  {template.duration}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h2 className="text-[15.5px] font-semibold text-ink-900 transition-colors group-hover:text-brand-700">
                  {template.name}
                </h2>
                <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-ink-500">{template.description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {template.focusAreas.map((area) => (
                    <Badge key={area}>{area}</Badge>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-[12px] text-ink-500">
                  <Users className="h-3.5 w-3.5 text-ink-400" />
                  {template.audience}
                  <span className="ml-auto inline-flex items-center gap-1.5 text-ink-400">
                    <Flame className="h-3.5 w-3.5 text-amber-500" />
                    {template.popularity}% adoption
                  </span>
                </div>

                <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className={cn('h-full rounded-full transition-[width] duration-700 ease-smooth', accent.bar)}
                    style={{ width: `${template.popularity}%` }}
                  />
                </div>

                <Link
                  to={`/new?template=${template.id}`}
                  className={buttonStyles('secondary', 'md', 'mt-5 w-full group-hover:border-brand-300 group-hover:text-brand-700')}
                >
                  Use template
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
