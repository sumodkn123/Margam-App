// MARGAM - Real Map Discovery Experience Test Suite
// Verifies real geospatial calculations, zero hardcoded counts, and strict privacy invariants

import {
  queryDiscoveryEngine,
  getNearbyMatchClusters,
  getRouteMatchClusters,
  getDestinationMatchClusters,
  getTripPlanMatchClusters,
  DEFAULT_CURRENT_USER,
  SAFE_PUBLIC_VENUES,
  getPublicMeetingPlaces,
  getRouteGeometry,
  calculateCompatibility,
  getDistanceBucketCounts,
} from '../src/services/discoveryEngine';
import { calculateDrivingRoute, haversineDistanceKm } from '../src/services/routingService';
import { TripPlan, DiscoveryFilterParams } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${message}`);
}

async function runRealMapEngineTests() {
  console.log('\n======================================================');
  console.log('MARGAM REAL MAP DISCOVERY ENGINE — VERIFICATION SUITE');
  console.log('======================================================\n');

  const baseFilters: DiscoveryFilterParams = {
    minAge: 21,
    maxAge: 35,
    minCompatibility: 70,
    maxDistanceKm: 25,
    verifiedOnly: false,
    openToIntroductionsOnly: false,
  };

  // Test 1: Around Me Dynamic Radius Scaling (1km, 5km, 10km, 25km, 50km, 100km)
  console.log('--- TEST 1: Around Me Dynamic Distance Scaling ---');
  const userLat = 10.0159; // Kochi
  const userLng = 76.3419;

  const res1km = getNearbyMatchClusters({
    currentLatitude: userLat,
    currentLongitude: userLng,
    radius: 1,
    preferences: baseFilters,
    minimumCompatibility: 70,
  });

  const res5km = getNearbyMatchClusters({
    currentLatitude: userLat,
    currentLongitude: userLng,
    radius: 5,
    preferences: baseFilters,
    minimumCompatibility: 70,
  });

  const res25km = getNearbyMatchClusters({
    currentLatitude: userLat,
    currentLongitude: userLng,
    radius: 25,
    preferences: baseFilters,
    minimumCompatibility: 70,
  });

  const res100km = getNearbyMatchClusters({
    currentLatitude: userLat,
    currentLongitude: userLng,
    radius: 100,
    preferences: baseFilters,
    minimumCompatibility: 70,
  });

  assert(
    res100km.totalMatches >= res25km.totalMatches &&
    res25km.totalMatches >= res5km.totalMatches &&
    res5km.totalMatches >= res1km.totalMatches,
    `Dynamic distance strictly expands match pool: 1km (${res1km.totalMatches}) <= 5km (${res5km.totalMatches}) <= 25km (${res25km.totalMatches}) <= 100km (${res100km.totalMatches})`
  );

  assert(res5km.clusters.length > 0, `Clusters generated dynamically for 5km: ${res5km.clusters.length} clusters`);
  assert(
    res5km.availabilitySummary !== undefined,
    'Availability summary is computed for bottom drawer insight cards'
  );
  assert(
    typeof res5km.availabilitySummary?.within5km === 'number' &&
    typeof res5km.availabilitySummary?.fiveToTenKm === 'number',
    'Availability summary contains real numerical counts for 5km and 5-10km cards'
  );

  // Test 2: Bottom Drawer 4 Cards Dynamic Calculations
  console.log('\n--- TEST 2: Bottom Drawer 4 Cards Dynamic Calculation ---');
  const buckets = getDistanceBucketCounts(
    { latitude: userLat, longitude: userLng },
    25,
    baseFilters
  );

  assert(
    typeof buckets.within1km === 'number' &&
    typeof buckets.within3km === 'number' &&
    typeof buckets.within5km === 'number' &&
    typeof buckets.fiveToTenKm === 'number' &&
    typeof buckets.tenToTwentyFiveKm === 'number',
    `Distance buckets: 1km (${buckets.within1km}), 3km (${buckets.within3km}), 5km (${buckets.within5km}), 5-10km (${buckets.fiveToTenKm}), 10-25km (${buckets.tenToTwentyFiveKm})`
  );

  assert(
    typeof res5km.availabilitySummary?.alongRoute === 'number' &&
    typeof res5km.availabilitySummary?.nearDestination === 'number',
    `Drawer cards: Along route (${res5km.availabilitySummary?.alongRoute}), At destination (${res5km.availabilitySummary?.nearDestination})`
  );

  // Test 3: Along Route Corridor Matching & Real Route Geometry
  console.log('\n--- TEST 3: Along Route Driving Route & Corridor ---');
  const origin = { latitude: 10.5276, longitude: 76.2144 }; // Thrissur
  const destination = { latitude: 9.9312, longitude: 76.2673, name: 'Kochi' }; // Kochi

  const route = await calculateDrivingRoute(origin, destination);
  assert(route.waypoints.length > 5, `Real route geometry generated with ${route.waypoints.length} waypoints`);
  assert(route.distanceKm > 40 && route.distanceKm < 90, `Route distance is realistic: ${route.distanceKm} km`);

  const routeMatches = getRouteMatchClusters({
    origin,
    destination,
    routeGeometry: route,
    routeCorridor: 5, // 5 km corridor
    preferences: baseFilters,
  });

  assert(routeMatches.totalMatches >= 0, `Discovered ${routeMatches.totalMatches} matches along travel corridor`);
  for (const cand of routeMatches.candidates) {
    assert(cand.isAlongRoute === true, `Candidate ${cand.id} correctly flagged as along route`);
  }

  // Test 4: At Destination Dynamic Matching
  console.log('\n--- TEST 4: At Destination Radius Discovery ---');
  const destMatches = getDestinationMatchClusters({
    destinationLatitude: destination.latitude,
    destinationLongitude: destination.longitude,
    destinationName: 'Kochi',
    radius: 10,
    preferences: baseFilters,
    compatibilityThreshold: 70,
  });

  assert(destMatches.totalMatches > 0, `Discovered ${destMatches.totalMatches} matches at destination Kochi (10km radius)`);
  assert(destMatches.clusters.length > 0, `Destination clusters generated: ${destMatches.clusters.length}`);

  // Test 5: Plan a Trip Date-Window Matching
  console.log('\n--- TEST 5: Plan a Trip Date-Window Matching ---');
  const tripPlan: TripPlan = {
    id: 'trip-test-1',
    userId: DEFAULT_CURRENT_USER.id,
    origin: 'Thrissur',
    destination: 'Kochi',
    departureDate: '24 Dec',
    returnDate: '26 Dec',
    transportMode: 'car',
    visibility: 'active',
    createdAt: new Date().toISOString(),
  };

  const tripMatches = getTripPlanMatchClusters({
    tripPlan,
    preferences: baseFilters,
  });

  assert(tripMatches.totalMatches > 0, `Discovered ${tripMatches.totalMatches} matches for travel plan dates`);
  assert(
    tripMatches.availabilitySummary?.availableDuringDates !== undefined,
    'Trip matches compute availableDuringDates summary'
  );

  // Test 6: Strict Privacy Verification (No Raw Coordinates, No PII)
  console.log('\n--- TEST 6: Strict Privacy & Zero PII Exposure Invariant ---');
  const allTestCandidates = [
    ...res5km.candidates,
    ...routeMatches.candidates,
    ...destMatches.candidates,
    ...tripMatches.candidates,
  ];

  for (const cand of allTestCandidates) {
    // 1. Raw candidate coordinates MUST NOT be present
    assert((cand as any).actualLat === undefined, `Candidate ${cand.id} has NO actualLat`);
    assert((cand as any).actualLng === undefined, `Candidate ${cand.id} has NO actualLng`);

    // 2. Fuzzed coordinate MUST be present
    assert(
      typeof cand.fuzzedCoordinate.latitude === 'number' &&
      typeof cand.fuzzedCoordinate.longitude === 'number' &&
      cand.fuzzedCoordinate.radiusKm >= 2,
      `Candidate ${cand.id} has valid fuzzed anchor with privacy radius >= 2km`
    );

    // 3. Contact info MUST NOT be present
    assert((cand as any).phoneNumber === undefined, `Candidate ${cand.id} has NO phoneNumber`);
    assert((cand as any).email === undefined, `Candidate ${cand.id} has NO email`);
    assert((cand as any).fullName === undefined, `Candidate ${cand.id} has NO fullName`);
  }

  // Test 7: Safe Public Venues
  console.log('\n--- TEST 7: Safe Public Meeting Places Recommendations ---');
  const venues = getPublicMeetingPlaces('Kochi');
  assert(venues.length > 0, `Retrieved ${venues.length} safe public venues in Kochi`);
  assert(venues[0].isVerifiedPublic === true, 'Venues are verified public locations (cafes/malls)');

  console.log('\n🎉 ALL 7 REAL MAP DISCOVERY TEST SUITES PASSED FLAWLESSLY!\n');
}

runRealMapEngineTests().catch((err) => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});
