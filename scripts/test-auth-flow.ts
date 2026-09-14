import { signUp, signIn, signOut } from '../lib/auth-service';
import { getStoredFarms, saveStoredFarms, getStoredFarmer, DEMO_FARMER_ID, setActiveUserId } from '../lib/mock-data';
import { createFarm, getFarms } from '../lib/farm-service';
import { Farm } from '../types';

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

async function runAuthVerification() {
  console.log('================================================================');
  console.log('  AGRIAI (SIH25010) — REAL AUTHENTICATION & ONBOARDING VERIFICATION');
  console.log('================================================================\n');

  const testEmail = `farmer_${Date.now()}@punjabfarms.in`;
  const testPassword = 'securePassword123';
  const testName = 'Gurpreet Singh';

  // ------------------------------------------------------------------
  // TEST 1 — New User Signup
  // ------------------------------------------------------------------
  let createdUserId = '';
  try {
    const signupRes = await signUp(testName, testEmail, testPassword);
    const user = signupRes.user;
    createdUserId = user?.id || '';

    const initialFarms = getStoredFarms(createdUserId);
    const initialProfile = getStoredFarmer(createdUserId);

    const passed =
      signupRes.success &&
      !!createdUserId &&
      createdUserId !== DEMO_FARMER_ID &&
      Array.isArray(initialFarms) &&
      initialFarms.length === 0 &&
      initialProfile.name === testName &&
      initialProfile.email === testEmail;

    record(
      1,
      'New User Signup & 0-Farm Onboarding State',
      passed,
      `User ${createdUserId.slice(0, 10)} created with name "${initialProfile.name}", starting with ${initialFarms.length} farms (No demo contamination)`
    );
  } catch (err) {
    record(1, 'New User Signup & 0-Farm Onboarding State', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 2 — New User Login
  // ------------------------------------------------------------------
  try {
    await signOut();
    const loginRes = await signIn(testEmail, testPassword);
    const loggedInUser = loginRes.user;

    const passed =
      loginRes.success &&
      !!loggedInUser &&
      loggedInUser.id === createdUserId &&
      loggedInUser.email === testEmail;

    record(
      2,
      'New User Login with Registered Credentials',
      passed,
      `Signed in successfully as ${loggedInUser?.email} (User ID: ${loggedInUser?.id.slice(0, 10)})`
    );
  } catch (err) {
    record(2, 'New User Login with Registered Credentials', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 3 — Existing User Data Persistence
  // ------------------------------------------------------------------
  try {
    const newFarmPayload: Partial<Farm> = {
      name: 'Gurpreet Wheat Field',
      location: 'Moga, Punjab',
      areaAcres: 3.5,
      soil: {
        soilType: 'Loamy',
        ph: 7.0,
        nitrogen: 'Medium',
        phosphorus: 'High',
        potassium: 'Medium',
        moisture: 60,
      },
      crop: {
        name: 'Wheat',
        variety: 'PBW-550',
        stage: 'Vegetative',
        plantingDate: '2025-11-10',
      },
    };

    const createdFarm = await createFarm(newFarmPayload);
    const userFarms = getStoredFarms(createdUserId);

    const passed =
      userFarms.length === 1 &&
      userFarms[0].name === 'Gurpreet Wheat Field' &&
      createdFarm.areaAcres === 3.5;

    record(
      3,
      'Existing User Farm Creation & Data Persistence',
      passed,
      `Saved farm "${userFarms[0]?.name}" (${userFarms[0]?.areaAcres} acres) under user ${createdUserId.slice(0, 10)}`
    );
  } catch (err) {
    record(3, 'Existing User Farm Creation & Data Persistence', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 4 — Multi-Tenant User Isolation
  // ------------------------------------------------------------------
  const userBEmail = `userB_${Date.now()}@punjabfarms.in`;
  const userBPassword = 'userBPassword123';
  const userBName = 'Balwinder Kaur';

  try {
    await signOut();
    const signupB = await signUp(userBName, userBEmail, userBPassword);
    const userBId = signupB.user?.id || '';

    const farmsB = getStoredFarms(userBId);
    const profileB = getStoredFarmer(userBId);

    const userAFarms = getStoredFarms(createdUserId);

    const passed =
      signupB.success &&
      userBId !== createdUserId &&
      farmsB.length === 0 &&
      profileB.name === userBName &&
      userAFarms.length === 1;

    record(
      4,
      'Multi-Tenant Cross-User Data Isolation',
      passed,
      `User B (${userBName}) has ${farmsB.length} farms. User A still has ${userAFarms.length} farm. Zero data bleed.`
    );
  } catch (err) {
    record(4, 'Multi-Tenant Cross-User Data Isolation', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 5 — Demo Account Isolation
  // ------------------------------------------------------------------
  try {
    await signOut();
    const demoLoginRes = await signIn('farmer@agriai.demo', 'demo123');
    const demoUser = demoLoginRes.user;
    const demoFarms = getStoredFarms(DEMO_FARMER_ID);
    const demoProfile = getStoredFarmer(DEMO_FARMER_ID);

    const passed =
      demoLoginRes.success &&
      demoUser?.id === DEMO_FARMER_ID &&
      demoProfile.name === 'Arjun Singh' &&
      demoFarms.length === 3;

    record(
      5,
      'Demo Account Authentication & Separate Demo Dataset',
      passed,
      `Demo account authenticated as ${demoProfile.name} with ${demoFarms.length} plots (9.7 acres total)`
    );
  } catch (err) {
    record(5, 'Demo Account Authentication & Separate Demo Dataset', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // TEST 6 — Invalid Credentials Professional Error Message
  // ------------------------------------------------------------------
  try {
    await signOut();
    const wrongLoginRes = await signIn('someone@random.com', 'wrongpassword');

    const expectedMsg = 'Invalid email or password. If you are a new farmer, please create an account first.';
    const doesNotLeakDemoCreds = !wrongLoginRes.error?.includes('farmer@agriai.demo');
    const passed = !wrongLoginRes.success && wrongLoginRes.error === expectedMsg && doesNotLeakDemoCreds;

    record(
      6,
      'Invalid Credentials Professional Error Message',
      passed,
      `Returned: "${wrongLoginRes.error}" (Zero demo credential leakage to regular users)`
    );
  } catch (err) {
    record(6, 'Invalid Credentials Professional Error Message', false, `Error: ${err}`);
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

runAuthVerification().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
