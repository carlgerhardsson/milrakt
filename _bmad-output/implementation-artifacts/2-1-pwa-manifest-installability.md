# Story 2.1: PWA Manifest & Installability

Status: review

## Story

As a user,
I want to install the app on my phone's home screen,
So that I can access my mileage tracker like a native app.

## Acceptance Criteria

1. `public/manifest.json` exists with `name`, `short_name`, `start_url`, `display: standalone`, `theme_color`, and at least one icon
2. `theme_color` in `manifest.json` matches `--bg` in `style.css` (`#0d1117`) and `<meta name="theme-color">` in `index.html`
3. Apple PWA meta tags present in `index.html`: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon`
4. manifest link in `index.html` points to the correct Vite-served path

## Tasks / Subtasks

- [x] Verify `public/manifest.json` has all required fields (AC: 1, 2)
- [x] Verify `index.html` has all Apple PWA meta tags (AC: 3)
- [x] Verify manifest link in `index.html` uses `/milrakt/manifest.json` (AC: 4)
- [x] Validate: `npm run build` → dist/ contains manifest.json

## Dev Notes

This story is largely complete from Story 1.1. All required elements were put in place during the scaffold. This task is a verification pass.

**Verify these exist and are correct — do NOT change them unless something is wrong:**

`public/manifest.json` should contain:
- `"start_url": "/milrakt/"`
- `"display": "standalone"`
- `"theme_color": "#0d1117"` (matches `--bg` and `<meta name="theme-color">`)
- at least one icon entry

`index.html` should contain:
- `<meta name="apple-mobile-web-app-capable" content="yes">`
- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
- `<link rel="apple-touch-icon" href="icon.png">`
- `<link rel="manifest" href="/milrakt/manifest.json">`

If all present and correct, mark tasks done immediately.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Verification pass only — all required elements already in place from Story 1.1.
- `public/manifest.json`: has name, short_name, start_url `/milrakt/`, display standalone, theme_color `#0d1117`, icon entry.
- `index.html`: has apple-mobile-web-app-capable, apple-mobile-web-app-status-bar-style, apple-touch-icon, and manifest link `/milrakt/manifest.json`.
- theme_color `#0d1117` matches `--bg` in style.css and `<meta name="theme-color">` in index.html.
- No file changes needed.

### File List

(no changes — verification only)

### Change Log

- 2026-03-28: Story 2.1 verified complete — all PWA elements confirmed present from Story 1.1.
