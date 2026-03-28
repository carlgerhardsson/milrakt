# Sessionsstatus — Milräknar-projektet
*Senast uppdaterad: 2026-03-28*

---

## ▶️ BÖRJA HÄR

**Fas:** Implementering
**Nästa steg:** Skapa feature-branch och börja skriva kod

I Claude Code CLI:
```
git checkout -b feature/vite-ts-migration
```

Sedan: meddela Claude Desktop (denna chatt) — så tar vi över och implementerar
alla filer via Filesystem MCP, baserat på architecture.md.

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
6. **Implementera** — Claude Desktop skriver alla filer via Filesystem MCP
7. **Validera** — `npm run type-check && npm run test && npm run build`
8. **Deploya** — git push → PR → merge → GitHub Actions → Pages

---

## Nyckelarkitekturbeslut att minnas

- `MileageStatus` har `isOutOfRange: boolean` — Option A (enkel flagga)
- `isOutOfRange === true` → visa "Utanför avtalsperioden", dölj alla värden
- `base: '/milrakt/'` i vite.config.ts — ALLTID
- `new Date(val + 'T12:00:00')` — timezone-säker datumparsning
- Implementeringsordning: `types.ts` → `logic.ts` → `tests` → `ui.ts` → `main.ts`

---

## Arbetssätt

| Roll | Verktyg | Ansvar |
|------|---------|--------|
| Planerare | Claude Code CLI + BMAD | Arkitektur, stories, projektkontext |
| Arkitekt | Claude Desktop + Filesystem MCP | Design, krav, kod skriven till disk |
| Bygglag | Claude Code CLI | type-check, test, build, git, push |
| CI/CD-robot | GitHub Actions | Bygg och deploy till Pages vid push |

---

## Viktiga filer

| Fil | Beskrivning |
|-----|-------------|
| `index.html` | Nuvarande app (ersätts vid migrering) |
| `PLAN-migrering.md` | Migreringsplan |
| `_bmad-output/project-context.md` | 30 regler för AI-agenter |
| `_bmad-output/planning-artifacts/architecture.md` | Arkitekturdokument ✅ KLART |
| `STATUS.md` | Denna fil |
| `.github/workflows/deploy.yml` | GitHub Actions deploy-pipeline |
