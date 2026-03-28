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
│  ├── /auth/login     — Startar OAuth2 + genererar state+PKCE    │
│  ├── /auth/callback  — Verifierar state, byter code mot token   │
│  │                   Sätter HTTP-only cookie                    │
│  └── /odometer       — Verifierar cookie, hämtar mätarst.       │
│                                                                 │
│  Google Secret Manager                                          │
│  └── API-nycklar + cookie-signing-secret, aldrig i koden         │
│                                                                 │
│  Volvo Connected Vehicle API                                    │
│  └── Odometer i km → vi konverterar till mil (÷ 10)             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## EX30 och API-stöd

Volvo Connected Vehicle API v2 stöder alla bilar med Google Built In från
modellår 2020+. EX30 har Google Built In — EX30 stöds.
Odometer-endpointen returnerar värdet i kilometer. Vi konverterar till mil (÷ 10).

---

## Varför backend krävs

Volvo API:et använder OAuth2 med en hemlig klientnyckel som aldrig får
exponeras i klientkoden. En Cloud Function agerar säker proxy — nyckeln
lagras i Secret Manager och lämnar aldrig servern.

---

## Säkerhetsanalys (reviderad efter extern granskning)

### Hotbild

| Kategori | Vad | Känslighet |
|----------|-----|----------|
| API-autentisering | VCC API Key, Client Secret | Hög |
| Fordonsidentitet | VIN | Medel |
| Kördata | Odometervärde | Låg |

### Designbeslut: Single-user-app

Appen är utformad för en enda användare (Calle). VIN lagras i Secret Manager
på serversidan och är inte kopplat till OAuth2-inloggningen — ett medvetet
val för ett personligt projekt. Konsekvens: Om någon annan loggade in med
sitt Volvo ID skulle Volvos API sannolikt svara med 403 Forbidden.
Riskbedömning: acceptabel för single-user-app.

### Skyddslager

**Lager 1 — Inga hemligheter i koden**
VCC API Key, Client Secret, VIN och cookie-signing-secret lagras i Google
Secret Manager. Repot innehåller inga hemligheter oavsett om det är publikt
eller privat.

**Lager 2 — HTTPS överallt**
GitHub Pages (tvingat), Cloud Functions (alltid HTTPS), Volvo API (kräver HTTPS).
Klartext är inte möjligt i systemet.

**Lager 3 — OAuth2 Authorization Code Flow med PKCE och state-parameter**

Två säkerhetsmekanismer ovanpå standardflödet:

- **state-parameter (CSRF-skydd):** `/auth/login` genererar ett kryptografiskt
  slumpvärde och lagrar det i en tillfällig cookie. När Volvo redirectar
  tillbaka verifierar `/auth/callback` att `state` i svaret matchar cookien.
  Förhindrar CSRF-attacker där en angripare luras in på fel konto.

- **PKCE — Proof Key for Code Exchange (RFC 7636):** `/auth/login` genererar
  ett `code_verifier`-värde och skickar dess hash (`code_challenge`) till
  Volvo. `/auth/callback` skickar `code_verifier` vid token-utbytet. Förhindrar
  att en interceptad auth-kod kan användas av en angripare.

**Lager 4 — HTTP-only cookies löser amnesi-problemet**

Cloud Functions är stateless — de har inget minne mellan anrop. Tokens
lagras därför inte server-side. Istället:
- `/auth/callback` sätter en signerad, krypterad HTTP-only cookie med
  `access_token` och `refresh_token`
- Cookien skickas automatiskt med varje anrop till `/odometer`
- `HttpOnly` = JavaScript i frontend kan inte läsa cookien
- `Secure` = skickas bara över HTTPS
- `SameSite=Strict` = skickas bara från samma ursprung

Detta löser också motsägelsen i tidigare version där planen sade både
"ingen server-side lagring" och "refresh_token hanteras server-side".
Tokens lagras nu i webbläsarens cookie-jar — inte i någon databas.

**Lager 5 — Token-validering i /odometer (CORS räcker inte)**

CORS hindrar webbläsare men inte `curl` eller andra HTTP-klienter.
`/odometer` verifierar därför alltid den inkommande HTTP-only cookien
kryptografiskt innan något Volvo API-anrop görs. Utan giltig cookie —
401 Unauthorized, oavsett ursprung.

**Lager 6 — CORS som kompletterande lager**
Begränsar anrop från webbläsare till `https://carlgerhardsson.github.io`.
Ett extra lager — inte primärt skydd.

**Lager 7 — Minimal behörighet**
- Cloud Function begär bara scopet `conve:odometer`
- Service Account: Cloud Functions Developer + Secret Manager Secret Accessor
- Ingen del av systemet har skrivbehörighet till fordonet

### Vad systemet INTE skyddar mot

| Scenario | Kommentar |
|----------|-----------|
| Komprometterat Google-konto | Aktivera 2FA — viktigaste enskilda skyddet |
| Stulen enhet med aktiv cookie | access_token lever 30 min, refresh_token 24h |
| Volvo API-intrång | Utanför vår kontroll |
| Fysisk åtkomst till olåst telefon | Appen visar bara körsträcka — begränsad skada |

### Säkerhetschecklista — Story 3.2

- [ ] `state`-parameter genereras och verifieras i OAuth2-flödet
- [ ] PKCE implementerat (`code_verifier` + `code_challenge`)
- [ ] HTTP-only cookie sätts i `/auth/callback` med `Secure` + `SameSite=Strict`
- [ ] `/odometer` verifierar cookie kryptografiskt — litar inte på CORS ensamt
- [ ] CORS-header begränsad till `https://carlgerhardsson.github.io`
- [ ] Inga secrets i någon fil som committas
- [ ] `.env`-filer i `.gitignore`
- [ ] Service Account har minimala behörigheter (verifiera i GCP IAM)
- [ ] 2FA aktiverat på Google-kontot
- [ ] access_token och refresh_token loggas inte i Cloud Logging

---

## OAuth2-flöde (reviderat med PKCE och state)

```
1. Användaren klickar "Anslut Volvo"
2. /auth/login genererar:
   - state (kryptografiskt slumpvärde) → lagras i tillfällig cookie
   - code_verifier + code_challenge (PKCE)
3. Appen redirectar till Volvo Identity med state + code_challenge
4. Användaren loggar in med Volvo ID
5. Volvo redirectar till /auth/callback med code + state
6. /auth/callback verifierar state mot cookie (CSRF-skydd)
7. /auth/callback byter code + code_verifier mot access_token (PKCE)
8. /auth/callback sätter HTTP-only cookie med access_token + refresh_token
9. Frontend anropar /odometer (cookie skickas automatiskt av webbläsaren)
10. /odometer verifierar cookie kryptografiskt — ingen trust på CORS
11. /odometer hämtar mätarställning från Volvo API
12. Appen visar verklig sträcka och jämförelse mot mål
```

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
3. Aktivera APIs: Cloud Functions API, Cloud Build API, Secret Manager API
4. Skapa secrets i **Secret Manager**:
   - `volvo-vcc-api-key`
   - `volvo-client-id`
   - `volvo-client-secret`
   - `volvo-vin`
   - `cookie-signing-secret` (generera: `openssl rand -hex 32`)
5. Skapa **Service Account**: `milrakt-deployer`
   - Roller: Cloud Functions Developer + Secret Manager Secret Accessor
   - Ladda ner JSON-nyckel
6. Lägg till i GitHub Secrets:
   - `GCP_SA_KEY` = JSON-nyckeln
   - `GCP_PROJECT_ID` = ditt projekt-ID
7. Aktivera **2FA** på ditt Google-konto

---

## Ny filstruktur

```
milrakt/
├── functions/                    ← NYT — Google Cloud Functions
│   ├── src/
│   │   ├── auth/
│   │   │   ├── login.ts          ← OAuth2 + state + PKCE
│   │   │   └── callback.ts       ← Verifierar state/PKCE, sätter HTTP-only cookie
│   │   ├── odometer.ts           ← Verifierar cookie, hämtar mätarst.
│   │   └── cookies.ts            ← Signering/verifiering av HTTP-only cookies
│   ├── package.json
│   └── tsconfig.json
├── src/                          ← Befintlig frontend
│   ├── types.ts                  ← + VehicleData, ComparisonResult
│   ├── logic.ts                  ← + compareToTarget()
│   ├── ui.ts                     ← + renderVehicleData()
│   └── main.ts
├── tests/
│   ├── logic.test.ts
│   └── vehicle.test.ts
├── .env.example
└── .github/workflows/
    ├── deploy.yml                ← Befintlig frontend-deploy
    └── deploy-functions.yml      ← NYT
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
export interface VehicleData {
  odometerKm: number
  odometerMil: number
  fetchedAt: string
}

export interface ComparisonResult {
  actualMil: number
  targetMil: number
  diffMil: number
  status: 'ahead' | 'behind' | 'on-track'
}
```

---

## GitHub Actions — deploy Cloud Functions

```yaml
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
- Story 1.1: GCP-projekt, Secret Manager inkl. cookie-signing-secret, Service Account
- Story 1.2: OAuth2 login med state + PKCE
- Story 1.3: OAuth2 callback — verifierar state/PKCE, sätter HTTP-only cookie
- Story 1.4: Odometer Cloud Function med cookie-validering + GitHub Actions deploy

### Fas 2 — Frontend-integration
- Story 2.1: Nya TypeScript-typer (VehicleData, ComparisonResult)
- Story 2.2: `compareToTarget()` i logic.ts + tester
- Story 2.3: "Anslut Volvo"-knapp och OAuth2-flöde i UI
- Story 2.4: Visa verklig sträcka och jämförelse i UI
- Story 2.5: Felhantering och laddningstillstånd

### Fas 3 — Verifiering och polish
- Story 3.1: End-to-end-test med riktigt Volvo ID
- Story 3.2: Säkerhetsgranskning (checklista ovan)
- Story 3.3: Uppdatera PWA manifest
- Story 3.4 (valfri): Koppla custom domän (t.ex. milrakt.se)

---

## Kända risker

| Risk | Sannolikhet | Hantering |
|------|-------------|----------|
| EX30 ger 404 på odometer | Låg | Testa med sandbox-token först |
| Volvo granskar OAuth2-appen | Medel | Normalt 1-3 dagar för personliga appar |
| access_token löper ut (30 min) | Känd | Hanteras via refresh_token i HTTP-only cookie |
| Cross-origin cookie blockeras | Känd | Sätt SameSite=None+Secure för cross-origin |
| Bilen i viloläge >3-5 dagar | Låg | Visa senast hämtade värde med timestamp |

---

## Arbetssätt — BMAD fullt flöde

1. `bmad-generate-project-context`
2. `bmad-create-architecture`
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
- Secret Manager docs: https://cloud.google.com/secret-manager/docs
- OAuth2 PKCE (RFC 7636): https://datatracker.ietf.org/doc/html/rfc7636

---

## Nästa steg för att starta

1. Läs denna plan
2. Registrera app på Volvo Developer Portal (Steg A)
3. Notera ditt VIN (Steg B)
4. Sätt upp GCP-projekt med Secret Manager inkl. cookie-signing-secret (Steg C)
5. Öppna ny Claude Desktop-chatt och skriv:
   > "Läs PLAN-volvo-api.md i milrakt och starta feature/volvo-api med BMAD"
