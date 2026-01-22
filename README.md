# Minimal Notes

A radically minimalist personal note app that makes capture and recall obvious, fast, and calm, with optional voice-to-text input.

## Quickstart

### Prerequisites

- Node.js 20.x LTS
- pnpm 9.x

### Install

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Development

### Lint

```bash
pnpm lint
```

### Format

```bash
pnpm format
```

### Typecheck

```bash
pnpm typecheck
```

### Tests

```bash
pnpm test
```

Run single test:

```bash
pnpm test -- <pattern>
```

### Build

```bash
pnpm build
```

Production run:

```bash
pnpm start
```

## Project Structure

- `app/` - Next.js app directory (routes)
- `src/components/` - UI components (Editor, NotesListLayer, NoteRow, Toast)
- `src/lib/domain/` - Note model, derivations, autosave logic
- `src/lib/infra/` - Storage adapter (IndexedDB), speech adapter
- `src/lib/ui/` - View models and hooks that bridge domain to UI
- `src/theme/` - MUI theme, tokens

## Documentation

- [PRD.md](PRD.md) - Product requirements
- [Design.md](Design.md) - UI/UX specifications
- [Plan.md](Plan.md) - Execution plan and milestones
- [Tasks.md](Tasks.md) - Executable backlog
- [AGENTS.md](AGENTS.md) - Agent workflow and quality rules

## License

MIT
