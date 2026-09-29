// MARGAM - Anonymous Match Card (Discovery Stage 1)
// Core Rule: Zero PII displayed before introduction request.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { AnonymousCandidate } from '../../types';
import {
  MapPin,
  CheckCircle2,
  Car,
  Clock,
  Send,
  EyeOff,
  Sparkles,
  Users,
} from 'lucide-react-native';

interface AnonymousMatchCardProps {
  candidate: AnonymousCandidate;
  onSendIntroduction: (candidate: AnonymousCandidate) => void;
  onClose?: () => void;
}

export const AnonymousMatchCard: React.FC<AnonymousMatchCardProps> = ({
  candidate,
  onSendIntroduction,
  onClose,
}) => {
  const isCluster = candidate.clusterCount && candidate.clusterCount > 1;

  return (
    <View style={styles.cardContainer}>
      {/* Anonymous Header */}
      <View style={styles.cardHeader}>
        <View style={styles.badgeRow}>
          <View style={styles.compatBadge}>
            <Text style={styles.compatRing}>💍</Text>
            <Text style={styles.compatPercent}>
              {candidate.compatibilityPercentage}% Match
            </Text>
          </View>

          {candidate.isAlongRoute && (
            <View style={styles.routeTag}>
              <Car size={12} color={COLORS.routeAmber} />
              <Text style={styles.routeTagText}>Along Your Route</Text>
            </View>
          )}

          <View style={styles.privacyLockBadge}>
            <EyeOff size={11} color={COLORS.textMuted} />
            <Text style={styles.privacyLockText}>Anonymous Discovery</Text>
          </View>
        </View>

        {onClose && (
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeBtn}>&times;</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Title & Approximate Zone */}
      <View style={styles.bodySection}>
        <Text style={styles.matchTitle}>
          {isCluster ? `${candidate.clusterCount} Compatible Profiles` : 'Compatible Match'}
        </Text>
        <Text style={styles.discoveryQuote}>
          {isCluster
            ? 'Multiple individuals matching your criteria are active in this corridor.'
            : 'Someone matching your marriage preferences is available in this area.'}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={13} color={COLORS.primary} />
            <Text style={styles.metaText}>{candidate.approximateZone}</Text>
          </View>

          <View style={styles.metaItem}>
            <Clock size={13} color={COLORS.routeCyan} />
            <Text style={styles.metaText}>{candidate.distanceLabel}</Text>
          </View>
        </View>
      </View>

      {/* Compatibility Reasoning Grid */}
      <View style={styles.reasoningSection}>
        <View style={styles.reasoningHeader}>
          <Sparkles size={13} color={COLORS.primary} />
          <Text style={styles.reasoningHeaderText}>Why Margam Suggests Compatibility</Text>
        </View>

        <View style={styles.reasonsList}>
          {candidate.compatibilityReasons.slice(0, 3).map((reason, idx) => (
            <View key={`reason_${idx}`} style={styles.reasonItem}>
              <CheckCircle2 size={13} color={COLORS.privacyAccepted} />
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Privacy Guarantee Note */}
      <View style={styles.privacyNoticeBox}>
        <Text style={styles.privacyNoticeText}>
          Personal details (name, photo, workplace, contact) remain strictly private until mutual introduction request.
        </Text>
      </View>

      {/* Primary Action Button */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onSendIntroduction(candidate)}
        activeOpacity={0.85}
      >
        <Send size={15} color="#0B0F14" />
        <Text style={styles.actionButtonText}>
          {isCluster ? 'Browse Anonymous Area' : 'Send Introduction Request'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.borderActive,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  compatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(229, 139, 88, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  compatRing: {
    fontSize: 12,
  },
  compatPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  routeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.routeAmber,
  },
  routeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.routeAmber,
  },
  privacyLockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  privacyLockText: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  closeBtn: {
    fontSize: 20,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
  bodySection: {
    marginVertical: SPACING.xs,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  discoveryQuote: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  reasoningSection: {
    backgroundColor: 'rgba(18, 24, 32, 0.65)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  reasoningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  reasoningHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reasonsList: {
    gap: 4,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flex: 1,
  },
  privacyNoticeBox: {
    paddingVertical: 4,
    marginBottom: SPACING.sm,
  },
  privacyNoticeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B0F14',
    letterSpacing: 0.5,
  },
});
