# milrakt — Claude Code Project Memory

## Vad är det här projektet?

En mobilanpassad PWA för att följa upp körsträcka vid privat elbilsleasing.
- **Avtal:** 3 000 mil, 2026-02-16 → 2029-02-16
- **Live:** https://carlgerhardsson.github.io/milrakt/
- **Deploy:** Automatisk via GitHub Actions vid push till `main`

---

## Viktiga filer att läsa före implementering

1. `_bmad-output/project-context.md` — 30 kritiska regler (LÄS ALLTID DENNA FÖRST)
2. `_bmad-output/planning-artifacts/architecture.md` — arkitekturbeslut och implementeringsordning
3. `STATUS.md` — aktuell sessionsstatus och nästa steg

---

## Nuvarande fas

Migrering från single-file `index.html` till Vite + TypeScript.
Arkitektur klar. Nästa steg: `bmad-create-epics-and-stories` → `bmad-dev-story`.
Se `STATUS.md` för exakt nästa steg.

---

## Rollfördelning — BMAD fullt flöde

- **Claude Code CLI (du):** Kör BMAD-planering, stories och implementering via `bmad-dev-story`
- **Claude Desktop:** Koordinerar, granskar, pushar till GitHub och skapar PR
- **Blanda inte rollerna** — implementering sker via `bmad-dev-story` i CLI, inte via Claude Desktop direkt

---

## BMAD-flöde för ny feature/migrering

1. `bmad-generate-project-context` — uppdatera projektkontexten vid behov
2. `bmad-create-architecture` — arkitekturbeslut (redan klart för denna migrering)
3. `bmad-create-epics-and-stories` — bryt ner i implementerbara stories
4. `git checkout -b feature/namn` — skapa feature-branch
5. `bmad-dev-story` — implementera en story i taget
6. Validera: `npm run type-check && npm run test && npm run build`
7. `git commit + push` → PR → merge → auto-deploy

---

## Kritiska regler (kortversion)

- `base: '/milrakt/'` i vite.config.ts — ALLTID, annars 404 på GitHub Pages
- `new Date(val + 'T12:00:00')` — undviker timezone-buggar vid datumparsning
- Svenska UI-texter, engelsk kod
- Inga UI-ramverk (React, Vue etc.) — vanilla TypeScript
- `isOutOfRange === true` → visa "Utanför avtalsperioden", dölj alla värden
- Validera alltid innan push: `npm run type-check && npm run test && npm run build`

---

## Workflow för ny session

1. Läs `STATUS.md` för att se var vi är
2. Läs `_bmad-output/project-context.md` för projektregler
3. Fortsätt med nästa steg i `STATUS.md`
