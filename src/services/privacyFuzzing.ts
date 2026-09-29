// MARGAM - Privacy Fuzzing & Anti-Triangulation Engine
// Core Principle: "Discovery can be anonymous. Connection must be consensual. Information must be controlled by the person sharing it."

import { FuzzedCoordinate, UserProfile, UserShareSelection, AnonymousCandidate, RouteCorridor } from '../types';

/**
 * Deterministic pseudo-random generator based on a string seed.
 * Ensures that candidate coordinate jitter is stable for the session/day,
 * preventing attackers from averaging multiple queries to triangulate the exact location.
 */
function seededRandom(seedStr: string): () => number {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  return () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };
}

/**
 * Generates an anonymous fuzzed zone coordinate with guaranteed minimum privacy radius.
 * Minimum radius is 2.5 km, up to 4.5 km.
 */
export function generatePrivacyZone(
  actualLat: number, 
  actualLng: number, 
  userId: string,
  zoneName: string
): FuzzedCoordinate {
  const rand = seededRandom(`${userId}_margam_fuzz_anchor`);
  const minKm = 2.5;
  const maxKm = 4.2;
  const offsetDistanceKm = minKm + rand() * (maxKm - minKm);
  const angleRad = rand() * 2 * Math.PI;

  // 1 deg latitude ~ 111 km, 1 deg longitude ~ 111 * cos(lat) km
  const deltaLat = (offsetDistanceKm * Math.cos(angleRad)) / 111;
  const deltaLng = (offsetDistanceKm * Math.sin(angleRad)) / (111 * Math.cos((actualLat * Math.PI) / 180));

  return {
    latitude: Number((actualLat + deltaLat).toFixed(4)),
    longitude: Number((actualLng + deltaLng).toFixed(4)),
    radiusKm: Number(offsetDistanceKm.toFixed(1)),
    approximateZoneName: zoneName,
    displayDistance: 'Approximate area along your path',
  };
}

/**
 * Field-level Projection Filter.
 * Strictly guarantees that any field not explicitly consented in `selection`
 * is stripped out before the recipient sees the payload.
 */
export function projectSharedProfile(
  profile: UserProfile, 
  selection: UserShareSelection
): Partial<UserProfile> {
  const result: Partial<UserProfile> = {
    id: profile.id,
  };

  // Basic Information
  if (selection.firstName) result.firstName = profile.firstName;
  if (selection.fullName) result.fullName = profile.fullName;
  if (selection.age) result.age = profile.age;
  if (selection.gender) result.gender = profile.gender;

  // Photos
  if (selection.profilePhoto) result.profilePhotoUrl = profile.profilePhotoUrl;
  if (selection.additionalPhotos) result.additionalPhotoUrls = profile.additionalPhotoUrls;

  // About Me
  if (selection.shortIntro) result.shortIntro = profile.shortIntro;
  if (selection.fullBio) result.fullBio = profile.fullBio;

  // Education
  if (selection.education) result.education = profile.education;
  if (selection.institution) result.institution = profile.institution;

  // Career
  if (selection.profession) result.profession = profile.profession;
  if (selection.company) result.company = profile.company;
  if (selection.workplaceLocation) result.workplaceLocation = profile.workplaceLocation;

  // Location
  if (selection.city) result.city = profile.city;
  if (selection.area) result.area = profile.area;
  // Note: exactLocation is NEVER assigned or passed.

  // Lifestyle
  if (selection.lifestylePreferences) result.lifestylePreferences = profile.lifestylePreferences;
  if (selection.detailedLifestyle) result.detailedLifestyle = profile.detailedLifestyle;

  // Family
  if (selection.familyOverview) result.familyOverview = profile.familyOverview;
  if (selection.detailedFamily) result.detailedFamily = profile.detailedFamily;

  // Contact (Strictly conditional - default OFF)
  if (selection.phoneNumber) result.phoneNumber = profile.phoneNumber;
  if (selection.email) result.email = profile.email;

  return result;
}

/**
 * Route Corridor Matcher
 * Determines if an anonymous candidate's fuzzed zone is along a travel corridor.
 */
export function filterCandidatesAlongCorridor(
  candidates: AnonymousCandidate[],
  route: RouteCorridor,
  maxDetourMinutes: number = 15
): AnonymousCandidate[] {
  return candidates.filter((candidate) => {
    if (!candidate.isAlongRoute) return false;
    if (candidate.routeDetourMinutes !== undefined && candidate.routeDetourMinutes > maxDetourMinutes) {
      return false;
    }
    return true;
  });
}
