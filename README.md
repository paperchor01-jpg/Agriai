# AgriAI — Smart Crop Advisory System (SIH25010)

> An intelligent, data-driven agricultural advisory system tailored for small and marginal farmers across India. AgriAI combines microclimate weather forecasting, AI-assisted computer vision crop diagnosis, localized soil phenology tracking, and rule-based agronomic advisory intelligence to maximize yields and mitigate climate risks.

---

## 1. Project Overview

AgriAI addresses the Smart India Hackathon problem statement **SIH25010** by delivering actionable, hyper-local agricultural intelligence to farmers:
- **Farm Portfolio Management**: Manage multiple plots, soil telemetry (pH, moisture, N-P-K), and active phenological crop stages.
- **AI Crop Doctor**: Real-time foliar crop pathology identification using computer vision (Google Gemini / OpenAI Vision) with severity ratings and containment guidance.
- **Weather Radar**: Real-time microclimate meteorological forecasts powered by Open-Meteo with dynamic precipitation probabilities and wind bearings.
- **Data-Driven Smart Advisory**: Transparent, rule-based agronomic engine translating soil moisture, weather forecasts, and crop stages into prioritized field action plans.
- **Yield Prediction**: Multi-factor yield estimation calculating projected harvests and optimization potential based on active farm health.
- **Farm Risk Monitor**: Automated risk categorizations across Disease Risk, Weather Hazard, Water Stress, and Pest Pressure.
- **AgriAI Farming Assistant**: Global conversational AI assistant contextualized to active plot telemetry.

---

## 2. Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19 & Turbopack
- **Language**: TypeScript (Strict mode, zero `any` leaks)
- **Styling**: Tailwind CSS with custom AgTech color tokens
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL with Row Level Security, Supabase Auth)
- **Weather Provider**: Open-Meteo Weather API (WMO standardized, zero-key default) + optional WeatherAPI.com
- **AI Vision Engine**: Google Gemini Vision (`gemini-2.5-flash`) / OpenAI Vision (`gpt-4o-mini`) via server-side `/api/crop-diagnosis`
- **Icons & UI**: Lucide React, Headless components

---

## 3. Local Setup

### Prerequisites
- Node.js `v18.17+` or `v20+`
- npm `v9+` or `v10+`

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-org/agriai.git
cd agriai

# 2. Install dependencies
npm install

# 3. Create your local environment file
cp .env.example .env.local
```

---

## 4. Environment Variables

Configure your `.env.local` file (never commit this file to version control):

```bash
# Supabase Configuration
# Retrieve from Supabase Project Settings -> API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-api-key-here

# Weather API Configuration (Optional)
# AgriAI uses Open-Meteo by default (free, real-time live data, zero key required).
# To use WeatherAPI.com or OpenWeatherMap, specify your secret key:
WEATHER_API_KEY=

# AI Vision Model Configuration (AI Crop Doctor)
# Recommended: Google Gemini Vision (Generous free tier, no credit card required)
# Obtain a free key from Google AI Studio: https://aistudio.google.com/
# (Kept strictly server-side in /api/crop-diagnosis, never exposed to browser)
GEMINI_API_KEY=
AI_API_KEY=
OPENAI_API_KEY=
```

---

## 5. Development & Production Commands

```bash
# Run local development server with Turbopack (http://localhost:3000)
npm run dev

# Run TypeScript validation check (0 errors)
npx tsc --noEmit

# Compile production build
npm run build

# Start production server
npm run start

# Run automated tests
npx tsx scripts/test-smart-advisory.ts
```

---

## 6. Supabase Database Setup & Migrations

AgriAI uses PostgreSQL with strict Row Level Security (RLS) to ensure multi-tenant data isolation between farmers.

### Apply Database Migrations
1. Open your **Supabase Dashboard** $\rightarrow$ **SQL Editor**.
2. Run the foundational schema migration:
   - File: [`supabase/migrations/20260830_initial_schema.sql`](supabase/migrations/20260830_initial_schema.sql)
3. Run the authentication and hardened Row Level Security migration:
   - File: [`supabase/migrations/20260830_auth_rls.sql`](supabase/migrations/20260830_auth_rls.sql)

### Tables & Policies
- **`public.farmers`**: Stores profile information (`name`, `location`, `farm_size`, `preferred_language`).
  - RLS: `auth.uid() = id` for SELECT, INSERT, UPDATE.
- **`public.farms`**: Stores farm plots (`farm_name`, `area`, `soil_ph`, `soil_moisture`, `crop`, `crop_stage`).
  - RLS: `auth.uid() = farmer_id` for SELECT, INSERT, UPDATE, DELETE.
  - Foreign key constraint to `farmers(id)` with `ON DELETE CASCADE`.
- **`auth.users` trigger**: Automatically creates a matching `public.farmers` profile upon new user signup.

---

## 7. Authentication Setup

- Built with **Supabase Auth** (`email` + `password`).
- **Session Persistence**: Automated through Supabase JS Client with browser storage.
- **Protected Routes**: `/dashboard`, `/farms`, `/crop-doctor`, `/weather`, `/advisory`, `/yield-prediction`, `/analytics`, `/alerts`, `/profile`.
- **Security Rule**: Unauthenticated requests are automatically redirected to `/login`. Passwords are never stored manually or logged.

---

## 8. Weather API Configuration

- **Default Provider**: **Open-Meteo**. Zero API key required; works immediately out-of-the-box in local development and production.
- **Coordinates Resolution**: Automatically resolves Indian agricultural hubs (`Ludhiana`, `Amritsar`, `Bathinda`, `Patiala`, `Karnal`, etc.) to coordinates.
- **Caching**: 5-minute server-side cache in `/api/weather` to eliminate redundant external calls.
- **Fallback**: Gracefully falls back to prototype reference data if external networks time out.

---

## 9. AI Vision Model Configuration (AI Crop Doctor)

- **Endpoint**: `POST /api/crop-diagnosis`
- **Validation**: Accepts JPG, JPEG, PNG, WEBP files up to 10MB; rejects invalid types or oversized payloads with HTTP 400.
- **Providers Supported**:
  - **Google Gemini Vision** (`gemini-2.5-flash`) via `GEMINI_API_KEY` or `AI_API_KEY`.
  - **OpenAI Vision** (`gpt-4o-mini`) via `OPENAI_API_KEY`.
- **Rate Limiting**: Server-side client window limiting (max 20 requests/minute) with SHA-256 duplicate image caching (10 min TTL).
- **Prompt Safety**: Instructs model to diagnose only visible symptoms, flag uncertainty for blurry/non-crop images, and provide cultural extension guidance rather than hazardous chemical dosages.

---

## 10. Security & Production Hardening

- **Zero Client Key Exposure**: All third-party secrets (`WEATHER_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`) remain strictly on the server in Next.js route handlers.
- **Security Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `X-DNS-Prefetch-Control: on`
- **XSS Protection**: Zero use of `dangerouslySetInnerHTML`; all user inputs are rendered as safe React JSX text nodes.
- **Input Bounds Sanitization**: Farm areas clamped (0.1–50,000 acres), soil pH validated (3.0–11.0), and soil moisture bounded (0–100%).
- **Dependency Audit**: 0 vulnerabilities across all npm dependencies.

---

## 11. Deployment Checklist (Vercel / Cloud)

1. Push your repository to GitHub / GitLab.
2. Link the repository to **Vercel** or your hosting provider.
3. Configure Environment Variables in the project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (or `AI_API_KEY`)
   - `WEATHER_API_KEY` (optional)
4. Deploy the build:
   - Framework preset: **Next.js**
   - Build command: `npm run build`
   - Output directory: `.next`
