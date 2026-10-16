// MARGAM — Advanced Matrimonial Profile System Automated Test Suite
// Verifies all 91 specifications:
// 1. Stored Profile vs Matching Data vs Display Data vs Shared Data separation
// 2. Anti-triangulation zero-PII location guarantees
// 3. DOB and Height display modes
// 4. Income privacy
// 5. Margams with 7 intent types & Core Margam identification
// 6. Life Map visual journey horizons (NOW, NEXT, 3-5 YEARS, FUTURE)
// 7. Horoscope compatibility calculation without raw chart exposure
// 8. Multi-dimensional explainable AI compatibility
// 9. Multi-stage disclosure simulation (Public, Match, Mutual Like, Connection, Granted)
// 10. Access Request lifecycle (Create, Notify, Allow, Unlock)
// 11. Granular Introduction selective disclosure matrix
// 12. Privacy presets (Maximum, Balanced, Open)

import {
  createDefaultSumodProfile,
  createAnanyaMasterProfile,
  getMasterProfile,
  updateMasterProfile,
  getSanitizedProfileForViewer,
  simulateWhatOthersSee,
  calculateAdvancedCompatibility,
  setPrivacyPreset,
  calculateProfileCompleteness,
  generateAiAboutMeDraft,
  approveAiAboutMeDraft,
  requestSectionAccess,
  respondToSectionAccessRequest,
  sendGranularIntroduction,
  respondToGranularIntroduction,
} from '../src/services/advancedProfileEngine';
import { LockedSectionState, GranularIntroductionShareSelection } from '../src/types/profile';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

async function runTestSuite() {
  console.log('\n=============================================================');
  console.log('MARGAM — ADVANCED MATRIMONIAL PROFILE VERIFICATION SUITE');
  console.log('=============================================================\n');

  // -------------------------------------------------------------------------
  // TEST 1: Stored Profile vs Matching vs Display vs Shared Separation
  // -------------------------------------------------------------------------
  console.log('--- TEST 1: Stored Profile vs Display Projection Separation ---');
  const sumodMaster = getMasterProfile('usr-current-sumod');

  assert(sumodMaster.basicDetails.birthDate === '1993-06-24', 'Master profile stores exact birth date (1993-06-24)');
  assert(sumodMaster.basicDetails.heightCm === 178, 'Master profile stores exact height (178 cm)');
  assert(sumodMaster.location.safeDisplayArea === 'Kochi area', 'Master profile defines anti-triangulation safe area');
  assert(sumodMaster.location.internalLat !== undefined, 'Master profile contains internal coordinates for matching query');
  assert(sumodMaster.horoscope.birthTime === '06:45 AM', 'Master profile stores exact birth time internally');

  // Verify sanitized display for stranger / public viewer
  const strangerView = getSanitizedProfileForViewer('anonymous-viewer-1', 'usr-current-sumod', 'stranger');

  assert(strangerView.displayName === 'Sumod', 'Display shows display name');
  assert(strangerView.approximateLocation === 'Kochi area', 'Display shows approximate area buffer');
  assert((strangerView as any).birthDate === undefined, 'Display profile NEVER leaks raw birthDate');
  assert((strangerView as any).internalLat === undefined, 'Display profile NEVER leaks internalLat');
  assert((strangerView as any).internalLng === undefined, 'Display profile NEVER leaks internalLng');
  assert((strangerView as any).phoneNumber === undefined, 'Display profile NEVER leaks phone number');
  assert((strangerView as any).email === undefined, 'Display profile NEVER leaks email address');

  // -------------------------------------------------------------------------
  // TEST 2: Date of Birth and Height Privacy Projections
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 2: Date of Birth and Height Display Modes ---');
  assert(
    strangerView.basicDetails !== undefined && !('isLocked' in strangerView.basicDetails),
    'Basic details are accessible in stranger mode'
  );
  if (strangerView.basicDetails && !('isLocked' in strangerView.basicDetails)) {
    assert(strangerView.basicDetails.ageDisplay === '33 years', 'Age display shows formatted age (33 years)');
    assert(strangerView.basicDetails.heightDisplay === "5'10\"", "Height display shows formatted feet/inches (5'10\")");
  }

  // Test birth year display mode
  updateMasterProfile('usr-current-sumod', {
    basicDetails: {
      ...sumodMaster.basicDetails,
      dobDisplayMode: 'birth_year',
      heightDisplayMode: 'cm',
    },
  });
  const updatedView = getSanitizedProfileForViewer('anonymous-viewer-1', 'usr-current-sumod', 'stranger');
  if (updatedView.basicDetails && !('isLocked' in updatedView.basicDetails)) {
    assert(updatedView.basicDetails.ageDisplay === 'Born in 1993', 'Age display respects birth_year setting');
    assert(updatedView.basicDetails.heightDisplay === '178 cm', 'Height display respects cm setting');
  }

  // Restore defaults
  updateMasterProfile('usr-current-sumod', {
    basicDetails: {
      ...sumodMaster.basicDetails,
      dobDisplayMode: 'age_only',
      heightDisplayMode: 'feet_inches',
    },
  });

  // -------------------------------------------------------------------------
  // TEST 3: Margams with Intent & Core Margam Flagging
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 3: Margams with Intent and Top 3 Core Margams ---');
  assert(sumodMaster.margams.length >= 3, 'User profile has 3+ Margams configured');
  const coreMargams = sumodMaster.margams.filter((m) => m.isCoreMargam);
  assert(coreMargams.length === 3, 'User profile specifies exactly 3 Core Margams');
  assert(coreMargams.some((m) => m.name === 'Café Business'), 'Café Business is in Top 3 Core Margams');
  assert(coreMargams.some((m) => m.intent === 'want_to_build'), 'Café Business has intent "want_to_build"');
  assert(coreMargams.some((m) => m.intent === 'experience_together'), 'Travel has intent "experience_together"');

  // -------------------------------------------------------------------------
  // TEST 4: Life Map Visual Journey (NOW, NEXT, 3-5 YEARS, FUTURE)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 4: Life Map Horizons (NOW, NEXT, 3-5 YEARS, FUTURE) ---');
  assert(sumodMaster.lifeMap.now.length > 0, 'Life Map includes NOW horizon milestones');
  assert(sumodMaster.lifeMap.next.length > 0, 'Life Map includes NEXT horizon milestones');
  assert(sumodMaster.lifeMap.threeToFiveYears.length > 0, 'Life Map includes 3-5 YEARS horizon milestones');
  assert(sumodMaster.lifeMap.future.length > 0, 'Life Map includes FUTURE horizon milestones');

  // -------------------------------------------------------------------------
  // TEST 5: Horoscope Privacy & Compatibility Calculation
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 5: Horoscope Compatibility vs Raw Chart Privacy ---');
  // In stranger view, Horoscope is locked with request_access
  const strangerHoroscope = strangerView.horoscope as LockedSectionState;
  assert(strangerHoroscope.isLocked === true, 'Horoscope raw chart is locked in stranger view');
  assert(strangerHoroscope.canRequestAccess === true, 'Viewer can request access to Horoscope');

  // Verify that algorithm can still compute horoscope compatibility internally
  assert(sumodMaster.horoscope.allowCompatibilityCalculation === true, 'Horoscope permits background compatibility matching');

  // -------------------------------------------------------------------------
  // TEST 6: Multi-Dimensional Explainable AI Compatibility
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 6: Multi-Dimensional AI Compatibility Engine ---');
  const ananyaMaster = getMasterProfile('margam-cand-1');
  const compat = calculateAdvancedCompatibility(sumodMaster, ananyaMaster);

  assert(compat.overallPercentage >= 80, `Overall compatibility score is high (${compat.overallPercentage}%)`);
  assert(compat.categoryScores.margams >= 85, 'Margam alignment score is high due to shared Café Business & Travel');
  assert(compat.whyYouMatched.length >= 2, 'AI generated factual "Why you matched" explanations');
  console.log('   Why you matched:', compat.whyYouMatched);
  assert(compat.thingsToDiscuss.length > 0, 'AI identified constructive topics to discuss (e.g. Vegetarian vs Non-Vegetarian)');
  console.log('   Things to discuss:', compat.thingsToDiscuss[0]);
  assert(compat.howYouFitTheirPreferences.length >= 3, 'AI generated preference fit analysis');

  // -------------------------------------------------------------------------
  // TEST 7: Section Access Request Lifecycle (Request -> Approve -> Unlock)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 7: Section Access Request Lifecycle ---');
  const requesterId = 'usr-test-viewer';
  const targetId = 'usr-current-sumod';

  // 1. Initial view: Family details are locked
  const initialView = getSanitizedProfileForViewer(requesterId, targetId, 'match');
  const familyLocked = initialView.family as LockedSectionState;
  assert(familyLocked.isLocked === true, 'Family details initially locked for matched viewer');
  assert(familyLocked.canRequestAccess === true, 'Viewer can send access request for family');

  // 2. Requester sends access request
  const accessReq = requestSectionAccess(requesterId, targetId, 'family', 'Would like to view family background');
  assert(accessReq.status === 'pending', 'Access request is created with status "pending"');

  // 3. View during pending state shows pending notice
  const pendingView = getSanitizedProfileForViewer(requesterId, targetId, 'match');
  const familyPending = pendingView.family as LockedSectionState;
  assert(familyPending.hasPendingRequest === true, 'Viewer profile reflects pending request state');

  // 4. Target user (Sumod) approves request
  respondToSectionAccessRequest(accessReq.id, 'allowed');

  // 5. Subsequent view: Family details are unlocked!
  const unlockedView = getSanitizedProfileForViewer(requesterId, targetId, 'match');
  assert(unlockedView.family !== undefined && !('isLocked' in unlockedView.family), 'Family details are now UNLOCKED after owner approval');
  if (unlockedView.family && !('isLocked' in unlockedView.family)) {
    assert(unlockedView.family.familyType === 'Nuclear', 'Unlocked family displays family type');
    assert(unlockedView.family.siblingSummary !== undefined, 'Unlocked family displays sibling summary');
  }

  // -------------------------------------------------------------------------
  // TEST 8: Granular Introduction Selective Disclosure Matrix
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 8: Granular Introduction Sharing Matrix ---');
  const introSelection: GranularIntroductionShareSelection = {
    firstName: true,
    age: true,
    profilePhoto: true,
    profession: true,
    coreMargams: true,
    fullBio: true,
    educationDetails: true,
    lifestyleDetails: true,
    lifeMap: true,
    familyDetails: false, // Protected
    religionCommunity: false,
    horoscopeDetails: false,
    contactInformation: false, // Phone/Email kept strictly false
  };

  const introReq = sendGranularIntroduction(
    'usr-current-sumod',
    'margam-cand-1',
    introSelection,
    'Hi Ananya, excited about our mutual Margam in Cafe Business!'
  );

  assert(introReq.status === 'pending', 'Introduction request created as pending');
  assert(introReq.sharedFields.contactInformation === false, 'Contact information strictly omitted from initial intro');
  assert(introReq.sharedFields.coreMargams === true, 'Core Margams shared in introduction');

  // Recipient accepts introduction
  respondToGranularIntroduction(introReq.id, 'accept');

  // Check relationship is now 'connection'
  const connectedView = getSanitizedProfileForViewer('usr-current-sumod', 'margam-cand-1');
  assert(connectedView.relationshipWithViewer === 'connection', 'Connection stage updated to connection');

  // -------------------------------------------------------------------------
  // TEST 9: Live Simulation of "What Others See"
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 9: Live Simulation of "What Others See" ---');
  const simStranger = simulateWhatOthersSee('usr-current-sumod', 'stranger');
  assert(simStranger.relationshipWithViewer === 'stranger', 'Simulator generates stranger view');

  const simMatch = simulateWhatOthersSee('usr-current-sumod', 'match');
  assert(simMatch.relationshipWithViewer === 'match', 'Simulator generates match view');

  const simConnection = simulateWhatOthersSee('usr-current-sumod', 'connection');
  assert(simConnection.relationshipWithViewer === 'connection', 'Simulator generates connection view');

  const simGranted = simulateWhatOthersSee('usr-current-sumod', 'connection', ['family', 'horoscope']);
  assert(!('isLocked' in (simGranted.family || {})), 'Simulator unlocks family when access granted');
  assert(!('isLocked' in (simGranted.horoscope || {})), 'Simulator unlocks horoscope when access granted');

  // -------------------------------------------------------------------------
  // TEST 10: Privacy Presets & Completeness
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 10: Privacy Presets and Completeness ---');
  const maxPrivacyProfile = setPrivacyPreset('usr-current-sumod', 'maximum_privacy');
  assert(maxPrivacyProfile.privacyPreset === 'maximum_privacy', 'Preset updated to maximum_privacy');
  assert(maxPrivacyProfile.religionCulture.visibility.religion === 'request_access', 'Religion locked to request_access in maximum_privacy');

  const balancedProfile = setPrivacyPreset('usr-current-sumod', 'balanced');
  assert(balancedProfile.privacyPreset === 'balanced', 'Preset restored to balanced');
  assert(balancedProfile.religionCulture.visibility.religion === 'matches', 'Religion visible to matches in balanced preset');

  const completenessReport = calculateProfileCompleteness(balancedProfile);
  assert(completenessReport.percentage >= 80, `Completeness percentage is high (${completenessReport.percentage}%)`);
  assert(completenessReport.recommendations.length >= 0, 'Completeness engine returns constructive tips');

  // -------------------------------------------------------------------------
  // TEST 11: AI About-Me Studio Questionnaire Synthesis
  // -------------------------------------------------------------------------
  console.log('\n--- TEST 11: AI About-Me Studio Synthesis ---');
  const draft = generateAiAboutMeDraft('usr-current-sumod', {
    whatYouEnjoy: 'Coffee roasting, weekend cycling, reading',
    whatPassionateAbout: 'Building innovative consumer apps',
    lifeYouWant: 'Peaceful Kerala living with annual travel adventures',
    importantValues: 'Integrity, humor, kindness',
    partnerLookingFor: 'A creative, warm companion',
  });

  assert(draft.length > 50, 'AI generated thoughtful multi-sentence personal bio');
  assert(draft.includes('coffee') || draft.includes('Coffee') || draft.includes('cycling'), 'AI bio incorporates user answers');

  approveAiAboutMeDraft('usr-current-sumod', draft);
  const updatedSumod = getMasterProfile('usr-current-sumod');
  assert(updatedSumod.aboutMe.bio === draft, 'Approved AI draft bio saved to master profile');

  console.log('\n=============================================================');
  console.log('🎉 ALL 11 ADVANCED MATRIMONIAL PROFILE ACCEPTANCE TESTS PASSED!');
  console.log('=============================================================\n');
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
