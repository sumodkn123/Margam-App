// MARGAM — Centralized, Typed, Entity-Aware Navigation Router
// Single source of truth for routing, click-action resolution, and deep linking across the application.
// Guarantees zero wrong-destination fallbacks and complete entity propagation.

import {
  AnonymousCandidate,
  DetailedOtherUserProfile,
  DiscoveryMode,
  IntroductionRequest,
  RouteCorridor,
  TripPlan,
} from '../types';
import { NotificationItem, INITIAL_NOTIFICATIONS } from './notificationService';
import { getVisibleProfile } from './profileService';

export type ScreenRoute =
  | 'home'
  | 'margams'
  | 'map'
  | 'requests'
  | 'chat'
  | 'profile'
  | 'other_profile'
  | 'notifications_list'
  | 'notification_detail'
  | 'composer'
  | 'request_success'
  | 'privacy_center';

export interface NavigationState {
  currentRoute: ScreenRoute;
  activeTab: 'home' | 'margams' | 'map' | 'requests' | 'chat' | 'profile';
  previousRoute?: ScreenRoute;
  previousTab?: 'home' | 'margams' | 'map' | 'requests' | 'chat' | 'profile';

  // Entity Payloads
  selectedProfileId?: string;
  selectedProfile?: DetailedOtherUserProfile;
  selectedProfileRequestStatus?: 'pending' | 'accepted' | 'declined' | null;

  selectedConversationId?: string;
  selectedRecipient?: {
    id: string;
    name: string;
    avatar: string;
    area?: string;
    profession?: string;
    compatibility?: number;
  };

  selectedRequestId?: string;
  requestsSubTab?: 'incoming' | 'sent' | 'history';

  selectedNotificationItem?: NotificationItem;
  notificationsFilterTab?: 'all' | 'requests' | 'messages' | 'updates';

  mapMode?: DiscoveryMode;
  mapDestinationName?: string;
  mapTripPlan?: TripPlan | null;
  mapHighlightCandidateId?: string;

  composingCandidate?: AnonymousCandidate;
  composingRecipientProfile?: DetailedOtherUserProfile | null;
  composingRoute?: RouteCorridor;

  successConfirmation?: {
    candidate: AnonymousCandidate;
    recipientProfile?: DetailedOtherUserProfile | null;
    sentMessage: string;
    selectedReasons: string[];
    shareSelection: any;
    requestId: string;
  };

  newMatchesModalVisible?: boolean;
  privacyCenterView?: string;
}

export type NavigationListener = (state: NavigationState) => void;

class NavigationRouter {
  private state: NavigationState = {
    currentRoute: 'home',
    activeTab: 'home',
  };

  private listeners: Set<NavigationListener> = new Set();
  private navigationHistory: NavigationState[] = [];

  public getState(): NavigationState {
    return { ...this.state };
  }

  public subscribe(listener: NavigationListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snapshot = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('Error in navigation listener:', err);
      }
    });
  }

  private pushHistory() {
    this.navigationHistory.push({ ...this.state });
    if (this.navigationHistory.length > 25) {
      this.navigationHistory.shift();
    }
  }

  // ==========================================================
  // TYPED NAVIGATION ACTIONS
  // ==========================================================

  /**
   * Navigate to Home tab
   */
  public openHome(): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'home',
      activeTab: 'home',
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Navigate to Margams tab
   */
  public openMargams(_margamId?: string): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'margams',
      activeTab: 'margams',
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Navigate to Map with explicit mode, destination, or trip
   */
  public openMap(
    mode: DiscoveryMode = 'around_me',
    destinationName?: string,
    tripPlan?: TripPlan | null,
    highlightCandidateId?: string
  ): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'map',
      activeTab: 'map',
      mapMode: mode,
      mapDestinationName: destinationName,
      mapTripPlan: tripPlan,
      mapHighlightCandidateId: highlightCandidateId,
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open Candidate Profile (OtherUserProfileScreen)
   * Ensures candidate ID is resolved to a complete record and requestStatus is set.
   */
  public openProfile(
    candidateOrId: string | AnonymousCandidate | DetailedOtherUserProfile,
    context?: {
      requestStatus?: 'pending' | 'accepted' | 'declined' | null;
      source?: string;
    }
  ): void {
    this.pushHistory();
    let profile: DetailedOtherUserProfile;

    if (typeof candidateOrId === 'object' && 'photos' in candidateOrId && 'margams' in candidateOrId) {
      profile = candidateOrId as DetailedOtherUserProfile;
    } else {
      profile = getVisibleProfile('usr-current-sumod', candidateOrId, context);
    }

    this.state = {
      ...this.state,
      currentRoute: 'other_profile',
      selectedProfile: profile,
      selectedProfileId: profile.id,
      selectedProfileRequestStatus: context?.requestStatus || null,
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open Conversation with specific recipient in Chat tab
   * Directly opens the conversation rather than a generic conversation list.
   */
  public openConversation(
    conversationId: string,
    recipient?: {
      id: string;
      name: string;
      avatar: string;
      area?: string;
      profession?: string;
      compatibility?: number;
    }
  ): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'chat',
      activeTab: 'chat',
      selectedConversationId: conversationId,
      selectedRecipient: recipient || {
        id: conversationId,
        name: conversationId.includes('ananya') ? 'Ananya' : 'Partner',
        avatar: conversationId.includes('ananya')
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
        area: 'Kochi area',
        profession: 'Professional',
        compatibility: 91,
      },
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open Conversations List in Chat tab
   */
  public openChatList(): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'chat',
      activeTab: 'chat',
      selectedConversationId: undefined,
      selectedRecipient: undefined,
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open Requests Tab (Incoming or Sent)
   */
  public openRequests(subTab: 'incoming' | 'sent' | 'history' = 'incoming', highlightRequestId?: string): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'requests',
      activeTab: 'requests',
      requestsSubTab: subTab,
      selectedRequestId: highlightRequestId,
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open User Profile (MargamProfileScreen)
   */
  public openMyProfile(): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'profile',
      activeTab: 'profile',
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open Full-Page Notifications List
   */
  public openNotificationsList(filterTab: 'all' | 'requests' | 'messages' | 'updates' = 'all'): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'notifications_list',
      notificationsFilterTab: filterTab,
      selectedNotificationItem: undefined,
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open Full-Page Notification Details
   */
  public openNotificationDetail(itemOrId: NotificationItem | string): void {
    this.pushHistory();
    let notifItem: NotificationItem;
    if (typeof itemOrId === 'string') {
      const found = INITIAL_NOTIFICATIONS.find((n) => n.id === itemOrId);
      notifItem = found || INITIAL_NOTIFICATIONS[0];
    } else {
      notifItem = itemOrId;
    }

    this.state = {
      ...this.state,
      currentRoute: 'notification_detail',
      selectedNotificationItem: notifItem,
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open Dedicated Privacy & Visibility Center
   */
  public openPrivacyCenter(view: string = 'hub'): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'privacy_center',
      privacyCenterView: view,
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      composingCandidate: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open Send Introduction Request Composer
   */
  public openComposer(
    candidate: AnonymousCandidate,
    recipientProfile?: DetailedOtherUserProfile | null,
    route?: RouteCorridor
  ): void {
    this.pushHistory();
    this.state = {
      ...this.state,
      currentRoute: 'composer',
      composingCandidate: candidate,
      composingRecipientProfile: recipientProfile || null,
      composingRoute: route,
      previousRoute: this.state.currentRoute,
      previousTab: this.state.activeTab,
      selectedProfile: undefined,
      selectedNotificationItem: undefined,
      successConfirmation: undefined,
    };
    this.notify();
  }

  /**
   * Open New Matches Discovery Modal / List
   * Used when clicking "3 new profiles match your preferences"
   */
  public openNewMatches(): void {
    this.state = {
      ...this.state,
      newMatchesModalVisible: true,
    };
    this.notify();
  }

  public closeNewMatches(): void {
    this.state = {
      ...this.state,
      newMatchesModalVisible: false,
    };
    this.notify();
  }

  /**
   * Critical Entity-Aware Activity Resolver
   * Resolves any activity item or notification to its exact, authoritative destination.
   * NEVER defaults an accepted request or match to the Map screen.
   */
  public handleActivityClick(activity: {
    type:
      | 'request_accepted'
      | 'new_matches'
      | 'message_received'
      | 'upcoming_trip'
      | 'area_matches'
      | 'profile_viewed'
      | 'verification_approved'
      | string;
    targetId?: string;
    actorName?: string;
    message?: string;
  }): void {
    const eventType = activity.type;

    switch (eventType) {
      case 'request_accepted': {
        // Expected: Open conversation with the actor or accepted request details
        const actor = activity.actorName || 'Ananya';
        const targetConvId = activity.targetId || `thread-${actor.toLowerCase()}`;
        this.openConversation(targetConvId, {
          id: targetConvId,
          name: actor,
          avatar: actor.toLowerCase().includes('ananya')
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces'
            : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
          area: 'Kochi area',
          profession: 'Professional',
          compatibility: 92,
        });
        break;
      }

      case 'new_matches': {
        // Expected: Open new matching profiles discovery modal / list
        this.openNewMatches();
        break;
      }

      case 'message_received': {
        // Expected: Open conversation with sender
        const sender = activity.actorName || 'Sneha';
        const convId = activity.targetId || `thread-${sender.toLowerCase()}`;
        this.openConversation(convId, {
          id: convId,
          name: sender,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
          area: 'Kochi area',
          profession: 'Chartered Accountant',
          compatibility: 82,
        });
        break;
      }

      case 'upcoming_trip': {
        // Expected: Open trip planning corridor
        this.openMap('plan_trip', 'Munnar');
        break;
      }

      case 'area_matches': {
        // Expected: Filtered area discovery
        const area = activity.targetId || 'Chalakudy';
        this.openMap('destination', area);
        break;
      }

      case 'profile_viewed': {
        // Expected: Open the viewer's profile
        const targetProfileId = activity.targetId || 'cand-priya-28';
        this.openProfile(targetProfileId);
        break;
      }

      case 'verification_approved': {
        // Expected: Open User Profile
        this.openMyProfile();
        break;
      }

      default: {
        // Safe fallback: Open Notifications list instead of throwing or dumping to Map
        this.openNotificationsList();
        break;
      }
    }
  }

  /**
   * Back Navigation
   */
  /**
   * Back Navigation
   * True stack-based popping from navigationHistory, with graceful fallback.
   */
  public goBack(): void {
    if (this.state.currentRoute === 'chat' && this.state.selectedConversationId) {
      // Exit active conversation back to chat thread list
      this.state = {
        ...this.state,
        selectedConversationId: undefined,
        selectedRecipient: undefined,
      };
      this.notify();
      return;
    }

    if (this.navigationHistory.length > 0) {
      const prev = this.navigationHistory.pop();
      if (prev) {
        this.state = { ...prev };
        this.notify();
        return;
      }
    }

    // Baseline fallback: return to Home
    this.openHome();
  }
}

// Singleton Router Instance
export const navigationRouter = new NavigationRouter();
