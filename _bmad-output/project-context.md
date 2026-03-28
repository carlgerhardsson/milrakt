---
project_name: 'milrakt'
user_name: 'Calle'
date: '2026-03-27'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 30
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **Build**: Vite ^5.0.0
- **Language**: TypeScript ^5.0.0
- **Testing**: Vitest ^1.0.0
- **Linting**: ESLint ^9.0.0, Prettier ^3.0.0
- **Runtime requirement**: Node.js 18+
- **Deploy target**: GitHub Pages — Vite outputs to `./dist`, Actions uploads from `./dist`
- **PWA**: `manifest.json` lives in `public/` (Vite copies it to `dist/` automatically)

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

- Enable `"strict": true` in tsconfig — no exceptions
- Build command is `tsc && vite build` — TS must compile cleanly first
- Run `npm run type-check` (tsc --noEmit) before every commit
- `src/logic.ts` — pure calculation functions only, zero DOM imports
- `src/ui.ts` — all DOM manipulation, imports from logic.ts and types.ts
- `src/types.ts` — all shared interfaces/types (e.g. `MileageStatus`)
- `src/main.ts` — entry point only; wires modules together, minimal logic
- Out-of-range dates must return a typed result, never `null` or `undefined`

### Framework-Specific Rules (Vite)

- `base: '/milrakt/'` is REQUIRED in vite.config.ts — app is on a GitHub Pages subpath
- `index.html` stays at project root — it is Vite's entry point
- Static assets (`manifest.json`, `icon.png`) go in `public/` — never in `src/`
- Do not remove Apple PWA meta tags from `index.html`
- Keep `theme-color` as `#0d1117` — must stay in sync across `index.html`, `manifest.json`, and CSS `--bg`

### Testing Rules (Vitest)

- Test files in `tests/` directory, pattern `*.test.ts`
- Only test `src/logic.ts` — no DOM/UI tests
- Required coverage for `calculateMileageStatus`: start date (0 mil), end date (3000 mil), midpoint (1500 mil), before-start (out-of-range), after-end (out-of-range), miles-per-week calculation
- Run with `npm run test` (vitest run) — not watch mode
- Tests must pass before any commit or PR

### Code Quality & Style Rules

- All colors via CSS variables — never hardcode hex in styles; palette: `--bg`, `--card`, `--border`, `--accent`, `--green`, `--orange`, `--red`, `--text`, `--muted`
- Fonts: `DM Mono` for body, `Playfair Display` for `h1` only — do not add or swap fonts
- All user-visible strings must be in **Swedish**
- TypeScript naming: `camelCase` for functions/variables, `PascalCase` for interfaces/types
- Source files: `camelCase.ts` (e.g. `logic.ts`, `main.ts`)
- ESLint scope: `eslint src` — only `src/` directory
- No inline styles after migration; all CSS in stylesheet

### Development Workflow Rules

- Branch naming: `feature/short-description`; merge to `main` auto-deploys to GitHub Pages
- Commit message format: conventional commits (`feat:`, `fix:`, `chore:`, `test:`)
- Local validation gate before push: `npm run type-check && npm run test && npm run build`
- Never edit `dist/` manually — it is generated output only
- Claude Desktop writes files; Claude Code CLI runs validation and git operations — don't mix roles

### Critical Don't-Miss Rules

- `base` in vite.config.ts MUST be `'/milrakt/'` — using `'/'` causes 404 on GitHub Pages
- Always parse date input as `new Date(val + 'T12:00:00')` — prevents timezone midnight-rollover bugs
- Do NOT add any UI framework (React, Vue, etc.) — project is intentionally vanilla TypeScript
- Contract constants (`START=2026-02-16`, `END=2029-02-16`, `TOTAL_MIL=3000`) are hardcoded — do not externalize without explicit request
- Progress bar color thresholds: <33% accent, 33–66% green, >66% orange — preserve exactly
- All mileage values display with 1 decimal place (`toFixed(1)`)
- No data storage, no API calls — pure client-side calculation only

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-03-27
