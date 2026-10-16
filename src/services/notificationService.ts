// MARGAM — Notification Service & Observer Store
// Centralized notification state across Home Screen, Full-Page Notification Screen, and App Navigation.
// Fully synchronized, zero external dependencies, 100% type-safe.

import { useEffect, useState } from 'react';

export type NotificationCategory = 'request' | 'update' | 'message' | 'view';
export type NotificationRequestStatus = 'pending' | 'accepted' | 'declined';

export interface NotificationItem {
  id: string;
  category?: NotificationCategory;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'match' | 'verification' | 'route' | 'chat';
  targetId?: string;

  // Rich Person / Candidate Details (Matching Full-Page Design)
  senderName?: string;
  senderAge?: number;
  senderAvatar?: string;
  senderVerified?: boolean;
  requestStatus?: NotificationRequestStatus;
  statusBadgeIcon?: 'heart' | 'check' | 'clock' | 'cross' | 'eye' | 'chat';

  // Detail Sheet Specifics
  personalMessage?: string;
  compatibilityPercentage?: number;
  commonMargamsCount?: number;
  similarValuesCount?: number;
  sharedMargams?: {
    name: string;
    emoji: string;
    bgColor?: string;
    textColor?: string;
  }[];
  candidateDetails?: {
    age?: string;
    location?: string;
    distance?: string;
    profession?: string;
    education?: string;
    religion?: string;
    community?: string;
    maritalStatus?: string;
  };
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  // SECTION 1: NEW REQUESTS (3)
  {
    id: 'notif-req-ananya',
    category: 'request',
    title: 'Ananya, 27',
    message: 'Sent you an introduction request',
    time: '5 minutes ago',
    isRead: false,
    type: 'match',
    targetId: 'usr-candidate-ananya',
    senderName: 'Ananya',
    senderAge: 27,
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    senderVerified: true,
    requestStatus: 'pending',
    statusBadgeIcon: 'heart',
    personalMessage: 'Hi, I really liked your profile. We both share an interest in travel and café culture. Would love to connect and know you better.',
    compatibilityPercentage: 92,
    commonMargamsCount: 5,
    similarValuesCount: 3,
    sharedMargams: [
      { name: 'Café Business', emoji: '☕', bgColor: '#FFF1F2', textColor: '#C2410C' },
      { name: 'Travel', emoji: '✈️', bgColor: '#EFF6FF', textColor: '#1D4ED8' },
      { name: 'Photography', emoji: '📷', bgColor: '#F3E8FF', textColor: '#7E22CE' },
    ],
    candidateDetails: {
      age: '27 years',
      location: 'Kochi, Kerala (5 km away)',
      distance: '5 km away',
      profession: 'Marketing Professional',
      education: 'Masters - Marketing',
      religion: 'Hindu (Ezhava)',
      maritalStatus: 'Single',
    },
  },
  {
    id: 'notif-req-rahul',
    category: 'request',
    title: 'Rahul, 29',
    message: 'Sent you an introduction request',
    time: '2 hours ago',
    isRead: false,
    type: 'match',
    targetId: 'candidate_02_chalakudy',
    senderName: 'Rahul',
    senderAge: 29,
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    senderVerified: true,
    requestStatus: 'pending',
    statusBadgeIcon: 'heart',
    personalMessage: 'Hello! I noticed we both share a passion for road trips, weekend cafes, and mindful work-life balance.',
    compatibilityPercentage: 89,
    commonMargamsCount: 4,
    similarValuesCount: 3,
    sharedMargams: [
      { name: 'Road Trips', emoji: '🚗', bgColor: '#EFF6FF', textColor: '#1D4ED8' },
      { name: 'Tech & Design', emoji: '💻', bgColor: '#F3E8FF', textColor: '#7E22CE' },
      { name: 'Specialty Coffee', emoji: '☕', bgColor: '#FFF1F2', textColor: '#C2410C' },
    ],
    candidateDetails: {
      age: '29 years',
      location: 'Thrissur, Kerala (12 km away)',
      distance: '12 km away',
      profession: 'Senior Product Architect',
      education: 'B.Tech Computer Science',
      religion: 'Hindu (Nair)',
      maritalStatus: 'Never Married',
    },
  },
  {
    id: 'notif-req-meera',
    category: 'request',
    title: 'Meera, 26',
    message: 'Sent you an introduction request',
    time: '4 hours ago',
    isRead: false,
    type: 'match',
    targetId: 'cand-meera-03',
    senderName: 'Meera',
    senderAge: 26,
    senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80',
    senderVerified: true,
    requestStatus: 'pending',
    statusBadgeIcon: 'heart',
    personalMessage: 'Namaste! Your life values and focus on independent growth deeply resonated with me. Looking forward to connecting!',
    compatibilityPercentage: 91,
    commonMargamsCount: 3,
    similarValuesCount: 4,
    sharedMargams: [
      { name: 'Mindful Living', emoji: '🧘', bgColor: '#ECFDF5', textColor: '#047857' },
      { name: 'Art & Design', emoji: '🎨', bgColor: '#FDF2F8', textColor: '#BE185D' },
      { name: 'Kerala Heritage', emoji: '🌴', bgColor: '#FEF3C7', textColor: '#B45309' },
    ],
    candidateDetails: {
      age: '26 years',
      location: 'Aluva, Kochi (8 km away)',
      distance: '8 km away',
      profession: 'UI/UX Visual Designer',
      education: 'M.Des - National Institute of Design',
      religion: 'Hindu (Menon)',
      maritalStatus: 'Single',
    },
  },

  // SECTION 2: REQUEST UPDATES
  {
    id: 'notif-upd-vishnu',
    category: 'update',
    title: 'Vishnu, 30',
    message: 'Accepted your introduction request',
    time: '1 hour ago',
    isRead: false,
    type: 'chat',
    targetId: 'cand-vishnu-30',
    senderName: 'Vishnu',
    senderAge: 30,
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
    senderVerified: true,
    requestStatus: 'accepted',
    statusBadgeIcon: 'check',
  },
  {
    id: 'notif-upd-priya',
    category: 'update',
    title: 'Priya, 28',
    message: 'Viewed your profile',
    time: '3 hours ago',
    isRead: false,
    type: 'match',
    targetId: 'cand-priya-28',
    senderName: 'Priya',
    senderAge: 28,
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80',
    senderVerified: true,
    statusBadgeIcon: 'clock',
  },
  {
    id: 'notif-upd-arjun',
    category: 'update',
    title: 'Arjun, 31',
    message: 'Declined your introduction request',
    time: '1 day ago',
    isRead: true,
    type: 'match',
    targetId: 'cand-arjun-31',
    senderName: 'Arjun',
    senderAge: 31,
    senderAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80',
    senderVerified: false,
    requestStatus: 'declined',
    statusBadgeIcon: 'cross',
  },

  // SECTION 3: MESSAGES (2)
  {
    id: 'notif-msg-sneha',
    category: 'message',
    title: 'Sneha',
    message: "Hi! Thanks for your interest. I'd love to connect...",
    time: '2 hours ago',
    isRead: false,
    type: 'chat',
    targetId: 'cand-sneha-msg',
    senderName: 'Sneha',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80',
    senderVerified: true,
  },
  {
    id: 'notif-msg-karthik',
    category: 'message',
    title: 'Karthik',
    message: 'Great to connect! I think we share similar goals...',
    time: '5 hours ago',
    isRead: false,
    type: 'chat',
    targetId: 'cand-karthik-msg',
    senderName: 'Karthik',
    senderAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    senderVerified: false,
  },

  // SECTION 4: PROFILE VIEWS
  {
    id: 'notif-view-deepa',
    category: 'view',
    title: 'Deepa, 25',
    message: 'Viewed your profile',
    time: '6 hours ago',
    isRead: true,
    type: 'match',
    targetId: 'cand-deepa-25',
    senderName: 'Deepa',
    senderAge: 25,
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    senderVerified: true,
  },
  {
    id: 'notif-view-nikhil',
    category: 'view',
    title: 'Nikhil, 32',
    message: 'Viewed your profile',
    time: '1 day ago',
    isRead: true,
    type: 'match',
    targetId: 'cand-nikhil-32',
    senderName: 'Nikhil',
    senderAge: 32,
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    senderVerified: false,
  },
];

let currentNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
const listeners = new Set<(notifications: NotificationItem[]) => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener([...currentNotifications]));
}

export const getNotifications = (): NotificationItem[] => [...currentNotifications];

export const getNotificationById = (id: string): NotificationItem | undefined =>
  currentNotifications.find((n) => n.id === id);

export const getUnreadNotificationsCount = (): number =>
  currentNotifications.filter((n) => !n.isRead).length;

export const getUnreadRequestsCount = (): number =>
  currentNotifications.filter((n) => n.category === 'request' && !n.isRead).length;

export const getUnreadMessagesCount = (): number =>
  currentNotifications.filter((n) => n.category === 'message' && !n.isRead).length;

export const markNotificationAsRead = (id: string) => {
  currentNotifications = currentNotifications.map((n) =>
    n.id === id ? { ...n, isRead: true } : n
  );
  notifyListeners();
};

export const markAllNotificationsAsRead = () => {
  currentNotifications = currentNotifications.map((n) => ({ ...n, isRead: true }));
  notifyListeners();
};

export const acceptNotificationRequest = (id: string) => {
  currentNotifications = currentNotifications.map((n) =>
    n.id === id ? { ...n, requestStatus: 'accepted', isRead: true } : n
  );
  notifyListeners();
};

export const declineNotificationRequest = (id: string) => {
  currentNotifications = currentNotifications.map((n) =>
    n.id === id ? { ...n, requestStatus: 'declined', isRead: true } : n
  );
  notifyListeners();
};

export const addNotification = (item: Omit<NotificationItem, 'id'> & { id?: string }) => {
  const newNotif: NotificationItem = {
    ...item,
    id: item.id || `notif-${Date.now()}`,
    category: item.category || 'update',
    senderName: item.senderName || 'Margam',
    senderAvatar: item.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  };
  currentNotifications = [newNotif, ...currentNotifications];
  notifyListeners();
};

export const resetNotificationsForTest = () => {
  currentNotifications = [...INITIAL_NOTIFICATIONS];
  notifyListeners();
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(getNotifications);

  useEffect(() => {
    const handler = (updated: NotificationItem[]) => setNotifications(updated);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadRequestsCount = notifications.filter((n) => n.category === 'request' && !n.isRead).length;
  const unreadMessagesCount = notifications.filter((n) => n.category === 'message' && !n.isRead).length;

  return {
    notifications,
    unreadCount,
    unreadRequestsCount,
    unreadMessagesCount,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    acceptRequest: acceptNotificationRequest,
    declineRequest: declineNotificationRequest,
    addNotification,
  };
};
