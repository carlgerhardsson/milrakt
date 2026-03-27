# Plan: Migrering till Vite + TypeScript

## Förutsättningar

Detta arbete utförs med det nya arbetssättet enligt `PLAN-arbetssatt.md`.
Kontrollera att Claude Desktop (Filesystem MCP) och Claude Code CLI är
konfigurerade och verifierade innan du börjar.

---

## Mål

Migrera appen från en enskild `index.html` till ett modernt projekt med:

- **Vite** — snabb lokal dev-server och produktionsbygge
- **TypeScript** — typkontroll och bättre kodkvalitet
- **Vitest** — enhetstester för affärslogik
- **ESLint + Prettier** — konsekvent kodstil
- Bibehållen deploy till **GitHub Pages** via befintlig Actions-pipeline

---

## Steg 1: Skapa ny branch (Claude Code CLI)

```bash
git checkout -b feature/vite-ts-migration
```

---

## Steg 2: Initiera Vite-projekt (Claude Desktop → disk)

Claude Desktop skapar följande filstruktur via Filesystem MCP:

```
milrakt/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← uppdateras för Vite-bygge
├── src/
│   ├── main.ts                 ← ingångspunkt (ersätter index.html JS)
│   ├── logic.ts                ← affärslogik (datumberäkningar)
│   ├── ui.ts                   ← DOM-manipulering
│   └── types.ts                ← TypeScript-typer
├── public/
│   ├── manifest.json           ← flyttas hit
│   └── icons/                  ← app-ikoner
├── tests/
│   └── logic.test.ts           ← enhetstester
├── index.html                  ← Vite-mall (refererar src/main.ts)
├── vite.config.ts
├── tsconfig.json
├── eslint.config.js
├── package.json
└── README.md
```

---

## Steg 3: Installera beroenden (Claude Code CLI)

```bash
npm install
```

Paket som ingår i `package.json`:

```json
{
  "devDependencies": {
    "vite": "^5.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "@types/node": "^20.0.0"
  }
}
```

Skript i `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src"
  }
}
```

---

## Steg 4: Flytta affärslogik till TypeScript (Claude Desktop → disk)

All datumberäkningslogik extraheras från `index.html` till `src/logic.ts`
med strikta TypeScript-typer:

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

---

## Steg 5: Skriv enhetstester (Claude Desktop → disk)

`tests/logic.test.ts` täcker:

- Startdatum (16 feb 2026) → 0 mil
- Slutdatum (16 feb 2029) → 3000 mil
- Mitt i avtalet → 1500 mil
- Datum utanför avtalsperioden → felhantering
- Beräkning av mil/vecka-tempo

---

## Steg 6: Lokal validering (Claude Code CLI)

```bash
npm run type-check   # Noll TypeScript-fel
npm run test         # Alla tester gröna
npm run build        # Produktionsbygge lyckas
npm run lint         # Inga lint-varningar
```

Om något misslyckas: åtgärdas av Claude Desktop via Filesystem MCP → 
CLI kör om → loop tills 100% grönt.

---

## Steg 7: Uppdatera GitHub Actions (Claude Desktop → disk)

`.github/workflows/deploy.yml` uppdateras för att bygga med Vite:

```yaml
- name: Install dependencies
  run: npm ci

- name: Build
  run: npm run build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v3
  with:
    path: './dist'          ← Vite bygger till /dist
```

---

## Steg 8: Push och deploy (Claude Code CLI)

```bash
git add .
git commit -m "feat: migrate to Vite + TypeScript"
git push origin feature/vite-ts-migration
```

Skapa Pull Request på GitHub, granska, merga till `main`.
GitHub Actions deployer automatiskt till Pages.

Verifiera på: https://carlgerhardsson.github.io/milrakt/

---

## Steg 9: Städa upp

```bash
git branch -d feature/vite-ts-migration
git push origin --delete feature/vite-ts-migration
```

Ta bort den gamla `index.html` om den inte längre behövs som rot.

---

## Efter migreringen

Med Vite + TypeScript + Vitest på plats är projektet redo för nästa
utvecklingssteg: API-integration, fler features och utökad testning —
allt i ett robust, typsäkert ramverk.
