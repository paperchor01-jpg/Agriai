# AgriAI — Disaster Recovery & Operational Incident Manual (SIH25010)

Comprehensive emergency recovery runbook and incident response framework for the AgriAI Smart Crop Advisory System.

---

## 1. System Architecture & Critical Dependencies

| Layer | Technology | Recovery Objective (RTO / RPO) | Hosting Provider |
| :--- | :--- | :--- | :--- |
| **Edge & Frontend** | Next.js 16 (App Router / Turbopack) | RTO < 5 min / RPO 0 min | Vercel Edge Network |
| **Primary Database** | PostgreSQL 15+ with RLS | RTO < 30 min / RPO < 24 hours (Free tier) or < 2 min (PITR Pro) | Supabase Managed Cloud |
| **Object Storage** | Supabase Storage (`crop-images` bucket) | RTO < 15 min / RPO < 1 hour | AWS S3 via Supabase multi-region |
| **Distributed Cache** | Upstash Redis REST / Spatial L2 DB Cache | RTO < 2 min / RPO N/A (ephemeral) | Upstash Serverless / Supabase |
| **AI Diagnosis Engine** | Google Gemini 2.5 Flash / OpenAI GPT-4o-mini | RTO < 1 min (Automated failover chain) | Google AI Studio / OpenAI API |

---

## 2. Threat Scenarios & Detection Telemetry

### Scenario A: Supabase Managed Database Outage / High Latency
* **Symptoms**:
  - `GET /api/ready` returns HTTP 503 (`checks.database = "disconnected"`).
  - Client queries timeout after 5,000ms.
  - Sentry / Vercel Runtime logs exhibit `Connection terminated unexpectedly` or `PGRST301`.
* **Automated Defensive Safeguard**:
  - AgriAI frontend gracefully activates local storage and offline cached farm profiles (`lib/offline-service.ts` and `lib/mock-data.ts`).
  - Weather service uses L1 memory cache and clustered static fallbacks so the farmer's dashboard never crashes.

### Scenario B: AI Vision API Exhaustion or Upstream Outage
* **Symptoms**:
  - `POST /api/crop-diagnosis` logs `Gemini vision execution failed` or upstream HTTP 429/503.
* **Automated Defensive Safeguard**:
  - **Tier 1**: In-flight concurrency lock suppresses duplicate concurrent identical image submissions.
  - **Tier 2**: SHA-256 deduplication returns cached diagnosis within 900s without calling third-party APIs.
  - **Tier 3**: Secondary fallback automatically transfers request to OpenAI GPT-4o-mini (`resilientFetch`).
  - **Tier 4**: If all external AI providers fail, AgriAI responds with verified agronomic reference diagnostic recommendations (`isFallback: true`), ensuring the farmer is never left without guidance.

### Scenario C: Corrupted Deployment / Breaking Application Release
* **Symptoms**:
  - HTTP 500 spike across multiple routes on Vercel.
  - Build failure or runtime exceptions in Server Components.

---

## 3. Disaster Recovery Procedures

### 3.1 Database Restore Procedure

> [!IMPORTANT]
> Supabase projects maintain automated daily backups on free-tier projects, and Point-In-Time-Recovery (PITR) up to 7 days on Pro tiers.

1. **Verify Outage Scope**:
   ```bash
   curl -I https://<your-project-ref>.supabase.co/rest/v1/
   ```
2. **Access Supabase Dashboard**:
   - Navigate to **Project Settings** -> **Database** -> **Backups**.
3. **Point-In-Time-Recovery (PITR)**:
   - Select a restore target 5–10 minutes prior to the corruption/incident timestamp.
   - Click **Restore to point in time**. Supabase clones the restored database into a new or target cluster.
4. **Scheduled Daily Backup Restore**:
   - Download the latest daily `.sql.gz` dump.
   - Restore using the PostgreSQL CLI via connection pooling port (6543) or direct port (5432):
   ```bash
   pg_restore -h aws-0-ap-south-1.pooler.supabase.com -p 6543 -U postgres.<project-ref> -d postgres -v <dump-file.sql>
   ```
5. **Reapply Production Migrations**:
   ```bash
   # Run all ordered migration scripts in supabase/migrations/
   # 1. 20260830_initial_schema.sql
   # 2. 20260830_auth_rls.sql
   # 3. 20260913_production_scale.sql
   # 4. 20260913_security_hardening.sql
   # 5. 20260920_production_hardening.sql
   ```
6. **Execute Database Health Verification**:
   ```sql
   SELECT count(*) FROM public.farmers;
   SELECT count(*) FROM public.farms;
   SELECT public.cleanup_expired_records();
   ```

---

### 3.2 Application & Edge Rollback Procedure

#### Instant Vercel Rollback (Recommended — < 60 seconds)
1. Open the [Vercel Dashboard](https://vercel.com/dashboard) -> **AgriAI** project.
2. Navigate to the **Deployments** tab.
3. Locate the last known healthy deployment prior to the incident.
4. Click the three dots (`...`) and select **Instant Rollback**.
5. All global edge nodes immediately redirect 100% of incoming production traffic to the verified release.

#### Git-Level Staging Branch Rollback
```bash
# 1. Check out staging branch
git checkout staging

# 2. Revert the problematic commit
git revert <faulty-commit-sha> -m 1

# 3. Verify build passes cleanly locally
npm run build

# 4. Push revert commit to staging
git push origin staging
```

---

### 3.3 Storage Recovery Procedure (`crop-images`)

1. **Bucket State Audit**:
   ```sql
   SELECT id, name, public, created_at FROM storage.buckets WHERE id = 'crop-images';
   ```
2. **Re-provisioning Missing Storage Bucket**:
   If the `crop-images` bucket was accidentally deleted or misconfigured, execute:
   ```sql
   INSERT INTO storage.buckets (id, name, public)
   VALUES ('crop-images', 'crop-images', true)
   ON CONFLICT (id) DO NOTHING;

   -- Restore storage RLS policies
   DROP POLICY IF EXISTS "Allow public read of crop images" ON storage.objects;
   CREATE POLICY "Allow public read of crop images"
     ON storage.objects FOR SELECT TO public
     USING (bucket_id = 'crop-images');

   DROP POLICY IF EXISTS "Allow authenticated upload of crop images" ON storage.objects;
   CREATE POLICY "Allow authenticated upload of crop images"
     ON storage.objects FOR INSERT TO authenticated
     WITH CHECK (bucket_id = 'crop-images');
   ```

---

### 3.4 Environment & Secret Recovery Procedure

If environment variables are corrupted or deleted in Vercel:

1. Refer to the safe templates:
   - Staging: [`.env.staging.example`](file:///C:/Users/hp/Desktop/agriai/.env.staging.example)
   - Production: [`.env.example`](file:///C:/Users/hp/Desktop/agriai/.env.example)
2. In Vercel Project Settings -> **Environment Variables**, repopulate:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY` (or `AI_API_KEY`)
   - `OPENAI_API_KEY`
   - `WEATHER_API_KEY`
   - `FORCE_JSON_LOGS=true`
   - `LOG_LEVEL=info`
3. Trigger a manual redeployment without cache to ensure environment variables are sealed into edge lambdas.

---

## 4. Post-Incident Verification Checklist

After any recovery event, execute the following verification steps before reopening traffic:

- [ ] `GET /api/health` returns HTTP 200 with `status: "ok"`.
- [ ] `GET /api/ready` returns HTTP 200 with `status: "ready"` and `checks.database: "connected"`.
- [ ] Run automated platform verification: `npx tsx scripts/test-master-platform.ts`.
- [ ] Run 8-layer security audit: `npx tsx scripts/test-8-layer-security.ts`.
- [ ] Perform foliar diagnosis upload test via `/crop-doctor` to ensure storage bucket is writable.
- [ ] Verify rate limiter is accepting and decrementing requests without false-positive 429 locks.
- [ ] Conduct root cause analysis (RCA) and document remedial actions in `docs/PRODUCTION_RUNBOOK.md`.
