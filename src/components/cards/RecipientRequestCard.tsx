// MARGAM - Recipient Request Screen Card (Section 5 & 6)
// Displays ONLY the fields voluntarily shared by the requester + "Why Margam thinks you are compatible"

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { IntroductionRequest } from '../../types';
import {
  Check,
  X,
  HelpCircle,
  ShieldAlert,
  MapPin,
  Briefcase,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Navigation,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

interface RecipientRequestCardProps {
  request: IntroductionRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
  onAskMoreInfo: (requestId: string) => void;
  onBlock?: (requestId: string) => void;
  onReport?: (requestId: string) => void;
}

export const RecipientRequestCard: React.FC<RecipientRequestCardProps> = ({
  request,
  onAccept,
  onDecline,
  onAskMoreInfo,
  onBlock,
  onReport,
}) => {
  const { requesterRevealedData, routeDetails } = request;
  const [showFullMenu, setShowFullMenu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.cardContainer}>
      {/* Top Banner */}
      <View style={styles.topBanner}>
        <View style={styles.titleGroup}>
          <Text style={styles.bannerSubtitle}>Incoming Introduction</Text>
          <Text style={styles.bannerTitle}>Someone Wants to Connect</Text>
        </View>

        <View style={styles.compatPill}>
          <Text style={styles.compatPillText}>
            {request.compatibilityPercentage}% Match
          </Text>
        </View>
      </View>

      {/* Profile Overview (Strictly revealed fields only) */}
      <View style={styles.profileSection}>
        {requesterRevealedData.profilePhotoUrl ? (
          <Image
            source={{ uri: requesterRevealedData.profilePhotoUrl }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>Photo Private</Text>
          </View>
        )}

        <View style={styles.profileDetails}>
          <Text style={styles.nameAge}>
            {requesterRevealedData.firstName || 'Candidate'}
            {requesterRevealedData.age ? `, ${requesterRevealedData.age}` : ''}
          </Text>

          {requesterRevealedData.city && (
            <View style={styles.iconInfoRow}>
              <MapPin size={13} color={COLORS.primary} />
              <Text style={styles.infoText}>
                {requesterRevealedData.city}
                {requesterRevealedData.area ? `, ${requesterRevealedData.area}` : ''}
              </Text>
            </View>
          )}

          {requesterRevealedData.profession && (
            <View style={styles.iconInfoRow}>
              <Briefcase size={13} color={COLORS.routeCyan} />
              <Text style={styles.infoText}>{requesterRevealedData.profession}</Text>
            </View>
          )}

          {requesterRevealedData.education && (
            <View style={styles.iconInfoRow}>
              <GraduationCap size={13} color={COLORS.textSecondary} />
              <Text style={styles.infoText}>{requesterRevealedData.education}</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setIsExpanded((expanded) => !expanded)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={isExpanded ? 'Show less request details' : 'Review full introduction'}
        accessibilityState={{ expanded: isExpanded }}
      >
        <Text style={styles.expandButtonText}>
          {isExpanded ? 'Show less details' : 'Review full introduction'}
        </Text>
        {isExpanded ? <ChevronUp size={17} color="#2563EB" /> : <ChevronDown size={17} color="#2563EB" />}
      </TouchableOpacity>

      {!isExpanded && (
        <View style={styles.collapsedPrivacyNote}>
          <ShieldAlert size={14} color="#15803D" />
          <Text style={styles.collapsedPrivacyText}>
            Only details selected for this request are shown. Contact information and precise location remain private.
          </Text>
        </View>
      )}

      {isExpanded && (
        <View style={styles.expandedDetails}>
      {/* Personal Message Note */}
      {(request.customMessage || requesterRevealedData.shortIntro) && (
        <View style={styles.introBox}>
          <Text style={styles.introBoxTitle}>Personal Message:</Text>
          <Text style={styles.introText}>
            "{request.customMessage || requesterRevealedData.shortIntro}"
          </Text>
        </View>
      )}

      {/* What Caught Their Attention (Reasons) */}
      {request.selectedInterestReasons && request.selectedInterestReasons.length > 0 && (
        <View style={styles.reasonsHighlightCard}>
          <Text style={styles.reasonsHighlightTitle}>What caught their attention:</Text>
          <View style={styles.reasonsChipsWrap}>
            {request.selectedInterestReasons.map((reason, idx) => (
              <View key={`reason_${idx}`} style={styles.reasonBadge}>
                <Text style={styles.reasonBadgeText}>{reason}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Travel Context if Route Request */}
      {routeDetails && (
        <View style={styles.routeContextCard}>
          <View style={styles.routeContextTitleRow}>
            <Navigation size={13} color={COLORS.routeAmber} />
            <Text style={styles.routeContextTitle}>Route Corridor Connection</Text>
          </View>
          <Text style={styles.routeContextDetails}>
            {routeDetails.originCity} &rarr; {routeDetails.destinationCity} • {routeDetails.travelDate} ({routeDetails.estimatedArrivalTime})
          </Text>
          {routeDetails.potentialPublicVenue && (
            <Text style={styles.routeVenueNotice}>
              Suggested Public Venue: {routeDetails.potentialPublicVenue}
            </Text>
          )}
        </View>
      )}

      {/* Only show a score when a real numeric value exists. */}
      {request.includeMatchingDetails !== false &&
        typeof request.compatibilityPercentage === 'number' && (
          <View style={styles.matchHighlightsBox}>
            <View style={styles.reasonsHeader}>
              <Sparkles size={13} color="#E11D48" />
              <Text style={[styles.reasonsHeaderText, { color: '#9F1239' }]}>Match Highlights</Text>
            </View>
            <View style={styles.matchHighlightsGrid}>
              <View style={styles.matchMiniPill}>
                <Text style={styles.matchMiniPillText}>
                  {request.compatibilityPercentage}% compatibility estimate
                </Text>
              </View>
            </View>
            <Text style={styles.matchDisclaimer}>
              An estimate, not a guarantee. Only available matching data is displayed.
            </Text>
          </View>
        )}

      {/* Acceptance Meaning Notice */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Accepting only signifies: "I am comfortable continuing this introduction." Your full private details remain protected.
        </Text>
      </View>

        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <View style={styles.primaryButtonsRow}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => onAccept(request.id)}
            activeOpacity={0.85}
          >
            <Heart size={16} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.acceptButtonText}>Accept 💖</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.declineButton}
            onPress={() => onDecline(request.id)}
            activeOpacity={0.85}
          >
            <X size={16} color={COLORS.textSecondary} />
            <Text style={styles.declineButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.secondaryActionsRow}>
          <TouchableOpacity
            style={styles.textAction}
            onPress={() => onAskMoreInfo(request.id)}
          >
            <HelpCircle size={13} color={COLORS.routeCyan} />
            <Text style={[styles.textActionLabel, { color: COLORS.routeCyan }]}>
              Ask for More Information
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.textAction}
            onPress={() => setShowFullMenu(!showFullMenu)}
          >
            <ShieldAlert size={13} color={COLORS.textMuted} />
            <Text style={styles.textActionLabel}>Safety / Block</Text>
          </TouchableOpacity>
        </View>

        {showFullMenu && (
          <View style={styles.safetyMenu}>
            <TouchableOpacity
              style={styles.safetyItem}
              onPress={() => onBlock && onBlock(request.id)}
            >
              <Text style={styles.safetyItemText}>Block this user</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.safetyItem}
              onPress={() => onReport && onReport(request.id)}
            >
              <Text style={[styles.safetyItemText, { color: COLORS.error }]}>
                Report concern to Margam Trust & Safety
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  topBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleGroup: {
    flex: 1,
  },
  bannerSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  compatPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  compatPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  photoPlaceholderText: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
  },
  profileDetails: {
    flex: 1,
    gap: 3,
  },
  nameAge: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  iconInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  expandButton: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  expandButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  collapsedPrivacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 10,
  },
  collapsedPrivacyText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: '#166534',
  },
  expandedDetails: {
    gap: 12,
  },
  matchDisclaimer: {
    fontSize: 10,
    lineHeight: 15,
    color: '#64748B',
  },
  introBox: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#2563EB',
  },
  introBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  introText: {
    fontSize: 12,
    color: '#1E293B',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  routeContextCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  routeContextTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  routeContextTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
  },
  routeContextDetails: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '600',
  },
  routeVenueNotice: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
  },
  reasonsHighlightCard: {
    backgroundColor: '#FFF1F2',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 8,
  },
  reasonsHighlightTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9F1239',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonsChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reasonBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  reasonBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48',
  },
  matchHighlightsBox: {
    backgroundColor: '#FFF1F2',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECDD3',
    gap: 8,
  },
  matchHighlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  matchMiniPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  matchMiniPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  reasonsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  reasonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reasonsHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonsList: {
    gap: 4,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: 12,
    color: '#166534',
  },
  noticeBox: {
    paddingVertical: 2,
  },
  noticeText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 15,
  },
  actionsContainer: {
    gap: 10,
  },
  primaryButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 14,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  textAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  textActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  safetyMenu: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 6,
    marginTop: 4,
  },
  safetyItem: {
    paddingVertical: 4,
  },
  safetyItemText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
});
