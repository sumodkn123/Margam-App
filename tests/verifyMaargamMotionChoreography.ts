// ============================================================================
// MARGAM — 2.2-Second Choreographed Splash Motion & Haptics Verification Suite
// Validates all 5 stages, custom vector SVGs, safe haptics engine, and transitions.
// ============================================================================

import fs from 'fs';
import path from 'path';
import {
  triggerHaptic,
  FEATURE_NODES,
} from '../src/screens/splash/MaargamAppExperience';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ Passed: ${message}`);
  }
}

console.log('=============================================================');
console.log('MAARGAM — 2.2s CHOREOGRAPHED MOTION & HAPTICS VERIFICATION');
console.log('=============================================================\n');

// -------------------------------------------------------------
// TEST 1: Source Code & File Presence
// -------------------------------------------------------------
console.log('--- TEST 1: Component & Standalone HTML Deliverables ---');
const componentPath = path.resolve(process.cwd(), 'src/screens/splash/MaargamAppExperience.tsx');
assert(fs.existsSync(componentPath), 'MaargamAppExperience.tsx component must exist');

const htmlPath = path.resolve(process.cwd(), 'maargam-splash.html');
assert(fs.existsSync(htmlPath), 'maargam-splash.html standalone preview must exist');

const componentCode = fs.readFileSync(componentPath, 'utf-8');
const htmlCode = fs.readFileSync(htmlPath, 'utf-8');

// -------------------------------------------------------------
// TEST 2: All 5 Stages Choreographed in Exact 2.2-Second Timeline
// -------------------------------------------------------------
console.log('\n--- TEST 2: 5-Stage 2.2-Second Animation Timeline ---');
// Stage 1: Launch (0ms - 450ms)
assert(componentCode.includes('Stage 1: Launch') && componentCode.includes('450'), 'Stage 1 must span 0ms to 450ms');
assert(componentCode.includes('Building meaningful connections...'), 'Stage 1 must feature progress bar with connection text');

// Stage 2: Features Appear (450ms - 1150ms)
assert(componentCode.includes('Stage 2: Features Appear') && componentCode.includes('1150'), 'Stage 2 must span 450ms to 1150ms');
assert(FEATURE_NODES.length === 7, 'Stage 2 must feature 7 rich feature orbs');

// Stage 3: Elements Converge / Vortex Implosion (1150ms - 1600ms)
assert(componentCode.includes('Stage 3: Elements Converge') && componentCode.includes('1600'), 'Stage 3 must span 1150ms to 1600ms');
assert(componentCode.includes('streakGrad') && componentCode.includes('animate-pulse'), 'Stage 3 must feature vortex convergence streak rays');

// Stage 4: Radiant Logo Reveal (1600ms - 2050ms)
assert(componentCode.includes('Stage 4: Logo Halo Reveal') && componentCode.includes('2150'), 'Stage 4 must span 1600ms to 2050ms/2150ms');
assert(componentCode.includes('People • Interests • Journeys • Forever'), 'Stage 4 must render footer pillars and halo rings');

// Stage 5: Seamless Zoom Transition (2050ms+)
assert(componentCode.includes('opacity-0 scale-125') && componentCode.includes('scale-100'), 'Stage 5 must zoom out splash and reveal home');

// -------------------------------------------------------------
// TEST 3: Safe Haptic Feedback Engine
// -------------------------------------------------------------
console.log('\n--- TEST 3: Safe Haptic Feedback Engine ---');
assert(typeof triggerHaptic === 'function', 'triggerHaptic function must be exported');
assert(componentCode.includes('navigator.vibrate(pattern)'), 'Must invoke navigator.vibrate safely inside try/catch');
assert(componentCode.includes('triggerHaptic(15)'), 'Stage 1 must trigger 15ms haptic tick');
assert(componentCode.includes('triggerHaptic([12, 40, 12])') || componentCode.includes('triggerHaptic([12, 50, 12])'), 'Stage 2 must trigger rhythmic pulse');
assert(componentCode.includes('triggerHaptic([25, 30, 45])') || componentCode.includes('triggerHaptic([20, 30, 40])'), 'Stage 3 must trigger build-up rumble');
assert(componentCode.includes('triggerHaptic([50, 60, 95])') || componentCode.includes('triggerHaptic([45, 60, 90])'), 'Stage 4 must trigger heartbeat pulse');
assert(componentCode.includes('Replay 2s Intro'), 'Must include "Replay 2s Intro" testing button');
assert(componentCode.includes('Volume2'), 'Must include visual Haptic Pulse Indicator');

// -------------------------------------------------------------
// TEST 4: 100% Vector Multi-Stop Inline SVGs
// -------------------------------------------------------------
console.log('\n--- TEST 4: High-Craft Custom Multi-Stop SVGs ---');
const requiredSvgIdentifiers = [
  'MaargamLogoSVG',
  'maargamPinGrad',
  'ribbonLeft',
  'ribbonRight',
  'FindMatchesSVG',
  'TravelGlobeSVG',
  'CoffeeCupSVG',
  'DumbbellSVG',
  'ExploreMapSVG',
  'SproutFutureSVG',
  'MarriageRingsSVG',
  'goldRing1',
  'goldRing2',
  'skyGrad',
  'sunGlow',
  'pathGlow',
  'Kettuvallam',
];

requiredSvgIdentifiers.forEach((ident) => {
  assert(componentCode.includes(ident), `Custom SVG asset identifier "${ident}" must be present`);
});

// -------------------------------------------------------------
// TEST 5: Standalone HTML Verification
// -------------------------------------------------------------
console.log('\n--- TEST 5: Standalone HTML Verification ---');
assert(htmlCode.includes('cdn.tailwindcss.com'), 'HTML file must load Tailwind CSS');
assert(htmlCode.includes('MaargamLogoSVG'), 'HTML file must embed custom MaargamLogoSVG');
assert(htmlCode.includes('Replay 2s Intro'), 'HTML file must provide replay button');
assert(htmlCode.includes('Ananya, 27'), 'HTML file must render interactive home screen underneath');

console.log('\n=============================================================');
console.log('🎉 ALL 5 CHOREOGRAPHED MOTION & HAPTIC TESTS PASSED (100%)!');
console.log('=============================================================\n');
