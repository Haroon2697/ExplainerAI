import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import demo from '@/data/demo-scenarios.json'
import type { PipelineStage, Project, ProjectDraft, Template, Workflow, Workspace } from '@/types'
import { ACCENT_KEYS, hostFromUrl, initialsFromUrl, makeId, normalizeUrl, titleFromUrl } from '@/lib/utils'

const SEED_PROJECTS = demo.projects as unknown as Project[]
const TEMPLATES = demo.templates as unknown as Template[]
const WORKSPACE = demo.workspace as unknown as Workspace
const PIPELINE_STAGES = demo.pipelineStages as unknown as PipelineStage[]

interface ProjectsContextValue {
  projects: Project[]
  templates: Template[]
  workspace: Workspace
  pipelineStages: PipelineStage[]
  getProject: (id: string) => Project | undefined
  createProject: (draft: ProjectDraft) => Project
  completeProject: (id: string) => void
  duplicateProject: (id: string) => Project | undefined
  deleteProject: (id: string) => void
  updateProject: (id: string, patch: Partial<Project>) => void
  resetDemo: () => void
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

/**
 * Builds a believable workflow set for a freshly submitted URL. In the real
 * product this is what the discovery + ranking agents return; here it is
 * synthesised from the draft so the demo flow lands on a populated project.
 */
function synthesizeWorkflows(name: string, draft: ProjectDraft): Workflow[] {
  const base: Array<Omit<Workflow, 'id'>> = [
    {
      title: 'Sign Up → Complete Onboarding Checklist',
      description: `The activation path a first-time ${name} user takes: account creation, workspace setup, and the checklist that gets them to first value.`,
      tags: ['Onboarding', 'Core Feature'],
      score: 0.93,
      featureCoverage: 'Signup, Workspace setup, Checklist',
      estimatedDuration: '0:30',
      reach: 'Touched by 89% of new accounts',
      steps: [
        { n: 1, action: 'Open the signup form from the marketing header', element: 'Button labeled "Get started"', evidence: 'header a[href="/signup"]', duration: '0:04' },
        { n: 2, action: 'Create the workspace and invite the first teammate', element: 'Input "Workspace name"', evidence: 'form.onboarding input[name="workspace"]', duration: '0:09' },
        { n: 3, action: 'Work through the getting-started checklist', element: 'Checklist item "Create your first item"', evidence: 'aside.checklist li:first-child', duration: '0:10' },
        { n: 4, action: 'Dismiss the checklist and land on the populated dashboard', element: 'Button labeled "Done"', evidence: 'aside.checklist button.dismiss', duration: '0:07' },
      ],
    },
    {
      title: 'Create Your First Record → Share with the Team',
      description: `The core creation loop. Everything else in ${name} composes on top of this object, so it ranks highest for explanatory value.`,
      tags: ['Core Feature'],
      score: 0.88,
      featureCoverage: 'Create, Edit, Share',
      estimatedDuration: '0:28',
      reach: 'Touched by 82% of active accounts',
      steps: [
        { n: 1, action: 'Click the primary create action in the toolbar', element: 'Button labeled "New"', evidence: 'header button[data-action="create"]', duration: '0:05' },
        { n: 2, action: 'Fill in the required fields and save', element: 'Form "Create" with title and description', evidence: 'form.create-record', duration: '0:10' },
        { n: 3, action: 'Open the share sheet and copy a view-only link', element: 'Button labeled "Share"', evidence: 'header.record button.share', duration: '0:07' },
        { n: 4, action: 'Confirm the link-copied toast appears', element: 'Toast "Link copied"', evidence: 'div[role="status"].toast', duration: '0:06' },
      ],
    },
    {
      title: 'Invite Teammate → Assign a Role',
      description: 'Seat invitation and the permission matrix that gates billing, integrations and workspace settings.',
      tags: ['Admin', 'Collaboration'],
      score: 0.81,
      featureCoverage: 'Members, Roles, Permissions',
      estimatedDuration: '0:24',
      reach: 'Touched by 58% of active accounts',
      steps: [
        { n: 1, action: 'Open workspace settings from the avatar menu', element: 'Menu item "Settings"', evidence: 'nav [data-menu="profile"] a[href="/settings"]', duration: '0:05' },
        { n: 2, action: 'Move to Members and click Invite', element: 'Button labeled "Invite people"', evidence: 'section#members button.invite', duration: '0:06' },
        { n: 3, action: 'Choose a role and send the invitation', element: 'Select "Role"', evidence: 'form.invite select[name="role"]', duration: '0:07' },
        { n: 4, action: 'Observe the pending state in the member list', element: 'Status pill "Pending"', evidence: 'table.members .status-pill', duration: '0:06' },
      ],
    },
    {
      title: 'Build a Report → Export the Results',
      description: 'Reporting path that filters the dataset, saves the view, and exports it for stakeholders outside the product.',
      tags: ['Reporting', 'Export'],
      score: 0.75,
      featureCoverage: 'Filters, Saved views, Export',
      estimatedDuration: '0:26',
      reach: 'Touched by 44% of active accounts',
      steps: [
        { n: 1, action: 'Open Reports from the primary navigation', element: 'Nav link "Reports"', evidence: 'nav a[href="/reports"]', duration: '0:04' },
        { n: 2, action: 'Apply a date range and a status filter', element: 'Filter bar with date range picker', evidence: 'div.filter-bar [data-filter="range"]', duration: '0:09' },
        { n: 3, action: 'Save the view so it can be reused', element: 'Button labeled "Save view"', evidence: 'header.report button.save-view', duration: '0:06' },
        { n: 4, action: 'Export the report as CSV', element: 'Menu item "Export CSV"', evidence: 'div.export-menu li[data-format="csv"]', duration: '0:07' },
      ],
    },
  ]

  // Focus areas act as a re-ranking signal, exactly as they do in the product.
  const focus = draft.focusAreas.map((f) => f.toLowerCase())
  const boosted = base.map((wf) => {
    const matches = wf.tags.some((tag) => focus.some((f) => f.includes(tag.toLowerCase()) || tag.toLowerCase().includes(f)))
    return { ...wf, score: Math.min(0.98, Number((wf.score + (matches ? 0.04 : 0)).toFixed(2))) }
  })

  return boosted
    .sort((a, b) => b.score - a.score)
    .map((wf, i) => ({ ...wf, id: `wf-${makeId('n')}-${i + 1}` }))
}

function synthesizeScript(name: string, workflows: Workflow[]): Project['script'] {
  const [first, second] = workflows
  return {
    tone: 'Friendly',
    language: 'English',
    wordCount: 96,
    paragraphs: [
      {
        id: 'p1',
        parts: [
          { text: `${name} starts you off with a workspace and a short checklist. Press ` },
          {
            text: 'Get started',
            anchor: { label: 'Button labeled "Get started"', source: 'Marketing header', confidence: 0.96, workflowId: first?.id ?? '', step: 1 },
          },
          { text: ', name your workspace, and the product walks you to your first real task.' },
        ],
      },
      {
        id: 'p2',
        parts: [
          { text: 'The core loop is one action away: the ' },
          {
            text: 'primary create button',
            anchor: { label: 'Button labeled "New"', source: 'Dashboard · toolbar', confidence: 0.94, workflowId: second?.id ?? first?.id ?? '', step: 1 },
          },
          { text: ' opens a form with only the fields you actually need, and saving drops you straight into the record.' },
        ],
      },
      {
        id: 'p3',
        parts: [
          { text: 'Sharing is a link, not an export — hit ' },
          {
            text: 'Share',
            anchor: { label: 'Button labeled "Share"', source: 'Record header', confidence: 0.92, workflowId: second?.id ?? first?.id ?? '', step: 3 },
          },
          { text: ', copy the view-only URL, and anyone on your team can follow along without a seat.' },
        ],
      },
      {
        id: 'p4',
        parts: [
          { text: `That is ${name}: set up in a minute, and everything after that is one click from where you already are.` },
        ],
      },
    ],
  }
}

function projectFromDraft(draft: ProjectDraft): Project {
  const url = normalizeUrl(draft.url)
  const name = titleFromUrl(url)
  const workflows = synthesizeWorkflows(name, draft)
  const now = new Date().toISOString()
  const accent = ACCENT_KEYS[Math.floor(Math.random() * ACCENT_KEYS.length)] ?? 'indigo'

  return {
    id: makeId(),
    name,
    url,
    tagline: hostFromUrl(url),
    status: 'processing',
    accent,
    initials: initialsFromUrl(url),
    createdAt: now,
    updatedAt: now,
    videoDuration: '—',
    workflowsCount: workflows.length,
    pagesExplored: 12 + Math.floor(Math.random() * 26),
    evidenceAnchors: 60 + Math.floor(Math.random() * 140),
    resolution: '—',
    audience: draft.audience,
    focusAreas: draft.focusAreas,
    progress: 4,
    currentStage: 'Exploring application',
    summary: `ExplainerAI is exploring ${hostFromUrl(url)} for a ${draft.videoLength} explainer aimed at ${draft.audience.toLowerCase()}.`,
    videoUrl: null,
    workflows,
    script: synthesizeScript(name, workflows),
  }
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(SEED_PROJECTS)
  // Projects created this session finish their pipeline; seeded ones just drift.
  const sessionCreated = useRef<Set<string>>(new Set())

  /** Keeps processing cards visibly alive without ever silently completing a seeded demo project. */
  useEffect(() => {
    const timer = window.setInterval(() => {
      setProjects((prev) => {
        if (!prev.some((p) => p.status === 'processing')) return prev
        return prev.map((p) => {
          if (p.status !== 'processing') return p
          const ceiling = sessionCreated.current.has(p.id) ? 100 : 96
          const next = Math.min(ceiling, (p.progress ?? 0) + Math.random() * 1.6)
          return next === p.progress ? p : { ...p, progress: Number(next.toFixed(1)) }
        })
      })
    }, 1800)
    return () => window.clearInterval(timer)
  }, [])

  const getProject = useCallback((id: string) => projects.find((p) => p.id === id), [projects])

  const createProject = useCallback((draft: ProjectDraft) => {
    const project = projectFromDraft(draft)
    sessionCreated.current.add(project.id)
    setProjects((prev) => [project, ...prev])
    return project
  }, [])

  const completeProject = useCallback((id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const seconds = p.workflows.reduce((total, wf) => {
          const [m, s] = wf.estimatedDuration.split(':').map(Number)
          return total + (m || 0) * 60 + (s || 0)
        }, 0)
        return {
          ...p,
          status: 'completed',
          progress: 100,
          currentStage: undefined,
          updatedAt: new Date().toISOString(),
          resolution: '1920 × 1080',
          videoDuration: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          summary: `ExplainerAI explored ${p.pagesExplored} pages of ${hostFromUrl(p.url)}, ranked ${p.workflows.length} workflows by explanatory value, and grounded every narration claim in a captured element.`,
        }
      }),
    )
  }, [])

  const duplicateProject = useCallback(
    (id: string) => {
      const source = projects.find((p) => p.id === id)
      if (!source) return undefined
      const copy: Project = {
        ...source,
        id: makeId(),
        name: `${source.name} (copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setProjects((prev) => [copy, ...prev])
      return copy
    },
    [projects],
  )

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const updateProject = useCallback((id: string, patch: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)))
  }, [])

  const resetDemo = useCallback(() => {
    sessionCreated.current.clear()
    setProjects(SEED_PROJECTS)
  }, [])

  const value = useMemo<ProjectsContextValue>(
    () => ({
      projects,
      templates: TEMPLATES,
      workspace: WORKSPACE,
      pipelineStages: PIPELINE_STAGES,
      getProject,
      createProject,
      completeProject,
      duplicateProject,
      deleteProject,
      updateProject,
      resetDemo,
    }),
    [projects, getProject, createProject, completeProject, duplicateProject, deleteProject, updateProject, resetDemo],
  )

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
}

export function useProjects() {
  const ctx = useContext(ProjectsContext)
  if (!ctx) throw new Error('useProjects must be used inside <ProjectsProvider>')
  return ctx
}
