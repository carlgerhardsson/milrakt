# Plan: Migrering till Vite + TypeScript

## Förutsättningar

Detta arbete utförs med BMAD:s fulla flöde enligt `PLAN-arbetssatt.md`.
Kontrollera att följande är klart innan du börjar:

- ✅ Claude Desktop + Filesystem MCP installerat och verifierat
- ✅ Claude Code CLI (v2.1.85+) installerat
- ✅ BMAD v6 installerat i projektmappen
- ✅ `_bmad-output/project-context.md` genererad (30 regler)
- ✅ `_bmad-output/planning-artifacts/architecture.md` klar

---

## Mål

Migrera appen från en enskild `index.html` till ett modernt projekt med:

- **Vite** — snabb lokal dev-server och produktionsbygge
- **TypeScript** — typkontroll och bättre kodkvalitet
- **Vitest** — enhetstester för affärslogik
- **ESLint + Prettier** — konsekvent kodstil
- Bibehållen deploy till **GitHub Pages** via befintlig Actions-pipeline

---

## Fas 1: Planering med BMAD ✅ KLAR

### Steg 1a: Generera projektkontexten ✅
`bmad-generate-project-context` → `_bmad-output/project-context.md`

### Steg 1b: Arkitektur ✅
`bmad-create-architecture` → `_bmad-output/planning-artifacts/architecture.md`

Nyckelarkitekturbeslut:
- `MileageStatus` med `isOutOfRange: boolean` (Option A)
- Strikt moduluppdelning: `types.ts` → `logic.ts` → `ui.ts` → `main.ts`
- `base: '/milrakt/'` i vite.config.ts — ALLTID
- `new Date(val + 'T12:00:00')` — timezone-säker datumparsning

---

## Fas 2: Stories med BMAD (Claude Code CLI) ⬅️ NÄSTA

### Steg 2a: Skapa feature-branch
```bash
git checkout -b feature/vite-ts-migration
```

### Steg 2b: Generera epics och stories
I Claude Code CLI:
```
bmad-create-epics-and-stories
```

BMAD bryter ner migreringen i implementerbara stories baserat på
arkitekturdokumentets 10-stegs implementeringssekvens.

Stories sparas i `_bmad-output/planning-artifacts/`.

---

## Fas 3: Implementering med BMAD Dev-agent (Claude Code CLI)

### Steg 3a: Implementera story för story
I Claude Code CLI:
```
bmad-dev-story
```

BMAD Dev-agenten:
- Läser architecture.md och project-context.md
- Implementerar en story i taget
- Följer implementeringsordningen: `types.ts` → `logic.ts` → `tests` → `ui.ts` → `main.ts` → CSS → config

### Steg 3b: Validera efter varje story
```bash
npm run type-check
npm run test
npm run build
```

Om något misslyckas: BMAD Dev-agenten åtgärdar → kör om → loop tills 100% grönt.

---

## Fas 4: Leverans (Claude Code CLI + GitHub)

### Steg 4a: Push
```bash
git add .
git commit -m "feat: migrate to Vite + TypeScript"
git push origin feature/vite-ts-migration
```

### Steg 4b: Pull Request
Claude Desktop skapar PR via GitHub API. Du granskar och mergar på GitHub.

### Steg 4c: Automatisk deploy
Vid merge till `main` triggar GitHub Actions:
1. `npm ci`
2. `npm run build` → bygger till `/dist`
3. Deployer `/dist` till GitHub Pages

Verifiera på: https://carlgerhardsson.github.io/milrakt/

### Steg 4d: Städa upp
```bash
git branch -d feature/vite-ts-migration
git push origin --delete feature/vite-ts-migration
```

---

## Filstruktur efter migrering

```
milrakt/
├── .github/workflows/deploy.yml   ← uppdaterad för Vite-bygge
├── src/
│   ├── types.ts                   ← MileageStatus interface
│   ├── logic.ts                   ← calculateMileageStatus()
│   ├── ui.ts                      ← renderStatus()
│   └── main.ts                    ← DOMContentLoaded entry point
├── tests/
│   └── logic.test.ts              ← enhetstester
├── public/
│   ├── manifest.json
│   └── icons/
├── index.html                     ← Vite entry point
├── style.css
├── vite.config.ts                 ← base: '/milrakt/'
├── tsconfig.json                  ← strict: true
├── eslint.config.js
└── package.json
```

---

## Efter migreringen

Med Vite + TypeScript + Vitest + BMAD på plats är projektet redo för nästa
utvecklingssteg: API-integration, fler features och utökad testning —
allt planerat och implementerat via BMAD:s fulla flöde.
