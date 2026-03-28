# Sessionsstatus — Milräknar-projektet
*Senast uppdaterad: 2026-03-28*

---

## ▶️ BÖRJA HÄR

**Fas:** Epics och stories med BMAD

I Claude Code CLI:
```
git checkout -b feature/vite-ts-migration
```

Sedan:
```
bmad-create-epics-and-stories
```

När stories är klara → kör `bmad-dev-story` för varje story i tur och ordning.
Efter varje story: validera med `npm run type-check && npm run test && npm run build`.

När allt är grönt → meddela Claude Desktop så skapar vi PR.

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
### architecture.md ✅ KLART — redo för implementering

---

## Återstående steg

1. ~~Installera Claude Code CLI~~ ✅
2. ~~Installera BMAD~~ ✅
3. ~~Generera project-context.md~~ ✅
4. ~~BMAD Arkitektur~~ ✅
5. **Skapa feature-branch** ⬅️ NÄSTA — `git checkout -b feature/vite-ts-migration`
6. **Epics och stories** — `bmad-create-epics-and-stories`
7. **Implementera** — `bmad-dev-story` för varje story
8. **Validera** — `npm run type-check && npm run test && npm run build`
9. **Deploya** — git push → PR → merge → GitHub Actions → Pages

---

## Nyckelarkitekturbeslut att minnas

- `MileageStatus` har `isOutOfRange: boolean` — Option A (enkel flagga)
- `isOutOfRange === true` → visa "Utanför avtalsperioden", dölj alla värden
- `base: '/milrakt/'` i vite.config.ts — ALLTID
- `new Date(val + 'T12:00:00')` — timezone-säker datumparsning
- Implementeringsordning: `types.ts` → `logic.ts` → `tests` → `ui.ts` → `main.ts`

---

## Arbetssätt — BMAD fullt flöde

| Roll | Verktyg | Ansvar |
|------|---------|--------|
| Planerare | Claude Code CLI + BMAD | Arkitektur, epics, stories, implementering |
| Koordinator | Claude Desktop | Granskning, PR, GitHub API, dokumentation |
| Bygglag | Claude Code CLI | type-check, test, build, git, push |
| CI/CD-robot | GitHub Actions | Bygg och deploy till Pages vid push |

---

## Viktiga filer

| Fil | Beskrivning |
|-----|-------------|
| `index.html` | Nuvarande app (ersätts vid migrering) |
| `PLAN-migrering.md` | Migreringsplan med BMAD fullt flöde |
| `PLAN-arbetssatt.md` | Det fullständiga arbetssättet |
| `_bmad-output/project-context.md` | 30 regler för AI-agenter |
| `_bmad-output/planning-artifacts/architecture.md` | Arkitekturdokument ✅ |
| `STATUS.md` | Denna fil |
| `CLAUDE.md` | Projektminne för Claude Code CLI |
| `.github/workflows/deploy.yml` | GitHub Actions deploy-pipeline |
