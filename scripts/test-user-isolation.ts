import {
  getStoredFarms,
  saveStoredFarms,
  getSelectedFarmId,
  saveSelectedFarmId,
  getSelectedFarm,
  setActiveUserId,
  DEFAULT_FARMS,
  DEMO_FARMER_ID,
  DEFAULT_WEATHER,
  DEFAULT_DIAGNOSIS,
} from '../lib/mock-data';
import { getAdvisories } from '../lib/advisory-service';
import { getFarmHealthScore } from '../lib/farm-health-service';
import { Farm } from '../types';

interface TestResult {
  step: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function record(step: number, name: string, passed: boolean, details: string) {
  results.push({ step, name, passed, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[Step ${step}] ${icon} - ${name}: ${details}`);
}

async function runIsolationTests() {
  console.log('================================================================');
  console.log('  AGRIAI (SIH25010) — NEW USER ONBOARDING & DATA ISOLATION TEST');
  console.log('================================================================\n');

  const NEW_USER_A = '11111111-2222-3333-4444-555555555555';
  const NEW_USER_B = '66666666-7777-8888-9999-000000000000';

  // ------------------------------------------------------------------
  // STEP 1: Fresh User Starts With 0 Farms (No Demo Contamination)
  // ------------------------------------------------------------------
  try {
    setActiveUserId(NEW_USER_A);
    const initialFarmsA = getStoredFarms(NEW_USER_A);
    const passed = Array.isArray(initialFarmsA) && initialFarmsA.length === 0;
    record(
      1,
      'Fresh User Initialization (0 Farms)',
      passed,
      `New user ${NEW_USER_A.slice(0, 8)} starts with ${initialFarmsA.length} farms (expected: 0, no demo data leak)`
    );
  } catch (err) {
    record(1, 'Fresh User Initialization (0 Farms)', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // STEP 2: Demo Account Retains 3 Demo Farms
  // ------------------------------------------------------------------
  try {
    setActiveUserId(DEMO_FARMER_ID);
    const demoFarms = getStoredFarms(DEMO_FARMER_ID);
    const passed = Array.isArray(demoFarms) && demoFarms.length === 3 && demoFarms[0].name === 'Green Valley Farm';
    record(
      2,
      'Demo Account Preserved (3 Farms)',
      passed,
      `Demo user retains ${demoFarms.length} plots (${demoFarms.map((f) => f.name).join(', ')})`
    );
  } catch (err) {
    record(2, 'Demo Account Preserved (3 Farms)', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // STEP 3: Scoped Farm Creation for User A
  // ------------------------------------------------------------------
  const customFarmA: Farm = {
    id: 'farm-custom-a1',
    name: 'Surjit Organic Acres',
    location: 'Patiala, Punjab',
    areaAcres: 5.5,
    irrigationAvailability: 'Available',
    soil: {
      soilType: 'Clay Loam',
      ph: 7.1,
      nitrogen: 'High',
      phosphorus: 'Medium',
      potassium: 'High',
      moisture: 65,
    },
    crop: {
      name: 'Mustard',
      variety: 'Pusa Mustard 25',
      stage: 'Vegetative',
      plantingDate: '2025-10-15',
    },
    practices: {
      irrigationMethod: 'Drip',
      fertilizerPractice: 'Organic / Bio-fertilizer',
      pestPractice: 'Integrated Pest Management (IPM)',
    },
    soilType: 'Clay Loam',
    cropVariety: 'Pusa Mustard 25',
    plantingDate: '2025-10-15',
    irrigationType: 'Drip',
    healthScore: 88,
    status: 'Healthy',
    riskLevel: 'Low',
    expectedYieldTons: 2.2,
  };

  try {
    setActiveUserId(NEW_USER_A);
    saveStoredFarms([customFarmA], NEW_USER_A);
    saveSelectedFarmId(customFarmA.id, NEW_USER_A);

    const userAFarms = getStoredFarms(NEW_USER_A);
    const selectedA = getSelectedFarm(NEW_USER_A);

    const passed =
      userAFarms.length === 1 &&
      userAFarms[0].id === 'farm-custom-a1' &&
      userAFarms[0].name === 'Surjit Organic Acres' &&
      selectedA?.name === 'Surjit Organic Acres';

    record(
      3,
      'Scoped Farm Creation for New User',
      passed,
      `Saved 1 farm for User A: "${userAFarms[0]?.name}", area: ${userAFarms[0]?.areaAcres} acres, crop: ${typeof userAFarms[0]?.crop === 'object' ? userAFarms[0]?.crop.name : userAFarms[0]?.crop}`
    );
  } catch (err) {
    record(3, 'Scoped Farm Creation for New User', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // STEP 4: Strict Multi-Tenant Isolation (User B cannot see User A's farm)
  // ------------------------------------------------------------------
  try {
    setActiveUserId(NEW_USER_B);
    const userBFarms = getStoredFarms(NEW_USER_B);
    const selectedB = getSelectedFarm(NEW_USER_B);

    const passed = Array.isArray(userBFarms) && userBFarms.length === 0 && selectedB === null;
    record(
      4,
      'Multi-Tenant Cross-User Isolation',
      passed,
      `User B (${NEW_USER_B.slice(0, 8)}) has ${userBFarms.length} farms and selectedFarm is ${selectedB} (No cross-user leakage)`
    );
  } catch (err) {
    record(4, 'Multi-Tenant Cross-User Isolation', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // STEP 5: Personalized Advisory Engine Synthesis for Newly Created Farm
  // ------------------------------------------------------------------
  try {
    const advisoriesA = getAdvisories(customFarmA, DEFAULT_WEATHER, DEFAULT_DIAGNOSIS);
    const topAdvisory = advisoriesA[0];
    const explain = topAdvisory?.explainability;

    const hasExplain = !!explain;
    const isTailored = topAdvisory && advisoriesA.some((a) =>
      a.reason.toLowerCase().includes('mustard') ||
      a.title.toLowerCase().includes('mustard') ||
      a.description?.toLowerCase().includes('vegetative') ||
      a.category.toLowerCase().includes('crop')
    );

    const passed = Array.isArray(advisoriesA) && advisoriesA.length > 0 && hasExplain && isTailored;
    record(
      5,
      'Tailored Advisory Generation for New Farm',
      passed,
      `Generated ${advisoriesA.length} tailored advisories for Mustard plot (Suitability score: ${explain?.suitabilityScore}%, Factors: ${explain?.whyFactors.length})`
    );
  } catch (err) {
    record(5, 'Tailored Advisory Generation for New Farm', false, `Error: ${err}`);
  }

  // ------------------------------------------------------------------
  // STEP 6: Zero-State & Live Farm Health Score Synthesis
  // ------------------------------------------------------------------
  try {
    const zeroHealth = getFarmHealthScore(null, DEFAULT_WEATHER, null);
    const farmHealthA = getFarmHealthScore(customFarmA, DEFAULT_WEATHER, DEFAULT_DIAGNOSIS);

    const zeroSafe = zeroHealth === null || (typeof zeroHealth.score === 'number' && zeroHealth.score >= 0);
    const dynamicCalculated = farmHealthA !== null && typeof farmHealthA.score === 'number' && farmHealthA.score > 0;

    const passed = zeroSafe && dynamicCalculated;
    record(
      6,
      'Farm Health Score Synthesis (Zero-State & Live)',
      passed,
      `Zero-state handled safely (${zeroHealth ? zeroHealth.score : 'null / zero-state'}), New farm health score: ${farmHealthA?.score}/100 (${farmHealthA?.status})`
    );
  } catch (err) {
    record(6, 'Farm Health Score Synthesis (Zero-State & Live)', false, `Error: ${err}`);
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

runIsolationTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
