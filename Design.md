# Design.md

Version: 0.3  
Owner: Ikon Eco  
Last updated: 2026-01-22  
Status: draft  
PRD: PRD.md  
Plan: Plan.md  

## 0) Purpose

This document specifies the experience, brand, visual system, motion system, and design system in a build-ready way so autonomous agents can implement UI without guesswork.

### Success definition

- UI feels invisible and radically simple, with the editor as the primary surface.
- Core flows are fast and recoverable, with empty, loading, error, success, and undo handled.
- Design tokens and components enable consistent implementation at speed.
- Accessibility baseline is met: keyboard, focus, contrast, reduced motion.
- **Visuals are ultra-clean and minimalist, avoiding any unnecessary utility chrome.**

---

## 1) Design brief (north star)

### Product one-liner

A radically minimalist personal note app that makes capture and recall obvious, fast, and calm, with optional voice-to-text.

### Audience and positioning signal

Audience: consumer  
Signal: quiet, premium, invisible utility

### Emotional tone (3–5 adjectives)

- easy
- anticipatory
- obvious
- uber-simple
- invisible

### What to avoid

- clutter (excessive buttons, window decorations)
- dashboards
- heavy organization systems (folders, tags as requirements)
- noisy branding
- decorative motion
- collaboration hype (avatars, sharing) in MVP

---

## 2) Brand foundations

### Brand promise

Your notes, captured instantly and found effortlessly, without making you manage a system.

### Brand personality traits

- quiet
- precise
- supportive

### Voice and tone rules

- Voice: neutral, second person only when needed
- Style: short, calm, direct
- Humor: none
- Confidence: understated

### Microcopy principles

- Errors: gentle, actionable, non-blaming
- Success: minimal confirmation, then disappear
- Empty states: one helpful next step

---

## 3) Visual design direction

### Reference archetype

- Visual family: **Radically Minimalist calm utility**
- Design posture: minimal, lightly layered, **breadcrumb-driven**

### Theme strategy

- Theme: light and dark supported
- Default: light
- Contrast target: medium-high for readability

### Layout principles

- Density: airy and spacious
- Grid: centered column, max width, generous margins
- Spacing scale: 8pt base (4pt allowed for micro spacing)
- Corner radius: subtle (mostly 8), larger for sheets (12 to 16)
- Elevation: minimal, used only for overlay layers and focused surfaces

### Typography

- Font families:
  - Primary: system UI (Inter or SF Pro)
  - Secondary: none
- Type scale (suggested)
  - Display: 32, 600, 1.2
  - H1: 24, 600, 1.3
  - H2: 18, 600, 1.35
  - Body: 15 to 16, 400, 1.55
  - Caption: 12 to 13, 400, 1.4

### Color system (semantic-first)

Use semantic tokens. Keep palettes neutral. Accents are scarce and purposeful.

- Background:
  - `color.bg.default` (app background)
  - `color.bg.surface` (editor surface)
  - `color.bg.elevated` (list layer sheet)
- Text:
  - `color.text.primary` (note content)
  - `color.text.secondary` (meta, timestamps)
  - `color.text.muted` (placeholders)
- Borders:
  - `color.border.default` (inputs, dividers)
  - `color.border.subtle` (hairlines)

- **Tags (Mocked for Visuals):**
  - `color.tag.orange`: HSL(30, 80%, 90%) bg, HSL(30, 40%, 30%) text
  - `color.tag.purple`: HSL(260, 80%, 90%) bg, HSL(260, 40%, 30%) text
  - `color.tag.pink`: HSL(350, 80%, 90%) bg, HSL(350, 40%, 30%) text
  - `color.tag.blue`: HSL(210, 80%, 90%) bg, HSL(210, 40%, 30%) text

### Iconography

- Style: **Emoji-first for content, outline for UI controls.**
- Icon set: Material Icons (outline) or Lucide equivalent.

---

## 4) Motion and animation system

### Motion personality

Smooth and gentle, always purposeful.

### Global motion rules

- Durations:
  - micro (hover, press): 80 to 120ms
  - standard transitions: 160 to 220ms
  - large transitions (sheet open): 220 to 300ms
- Easing:
  - default: ease-out

---

## 5) Information architecture

### Navigation model

Single-flow editor with progressive disclosure:

- Primary surface: editor
- Secondary surface: notes list layer (overlay or side sheet)
- **Top Bar: Contains breadcrumbs and primary global actions (New Note).**

### Sitemap (MVP)

- `/` Main Editor
- Notes list layer (overlay on top of `/`)

---

## 7) Screen-by-screen specs (MVP)

### Screen: Main Editor

Purpose: Capture and edit notes instantly.  
Layout structure:

- **Header (Top Bar):**
  - Left: Navigation toggle + Breadcrumbs (e.g., 📝 Note Title)
  - Right: "New Note" button (contained, disabled elevation)
- **Document Header:**
  - Large Emoji (randomized or selectable)
  - H1 Title (linked to document title)
- **Main content:**
  - Minimalistic editor (no toolbar visible by default)

### Screen: Notes List Layer (Sidebar/Sheet)

Purpose: Access all notes without cluttering the editor.  
Layout structure:

- Header: search input and close affordance, **"+" New Note button.**
- Content: List of notes.
- **Columns (Visual):**
  - Icon (Emoji)
  - Title & Snippet
  - Meta (Date, Tags)

---

## 8) Design system specification

### 8.1 Component inventory (Updated)

- **Breadcrumbs:** Small text path showing hierarchy.
- **Tag:** Small pill with light background and dark text.
- **EmojiPicker (Implicit):** Emojis used in titles and lists.
- **NewButton:** Prominent contained button for creation.

### 8.3 Component specs

#### Component: Note Row (Refined)

- Visual rules:
  - **Grid-like layout** with columns for Name, Date, Tags.
  - Title is dominant, snippet is muted.
  - Emoji as the primary icon.

---

## 10) Inspirations and references

### Inspiration shortlist

- Notion (Sidebar structure)
- Apple Notes (Cleanliness)
- Bear (Type focus)

---

## 11) Change log

- 2026-01-21: Initial Design.md drafted. (Ikon Eco)
- 2026-01-22: Refined visuals based on premium Notion-meets-Apple screenshots. Added breadcrumbs, window decorations, and emoji-first content focus. (Antigravity Assistant)
- 2026-01-22: Simplified UI (V0.3). Removed window controls, avatars, and cluttered global buttons. Added explicit New Note affordances. (Antigravity Assistant)
