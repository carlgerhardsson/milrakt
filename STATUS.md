# Sessionsstatus — Milräknar-projektet
*Senast uppdaterad: 2026-10-28 (🛡️ säkerhetsuppdatering #2, se nedan — ingen funktionell ändring). Föregående: 2026-03-28*

---

## 🛡️ SÄKERHETSUPPDATERINGAR (2026-10-26 – 2026-10-28, Säkerhetsvakten)
Gjord utanför feature-flödet, godkänd och mergad av Carl. **Ingen applogik ändrad.**

| PR | Ändring | Läge |
|----|---------|------|
| #1 | Deploy-workflow **Node 20 → 22** + `check-latest: true` (Node 20 är EOL, Brotli CVE-2026-111497). `npm audit fix` utan major: 2 kritiska + 6 höga → 2 kritiska + 1 hög | Mergad 2026-10-26, Pages-deploy grön |
| #2 | Ny `.github/dependabot.yml`: veckovis bevakning av **npm** (minor/patch i en grupp-PR, major separat) och **GitHub Actions** (en grupp-PR). Ingen kod ändrad | Mergad 2026-10-28 |

- **Produktionskoden har 0 sårbarheter.** Appen har inga runtime-beroenden.
- **Kvar i utvecklingsverktygen:** vitest 1 / tinypool (kritiska) och vite 5 (hög). Rättningen kräver **vite 8 + vitest 5** (major), som i `carlgerhardsson/lonessystem` #44 och `carlgerhardsson/musikspelet-live` #180. Gör det gärna innan Volvo API-arbetet börjar.
- **Dependabot är nu på (#2):** räkna med veckovisa Dependabot-PR:er för npm och GitHub Actions (t.ex. `actions/checkout@v4`, `setup-node@v4`). Majorhöjningar (vite 8 / vitest 5) kommer som egna PR:er och kräver test före merge. Dependabots *security updates* i repo-inställningarna är fortfarande avstängda.

**Säkerhetsvakten** kör vardagar 07:46 och uppdaterar den här sektionen när en säkerhets-PR mergats. Minne och fyndlista: `carlgerhardsson/sakerhetsvakt` (`status.md`).

---

## ▶️ BÖRJA HÄR

**Migreringen till Vite + TypeScript är KLAR och live.**

Nästa feature: **Volvo API-integration** — se `PLAN-volvo-api.md`

**Manuella förberedelser innan vi kan starta:**
- [ ] Registrera app på https://developer.volvocars.com — notera VCC API Key, Client ID, Client Secret
- [ ] Notera ditt VIN (finns i Volvo-appen)
- [ ] Sätt upp GCP-projekt med Secret Manager och Service Account (se Steg C i PLAN-volvo-api.md)

**När förberedelserna är klara — öppna ny chatt och skriv:**
> "Läs PLAN-volvo-api.md i milrakt och starta feature/volvo-api med BMAD"

---

## Vad vi har byggt

En mobilanpassad PWA för att följa upp körsträcka vid privat elbilsleasing.

- **Avtal:** 3 000 mil över 3 år, från 16 feb 2026 till 16 feb 2029
- **Live URL:** https://carlgerhardsson.github.io/milrakt/
- **Repo:** https://github.com/carlgerhardsson/milrakt
- **Stack:** Vite + TypeScript + Vitest + GitHub Actions

---

## Miljö och verktyg

### Claude Desktop + Filesystem MCP ✅
### Claude Code CLI ✅ — v2.1.85
### BMAD ✅ — v6, 43 skills
### Vite + TypeScript-migrering ✅ — live på GitHub Pages

---

## Feature-historik

| Feature | Status | Arkitektur |
|---------|--------|------------|
| Vite + TypeScript-migrering | ✅ KLAR | GitHub Pages |
| Volvo API-integration | ⏳ Planerad | GitHub Pages + Google Cloud Functions |
| Custom domän (valfri) | 💡 Framtida | TBD |

---

## Viktiga filer

| Fil | Beskrivning |
|-----|-------------|
| `PLAN-volvo-api.md` | Plan för Volvo API med GCP ⏳ |
| `PLAN-migrering.md` | Genomförd Vite-migrering ✅ |
| `ARBETSSATT-MALL.md` | Generell mall för nya projekt |
| `CLAUDE.md` | Projektminne för Claude Code CLI |
| `_bmad-output/project-context.md` | 30 regler för AI-agenter |
| `_bmad-output/planning-artifacts/architecture.md` | Vite-arkitektur ✅ |
