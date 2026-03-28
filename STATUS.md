# Sessionsstatus — Milräknar-projektet
*Senast uppdaterad: 2026-03-28*

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
