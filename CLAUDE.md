# milrakt — Claude Code Project Memory

## Vad är det här projektet?

En mobilanpassad PWA för att följa upp körsträcka vid privat elbilsleasing.
- **Avtal:** 3 000 mil, 2026-02-16 → 2029-02-16
- **Live:** https://carlgerhardsson.github.io/milrakt/
- **Deploy:** Automatisk via GitHub Actions vid push till `main`

---

## Viktiga filer att läsa före implementering

1. `_bmad-output/project-context.md` — 30 kritiska regler (LÄS ALLTID DENNA FÖRST)
2. `_bmad-output/planning-artifacts/architecture.md` — arkitekturbeslut och implementeringsordning
3. `STATUS.md` — aktuell sessionsstatus och nästa steg

---

## Nuvarande fas

Migrering till Vite + TypeScript — KLAR ✅
Se `STATUS.md` för nästa feature.

---

## GIT-REGLER — KRITISKT VIKTIGT

⚠️ PUSHA ALDRIG DIREKT TILL `main` ⚠️

Alla kodändringar MÅSTE följa detta flöde:
1. `git checkout -b feature/kort-beskrivning` — skapa branch FÖRE implementering
2. Implementera och validera på branchen
3. `git push origin feature/kort-beskrivning`
4. Claude Desktop skapar PR — du mergar ALDRIG själv till main

**Varför:** Push direkt till `main` triggar deploy omedelbart och kringgår granskning.
Alla commits till `main` ska gå via PR som Claude Desktop skapar.

---

## Rollfördelning — BMAD fullt flöde

- **Claude Code CLI (du):** BMAD-planering, stories, implementering, validering, git på feature-branch
- **Claude Desktop:** Koordinerar, granskar, skapar PR via GitHub API
- **Blanda inte rollerna** — pusha aldrig till main, skapa aldrig PR själv

---

## BMAD-flöde för ny feature

1. `bmad-generate-project-context` — vid behov
2. `bmad-create-architecture` — arkitekturbeslut
3. `bmad-create-epics-and-stories` — bryt ner i stories
4. `git checkout -b feature/namn` — ALLTID före implementering
5. `bmad-dev-story` — implementera en story i taget på feature-branchen
6. `npm run type-check && npm run test && npm run build` — validera
7. `git push origin feature/namn` — pusha branchen
8. Meddela Claude Desktop → PR skapas → du mergar på GitHub

---

## Kritiska kodingregler

- `base: '/milrakt/'` i vite.config.ts — ALLTID, annars 404 på GitHub Pages
- `new Date(val + 'T12:00:00')` — undviker timezone-buggar vid datumparsning
- Svenska UI-texter, engelsk kod
- Inga UI-ramverk (React, Vue etc.) — vanilla TypeScript
- `isOutOfRange === true` → visa "Utanför avtalsperioden", dölj alla värden
- Validera alltid innan push: `npm run type-check && npm run test && npm run build`

---

## Workflow för ny session

1. Läs `STATUS.md` för att se var vi är
2. Läs `_bmad-output/project-context.md` för projektregler
3. Fortsätt med nästa steg i `STATUS.md`
