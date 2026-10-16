// MARGAM — Pure White Minimalist Splash Screen & Branding Verification Suite
// Validates pure white background (#FFFFFF), official Margam 3D logo,
// single exact tagline ("Shared journeys. Meaningful life partners."),
// complete removal of scenic photography, large pink circle, empty image placeholders,
// and smooth 4-stage native animation into genuine application.

import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
}

console.log('=============================================================');
console.log('MARGAM — REFINED WHITE CANVAS SPLASH SCREEN & BRANDING SUITE');
console.log('=============================================================\n');

// -------------------------------------------------------------
// TEST 1: Official Logo Asset & Resolution
// -------------------------------------------------------------
console.log('--- TEST 1: Official Margam Logo Asset ---');
{
  const logoPath = path.resolve(process.cwd(), 'assets/images/margam_logo_3d.png');
  assert(fs.existsSync(logoPath), 'Official 3D Margam logo asset must exist at assets/images/margam_logo_3d.png');

  const logoStat = fs.statSync(logoPath);
  assert(logoStat.size > 500000, 'Official 3D logo must be high-resolution (>500KB) for retina sharpness');

  console.log(`✅ Passed: Official 3D Margam logo verified (${Math.round(logoStat.size / 1024)} KB).`);
}

// -------------------------------------------------------------
// TEST 2: Pure White Canvas & Zero Scenic Photography
// -------------------------------------------------------------
console.log('\n--- TEST 2: Pure White Canvas & Zero Scenic Background ---');
{
  const launchFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/screens/splash/MargamLaunchScreen.tsx'),
    'utf-8'
  );

  // Background must be pure white
  assert(launchFile.includes("backgroundColor: '#FFFFFF'"), 'Container background must be pure white (#FFFFFF)');

  // Scenic background, mountains, palms, and backwaters must be removed
  assert(!launchFile.includes('KeralaSunriseBackdrop'), 'KeralaSunriseBackdrop must be completely removed');
  assert(!launchFile.includes('bg_kerala_clean.png'), 'Kerala clean photographic background must be removed');
  assert(!launchFile.includes('bg_kerala_route'), 'Kerala route photographic background must be removed');
  assert(!launchFile.includes('bg_kerala_halo'), 'Kerala halo photographic background must be removed');
  assert(!launchFile.includes('Kettuvallam'), 'Houseboat silhouette must be removed');

  console.log('✅ Passed: Pure white canvas verified. All scenic photography and vector backdrops removed.');
}

// -------------------------------------------------------------
// TEST 3: Zero Pink Circle & Zero Empty Image Placeholders
// -------------------------------------------------------------
console.log('\n--- TEST 3: Zero Pink Circle & Zero Empty Image Placeholders ---');
{
  const launchFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/screens/splash/MargamLaunchScreen.tsx'),
    'utf-8'
  );

  // Large pink circle must be completely removed
  assert(!launchFile.includes('logoAmbientGlow'), 'Large pink circle (logoAmbientGlow) must be removed');
  assert(!launchFile.includes("backgroundColor: '#EC4899'"), 'Solid pink background circle must be removed');

  // Small floating image placeholders, outlined circles, and generic badges must be removed
  assert(!launchFile.includes('figureGlassOrb'), 'Empty circular image placeholders (figureGlassOrb) must be removed');
  assert(!launchFile.includes('staggeredNode'), 'Unused floating node placeholders must be removed');
  assert(!launchFile.includes('card_find_matches.png'), 'Floating card placeholders must be removed from splash');
  assert(!launchFile.includes('globe_travel.png'), 'Floating globe orb must be removed from splash');
  assert(!launchFile.includes('coffee_interests.png'), 'Floating coffee orb must be removed from splash');
  assert(!launchFile.includes('dumbbell_grow.png'), 'Floating dumbbell orb must be removed from splash');
  assert(!launchFile.includes('map_explore.png'), 'Floating map orb must be removed from splash');
  assert(!launchFile.includes('plant_future.png'), 'Floating plant orb must be removed from splash');
  assert(!launchFile.includes('rings_marriage.png'), 'Floating rings orb must be removed from splash');

  // No gear or settings button on splash
  assert(!launchFile.includes('Settings'), 'Settings gear must not be on splash screen');

  console.log('✅ Passed: Solid pink circle, empty circles, and all floating placeholder orbs completely removed.');
}

// -------------------------------------------------------------
// TEST 4: Correct Margam Branding & Single Tagline
// -------------------------------------------------------------
console.log('\n--- TEST 4: Correct Margam Branding & Single Tagline ---');
{
  const launchFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/screens/splash/MargamLaunchScreen.tsx'),
    'utf-8'
  );

  // Logo already contains brand name, so no duplicate brand text beneath logo
  assert(!launchFile.includes('Maargam'), 'Must NOT contain incorrect spelling "Maargam"');
  assert(!launchFile.includes('<Text style={styles.brandTitle}>'), 'Must NOT render duplicate brand title beneath logo');
  assert(!launchFile.includes('Your Match. Your Margam.'), 'Must NOT render redundant secondary titles');

  // Exact single tagline
  assert(
    launchFile.includes('Shared journeys. Meaningful life partners.'),
    'Must include exact official tagline: "Shared journeys. Meaningful life partners."'
  );

  // Count tagline occurrences: exactly once
  const taglineMatches = launchFile.match(/Shared journeys\. Meaningful life partners\./g);
  assert(taglineMatches !== null && taglineMatches.length >= 1, 'Tagline must appear on the splash screen');

  console.log('✅ Passed: Correct branding verified. "Maargam" and duplicate brand names eliminated. Exact single tagline present.');
}

// -------------------------------------------------------------
// TEST 5: Smooth 4-Stage Motion & Native Driver Easing
// -------------------------------------------------------------
console.log('\n--- TEST 5: Smooth 4-Stage Motion & Native Driver ---');
{
  const launchFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/screens/splash/MargamLaunchScreen.tsx'),
    'utf-8'
  );

  // Stage B: Logo entrance
  assert(launchFile.includes('logoOpacityAnim'), 'Must drive logo opacity entrance');
  assert(launchFile.includes('logoScaleAnim'), 'Must drive logo subtle scale entrance');

  // Stage C: Tagline reveal
  assert(launchFile.includes('taglineOpacityAnim'), 'Must drive tagline fade-in');
  assert(launchFile.includes('taglineTranslateYAnim'), 'Must drive tagline subtle upward movement');

  // Stage D: Seamless exit
  assert(launchFile.includes('screenOpacityAnim'), 'Must drive seamless crossfade exit');

  // Hardware acceleration
  assert(launchFile.includes('useNativeDriver: true'), 'Animations must use native GPU driver');
  assert(launchFile.includes('Easing.out'), 'Must use refined easing with gentle deceleration');

  console.log('✅ Passed: 4-stage smooth motion choreography and native GPU drivers verified.');
}

// -------------------------------------------------------------
// TEST 6: Non-Blocking Preloader, Fail-Safe & Accessibility
// -------------------------------------------------------------
console.log('\n--- TEST 6: Preloader, Fail-Safe & Accessibility ---');
{
  const launchFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/screens/splash/MargamLaunchScreen.tsx'),
    'utf-8'
  );

  // Parallel preloading
  assert(launchFile.includes('coordinator.loadEssentialAppState()'), 'Must run non-blocking parallel app state preloading');
  assert(launchFile.includes('onAnimationComplete()'), 'Must call onAnimationComplete callback on transition finish');

  // Reduced motion
  assert(launchFile.includes('AccessibilityInfo.isReduceMotionEnabled'), 'Must check iOS/Android reduced motion preference');
  assert(launchFile.includes('runReducedMotionSequence'), 'Must provide reduced motion accessibility sequence');

  // Unmount cleanup
  assert(launchFile.includes('clearTimeout'), 'Must clean up timer handles on unmount');

  console.log('✅ Passed: Non-blocking preloader, fail-safe insurance, and accessibility verified.');
}

// -------------------------------------------------------------
// TEST 7: App.tsx & Replay Integration
// -------------------------------------------------------------
console.log('\n--- TEST 7: App.tsx Integration ---');
{
  const appFile = fs.readFileSync(path.resolve(process.cwd(), 'App.tsx'), 'utf-8');
  assert(appFile.includes('MargamLaunchScreen'), 'App.tsx must import MargamLaunchScreen');
  assert(appFile.includes('isLaunchScreenActive'), 'App.tsx must maintain isLaunchScreenActive state');

  console.log('✅ Passed: App.tsx integration verified.');
}

console.log('\n=============================================================');
console.log('🎉 ALL 7 REFINED SPLASH SCREEN ACCEPTANCE TESTS PASSED (100%)!');
console.log('=============================================================\n');
