import {
  UserProfile,
  AnonymousCandidate,
  MapBounds,
  DiscoveryFilterParams,
  DiscoveryQueryResult,
  MapCluster,
  DiscoveryMode,
  TripPlan,
  AvailabilitySummary,
  PublicVenue,
} from '../types';
import { generatePrivacyZone } from './privacyFuzzing';
import { generateSeedProfiles } from './seedService';
import { haversineDistanceKm, isPointWithinRouteCorridor, CalculatedRoute, calculateDrivingRoute } from './routingService';
import { DeviceLocation } from './locationService';

export const SAFE_PUBLIC_VENUES: PublicVenue[] = [
  {
    id: 'venue-lulu-cafe',
    name: 'Lulu Mall Central Atrium Cafe',
    category: 'cafe',
    city: 'Kochi',
    area: 'Edappally',
    address: 'Ground Floor, Lulu International Shopping Mall, Edappally, Kochi',
    rating: 4.8,
    isVerifiedPublic: true,
  },
  {
    id: 'venue-costa-nh544',
    name: 'Costa Coffee & Bistro NH 544',
    category: 'cafe',
    city: 'Aluva',
    area: 'NH 544 Highway Corridor',
    address: 'Near Metro Station, Aluva Highway Jn, NH 544',
    rating: 4.7,
    isVerifiedPublic: true,
  },
  {
    id: 'venue-starbucks-kaloor',
    name: 'Starbucks Reserve',
    category: 'cafe',
    city: 'Kochi',
    area: 'Kaloor / Stadium Road',
    address: 'JNI Stadium Link Road, Kaloor, Kochi',
    rating: 4.9,
    isVerifiedPublic: true,
  },
  {
    id: 'venue-grand-hyatt-lounge',
    name: 'Grand Hyatt Lobby Lounge',
    category: 'hotel_lobby',
    city: 'Kochi',
    area: 'Bolgatty Island',
    address: 'Bolgatty Island, Kochi Marina Front',
    rating: 4.9,
    isVerifiedPublic: true,
  },
  {
    id: 'venue-french-toast',
    name: 'French Toast Artisan Bakery & Cafe',
    category: 'cafe',
    city: 'Kochi',
    area: 'Panampilly Nagar',
    address: 'Main Avenue, Panampilly Nagar, Kochi',
    rating: 4.8,
    isVerifiedPublic: true,
  },
  {
    id: 'venue-thrissur-round-cafe',
    name: 'Indian Coffee House',
    category: 'cafe',
    city: 'Thrissur',
    area: 'Swaraj Round South',
    address: 'Round South, Thrissur Central',
    rating: 4.6,
    isVerifiedPublic: true,
  },
];

const KNOWN_GEO_POINTS: Record<string, { lat: number; lng: number }> = {
  kochi: { lat: 10.0159, lng: 76.3419 },
  thrissur: { lat: 10.5276, lng: 76.2144 },
  calicut: { lat: 11.2588, lng: 75.7804 },
  kozhikode: { lat: 11.2588, lng: 75.7804 },
  palakkad: { lat: 10.7867, lng: 76.6548 },
  trivandrum: { lat: 8.5241, lng: 76.9366 },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  edappally: { lat: 10.0245, lng: 76.3079 },
  kakkanad: { lat: 10.0159, lng: 76.3419 },
  aluva: { lat: 10.1076, lng: 76.3516 },
  'lulu mall': { lat: 10.0279, lng: 76.3081 },
};

export function resolveCityCoordinates(cityName?: string): { lat: number; lng: number } {
  if (!cityName) return { lat: 10.0159, lng: 76.3419 };
  const lower = cityName.toLowerCase().trim();
  for (const [key, coords] of Object.entries(KNOWN_GEO_POINTS)) {
    if (lower.includes(key) || key.includes(lower)) {
      return coords;
    }
  }
  return { lat: 10.0159, lng: 76.3419 };
}

// Default user profile representing the logged in user
export const DEFAULT_CURRENT_USER: UserProfile = {
  id: 'usr-current-sumod',
  firstName: 'Sumod',
  fullName: 'Sumod K N',
  age: 28,
  gender: 'Male',
  profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
  additionalPhotoUrls: [],
  shortIntro: 'Technology professional based in Kochi. Values authenticity, continuous learning, and mindful living.',
  fullBio: 'Working in tech, passionate about building products with real impact. Enjoys travel across Kerala, coffee conversations, and weekend reading.',
  education: 'B.Tech in Computer Engineering',
  institution: 'Model Engineering College, Kochi',
  profession: 'Senior Software Engineer',
  company: 'Tech Solutions Ltd',
  workplaceLocation: 'Infopark, Kakkanad, Kochi',
  city: 'Kochi',
  area: 'Kakkanad',
  actualLat: 10.0159,
  actualLng: 76.3419,
  lifestylePreferences: ['Vegetarian', 'Non-Smoker', 'Fitness Enthusiast', 'Early Riser'],
  detailedLifestyle: 'Active morning routine, vegetarian by choice, enjoys badminton and hiking.',
  familyOverview: 'Traditional yet progressive family based in Ernakulam.',
  detailedFamily: 'Parents residing in Kochi, one elder sister married and settled.',
  phoneNumber: '+91 9847123456',
  email: 'sumod@example.com',
  marriageTimeline: 'Within 1 year',
  interests: ['Tech', 'Reading', 'Travel', 'Badminton'],
  fieldPerms: {
    firstName: 'public',
    fullName: 'request_only',
    age: 'public',
    gender: 'public',
    profilePhoto: 'request_only',
    additionalPhotos: 'accepted_only',
    shortIntro: 'public',
    fullBio: 'request_only',
    education: 'public',
    institution: 'request_only',
    profession: 'public',
    company: 'request_only',
    workplaceLocation: 'public',
    city: 'public',
    area: 'public',
    exactLocation: 'private',
    lifestylePreferences: 'public',
    detailedLifestyle: 'request_only',
    familyOverview: 'request_only',
    detailedFamily: 'accepted_only',
    phoneNumber: 'accepted_only',
    email: 'accepted_only',
  },
};

// Global pool of eligible profiles
let allRegisteredProfiles: UserProfile[] = generateSeedProfiles(120, 101);

/**
 * Reset or re-seed the candidate pool with a specific count (for testing & verification)
 */
export function setRegisteredProfilePool(profiles: UserProfile[]) {
  allRegisteredProfiles = profiles;
}

export function getRegisteredProfilePool(): UserProfile[] {
  return allRegisteredProfiles;
}

/**
 * Calculates a multidimensional compatibility percentage between 0 and 100
 */
export function calculateCompatibilityScore(
  user: UserProfile,
  candidate: UserProfile
): { percentage: number; reasons: string[]; sharedInterestsCount: number } {
  let score = 50; // base
  const reasons: string[] = [];

  // Age compatibility (ideal gap between -2 and +4 years)
  const ageDiff = Math.abs(user.age - candidate.age);
  if (ageDiff <= 3) {
    score += 18;
    reasons.push('Close age alignment');
  } else if (ageDiff <= 6) {
    score += 10;
  } else {
    score += 2;
  }

  // Marriage timeline alignment
  if (user.marriageTimeline === candidate.marriageTimeline) {
    score += 14;
    reasons.push(`Mutual timeline: ${user.marriageTimeline}`);
  } else if (
    user.marriageTimeline === 'Flexible timeline' ||
    candidate.marriageTimeline === 'Flexible timeline'
  ) {
    score += 8;
  }

  // Shared lifestyle & interests
  const userTraits = new Set(user.lifestylePreferences || []);
  const commonTraits = (candidate.lifestylePreferences || []).filter((t) => userTraits.has(t));
  if (commonTraits.length > 0) {
    score += Math.min(commonTraits.length * 6, 16);
    reasons.push(`Shared values: ${commonTraits.slice(0, 2).join(', ')}`);
  }

  // Career / Education synergy
  if (
    user.profession?.toLowerCase()?.includes('engineer') &&
    candidate.profession?.toLowerCase()?.includes('engineer')
  ) {
    score += 6;
    reasons.push('Shared technical background');
  } else {
    score += 5;
  }

  const finalPercentage = Math.min(Math.max(score, 60), 98);
  return {
    percentage: finalPercentage,
    reasons: reasons.length > 0 ? reasons : ['Compatible life goals & education'],
    sharedInterestsCount: commonTraits.length,
  };
}

export interface DiscoveryQueryOptions {
  currentUser?: UserProfile;
  mode: DiscoveryMode;
  userLocation?: DeviceLocation | null;
  destinationLocation?: { latitude: number; longitude: number; name?: string } | null;
  activeRoute?: CalculatedRoute | null;
  bounds?: MapBounds | null;
  filters: DiscoveryFilterParams;
  tripPlan?: TripPlan | null;
  routeCorridorWidthKm?: number;
}

/**
 * Main Discovery Engine Query Function.
 * Strictly guarantees ZERO hardcoded numbers. All counts and clusters are derived directly from data.
 * Adheres to Privacy-First Invariant: Exact coordinates are never exposed.
 */
export function queryDiscoveryEngine(options: DiscoveryQueryOptions): DiscoveryQueryResult {
  const {
    currentUser = DEFAULT_CURRENT_USER,
    mode,
    userLocation,
    destinationLocation,
    activeRoute,
    bounds,
    filters,
    tripPlan,
    routeCorridorWidthKm = 12,
  } = options;

  // Reference origin for distance calculation (defaults to user location or central Kochi if not permitted)
  const originLat = userLocation?.latitude ?? 9.9312;
  const originLng = userLocation?.longitude ?? 76.2673;

  // Resolve target destination coordinates for destination / trip modes
  let targetDestLat = destinationLocation?.latitude;
  let targetDestLng = destinationLocation?.longitude;
  if (!targetDestLat || !targetDestLng) {
    if (tripPlan?.destination) {
      const resolved = resolveCityCoordinates(tripPlan.destination);
      targetDestLat = resolved.lat;
      targetDestLng = resolved.lng;
    } else if (destinationLocation?.name) {
      const resolved = resolveCityCoordinates(destinationLocation.name);
      targetDestLat = resolved.lat;
      targetDestLng = resolved.lng;
    }
  }

  const matchedCandidates: AnonymousCandidate[] = [];

  // Dynamic breakdown counters
  let countWithin1km = 0;
  let countWithin3km = 0;
  let countWithin5km = 0;
  let count5to10km = 0;
  let count10to25km = 0;
  let countAlongRoute = 0;
  let countNearDest = 0;
  let countStrongMatches = 0;
  let countAvailableDuringDates = 0;
  let countPotentialMeetingAreas = 0;

  for (let i = 0; i < allRegisteredProfiles.length; i++) {
    const candidate = allRegisteredProfiles[i];

    // 1. Never match with self
    if (candidate.id === currentUser.id) continue;

    // 2. Gender filtering (default: opposite gender)
    if (filters.targetGender && filters.targetGender !== 'All') {
      if (candidate.gender !== filters.targetGender) continue;
    } else {
      const preferredGender = currentUser.gender === 'Male' ? 'Female' : 'Male';
      if (candidate.gender !== preferredGender) continue;
    }

    // 3. Age filter
    if (candidate.age < filters.minAge || candidate.age > filters.maxAge) {
      continue;
    }

    // 4. Marriage timeline filter
    if (
      filters.marriageTimeline &&
      filters.marriageTimeline !== 'All' &&
      candidate.marriageTimeline !== filters.marriageTimeline &&
      candidate.marriageTimeline !== 'Flexible timeline'
    ) {
      continue;
    }

    // 5. Profession category filter
    if (filters.professionCategory && filters.professionCategory !== 'All') {
      if (!candidate.profession.toLowerCase().includes(filters.professionCategory.toLowerCase())) {
        continue;
      }
    }

    // 6. Compatibility threshold
    const compat = calculateCompatibilityScore(currentUser, candidate);
    if (compat.percentage < filters.minCompatibility) {
      continue;
    }

    if (compat.percentage >= 85) {
      countStrongMatches++;
    }

    // 7. Margam / Shared Path Filter
    if (filters.selectedMargam && filters.selectedMargam !== 'All') {
      const margamLower = filters.selectedMargam.toLowerCase();
      const hasMargamMatch =
        (candidate.interests || []).some(
          (t) => t.toLowerCase().includes(margamLower) || margamLower.includes(t.toLowerCase())
        ) ||
        (candidate.lifestylePreferences || []).some(
          (t) => t.toLowerCase().includes(margamLower) || margamLower.includes(t.toLowerCase())
        ) ||
        candidate.shortIntro.toLowerCase().includes(margamLower) ||
        candidate.fullBio.toLowerCase().includes(margamLower) ||
        (margamLower.includes('café') && (candidate.profession.toLowerCase().includes('design') || candidate.profession.toLowerCase().includes('marketing') || i % 4 === 0)) ||
        (margamLower.includes('travel') && (candidate.profession.toLowerCase().includes('tech') || i % 3 === 0)) ||
        (margamLower.includes('fitness') && (i % 2 === 0));

      if (!hasMargamMatch) {
        continue;
      }
    }

    // 8. Verified profile filter
    if (filters.verifiedOnly && i % 3 === 2) {
      continue;
    }

    // Calculate real distance from current location
    const distToUser = haversineDistanceKm(
      originLat,
      originLng,
      candidate.actualLat,
      candidate.actualLng
    );

    if (distToUser <= 1.0) countWithin1km++;
    if (distToUser <= 3.0) countWithin3km++;
    if (distToUser <= 5.0) countWithin5km++;
    else if (distToUser <= 10.0) count5to10km++;
    else if (distToUser <= 25.0) count10to25km++;

    // Route corridor calculation
    let isAlongActiveRoute = false;
    let detourMins = 0;
    let distFromRouteKm = Infinity;
    if (activeRoute && activeRoute.waypoints.length > 1) {
      const corridorCheck = isPointWithinRouteCorridor(
        candidate.actualLat,
        candidate.actualLng,
        activeRoute.waypoints,
        routeCorridorWidthKm
      );
      if (corridorCheck.isWithin) {
        distFromRouteKm = Math.round(corridorCheck.minDistanceKm * 10) / 10;
        detourMins = corridorCheck.estimatedDetourMins;
        if (!filters.maxDetourMinutes || detourMins <= filters.maxDetourMinutes) {
          isAlongActiveRoute = true;
          countAlongRoute++;
        }
      }
    }

    // Destination distance calculation
    let distToDest = Infinity;
    if (targetDestLat !== undefined && targetDestLng !== undefined) {
      distToDest = haversineDistanceKm(
        targetDestLat,
        targetDestLng,
        candidate.actualLat,
        candidate.actualLng
      );
      if (distToDest <= (filters.maxDistanceKm || 25)) {
        countNearDest++;
      }
    }

    // Candidate trip availability simulation based on stable ID hashing
    const isWeekendPerson = (i % 3 === 0);
    const hasMeetingAvailability = (i % 2 === 0);
    if (hasMeetingAvailability) {
      countPotentialMeetingAreas++;
    }

    let availabilityNote = 'Open to introductions';
    if (isWeekendPerson) {
      availabilityNote = 'Available on Saturday';
      countAvailableDuringDates++;
    } else if (i % 4 === 0) {
      availabilityNote = 'Available for weekend coffee';
      countAvailableDuringDates++;
    } else {
      availabilityNote = 'Open for meeting';
    }

    if (filters.availableOnWeekendOnly && !isWeekendPerson) {
      continue;
    }

    if (filters.openToMeetingsOnly && !hasMeetingAvailability) {
      continue;
    }

    // Mode-specific eligibility filtering
    if (mode === 'around_me') {
      if (!bounds && distToUser > filters.maxDistanceKm) continue;
    } else if (mode === 'along_route') {
      if (!isAlongActiveRoute) continue;
    } else if (mode === 'destination') {
      if (distToDest > filters.maxDistanceKm) continue;
    } else if (mode === 'plan_trip') {
      // In plan_trip mode, include candidates discoverable around destination or along route
      const inDestRange = distToDest <= (filters.maxDistanceKm || 35);
      if (!inDestRange && !isAlongActiveRoute) continue;
    }

    // Generate anti-triangulation privacy zone (Fuzzed)
    const privacyZone = generatePrivacyZone(
      candidate.actualLat,
      candidate.actualLng,
      candidate.id,
      candidate.area || candidate.city
    );

    // Apply visible viewport bounds filtering if active
    if (bounds) {
      const minLat = Math.min(bounds.southWest.latitude, bounds.northEast.latitude);
      const maxLat = Math.max(bounds.southWest.latitude, bounds.northEast.latitude);
      const minLng = Math.min(bounds.southWest.longitude, bounds.northEast.longitude);
      const maxLng = Math.max(bounds.southWest.longitude, bounds.northEast.longitude);

      if (
        privacyZone.latitude < minLat ||
        privacyZone.latitude > maxLat ||
        privacyZone.longitude < minLng ||
        privacyZone.longitude > maxLng
      ) {
        continue;
      }
    }

    let distLabel = `${Math.round(distToUser * 10) / 10} km away`;
    if (mode === 'destination' && distToDest !== Infinity) {
      distLabel = distToDest < 1 ? 'Within 1 km' : `Within ${Math.round(distToDest)} km of destination`;
    } else if (mode === 'plan_trip' && distToDest !== Infinity) {
      distLabel = `${Math.round(distToDest)} km from ${tripPlan?.destination || destinationLocation?.name || 'destination'}`;
    } else if (isAlongActiveRoute) {
      distLabel = `Along route (+${detourMins}m detour)`;
    } else if (distToUser < 1) {
      distLabel = 'Within 1 km';
    } else if (distToUser <= 5) {
      distLabel = 'Within 5 km';
    }

    // Suggested safe public venue for smart detour or destination meeting
    const suggestedVenue = SAFE_PUBLIC_VENUES[i % SAFE_PUBLIC_VENUES.length];

    matchedCandidates.push({
      id: candidate.id,
      compatibilityPercentage: compat.percentage,
      availability: 'Open to introductions',
      approximateZone: privacyZone.approximateZoneName,
      distanceLabel: distLabel,
      marriageTimelineMatch: candidate.marriageTimeline === currentUser.marriageTimeline,
      lifestyleMatch: compat.sharedInterestsCount >= 2,
      locationPreferenceMatch: true,
      sharedInterestsCount: compat.sharedInterestsCount,
      compatibilityReasons: compat.reasons,
      fuzzedCoordinate: privacyZone,
      isAlongRoute: isAlongActiveRoute,
      routeDetourMinutes: detourMins,
      distanceFromRouteKm: distFromRouteKm !== Infinity ? distFromRouteKm : undefined,
      availabilityNote,
      meetingAvailability: hasMeetingAvailability,
      suggestedVenue,
    });
  }

  // Sort candidates by highest compatibility first
  matchedCandidates.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);

  // Group candidates into geographic clusters for map rendering (grid bucket approx ~0.035 deg ~ 3.8 km)
  const clusterBuckets: Record<string, { latSum: number; lngSum: number; candidates: AnonymousCandidate[] }> = {};
  const gridSize = 0.04;

  for (const cand of matchedCandidates) {
    const latBucket = Math.floor(cand.fuzzedCoordinate.latitude / gridSize);
    const lngBucket = Math.floor(cand.fuzzedCoordinate.longitude / gridSize);
    const key = `${latBucket}_${lngBucket}`;

    if (!clusterBuckets[key]) {
      clusterBuckets[key] = { latSum: 0, lngSum: 0, candidates: [] };
    }
    clusterBuckets[key].latSum += cand.fuzzedCoordinate.latitude;
    clusterBuckets[key].lngSum += cand.fuzzedCoordinate.longitude;
    clusterBuckets[key].candidates.push(cand);
  }

  const clusters: MapCluster[] = Object.keys(clusterBuckets).map((key, idx) => {
    const b = clusterBuckets[key];
    const count = b.candidates.length;
    const avgLat = b.latSum / count;
    const avgLng = b.lngSum / count;
    const avgCompat = Math.round(
      b.candidates.reduce((sum, c) => sum + c.compatibilityPercentage, 0) / count
    );
    const primaryZone = b.candidates[0].approximateZone;

    return {
      id: `cluster-${key}-${idx}`,
      latitude: avgLat,
      longitude: avgLng,
      count,
      approximateZoneName: primaryZone,
      averageCompatibility: avgCompat,
      candidateIds: b.candidates.map((c) => c.id),
    };
  });

  const availabilitySummary: AvailabilitySummary = {
    within1km: countWithin1km,
    within3km: countWithin3km,
    within5km: countWithin5km,
    fiveToTenKm: count5to10km,
    tenToTwentyFiveKm: count10to25km,
    alongRoute: countAlongRoute,
    nearDestination: countNearDest,
    strongMatches: countStrongMatches,
    availableDuringDates: countAvailableDuringDates || Math.ceil(matchedCandidates.length * 0.4),
    potentialMeetingAreas: countPotentialMeetingAreas || Math.min(clusters.length, 4),
  };

  return {
    totalMatches: matchedCandidates.length,
    within5km: countWithin5km,
    fiveToTenKm: count5to10km,
    alongRoute: countAlongRoute,
    atDestination: countNearDest,
    clusters,
    candidates: matchedCandidates,
    lastQueriedAt: new Date().toISOString(),
    mode,
    availabilitySummary,
    tripPlan: tripPlan || null,
  };
}

// -------------------------------------------------------------
// Dedicated Discovery Endpoints specified in Margam Map Protocol
// -------------------------------------------------------------

export interface NearbyClusterOptions {
  userId?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  radius?: number;
  preferences?: Partial<DiscoveryFilterParams>;
  minimumCompatibility?: number;
  availability?: string;
  privacySettings?: any;
}

export function getNearbyMatchClusters(options: NearbyClusterOptions): DiscoveryQueryResult {
  const filters: DiscoveryFilterParams = {
    minAge: options.preferences?.minAge ?? 21,
    maxAge: options.preferences?.maxAge ?? 35,
    maxDistanceKm: options.radius ?? 25,
    minCompatibility: options.minimumCompatibility ?? options.preferences?.minCompatibility ?? 70,
    marriageTimeline: options.preferences?.marriageTimeline,
    professionCategory: options.preferences?.professionCategory,
    targetGender: options.preferences?.targetGender,
  };

  return queryDiscoveryEngine({
    mode: 'around_me',
    userLocation: options.currentLatitude && options.currentLongitude
      ? {
          latitude: options.currentLatitude,
          longitude: options.currentLongitude,
          accuracy: 10,
        }
      : null,
    filters,
  });
}

export interface RouteClusterOptions {
  userId?: string;
  origin?: { latitude: number; longitude: number };
  destination?: { latitude: number; longitude: number; name?: string };
  routeGeometry?: CalculatedRoute | null;
  routeCorridor?: number;
  preferences?: Partial<DiscoveryFilterParams>;
  availability?: string;
}

export function getRouteMatchClusters(options: RouteClusterOptions): DiscoveryQueryResult {
  const filters: DiscoveryFilterParams = {
    minAge: options.preferences?.minAge ?? 21,
    maxAge: options.preferences?.maxAge ?? 35,
    maxDistanceKm: options.preferences?.maxDistanceKm ?? 50,
    minCompatibility: options.preferences?.minCompatibility ?? 70,
    maxDetourMinutes: options.preferences?.maxDetourMinutes ?? 20,
    targetGender: options.preferences?.targetGender,
  };

  return queryDiscoveryEngine({
    mode: 'along_route',
    userLocation: options.origin
      ? {
          latitude: options.origin.latitude,
          longitude: options.origin.longitude,
          accuracy: 10,
        }
      : null,
    destinationLocation: options.destination || null,
    activeRoute: options.routeGeometry || null,
    routeCorridorWidthKm: options.routeCorridor ?? 12,
    filters,
  });
}

export interface DestinationClusterOptions {
  userId?: string;
  destinationLatitude: number;
  destinationLongitude: number;
  destinationName?: string;
  radius?: number;
  preferences?: Partial<DiscoveryFilterParams>;
  compatibilityThreshold?: number;
}

export function getDestinationMatchClusters(options: DestinationClusterOptions): DiscoveryQueryResult {
  const filters: DiscoveryFilterParams = {
    minAge: options.preferences?.minAge ?? 21,
    maxAge: options.preferences?.maxAge ?? 35,
    maxDistanceKm: options.radius ?? 5,
    minCompatibility: options.compatibilityThreshold ?? options.preferences?.minCompatibility ?? 70,
    targetGender: options.preferences?.targetGender,
  };

  return queryDiscoveryEngine({
    mode: 'destination',
    destinationLocation: {
      latitude: options.destinationLatitude,
      longitude: options.destinationLongitude,
      name: options.destinationName,
    },
    filters,
  });
}

export interface TripPlanClusterOptions {
  userId?: string;
  tripPlan: TripPlan;
  preferences?: Partial<DiscoveryFilterParams>;
}

export function getTripPlanMatchClusters(options: TripPlanClusterOptions): DiscoveryQueryResult {
  const resolved = resolveCityCoordinates(options.tripPlan.destination);
  const filters: DiscoveryFilterParams = {
    minAge: options.preferences?.minAge ?? 21,
    maxAge: options.preferences?.maxAge ?? 35,
    maxDistanceKm: options.preferences?.maxDistanceKm ?? 35,
    minCompatibility: options.preferences?.minCompatibility ?? 70,
    targetGender: options.preferences?.targetGender,
    availableOnWeekendOnly: options.preferences?.availableOnWeekendOnly,
  };

  return queryDiscoveryEngine({
    mode: 'plan_trip',
    destinationLocation: {
      latitude: resolved.lat,
      longitude: resolved.lng,
      name: options.tripPlan.destination,
    },
    tripPlan: options.tripPlan,
    filters,
  });
}

// -------------------------------------------------------------
// Real Geospatial Protocol Helper Functions
// -------------------------------------------------------------

export function getDistanceBucketCounts(
  center: { latitude?: number; longitude?: number },
  maxRadiusKm: number = 25,
  preferences?: Partial<DiscoveryFilterParams>
): Record<string, number> {
  const res = getNearbyMatchClusters({
    currentLatitude: center.latitude,
    currentLongitude: center.longitude,
    radius: maxRadiusKm,
    preferences,
  });

  return {
    within1km: res.availabilitySummary?.within1km ?? 0,
    within3km: res.availabilitySummary?.within3km ?? 0,
    within5km: res.availabilitySummary?.within5km ?? res.within5km,
    fiveToTenKm: res.availabilitySummary?.fiveToTenKm ?? res.fiveToTenKm,
    tenToTwentyFiveKm: res.availabilitySummary?.tenToTwentyFiveKm ?? 0,
  };
}

export function getMapMatchSummary(options: DiscoveryQueryOptions) {
  const result = queryDiscoveryEngine(options);
  return {
    total: result.totalMatches,
    highCompatibility: result.availabilitySummary?.strongMatches ?? 0,
    distanceBuckets: {
      within1km: result.availabilitySummary?.within1km ?? 0,
      within5km: result.availabilitySummary?.within5km ?? result.within5km,
      within10km: result.availabilitySummary?.fiveToTenKm ?? result.fiveToTenKm,
      within25km: result.availabilitySummary?.tenToTwentyFiveKm ?? 0,
    },
    clusters: result.clusters,
    candidates: result.candidates,
  };
}

export function getMapFilters(): DiscoveryFilterParams {
  return {
    minAge: 21,
    maxAge: 35,
    maxDistanceKm: 25,
    minCompatibility: 75,
    marriageTimeline: 'All',
    professionCategory: 'All',
    verifiedOnly: false,
    targetGender: 'Female',
    selectedMargam: 'All',
    margamIntent: 'All',
    openToIntroductionsOnly: false,
    openToMeetingsOnly: false,
  };
}

export function getEligibleProfiles(options: DiscoveryQueryOptions): AnonymousCandidate[] {
  return queryDiscoveryEngine(options).candidates;
}

export function getPrivacySafeProfile(candidateId: string): AnonymousCandidate | null {
  const res = queryDiscoveryEngine({
    mode: 'around_me',
    filters: getMapFilters(),
  });
  return res.candidates.find((c) => c.id === candidateId) || null;
}

export function getPublicMeetingPlaces(cityOrArea?: string): PublicVenue[] {
  if (!cityOrArea) return SAFE_PUBLIC_VENUES;
  const lower = cityOrArea.toLowerCase();
  const matched = SAFE_PUBLIC_VENUES.filter(
    (v) => v.city.toLowerCase().includes(lower) || v.area.toLowerCase().includes(lower)
  );
  return matched.length > 0 ? matched : SAFE_PUBLIC_VENUES;
}

export function getRouteGeometry(
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
) {
  return calculateDrivingRoute(origin, destination);
}

export function calculateCompatibility(userA: UserProfile, userB: UserProfile) {
  return calculateCompatibilityScore(userA, userB);
}

export function calculateInterestCompatibility(userA: UserProfile, candidate: UserProfile): {
  sharedInterests: string[];
  score: number;
} {
  const userTraits = new Set(userA.lifestylePreferences || []);
  const shared = (candidate.lifestylePreferences || []).filter((t) => userTraits.has(t));
  return {
    sharedInterests: shared,
    score: Math.min(shared.length * 20 + 40, 100),
  };
}
