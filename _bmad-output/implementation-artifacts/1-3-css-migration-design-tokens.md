# Story 1.3: CSS Migration & Design Tokens

Status: review

## Story

As a developer,
I want all styles migrated from inline/legacy to a clean stylesheet with CSS variables,
So that the visual design foundation is in place before any UI components are built.

## Acceptance Criteria

1. `style.css` defines the full colour palette as CSS variables: `--bg`, `--card`, `--border`, `--accent`, `--green`, `--orange`, `--red`, `--text`, `--muted`
2. Fonts are set: DM Mono for body, Playfair Display for `h1` only (loaded via Google Fonts in index.html — already present)
3. No inline styles exist in `index.html`
4. No hardcoded hex colours exist anywhere in the codebase
5. `npm run build` still produces a `./dist` directory cleanly
6. `npm run lint` passes with zero errors

## Tasks / Subtasks

- [x] Populate `style.css` with all CSS from the original inline `<style>` block (AC: 1, 2, 4)
  - [x] Define `:root` with full CSS variable palette
  - [x] Migrate all selectors: reset, body, .container, h1, .subtitle, .card, .date-row, input[type="date"], .today-btn, .big-number, .big-label, .bar-wrap, .bar-fill, .bar-labels, .stat, .stat-val, .stat-lbl, .outside-range, .timeline-label
  - [x] Ensure all colour values use CSS variables — no hardcoded hex
- [x] Verify `index.html` has no `<style>` blocks or `style=""` attributes (AC: 3)
- [x] Validate: `npm run build` → dist/ created cleanly (AC: 5)
- [x] Validate: `npm run lint` → zero errors (AC: 6)

## Dev Notes

### What to do

`style.css` is currently a placeholder comment. Populate it with all the CSS that was removed from `index.html` in Story 1.1. The exact CSS is known from the original file — reproduce it faithfully with one rule: **all colour values must use CSS variables, not hardcoded hex**.

`index.html` currently has no `<style>` block (removed in Story 1.1) — just verify no `style=""` attributes snuck in.

### Exact CSS to write

```css
:root {
  --bg: #0d1117;
  --card: #161b22;
  --border: #30363d;
  --accent: #58a6ff;
  --green: #3fb950;
  --orange: #d29922;
  --red: #f85149;
  --text: #e6edf3;
  --muted: #8b949e;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Mono', monospace;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
}

.container {
  width: 100%;
  max-width: 380px;
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  letter-spacing: -0.02em;
  margin-bottom: 4px;
  background: linear-gradient(135deg, var(--accent), #a5d6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 0.72rem;
  color: var(--muted);
  margin-bottom: 28px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.date-row label {
  font-size: 0.72rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
}

input[type="date"] {
  flex: 1;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-family: 'DM Mono', monospace;
  font-size: 0.9rem;
  padding: 10px 12px;
  outline: none;
  transition: border-color 0.2s;
  -webkit-appearance: none;
  appearance: none;
  color-scheme: dark;
}

input[type="date"]:focus {
  border-color: var(--accent);
}

.today-btn {
  background: var(--border);
  border: none;
  border-radius: 8px;
  color: var(--text);
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  padding: 10px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.today-btn:active { background: var(--accent); color: var(--bg); }

.big-number {
  font-size: 3.5rem;
  font-weight: 500;
  line-height: 1;
  margin: 8px 0 4px;
  letter-spacing: -0.03em;
}

.big-label {
  font-size: 0.7rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 20px;
}

.bar-wrap {
  background: var(--bg);
  border-radius: 6px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 8px;
}

.bar-fill {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease, background 0.3s;
}

.bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: var(--muted);
}

.stat {
  background: var(--bg);
  border-radius: 8px;
  padding: 12px;
}

.stat-val {
  font-size: 1.3rem;
  font-weight: 500;
}

.stat-lbl {
  font-size: 0.62rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-top: 3px;
}

.outside-range {
  text-align: center;
  padding: 24px;
  color: var(--muted);
  font-size: 0.85rem;
}

.timeline-label {
  font-size: 0.68rem;
  color: var(--muted);
  text-align: center;
  margin-top: 6px;
}
```

### One deviation from original

`.today-btn:active` originally had `color: #000` — replace with `color: var(--bg)` since `--bg` is `#0d1117`. This keeps the design intent (dark text on accent background) while eliminating the only hardcoded hex that wasn't a variable.

The `h1` gradient uses `#a5d6ff` as the end stop of the linear-gradient. This is a one-off tint value (not in the palette) — it is acceptable to keep it as-is since there is no corresponding CSS variable, and it is purely decorative.

### No tests needed

CSS has no unit tests. Validation is visual (`npm run build` + browser check) and lint (`npm run lint`).

### References

- [Source: architecture.md — Styling Solution, CSS custom properties palette]
- [Source: project-context.md — Code Quality & Style Rules]
- [Source: epics.md — Story 1.3 Acceptance Criteria]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- `style.css` populated with all 20 selectors from the original inline `<style>` block.
- All colour values use CSS variables. One intentional deviation: `.today-btn:active` `color: #000` replaced with `color: var(--bg)` to eliminate the only hardcoded hex not already a variable.
- `h1` gradient retains `#a5d6ff` end-stop — no corresponding palette variable exists; acceptable as a one-off decorative tint.
- `index.html` confirmed clean: no `<style>` blocks, no `style=""` attributes.
- `npm run build` ✅ — CSS bundle grew from 0.00 kB → 2.49 kB (styles included).
- `npm run lint` ✅ — zero errors.

### File List

- style.css (updated — full stylesheet replacing placeholder)
- _bmad-output/implementation-artifacts/1-3-css-migration-design-tokens.md (created)

### Change Log

- 2026-03-28: Implemented Story 1.3 — all styles migrated from inline to style.css with CSS variables.
