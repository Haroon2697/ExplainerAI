import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, LayoutGrid, LogOut, Plus, Search, Settings, Sparkles, User } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Menu, MenuItem, MenuLabel, MenuSeparator } from '@/components/ui/Menu'
import { useProjects } from '@/context/ProjectsContext'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/templates', label: 'Templates' },
  { to: '/settings', label: 'Settings' },
]

export function Navbar() {
  const navigate = useNavigate()
  const { workspace, projects } = useProjects()
  const processing = projects.filter((p) => p.status === 'processing').length

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-white/85 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="rounded-lg" aria-label="ExplainerAI home">
          <Logo />
        </Link>

        <span className="mx-1 hidden h-5 w-px bg-ink-200 lg:block" aria-hidden />

        <nav className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-200',
                  isActive ? 'text-brand-700' : 'text-ink-500 hover:bg-ink-100/70 hover:text-ink-900',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-brand-600" aria-hidden />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="hidden h-9 items-center gap-2 rounded-xl border border-ink-200 bg-ink-50/80 pl-3 pr-2 text-sm text-ink-400 transition-colors hover:border-ink-300 hover:bg-white md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="pr-6">Search projects</span>
            <kbd className="rounded-md border border-ink-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink-400">
              ⌘K
            </kbd>
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative hidden h-9 w-9 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 sm:flex"
          >
            <Bell className="h-[18px] w-[18px]" />
            {processing > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
              </span>
            )}
          </button>

          <Button size="sm" className="hidden sm:inline-flex" onClick={() => navigate('/new')}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>

          <Menu
            label="Account menu"
            width="w-60"
            buttonClassName="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-ink-100/80"
            button={
              <>
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-ink-800 to-ink-950 text-[11px] font-bold text-white">
                  {workspace.user.initials}
                </span>
                <span className="hidden text-left leading-tight xl:block">
                  <span className="block text-[13px] font-semibold text-ink-900">{workspace.user.name}</span>
                  <span className="block text-[11px] text-ink-400">{workspace.plan} workspace</span>
                </span>
                <ChevronDown className="h-4 w-4 text-ink-400" />
              </>
            }
          >
            <MenuLabel>{workspace.user.email}</MenuLabel>
            <MenuItem icon={<User className="h-4 w-4" />}>Profile</MenuItem>
            <MenuItem icon={<LayoutGrid className="h-4 w-4" />} onSelect={() => navigate('/projects')}>
              My projects
            </MenuItem>
            <MenuItem icon={<Settings className="h-4 w-4" />} onSelect={() => navigate('/settings')}>
              Workspace settings
            </MenuItem>
            <MenuSeparator />
            <MenuItem icon={<Sparkles className="h-4 w-4" />} onSelect={() => navigate('/settings')}>
              Upgrade plan
            </MenuItem>
            <MenuItem icon={<LogOut className="h-4 w-4" />} danger onSelect={() => navigate('/')}>
              Log out
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  )
}
