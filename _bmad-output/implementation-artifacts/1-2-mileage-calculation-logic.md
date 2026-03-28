# Story 1.2: Mileage Calculation Logic

Status: review

## Story

As a developer,
I want `calculateMileageStatus(date: Date): MileageStatus` implemented with full test coverage,
So that the core business logic is correct and verified before any UI is built.

## Acceptance Criteria

1. `calculateMileageStatus(new Date('2026-02-16T12:00:00'))` returns `targetMileage: 0`, `percentComplete: 0`, `isOutOfRange: false`
2. `calculateMileageStatus(new Date('2029-02-16T12:00:00'))` returns `targetMileage: 3000`, `percentComplete: 100`, `isOutOfRange: false`
3. `calculateMileageStatus(new Date('2026-01-01T12:00:00'))` (before start) returns `isOutOfRange: true`
4. `calculateMileageStatus(new Date('2029-03-01T12:00:00'))` (after end) returns `isOutOfRange: true`
5. `calculateMileageStatus` called with the midpoint (~2027-08-16) returns `targetMileage` close to 1500 and `percentComplete` close to 50
6. `milesPerWeekNeeded` is correctly calculated as `(TOTAL_MIL - targetMileage) / (daysLeft / 7)`
7. `npm run test` passes with all 6 cases green
8. `src/logic.ts` contains zero DOM imports

## Tasks / Subtasks

- [x] Implement `calculateMileageStatus` in `src/logic.ts` (AC: 1–6, 8)
  - [x] Define constants `START_DATE`, `END_DATE`, `TOTAL_MIL`, `TOTAL_DAYS` using `T12:00:00` format
  - [x] Return `{ ...allZeros, isOutOfRange: true }` when date is before START_DATE or after END_DATE
  - [x] Calculate `targetMileage`, `percentComplete`, `daysLeft`, `milesPerWeekNeeded` for in-range dates
- [x] Write full test suite in `tests/logic.test.ts` replacing the `it.todo` placeholder (AC: 1–7)
  - [x] Test: start date → targetMileage=0, percentComplete=0, isOutOfRange=false
  - [x] Test: end date → targetMileage=3000, percentComplete=100, isOutOfRange=false
  - [x] Test: midpoint (~2027-08-16) → targetMileage≈1500, percentComplete≈50
  - [x] Test: before start → isOutOfRange=true
  - [x] Test: after end → isOutOfRange=true
  - [x] Test: milesPerWeekNeeded calculation is correct for a known in-range date
- [x] Validate: `npm run type-check` → zero errors
- [x] Validate: `npm run test` → all 6 tests pass
- [x] Validate: `npm run build` → dist/ still builds cleanly

## Dev Notes

### Critical Constraints

- **Date parsing**: ALL date constants use `new Date('YYYY-MM-DDT12:00:00')` — never bare `new Date('YYYY-MM-DD')`. This prevents timezone midnight-rollover bugs.
- **Zero DOM imports in logic.ts**: `document`, `window`, and all DOM APIs are FORBIDDEN. Pure functions only.
- **Out-of-range must return a full typed MileageStatus**, never `null` or throwing. Set `isOutOfRange: true` and return safe zero values for all numeric fields.
- **`noUnusedLocals` and `noUnusedParameters` are enabled** in tsconfig — all parameters and variables must be used or prefixed with `_`.

### Implementation

#### Constants (SCREAMING_SNAKE_CASE)

```typescript
const START_DATE = new Date('2026-02-16T12:00:00')
const END_DATE = new Date('2029-02-16T12:00:00')
const TOTAL_MIL = 3000
const TOTAL_DAYS = (END_DATE.getTime() - START_DATE.getTime()) / 86400000
```

#### Calculation logic (from original index.html — proven correct)

```typescript
const daysPassed = (date.getTime() - START_DATE.getTime()) / 86400000
const daysLeft = TOTAL_DAYS - daysPassed
const targetMileage = (daysPassed / TOTAL_DAYS) * TOTAL_MIL
const percentComplete = (daysPassed / TOTAL_DAYS) * 100
const weeksLeft = daysLeft / 7
const milesPerWeekNeeded = (TOTAL_MIL - targetMileage) / weeksLeft
```

#### Out-of-range guard (check FIRST)

```typescript
if (date < START_DATE || date > END_DATE) {
  return { targetMileage: 0, percentComplete: 0, milesPerWeekNeeded: 0, daysLeft: 0, isOutOfRange: true }
}
```

### Test Approach

Tests are in `tests/logic.test.ts` using Vitest. Replace the `it.todo` placeholder entirely.

Use `expect(value).toBeCloseTo(expected, precision)` for floating-point comparisons (midpoint test). Use `expect(value).toBe(expected)` for exact integer/boolean comparisons.

**Required 6 test cases:**

| # | Input date | Key assertion |
|---|---|---|
| 1 | 2026-02-16T12:00:00 (start) | targetMileage=0, percentComplete=0, isOutOfRange=false |
| 2 | 2029-02-16T12:00:00 (end) | targetMileage=3000, percentComplete=100, isOutOfRange=false |
| 3 | 2027-08-16T12:00:00 (midpoint) | targetMileage≈1500, percentComplete≈50 |
| 4 | 2026-01-01T12:00:00 (before start) | isOutOfRange=true |
| 5 | 2030-01-01T12:00:00 (after end) | isOutOfRange=true |
| 6 | Any in-range date | milesPerWeekNeeded = (3000 - targetMileage) / (daysLeft / 7) |

### Previous Story Learning

- The `tests/logic.test.ts` currently has an `it.todo` placeholder and imports `{ describe, it }` from vitest. Replace the entire file contents — do not try to add to the existing structure.
- `src/logic.ts` currently exports a stub that always returns all-zeros. Replace the function body completely.
- `src/types.ts` is already correct and complete — do NOT modify it.

### Module Import Boundary

`src/logic.ts` may ONLY import from `./types`. No other imports permitted.

### References

- [Source: architecture.md — Implementation Patterns, Constants, Date Parsing]
- [Source: architecture.md — Module Boundaries]
- [Source: epics.md — Story 1.2 Acceptance Criteria]
- [Source: project-context.md — Testing Rules, Critical Don't-Miss Rules]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- Midpoint test (2027-08-16): `toBeCloseTo(1500, 0)` (±0.5) was too tight — actual value is 1494.4 due to leap years in the 3-year period. Fixed to use `toBeGreaterThan(1480)` / `toBeLessThan(1520)` which correctly captures "approximately 1500".

### Completion Notes List

- `src/logic.ts`: Full implementation with `START_DATE`, `END_DATE`, `TOTAL_MIL`, `TOTAL_DAYS` constants (all using T12:00:00 format). Out-of-range guard returns safe zeros + `isOutOfRange: true`. In-range path calculates all 5 MileageStatus fields.
- `tests/logic.test.ts`: All 6 required test cases passing. Replaced `it.todo` placeholder entirely.
- `src/types.ts` unchanged — interface was already complete from Story 1.1.
- `npm run type-check` — ✅ zero errors
- `npm run test` — ✅ 6/6 passing
- `npm run build` — ✅ dist/ produced

### File List

- src/logic.ts (updated — full implementation)
- tests/logic.test.ts (updated — full test suite replacing it.todo placeholder)

### Change Log

- 2026-03-28: Implemented Story 1.2 — calculateMileageStatus fully implemented with 6-case test coverage.
