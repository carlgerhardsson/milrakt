---
stepsCompleted: [1, 2, 3, 4]
status: 'complete'
completedAt: '2026-03-28'
inputDocuments:
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/project-context.md
  - PLAN-migrering.md
---

# milrakt - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for milrakt, decomposing the requirements from the Architecture document into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Implement `calculateMileageStatus(date: Date): MileageStatus` deriving `targetMileage`, `percentComplete`, `milesPerWeekNeeded`, `daysLeft` from constants START=2026-02-16, END=2029-02-16, TOTAL_MIL=3000
FR2: Display a progress bar with colour thresholds: <33% → accent, 33–66% → green, >66% → orange
FR3: Display all mileage values to 1 decimal place (`toFixed(1)`) with Swedish UI strings
FR4: Handle out-of-range dates with `isOutOfRange: true` — show "Utanför avtalsperioden", hide all values
FR5: App must be installable as a PWA (manifest.json, Apple meta tags, theme-color sync across 3 files)

### NonFunctional Requirements

NFR1: Zero data storage, zero API calls — pure client-side, fully offline-capable
NFR2: Strict TypeScript (`strict: true`) — `tsc` must compile cleanly before any build
NFR3: All tests must pass before any commit (`type-check && test && build` gate)
NFR4: Deploy to GitHub Pages at `/milrakt/` subpath via GitHub Actions on push to `main`
NFR5: No UI frameworks permitted — vanilla TypeScript only
NFR6: Node.js 18+ runtime requirement

### Additional Requirements

- ARCH1: Custom Vite scaffold (manual, not CLI-based) — `package.json` with scripts: `dev`, `build`, `type-check`, `test`, `lint`
- ARCH2: `base: '/milrakt/'` in `vite.config.ts` — required for GitHub Pages subpath
- ARCH3: Date parsing must use `new Date(val + 'T12:00:00')` everywhere — timezone safety constraint
- ARCH4: Strict module boundaries enforced (import table: types.ts ← logic.ts ← ui.ts ← main.ts)
- ARCH5: Test coverage must include 6 cases: start date, end date, midpoint, before-start, after-end, mil/week calculation
- ARCH6: All CSS colours via custom properties only — palette: `--bg`, `--card`, `--border`, `--accent`, `--green`, `--orange`, `--red`, `--text`, `--muted`
- ARCH7: Update `.github/workflows/deploy.yml` for Vite build (npm ci → npm run build → upload `./dist`)

### UX Design Requirements

N/A — no UX design document. Visual requirements are captured in FR2, FR3, FR4, and ARCH6.

### FR Coverage Map

FR1: Epic 1 — calculateMileageStatus core logic + types
FR2: Epic 1 — progress bar with colour thresholds
FR3: Epic 1 — Swedish UI, toFixed(1) display
FR4: Epic 1 — isOutOfRange guard + "Utanför avtalsperioden"
FR5: Epic 2 — PWA manifest, Apple meta tags, theme-color sync

## Epic List

### Epic 1: Working Mileage Tracker
Users can open the app and see accurate, real-time mileage tracking information — including target mileage, progress percentage, required pace, and days remaining — with correct edge case handling.
**FRs covered:** FR1, FR2, FR3, FR4
**Technical:** ARCH1, ARCH2, ARCH3, ARCH4, ARCH5, ARCH6

---

## Epic 1: Working Mileage Tracker

Users can open the app and see accurate, real-time mileage tracking information — including target mileage, progress percentage, required pace, and days remaining — with correct edge case handling.

### Story 1.1: Project Scaffold

As a developer,
I want a complete Vite + TypeScript project scaffold with all config files,
So that the project has a working build pipeline before any feature code is written.

**Acceptance Criteria:**

**Given** the repository has only `index.html`, `manifest.json`, and `.github/`
**When** the scaffold is created
**Then** the following files exist: `src/types.ts`, `src/logic.ts`, `src/ui.ts`, `src/main.ts`, `tests/logic.test.ts`, `public/manifest.json`, `index.html`, `style.css`, `vite.config.ts`, `tsconfig.json`, `eslint.config.js`, `package.json`
**And** `vite.config.ts` contains `base: '/milrakt/'`
**And** `tsconfig.json` has `"strict": true`
**And** `npm run type-check` completes with zero errors
**And** `npm run build` produces a `./dist` directory

### Story 1.2: Mileage Calculation Logic

As a developer,
I want `calculateMileageStatus(date: Date): MileageStatus` implemented with full test coverage,
So that the core business logic is correct and verified before any UI is built.

**Acceptance Criteria:**

**Given** `src/types.ts` exports `MileageStatus` with fields `targetMileage`, `percentComplete`, `milesPerWeekNeeded`, `daysLeft`, `isOutOfRange`
**When** `calculateMileageStatus` is called with the contract start date (2026-02-16)
**Then** it returns `targetMileage: 0`, `percentComplete: 0`, `isOutOfRange: false`

**Given** `calculateMileageStatus` is called with the contract end date (2029-02-16)
**When** the function runs
**Then** it returns `targetMileage: 3000`, `percentComplete: 100`, `isOutOfRange: false`

**Given** `calculateMileageStatus` is called with a date before 2026-02-16
**When** the function runs
**Then** it returns `isOutOfRange: true`

**Given** `calculateMileageStatus` is called with a date after 2029-02-16
**When** the function runs
**Then** it returns `isOutOfRange: true`

**Given** `calculateMileageStatus` is called with the contract midpoint (~2027-08-16)
**When** the function runs
**Then** it returns `targetMileage` close to 1500 and `percentComplete` close to 50

**And** all date strings are parsed as `new Date(val + 'T12:00:00')`
**And** `npm run test` passes with all 6 cases green
**And** `logic.ts` contains zero DOM imports

### Story 1.3: CSS Migration & Design Tokens

As a developer,
I want all styles migrated from inline/legacy to a clean stylesheet with CSS variables,
So that the visual design foundation is in place before any UI components are built.

**Acceptance Criteria:**

**Given** the `style.css` file exists
**When** the app renders
**Then** the full colour palette is defined as CSS variables: `--bg`, `--card`, `--border`, `--accent`, `--green`, `--orange`, `--red`, `--text`, `--muted`
**And** fonts are set: DM Mono for body, Playfair Display for `h1` only
**And** no inline styles exist in `index.html`
**And** no hardcoded hex colours exist anywhere in the codebase
**And** `npm run lint` passes with zero warnings

### Story 1.4: Mileage Display UI

As a user,
I want to see my current mileage status when I open the app,
So that I know how my driving pace compares to the contract target.

**Acceptance Criteria:**

**Given** the app loads on a date within the contract period
**When** the page renders
**Then** the target mileage is shown formatted to 1 decimal place (e.g. "1 234.5 mil")
**And** the percentage complete is shown (e.g. "41.2%")
**And** the required pace is shown (e.g. "12.3 mil/vecka")
**And** the days remaining is shown
**And** all user-visible strings are in Swedish
**And** no hex colour values appear in `style.css` — only CSS variables

**Given** the progress bar is rendered
**When** `percentComplete` is below 33%
**Then** the bar uses the `--accent` colour variable

**Given** the progress bar is rendered
**When** `percentComplete` is between 33% and 66%
**Then** the bar uses the `--green` colour variable

**Given** the progress bar is rendered
**When** `percentComplete` exceeds 66%
**Then** the bar uses the `--orange` colour variable

### Story 1.5: Out-of-Range Handling

As a user,
I want the app to handle dates outside the contract period gracefully,
So that I never see incorrect or misleading mileage data.

**Acceptance Criteria:**

**Given** the app is opened with a date before 2026-02-16 or after 2029-02-16
**When** the page renders
**Then** the text "Utanför avtalsperioden" is displayed
**And** no mileage values are shown
**And** the progress bar is hidden
**And** no error state or exception is thrown

**Given** `ui.ts` renders the status
**When** `status.isOutOfRange === true`
**Then** the render function returns early after showing the out-of-range message

---

## Epic 2: Deployable PWA on GitHub Pages
Users can install the app on their phone and access it at the live URL — deployed automatically when code is pushed to `main`.
**FRs covered:** FR5
**Technical:** ARCH2, ARCH7
**NFRs:** NFR1, NFR2, NFR3, NFR4

### Story 2.1: PWA Manifest & Installability

As a user,
I want to install the app on my phone's home screen,
So that I can access my mileage tracker like a native app.

**Acceptance Criteria:**

**Given** `public/manifest.json` exists
**When** the app is loaded in a browser
**Then** the manifest includes `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, and at least one icon
**And** `theme_color` in `manifest.json` matches `--bg` in `style.css` and the `<meta name="theme-color">` tag in `index.html`
**And** Apple PWA meta tags are present in `index.html`: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`
**And** the app is installable on iOS Safari and Android Chrome

### Story 2.2: CI/CD Pipeline & Live Deployment

As a developer,
I want pushing to `main` to automatically build and deploy the app to GitHub Pages,
So that the live URL always reflects the latest code without manual steps.

**Acceptance Criteria:**

**Given** `.github/workflows/deploy.yml` is updated for Vite
**When** code is pushed to `main`
**Then** GitHub Actions runs `npm ci`, then `npm run build`, then uploads `./dist`
**And** the live app at `https://carlgerhardsson.github.io/milrakt/` loads correctly
**And** all assets (JS, CSS, icons) load without 404 errors
**And** `vite.config.ts` has `base: '/milrakt/'`

**Given** the validation gate is enforced
**When** any story is committed
**Then** `npm run type-check && npm run test && npm run build` all pass before the commit is pushed
