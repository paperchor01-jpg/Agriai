/**
 * AgriAI Production Scale Verification Suite
 * 
 * Verifies all 37 architectural scale enhancements:
 * 1. Multi-Tier Distributed Rate Limiter
 * 2. Weather Coordinate Clustering & Multi-Tier Caching
 * 3. AI Vision Deduplication Cache & Concurrency Lock
 * 4. Image Security (Magic Byte Check & EXIF Stripping)
 * 5. Keyset Pagination & Query Optimization
 * 6. Background Job Queue Lifecycle
 * 7. Structured Logging PII & Secret Redaction
 * 8. Resilience, Exponential Backoff & Circuit Breakers
 */

import { distributedRateLimiter, RATE_LIMIT_TIERS } from '../lib/distributed-rate-limiter';
import { clusterCoordinates } from '../lib/weather-cache';
import {
  computePayloadHash,
  getCachedAiResult,
  setCachedAiResult,
  executeProtectedAiTask,
} from '../lib/ai-protection';
import { verifyImageMagicBytes, stripExifMetadata } from '../lib/storage-service';
import {
  normalizePageLimit,
  buildKeysetResult,
  buildSelectiveFields,
} from '../lib/pagination-helper';
import { jobQueue } from '../lib/job-queue';
import { sanitizeLogData } from '../lib/logger';
import { calculateBackoff, CircuitBreaker } from '../lib/resilience';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`  \x1b[32m✔\x1b[0m ${message}`);
    testsPassed++;
  } else {
    console.error(`  \x1b[31m✖\x1b[0m ${message}`);
    testsFailed++;
  }
}

async function runProductionScaleTests() {
  console.log('\n======================================================');
  console.log('       AgriAI Production Scale Architecture Verification');
  console.log('======================================================\n');

  // ------------------------------------------------------------------
  // 1. Distributed Rate Limiter Testing
  // ------------------------------------------------------------------
  console.log('1. Distributed Rate Limiter (Multi-Tier & Window Verification)');
  const testIp = `test-client-${Date.now()}`;
  const tier = 'AUTH';
  const maxReq = RATE_LIMIT_TIERS[tier].maxRequests;

  let allowedCount = 0;
  let rejectedCount = 0;

  for (let i = 0; i < maxReq + 5; i++) {
    const res = await distributedRateLimiter.checkLimit(tier, testIp);
    if (res.allowed) {
      allowedCount++;
    } else {
      rejectedCount++;
      assert(res.retryAfter > 0, `Returns valid Retry-After header (${res.retryAfter}s)`);
      assert(res.headers['X-RateLimit-Limit'] === String(maxReq), 'Contains X-RateLimit-Limit');
      assert(res.headers['X-RateLimit-Remaining'] === '0', 'X-RateLimit-Remaining drops to 0');
      break;
    }
  }

  assert(allowedCount === maxReq, `Allowed exactly ${maxReq} requests before throttling`);
  assert(rejectedCount > 0, 'Throttled subsequent burst requests with HTTP 429 semantics');

  // ------------------------------------------------------------------
  // 2. Weather Coordinate Clustering (~1.1km Grid)
  // ------------------------------------------------------------------
  console.log('\n2. Weather Coordinate Clustering & Spatial Cache');
  // Two farm plots located 300 meters apart in the same village:
  // Plot A: (30.9124, 75.8541)
  // Plot B: (30.9142, 75.8519)
  const clusterA = clusterCoordinates(30.9124, 75.8541);
  const clusterB = clusterCoordinates(30.9142, 75.8519);

  assert(clusterA.clusterLat === 30.91, 'Plot A clustered latitude rounded to 2 decimals (30.91)');
  assert(clusterA.clusterLon === 75.85, 'Plot A clustered longitude rounded to 2 decimals (75.85)');
  assert(clusterA.cacheKey === clusterB.cacheKey, 'Neighboring plots share identical clustered cacheKey');
  assert(clusterA.cacheKey === 'weather:geo:30.91:75.85', 'Cache key format matches weather:geo:lat:lon');

  // ------------------------------------------------------------------
  // 3. AI Deduplication Cache & Concurrency Lock
  // ------------------------------------------------------------------
  console.log('\n3. AI Protection (SHA-256 Deduplication & Concurrency Lock)');
  const dummyImagePayload = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const hash = computePayloadHash(dummyImagePayload);

  assert(hash.length === 64, `SHA-256 hash successfully generated (${hash.slice(0, 16)}...)`);

  const mockResult = { id: 'diag-test', crop: 'Wheat', disease: 'Leaf Rust', confidence: 94 };
  setCachedAiResult(hash, mockResult, 60);

  const cachedResult = getCachedAiResult(hash);
  assert(cachedResult !== null && (cachedResult as any).disease === 'Leaf Rust', 'Cache returns stored result');

  // Test concurrency lock
  let taskExecutionCount = 0;
  const slowTask = async () => {
    taskExecutionCount++;
    await new Promise((r) => setTimeout(r, 100));
    return { status: 'completed', value: 42 };
  };

  const lockKey = `task-${Date.now()}`;
  const [res1, res2] = await Promise.all([
    executeProtectedAiTask(lockKey, slowTask),
    executeProtectedAiTask(lockKey, slowTask),
  ]);

  assert(taskExecutionCount === 1, 'Concurrent identical tasks executed only once via in-flight lock');
  assert(res1.result.value === 42 && res2.result.value === 42, 'Both concurrent callers received valid result');
  assert(res1.wasInFlight === false && res2.wasInFlight === true, 'Secondary caller flagged wasInFlight=true');

  // ------------------------------------------------------------------
  // 4. Image Security (Magic Byte Validation & EXIF Stripping)
  // ------------------------------------------------------------------
  console.log('\n4. Image Security (Magic Byte Header Check & Privacy Stripping)');
  // JPEG magic bytes: FF D8 FF
  const validJpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01]);
  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  const validPng = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  // Fake executable/malicious buffer: 4D 5A (MZ DOS executable)
  const fakeExe = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00]);

  const jpegCheck = verifyImageMagicBytes(validJpeg);
  const pngCheck = verifyImageMagicBytes(validPng);
  const exeCheck = verifyImageMagicBytes(fakeExe);

  assert(jpegCheck.valid && jpegCheck.detectedMime === 'image/jpeg', 'Verified genuine JPEG binary header');
  assert(pngCheck.valid && pngCheck.detectedMime === 'image/png', 'Verified genuine PNG binary header');
  assert(!exeCheck.valid, 'Rejected disguised non-image binary payload');

  // EXIF stripping verification
  const stripped = stripExifMetadata(validJpeg, 'image/jpeg');
  assert(stripped.length > 0, 'EXIF stripping pipeline successfully processed JPEG buffer');

  // ------------------------------------------------------------------
  // 5. Keyset Pagination & Selective Query Builder
  // ------------------------------------------------------------------
  console.log('\n5. Keyset Pagination & Selective Field Projection');
  const mockRows = Array.from({ length: 25 }, (_, i) => ({
    id: `farm-${i + 1}`,
    created_at: new Date(Date.now() - i * 60000).toISOString(),
    name: `Farm Plot ${i + 1}`,
  }));

  const page = buildKeysetResult(mockRows, 10);
  assert(page.data.length === 10, 'Sliced exact page size (10 items)');
  assert(page.hasMore === true, 'Correctly flagged hasMore=true');
  assert(page.nextCursor === mockRows[9].created_at, 'Derived correct nextCursor for next page query');

  const normalizedLimit = normalizePageLimit(500);
  assert(normalizedLimit === 100, 'Normalized and clamped excessive page limit (500 -> 100)');

  const fields = buildSelectiveFields(['id', 'farm_name', 'crop', 'area'], ['farm_name', 'crop', 'malicious_col']);
  assert(fields === 'farm_name, crop', 'Filtered selective fields against whitelist');

  // ------------------------------------------------------------------
  // 6. Background Job Queue Lifecycle
  // ------------------------------------------------------------------
  console.log('\n6. Background Job Queue Lifecycle');
  const jobId = await jobQueue.enqueue('macro_yield_simulation', { state: 'Punjab', acres: 450 });
  assert(typeof jobId === 'string' && jobId.startsWith('job-'), 'Enqueued job and returned unique ID');

  const fetchedJob = await jobQueue.getJob(jobId);
  assert(fetchedJob !== null && fetchedJob.status === 'queued', 'Polled job in "queued" state');

  await jobQueue.updateStatus(jobId, 'processing');
  const processingJob = await jobQueue.getJob(jobId);
  assert(processingJob?.status === 'processing', 'Transitioned job to "processing"');

  await jobQueue.updateStatus(jobId, 'completed', { estimatedYieldTons: 312.4 });
  const completedJob = await jobQueue.getJob(jobId);
  assert(completedJob?.status === 'completed', 'Completed job successfully');
  assert(completedJob?.result?.estimatedYieldTons === 312.4, 'Result payload persisted correctly');

  // ------------------------------------------------------------------
  // 7. Structured Logger PII Redactor
  // ------------------------------------------------------------------
  console.log('\n7. Structured Logger PII & Secret Redaction');
  const rawData = {
    farmerEmail: 'arjun.singh@gmail.com',
    farmerPhone: '+91 9876543210',
    apiKey: 'AIzaSyDemoKey1234567890123456789012345',
    password: 'super-secret-password-123',
    sessionToken: 'secret_session_token_value',
    rawHeader: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xyz',
    safeField: 'Healthy Crop Diagnosis',
  };

  const sanitized = sanitizeLogData(rawData);
  assert(sanitized.password === '[REDACTED]', 'Redacted password field key');
  assert(sanitized.apiKey === '[REDACTED]', 'Redacted apiKey field key');
  assert(sanitized.sessionToken === '[REDACTED]', 'Redacted sessionToken field key');
  assert(sanitized.farmerEmail.includes('***@***'), 'Masked email address PII');
  assert(sanitized.farmerPhone.includes('[REDACTED_PHONE]'), 'Masked phone number PII');
  assert(sanitized.rawHeader.includes('[REDACTED_TOKEN]'), 'Masked Bearer token inside string content');
  assert(sanitized.safeField === 'Healthy Crop Diagnosis', 'Preserved non-sensitive fields intact');

  // ------------------------------------------------------------------
  // 8. Resilience, Exponential Backoff & Circuit Breaker
  // ------------------------------------------------------------------
  console.log('\n8. Resilience, Exponential Backoff & Circuit Breakers');
  const backoff0 = calculateBackoff(0, 500, 5000);
  const backoff2 = calculateBackoff(2, 500, 5000);
  assert(backoff0 >= 500 && backoff0 <= 1000, 'Attempt 0 backoff with jitter is within expected range');
  assert(backoff2 >= 2000, 'Attempt 2 backoff scaled exponentially');

  const cb = new CircuitBreaker('test-service', 2, 500);
  assert(cb.getState() === 'CLOSED', 'Circuit starts in CLOSED state');

  try {
    await cb.execute(async () => { throw new Error('Simulated failure 1'); });
  } catch {}
  try {
    await cb.execute(async () => { throw new Error('Simulated failure 2'); });
  } catch {}

  assert(cb.getState() === 'OPEN', 'Circuit tripped to OPEN state after exceeding threshold');

  // Fallback execution when circuit is open
  const fallbackVal = await cb.execute(
    async () => 'primary',
    async () => 'fallback-value'
  );
  assert(fallbackVal === 'fallback-value', 'Circuit immediately invokes fallback when OPEN');

  // ------------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`Verification Complete: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('======================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  }
}

runProductionScaleTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
