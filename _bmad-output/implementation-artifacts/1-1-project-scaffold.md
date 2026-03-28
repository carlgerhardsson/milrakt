# Story 1.1: Project Scaffold

Status: review

## Story

As a developer,
I want a complete Vite + TypeScript project scaffold with all config files,
so that the project has a working build pipeline before any feature code is written.

## Acceptance Criteria

1. The following files exist: `src/types.ts`, `src/logic.ts`, `src/ui.ts`, `src/main.ts`, `tests/logic.test.ts`, `public/manifest.json`, `index.html`, `style.css`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `package.json`
2. `vite.config.ts` contains `base: '/milrakt/'`
3. `tsconfig.json` has `"strict": true`
4. `npm run type-check` completes with zero errors
5. `npm run build` produces a `./dist` directory

## Tasks / Subtasks

- [x] Create package.json with exact scripts and devDependencies (AC: 1, 4, 5)
  - [x] Include scripts: dev, build, type-check, test, test:watch, lint
  - [x] Include all devDependencies: vite, typescript, vitest, eslint, prettier, @types/node, typescript-eslint, @eslint/js
- [x] Create vite.config.ts with `base: '/milrakt/'` (AC: 2, 5)
- [x] Create tsconfig.json with `strict: true` and include src + tests (AC: 3, 4)
- [x] Create eslint.config.js scoped to src/ (AC: 1)
- [x] Create .gitignore (add node_modules, dist) (AC: 1)
- [x] Create src/ directory with stub module files (AC: 1, 4)
  - [x] src/types.ts — export MileageStatus interface stub
  - [x] src/logic.ts — export calculateMileageStatus stub (imports types.ts only)
  - [x] src/ui.ts — export renderStatus stub (imports logic.ts + types.ts)
  - [x] src/main.ts — DOMContentLoaded wiring stub (imports ui.ts only)
- [x] Create tests/logic.test.ts with empty describe block (AC: 1, 4)
- [x] Move manifest.json from project root → public/manifest.json (AC: 1)
- [x] Update index.html to Vite entry point format (AC: 1, 5)
  - [x] Replace inline scripts with `<script type="module" src="/src/main.ts"></script>`
  - [x] Keep all existing meta tags (theme-color, Apple PWA tags)
- [x] Create style.css at project root (empty placeholder — full content in Story 1.3) (AC: 1)
- [x] Run `npm install` (AC: 4, 5)
- [x] Validate: `npm run type-check` → zero errors (AC: 4)
- [x] Validate: `npm run build` → dist/ directory created (AC: 5)

## Dev Notes

### Critical Constraints — Read Before Writing Any File

- **`base: '/milrakt/'` is NON-NEGOTIABLE** in vite.config.ts. Using `'/'` causes silent 404 on GitHub Pages. This is the single most common mistake. Double-check before finishing.
- **This is a brownfield migration** — the repository already contains `index.html` and `manifest.json` at root. Do not delete index.html. Do move manifest.json to `public/`.
- **`npm install` must be run** after creating package.json — there is no node_modules yet.
- **Source stubs must pass type-check** — they don't need real logic, but they must export the correct types/signatures so TypeScript compiles cleanly.

### Exact File Contents

#### package.json
```json
{
  "name": "milrakt",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src"
  },
  "devDependencies": {
    "@eslint/js": "^9.0.0",
    "@types/node": "^20.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "typescript-eslint": "^8.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/milrakt/',
})
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "tests"]
}
```

#### eslint.config.js
```javascript
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['src/**/*.ts'],
    rules: {},
  },
)
```

#### .gitignore (append, do not replace existing)
```
node_modules
dist
.DS_Store
*.local
```

#### src/types.ts (stub — full implementation in Story 1.2)
```typescript
export interface MileageStatus {
  targetMileage: number
  percentComplete: number
  milesPerWeekNeeded: number
  daysLeft: number
  isOutOfRange: boolean
}
```

#### src/logic.ts (stub — full implementation in Story 1.2)
```typescript
import type { MileageStatus } from './types'

export function calculateMileageStatus(_date: Date): MileageStatus {
  return {
    targetMileage: 0,
    percentComplete: 0,
    milesPerWeekNeeded: 0,
    daysLeft: 0,
    isOutOfRange: false,
  }
}
```

#### src/ui.ts (stub — full implementation in Story 1.4)
```typescript
import { calculateMileageStatus } from './logic'
import type { MileageStatus } from './types'

export function renderStatus(status: MileageStatus): void {
  // Implementation in Story 1.4
  console.log(status)
}

export function initUI(): void {
  const status = calculateMileageStatus(new Date())
  renderStatus(status)
}
```

#### src/main.ts (stub — unchanged in later stories)
```typescript
import { initUI } from './ui'

document.addEventListener('DOMContentLoaded', () => {
  initUI()
})
```

#### tests/logic.test.ts (stub — full tests in Story 1.2)
```typescript
import { describe } from 'vitest'
import { calculateMileageStatus } from '../src/logic'

describe('calculateMileageStatus', () => {
  // Tests implemented in Story 1.2
  void calculateMileageStatus // prevent unused import error
})
```

#### index.html (replace script block only — keep all meta tags)

The existing `index.html` has inline `<script>` tags with all the JavaScript. Replace the entire `<script>` block (and any `<link rel="stylesheet">` if present) with:
```html
<link rel="stylesheet" href="/style.css">
<script type="module" src="/src/main.ts"></script>
```

**KEEP**: `<meta name="theme-color" content="#0d1117">`, Apple PWA meta tags, title, viewport meta. **REMOVE**: all inline `<script>` and `<style>` blocks.

#### style.css (empty placeholder at project root)
```css
/* Styles implemented in Story 1.3 */
```

### Module Import Boundary — CRITICAL

The stub files must follow the import hierarchy exactly or type-check will fail in later stories:

| File | Allowed imports | FORBIDDEN |
|---|---|---|
| `src/types.ts` | nothing | anything |
| `src/logic.ts` | `./types` only | DOM APIs, ui.ts, main.ts |
| `src/ui.ts` | `./logic`, `./types` | main.ts |
| `src/main.ts` | `./ui` only | logic.ts, types.ts directly |
| `tests/logic.test.ts` | `../src/logic`, `../src/types` | DOM, ui.ts, main.ts |

### What NOT to do

- ❌ Do NOT set `base: '/'` — this is the critical GitHub Pages bug
- ❌ Do NOT create subdirectories inside `src/` — flat structure only
- ❌ Do NOT put manifest.json in `src/` — it belongs in `public/`
- ❌ Do NOT import DOM APIs in `logic.ts` — pure functions only
- ❌ Do NOT run `tsc --build` — use `tsc --noEmit` for type checking (noEmit is set in tsconfig)
- ❌ Do NOT delete or significantly modify PLAN-migrering.md, CLAUDE.md, or .github/workflows/deploy.yml

### Validation Gate (run in this order)
```bash
npm install
npm run type-check   # must be zero errors
npm run build        # must produce dist/ directory
```

If `npm run type-check` fails with "Cannot find module 'vite'" or similar, ensure `npm install` completed successfully.

### Project Structure Notes

- Project root already contains: `index.html`, `manifest.json`, `.github/`, `PLAN-migrering.md`, `PLAN-arbetssatt.md`, `README.md`, `_bmad/`, `_bmad-output/`, `.claude/`
- Do NOT touch `.github/workflows/deploy.yml` — updated in Story 2.2
- `manifest.json` at root → move to `public/manifest.json`
- `style.css` created at root (Vite picks it up from project root via index.html link)

### References

- [Source: architecture.md — Starter Template Evaluation]
- [Source: architecture.md — Project Structure & Boundaries]
- [Source: architecture.md — Implementation Patterns, Module Boundaries]
- [Source: architecture.md — Anti-Patterns]
- [Source: epics.md — Story 1.1 Acceptance Criteria]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- tests/logic.test.ts: Vitest fails on empty describe blocks; used `it.todo` placeholder instead of the bare `void` trick from the spec. Story 1.2 will replace this with real tests.

### Completion Notes List

- All config files created exactly as specified in Dev Notes.
- `vite.config.ts` confirms `base: '/milrakt/'` — critical GitHub Pages requirement.
- `tsconfig.json` has `strict: true` and covers `src` + `tests`.
- `manifest.json` moved from project root → `public/manifest.json`; `index.html` manifest link updated to `/milrakt/manifest.json`.
- All inline `<style>` and `<script>` blocks removed from `index.html`; replaced with `<link rel="stylesheet" href="/style.css">` and `<script type="module" src="/src/main.ts"></script>`.
- All module import boundaries respected (types → logic → ui → main).
- `npm run type-check` passed with zero errors.
- `npm run build` produced `dist/` directory successfully.
- `npm run test` passes (1 todo placeholder).

### Change Log

- 2026-03-28: Implemented Story 1.1 — Vite + TypeScript project scaffold created. All config files, src stubs, and public assets in place. Build pipeline operational.

### File List

- package.json (created)
- vite.config.ts (created)
- tsconfig.json (created)
- eslint.config.js (created)
- .gitignore (created)
- src/types.ts (created)
- src/logic.ts (created)
- src/ui.ts (created)
- src/main.ts (created)
- tests/logic.test.ts (created)
- public/manifest.json (moved from manifest.json at root)
- manifest.json (deleted from root)
- index.html (updated — inline style/script blocks removed, Vite entry point added)
- style.css (created)
