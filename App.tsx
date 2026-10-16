// MARGAM - Main Application Container
// "Your Match. Your Margam." — AI-Powered Matrimonial Discovery Through Maps & Routes
// Request-First Privacy Architecture & Executive Front Page

import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CURRENT_USER, SAMPLE_INCOMING_REQUEST, ANONYMOUS_MATCHES, POPULAR_ROUTES } from './src/constants/mockData';
import {
  AnonymousCandidate,
  RouteCorridor,
  IntroductionRequest,
  RequestType,
  UserShareSelection,
  RouteShareSelection,
  MapVisibilityOption,
  LocationDisplayMode,
  AvailabilityStatus,
  ProfileFieldPerms,
  VisibilityState,
  DiscoveryMode,
  TripPlan,
  DetailedOtherUserProfile,
  MargamProfileCandidate,
} from './src/types';
import { projectSharedProfile } from './src/services/privacyFuzzing';
import { getVisibleProfile } from './src/services/profileService';
import { MargamHomeScreen } from './src/screens/MargamHomeScreen';
import { MargamsScreen } from './src/screens/MargamsScreen';
import { MapDiscoveryScreen } from './src/screens/MapDiscoveryScreen';
import { ShareSelectionScreen } from './src/screens/ShareSelectionScreen';
import { SendRequestComposerScreen, SendRequestPayload } from './src/screens/SendRequestComposerScreen';
import { RequestSentSuccessScreen } from './src/screens/RequestSentSuccessScreen';
import { OtherUserProfileScreen } from './src/screens/OtherUserProfileScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { NotificationDetailScreen } from './src/screens/NotificationDetailScreen';
import { PrivacyCenterScreen, PrivacyViewKey } from './src/screens/PrivacyCenterScreen';
import {
  NotificationItem,
  acceptNotificationRequest,
  declineNotificationRequest,
} from './src/services/notificationService';
import { IncomingRequestsScreen } from './src/screens/IncomingRequestsScreen';
import { ConnectionsHubScreen } from './src/screens/ConnectionsHubScreen';
import { MargamProfileScreen } from './src/screens/MargamProfileScreen';
import { MargamAuthFlow } from './src/screens/auth/MargamAuthFlow';
import { MargamLaunchScreen } from './src/screens/splash/MargamLaunchScreen';
import { MargamBottomNav, TabKey } from './src/components/navigation/MargamBottomNav';
import { AnonymousMatchCard } from './src/components/cards/AnonymousMatchCard';
import { MapCluster } from './src/components/map/KochiGoogleMapView';
import {
  sendGranularIntroduction,
  editPendingIntroduction,
  withdrawIntroduction,
} from './src/services/advancedProfileEngine';
import { authService } from './src/services/authService';

export default function App() {
  // Authentication State (Starts false to showcase the new login experience)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Animated Cinematic Launch Screen State
  const [isLaunchScreenActive, setIsLaunchScreenActive] = useState<boolean>(true);

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isChatConversationActive, setIsChatConversationActive] = useState(false);
  const [composingCandidate, setComposingCandidate] = useState<AnonymousCandidate | null>(null);
  const [composingRecipientProfile, setComposingRecipientProfile] = useState<DetailedOtherUserProfile | null>(null);
  const [composingRoute, setComposingRoute] = useState<RouteCorridor | undefined>(undefined);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [draftMessage, setDraftMessage] = useState<string>('');
  const [draftSelectedReasons, setDraftSelectedReasons] = useState<string[]>(['Shared Margams', 'Similar Values']);
  const [draftShareSelection, setDraftShareSelection] = useState<UserShareSelection | undefined>(undefined);
  const [activeSentRequestConfirmation, setActiveSentRequestConfirmation] = useState<{
    candidate: AnonymousCandidate;
    recipientProfile?: DetailedOtherUserProfile | null;
    sentMessage: string;
    selectedReasons: string[];
    shareSelection: UserShareSelection;
    requestId: string;
  } | null>(null);
  const [inspectingClusterCandidate, setInspectingClusterCandidate] = useState<AnonymousCandidate | null>(null);
  const [viewingProfileCandidate, setViewingProfileCandidate] = useState<DetailedOtherUserProfile | null>(null);

  // Full-Page Notifications Navigation State
  const [isNotificationsScreenOpen, setIsNotificationsScreenOpen] = useState(false);
  const [selectedNotificationDetail, setSelectedNotificationDetail] = useState<NotificationItem | null>(null);
  const [viewingProfileRequestStatus, setViewingProfileRequestStatus] = useState<
    'pending' | 'accepted' | 'declined' | null
  >(null);

  // Dedicated Privacy & Visibility Center State
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [privacyCenterInitialView, setPrivacyCenterInitialView] = useState<PrivacyViewKey>('hub');

  // Chat Conversation Deep Link & Routing State
  const [selectedChatConversationId, setSelectedChatConversationId] = useState<string | undefined>(undefined);
  const [selectedChatRecipient, setSelectedChatRecipient] = useState<
    | {
        id: string;
        name: string;
        avatar: string;
        area?: string;
        profession?: string;
        compatibility?: number;
      }
    | undefined
  >(undefined);

  // App Domain State
  const [incomingRequests, setIncomingRequests] = useState<IntroductionRequest[]>([
    SAMPLE_INCOMING_REQUEST,
  ]);
  const [sentRequests, setSentRequests] = useState<IntroductionRequest[]>([]);
  const [activeConnections, setActiveConnections] = useState<IntroductionRequest[]>([]);

  // User Privacy Configuration
  const [mapVisibility, setMapVisibility] = useState<MapVisibilityOption>('all_criteria');
  const [locationMode, setLocationMode] = useState<LocationDisplayMode>('approximate_area');
  const [availability, setAvailability] = useState<AvailabilityStatus>('available');
  const [fieldPerms, setFieldPerms] = useState<ProfileFieldPerms>(CURRENT_USER.fieldPerms);

  // Handle Field Visibility Change in Matrix
  const handleFieldPermChange = (field: keyof ProfileFieldPerms, state: VisibilityState) => {
    if (field === 'exactLocation') return; // Absolute Invariant
    setFieldPerms((prev) => ({
      ...prev,
      [field]: state,
    }));
  };

  // Active Map mode state for cross-screen navigation
  const [mapMode, setMapMode] = useState<DiscoveryMode>('around_me');
  const [mapDestinationName, setMapDestinationName] = useState<string | undefined>(undefined);
  const [mapTripPlan, setMapTripPlan] = useState<TripPlan | null>(null);

  const handleNavigateToMap = (mode?: DiscoveryMode, destinationName?: string, tripPlan?: TripPlan) => {
    if (mode) setMapMode(mode);
    setMapDestinationName(destinationName);
    setMapTripPlan(tripPlan || null);
    setActiveTab('map');
  };

  // Open Full Candidate Profile Screen
  const handleOpenCandidateProfile = (
    candidateOrId: string | AnonymousCandidate | MargamProfileCandidate,
    context?: { source?: string; sourceMargam?: string }
  ) => {
    setInspectingClusterCandidate(null);
    const prof = getVisibleProfile(CURRENT_USER.id, candidateOrId, context);
    setViewingProfileCandidate(prof);
  };

  // Launch Request Composer
  const handleStartRequest = (
    candidate: AnonymousCandidate,
    route?: RouteCorridor,
    recipientProfile?: DetailedOtherUserProfile | null
  ) => {
    setInspectingClusterCandidate(null);
    setComposingCandidate(candidate);
    const resolvedProfile = recipientProfile || getVisibleProfile(CURRENT_USER.id, candidate);
    setComposingRecipientProfile(resolvedProfile);
    setComposingRoute(route || POPULAR_ROUTES[0]);
    setDraftMessage('');
    setDraftSelectedReasons(['Shared Margams', 'Similar Values']);
    setDraftShareSelection(undefined);
    setEditingRequestId(null);
  };

  // Handle cluster selection from Front Page
  const handleSelectCluster = (cluster: MapCluster) => {
    // Map cluster to candidate in mockData
    const match = ANONYMOUS_MATCHES.find((m) => m.approximateZone.includes(cluster.areaName)) || ANONYMOUS_MATCHES[0];
    setInspectingClusterCandidate({
      ...match,
      approximateZone: `${cluster.name} (${cluster.areaName})`,
      clusterCount: cluster.count,
    });
  };

  // Submit Completed Introduction Request (from Screen 2)
  const handleCompleteSendRequest = (payload: SendRequestPayload) => {
    if (!composingCandidate) return;

    // Filter requester's profile using strictly the selected fields (Zero PII leakage)
    const revealedData = projectSharedProfile(CURRENT_USER, payload.shareSelection);
    let reqId = editingRequestId;

    const isShared = (val: any) => Boolean(val);
    const granularSelection = {
      firstName: isShared(payload.shareSelection.firstName),
      age: isShared(payload.shareSelection.age),
      profilePhoto: isShared(payload.shareSelection.profilePhoto),
      profession: isShared(payload.shareSelection.profession),
      coreMargams: true,
      fullBio: isShared(payload.shareSelection.fullBio),
      educationDetails: isShared(payload.shareSelection.education),
      lifestyleDetails: isShared(payload.shareSelection.lifestylePreferences),
      lifeMap: true,
      familyDetails: isShared(payload.shareSelection.familyOverview),
      religionCommunity: isShared((payload.shareSelection as any).religionCommunity),
      horoscopeDetails: isShared((payload.shareSelection as any).horoscopeDetails),
      contactInformation: isShared(payload.shareSelection.phoneNumber || payload.shareSelection.email),
    };

    if (editingRequestId) {
      editPendingIntroduction(
        editingRequestId,
        payload.message,
        payload.selectedInterestReasons,
        granularSelection,
        payload.includeMatchingDetails
      );

      setSentRequests((prev) =>
        prev.map((r) =>
          r.id === editingRequestId
            ? {
                ...r,
                customMessage: payload.message,
                selectedInterestReasons: payload.selectedInterestReasons,
                includeMatchingDetails: payload.includeMatchingDetails,
                sharedFields: payload.shareSelection,
                requesterRevealedData: revealedData,
              }
            : r
        )
      );
    } else {
      const backendIntro = sendGranularIntroduction(
        CURRENT_USER.id,
        composingCandidate.id,
        granularSelection,
        payload.message,
        payload.selectedInterestReasons,
        payload.includeMatchingDetails
      );
      reqId = backendIntro.id;

      const newRequest: IntroductionRequest = {
        id: backendIntro.id,
        requesterId: CURRENT_USER.id,
        recipientId: composingCandidate.id,
        requestType: 'introduction',
        customMessage: payload.message,
        compatibilityPercentage: composingCandidate.compatibilityPercentage,
        sharedFields: payload.shareSelection,
        selectedInterestReasons: payload.selectedInterestReasons,
        includeMatchingDetails: payload.includeMatchingDetails,
        requesterRevealedData: revealedData,
        createdAt: 'Just now',
        status: 'pending',
        stage: 2,
      };

      setSentRequests((prev) => [newRequest, ...prev]);
    }

    const currentCandidate = composingCandidate;
    const currentRecipientProfile = composingRecipientProfile;

    // Transition smoothly to Confirmation Screen (Screen 3)
    setComposingCandidate(null);
    setEditingRequestId(null);
    setActiveSentRequestConfirmation({
      candidate: currentCandidate,
      recipientProfile: currentRecipientProfile,
      sentMessage: payload.message,
      selectedReasons: payload.selectedInterestReasons,
      shareSelection: payload.shareSelection,
      requestId: reqId || `req_${Date.now()}`,
    });
  };

  // Submit Completed Introduction Request from legacy ShareSelectionScreen
  const handleSubmitIntroduction = (payload: {
    requestType: RequestType;
    message: string;
    shareSelection: UserShareSelection;
    routeSelection?: RouteShareSelection;
  }) => {
    handleCompleteSendRequest({
      message: payload.message,
      selectedInterestReasons: ['Shared Margams', 'Similar Values'],
      shareSelection: payload.shareSelection,
      includeMatchingDetails: true,
    });
  };

  // Accept Incoming Request -> Promotes to Stage 3 / 4 Connection
  const handleAcceptRequest = (request: IntroductionRequest) => {
    const updatedRequest: IntroductionRequest = {
      ...request,
      status: 'accepted',
      stage: 4, // Unlocks chat & public meeting
    };

    setIncomingRequests((prev) => prev.filter((r) => r.id !== request.id));
    setActiveConnections((prev) => [updatedRequest, ...prev]);
    const partnerName = request.requesterRevealedData?.firstName || 'Partner';
    setSelectedChatConversationId(request.id);
    setSelectedChatRecipient({
      id: request.requesterId || request.id,
      name: partnerName,
      avatar:
        request.requesterRevealedData?.profilePhotoUrl ||
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
      area: request.requesterRevealedData?.area || request.requesterRevealedData?.city || 'Kochi area',
      profession: request.requesterRevealedData?.profession || 'Professional',
      compatibility: request.compatibilityPercentage || 90,
    });
    setActiveTab('chat');
  };

  // Decline Request
  const handleDeclineRequest = (requestId: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // Ask for More Information
  const handleAskMoreInfo = (requestId: string) => {
    setIncomingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'more_info_requested' } : r))
    );
  };

  // Withdraw Sent Request
  const handleWithdrawRequest = (requestId: string) => {
    try {
      withdrawIntroduction(requestId);
    } catch {}
    setSentRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
          <MargamAuthFlow onAuthenticated={() => setIsAuthenticated(true)} />
          {isLaunchScreenActive && (
            <MargamLaunchScreen onAnimationComplete={() => setIsLaunchScreenActive(false)} />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Screen Body */}
      <View style={styles.screenWrapper}>
        {activeSentRequestConfirmation ? (
          <RequestSentSuccessScreen
            candidate={activeSentRequestConfirmation.candidate}
            recipientProfile={activeSentRequestConfirmation.recipientProfile}
            sentMessage={activeSentRequestConfirmation.sentMessage}
            selectedReasons={activeSentRequestConfirmation.selectedReasons}
            shareSelection={activeSentRequestConfirmation.shareSelection}
            onEdit={() => {
              const conf = activeSentRequestConfirmation;
              setActiveSentRequestConfirmation(null);
              setEditingRequestId(conf.requestId);
              setComposingCandidate(conf.candidate);
              setComposingRecipientProfile(conf.recipientProfile || null);
              setDraftMessage(conf.sentMessage);
              setDraftSelectedReasons(conf.selectedReasons);
              setDraftShareSelection(conf.shareSelection);
            }}
            onBackToExplore={() => {
              setActiveSentRequestConfirmation(null);
              setComposingCandidate(null);
              setComposingRecipientProfile(null);
              setActiveTab('home');
            }}
            onViewFullProfile={() => {
              const prof =
                activeSentRequestConfirmation.recipientProfile ||
                getVisibleProfile(CURRENT_USER.id, activeSentRequestConfirmation.candidate);
              setActiveSentRequestConfirmation(null);
              setComposingCandidate(null);
              setComposingRecipientProfile(null);
              setViewingProfileCandidate(prof);
            }}
            onClose={() => {
              setActiveSentRequestConfirmation(null);
              setComposingCandidate(null);
              setComposingRecipientProfile(null);
              setActiveTab('home');
            }}
          />
        ) : composingCandidate ? (
          <SendRequestComposerScreen
            candidate={composingCandidate}
            recipientProfile={composingRecipientProfile}
            initialMessage={draftMessage}
            initialSelectedReasons={draftSelectedReasons}
            initialShareSelection={draftShareSelection}
            onBack={() => {
              setComposingCandidate(null);
              setEditingRequestId(null);
            }}
            onSendRequest={handleCompleteSendRequest}
          />
        ) : selectedNotificationDetail ? (
          <NotificationDetailScreen
            item={selectedNotificationDetail}
            onBack={() => setSelectedNotificationDetail(null)}
            onAcceptRequest={(item) => {
              acceptNotificationRequest(item.id);
              const prof = getVisibleProfile(CURRENT_USER.id, item.targetId || 'usr-candidate-ananya');
              setSelectedNotificationDetail(null);
              setIsNotificationsScreenOpen(false);
              setViewingProfileCandidate(prof);
              setViewingProfileRequestStatus('accepted');
            }}
            onDeclineRequest={(item) => {
              declineNotificationRequest(item.id);
            }}
            onViewCandidateProfile={(item, reqStatus) => {
              const prof = getVisibleProfile(CURRENT_USER.id, item.targetId || 'usr-candidate-ananya');
              setSelectedNotificationDetail(null);
              setIsNotificationsScreenOpen(false);
              setViewingProfileCandidate(prof);
              setViewingProfileRequestStatus(reqStatus || item.requestStatus || 'pending');
            }}
            onOpenChat={(item) => {
              setSelectedNotificationDetail(null);
              setIsNotificationsScreenOpen(false);
              const name = item?.senderName || 'Ananya';
              const target = item?.targetId || 'thread-ananya';
              setSelectedChatConversationId(target.includes('ananya') ? 'thread-ananya' : target);
              setSelectedChatRecipient({
                id: target,
                name: name,
                avatar: item?.senderAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
                area: 'Kochi area',
                profession: 'Professional',
                compatibility: item?.compatibilityPercentage || 92,
              });
              setActiveTab('chat');
            }}
          />
        ) : isPrivacyCenterOpen ? (
          <PrivacyCenterScreen
            onBack={() => setIsPrivacyCenterOpen(false)}
            initialView={privacyCenterInitialView}
          />
        ) : isNotificationsScreenOpen ? (
          <NotificationsScreen
            onBack={() => setIsNotificationsScreenOpen(false)}
            onOpenDetail={(item) => setSelectedNotificationDetail(item)}
            onAcceptRequest={(item) => {
              acceptNotificationRequest(item.id);
              const prof = getVisibleProfile(CURRENT_USER.id, item.targetId || 'usr-candidate-ananya');
              setIsNotificationsScreenOpen(false);
              setViewingProfileCandidate(prof);
              setViewingProfileRequestStatus('accepted');
            }}
            onViewCandidateProfile={(item, reqStatus) => {
              const prof = getVisibleProfile(CURRENT_USER.id, item.targetId || 'usr-candidate-ananya');
              setIsNotificationsScreenOpen(false);
              setViewingProfileCandidate(prof);
              setViewingProfileRequestStatus(reqStatus || item.requestStatus || 'pending');
            }}
            onOpenChat={(item) => {
              setIsNotificationsScreenOpen(false);
              const name = item?.senderName || 'Ananya';
              const target = item?.targetId || 'thread-ananya';
              setSelectedChatConversationId(target.includes('ananya') ? 'thread-ananya' : target);
              setSelectedChatRecipient({
                id: target,
                name: name,
                avatar: item?.senderAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
                area: 'Kochi area',
                profession: 'Professional',
                compatibility: item?.compatibilityPercentage || 92,
              });
              setActiveTab('chat');
            }}
          />
        ) : viewingProfileCandidate ? (
          <OtherUserProfileScreen
            profile={viewingProfileCandidate}
            requestStatus={viewingProfileRequestStatus}
            onBack={() => {
              setViewingProfileCandidate(null);
              setViewingProfileRequestStatus(null);
            }}
            onAcceptRequest={() => {
              setViewingProfileRequestStatus('accepted');
              acceptNotificationRequest('notif-req-ananya');
            }}
            onDeclineRequest={() => {
              setViewingProfileRequestStatus('declined');
              declineNotificationRequest('notif-req-ananya');
            }}
            onRequestIntroduction={(candidate) => {
              const profileBackup = viewingProfileCandidate;
              setViewingProfileCandidate(null);
              setViewingProfileRequestStatus(null);
              handleStartRequest(candidate, undefined, profileBackup);
            }}
            onExploreMargam={(_margamName) => {
              setViewingProfileCandidate(null);
              setViewingProfileRequestStatus(null);
              setActiveTab('margams');
            }}
            onExploreLocationMap={(cityName) => {
              setViewingProfileCandidate(null);
              setViewingProfileRequestStatus(null);
              handleNavigateToMap('destination', cityName);
            }}
            onOpenChat={() => {
              const name = viewingProfileCandidate.name;
              const id = viewingProfileCandidate.id;
              setViewingProfileCandidate(null);
              setViewingProfileRequestStatus(null);
              setSelectedChatConversationId(id.includes('ananya') ? 'thread-ananya' : id);
              setSelectedChatRecipient({
                id: id,
                name: name,
                avatar: viewingProfileCandidate.photos[0]?.url || '',
                area: viewingProfileCandidate.area,
                profession: viewingProfileCandidate.profession,
                compatibility: viewingProfileCandidate.compatibilityPercentage,
              });
              setActiveTab('chat');
            }}
          />
        ) : (
          <>
            {/* 1. HOME: Executive Dashboard Matching Design Image */}
            {activeTab === 'home' && (
              <MargamHomeScreen
                onNavigateToMap={handleNavigateToMap}
                onSelectCandidate={(cand) => handleStartRequest(cand)}
                onOpenCandidateProfile={handleOpenCandidateProfile}
                onRequestButtonPress={() => handleStartRequest(ANONYMOUS_MATCHES[0])}
                onOpenChat={() => {
                  setSelectedChatConversationId(undefined);
                  setSelectedChatRecipient(undefined);
                  setActiveTab('chat');
                }}
                onOpenProfile={() => setActiveTab('profile')}
                onOpenPrivacy={() => setActiveTab('profile')}
                onOpenNotifications={() => setIsNotificationsScreenOpen(true)}
                onOpenAcceptedRequest={(actorName, actorId) => {
                  setActiveTab('chat');
                  const id = actorId || 'usr-candidate-ananya';
                  setSelectedChatConversationId(id.includes('ananya') ? 'thread-ananya' : id);
                  setSelectedChatRecipient({
                    id: id,
                    name: actorName || 'Ananya',
                    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
                    area: 'Kochi area',
                    profession: 'Product Manager',
                    compatibility: 91,
                  });
                }}
                onOpenNewMatches={() => {
                  handleOpenCandidateProfile(ANONYMOUS_MATCHES[0]);
                }}
              />
            )}

            {/* 2. MARGAMS: Interest-Based Discovery Screen Matching Image */}
            {activeTab === 'margams' && (
              <MargamsScreen
                onSelectCandidate={(cand) => handleStartRequest(cand)}
                onOpenCandidateProfile={handleOpenCandidateProfile}
                onRequestButtonPress={() => handleStartRequest(ANONYMOUS_MATCHES[0])}
                onOpenProfile={() => setActiveTab('profile')}
                onOpenChat={() => setActiveTab('chat')}
              />
            )}

            {/* 3. MAP: Full Interactive Apple MapKit & Route Navigation */}
            {activeTab === 'map' && (
              <MapDiscoveryScreen
                initialMode={mapMode}
                initialDestinationName={mapDestinationName}
                initialTripPlan={mapTripPlan}
                onBack={() => setActiveTab('home')}
                onStartRequest={handleStartRequest}
                onOpenCandidateProfile={handleOpenCandidateProfile}
                onOpenPrivacy={() => setActiveTab('profile')}
                onOpenProfile={() => setActiveTab('profile')}
              />
            )}

            {/* 4. REQUESTS: Incoming & Outgoing Matrimonial Requests */}
            {activeTab === 'requests' && (
              <IncomingRequestsScreen
                incomingRequests={incomingRequests}
                sentRequests={sentRequests}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                onAskMoreInfo={handleAskMoreInfo}
                onWithdrawRequest={handleWithdrawRequest}
              />
            )}

            {/* 5. CHAT & CONNECTIONS: Stage 3, 4, 5 (Safe Chat & Public Meetup) */}
            {activeTab === 'chat' && (
              <ConnectionsHubScreen
                connections={activeConnections}
                initialConversationId={selectedChatConversationId}
                initialRecipient={selectedChatRecipient}
                onBack={() => {
                  setSelectedChatConversationId(undefined);
                  setSelectedChatRecipient(undefined);
                }}
                onOpenPrivacy={() => {
                  setIsChatConversationActive(false);
                  setActiveTab('profile');
                }}
                onOpenCandidateProfile={(candidateOrId) => {
                  setIsChatConversationActive(false);
                  handleOpenCandidateProfile(candidateOrId);
                }}
                onConversationActiveChange={setIsChatConversationActive}
              />
            )}

            {/* 6. PROFILE: Executive Dashboard & Sub-tabs (Accessed via Top-Right Profile Icon) */}
            {activeTab === 'profile' && (
              <MargamProfileScreen
                onBack={() => setActiveTab('home')}
                onLogout={() => {
                  authService.signOut();
                  setIsAuthenticated(false);
                }}
                onReplayLaunchAnimation={() => setIsLaunchScreenActive(true)}
                mapVisibility={mapVisibility}
                onChangeMapVisibility={setMapVisibility}
                locationMode={locationMode}
                onChangeLocationMode={setLocationMode}
                availability={availability}
                onChangeAvailability={setAvailability}
                fieldPerms={fieldPerms}
                onChangeFieldPerm={handleFieldPermChange}
                onNavigateToHome={() => setActiveTab('home')}
                onNavigateToMap={() => setActiveTab('map')}
                onNavigateToRequests={() => setActiveTab('requests')}
                onOpenConversation={(convId, name) => {
                  setActiveTab('chat');
                  setSelectedChatConversationId(convId);
                  setSelectedChatRecipient({
                    id: convId,
                    name: name || 'Ananya',
                    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=faces',
                    area: 'Kochi area',
                    profession: 'Product Manager',
                    compatibility: 91,
                  });
                }}
                onOpenPrivacyCenter={() => {
                  setPrivacyCenterInitialView('hub');
                  setIsPrivacyCenterOpen(true);
                }}
              />
            )}
          </>
        )}
      </View>

      {/* Anonymous Match Card Inspection Modal (When tapping cluster cards) */}
      {inspectingClusterCandidate && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.clusterModalOverlay}>
            <View style={styles.clusterModalCard}>
              <AnonymousMatchCard
                candidate={inspectingClusterCandidate}
                onViewProfile={(c) => {
                  setInspectingClusterCandidate(null);
                  handleOpenCandidateProfile(c);
                }}
                onSendIntroduction={(c) => handleStartRequest(c)}
                onClose={() => setInspectingClusterCandidate(null)}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Global 5-Tab Navigation Bar (Hidden when viewing candidate profile, composing a request, confirmation screen, or inside an active chat conversation, full-screen notifications, or privacy center) */}
      {!viewingProfileCandidate && !composingCandidate && !activeSentRequestConfirmation && !(activeTab === 'chat' && isChatConversationActive) && !isNotificationsScreenOpen && !selectedNotificationDetail && !isPrivacyCenterOpen && (
        <MargamBottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'chat') {
              setIsChatConversationActive(false);
            }
          }}
          unreadCount={1}
          requestsCount={incomingRequests.length}
        />
      )}

      {/* 8. Cinematic App Launch Overlay (Resolves into real home screen with 60fps dissolve) */}
      {isLaunchScreenActive && (
        <MargamLaunchScreen onAnimationComplete={() => setIsLaunchScreenActive(false)} />
      )}
    </SafeAreaView>
  </SafeAreaProvider>
);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  clusterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  clusterModalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
