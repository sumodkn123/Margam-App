import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
  Platform,
  Modal,
} from 'react-native';
import { MargamLogoNew } from '../components/brand/MargamLogoNew';
import { CURRENT_USER } from '../constants/mockData';
import { THEME } from '../constants/theme';
import {
  Bell,
  SlidersHorizontal,
  Navigation,
  Car,
  MapPin,
  Calendar,
  Sparkles,
  Users,
  ChevronRight,
  Plane,
  Heart,
  MessageCircle,
  ArrowRight,
  GraduationCap,
} from 'lucide-react-native';
import {
  AnonymousCandidate,
  DiscoveryMode,
  DiscoveryFilterParams,
  TripPlan,
  MatchInsightsSummary,
} from '../types';
import { queryDiscoveryEngine, DEFAULT_CURRENT_USER } from '../services/discoveryEngine';
import { getTodayMatchInsights } from '../services/insightsService';
import { DEFAULT_FILTERS, DiscoveryFilterModal } from '../components/filters/DiscoveryFilterModal';
import { AIMatchAssistantModal } from '../components/assistant/AIMatchAssistantModal';
import { TripPlannerModal } from '../components/trip/TripPlannerModal';
import { AnonymousMatchCard } from '../components/cards/AnonymousMatchCard';
import { NewMatchesModal } from '../components/insights/NewMatchesModal';
import { RouteInsightsModal } from '../components/insights/RouteInsightsModal';
import { DestinationInsightsModal } from '../components/insights/DestinationInsightsModal';
import { HighCompatibilityModal } from '../components/insights/HighCompatibilityModal';
import { MatchInsightsDashboardModal } from '../components/insights/MatchInsightsDashboardModal';
import { NotificationsModal } from '../components/profile/NotificationsModal';
import {
  useNotifications,
  NotificationItem,
} from '../services/notificationService';

const { width } = Dimensions.get('window');

interface MargamHomeScreenProps {
  onNavigateToMap: (mode?: DiscoveryMode, destinationName?: string, tripPlan?: TripPlan) => void;
  onSelectCandidate: (candidate: AnonymousCandidate) => void;
  onRequestButtonPress: () => void;
  onOpenChat: () => void;
  onOpenProfile: () => void;
  onOpenPrivacy: () => void;
  onOpenCandidateProfile?: (candidate: AnonymousCandidate) => void;
  onOpenNotifications?: () => void;
  onOpenAcceptedRequest?: (actorName?: string, actorId?: string) => void;
  onOpenNewMatches?: () => void;
}

export const MargamHomeScreen: React.FC<MargamHomeScreenProps> = ({
  onNavigateToMap,
  onSelectCandidate,
  onRequestButtonPress,
  onOpenChat,
  onOpenProfile,
  onOpenPrivacy,
  onOpenCandidateProfile,
  onOpenNotifications,
  onOpenAcceptedRequest,
  onOpenNewMatches,
}) => {
  // Discovery and Filter State
  const [filters, setFilters] = useState<DiscoveryFilterParams>(DEFAULT_FILTERS);
  const [aiAssistantVisible, setAiAssistantVisible] = useState(false);
  const [tripPlannerVisible, setTripPlannerVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeCandidateModal, setActiveCandidateModal] = useState<AnonymousCandidate | null>(null);

  // Today's Match Insights State (Independently calculated dynamic statistics)
  const [todayInsights, setTodayInsights] = useState<MatchInsightsSummary>(() => getTodayMatchInsights());
  const [newMatchesModalVisible, setNewMatchesModalVisible] = useState(false);
  const [routeInsightsModalVisible, setRouteInsightsModalVisible] = useState(false);
  const [destinationInsightsModalVisible, setDestinationInsightsModalVisible] = useState(false);
  const [highCompatModalVisible, setHighCompatModalVisible] = useState(false);
  const [insightsDashboardVisible, setInsightsDashboardVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const { unreadCount } = useNotifications();

  const refreshTodayInsights = () => {
    setTodayInsights(getTodayMatchInsights(undefined, true));
  };

  // Dynamic Query Insights
  const [insights, setInsights] = useState(() =>
    queryDiscoveryEngine({
      currentUser: DEFAULT_CURRENT_USER,
      mode: 'around_me',
      bounds: null,
      filters: DEFAULT_FILTERS,
    })
  );

  useEffect(() => {
    const res = queryDiscoveryEngine({
      currentUser: DEFAULT_CURRENT_USER,
      mode: 'around_me',
      bounds: null,
      filters,
    });
    setInsights(res);
  }, [filters]);

  // Handle suggested candidate card selection
  const handleSelectSuggestedCandidate = (cand: AnonymousCandidate) => {
    if (onOpenCandidateProfile) {
      onOpenCandidateProfile(cand);
    } else {
      setActiveCandidateModal(cand);
    }
  };

  // Curated Suggested Candidates matching the reference image
  const suggestedCandidates: AnonymousCandidate[] = [
    {
      id: 'sug-1',
      compatibilityPercentage: 92,
      availability: 'Open to introductions',
      approximateZone: 'Kochi area',
      distanceLabel: 'Within 5 km',
      marriageTimelineMatch: true,
      lifestyleMatch: true,
      locationPreferenceMatch: true,
      sharedInterestsCount: 3,
      compatibilityReasons: ['Close age alignment (27)', 'Software Engineer in IT corridor', 'Shared progressive values'],
      fuzzedCoordinate: {
        latitude: 10.0159,
        longitude: 76.3419,
        radiusKm: 3.2,
        approximateZoneName: 'Kochi area',
        displayDistance: 'Within 5 km',
      },
    },
    {
      id: 'sug-2',
      compatibilityPercentage: 88,
      availability: 'Open to introductions',
      approximateZone: 'Thrissur area',
      distanceLabel: 'Along NH 544',
      marriageTimelineMatch: true,
      lifestyleMatch: true,
      locationPreferenceMatch: true,
      sharedInterestsCount: 2,
      compatibilityReasons: ['Medical professional (Doctor)', 'Aligned marriage timeline', 'Family-centric values'],
      fuzzedCoordinate: {
        latitude: 10.5276,
        longitude: 76.2144,
        radiusKm: 3.5,
        approximateZoneName: 'Thrissur area',
        displayDistance: 'Along NH 544',
      },
    },
    {
      id: 'sug-3',
      compatibilityPercentage: 85,
      availability: 'Open to introductions',
      approximateZone: 'Edappally area',
      distanceLabel: 'Within 7 km',
      marriageTimelineMatch: true,
      lifestyleMatch: true,
      locationPreferenceMatch: true,
      sharedInterestsCount: 2,
      compatibilityReasons: ['Creative background (Architect)', 'Shared cultural interests', 'Teetotaler & early riser'],
      fuzzedCoordinate: {
        latitude: 10.0245,
        longitude: 76.3079,
        radiusKm: 3.0,
        approximateZoneName: 'Edappally area',
        displayDistance: 'Within 7 km',
      },
    },
  ];

  const handleOpenNotification = (item: NotificationItem) => {
    setNotificationsModalVisible(false);
    if (item.category === 'request') {
      if (onOpenNotifications) {
        onOpenNotifications();
      } else if (onOpenCandidateProfile && item.targetId) {
        onOpenCandidateProfile({ id: item.targetId } as any);
      }
    } else if (item.category === 'message' || item.type === 'chat') {
      if (onOpenAcceptedRequest) {
        onOpenAcceptedRequest(item.senderName, item.targetId || 'thread-ananya');
      } else {
        onOpenChat();
      }
    } else if (item.type === 'route') {
      onNavigateToMap('along_route');
    } else if (item.type === 'match') {
      if (item.targetId && onOpenCandidateProfile) {
        onOpenCandidateProfile({ id: item.targetId } as any);
      } else {
        setNewMatchesModalVisible(true);
      }
    } else if (item.type === 'verification') {
      onOpenProfile();
    } else {
      if (onOpenNotifications) {
        onOpenNotifications();
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Header Bar: Margam Logo, Brand Text, Notifications, Filter, Avatar */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <MargamLogoNew size={44} />
          <View style={styles.brandTextCol}>
            <Text style={styles.brandTitle}>Margam</Text>
            <Text style={styles.brandTagline}>Your Match. Your Margam.</Text>
          </View>
        </View>

        <View style={styles.headerActionsRow}>
          {/* Notification Bell with Red Dot */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            activeOpacity={0.8}
            onPress={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              } else {
                setNotificationsModalVisible(true);
              }
            }}
          >
            <Bell size={20} color="#1E293B" />
            {unreadCount > 0 && <View style={styles.unreadBadgeDot} />}
          </TouchableOpacity>

          {/* Preferences / Filter Sheet */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.8}
          >
            <SlidersHorizontal size={20} color="#1E293B" />
          </TouchableOpacity>

          {/* Profile Avatar */}
          <TouchableOpacity onPress={onOpenProfile} activeOpacity={0.85}>
            <Image
              source={{ uri: CURRENT_USER.profilePhotoUrl }}
              style={styles.avatarImg}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scrollable View */}
      <ScrollView
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Hero Greeting Section with Scenic Kerala Backwaters Background */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
            }}
            style={styles.heroBgImage}
            imageStyle={{ borderRadius: 24, opacity: 0.28 }}
          >
            {/* Top Row: Location & Weather Pill Badges */}
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1 }} />
              <View style={styles.heroBadgesCol}>
                <View style={styles.locationPill}>
                  <MapPin size={12} color="#1E293B" style={{ marginRight: 4 }} />
                  <Text style={styles.locationPillText}>Thrissur, Kerala</Text>
                </View>

                <View style={styles.weatherCard}>
                  <Text style={styles.weatherEmoji}>⛅ 28°C</Text>
                  <Text style={styles.weatherSubtext}>Partly cloudy</Text>
                </View>
              </View>
            </View>

            {/* Greeting & Headline */}
            <View style={styles.greetingContent}>
              <Text style={styles.greetingPre}>Good Morning,</Text>
              <Text style={styles.greetingName}>Sumod 👋</Text>
              <Text style={styles.greetingQuote}>
                “New paths bring new people. Your next match could be closer than you think.”
              </Text>
            </View>
          </ImageBackground>
        </View>

        {/* 3. Four Quick Action Cards (Around Me | Along Route | At Destination | Plan a Trip) */}
        <View style={styles.actionCardsGrid}>
          {/* Card 1: Around Me */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardPink]}
            activeOpacity={0.88}
            onPress={() => onNavigateToMap('around_me')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#F43F5E' }]}>
              <Navigation size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.actionCardTitle}>Around Me</Text>
            <Text style={styles.actionCardSubtitle}>Find matches near you</Text>
            <ChevronRight size={14} color="#94A3B8" style={styles.actionChevron} />
          </TouchableOpacity>

          {/* Card 2: Along Route */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardBlue]}
            activeOpacity={0.88}
            onPress={() => onNavigateToMap('along_route')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#3B82F6' }]}>
              <Car size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.actionCardTitle}>Along Route</Text>
            <Text style={styles.actionCardSubtitle}>Find matches on your way</Text>
            <ChevronRight size={14} color="#94A3B8" style={styles.actionChevron} />
          </TouchableOpacity>

          {/* Card 3: At Destination */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardPurple]}
            activeOpacity={0.88}
            onPress={() => onNavigateToMap('destination', 'Kochi')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#8B5CF6' }]}>
              <MapPin size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.actionCardTitle}>At Destination</Text>
            <Text style={styles.actionCardSubtitle}>Explore matches at a place</Text>
            <ChevronRight size={14} color="#94A3B8" style={styles.actionChevron} />
          </TouchableOpacity>

          {/* Card 4: Plan a Trip */}
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardGreen]}
            activeOpacity={0.88}
            onPress={() => onNavigateToMap('plan_trip', 'Kochi')}
          >
            <View style={[styles.actionIconCircle, { backgroundColor: '#10B981' }]}>
              <Calendar size={15} color="#FFFFFF" />
            </View>
            <Text style={styles.actionCardTitle}>Plan a Trip</Text>
            <Text style={styles.actionCardSubtitle}>Find matches in another city</Text>
            <ChevronRight size={14} color="#94A3B8" style={styles.actionChevron} />
          </TouchableOpacity>
        </View>

        {/* 4. AI Match Assistant Banner with Friendly Robot Graphic */}
        <TouchableOpacity
          style={styles.aiBannerCard}
          activeOpacity={0.9}
          onPress={() => setAiAssistantVisible(true)}
        >
          <View style={styles.aiBannerLeft}>
            <View style={styles.aiSparkleIconBox}>
              <Sparkles size={18} color="#EA580C" />
            </View>
            <View style={styles.aiBannerTextCol}>
              <Text style={styles.aiBannerTitle}>AI Match Assistant</Text>
              <Text style={styles.aiBannerSubtitle}>
                Tell me where you’re going or what you’re looking for. I’ll help you find the best matches.
              </Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" style={{ marginRight: 6 }} />
          </View>

          {/* 3D Cute Robot Graphic Avatar */}
          <View style={styles.robotContainer}>
            <View style={styles.robotHead}>
              <View style={styles.robotFaceVisor}>
                <View style={styles.robotEye} />
                <View style={styles.robotEye} />
              </View>
              {/* Margam heart pendant */}
              <View style={styles.robotPendant}>
                <Text style={{ fontSize: 8 }}>💖</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* 5. Today's Match Insights */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Today’s Match Insights</Text>
            <TouchableOpacity onPress={() => setInsightsDashboardVisible(true)}>
              <Text style={styles.viewDetailsLink}>View Details &gt;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.insightsRow}>
            {/* Card 1: New Matches (Pink) - Dynamic Count from getNewMatches() */}
            <TouchableOpacity
              style={[styles.insightCard, { backgroundColor: '#FFF1F2', borderColor: '#FFE4E6' }]}
              activeOpacity={0.85}
              onPress={() => setNewMatchesModalVisible(true)}
            >
              <View style={[styles.insightIconCircle, { backgroundColor: '#F43F5E' }]}>
                <Users size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.insightCountText}>{todayInsights.newMatchesCount}</Text>
              <Text style={styles.insightTitleText}>New Matches</Text>
              <Text style={styles.insightSubText}>In your area</Text>
            </TouchableOpacity>

            {/* Card 2: Along Route (Blue) - Dynamic Count from getRouteMatchInsights() */}
            <TouchableOpacity
              style={[styles.insightCard, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}
              activeOpacity={0.85}
              onPress={() => setRouteInsightsModalVisible(true)}
            >
              <View style={[styles.insightIconCircle, { backgroundColor: '#3B82F6' }]}>
                <Car size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.insightCountText}>{todayInsights.routeMatchesCount}</Text>
              <Text style={styles.insightTitleText}>Along Route</Text>
              <Text style={styles.insightSubText}>{todayInsights.routeSummary}</Text>
            </TouchableOpacity>

            {/* Card 3: At Destination (Green) - Dynamic Count from getDestinationMatchInsights() */}
            <TouchableOpacity
              style={[styles.insightCard, { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' }]}
              activeOpacity={0.85}
              onPress={() => setDestinationInsightsModalVisible(true)}
            >
              <View style={[styles.insightIconCircle, { backgroundColor: '#10B981' }]}>
                <MapPin size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.insightCountText}>{todayInsights.destinationMatchesCount}</Text>
              <Text style={styles.insightTitleText}>At Destination</Text>
              <Text style={styles.insightSubText}>{todayInsights.destinationName} area</Text>
            </TouchableOpacity>

            {/* Card 4: High Compatibility (Amber) - Dynamic Count from getHighCompatibilityMatches() */}
            <TouchableOpacity
              style={[styles.insightCard, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}
              activeOpacity={0.85}
              onPress={() => setHighCompatModalVisible(true)}
            >
              <View style={[styles.insightIconCircle, { backgroundColor: '#F59E0B' }]}>
                <Sparkles size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.insightCountText}>{todayInsights.highCompatibilityCount}</Text>
              <Text style={styles.insightTitleText}>High Compatibility</Text>
              <Text style={styles.insightSubText}>{todayInsights.highCompatThreshold}%+ match</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 6. Suggested for You */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Suggested for You</Text>
            <TouchableOpacity onPress={() => onNavigateToMap('around_me')}>
              <Text style={styles.viewDetailsLink}>View All &gt;</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedCarousel}
          >
            {/* Card 1: 92% Match (Software Engineer, Kochi) */}
            <TouchableOpacity
              style={styles.candidateCard}
              activeOpacity={0.9}
              onPress={() => handleSelectSuggestedCandidate(suggestedCandidates[0])}
            >
              <ImageBackground
                source={{
                  uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
                }}
                style={styles.candidateImgBg}
                imageStyle={{ borderRadius: 20 }}
              >
                {/* Top Badge: 92% */}
                <View style={styles.compatPillBadge}>
                  <Text style={styles.compatPillText}>92%</Text>
                </View>

                {/* Bottom Overlay Info */}
                <View style={styles.candidateInfoOverlay}>
                  <View style={styles.candidateOverlayRow}>
                    <MapPin size={11} color="#FFFFFF" />
                    <Text style={styles.candidateOverlayArea}>Kochi area</Text>
                    <ChevronRight size={12} color="#E2E8F0" />
                  </View>
                  <View style={styles.candidateOverlayRow}>
                    <GraduationCap size={11} color="#FFFFFF" />
                    <Text style={styles.candidateOverlayDetail}>27 • Software Engineer</Text>
                    <ChevronRight size={12} color="#E2E8F0" />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* Card 2: 88% Match (Doctor, Thrissur) */}
            <TouchableOpacity
              style={styles.candidateCard}
              activeOpacity={0.9}
              onPress={() => handleSelectSuggestedCandidate(suggestedCandidates[1])}
            >
              <ImageBackground
                source={{
                  uri: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=500&auto=format&fit=crop&q=80',
                }}
                style={styles.candidateImgBg}
                imageStyle={{ borderRadius: 20 }}
              >
                <View style={styles.compatPillBadge}>
                  <Text style={styles.compatPillText}>88%</Text>
                </View>

                <View style={styles.candidateInfoOverlay}>
                  <View style={styles.candidateOverlayRow}>
                    <MapPin size={11} color="#FFFFFF" />
                    <Text style={styles.candidateOverlayArea}>Thrissur area</Text>
                    <ChevronRight size={12} color="#E2E8F0" />
                  </View>
                  <View style={styles.candidateOverlayRow}>
                    <GraduationCap size={11} color="#FFFFFF" />
                    <Text style={styles.candidateOverlayDetail}>29 • Doctor</Text>
                    <ChevronRight size={12} color="#E2E8F0" />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            {/* Card 3: 85% Match (Architect, Edappally) */}
            <TouchableOpacity
              style={styles.candidateCard}
              activeOpacity={0.9}
              onPress={() => handleSelectSuggestedCandidate(suggestedCandidates[2])}
            >
              <ImageBackground
                source={{
                  uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80',
                }}
                style={styles.candidateImgBg}
                imageStyle={{ borderRadius: 20 }}
              >
                <View style={styles.compatPillBadge}>
                  <Text style={styles.compatPillText}>85%</Text>
                </View>

                <View style={styles.candidateInfoOverlay}>
                  <View style={styles.candidateOverlayRow}>
                    <MapPin size={11} color="#FFFFFF" />
                    <Text style={styles.candidateOverlayArea}>Edappally area</Text>
                    <ChevronRight size={12} color="#E2E8F0" />
                  </View>
                  <View style={styles.candidateOverlayRow}>
                    <GraduationCap size={11} color="#FFFFFF" />
                    <Text style={styles.candidateOverlayDetail}>28 • Architect</Text>
                    <ChevronRight size={12} color="#E2E8F0" />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* 7. Upcoming Plans */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Upcoming Plans</Text>
            <TouchableOpacity onPress={() => setTripPlannerVisible(true)}>
              <Text style={styles.viewDetailsLink}>Manage &gt;</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.upcomingPlanCard}
            activeOpacity={0.88}
            onPress={() => {
              const kochiTrip: TripPlan = {
                id: 'trip-kochi-active',
                userId: 'usr-current-sumod',
                origin: 'Thrissur',
                destination: 'Kochi',
                departureDate: '24 Dec',
                returnDate: '26 Dec',
                transportMode: 'car',
                visibility: 'active',
                createdAt: new Date().toISOString(),
              };
              onNavigateToMap('plan_trip', 'Kochi', kochiTrip);
            }}
          >
            {/* Date Badge: 24 Dec */}
            <View style={styles.planDateBox}>
              <Text style={styles.planDateDay}>24</Text>
              <Text style={styles.planDateMonth}>Dec</Text>
            </View>

            {/* Airplane Travel Icon */}
            <View style={styles.planFlightIconBox}>
              <Plane size={18} color="#2563EB" />
            </View>

            {/* Title & Dates */}
            <View style={styles.planDetailsCol}>
              <Text style={styles.planTitle}>Trip to Kochi</Text>
              <Text style={styles.planSubtitle}>
                Show me matches in Kochi from 24 Dec – 26 Dec
              </Text>
            </View>

            {/* Avatar Stack + Matches Count */}
            <View style={styles.planRightCol}>
              <View style={styles.avatarStack}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' }}
                  style={[styles.stackAvatar, { zIndex: 3 }]}
                />
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop' }}
                  style={[styles.stackAvatar, { zIndex: 2, marginLeft: -10 }]}
                />
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop' }}
                  style={[styles.stackAvatar, { zIndex: 1, marginLeft: -10 }]}
                />
                <View style={[styles.stackPill, { marginLeft: -10 }]}>
                  <Text style={styles.stackPillText}>+8</Text>
                </View>
              </View>
              <Text style={styles.potentialMatchesText}>11 potential matches</Text>
            </View>

            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* 8. Recent Activity */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity
              onPress={() => {
                if (onOpenNotifications) {
                  onOpenNotifications();
                } else {
                  setNotificationsModalVisible(true);
                }
              }}
            >
              <Text style={styles.viewDetailsLink}>View All &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* Activity Item 1: 3 new profiles match */}
          <TouchableOpacity
            style={styles.activityItem}
            activeOpacity={0.8}
            onPress={() => {
              if (onOpenNewMatches) {
                onOpenNewMatches();
              } else {
                setNewMatchesModalVisible(true);
              }
            }}
          >
            <View style={[styles.activityIconCircle, { backgroundColor: '#FFE4E6' }]}>
              <Heart size={14} color="#F43F5E" fill="#F43F5E" />
            </View>
            <Text style={styles.activityText}>3 new profiles match your preferences</Text>
            <Text style={styles.activityTimeText}>10 mins ago</Text>
            <ChevronRight size={14} color="#CBD5E1" />
          </TouchableOpacity>

          {/* Activity Item 2: Ananya accepted your request */}
          <TouchableOpacity
            style={styles.activityItem}
            activeOpacity={0.8}
            onPress={() => {
              if (onOpenAcceptedRequest) {
                onOpenAcceptedRequest('Ananya', 'usr-candidate-ananya');
              } else {
                onOpenChat();
              }
            }}
          >
            <View style={[styles.activityIconCircle, { backgroundColor: '#DBEAFE' }]}>
              <MessageCircle size={14} color="#2563EB" />
            </View>
            <Text style={styles.activityText}>
              <Text style={{ fontWeight: '700' }}>Ananya</Text> accepted your introduction request
            </Text>
            <Text style={styles.activityTimeText}>1 hour ago</Text>
            <ChevronRight size={14} color="#CBD5E1" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* AI Match Assistant Modal */}
      <AIMatchAssistantModal
        visible={aiAssistantVisible}
        onClose={() => setAiAssistantVisible(false)}
        onApplyIntent={(intent) => {
          setAiAssistantVisible(false);
          if (intent.filters) {
            setFilters((prev) => ({ ...prev, ...intent.filters }));
          }
          onNavigateToMap(intent.mode || 'around_me', intent.destinationName, intent.tripPlan);
        }}
      />

      {/* Trip Planner Modal */}
      <TripPlannerModal
        visible={tripPlannerVisible}
        onClose={() => setTripPlannerVisible(false)}
        onPlanTrip={(trip) => {
          onNavigateToMap('plan_trip', trip.destination, trip);
        }}
      />

      {/* Filter Bottom Sheet Modal */}
      <DiscoveryFilterModal
        visible={filterModalVisible}
        filters={filters}
        onApply={(newFilters) => setFilters(newFilters)}
        onClose={() => setFilterModalVisible(false)}
      />

      {/* Anonymous Candidate Modal (When clicking suggested card) */}
      {activeCandidateModal && (
        <Modal
          transparent
          animationType="slide"
          visible={!!activeCandidateModal}
          onRequestClose={() => setActiveCandidateModal(null)}
        >
          <View style={styles.anonymousModalOverlay}>
            <View style={styles.anonymousModalContent}>
              <AnonymousMatchCard
                candidate={activeCandidateModal}
                onViewProfile={(cand) => {
                  setActiveCandidateModal(null);
                  if (onOpenCandidateProfile) {
                    onOpenCandidateProfile(cand);
                  }
                }}
                onSendIntroduction={(cand) => {
                  setActiveCandidateModal(null);
                  onSelectCandidate(cand);
                  onRequestButtonPress();
                }}
                onClose={() => setActiveCandidateModal(null)}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* 1. Match Insights Dashboard Modal ("View Details >") */}
      <MatchInsightsDashboardModal
        visible={insightsDashboardVisible}
        onClose={() => setInsightsDashboardVisible(false)}
        onOpenNewMatches={() => setNewMatchesModalVisible(true)}
        onOpenAlongRoute={() => setRouteInsightsModalVisible(true)}
        onOpenAtDestination={() => setDestinationInsightsModalVisible(true)}
        onOpenHighCompatibility={() => setHighCompatModalVisible(true)}
      />

      {/* 2. New Matches Discovery Screen Modal */}
      <NewMatchesModal
        visible={newMatchesModalVisible}
        onClose={() => setNewMatchesModalVisible(false)}
        onRequestIntroduction={(cand) => {
          onSelectCandidate(cand);
          onRequestButtonPress();
        }}
        onViewOnMap={() => onNavigateToMap('around_me')}
        onSelectCandidate={(cand) => {
          if (onOpenCandidateProfile) {
            onOpenCandidateProfile(cand);
          } else {
            setActiveCandidateModal(cand);
          }
        }}
      />

      {/* 3. Along Route Insights Discovery Modal */}
      <RouteInsightsModal
        visible={routeInsightsModalVisible}
        onClose={() => setRouteInsightsModalVisible(false)}
        onRequestIntroduction={(cand) => {
          onSelectCandidate(cand);
          onRequestButtonPress();
        }}
        onSuggestMeeting={(cand) => {
          onSelectCandidate(cand);
          onRequestButtonPress();
        }}
        onViewRouteOnMap={(_origin, dest) => {
          onNavigateToMap('along_route', dest);
        }}
        onRouteUpdated={refreshTodayInsights}
      />

      {/* 4. At Destination Insights Discovery Modal */}
      <DestinationInsightsModal
        visible={destinationInsightsModalVisible}
        onClose={() => setDestinationInsightsModalVisible(false)}
        onRequestIntroduction={(cand) => {
          onSelectCandidate(cand);
          onRequestButtonPress();
        }}
        onViewDestinationOnMap={(destName) => {
          onNavigateToMap('destination', destName);
        }}
        onDestinationUpdated={refreshTodayInsights}
      />

      {/* 5. High Compatibility Matches Modal */}
      <HighCompatibilityModal
        visible={highCompatModalVisible}
        onClose={() => setHighCompatModalVisible(false)}
        onRequestIntroduction={(cand) => {
          onSelectCandidate(cand);
          onRequestButtonPress();
        }}
      />

      {/* 6. Notification Center Modal */}
      <NotificationsModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
        onOpenItem={handleOpenNotification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 52 : 42,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextCol: {
    marginLeft: 10,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  brandTagline: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  avatarImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#7C3AED',
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    paddingBottom: 110,
  },
  heroSection: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  heroBgImage: {
    padding: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  heroBadgesCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  locationPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherEmoji: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  weatherSubtext: {
    fontSize: 10,
    color: '#64748B',
  },
  greetingContent: {
    marginTop: 6,
  },
  greetingPre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  greetingName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  greetingQuote: {
    fontSize: 12,
    lineHeight: 18,
    color: '#334155',
    fontStyle: 'italic',
    maxWidth: '85%',
  },
  actionCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 12,
  },
  actionCard: {
    width: (width - 42) / 2,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    position: 'relative',
  },
  actionCardPink: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FFE4E6',
  },
  actionCardBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  actionCardPurple: {
    backgroundColor: '#F5F3FF',
    borderColor: '#EDE9FE',
  },
  actionCardGreen: {
    backgroundColor: '#ECFDF5',
    borderColor: '#D1FAE5',
  },
  actionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  actionCardSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
  },
  actionChevron: {
    position: 'absolute',
    bottom: 14,
    right: 12,
  },
  aiBannerCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 22,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  aiBannerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSparkleIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFEDD5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  aiBannerTextCol: {
    flex: 1,
    marginRight: 6,
  },
  aiBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  aiBannerSubtitle: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  robotContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotHead: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  robotFaceVisor: {
    width: 26,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 3,
  },
  robotEye: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#38BDF8',
  },
  robotPendant: {
    position: 'absolute',
    bottom: -4,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  viewDetailsLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  insightsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  insightCard: {
    flex: 1,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
  },
  insightIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  insightCountText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 1,
  },
  insightTitleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E293B',
  },
  insightSubText: {
    fontSize: 9,
    color: '#64748B',
  },
  suggestedCarousel: {
    gap: 12,
    paddingBottom: 4,
  },
  candidateCard: {
    width: 135,
    height: 185,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  candidateImgBg: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
  },
  compatPillBadge: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  compatPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  candidateInfoOverlay: {
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    borderRadius: 12,
    padding: 6,
    gap: 3,
  },
  candidateOverlayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  candidateOverlayArea: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 4,
  },
  candidateOverlayDetail: {
    fontSize: 9,
    fontWeight: '600',
    color: '#E2E8F0',
    flex: 1,
    marginLeft: 4,
  },
  upcomingPlanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  planDateBox: {
    width: 44,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planDateDay: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1D4ED8',
    lineHeight: 20,
  },
  planDateMonth: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
    textTransform: 'uppercase',
  },
  planFlightIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planDetailsCol: {
    flex: 1,
  },
  planTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  planSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
  },
  planRightCol: {
    alignItems: 'flex-end',
    gap: 3,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  stackPill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E2E8F0',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  stackPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  potentialMatchesText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#2563EB',
  },
  activityItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  activityIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityText: {
    flex: 1,
    fontSize: 12,
    color: '#1E293B',
    fontWeight: '500',
  },
  activityTimeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  anonymousModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 23, 44, 0.65)',
    justifyContent: 'flex-end',
  },
  anonymousModalContent: {
    backgroundColor: 'transparent',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
});
