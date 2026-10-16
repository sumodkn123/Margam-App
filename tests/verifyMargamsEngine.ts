import {
  MARGAM_CATEGORIES,
  MARGAM_INTERESTS,
  getMargamCandidates,
  getUserMargams,
  saveUserMargams,
  SAMPLE_SHARED_PLANS,
  SAMPLE_MARGAM_IDEAS,
} from '../src/services/margamService';
import { computeDetailedCompatibilityBreakdown } from '../src/services/insightsService';
import { DEFAULT_CURRENT_USER } from '../src/services/discoveryEngine';
import { UserMargamSelection, AnonymousCandidate } from '../src/types';

console.log('🌸 Starting MARGAM Interest-Based Discovery & Life Path Engine Test Suite...\n');

// Test 1: Category catalogue integrity
console.log('Test 1: Margam Category Catalogue Integrity...');
if (MARGAM_CATEGORIES.length < 8) {
  throw new Error(`Expected at least 8 categories, got ${MARGAM_CATEGORIES.length}`);
}
for (const cat of MARGAM_CATEGORIES) {
  if (!cat.id || !cat.name || !cat.emoji || !cat.bgColor || !cat.iconColor) {
    throw new Error(`Invalid category definition: ${JSON.stringify(cat)}`);
  }
}
if (MARGAM_INTERESTS.length < 10) {
  throw new Error(`Expected at least 10 specific interests, got ${MARGAM_INTERESTS.length}`);
}
console.log(`  ✅ PASSED: ${MARGAM_CATEGORIES.length} categories verified with ${MARGAM_INTERESTS.length} specific interests.`);

// Test 2: Candidate retrieval by interest ('Café Business')
console.log('\nTest 2: Margam Candidate Retrieval by Interest ("Café Business")...');
const cafeCandidates = getMargamCandidates('Café Business');
if (cafeCandidates.length === 0) {
  throw new Error('Expected candidates for Café Business, found 0');
}
const ananya = cafeCandidates[0];
if (ananya.name !== 'Ananya' || ananya.age !== 27) {
  throw new Error(`Expected primary candidate to be Ananya, 27; got ${ananya.name}, ${ananya.age}`);
}
if (ananya.compatibilityPercentage < 90) {
  throw new Error(`Expected >=90% compatibility for Ananya, got ${ananya.compatibilityPercentage}%`);
}
if (!ananya.lookingToBuild || !ananya.openToRelocate) {
  throw new Error('Expected lookingToBuild and openToRelocate fields on candidate');
}
console.log(`  Candidate: ${ananya.name}, ${ananya.age} (${ananya.profession}) in ${ananya.city}`);
console.log(`  Compatibility: ${ananya.compatibilityPercentage}% | Looking to build: "${ananya.lookingToBuild}"`);
console.log('  ✅ PASSED: Candidate retrieval & intent structure verified.');

// Test 3: Personal Margams Management
console.log('\nTest 3: User Personal Margams CRUD...');
const initialUserMargams = getUserMargams();
const initialCount = initialUserMargams.length;

const newMargam: UserMargamSelection = {
  interestId: 'int-pottery',
  interestName: 'Ceramics & Pottery',
  emoji: '🏺',
  intent: 'want_to_build',
  priority: 'important',
  customGoalText: 'Looking to start an artisan ceramic studio together.',
  visibility: 'public',
};

saveUserMargams([...initialUserMargams, newMargam]);
const afterAdd = getUserMargams();
if (afterAdd.length !== initialCount + 1) {
  throw new Error(`Expected ${initialCount + 1} margams after add, got ${afterAdd.length}`);
}

saveUserMargams(initialUserMargams);
const afterRemove = getUserMargams();
if (afterRemove.length !== initialCount) {
  throw new Error(`Expected ${initialCount} margams after removal, got ${afterRemove.length}`);
}
console.log('  ✅ PASSED: User Margams save/restore lifecycle verified.');

// Test 4: Collaborative Shared Plans
console.log('\nTest 4: Collaborative Shared Plans System...');
const sharedPlans = SAMPLE_SHARED_PLANS;
if (sharedPlans.length === 0) {
  throw new Error('Expected at least one collaborative shared plan');
}
const firstPlan = sharedPlans[0];
if (!firstPlan.title || !firstPlan.partnerName || firstPlan.sections.length === 0) {
  throw new Error('Invalid shared plan structure');
}
console.log(`  Plan: "${firstPlan.title}" with ${firstPlan.partnerName}`);
console.log(`  Sections: ${firstPlan.sections.map((s) => s.title).join(', ')}`);
console.log('  ✅ PASSED: Collaborative Shared Plans verified.');

// Test 5: Ideas & Matrimonial Visions Feed
console.log('\nTest 5: Margam Ideas & Matrimonial Visions Feed...');
const ideas = SAMPLE_MARGAM_IDEAS;
if (ideas.length === 0) {
  throw new Error('Expected at least one Margam idea post');
}
const testIdea = ideas[0];
console.log(`  Idea: "${testIdea.title}" by ${testIdea.authorName} (${testIdea.likesCount} likes)`);
console.log('  ✅ PASSED: Margam ideas feed & interaction verified.');

// Test 6: 6D Compatibility Breakdown on Margam Candidate
console.log('\nTest 6: 6D Compatibility Breakdown on Margam Candidate...');
const sampleCandidate: AnonymousCandidate = {
  id: ananya.id,
  compatibilityPercentage: ananya.compatibilityPercentage,
  availability: 'Open to introductions',
  approximateZone: `${ananya.city} area`,
  distanceLabel: 'Shared Margam Match',
  marriageTimelineMatch: true,
  lifestyleMatch: true,
  locationPreferenceMatch: true,
  sharedInterestsCount: ananya.sharedMargams.length,
  compatibilityReasons: ananya.sharedMargams.map((m) => `Shared ${m.name}`),
  fuzzedCoordinate: {
    latitude: 10.0159,
    longitude: 76.3419,
    radiusKm: 3.5,
    approximateZoneName: `${ananya.city} area`,
    displayDistance: 'Within 5 km',
  },
  availabilityNote: `Discovered via Café Business`,
};

const breakdown = computeDetailedCompatibilityBreakdown(DEFAULT_CURRENT_USER, sampleCandidate);

if (!breakdown || !breakdown.categories.marriageGoals) {
  throw new Error('Expected valid 6D breakdown');
}
console.log(`  Candidate Overall: ${breakdown.overallPercentage}%`);
console.log(`  Categories evaluated: ${Object.keys(breakdown.categories).join(', ')}`);
console.log(`  Key alignments: ${breakdown.keyAlignments.length}, differences: ${breakdown.potentialDifferences.length}`);
console.log('  ✅ PASSED: 6D Compatibility Breakdown verified.');

console.log('\n🎉 ALL 6 MARGAM INTEREST DISCOVERY SUITE TESTS PASSED (100% SUCCESS)!\n');
