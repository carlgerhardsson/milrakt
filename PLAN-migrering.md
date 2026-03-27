# Plan: Migrering till Vite + TypeScript

## Förutsättningar

Detta arbete utförs med det fullständiga arbetssättet enligt `PLAN-arbetssatt.md`.
Kontrollera att följande är klart innan du börjar:

- ✅ Claude Desktop + Filesystem MCP installerat och verifierat
- ✅ Claude Code CLI (v2.1.85+) installerat
- ✅ BMAD installerat i projektmappen (`npx bmad-method install`)

---

## Mål

Migrera appen från en enskild `index.html` till ett modernt projekt med:

- **Vite** — snabb lokal dev-server och produktionsbygge
- **TypeScript** — typkontroll och bättre kodkvalitet
- **Vitest** — enhetstester för affärslogik
- **ESLint + Prettier** — konsekvent kodstil
- Bibehållen deploy till **GitHub Pages** via befintlig Actions-pipeline

---

## Fas 1: Planering med BMAD (Claude Code CLI)

### Steg 1a: Generera projektkontexet

Starta Claude Code CLI i projektmappen:
```powershell
cd C:\Users\gerhardssonc\Projekt_med_Claude\milrakt
claude
```

Kör:
```
bmad-generate-project-context
```

BMAD skannar kodbasen och skapar `_bmad-output/project-context.md` som
dokumenterar nuvarande stack, mönster och konventioner.

### Steg 1b: Arkitektur och stories med BMAD Arkitekt

I Claude Code CLI:
```
/architect
```

BMAD Arkitekt-agenten läser projektkontexten och producerar:
- `_bmad-output/architecture.md` — teknisk arkitektur för Vite + TypeScript
- `_bmad-output/stories/` — user stories för migreringen

### Steg 1c: Skapa feature-branch (Claude Code CLI)

```bash
git checkout -b feature/vite-ts-migration
```

---

## Fas 2: Implementering (Claude Desktop → disk)

### Steg 2a: Filstruktur

Claude Desktop skapar följande via Filesystem MCP, baserat på
arkitekturdokumentet från BMAD:

```
milrakt/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← uppdateras för Vite-bygge
├── src/
│   ├── main.ts                 ← ingångspunkt
│   ├── logic.ts                ← affärslogik (datumberäkningar)
│   ├── ui.ts                   ← DOM-manipulering
│   └── types.ts                ← TypeScript-typer
├── public/
│   ├── manifest.json           ← flyttas hit
│   └── icons/
├── tests/
│   └── logic.test.ts           ← enhetstester
├── index.html                  ← Vite-mall
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── package.json
└── README.md
```

### Steg 2b: Affärslogik i TypeScript

```typescript
// src/types.ts
export interface MileageStatus {
  targetMileage: number;       // Mil du borde ha kört
  percentComplete: number;     // Andel av avtalet
  milesPerWeekNeeded: number;  // Tempo att hålla framöver
  daysLeft: number;
}

// src/logic.ts
export function calculateMileageStatus(date: Date): MileageStatus { ... }
```

### Steg 2c: Enhetstester

`tests/logic.test.ts` täcker:
- Startdatum (16 feb 2026) → 0 mil
- Slutdatum (16 feb 2029) → 3000 mil
- Mitt i avtalet → 1500 mil
- Datum utanför avtalsperioden → felhantering
- Beräkning av mil/vecka-tempo

---

## Fas 3: Lokal validering (Claude Code CLI)

```bash
npm install
npm run type-check   # Noll TypeScript-fel
npm run test         # Alla tester gröna
npm run build        # Produktionsbygge lyckas
npm run lint         # Inga lint-varningar
```

Om något misslyckas: rapporteras till Claude Desktop → åtgärdas via
Filesystem MCP → CLI kör om → loop tills 100% grönt.

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

## Efter migreringen

Med Vite + TypeScript + Vitest + BMAD på plats är projektet redo för nästa
utvecklingssteg: API-integration, fler features och utökad testning —
allt i ett robust, typsäkert och välplanerat ramverk.
