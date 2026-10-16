import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  Alert,
  Share,
} from 'react-native';
import {
  Share2,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  ChevronRight,
  Briefcase,
  MapPin,
  GraduationCap,
  Send,
  Heart,
  MessageCircle,
  ShieldCheck,
  Check,
  X,
  Clock,
} from 'lucide-react-native';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import {
  DetailedOtherUserProfile,
  ProfileMargamDisplayItem,
  AnonymousCandidate,
} from '../types';
import {
  toggleSaveProfile,
  isProfileSaved,
  blockProfile,
  hideProfile,
  setNotInterested,
  reportProfile,
} from '../services/profileService';
import { FullscreenPhotoViewerModal } from '../components/profile/FullscreenPhotoViewerModal';
import { ProfileMoreActionSheet } from '../components/profile/ProfileMoreActionSheet';
import { ReportProfileModal } from '../components/profile/ReportProfileModal';
import { BlockConfirmationModal } from '../components/profile/BlockConfirmationModal';
import { VerificationInfoModal } from '../components/profile/VerificationInfoModal';
import { LocationPrivacyInfoModal } from '../components/profile/LocationPrivacyInfoModal';
import { MargamDetailModal } from '../components/profile/MargamDetailModal';
import { AllMargamsSheetModal } from '../components/profile/AllMargamsSheetModal';
import { PlanTogetherModal } from '../components/profile/PlanTogetherModal';
import { CompatibilityBreakdownModal } from '../components/insights/CompatibilityBreakdownModal';
import { AdvancedProfileSections } from '../components/profile/AdvancedProfileSections';
import { AccessRequestModal } from '../components/profile/AccessRequestModal';
import { GranularIntroModal } from '../components/profile/GranularIntroModal';
import {
  getSanitizedProfileForViewer,
  respondToSectionAccessRequest,
} from '../services/advancedProfileEngine';
import { resolveCityCoordinates } from '../services/discoveryEngine';
import { generatePrivacyZone } from '../services/privacyFuzzing';
import { FilteredDisplayProfile, AccessRequestSection } from '../types/profile';

const { width } = Dimensions.get('window');

interface OtherUserProfileScreenProps {
  profile: DetailedOtherUserProfile;
  onBack: () => void;
  onRequestIntroduction: (candidate: AnonymousCandidate) => void;
  onExploreMargam?: (margamName: string) => void;
  onExploreLocationMap?: (areaName: string) => void;
  onOpenChat?: () => void;
  requestStatus?: 'pending' | 'accepted' | 'declined' | null;
  onAcceptRequest?: () => void;
  onDeclineRequest?: () => void;
}

export const OtherUserProfileScreen: React.FC<OtherUserProfileScreenProps> = ({
  profile,
  onBack,
  onRequestIntroduction,
  onExploreMargam,
  onExploreLocationMap,
  onOpenChat,
  requestStatus = null,
  onAcceptRequest,
  onDeclineRequest,
}) => {
  // Request Status State (Shows accept or not on top of profile)
  const [localRequestStatus, setLocalRequestStatus] = useState<'pending' | 'accepted' | 'declined' | null>(
    requestStatus
  );

  React.useEffect(() => {
    if (requestStatus !== undefined) {
      setLocalRequestStatus(requestStatus);
    }
  }, [requestStatus]);

  const handleAcceptRequestAction = () => {
    setLocalRequestStatus('accepted');
    onAcceptRequest?.();
  };

  const handleDeclineRequestAction = () => {
    setLocalRequestStatus('declined');
    onDeclineRequest?.();
  };
  // Modal states
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeMargamDetail, setActiveMargamDetail] = useState<ProfileMargamDisplayItem | null>(null);
  const [isAllMargamsOpen, setIsAllMargamsOpen] = useState(false);
  const [isPlanTogetherOpen, setIsPlanTogetherOpen] = useState(false);
  const [isCompatibilityBreakdownOpen, setIsCompatibilityBreakdownOpen] = useState(false);

  // Advanced Matrimonial Profile engine integration
  const [displayProfile, setDisplayProfile] = useState<FilteredDisplayProfile>(() =>
    getSanitizedProfileForViewer('usr-current-sumod', profile.id)
  );
  const [isAccessRequestModalOpen, setIsAccessRequestModalOpen] = useState(false);
  const [selectedAccessSection, setSelectedAccessSection] = useState<AccessRequestSection>('family');
  const [isGranularIntroOpen, setIsGranularIntroOpen] = useState(false);

  // Section minimization state
  const [isMargamsExpanded, setIsMargamsExpanded] = useState(true);
  const [isCompatExpanded, setIsCompatExpanded] = useState(true);
  const [isAboutExpanded, setIsAboutExpanded] = useState(true);
  const [isLookingForExpanded, setIsLookingForExpanded] = useState(true);
  const [isAiMatchExpanded, setIsAiMatchExpanded] = useState(true);

  const renderMinimizeBtn = (expanded: boolean, onToggle: () => void) => (
    <TouchableOpacity
      style={[
        styles.minimizeBtn,
        expanded ? styles.minimizeBtnActive : styles.minimizeBtnInactive,
      ]}
      onPress={onToggle}
      activeOpacity={0.7}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      accessibilityLabel={expanded ? 'Minimize section' : 'Expand section'}
    >
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: expanded ? '-90deg' : '90deg' }],
        }}
      >
        <ChevronRight size={16} color={expanded ? '#0F172A' : '#64748B'} strokeWidth={2.5} />
      </View>
    </TouchableOpacity>
  );

  const refreshDisplayProfile = () => {
    setDisplayProfile(getSanitizedProfileForViewer('usr-current-sumod', profile.id));
  };

  // Bookmark / Save state
  const [saved, setSaved] = useState<boolean>(isProfileSaved(profile.id));

  const handleToggleSave = () => {
    const nextSaved = toggleSaveProfile(profile.id);
    setSaved(nextSaved);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `View ${profile.name}'s Margam profile on Margam Matrimonial: margam://profile/${profile.id}`,
        title: `${profile.name} on Margam`,
      });
    } catch {
      // User cancelled share
    }
  };

  const handleLaunchRequestIntro = () => {
    handleIntroCompleted();
  };

  const handleIntroCompleted = () => {
    const geo = resolveCityCoordinates(profile.city || profile.area);
    const safeFuzzed = generatePrivacyZone(geo.lat, geo.lng, profile.id, profile.area || `${profile.city} area`);

    const candidateContract: AnonymousCandidate = {
      id: profile.id,
      compatibilityPercentage: profile.compatibilityPercentage,
      availability: 'Open to introductions',
      approximateZone: profile.area,
      distanceLabel: profile.discoverySource || 'Shared Margam Match',
      marriageTimelineMatch: true,
      lifestyleMatch: true,
      locationPreferenceMatch: true,
      sharedInterestsCount: profile.margams.filter((m) => m.isShared).length,
      compatibilityReasons: profile.margams.filter((m) => m.isShared).map((m) => `Shared ${m.name}`),
      fuzzedCoordinate: safeFuzzed,
      availabilityNote: profile.discoverySource,
    };
    onRequestIntroduction(candidateContract);
  };

  const primaryPhoto = profile.photos.find((p) => p.isPrimary) || profile.photos[0];
  const secondaryPhotos = profile.photos.filter((p) => !p.isPrimary);

  // Radial progress calculations for 92% Compatibility ring
  const circleRadius = 26;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (circumference * profile.compatibilityPercentage) / 100;

  const isConnected = profile.relationshipState === 'CONNECTED';

  return (
    <View style={styles.rootContainer}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* ==================================================== */}
        {/* 1. TOP HERO PHOTO & OVERLAY ACTIONS                   */}
        {/* ==================================================== */}
        <View style={styles.heroSection}>
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => {
              setSelectedPhotoIndex(0);
              setIsPhotoViewerOpen(true);
            }}
          >
            <Image source={{ uri: primaryPhoto.url }} style={styles.heroImage} resizeMode="cover" />
          </TouchableOpacity>

          {/* Floating Top Controls: Back, Share, More */}
          <SafeAreaView style={styles.topControlsOverlay}>
            <View style={styles.topControlsNavRow}>
              <TouchableOpacity style={styles.circleFrostedBtn} onPress={onBack} activeOpacity={0.8}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M15 18l-6-6 6-6"
                    stroke="#0F172A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>

              <View style={styles.topRightBtns}>
                <TouchableOpacity style={styles.roundedFrostedBtn} onPress={handleShare} activeOpacity={0.8}>
                  <Share2 size={18} color="#0F172A" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.roundedFrostedBtn}
                  onPress={() => setIsMoreSheetOpen(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moreDotsText}>···</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* FLOATING TOP REQUEST STATUS PILL (Shows accept or not right on top of profile) */}
            {Boolean(localRequestStatus) && (
              <View
                style={[
                  styles.floatingTopStatusPill,
                  localRequestStatus === 'accepted'
                    ? styles.floatingPillAccepted
                    : localRequestStatus === 'declined'
                    ? styles.floatingPillDeclined
                    : styles.floatingPillPending,
                ]}
              >
                <View style={styles.floatingPillLeft}>
                  {localRequestStatus === 'accepted' ? (
                    <CheckCircle2 size={15} color="#059669" />
                  ) : localRequestStatus === 'declined' ? (
                    <X size={15} color="#64748B" />
                  ) : (
                    <Heart size={15} color="#E11D48" fill="#E11D48" />
                  )}
                  <Text
                    style={[
                      styles.floatingPillText,
                      localRequestStatus === 'accepted'
                        ? styles.floatingTextAccepted
                        : localRequestStatus === 'declined'
                        ? styles.floatingTextDeclined
                        : styles.floatingTextPending,
                    ]}
                    numberOfLines={1}
                  >
                    {localRequestStatus === 'accepted'
                      ? 'Request Accepted • Connected'
                      : localRequestStatus === 'declined'
                      ? 'Request Declined'
                      : 'Introduction Request Pending'}
                  </Text>
                </View>

                {localRequestStatus === 'pending' ? (
                  <View style={styles.floatingPillActions}>
                    <TouchableOpacity
                      style={styles.floatingAcceptMiniBtn}
                      onPress={handleAcceptRequestAction}
                      activeOpacity={0.85}
                    >
                      <Check size={12} color="#FFFFFF" strokeWidth={3} />
                      <Text style={styles.floatingAcceptMiniBtnText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.floatingDeclineMiniBtn}
                      onPress={handleDeclineRequestAction}
                      activeOpacity={0.85}
                    >
                      <X size={12} color="#64748B" strokeWidth={2.5} />
                    </TouchableOpacity>
                  </View>
                ) : localRequestStatus === 'accepted' ? (
                  <TouchableOpacity
                    style={styles.floatingChatMiniBtn}
                    onPress={onOpenChat}
                    activeOpacity={0.85}
                  >
                    <MessageCircle size={13} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.floatingChatMiniBtnText}>Chat</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.floatingUndoMiniBtn}
                    onPress={handleAcceptRequestAction}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.floatingUndoMiniBtnText}>Undo</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </SafeAreaView>

          {/* Bottom-Left of Photo: 92% Compatible Pill */}
          <View style={styles.compatHeroPill}>
            <Text style={{ fontSize: 13, marginRight: 5 }}>💖</Text>
            <Text style={styles.compatHeroText}>{profile.compatibilityPercentage}% Compatible</Text>
          </View>

          {/* Right Side Vertical Photo Thumbnail Strip */}
          <View style={styles.verticalThumbnailsStrip}>
            {secondaryPhotos.slice(0, 3).map((photo, idx) => {
              const isLocked = photo.visibility === 'connections_only' || photo.visibility === 'request_only';
              return (
                <TouchableOpacity
                  key={photo.id || idx}
                  style={styles.thumbnailCard}
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedPhotoIndex(idx + 1);
                    setIsPhotoViewerOpen(true);
                  }}
                >
                  {isLocked ? (
                    <View style={styles.lockedThumbnailOverlay}>
                      <Lock size={14} color="#FFFFFF" style={{ marginBottom: 3 }} />
                      <Text style={styles.lockedThumbText}>Visible after</Text>
                      <Text style={styles.lockedThumbText}>connection</Text>
                    </View>
                  ) : (
                    <>
                      <Image source={{ uri: photo.url }} style={styles.thumbnailImg} />
                      <View style={styles.photoCountBadge}>
                        <Text style={styles.photoCountText}>1/{profile.photos.length}</Text>
                      </View>
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ==================================================== */}
        {/* 2. MAIN PROFILE CONTAINER (Overlapping white card)   */}
        {/* ==================================================== */}
        <View style={styles.mainContentCard}>
          {/* TOP PROFILE REQUEST STATUS BANNER (Shows Accept or Not) */}
          {Boolean(localRequestStatus) && (
            <View
              style={[
                styles.topStatusCard,
                localRequestStatus === 'accepted'
                  ? styles.topStatusCardAccepted
                  : localRequestStatus === 'declined'
                  ? styles.topStatusCardDeclined
                  : styles.topStatusCardPending,
              ]}
            >
              <View style={styles.topStatusCardHeader}>
                <View
                  style={[
                    styles.topStatusCardIconCircle,
                    localRequestStatus === 'accepted'
                      ? { backgroundColor: '#D1FAE5' }
                      : localRequestStatus === 'declined'
                      ? { backgroundColor: '#F1F5F9' }
                      : { backgroundColor: '#FFE4E6' },
                  ]}
                >
                  {localRequestStatus === 'accepted' ? (
                    <CheckCircle2 size={18} color="#059669" />
                  ) : localRequestStatus === 'declined' ? (
                    <X size={18} color="#64748B" />
                  ) : (
                    <Heart size={18} color="#E11D48" fill="#E11D48" />
                  )}
                </View>

                <View style={styles.topStatusCardHeaderTextCol}>
                  <View style={styles.topStatusCardBadgeRow}>
                    <Text
                      style={[
                        styles.topStatusCardBadgeText,
                        localRequestStatus === 'accepted'
                          ? { color: '#059669' }
                          : localRequestStatus === 'declined'
                          ? { color: '#64748B' }
                          : { color: '#E11D48' },
                      ]}
                    >
                      {localRequestStatus === 'accepted'
                        ? '✅ REQUEST ACCEPTED'
                        : localRequestStatus === 'declined'
                        ? '✕ REQUEST DECLINED'
                        : '💌 INTRODUCTION REQUEST PENDING'}
                    </Text>
                  </View>

                  <Text style={styles.topStatusCardTitle}>
                    {localRequestStatus === 'accepted'
                      ? `Connected with ${profile.name}`
                      : localRequestStatus === 'declined'
                      ? 'Decision: Declined'
                      : `Decision Needed for ${profile.name}`}
                  </Text>
                  <Text style={styles.topStatusCardSubtext}>
                    {localRequestStatus === 'accepted'
                      ? `You accepted ${profile.name}'s request. You can now chat directly and start discovering Margams together.`
                      : localRequestStatus === 'declined'
                      ? `You chose not to accept this introduction request.`
                      : `${profile.name} sent you an introduction request. Accept to connect and unlock messaging.`}
                  </Text>
                </View>
              </View>

              {localRequestStatus === 'pending' ? (
                <View style={styles.topStatusCardActionsRow}>
                  <TouchableOpacity
                    style={styles.topStatusCardDeclineBtn}
                    onPress={handleDeclineRequestAction}
                    activeOpacity={0.8}
                  >
                    <X size={16} color="#64748B" strokeWidth={2.4} />
                    <Text style={styles.topStatusCardDeclineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.topStatusCardAcceptBtn}
                    onPress={handleAcceptRequestAction}
                    activeOpacity={0.85}
                  >
                    <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
                    <Text style={styles.topStatusCardAcceptText}>Accept Request 💖</Text>
                  </TouchableOpacity>
                </View>
              ) : localRequestStatus === 'accepted' ? (
                <View style={styles.topStatusCardActionsRow}>
                  <TouchableOpacity
                    style={styles.topStatusCardChatBtn}
                    onPress={onOpenChat}
                    activeOpacity={0.85}
                  >
                    <MessageCircle size={16} color="#FFFFFF" strokeWidth={2.4} />
                    <Text style={styles.topStatusCardChatText}>Start Chat with {profile.name}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.topStatusCardActionsRow}>
                  <TouchableOpacity
                    style={styles.topStatusCardUndoBtn}
                    onPress={handleAcceptRequestAction}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.topStatusCardUndoText}>Undo & Accept Request</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Header Row: Name, Age, Verified, Availability */}
          <View style={styles.nameHeaderRow}>
            <View style={styles.nameAgeCol}>
              <View style={styles.nameVerifiedRow}>
                <Text style={styles.profileNameText}>
                  {profile.name}, {profile.age}
                </Text>
                {profile.isVerified && (
                  <TouchableOpacity
                    onPress={() => setIsVerificationModalOpen(true)}
                    activeOpacity={0.8}
                    style={{ marginLeft: 6 }}
                  >
                    <CheckCircle2 size={20} color="#059669" fill="#059669" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Availability Pill */}
            <TouchableOpacity
              style={styles.availabilityPill}
              activeOpacity={0.8}
              onPress={() => {
                Alert.alert(
                  'Profile Availability',
                  `${profile.name} is actively open to introductions and reviewing matrimonial requests this week.`
                );
              }}
            >
              <View style={styles.greenLiveDot} />
              <Text style={styles.availabilityText}>{profile.availability}</Text>
              <ChevronRight size={14} color="#059669" style={{ marginLeft: 2 }} />
            </TouchableOpacity>
          </View>

          {/* Attribute Chips Grid */}
          <View style={styles.attributesGrid}>
            <View style={styles.attrChip}>
              <Briefcase size={15} color="#475569" style={styles.attrIcon} />
              <Text style={styles.attrText}>{profile.profession}</Text>
            </View>

            <TouchableOpacity
              style={styles.attrChip}
              activeOpacity={0.8}
              onPress={() => setIsLocationModalOpen(true)}
            >
              <MapPin size={15} color="#475569" style={styles.attrIcon} />
              <Text style={styles.attrText}>{profile.area}</Text>
              <Info size={13} color="#94A3B8" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <View style={styles.attrChip}>
              <GraduationCap size={15} color="#475569" style={styles.attrIcon} />
              <Text style={styles.attrText}>{profile.education}</Text>
            </View>

            <View style={styles.attrChip}>
              <Text style={styles.symbolIcon}>🕉</Text>
              <Text style={styles.attrText}>{profile.religion}</Text>
            </View>

            <View style={styles.attrChip}>
              <Text style={styles.symbolIcon}>📏</Text>
              <Text style={styles.attrText}>{profile.height}</Text>
            </View>

            <View style={styles.attrChip}>
              <Briefcase size={15} color="#475569" style={styles.attrIcon} />
              <Text style={styles.attrText}>{profile.relocationIntent}</Text>
            </View>
          </View>

          {/* ==================================================== */}
          {/* 3. MY MARGAMS (INTERESTS & GOALS) SECTION            */}
          {/* ==================================================== */}
          <View style={styles.margamsSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>My Margams (Interests & Goals)</Text>
              {renderMinimizeBtn(isMargamsExpanded, () => setIsMargamsExpanded(!isMargamsExpanded))}
            </View>

            {/* Horizontal Left-to-Right Scrolling Margam Cards */}
            {isMargamsExpanded && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.margamsScrollView}
                contentContainerStyle={styles.margamsScrollContent}
              >
                {profile.margams.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.margamCard, { backgroundColor: m.bgColor }]}
                    activeOpacity={0.8}
                    onPress={() => setActiveMargamDetail(m)}
                  >
                    <View style={styles.margamCardInner}>
                      <Text style={styles.margamCardEmoji}>{m.emoji}</Text>
                      <View style={styles.margamCardTextWrap}>
                        <Text style={styles.margamCardName} numberOfLines={1}>
                          {m.name}
                        </Text>
                        <Text style={[styles.margamCardIntent, { color: m.textColor }]} numberOfLines={1}>
                          {m.intentCategory}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* ==================================================== */}
          {/* 4. OVERALL COMPATIBILITY SECTION                     */}
          {/* ==================================================== */}
          <View style={styles.compatCardContainer}>
            <View style={styles.compatHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} color="#7E22CE" />
                <Text style={styles.compatCardHeaderTitle}>Overall Compatibility</Text>
              </View>
              {renderMinimizeBtn(isCompatExpanded, () => setIsCompatExpanded(!isCompatExpanded))}
            </View>

            {isCompatExpanded && (
              <View style={styles.compatBodyRow}>
                {/* Radial Progress Ring */}
                <View style={styles.radialRingWrap}>
                  <Svg width={64} height={64} viewBox="0 0 64 64">
                    <Defs>
                      <SvgGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#A855F7" />
                        <Stop offset="100%" stopColor="#EC4899" />
                      </SvgGradient>
                    </Defs>
                    {/* Track */}
                    <Circle
                      cx="32"
                      cy="32"
                      r={circleRadius}
                      stroke="#EDE9FE"
                      strokeWidth={strokeWidth}
                      fill="none"
                    />
                    {/* Progress Arc */}
                    <Circle
                      cx="32"
                      cy="32"
                      r={circleRadius}
                      stroke="url(#ringGrad)"
                      strokeWidth={strokeWidth}
                      strokeDasharray={`${circumference}`}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="none"
                      transform="rotate(-90 32 32)"
                    />
                  </Svg>
                  <View style={styles.ringCenterText}>
                    <Text style={styles.ringPercentText}>{profile.compatibilityPercentage}%</Text>
                  </View>
                </View>

                {/* Middle Title & Subtitle */}
                <View style={styles.compatTextCol}>
                  <Text style={styles.compatSubtitle}>{profile.compatibilitySummary}</Text>
                </View>

                {/* "Why this match?" Button */}
                <TouchableOpacity
                  style={styles.whyThisMatchBtn}
                  activeOpacity={0.8}
                  onPress={() => setIsCompatibilityBreakdownOpen(true)}
                >
                  <Sparkles size={13} color="#7E22CE" style={{ marginRight: 4 }} />
                  <Text style={styles.whyThisMatchText}>Why this match?</Text>
                  <ChevronRight size={13} color="#7E22CE" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ==================================================== */}
          {/* 5. ABOUT ANANYA SECTION                              */}
          {/* ==================================================== */}
          <View style={styles.aboutCard}>
            <View style={styles.cardHeaderWithIcon}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.quoteIcon}>❝</Text>
                <Text style={styles.aboutCardTitle}>About {profile.name}</Text>
              </View>
              {renderMinimizeBtn(isAboutExpanded, () => setIsAboutExpanded(!isAboutExpanded))}
            </View>
            {isAboutExpanded && (
              <Text style={styles.aboutCardBody}>{profile.aboutText}</Text>
            )}
          </View>

          {/* ==================================================== */}
          {/* 6. WHAT I'M LOOKING FOR SECTION                      */}
          {/* ==================================================== */}
          <View style={styles.lookingForCard}>
            <View style={styles.cardHeaderWithIcon}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.targetIcon}>🎯</Text>
                <Text style={styles.aboutCardTitle}>What I'm Looking For</Text>
              </View>
              {renderMinimizeBtn(isLookingForExpanded, () => setIsLookingForExpanded(!isLookingForExpanded))}
            </View>
            {isLookingForExpanded && (
              <>
                <Text style={styles.aboutCardBody}>{profile.lookingForText}</Text>

                {/* 3 Sub-Cards: Location, Marriage Timeline, Family */}
                <View style={styles.prefSubCardsRow}>
                  <View style={styles.prefSubCard}>
                    <MapPin size={16} color="#3B82F6" style={styles.prefIcon} />
                    <Text style={styles.prefLabel}>Location Preference</Text>
                    <Text style={styles.prefVal}>{profile.partnerPreferences.locationPreference}</Text>
                  </View>

                  <View style={styles.prefSubCard}>
                    <Text style={[styles.prefEmojiIcon, { color: '#9333EA' }]}>👥</Text>
                    <Text style={styles.prefLabel}>Marriage Timeline</Text>
                    <Text style={styles.prefVal}>{profile.partnerPreferences.marriageTimeline}</Text>
                  </View>

                  <View style={styles.prefSubCard}>
                    <Text style={[styles.prefEmojiIcon, { color: '#EA580C' }]}>🏠</Text>
                    <Text style={styles.prefLabel}>Family Preference</Text>
                    <Text style={styles.prefVal}>{profile.partnerPreferences.familyPreference}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* ==================================================== */}
          {/* 6B. ADVANCED 17-SECTION MATRIMONIAL BIODATA         */}
          {/* ==================================================== */}
          <View style={{ marginTop: 20 }}>
            <View style={styles.biodataSectionHeader}>
              <Text style={styles.biodataSectionTitle}>Comprehensive Matrimonial Details</Text>
              <Text style={styles.biodataSectionSub}>
                Full biodata sections with privacy protections and progressive disclosure
              </Text>
            </View>

            <AdvancedProfileSections
              isOwner={false}
              displayProfile={displayProfile}
              onRequestAccess={(section) => {
                setSelectedAccessSection(section);
                setIsAccessRequestModalOpen(true);
              }}
            />
          </View>

          {/* ==================================================== */}
          {/* 6C. AI COMPATIBILITY EXPLAINABILITY                 */}
          {/* ==================================================== */}
          {displayProfile.compatibility && (
            <View style={styles.aiExplainerCard}>
              <View style={styles.aiExplainerHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Sparkles size={16} color="#7C3AED" style={{ marginRight: 6 }} />
                  <Text style={styles.aiExplainerTitle}>AI Match Intelligence</Text>
                </View>
                {renderMinimizeBtn(isAiMatchExpanded, () => setIsAiMatchExpanded(!isAiMatchExpanded))}
              </View>

              {isAiMatchExpanded && (
                <>
                  <Text style={styles.aiSectionSubheading}>Why You Matched</Text>
                  {displayProfile.compatibility.whyYouMatched.map((reason, idx) => (
                    <View key={idx} style={styles.whyItemRow}>
                      <CheckCircle2 size={14} color="#059669" style={{ marginRight: 6, marginTop: 2 }} />
                      <Text style={styles.whyItemText}>{reason}</Text>
                    </View>
                  ))}

                  {displayProfile.compatibility.thingsToDiscuss.length > 0 && (
                    <>
                      <Text style={[styles.aiSectionSubheading, { marginTop: 14 }]}>
                        Points for Meaningful Conversation
                      </Text>
                      {displayProfile.compatibility.thingsToDiscuss.map((item, idx) => (
                        <View key={idx} style={styles.discussItemCard}>
                          <Text style={styles.discussTopic}>{item.topic}</Text>
                          <Text style={styles.discussNote}>{item.note}</Text>
                        </View>
                      ))}
                    </>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* ==================================================== */}
      {/* 7. BOTTOM STICKY ACTION BAR                          */}
      {/* ==================================================== */}
      <View style={styles.bottomActionBar}>
        {isConnected ? (
          /* Connected State: Chat & Plan Together */
          <View style={styles.connectedActionRow}>
            <TouchableOpacity
              style={styles.chatActionBtn}
              activeOpacity={0.85}
              onPress={() => {
                if (onOpenChat) onOpenChat();
              }}
            >
              <MessageCircle size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Heart size={14} color="#FFFFFF" fill="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.chatActionBtnText}>Open Chat 💖</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.planTogetherBtn}
              activeOpacity={0.85}
              onPress={() => setIsPlanTogetherOpen(true)}
            >
              <Sparkles size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.planTogetherBtnText}>Plan Together</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Standard Discovery Action Bar: Save | Request Intro | More */
          <View style={styles.standardActionRow}>
            {/* Save / Bookmark Button */}
            <TouchableOpacity style={styles.sideActionBtn} activeOpacity={0.8} onPress={handleToggleSave}>
              <View style={styles.circleActionWrap}>
                <Svg width={20} height={20} viewBox="0 0 24 24" fill={saved ? '#EC4899' : 'none'}>
                  <Path
                    d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
                    stroke={saved ? '#EC4899' : '#475569'}
                    strokeWidth="2"
                  />
                </Svg>
              </View>
              <Text style={[styles.actionBtnLabel, saved && { color: '#EC4899', fontWeight: '700' }]}>
                {saved ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>

            {/* Primary Request Introduction Gradient Button */}
            <TouchableOpacity
              style={styles.requestIntroBtn}
              activeOpacity={0.9}
              onPress={handleLaunchRequestIntro}
            >
              <Svg
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                width="100%"
                height="100%"
              >
                <Defs>
                  <SvgGradient id="reqGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <Stop offset="0%" stopColor="#FF4D6D" />
                    <Stop offset="50%" stopColor="#EF4444" />
                    <Stop offset="100%" stopColor="#DC2626" />
                  </SvgGradient>
                </Defs>
                <Path
                  d={`M0 0 H${width * 0.65} V56 H0 Z`}
                  fill="url(#reqGrad)"
                />
              </Svg>

              <View style={styles.requestBtnContent}>
                <View style={styles.sendIconWrap}>
                  <Heart size={18} color="#FFFFFF" fill="#FFFFFF" />
                </View>
                <View style={styles.reqBtnTexts}>
                  <Text style={styles.reqBtnTitle}>Request Introduction 💖</Text>
                  <Text style={styles.reqBtnSubtitle}>Choose what information to share &gt;</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* More Action Button */}
            <TouchableOpacity
              style={styles.sideActionBtn}
              activeOpacity={0.8}
              onPress={() => setIsMoreSheetOpen(true)}
            >
              <View style={styles.circleActionWrap}>
                <Text style={styles.actionMoreDots}>···</Text>
              </View>
              <Text style={styles.actionBtnLabel}>More</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ==================================================== */}
      {/* 8. MODALS & AUXILIARY CONTROLS                       */}
      {/* ==================================================== */}

      {/* Fullscreen Photo Lightbox */}
      <FullscreenPhotoViewerModal
        visible={isPhotoViewerOpen}
        photos={profile.photos}
        initialIndex={selectedPhotoIndex}
        userName={profile.name}
        isVerified={profile.isVerified}
        compatibilityPercentage={profile.compatibilityPercentage}
        onClose={() => setIsPhotoViewerOpen(false)}
        onRequestIntroduction={handleLaunchRequestIntro}
      />

      {/* More Action Sheet (Save, Share, Report, Block, Hide) */}
      <ProfileMoreActionSheet
        visible={isMoreSheetOpen}
        isSaved={saved}
        userName={profile.name}
        onClose={() => setIsMoreSheetOpen(false)}
        onSendRequest={handleLaunchRequestIntro}
        onToggleSave={handleToggleSave}
        onShare={handleShare}
        onReport={() => setIsReportModalOpen(true)}
        onBlock={() => setIsBlockModalOpen(true)}
        onHide={() => {
          hideProfile(profile.id);
          Alert.alert('Profile Hidden', `${profile.name} has been hidden from your discovery results.`, [
            { text: 'OK', onPress: onBack },
          ]);
        }}
        onNotInterested={() => {
          setNotInterested(profile.id);
          Alert.alert('Feedback Recorded', 'Your discovery recommendations have been updated.', [
            { text: 'OK', onPress: onBack },
          ]);
        }}
        onManageNotifications={() => {
          Alert.alert('Notifications', `You will receive updates when ${profile.name} responds or shares a new Margam.`);
        }}
      />

      {/* Confidential Report Modal */}
      <ReportProfileModal
        visible={isReportModalOpen}
        userName={profile.name}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={(reason, details) => {
          reportProfile(profile.id, reason, details);
        }}
      />

      {/* Block Confirmation Dialog */}
      <BlockConfirmationModal
        visible={isBlockModalOpen}
        userName={profile.name}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirmBlock={() => {
          blockProfile(profile.id);
          setIsBlockModalOpen(false);
          Alert.alert('Profile Blocked', `${profile.name} has been blocked and will no longer appear in your app.`, [
            { text: 'OK', onPress: onBack },
          ]);
        }}
      />

      {/* Verified Status Information */}
      <VerificationInfoModal
        visible={isVerificationModalOpen}
        userName={profile.name}
        onClose={() => setIsVerificationModalOpen(false)}
      />

      {/* Location Privacy Info Dialog */}
      <LocationPrivacyInfoModal
        visible={isLocationModalOpen}
        areaName={profile.area}
        onClose={() => setIsLocationModalOpen(false)}
        onExploreMap={() => {
          if (onExploreLocationMap) {
            onExploreLocationMap(profile.city);
          }
        }}
      />

      {/* Margam Detail Modal (Tapping any Margam card) */}
      <MargamDetailModal
        visible={activeMargamDetail !== null}
        margam={activeMargamDetail}
        userName={profile.name}
        onClose={() => setActiveMargamDetail(null)}
        onExploreMargam={(margamName) => {
          setActiveMargamDetail(null);
          if (onExploreMargam) {
            onExploreMargam(margamName);
          }
        }}
      />

      {/* All Margams Sheet (View All link) */}
      <AllMargamsSheetModal
        visible={isAllMargamsOpen}
        margams={profile.margams}
        userName={profile.name}
        onClose={() => setIsAllMargamsOpen(false)}
        onSelectMargam={(m) => {
          setIsAllMargamsOpen(false);
          setActiveMargamDetail(m);
        }}
      />

      {/* Plan Together Modal (Connected state) */}
      <PlanTogetherModal
        visible={isPlanTogetherOpen}
        userName={profile.name}
        onClose={() => setIsPlanTogetherOpen(false)}
        onSelectOption={(planTitle) => {
          Alert.alert('Plan Drafted', `Collaborative plan "${planTitle}" initiated with ${profile.name}!`);
        }}
      />

      {/* 6-Dimension Compatibility Breakdown Modal ("Why this match?") */}
      <CompatibilityBreakdownModal
        visible={isCompatibilityBreakdownOpen}
        candidate={{
          id: profile.id,
          compatibilityPercentage: profile.compatibilityPercentage,
          availability: 'Open to introductions',
          approximateZone: profile.area,
          distanceLabel: profile.discoverySource || 'Shared Margam Match',
          marriageTimelineMatch: true,
          lifestyleMatch: true,
          locationPreferenceMatch: true,
          sharedInterestsCount: profile.margams.filter((m) => m.isShared).length,
          compatibilityReasons: profile.margams.filter((m) => m.isShared).map((m) => `Shared ${m.name}`),
          fuzzedCoordinate: {
            latitude: 10.0159,
            longitude: 76.3419,
            radiusKm: 3.5,
            approximateZoneName: profile.area,
            displayDistance: 'Within 5 km',
          },
          availabilityNote: profile.discoverySource,
        }}
        onClose={() => setIsCompatibilityBreakdownOpen(false)}
        onRequestIntroduction={handleLaunchRequestIntro}
      />

      {/* Access Request Modal */}
      <AccessRequestModal
        visible={isAccessRequestModalOpen}
        section={selectedAccessSection}
        targetUserId={profile.id}
        targetUserName={profile.name}
        requesterId="usr-current-sumod"
        onClose={() => setIsAccessRequestModalOpen(false)}
        onRequestSubmitted={() => {
          refreshDisplayProfile();
        }}
      />

      {/* Granular Selective Introduction Modal */}
      <GranularIntroModal
        visible={isGranularIntroOpen}
        requesterId="usr-current-sumod"
        recipientId={profile.id}
        recipientName={profile.name}
        onClose={() => setIsGranularIntroOpen(false)}
        onIntroSent={() => {
          handleIntroCompleted();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  biodataSectionHeader: {
    marginBottom: 12,
  },
  biodataSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  biodataSectionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  aiExplainerCard: {
    backgroundColor: '#FAF5FF',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  aiExplainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiExplainerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B21A8',
  },
  aiSectionSubheading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3B0764',
    marginBottom: 8,
  },
  whyItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  whyItemText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
    flex: 1,
  },
  discussItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  discussTopic: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  discussNote: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  heroSection: {
    width: width,
    height: 430,
    position: 'relative',
    backgroundColor: '#0F172A',
  },
  heroImage: {
    width: width,
    height: 430,
  },
  topControlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 28 : 12,
    gap: 10,
    zIndex: 10,
  },
  topControlsNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  circleFrostedBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  topRightBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  // Floating Top Pill
  floatingTopStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  floatingPillAccepted: {
    backgroundColor: 'rgba(236, 253, 245, 0.95)',
    borderColor: '#6EE7B7',
  },
  floatingPillPending: {
    backgroundColor: 'rgba(255, 241, 242, 0.95)',
    borderColor: '#FECDD3',
  },
  floatingPillDeclined: {
    backgroundColor: 'rgba(241, 245, 249, 0.95)',
    borderColor: '#CBD5E1',
  },
  floatingPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    marginRight: 8,
  },
  floatingPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  floatingTextAccepted: {
    color: '#065F46',
  },
  floatingTextPending: {
    color: '#9F1239',
  },
  floatingTextDeclined: {
    color: '#475569',
  },
  floatingPillActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  floatingAcceptMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E11D48',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  floatingAcceptMiniBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  floatingDeclineMiniBtn: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  floatingChatMiniBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#059669',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  floatingChatMiniBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  floatingUndoMiniBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  floatingUndoMiniBtnText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '700',
  },

  // Main Profile Status Card
  topStatusCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  topStatusCardAccepted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  topStatusCardPending: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  topStatusCardDeclined: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  topStatusCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  topStatusCardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topStatusCardHeaderTextCol: {
    flex: 1,
  },
  topStatusCardBadgeRow: {
    marginBottom: 2,
  },
  topStatusCardBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topStatusCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  topStatusCardSubtext: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },
  topStatusCardActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  topStatusCardDeclineBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  topStatusCardDeclineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  topStatusCardAcceptBtn: {
    flex: 2,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  topStatusCardAcceptText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topStatusCardChatBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  topStatusCardChatText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topStatusCardUndoBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topStatusCardUndoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  roundedFrostedBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
  },
  moreDotsText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 20,
  },
  compatHeroPill: {
    position: 'absolute',
    bottom: 46,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  compatHeroText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  verticalThumbnailsStrip: {
    position: 'absolute',
    top: 90,
    right: 14,
    gap: 10,
  },
  thumbnailCard: {
    width: 66,
    height: 66,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
  },
  photoCountBadge: {
    position: 'absolute',
    bottom: 3,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  photoCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lockedThumbnailOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  lockedThumbText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 10,
  },
  mainContentCard: {
    marginTop: -32,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nameHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  nameAgeCol: {
    flex: 1,
  },
  nameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileNameText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  availabilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  greenLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  attrChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  attrIcon: {
    marginRight: 6,
  },
  symbolIcon: {
    fontSize: 13,
    marginRight: 6,
  },
  attrText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  margamsSection: {
    marginBottom: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  margamsScrollView: {
    marginHorizontal: -20,
  },
  margamsScrollContent: {
    paddingHorizontal: 20,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  margamCard: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 155,
  },
  margamCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  margamCardEmoji: {
    fontSize: 22,
    marginRight: 10,
  },
  margamCardTextWrap: {
    flex: 1,
  },
  margamCardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  margamCardIntent: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  compatCardContainer: {
    backgroundColor: '#FAF5FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    borderRadius: 20,
    padding: 14,
    marginBottom: 20,
  },
  compatHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  compatCardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B21A8',
  },
  compatBodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minimizeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  minimizeBtnActive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
  },
  minimizeBtnInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
  },
  radialRingWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 10,
  },
  ringCenterText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercentText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  compatTextCol: {
    flex: 1,
    marginRight: 8,
  },
  compatTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  compatSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 2,
  },
  whyThisMatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9D5FF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 12,
  },
  whyThisMatchText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7E22CE',
  },
  aboutCard: {
    backgroundColor: '#FFFDF7',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  lookingForCard: {
    backgroundColor: '#FFFDF7',
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteIcon: {
    fontSize: 18,
    color: '#EA580C',
    marginRight: 6,
    fontWeight: '900',
  },
  targetIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  aboutCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  aboutCardBody: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 14,
  },
  prefSubCardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  prefSubCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  prefIcon: {
    marginBottom: 4,
  },
  prefEmojiIcon: {
    fontSize: 15,
    marginBottom: 4,
  },
  prefLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 2,
  },
  prefVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'android' ? 20 : 34,
  },
  standardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sideActionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActionWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionMoreDots: {
    fontSize: 20,
    fontWeight: '900',
    color: '#475569',
    lineHeight: 20,
  },
  actionBtnLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  requestIntroBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  requestBtnContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  sendIconWrap: {
    marginRight: 10,
  },
  reqBtnTexts: {
    alignItems: 'flex-start',
  },
  reqBtnTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  reqBtnSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 1,
  },
  connectedActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chatActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  chatActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planTogetherBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BE123C',
    borderRadius: 16,
    paddingVertical: 14,
    shadowColor: '#BE123C',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  planTogetherBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
