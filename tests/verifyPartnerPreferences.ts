// MARGAM — Automated Verification Suite: Partner Preferences Engine
// Tests matrimonial partner search criteria, deal-breakers, Kerala communities,
// route corridors, and profile engine persistence.

import {
  getMasterProfile,
  updateMasterProfile,
  resetMasterProfile,
} from '../src/services/advancedProfileEngine';
import { PartnerPreferencesData } from '../src/types/profile';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

console.log('🧪 Starting Partner Preferences Engine Verification Suite...\n');

// 1. Initial Profile & Preferences Retrieval
const initialProfile = getMasterProfile('usr-current-sumod');
assert(!!initialProfile, 'Master profile must exist for current user');
assert(!!initialProfile.partnerPreferences, 'Partner preferences must exist on master profile');

console.log('✅ 1. Master profile and initial partner preferences retrieved successfully.');

// 2. Validate Default Demographics & Bounds
const prefs = initialProfile.partnerPreferences;
assert(prefs.ageRange.value.min >= 18, 'Min age must be at least 18');
assert(prefs.ageRange.value.max <= 60, 'Max age must be within realistic upper bound');
assert(prefs.ageRange.value.min <= prefs.ageRange.value.max, 'Min age must be <= Max age');
assert(prefs.heightRangeCm.value.min <= prefs.heightRangeCm.value.max, 'Min height must be <= Max height');

console.log(`   - Age Span: ${prefs.ageRange.value.min} - ${prefs.ageRange.value.max} years`);
console.log(`   - Height Span: ${prefs.heightRangeCm.value.min} - ${prefs.heightRangeCm.value.max} cm`);
console.log('✅ 2. Default demographics and range spans validated.');

// 3. Validate Matrimonial Faith & Kerala Communities
assert(Array.isArray(prefs.religions.value), 'Religions must be an array');
assert(Array.isArray(prefs.communities.value), 'Communities must be an array');
assert(Array.isArray(prefs.locations.value), 'Locations must be an array');
assert(Array.isArray(prefs.educationLevels.value), 'Education levels must be an array');
assert(Array.isArray(prefs.professions.value), 'Professions must be an array');
assert(prefs.smoking.importance === 'deal_breaker', 'Smoking should default to deal-breaker importance');

console.log(`   - Religions: ${prefs.religions.value.join(', ')}`);
console.log(`   - Communities: ${prefs.communities.value.join(', ')}`);
console.log(`   - Locations: ${prefs.locations.value.join(', ')}`);
console.log('✅ 3. Matrimonial faith, Kerala communities, and deal-breaker criteria validated.');

// 4. Test Updating Partner Preferences with Executive Matrimonial Criteria
const updatedCriteria: PartnerPreferencesData = {
  ...prefs,
  ageRange: {
    value: { min: 24, max: 30 },
    importance: 'high_priority',
    flexibility: 'preferred',
  },
  heightRangeCm: {
    value: { min: 155, max: 172 },
    importance: 'preference',
    flexibility: 'open',
  },
  religions: {
    value: ['Hindu', 'Spiritual'],
    importance: 'preference',
    flexibility: 'open',
  },
  communities: {
    value: ['Caste No Bar', 'Nair', 'Ezhava'],
    importance: 'open',
    flexibility: 'open',
  },
  locations: {
    value: ['Kochi', 'Thrissur', 'Bangalore', 'NH 544 (Kochi — Thrissur)'],
    importance: 'preference',
    flexibility: 'open',
  },
  educationLevels: {
    value: ["Master's Degree", "Bachelor's Degree", 'Doctorate / Ph.D'],
    importance: 'high_priority',
    flexibility: 'preferred',
  },
  professions: {
    value: ['Software / Tech', 'Creative / Design', 'Entrepreneur'],
    importance: 'preference',
    flexibility: 'open',
  },
  dietaryPreferences: {
    value: ['Vegetarian', 'Eggetarian'],
    importance: 'nice_to_have',
    flexibility: 'open',
  },
  smoking: {
    value: 'Non-Smoker',
    importance: 'deal_breaker',
    flexibility: 'required',
  },
  alcohol: {
    value: 'Non-Drinker',
    importance: 'preference',
    flexibility: 'open',
  },
  familyTypes: {
    value: ['Nuclear', 'Moderate'],
    importance: 'nice_to_have',
    flexibility: 'open',
  },
  relocationAcceptance: {
    value: true,
    importance: 'preference',
    flexibility: 'open',
  },
  coreMargamsWanted: {
    value: ['Café Business', 'International Travel', 'Mindful Living & Fitness'],
    importance: 'high_priority',
    flexibility: 'preferred',
  },
  lifeGoalsAlignment: {
    value: ['Within 1 Year', 'Want Children'],
    importance: 'preference',
    flexibility: 'open',
  },
};

const updatedProfile = updateMasterProfile('usr-current-sumod', {
  partnerPreferences: updatedCriteria,
});

assert(!!updatedProfile, 'Updated profile must be returned');
assert(
  updatedProfile.partnerPreferences.ageRange.value.min === 24,
  'Updated min age must be 24'
);
assert(
  updatedProfile.partnerPreferences.ageRange.value.max === 30,
  'Updated max age must be 30'
);
assert(
  updatedProfile.partnerPreferences.communities.value.includes('Caste No Bar'),
  'Communities must include Caste No Bar'
);
assert(
  updatedProfile.partnerPreferences.smoking.importance === 'deal_breaker',
  'Smoking must be a deal-breaker'
);
assert(
  updatedProfile.partnerPreferences.locations.value.includes('NH 544 (Kochi — Thrissur)'),
  'Locations must include highway corridor NH 544'
);

console.log('✅ 4. updateMasterProfile successfully applied executive partner criteria.');

// 5. Test Persistence (Fetching anew from store)
const reFetched = getMasterProfile('usr-current-sumod');
assert(
  reFetched.partnerPreferences.ageRange.value.min === 24,
  'Persisted min age must be 24'
);
assert(
  reFetched.partnerPreferences.ageRange.value.max === 30,
  'Persisted max age must be 30'
);
assert(
  reFetched.partnerPreferences.communities.value.includes('Caste No Bar'),
  'Persisted communities must include Caste No Bar'
);
assert(
  reFetched.partnerPreferences.coreMargamsWanted.value.includes('Café Business'),
  'Persisted shared Margams must include Café Business'
);

console.log('✅ 5. Persistence verified: re-fetched master profile maintains all updated preferences.');

// 6. Test Reset to Defaults
resetMasterProfile('usr-current-sumod');
const resetProfile = getMasterProfile('usr-current-sumod');
assert(!!resetProfile.partnerPreferences, 'Reset profile must have default partner preferences');
assert(
  resetProfile.partnerPreferences.ageRange.value.min === 25,
  'Reset min age must restore default (25)'
);

console.log('✅ 6. Profile reset successfully restores standard baseline preferences.');

console.log('\n🎉 ALL PARTNER PREFERENCES VERIFICATION TESTS PASSED (6/6)! 🚀');
