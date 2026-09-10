export type ProjectStatus = 'completed' | 'processing'

export type Accent = 'indigo' | 'emerald' | 'sky' | 'violet' | 'amber' | 'rose'

export interface WorkflowStep {
  n: number
  action: string
  element: string
  evidence: string
  duration: string
}

export interface Workflow {
  id: string
  title: string
  description: string
  tags: string[]
  score: number
  featureCoverage: string
  estimatedDuration: string
  reach: string
  steps: WorkflowStep[]
}

export interface ScriptAnchor {
  label: string
  source: string
  confidence: number
  workflowId: string
  step: number
}

export interface ScriptPart {
  text: string
  anchor?: ScriptAnchor
}

export interface ScriptParagraph {
  id: string
  parts: ScriptPart[]
}

export interface NarrationScript {
  tone: string
  language: string
  wordCount: number
  paragraphs: ScriptParagraph[]
}

export interface Project {
  id: string
  name: string
  url: string
  tagline: string
  status: ProjectStatus
  accent: Accent
  initials: string
  createdAt: string
  updatedAt: string
  videoDuration: string
  workflowsCount: number
  pagesExplored: number
  evidenceAnchors: number
  resolution: string
  audience: string
  focusAreas: string[]
  summary: string
  videoUrl: string | null
  workflows: Workflow[]
  script: NarrationScript | null
  /** Present only while status === 'processing'. */
  progress?: number
  currentStage?: string
}

export interface Template {
  id: string
  name: string
  description: string
  duration: string
  audience: string
  focusAreas: string[]
  accent: Accent
  popularity: number
}

export interface PipelineStage {
  id: string
  label: string
  detail: string
}

export interface Workspace {
  name: string
  plan: string
  user: { name: string; email: string; role: string; initials: string }
  stats: {
    minutesRendered: number
    evidenceAnchors: number
    avgGroundingScore: number
    hoursSaved: number
  }
}

export interface ProjectDraft {
  url: string
  audience: string
  videoLength: string
  focusAreas: string[]
  templateId?: string
}
