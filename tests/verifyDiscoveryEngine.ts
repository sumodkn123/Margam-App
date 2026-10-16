function assert(condition: any, message: string) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}
assert.strictEqual = (a: any, b: any, message: string) => {
  if (a !== b) throw new Error(`Assertion failed: ${message} (expected ${b}, got ${a})`);
};
import {
  queryDiscoveryEngine,
  DEFAULT_CURRENT_USER,
  setRegisteredProfilePool,
} from '../src/services/discoveryEngine';
import { generateSeedProfiles } from '../src/services/seedService';
import { isPointWithinRouteCorridor, haversineDistanceKm } from '../src/services/routingService';

console.log('🧪 Starting MARGAM Discovery & Privacy Engine Automated Test Suite...\n');

// 1. Monotonicity Test: Stricter compatibility thresholds must reduce or equal match count
console.log('Test 1: Monotonicity of Compatibility Filter Thresholds...');
const testPool = generateSeedProfiles(100, 555);
setRegisteredProfilePool(testPool);

const res70 = queryDiscoveryEngine({
  currentUser: DEFAULT_CURRENT_USER,
  mode: 'around_me',
  bounds: null,
  filters: {
    minAge: 21,
    maxAge: 40,
    maxDistanceKm: 100,
    minCompatibility: 70,
  },
});

const res80 = queryDiscoveryEngine({
  currentUser: DEFAULT_CURRENT_USER,
  mode: 'around_me',
  bounds: null,
  filters: {
    minAge: 21,
    maxAge: 40,
    maxDistanceKm: 100,
    minCompatibility: 80,
  },
});

const res90 = queryDiscoveryEngine({
  currentUser: DEFAULT_CURRENT_USER,
  mode: 'around_me',
  bounds: null,
  filters: {
    minAge: 21,
    maxAge: 40,
    maxDistanceKm: 100,
    minCompatibility: 90,
  },
});

console.log(`  Threshold 70%+ -> ${res70.totalMatches} matches`);
console.log(`  Threshold 80%+ -> ${res80.totalMatches} matches`);
console.log(`  Threshold 90%+ -> ${res90.totalMatches} matches`);

assert(res70.totalMatches >= res80.totalMatches, 'Matches at 70% must be >= matches at 80%');
assert(res80.totalMatches >= res90.totalMatches, 'Matches at 80% must be >= matches at 90%');
console.log('  ✅ PASSED: Filter monotonicity verified.\n');

// 2. Zero Hardcoded Count Test & Empty Area Test
console.log('Test 2: Zero Matches in Uninhabited / Out-of-Bounds Region...');
const outOfBoundsResult = queryDiscoveryEngine({
  currentUser: DEFAULT_CURRENT_USER,
  mode: 'around_me',
  bounds: {
    northEast: { latitude: 28.7041, longitude: 77.1025 }, // Delhi region
    southWest: { latitude: 28.6041, longitude: 77.0025 },
  },
  filters: {
    minAge: 23,
    maxAge: 35,
    maxDistanceKm: 25,
    minCompatibility: 75,
  },
});

console.log(`  Out-of-bounds query match count: ${outOfBoundsResult.totalMatches}`);
assert.strictEqual(outOfBoundsResult.totalMatches, 0, 'Must return 0 for out-of-bounds region');
assert.strictEqual(outOfBoundsResult.clusters.length, 0, 'Must return empty clusters array for 0 matches');
console.log('  ✅ PASSED: Strictly returns 0 without fake fallbacks.\n');

// 3. Dynamic Bounding Box Movement Test
console.log('Test 3: Dynamic Bounding Box Movement updates counts...');
// Kochi Central Bounding Box
const kochiBoundsResult = queryDiscoveryEngine({
  currentUser: DEFAULT_CURRENT_USER,
  mode: 'around_me',
  bounds: {
    northEast: { latitude: 10.15, longitude: 76.45 },
    southWest: { latitude: 9.85, longitude: 76.15 },
  },
  filters: {
    minAge: 21,
    maxAge: 45,
    maxDistanceKm: 50,
    minCompatibility: 70,
  },
});

// Thrissur Bounding Box
const thrissurBoundsResult = queryDiscoveryEngine({
  currentUser: DEFAULT_CURRENT_USER,
  mode: 'around_me',
  bounds: {
    northEast: { latitude: 10.65, longitude: 76.35 },
    southWest: { latitude: 10.40, longitude: 76.10 },
  },
  filters: {
    minAge: 21,
    maxAge: 45,
    maxDistanceKm: 50,
    minCompatibility: 70,
  },
});

console.log(`  Kochi Viewport Matches: ${kochiBoundsResult.totalMatches}`);
console.log(`  Thrissur Viewport Matches: ${thrissurBoundsResult.totalMatches}`);
assert(kochiBoundsResult.totalMatches > 0, 'Kochi viewport should have matches from seed');
assert(thrissurBoundsResult.totalMatches > 0, 'Thrissur viewport should have matches from seed');
console.log('  ✅ PASSED: Viewport bounds dynamic querying verified.\n');

// 4. Route Corridor Cross-Track Buffer Test
console.log('Test 4: Road Corridor Matching (NH 544 Kochi <-> Thrissur)...');
const routeWaypoints = [
  { latitude: 10.5276, longitude: 76.2144 }, // Thrissur Round
  { latitude: 10.3070, longitude: 76.3335 }, // Chalakudy (on NH 544)
  { latitude: 10.1076, longitude: 76.3516 }, // Aluva (on NH 544)
  { latitude: 10.0245, longitude: 76.3079 }, // Edappally (Kochi)
];

// Point in Chalakudy (~1 km from waypoint)
const chalakudyPoint = { latitude: 10.3100, longitude: 76.3350 };
const chalakudyCheck = isPointWithinRouteCorridor(
  chalakudyPoint.latitude,
  chalakudyPoint.longitude,
  routeWaypoints,
  8
);
console.log(`  Chalakudy corridor check: isWithin=${chalakudyCheck.isWithin}, detourKm=${chalakudyCheck.minDistanceKm}`);
assert.strictEqual(chalakudyCheck.isWithin, true, 'Chalakudy must be within 8 km corridor');

// Point in Palakkad (~55 km away from route)
const palakkadPoint = { latitude: 10.7867, longitude: 76.6548 };
const palakkadCheck = isPointWithinRouteCorridor(
  palakkadPoint.latitude,
  palakkadPoint.longitude,
  routeWaypoints,
  8
);
console.log(`  Palakkad corridor check: isWithin=${palakkadCheck.isWithin}, detourKm=${palakkadCheck.minDistanceKm}`);
assert.strictEqual(palakkadCheck.isWithin, false, 'Palakkad must NOT be within 8 km corridor');
console.log('  ✅ PASSED: Route corridor buffer calculation verified.\n');

// 5. Strict Zero-PII Leakage Test
console.log('Test 5: Zero-PII Guarantee on Discovery Candidates...');
for (const cand of kochiBoundsResult.candidates) {
  assert(cand.fuzzedCoordinate !== undefined, 'Fuzzed coordinate must exist');
  assert((cand as any).actualLat === undefined, 'Raw actualLat MUST NEVER be exposed on candidate');
  assert((cand as any).actualLng === undefined, 'Raw actualLng MUST NEVER be exposed on candidate');
  assert((cand as any).phoneNumber === undefined, 'Phone number MUST NOT be exposed on discovery');
  assert((cand as any).email === undefined, 'Email MUST NOT be exposed on discovery');
  assert((cand as any).fullName === undefined, 'Full name MUST NOT be exposed on discovery');
}
console.log('  ✅ PASSED: Privacy invariant mathematically verified across all candidate records.\n');

// 6. Test Mode 1: getNearbyMatchClusters
console.log('Test 6: getNearbyMatchClusters dedicated endpoint...');
import {
  getNearbyMatchClusters,
  getRouteMatchClusters,
  getDestinationMatchClusters,
  getTripPlanMatchClusters,
} from '../src/services/discoveryEngine';

const nearbyRes = getNearbyMatchClusters({
  currentLatitude: 10.0159,
  currentLongitude: 76.3419,
  radius: 25,
  minimumCompatibility: 70,
});
console.log(`  Nearby matches found: ${nearbyRes.totalMatches}, clusters: ${nearbyRes.clusters.length}`);
assert(nearbyRes.totalMatches > 0, 'Must find nearby matches from seed pool');
assert(nearbyRes.availabilitySummary !== undefined, 'Must return availabilitySummary');
assert(typeof nearbyRes.availabilitySummary?.within5km === 'number', 'Must have within5km count');
assert(typeof nearbyRes.availabilitySummary?.fiveToTenKm === 'number', 'Must have fiveToTenKm count');
console.log('  ✅ PASSED: getNearbyMatchClusters verified.\n');

// 7. Test Mode 2: getRouteMatchClusters
console.log('Test 7: getRouteMatchClusters dedicated endpoint...');
const routeRes = getRouteMatchClusters({
  origin: { latitude: 10.5276, longitude: 76.2144 },
  destination: { latitude: 10.0159, longitude: 76.3419, name: 'Kochi' },
  routeGeometry: {
    id: 'test-route',
    origin: { latitude: 10.5276, longitude: 76.2144 },
    destination: { latitude: 10.0159, longitude: 76.3419 },
    waypoints: routeWaypoints,
    distanceKm: 82,
    durationMinutes: 135,
    distanceLabel: '82 km',
    durationLabel: '2 hr 15 min',
  },
  routeCorridor: 12,
});
console.log(`  Route corridor matches: ${routeRes.totalMatches}, along route count: ${routeRes.alongRoute}`);
assert(typeof routeRes.alongRoute === 'number', 'Must return alongRoute count');
assert(routeRes.mode === 'along_route', 'Mode must be along_route');
console.log('  ✅ PASSED: getRouteMatchClusters verified.\n');

// 8. Test Mode 3: getDestinationMatchClusters
console.log('Test 8: getDestinationMatchClusters dedicated endpoint...');
const destRes = getDestinationMatchClusters({
  destinationLatitude: 10.0279,
  destinationLongitude: 76.3081,
  destinationName: 'Lulu Mall',
  radius: 10,
  compatibilityThreshold: 75,
});
console.log(`  Destination matches at Lulu Mall: ${destRes.totalMatches}, within 5km: ${destRes.within5km}`);
assert(destRes.mode === 'destination', 'Mode must be destination');
assert(typeof destRes.totalMatches === 'number', 'Must compute totalMatches dynamically');
console.log('  ✅ PASSED: getDestinationMatchClusters verified.\n');

// 9. Test Mode 4: getTripPlanMatchClusters
console.log('Test 9: getTripPlanMatchClusters dedicated endpoint...');
const tripRes = getTripPlanMatchClusters({
  tripPlan: {
    id: 'trip-test-1',
    userId: 'usr-current-sumod',
    origin: 'Thrissur',
    destination: 'Kochi',
    departureDate: '24 Dec',
    returnDate: '26 Dec',
    transportMode: 'car',
    visibility: 'active',
    createdAt: new Date().toISOString(),
  },
});
console.log(`  Trip potential matches: ${tripRes.totalMatches}`);
assert(tripRes.mode === 'plan_trip', 'Mode must be plan_trip');
assert(tripRes.availabilitySummary !== undefined, 'Must provide availabilitySummary');
assert(tripRes.availabilitySummary!.availableDuringDates > 0, 'Must have candidates available during dates');
console.log('  ✅ PASSED: getTripPlanMatchClusters verified.\n');

// =============================================================
// TODAY'S MATCH INSIGHTS TESTS (Tests 10-15)
// =============================================================
import {
  getNewMatches,
  getRouteMatchInsights,
  getDestinationMatchInsights,
  getHighCompatibilityMatches,
  getTodayMatchInsights,
  computeDetailedCompatibilityBreakdown,
  markCandidateDismissed,
  markCandidateBlocked,
  markCandidateSaved,
  resetCandidateStates,
} from '../src/services/insightsService';

// Test 10: getNewMatches and Candidate Lifecycle State
console.log('Test 10: getNewMatches and Candidate Lifecycle State (Dismiss & Block)...');
resetCandidateStates();
const newMatchesInitial = getNewMatches();
console.log(`  Initial eligible new matches: ${newMatchesInitial.totalCount}`);
assert(newMatchesInitial.totalCount > 0, 'Initial new matches must be > 0');
assert(newMatchesInitial.candidates.length === newMatchesInitial.totalCount, 'Count must equal array length');

// Dismiss a candidate and verify exclusion
const candidateToDismiss = newMatchesInitial.candidates[0];
markCandidateDismissed(candidateToDismiss.id);
const newMatchesAfterDismiss = getNewMatches();
console.log(`  After dismissing 1 candidate: ${newMatchesAfterDismiss.totalCount}`);
assert.strictEqual(
  newMatchesAfterDismiss.totalCount,
  newMatchesInitial.totalCount - 1,
  'Dismissed candidate must be excluded from new matches'
);

// Block another candidate and verify exclusion
const candidateToBlock = newMatchesInitial.candidates[1];
markCandidateBlocked(candidateToBlock.id);
const newMatchesAfterBlock = getNewMatches();
console.log(`  After blocking another candidate: ${newMatchesAfterBlock.totalCount}`);
assert.strictEqual(
  newMatchesAfterBlock.totalCount,
  newMatchesInitial.totalCount - 2,
  'Blocked candidate must be excluded from new matches'
);
console.log('  ✅ PASSED: getNewMatches and candidate state tracking verified.\n');

// Test 11: getRouteMatchInsights Detour Monotonicity
console.log('Test 11: getRouteMatchInsights Detour Monotonicity (5m <= 10m <= 20m <= 30m)...');
const route5m = getRouteMatchInsights({ detourMinutesThreshold: 5 });
const route10m = getRouteMatchInsights({ detourMinutesThreshold: 10 });
const route20m = getRouteMatchInsights({ detourMinutesThreshold: 20 });
const route30m = getRouteMatchInsights({ detourMinutesThreshold: 30 });

console.log(`  Detour <=5m: ${route5m.totalCount} matches`);
console.log(`  Detour <=10m: ${route10m.totalCount} matches`);
console.log(`  Detour <=20m: ${route20m.totalCount} matches`);
console.log(`  Detour <=30m: ${route30m.totalCount} matches`);

assert(route5m.totalCount <= route10m.totalCount, 'Matches at 5m must be <= matches at 10m');
assert(route10m.totalCount <= route20m.totalCount, 'Matches at 10m must be <= matches at 20m');
assert(route20m.totalCount <= route30m.totalCount, 'Matches at 20m must be <= matches at 30m');
assert(route10m.recommendedVenues.length > 0, 'Must recommend verified public meeting venues along corridor');
console.log('  ✅ PASSED: getRouteMatchInsights detour monotonicity verified.\n');

// Test 12: getDestinationMatchInsights Radius Expansion
console.log('Test 12: getDestinationMatchInsights Radius Expansion (3km <= 5km <= 10km <= 25km)...');
const dest3km = getDestinationMatchInsights({ destinationName: 'Kochi', radiusKm: 3 });
const dest5km = getDestinationMatchInsights({ destinationName: 'Kochi', radiusKm: 5 });
const dest10km = getDestinationMatchInsights({ destinationName: 'Kochi', radiusKm: 10 });
const dest25km = getDestinationMatchInsights({ destinationName: 'Kochi', radiusKm: 25 });

console.log(`  Radius 3km: ${dest3km.totalCount} matches`);
console.log(`  Radius 5km: ${dest5km.totalCount} matches`);
console.log(`  Radius 10km: ${dest10km.totalCount} matches`);
console.log(`  Radius 25km: ${dest25km.totalCount} matches`);

assert(dest3km.totalCount <= dest5km.totalCount, 'Matches at 3km must be <= matches at 5km');
assert(dest5km.totalCount <= dest10km.totalCount, 'Matches at 5km must be <= matches at 10km');
assert(dest10km.totalCount <= dest25km.totalCount, 'Matches at 10km must be <= matches at 25km');
assert(dest5km.availableVenues.length > 0, 'Must include verified public meeting spots');
console.log('  ✅ PASSED: getDestinationMatchInsights radius expansion verified.\n');

// Test 13: getHighCompatibilityMatches Threshold Monotonicity
console.log('Test 13: getHighCompatibilityMatches Threshold Cutoff (80% >= 85% >= 90% >= 95%)...');
const high80 = getHighCompatibilityMatches({ threshold: 80 });
const high85 = getHighCompatibilityMatches({ threshold: 85 });
const high90 = getHighCompatibilityMatches({ threshold: 90 });
const high95 = getHighCompatibilityMatches({ threshold: 95 });

console.log(`  Threshold 80%+: ${high80.totalCount} matches (avg: ${high80.averageCompatibility}%)`);
console.log(`  Threshold 85%+: ${high85.totalCount} matches (avg: ${high85.averageCompatibility}%)`);
console.log(`  Threshold 90%+: ${high90.totalCount} matches (avg: ${high90.averageCompatibility}%)`);
console.log(`  Threshold 95%+: ${high95.totalCount} matches (avg: ${high95.averageCompatibility}%)`);

assert(high80.totalCount >= high85.totalCount, 'Matches at 80% must be >= matches at 85%');
assert(high85.totalCount >= high90.totalCount, 'Matches at 85% must be >= matches at 90%');
assert(high90.totalCount >= high95.totalCount, 'Matches at 90% must be >= matches at 95%');
assert(high85.averageCompatibility >= 85, 'Average compatibility must be >= threshold');
console.log('  ✅ PASSED: getHighCompatibilityMatches threshold monotonicity verified.\n');

// Test 14: computeDetailedCompatibilityBreakdown Multi-Dimensional Analysis
console.log('Test 14: computeDetailedCompatibilityBreakdown Multi-Dimensional Analysis...');
const sampleCandidate = high85.candidates[0] || newMatchesInitial.candidates[0];
const breakdown = computeDetailedCompatibilityBreakdown(DEFAULT_CURRENT_USER, sampleCandidate);

console.log(`  Candidate overall alignment: ${breakdown.overallPercentage}%`);
console.log(`  Categories evaluated: ${Object.keys(breakdown.categories).join(', ')}`);
console.log(`  Key alignments count: ${breakdown.keyAlignments.length}`);
console.log(`  Potential differences count: ${breakdown.potentialDifferences.length}`);

assert(typeof breakdown.overallPercentage === 'number', 'Overall percentage must be a number');
assert(breakdown.categories.marriageGoals !== undefined, 'Must evaluate Marriage Goals');
assert(breakdown.categories.lifestyle !== undefined, 'Must evaluate Lifestyle');
assert(breakdown.categories.location !== undefined, 'Must evaluate Location');
assert(breakdown.categories.educationCareer !== undefined, 'Must evaluate Education & Career');
assert(breakdown.categories.familyPreferences !== undefined, 'Must evaluate Family Preferences');
assert(breakdown.categories.personalityInterests !== undefined, 'Must evaluate Personality & Interests');
assert(breakdown.keyAlignments.length > 0, 'Must have at least one key alignment');
assert(breakdown.potentialDifferences.length > 0, 'Must provide objective differences for discussion');
console.log('  ✅ PASSED: computeDetailedCompatibilityBreakdown 6D analysis verified.\n');

// Test 15: getTodayMatchInsights Aggregated Independent Summary
console.log('Test 15: getTodayMatchInsights Aggregated Independent Summary...');
const todaySummary = getTodayMatchInsights(DEFAULT_CURRENT_USER, true);

console.log('  Summary counts:');
console.log(`    New Matches: ${todaySummary.newMatchesCount}`);
console.log(`    Along Route: ${todaySummary.routeMatchesCount} (${todaySummary.routeSummary})`);
console.log(`    At Destination: ${todaySummary.destinationMatchesCount} (${todaySummary.destinationName})`);
console.log(`    High Compatibility: ${todaySummary.highCompatibilityCount} (${todaySummary.highCompatThreshold}%+)`);

assert(typeof todaySummary.newMatchesCount === 'number', 'newMatchesCount must be a number');
assert(typeof todaySummary.routeMatchesCount === 'number', 'routeMatchesCount must be a number');
assert(typeof todaySummary.destinationMatchesCount === 'number', 'destinationMatchesCount must be a number');
assert(typeof todaySummary.highCompatibilityCount === 'number', 'highCompatibilityCount must be a number');
assert(todaySummary.hasActiveRoute === true, 'hasActiveRoute must be true');
assert(todaySummary.hasActiveDestination === true, 'hasActiveDestination must be true');
assert(todaySummary.lastUpdatedAt.length > 0, 'lastUpdatedAt timestamp must exist');
console.log('  ✅ PASSED: getTodayMatchInsights verified.\n');

console.log('🎉 ALL 15 MARGAM PROTOCOL & TODAY’S INSIGHTS TESTS PASSED (100% SUCCESS)!');


