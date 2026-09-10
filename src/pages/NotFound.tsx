import { Link } from 'react-router-dom'
import { Compass, Home } from 'lucide-react'
import { buttonStyles } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center px-6 py-24 text-center">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-glow">
        <span className="absolute inset-0 rounded-2xl bg-brand-400/30 animate-pulse-ring" aria-hidden />
        <Compass className="h-7 w-7" />
      </div>
      <p className="font-mono text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] text-ink-900">This page was never discovered</h1>
      <p className="mt-2.5 text-[15px] text-ink-500">
        The route you followed is not part of this workspace. Head back to the dashboard and pick up where you left off.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <Link to="/dashboard" className={buttonStyles('primary', 'md')}>
          <Home className="h-4 w-4" />
          Back to dashboard
        </Link>
        <Link to="/new" className={buttonStyles('secondary', 'md')}>
          Start a new project
        </Link>
      </div>
    </div>
  )
}
