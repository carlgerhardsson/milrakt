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

**Lösning:** En liten serverlös backend (Vercel Serverless Functions)
som proxar anrop till Volvo API. Användaren autentiserar sig mot Volvo
via OAuth2 i webbläsaren, backenden hanterar token-utbytet.

Detta är en **engångsinvestering** — när den är på plats är
arkitekturen redo för framtida API-integrationer.

---

## Teknisk arkitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                    NYTT SYSTEM                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Användaren (webbläsare / PWA)                                  │
│    │                                                            │
│    │ 1. Klickar "Hämta verklig sträcka"                         │
│    ▼                                                            │
│  Vercel Serverless Function (proxy)                             │
│    │                                                            │
│    │ 2. OAuth2-token från Volvo Identity                        │
│    │ 3. GET /connected-vehicle/v2/vehicles/{vin}/odometer       │
│    ▼                                                            │
│  Volvo Connected Vehicle API                                    │
│    │                                                            │
│    │ 4. { data: { odometer: { value: 12345, unit: 'km' } } }   │
│    ▼                                                            │
│  Appen visar: Verklig sträcka: 1 234.5 mil                      │
│               Skillnad mot mål: +/-  X.X mil                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Varför Vercel?

- Gratis tier räcker gott för personlig användning
- Serverless Functions = ingen server att underhålla
- Stöder miljövariabler (API-nycklar lagras säkert)
- Deploy via GitHub Actions (samma workflow som idag)
- Domän: `milrakt.vercel.app` (eller custom domain)

---

## Förberedelser du gör manuellt

Dessa steg kräver manuell inloggning och kan inte automatiseras.

### Steg A: Registrera dig på Volvo Developer Portal

1. Gå till https://developer.volvocars.com
2. Skapa ett konto (använd din vanliga e-post)
3. Gå till **Account → Your API Applications**
4. Klicka **Create application**
5. Fyll i:
   - **Application name:** milrakt
   - **Description:** Personlig app för att följa upp körsträcka
   - **APIs:** Connected Vehicle API
6. Spara och notera din **VCC API Key**

### Steg B: Notera ditt VIN

Ditt fordonsidentifikationsnummer (VIN) finns:
- I Volvo-appen under Fordonsinformation
- På registreringsbeviset
- På instrumentbrädan (synligt genom vindrutan)

### Steg C: Skapa Vercel-konto

1. Gå till https://vercel.com
2. Logga in med ditt GitHub-konto
3. Importera `milrakt`-repot
4. Lägg till miljövariabler i Vercel-dashboard:
   - `VOLVO_VCC_API_KEY` = din VCC API Key
   - `VOLVO_CLIENT_ID` = din OAuth2 Client ID
   - `VOLVO_CLIENT_SECRET` = din OAuth2 Client Secret
   - `VOLVO_VIN` = ditt fordons VIN

---

## Volvos OAuth2-flöde (för referens)

```
1. Användaren klickar "Anslut Volvo"
2. Appen redirectar till:
   https://volvoid.eu.volvocars.com/as/authorization.oauth2
   ?client_id=CLIENT_ID
   &response_type=code
   &scope=openid+conve:odometer
   &redirect_uri=https://milrakt.vercel.app/api/callback

3. Användaren loggar in med Volvo ID
4. Volvo redirectar tillbaka med ?code=AUTHCODE
5. Vercel Function byter code mot access_token
6. access_token används för API-anrop mot Connected Vehicle API
7. Odometer-värde returneras till appen
```

---

## Ny filstruktur

```
milrakt/
├── api/                         ← NYT — Vercel Serverless Functions
│   ├── auth/
│   │   ├── login.ts             ← Startar OAuth2-flödet
│   │   └── callback.ts          ← Hanterar OAuth2-callback
│   └── odometer.ts              ← Hämtar odometer från Volvo API
├── src/
│   ├── types.ts                 ← Utökas med VehicleData
│   ├── logic.ts                 ← Utökas med compareToTarget()
│   ├── ui.ts                    ← Utökas med renderVehicleData()
│   └── main.ts
├── tests/
│   ├── logic.test.ts            ← Befintliga tester
│   └── vehicle.test.ts          ← NYA tester för compareToTarget()
├── vercel.json                  ← NYT — Vercel-konfiguration
└── .env.example                 ← NYT — Mall för miljövariabler
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

## API-endpoint (Vercel Function)

```typescript
// api/odometer.ts
// GET /api/odometer
// Returnerar: { odometerKm: number, fetchedAt: string }

export default async function handler(req, res) {
  const token = await getAccessToken() // från session/cookie
  const vin = process.env.VOLVO_VIN

  const response = await fetch(
    `https://api.volvocars.com/connected-vehicle/v2/vehicles/${vin}/odometer`,
    {
      headers: {
        'authorization': `Bearer ${token}`,
        'vcc-api-key': process.env.VOLVO_VCC_API_KEY,
        'accept': 'application/json'
      }
    }
  )

  const data = await response.json()
  // data.data.odometer.value = värde i km

  res.json({
    odometerKm: data.data.odometer.value,
    fetchedAt: new Date().toISOString()
  })
}
```

---

## Implementeringsfaser

### Fas 1: Backend-infrastruktur

**Story 1.1:** Vercel-uppsättning och miljövariabler
**Story 1.2:** OAuth2-login endpoint (`/api/auth/login`)
**Story 1.3:** OAuth2-callback endpoint (`/api/auth/callback`)
**Story 1.4:** Odometer-endpoint (`/api/odometer`)

### Fas 2: Frontend-integration

**Story 2.1:** Nya TypeScript-typer (`VehicleData`, `ComparisonResult`)
**Story 2.2:** `compareToTarget()` i logic.ts + tester
**Story 2.3:** "Anslut Volvo"-knapp och OAuth2-flöde i UI
**Story 2.4:** Visa verklig sträcka och jämförelse i UI
**Story 2.5:** Felhantering och laddningstillstånd

### Fas 3: Deploy och verifiering

**Story 3.1:** Uppdatera GitHub Actions för Vercel-deploy
**Story 3.2:** End-to-end-test med riktigt Volvo ID
**Story 3.3:** Uppdatera PWA manifest och ikoner

---

## Kända risker och hantering

| Risk | Sannolikhet | Hantering |
|------|-------------|----------|
| EX30 returnerar 404 för specifika endpoints | Låg | Testa med sandbox-token innan implementering |
| OAuth2-app granskas av Volvo | Medel | Personliga appar granskas normalt snabbt (1-3 dagar) |
| API rate limit (100 req/min) | Låg | Appen hämtar data on-demand, inte i realtid |
| access_token löper ut (30 min) | Känd | Hantera med refresh_token i callback.ts |
| Volvo-bilen i viloläge (>3-5 dagar) | Låg | Visa senast hämtade värde med timestamp |

---

## Vercel vs GitHub Pages

Eftersom vi nu behöver en backend kan vi inte längre köra enbart på
GitHub Pages (som bara stöder statiska filer). Vi har två alternativ:

**Alternativ A — Hybrid (rekommenderat):**
- GitHub Pages fortsätter hålla frontend (index.html, JS, CSS)
- Vercel håller enbart API-funktionerna (`/api/*`)
- Frontend anropar Vercel-URL:en för data

**Alternativ B — Flytta allt till Vercel:**
- Vercel håller både frontend och backend
- Enklare arkitektur, en deploy-pipeline
- Gratis tier räcker för personlig användning

Rekommendation: **Alternativ B** — smidigare, ett ställe att hantera.

---

## Arbetssätt

Samma som för migreringen — BMAD fullt flöde:
1. `bmad-generate-project-context` (uppdatera för ny stack)
2. `bmad-create-architecture` (Vercel + OAuth2-arkitektur)
3. `bmad-create-epics-and-stories`
4. `git checkout -b feature/volvo-api`
5. `bmad-dev-story` per story
6. Validera efter varje story
7. PR → merge → auto-deploy

---

## Länkar

- Volvo Developer Portal: https://developer.volvocars.com
- Connected Vehicle API: https://developer.volvocars.com/apis/connected-vehicle/v2/overview/
- Odometer endpoint: https://developer.volvocars.com/apis/connected-vehicle/v2/endpoints/odometer/
- Authorisation guide: https://developer.volvocars.com/apis/docs/authorisation/
- Vercel: https://vercel.com

---

## Nästa steg för att starta

1. ✅ Läs denna plan
2. ⏳ Registrera dig på Volvo Developer Portal och skapa en app
3. ⏳ Notera ditt VIN
4. ⏳ Skapa Vercel-konto och koppla till GitHub-repot
5. ⏳ Öppna ny Claude Desktop-chatt och skriv:
   > "Läs PLAN-volvo-api.md och starta feature/volvo-api med BMAD"
