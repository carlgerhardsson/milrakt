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

### Primary Technology Domain

Frontend PWA / Static site — vanilla TypeScript with Vite build tooling.

### Starter Options Considered

This is a brownfield migration from a single-file `index.html` to a modular Vite +
TypeScript project. A framework CLI starter (e.g. create-next-app, create-vite) is
not appropriate — the project is intentionally minimal and vanilla. The scaffold is
manually defined.

### Selected Starter: Custom Vite Scaffold (manual)

**Rationale for Selection:**
Project is an intentionally vanilla TypeScript app. No UI framework is permitted.
A CLI starter would introduce unnecessary abstractions. The scaffold mirrors what
`vite create --template vanilla-ts` would produce, but with custom module structure
matching the boundaries defined in project-context.md.

**Initialization Command:**

```bash
npm install
```

(package.json already defined in PLAN-migrering.md — no CLI scaffolding needed)

**Architectural Decisions Provided by Scaffold:**

**Language & Runtime:**
TypeScript ^5.0.0, strict: true, tsc --noEmit as pre-commit gate. Node.js 18+.

**Styling Solution:**
Plain CSS with CSS custom properties (variables). No CSS framework. Palette:
`--bg`, `--card`, `--border`, `--accent`, `--green`, `--orange`, `--red`, `--text`, `--muted`.
Fonts: DM Mono (body), Playfair Display (h1 only).

**Build Tooling:**
Vite ^5.0.0. Build command: `tsc && vite build`. Output: `./dist`. `base: '/milrakt/'`.
Static assets in `public/` (Vite copies to dist automatically).

**Testing Framework:**
Vitest ^1.0.0. Test files in `tests/*.test.ts`. Only `src/logic.ts` is tested (no DOM tests).
Run with `vitest run` (not watch mode).

**Code Organization:**
- `src/logic.ts` — pure calculation functions, zero DOM imports
- `src/ui.ts` — all DOM manipulation, imports from logic.ts and types.ts
- `src/types.ts` — shared interfaces/types (e.g. `MileageStatus`)
- `src/main.ts` — entry point only, wires modules, minimal logic
- `tests/logic.test.ts` — unit tests for logic.ts
- `public/` — static assets (manifest.json, icons)
- `index.html` — Vite entry point at project root

**Development Experience:**
- `npm run dev` — Vite dev server with HMR
- `npm run type-check` — tsc --noEmit (pre-commit gate)
- `npm run test` — vitest run
- `npm run build` — tsc && vite build
- `npm run lint` — eslint src
- Validation gate: `type-check && test && build` before every push

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Out-of-range return type: `MileageStatus` with `isOutOfRange: boolean` flag
- Module boundary enforcement: logic.ts is DOM-free, ui.ts owns all DOM
- Vite base path: `'/milrakt/'` — required for GitHub Pages subpath

**Important Decisions (Shape Architecture):**
- CSS organization: single stylesheet, all colors via CSS custom properties
- Test scope: only `src/logic.ts` is tested — no DOM/UI tests
- CI validation gate: `type-check && test && build` before every push

**Deferred Decisions (Post-MVP):**
- None — scope is intentionally locked for this migration

### Data Architecture

No database, no storage, no API. All state is derived from:
- Hardcoded contract constants: `START=2026-02-16`, `END=2029-02-16`, `TOTAL_MIL=3000`
- Current date (passed in as parameter — enables testability)
- No external data dependencies

### Authentication & Security

Not applicable. Public static site, no user accounts, no sensitive data.

### API & Communication Patterns

Not applicable. Pure client-side computation only.

### Frontend Architecture

**State Management:** None. UI is a pure render of `calculateMileageStatus(new Date())`.
No reactive state, no store. `ui.ts` calls `logic.ts` and writes to DOM directly.

**Core Type:**

```typescript
export interface MileageStatus {
  targetMileage: number;        // Mil du borde ha kört
  percentComplete: number;      // Andel av avtalet
  milesPerWeekNeeded: number;   // Tempo att hålla framöver
  daysLeft: number;
  isOutOfRange: boolean;        // true when date is before START or after END
}
```

**Module boundaries (enforced):**
- `logic.ts` — pure functions, zero DOM imports. `calculateMileageStatus(date: Date): MileageStatus`
- `ui.ts` — all DOM manipulation, checks `isOutOfRange` before rendering values
- `types.ts` — `MileageStatus` interface and any future shared types
- `main.ts` — entry point, calls `ui.ts` on `DOMContentLoaded`, minimal logic

**Component architecture:** No components. Single-page, single-function render cycle.

**Routing:** None. Single view.

**Bundle optimization:** Vite default (tree-shaking, minification). No manual optimization needed at this scale.

### Infrastructure & Deployment

- Host: GitHub Pages at `https://carlgerhardsson.github.io/milrakt/`
- CI/CD: GitHub Actions — push to `main` triggers build + deploy
- Build artifact: `./dist` (Vite output)
- Validation gate (enforced pre-push): `npm run type-check && npm run test && npm run build`
- Branch strategy: `feature/short-description` → PR → merge to `main` → auto-deploy
- Commit format: conventional commits (`feat:`, `fix:`, `chore:`, `test:`)

### Decision Impact Analysis

**Implementation Sequence:**
1. Scaffold file structure (`src/`, `tests/`, `public/`, `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`)
2. Implement `types.ts` (`MileageStatus` interface)
3. Implement `logic.ts` (`calculateMileageStatus`, pure, testable)
4. Write `tests/logic.test.ts` (all required coverage cases)
5. Implement `ui.ts` (DOM rendering, `isOutOfRange` guard)
6. Wire `main.ts` (`DOMContentLoaded` → `ui.ts`)
7. Migrate CSS to stylesheet with CSS variables
8. Validate: `type-check && test && build`
9. Update `.github/workflows/deploy.yml` for Vite build
10. Push, verify live on GitHub Pages

**Cross-Component Dependencies:**
- `types.ts` has no dependencies — must exist first
- `logic.ts` depends on `types.ts` only
- `tests/` depends on `logic.ts` only
- `ui.ts` depends on `logic.ts` and `types.ts`
- `main.ts` depends on `ui.ts` only

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

6 areas where AI agents could make different choices — all resolved below.

### Naming Patterns

**Code Naming Conventions:**
- Functions and variables: `camelCase` (e.g. `calculateMileageStatus`, `daysLeft`)
- Interfaces and types: `PascalCase` (e.g. `MileageStatus`)
- Source files: `camelCase.ts` (e.g. `logic.ts`, `main.ts`, `ui.ts`, `types.ts`)
- CSS classes: `kebab-case` (e.g. `.progress-bar`, `.status-card`)
- CSS variables: `--kebab-case` (e.g. `--bg`, `--accent`, `--muted`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g. `START_DATE`, `END_DATE`, `TOTAL_MIL`)

**Anti-pattern:** Never use `snake_case` for TypeScript identifiers.

### Structure Patterns

**Project Organization:**
- Tests live in `tests/` directory (separate from src) — never co-located
- Test files named `*.test.ts` matching their source: `logic.test.ts` tests `logic.ts`
- Static assets always in `public/` — never in `src/`
- No subdirectories inside `src/` — flat module structure at this scale

**File Structure (canonical):**
```
src/types.ts        ← interfaces/types only, no logic, no DOM
src/logic.ts        ← pure functions only, imports from types.ts
src/ui.ts           ← DOM only, imports from logic.ts + types.ts
src/main.ts         ← wiring only, imports from ui.ts
tests/logic.test.ts
public/manifest.json
public/icons/
index.html          ← project root (Vite entry point)
```

### Format Patterns

**Number Display:**
- All mileage values: `toFixed(1)` — always 1 decimal place, no exceptions
- Example: `1234.5` not `1234` or `1234.50`

**Date Parsing:**
- Always: `new Date(val + 'T12:00:00')` — prevents timezone midnight-rollover
- Never: `new Date(val)` for date-only strings

**Swedish UI strings:**
- All user-visible text in Swedish
- Code identifiers, comments, and commit messages in English

### Process Patterns

**Out-of-Range Rendering (critical consistency rule):**
When `MileageStatus.isOutOfRange === true`:
- HIDE all mileage values and the progress bar
- SHOW a neutral Swedish message: *"Utanför avtalsperioden"*
- Do NOT show 0 mil, 3000 mil, or any calculated value
- Do NOT show an error state — this is expected behaviour, not an error

Example guard pattern in `ui.ts`:
```typescript
if (status.isOutOfRange) {
  // render: "Utanför avtalsperioden"
  return;
}
// render normal mileage UI
```

**Error Handling:**
- No runtime errors expected — all inputs are internal (no user input to validate)
- TypeScript strict mode is the error prevention strategy
- No try/catch blocks needed in `logic.ts`

**Loading States:**
- Not applicable — computation is synchronous and instant

### Enforcement Guidelines

**All AI Agents MUST:**
- Check `isOutOfRange` before rendering any mileage value
- Never import DOM APIs in `logic.ts`
- Never hardcode hex colors — use CSS variables only
- Always use `toFixed(1)` for mileage display
- Always parse date strings as `new Date(val + 'T12:00:00')`
- Keep `base: '/milrakt/'` in vite.config.ts — never change to `'/'`
- Run `type-check && test && build` before committing

**Anti-Patterns:**
- `new Date('2026-02-16')` — timezone bug risk, use `new Date('2026-02-16T12:00:00')`
- Importing `document` or DOM APIs in `logic.ts` — breaks module boundary
- `color: #0d1117` in CSS — use `var(--bg)` instead
- `value.toFixed(0)` or raw number — must always be `toFixed(1)`
- `base: '/'` in vite.config.ts — causes 404 on GitHub Pages

## Project Structure & Boundaries

### Complete Project Directory Structure

```
milrakt/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← GitHub Actions: npm ci → npm run build → upload ./dist
├── src/
│   ├── types.ts                ← MileageStatus interface (no logic, no DOM)
│   ├── logic.ts                ← calculateMileageStatus(date: Date): MileageStatus
│   ├── ui.ts                   ← renderStatus(status: MileageStatus): void
│   └── main.ts                 ← DOMContentLoaded → renderStatus(calculateMileageStatus(new Date()))
├── tests/
│   └── logic.test.ts           ← unit tests for logic.ts only
├── public/
│   ├── manifest.json           ← PWA manifest (theme-color must match --bg)
│   └── icons/                  ← app icons (referenced by manifest.json)
├── index.html                  ← Vite entry point; references src/main.ts
├── style.css                   ← all styles; CSS variables define full palette
├── vite.config.ts              ← base: '/milrakt/' (non-negotiable)
├── tsconfig.json               ← strict: true
├── eslint.config.js            ← scope: eslint src
├── package.json                ← scripts: dev, build, type-check, test, lint
├── .gitignore
└── README.md
```

### Architectural Boundaries

**Module Boundaries (strict import rules):**

| Module | May import | May NOT import |
|---|---|---|
| `types.ts` | nothing | anything |
| `logic.ts` | `types.ts` | `ui.ts`, `main.ts`, DOM APIs |
| `ui.ts` | `logic.ts`, `types.ts` | `main.ts` |
| `main.ts` | `ui.ts` | `logic.ts`, `types.ts` directly |
| `tests/logic.test.ts` | `logic.ts`, `types.ts` | DOM APIs, `ui.ts`, `main.ts` |

**Style Boundaries:**
- All colours defined as CSS variables in `style.css`
- No inline styles anywhere in `index.html` or TypeScript files
- `theme-color` value must be identical in: `style.css` (`--bg`), `index.html` (meta tag), `manifest.json`

**Build Boundary:**
- `./dist` is generated output only — never edited manually
- `./public` contents are copied to `./dist` verbatim by Vite

### Requirements to Structure Mapping

**Core calculation** (`calculateMileageStatus`):
→ `src/types.ts` (MileageStatus interface) + `src/logic.ts` (implementation)

**Progress bar + colour thresholds** (<33% accent, 33–66% green, >66% orange):
→ `src/ui.ts` (threshold logic) + `style.css` (CSS variables for colours)

**Out-of-range handling** (`isOutOfRange: true` → "Utanför avtalsperioden"):
→ `src/ui.ts` (guard pattern at top of render function)

**PWA** (installable, offline-capable):
→ `public/manifest.json` + `index.html` (Apple meta tags) + `style.css` (theme-color sync)

**Test coverage** (start, end, midpoint, before-start, after-end, mil/week):
→ `tests/logic.test.ts`

**Deployment** (GitHub Pages, auto-deploy on push to main):
→ `.github/workflows/deploy.yml` + `vite.config.ts` (`base: '/milrakt/'`)

### Integration Points

**Internal Data Flow:**
```
new Date()
  → logic.ts: calculateMileageStatus(date)
  → MileageStatus { targetMileage, percentComplete, milesPerWeekNeeded, daysLeft, isOutOfRange }
  → ui.ts: renderStatus(status)
  → DOM updates
```

**External Integrations:** None. No API calls, no third-party services.

**PWA Sync Constraint:**
`theme-color: #0d1117` must be kept identical across:
1. `style.css`: `--bg: #0d1117`
2. `index.html`: `<meta name="theme-color" content="#0d1117">`
3. `manifest.json`: `"theme_color": "#0d1117"`

### Development Workflow Integration

**Development Server:**
`npm run dev` → Vite serves from project root, HMR enabled, base path applies

**Build Process:**
`npm run build` → `tsc && vite build` → outputs to `./dist/`
Assets in `public/` copied to `dist/` automatically.

**Deployment:**
Push to `main` → GitHub Actions → `npm ci` → `npm run build` → upload `./dist` → GitHub Pages at `https://carlgerhardsson.github.io/milrakt/`

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices (Vite 5, TypeScript 5, Vitest 1, ESLint 9) are mutually compatible
and well-established in combination. No version conflicts identified.

**Pattern Consistency:**
Naming conventions have no overlaps: `camelCase` (files/vars/functions), `PascalCase` (types),
`SCREAMING_SNAKE_CASE` (constants), `kebab-case` (CSS). All patterns support the vanilla TS constraint.

**Structure Alignment:**
The flat `src/` structure directly supports the 4-module boundary design. The module import
table makes boundaries enforceable and verifiable.

### Requirements Coverage Validation ✅

All functional requirements are mapped to specific files (see Requirements to Structure Mapping).
All NFRs are addressed: offline-capability (no API calls), strict TypeScript (tsconfig),
test gate (validation workflow), GitHub Pages (`vite.config.ts` base + `deploy.yml`).

### Implementation Readiness Validation ✅

**Decision Completeness:** All critical decisions documented. Core type fully specified.
Module boundaries tabulated. Anti-patterns listed with examples.

**Structure Completeness:** Every file in the project tree is named and annotated with its role.

**Pattern Completeness:** All 6 conflict points identified and resolved.
Guard pattern for `isOutOfRange` provided as concrete code example.

### Gap Analysis Results

**Critical Gaps:** None.
**Important Gaps:** None.
**Minor / Future consideration:** `isOutOfRange` does not distinguish before-start from
after-end. Current spec shows same message for both — acceptable for MVP. If differentiated
messaging is needed later, add `outOfRangeReason: 'before-start' | 'after-end'` to `MileageStatus`.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Low — single-domain calculator)
- [x] Technical constraints identified (base path, timezone, no framework)
- [x] Cross-cutting concerns mapped (6 identified)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified (Vite 5, TS 5, Vitest 1, ESLint 9)
- [x] Module boundary rules tabulated
- [x] Out-of-range type decision resolved (`isOutOfRange` flag)

**✅ Implementation Patterns**
- [x] Naming conventions established (4 categories)
- [x] Structure patterns defined (flat `src/`, `tests/` separate)
- [x] Process patterns specified (out-of-range guard, date parsing, number display)
- [x] Anti-patterns documented with examples

**✅ Project Structure**
- [x] Complete directory structure with annotated file roles
- [x] Module import boundaries tabulated
- [x] PWA sync constraint documented
- [x] Requirements-to-structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High

**Key Strengths:**
- Scope is tightly bounded — low risk of scope creep during implementation
- Module boundaries are explicit and verifiable (import table)
- Critical gotchas (base path, timezone parsing) are documented as anti-patterns with examples
- PWA sync constraint is called out explicitly — easy to miss otherwise

**Areas for Future Enhancement:**
- Differentiated out-of-range messaging (before-start vs after-end) if needed
- Additional test coverage for edge cases beyond the 6 required scenarios

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use the module import boundary table — violations break the architecture
- Check `isOutOfRange` FIRST in `ui.ts` before rendering any value
- Refer to Anti-Patterns section before writing any code

**First Implementation Step:**
Create the file scaffold (all files listed in Complete Project Directory Structure),
starting with `src/types.ts` — it has no dependencies and unblocks all other modules.
