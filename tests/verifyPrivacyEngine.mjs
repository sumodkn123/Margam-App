// Automated Verification Suite for MARGAM Privacy & Route Matching
import assert from 'node:assert';
import { generatePrivacyZone, projectSharedProfile, filterCandidatesAlongCorridor } from '../src/services/privacyFuzzing.js';
import { CURRENT_USER, ANONYMOUS_MATCHES, POPULAR_ROUTES } from '../src/constants/mockData.js';
import { explainCompatibility } from '../src/services/aiService.js';

console.log('----------------------------------------------------');
console.log('🛡️ MARGAM AUTOMATED PRIVACY & CORRIDOR VERIFICATION');
console.log('----------------------------------------------------');

// Test 1: Anti-Triangulation Distance & Fuzzing Bounds
console.log('Test 1: Anti-Triangulation Offset Bounds...');
const realLat = 10.5276;
const realLng = 76.2144;
const fuzzed = generatePrivacyZone(realLat, realLng, 'user_test_01', 'Thrissur Zone');

assert(fuzzed.radiusKm >= 2.5 && fuzzed.radiusKm <= 4.5, `Radius ${fuzzed.radiusKm} not in [2.5, 4.5] km`);
assert.notStrictEqual(fuzzed.latitude, realLat, 'Fuzzed latitude must not equal real latitude');
assert.notStrictEqual(fuzzed.longitude, realLng, 'Fuzzed longitude must not equal real longitude');
console.log(`  ✓ Passed: Fuzzed distance is ${fuzzed.radiusKm} km with safe generalized zone.`);

// Test 2: Triangulation Attack Prevention (Determinism across multiple queries)
console.log('Test 2: Triangulation Attack Prevention (Averaging Resistance)...');
for (let i = 0; i < 50; i++) {
  const queryAgain = generatePrivacyZone(realLat, realLng, 'user_test_01', 'Thrissur Zone');
  assert.strictEqual(queryAgain.latitude, fuzzed.latitude, 'Latitude must be deterministic to prevent averaging attacks');
  assert.strictEqual(queryAgain.longitude, fuzzed.longitude, 'Longitude must be deterministic to prevent averaging attacks');
}
console.log('  ✓ Passed: 50 repeated queries yield identical anchor coordinates, preventing statistical triangulation.');

// Test 3: Zero PII Leakage in Field Projection Filter
console.log('Test 3: Zero PII Leakage in Field Projection Filter...');
const restrictedSelection = {
  firstName: true,
  age: true,
  gender: true,
  fullName: false,
  profilePhoto: true,
  additionalPhotos: false,
  shortIntro: true,
  fullBio: false,
  education: false,
  institution: false,
  profession: true,
  company: false,
  workplaceLocation: false,
  city: true,
  area: false,
  exactLocation: false,
  lifestylePreferences: false,
  detailedLifestyle: false,
  familyOverview: false,
  detailedFamily: false,
  phoneNumber: false,
  email: false,
};

const projected = projectSharedProfile(CURRENT_USER, restrictedSelection);

assert.strictEqual(projected.firstName, 'Sumod', 'Allowed firstName must be present');
assert.strictEqual(projected.age, 33, 'Allowed age must be present');
assert.strictEqual(projected.fullName, undefined, 'Blocked fullName must NOT be present');
assert.strictEqual(projected.phoneNumber, undefined, 'Blocked phoneNumber must NOT be present');
assert.strictEqual(projected.email, undefined, 'Blocked email must NOT be present');
assert.strictEqual(projected.actualLat, undefined, 'Internal exact coordinates must NEVER be present');
assert.strictEqual(projected.actualLng, undefined, 'Internal exact coordinates must NEVER be present');
console.log('  ✓ Passed: Only explicitly permitted fields are projected. Unchecked PII is strictly stripped.');

// Test 4: Route Corridor Filtering (Thrissur -> Kochi along NH 544)
console.log('Test 4: Route Corridor Filtering...');
const route = POPULAR_ROUTES[0];
const corridorCandidates = filterCandidatesAlongCorridor(ANONYMOUS_MATCHES, route, 15);

assert(corridorCandidates.length > 0, 'Must find candidates along route corridor');
assert(corridorCandidates.every(c => c.isAlongRoute), 'All filtered candidates must be along the route');
console.log(`  ✓ Passed: Correctly identified ${corridorCandidates.length} compatible candidates within 15-min detour of NH 544.`);

// Test 5: Explainable Compatibility Reasoner
console.log('Test 5: Explainable Compatibility Synthesis...');
const reasons = explainCompatibility(ANONYMOUS_MATCHES[0]);
assert(reasons.length >= 3, 'Must produce at least 3 privacy-safe compatibility factors');
assert(reasons.some(r => r.includes('timeline')), 'Must explain timeline compatibility');
console.log('  ✓ Passed: Compatibility reasoner synthesized clear human-readable factors.');

console.log('----------------------------------------------------');
console.log('🎉 ALL 5 PRIVACY & CORRIDOR SUITE TESTS PASSED (100%)');
console.log('----------------------------------------------------');
