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
- Claude Desktop är installerat på Windows
- Filesystem MCP är konfigurerat och **running** (verifierat i Settings → Developer)
- Repot är klonat lokalt till:
  `C:\Users\gerhardssonc\Projekt_med_Claude\milrakt`
- Config-fil: `C:\Users\gerhardssonc\AppData\Roaming\Claude\claude_desktop_config.json`
- Verifierat: Claude Desktop kan lista och läsa filer i projektmappen

### Claude Code CLI ⏳ EJ INSTALLERAT ÄNNU
- Nästa steg är att installera Claude Code CLI
- Kommando att köra i PowerShell:
  ```powershell
  npm install -g @anthropic-ai/claude-code
  claude --version
  claude login
  ```

---

## Planerade nästa steg

1. **Installera Claude Code CLI** (se ovan)
2. **Verifiera CLI** — navigera till projektmappen och starta `claude`
3. **Migrera till Vite + TypeScript** enligt `PLAN-migrering.md`
4. **Integrera API** för datahämtning (kommande feature)

---

## Arbetssätt (det nya)

| Roll | Verktyg | Ansvar |
|------|---------|--------|
| Arkitekt | Claude Desktop + Filesystem MCP | Design, krav, kod skriven till disk |
| Bygglag | Claude Code CLI i terminal | type-check, test, git, push |

Flöde:
1. Design i Claude Desktop → filer skrivs lokalt via MCP
2. Claude Code CLI kör `npm run type-check` + `npm run test`
3. Vid grönt: `git commit` + `git push` via CLI
4. GitHub Actions deployer automatiskt till Pages

---

## Viktiga filer i repot

| Fil | Beskrivning |
|-----|-------------|
| `index.html` | Hela appen (HTML/CSS/JS) |
| `manifest.json` | PWA-manifest för iPhone-hemskärm |
| `PLAN-arbetssatt.md` | Detaljerad plan för det nya arbetssättet |
| `PLAN-migrering.md` | Plan för migrering till Vite + TypeScript |
| `STATUS.md` | Denna fil — sessionsstatus |
| `.github/workflows/deploy.yml` | GitHub Actions deploy-pipeline |
