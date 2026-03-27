# Sessionsstatus — Milräknar-projektet
*Senast uppdaterad: 2026-03-27*

---

## Vad vi har byggt

En mobilanpassad webbapp för att följa upp körsträcka vid privat elbilsleasing.

- **Avtal:** 3 000 mil över 3 år, från 16 feb 2026 till 16 feb 2029
- **Live URL:** https://carlgerhardsson.github.io/milrakt/
- **Repo:** https://github.com/carlgerhardsson/milrakt
- **Deploy:** Automatisk via GitHub Actions vid push till main

Appen visar hur många mil man borde ha kört på ett givet datum, samt vilket tempo (mil/vecka) som krävs framöver.

---

## Miljö och verktyg — STATUS

### Claude Desktop + Filesystem MCP ✅ KLART
- Claude Desktop installerat på Windows
- Filesystem MCP konfigurerat och **running** (verifierat i Settings → Developer)
- Repot klonat lokalt till:
  `C:\Users\gerhardssonc\Projekt_med_Claude\milrakt`
- Config-fil: `C:\Users\gerhardssonc\AppData\Roaming\Claude\claude_desktop_config.json`

### Claude Code CLI ✅ KLART
- Version: **2.1.85** (native installer)
- Installerat via: `irm https://claude.ai/install.ps1 | iex`
- Binär: `C:\Users\gerhardssonc\.local\bin\claude.exe`
- Verifierat: `claude --version` returnerar `2.1.85 (Claude Code)`

### BMAD ✅ KLART
- Version: **v6** (stable release)
- Installerat via: `npx bmad-method install` i projektmappen
- Konfiguration: Namn: Calle / Chattspråk: English / Dokumentspråk: English
- 43 skills installerade under `.claude/skills/`

### project-context.md ✅ KLART
- Genererad via `bmad-generate-project-context` i Claude Code CLI
- Fil: `_bmad-output/project-context.md`
- 30 regler, 7 kategorier — täcker stack, TypeScript, Vite, Vitest, kodstil, workflow och anti-patterns
- Alla BMAD-agenter läser denna fil före implementering

---

## Planerade nästa steg

1. ~~Installera Claude Code CLI~~ ✅
2. ~~Installera BMAD~~ ✅
3. ~~Generera project-context.md~~ ✅
4. **Skapa feature-branch** `feature/vite-ts-migration`
5. **BMAD Arkitekt** — kör `bmad-create-architecture` i Claude Code CLI
6. **Implementera** med Claude Desktop via Filesystem MCP
7. **Validera** med Claude Code CLI (type-check, test, build)
8. **Deploya** via git push → GitHub Actions → Pages

---

## Arbetssätt

| Roll | Verktyg | Ansvar |
|------|---------|--------|
| Planerare | Claude Code CLI + BMAD | Arkitektur, stories, projektkontext |
| Arkitekt | Claude Desktop + Filesystem MCP | Design, krav, kod skriven till disk |
| Bygglag | Claude Code CLI | type-check, test, build, git, push |
| CI/CD-robot | GitHub Actions | Bygg och deploy till Pages vid push |

---

## Viktiga filer i repot

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
