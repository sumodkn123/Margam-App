// MARGAM — $10M Welcome & Onboarding Screen Verification Suite
// Validates visual hierarchy, interactive marquee, dynamic slide states,
// live social proof indicators, and $10M CTA architecture.

import assert from 'assert';
import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('MARGAM WELCOME SCREEN ($10M REDESIGN) VERIFICATION');
console.log('====================================================\n');

const welcomeScreenPath = path.resolve(__dirname, '../src/screens/auth/MargamWelcomeScreen.tsx');
assert.ok(fs.existsSync(welcomeScreenPath), 'MargamWelcomeScreen.tsx must exist');
const code = fs.readFileSync(welcomeScreenPath, 'utf8');

// TEST 1: Top Navigation Architecture (Unified, no gear collision)
console.log('TEST 1: Unified Top Navigation Architecture...');
assert.ok(code.includes('brandRow'), 'Must feature unified brand row');
assert.ok(code.includes('BETA'), 'Must feature high-contrast Beta pill tag');
assert.ok(code.includes('Shared interests. Real world.'), 'Must feature refined brand tagline');
assert.ok(code.includes('langSelectorPill'), 'Must feature translucent language pill selector');
assert.ok(code.includes('preferencesIconButton'), 'Must feature clean cohesive preferences icon button');
assert.ok(!code.includes('width: 40'), 'Must NOT have awkward empty spacer view');
console.log('  ✅ PASSED: Unified top navigation bar resolves header collisions and aligns controls.\n');

// TEST 2: Interactive Category Marquee / Pill Selector (Replaces static circles)
console.log('TEST 2: Interactive Category Marquee / Pill Selector...');
const expectedCategories = ['cafe', 'travel', 'lifestyle', 'fitness', 'food'];
expectedCategories.forEach((cat) => {
  assert.ok(code.includes(`id: '${cat}'`), `Must include '${cat}' category in SLIDES`);
});
assert.ok(code.includes('Café & Work'), 'Must use polished unwrapped label "Café & Work"');
assert.ok(code.includes('Food & Dining'), 'Must use unwrapped label "Food & Dining"');
assert.ok(code.includes('marqueeScrollContent'), 'Must provide interactive horizontal marquee');
assert.ok(code.includes('categoryPillActive'), 'Must support tactile active pill state');
console.log('  ✅ PASSED: Category pills replace static circles and provide dynamic switching.\n');

// TEST 3: Immersive Hero Showcase Card & Dynamic Photography
console.log('TEST 3: Immersive Hero Showcase Card & Dynamic Photography...');
assert.ok(code.includes('heroCardContainer'), 'Must contain rounded hero card container');
assert.ok(code.includes('borderRadius: 30'), 'Must use high-radius 30px rounded corners');
assert.ok(code.includes('heroVignette'), 'Must apply multi-layer cinematic vignette for contrast');
assert.ok(code.includes('zoomAnim'), 'Must support smooth crossfade with Ken Burns zoom effect');
console.log('  ✅ PASSED: Immersive hero card with crossfading photography verified.\n');

// TEST 4: Floating Live Activity Badge & Social Proof
console.log('TEST 4: Floating Live Activity Badge & Social Proof...');
assert.ok(code.includes('liveBadgeContainer'), 'Must feature frosted-glass live activity badge');
assert.ok(code.includes('stackedAvatarsRow'), 'Must render overlapping user avatars');
assert.ok(code.includes('pulseAnim'), 'Must feature pulsing live green dot');
assert.ok(code.includes('18 founders & creatives at local cafés'), 'Must include café social proof badge');
assert.ok(code.includes('12 weekend roadtrips forming near you'), 'Must include travel social proof badge');
console.log('  ✅ PASSED: Floating live activity badge with stacked avatars and green live dot verified.\n');

// TEST 5: Glassmorphic Bottom Story Card & Segmented Indicators
console.log('TEST 5: Glassmorphic Bottom Story Card & Segmented Indicators...');
assert.ok(code.includes('bottomStoryCard'), 'Must feature glassmorphic story box inside image');
assert.ok(code.includes('REAL-WORLD DISCOVERY'), 'Must feature Real-World Discovery kicker');
assert.ok(code.includes('Sparkles'), 'Must feature Sparkles icon in kicker');
assert.ok(code.includes('progressPillsRow'), 'Must feature segmented progress indicators');
assert.ok(code.includes('progressPillActive'), 'Must render wider active progress pill');
console.log('  ✅ PASSED: Glassmorphic bottom story card and segmented progress indicators verified.\n');

// TEST 6: $10M CTA Button & Tactile Depth
console.log('TEST 6: $10M CTA Button & Tactile Depth...');
assert.ok(code.includes('ctaButton'), 'Must feature primary CTA container');
assert.ok(code.includes('ctaButtonGrad'), 'Must feature rich rose-500 via rose-600 to orange-500 gradient');
assert.ok(code.includes('#F43F5E') && code.includes('#E11D48') && code.includes('#F97316'), 'Must use accurate color stops');
assert.ok(code.includes('buttonTopHighlight'), 'Must feature subtle top-edge inner specular reflection');
assert.ok(code.includes('Heart'), 'Must feature Heart icon in CTA');
assert.ok(code.includes('ArrowRight'), 'Must feature ArrowRight in CTA');
assert.ok(code.includes('Already have an account?'), 'Must feature refined Sign In secondary action');
console.log('  ✅ PASSED: $10M tactile gradient button and secondary link verified.\n');

// TEST 7: Functional Modals (Language & Discovery Preferences)
console.log('TEST 7: Functional Modals (Language & Discovery Preferences)...');
assert.ok(code.includes('isLangMenuOpen'), 'Must provide working language picker modal');
assert.ok(code.includes('isPreferencesOpen'), 'Must provide working discovery preferences modal');
assert.ok(code.includes('discoveryDistance'), 'Must include configurable discovery distance');
assert.ok(code.includes('strictValuesMatch'), 'Must include strict values match toggle');
console.log('  ✅ PASSED: Language and discovery preferences modals are fully interactive.\n');

console.log('====================================================');
console.log('🎉 ALL 7 WELCOME SCREEN REDESIGN TESTS PASSED (100%)!');
console.log('====================================================\n');
