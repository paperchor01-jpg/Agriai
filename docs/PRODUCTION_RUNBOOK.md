# AgriAI Production Architecture & Operations Runbook (SIH25010)

## 1. Executive Architecture Summary

AgriAI is designed as an elastic, serverless-native agricultural advisory platform built to support scale from **100 farmers** (MVP) to **100,000+ active farmers** across rural and peri-urban India with high reliability, sub-second telemetry delivery, and cost control.

```
                    ┌───────────────────────────────┐
                    │      Farmer Mobile & Web      │
                    │ (Next.js 16 App Router Client)│
                    └───────────────┬───────────────┘
                                    │ HTTPS
                                    ▼
                    ┌───────────────────────────────┐
                    │   Next.js Edge Middleware     │
                    │  - Security Headers (CSP/HSTS)│
                    │  - Request ID Correlation     │
                    └───────────────┬───────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Distributed Rate Limiter     │
                    │  Tier 1: Upstash Redis REST   │
                    │  Tier 2: Supabase RPC         │
                    │  Tier 3: In-Memory Window     │
                    └───────┬───────────────┬───────┘
                            │               │
            ┌───────────────┘               └───────────────┐
            ▼                                               ▼
┌───────────────────────────────┐       ┌───────────────────────────────┐
│       /api/weather            │       │     /api/crop-diagnosis       │
│ - Coordinate Clustering ~1.1km│       │ - SHA-256 Deduplication Cache │
│ - L1 Memory + L2 DB Cache     │       │ - In-Flight Concurrency Lock  │
│ - Open-Meteo Circuit Breaker  │       │ - 15s Timeout Enforcement     │
│ - Resilient Exponential Retry │       │ - EXIF & Magic Byte Validation│
└───────────────┬───────────────┘       └───────────────┬───────────────┘
                │                                       │
                └───────────────┬───────────────────────┘
                                │
                                ▼
                ┌───────────────────────────────┐
                │   Supabase PostgreSQL Engine  │
                │ - Row Level Security (RLS)    │
                │ - High-Performance Indexes    │
                │ - background_jobs Queue       │
                │ - audit_logs Table            │
                └───────────────────────────────┘
```

---

## 2. Scale Evolution Milestones

| Stage | Target Active Users | Key Scaling Mechanisms | Infrastructure Requirements |
| :--- | :--- | :--- | :--- |
| **Stage 1 (Current MVP)** | 100 Farmers | In-Memory Sliding Window, Demo Isolation, Zero-Data Onboarding | Supabase Free/Pro Tier, Vercel Serverless |
| **Stage 2 (District Pilot)** | 1,000 Farmers | Supabase Atomic RPC Rate Limiting (`public.rate_limits`), L2 Weather Cache (`public.weather_cache`), Composite B-Tree Indexes | Supabase Pro (Micro Compute), Vercel Standard |
| **Stage 3 (State Expansion)**| 10,000 Farmers | Upstash Redis REST Caching, Background Jobs Queue (`public.background_jobs`), Keyset Pagination | Supabase Small/Medium Compute with PgBouncer, Upstash Redis |
| **Stage 4 (Pan-India Production)** | 100,000+ Farmers | CDN Edge Caching, Geo-Partitioned Read Replicas, S3/Supabase Storage Signed CDN URLs | Supabase Dedicated Cluster, Edge Functions, High-Availability Redis |

---

## 3. Database Architecture & Scalability

### 3.1 Composite Indexes & Keyset Pagination
Large datasets must never perform unindexed sequential scans or unconstrained `OFFSET` queries.
- **Index `idx_farms_farmer_created`**: Scopes queries to `(farmer_id, created_at DESC)`, enabling O(log N) keyset pagination via `WHERE created_at < cursor`.
- **Index `idx_farms_state_district`**: Powers macro authority aggregation queries without touching farmer personal records.
- **Index `idx_weather_cache_coords`**: Powers fast geospatial coordinate matching for clustered weather telemetry.

### 3.2 Backup & Disaster Recovery (PITR)
- **Point-in-Time Recovery (PITR)**: Enable PITR in Supabase Dashboard (`Database` -> `Backups`). Retains physical WAL logs allowing restoration to any precise second within the retention window (7 to 30 days).
- **Target RPO (Recovery Point Objective)**: < 5 minutes.
- **Target RTO (Recovery Time Objective)**: < 30 minutes.
- **Automated Schema Dump**:
  ```bash
  # Daily schema and data backup (via Supabase CLI)
  npx supabase db dump -f backup_$(date +%Y%m%d).sql
  ```

### 3.3 Automated Maintenance & Pruning
Execute `public.cleanup_expired_records()` periodically via cron (e.g. Supabase `pg_cron` or scheduled GitHub Action/Vercel Cron) to purge expired rate limits and stale weather cache rows:
```sql
SELECT public.cleanup_expired_records();
```

---

## 4. API Resilience & Rate Limiting

### 4.1 Tier Limits & Windows
| Tier | Endpoint Scope | Limit | Window | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `AUTH` | Sign in, Sign up, OTP | 10 req | 60 sec | Prevents brute-force credential stuffing |
| `AI_VISION` | `/api/crop-diagnosis` | 10 req | 60 sec | Strict cost containment against LLM spam |
| `AI_CHAT` | AgriAI Copilot Chat | 20 req | 60 sec | Conversational load smoothing |
| `WEATHER` | `/api/weather` | 60 req | 60 sec | Clustered caching absorbs 90% of requests |
| `GENERAL_API`| Job polling, farm queries | 100 req | 60 sec | Standard application telemetry |
| `ADMIN` | `/api/authority/metrics` | 30 req | 60 sec | Macro surveillance protection |

### 4.2 Rate Limiter Hierarchy
1. **Tier 1 (External Distributed)**: Upstash Redis REST API (zero npm dependencies, edge-compatible). Activated automatically when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are populated.
2. **Tier 2 (Database Distributed)**: Supabase PostgreSQL atomic stored procedure `public.increment_rate_limit(key, window, limit)`.
3. **Tier 3 (Local Fallback)**: High-performance in-memory sliding window cache with automated interval cleanup.

---

## 5. Weather Telemetry & Coordinate Clustering

### 5.1 The 1.1km Grid Clustering Strategy
Individual farm plots in rural India are often situated within 1-2 kilometers of each other in the same village or panchayat. Fetching distinct weather data per farm is wasteful and costly.
- **Algorithm**: AgriAI truncates latitude and longitude to 2 decimal places (`lat.toFixed(2)`, `lon.toFixed(2)`), mapping the coordinate to a ~1.1km x 1.1km geographic grid.
- **Multi-Tier Cache**:
  - **L1**: In-memory LRU map (instant 0ms response).
  - **L2**: Supabase `public.weather_cache` (shared across all serverless instances).
  - **TTL**: 15 minutes for current telemetry, 1 hour for 5-day forecasts.

---

## 6. AI Vision Cost & Concurrency Protection

1. **SHA-256 Image Deduplication**: Computes SHA-256 hash of image payload. Identical re-submissions return cached diagnosis results immediately without calling Google Gemini or OpenAI.
2. **In-Flight Concurrency Lock**: If two farmers in a slow-network village upload the same image simultaneously, or a user rapidly clicks "Diagnose" multiple times, AgriAI joins the pending execution promise rather than spawning duplicate LLM API invocations.
3. **15-Second Hard Timeout**: All third-party AI calls are wrapped in `resilientFetch` with `AbortController` signals to guarantee serverless execution caps.
4. **Binary Magic Byte Verification**: Validates image headers (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG, `RIFF...WEBP` for WEBP) to block non-image binaries before processing.
5. **EXIF GPS Stripping**: Automatically strips EXIF/APP1 segments to protect farmer privacy and prevent accidental geolocation leakage.

---

## 7. Incident Response & Runbook Diagnostics

### 7.1 Symptom: AI Vision Endpoints Returning 429
- **Action**: Check if client exceeded 10 requests/minute. Verify if `UPSTASH_REDIS_REST_URL` or Supabase `rate_limits` table is healthy. Check response `Retry-After` header.

### 7.2 Symptom: Weather Telemetry Showing Local Fallback
- **Action**: Verify Open-Meteo or WeatherAPI status. Check circuit breaker state in server logs. Inspect network connectivity from serverless runtime.

### 7.3 Symptom: Slow Farm List Queries (> 1000ms)
- **Action**: Verify index `idx_farms_farmer_created` is present in Supabase:
  ```sql
  EXPLAIN ANALYZE SELECT * FROM public.farms WHERE farmer_id = '...' ORDER BY created_at DESC LIMIT 20;
  ```
  Ensure query uses Index Scan, not Seq Scan.

### 7.4 Symptom: Signup Shows "Rate Limit Exceeded" / HTTP 429
- **Root Cause**:
  1. Supabase Free Tier built-in SMTP has a hard default rate limit of **3 to 4 confirmation emails per hour**.
  2. When multiple signups or double-click requests fire, Supabase Auth returns HTTP 429 (`over_email_send_rate_limit` or `rate_limit_exceeded`).
- **Application Safeguards**:
  - Frontend: `LoginPage` enforces synchronous `isSubmittingRef` submission locking and disables submit buttons immediately on click.
  - Client Service: `lib/auth-service.ts` implements in-flight promise deduplication (`inFlightSignups` Map) so duplicate concurrent requests share a single network call.
  - Error Translation: HTTP 429 and rate-limit errors are converted into user-friendly guidance explaining the temporary email rate limit and offering Demo Login.
- **Environment Configuration Remediation**:
  - **For Staging / QA**: In Supabase Dashboard -> `Authentication` -> `Providers` -> `Email`, toggle **Confirm email** to `OFF`. This allows immediate user creation without sending emails and completely bypasses the 3-4 emails/hour limit during testing.
  - **For Production**: Configure Custom SMTP (Resend, SendGrid, Brevo, or AWS SES) under Supabase Dashboard -> `Project Settings` -> `Authentication` -> `SMTP Settings`. This replaces the built-in test SMTP service and unlocks high-volume transactional email delivery.

