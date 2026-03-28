# Plan: Volvo Connected Vehicle API — Verklig körsträcka

## Syfte

Hämta verklig körsträcka (odometer) från användarens Volvo EX30 via
Volvos officiella Connected Vehicle API och visa den i appen bredvid
den beräknade målsträckan.

---

## Kritisk information — läs detta först

### ✅ EX30 stöds av API:et

Volvo Connected Vehicle API v2 stöder:
- Alla bilar med **Google Built In** från modellår 2020+
- EX30 har Google Built In → **EX30 stöds**

Odometer-endpointen returnerar värdet i **kilometer**.
Vi konverterar till mil (÷ 10) i appen.

### ⚠️ Viktig arkitekturförändring — backend krävs

Den nuvarande appen är 100% client-side (ingen server). Volvo API:et
använder OAuth2 med en hemlig klientnyckel (`VCC API key`) som **inte
får exponeras i klientkoden**. Om den läggs i frontend-koden kan vem
som helst se och missbruka din API-nyckel.

**Lösning:** En Google Cloud Function som proxar anrop till Volvo API.
Användaren autentiserar sig mot Volvo via OAuth2 i webbläsaren,
Cloud Function hanterar token-utbytet med API-nyckeln säkert lagrad
i Google Secret Manager.

Detta är en **engångsinvestering** — när den är på plats är
arkitekturen redo för framtida API-integrationer.

---

## Teknisk arkitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                    NYTT SYSTEM                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Användaren (webbläsare / PWA på GitHub Pages)                  │
│    │                                                            │
│    │ 1. Klickar "Hämta verklig sträcka"                         │
│    ▼                                                            │
│  Google Cloud Function (proxy, kör i europe-north1)             │
│    │                                                            │
│    │ 2. OAuth2-token från Volvo Identity                        │
│    │ 3. Hämtar API-nyckel från Secret Manager                   │
│    │ 4. GET /connected-vehicle/v2/vehicles/{vin}/odometer       │
│    ▼                                                            │
│  Volvo Connected Vehicle API                                    │
│    │                                                            │
│    │ 5. { data: { odometer: { value: 12345, unit: 'km' } } }   │
│    ▼                                                            │
│  Appen visar: Verklig sträcka: 1 234.5 mil                      │
│               Skillnad mot mål: +/-  X.X mil                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Varför Google Cloud Functions?

- **Gratis tier** räcker gott för personlig användning (2M anrop/månad gratis)
- **Serverless** = ingen server att underhålla
- **Secret Manager** lagrar API-nycklar säkert (bättre än miljövariabler)
- **europe-north1** (Belgien/Norden) = låg latens från Sverige
- **Deploy via GitHub Actions** med `google-github-actions` — samma CI/CD-mönster som idag
- Du har förmodligen redan ett Google-konto

### Alternativet — Hybrid-arkitektur (rekommenderat)

Frontend stannar på GitHub Pages (billigast, enklast).
Cloud Functions hanterar enbart `/api/*`-anrop.
Frontend anropar Cloud Function URL:en för data.

```
github.io/milrakt/     → GitHub Pages (frontend, gratis)
cloudfunctions.net/... → Google Cloud Function (backend, gratis tier)
```

---

## Förberedelser du gör manuellt

Dessa steg kräver manuell inloggning och kan inte automatiseras.

### Steg A: Registrera dig på Volvo Developer Portal

1. Gå till https://developer.volvocars.com
2. Skapa ett konto (använd din vanliga e-post)
3. Gå till **Account → Your API Applications**
4. Klicka **Create application** och fyll i:
   - **Application name:** milrakt
   - **Description:** Personlig app för att följa upp körsträcka
   - **APIs:** Connected Vehicle API
5. Notera din **VCC API Key**, **Client ID** och **Client Secret**

### Steg B: Notera ditt VIN

Ditt fordonsidentifikationsnummer (VIN) finns:
- I Volvo-appen under Fordonsinformation
- På registreringsbeviset
- På instrumentbrädan (synligt genom vindrutan)

### Steg C: Sätt upp Google Cloud

1. Gå till https://console.cloud.google.com
2. Skapa ett nytt projekt: **milrakt**
3. Aktivera dessa APIs i projektet:
   - Cloud Functions API
   - Cloud Build API
   - Secret Manager API
4. Skapa secrets i **Secret Manager**:
   - `volvo-vcc-api-key` = din VCC API Key
   - `volvo-client-id` = din Client ID
   - `volvo-client-secret` = din Client Secret
   - `volvo-vin` = ditt VIN
5. Skapa ett **Service Account** för GitHub Actions:
   - Namn: `milrakt-deployer`
   - Roller: Cloud Functions Developer, Secret Manager Secret Accessor
   - Ladda ner JSON-nyckeln och lägg till som GitHub Secret: `GCP_SA_KEY`
6. Notera ditt **Project ID** och lägg till som GitHub Secret: `GCP_PROJECT_ID`

---

## Volvos OAuth2-flöde

```
1. Användaren klickar "Anslut Volvo"
2. Appen redirectar till:
   https://volvoid.eu.volvocars.com/as/authorization.oauth2
   ?client_id=CLIENT_ID
   &response_type=code
   &scope=openid+conve:odometer
   &redirect_uri=https://REGION-PROJECT.cloudfunctions.net/volvo-callback

3. Användaren loggar in med Volvo ID
4. Volvo redirectar tillbaka med ?code=AUTHCODE
5. Cloud Function byter code mot access_token
6. access_token används för API-anrop mot Connected Vehicle API
7. Odometer-värde returneras till appen
```

---

## Ny filstruktur

```
milrakt/
├── functions/                   ← NYT — Google Cloud Functions
│   ├── src/
│   │   ├── auth/
│   │   │   ├── login.ts         ← Startar OAuth2-flödet
│   │   │   └── callback.ts      ← Hanterar OAuth2-callback
│   │   └── odometer.ts          ← Hämtar odometer från Volvo API
│   ├── package.json
│   └── tsconfig.json
├── src/                         ← Befintlig frontend
│   ├── types.ts                 ← Utökas med VehicleData, ComparisonResult
│   ├── logic.ts                 ← Utökas med compareToTarget()
│   ├── ui.ts                    ← Utökas med renderVehicleData()
│   └── main.ts
├── tests/
│   ├── logic.test.ts            ← Befintliga tester
│   └── vehicle.test.ts          ← NYA tester för compareToTarget()
└── .env.example                 ← Mall för lokala miljövariabler
```

---

## Nytt UI-koncept

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
  odometerKm: number           // Råvärde från Volvo API i km
  odometerMil: number          // Konverterat: km / 10
  fetchedAt: string            // ISO timestamp
}

export interface ComparisonResult {
  actualMil: number            // Verklig sträcka
  targetMil: number            // Beräknad målsträcka
  diffMil: number              // Skillnad (positiv = före mål)
  status: 'ahead' | 'behind' | 'on-track'
}
```

---

## Cloud Function — odometer

```typescript
// functions/src/odometer.ts
import { HttpFunction } from '@google-cloud/functions-framework'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

export const getOdometer: HttpFunction = async (req, res) => {
  // CORS för GitHub Pages
  res.set('Access-Control-Allow-Origin', 'https://carlgerhardsson.github.io')

  const secrets = new SecretManagerServiceClient()
  const [apiKey] = await secrets.accessSecretVersion({
    name: 'projects/PROJECT_ID/secrets/volvo-vcc-api-key/versions/latest'
  })
  const [vin] = await secrets.accessSecretVersion({
    name: 'projects/PROJECT_ID/secrets/volvo-vin/versions/latest'
  })

  const token = req.headers.authorization // access_token från frontend
  const response = await fetch(
    `https://api.volvocars.com/connected-vehicle/v2/vehicles/${vin}/odometer`,
    {
      headers: {
        'authorization': token,
        'vcc-api-key': apiKey.payload.data.toString(),
        'accept': 'application/json'
      }
    }
  )

  const data = await response.json()
  res.json({
    odometerKm: data.data.odometer.value,
    fetchedAt: new Date().toISOString()
  })
}
```

---

## GitHub Actions — deploy Cloud Function

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

### Fas 1: Google Cloud-infrastruktur
**Story 1.1:** GCP-projekt, Secret Manager och Service Account  
**Story 1.2:** OAuth2-login Cloud Function  
**Story 1.3:** OAuth2-callback Cloud Function  
**Story 1.4:** Odometer Cloud Function + GitHub Actions deploy  

### Fas 2: Frontend-integration
**Story 2.1:** Nya TypeScript-typer (`VehicleData`, `ComparisonResult`)  
**Story 2.2:** `compareToTarget()` i logic.ts + tester  
**Story 2.3:** "Anslut Volvo"-knapp och OAuth2-flöde i UI  
**Story 2.4:** Visa verklig sträcka och jämförelse i UI  
**Story 2.5:** Felhantering och laddningstillstånd  

### Fas 3: Deploy och verifiering
**Story 3.1:** End-to-end-test med riktigt Volvo ID  
**Story 3.2:** CORS-konfiguration och säkerhetsgranskning  
**Story 3.3:** Uppdatera PWA manifest  

---

## Kända risker och hantering

| Risk | Sannolikhet | Hantering |
|------|-------------|----------|
| EX30 returnerar 404 för specifika endpoints | Låg | Testa med sandbox-token innan implementering |
| OAuth2-app granskas av Volvo | Medel | Personliga appar granskas normalt snabbt (1-3 dagar) |
| GCP gratis tier löper ut | Låg | 2M anrop/månad — räcker för personlig app |
| access_token löper ut (30 min) | Känd | Hantera med refresh_token i callback |
| Volvo-bilen i viloläge (>3-5 dagar) | Låg | Visa senast hämtade värde med timestamp |
| CORS-fel från GitHub Pages till Cloud Function | Känd | Sätt Access-Control-Allow-Origin i Cloud Function |

---

## Arbetssätt

Samma BMAD fullt flöde som för migreringen:
1. `bmad-generate-project-context` (uppdatera för ny stack med GCP)
2. `bmad-create-architecture` (Cloud Functions + OAuth2-arkitektur)
3. `bmad-create-epics-and-stories`
4. `git checkout -b feature/volvo-api`
5. `bmad-dev-story` per story — **aldrig pusha direkt till main**
6. Validera efter varje story
7. PR → merge → GitHub Actions deployer automatiskt

---

## Länkar

- Volvo Developer Portal: https://developer.volvocars.com
- Connected Vehicle API: https://developer.volvocars.com/apis/connected-vehicle/v2/overview/
- Odometer endpoint: https://developer.volvocars.com/apis/connected-vehicle/v2/endpoints/odometer/
- Google Cloud Console: https://console.cloud.google.com
- Cloud Functions dokumentation: https://cloud.google.com/functions/docs
- google-github-actions/deploy-cloud-functions: https://github.com/google-github-actions/deploy-cloud-functions

---

## Nästa steg för att starta

1. ✅ Läs denna plan
2. ⏳ Registrera dig på Volvo Developer Portal och skapa en app
3. ⏳ Notera ditt VIN
4. ⏳ Sätt upp Google Cloud-projekt med Secret Manager (Steg C ovan)
5. ⏳ Öppna ny Claude Desktop-chatt och skriv:
   > "Läs PLAN-volvo-api.md och starta feature/volvo-api med BMAD"
