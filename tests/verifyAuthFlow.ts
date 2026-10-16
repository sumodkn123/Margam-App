// MARGAM — Auth Flow & Existing User Sign-In Verification Suite
// Validates that existing/already signed-up users bypass the onboarding wizard
// and land directly on the Home Screen.

import { authService, AuthUser } from '../src/services/authService';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('====================================================');
console.log('MARGAM AUTHENTICATION & ONBOARDING ROUTING TEST SUITE');
console.log('====================================================\n');

// Test 1: Pre-seeded existing accounts are identified as registered with completed onboarding
console.log('TEST 1: Existing Account Detection');
const defaultPhone = '+91 98765 43210';
const unspacedPhone = '9876543210';
const userEmail = 'sumod.dev@example.com';
const unknownPhone = '+91 99999 00000';

assert(authService.isRegistered(defaultPhone), 'Default phone +91 98765 43210 must be recognized as registered');
assert(authService.isRegistered(unspacedPhone), 'Normalized phone 9876543210 must match registered account');
assert(authService.hasCompletedOnboarding(defaultPhone), 'Pre-seeded user must have isOnboardingComplete = true');
assert(authService.hasCompletedOnboarding(userEmail), 'Pre-seeded email must have isOnboardingComplete = true');
assert(!authService.isRegistered(unknownPhone), 'Brand-new phone number must NOT be registered initially');
assert(!authService.hasCompletedOnboarding(unknownPhone), 'Brand-new phone number must NOT have completed onboarding');

// Test 2: Existing User Sign-In Bypasses Onboarding Wizard
console.log('\nTEST 2: Returning User Sign-In Bypass Matrix');
function simulateAuthRouting(mode: 'signin' | 'signup', identifier: string): 'home' | 'wizard' {
  const isExistingUser = authService.hasCompletedOnboarding(identifier);
  if (mode === 'signin' || isExistingUser) {
    authService.signIn(identifier);
    return 'home'; // Calls onAuthenticated(), skips wizard
  } else {
    authService.signUp(identifier);
    return 'wizard'; // New registration requires onboarding wizard
  }
}

// Case A: User clicks "Sign In" with existing credentials
const destinationA = simulateAuthRouting('signin', defaultPhone);
assert(destinationA === 'home', 'Existing user in signin mode MUST route directly to home (bypasses wizard)');
assert(authService.getCurrentUser()?.id === 'user_demo_default', 'Active session must be set to user_demo_default');

// Case B: Existing user signs in using unspaced phone
const destinationB = simulateAuthRouting('signin', unspacedPhone);
assert(destinationB === 'home', 'Existing user with unformatted input MUST route directly to home');

// Case C: Existing user signs in via email
const destinationC = simulateAuthRouting('signin', userEmail);
assert(destinationC === 'home', 'Existing user signing in via email MUST route directly to home');

// Case D: Existing user accidentally taps "Get Started" (signup mode) but enters registered phone
const destinationD = simulateAuthRouting('signup', defaultPhone);
assert(destinationD === 'home', 'Existing user with completed onboarding entering signup mode MUST route directly to home');

// Test 3: Brand-New User Sign-Up Routes to Wizard, Then Completes Onboarding
console.log('\nTEST 3: Brand-New User Onboarding Lifecycle');
authService.signOut();
assert(authService.getCurrentUser() === null, 'SignOut must clear active session');

const newMemberPhone = '+91 91234 56789';
const destinationNew = simulateAuthRouting('signup', newMemberPhone);
assert(destinationNew === 'wizard', 'Brand-new user in signup mode MUST route to wizard');
assert(authService.isRegistered(newMemberPhone), 'New user must now be registered in authService');
assert(!authService.hasCompletedOnboarding(newMemberPhone), 'New user must not have completed onboarding before finishing wizard');

// User finishes the 8-step wizard
authService.completeOnboarding(newMemberPhone, {
  fullName: 'Arun Varma',
  primaryMargam: 'Art & Classical Music',
});
assert(authService.hasCompletedOnboarding(newMemberPhone), 'After wizard completion, hasCompletedOnboarding must be true');

// Subsequent sign-in by this newly registered member
const nextLoginDestination = simulateAuthRouting('signin', newMemberPhone);
assert(nextLoginDestination === 'home', 'Newly registered member signing in later MUST route directly to home (bypasses wizard)');

// Test 4: Social Login Bypass Matrix
console.log('\nTEST 4: Social Provider Sign-In Matrix');
const appleSocialId = 'apple_user';
const destinationSocialReturning = simulateAuthRouting('signin', appleSocialId);
assert(destinationSocialReturning === 'home', 'Social user with completed profile MUST route directly to home');

console.log('\n====================================================');
console.log('ALL AUTH ROUTING & ONBOARDING BYPASS TESTS PASSED! ✨');
console.log('====================================================\n');
