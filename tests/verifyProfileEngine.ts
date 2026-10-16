import {
  getVisibleProfile,
  toggleSaveProfile,
  isProfileSaved,
  blockProfile,
  isProfileBlocked,
  hideProfile,
  isProfileHidden,
  reportProfile,
  getReportedProfiles,
  setNotInterested,
  DETAILED_PROFILES,
} from '../src/services/profileService';
import { AnonymousCandidate } from '../src/types';

console.log('👤 Starting MARGAM Profile Engine & Privacy-Filtered UX Test Suite...\n');

// Test 1: Ananya Master Profile Verification (Matches Reference Design Exactly)
console.log('Test 1: Ananya Reference Profile Integrity (media_1790937528991.png)...');
const ananya = getVisibleProfile('usr-current', 'margam-cand-1');

if (ananya.name !== 'Ananya' || ananya.age !== 27) {
  throw new Error(`Expected Ananya, 27, got ${ananya.name}, ${ananya.age}`);
}
if (!ananya.isVerified) {
  throw new Error('Expected Ananya to have verified badge');
}
if (ananya.compatibilityPercentage !== 92) {
  throw new Error(`Expected 92% compatibility for Ananya, got ${ananya.compatibilityPercentage}%`);
}
if (ananya.area !== 'Kochi area') {
  throw new Error(`Expected Kochi area, got ${ananya.area}`);
}
if (ananya.profession !== 'Marketing Professional') {
  throw new Error(`Expected Marketing Professional, got ${ananya.profession}`);
}
if (ananya.photos.length !== 5) {
  throw new Error(`Expected 5 photos for Ananya, got ${ananya.photos.length}`);
}
console.log(`  Profile: ${ananya.name}, ${ananya.age} (${ananya.profession}) in ${ananya.area}`);
console.log(`  Compatibility: ${ananya.compatibilityPercentage}% | Availability: "${ananya.availability}"`);
console.log('  ✅ PASSED: Ananya reference profile matches exact design specs.');

// Test 2: Photo Privacy & Locked Indicators
console.log('\nTest 2: Photo Privacy Levels & Anti-Inference Rules...');
const publicPhotos = ananya.photos.filter((p) => p.visibility === 'public');
const lockedPhotos = ananya.photos.filter((p) => p.visibility === 'connections_only');

if (publicPhotos.length !== 2) {
  throw new Error(`Expected 2 public photos, got ${publicPhotos.length}`);
}
if (lockedPhotos.length !== 3) {
  throw new Error(`Expected 3 locked photos, got ${lockedPhotos.length}`);
}
// Zero leak of hidden photos
for (const p of lockedPhotos) {
  if (p.url.includes('crop&q=85')) {
    throw new Error('Private photo exposed high-res URL before connection!');
  }
}
console.log(`  Public Photos: ${publicPhotos.length} | Locked Photos: ${lockedPhotos.length}`);
console.log('  ✅ PASSED: Photo privacy enforcement verified (Zero thumbnail inference).');

// Test 3: 8 Margams Catalogue & Intent Breakdown
console.log('\nTest 3: Margams Section Alignment & Intent Breakdown...');
if (ananya.margams.length !== 8) {
  throw new Error(`Expected 8 Margams on Ananya, got ${ananya.margams.length}`);
}
const cafeMargam = ananya.margams.find((m) => m.name === 'Café Business');
if (!cafeMargam || cafeMargam.intentCategory !== 'Future Goal') {
  throw new Error('Café Business must be marked as Future Goal');
}
const travelMargam = ananya.margams.find((m) => m.name === 'Travel');
if (!travelMargam || travelMargam.intentCategory !== 'Regular') {
  throw new Error('Travel must be marked as Regular');
}
const fitnessMargam = ananya.margams.find((m) => m.name === 'Fitness');
if (!fitnessMargam || fitnessMargam.intentCategory !== 'Lifestyle') {
  throw new Error('Fitness must be marked as Lifestyle');
}
console.log(`  Margams verified: ${ananya.margams.map((m) => `${m.emoji} ${m.name} (${m.intentCategory})`).join(', ')}`);
console.log('  ✅ PASSED: Margams intent classification verified.');

// Test 4: Anti-Triangulation & Location Privacy Invariant
console.log('\nTest 4: Anti-Triangulation & Location Privacy Check...');
const ananyaAny = ananya as any;
if (ananyaAny.exactCoordinates || ananyaAny.actualLat || ananyaAny.actualLng || ananyaAny.workplaceCoordinates) {
  throw new Error('PII Leak: Server returned exact coordinates or workplace location on public profile!');
}
if (!ananya.area.toLowerCase().includes('area')) {
  throw new Error('Location must be a generalized area buffer, not an exact address');
}
console.log(`  Safe Geographic Region: "${ananya.area}" (Zero GPS coordinates present)`);
console.log('  ✅ PASSED: Location privacy invariant strictly maintained.');

// Test 5: Profile Safety & Lifecycle Controls (Save, Block, Hide, Report)
console.log('\nTest 5: Profile Safety & Moderation Actions (Save, Block, Hide, Report)...');
const testCandidateId = 'margam-cand-2';

// 5a. Save toggle
const firstSave = toggleSaveProfile(testCandidateId);
if (!firstSave || !isProfileSaved(testCandidateId)) {
  throw new Error('Failed to save profile');
}
const secondSave = toggleSaveProfile(testCandidateId);
if (secondSave || isProfileSaved(testCandidateId)) {
  throw new Error('Failed to unsave profile');
}

// 5b. Hide
hideProfile(testCandidateId);
if (!isProfileHidden(testCandidateId)) {
  throw new Error('Failed to hide profile');
}

// 5c. Block
blockProfile(testCandidateId);
if (!isProfileBlocked(testCandidateId)) {
  throw new Error('Failed to block profile');
}
const blockedProfile = getVisibleProfile('usr-current', testCandidateId);
if (blockedProfile.relationshipState !== 'BLOCKED') {
  throw new Error(`Expected relationshipState to be BLOCKED, got ${blockedProfile.relationshipState}`);
}

// 5d. Confidential Report
reportProfile(testCandidateId, 'Misleading matrimonial information', 'Profile timeline does not match verified status');
const reports = getReportedProfiles();
const matchingReport = reports.find((r) => r.profileId === testCandidateId);
if (!matchingReport || matchingReport.reason !== 'Misleading matrimonial information') {
  throw new Error('Failed to record confidential profile report');
}
console.log('  ✅ PASSED: Save, Block, Hide, and Confidential Report lifecycles verified.');

// Test 6: Fallback Profile Generator from AnonymousCandidate
console.log('\nTest 6: Fallback Profile Generation from AnonymousCandidate...');
const anonCand: AnonymousCandidate = {
  id: 'anon-test-cand',
  compatibilityPercentage: 86,
  availability: 'Open to introductions',
  approximateZone: 'Aluva area',
  distanceLabel: 'Within 10 km',
  marriageTimelineMatch: true,
  lifestyleMatch: true,
  locationPreferenceMatch: true,
  sharedInterestsCount: 2,
  compatibilityReasons: ['Both interested in travel', 'Aligned career timeline'],
  fuzzedCoordinate: {
    latitude: 10.1076,
    longitude: 76.3516,
    radiusKm: 3.5,
    approximateZoneName: 'Aluva area',
    displayDistance: 'Within 10 km',
  },
};

const dynamicProfile = getVisibleProfile('usr-current', anonCand);
if (!dynamicProfile || dynamicProfile.compatibilityPercentage !== 86) {
  throw new Error('Failed to generate dynamic profile from AnonymousCandidate');
}
console.log(`  Dynamic Profile: ${dynamicProfile.name}, ${dynamicProfile.age} in ${dynamicProfile.area} (${dynamicProfile.compatibilityPercentage}%)`);
console.log('  ✅ PASSED: Dynamic fallback profile generator verified.');

console.log('\n🎉 ALL 6 PROFILE ENGINE TESTS PASSED (100% SUCCESS)!\n');
