// MARGAM — Route Polyline Glow & Transitions Verification Suite
// Validates the 4-Tier Polyline Glow Architecture:
// 1. Tier 1: Outer Translucent Corridor Buffer (detour threshold scaling 26px - 48px)
// 2. Tier 2: Intermediate Luminous Chromatic Bloom (11px, high-luminance sky glow)
// 3. Tier 3: Razor Core Highway Route Polyline (4.5px crisp road track)
// 4. Tier 4: Directional Flow Dash / Wave Overlay
// 5. Web Platform SVG Route Glow Cartography parity
// 6. MapDiscoveryScreen dynamic corridor threshold synchronization

import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${message}`);
}

console.log('=============================================================');
console.log('MARGAM — ROUTE POLYLINE GLOW & TRANSITIONS VERIFICATION SUITE');
console.log('=============================================================\n');

// -------------------------------------------------------------
// TEST 1: Source Files & Interface Definitions
// -------------------------------------------------------------
console.log('--- TEST 1: ProductionMapView Props & Imports ---');
{
  const mapFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/map/ProductionMapView.tsx'),
    'utf-8'
  );

  assert(mapFile.includes('routeDetourMinutes?: number'), 'ProductionMapViewProps must include routeDetourMinutes');
  assert(mapFile.includes('activeRoute?: CalculatedRoute | null'), 'ProductionMapViewProps must accept activeRoute');
  assert(mapFile.includes('react-native-svg'), 'ProductionMapView must import react-native-svg for web cartography');
  assert(mapFile.includes('glowPulseAnim'), 'Must include animated breathing pulse driver for living route glow');
  assert(mapFile.includes('routeFadeAnim'), 'Must include route mount fade transition driver');
}

// -------------------------------------------------------------
// TEST 2: Native 4-Tier Polyline Glow Architecture
// -------------------------------------------------------------
console.log('\n--- TEST 2: Native 4-Tier Polyline Glow Architecture ---');
{
  const mapFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/map/ProductionMapView.tsx'),
    'utf-8'
  );

  // Tier 1: Corridor Buffer
  assert(
    mapFile.includes('corridor-glow') && mapFile.includes('rgba(14, 165, 233, 0.18)'),
    'Tier 1 must render outer corridor buffer polyline with translucent sky glow'
  );
  assert(
    mapFile.includes('routeDetourMinutes === 20 ? 48 : routeDetourMinutes === 10 ? 36 : 26'),
    'Corridor strokeWidth must dynamically scale: 5m -> 26px, 10m -> 36px, 20m -> 48px'
  );

  // Tier 2: Luminous Chromatic Bloom
  assert(
    mapFile.includes('luminous-bloom') && mapFile.includes('rgba(56, 189, 248, 0.45)') && mapFile.includes('strokeWidth={11}'),
    'Tier 2 must render intermediate luminous chromatic bloom (11px, high-luminance sky glow)'
  );

  // Tier 3: Razor Core Polyline
  assert(
    mapFile.includes('core-polyline') && mapFile.includes('#0284C7') && mapFile.includes('strokeWidth={4.5}'),
    'Tier 3 must render razor core highway polyline (4.5px, #0284C7)'
  );

  // Tier 4: Flow Dash
  assert(
    mapFile.includes('flow-dash-polyline') && mapFile.includes('lineDashPattern={[10, 20]}'),
    'Tier 4 must render directional flow dash overlay'
  );
}

// -------------------------------------------------------------
// TEST 3: Web Platform SVG Cartography Parity
// -------------------------------------------------------------
console.log('\n--- TEST 3: Web Platform SVG Route Glow Parity ---');
{
  const mapFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/components/map/ProductionMapView.tsx'),
    'utf-8'
  );

  assert(mapFile.includes('webRoutePath'), 'Web platform must compute webRoutePath SVG path data');
  assert(mapFile.includes('webRouteGrad'), 'Web platform must render webRouteGrad linear gradient');
  assert(mapFile.includes('webOriginPulse'), 'Web platform must render origin radar pulse');
  assert(mapFile.includes('webDestPulse'), 'Web platform must render destination radar pulse');
  assert(mapFile.includes('strokeDasharray="10 20"'), 'Web platform must render directional flow dash on SVG');
}

// -------------------------------------------------------------
// TEST 4: MapDiscoveryScreen Integration & Threshold Sync
// -------------------------------------------------------------
console.log('\n--- TEST 4: MapDiscoveryScreen Threshold Synchronization ---');
{
  const screenFile = fs.readFileSync(
    path.resolve(process.cwd(), 'src/screens/MapDiscoveryScreen.tsx'),
    'utf-8'
  );

  assert(
    screenFile.includes('routeDetourMinutes={routeDetourThreshold}'),
    'MapDiscoveryScreen must pass routeDetourThreshold into ProductionMapView'
  );
  assert(
    screenFile.includes('routeDetourThreshold === mins'),
    'MapDiscoveryScreen must maintain active detour threshold state'
  );
}

console.log('\n=============================================================');
console.log('🎉 ALL 4 ROUTE POLYLINE GLOW ACCEPTANCE TESTS PASSED (100%)!');
console.log('=============================================================\n');
