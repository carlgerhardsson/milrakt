# milrakt — Claude Code Project Memory

## Vad är det här projektet?

En mobilanpassad PWA för att följa upp körsträcka vid privat elbilsleasing.
- **Avtal:** 3 000 mil, 2026-02-16 → 2029-02-16
- **Live:** https://carlgerhardsson.github.io/milrakt/
- **Stack:** Vite + TypeScript + Vitest + GitHub Actions
- **Nästa feature:** Volvo API via Google Cloud Functions

---

## Viktiga filer att läsa före implementering

1. `_bmad-output/project-context.md` — projektregler (LÄS ALLTID DENNA FÖRST)
2. `STATUS.md` — aktuell status och nästa steg
3. `PLAN-volvo-api.md` — plan för nästa feature (Volvo API)

---

## GIT-REGLER — KRITISKT VIKTIGT

⚠️ PUSHA ALDRIG DIREKT TILL `main` ⚠️

Alla kodändringar MÅSTE följa detta flöde:
1. `git checkout -b feature/kort-beskrivning` — ALLTID före implementering
2. Implementera och validera på feature-branchen
3. `git push origin feature/kort-beskrivning`
4. Claude Desktop skapar PR — du mergar ALDRIG själv till main

---

## Rollfördelning

- **Claude Code CLI (du):** BMAD-planering, implementering, validering, git på feature-branch
- **Claude Desktop:** Koordinerar, granskar, skapar PR via GitHub API

---

## BMAD-flöde för ny feature

1. `bmad-generate-project-context` — uppdatera projektkontexten
2. `bmad-create-architecture` — arkitekturbeslut
3. `bmad-create-epics-and-stories` — bryt ner i stories
4. `git checkout -b feature/namn` — ALLTID före implementering
5. `bmad-check-implementation-readiness`
6. `bmad-sprint-planning`
7. Per story: `bmad-create-story` → `bmad-dev-story` → `bmad-code-review`
8. `git push origin feature/namn` → meddela Claude Desktop → PR skapas

---

## Arkitektur — nuvarande stack

**Frontend:** Vanilla TypeScript + Vite, deployas till GitHub Pages
- `src/types.ts` — interfaces (MileageStatus, VehicleData, ComparisonResult)
- `src/logic.ts` — ren beräkningslogik, noll DOM-beroenden
- `src/ui.ts` — all DOM-manipulation
- `src/main.ts` — entry point, minimal logik

**Backend (kommande):** Google Cloud Functions i europe-north1
- `functions/src/auth/login.ts` — OAuth2-start
- `functions/src/auth/callback.ts` — OAuth2-callback
- `functions/src/odometer.ts` — hämtar mätarställning från Volvo

**Secrets:** Google Secret Manager (aldrig i kod eller miljövariabler)

---

## Kritiska kodingregler

- `base: '/milrakt/'` i vite.config.ts — ALLTID, annars 404 på GitHub Pages
- `new Date(val + 'T12:00:00')` — timezone-säker datumparsning
- Svenska UI-texter, engelsk kod och kommentarer
- Inga UI-ramverk (React, Vue etc.) — vanilla TypeScript
- `isOutOfRange === true` → visa "Utanför avtalsperioden", dölj alla värden
- Validera alltid: `npm run type-check && npm run test && npm run build`
- CORS-header krävs i Cloud Functions mot `https://carlgerhardsson.github.io`

---

## Workflow för ny session

1. Läs `STATUS.md`
2. Läs `_bmad-output/project-context.md`
3. Fortsätt med nästa steg i `STATUS.md`
