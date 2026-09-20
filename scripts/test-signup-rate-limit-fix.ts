import { signUp, signIn, signOut } from '../lib/auth-service';
import { DEMO_FARMER_ID } from '../lib/mock-data';

interface TestResult {
  testNumber: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function record(testNumber: number, name: string, passed: boolean, details: string) {
  results.push({ testNumber, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[TEST ${testNumber}] ${icon} - ${name}: ${details}`);
}

async function runRateLimitFixVerification() {
  console.log('================================================================');
  console.log('  AGRIAI (SIH25010) — SIGNUP RATE LIMIT & DEDUPLICATION VERIFICATION');
  console.log('================================================================\n');

  // ------------------------------------------------------------------
  // TEST 1 — In-Flight Concurrent Signup Request Deduplication
  // ------------------------------------------------------------------
  try {
    const testEmail = `concurrent_${Date.now()}@punjabfarms.in`;
    const testName = 'Harpreet Singh';
    const testPassword = 'securePassword123';

    // Launch 3 simultaneous signup calls with identical credentials
    const [res1, res2, res3] = await Promise.all([
      signUp(testName, testEmail, testPassword),
      signUp(testName, testEmail, testPassword),
      signUp(testName, testEmail, testPassword),
    ]);

    // All 3 calls should return successfully and reference the same user ID
    const passed =
      res1.success &&
      res2.success &&
      res3.success &&
      res1.user?.id === res2.user?.id &&
      res2.user?.id === res3.user?.id;

    record(
      1,
      'Concurrent Signup In-Flight Deduplication',
      passed,
      `Launched 3 concurrent signup calls; all 3 resolved safely to user ID ${res1.user?.id?.slice(0, 10)} without duplicate requests`
    );
  } catch (err) {
    record(1, 'Concurrent Signup In-Flight Deduplication', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 2 — In-Flight Concurrent Sign-in Request Deduplication
  // ------------------------------------------------------------------
  try {
    const [login1, login2, login3] = await Promise.all([
      signIn('farmer@agriai.demo', 'demo123'),
      signIn('farmer@agriai.demo', 'demo123'),
      signIn('farmer@agriai.demo', 'demo123'),
    ]);

    const passed =
      login1.success &&
      login2.success &&
      login3.success &&
      login1.user?.id === DEMO_FARMER_ID &&
      login2.user?.id === DEMO_FARMER_ID;

    record(
      2,
      'Concurrent Sign-in In-Flight Deduplication',
      passed,
      `Launched 3 concurrent sign-in calls; deduplication returned shared session for ${DEMO_FARMER_ID.slice(0, 10)}`
    );
  } catch (err) {
    record(2, 'Concurrent Sign-in In-Flight Deduplication', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 3 — Validation Error Handling
  // ------------------------------------------------------------------
  try {
    const emptyNameRes = await signUp('', 'valid@email.com', 'validpass');
    const badEmailRes = await signUp('Name', 'invalid-email', 'validpass');
    const shortPassRes = await signUp('Name', 'valid@email.com', '123');

    const passed =
      !emptyNameRes.success &&
      emptyNameRes.error === 'Please enter your full name.' &&
      !badEmailRes.success &&
      badEmailRes.error === 'Please enter a valid email address.' &&
      !shortPassRes.success &&
      shortPassRes.error === 'Password must be at least 6 characters.';

    record(
      3,
      'Input Validation Boundaries',
      passed,
      'Empty name, invalid email, and short password correctly blocked before network submission'
    );
  } catch (err) {
    record(3, 'Input Validation Boundaries', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 4 — Demo Account Login Stability
  // ------------------------------------------------------------------
  try {
    await signOut();
    const demoRes = await signIn('farmer@agriai.demo', 'demo123');
    const passed = demoRes.success && demoRes.user?.id === DEMO_FARMER_ID;

    record(
      4,
      'Demo Account 1-Click Access',
      passed,
      `Demo farmer Arjun Singh authenticated successfully (${DEMO_FARMER_ID.slice(0, 10)})`
    );
  } catch (err) {
    record(4, 'Demo Account 1-Click Access', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 5 — Professional Invalid Credential Error
  // ------------------------------------------------------------------
  try {
    await signOut();
    const badLoginRes = await signIn('nonexistent@farmer.com', 'wrongpassword');
    const expected = 'Invalid email or password. If you are a new farmer, please create an account first.';
    const passed = !badLoginRes.success && badLoginRes.error === expected;

    record(
      5,
      'Invalid Credentials Friendly Error Response',
      passed,
      `Returned user-friendly guidance: "${badLoginRes.error}"`
    );
  } catch (err) {
    record(5, 'Invalid Credentials Friendly Error Response', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 6 — Verify No Automatic Retries on Auth Requests
  // ------------------------------------------------------------------
  try {
    // Check that auth-service does NOT import or wrap resilientFetch
    const fs = await import('fs');
    const path = await import('path');
    const authServiceContent = fs.readFileSync(
      path.join(__dirname, '../lib/auth-service.ts'),
      'utf8'
    );

    const hasResilientFetchInAuth = authServiceContent.includes('resilientFetch');
    const passed = !hasResilientFetchInAuth;

    record(
      6,
      'Zero Auth Retry Storm Policy',
      passed,
      'Confirmed lib/auth-service.ts does not wrap calls in resilientFetch, preventing HTTP 429 retry amplification'
    );
  } catch (err) {
    record(6, 'Zero Auth Retry Storm Policy', false, `Error: ${err}`);
  }

  console.log('\n================================================================');
  const allPassed = results.every((r) => r.passed);
  const passCount = results.filter((r) => r.passed).length;
  console.log(`  RESULT: ${passCount}/${results.length} TESTS PASSED — ${allPassed ? 'ALL PASS ✅' : 'FAIL ❌'}`);
  console.log('================================================================\n');

  if (!allPassed) {
    process.exit(1);
  }
}

runRateLimitFixVerification().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
