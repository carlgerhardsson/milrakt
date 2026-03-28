# Plan: Övergång till nytt arbetssätt

## Översikt

Detta dokument beskriver det professionella utvecklingsarbetsflödet med tre
samverkande roller:

- **Claude Desktop (Arkitekt)**: Kravställning, UI-design, affärslogik. Skriver filer direkt till disk via Filesystem MCP.
- **BMAD i Claude Code CLI (Planerare)**: Strukturerad planering med specialiserade AI-agenter — Arkitekt, PM, Analyst m.fl.
- **Claude Code CLI (Bygglag)**: Teknisk exekvering i lokal terminal. Kör tester, typkontroll, git och deploy.

---

## Steg 1: Förutsättningar

Kontrollera att följande är installerat på din dator:

```powershell
node --version    # Kräver Node.js 20+
npm --version
git --version
```

Om Node.js saknas: https://nodejs.org (välj LTS-versionen)

---

## Steg 2: Installera Claude Desktop

1. Ladda ner från https://claude.ai/download
2. Installera och logga in med ditt Anthropic-konto
3. Starta appen

---

## Steg 3: Konfigurera Filesystem MCP i Claude Desktop

Filesystem MCP låter Claude Desktop läsa och skriva filer direkt till din disk.

### 3a. Öppna konfigurationsfilen

Windows:
```
%APPDATA%\Claude\claude_desktop_config.json
```

### 3b. Lägg till Filesystem MCP

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\gerhardssonc\\Projekt_med_Claude"
      ]
    }
  }
}
```

### 3c. Starta om Claude Desktop

Stäng och öppna appen igen. Verifiera i Settings → Developer att Filesystem MCP är aktivt.

---

## Steg 4: Installera Claude Code CLI (native installer)

```powershell
irm https://claude.ai/install.ps1 | iex
```

Verifiera (i nytt terminalfönster efter omstart av VSCode):
```powershell
claude --version
```

---

## Steg 5: Installera BMAD i projektmappen

```powershell
cd C:\Users\gerhardssonc\Projekt_med_Claude\milrakt
npx bmad-method install
```

Installern ställer tre frågor:
- **Plats**: current directory
- **AI-verktyg**: Claude Code
- **Modul**: BMad Method

Verifiera att BMAD fungerar genom att starta Claude Code CLI och köra:
```
bmad-help
```

---

## Steg 6: Det fullständiga arbetsflödet

```
┌─────────────────────────────────────────────────────────────────┐
│                   FULLSTÄNDIGT ARBETSFLÖDE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. PLANERING (Claude Code CLI + BMAD)                          │
│     - Starta: claude (i projektmappen)                          │
│     - bmad-generate-project-context  ← dokumenterar kodbasen   │
│     - /architect                     ← BMAD Arkitekt-agent      │
│       Producerar: architecture doc + user stories               │
│                                                                 │
│  2. IMPLEMENTERING (Claude Desktop + Filesystem MCP)            │
│     - Krav och stories diskuteras här i chatten                 │
│     - Filer skrivs direkt till disk via Filesystem MCP          │
│                                                                 │
│  3. LOKAL VALIDERING (Claude Code CLI)                          │
│     - npm run type-check                                        │
│     - npm run test                                              │
│     - npm run build                                             │
│     - npm run lint                                              │
│     Fel → loop tillbaka till steg 2 tills 100% grönt            │
│                                                                 │
│  4. LEVERANS (Claude Code CLI)                                  │
│     - git add . && git commit -m "beskrivning"                  │
│     - git push origin feature/namn                              │
│     - PR skapas (av Claude Desktop via GitHub API)              │
│     - Merge → GitHub Actions deployer automatiskt till Pages    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Rollfördelning — sammanfattning

| Roll | Verktyg | Ansvar |
|------|---------|--------|
| Planerare | Claude Code CLI + BMAD | Arkitektur, stories, projektkontext |
| Arkitekt | Claude Desktop + Filesystem MCP | Design, krav, kod skriven till disk |
| Bygglag | Claude Code CLI | type-check, test, build, git, push |
| CI/CD-robot | GitHub Actions | Bygg och deploy till Pages vid push |

---

## Nästa steg

När detta arbetssätt är verifierat går vi vidare med
`PLAN-migrering.md` — migrering till Vite + TypeScript med BMAD som grund.
