import { useRef, useState } from 'react'
import { CreditCard, Globe2, RotateCcw, Save, ShieldCheck, Sparkles, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ChipGroup, Field, SegmentedControl, Select } from '@/components/ui/Field'
import { ProgressBar } from '@/components/ui/Progress'
import { Toast } from '@/components/ui/Toast'
import { useProjects } from '@/context/ProjectsContext'
import { useReveal } from '@/hooks/useAnimations'

const FOCUS_AREAS = ['Onboarding', 'Core features', 'Admin', 'Reporting', 'Integrations']

export function Settings() {
  const { workspace, projects, resetDemo } = useProjects()
  const [audience, setAudience] = useState('New users')
  const [length, setLength] = useState('60s')
  const [focus, setFocus] = useState<string[]>(['Onboarding', 'Core features'])
  const [tone, setTone] = useState('Friendly')
  const [toast, setToast] = useState<string | null>(null)

  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef, [])

  const minutesUsed = projects.length * 4.5

  return (
    <div ref={pageRef} className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div data-reveal>
        <h1 className="text-[30px] font-bold leading-tight tracking-[-0.03em] text-ink-900">Settings</h1>
        <p className="mt-1 text-[15px] text-ink-500">Workspace profile, generation defaults and plan usage.</p>
      </div>

      {/* Profile */}
      <section data-reveal className="mt-7 card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-100 text-ink-500">
            <User className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-ink-900">Profile</h2>
            <p className="text-[12.5px] text-ink-400">How you appear across the workspace.</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-5 border-t border-ink-200/70 pt-5">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-ink-800 to-ink-950 text-[15px] font-bold text-white">
            {workspace.user.initials}
          </span>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink-900">{workspace.user.name}</p>
            <p className="text-[13px] text-ink-500">{workspace.user.email}</p>
            <p className="mt-1 text-[12.5px] text-ink-400">
              {workspace.user.role} · {workspace.name}
            </p>
          </div>
          <Badge tone="brand" className="ml-auto">
            {workspace.plan} plan
          </Badge>
        </div>
      </section>

      {/* Generation defaults */}
      <section data-reveal className="mt-5 card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Sparkles className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-ink-900">Generation defaults</h2>
            <p className="text-[12.5px] text-ink-400">Applied to every new project unless you override them.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 border-t border-ink-200/70 pt-5 sm:grid-cols-2">
          <Field label="Default audience">
            <Select
              options={[
                { value: 'New users', label: 'New users' },
                { value: 'Admins', label: 'Admins' },
                { value: 'Power users', label: 'Power users' },
              ]}
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            />
          </Field>

          <Field label="Default narration tone">
            <Select
              options={[
                { value: 'Friendly', label: 'Friendly' },
                { value: 'Formal', label: 'Formal' },
                { value: 'Technical', label: 'Technical' },
              ]}
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </Field>

          <Field label="Default video length" className="sm:col-span-2">
            <SegmentedControl
              options={[
                { value: '30s', label: '30s' },
                { value: '60s', label: '60s' },
                { value: '90s', label: '90s' },
              ]}
              value={length}
              onChange={setLength}
            />
          </Field>

          <Field label="Default focus areas" className="sm:col-span-2">
            <ChipGroup
              options={FOCUS_AREAS}
              values={focus}
              onToggle={(value) =>
                setFocus((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))
              }
            />
          </Field>
        </div>

        <div className="mt-5 flex justify-end border-t border-ink-200/70 pt-5">
          <Button onClick={() => setToast('Generation defaults saved')}>
            <Save className="h-4 w-4" />
            Save changes
          </Button>
        </div>
      </section>

      {/* Exploration policy */}
      <section data-reveal className="mt-5 card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-ink-900">Exploration policy</h2>
            <p className="text-[12.5px] text-ink-400">Guardrails the agent respects while crawling a product.</p>
          </div>
        </div>

        <ul className="mt-5 space-y-3 border-t border-ink-200/70 pt-5 text-[13.5px]">
          {[
            { label: 'Read-only mode', detail: 'Destructive actions are never clicked', on: true },
            { label: 'Respect robots.txt', detail: 'Disallowed paths are skipped', on: true },
            { label: 'Rate limit', detail: 'Maximum 2 requests per second', on: true },
            { label: 'Capture PII', detail: 'Personal data is redacted from frames', on: false },
          ].map((rule) => (
            <li key={rule.label} className="flex items-center gap-3">
              <span
                className={
                  rule.on
                    ? 'flex h-5 w-9 items-center rounded-full bg-brand-600 p-0.5 transition-colors'
                    : 'flex h-5 w-9 items-center rounded-full bg-ink-200 p-0.5 transition-colors'
                }
              >
                <span
                  className={
                    rule.on
                      ? 'h-4 w-4 translate-x-4 rounded-full bg-white shadow-sm transition-transform'
                      : 'h-4 w-4 rounded-full bg-white shadow-sm transition-transform'
                  }
                />
              </span>
              <span className="min-w-0">
                <span className="block font-medium text-ink-800">{rule.label}</span>
                <span className="block text-[12.5px] text-ink-400">{rule.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Plan */}
      <section data-reveal className="mt-5 card p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <CreditCard className="h-[18px] w-[18px]" />
          </span>
          <div>
            <h2 className="text-[15px] font-semibold text-ink-900">Plan & usage</h2>
            <p className="text-[12.5px] text-ink-400">Render minutes reset on the first of each month.</p>
          </div>
        </div>

        <div className="mt-5 border-t border-ink-200/70 pt-5">
          <div className="flex items-baseline justify-between">
            <p className="text-[13.5px] font-medium text-ink-700">Render minutes</p>
            <p className="font-mono text-[12.5px] text-ink-500">{minutesUsed.toFixed(1)} / 120 min</p>
          </div>
          <ProgressBar value={Math.min(100, (minutesUsed / 120) * 100)} className="mt-2.5" />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button variant="secondary" onClick={() => setToast('Plan comparison is out of scope for this prototype')}>
              <Globe2 className="h-4 w-4" />
              Compare plans
            </Button>
            <Button variant="soft" onClick={() => setToast('Upgrade flow is mocked in this prototype')}>
              Upgrade to Scale
            </Button>
          </div>
        </div>
      </section>

      {/* Demo data */}
      <section data-reveal className="mt-5 rounded-2xl border border-rose-200/70 bg-rose-50/40 p-6">
        <h2 className="text-[15px] font-semibold text-rose-900">Demo data</h2>
        <p className="mt-1 text-[13.5px] text-rose-700/80">
          Restores the seeded projects and discards anything created in this session. Useful right before a live demo.
        </p>
        <Button
          variant="secondary"
          className="mt-4 border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50"
          onClick={() => {
            resetDemo()
            setToast('Demo data restored')
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Reset demo data
        </Button>
      </section>

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </div>
  )
}
