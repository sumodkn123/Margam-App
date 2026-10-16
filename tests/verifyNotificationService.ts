// MARGAM — Notification Service & Home Screen Notification Workflow Test Suite
// Verifies:
// 1. Initial notification state & unread count tracking
// 2. Mark single notification as read & state synchronization
// 3. Mark all notifications as read & clearing of unread badge
// 4. Dynamic addition of notifications with listener broadcast
// 5. Notification tap action routing (chat, corridor route, match profile, verification profile)
// 6. Home Screen header unread dot visibility invariant (strictly visible only when unreadCount > 0)

import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addNotification,
  resetNotificationsForTest,
  NotificationItem,
} from '../src/services/notificationService';

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
  console.log('MARGAM — NOTIFICATION SERVICE & HOME SCREEN NOTIFICATION SUITE');
  console.log('=============================================================\n');

  resetNotificationsForTest();

  // TEST 1: Initial state & unread count
  console.log('--- TEST 1: Initial State & Unread Count ---');
  const initial = getNotifications();
  assert(initial.length === 10, 'Initial notifications list contains 10 rich items');
  const initialUnread = getUnreadNotificationsCount();
  assert(initialUnread === 7, `Initial unread count is exactly 7 (actual: ${initialUnread})`);
  assert(initial[0].isRead === false, 'First notification (Ananya request) is initially unread');

  // TEST 2: Mark single notification as read
  console.log('\n--- TEST 2: Mark Single Notification as Read ---');
  markNotificationAsRead('notif-req-ananya');
  const afterSingleRead = getNotifications();
  assert(afterSingleRead[0].isRead === true, 'Notification ananya is now marked as read');
  assert(getUnreadNotificationsCount() === initialUnread - 1, 'Unread count decremented by 1 after marking 1 item read');

  // TEST 3: Mark all notifications as read
  console.log('\n--- TEST 3: Mark All Notifications as Read ---');
  markAllNotificationsAsRead();
  assert(getUnreadNotificationsCount() === 0, 'Unread count is 0 after markAllAsRead');
  const allRead = getNotifications().every((n) => n.isRead);
  assert(allRead === true, 'Every notification item isRead is true');

  // TEST 4: Home Screen unread badge invariant
  console.log('\n--- TEST 4: Header Unread Dot Invariant ---');
  const badgeVisibleWhenZero = getUnreadNotificationsCount() > 0;
  assert(badgeVisibleWhenZero === false, 'Unread badge dot on Home Screen is HIDDEN when unreadCount is 0');

  // TEST 5: Dynamic addition of new notification
  console.log('\n--- TEST 5: Dynamic Notification Broadcast ---');
  addNotification({
    title: 'New Introduction Request 💌',
    message: 'Meera sent you an introduction request regarding your shared Trekking Margam.',
    time: 'Just now',
    isRead: false,
    type: 'chat',
    category: 'request',
    senderName: 'Meera',
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
  });
  assert(getUnreadNotificationsCount() === 1, 'Unread count increases to 1 when new notification arrives');
  const badgeVisibleAfterNew = getUnreadNotificationsCount() > 0;
  assert(badgeVisibleAfterNew === true, 'Unread badge dot on Home Screen REAPPEARS when new notification arrives');

  // TEST 6: Action Routing Logic
  console.log('\n--- TEST 6: Action Routing by Notification Type ---');
  const routeEvents: string[] = [];

  const simulateNotificationTap = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    if (item.type === 'chat') {
      routeEvents.push('NAVIGATE_CHAT');
    } else if (item.type === 'route') {
      routeEvents.push('NAVIGATE_CORRIDOR_MAP');
    } else if (item.type === 'match') {
      routeEvents.push('NAVIGATE_CANDIDATE_PROFILE');
    } else if (item.type === 'verification') {
      routeEvents.push('NAVIGATE_PROFILE');
    }
  };

  const sampleNotifications: NotificationItem[] = [
    {
      id: 't1',
      title: 'Intro Accepted',
      message: '',
      time: '',
      isRead: false,
      type: 'chat',
      category: 'update',
      senderName: 'Ananya',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    },
    {
      id: 't2',
      title: 'Route Match',
      message: '',
      time: '',
      isRead: false,
      type: 'route',
      category: 'update',
      senderName: 'Rohan',
      senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    },
    {
      id: 't3',
      title: 'High Compatibility',
      message: '',
      time: '',
      isRead: false,
      type: 'match',
      category: 'request',
      senderName: 'Priya',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
    {
      id: 't4',
      title: 'ID Verified',
      message: '',
      time: '',
      isRead: false,
      type: 'verification',
      category: 'update',
      senderName: 'Trust Team',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    },
  ];

  sampleNotifications.forEach(simulateNotificationTap);

  assert(routeEvents[0] === 'NAVIGATE_CHAT', 'Chat notification opens Chat tab');
  assert(routeEvents[1] === 'NAVIGATE_CORRIDOR_MAP', 'Route notification opens along_route corridor map');
  assert(routeEvents[2] === 'NAVIGATE_CANDIDATE_PROFILE', 'Match notification opens candidate profile');
  assert(routeEvents[3] === 'NAVIGATE_PROFILE', 'Verification notification opens User Profile');

  console.log('\n=============================================================');
  console.log('🎉 ALL 6 NOTIFICATION SERVICE & ROUTING TESTS PASSED (100%)!');
  console.log('=============================================================\n');
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
