# ExplainerAI

**Autonomous SaaS Understanding and Explainer Video Generation** — a high-fidelity, fully
interactive front-end prototype (Final Year Project).

ExplainerAI takes a SaaS product URL, autonomously explores the application, discovers
meaningful workflows, ranks them by explanatory value, writes an evidence-grounded
narration script, and composes an explainer video. This repository is the **product UI**:
every screen is real and interactive, and the backend is mocked in the browser.

---

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # type-check + production bundle into dist/
npm run preview  # serve the production build
npm run lint     # tsc --noEmit
```

Node 18+ required (developed on Node 22).

---

## Stack

| Concern    | Choice                                          |
| ---------- | ----------------------------------------------- |
| Framework  | React 18 + TypeScript (strict)                  |
| Build      | Vite 5                                          |
| Styling    | Tailwind CSS 3 with a custom `brand` / `ink` scale |
| Routing    | react-router-dom 6                              |
| Animation  | GSAP 3 + ScrollTrigger via `@gsap/react`        |
| Icons      | lucide-react                                    |

No component library — every primitive (button, menu, modal, tabs, toast, progress) is in
`src/components/ui` so the design language stays consistent and reviewable.

---

## Screens

| Route           | What it demonstrates                                                        |
| --------------- | --------------------------------------------------------------------------- |
| `/`             | Marketing landing: hero, value proposition, three feature pillars, pipeline  |
| `/dashboard`    | **Primary demo surface.** Metrics, filters, search, sort, grid/list views    |
| `/projects`     | Dense table view of the same projects, with search                          |
| `/new`          | URL-first creation flow, advanced settings, live 5-stage generation overlay  |
| `/project/:id`  | **Primary demo surface.** Overview / Workflows / Script / Video tabs         |
| `/templates`    | Six generation presets that deep-link into `/new?template=…`                |
| `/settings`     | Profile, generation defaults, exploration policy, plan usage, demo reset     |

### The two screens that carry the defence

**Dashboard** — animated metric tiles, sidebar filters driven by the URL (`?filter=`),
project cards with cursor-tracked tilt and spotlight, live progress on processing
projects, duplicate/delete with confirmation, and a designed empty state.

**Project Detail** —
- *Overview*: counted-up stats, ranked workflow preview, project metadata, and (for a
  processing project) the live pipeline step indicator.
- *Workflows*: ranked cards with score, tags, reach and step count. Opening one shows a
  step-by-step breakdown with screenshot placeholders, the exact DOM element each step
  targeted, and a metadata sidebar.
- *Script*: the narration with **grounded phrases highlighted**. Hovering a highlight
  reveals which captured element it is anchored to and the match confidence — this is the
  visual argument for "evidence-grounded".
- *Video*: custom player chrome over a plain `<video>`, render details, download/share.

---

## Architecture

```
src/
├─ components/
│  ├─ ui/            Button, Badge, Menu, Modal, ConfirmDialog, Tabs,
│  │                 Progress + StepIndicator, Field/Select/Chips, EmptyState, Toast
│  ├─ layout/        AppLayout (shell), Navbar, Sidebar
│  ├─ ProjectCard    WorkflowCard  WorkflowDetail  ScriptView  VideoPlayer  StatCard
├─ context/          ProjectsContext — the mocked backend
├─ data/             demo-scenarios.json — all seed data
├─ hooks/            useAnimations — the reusable GSAP layer
├─ lib/              gsap.ts (single registration point), utils.ts
└─ pages/            one file per route
```

### Mocked backend

`ProjectsContext` owns all state and exposes `createProject`, `completeProject`,
`duplicateProject`, `deleteProject`, `updateProject` and `resetDemo`. Creating a project
synthesises a ranked workflow set and a grounded script from the submitted URL and the
chosen focus areas, so `/new` lands on a fully populated project rather than a stub.
A background ticker advances processing projects so the dashboard feels live; seeded demo
projects deliberately stall at 96% so they never disappear mid-demo. **Reset demo data**
in the sidebar restores the original six projects.

### Animation layer

All motion lives in `src/hooks/useAnimations.ts` and is reused everywhere:

- `useReveal` — scroll reveals via `ScrollTrigger.batch`, so N elements share a few
  triggers and animate in staggered waves instead of one trigger each.
- `useCountUp` — tweens a proxy object and writes to `textContent`; a 60fps counter costs
  **zero** React re-renders.
- `useMagnetic` / `useTilt` — `gsap.quickTo` pre-compiles the setter, so `pointermove`
  stays allocation-free.
- `useEnter` — replays a stagger when a filtered list changes.
- `useParallax`, `useProgressBar` — scrubbed decorative layers and animated bars.

Every hook checks `prefers-reduced-motion` and falls back to the final state, and
pointer effects are skipped on coarse pointers. `@gsap/react`'s `useGSAP` scopes and
reverts each animation on unmount, so route changes never leak tweens.

---

## Suggested demo path

1. `/` — hero and value proposition.
2. **Create New Project** → paste `https://linear.app`, open advanced settings, pick a
   focus area, **Generate Demo** → watch the five pipeline stages, land on the project.
3. Open the **Workflows** tab → open the top-ranked workflow → step breakdown.
4. Open the **Script** tab → hover a highlighted phrase → show the evidence anchor and
   confidence. Change tone/language to re-narrate.
5. Open the **Video** tab.
6. Back to `/dashboard` → filter, search, duplicate, delete → show the empty state.

---

## Notes

- All data is mocked in the browser; there are no network calls except the sample MP4s
  used by the video player. Offline, the player falls back to a designed placeholder.
- State is in-memory: a full page reload restores the seeded demo data.
- Design language is inspired by contemporary SaaS dashboards; all branding, copy,
  product names and data in this repository are original to ExplainerAI.
