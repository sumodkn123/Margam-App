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

      {/* Short Introduction Note */}
      {requesterRevealedData.shortIntro && (
        <View style={styles.introBox}>
          <Text style={styles.introBoxTitle}>Personal Introduction:</Text>
          <Text style={styles.introText}>"{requesterRevealedData.shortIntro}"</Text>
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

      {/* "Why Margam thinks you may be compatible" */}
      <View style={styles.reasonsCard}>
        <View style={styles.reasonsHeader}>
          <Sparkles size={13} color={COLORS.primary} />
          <Text style={styles.reasonsHeaderText}>Why Margam Suggests Compatibility</Text>
        </View>

        <View style={styles.reasonsList}>
          <View style={styles.reasonRow}>
            <CheckCircle2 size={13} color={COLORS.privacyAccepted} />
            <Text style={styles.reasonText}>Similar marriage timeline horizon</Text>
          </View>
          <View style={styles.reasonRow}>
            <CheckCircle2 size={13} color={COLORS.privacyAccepted} />
            <Text style={styles.reasonText}>Complementary location & travel corridor</Text>
          </View>
          <View style={styles.reasonRow}>
            <CheckCircle2 size={13} color={COLORS.privacyAccepted} />
            <Text style={styles.reasonText}>Shared lifestyle & wellness values</Text>
          </View>
          <View style={styles.reasonRow}>
            <CheckCircle2 size={13} color={COLORS.privacyAccepted} />
            <Text style={styles.reasonText}>Balanced career & mutual independence aspirations</Text>
          </View>
        </View>
      </View>

      {/* Acceptance Meaning Notice */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeText}>
          Accepting only signifies: "I am comfortable continuing this introduction." Your full private details remain protected.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <View style={styles.primaryButtonsRow}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => onAccept(request.id)}
            activeOpacity={0.85}
          >
            <Check size={16} color="#0B0F14" strokeWidth={3} />
            <Text style={styles.acceptButtonText}>Accept</Text>
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
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderActive,
    gap: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  compatPill: {
    backgroundColor: 'rgba(229, 139, 88, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  compatPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  photoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  photoPlaceholderText: {
    fontSize: 9,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  profileDetails: {
    flex: 1,
    gap: 2,
  },
  nameAge: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  iconInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  introBox: {
    backgroundColor: 'rgba(18, 24, 32, 0.7)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  introBoxTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  introText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  routeContextCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderRadius: RADIUS.sm,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
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
    color: COLORS.routeAmber,
  },
  routeContextDetails: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  routeVenueNotice: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  reasonsCard: {
    backgroundColor: 'rgba(18, 24, 32, 0.85)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  reasonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reasonsHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
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
    fontSize: 11,
    color: COLORS.textPrimary,
  },
  noticeBox: {
    paddingVertical: 2,
  },
  noticeText: {
    fontSize: 10,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
  actionsContainer: {
    gap: SPACING.sm,
  },
  primaryButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  acceptButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0F14',
  },
  declineButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  declineButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
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
    color: COLORS.textMuted,
  },
  safetyMenu: {
    backgroundColor: COLORS.surfaceLight,
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 6,
    marginTop: 4,
  },
  safetyItem: {
    paddingVertical: 4,
  },
  safetyItemText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
