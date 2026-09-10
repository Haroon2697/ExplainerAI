import { useRef, useState } from 'react'
import { BadgeCheck, Check, Languages, Link2, Mic, RefreshCw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Field'
import { EASE, gsap, prefersReducedMotion, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import type { NarrationScript, ScriptAnchor } from '@/types'

const TONES = [
  { value: 'Friendly', label: 'Friendly' },
  { value: 'Formal', label: 'Formal' },
  { value: 'Energetic', label: 'Energetic' },
  { value: 'Technical', label: 'Technical' },
]

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Urdu', label: 'Urdu (اردو)' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'German', label: 'German' },
]

function GroundedSpan({ text, anchor }: { text: string; anchor: ScriptAnchor }) {
  return (
    <span className="group/anchor relative inline-block">
      <mark
        data-anchor
        tabIndex={0}
        className="cursor-help rounded-[3px] bg-brand-50 px-0.5 font-medium text-brand-800 underline decoration-brand-400/70 decoration-dotted decoration-2 underline-offset-[5px] outline-none transition-colors duration-200 hover:bg-brand-100 focus-visible:bg-brand-100"
      >
        {text}
      </mark>

      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2.5 w-72 -translate-x-1/2 translate-y-1 rounded-xl border border-ink-800/10 bg-ink-950 p-3 text-left opacity-0 shadow-pop transition-all duration-200 ease-smooth group-hover/anchor:translate-y-0 group-hover/anchor:opacity-100 group-focus-within/anchor:translate-y-0 group-focus-within/anchor:opacity-100"
      >
        <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-300">
          <Link2 className="h-3 w-3" />
          Linked to
        </span>
        <span className="block text-[13px] font-semibold leading-snug text-white">{anchor.label}</span>
        <span className="mt-1 block text-[11.5px] text-ink-300">{anchor.source}</span>
        <span className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2">
          <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full rounded-full bg-emerald-400" style={{ width: `${anchor.confidence * 100}%` }} />
          </span>
          <span className="font-mono text-[10px] text-emerald-300">{(anchor.confidence * 100).toFixed(0)}% match</span>
        </span>
        <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink-950" aria-hidden />
      </span>
    </span>
  )
}

export function ScriptView({
  script,
  onRegenerate,
}: {
  script: NarrationScript
  onRegenerate?: () => void
}) {
  const [tone, setTone] = useState(script.tone)
  const [language, setLanguage] = useState(script.language)
  const [approved, setApproved] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const scopeRef = useRef<HTMLDivElement>(null)

  const anchors = script.paragraphs.flatMap((p) => p.parts.filter((part) => part.anchor))
  const coverage = Math.round(
    (anchors.reduce((sum, part) => sum + (part.anchor?.confidence ?? 0), 0) / Math.max(1, anchors.length)) * 100,
  )

  // Replays whenever tone/language change, which sells the "re-narrated" idea.
  useGSAP(
    () => {
      const root = scopeRef.current
      if (!root || prefersReducedMotion()) return
      const paras = gsap.utils.toArray<HTMLElement>('[data-paragraph]', root)
      const marks = gsap.utils.toArray<HTMLElement>('[data-anchor]', root)

      const tl = gsap.timeline()
      tl.fromTo(paras, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: EASE.out })
      tl.fromTo(
        marks,
        { backgroundColor: 'rgba(79,70,229,0)', color: 'rgb(58,65,82)' },
        { backgroundColor: 'rgb(238,242,255)', color: 'rgb(55,48,163)', duration: 0.45, stagger: 0.06, ease: EASE.out, clearProps: 'backgroundColor,color' },
        '-=0.3',
      )
    },
    { dependencies: [tone, language, regenerating], scope: scopeRef },
  )

  const handleRegenerate = () => {
    setRegenerating(true)
    setApproved(false)
    onRegenerate?.()
    window.setTimeout(() => setRegenerating(false), 1100)
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-200/80 bg-white p-3 shadow-card">
        <div className="flex items-center gap-2">
          <Mic className="h-4 w-4 text-ink-400" />
          <span className="text-[13px] font-semibold text-ink-600">Tone</span>
          <Select
            options={TONES}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="h-9 w-36"
            aria-label="Narration tone"
          />
        </div>

        <div className="flex items-center gap-2">
          <Languages className="h-4 w-4 text-ink-400" />
          <span className="text-[13px] font-semibold text-ink-600">Language</span>
          <Select
            options={LANGUAGES}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="h-9 w-40"
            aria-label="Narration language"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleRegenerate} loading={regenerating}>
            {!regenerating && <RefreshCw className="h-4 w-4" />}
            Regenerate script
          </Button>
          <Button
            size="sm"
            variant={approved ? 'soft' : 'primary'}
            onClick={() => setApproved(true)}
            disabled={approved}
          >
            {approved ? <BadgeCheck className="h-4 w-4" /> : <Check className="h-4 w-4" />}
            {approved ? 'Approved' : 'Approve'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        {/* Document */}
        <div className="relative overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card">
          <div className="flex items-center justify-between border-b border-ink-200/70 bg-ink-50/60 px-6 py-3">
            <span className="text-[12px] font-semibold text-ink-500">
              narration · {tone.toLowerCase()} · {language.toLowerCase()}
            </span>
            <span className="font-mono text-[11px] text-ink-400">{script.wordCount} words</span>
          </div>

          <div ref={scopeRef} className="px-6 py-7 sm:px-10 sm:py-9">
            {script.paragraphs.map((paragraph, i) => (
              <p
                key={paragraph.id}
                data-paragraph
                className={cn(
                  'text-[16.5px] leading-[1.85] text-ink-700',
                  i > 0 && 'mt-5',
                  language === 'Urdu' && 'font-medium',
                )}
              >
                <span className="mr-2 select-none font-mono text-[11px] text-ink-300">{String(i + 1).padStart(2, '0')}</span>
                {paragraph.parts.map((part, j) =>
                  part.anchor ? (
                    <GroundedSpan key={j} text={part.text} anchor={part.anchor} />
                  ) : (
                    <span key={j}>{part.text}</span>
                  ),
                )}
              </p>
            ))}
          </div>

          {approved && (
            <div className="flex items-center gap-2 border-t border-emerald-200/70 bg-emerald-50/70 px-6 py-3 text-[13px] font-medium text-emerald-700 animate-fade-in">
              <BadgeCheck className="h-4 w-4" />
              Script approved — it will be used for the next render.
            </div>
          )}
        </div>

        {/* Grounding panel */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <h3 className="text-[13px] font-semibold text-ink-800">Grounding</h3>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
              Highlighted phrases are bound to an element captured during exploration. Hover one to see its evidence.
            </p>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tabular-nums text-ink-900">{coverage}</span>
              <span className="text-sm font-semibold text-ink-400">% avg. match</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" style={{ width: `${coverage}%` }} />
            </div>
            <p className="mt-3 text-[12px] text-ink-400">
              <span className="font-semibold text-ink-600">{anchors.length}</span> grounded claims in this script
            </p>
          </div>

          <div className="rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card">
            <h3 className="text-[13px] font-semibold text-ink-800">Evidence links</h3>
            <ul className="mt-3 space-y-2.5">
              {anchors.map((part, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  <span className="min-w-0">
                    <span className="block truncate text-[12.5px] font-medium text-ink-700">{part.text}</span>
                    <span className="block truncate text-[11.5px] text-ink-400">{part.anchor?.source}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
