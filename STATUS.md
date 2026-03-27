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
- PATH tillagd i User Environment Variables
- Verifierat: `claude --version` returnerar `2.1.85 (Claude Code)`

### BMAD ⏳ INSTALLERAS NU
- Kommando att köra i projektmappen:
  ```powershell
  cd C:\Users\gerhardssonc\Projekt_med_Claude\milrakt
  npx bmad-method install
  ```
- Välj: current directory / Claude Code / BMad Method
- Verifiera efteråt med: `bmad-help` inne i `claude`

---

## Planerade nästa steg

1. ~~Installera Claude Code CLI~~ ✅
2. **Installera BMAD** ⏳ (pågår)
3. **Verifiera BMAD** — starta `claude` i projektmappen och kör `bmad-help`
4. **Migrera till Vite + TypeScript** enligt `PLAN-migrering.md` (med BMAD)
5. **Integrera API** för datahämtning (kommande feature)

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
