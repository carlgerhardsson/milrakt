# Story 1.5: Out-of-Range Handling

Status: review

## Story

As a user,
I want the app to handle dates outside the contract period gracefully,
So that I never see incorrect or misleading mileage data.

## Acceptance Criteria

1. When date is before 2026-02-16 or after 2029-02-16, "Utanför avtalsperioden" is displayed
2. No mileage values are shown for out-of-range dates
3. The progress bar is hidden for out-of-range dates
4. No error state or exception is thrown
5. In `ui.ts`, when `status.isOutOfRange === true`, the render function shows the message and returns early

## Tasks / Subtasks

- [x] Update `renderStatus` in `src/ui.ts`: replace empty `innerHTML` with out-of-range card (AC: 1–5)
- [x] Validate: `npm run type-check` → zero errors
- [x] Validate: `npm run test` → all 6 tests still pass
- [x] Validate: `npm run build` → dist/ created

## Dev Notes

### Change needed in src/ui.ts

The current `isOutOfRange` branch in `renderStatus` sets `el.innerHTML = ''`. Replace it:

```typescript
if (status.isOutOfRange) {
  el.innerHTML = `<div class="card outside-range">Utanför avtalsperioden</div>`
  return
}
```

The `.outside-range` class is already defined in `style.css`:
```css
.outside-range {
  text-align: center;
  padding: 24px;
  color: var(--muted);
  font-size: 0.85rem;
}
```

No other files need to change. `calculateMileageStatus` already returns `isOutOfRange: true` with safe zero values — `ui.ts` just needs to render the message instead of nothing.

### References

- [Source: architecture.md — Process Patterns, Out-of-Range Rendering]
- [Source: epics.md — Story 1.5 Acceptance Criteria]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Single line change in `renderStatus`: replaced `el.innerHTML = ''` with the out-of-range card.
- `.outside-range` class was already in `style.css` from Story 1.3 — no CSS changes needed.
- `npm run type-check` ✅, `npm run test` ✅ 6/6, `npm run build` ✅

### File List

- src/ui.ts (updated — out-of-range message)

### Change Log

- 2026-03-28: Implemented Story 1.5 — "Utanför avtalsperioden" shown for out-of-range dates.
