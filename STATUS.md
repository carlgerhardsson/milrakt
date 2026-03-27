# Sessionsstatus — Milräknar-projektet
*Senast uppdaterad: 2026-03-27*

---

## ▶️ BÖRJA HÄR IMORGON

**Fas:** Arkitektur med BMAD
**Steg:** Kör `bmad-create-architecture` i Claude Code CLI

```powershell
cd C:\Users\gerhardssonc\Projekt_med_Claude\milrakt
claude
```

Skriv sedan i Claude Code-sessionen:
```
bmad-create-architecture
```

BMAD Arkitekt-agenten läser `_bmad-output/project-context.md` automatiskt och
producerar ett arkitekturdokument för Vite + TypeScript-migreringen.

När arkitekturdokumentet är klart: meddela Claude Desktop (denna chatt) så
tar vi över och börjar implementera filerna via Filesystem MCP.

---

## Vad vi har byggt

En mobilanpassad webbapp för att följa upp körsträcka vid privat elbilsleasing.

- **Avtal:** 3 000 mil över 3 år, från 16 feb 2026 till 16 feb 2029
- **Live URL:** https://carlgerhardsson.github.io/milrakt/
- **Repo:** https://github.com/carlgerhardsson/milrakt
- **Deploy:** Automatisk via GitHub Actions vid push till main

---

## Miljö och verktyg — STATUS

### Claude Desktop + Filesystem MCP ✅ KLART
- Filesystem MCP konfigurerat och running
- Projektmapp: `C:\Users\gerhardssonc\Projekt_med_Claude\milrakt`

### Claude Code CLI ✅ KLART
- Version: **2.1.85** (native installer)
- Binär: `C:\Users\gerhardssonc\.local\bin\claude.exe`

### BMAD ✅ KLART
- Version: **v6**, 43 skills under `.claude/skills/`
- Konfiguration: Calle / English / English / `_bmad-output`

### project-context.md ✅ KLART
- Fil: `_bmad-output/project-context.md`
- 30 regler, 7 kategorier
- Täcker: stack, TypeScript, Vite, Vitest, kodstil, workflow, anti-patterns

---

## Återstående steg för migreringen

4. **BMAD Arkitektur** ⬅️ NÄSTA — `bmad-create-architecture` i Claude Code CLI
5. **Feature-branch** — `git checkout -b feature/vite-ts-migration`
6. **Implementera** — Claude Desktop skriver filer via Filesystem MCP
7. **Validera** — `npm run type-check && npm run test && npm run build`
8. **Deploya** — git push → PR → merge → GitHub Actions → Pages

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
| `index.html` | Hela appen (HTML/CSS/JS) |
| `manifest.json` | PWA-manifest för iPhone-hemskärm |
| `PLAN-arbetssatt.md` | Det fullständiga arbetssättet inkl. BMAD |
| `PLAN-migrering.md` | Plan för migrering till Vite + TypeScript med BMAD |
| `STATUS.md` | Denna fil — sessionsstatus |
| `.github/workflows/deploy.yml` | GitHub Actions deploy-pipeline |
| `_bmad/` | BMAD core och modul-konfiguration |
| `.claude/skills/` | 43 BMAD-skills för Claude Code |
| `_bmad-output/project-context.md` | Projektkontext för alla AI-agenter (30 regler) |
