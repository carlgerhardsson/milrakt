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
- Konfiguration:
  - Namn: Calle
  - Chattspråk: English
  - Dokumentspråk: English
  - Output-mapp: `_bmad-output`
- Installerade filer:
  - `_bmad/` — BMAD core + BMad Method-modul
  - `_bmad-output/` — planning-artifacts, implementation-artifacts
  - `.claude/skills/` — **43 skills** för Claude Code
  - `docs/` — projektdokumentation
- Viktiga skills: `bmad-help`, `bmad-generate-project-context`, `bmad-create-architecture`, `bmad-agent-architect`, `bmad-create-prd`, `bmad-create-epics-and-stories`, `bmad-dev-story`

---

## Planerade nästa steg

1. ~~Installera Claude Code CLI~~ ✅
2. ~~Installera BMAD~~ ✅
3. **Starta migreringen** — kör `bmad-generate-project-context` i Claude Code CLI
4. **BMAD Arkitekt** — kör `/bmad-create-architecture` för Vite + TypeScript-migreringen
5. **Implementera** med Claude Desktop via Filesystem MCP
6. **Validera** med Claude Code CLI (type-check, test, build)
7. **Deploya** via git push → GitHub Actions → Pages

---

## Arbetssätt

| Roll | Verktyg | Ansvar |
|------|---------|--------|
| Planerare | Claude Code CLI + BMAD | Arkitektur, stories, projektkontext |
| Arkitekt | Claude Desktop + Filesystem MCP | Design, krav, kod skriven till disk |
| Bygglag | Claude Code CLI | type-check, test, build, git, push |
| CI/CD-robot | GitHub Actions | Bygg och deploy till Pages vid push |

Flöde:
1. **BMAD planerar** → architecture doc + user stories skapas lokalt
2. **Claude Desktop implementerar** → filer skrivs via Filesystem MCP
3. **Claude Code CLI validerar** → type-check + test + build
4. **Vid grönt** → git commit + push via CLI
5. **GitHub Actions deployer** automatiskt till Pages

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
