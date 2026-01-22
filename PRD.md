# PRD.md

Version: 0.1  
Owner: Ikon Eco  
Last updated: 2026-01-21  
Status: draft  
Target release: MVP (date TBD)

## 0) Executive summary

### One-liner

A radically minimalist, Apple-inspired personal note app that makes capture and recall feel obvious, fast, and nearly invisible, with optional voice-to-text input.

### Why now

Most note apps drift toward organizational complexity and UI chrome. The opportunity is a calm, single-user tool that stays out of the way while still making recall effortless, and supports modern input (typing and voice) without added setup.

### Success definition (MVP)

- Users can create a note in under 10 seconds from opening the app (typing or voice).
- Users can find and open a prior note in under 5 seconds using recents or search.
- App feels “invisible”: no mandatory organization, no clutter, and a calm Home surface for entry.

---

## 1) Problem and context

### Problem statement

Individuals want a daily note space that is frictionless to capture thoughts and fast to retrieve later, but most tools add clutter, heavy structure, or distracting UI that pulls focus away from the primary action.

### Current alternatives

- Notion: powerful, but too much structure and surface area for quick daily capture.
- Apple Notes / Google Keep: fast capture, but limited minimalist craft and lacks the “calm utility” posture with progressive disclosure.
- Do nothing: notes end up scattered across apps, messages, and scraps, making recall unreliable.

### Key insights

- The core value is speed plus calmness: fewer choices, fewer surfaces, more doing.
- “Mind-reading” in MVP should be lightweight and non-annoying: default to the right thing (recents, instant save, instant recall) rather than heavy AI.

---

## 2) Users and jobs-to-be-done

### Primary user

- Persona: an individual who takes notes daily (work, life, ideas) and wants a calm tool that disappears.
- Context of use: quick capture during activity, later recall when needed.
- JTBD: When I have something to capture or remember, I want to write or speak it instantly, so I can move on and still find it later.
- Top frustrations:
  - Too many features and UI chrome.
  - Having to choose folders, tags, or formats up front.
  - Slow recall (search that is not instant, recents not useful).
- Accessibility needs:
  - Keyboard-first usability.
  - Clear focus states.
  - Reduced-motion support.

### Secondary users (if any)

- None for MVP.

### Non-users / excluded users

- Teams and collaborators (no sharing, no multi-user features in MVP).
- Power users needing complex formatting or databases.

---

## 3) Scope framing

### In scope (MVP)

- Fast note capture: type or voice-to-text into a single primary input area.
- Automatic save with clear, subtle feedback (no explicit Save button).
- Simple access to all notes via a progressive disclosure model (a clean notes list layer).
- Fast recall via recents plus search.
- Minimal editing, delete, and basic undo or recovery.

### Out of scope (explicit non-goals)

- Collaboration, sharing, comments.
- Accounts, sync across devices, cloud storage.
- Complex formatting (tables, databases, rich blocks).
- Tags, folders, and heavy organization systems.
- AI meaning-making side panel (V2).

### Assumptions

- Web app MVP (desktop-first, responsive for mobile).
- Local-first storage (works offline, persists locally).
- Voice input uses browser capabilities; if unavailable, the app gracefully falls back to typing.

### Open questions

- Should delete be reversible (trash) or immediate with a short undo toast?
- What is the maximum note count we should optimize for in MVP (assume 1,000)?

---

## 4) Experience principles (AI-native UX contract)

- Fast to first value: open app and capture immediately.
- Progressive disclosure: the primary screen is writing; everything else is optional and secondary.
- Always recoverable: destructive actions should have undo or confirmation.
- Invisible affordances, not hidden: minimal but explicit cues (links, subtle icons, gentle highlights).
- Purposeful motion only: animation supports comprehension, never decoration.

---

## 5) User journey and core flows

### “Magic moment”

The user captures a thought (typed or spoken) with zero friction, sees it saved instantly, and later retrieves it in seconds without remembering where they put it.

### Entry points

- Direct app open to primary capture screen.
- Returning session resumes last context and recent notes.

### Primary end-to-end flow (numbered)

1) User opens the app (lands on Home welcome screen if no active note).
2) User clicks "New Note" or selects a recent note from the sidebar.
3) User types or taps a minimal voice affordance to dictate.
4) Note saves automatically as content changes (title and body are independent).
5) User later reveals the notes list (sidebar) or uses search.
6) User opens a note, continues editing, or returns to Home.

### Secondary flows (if any)

#### Flow: Delete and recovery

1) User selects a note in list or within editor.
2) User deletes.
3) App shows an undo option (or moves note to Trash if we choose that pattern).

#### Flow: Voice permissions and fallback

1) User taps voice affordance.
2) Browser requests microphone permission.
3) If denied or unsupported, app shows a gentle message and continues with typing.

### Key decision points / forks

- Fork A: typing vs voice input.
- Fork B: recents browsing vs search.

### State model (user-facing)

- Object: Note
  - States: active (default), deleted (if we implement trash) or removed (if immediate delete)
  - Transitions:
    - active -> deleted when user deletes
    - deleted -> active when user restores (if trash exists)

---

## 6) Information architecture and screens

### Navigation model

Single-flow with progressive disclosure.

### Screen list (MVP)

- Screen: Home / Welcome
  - Purpose: provide a calm entry point and clear CTA for new notes
  - Primary CTA: "Create your first note" / "New Note"
  - Key modules: short instruction, primary action button
- Screen: Main Editor
  - Purpose: capture and edit notes immediately
  - Primary CTA: implicit (start writing)
  - Key modules: Large Emoji Header, Editable Title, Editor Body, subtle save indicator
- Screen: Notes List Sidebar (supportive)
  - Purpose: browse all notes quickly with minimal clutter
  - Primary CTA: open a note
  - Key modules: search input, "+" New Note button, recents list (sorted by creation date)
- Optional Screen: Settings (supportive, can be deferred)
  - Purpose: basic preferences (reduced motion, export later)
  - Primary CTA: none required for MVP

### Content hierarchy (home/default screen)

- Primary: editor input
- Secondary: minimal affordances (open list, voice)
- Tertiary: subtle status (saved, errors)

---

## 7) Functional requirements (testable)

### FR-1: Instant note capture and autosave

- Description: Users can type a note and it saves automatically without an explicit save action.
- Acceptance criteria:
  - Given the editor is open, when the user types in either the title or body, then the content is persisted automatically within 1 second of stopping input.
  - Given the user refreshes the page, when the app reloads, then the last saved note is loaded.
- Edge cases:
  - Empty note -> do not create a new note entry, or keep as draft without cluttering list.
  - Very long note -> editing remains responsive and saving remains reliable.

### FR-2: Progressive notes list access

- Description: Users can access all notes without cluttering the main editor.
- Acceptance criteria:
  - Given the user is in the editor, when the user triggers the notes list affordance, then a clean list layer appears without navigating away.
  - Given a note is selected from the list, when opened, then it loads into the editor.
- Edge cases:
  - No notes -> show the Home screen with a prompt to start writing.

### FR-3: Fast search and recall

- Description: Users can search notes and open results quickly.
- Acceptance criteria:
  - Given the user enters a query, when they type, then results update within 200ms for up to 1,000 notes (typical laptop).
  - Given a result is selected, when opened, then it loads in the editor.
- Edge cases:
  - No matches -> show “No results” with a gentle suggestion (clear query).

### FR-4: Voice-to-text input

- Description: Users can dictate and see text appear in the note.
- Acceptance criteria:
  - Given voice is supported and permission granted, when the user starts dictation, then transcribed text appears in the editor.
  - Given dictation is stopped, when transcription completes, then the note is saved like typed content.
- Edge cases:
  - Permission denied or unsupported -> show a gentle message and continue with typing; no broken states.

### FR-5: Delete with recovery

- Description: Users can delete notes without fear.
- Acceptance criteria:
  - Given a note exists, when the user deletes it, then it is removed from the active list.
  - Given deletion occurred, when the user chooses undo within a short window, then the note is restored.
- Edge cases:
  - Accidental delete -> undo is discoverable and reliable.

---

## 8) User stories (MVP first)

### US-1: Capture a note instantly

- Priority: P0
- Acceptance criteria:
  - Given I open the app, when I start typing, then my note saves automatically.
  - Given I leave and return, when I reopen, then my note is still there.

### US-2: Browse all notes without clutter

- Priority: P0
- Acceptance criteria:
  - Given I am writing, when I reveal the notes list, then I can see recent notes and all notes cleanly.
  - Given I pick a note, when I open it, then it appears in the editor fast.

### US-3: Find a note fast

- Priority: P0
- Acceptance criteria:
  - Given I have many notes, when I search, then results update instantly and I can open one.

### US-4: Dictate instead of typing

- Priority: P0
- Acceptance criteria:
  - Given I choose voice input, when I speak, then text appears in my note.
  - Given voice is unavailable, when I try, then the app falls back gracefully.

### US-5: Delete safely

- Priority: P0
- Acceptance criteria:
  - Given I delete a note, when I change my mind immediately, then I can undo.

---

## 9) Non-functional requirements (NFRs)

### Performance

- First load: under 2 seconds on a typical broadband connection and modern laptop.
- Search: results update within 200ms for up to 1,000 notes.
- Editor: typing should feel instant with no obvious jank.

### Reliability

- Local persistence is the default; data should survive refresh and browser restarts.
- Autosave should be resilient to rapid input and interruptions.

### Security & privacy

- Data classification: personal content, treat as sensitive.
- Authentication: none in MVP.
- Authorization: not applicable (single-user local app).
- Logging constraints: never log note contents; never log microphone transcripts.

### Accessibility

- Baseline: WCAG AA target where feasible, keyboard navigation required.
- Reduced motion: respect `prefers-reduced-motion`.
- Contrast: maintain readable contrast for text and focus outlines.

### Compliance (if relevant)

- None for MVP.

---

## 10) Data model (conceptual)

### Core entities

- Entity: Note
  - Fields:
    - id: string
    - title: string (explicitly editable)
    - body: string
    - createdAt: datetime (immutable once created)
    - updatedAt: datetime
    - inputMode: enum (typing | voice)
  - Source of truth: local storage (IndexedDB recommended)
  - Lifecycle:
    - created when first meaningful content is added
    - updated on edit or dictation
    - deleted via delete flow

### Derived data

- snippet: first N characters for list display
- lastOpenedAt: optional for recents

### Retention and deletion

- Retention: indefinite in local storage until user deletes.
- Delete behavior: soft delete with undo window for MVP.

---

## 11) Integrations and dependencies

### External services

- None required for MVP.
- Voice input depends on browser speech recognition capability if used; if unavailable, feature degrades gracefully.

### Internal dependencies

- None.

### Constraints

- Cost constraints: minimal or zero infra costs for MVP.

---

## 12) Analytics and observability (optional but recommended)

### North-star metric

- Weekly active note captures per user (local metric).

### Key funnel

1) App open -> 2) first input -> 3) note saved -> 4) note recalled (opened from list or search)

### Events (minimum set)

- note_created
- note_updated
- note_opened
- search_used
- voice_started / voice_failed (no content payloads)

### Logging / tracing

- Error reporting can be deferred; if added later, must exclude note contents.

---

## 13) Risks, unknowns, and de-risk plan

### Top risks

- Risk 1: Voice-to-text inconsistency across browsers
  - Impact: med
  - Likelihood: high
  - Mitigation: graceful fallback to typing; clear microcopy; keep voice optional.
- Risk 2: Local storage reliability and migrations
  - Impact: med
  - Likelihood: med
  - Mitigation: keep schema simple; add basic migration strategy; export can be V1.

### Experiments / spikes

- Spike: Voice-to-text feasibility
  - Success criteria: reliable dictation start/stop and text insertion in at least one target browser.
  - Timebox: 1 day.

---

## 14) Rollout and iteration plan

### MVP rollout

- Audience: single user (builder) then small friend beta.
- Release strategy: simple web deployment (no accounts).
- Support plan: lightweight feedback capture (email or form) as optional.

### Post-MVP iteration (V1/V2)

- V1 candidates:
  - Export notes (markdown or text)
  - Basic preferences (theme, font size)
- V2 candidates:
  - LLM “meaning companion” side panel:
    - Continuous reflective insight on the current note
    - 1 to 3 short questions to deepen thinking
    - Must be optional, calm, and non-annoying
    - Requires an LLM integration and careful prompt design

---

## 15) Appendix

### Glossary

- Progressive disclosure: reveal secondary tools only when asked.
- Local-first: storage and functionality work without network by default.

### Decision log

- 2026-01-21: MVP is single-user, local-first web app with minimal UI and optional voice-to-text. (Ikon Eco)
- 2026-01-22: Refined UI to be "radically minimalist" with explicit titles and Home welcome screen. (Antigravity Assistant)
- 2026-01-21: LLM meaning companion side panel is V2, not MVP. (Ikon Eco)

### References

- Notion as visual and interaction inspiration (calm utility, minimalist posture).
