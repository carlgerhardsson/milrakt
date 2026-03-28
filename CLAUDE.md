# milrakt — Claude Code Project Memory

## Vad är det här projektet?

En mobilanpassad PWA för att följa upp körsträcka vid privat elbilsleasing.
- **Avtal:** 3 000 mil, 2026-02-16 → 2029-02-16
- **Live:** https://carlgerhardsson.github.io/milrakt/
- **Deploy:** Automatisk via GitHub Actions vid push till `main`

---

## Viktiga filer att läsa före implementering

1. `_bmad-output/project-context.md` — 30 kritiska regler för detta projekt (LÄS ALLTID DENNA FÖRST)
2. `PLAN-migrering.md` — plan för Vite + TypeScript-migreringen
3. `STATUS.md` — aktuell sessionsstatus och nästa steg

---

## Nuvarande fas

Migrering från single-file `index.html` till Vite + TypeScript.
Se `STATUS.md` för exakt nästa steg.

---

## Rollfördelning

- **Claude Code CLI (du):** Kör BMAD-planering, validering (type-check/test/build) och git-operationer
- **Claude Desktop:** Skriver kod och filer till disk via Filesystem MCP
- **Blanda inte rollerna** — kör inte git-kommandon om Claude Desktop bad dig implementera, och vice versa

---

## Kritiska regler (kortversion)

- `base: '/milrakt/'` i vite.config.ts — ALLTID, annars 404 på GitHub Pages
- `new Date(val + 'T12:00:00')` — undviker timezone-buggar vid datumparser
- Svenska UI-texter, engelsk kod
- Inga UI-ramverk (React, Vue etc.) — vanilla TypeScript
- Validera alltid innan push: `npm run type-check && npm run test && npm run build`

---

## Workflow för ny session

1. Läs `STATUS.md` för att se var vi är
2. Läs `_bmad-output/project-context.md` för projektregler
3. Fortsätt med nästa steg i `STATUS.md`
