# Plan.md

Version: 0.2  
Owner: Ikon Eco  
Last updated: 2026-01-22  
Status: draft  
PRD: PRD.md  
Target release: MVP (date TBD)

## 0) Purpose

This plan describes how we will execute the PRD: milestones, sequencing, technical approach, verification, and rollout. It is optimized for autonomous agents to follow step by step.

### Success definition

- MVP shipped with all P0 user stories passing acceptance criteria.
- Repo is agent-runnable: install, dev, test, build are documented and work.
- Quality gates met: tests, lint, typecheck, accessibility baseline.

---

## 1) Project snapshot (from PRD)

### Product

- One-liner: A radically minimalist personal note app that makes capture and recall obvious and calm, with optional voice-to-text.
- Primary user: Single individual taking daily notes.
- Core loop: Open app -> capture note (type or voice) -> autosave -> recall via notes list layer or search.
- MVP scope:
  - Editor-first single-flow UI
  - Autosave local-first persistence
  - Notes list layer (progressive disclosure)
  - Search and recents
  - Voice-to-text with graceful fallback
  - Delete with undo

### Constraints

- Timeline: Lean MVP, solo vibe coder pace.
- Platform(s): Web app (responsive).
- Key risks:
  - Voice-to-text consistency across browsers
  - Local persistence reliability and migrations
  - Maintaining “invisible” UI while still having clear affordances

---

## 2) Execution strategy

### Delivery model

- Mode: Lean MVP
- Iteration cadence: Daily checkpoints, milestone demos when M0 to M3 exits are met.
- Change policy:
  - PRD changes require: update PRD.md, update Plan.md milestone impacts, update Tasks.md mappings, add decision log entry.
  - Scope creep rule: Anything not required to satisfy P0 stories is deferred to V1 or V2.

### Guiding principles

- Principle 1: Ship the core loop first (editor, autosave, open note, recall note).
- Principle 2: De-risk unknowns early (voice feasibility, storage layer).
- Principle 3: Keep surfaces minimal and states complete (empty, error, undo), no extra features.

---

## 3) Milestones and exit criteria

### M0: Repo operational (Exit: green local dev)

Goal: Agents can run the repo and tests.  
Exit criteria:

- `install` works
- `dev` runs
- `test` runs (sample test passing)
- `lint` and `typecheck` pass
- baseline UI renders (editor placeholder)

### M1: MVP core loop end-to-end

Goal: Primary flow works end-to-end for a user.  
Exit criteria:

- US-1, US-2, US-3 implemented (capture with independent titles, list sidebar, search, open note) ✅
- Autosave persistence works and survives refresh (both title and body) ✅
- Home / Welcome screen implemented for clear entry ✅
- Delete functionality works ✅
- Key edge cases handled (no notes, empty note behavior, no results) ✅
- Delete with undo works (Next Task) ⏳

### M2: Hardening (quality + reliability)

Goal: Improve robustness without expanding scope.  
Exit criteria:

- Voice-to-text integrated with graceful fallback and tested behavior
- Error states are recoverable and non-blocking
- A11y baseline met (keyboard nav, focus states, reduced motion respected)
- Perf checks acceptable (first load and search responsiveness)

### M3: Release readiness

Goal: Ready to ship to first users.  
Exit criteria:

- Build and deploy pipeline works
- Basic monitoring or error capture in place (lightweight)
- Rollout plan defined and executable
- Feedback loop ready

---

## 4) Roadmap (phased)

### Phase 0: Foundations

- Outcomes:
  - Next.js app scaffolded
  - MUI theme baseline
  - lint, typecheck, test harness
  - basic project structure and docs
- Must include:
  - CI checks (lint, typecheck, tests)
  - local storage abstraction skeleton

### Phase 1: MVP Build

- Outcomes:
  - Editor-first screen
  - notes persistence (IndexedDB)
  - notes list layer
  - search and recents
  - delete with undo
- Must include:
  - defined data model for Note (independent title and body)
  - reliable autosave strategy for multi-field documents
  - sorting by creation date for list stability

### Phase 2: Hardening

- Outcomes:
  - voice-to-text integration and fallback
  - full UI states (empty, loading minimal, error, success, undo)
  - a11y baseline and reduced motion
  - perf sanity checks
- Must include:
  - targeted tests for core behaviors
  - guardrails against logging note content

### Phase 3: Launch + Iterate

- Outcomes:
  - deploy (Vercel recommended)
  - lightweight error capture
  - feedback capture method
- Must include:
  - release notes
  - rollback plan

---

## 5) Sequencing and dependency logic

Explain why the order is what it is.

### Critical path

1) Repo scaffold and quality gates (M0)  
2) Local-first persistence and autosave (enables everything)  
3) Notes list layer and search (recall and navigation)  
4) Delete with undo (safety)  
5) Voice-to-text (de-risk after core loop is stable, but before hardening completes)  
6) A11y and polish (hardening)  
7) Deploy and feedback loop (release)

### Dependencies

- External:
  - Browser voice recognition capability (feature must degrade gracefully).
- Internal:
  - Storage layer must exist before list and search can be reliable.
- Decisions required before implementation:
  - Storage mechanism: IndexedDB (recommended) vs localStorage (fallback only)
  - Delete behavior: undo window vs trash (default: undo toast window)

### Parallelizable work

- Work that can be done in parallel safely:
  - Theme tokens and component scaffolding while storage layer is built
  - E2E test scaffolding while UI routes and selectors stabilize

---

## 6) Technical approach (implementation outline)

This section is the how at a high level. Detailed design belongs in Design.md.

### Architecture sketch

- Runtime(s): Web app
- Components:
  - UI: Next.js + React + MUI
  - Data: IndexedDB (via a thin wrapper library or minimal hand-rolled wrapper)
  - Background jobs: none in MVP
- Boundaries:
  - UI layer: components and screens (Home, Editor, NotesList)
  - Domain layer: note model, autosave behavior, search filtering
  - Infra layer: storage adapter, speech adapter (TBD)

### Data and state strategy

- Source of truth: IndexedDB for notes
- Caching strategy:
  - in-memory cache of notes list for fast filtering
  - write-through autosave to storage with debounce
- Offline/degraded mode:
  - works fully offline (local-first)
  - voice-to-text may be unavailable depending on browser, fallback to typing

### API strategy

- API style: none for MVP (no server)
- Validation: lightweight runtime validation at storage boundaries
- Error shape: normalize storage and voice errors into a small set of user-safe messages
- Pagination: none required at MVP note counts, use virtualization if list grows

### Security baseline

- Auth: none
- Authorization: none
- Data handling:
  - treat note text as sensitive
  - do not log note contents
  - avoid sending note text anywhere in MVP

---

## 7) Quality plan (verification + testing)

### Test strategy

- Unit tests:
  - domain logic: autosave debounce behavior, search filtering, title derivation
- Integration tests:
  - storage adapter CRUD for Note
  - delete and undo state transitions
- E2E tests:
  - happy path: create note -> autosave -> list -> search -> open -> delete -> undo
  - voice fallback path: voice unavailable or denied -> user continues typing
- Manual QA checklist:
  - keyboard navigation, focus visible
  - reduced motion respected
  - empty states look calm and clear
  - no UI clutter appears over time

### Acceptance mapping

- PRD US-1 -> unit: autosave logic -> e2e: create and persist after refresh
- PRD US-2 -> e2e: open list layer, select note -> manual: progressive disclosure feels minimal
- PRD US-3 -> unit: filter correctness -> e2e: search and open result quickly
- PRD US-4 -> integration: speech adapter fallback -> manual: permission denied message is calm
- PRD US-5 -> integration: delete and undo -> e2e: delete then undo restores

### Performance and accessibility

- Performance budgets:
  - first load under 2 seconds on typical modern laptop and broadband
  - search results update feels instant for up to 1,000 notes
- A11y baseline:
  - keyboard navigation for all actions
  - focus states visible
  - reduced motion supported
- How we verify:
  - Lighthouse (perf)
  - axe checks (optional, lightweight)
  - manual keyboard and screen reader spot checks

---

## 8) Risk management and de-risking

### Risk register (top)

| Risk | Impact | Likelihood | Early signal | Mitigation | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Voice-to-text inconsistent across browsers | M | H | Errors or poor transcription | Make voice optional, degrade gracefully, test one primary browser first | PM/Eng |
| IndexedDB complexity and migration issues | M | M | CRUD bugs, data loss reports | Keep schema tiny, add versioned migrations, add export later | Eng |
| UI drifts into clutter | H | M | More controls added to primary surface | Enforce single-flow, progressive disclosure, design Do Not list | PM/Design |
| Performance jank with large note lists | M | M | Scroll or filter lag | Virtualize list, in-memory cache, keep filtering simple | Eng |

### Spikes / prototypes

- Spike: Voice-to-text feasibility
  - Goal: confirm start/stop dictation, permission flows, inline insertion
  - Timebox: 1 day
  - Output: minimal prototype or adapter with fallback behavior
  - Success criteria: reliable behavior in at least one target browser, graceful errors elsewhere

- Spike: Storage adapter baseline
  - Goal: confirm IndexedDB CRUD, schema versioning strategy
  - Timebox: 0.5 to 1 day
  - Output: storage module with tests
  - Success criteria: passes integration tests, survives refresh and restart

---

## 9) Rollout plan

### Environments

- Dev: local
- Staging: Vercel preview deploys
- Prod: Vercel production deploy

### Release strategy

- Open beta for a small set of users (friends), no accounts
- Rollback strategy:
  - revert to last known good commit and redeploy
  - keep releases small and frequent

### Monitoring

- Errors: lightweight error capture (optional initially, can add Sentry later)
- Key dashboards: none required for MVP
- Alerts: basic error spike alert if monitoring is added

### Feedback loop

- Feedback collection: simple link to a form or email
- Triage process: weekly review, classify as bug vs V1 request vs V2

---

## 10) Agent execution protocol

This makes the plan runnable by autonomous agents.

### How agents should use docs

- Source of truth:
  - Requirements: PRD.md
  - Approach and sequencing: Plan.md
  - Work items: Tasks.md
  - UX and visual spec: Design.md
  - Repo rules: AGENTS.md

### Checkpoint cadence

- After each task:
  - update task status in Tasks.md
  - run relevant verification (tests, lint, typecheck)
  - update notes in decision log if scope changes are proposed
- After each milestone:
  - run milestone demo checklist
  - confirm exit criteria met
  - update Plan.md milestone status line (optional)

### Change control

- If a task reveals a missing requirement:
  1) propose update to PRD.md (smallest change)
  2) add a decision log entry
  3) update Plan.md impacts and Tasks.md mapping
  4) proceed only after change is documented

---

## 11) Change log

- 2026-01-21: Initial Plan.md created for minimalist notes MVP with local-first storage and voice-to-text. (Ikon Eco)
- 2026-01-22: M0 EXIT criteria confirmed. Phase 1 Core Loop well underway. Architected independent title/body autosave and Home welcome state. (Antigravity Assistant)
