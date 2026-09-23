# AgriAI Real Agricultural Data Integration Guide

This document specifies the real data architecture, providers, normalization schemas, validation bounds, caching policies, security rules, and maintenance protocols for AgriAI — Smart Crop Advisory System.

---

## 1. Architecture Overview & Provider Hierarchy

AgriAI implements a strict, server-side data pipeline where external APIs are never accessed directly from client browser bundles:

```
External Data Sources (IMD, AGMARKNET, data.gov.in, ICAR, SHC)
                          ↓
           Data Provider Adapters (lib/data-providers/)
                          ↓
      Quality Validation & Normalization (lib/data-providers/validator.ts)
                          ↓
      Multi-Tier Cache (In-Memory LRU + Supabase Cache Table)
                          ↓
           AgriAI Application Services (lib/*-service.ts)
                          ↓
      Explainable Advisory Engine (lib/advisory-service.ts)
                          ↓
    Farmer Dashboard & Alerts (components/dashboard/*)
```

### Hierarchy of Authority
All recommendations and insights strictly observe the following order of precedence:
$$\text{REAL DATA} > \text{VERIFIED AGRICULTURAL KNOWLEDGE} > \text{AI REASONING}$$

Under no circumstances does the application fabricate numbers for missing sensor or government data. When telemetry is not available, the system displays an explicit empty state or an **"Insufficient soil data"** indicator.

---

## 2. Integrated Data Providers & Status Matrix

| Domain | Primary Provider | Fallback Provider | Status | Authentication | Env Variable | Cache TTL |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Weather & Rainfall** | IMD (Mausam API) | Open-Meteo High-Resolution | **LIVE** (Dual) | None / API Key | `IMD_API_KEY` (Optional) | 30 minutes |
| **Mandi Market Prices** | AGMARKNET (data.gov.in) | CACP Minimum Support Prices (MSP) | **LIVE** (Dual) | data.gov.in API Key | `DATA_GOV_IN_API_KEY` | 4 hours |
| **Soil Health Testing** | Farmer SHC / Lab Portal | Strict "Insufficient Data" prompt | **LIVE** | Supabase Auth (RLS) | N/A (User Protected) | Session / DB |
| **Crop Packages of Practices** | ICAR / PAU / IARI Knowledge Base | Regional Extension Baselines | **LIVE** | In-Code Verified Registry | N/A | Persistent |
| **Pest & Disease Knowledge** | ICAR-NCIPM Protocols | Vision AI with disclaimer | **LIVE** | In-Code Verified Registry | N/A | Persistent |
| **Agro-Met Advisories** | IMD GKMS / AMFU Bulletins | Inactive upon expiry | **LIVE** | Public RSS/JSON Feed | N/A | 6 hours |
| **Remote Sensing / Satellite** | ISRO Bhuvan / Copernicus | Interface Stub (Clean Unavailable) | **PLANNED** | Enterprise OAuth2 | `ISRO_BHUVAN_TOKEN` | N/A |

### Provider Status Definitions:
- **LIVE**: Deployed, fully functional with automatic fallback handling.
- **CONFIGURED BUT DISABLED**: Code adapter ready, requires production API keys to be activated.
- **PLANNED**: Standardized interface defined; awaits formal institutional data access agreements.
- **UNAVAILABLE**: Provider interface cleanly signals unavailability without mock data.

---

## 3. Data Normalization Layer & Schemas

All external records are converted into strongly typed, internal TypeScript contracts defined in `lib/data-providers/types.ts`:

### 3.1 NormalizedWeatherObservation
```typescript
export interface NormalizedWeatherObservation {
  latitude: number;
  longitude: number;
  district: string;
  state: string;
  observedAt: string;
  temperatureC: number;
  feelsLikeC?: number;
  humidityPercent: number;
  rainfall24hMm: number;        // Accumulated 24h rainfall in millimeters
  rainfallAnomaly?: 'Excess' | 'Normal' | 'Deficient' | 'Scanty' | 'No Rain';
  windSpeedKmH: number;
  windDirectionDegrees?: number;
  weatherCondition: string;
  forecastDays: Array<{
    dayLabel: string;
    tempMaxC: number;
    tempMinC: number;
    condition: string;
    rainChancePercent: number;
    expectedRainfallMm: number;
  }>;
  severeWarning?: {
    level: 'None' | 'Yellow' | 'Orange' | 'Red';
    title: string;
    description: string;
    issuedAt: string;
    validUntil: string;
  };
}
```

### 3.2 NormalizedMarketPrice
```typescript
export interface NormalizedMarketPrice {
  id: string;
  commodity: string;
  variety: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;            // ₹ / Quintal
  maxPrice: number;            // ₹ / Quintal
  modalPrice: number;          // ₹ / Quintal (predominant trade price)
  msp?: number;                // Government Minimum Support Price benchmark
  priceDate: string;           // YYYY-MM-DD
  unit: string;                // "₹ / Quintal"
  trend7d?: {
    direction: 'UP' | 'DOWN' | 'STABLE';
    changePercent: number;
    historicalModal: Array<{ date: string; price: number }>;
  };
}
```

### 3.3 NormalizedSoilProfile (12-Parameter ICAR Model)
```typescript
export interface NormalizedSoilProfile {
  id: string;
  farmId: string;
  farmerId: string;
  sampleDate: string;
  labName?: string;
  sampleLocation: string;
  soilType: string;
  ph: number;
  electricalConductivityDsm?: number; // EC in dS/m
  organicCarbonPercent?: number;      // OC %
  availableNitrogenKgHa?: number;     // N in kg/ha
  nitrogenRating: 'Low' | 'Medium' | 'High';
  availablePhosphorusKgHa?: number;   // P in kg/ha
  phosphorusRating: 'Low' | 'Medium' | 'High';
  availablePotassiumKgHa?: number;    // K in kg/ha
  potassiumRating: 'Low' | 'Medium' | 'High';
  // Micronutrients (ppm)
  zincPpm?: number;
  ironPpm?: number;
  copperPpm?: number;
  manganesePpm?: number;
  boronPpm?: number;
  sulphurPpm?: number;
  isLabVerified: boolean;
  status: 'Complete' | 'Partial' | 'Insufficient';
}
```

---

## 4. Quality Validation Rules & Agronomic Bounds

Every incoming record passes through `lib/data-providers/validator.ts` before entering the application cache or database:

1. **Meteorological Bounds**:
   - Temperature: $-15^\circ\text{C} \le T \le 58^\circ\text{C}$
   - Relative Humidity: $0\% \le H \le 100\%$
   - 24-Hour Rainfall: $0 \le R \le 600\text{ mm}$
   - Wind Speed: $0 \le W \le 200\text{ km/h}$

2. **Market Price Consistency**:
   - Price range: $\text{₹}200 \le P \le \text{₹}100,000 \text{ / quintal}$
   - Math invariant: $\text{minPrice} \le \text{modalPrice} \le \text{maxPrice}$
   - Reject records violating order of magnitude.

3. **Soil Chemical Bounds**:
   - Soil reaction: $3.0 \le \text{pH} \le 11.0$
   - Electrical Conductivity: $0 \le \text{EC} \le 20\text{ dS/m}$
   - Organic Carbon: $0\% \le \text{OC} \le 10\%$
   - Macronutrient non-negativity: $\text{N} \ge 0, \text{P} \ge 0, \text{K} \ge 0$

---

## 5. Caching & Rate Limiting Architecture

1. **Weather Caching**:
   - 1.1 km coordinate clustering (`Math.round(lat * 100) / 100`) prevents redundant queries for neighboring farms.
   - Cache TTL: 30 minutes.

2. **Market Caching**:
   - Key format: `market:commodity:state`.
   - Cache TTL: 4 hours.
   - Automatic fallback to CACP MSP baseline during upstream network outages or quota exhaustion.

3. **Rate Limiting**:
   - API endpoints (`/api/market`, `/api/soil`, `/api/advisories/official`) enforce Upstash Redis / Memory distributed token bucket limits (30 requests/minute per IP).
   - Upstream API timeouts capped at 8,000 ms with AbortController to prevent server thread blocking.

---

## 6. Agricultural Knowledge Base Structure

Grounded in peer-reviewed packages of practices published by ICAR, Punjab Agricultural University (PAU), and Indian Agricultural Research Institute (IARI):

1. **`lib/agriculture/crop-database.ts`**:
   - Profiles for Wheat, Paddy (Rice), Cotton, Mustard.
   - Phenological growth stages with critical water sensitivity indicators (e.g. CRI in wheat, Panicle Initiation in paddy).
   - Recommended Dose of Fertilizers (RDF) in kg/acre with application split schedules (basal vs top-dressing).
   - Critical high/low temperature thresholds to protect against anthesis heat stress.

2. **`lib/agriculture/pest-disease-database.ts`**:
   - Diagnostic guides for Yellow Rust, Leaf Rust, Bacterial Leaf Blight, Whitefly.
   - Conducive environmental triggers (temperature ranges and relative humidity).
   - Integrated Pest Management (IPM) chemical and non-chemical controls with approved doses (e.g., Propiconazole 25% EC @ 1 ml/L).

---

## 7. Step-by-Step API Key Configuration

To connect live upstream government feeds, add these keys to `.env.local` or Vercel Environment Variables:

```env
# data.gov.in AGMARKNET Live Market Prices
# Register at https://data.gov.in to obtain an API key.
DATA_GOV_IN_API_KEY=your_registered_api_key_here

# IMD Mausam Weather Observation (Optional)
# If omitted, Open-Meteo provides immediate live meteorological observation.
IMD_API_KEY=your_imd_api_key_here

# ISRO Bhuvan / NRSC Remote Sensing (Planned)
# Requires signed institutional memorandum with NRSC Hyderabad.
ISRO_BHUVAN_TOKEN=
```

---

## 8. Database Migrations

The migration `supabase/migrations/20260922_real_data_architecture.sql` creates the required relational tables:
- `soil_profiles`: 12-parameter laboratory test data with farmer ID ownership and RLS.
- `market_prices`: Cached Mandi price observations and historical records.
- `government_advisories`: Official bulletins with timestamp and `valid_until` expiry timestamp.
- Procedural function `clean_expired_agricultural_cache()` for background cleanup.

---

## 9. Source Transparency & User Disclaimer

Every dashboard widget displays:
- Authoritative source tag (`Source: AGMARKNET / data.gov.in`, `Source: IMD`, `Source: ICAR`)
- Date / Freshness timestamp
- Explicit disclaimer: *"AgriAI recommendations are decision-support aids based on verified agronomic models. Always verify local soil and market conditions with your designated Krishi Vigyan Kendra (KVK) or district agricultural officer."*
