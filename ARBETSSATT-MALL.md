# Arbetssätt: Claude Desktop + Claude Code CLI + BMAD

> **Generell mall** — kopiera och anpassa till varje nytt projekt.
> Framtagen och kalibrerad under milrakt-projektet (mars 2026).

---

## Översikt

Detta arbetssätt kombinerar tre verktyg i tydligt avgränsade roller:

| Verktyg | Roll | Gör vad |
|---------|------|----------|
| **Claude Desktop** | Koordinator | Läser STATUS.md, uppdaterar dokumentation, skapar PR via GitHub API |
| **Claude Code CLI + BMAD** | Planerare + Bygglag | Arkitektur, epics, stories, implementering, validering, git |
| **GitHub Actions** | CI/CD-robot | Bygger och deployer automatiskt vid push/merge till `main` |

---

## Steg 1: Engångsinstallation (görs en gång per dator)

### 1a. Claude Desktop + Filesystem MCP

1. Installera Claude Desktop från https://claude.ai/download
2. Öppna konfigurationsfilen:
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Mac: `~/Library/Application Support/Claude/claude_desktop_config.json`
3. Lägg till Filesystem MCP:

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

4. Starta om Claude Desktop och verifiera i Settings → Developer.

### 1b. Claude Code CLI (native installer)

**Windows (PowerShell):**
```powershell
irm https://claude.ai/install.ps1 | iex
```

**Mac/Linux:**
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Verifiera i nytt terminalfonster:
```
claude --version
```

---

## Steg 2: Nytt projekt — första gången

### 2a. Skapa repo och klona lokalt

```bash
# Klona ditt nya repo
git clone https://github.com/DITTANVNAMN/DITT-REPO.git
cd DITT-REPO
```

### 2b. Installera BMAD i projektmappen

```bash
npx bmad-method install
```

Svara på frågorna:
- **Plats:** current directory
- **AI-verktyg:** Claude Code
- **Modul:** BMad Method
- **Språk (chatt):** English
- **Språk (dokument):** English
- **Output-mapp:** `_bmad-output`

### 2c. Skapa CLAUDE.md (projektminne för Claude Code CLI)

Skapa filen `CLAUDE.md` i projektmappen med detta innehall (anpassa efter projektet):

```markdown
# [PROJEKTNAMN] — Claude Code Project Memory

## Vad är det här projektet?
[Kort beskrivning]

## Viktiga filer att läsa före implementering
1. `_bmad-output/project-context.md` — projektregler (LÄS ALLTID DENNA FÖRST)
2. `_bmad-output/planning-artifacts/architecture.md` — arkitekturbeslut
3. `STATUS.md` — aktuell status och nästa steg

## GIT-REGLER — KRITISKT VIKTIGT

⚠️ PUSHA ALDRIG DIREKT TILL `main` ⚠️

Alla ändringar MUST följa:
1. `git checkout -b feature/kort-beskrivning`
2. Implementera och validera på branchen
3. `git push origin feature/kort-beskrivning`
4. Claude Desktop skapar PR — du mergar ALDRIG själv till main

## Rollfördelning
- **Claude Code CLI (du):** BMAD-planering, stories, implementering, validering, git på feature-branch
- **Claude Desktop:** Koordinerar, granskar, skapar PR via GitHub API

## BMAD-flöde för ny feature
1. `bmad-generate-project-context`
2. `bmad-create-architecture`
3. `bmad-create-epics-and-stories`
4. `git checkout -b feature/namn` — ALLTID före implementering
5. `bmad-check-implementation-readiness`
6. `bmad-sprint-planning`
7. `bmad-create-story` → `bmad-dev-story` → `bmad-code-review` (per story)
8. `git push origin feature/namn` → meddela Claude Desktop → PR skapas

## Workflow för ny session
1. Läs `STATUS.md`
2. Läs `_bmad-output/project-context.md`
3. Fortsätt med nästa steg i `STATUS.md`
```

### 2d. Skapa STATUS.md

Skapa `STATUS.md` i projektmappen. Använd detta som startmall:

```markdown
# Sessionsstatus — [PROJEKTNAMN]
*Senast uppdaterad: [DATUM]*

## ▶️ BÖRJA HÄR
**Fas:** [Beskriv vad som ska göras]
**Nästa steg:** [Exakt kommando]

## Miljö och verktyg
### Claude Desktop + Filesystem MCP ✅
### Claude Code CLI ✅ — [VERSION]
### BMAD ✅ — v6

## Återstående steg
1. [ ] bmad-generate-project-context
2. [ ] bmad-create-architecture
3. [ ] bmad-create-epics-and-stories
4. [ ] Implementera stories
5. [ ] Deploya

## Viktiga filer
| Fil | Beskrivning |
|-----|-------------|
| `STATUS.md` | Denna fil |
| `CLAUDE.md` | Projektminne för Claude Code CLI |
| `_bmad-output/project-context.md` | Projektregler |
```

---

## Steg 3: BMAD-flödet (varje ny feature eller migrering)

### Fas 1: Planering (Claude Code CLI)

```bash
cd /path/till/projektet
claude
```

I Claude Code CLI:
```
bmad-generate-project-context    # Skannar kodbasen, skapar projektkontext
bmad-create-architecture         # Arkitekturbeslut (interaktivt)
bmad-create-epics-and-stories    # Bryter ner i epics och stories
```

### Fas 2: Brånch och implementering (Claude Code CLI)

```bash
git checkout -b feature/kort-beskrivning
```

I Claude Code CLI:
```
bmad-check-implementation-readiness   # Validerar att allt är redo
bmad-sprint-planning                   # Skapar sprintplan

# För varje story (upprepa):
bmad-create-story    # Förbereder story med full kontext
bmad-dev-story       # Implementerar koden (ny session rekommenderas)
bmad-code-review     # Granskar implementationen
```

Validera efter varje story:
```bash
npm run type-check && npm run test && npm run build
```

### Fas 3: Push och PR (Claude Code CLI + Claude Desktop)

I Claude Code CLI:
```bash
git add .
git commit -m "feat: beskrivning"
git push origin feature/kort-beskrivning
```

I Claude Desktop: Be Claude skapa PR via GitHub API.

Du mergar PR:en på GitHub. GitHub Actions deployer automatiskt.

---

## Steg 4: Starta en ny session

Skriv detta i en ny Claude Desktop-chatt:
> "Läs STATUS.md i [PROJEKTNAMN]-projektet och fortsätt där vi slutade"

Claude Desktop läser STATUS.md via Filesystem MCP och är redo direkt.

I terminalen:
```bash
cd /path/till/projektet
claude
```

Claude Code CLI läser CLAUDE.md automatiskt och vet var ni är.

---

## Kalibrerade lärdomar (från milrakt-projektet)

Dessa är saker som inte fungerade automatiskt och krävde explicit dokumentation:

**1. BMAD pushar till main om inget annat sägs**
BMAD:s `bmad-dev-story` har ingen inbyggd kännedom om ditt git-workflow.
Lösning: Dokumentera git-reglerna explicit i CLAUDE.md med ⚠️-varning.

**2. Skapa branchen INNAN du kör bmad-dev-story**
Om branchen inte finns när BMAD börjar implementera pushar den till current branch (ofta main).
Lösning: `git checkout -b feature/namn` är steg 4 i flödet — INTE efter stories är klara.

**3. Ny Claude Code-session per story (rekommenderas)**
BMAD rekommenderar "fresh context window" före `bmad-dev-story`.
Lösning: Avsluta session med `Ctrl+C`, starta ny med `claude`, kör `bmad-dev-story`.

**4. CLAUDE.md måste fyllas i manuellt**
BMAD skapar CLAUDE.md men lämnar den tom.
Lösning: Fyll i den direkt efter BMAD-installation (se mall ovan).

**5. PRD är inte alltid nödvändigt**
BMAD frågar efter PRD vid arkitektur och stories. För väldefinierade migreringar/features
kan architecture.md användas som primär input istället.
Lösning: Svara "1" (proceed without PRD) när BMAD frågar.

---

## Filstruktur i ett nytt projekt

```
projektet/
├── .claude/
│   └── skills/              ← 43 BMAD-skills (skapas av npx bmad-method install)
├── .github/
│   └── workflows/
│       └── deploy.yml       ← CI/CD pipeline
├── _bmad/                   ← BMAD core (skapas automatiskt)
├── _bmad-output/
│   ├── project-context.md   ← projektregler för AI-agenter
│   └── planning-artifacts/
│       ├── architecture.md
│       ├── epics.md
│       └── [story-filer]/
├── docs/                    ← skapas av BMAD
├── src/                     ← din kod
├── CLAUDE.md                ← projektminne för Claude Code CLI
├── STATUS.md                ← sessionsstatus och nästa steg
└── ARBETSSATT-MALL.md       ← denna fil (referens)
```

---

## Snabbreferens — när används vad?

| Situation | Vem gör det | Kommando |
|-----------|-------------|----------|
| Starta ny session | Du | Skriv till Claude Desktop |
| Läsa projektets status | Claude Desktop | Läser STATUS.md |
| Planera ny feature | Claude Code CLI | `bmad-create-architecture` |
| Skriva stories | Claude Code CLI | `bmad-create-epics-and-stories` |
| Implementera kod | Claude Code CLI | `bmad-dev-story` |
| Validera kod | Claude Code CLI | `npm run type-check && test && build` |
| Git-operationer | Claude Code CLI | `git add/commit/push` |
| Skapa PR | Claude Desktop | Via GitHub API |
| Merge PR | Du | På GitHub.com |
| Uppdatera STATUS.md | Claude Desktop | Via GitHub API |
