---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
lastStep: 8
status: 'complete'
completedAt: '2026-03-28'
inputDocuments:
  - _bmad-output/project-context.md
  - PLAN-migrering.md
  - CLAUDE.md
workflowType: 'architecture'
project_name: 'milrakt'
user_name: 'Calle'
date: '2026-03-28'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- Core: `calculateMileageStatus(date: Date): MileageStatus` — derives targetMileage,
  percentComplete, milesPerWeekNeeded, daysLeft from hardcoded contract constants
  (START=2026-02-16, END=2029-02-16, TOTAL_MIL=3000)
- Display: Progress bar with color thresholds (<33% accent, 33–66% green, >66% orange),
  all values to 1 decimal place, Swedish UI strings
- PWA: installable via manifest.json, Apple meta tags, theme-color sync across 3 files
- Out-of-range dates: must return a typed result, never null/undefined

**Non-Functional Requirements:**
- Zero data storage, zero API calls — pure client-side, fully offline-capable
- Strict TypeScript (strict: true, no exceptions)
- All tests must pass before any commit
- Deploy: GitHub Pages via GitHub Actions, always available at /milrakt/ subpath

**Scale & Complexity:**
- Primary domain: Frontend PWA / static site
- Complexity level: Low (single-domain calculator, no backend, no state management)
- Estimated architectural components: 4 source modules + 1 test suite + 1 build config

### Technical Constraints & Dependencies

- `base: '/milrakt/'` in vite.config.ts — non-negotiable for GitHub Pages subpath
- Date parsing: always `new Date(val + 'T12:00:00')` — timezone safety constraint
- No UI frameworks (React, Vue, etc.) — enforced constraint
- Node.js 18+ runtime requirement
- Build: `tsc && vite build` — TypeScript must compile cleanly before bundle step

### Cross-Cutting Concerns Identified

- **Timezone handling**: affects all date parsing in logic.ts and any future date inputs
- **Deployment path**: affects vite.config.ts, CI workflow, and any absolute asset refs
- **PWA theme-color sync**: must stay consistent across index.html, manifest.json, CSS --bg
- **CSS variable palette**: all colors via variables — no hardcoded hex anywhere
- **Module boundary enforcement**: logic.ts must never import DOM APIs

## Starter Template Evaluation

### Selected Starter: Custom Vite Scaffold (manual)

This is a brownfield migration. No CLI starter needed. The scaffold mirrors `vite create --template vanilla-ts` with custom module structure matching project-context.md boundaries.

**Language & Runtime:** TypeScript ^5.0.0, strict: true. Node.js 18+.

**Styling:** Plain CSS with CSS custom properties. Palette: `--bg`, `--card`, `--border`, `--accent`, `--green`, `--orange`, `--red`, `--text`, `--muted`. Fonts: DM Mono (body), Playfair Display (h1 only).

**Build:** Vite ^5.0.0. `tsc && vite build`. Output: `./dist`. `base: '/milrakt/'`.

**Testing:** Vitest ^1.0.0. `tests/*.test.ts`. Only `src/logic.ts` tested. `vitest run`.

**Scripts:**
- `npm run dev` — Vite dev server with HMR
- `npm run type-check` — tsc --noEmit (pre-commit gate)
- `npm run test` — vitest run
- `npm run build` — tsc && vite build
- `npm run lint` — eslint src
- Validation gate: `type-check && test && build` before every push

## Core Architectural Decisions

### Critical Decisions

- Out-of-range return type: `MileageStatus` with `isOutOfRange: boolean` flag
- Module boundary enforcement: logic.ts is DOM-free, ui.ts owns all DOM
- Vite base path: `'/milrakt/'` — required for GitHub Pages subpath
- CSS organization: single stylesheet, all colors via CSS custom properties
- Test scope: only `src/logic.ts` — no DOM/UI tests
- CI validation gate: `type-check && test && build` before every push

### Core Type

```typescript
export interface MileageStatus {
  targetMileage: number;        // Mil du borde ha kört
  percentComplete: number;      // Andel av avtalet
  milesPerWeekNeeded: number;   // Tempo att hålla framöver
  daysLeft: number;
  isOutOfRange: boolean;        // true when date is before START or after END
}
```

### Module Boundaries (enforced)

- `logic.ts` — pure functions, zero DOM imports. `calculateMileageStatus(date: Date): MileageStatus`
- `ui.ts` — all DOM manipulation, checks `isOutOfRange` before rendering values
- `types.ts` — `MileageStatus` interface and any future shared types
- `main.ts` — entry point, calls `ui.ts` on `DOMContentLoaded`, minimal logic

### Implementation Sequence

1. Scaffold file structure
2. Implement `types.ts`
3. Implement `logic.ts`
4. Write `tests/logic.test.ts`
5. Implement `ui.ts`
6. Wire `main.ts`
7. Migrate CSS to stylesheet
8. Validate: `type-check && test && build`
9. Update `.github/workflows/deploy.yml`
10. Push, verify live

### Cross-Component Dependencies

- `types.ts` has no dependencies — must exist first
- `logic.ts` depends on `types.ts` only
- `tests/` depends on `logic.ts` only
- `ui.ts` depends on `logic.ts` and `types.ts`
- `main.ts` depends on `ui.ts` only

## Implementation Patterns & Consistency Rules

### Naming Conventions

- Functions/variables: `camelCase`
- Interfaces/types: `PascalCase`
- Source files: `camelCase.ts`
- CSS classes: `kebab-case`
- CSS variables: `--kebab-case`
- Constants: `SCREAMING_SNAKE_CASE`

### Critical Process Patterns

**Out-of-Range Rendering:**
When `isOutOfRange === true` → HIDE all values, SHOW "Utanför avtalsperioden", return early.

```typescript
if (status.isOutOfRange) {
  // render: "Utanför avtalsperioden"
  return;
}
// render normal mileage UI
```

**Date Parsing:** Always `new Date(val + 'T12:00:00')` — never `new Date(val)`.

**Number Display:** Always `toFixed(1)` — never raw or `toFixed(0)`.

### Anti-Patterns

- `new Date('2026-02-16')` — timezone bug, use `+ 'T12:00:00'`
- DOM imports in `logic.ts` — breaks module boundary
- Hardcoded hex in CSS — use CSS variables
- `base: '/'` in vite.config.ts — causes 404 on GitHub Pages
- Raw number display — always `toFixed(1)`

## Project Structure

```
milrakt/
├── .github/workflows/deploy.yml   ← npm ci → npm run build → upload ./dist
├── src/
│   ├── types.ts                   ← MileageStatus interface only
│   ├── logic.ts                   ← calculateMileageStatus(date: Date): MileageStatus
│   ├── ui.ts                      ← renderStatus(status: MileageStatus): void
│   └── main.ts                    ← DOMContentLoaded → renderStatus(calculateMileageStatus(new Date()))
├── tests/
│   └── logic.test.ts              ← unit tests for logic.ts only
├── public/
│   ├── manifest.json              ← PWA manifest (theme-color must match --bg)
│   └── icons/
├── index.html                     ← Vite entry point
├── style.css                      ← all styles, CSS variables
├── vite.config.ts                 ← base: '/milrakt/' (non-negotiable)
├── tsconfig.json                  ← strict: true
├── eslint.config.js
└── package.json
```

### Module Import Boundary Table

| Module | May import | May NOT import |
|---|---|---|
| `types.ts` | nothing | anything |
| `logic.ts` | `types.ts` | `ui.ts`, `main.ts`, DOM APIs |
| `ui.ts` | `logic.ts`, `types.ts` | `main.ts` |
| `main.ts` | `ui.ts` | `logic.ts`, `types.ts` directly |
| `tests/logic.test.ts` | `logic.ts`, `types.ts` | DOM APIs, `ui.ts`, `main.ts` |

### PWA Sync Constraint

`theme-color: #0d1117` must be identical in:
1. `style.css`: `--bg: #0d1117`
2. `index.html`: `<meta name="theme-color" content="#0d1117">`
3. `manifest.json`: `"theme_color": "#0d1117"`

## Architecture Validation

**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** High
**Critical Gaps:** None

**First Implementation Step:**
Start with `src/types.ts` — no dependencies, unblocks all other modules.
