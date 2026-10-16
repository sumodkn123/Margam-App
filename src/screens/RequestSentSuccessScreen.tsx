// MARGAM — Screen 3: Request Sent Successfully! Confirmation Screen
// Implements Screen 3 of the 3-screen reference design (media_1791092535059.jpg):
// - Flying paper plane illustration with celebratory hearts & confetti
// - "Request Sent Successfully!" heading and status description
// - 4-stage stepper timeline: Request Sent -> Notified -> They Review -> Response
// - "Here's what you sent" card with "Edit" pencil link, sent message, and interest tags
// - "Ananya's Profile Summary" card with "View Full Profile >" and 8-item biodata snapshot grid
// - Action buttons: "Back to Explore" (outline) and "View Full Profile" (filled gradient)

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import {
  Check,
  Edit2,
  ChevronRight,
  Briefcase,
  GraduationCap,
  MapPin,
  Heart,
  Globe,
  Coffee,
  X,
  Send,
  Sparkles,
  User,
  Compass,
} from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle, Path } from 'react-native-svg';
import {
  AnonymousCandidate,
  DetailedOtherUserProfile,
  UserShareSelection,
} from '../types';
import { AnimatedRequestSentIcon } from '../components/animation/AnimatedRequestSentIcon';
import { AnimatedRequestStepper } from '../components/animation/AnimatedRequestStepper';
import { LoveBubbleRain } from '../components/animation/LoveBubbleRain';

const { width } = Dimensions.get('window');

interface RequestSentSuccessScreenProps {
  candidate: AnonymousCandidate;
  recipientProfile?: DetailedOtherUserProfile | null;
  sentMessage: string;
  selectedReasons: string[];
  shareSelection: UserShareSelection;
  onEdit: () => void;
  onBackToExplore: () => void;
  onViewFullProfile: () => void;
  onClose: () => void;
}

export const RequestSentSuccessScreen: React.FC<RequestSentSuccessScreenProps> = ({
  candidate,
  recipientProfile,
  sentMessage,
  selectedReasons,
  shareSelection,
  onEdit,
  onBackToExplore,
  onViewFullProfile,
  onClose,
}) => {
  const recipientName = recipientProfile?.name || candidate.approximateZone.split(' ')[0] || 'Ananya';
  const recipientAvatar =
    recipientProfile?.photos.find((p) => p.isPrimary)?.url ||
    recipientProfile?.photos[0]?.url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';

  // Count shared sections for snapshot summary
  const countSharedSections = () => {
    let count = 0;
    if (shareSelection.fullBio) count++;
    if (shareSelection.education) count++;
    if (shareSelection.lifestylePreferences) count++;
    if (shareSelection.familyOverview) count++;
    return count;
  };

  const sharedSectionsCount = countSharedSections();

  // Fallback Margams matching reference Screen 3
  const fallbackMargams = [
    { emoji: '☕', name: 'Café Business' },
    { emoji: '✈', name: 'Travel' },
    { emoji: '📷', name: 'Photography' },
  ];

  const margamsList =
    recipientProfile?.margams && recipientProfile.margams.length > 0
      ? recipientProfile.margams
      : fallbackMargams;

  const displayMargams = margamsList.slice(0, 3);
  const remainingMargamsCount =
    margamsList.length > 3
      ? margamsList.length - 3
      : (recipientProfile?.margams && recipientProfile.margams.length > 0 ? 0 : 3);

  const margamChipStyles = [
    { bg: '#FFF7ED', border: '#FED7AA', text: '#EA580C' }, // Peach / orange
    { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB' }, // Soft blue
    { bg: '#FAF5FF', border: '#E9D5FF', text: '#9333EA' }, // Soft purple
  ];

  const locationDisplay = recipientProfile?.area
    ? `${recipientProfile.area}, ${recipientProfile.city || 'Kochi'}`
    : recipientProfile?.city || 'Fort Kochi, Kochi';

  const religionDisplay = recipientProfile?.religion
    ? `${recipientProfile.religion}${recipientProfile.community ? `, ${recipientProfile.community}` : ''}`
    : 'Hindu, Nair';

  const languagesList =
    recipientProfile?.languages && recipientProfile.languages.length > 0
      ? recipientProfile.languages
      : ['English', 'Malayalam', 'Hindi'];
  const languagesDisplay =
    languagesList.length > 2
      ? `${languagesList.slice(0, 2).join(', ')} +${languagesList.length - 2}`
      : languagesList.join(', ');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. TOP NAV BAR */}
      <View style={styles.topNav}>
        <View style={{ width: 40 }} />
        <Text style={styles.navTitle}>Request Sent</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
          <X size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. CELEBRATION HERO SECTION */}
        <View style={styles.heroSection}>
          {/* Confined Love Bubble Rain in Top Hero Area Only */}
          <LoveBubbleRain height={210} />

          {/* 2. CELEBRATION HERO SECTION (Animated Flight Icon) */}
          <View style={styles.planeIllustrationContainer}>
            <AnimatedRequestSentIcon size={140} interactive />
          </View>

          <Text style={styles.heroTitle}>Request Sent Successfully!</Text>
          <Text style={styles.heroSubtitle}>
            Your interest has been sent to {recipientName}.
          </Text>
        </View>

        {/* 3. 4-STAGE STEPPER TIMELINE (Animated Flow & Radar Broadcast) */}
        <AnimatedRequestStepper currentStage={2} />

        {/* 4. "HERE'S WHAT YOU SENT" CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Here's what you sent</Text>

            <TouchableOpacity style={styles.editActionBtn} onPress={onEdit} activeOpacity={0.7}>
              <Edit2 size={13} color="#2563EB" />
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Sent message text bubble */}
          <View style={styles.messageBubble}>
            <Text style={styles.messageBubbleText}>
              "{sentMessage || 'Hi Ananya, I really liked your profile. We both share an interest in travel and café culture. Would love to connect and know you better.'}"
            </Text>
          </View>

          {/* Why you're interested */}
          {selectedReasons.length > 0 && (
            <View style={styles.reasonsContainer}>
              <Text style={styles.reasonsSectionTitle}>Why you're interested</Text>
              <View style={styles.reasonsTagsWrap}>
                {selectedReasons.map((reason, index) => {
                  const isPink = index === 0;
                  const isBlue = index === 1;
                  return (
                    <View
                      key={reason}
                      style={[
                        styles.reasonChip,
                        isPink && styles.reasonChipPink,
                        isBlue && styles.reasonChipBlue,
                        !isPink && !isBlue && styles.reasonChipPurple,
                      ]}
                    >
                      <Text
                        style={[
                          styles.reasonChipText,
                          isPink && styles.reasonChipTextPink,
                          isBlue && styles.reasonChipTextBlue,
                          !isPink && !isBlue && styles.reasonChipTextPurple,
                        ]}
                      >
                        {reason}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Shared privacy summary */}
          <View style={styles.privacySummaryPill}>
            <Sparkles size={13} color="#059669" />
            <Text style={styles.privacySummaryText}>
              Shared: Essential Identity + {sharedSectionsCount} alignment section{sharedSectionsCount === 1 ? '' : 's'}
            </Text>
          </View>
        </View>

        {/* 5. "ANANYA'S PROFILE SUMMARY" CARD */}
        <View style={styles.card}>
          {/* Enhanced Header with Verified Tag and Subtle Action Pill */}
          <View style={styles.summaryCardHeader}>
            <View style={styles.summaryHeaderLeft}>
              <View style={styles.summaryTitleRow}>
                <Text style={styles.summaryCardTitle}>{recipientName}'s Profile Overview</Text>
                <View style={styles.verifiedTag}>
                  <Check size={10} color="#059669" strokeWidth={3} />
                  <Text style={styles.verifiedTagText}>Verified</Text>
                </View>
              </View>
              <Text style={styles.summarySubtitle}>Key biodata & verified background details</Text>
            </View>

            <TouchableOpacity
              style={styles.viewFullProfilePill}
              onPress={onViewFullProfile}
              activeOpacity={0.7}
            >
              <Text style={styles.viewFullProfilePillText}>Full Profile</Text>
              <ChevronRight size={13} color="#9333EA" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* 1. PERSONAL & PHYSICAL ATTRIBUTES */}
          <View style={styles.groupSectionHeader}>
            <View style={[styles.groupDot, { backgroundColor: '#E11D48' }]} />
            <Text style={styles.groupSectionTitle}>PERSONAL & PHYSICAL</Text>
            <View style={styles.groupLine} />
          </View>

          <View style={styles.biodataGridContainer}>
            {/* ROW 1: Age & Height */}
            <View style={styles.biodataRow}>
              {/* Age */}
              <View style={styles.biodataCard}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#FDF2F8' }]}>
                  <User size={16} color="#DB2777" />
                </View>
                <View style={styles.biodataContent}>
                  <Text style={styles.biodataLabel}>Age</Text>
                  <Text style={styles.biodataValue} numberOfLines={1}>
                    {recipientProfile?.age || 27} years
                  </Text>
                </View>
              </View>

              {/* Height */}
              <View style={styles.biodataCard}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#ECFEFF' }]}>
                  <Svg width={16} height={16} viewBox="0 0 24 24">
                    <Path
                      d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4"
                      stroke="#0891B2"
                      strokeWidth={2.2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                </View>
                <View style={styles.biodataContent}>
                  <Text style={styles.biodataLabel}>Height</Text>
                  <Text style={styles.biodataValue} numberOfLines={1}>
                    {recipientProfile?.height || "5'5\" (165 cm)"}
                  </Text>
                </View>
              </View>
            </View>

            {/* ROW 2: Location & Marital Status */}
            <View style={styles.biodataRow}>
              {/* Location */}
              <View style={styles.biodataCard}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#F0FDF4' }]}>
                  <MapPin size={16} color="#059669" />
                </View>
                <View style={styles.biodataContent}>
                  <Text style={styles.biodataLabel}>Location</Text>
                  <Text style={styles.biodataValue} numberOfLines={1}>
                    {locationDisplay}
                  </Text>
                </View>
              </View>

              {/* Marital Status */}
              <View style={styles.biodataCard}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#FFF1F2' }]}>
                  <Heart size={16} color="#E11D48" />
                </View>
                <View style={styles.biodataContent}>
                  <Text style={styles.biodataLabel}>Status</Text>
                  <Text style={styles.biodataValue} numberOfLines={1}>
                    {recipientProfile?.maritalStatus || 'Never Married'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 2. CAREER & EDUCATION */}
          <View style={[styles.groupSectionHeader, { marginTop: 6 }]}>
            <View style={[styles.groupDot, { backgroundColor: '#2563EB' }]} />
            <Text style={styles.groupSectionTitle}>CAREER & EDUCATION</Text>
            <View style={styles.groupLine} />
          </View>

          <View style={styles.biodataGridContainer}>
            {/* ROW 3: Profession & Education */}
            <View style={styles.biodataRow}>
              {/* Profession */}
              <View style={styles.biodataCard}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#EFF6FF' }]}>
                  <Briefcase size={16} color="#2563EB" />
                </View>
                <View style={styles.biodataContent}>
                  <Text style={styles.biodataLabel}>Profession</Text>
                  <Text style={styles.biodataValue} numberOfLines={1}>
                    {recipientProfile?.profession || 'Data Scientist'}
                  </Text>
                </View>
              </View>

              {/* Education */}
              <View style={styles.biodataCard}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#FFFBEB' }]}>
                  <GraduationCap size={16} color="#D97706" />
                </View>
                <View style={styles.biodataContent}>
                  <Text style={styles.biodataLabel}>Education</Text>
                  <Text style={styles.biodataValue} numberOfLines={1}>
                    {recipientProfile?.education || "MS Data Analytics"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 3. CULTURE & COMMUNITY */}
          <View style={[styles.groupSectionHeader, { marginTop: 6 }]}>
            <View style={[styles.groupDot, { backgroundColor: '#EA580C' }]} />
            <Text style={styles.groupSectionTitle}>CULTURE & COMMUNITY</Text>
            <View style={styles.groupLine} />
          </View>

          <View style={styles.biodataGridContainer}>
            {/* ROW 4: Religion & Languages */}
            <View style={styles.biodataRow}>
              {/* Religion & Community */}
              <View style={styles.biodataCard}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#FFF7ED' }]}>
                  <Sparkles size={16} color="#EA580C" />
                </View>
                <View style={styles.biodataContent}>
                  <Text style={styles.biodataLabel}>Religion & Caste</Text>
                  <Text style={styles.biodataValue} numberOfLines={1}>
                    {religionDisplay}
                  </Text>
                </View>
              </View>

              {/* Languages */}
              <View style={styles.biodataCard}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#FAF5FF' }]}>
                  <Globe size={16} color="#9333EA" />
                </View>
                <View style={styles.biodataContent}>
                  <Text style={styles.biodataLabel}>Languages</Text>
                  <Text style={styles.biodataValue} numberOfLines={1}>
                    {languagesDisplay}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* 4. KEY MARGAMS & PASSIONS */}
          <View style={[styles.groupSectionHeader, { marginTop: 6 }]}>
            <View style={[styles.groupDot, { backgroundColor: '#059669' }]} />
            <Text style={styles.groupSectionTitle}>KEY MARGAMS & PASSIONS</Text>
            <View style={styles.groupLine} />
          </View>

          {/* ROW 5: Key Margams (Full Width Card) */}
          <View style={styles.keyMargamsCard}>
            <View style={styles.keyMargamsHeader}>
              <View style={styles.keyMargamsHeaderLeft}>
                <View style={[styles.biodataIconBadge, { backgroundColor: '#ECFDF5' }]}>
                  <Compass size={16} color="#059669" />
                </View>
                <Text style={styles.biodataLabel}>Key Margams</Text>
              </View>
              <View style={styles.keyMargamsSubBadge}>
                <Text style={styles.keyMargamsSubBadgeText}>Core Paths</Text>
              </View>
            </View>

            <View style={styles.keyMargamsChipsWrap}>
              {displayMargams.map((m, idx) => {
                const colors = margamChipStyles[idx % margamChipStyles.length];
                return (
                  <View
                    key={m.name || idx}
                    style={[
                      styles.keyMargamChip,
                      { backgroundColor: colors.bg, borderColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.keyMargamChipText, { color: colors.text }]}>
                      {m.emoji} {m.name}
                    </Text>
                  </View>
                );
              })}
              {remainingMargamsCount > 0 && (
                <View style={styles.moreMargamsBadge}>
                  <Text style={styles.moreMargamsText}>+{remainingMargamsCount}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 6. FIXED BOTTOM ACTION BAR */}
      <View style={styles.fixedBottomBar}>
        <TouchableOpacity
          style={styles.backToExploreBtn}
          onPress={onBackToExplore}
          activeOpacity={0.8}
        >
          <Text style={styles.backToExploreText}>Back to Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.viewFullProfileBtn}
          onPress={onViewFullProfile}
          activeOpacity={0.88}
        >
          <Svg width="100%" height={52} style={StyleSheet.absoluteFill}>
            <Defs>
              <LinearGradient id="viewProfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#FB7185" />
                <Stop offset="50%" stopColor="#F43F5E" />
                <Stop offset="100%" stopColor="#E11D48" />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height={52} rx={16} fill="url(#viewProfGrad)" />
          </Svg>
          <Text style={styles.viewFullProfileBtnText}>View Full Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  planeIllustrationContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  floatingHeartBadge: {
    position: 'absolute',
    top: 6,
    right: 14,
    backgroundColor: '#FFF1F2',
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryMiniAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: '#FB7185',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  editActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  messageBubble: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
  },
  messageBubbleText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 19,
  },
  reasonsContainer: {
    gap: 8,
  },
  reasonsSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  reasonsTagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  reasonChipPink: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  reasonChipBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  reasonChipPurple: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
  },
  reasonChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reasonChipTextPink: {
    color: '#E11D48',
  },
  reasonChipTextBlue: {
    color: '#2563EB',
  },
  reasonChipTextPurple: {
    color: '#9333EA',
  },
  privacySummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    gap: 6,
    alignSelf: 'flex-start',
  },
  privacySummaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
  },
  summaryCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  summaryHeaderLeft: {
    flex: 1,
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  summaryCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    gap: 3,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  summarySubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  viewFullProfilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3E8FF',
    gap: 2,
  },
  viewFullProfilePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9333EA',
  },
  groupSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  groupDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  groupSectionTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  groupLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 8,
  },
  biodataGridContainer: {
    gap: 8,
    width: '100%',
  },
  biodataRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  biodataCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
    minHeight: 56,
  },
  biodataIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  biodataContent: {
    flex: 1,
    justifyContent: 'center',
  },
  biodataLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 1,
  },
  biodataValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  keyMargamsCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 10,
  },
  keyMargamsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keyMargamsHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  keyMargamsSubBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  keyMargamsSubBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
  keyMargamsChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
  },
  keyMargamChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
  },
  keyMargamChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  moreMargamsBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moreMargamsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  fixedBottomBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
  },
  backToExploreBtn: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToExploreText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  viewFullProfileBtn: {
    flex: 1.2,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#E11D48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  viewFullProfileBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
