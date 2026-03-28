# Story 1.4: Mileage Display UI

Status: review

## Story

As a user,
I want to see my current mileage status when I open the app,
So that I know how my driving pace compares to the contract target.

## Acceptance Criteria

1. Target mileage shown formatted to 1 decimal place (e.g. "1234.5 mil")
2. Percentage complete shown (e.g. "41.2%")
3. Required pace shown (e.g. "12.3 mil/vecka")
4. Days remaining shown
5. All user-visible strings are in Swedish
6. Progress bar: `percentComplete < 33` → `var(--accent)`, `33–66` → `var(--green)`, `> 66` → `var(--orange)`
7. No hardcoded hex colour values — only CSS variables
8. `npm run type-check` zero errors, `npm run build` produces dist/

## Tasks / Subtasks

- [x] Implement `renderStatus(status: MileageStatus): void` in `src/ui.ts` (AC: 1–7)
  - [x] Read `#result` element and write HTML template
  - [x] Use `toFixed(1)` for all mileage values
  - [x] Apply bar colour using CSS variables based on `percentComplete` threshold
  - [x] Show `daysLeft` rounded to integer as a stat
  - [x] If `status.isOutOfRange` — render empty (Story 1.5 handles the message)
- [x] Implement `initUI()`: wire date picker and "Idag" button (AC: 1–5)
  - [x] Set today's date in `#datePicker` on load and call `renderStatus`
  - [x] Listen for `change` on `#datePicker`, re-render on change
  - [x] Listen for `click` on `.today-btn`, reset to today and re-render
- [x] Update `index.html`: remove `onclick="setToday()"` from `.today-btn` (module scripts can't call inline handlers)
- [x] Update `style.css`: add `.stats-row` layout and `margin-top` for stat area (AC: 7)
- [x] Validate: `npm run type-check` → zero errors (AC: 8)
- [x] Validate: `npm run build` → dist/ created (AC: 8)

## Dev Notes

### src/ui.ts — full implementation

```typescript
import { calculateMileageStatus } from './logic'
import type { MileageStatus } from './types'

function barColor(pct: number): string {
  if (pct < 33) return 'var(--accent)'
  if (pct < 66) return 'var(--green)'
  return 'var(--orange)'
}

export function renderStatus(status: MileageStatus): void {
  const el = document.getElementById('result')
  if (!el) return

  if (status.isOutOfRange) {
    el.innerHTML = '' // Story 1.5 fills this
    return
  }

  const color = barColor(status.percentComplete)

  el.innerHTML = `
    <div class="card">
      <div class="big-label">Du borde ha kört</div>
      <div class="big-number" style="color:${color}">${status.targetMileage.toFixed(1)}</div>
      <div class="big-label">mil av 3 000</div>

      <div class="bar-wrap">
        <div class="bar-fill" style="width:${status.percentComplete.toFixed(1)}%;background:${color}"></div>
      </div>
      <div class="bar-labels">
        <span>start</span>
        <span>${status.percentComplete.toFixed(1)}% av avtalet</span>
        <span>slut</span>
      </div>

      <div class="stats-row">
        <div class="stat">
          <div class="stat-val">${status.milesPerWeekNeeded.toFixed(1)}</div>
          <div class="stat-lbl">Mil/vecka kvar</div>
        </div>
        <div class="stat">
          <div class="stat-val">${Math.round(status.daysLeft)}</div>
          <div class="stat-lbl">Dagar kvar</div>
        </div>
      </div>
    </div>
    <p class="timeline-label">Avtalet löper ut 16 feb 2029</p>
  `
}

export function initUI(): void {
  const picker = document.getElementById('datePicker') as HTMLInputElement | null
  const todayBtn = document.querySelector<HTMLButtonElement>('.today-btn')

  function update(dateStr: string): void {
    const date = new Date(dateStr + 'T12:00:00')
    renderStatus(calculateMileageStatus(date))
  }

  function setToday(): void {
    const iso = new Date().toISOString().split('T')[0]
    if (picker) picker.value = iso
    update(iso)
  }

  picker?.addEventListener('change', () => update(picker.value))
  todayBtn?.addEventListener('click', setToday)

  setToday()
}
```

### style.css additions

Add at the bottom of style.css:

```css
.stats-row {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.stats-row .stat {
  flex: 1;
}
```

### index.html change

Remove `onclick="setToday()"` from the `.today-btn` button. Module scripts cannot call global functions from inline handlers. The event listener is wired in `ui.ts`.

Before: `<button class="today-btn" onclick="setToday()">Idag</button>`
After:  `<button class="today-btn">Idag</button>`

### Key rules

- `toFixed(1)` for ALL mileage values — targetMileage, percentComplete, milesPerWeekNeeded
- `Math.round(daysLeft)` for days — not toFixed
- Inline `style="color:${color}"` and `style="width:...;background:${color}"` use CSS variable strings (e.g. `var(--accent)`) — no hardcoded hex
- Date parsing in `initUI`: always `new Date(dateStr + 'T12:00:00')`

### No DOM tests

Testing `src/ui.ts` with DOM is not in scope (project-context.md: "Only test src/logic.ts — no DOM/UI tests"). No new test files needed.

### References

- [Source: architecture.md — Frontend Architecture, renderStatus guard pattern]
- [Source: epics.md — Story 1.4 Acceptance Criteria]
- [Source: project-context.md — Format Patterns, Testing Rules]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- `src/ui.ts`: Full implementation. `renderStatus` writes HTML template to `#result`. `initUI` wires date picker change + today button click, sets today on load.
- `index.html`: `onclick="setToday()"` removed — event listener wired in `initUI()` instead.
- `style.css`: `.stats-row` (flex, gap 8px, margin-top 12px) and `.stats-row .stat { flex: 1 }` added.
- Bar colour uses CSS variable strings (`var(--accent)` etc.) in inline style — no hardcoded hex.
- `daysLeft` shown as `Math.round()` integer; all mileage values use `toFixed(1)`.
- `npm run type-check` ✅, `npm run test` ✅ 6/6, `npm run build` ✅ JS bundle 2.68 kB.

### File List

- src/ui.ts (updated — full implementation)
- index.html (updated — onclick removed from .today-btn)
- style.css (updated — .stats-row layout added)
- _bmad-output/implementation-artifacts/1-4-mileage-display-ui.md (created)

### Change Log

- 2026-03-28: Implemented Story 1.4 — mileage display UI wired to date picker with progress bar and two stat cards.
