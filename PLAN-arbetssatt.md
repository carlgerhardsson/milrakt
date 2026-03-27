# Plan: Övergång till nytt arbetssätt

## Översikt

Detta dokument beskriver hur vi ställer in och övergår till ett professionellt
utvecklingsarbetsflöde med två separata roller:

- **Claude Desktop (Arkitekt)**: Kravställning, UI-design, affärslogik. Skriver filer direkt till disk via Filesystem MCP.
- **Claude Code CLI (Bygglag)**: Teknisk exekvering i lokal terminal. Kör tester och typkontroll lokalt.

---

## Steg 1: Förutsättningar

Kontrollera att följande är installerat på din dator:

```bash
node --version    # Kräver Node.js 18+
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

Mac:
```bash
open ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

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
        "/FULL/PATH/TILL/DIN/PROJEKTMAPP"
      ]
    }
  }
}
```

Byt ut `/FULL/PATH/TILL/DIN/PROJEKTMAPP` mot den faktiska sökvägen där du
vill ha projektet, t.ex. `/Users/carl/projekt/milrakt`.

### 3c. Klona repot till den mappen

```bash
git clone https://github.com/carlgerhardsson/milrakt.git /Users/carl/projekt/milrakt
```

### 3d. Starta om Claude Desktop

Stäng och öppna appen igen. Du ska nu se en liten ikon/indikator som visar
att Filesystem MCP är aktivt.

---

## Steg 4: Installera Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

Verifiera:
```bash
claude --version
```

Logga in:
```bash
claude login
```

---

## Steg 5: Verifiera att allt fungerar

### Testa Claude Desktop + Filesystem MCP
Öppna Claude Desktop och skriv:
> "Lista filerna i mitt milrakt-projekt"

Claude ska kunna se och lista filer utan att du kopierar någon kod.

### Testa Claude Code CLI
Navigera till projektmappen och starta:
```bash
cd /Users/carl/projekt/milrakt
claude
```

Skriv:
> "Visa mig filstrukturen i detta projekt"

Fungerar båda → du är klar.

---

## Steg 6: Det nya arbetsflödet i praktiken

```
┌─────────────────────────────────────────────────────────┐
│                   NYTT ARBETSFLÖDE                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. DESIGN & IMPLEMENTERING (Claude Desktop)            │
│     - Krav diskuteras och fastställs                    │
│     - UI och affärslogik designas                       │
│     - Filer skrivs direkt till disk via Filesystem MCP  │
│                                                         │
│  2. LOKAL VALIDERING (Claude Code CLI)                  │
│     - cd till projektmappen                             │
│     - Starta: claude                                    │
│     - Be CLI-agenten köra: npm run type-check           │
│     - Be CLI-agenten köra: npm run test                 │
│     - Eventuella fel åtgärdas i loop tills 100% grönt   │
│                                                         │
│  3. DEPLOYMENT (Claude Code CLI)                        │
│     - git checkout -b feature/namn                      │
│     - git add . && git commit -m "beskrivning"          │
│     - git push origin feature/namn                      │
│     - GitHub Actions deployer automatiskt till Pages    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Nästa steg

När detta arbetssätt är verifierat och fungerar lokalt går vi vidare med
`PLAN-migrering.md` — migrering till Vite + TypeScript med detta
arbetssätt som grund.
