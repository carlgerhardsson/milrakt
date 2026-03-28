# Sessionsstatus — Milräknar-projektet
*Senast uppdaterad: 2026-03-28*

---

## ▶️ BÖRJA HÄR

**Fas:** Implementering — Phase 4 (BMAD fullt flöde)

I Claude Code CLI (på feature/vite-ts-migration):
```
bmad-check-implementation-readiness
```
Sedan:
```
bmad-sprint-planning
```
Sedan story för story:
```
bmad-create-story
bmad-dev-story
bmad-code-review
```
Validera efter varje story: `npm run type-check && npm run test && npm run build`

När alla 7 stories är gröna → meddela Claude Desktop så skapar vi PR.

---

## Vad vi har byggt

En mobilanpassad PWA för att följa upp körsträcka vid privat elbilsleasing.

- **Avtal:** 3 000 mil över 3 år, från 16 feb 2026 till 16 feb 2029
- **Live URL:** https://carlgerhardsson.github.io/milrakt/
- **Repo:** https://github.com/carlgerhardsson/milrakt
- **Deploy:** Automatisk via GitHub Actions vid push till main

---

## Miljö och verktyg — STATUS

### Claude Desktop + Filesystem MCP ✅ KLART
### Claude Code CLI ✅ KLART — v2.1.85
### BMAD ✅ KLART — v6, 43 skills
### project-context.md ✅ KLART — 30 regler, 7 kategorier
### architecture.md ✅ KLART
### epics.md ✅ KLART — 2 epics, 7 stories

---

## Återstående steg

1. ~~Installera Claude Code CLI~~ ✅
2. ~~Installera BMAD~~ ✅
3. ~~Generera project-context.md~~ ✅
4. ~~BMAD Arkitektur~~ ✅
5. ~~Skapa feature-branch~~ ✅ `feature/vite-ts-migration`
6. ~~Epics och stories~~ ✅ 2 epics, 7 stories
7. **Check Implementation Readiness** ⬅️ NÄSTA — `bmad-check-implementation-readiness`
8. **Sprint Planning** — `bmad-sprint-planning`
9. **Implementera** — `bmad-create-story` → `bmad-dev-story` → `bmad-code-review` × 7
10. **Deploya** — git push → PR → merge → GitHub Actions → Pages

---

## Stories att implementera (i ordning)

| Story | Titel | Status |
|-------|-------|--------|
| 1.1 | Project Scaffold | ⏳ |
| 1.2 | Mileage Calculation Logic | ⏳ |
| 1.3 | Mileage Display UI | ⏳ |
| 1.4 | Out-of-range Handling | ⏳ |
| 1.5 | CSS Migration & Design Tokens | ⏳ |
| 2.1 | PWA Manifest & Installability | ⏳ |
| 2.2 | CI/CD Pipeline & Live Deployment | ⏳ |

---

## Nyckelarkitekturbeslut att minnas

- `MileageStatus` har `isOutOfRange: boolean` — Option A (enkel flagga)
- `isOutOfRange === true` → visa "Utanför avtalsperioden", dölj alla värden
- `base: '/milrakt/'` i vite.config.ts — ALLTID
- `new Date(val + 'T12:00:00')` — timezone-säker datumparsning
- Implementeringsordning: `types.ts` → `logic.ts` → `tests` → `ui.ts` → `main.ts`

---

## Rollfördelning — VIKTIGT

| Roll | Verktyg | Ansvar |
|------|---------|--------|
| Planerare/Bygglag | Claude Code CLI + BMAD | Epics, stories, implementering, git, push |
| Koordinator | Claude Desktop | STATUS.md, PR, granskning |
| CI/CD-robot | GitHub Actions | Bygg och deploy vid push till main |

**Regel:** Claude Code CLI gör alla git-operationer och all implementering.
Claude Desktop uppdaterar bara STATUS.md och skapar PR.

---

## Viktiga filer

| Fil | Beskrivning |
|-----|-------------|
| `_bmad-output/project-context.md` | 30 regler för AI-agenter |
| `_bmad-output/planning-artifacts/architecture.md` | Arkitekturdokument ✅ |
| `_bmad-output/planning-artifacts/epics.md` | 2 epics, 7 stories ✅ |
| `PLAN-migrering.md` | Migreringsplan med BMAD fullt flöde |
| `CLAUDE.md` | Projektminne för Claude Code CLI |
| `STATUS.md` | Denna fil |
| `.github/workflows/deploy.yml` | GitHub Actions deploy-pipeline |
