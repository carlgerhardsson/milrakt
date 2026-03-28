# Plan: Volvo API-integration — Verklig körsträcka

## Syfte

Hämta verklig körsträcka (odometer) från Volvo EX30 via Volvos officiella
Connected Vehicle API och visa den i appen bredvid den beräknade målsträckan.

---

## Arkitektur — Hybrid

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTEMÖVERSIKT                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  GitHub                                                         │
│  ├── Versionshantering (all kod)                                │
│  └── GitHub Actions (CI/CD-pipeline)                            │
│        ├── Deploy frontend → GitHub Pages (som idag)            │
│        └── Deploy backend  → Google Cloud Functions (nytt)      │
│                                                                 │
│  GitHub Pages                                                   │
│  └── Frontend: index.html, JS, CSS (oförändrad hosting)         │
│                                                                 │
│  Google Cloud Functions (europe-north1)                         │
│  ├── /auth/login     — Startar OAuth2-flödet mot Volvo          │
│  ├── /auth/callback  — Hanterar OAuth2-callback                 │
│  └── /odometer       — Hämtar mätarställning säkert             │
│                                                                 │
│  Google Secret Manager                                          │
│  └── API-nycklar lagras säkert, aldrig i koden                  │
│                                                                 │
│  Volvo Connected Vehicle API                                    │
│  └── Odometer i km → vi konverterar till mil (÷ 10)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Varför denna arkitektur?

- **GitHub Pages** räcker för frontend — ingen anledning att byta
- **Google Cloud Functions** = serverlöst, gratis tier (2M anrop/mån), inget att underhålla
- **Secret Manager** = API-nycklar lagras säkert utanför koden
- **GitHub Actions** utökas med ett nytt deploy-jobb — samma mönster som idag
- **Valfritt senare:** Koppla en egen domän (t.ex. `milrakt.se`) — det enda som märkbart polerar upplevelsen

---

## EX30 och API-stöd ✅

Volvo Connected Vehicle API v2 stöder alla bilar med Google Built In
från modellår 2020+. EX30 har Google Built In — EX30 stöds.

Odometer-endpointen returnerar värdet i kilometer.
Vi konverterar till mil (÷ 10) i appen.

---

## Varför backend krävs

Volvo API:et använder OAuth2 med en hemlig klientnyckel som **aldrig
får exponeras i klientkoden**. En Cloud Function agerar säker proxy —
nyckeln lagras i Secret Manager och lämnar aldrig servern.

---

## Förberedelser — du gör dessa manuellt

### A: Volvo Developer Portal

1. Gå till https://developer.volvocars.com
2. Skapa konto och logga in
3. **Account → Your API Applications → Create application**
   - Name: milrakt
   - APIs: Connected Vehicle API
4. Notera: **VCC API Key**, **Client ID**, **Client Secret**

### B: Notera ditt VIN

Finns i Volvo-appen under Fordonsinformation, på registreringsbeviset
eller på instrumentbrädan (synligt genom vindrutan).

### C: Sätt upp Google Cloud

1. Gå till https://console.cloud.google.com
2. Skapa projekt: **milrakt**
3. Aktivera APIs:
   - Cloud Functions API
   - Cloud Build API
   - Secret Manager API
4. Skapa secrets i **Secret Manager**:
   - `volvo-vcc-api-key`
   - `volvo-client-id`
   - `volvo-client-secret`
   - `volvo-vin`
5. Skapa **Service Account**: `milrakt-deployer`
   - Roller: Cloud Functions Developer + Secret Manager Secret Accessor
   - Ladda ner JSON-nyckel
6. Lägg till i GitHub Secrets:
   - `GCP_SA_KEY` = JSON-nyckeln
   - `GCP_PROJECT_ID` = ditt projekt-ID

---

## OAuth2-flöde

```
1. Användaren klickar "Anslut Volvo"
2. Appen redirectar till Volvo Identity (login)
3. Användaren loggar in med Volvo ID
4. Volvo redirectar med auth-kod till Cloud Function
5. Cloud Function byter kod mot access_token (säkert)
6. Frontend får token och anropar /odometer
7. Cloud Function hämtar mätarställning från Volvo API
8. Appen visar verklig sträcka och jämförelse mot mål
```

---

## Ny filstruktur

```
milrakt/
├── functions/                    ← NYT — Google Cloud Functions
│   ├── src/
│   │   ├── auth/
│   │   │   ├── login.ts          ← Startar OAuth2
│   │   │   └── callback.ts       ← Hanterar callback
│   │   └── odometer.ts           ← Hämtar mätarställning
│   ├── package.json
│   └── tsconfig.json
├── src/                          ← Befintlig frontend (oförändrad)
│   ├── types.ts                  ← + VehicleData, ComparisonResult
│   ├── logic.ts                  ← + compareToTarget()
│   ├── ui.ts                     ← + renderVehicleData()
│   └── main.ts
├── tests/
│   ├── logic.test.ts             ← Befintliga tester
│   └── vehicle.test.ts           ← NYA tester
└── .github/workflows/
    ├── deploy.yml                ← Befintlig frontend-deploy
    └── deploy-functions.yml      ← NYT — Cloud Functions deploy
```

---

## Nytt UI

```
┌─────────────────────────────┐
│  Milräknaren                │
│  ─────────────────────────  │
│  Målsträcka idag            │
│  1 234.5 mil                │
│                             │
│  [████████░░░░] 41.2%       │
│                             │
│  Behövs: 12.3 mil/vecka     │
│  Dagar kvar: 847            │
│                             │
│  ─────────────────────────  │
│  Verklig sträcka        NYT │
│  1 189.0 mil                │
│  Du ligger 45.5 mil efter   │
│                             │
│  [Uppdatera från Volvo ↻]   │
└─────────────────────────────┘
```

---

## Nya TypeScript-typer

```typescript
// src/types.ts — tillägg
export interface VehicleData {
  odometerKm: number      // Råvärde från Volvo API i km
  odometerMil: number     // Konverterat: km / 10
  fetchedAt: string       // ISO timestamp
}

export interface ComparisonResult {
  actualMil: number       // Verklig sträcka
  targetMil: number       // Beräknad målsträcka
  diffMil: number         // Skillnad (positiv = före mål)
  status: 'ahead' | 'behind' | 'on-track'
}
```

---

## GitHub Actions — deploy Cloud Functions

```yaml
# .github/workflows/deploy-functions.yml
name: Deploy Cloud Functions
on:
  push:
    branches: [main]
    paths: ['functions/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      - uses: google-github-actions/deploy-cloud-functions@v3
        with:
          name: volvo-odometer
          runtime: nodejs20
          region: europe-north1
          source_dir: functions
          entry_point: getOdometer
          project_id: ${{ secrets.GCP_PROJECT_ID }}
```

---

## Implementeringsfaser

### Fas 1 — Backend-infrastruktur
- Story 1.1: GCP-projekt, Secret Manager, Service Account, GitHub Secrets
- Story 1.2: OAuth2 login Cloud Function
- Story 1.3: OAuth2 callback Cloud Function
- Story 1.4: Odometer Cloud Function + GitHub Actions deploy

### Fas 2 — Frontend-integration
- Story 2.1: Nya TypeScript-typer (VehicleData, ComparisonResult)
- Story 2.2: `compareToTarget()` i logic.ts + tester
- Story 2.3: "Anslut Volvo"-knapp och OAuth2-flöde i UI
- Story 2.4: Visa verklig sträcka och jämförelse i UI
- Story 2.5: Felhantering och laddningstillstånd

### Fas 3 — Verifiering och polish
- Story 3.1: End-to-end-test med riktigt Volvo ID
- Story 3.2: CORS-konfiguration och säkerhetsgranskning
- Story 3.3: Uppdatera PWA manifest
- Story 3.4 (valfri): Koppla custom domän (t.ex. milrakt.se)

---

## Kända risker

| Risk | Sannolikhet | Hantering |
|------|-------------|----------|
| EX30 ger 404 på odometer | Låg | Testa med sandbox-token först |
| Volvo granskar OAuth2-appen | Medel | Normalt 1-3 dagar för personliga appar |
| access_token löper ut (30 min) | Känd | Hanteras med refresh_token i callback |
| CORS-fel GitHub Pages → GCP | Känd | Sätt Access-Control-Allow-Origin i Cloud Function |
| Bilen i viloläge >3-5 dagar | Låg | Visa senast hämtade värde med timestamp |

---

## Arbetssätt — BMAD fullt flöde (som vanligt)

1. `bmad-generate-project-context` — uppdatera för ny stack
2. `bmad-create-architecture` — Cloud Functions + OAuth2
3. `bmad-create-epics-and-stories`
4. `git checkout -b feature/volvo-api` — FÖRE implementering
5. `bmad-dev-story` per story
6. Validera efter varje story
7. PR → merge → GitHub Actions deployer automatiskt

---

## Länkar

- Volvo Developer Portal: https://developer.volvocars.com
- Connected Vehicle API: https://developer.volvocars.com/apis/connected-vehicle/v2/overview/
- Odometer endpoint: https://developer.volvocars.com/apis/connected-vehicle/v2/endpoints/odometer/
- Google Cloud Console: https://console.cloud.google.com
- Cloud Functions docs: https://cloud.google.com/functions/docs
- google-github-actions: https://github.com/google-github-actions/deploy-cloud-functions

---

## Nästa steg för att starta

1. ✅ Läs denna plan
2. ⏳ Registrera app på Volvo Developer Portal (Steg A)
3. ⏳ Notera ditt VIN (Steg B)
4. ⏳ Sätt upp GCP-projekt med Secret Manager (Steg C)
5. ⏳ Öppna ny Claude Desktop-chatt och skriv:
   > "Läs PLAN-volvo-api.md i milrakt och starta feature/volvo-api med BMAD"
