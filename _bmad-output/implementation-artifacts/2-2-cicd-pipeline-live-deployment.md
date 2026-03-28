# Story 2.2: CI/CD Pipeline & Live Deployment

Status: review

## Story

As a developer,
I want pushing to `main` to automatically build and deploy the app to GitHub Pages,
So that the live URL always reflects the latest code without manual steps.

## Acceptance Criteria

1. `.github/workflows/deploy.yml` runs `npm ci`, then `npm run build`, then uploads `./dist`
2. The live app at `https://carlgerhardsson.github.io/milrakt/` loads correctly
3. All assets (JS, CSS, icons) load without 404 errors
4. `vite.config.ts` has `base: '/milrakt/'`

## Tasks / Subtasks

- [x] Update `.github/workflows/deploy.yml` to add Node.js setup, `npm ci`, `npm run build`, and upload `./dist` (AC: 1)
- [x] Validate: `npm run build` → dist/ produced locally (AC: 1)
- [x] Validate: `vite.config.ts` confirms `base: '/milrakt/'` (AC: 4)

## Dev Notes

### Exact workflow change

Replace the current workflow (which uploads repo root) with one that builds first:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Key changes from current workflow:
- Add Node.js 20 setup with npm cache
- Add `npm ci` install step
- Add `npm run build` step
- Change upload path from `'.'` to `'./dist'`
- Remove `enablement: true` from configure-pages (not needed after initial setup)

### Critical: base path

`vite.config.ts` MUST have `base: '/milrakt/'` — already confirmed in place from Story 1.1.
Without this, all JS/CSS assets will 404 on GitHub Pages.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

### Completion Notes List

- Added Node.js 20 setup with npm cache, `npm ci`, and `npm run build` steps.
- Changed upload path from `'.'` (repo root) to `'./dist'` (Vite output).
- Removed `enablement: true` from configure-pages (not needed after initial setup).
- `vite.config.ts` confirmed: `base: '/milrakt/'` — assets will load correctly on GitHub Pages subpath.
- Local `npm run build` ✅ confirms dist/ is produced correctly.

### File List

- .github/workflows/deploy.yml (updated — Node.js + Vite build pipeline)

### Change Log

- 2026-03-28: Implemented Story 2.2 — deploy workflow updated to build with Vite and upload ./dist.
