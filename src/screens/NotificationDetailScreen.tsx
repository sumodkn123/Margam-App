// MARGAM — Notification Detail Screen
// Matches Screen 2 in reference image:
// - Header with back arrow and "Notification Details" title
// - Romantic hero card with paper airplane path, floating hearts, 84px avatar with verified badge
// - "Ananya, 27" / "sent you an introduction request" / "5 minutes ago"
// - [Accept Request] & [View Full Profile] CTA buttons
// - Personal Message quotation card
// - "Why You Might Be Compatible" card with 3 stat tiles (92%, 5 Common Margams, 3 Similar Values)
// - "What They've Shared" 2-column info grid
// - "Key Margams" chips
// - Privacy protected banner & bottom sticky actions

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  MessageCircle,
  Sparkles,
  Heart,
  Lock,
  Briefcase,
  MapPin,
  GraduationCap,
  Users,
  Compass,
  X,
  Check,
  Share2,
} from 'lucide-react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
} from 'react-native-svg';
import {
  NotificationItem,
  NotificationRequestStatus,
  acceptNotificationRequest,
  declineNotificationRequest,
} from '../services/notificationService';

const { width } = Dimensions.get('window');

interface NotificationDetailScreenProps {
  item: NotificationItem;
  onBack: () => void;
  onAcceptRequest: (item: NotificationItem) => void;
  onDeclineRequest: (item: NotificationItem) => void;
  onViewCandidateProfile: (
    item: NotificationItem,
    requestStatus?: 'pending' | 'accepted' | 'declined'
  ) => void;
  onOpenChat: (item: NotificationItem) => void;
}

export const NotificationDetailScreen: React.FC<NotificationDetailScreenProps> = ({
  item: initialItem,
  onBack,
  onAcceptRequest,
  onDeclineRequest,
  onViewCandidateProfile,
  onOpenChat,
}) => {
  const [item, setItem] = useState<NotificationItem>(initialItem);
  const [requestStatus, setRequestStatus] = useState<NotificationRequestStatus>(
    initialItem.requestStatus || 'pending'
  );

  const handleAccept = () => {
    acceptNotificationRequest(item.id);
    setRequestStatus('accepted');
    setItem((prev) => ({ ...prev, requestStatus: 'accepted' }));
    onAcceptRequest(item);
  };

  const handleDecline = () => {
    declineNotificationRequest(item.id);
    setRequestStatus('declined');
    setItem((prev) => ({ ...prev, requestStatus: 'declined' }));
    onDeclineRequest(item);
  };

  const handleViewProfile = () => {
    onViewCandidateProfile(item, requestStatus);
  };

  const handleChat = () => {
    onOpenChat(item);
  };

  const details = item.candidateDetails || {
    age: `${item.senderAge || 27} years`,
    location: 'Kochi, Kerala (5 km away)',
    profession: 'Marketing Professional',
    education: 'Masters - Marketing',
    religion: 'Hindu (Ezhava)',
    maritalStatus: 'Single',
  };

  const margams = item.sharedMargams && item.sharedMargams.length > 0
    ? item.sharedMargams
    : [
        { name: 'Café Business', emoji: '☕', bgColor: '#FFF1F2', textColor: '#C2410C' },
        { name: 'Travel', emoji: '✈️', bgColor: '#EFF6FF', textColor: '#1D4ED8' },
        { name: 'Photography', emoji: '📷', bgColor: '#F3E8FF', textColor: '#7E22CE' },
      ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* TOP HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notification Details</Text>
        </View>

        <TouchableOpacity
          style={styles.headerRightAction}
          activeOpacity={0.7}
          onPress={handleViewProfile}
        >
          <Eye size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* SECTION 1: HERO ROMANTIC CARD                              */}
        {/* Matches Screen 2: Paper plane trail, hearts, avatar, ctas */}
        {/* ========================================================= */}
        <View style={styles.heroCard}>
          {/* Subtle SVG Background Atmosphere */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="heroBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#FFF1F2" stopOpacity="0.95" />
                  <Stop offset="60%" stopColor="#FDF2F8" stopOpacity="0.8" />
                  <Stop offset="100%" stopColor="#F5F3FF" stopOpacity="0.9" />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" rx="24" fill="url(#heroBgGrad)" />

              {/* Romantic Flight Path Dotted Trail */}
              <Path
                d="M 28,120 Q 80,40 180,65 T 320,35"
                fill="none"
                stroke="#FDA4AF"
                strokeWidth="2"
                strokeDasharray="5,6"
                opacity="0.8"
              />

              {/* Paper Airplane at the end of path */}
              <G transform="translate(315, 24) rotate(15)">
                <Path
                  d="M0,0 L20,7 L3,14 L0,0 Z M3,14 L7,8"
                  fill="#F43F5E"
                  stroke="#E11D48"
                  strokeWidth="1"
                />
              </G>

              {/* Delicate floating hearts */}
              <Path
                d="M48,50 C48,46 44,42 40,42 C36,42 34,45 34,48 C34,53 40,58 40,58 C40,58 46,53 46,48 Z"
                fill="#FB7185"
                opacity="0.6"
              />
              <Path
                d="M295,95 C295,92 292,89 289,89 C286,89 284,91 284,93 C284,97 289,101 289,101 C289,101 294,97 294,93 Z"
                fill="#EC4899"
                opacity="0.5"
              />
            </Svg>
          </View>

          {/* AVATAR WITH VERIFIED BADGE */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: item.senderAvatar }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
            {item.senderVerified !== false && (
              <View style={styles.verifiedCheckBadge}>
                <CheckCircle2 size={16} color="#FFFFFF" fill="#2563EB" />
              </View>
            )}
          </View>

          {/* PERSON NAME & SUBTITLE */}
          <View style={styles.nameSection}>
            <Text style={styles.senderNameText}>
              {item.senderName}
              {item.senderAge ? `, ${item.senderAge}` : ''}
            </Text>
            <Text style={styles.requestSubtext}>{item.message}</Text>
          </View>

          {/* TIMESTAMP */}
          <View style={styles.timestampRow}>
            <Clock size={13} color="#94A3B8" />
            <Text style={styles.timestampText}>{item.time}</Text>
          </View>

          {/* ACTION BUTTONS (Dynamic based on request status) */}
          <View style={styles.heroActionBtnsContainer}>
            {requestStatus === 'pending' && (
              <>
                <TouchableOpacity
                  style={styles.heroAcceptBtn}
                  activeOpacity={0.85}
                  onPress={handleAccept}
                >
                  <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
                    <Defs>
                      <LinearGradient id="acceptGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#F43F5E" />
                        <Stop offset="100%" stopColor="#E11D48" />
                      </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" rx="14" fill="url(#acceptGrad)" />
                  </Svg>
                  <View style={styles.heroAcceptBtnInner}>
                    <Check size={18} color="#FFFFFF" strokeWidth={2.8} />
                    <Text style={styles.heroAcceptBtnText}>Accept Request</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.heroViewProfileBtn}
                  activeOpacity={0.8}
                  onPress={handleViewProfile}
                >
                  <Eye size={18} color="#475569" strokeWidth={2.2} />
                  <Text style={styles.heroViewProfileBtnText}>View Full Profile</Text>
                </TouchableOpacity>
              </>
            )}

            {requestStatus === 'accepted' && (
              <>
                <View style={styles.acceptedStatusPill}>
                  <CheckCircle2 size={18} color="#10B981" />
                  <Text style={styles.acceptedStatusPillText}>
                    Request Accepted • Connected!
                  </Text>
                </View>

                <View style={styles.heroDoubleRow}>
                  <TouchableOpacity
                    style={[styles.heroAcceptBtn, { flex: 1 }]}
                    activeOpacity={0.85}
                    onPress={handleChat}
                  >
                    <View style={styles.heroAcceptBtnInner}>
                      <MessageCircle size={18} color="#FFFFFF" strokeWidth={2.4} />
                      <Text style={styles.heroAcceptBtnText}>Start Chat</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.heroViewProfileBtn, { flex: 1 }]}
                    activeOpacity={0.8}
                    onPress={handleViewProfile}
                  >
                    <Eye size={18} color="#475569" strokeWidth={2.2} />
                    <Text style={styles.heroViewProfileBtnText}>View Profile</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {requestStatus === 'declined' && (
              <View style={styles.declinedStatusPill}>
                <Text style={styles.declinedStatusText}>Request Declined</Text>
                <TouchableOpacity onPress={handleAccept} activeOpacity={0.8}>
                  <Text style={styles.undoText}>Undo & Accept</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* ========================================================= */}
        {/* SECTION 2: PERSONAL MESSAGE QUOTE CARD                    */}
        {/* Matches Screen 2: "Personal Message" with quote bubble    */}
        {/* ========================================================= */}
        {Boolean(item.personalMessage) && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <View style={styles.sectionIconCircle}>
                <MessageCircle size={15} color="#E11D48" />
              </View>
              <Text style={styles.sectionTitle}>Personal Message</Text>
            </View>

            <View style={styles.personalMessageCard}>
              <Text style={styles.quoteMarkTop}>“</Text>
              <Text style={styles.personalMessageBodyText}>
                {item.personalMessage}
              </Text>
              <Text style={styles.quoteMarkBottom}>”</Text>
            </View>
          </View>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: WHY YOU MIGHT BE COMPATIBLE                     */}
        {/* Matches Screen 2: 3 stat tiles (92%, 5 Common, 3 Values)  */}
        {/* ========================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Sparkles size={15} color="#2563EB" />
            </View>
            <Text style={styles.sectionTitle}>Why You Might Be Compatible</Text>
          </View>

          <View style={styles.compatibilityCard}>
            {/* 3 STAT TILES */}
            <View style={styles.compatTilesRow}>
              {/* Tile 1: 92% Compatibility */}
              <View style={[styles.compatTile, { backgroundColor: '#FFF1F2' }]}>
                <Text style={[styles.compatTileVal, { color: '#E11D48' }]}>
                  {item.compatibilityPercentage || 92}%
                </Text>
                <Text style={styles.compatTileLabel}>Compatibility</Text>
              </View>

              {/* Tile 2: 5 Common Margams */}
              <View style={[styles.compatTile, { backgroundColor: '#EFF6FF' }]}>
                <Text style={[styles.compatTileVal, { color: '#2563EB' }]}>
                  {item.commonMargamsCount || 5}
                </Text>
                <Text style={styles.compatTileLabel}>Common Margams</Text>
              </View>

              {/* Tile 3: 3 Similar Values */}
              <View style={[styles.compatTile, { backgroundColor: '#F3E8FF' }]}>
                <Text style={[styles.compatTileVal, { color: '#7E22CE' }]}>
                  {item.similarValuesCount || 3}
                </Text>
                <Text style={styles.compatTileLabel}>Similar Values</Text>
              </View>
            </View>

            {/* Explanation text */}
            <View style={styles.compatSummaryRow}>
              <Heart size={14} color="#E11D48" fill="#E11D48" style={{ marginTop: 2 }} />
              <Text style={styles.compatSummaryText}>
                You both share entrepreneurial dreams in Café Business, love regular travel,
                and maintain progressive cultural outlooks in the Kochi corridor.
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* SECTION 4: WHAT THEY'VE SHARED                            */}
        {/* Matches Screen 2: 2-column info grid cards                */}
        {/* ========================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <Users size={15} color="#16A34A" />
            </View>
            <Text style={styles.sectionTitle}>What They’ve Shared</Text>
          </View>

          <View style={styles.sharedInfoGrid}>
            {/* Age */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{details.age}</Text>
            </View>

            {/* Location */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{details.location}</Text>
            </View>

            {/* Profession */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Profession</Text>
              <Text style={styles.infoValue}>{details.profession}</Text>
            </View>

            {/* Education */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Education</Text>
              <Text style={styles.infoValue}>{details.education}</Text>
            </View>

            {/* Religion & Community */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Religion</Text>
              <Text style={styles.infoValue}>{details.religion}</Text>
            </View>

            {/* Marital Status */}
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Marital Status</Text>
              <Text style={styles.infoValue}>{details.maritalStatus}</Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* SECTION 5: KEY MARGAMS                                    */}
        {/* Matches Screen 2: Chips with icons                        */}
        {/* ========================================================= */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Compass size={15} color="#D97706" />
            </View>
            <Text style={styles.sectionTitle}>Key Margams</Text>
          </View>

          <View style={styles.margamsChipList}>
            {margams.map((mg, idx) => (
              <View
                key={idx}
                style={[
                  styles.margamChip,
                  { backgroundColor: mg.bgColor || '#F1F5F9' },
                ]}
              >
                <Text style={styles.margamEmoji}>{mg.emoji}</Text>
                <Text
                  style={[
                    styles.margamName,
                    { color: mg.textColor || '#1E293B' },
                  ]}
                >
                  {mg.name}
                </Text>
              </View>
            ))}

            <View style={[styles.margamChip, styles.moreMargamsChip]}>
              <Text style={styles.moreMargamsText}>+3 more</Text>
            </View>
          </View>
        </View>

        {/* ========================================================= */}
        {/* SECTION 6: PRIVACY PROTECTION BANNER                      */}
        {/* ========================================================= */}
        <View style={styles.privacyBanner}>
          <View style={styles.lockIconCircle}>
            <Lock size={16} color="#64748B" />
          </View>
          <View style={styles.privacyTextCol}>
            <Text style={styles.privacyTitle}>Your privacy is protected</Text>
            <Text style={styles.privacySubtitle}>
              Contact details will only be shared after mutual acceptance.
            </Text>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ========================================================= */}
      {/* FIXED BOTTOM ACTION BAR                                   */}
      {/* ========================================================= */}
      <View style={styles.bottomActionBar}>
        {requestStatus === 'pending' ? (
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity
              style={styles.bottomDeclineBtn}
              activeOpacity={0.8}
              onPress={handleDecline}
            >
              <X size={18} color="#64748B" strokeWidth={2.4} />
              <Text style={styles.bottomDeclineBtnText}>Decline</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomAcceptBtn}
              activeOpacity={0.85}
              onPress={handleAccept}
            >
              <Heart size={18} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.bottomAcceptBtnText}>Accept Request 💖</Text>
            </TouchableOpacity>
          </View>
        ) : requestStatus === 'accepted' ? (
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity
              style={styles.bottomAcceptedStartChatBtn}
              activeOpacity={0.85}
              onPress={handleChat}
            >
              <Heart size={18} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.bottomAcceptedStartChatText}>Start Chat with {item.senderName} 💖</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity
              style={styles.bottomUndoBtn}
              activeOpacity={0.8}
              onPress={handleAccept}
            >
              <Text style={styles.bottomUndoBtnText}>Undo & Accept Request</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerRightAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },

  // HERO CARD
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE4E6',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#E11D48',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatarWrapper: {
    position: 'relative',
    marginTop: 6,
    marginBottom: 12,
  },
  avatarImage: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  verifiedCheckBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 2,
  },
  nameSection: {
    alignItems: 'center',
    marginBottom: 6,
  },
  senderNameText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  requestSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 18,
  },
  timestampText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94A3B8',
  },
  heroActionBtnsContainer: {
    width: '100%',
    gap: 10,
  },
  heroAcceptBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E11D48',
  },
  heroAcceptBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroAcceptBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  heroViewProfileBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroViewProfileBtnText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  heroDoubleRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  acceptedStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  acceptedStatusPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
  },
  declinedStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  declinedStatusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  undoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E11D48',
  },

  // COMMON SECTION HEADERS
  sectionContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },

  // PERSONAL MESSAGE
  personalMessageCard: {
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#E11D48',
  },
  quoteMarkTop: {
    fontSize: 24,
    lineHeight: 20,
    color: '#FDA4AF',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  personalMessageBodyText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#334155',
    fontStyle: 'italic',
    paddingHorizontal: 4,
  },
  quoteMarkBottom: {
    fontSize: 24,
    lineHeight: 20,
    color: '#FDA4AF',
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  // COMPATIBILITY
  compatibilityCard: {
    gap: 12,
  },
  compatTilesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  compatTile: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compatTileVal: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  compatTileLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  compatSummaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
  },
  compatSummaryText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
  },

  // WHAT THEY'VE SHARED GRID
  sharedInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoCard: {
    width: (width - 64 - 8) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },

  // KEY MARGAMS
  margamsChipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  margamChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  margamEmoji: {
    fontSize: 15,
  },
  margamName: {
    fontSize: 13,
    fontWeight: '700',
  },
  moreMargamsChip: {
    backgroundColor: '#F1F5F9',
  },
  moreMargamsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },

  // PRIVACY BANNER
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lockIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  privacyTextCol: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  privacySubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    lineHeight: 16,
  },

  // BOTTOM ACTION BAR
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  bottomButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bottomDeclineBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bottomDeclineBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  bottomAcceptBtn: {
    flex: 2,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomAcceptBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomAcceptedStartChatBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bottomAcceptedStartChatText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomUndoBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomUndoBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E11D48',
  },
});
