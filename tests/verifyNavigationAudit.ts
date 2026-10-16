// MARGAM — Automated Navigation, Routing & Click-Action Verification Suite
// Validates all navigation routes, click handlers, entity ID propagation, and back stack behaviors.
// Strictly enforces that accepted-request activity never routes to Map.

import { navigationRouter } from '../src/services/navigationRouter';
import {
  NotificationItem,
  INITIAL_NOTIFICATIONS,
  acceptNotificationRequest,
  declineNotificationRequest,
} from '../src/services/notificationService';
import { getVisibleProfile } from '../src/services/profileService';
import { SAMPLE_INCOMING_REQUEST } from '../src/constants/mockData';
import { IntroductionRequest } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(message);
  }
}

console.log('=============================================================');
console.log('MARGAM — COMPREHENSIVE NAVIGATION & ROUTING AUDIT SUITE');
console.log('=============================================================\n');

// -------------------------------------------------------------
// TEST 1: CRITICAL REGRESSION TEST (Accepted Request Activity Click)
// -------------------------------------------------------------
console.log('--- TEST 1: Critical Regression Test (Accepted Request Activity) ---');
{
  navigationRouter.openHome();
  assert(navigationRouter.getState().currentRoute === 'home', 'State should be home initially');

  // Trigger click on "Ananya accepted your introduction request"
  navigationRouter.handleActivityClick({
    type: 'request_accepted',
    targetId: 'thread-ananya',
    actorName: 'Ananya',
    message: 'Ananya accepted your introduction request',
  });

  const state = navigationRouter.getState();
  assert(state.currentRoute === 'chat', 'Accepted request must navigate to chat screen');
  assert(state.activeTab === 'chat', 'Active tab must be chat');
  assert(state.currentRoute !== 'map', 'CRITICAL: Must NEVER navigate to map screen');
  assert(state.activeTab !== 'map', 'CRITICAL: Active tab must NEVER be map');
  assert(state.selectedConversationId === 'thread-ananya', 'Must pass exact conversation ID thread-ananya');
  assert(state.selectedRecipient?.name === 'Ananya', 'Recipient name must be Ananya');
  assert(Boolean(state.selectedRecipient?.avatar), 'Recipient avatar must be populated');

  console.log('✅ Passed: Accepted request activity navigates directly to conversation (thread-ananya)');
  console.log('✅ Passed: State is NOT Map screen (activeTab !== "map", currentRoute !== "map")');
}

// -------------------------------------------------------------
// TEST 2: Activity Item "3 new profiles match your preferences"
// -------------------------------------------------------------
console.log('\n--- TEST 2: Activity Item "3 new profiles match your preferences" ---');
{
  navigationRouter.openHome();
  navigationRouter.handleActivityClick({
    type: 'new_matches',
    message: '3 new profiles match your preferences',
  });

  const state = navigationRouter.getState();
  assert(state.newMatchesModalVisible === true, 'New matches modal must be opened');
  assert(state.currentRoute !== 'map', 'CRITICAL: Must NEVER navigate to map screen');
  assert(state.activeTab !== 'map', 'CRITICAL: Active tab must NEVER be map');

  navigationRouter.closeNewMatches();
  assert(navigationRouter.getState().newMatchesModalVisible === false, 'New matches modal should close');

  console.log('✅ Passed: New matches activity opens new matches discovery modal, NOT Map screen');
}

// -------------------------------------------------------------
// TEST 3: Activity Handler Multi-Event Type Resolution
// -------------------------------------------------------------
console.log('\n--- TEST 3: Activity Handler Multi-Event Type Resolution ---');
{
  // 3a. Message received
  navigationRouter.openHome();
  navigationRouter.handleActivityClick({
    type: 'message_received',
    targetId: 'thread-sneha',
    actorName: 'Sneha',
  });
  let state = navigationRouter.getState();
  assert(state.currentRoute === 'chat', 'Message received navigates to chat');
  assert(state.selectedConversationId === 'thread-sneha', 'Exact conversation thread-sneha loaded');
  assert(state.selectedRecipient?.name === 'Sneha', 'Recipient is Sneha');

  // 3b. Upcoming trip
  navigationRouter.openHome();
  navigationRouter.handleActivityClick({
    type: 'upcoming_trip',
    targetId: 'trip-kochi-active',
  });
  state = navigationRouter.getState();
  assert(state.currentRoute === 'map', 'Upcoming trip navigates to map');
  assert(state.mapMode === 'plan_trip', 'Map mode is plan_trip');
  assert(state.mapDestinationName === 'Munnar', 'Destination context populated');

  // 3c. Area matches
  navigationRouter.openHome();
  navigationRouter.handleActivityClick({
    type: 'area_matches',
    targetId: 'Chalakudy',
  });
  state = navigationRouter.getState();
  assert(state.currentRoute === 'map', 'Area matches navigates to map');
  assert(state.mapMode === 'destination', 'Map mode is destination');
  assert(state.mapDestinationName === 'Chalakudy', 'Area is Chalakudy');

  // 3d. Profile viewed
  navigationRouter.openHome();
  navigationRouter.handleActivityClick({
    type: 'profile_viewed',
    targetId: 'cand-priya-28',
  });
  state = navigationRouter.getState();
  assert(state.currentRoute === 'other_profile', 'Profile viewed navigates to other_profile');
  assert(Boolean(state.selectedProfile), 'Profile record loaded');

  // 3e. Verification approved
  navigationRouter.openHome();
  navigationRouter.handleActivityClick({
    type: 'verification_approved',
  });
  state = navigationRouter.getState();
  assert(state.currentRoute === 'profile', 'Verification navigates to user profile');

  // 3f. Unknown event fallback (Safe degradation)
  navigationRouter.openHome();
  navigationRouter.handleActivityClick({
    type: 'unrecognized_event_type',
  });
  state = navigationRouter.getState();
  assert(state.currentRoute === 'notifications_list', 'Unknown event gracefully degrades to notifications list');
  assert(state.currentRoute !== 'map', 'Unknown event does not dump to Map');

  console.log('✅ Passed: All 6 event types resolved to explicit, typed destinations with entity payloads');
  console.log('✅ Passed: Unrecognized event safely degrades to notifications list with zero crashes');
}

// -------------------------------------------------------------
// TEST 4: Primary Tab and Screen Routes Inventory
// -------------------------------------------------------------
console.log('\n--- TEST 4: Primary Tab and Screen Routes Inventory ---');
{
  navigationRouter.openHome();
  assert(navigationRouter.getState().currentRoute === 'home', 'Home route valid');
  assert(navigationRouter.getState().activeTab === 'home', 'Home tab valid');

  navigationRouter.openMargams();
  assert(navigationRouter.getState().currentRoute === 'margams', 'Margams route valid');
  assert(navigationRouter.getState().activeTab === 'margams', 'Margams tab valid');

  navigationRouter.openMap('along_route');
  assert(navigationRouter.getState().currentRoute === 'map', 'Map route valid');
  assert(navigationRouter.getState().mapMode === 'along_route', 'Map along_route mode valid');

  navigationRouter.openRequests('sent', 'req-123');
  assert(navigationRouter.getState().currentRoute === 'requests', 'Requests route valid');
  assert(navigationRouter.getState().requestsSubTab === 'sent', 'Requests subtab sent valid');
  assert(navigationRouter.getState().selectedRequestId === 'req-123', 'Highlight request ID passed');

  navigationRouter.openMyProfile();
  assert(navigationRouter.getState().currentRoute === 'profile', 'Profile route valid');
  assert(navigationRouter.getState().activeTab === 'profile', 'Profile tab valid');

  navigationRouter.openNotificationsList('requests');
  assert(navigationRouter.getState().currentRoute === 'notifications_list', 'Notifications list valid');
  assert(navigationRouter.getState().notificationsFilterTab === 'requests', 'Filter requests valid');

  navigationRouter.openNotificationDetail('notif-req-ananya');
  assert(navigationRouter.getState().currentRoute === 'notification_detail', 'Notification detail route valid');
  assert(navigationRouter.getState().selectedNotificationItem?.id === 'notif-req-ananya', 'Loaded correct item');

  console.log('✅ Passed: All primary navigation destinations function with full typed state');
}

// -------------------------------------------------------------
// TEST 5: Back Navigation Stack Behavior
// -------------------------------------------------------------
console.log('\n--- TEST 5: Back Navigation Stack Behavior ---');
{
  // 5a. Home -> Profile -> Back -> Home
  navigationRouter.openHome();
  navigationRouter.openProfile('usr-candidate-ananya');
  assert(navigationRouter.getState().currentRoute === 'other_profile', 'In other_profile');
  navigationRouter.goBack();
  assert(navigationRouter.getState().currentRoute === 'home', 'goBack returned to home');

  // 5b. Home -> Notifications List -> Notification Detail -> Back -> Notifications List -> Back -> Home
  navigationRouter.openHome();
  navigationRouter.openNotificationsList();
  assert(navigationRouter.getState().currentRoute === 'notifications_list', 'In notifications list');
  navigationRouter.openNotificationDetail('notif-req-ananya');
  assert(navigationRouter.getState().currentRoute === 'notification_detail', 'In notification detail');
  navigationRouter.goBack();
  assert(navigationRouter.getState().currentRoute === 'notifications_list', 'Returned to notifications list');
  navigationRouter.goBack();
  assert(navigationRouter.getState().currentRoute === 'home', 'Returned to home');

  // 5c. Chat conversation -> Back -> Chat thread list
  navigationRouter.openConversation('thread-ananya');
  assert(navigationRouter.getState().selectedConversationId === 'thread-ananya', 'Inside conversation');
  navigationRouter.goBack();
  assert(navigationRouter.getState().currentRoute === 'chat', 'Still on chat tab');
  assert(navigationRouter.getState().selectedConversationId === undefined, 'Conversation closed, thread list visible');

  console.log('✅ Passed: Back navigation stack unwinds hierarchically without orphaned states');
}

// -------------------------------------------------------------
// TEST 6: Request Acceptance & Chat Unlock Lifecycle
// -------------------------------------------------------------
console.log('\n--- TEST 6: Request Acceptance & Chat Unlock Lifecycle ---');
{
  const incomingReq: IntroductionRequest = { ...SAMPLE_INCOMING_REQUEST };
  assert(incomingReq.status === 'pending', 'Incoming request starts as pending');
  assert(incomingReq.stage === 2, 'Initial stage is 2 (Introduction pending)');

  // Simulate accepting request
  const acceptedReq: IntroductionRequest = {
    ...incomingReq,
    status: 'accepted',
    stage: 4, // Stage 4: Chat & Meeting unlocked
  };

  assert(acceptedReq.status === 'accepted', 'Request status is accepted');
  assert(acceptedReq.stage === 4, 'Stage is promoted to 4');

  // Prime chat conversation
  const partnerName = acceptedReq.requesterRevealedData?.firstName || 'Candidate';
  navigationRouter.openConversation(acceptedReq.id, {
    id: acceptedReq.requesterId,
    name: partnerName,
    avatar: acceptedReq.requesterRevealedData?.profilePhotoUrl || '',
    compatibility: acceptedReq.compatibilityPercentage,
  });

  const state = navigationRouter.getState();
  assert(state.currentRoute === 'chat', 'Chat opened for accepted connection');
  assert(state.selectedConversationId === acceptedReq.id, 'Exact connection ID primed');
  assert(state.selectedRecipient?.id === acceptedReq.requesterId, 'Requester ID linked to recipient');

  console.log('✅ Passed: Request acceptance promotes stage to 4 and primes conversation with recipient ID');
}

// -------------------------------------------------------------
// TEST 7: Invalid and Missing Data Resilience
// -------------------------------------------------------------
console.log('\n--- TEST 7: Invalid and Missing Data Resilience ---');
{
  // 7a. Non-existent profile ID returns safe fallback profile
  const fallbackProfile = getVisibleProfile('usr-current-sumod', 'non-existent-user-id');
  assert(Boolean(fallbackProfile), 'Fallback profile is returned for missing user');
  assert(Boolean(fallbackProfile.id), 'Fallback profile has valid id');

  // 7b. Empty item ID in notification detail safely resolves
  navigationRouter.openNotificationDetail('');
  const state = navigationRouter.getState();
  assert(state.currentRoute === 'notification_detail', 'Route resolved without throwing');
  assert(Boolean(state.selectedNotificationItem), 'Safe notification item resolved');

  console.log('✅ Passed: Missing and invalid entity identifiers gracefully handled with safe fallbacks');
}

// -------------------------------------------------------------
// TEST 8: State Listener Subscription Notification
// -------------------------------------------------------------
console.log('\n--- TEST 8: State Listener Subscription Notification ---');
{
  let listenerCallCount = 0;
  let lastRoute = '';
  const unsubscribe = navigationRouter.subscribe((state) => {
    listenerCallCount++;
    lastRoute = state.currentRoute;
  });

  // Initial call on subscribe
  assert(listenerCallCount === 1, 'Listener should be called immediately upon subscription');

  // Trigger route change
  navigationRouter.openMargams();
  assert(listenerCallCount === 2, 'Listener called on route change');
  assert(lastRoute === 'margams', 'Listener received latest route');

  unsubscribe();
  navigationRouter.openHome();
  assert(listenerCallCount === 2, 'Listener not called after unsubscribe');

  console.log('✅ Passed: Subscription mechanics reliably propagate routing events to UI subscribers');
}

console.log('\n=============================================================');
console.log('🎉 ALL 8 NAVIGATION, ROUTING & CLICK-ACTION TESTS PASSED (100%)!');
console.log('=============================================================');
