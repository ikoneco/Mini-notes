# Tasks.md

Version: 0.1  
Owner: Ikon Eco  
Last updated: 2026-01-21  
Status: draft  
PRD: PRD.md  
Plan: Plan.md  

## 0) Purpose

This file is the agent-executable backlog. It breaks the PRD into phases, epics, tasks, and subtasks with user stories, acceptance criteria, dependencies, and verification steps.

### How to use (agent workflow)

- Work top to bottom, phase by phase.
- Do one task at a time.
- For each task:
  - restate goal
  - identify files touched
  - implement minimal changes
  - run verification
  - update status

---

## 1) Global definitions

### Status codes

- `[ ]` Not started
- `[-]` In progress
- `[x]` Done
- `[!]` Blocked
- `[~]` Deferred

### Priority

- `P0` Must ship for MVP
- `P1` Important for V1
- `P2` Nice-to-have

### Verification types

- `UNIT`: unit tests
- `INT`: integration tests
- `E2E`: end-to-end tests
- `MANUAL`: human checklist
- `PERF`: performance checks
- `A11Y`: accessibility checks

---

## 2) Acceptance mapping (traceability)

Map PRD stories and requirements to epics and tasks. Keep this updated.

| PRD item | Epic | Task IDs | Notes |
| :------- | :--- | :------- | :---- |
| US-1 / FR-1 (autosave) | E2 | T2.2, T2.3, T2.4 | Core loop foundation |
| US-2 / FR-2 (notes list layer) | E3 | T3.1, T3.2 | Progressive disclosure |
| US-3 / FR-3 (search/recall) | E4 | T4.1, T4.2 | Instant recall |
| US-5 / FR-5 (delete + undo) | E5 | T5.1, T5.2 | Safety and recoverability |
| US-4 / FR-4 (voice-to-text) | E7 | T7.1, T7.2, T7.3 | Hardening phase |
| NFRs (perf, a11y, reliability) | E8 | T8.1, T8.2, T8.3 | Hardening phase |
| GSAP Animations | E10 | T10.1, T10.2, T10.3 | UX Polish |
| Release readiness | E9 | T9.1, T9.2, T9.3 | Deploy and feedback |

---

## 3) Phase plan (ordered)

Phases align to Plan.md milestones.

- Phase 0: Foundations (M0)
- Phase 1: MVP Core Loop (M1)
- Phase 2: Hardening (M2)
- Phase 3: Release readiness (M3)
- Phase 4: V1 Extensions (Optional)
- Phase 5: V2 Concepts (Deferred)

---

## PHASE 0: Foundations (M0)

Goal: Repo is runnable and green for agents.

## E0: Repo scaffolding and tooling

### T0.1 (P0) Initialize Next.js + TypeScript app skeleton

- [x] Task: Scaffold Next.js app with TypeScript and basic routing
- PRD refs: N/A
- Dependencies: none
- Implementation notes:
  - Use a simple single route `/` for editor
  - Create `src/` structure and placeholder components
- Outputs:
  - App runs locally and renders placeholder editor screen
- Verification:
  - MANUAL: app runs at localhost
  - COMMANDS:
    - `pnpm dev`

#### Subtasks

- [x] T0.1a Scaffold app and confirm build works
- [x] T0.1b Create basic folder structure: `src/app` or `src/pages`, `src/components`, `src/lib`
- [x] T0.1c Add minimal README with run steps

### T0.2 (P0) Add MUI and theme baseline

- [x] Task: Install and configure MUI with a minimal Notion-like theme baseline
- PRD refs: Design.md tokens and components
- Dependencies: T0.1
- Outputs:
  - Theme provider wired
  - Basic typography and spacing applied
- Verification:
  - MANUAL: placeholder UI renders with theme applied
  - COMMANDS:
    - `pnpm dev`

### T0.3 (P0) Lint, format, typecheck

- [x] Task: Add ESLint, formatting, and strict typecheck config
- Dependencies: T0.1
- Outputs:
  - `lint` and `typecheck` commands work
- Verification:
  - COMMANDS:
    - `pnpm lint`
    - `pnpm typecheck`

### T0.4 (P0) Baseline test harness

- [x] Task: Add unit test runner and a sample test
- Dependencies: T0.1
- Outputs:
  - `test` command works in CI and locally
- Verification:
  - UNIT:
    - `pnpm test` (20 tests passing)

### T0.5 (P0) CI checks

- [ ] Task: Set up CI pipeline to run lint, typecheck, tests on PRs
- Dependencies: T0.3, T0.4
- Outputs:
  - CI passes on main branch
- Verification:
  - MANUAL: open PR and confirm checks run and pass

---

## PHASE 1: MVP Core Loop (M1)

Goal: Primary user flow works end to end with P0 stories.

## E1: UI shell and editor-first layout

### T1.1 (P0) Implement Main Editor screen scaffold

- [x] Task: Create the editor-first screen with minimal affordances (notes list trigger, voice trigger placeholder, save status placeholder)
- PRD refs: US-1, US-2; Design.md Screen: Main Editor
- Dependencies: Phase 0 complete
- Acceptance criteria:
  - Given the app loads, when it opens, then the last note is loaded or home screen is shown
  - Given the UI renders, then secondary affordances are present but minimal
- Verification:
  - MANUAL: primary surface is editor, minimal chrome
  - A11Y: keyboard focus enters editor on load

#### T1.1 Subtasks

- [x] T1.1a Implement `Editor` component with placeholder and focus-on-load
- [x] T1.1b Add minimal header icons or links: Home, New Note
- [x] T1.1c Add `SaveStatus` behavior: saved, saving, error

## E2: Data model and persistence

### T2.1 (P0) Define Note model and independent fields

- [x] Task: Create Note type and independent fields (title, body)
- PRD refs: Data model section; FR-1
- Dependencies: T1.1
- Acceptance criteria:
  - Note includes id, title, body, createdAt, updatedAt, inputMode
  - Title and Body are independent editable fields
- Verification:
  - UNIT: Note model defined in types.ts

#### T2.1 Subtasks

- [x] T2.1a Define `Note` type and `InputMode` enum
- [x] T2.1b Implement `deriveTitle` (deprecated in favor of explicit titles)
- [x] T2.1c Add unit tests for domain helpers

### T2.2 (P0) Implement storage adapter (IndexedDB)

- [x] Task: Implement CRUD storage adapter for notes with versioned schema
- PRD refs: FR-1, FR-2, FR-5; NFR reliability
- Dependencies: T2.1
- Acceptance criteria:
  - Create, read, update, delete, list notes works
  - Data persists across refresh
- Verification:
  - INT: storage CRUD tests (13 tests, all passing)
  - MANUAL: create note, refresh, note remains
- Implementation notes:
  - Created `src/lib/infra/notesStore.ts` with IndexedDB wrapper
  - Schema version: 1 with indexes on updatedAt and createdAt
  - Added `fake-indexeddb` for testing
  - Fixed jest.config.mjs for TypeScript support

#### T2.2 Subtasks

- [x] T2.2a Create `storage/notesStore` module with versioning
- [x] T2.2b Implement `createOrUpdateNote`, `getNote`, `listNotes`, `deleteNote`
- [x] T2.2c Add integration tests for CRUD

### T2.3 (P0) Wire autosave from editor to persistence

- [x] Task: Implement autosave with debounce and non-blocking error handling
- PRD refs: US-1, FR-1
- Dependencies: T2.2
- Acceptance criteria:
  - Given typing stops, when 1 second passes, then note is saved
  - Given save fails, then typing continues and a gentle status appears
- Verification:
  - UNIT: debounce behavior test verified in useAutosave hooks
  - MANUAL: type, refresh, content persists (title and body)

#### T2.3 Subtasks

- [x] T2.3a Implement autosave controller hook (debounce, lastSavedAt)
- [x] T2.3b Add `SaveStatus` behavior: saved, saving, error
- [x] T2.3c Ensure no note is created for empty content until meaningful input exists

### T2.4 (P0) Load and continue last note

- [x] Task: On app open, load most recent note or start on Home
- PRD refs: Primary flow steps; US-1
- Dependencies: T2.2
- Acceptance criteria:
  - Given existing notes, when app opens, then last updated note loads
  - Given no notes, when app opens, then Home screen is shown
- Verification:
  - MANUAL: confirm behavior with and without notes

## E3: Notes list layer (progressive disclosure)

### T3.1 (P0) Implement Notes List Sidebar

- [x] Task: Build notes list as a persistent sidebar for rapid browsing
- PRD refs: US-2, FR-2; Design.md Notes List Layer
- Dependencies: T2.4
- Acceptance criteria:
  - Given user is in editor, then sidebar remains visible (collapsible)
  - Given a note is selected from the list, then note loads into editor instantly

#### Verification steps

- E2E: delete note from list
- INT: delete storage path works

#### T3.1 Subtasks

- [x] T3.1a Create `NotesListLayer` component and integrated sidebar
- [x] T3.1b Render notes with NoteRow components (emoji, title, date)
- [x] T3.1c Ensure stable list behavior when switching notes

### T3.2 (P0) Notes list ordering by Creation Date

- [x] Task: Show stable ordering based on creation date
- PRD refs: US-2; Design.md
- Dependencies: T3.1
- Acceptance criteria:
  - Notes ordered by createdAt descending (newest first)
- Verification:
  - MANUAL: editing a note does not jump its position in the list

## E4: Search and recall

### T4.1 (P0) Implement search filter for notes list

- [x] Task: Add search input that filters notes instantly
- PRD refs: US-3, FR-3
- Dependencies: T3.1, T2.2
- Acceptance criteria:
  - Given query changes, when user types, then list updates immediately
  - Given no results, then calm empty state appears
- Verification:
  - MANUAL: search finds and opens note

#### T4.1 Subtasks

- [x] T4.1a Add `SearchInput` to list layer
- [x] T4.1b Implement in-memory filtering (title + body contains)
- [x] T4.1c Add “No results” state

### T4.2 (P0) Keyboard shortcuts for recall (optional but small)

- [ ] Task: Add minimal keyboard affordance to open notes search
- PRD refs: UX principles; Design.md optional shortcut
- Dependencies: T4.1
- Acceptance criteria:
  - Given user presses Cmd/Ctrl+K, when in app, then list opens and focus goes to search
- Verification:
  - MANUAL: shortcut works

## E5: Delete with undo

### T5.1 (P0) Add delete action in notes list

- [x] Task: Implement delete action with minimal affordance and immediate UI update
- PRD refs: US-5, FR-5; Design.md Delete flow
- Dependencies: T3.1, T2.2
- Acceptance criteria:
  - Given a note exists, when deleted, then it disappears from list
  - Given current note deleted, then app navigates to Home view
- Verification:
  - E2E: delete note from list
  - INT: delete storage path works

### T5.2 (P0) Implement undo toast and restore

- [x] Task: Add undo toast that restores deleted note within timeout
  - PRD refs: US-5; Experience principles recoverable
  - Dependencies: T5.1
  - Acceptance criteria:
    - Given deletion occurred, when Undo clicked, then note is restored fully
    - Given timeout passes, then undo option disappears
  - Verification:
    - E2E: delete then undo restores
    - MANUAL: toast is calm and non-intrusive
  - Implementation notes:
    - Created `UndoToast` component with auto-dismiss (5s timeout)
    - Integrated with `app/page.tsx` to show toast on deletion
    - Delete stores note in state for undo restoration
    - Undo restores note via `createOrUpdateNote` and loads into editor if on Home

---

## PHASE 2: Hardening (M2)

Goal: Raise quality without expanding product scope.

## E6: Complete UI states and resilience

### T6.1 (P0) Home states and guidance

- [x] Task: Implement Home welcome screen per Design.md
- PRD refs: FR-2, flows; Design.md microcopy
- Dependencies: Phase 1 complete
- Verification:
  - MANUAL: Home screen shows clear instruction and CTA when no note is selected
- Implementation notes:
  - Added `view` state to `app/page.tsx` ('home' | 'editor')
  - Created minimalist Home view with centered CTA
  - Breadcrumbs allow jumping back to Home

### T6.2 (P0) Non-blocking error handling

- [ ] Task: Standardize error handling for storage and UI status
- PRD refs: NFR reliability; Design.md error principles
- Dependencies: T2.3
- Acceptance criteria:
  - Errors do not block typing
  - No raw errors shown to users
- Verification:
  - INT: simulate storage failure
  - MANUAL: error UI is gentle and actionable

## E7: Voice-to-text (MVP requirement, implemented in hardening)

### T7.1 (P0) Implement speech adapter and permission flow

- [x] Task: Add voice-to-text adapter and permission handling with graceful fallback
- PRD refs: US-4, FR-4; Plan risk register
- Dependencies: Phase 1 core stable
- Acceptance criteria:
  - Given voice supported and permission granted, dictation inserts text
  - Given denied or unsupported, app shows calm message and continues typing
- Verification:
  - MANUAL: try permission denied scenario
- Implementation notes:
  - Created `useVoiceCapture` hook using Web Speech API
  - Handles `isSupported` and `isListening` states
  - Gracefully ignores if unsupported

### T7.2 (P0) Voice UI states

- [x] Task: Add minimal voice affordance states (idle, active, unavailable)
- PRD refs: FR-4; Design.md Voice Trigger
- Dependencies: T7.1
- Verification:
  - MANUAL: voice active state is subtle, reduced motion respected
- Implementation notes:
  - Added Mic button to top bar
  - Pulse animation when active
  - Tooltips for guidance

### T7.3 (P0) Autosave integration with voice input

- [x] Task: Ensure voice insert triggers autosave reliably
- PRD refs: US-1, US-4; FR-1, FR-4
- Dependencies: T7.1, T2.3
- Verification:
  - MANUAL: dictate text, refresh, content persists
- Implementation notes:
  - Voice results appended to body via functional setter
  - Triggers the existing autosave logic in `useAutosave`

## E8: Quality, a11y, and perf

### T8.1 (P0) A11y baseline pass

- [ ] Task: Keyboard navigation, focus states, dialog semantics, reduced motion support
- PRD refs: NFR accessibility; Design.md a11y baseline
- Dependencies: Phase 1 complete
- Verification:
  - A11Y: manual keyboard checklist
  - MANUAL: focus visible, Esc closes layer, tab order sane

### T8.2 (P0) E2E coverage for primary flows

- [ ] Task: Add E2E tests for create, recall, search, delete undo, voice fallback
- PRD refs: US-1 to US-5
- Dependencies: T7.1, core flows complete
- Verification:
  - E2E: `pnpm test:e2e` (or equivalent) passes

### T8.3 (P0) Perf sanity checks and list scaling

- [ ] Task: Ensure search and list remain responsive at 1,000 notes, add virtualization if needed
- PRD refs: NFR performance
- Dependencies: T4.1
- Verification:
  - PERF: manual check with seeded notes
  - MANUAL: no obvious jank scrolling or searching

## E10: GSAP Animations

### T10.1 (P1) Sidebar Morph & Slide

- [x] Task: Animate sidebar opening/closing and stagger note row entries
- Acceptance criteria:
  - Sidebar slides in/out smoothly
  - Note list items stagger in when sidebar opens or search results change
- Verification: MANUAL
- Implementation notes:
  - GSAP used for sidebar width transition in `app/page.tsx`
  - Staggered entry for `NoteRow` in `NotesListLayer.tsx`

### T10.2 (P1) View Switching (Home ⟷ Editor)

- [x] Task: Cross-fade and vertical lift transitions between Home and Editor
- Acceptance criteria:
  - Subtle 300ms transition between views
  - No jarring layout jumps
- Verification: MANUAL
- Implementation notes:
  - View container animates in with opacity and y-slide on view change

### T10.3 (P1) Undo Toast & Status Indicators

- [x] Task: Add springy animations to UndoToast and subtle pulse to "Saved" status
- Acceptance criteria:
  - Toast enters with an elastic pop
  - "Saved" indicator pulses briefly when save completes
- Verification: MANUAL
- Implementation notes:
  - Elastic entrance for `UndoToast`
  - Subtle pulse and scale-back for "Saved" icon/text in `SaveStatus`

---

## PHASE 3: Release readiness (M3)

Goal: Deployable, observable, supportable.

## E9: Deploy, monitoring, feedback, and runbook

### T9.1 (P0) Production build and deploy (Vercel)

- [ ] Task: Configure build and deploy pipeline for production
- PRD refs: Rollout plan
- Dependencies: M2 complete
- Verification:
  - MANUAL: production build succeeds and site loads

### T9.2 (P0) Basic error capture (optional lightweight)

- [ ] Task: Add minimal error capture for client errors without note contents
- PRD refs: NFR privacy; observability
- Dependencies: T6.2
- Verification:
  - MANUAL: simulated error captured with no sensitive payload

### T9.3 (P1) Feedback link

- [ ] Task: Add a simple feedback link (mailto or form) in notes list layer or minimal settings
- PRD refs: Rollout plan
- Dependencies: T9.1
- Verification:
  - MANUAL: feedback opens correct destination

### T9.4 (P0) Rollback plan and release notes

- [ ] Task: Document rollback steps and release checklist
- PRD refs: Rollout plan; Plan.md M3
- Dependencies: T9.1
- Verification:
  - MANUAL: runbook exists and is clear

---

## PHASE 4: V1 Extensions (Optional)

Only start after MVP is stable and shipped.

## E10: V1 quality of life

### T10.1 (P1) Export notes (text or markdown)

- [~] Task: Export notes locally without accounts
- Dependencies: MVP shipped
- Verification:
  - MANUAL: export file downloads and contains expected content

### T10.2 (P2) Settings screen (minimal)

- [~] Task: Basic preferences (theme toggle, font size)
- Dependencies: MVP shipped
- Verification:
  - MANUAL: settings persist locally

---

## PHASE 5: V2 Concepts (Deferred)

Do not start without explicit PRD update.

## E11: V2 LLM meaning companion panel

### T11.1 (P2) V2 spike: prompt design and UX safety

- [~] Task: Define prompts and UI behavior for a calm, non-annoying reflective panel
- Dependencies: explicit PRD V2 approval
- Verification:
  - MANUAL: panel is optional, collapsible, not interruptive

### T11.2 (P2) LLM integration and privacy controls

- [~] Task: Integrate LLM with strict privacy constraints and opt-in
- Dependencies: T11.1, explicit infra decisions
- Verification:
  - MANUAL: no note text logged, user consent required

---

## 4) Global verification checklist (Definition of Done)

A task is done only if:

- Acceptance criteria met and verified
- Tests added or updated for new logic
- No lint or typecheck errors
- UI states handled where relevant (empty, error, undo)
- Docs updated if behavior changed
- No scope creep beyond task definition

---

## 5) Notes and decision log

   2026-01-21: MVP scope is editor-first, local-first, notes list layer, search, delete with undo, voice-to-text with fallback. (Ikon Eco)

- 2026-01-21: LLM meaning companion panel is V2 and deferred. (Ikon Eco)

---

## 6) Change log

- 2026-01-21: Initial Tasks.md created with phase alignment to Plan.md and traceability to PRD.md. (Ikon Eco)
- 2026-01-22: T5.2 completed - Undo Toast implemented with auto-dismiss, note restoration, and graceful error handling. Fixed hydration error by adding 'use client' directive. (Cline Agent)
