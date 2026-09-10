import clsx, { type ClassValue } from 'clsx'
import type { Accent } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/** Tailwind needs complete class strings at build time, so accents are a static map. */
export const ACCENTS: Record<Accent, { tile: string; text: string; soft: string; dot: string; bar: string }> = {
  indigo: {
    tile: 'from-indigo-500 to-violet-600',
    text: 'text-indigo-600',
    soft: 'bg-indigo-50 text-indigo-700 ring-indigo-200/70',
    dot: 'bg-indigo-500',
    bar: 'bg-indigo-500',
  },
  emerald: {
    tile: 'from-emerald-500 to-teal-600',
    text: 'text-emerald-600',
    soft: 'bg-emerald-50 text-emerald-700 ring-emerald-200/70',
    dot: 'bg-emerald-500',
    bar: 'bg-emerald-500',
  },
  sky: {
    tile: 'from-sky-500 to-blue-600',
    text: 'text-sky-600',
    soft: 'bg-sky-50 text-sky-700 ring-sky-200/70',
    dot: 'bg-sky-500',
    bar: 'bg-sky-500',
  },
  violet: {
    tile: 'from-violet-500 to-purple-600',
    text: 'text-violet-600',
    soft: 'bg-violet-50 text-violet-700 ring-violet-200/70',
    dot: 'bg-violet-500',
    bar: 'bg-violet-500',
  },
  amber: {
    tile: 'from-amber-500 to-orange-600',
    text: 'text-amber-600',
    soft: 'bg-amber-50 text-amber-700 ring-amber-200/70',
    dot: 'bg-amber-500',
    bar: 'bg-amber-500',
  },
  rose: {
    tile: 'from-rose-500 to-pink-600',
    text: 'text-rose-600',
    soft: 'bg-rose-50 text-rose-700 ring-rose-200/70',
    dot: 'bg-rose-500',
    bar: 'bg-rose-500',
  },
}

export const ACCENT_KEYS = Object.keys(ACCENTS) as Accent[]

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(iso)
}

/** Strips protocol and trailing slash so URLs read like a hostname in dense UI. */
export function prettyUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function hostFromUrl(url: string) {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function initialsFromUrl(url: string) {
  const host = hostFromUrl(url)
  const base = host.split('.')[0] ?? host
  return base.slice(0, 2).toUpperCase()
}

export function titleFromUrl(url: string) {
  const base = hostFromUrl(url).split('.')[0] ?? 'Project'
  return base.charAt(0).toUpperCase() + base.slice(1)
}

export function isValidUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return false
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(trimmed)
}

export function normalizeUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, '')
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

/** Deterministic-enough id for a mocked backend. */
export function makeId(prefix = 'prj') {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function secondsFromLabel(label: string) {
  const [m, s] = label.split(':').map(Number)
  if (Number.isNaN(m) || Number.isNaN(s)) return 0
  return m * 60 + s
}

export function labelFromSeconds(total: number) {
  const m = Math.floor(total / 60)
  const s = Math.floor(total % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}
