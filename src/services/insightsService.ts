import {
  UserProfile,
  AnonymousCandidate,
  MatchInsightsSummary,
  DetailedCompatibilityBreakdown,
  NewMatchesQueryOptions,
  RouteMatchInsightsOptions,
  DestinationMatchInsightsOptions,
  HighCompatibilityQueryOptions,
  CandidateState,
  PublicVenue,
} from '../types';
import {
  getRegisteredProfilePool,
  calculateCompatibilityScore,
  resolveCityCoordinates,
  DEFAULT_CURRENT_USER,
  SAFE_PUBLIC_VENUES,
} from './discoveryEngine';
import { generatePrivacyZone } from './privacyFuzzing';
import {
  calculateDrivingRoute,
  isPointWithinRouteCorridor,
  haversineDistanceKm,
  CalculatedRoute,
} from './routingService';

// -------------------------------------------------------------
// Candidate State & Interaction Store
// -------------------------------------------------------------

const candidateStateMap = new Map<string, CandidateState>();
const savedCandidatesSet = new Set<string>();

export function getCandidateState(candidateId: string): CandidateState {
  return candidateStateMap.get(candidateId) || 'new';
}

export function markCandidateSeen(candidateId: string): void {
  const current = candidateStateMap.get(candidateId);
  if (!current || current === 'new') {
    candidateStateMap.set(candidateId, 'seen');
  }
}

export function markCandidateSaved(candidateId: string, saved: boolean = true): void {
  if (saved) {
    savedCandidatesSet.add(candidateId);
    candidateStateMap.set(candidateId, 'saved');
  } else {
    savedCandidatesSet.delete(candidateId);
    candidateStateMap.set(candidateId, 'seen');
  }
}

export function isCandidateSaved(candidateId: string): boolean {
  return savedCandidatesSet.has(candidateId);
}

export function markCandidateDismissed(candidateId: string): void {
  candidateStateMap.set(candidateId, 'dismissed');
  savedCandidatesSet.delete(candidateId);
}

export function markCandidateBlocked(candidateId: string): void {
  candidateStateMap.set(candidateId, 'blocked');
  savedCandidatesSet.delete(candidateId);
}

export function resetCandidateStates(): void {
  candidateStateMap.clear();
  savedCandidatesSet.clear();
}

// -------------------------------------------------------------
// User Route & Destination Persistent Session State
// -------------------------------------------------------------

export interface ActiveRouteState {
  hasActiveRoute: boolean;
  originName: string;
  originCoords: { lat: number; lng: number };
  destinationName: string;
  destinationCoords: { lat: number; lng: number };
  travelDate?: string;
  detourFilterMinutes: number;
}

export interface ActiveDestinationState {
  hasActiveDestination: boolean;
  destinationName: string;
  coords: { lat: number; lng: number };
  radiusKm: number;
}

let activeRouteState: ActiveRouteState = {
  hasActiveRoute: true,
  originName: 'Thrissur',
  originCoords: { lat: 10.5276, lng: 76.2144 },
  destinationName: 'Kochi',
  destinationCoords: { lat: 10.0159, lng: 76.3419 },
  travelDate: 'Today',
  detourFilterMinutes: 10,
};

let activeDestinationState: ActiveDestinationState = {
  hasActiveDestination: true,
  destinationName: 'Kochi',
  coords: { lat: 10.0159, lng: 76.3419 },
  radiusKm: 5,
};

export function getActiveRouteState(): ActiveRouteState {
  return { ...activeRouteState };
}

export function setActiveRouteState(
  originName: string,
  destinationName: string,
  detourFilterMinutes: number = 10,
  travelDate?: string
): void {
  const originCoords = resolveCityCoordinates(originName);
  const destinationCoords = resolveCityCoordinates(destinationName);
  activeRouteState = {
    hasActiveRoute: true,
    originName,
    originCoords,
    destinationName,
    destinationCoords,
    travelDate: travelDate || 'Today',
    detourFilterMinutes,
  };
}

export function clearActiveRouteState(): void {
  activeRouteState = {
    hasActiveRoute: false,
    originName: '',
    originCoords: { lat: 0, lng: 0 },
    destinationName: '',
    destinationCoords: { lat: 0, lng: 0 },
    detourFilterMinutes: 10,
  };
}

export function getActiveDestinationState(): ActiveDestinationState {
  return { ...activeDestinationState };
}

export function setActiveDestinationState(
  destinationName: string,
  radiusKm: number = 5
): void {
  const coords = resolveCityCoordinates(destinationName);
  activeDestinationState = {
    hasActiveDestination: true,
    destinationName,
    coords,
    radiusKm,
  };
}

export function clearActiveDestinationState(): void {
  activeDestinationState = {
    hasActiveDestination: false,
    destinationName: '',
    coords: { lat: 0, lng: 0 },
    radiusKm: 5,
  };
}

// -------------------------------------------------------------
// Detailed Compatibility Breakdown Engine
// -------------------------------------------------------------

export function computeDetailedCompatibilityBreakdown(
  user: UserProfile = DEFAULT_CURRENT_USER,
  candidateProfile: UserProfile | AnonymousCandidate
): DetailedCompatibilityBreakdown {
  const allProfiles = getRegisteredProfilePool();
  const fullCand =
    'fieldPerms' in candidateProfile
      ? (candidateProfile as UserProfile)
      : allProfiles.find((p) => p.id === candidateProfile.id) || allProfiles[0];

  const compat = calculateCompatibilityScore(user, fullCand);
  const ageDiff = Math.abs(user.age - fullCand.age);
  const sameTimeline = user.marriageTimeline === fullCand.marriageTimeline;
  const userTraits = new Set(user.lifestylePreferences || []);
  const commonTraits = (fullCand.lifestylePreferences || []).filter((t) => userTraits.has(t));
  const distKm = haversineDistanceKm(
    user.actualLat,
    user.actualLng,
    fullCand.actualLat,
    fullCand.actualLng
  );

  const isTechBoth =
    (user.profession?.toLowerCase()?.includes('engineer') ?? false) &&
    (fullCand.profession?.toLowerCase()?.includes('engineer') ?? false);

  // 1. Marriage Goals
  const marriageScore = sameTimeline ? 96 : 82;
  const marriageGoals = {
    category: 'Marriage Goals',
    rating: sameTimeline ? ('Exceptional' as const) : ('Strong' as const),
    percentage: marriageScore,
    details: sameTimeline
      ? `Both actively planning to marry within ${user.marriageTimeline.toLowerCase()}`
      : `User timeline is ${user.marriageTimeline}, candidate is open to flexible discussions`,
    isPositive: true,
  };

  // 2. Lifestyle
  const lifestylePercentage = Math.min(65 + commonTraits.length * 10, 95);
  const lifestyle = {
    category: 'Lifestyle & Habits',
    rating: commonTraits.length >= 2 ? ('Exceptional' as const) : ('Strong' as const),
    percentage: lifestylePercentage,
    details:
      commonTraits.length > 0
        ? `Shared preferences: ${commonTraits.join(', ')}`
        : 'Complementary balanced daily routines and dietary choices',
    isPositive: true,
  };

  // 3. Location
  const locationPercentage = distKm < 15 ? 94 : distKm < 45 ? 86 : 78;
  const location = {
    category: 'Location & Commute',
    rating: distKm < 20 ? ('Very strong' as const) : ('Moderate' as const),
    percentage: locationPercentage,
    details:
      distKm < 15
        ? `Located in close proximity (~${Math.round(distKm)} km) in the ${fullCand.city} area`
        : `Based in ${fullCand.city}, convenient transit access along NH corridor`,
    isPositive: true,
  };

  // 4. Education & Career
  const careerPercentage = isTechBoth ? 95 : 88;
  const educationCareer = {
    category: 'Education & Career',
    rating: isTechBoth ? ('Exceptional' as const) : ('Very strong' as const),
    percentage: careerPercentage,
    details: isTechBoth
      ? 'Both hold professional engineering degrees with aligned career stages'
      : `${user.profession} & ${fullCand.profession}, mutually respected professional paths`,
    isPositive: true,
  };

  // 5. Family Preferences
  const familyPreferences = {
    category: 'Family Values',
    rating: 'Very strong' as const,
    percentage: 90,
    details: 'Aligned family structure expectations and traditional-yet-progressive values',
    isPositive: true,
  };

  // 6. Personality & Interests
  const personalityInterests = {
    category: 'Interests & Outlook',
    rating: 'Strong' as const,
    percentage: 87,
    details: `Common focus on ${user.interests.slice(0, 2).join(' & ')} with open communication styles`,
    isPositive: true,
  };

  const keyAlignments: string[] = [
    sameTimeline ? `Aligned timeline (${user.marriageTimeline})` : 'Constructive life planning',
    ageDiff <= 3 ? `Close age compatibility (${ageDiff} year difference)` : `Respectful age alignment (${ageDiff} yrs)`,
    commonTraits.length > 0 ? `Shared habits: ${commonTraits.slice(0, 2).join(', ')}` : 'Harmonious lifestyle outlook',
    distKm < 25 ? 'Geographically convenient for family meetings' : 'Easily accessible via Kerala transit',
  ];

  const potentialDifferences: string[] = [];
  if (distKm > 25) {
    potentialDifferences.push(`Based in ${fullCand.city} (${Math.round(distKm)} km away), requires travel for in-person meets`);
  }
  if (!sameTimeline) {
    potentialDifferences.push(`Slight variation in marriage timeline (${user.marriageTimeline} vs ${fullCand.marriageTimeline})`);
  }
  if (commonTraits.length < 2) {
    potentialDifferences.push('Distinct personal hobby routines that offer opportunities to learn new perspectives');
  }
  if (potentialDifferences.length === 0) {
    potentialDifferences.push('Minor differences in professional commute hours that are easily harmonized');
  }

  return {
    candidateId: fullCand.id,
    overallPercentage: compat.percentage,
    categories: {
      marriageGoals,
      lifestyle,
      location,
      educationCareer,
      familyPreferences,
      personalityInterests,
    },
    keyAlignments,
    potentialDifferences,
  };
}

// -------------------------------------------------------------
// 1. NEW MATCHES DISCOVERY QUERY
// -------------------------------------------------------------

export interface NewMatchesResult {
  totalCount: number;
  candidates: AnonymousCandidate[];
  timeframeLabel: string;
  newCountToday: number;
  newCountThisWeek: number;
}

export function getNewMatches(
  options: NewMatchesQueryOptions = {},
  currentUser: UserProfile = DEFAULT_CURRENT_USER
): NewMatchesResult {
  const allProfiles = getRegisteredProfilePool();
  const radiusKm = options.discoveryRadius ?? 40;
  const minCompat = options.compatibilityThreshold ?? 70;
  const filterSort = options.filterSort ?? 'newest';

  // Eligible profiles matching basic preferences & not dismissed/blocked
  const eligible = allProfiles.filter((p) => {
    if (p.id === currentUser.id) return false;
    const state = getCandidateState(p.id);
    if (state === 'dismissed' || state === 'blocked') return false;

    // Gender check
    const targetGender = options.userPreferences?.targetGender ?? (currentUser.gender === 'Male' ? 'Female' : 'Male');
    if (targetGender !== 'All' && p.gender !== targetGender) return false;

    // Age bounds
    const minAge = options.userPreferences?.minAge ?? 21;
    const maxAge = options.userPreferences?.maxAge ?? 35;
    if (p.age < minAge || p.age > maxAge) return false;

    // Distance check from user
    const dist = haversineDistanceKm(
      currentUser.actualLat,
      currentUser.actualLng,
      p.actualLat,
      p.actualLng
    );
    if (dist > radiusKm) return false;

    return true;
  });

  // Calculate compatibility and determine "new" qualification
  // In our seeded database, profiles with index modulo 3 == 0 or 1 qualify as newly added within 7 days
  const candidateList: AnonymousCandidate[] = [];

  eligible.forEach((p, idx) => {
    // Determine new qualification:
    // Configurable: e.g. state is 'new' or indexed as recent profile
    const isRecentlyJoined = (idx % 2 === 0) || (idx % 3 === 0);
    if (!isRecentlyJoined && getCandidateState(p.id) !== 'new') {
      return;
    }

    const compat = calculateCompatibilityScore(currentUser, p);
    if (compat.percentage < minCompat) return;

    const privacyZone = generatePrivacyZone(p.actualLat, p.actualLng, p.city, p.area);
    const dist = haversineDistanceKm(
      currentUser.actualLat,
      currentUser.actualLng,
      p.actualLat,
      p.actualLng
    );

    const distLabel = dist < 2 ? 'Within 2 km' : `Within ${Math.round(dist)} km`;
    const venue = SAFE_PUBLIC_VENUES[idx % SAFE_PUBLIC_VENUES.length];

    candidateList.push({
      id: p.id,
      compatibilityPercentage: compat.percentage,
      availability: 'Open to introductions',
      approximateZone: privacyZone.approximateZoneName,
      distanceLabel: distLabel,
      marriageTimelineMatch: p.marriageTimeline === currentUser.marriageTimeline,
      lifestyleMatch: compat.sharedInterestsCount >= 1,
      locationPreferenceMatch: true,
      sharedInterestsCount: compat.sharedInterestsCount,
      compatibilityReasons: compat.reasons,
      fuzzedCoordinate: privacyZone,
      availabilityNote: 'Joined this week',
      suggestedVenue: venue,
    });
  });

  // Sorting
  if (filterSort === 'compatibility') {
    candidateList.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);
  } else if (filterSort === 'nearest') {
    candidateList.sort((a, b) => a.fuzzedCoordinate.radiusKm - b.fuzzedCoordinate.radiusKm);
  } else {
    // Default newest: keep deterministic order
    candidateList.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);
  }

  const newToday = Math.ceil(candidateList.length * 0.4);

  return {
    totalCount: candidateList.length,
    candidates: candidateList,
    timeframeLabel: 'Added in the last 7 days',
    newCountToday: newToday,
    newCountThisWeek: candidateList.length,
  };
}

// -------------------------------------------------------------
// 2. ALONG ROUTE DISCOVERY QUERY
// -------------------------------------------------------------

export interface RouteMatchInsightsResult {
  hasActiveRoute: boolean;
  routeOrigin?: string;
  routeDestination?: string;
  distanceKm: number;
  durationLabel: string;
  totalCount: number;
  detourMinutesThreshold: number;
  candidates: AnonymousCandidate[];
  recommendedVenues: PublicVenue[];
  calculatedRoute?: CalculatedRoute;
}

export function getRouteMatchInsights(
  options: RouteMatchInsightsOptions = {},
  currentUser: UserProfile = DEFAULT_CURRENT_USER
): RouteMatchInsightsResult {
  const routeState = getActiveRouteState();

  if (!routeState.hasActiveRoute && !options.origin && !options.destination) {
    return {
      hasActiveRoute: false,
      totalCount: 0,
      detourMinutesThreshold: options.detourMinutesThreshold ?? 10,
      candidates: [],
      recommendedVenues: [],
      distanceKm: 0,
      durationLabel: '',
    };
  }

  const originName = options.origin?.name || routeState.originName || 'Thrissur';
  const destName = options.destination?.name || routeState.destinationName || 'Kochi';
  const originCoords = options.origin
    ? { lat: options.origin.latitude, lng: options.origin.longitude }
    : routeState.originCoords;
  const destCoords = options.destination
    ? { lat: options.destination.latitude, lng: options.destination.longitude }
    : routeState.destinationCoords;

  const detourThreshold = options.detourMinutesThreshold ?? routeState.detourFilterMinutes ?? 10;
  const allProfiles = getRegisteredProfilePool();

  // Downsampled waypoints between origin & destination
  const straightDist = haversineDistanceKm(
    originCoords.lat,
    originCoords.lng,
    destCoords.lat,
    destCoords.lng
  );
  const durMins = Math.round((straightDist / 45) * 60);

  const waypoints = [
    { latitude: originCoords.lat, longitude: originCoords.lng },
    {
      latitude: originCoords.lat * 0.7 + destCoords.lat * 0.3,
      longitude: originCoords.lng * 0.7 + destCoords.lng * 0.3,
    },
    {
      latitude: originCoords.lat * 0.4 + destCoords.lat * 0.6,
      longitude: originCoords.lng * 0.4 + destCoords.lng * 0.6,
    },
    { latitude: destCoords.lat, longitude: destCoords.lng },
  ];

  const calculatedRoute: CalculatedRoute = {
    id: `route-${originName}-${destName}`,
    origin: { latitude: originCoords.lat, longitude: originCoords.lng },
    destination: { latitude: destCoords.lat, longitude: destCoords.lng },
    waypoints,
    distanceKm: Math.round(straightDist * 1.15 * 10) / 10,
    durationMinutes: durMins,
    durationLabel: durMins > 60 ? `${Math.floor(durMins / 60)}h ${durMins % 60}m` : `${durMins} mins`,
    distanceLabel: `${Math.round(straightDist * 1.15)} km`,
  };

  const candidateList: AnonymousCandidate[] = [];

  allProfiles.forEach((p, idx) => {
    if (p.id === currentUser.id) return;
    const state = getCandidateState(p.id);
    if (state === 'dismissed' || state === 'blocked') return false;

    // Check corridor
    const corridor = isPointWithinRouteCorridor(p.actualLat, p.actualLng, waypoints, 12);
    if (!corridor.isWithin) return;

    if (corridor.estimatedDetourMins > detourThreshold) return;

    const compat = calculateCompatibilityScore(currentUser, p);
    if (compat.percentage < (options.userPreferences?.minCompatibility ?? 65)) return;

    const privacyZone = generatePrivacyZone(p.actualLat, p.actualLng, p.city, p.area);
    const venue = SAFE_PUBLIC_VENUES[idx % SAFE_PUBLIC_VENUES.length];

    candidateList.push({
      id: p.id,
      compatibilityPercentage: compat.percentage,
      availability: 'Open to introductions',
      approximateZone: privacyZone.approximateZoneName,
      distanceLabel: `Along route (+${corridor.estimatedDetourMins}m detour)`,
      marriageTimelineMatch: p.marriageTimeline === currentUser.marriageTimeline,
      lifestyleMatch: compat.sharedInterestsCount >= 1,
      locationPreferenceMatch: true,
      sharedInterestsCount: compat.sharedInterestsCount,
      compatibilityReasons: compat.reasons,
      fuzzedCoordinate: privacyZone,
      isAlongRoute: true,
      routeDetourMinutes: corridor.estimatedDetourMins,
      distanceFromRouteKm: Math.round(corridor.minDistanceKm * 10) / 10,
      availabilityNote: `Accessible via ${destName} highway corridor`,
      suggestedVenue: venue,
    });
  });

  candidateList.sort((a, b) => (a.routeDetourMinutes ?? 0) - (b.routeDetourMinutes ?? 0));

  return {
    hasActiveRoute: true,
    routeOrigin: originName,
    routeDestination: destName,
    distanceKm: calculatedRoute.distanceKm,
    durationLabel: calculatedRoute.durationLabel,
    totalCount: candidateList.length,
    detourMinutesThreshold: detourThreshold,
    candidates: candidateList,
    recommendedVenues: SAFE_PUBLIC_VENUES.slice(0, 4),
    calculatedRoute,
  };
}

// -------------------------------------------------------------
// 3. AT DESTINATION DISCOVERY QUERY
// -------------------------------------------------------------

export interface DestinationMatchInsightsResult {
  hasActiveDestination: boolean;
  destinationName: string;
  radiusKm: number;
  totalCount: number;
  candidates: AnonymousCandidate[];
  availableVenues: PublicVenue[];
  popularDestinations: string[];
}

export function getDestinationMatchInsights(
  options: DestinationMatchInsightsOptions = {},
  currentUser: UserProfile = DEFAULT_CURRENT_USER
): DestinationMatchInsightsResult {
  const destState = getActiveDestinationState();
  const popularDestinations = ['Kochi', 'Thrissur', 'Kozhikode', 'Trivandrum', 'Bangalore'];

  const hasDest = Boolean(options.destinationName || destState.hasActiveDestination);
  if (!hasDest) {
    return {
      hasActiveDestination: false,
      destinationName: '',
      radiusKm: options.radiusKm ?? 5,
      totalCount: 0,
      candidates: [],
      availableVenues: [],
      popularDestinations,
    };
  }

  const destName = options.destinationName || destState.destinationName || 'Kochi';
  const radiusKm = options.radiusKm ?? destState.radiusKm ?? 5;
  const destCoords = resolveCityCoordinates(destName);
  const allProfiles = getRegisteredProfilePool();

  const candidateList: AnonymousCandidate[] = [];

  allProfiles.forEach((p, idx) => {
    if (p.id === currentUser.id) return;
    const state = getCandidateState(p.id);
    if (state === 'dismissed' || state === 'blocked') return;

    const distToDest = haversineDistanceKm(
      destCoords.lat,
      destCoords.lng,
      p.actualLat,
      p.actualLng
    );
    if (distToDest > radiusKm) return;

    // Optional visit availability filter
    if (options.availableDuringVisitOnly && idx % 3 === 0) {
      return;
    }

    const compat = calculateCompatibilityScore(currentUser, p);
    if (compat.percentage < (options.userPreferences?.minCompatibility ?? 65)) return;

    const privacyZone = generatePrivacyZone(p.actualLat, p.actualLng, p.city, p.area);
    const venue = SAFE_PUBLIC_VENUES[idx % SAFE_PUBLIC_VENUES.length];

    candidateList.push({
      id: p.id,
      compatibilityPercentage: compat.percentage,
      availability: 'Open to introductions',
      approximateZone: privacyZone.approximateZoneName,
      distanceLabel: distToDest < 1 ? 'Within 1 km' : `Within ${Math.round(distToDest)} km of destination`,
      marriageTimelineMatch: p.marriageTimeline === currentUser.marriageTimeline,
      lifestyleMatch: compat.sharedInterestsCount >= 1,
      locationPreferenceMatch: true,
      sharedInterestsCount: compat.sharedInterestsCount,
      compatibilityReasons: compat.reasons,
      fuzzedCoordinate: privacyZone,
      availabilityNote: `Available in ${destName} during your visit`,
      suggestedVenue: venue,
    });
  });

  candidateList.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);

  const matchedVenues = SAFE_PUBLIC_VENUES.filter(
    (v) => v.city.toLowerCase() === destName.toLowerCase()
  );

  return {
    hasActiveDestination: true,
    destinationName: destName,
    radiusKm,
    totalCount: candidateList.length,
    candidates: candidateList,
    availableVenues: matchedVenues.length > 0 ? matchedVenues : SAFE_PUBLIC_VENUES.slice(0, 3),
    popularDestinations,
  };
}

// -------------------------------------------------------------
// 4. HIGH COMPATIBILITY DISCOVERY QUERY
// -------------------------------------------------------------

export interface HighCompatibilityResult {
  threshold: number;
  totalCount: number;
  candidates: AnonymousCandidate[];
  averageCompatibility: number;
  alignmentSummary: {
    bothVegetarianCount: number;
    alignedTimelineCount: number;
    careerMatchCount: number;
  };
}

export function getHighCompatibilityMatches(
  options: HighCompatibilityQueryOptions = {},
  currentUser: UserProfile = DEFAULT_CURRENT_USER
): HighCompatibilityResult {
  const threshold = options.threshold ?? 85;
  const allProfiles = getRegisteredProfilePool();
  const candidateList: AnonymousCandidate[] = [];

  let bothVegCount = 0;
  let alignedTimelineCount = 0;
  let careerCount = 0;

  allProfiles.forEach((p, idx) => {
    if (p.id === currentUser.id) return;
    const state = getCandidateState(p.id);
    if (state === 'dismissed' || state === 'blocked') return;

    // Gender check
    const targetGender = options.userPreferences?.targetGender ?? (currentUser.gender === 'Male' ? 'Female' : 'Male');
    if (targetGender !== 'All' && p.gender !== targetGender) return;

    const compat = calculateCompatibilityScore(currentUser, p);
    if (compat.percentage < threshold) return;

    const privacyZone = generatePrivacyZone(p.actualLat, p.actualLng, p.city, p.area);
    const dist = haversineDistanceKm(
      currentUser.actualLat,
      currentUser.actualLng,
      p.actualLat,
      p.actualLng
    );
    const venue = SAFE_PUBLIC_VENUES[idx % SAFE_PUBLIC_VENUES.length];

    if (p.lifestylePreferences.includes('Vegetarian') && currentUser.lifestylePreferences.includes('Vegetarian')) {
      bothVegCount++;
    }
    if (p.marriageTimeline === currentUser.marriageTimeline) {
      alignedTimelineCount++;
    }
    if (p.profession.toLowerCase().includes('engineer')) {
      careerCount++;
    }

    candidateList.push({
      id: p.id,
      compatibilityPercentage: compat.percentage,
      availability: 'Open to introductions',
      approximateZone: privacyZone.approximateZoneName,
      distanceLabel: `${Math.round(dist)} km away`,
      marriageTimelineMatch: p.marriageTimeline === currentUser.marriageTimeline,
      lifestyleMatch: compat.sharedInterestsCount >= 1,
      locationPreferenceMatch: true,
      sharedInterestsCount: compat.sharedInterestsCount,
      compatibilityReasons: compat.reasons,
      fuzzedCoordinate: privacyZone,
      availabilityNote: `${compat.percentage}% Matrimonial Alignment`,
      suggestedVenue: venue,
    });
  });

  candidateList.sort((a, b) => b.compatibilityPercentage - a.compatibilityPercentage);

  const avg =
    candidateList.length > 0
      ? Math.round(
          candidateList.reduce((acc, c) => acc + c.compatibilityPercentage, 0) /
            candidateList.length
        )
      : threshold;

  return {
    threshold,
    totalCount: candidateList.length,
    candidates: candidateList,
    averageCompatibility: avg,
    alignmentSummary: {
      bothVegetarianCount: bothVegCount,
      alignedTimelineCount,
      careerMatchCount: careerCount,
    },
  };
}

// -------------------------------------------------------------
// 5. AGGREGATED "TODAY'S MATCH INSIGHTS" SUMMARY
// -------------------------------------------------------------

let cachedSummary: MatchInsightsSummary | null = null;
let lastSummaryTimestamp = 0;

export function getTodayMatchInsights(
  currentUser: UserProfile = DEFAULT_CURRENT_USER,
  forceRefresh: boolean = false
): MatchInsightsSummary {
  const now = Date.now();
  // Cache for 10 seconds unless forceRefresh
  if (cachedSummary && !forceRefresh && now - lastSummaryTimestamp < 10000) {
    return cachedSummary;
  }

  const newMatchesRes = getNewMatches({}, currentUser);
  const routeRes = getRouteMatchInsights({}, currentUser);
  const destRes = getDestinationMatchInsights({}, currentUser);
  const highCompatRes = getHighCompatibilityMatches({ threshold: 85 }, currentUser);

  const routeState = getActiveRouteState();
  const destState = getActiveDestinationState();

  const summary: MatchInsightsSummary = {
    newMatchesCount: newMatchesRes.totalCount,
    routeMatchesCount: routeRes.totalCount,
    destinationMatchesCount: destRes.totalCount,
    highCompatibilityCount: highCompatRes.totalCount,
    destinationName: destState.destinationName || 'Kochi',
    routeSummary: routeState.hasActiveRoute ? `To ${routeState.destinationName}` : 'Set Route',
    hasActiveRoute: routeState.hasActiveRoute,
    hasActiveDestination: destState.hasActiveDestination,
    lastUpdatedAt: new Date().toISOString(),
    highCompatThreshold: 85,
    detourFilterMinutes: routeState.detourFilterMinutes,
    destinationRadiusKm: destState.radiusKm,
  };

  cachedSummary = summary;
  lastSummaryTimestamp = now;

  return summary;
}
